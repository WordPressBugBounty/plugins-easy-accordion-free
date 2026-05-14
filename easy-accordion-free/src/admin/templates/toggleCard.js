import Toggle from "react-toggle";
import { Demos, Docs, ProIconFill } from "../icons";
import { accordionBlocksInfo } from "@easy-accordion/constants";

const proBlocks = [
	"sp-easy-accordion-pro/accordion-slider",
	"sp-easy-accordion-pro/media-accordion",
	"sp-easy-accordion-pro/user-faq-form",
];

const ToggleCard = ({ attributes, blockShowHideHandler, isUpcomingBlock = false }) => {
	const { show, name } = attributes;
	const blocksInfo = accordionBlocksInfo;
	// return if block info don't exist.
	if (!blocksInfo[name]) {
		return;
	}
	const { icon, demoLink, docLink, title } = blocksInfo[name];
	const isPro = proBlocks.includes(name);

	return (
		<div
			className={`sp-eab-visibility-setting-card${isUpcomingBlock ? " sp-eab-upcoming-block" : ""} sp-d-flex sp-justify-between sp-align-center`}
		>
			{isPro && (
				<div className="sp-eab-pro-blocks-badge">
					<ProIconFill />
					<span>PRO</span>
				</div>
			)}
			<div className="sp-eab-visibility-setting-card-info sp-d-flex sp-align-center">
				<div className="sp-eab-visibility-setting-card-icon sp-d-flex sp-align-center">{icon}</div>
				<div className="sp-eab-visibility-setting-card-docs">
					<h4 className="sp-eab-visibility-card-label sp-d-flex sp-align-center sp-gap-4px">
						<span className="sp-eab-visibility-block-name">{title}</span>
					</h4>
					<ul className="sp-d-flex sp-align-center sp-gap-10px">
						{(docLink || isUpcomingBlock) && (
							<li className="sp-eab-doc-link">
								<a
									className="sp-d-flex sp-align-center"
									href={docLink}
									target="_blank"
									rel="noreferrer"
								>
									<Docs /> Docs
								</a>
							</li>
						)}
						{(demoLink || isUpcomingBlock) && (
							<li className="sp-eab-demo-link">
								<a
									className="sp-d-flex sp-align-center"
									href={demoLink}
									target="_blank"
									rel="noreferrer"
								>
									<Demos /> Demo
								</a>
							</li>
						)}
					</ul>
				</div>
			</div>
			<div className="sp-eab-visibility-setting-toggle">
				<Toggle
					icons={false}
					defaultChecked={isUpcomingBlock ? false : show}
					onChange={() => {
						if (!isUpcomingBlock) {
							blockShowHideHandler(name);
						}
					}}
					disabled={isUpcomingBlock}
				/>
			</div>
		</div>
	);
};

export default ToggleCard;
