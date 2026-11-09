import { __ } from "@wordpress/i18n";
import { createInterpolateElement, memo } from "@wordpress/element";

/**
 * An error or notice above the modal body, with a link to where providers
 * are managed when the problem is the provider.
 *
 * @param {Object}  props
 * @param {string}  props.message        Text.
 * @param {boolean} props.showLinks      Add the AI Configuration link.
 * @param {boolean} props.showConnectors Add the WordPress Connectors link too.
 * @param {string}  props.tone           "error" or "info".
 * @return {JSX.Element} Alert.
 */
const WarningMessage = ({ message, showLinks = true, showConnectors = false, tone = "error" }) => {
	const aiConfigUrl = window.sp_eab_localize_data?.aiSettings?.aiConfigUrl || "";
	const connectorsUrl = window.sp_eab_localize_data?.aiSettings?.connectorsUrl || "";

	return (
		<div className={`eab-ai-faq-alert is-${tone}`} role={"error" === tone ? "alert" : "status"}>
			{message}{" "}
			{showLinks &&
				aiConfigUrl &&
				createInterpolateElement(
					showConnectors && connectorsUrl
						? __(
								"Manage AI providers in <link>AI Configuration</link> or <connectors>WordPress Connectors</connectors>.",
								"easy-accordion-free"
							)
						: __("Manage AI providers in <link>AI Configuration</link>.", "easy-accordion-free"),
					{
						/* eslint-disable jsx-a11y/anchor-has-content -- content supplied by createInterpolateElement */
						link: <a href={aiConfigUrl} target="_blank" rel="noreferrer" />,
						connectors: <a href={connectorsUrl} target="_blank" rel="noreferrer" />,
						/* eslint-enable jsx-a11y/anchor-has-content */
					}
				)}
		</div>
	);
};

export default memo(WarningMessage);
