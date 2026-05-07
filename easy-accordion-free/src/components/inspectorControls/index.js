import { __ } from "@wordpress/i18n";
import { InspectorControls } from "@wordpress/block-editor";
import { accordionBlocksInfo } from "@easy-accordion/constants";
import { onOpenSinglePatternPopup } from "../../prebuild-library/controls";
import { ArrowUpRight } from "../icons";
import "./editor.scss";

const InspectorControl = ({ attributes, setAttributes, Inspector }) => {
	const { blockName } = attributes;
	const blockInfo = accordionBlocksInfo[`sp-easy-accordion-pro/${blockName}`];

	return (
		<InspectorControls>
			<div className="sp-easy-accordion-tabs-panel">
				{(blockInfo?.docLink || blockInfo?.demoLink) && (
					<div className="sp-eab-inspector-control-top-section">
						{blockInfo?.docLink && (
							<div className="sp-eab-doc-link-button-wrapper">
								<a
									className="sp-eab-doc-link-button sp-d-flex sp-align-center sp-gap-2px"
									href={blockInfo?.docLink}
									target="_blank"
									rel="noreferrer"
								>
									Documentation <ArrowUpRight />
								</a>
							</div>
						)}
						{blockInfo?.demoLink && (
							<div className="sp-eab-inspector-control-button-list sp-d-flex sp-align-center sp-justify-between">
								<button
									data-block={blockName}
									className="sp-eab-block-preview-button eab-ready-patterns sp-d-flex sp-align-center sp-justify-center"
									onClick={(event) => onOpenSinglePatternPopup(event, blockName)}
								>
									{__("Ready Patterns", "easy-accordion-free")}
								</button>
								<a
									className="sp-eab-block-preview-button eab-block-preview sp-d-flex sp-align-center sp-justify-center"
									href={blockInfo?.demoLink}
									target="_blank"
									rel="noreferrer"
								>
									{__("Block Preview", "easy-accordion-free")}
								</a>
							</div>
						)}
					</div>
				)}
				<Inspector attributes={attributes} setAttributes={setAttributes} />
			</div>
		</InspectorControls>
	);
};

export default InspectorControl;
