import { __ } from "@wordpress/i18n";
import { useContext, useEffect, useRef } from "@wordpress/element";
import { useSelect } from "@wordpress/data";
import { useBlockProps, RichText } from "@wordpress/block-editor";
import { AccordionContext } from "../image-accordion/render";
import { InspectorControl } from "@easy-accordion/components";
import Inspector from "./inspector";
import { useUniqueId } from "@easy-accordion/hooks";

const ImageAccordionItemEdit = ({ clientId, attributes, setAttributes }) => {
	const { singleImgData, singleImgTitle, singleImgDesc, uniqueId, customClassName, parentSettings } = attributes;
	// custom hook call.
	useUniqueId(clientId, uniqueId, setAttributes);

	const context = useContext(AccordionContext);

	const { activeIndex, handleActivate, activeEvent, handleUpdateImage, parentData } = context || {};
	const previousImgId = useRef(singleImgData?.id);

	const {
		imageEffects,
		accordionTitleTag,
		showTitle,
		showDescription,
		contentAlignment,
		imgHoverGrayScale,
		contentAnimationEffect,
		blockName,
		template,
	} = parentData || {};

	// Get block index
	const index = useSelect(
		(select) => {
			const { getBlockRootClientId, getBlockIndex } = select("core/block-editor");
			const parentId = getBlockRootClientId(clientId);
			return parentId ? getBlockIndex(clientId, parentId) : 0;
		},
		[clientId]
	);

	const isActive = index === activeIndex;

	let effectClass = "";

	// Hover grayscale active only when NOT active and event is click
	const useHoverGray = imgHoverGrayScale && !isActive && activeEvent === "click";

	switch (imageEffects) {
		case "zoomOut":
			if (useHoverGray) {
				effectClass = "eab-zoom-out-normal eab-zoom-out-onhover";
			} else {
				effectClass = isActive ? "eab-zoom-out-active" : "eab-zoom-out-normal";
			}
			break;
		default:
			effectClass = "";
	}

	// Update title/desc when image changes
	const blockProps = useBlockProps({
		className: `sp-eab-image-accordion-item ${customClassName} ${effectClass} ${uniqueId} ${isActive && blockName === "image-accordion" ? "active" : ""}`,
		...(activeEvent === "hover"
			? { onMouseEnter: () => handleActivate?.(index) }
			: { onClick: () => handleActivate?.(index) }),
	});

	// Update parent gallery on blur
	const handleTitleBlur = () => {
		handleUpdateImage?.(index, { ...singleImgData, title: singleImgTitle });
	};

	const handleDescBlur = () => {
		handleUpdateImage?.(index, { ...singleImgData, description: singleImgDesc });
	};

	// Base CSS variables (always applied)
	const cssVars = {};
	// Image variables (normal / slider / flip)
	cssVars["--bg-url"] = `url(${singleImgData?.url || ""})`;
	// Final inline style object (React-ready)
	const inlineStyle = {
		...cssVars,
	};

	return (
		<div {...blockProps}>
			<InspectorControl
				attributes={{ ...attributes, clientId }}
				setAttributes={setAttributes}
				Inspector={Inspector}
			/>
			<div
				className={`sp-eab-accordion-bg sp-d-flex sp-align-center sp-justify-center`}
				style={inlineStyle}
				role="img"
				aria-label={singleImgData?.alt || ""}
			>
				{(showTitle || showDescription) && (
					<div
						key={`${index}-${contentAnimationEffect}-${isActive}`}
						className={`sp-eab-overlay sp-d-flex sp-align-center sp-justify-center eab-content-alignment-${contentAlignment}`}
					>
						<div className={`eab-img-content-wrapper sp-d-flex sp-align-center sp-flex-col eab-animation`}>
							<div className="eab-content-section">
								{showTitle && (
									<RichText
										tagName={accordionTitleTag}
										className={`sp-eab-image-title`}
										value={singleImgTitle || ""}
										onChange={(newTitle) => setAttributes({ singleImgTitle: newTitle })}
										onBlur={handleTitleBlur}
										placeholder={__("Untitled", "easy-accordion-free")}
									/>
								)}
								{showDescription && (
									<RichText
										tagName="p"
										className="sp-eab-image-desc"
										value={singleImgDesc || ""}
										onChange={(newDesc) => setAttributes({ singleImgDesc: newDesc })}
										onBlur={handleDescBlur}
										placeholder={__("Add your image description.", "easy-accordion-free")}
									/>
								)}
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};

export default ImageAccordionItemEdit;
