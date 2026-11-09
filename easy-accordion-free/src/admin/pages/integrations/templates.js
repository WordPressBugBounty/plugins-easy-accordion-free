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
