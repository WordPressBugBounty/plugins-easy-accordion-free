import { __ } from "@wordpress/i18n";
import { Popover, Modal } from "@wordpress/components";
import { Arrow } from "../../icons";

export const ConfirmationPopup = ({
	onClose,
	onConfirm,
	message = __("Are You Sure?", "easy-accordion-free"),
	confirmLabel = __("Yes", "easy-accordion-free"),
	cancelLabel = __("Cancel", "easy-accordion-free"),
}) => {
	return (
		<Popover className="sp-eap-cache-delete-popup" position="middle center" onClose={onClose}>
			<span>{message}</span>

			<div className="sp-eap-cache-delete-buttons">
				<button className="cancel" onClick={onClose}>
					{cancelLabel}
				</button>

				<button className="ok" onClick={onConfirm}>
					{confirmLabel}
				</button>
			</div>
		</Popover>
	);
};

export const SaveAndReset = ({ onSave, onReset, isChanged }) => {
	return (
		<div className="sp-eap-settings-save-wrapper sp-d-flex sp-align-center sp-justify-start sp-gap-10px">
			<button
				className={`sp-eap-settings-save-btn sp-d-flex sp-align-center sp-gap-6px sp-cursor-pointer${isChanged ? " active" : ""}`}
				onClick={onSave}
			>
				<img
					src={`${sp_eab_admin_dashboard_localize?.pluginUrl}/admin/views/models/assets/images/save-icon.svg`}
					alt={__("Save Icon", "easy-accordion-free")}
				/>
				{__("Save Changes", "easy-accordion-free")}
			</button>
			<button
				className="sp-eap-settings-reset-btn sp-d-flex sp-align-center sp-gap-6px sp-cursor-pointer"
				onClick={() => {
					// eslint-disable-next-line no-alert
					const confirmReset = window.confirm(__("Are you sure you want to reset?", "easy-accordion-free"));
					if (confirmReset) {
						onReset();
					}
				}}
			>
				<img
					src={`${sp_eab_admin_dashboard_localize?.pluginUrl}/admin/views/models/assets/images/reset-icon.svg`}
					alt={__("Reset Icon", "easy-accordion-free")}
				/>
				{__("Reset", "easy-accordion-free")}
			</button>
		</div>
	);
};

export const InfoText = ({ text }) => {
	return (
		<span className="sp-eap-settings-info">
			<img
				src={`${sp_eab_admin_dashboard_localize?.pluginUrl}/admin/views/models/assets/images/info.svg`}
				alt={__("Info Text Icon", "easy-accordion-free")}
			/>
			<span className="sp-eap-settings-info-text">{text}</span>
		</span>
	);
};

export const UserDataInfoModal = ({ closeModal }) => {
	return (
		<Modal
			title={__("What We Collect?", "easy-accordion-free")}
			onRequestClose={closeModal}
			className="sp-eap-setup-page-modal"
		>
			<hr />
			<p className="modal-description">
				{__(
					"We collect only non-sensitive diagnostic data and basic plugin usage information. This may include:",
					"easy-accordion-free"
				)}
			</p>
			<ul>
				<li className="modal-description">{__("WordPress & PHP version", "easy-accordion-free")}</li>
				<li className="modal-description">{__("Active theme and plugins", "easy-accordion-free")}</li>
				<li className="modal-description">{__("General system details", "easy-accordion-free")}</li>
				<li className="modal-description">
					{__("Email address only for sending helpful updates or optional offers.", "easy-accordion-free")}
				</li>
			</ul>
			<p className="modal-description">
				{__(
					"This information helps us improve performance, fix issues faster, and ensure Location Weather stays compatible with the popular plugins and themes.",
					"easy-accordion-free"
				)}
			</p>
			<p className="modal-description">
				{__("We", "easy-accordion-free")}
				<b>{__("do not collect sensitive personal data,", "easy-accordion-free")}</b>
				{__("and", "easy-accordion-free")}
				<b>{__("never send spam", "easy-accordion-free")}</b>
				{__("promise.", "easy-accordion-free")}
			</p>
			<p className="modal-description">
				<b>{__("Your privacy comes first.", "easy-accordion-free")}</b>
			</p>
			<a
				href="https://easyaccordion.io/information-we-collect/"
				target="_blank"
				rel="noreferrer"
				className="modal-description"
			>
				{__("Learn More", "easy-accordion-free")}
				<Arrow />
			</a>
		</Modal>
	);
};
