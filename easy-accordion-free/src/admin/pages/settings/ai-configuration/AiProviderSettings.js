import { __, sprintf } from "@wordpress/i18n";
import { useEffect, useRef, useState, createInterpolateElement } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { SaveAndReset } from "../template-parts";
import { STORE_NAME } from "../../../store";
import { apiRest } from "../../../functions/apiRest";
import { toastSuccessMsg } from "../../../functions";
import { ArrowRight } from "../../../icons";
import { NoticeDismissIcon, WordPressLogoIcon } from "../icons";
import { resolvePrimaryProvider } from "./aiProviderConfig";

// Connection form for the provider selected on the AI Configuration tab. Saves
// integrations.<slug>.{api_key, workspace_id} by MERGING into the dashboard
// settings, and always writes is_active: true — the tab has no on/off switch,
// so saving a provider is what turns it on (AI::is_connected() still honours a
// stored `false`). A non-empty key is checked with /ai-verify first; a rejected
// key saves nothing. The saved key arrives masked (EAP_AI_Settings) and is
// shown read-only; Replace swaps it for an empty field, Remove key clears and
// saves at once. Sending the mask back means "keep the stored key". Every save
// also writes ai_primary_provider as resolvePrimaryProvider() reads the result,
// so the first provider saved becomes the Primary and removing the Primary's
// key promotes the next connected one; Make primary saves that setting alone.
// The model is not chosen here: the stored one (or the provider default) is
// kept, and Generate FAQs with AI picks a model per request.
// When WordPress Connectors already holds a key for this provider, the key form
// is replaced by a connected panel: the connector serves the requests, and a key
// saved here stays as the fallback ("Remove the key stored here" drops it). A
// provider only registered there — not connected — shows a dismissible pointer
// to Settings → Connectors instead; dismissing it sets
// ai_connector_notice_dismissed for every provider.
const AiProviderSettings = ({ provider, isConnected, isPrimary }) => {
	const { slug, name, defaultModel, keyUrl, workspaceField } = provider;
	const settings = useSelect((select) => select(STORE_NAME).getDashboardSettings(), []);
	const dashboardInfo = useSelect((select) => select(STORE_NAME).getDashboardInfo(), []);
	const { aiConnectors, aiProviderOrder, connectorsUrl } = dashboardInfo || {};
	const { saveSettings } = useDispatch(STORE_NAME);
	const connector = aiConnectors?.[slug] || {};

	const saved = settings?.integrations?.[slug] || {};
	const savedKey = saved.api_key || "";
	const savedModel = saved.model || defaultModel;
	const savedWorkspaceId = saved.workspace_id || "";
	const isSwitchedOff = false === saved.is_active && ("" !== savedKey || connector.connected);

	const [apiKey, setApiKey] = useState(savedKey);
	const [workspaceId, setWorkspaceId] = useState(savedWorkspaceId);
	const [isVerifying, setIsVerifying] = useState(false);
	const [error, setError] = useState("");
	const [isReplacing, setIsReplacing] = useState(false);
	const [isSaving, setIsSaving] = useState(false);
	const [isNoticeDismissed, setIsNoticeDismissed] = useState(false);
	const [saveCount, setSaveCount] = useState(0);
	const keyInputRef = useRef(null);
	const replaceButtonRef = useRef(null);
	const isFirstRender = useRef(true);
	const isRemovingKey = useRef(false);

	// After a save the store holds the key masked, so the field locks onto it again. `saveCount`
	// covers a save whose mask did not change (the same key saved twice).
	useEffect(() => {
		setApiKey(savedKey);
		setWorkspaceId(savedWorkspaceId);
		setIsReplacing(false);
		if (isRemovingKey.current && "" === savedKey) {
			isRemovingKey.current = false;
			keyInputRef.current?.focus();
		}
	}, [savedKey, savedWorkspaceId, saveCount]);

	// Keep focus with the control that replaced the one just clicked.
	useEffect(() => {
		if (isFirstRender.current) {
			isFirstRender.current = false;
			return;
		}
		if (isReplacing) {
			keyInputRef.current?.focus();
		} else {
			replaceButtonRef.current?.focus();
		}
	}, [isReplacing]);

	const isKeyLocked = "" !== savedKey && !isReplacing;
	const showConnectorNotice =
		connector.registered &&
		!connector.connected &&
		connectorsUrl &&
		!isNoticeDismissed &&
		!settings?.ai_connector_notice_dismissed;

	const startReplacing = () => {
		setApiKey("");
		setError("");
		setIsReplacing(true);
	};

	const cancelReplacing = () => {
		setApiKey(savedKey);
		setError("");
		setIsReplacing(false);
	};

	const isChanged = isSwitchedOff || apiKey !== savedKey || workspaceId !== savedWorkspaceId;
	const hasKey = apiKey.trim() !== "";

	const persist = async (values, primary = settings?.ai_primary_provider || "") => {
		const next = {
			...settings,
			ai_primary_provider: primary,
			integrations: {
				...(settings?.integrations || {}),
				[slug]: {
					...(settings?.integrations?.[slug] || {}),
					is_active: true,
					...values,
				},
			},
		};
		setIsSaving(true);
		const isSaved = await saveSettings({
			dashboardSettings: {
				...next,
				ai_primary_provider: resolvePrimaryProvider(next, aiConnectors, aiProviderOrder),
			},
		});
		setIsSaving(false);
		return isSaved;
	};

	const handleSave = async () => {
		setError("");
		if (hasKey) {
			setIsVerifying(true);
			try {
				await apiRest("ai-verify", {
					method: "POST",
					data: {
						provider: slug,
						api_key: apiKey,
						model: savedModel,
						workspace_id: workspaceField ? workspaceId : "",
					},
				});
			} catch (verifyError) {
				setError(verifyError?.message || __("The API key could not be verified.", "easy-accordion-free"));
				setIsVerifying(false);
				return;
			}
			setIsVerifying(false);
		}

		const isSaved = await persist({
			api_key: apiKey,
			...(workspaceField ? { workspace_id: workspaceId } : {}),
		});
		if (!isSaved) {
			setError(__("The settings could not be saved. Please try again.", "easy-accordion-free"));
			return;
		}
		setSaveCount((count) => count + 1);
		toastSuccessMsg(
			hasKey
				? __("API key verified and saved.", "easy-accordion-free")
				: __("Settings saved.", "easy-accordion-free")
		);
	};

	const handleReset = async () => {
		setError("");
		const isSaved = await persist({
			api_key: "",
			model: defaultModel,
			...(workspaceField ? { workspace_id: "" } : {}),
		});
		if (!isSaved) {
			setError(__("The settings could not be saved. Please try again.", "easy-accordion-free"));
			return;
		}
		setSaveCount((count) => count + 1);
		toastSuccessMsg(__("Settings reset.", "easy-accordion-free"));
	};

	const handleRemoveKey = async () => {
		/* translators: %s: AI provider name */
		const message = sprintf(__("Remove the saved %s API key?", "easy-accordion-free"), name);
		// eslint-disable-next-line no-alert
		if (!window.confirm(message)) {
			return;
		}
		setError("");
		isRemovingKey.current = true;
		const isSaved = await persist({ api_key: "" });
		if (!isSaved) {
			isRemovingKey.current = false;
			setError(__("The settings could not be saved. Please try again.", "easy-accordion-free"));
			return;
		}
		setSaveCount((count) => count + 1);
		toastSuccessMsg(__("API key removed.", "easy-accordion-free"));
	};

	const handleMakePrimary = async () => {
		setError("");
		const isSaved = await persist({}, slug);
		if (!isSaved) {
			setError(__("The settings could not be saved. Please try again.", "easy-accordion-free"));
			return;
		}
		toastSuccessMsg(
			sprintf(
				/* translators: %s: AI provider name */
				__("%s is now the primary provider.", "easy-accordion-free"),
				name
			)
		);
	};

	const dismissConnectorNotice = async () => {
		setIsNoticeDismissed(true);
		const isSaved = await saveSettings({ dashboardSettings: { ...settings, ai_connector_notice_dismissed: true } });
		if (!isSaved) {
			setIsNoticeDismissed(false);
		}
	};

	return (
		<div className="sp-eap-ai-config__form sp-d-flex sp-flex-col">
			{showConnectorNotice && (
				<div className="sp-eap-ai-config__connector sp-d-flex sp-align-center sp-gap-12px">
					<span className="sp-eap-ai-config__connector-icon sp-d-flex">
						<WordPressLogoIcon />
					</span>
					<p className="sp-eap-ai-config__connector-text">
						{createInterpolateElement(
							__(
								"Already use this provider elsewhere on your site? Add its key once under WordPress <link>Settings → Connectors</link> instead of here.",
								"easy-accordion-free"
							),
							{
								// eslint-disable-next-line jsx-a11y/anchor-has-content -- content supplied by createInterpolateElement
								link: <a href={connectorsUrl} target="_blank" rel="noreferrer" />,
							}
						)}
					</p>
					<button
						type="button"
						className="sp-eap-ai-config__connector-dismiss sp-d-flex sp-align-center sp-justify-center sp-cursor-pointer"
						onClick={dismissConnectorNotice}
						aria-label={__("Dismiss this notice", "easy-accordion-free")}
					>
						<NoticeDismissIcon />
					</button>
				</div>
			)}
			{isSwitchedOff && (
				<div className="sp-eap-ai-config__notice sp-d-block">
					{__("This provider is switched off. Save to turn it back on.", "easy-accordion-free")}
				</div>
			)}
			{connector.connected ? (
				<div className="sp-eap-ai-config__field">
					<span className="sp-eap-ai-config__label sp-d-flex">{__("API Key", "easy-accordion-free")}</span>
					<div className="sp-eap-ai-config__connected">
						<span className="sp-eap-ai-config__connected-badge">
							✓ {__("Connected via WordPress", "easy-accordion-free")}
						</span>
						<p className="sp-eap-ai-config__connected-text">
							{"" !== savedKey
								? __(
										"Easy Accordion uses that connection. The key saved here stays as a fallback for when the connection is unavailable.",
										"easy-accordion-free"
									)
								: __(
										"This provider is already configured in WordPress Connectors, so there is no key to enter here.",
										"easy-accordion-free"
									)}
						</p>
					</div>
					{(connectorsUrl || (isConnected && !isPrimary) || "" !== savedKey) && (
						<div className="sp-eap-ai-config__key-meta sp-d-flex sp-justify-between sp-align-center sp-gap-12px">
							{connectorsUrl && (
								<a
									className="sp-eap-ai-config__key-link sp-d-flex sp-align-center sp-gap-4px"
									href={connectorsUrl}
									target="_blank"
									rel="noreferrer"
								>
									{__("Manage in WordPress Connectors", "easy-accordion-free")}
									<ArrowRight />
								</a>
							)}
							<div className="sp-eap-ai-config__key-actions sp-d-flex sp-align-center sp-gap-12px">
								{isConnected && !isPrimary && (
									<button
										type="button"
										className="sp-eap-ai-config__action sp-cursor-pointer"
										onClick={handleMakePrimary}
										disabled={isSaving}
									>
										{__("Make primary", "easy-accordion-free")}
									</button>
								)}
								{"" !== savedKey && (
									<button
										type="button"
										className="sp-eap-ai-config__action is-danger sp-cursor-pointer"
										onClick={handleRemoveKey}
										disabled={isSaving}
									>
										{__("Remove the key stored here", "easy-accordion-free")}
									</button>
								)}
							</div>
						</div>
					)}
				</div>
			) : (
				<>
					<div className="sp-eap-ai-config__field">
						{isKeyLocked ? (
							<span className="sp-eap-ai-config__label sp-d-flex">
								{__("API Key", "easy-accordion-free")}
							</span>
						) : (
							<label className="sp-eap-ai-config__label sp-d-flex" htmlFor={`sp-eap-ai-key-${slug}`}>
								{__("API Key", "easy-accordion-free")}
							</label>
						)}
						{isKeyLocked ? (
							<div className="sp-eap-ai-config__key-locked sp-d-flex sp-align-center sp-gap-8px">
								<span className="sp-eap-ai-config__key-masked" aria-hidden="true">
									{savedKey.replace(/\*/g, "•")}
								</span>
								<span className="screen-reader-text">
									{__("A saved API key is hidden.", "easy-accordion-free")}
								</span>
								{isConnected && (
									<span className="sp-eap-ai-config__key-status sp-d-flex sp-align-center sp-gap-6px">
										{__("Connected", "easy-accordion-free")}
									</span>
								)}
							</div>
						) : (
							<div className="sp-d-flex sp-align-center sp-gap-8px">
								<input
									ref={keyInputRef}
									id={`sp-eap-ai-key-${slug}`}
									className="sp-eap-ai-config__input"
									type="text"
									placeholder={__("Enter your API key", "easy-accordion-free")}
									value={apiKey}
									onChange={(event) => {
										setApiKey(event.target.value);
										setError("");
									}}
									autoComplete="off"
									spellCheck="false"
								/>
								{isReplacing && (
									<button
										type="button"
										className="sp-eap-ai-config__key-btn sp-cursor-pointer"
										onClick={cancelReplacing}
									>
										{__("Cancel", "easy-accordion-free")}
									</button>
								)}
							</div>
						)}
						{error && <span className="sp-eap-ai-config__error sp-d-block">{error}</span>}
						<div className="sp-eap-ai-config__key-meta sp-d-flex sp-justify-between sp-align-center sp-gap-12px">
							<a
								className="sp-eap-ai-config__key-link sp-d-flex sp-align-center sp-gap-4px"
								href={keyUrl}
								target="_blank"
								rel="noreferrer"
							>
								{sprintf(
									/* translators: %s: AI provider name */
									__("Get your %s API key", "easy-accordion-free"),
									name
								)}
								<ArrowRight />
							</a>
							{(isKeyLocked || (isConnected && !isPrimary)) && (
								<div className="sp-eap-ai-config__key-actions sp-d-flex sp-align-center sp-gap-12px">
									{isConnected && !isPrimary && (
										<button
											type="button"
											className="sp-eap-ai-config__action sp-cursor-pointer"
											onClick={handleMakePrimary}
											disabled={isSaving}
										>
											{__("Make primary", "easy-accordion-free")}
										</button>
									)}
									{isKeyLocked && (
										<>
											<button
												ref={replaceButtonRef}
												type="button"
												className="sp-eap-ai-config__action sp-cursor-pointer"
												onClick={startReplacing}
												disabled={isSaving}
												aria-label={__("Replace API key", "easy-accordion-free")}
											>
												{__("Replace key", "easy-accordion-free")}
											</button>
											<button
												type="button"
												className="sp-eap-ai-config__action is-danger sp-cursor-pointer"
												onClick={handleRemoveKey}
												disabled={isSaving}
											>
												{__("Remove key", "easy-accordion-free")}
											</button>
										</>
									)}
								</div>
							)}
						</div>
					</div>
					{workspaceField && (
						<div className="sp-eap-ai-config__field">
							<label
								className="sp-eap-ai-config__label sp-d-flex"
								htmlFor={`sp-eap-ai-workspace-${slug}`}
							>
								{workspaceField.label}
							</label>
							<input
								id={`sp-eap-ai-workspace-${slug}`}
								className="sp-eap-ai-config__input"
								type="text"
								placeholder={workspaceField.placeholder}
								value={workspaceId}
								onChange={(event) => {
									setWorkspaceId(event.target.value);
									setError("");
								}}
							/>
							<span className="sp-eap-ai-config__help sp-d-block">
								{workspaceField.help}{" "}
								<a href={workspaceField.link.url} target="_blank" rel="noreferrer">
									{workspaceField.link.label}
								</a>
							</span>
						</div>
					)}
				</>
			)}
			{(!connector.connected || isSwitchedOff) && (
				<SaveAndReset
					onSave={handleSave}
					onReset={handleReset}
					isChanged={isChanged}
					isBusy={isVerifying || isSaving}
					busyLabel={
						isVerifying ? __("Verifying…", "easy-accordion-free") : __("Saving…", "easy-accordion-free")
					}
					resetLabel={__("Reset to Default", "easy-accordion-free")}
				/>
			)}
		</div>
	);
};

export default AiProviderSettings;
