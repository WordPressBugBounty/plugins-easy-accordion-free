import { __ } from "@wordpress/i18n";
import { memo } from "@wordpress/element";

// recaptcha popup.
export const ReCaptchaPopup = memo(({ settings, updateSettingsOption }) => {
	const handleChange = (event) => {
		const { name, value } = event.target;
		updateSettingsOption(name, value);
	};

	return (
		<div className="sp-eap-integrations__modal-recaptcha-page">
			<span className="sp-eap-recaptcha-dashboard-links sp-d-block">
				<a href="https://cloud.google.com/security/products/recaptcha" target="_blank" rel="noreferrer">
					reCAPTCHA{" "}
				</a>
				is a free anti-spam service of Google that protects your website from spam and abuse.
				<a href="https://www.google.com/recaptcha/admin/site/745648899#list" target="_blank" rel="noreferrer">
					{" "}
					Get your API Keys.
				</a>
			</span>
			<div className="sp-eap-integrations__modal-content-wrapper sp-d-flex sp-flex-col">
				<div className="sp-eap-integrations__modal-field">
					<h4 className="sp-eap-integrations__modal-input-label">reCAPTCHA v2</h4>
					<div className="sp-eap-integrations__modal-field-row sp-d-flex sp-align-center">
						<div className="sp-eap-site-secret-key-wrapper">
							<span className="sp-eap-site-secret-key-label">
								{__("Site Key v2", "easy-accordion-free")}
							</span>
							<input
								className="sp-eap-integrations__modal-input"
								type="text"
								placeholder="Enter site key"
								name="site_key_v2"
								value={settings?.site_key_v2}
								onChange={handleChange}
							/>
						</div>
						<div className="sp-eap-site-secret-key-wrapper">
							<span className="sp-eap-site-secret-key-label">
								{__("Secret Key v2", "easy-accordion-free")}
							</span>
							<input
								className="sp-eap-integrations__modal-input"
								type="text"
								placeholder="Enter secret key"
								name="secret_key_v2"
								value={settings?.secret_key_v2}
								onChange={handleChange}
							/>
						</div>
					</div>
				</div>
				<div className="sp-eap-integrations__modal-field">
					<h4 className="sp-eap-integrations__modal-input-label">reCAPTCHA v3</h4>
					<div className="sp-eap-integrations__modal-field-row sp-d-flex sp-align-center">
						<div className="sp-eap-site-secret-key-wrapper">
							<span className="sp-eap-site-secret-key-label">
								{__("Site Key v3", "easy-accordion-free")}
							</span>
							<input
								className="sp-eap-integrations__modal-input"
								type="text"
								placeholder="Enter site key"
								name="site_key_v3"
								value={settings?.site_key_v3}
								onChange={handleChange}
							/>
						</div>
						<div className="sp-eap-site-secret-key-wrapper">
							<span className="sp-eap-site-secret-key-label">
								{__("Secret Key v3", "easy-accordion-free")}
							</span>
							<input
								className="sp-eap-integrations__modal-input"
								type="text"
								placeholder="Enter secret key"
								name="secret_key_v3"
								value={settings?.secret_key_v3}
								onChange={handleChange}
							/>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
});

// chat gpt api key popup.
const popupData = {
	chatgpt: {
		models: [
			{ label: "GPT-5", value: "gpt-5" },
			{ label: "GPT-5 Mini", value: "gpt-5-mini" },
			{ label: "GPT-4.1", value: "gpt-4.1" },
			{ label: "GPT-4.1 Mini", value: "gpt-4.1-mini" },
			{ label: "GPT-5.4", value: "gpt-5.4" },
			{ label: "GPT-5.4 Mini", value: "gpt-5.4-mini" },
			{ label: "GPT-5.4 Nano", value: "gpt-5.4-nano" },
			{ label: "GPT-4o Mini", value: "gpt-4o-mini" },
			{ label: "o3 Mini", value: "o3-mini" },
		],
		modelsDocLink: "https://developers.openai.com/api/docs/models",
		modelFieldHelp: "Choose your AI model (e.g., ChatGPT-4o).",
		apiKeyDocLink: "https://platform.openai.com/settings/organization/api-keys",
		apiKeyFieldHelp: "Enter your OpenAI API key. Keep it private & secure.",
	},
	gemini: {
		models: [
			// Gemini 3.1 Series.
			{ label: "Gemini 3.1 Flash-Lite", value: "gemini-3.1-flash-lite-preview" },
			{ label: "Gemini 3.1 Pro (Preview)", value: "gemini-3.1-pro-preview" },
			{ label: "Gemini 3.1 Flash", value: "gemini-3.1-flash" },
			// Gemini 2.5 Series.
			{ label: "Gemini 2.5 Pro", value: "gemini-2.5-pro" },
			{ label: "Gemini 2.5 Flash", value: "gemini-2.5-flash" },
			// Gemini 1.5 Series.
			{ label: "Gemini 1.5 Pro", value: "gemini-1.5-pro" },
			{ label: "Gemini 1.5 Flash", value: "gemini-1.5-flash" },
			{ label: "Gemini 1.5 Flash-8B", value: "gemini-1.5-flash-8b" },
		],
		modelsDocLink: "https://ai.google.dev/gemini-api/docs/models",
		modelFieldHelp: "Choose your AI model (e.g., Gemini 3.1 Flash Lite).",
		apiKeyDocLink: "https://ai.google.dev/gemini-api/docs/api-key",
		apiKeyFieldHelp: "Enter your Gemini API key. Keep it private & secure.",
	},
};

export const AISettingsModal = memo(({ openedPopup, settings, updateSettingsOption }) => {
	const handleChange = (event) => {
		const { name, value } = event.target;
		updateSettingsOption(name, value);
	};
	const { models, modelsDocLink, modelFieldHelp, apiKeyDocLink, apiKeyFieldHelp } = popupData[openedPopup];

	return (
		<div className="sp-eap-integrations__modal-chatgpt-api-key-page">
			<div className="sp-eap-integrations__modal-content-wrapper sp-d-flex sp-flex-col">
				<div className="sp-eap-integrations__modal-field sp-d-flex sp-align-center sp-justify-between">
					<h4 className="sp-eap-integrations__modal-input-label">AI Model</h4>
					<div className="sp-eap-integrations__modal-field-wrapper sp-d-flex sp-flex-col sp-align-start sp-gap-4px">
						<select
							className="sp-eap-integrations__modal-input"
							name="model"
							value={settings?.model}
							onChange={handleChange}
						>
							{models?.map(({ label, value }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
						<span className="sp-eap-integration-input-help-text sp-d-flex sp-align-center sp-gap-4px">
							{modelFieldHelp}
							<a href={modelsDocLink} target="_blank" rel="noreferrer">
								Check Models
							</a>
						</span>
					</div>
				</div>
				<div className="sp-eap-integrations__modal-field sp-d-flex sp-align-center sp-justify-between">
					<h4 className="sp-eap-integrations__modal-input-label">API Key</h4>
					<div className="sp-eap-integrations__modal-field-wrapper sp-d-flex sp-flex-col sp-align-start sp-gap-4px">
						<input
							className="sp-eap-integrations__modal-input"
							type="text"
							placeholder="Place Your API Key"
							name="api_key"
							value={settings?.api_key}
							onChange={handleChange}
						/>
						<span className="sp-eap-integration-input-help-text sp-d-flex sp-align-center sp-gap-4px">
							{apiKeyFieldHelp}
							<a href={apiKeyDocLink} target="_blank" rel="noreferrer">
								Get your key
							</a>
						</span>
					</div>
				</div>
				<div className="sp-eap-integrations__modal-field sp-d-flex sp-align-center sp-justify-between">
					<h4 className="sp-eap-integrations__modal-input-label">Set Max Tokens</h4>
					<div className="sp-eap-integrations__modal-field-wrapper sp-d-flex sp-flex-col sp-align-start sp-gap-4px">
						<input
							className="sp-eap-integrations__modal-input max-token"
							type="number"
							name="max_token"
							value={settings?.max_token}
							onChange={handleChange}
						/>
						<span className="sp-eap-integration-input-help-text">
							FAQs will be generated within the token limit you set.
						</span>
					</div>
				</div>
			</div>
		</div>
	);
});
