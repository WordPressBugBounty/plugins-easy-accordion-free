import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { accordionBlocksInfo } from "@easy-accordion/constants";
import { onOpenSinglePatternPopup } from "../../prebuild-library/controls";
import "./editor.scss";

const InspectorControl = ({ attributes, setAttributes, Inspector }) => {
	const { blockName } = attributes;
	const blockInfo = accordionBlocksInfo[`sp-easy-accordion-pro/${blockName}`];
	const isShowReadyPatternButton = blockInfo?.patternSlug;

	return (
		<InspectorControls>
			<div className="sp-easy-accordion-tabs-panel">
				{/* Ready Patterns + Documentation buttons */}
				{(isShowReadyPatternButton || blockInfo?.docLink) && (
					<div className="sp-eab-tab-panel-header-actions">
						{isShowReadyPatternButton && (
							<button
								type="button"
								className="sp-eab-header-action sp-eab-header-action-patterns"
								onClick={(event) => onOpenSinglePatternPopup(event, blockName)}
							>
								{__("Ready Patterns", "easy-accordion-free")}
							</button>
						)}
						{blockInfo?.docLink && (
							<a
								className="sp-eab-header-action sp-eab-header-action-docs"
								href={blockInfo.docLink}
								target="_blank"
								rel="noreferrer"
							>
								{__("Documentation", "easy-accordion-free")}
							</a>
						)}
					</div>
				)}
				<Inspector attributes={attributes} setAttributes={setAttributes} />
			</div>
		</InspectorControls>
	);
};

export default InspectorControl;
