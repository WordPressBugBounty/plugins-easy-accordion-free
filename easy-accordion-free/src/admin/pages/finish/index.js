import axios from "axios";
import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { CheckboxControl, Spinner } from "@wordpress/components";
import { UserDataInfoModal } from "../../setup-wizard/template-parts";
import { toastErrorMsg } from "../../functions";
import { ProIconLight } from "../../icons";
import { RightArrow } from "../saved-templates/icons";

const FinishPage = () => {
	const phpToJsBool = {
		0: false,
		1: true,
	};
	const initialConsent =
		sp_eab_admin_dashboard_localize?.eab_user_consent === "undefined"
			? true
			: phpToJsBool[sp_eab_admin_dashboard_localize?.eab_user_consent];
	const [shareData, setShareData] = useState(initialConsent);
	const [isOpenModal, setOpenModal] = useState(false);
	const [isLoading, setIsLoading] = useState(false);

	const saveUserData = async () => {
		setIsLoading(true);
		try {
			const queryData = { shareData };
			const formData = new FormData();
			formData.append("action", "sp_eap_get_user_consent");
			formData.append("nonce", sp_eab_admin_dashboard_localize.nonce);
			formData.append("queryData", JSON.stringify(queryData));
			await axios.post(ajaxurl, formData);
			return { success: true };
		} catch (error) {
			toastErrorMsg(__("Something Went Wrong", "easy-accordion-free"));
			return { success: false, error };
		} finally {
			setIsLoading(false);
		}
	};

	const handleFinishSetupWizard = async () => {
		const result = await saveUserData();
		if (result && result.success) {
			window.location.href = `${sp_eab_admin_dashboard_localize?.homeUrl}wp-admin/admin.php?page=eap_dashboard`;
		}
	};

	return (
		<div className="sp-eap-setup-finish-page sp-d-flex sp-flex-col sp-align-center sp-justify-center">
			<img
				src={`${sp_eab_admin_dashboard_localize?.pluginUrl}/admin/img/setup-wizard/congratulations.svg`}
				alt="Congratulations"
			/>
			<h3 className="sp-eap-setup-page-title">
				{__("You’re Ready to Create FAQs & Accordions!", "easy-accordion-free")}
			</h3>
			<p className="sp-eap-setup-page-desc" style={{ width: "636px", textAlign: "center" }}>
				{__(
					"Start building beautiful FAQs and dynamic accordions with Easy Accordion—no coding, just a smooth and efficient experience.",
					"easy-accordion-free"
				)}
			</p>
			<button
				className="sp-eap-setup-wizard-nav-btn next-btn eap-setup-wizard-finish"
				onClick={handleFinishSetupWizard}
				disabled={isLoading}
				aria-busy={isLoading}
			>
				{isLoading ? (
					<>
						<Spinner /> {__("Finishing…", "easy-accordion-free")}
					</>
				) : (
					__("Finish & Let’s Get Started", "easy-accordion-free")
				)}
			</button>
			<div className="sp-eap-setup-finish-page-banner sp-d-flex sp-align-center sp-justify-between">
				<div className="sp-eap-setup-finish-page-banner-left sp-d-flex sp-flex-col">
					<h3 className="sp-eap-setup-page-title">
						{__("Easily Create Beautiful FAQs and Accordions for Your Website", "easy-accordion-free")}
					</h3>
					<p className="sp-eap-setup-page-desc">
						<span className="sp-d-flex sp-align-center sp-gap-4px">
							{__("Trusted by", "easy-accordion-free")}
							<b>100,000+</b>
							{__("users — Easy Accordion helps you", "easy-accordion-free")}
						</span>
						<span className="sp-d-block">
							{__("create clean, flexible layouts effortlessly.", "easy-accordion-free")}
						</span>
					</p>
					<div className="sp-eap-setup-wizard-button sp-d-flex sp-align-center sp-gap-8px">
						<a
							className="sp-eap-setup-wizard-nav-btn prev-btn eab-pro-btn"
							href="https://easyaccordion.io/pricing/?ref=1"
							target="_blank"
							rel="noreferrer"
						>
							<ProIconLight />
							{__("Upgrade to Pro!", "easy-accordion-free")}
						</a>
						<a
							className="sp-eap-setup-wizard-nav-btn prev-btn explore-button"
							href="https://easyaccordion.io/patterns/"
							target="_blank"
							rel="noreferrer"
						>
							{__("Explore All Patterns", "easy-accordion-free")}
							<RightArrow />
						</a>
					</div>
				</div>
				<img
					src={`${sp_eab_admin_dashboard_localize?.pluginUrl}/admin/img/setup-wizard/finish-page-banner.png`}
					alt="finish-page-banner"
				/>
			</div>
			<div className="spl-weather-checkbox-component-wrapper sp-d-flex sp-align-center">
				<p className="sp-eap-setup-page-desc sp-d-flex sp-align-center sp-gap-4px">
					{__(
						"Help us improve Easy Accordion and get useful tips by sharing non-sensitive diagnostic data. See",
						"easy-accordion-free"
					)}
					<span
						className="sp-eap-modal-btn"
						style={{
							fontWeight: "600",
							textDecoration: "underline",
						}}
						onClick={() => setOpenModal(true)}
					>
						{__("what we collect.", "easy-accordion-free")}
					</span>
				</p>
				<CheckboxControl
					checked={shareData}
					onChange={() => setShareData(!shareData)}
					__nextHasNoMarginBottom
				/>
			</div>
			{isOpenModal && <UserDataInfoModal closeModal={() => setOpenModal(false)} />}
		</div>
	);
};

export default FinishPage;
