import { __ } from "@wordpress/i18n";
import { Modal } from "@wordpress/components";
import { Arrow } from "../icons";

export const UserDataInfoModal = ({ closeModal }) => {
	return (
		<Modal
			title={__("What We Collect?", "easy-accordion-free")}
			onRequestClose={closeModal}
			className="splw-setup-page-modal"
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
					"This information helps us improve performance, fix issues faster, and ensure Easy Accordion stays compatible with the popular plugins and themes.",
					"easy-accordion-free"
				)}
			</p>
			<p className="modal-description sp-d-flex sp-align-center sp-gap-4px">
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
				className="modal-description sp-d-flex sp-align-center sp-gap-4px"
				rel="noreferrer"
			>
				{__("Learn More", "easy-accordion-free")}
				<Arrow />
			</a>
		</Modal>
	);
};
