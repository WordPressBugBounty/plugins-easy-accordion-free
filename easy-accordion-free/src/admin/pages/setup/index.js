import { __ } from "@wordpress/i18n";
import BlockVisibility from "../blockVisibility";

const BlocksSetup = () => {
	return (
		<div className="sp-eap-setup-blocks-page">
			<div className="sp-eap-setup-blocks-page-header sp-d-flex sp-align-center sp-justify-between sp-gap-10px sp-flex-col">
				<h3 className="sp-eap-setup-page-title">{__("Enable the Blocks You Need", "easy-accordion-free")}</h3>
				<p className="sp-eap-setup-page-desc">
					{__(
						"Turn on the blocks that match your workflow. You can update your selection anytime.",
						"easy-accordion-free"
					)}
				</p>
			</div>
			<BlockVisibility showHeading={false} />
		</div>
	);
};

export default BlocksSetup;
