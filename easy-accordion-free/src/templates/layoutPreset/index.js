import { __ } from "@wordpress/i18n";
import { memo } from "@wordpress/element";
import { accordionBlocksInfo, layoutTemplateIcon } from "@easy-accordion/constants";
import "./editor.scss";
import { onOpenSinglePatternPopup } from "../../prebuild-library/controls";
import { useDispatch } from "@wordpress/data";

const LayoutPreset = ({ blockName, setAttributes }) => {
	const templates = layoutTemplateIcon[blockName];
	const demoLink = accordionBlocksInfo[`sp-easy-accordion-pro/${blockName}`]?.demoLink;
	const defaultActive = templates[0] || {};

	const blockOptions = {
		"vertical-accordion": {
			title: __("Vertical Accordion Templates", "easy-accordion-free"),
			subTitle: __("Choose a vertical accordion template to get started", "easy-accordion-free"),
		},
		"horizontal-accordion": {
			title: __("Horizontal Accordion Templates", "easy-accordion-free"),
			subTitle: __("Choose a horizontal accordion template to get started", "easy-accordion-free"),
		},
		"image-accordion": {
			title: __("Image Accordion Templates", "easy-accordion-free"),
			subTitle: __("Choose an image accordion template to get started.", "easy-accordion-free"),
		},
		"accordion-slider": {
			title: __("Accordion Slider Templates", "easy-accordion-free"),
			subTitle: __("Choose an image accordion slider template to get started.", "easy-accordion-free"),
		},
		"sidebar-tab-accordion": {
			title: __("Sidebar Tab Accordion Templates", "easy-accordion-free"),
			subTitle: __("Choose a sidebar tab accordion template to get started.", "easy-accordion-free"),
		},
	};

	const { removeBlocks } = useDispatch("core/block-editor");
	const handleRemoveBlockByID = () => {
		removeBlocks(clientId);
	};

	return (
		<div className="sp-eab-layout-variation-picker-modal sp-d-flex sp-flex-col">
			<div className="sp-eab-layout-modal-label sp-d-flex sp-flex-col sp-gap-8px">
				<h3>{blockOptions[blockName]?.title}</h3>
				<p>{blockOptions[blockName]?.subTitle}</p>
			</div>
			<div className={`sp-eab-layout-modal-items sp-d-grid sp-grid-cols-2 sp-eab-${blockName}-preview-icon`}>
				{templates?.map(({ label, value, Icon, onlyPro }, i) => (
					<span
						key={i}
						className={`sp-eab-layout-modal-item sp-d-flex sp-flex-col sp-align-center sp-cursor-pointer sp-gap-8px ${
							onlyPro ? "sp-eab-only-pro-card" : "sp-cursor-pointer"
						}`}
						onClick={() => {
							!onlyPro &&
								setAttributes({
									template: value,
								});
							// togglePanelBody( "templates", true );
						}}
					>
						{!onlyPro && (
							<span className="sp-eab-layout-picker-icon sp-d-flex sp-align-center sp-justify-center">
								<Icon activeColor="" />
							</span>
						)}
						{onlyPro && (
							<div className="sp-eab-preset-icon-wrapper">
								<Icon activeColor="" />
								<span className="sp-eab-pro-badge">
									<a
										href={demoLink}
										target="_blank"
										rel="noopener noreferrer"
										className="sp-eab-pro-card-demo-link"
									>
										{__("Demo", "easy-accordion-free")}
									</a>
									<a
										href={"https://easyaccordion.io/pricing/"}
										target="_blank"
										rel="noopener noreferrer"
										className="sp-eab-pro-card-link"
									>
										{" "}
										PRO{" "}
									</a>
								</span>
							</div>
						)}
						<p className="sp-eab-layout-picker-label">{label}</p>
					</span>
				))}
			</div>
			<div className="sp-eab-layout-modal-skip-button-wrapper sp-d-flex sp-align-center sp-justify-center sp-gap-6px">
				<span
					className="sp-eab-block-preview-button eab-ready-patterns sp-d-flex sp-align-center sp-justify-center"
					onClick={(event) => onOpenSinglePatternPopup(event, blockName, handleRemoveBlockByID)}
				>
					{__("Choose from Ready Patterns", "easy-accordion-free")}
				</span>
				<span
					className="sp-eab-layout-modal-skip-button"
					onClick={() => {
						setAttributes({ template: defaultActive?.value });
						// togglePanelBody( "templates", true );
					}}
				>
					{__("Skip", "easy-accordion-free")}
				</span>
			</div>
		</div>
	);
};

export default memo(LayoutPreset);
