import { __, sprintf } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { STORE_NAME } from "../../../store";
import { InfoCircleIcon } from "../icons";
import { AI_PROVIDER_CONFIG, isProviderConnected, resolvePrimaryProvider } from "./aiProviderConfig";
import AiProviderSettings from "./AiProviderSettings";

/**
 * Settings → AI Configuration: one card per AI provider, and the connection
 * form of the selected one below. Generate FAQs with AI opens on the Primary
 * and lists every other connected provider as a backup, so a lone connected
 * provider gets a nudge to add one.
 *
 * @return {JSX.Element} The tab.
 */
const AiConfiguration = () => {
	const settings = useSelect((select) => select(STORE_NAME).getDashboardSettings(), []);
	const dashboardInfo = useSelect((select) => select(STORE_NAME).getDashboardInfo(), []);
	const { aiConnectors, aiProviderOrder } = dashboardInfo || {};

	const isConnected = (slug) => isProviderConnected(settings, aiConnectors, slug);
	const primarySlug = resolvePrimaryProvider(settings, aiConnectors, aiProviderOrder);
	const connectedCount = AI_PROVIDER_CONFIG.filter(({ slug }) => isConnected(slug)).length;
	const primaryProvider = AI_PROVIDER_CONFIG.find(({ slug }) => slug === primarySlug);

	const [activeSlug, setActiveSlug] = useState(() => primarySlug || AI_PROVIDER_CONFIG[0].slug);
	const activeProvider = AI_PROVIDER_CONFIG.find(({ slug }) => slug === activeSlug) || AI_PROVIDER_CONFIG[0];

	return (
		<div className="sp-eap-ai-config sp-d-flex sp-flex-col">
			<div className="eap-dashboard-page-header sp-d-flex sp-justify-between sp-align-end sp-gap-12px">
				<div className="sp-d-flex sp-flex-col sp-gap-10px">
					<span className="eap-dashboard-page-header__label">
						{__("AI Providers", "easy-accordion-free")}
					</span>
					<span className="eap-dashboard-page-header__desc">
						{__("Connect the AI providers that power Generate FAQs with AI.", "easy-accordion-free")}
					</span>
				</div>
				<span className="sp-eap-ai-config__count">
					{sprintf(
						/* translators: 1: number of connected AI providers, 2: number of AI providers */
						__("%1$d of %2$d ready", "easy-accordion-free"),
						connectedCount,
						AI_PROVIDER_CONFIG.length
					)}
				</span>
			</div>
			<div className="sp-eap-ai-config__providers sp-d-grid">
				{AI_PROVIDER_CONFIG.map(({ slug, label, Icon }) => {
					const isActive = slug === activeProvider.slug;
					const connected = isConnected(slug);
					return (
						<button
							key={slug}
							type="button"
							aria-pressed={isActive}
							className={`sp-eap-ai-config__provider sp-d-flex sp-flex-col sp-align-start sp-cursor-pointer${isActive ? " is-active" : ""}`}
							onClick={() => setActiveSlug(slug)}
						>
							<span className="sp-eap-ai-config__provider-icon sp-d-flex sp-align-center sp-justify-center">
								<Icon />
							</span>
							<span className="sp-eap-ai-config__provider-label">{label}</span>
							<span
								className={`sp-eap-ai-config__provider-status sp-d-flex sp-align-center sp-gap-6px${connected ? " is-connected" : ""}`}
							>
								{connected
									? __("Connected", "easy-accordion-free")
									: __("Not set up", "easy-accordion-free")}
							</span>
							{slug === primarySlug && (
								<span className="sp-eap-ai-config__provider-badge">
									{__("Primary", "easy-accordion-free")}
								</span>
							)}
						</button>
					);
				})}
			</div>
			{1 === connectedCount && primaryProvider && (
				<p className="sp-eap-ai-config__backup-hint sp-d-flex sp-align-center sp-gap-6px">
					<InfoCircleIcon />
					{sprintf(
						/* translators: %s: AI provider name */
						__(
							"Add a backup provider so Generate FAQs with AI keeps working if %s reaches its limit.",
							"easy-accordion-free"
						),
						primaryProvider.name
					)}
				</p>
			)}
			<AiProviderSettings
				key={activeProvider.slug}
				provider={activeProvider}
				isConnected={isConnected(activeProvider.slug)}
				isPrimary={activeProvider.slug === primarySlug}
			/>
		</div>
	);
};

export default AiConfiguration;
