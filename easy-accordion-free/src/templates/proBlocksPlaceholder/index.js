import { __ } from "@wordpress/i18n";
import { useBlockProps, store as blockEditorStore } from "@wordpress/block-editor";
import { useSelect, useDispatch } from "@wordpress/data";
import { accordionBlocksInfo } from "@easy-accordion/constants";
import { memo } from "@wordpress/element";
import "./editor.scss";

const ProBlockPlaceholder = ({ clientId }) => {
	const proPlaceHolderData = {
		"sp-easy-accordion-pro/accordion-slider": {
			title: "Accordion Slider",
			desc: __(
				"Unlock Accordion Slider and advanced layouts by upgrading to the Pro plan.",
				"easy-accordion-free"
			),
			imageName: "accordion-slider-preview.png",
		},
		"sp-easy-accordion-pro/media-accordion": {
			title: "Media Accordion",
			desc: __(
				"Unlock Media Accordion and advanced layouts by upgrading to the Pro plan.",
				"easy-accordion-free"
			),
			imageName: "media-accordion-preview.png",
		},
		"sp-easy-accordion-pro/user-faq-form": {
			title: "User FAQ Forms",
			desc: __(
				"Unlock advanced User FAQ Forms and premium features by upgrading to Pro plan.",
				"easy-accordion-free"
			),
			imageName: "user-faq-form-preview.png",
		},
	};
	const block = useSelect((select) => select(blockEditorStore).getBlock(clientId), [clientId]);

	const blockName = block?.name;

	const { removeBlock } = useDispatch(blockEditorStore);

	const handleRemove = () => {
		removeBlock(clientId);
	};
	const demoLink = accordionBlocksInfo[blockName]?.demoLink;

	return (
		<div {...useBlockProps()}>
			<div className="sp-eab-pro-blocks-placeholder sp-d-flex sp-justify-between">
				<button className="sp-eab-pro-block-placeholder-remove" onClick={handleRemove}>
					<span className="eab-pro-block-close-icon"></span>
				</button>
				<div className="sp-eab-pro-blocks-placeholder-left sp-d-flex sp-flex-col sp-justify-center">
					<div className="sp-eab-pro-block-placeholder-title">{proPlaceHolderData[blockName]?.title}</div>
					<div className="sp-eab-pro-block-placeholder-desc">{proPlaceHolderData[blockName]?.desc}</div>
					<div className="sp-eab-pro-plan-btn-wrapper sp-d-flex">
						<a className="sp-eab-pro-plan-demo-btn" href={demoLink} target="_blank" rel="noreferrer">
							{__("View Demo", "easy-accordion-free")}
						</a>
						<a
							className="sp-eab-pro-plan-upgrade-btn"
							href="https://easyaccordion.io/pricing/"
							target="_blank"
							rel="noreferrer"
						>
							{__("Upgrade To Pro", "easy-accordion-free")}
						</a>
					</div>
				</div>
				<div className="sp-eab-pro-blocks-placeholder-right">
					<img
						src={`${sp_eab_localize_data?.pluginUrl}assets/images/${proPlaceHolderData[blockName]?.imageName}`}
						alt={__("Upgrade to Pro Plan", "easy-accordion-free")}
					/>
				</div>
			</div>
		</div>
	);
};

export default memo(ProBlockPlaceholder);
