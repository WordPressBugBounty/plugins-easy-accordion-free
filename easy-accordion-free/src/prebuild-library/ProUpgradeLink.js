import { __ } from "@wordpress/i18n";
import { memo } from "@wordpress/element";
import { API_ENDPOINTS } from "./constants";
import { ProBadgeIcon } from "./icons";

/**
 * Stand-in for the Insert button on a Pro pattern: the free plugin cannot
 * import Pro patterns, so the card and the preview drawer link to pricing.
 *
 * @param {Object} props
 * @param {string} props.label Visible text.
 */
const ProUpgradeLink = ({ label = __("PRO", "easy-accordion-free") }) => (
	<a
		className="sp-eap-ready-patterns-pro-btn"
		href={API_ENDPOINTS.UPGRADE_URL}
		target="_blank"
		rel="noopener noreferrer"
		aria-label={__("Upgrade to Pro to access this pattern", "easy-accordion-free")}
	>
		<ProBadgeIcon />
		{label}
	</a>
);

export default memo(ProUpgradeLink);
