import { memo } from "@wordpress/element";
import { inArray } from "@easy-accordion/controls";
import { FeaturedImage } from "./templatePart";

const AccordionHeader = ({ data, imageData }) => {
	const { title, link, toggleIconsSet, enableExpandAndCollapseIcon, toggleIconPosition } = data;

	const toggleIconAnimatedSet = inArray([1, 4, 5, 6, 9, 10, 12], toggleIconsSet?.set);

	// -----------------------------
	//  Title Handling
	// -----------------------------
	let finalTitle = title || "No Title Found!";

	return (
		<span
			className={`sp-eab-accordion-header-wrapper sp-d-flex sp-align-center eab-icon-position-${toggleIconPosition}`}
		>
			<span className="sp-eab-accordion-header-start sp-d-flex sp-justify-start sp-align-center">
				{imageData.template === "post-accordion-two" &&
					imageData.showFeaturedImage &&
					imageData.attachment_metadata && (
						<span className="eab-feature-image">
							<FeaturedImage data={imageData} link={link} />
						</span>
					)}
				<span className="sp-eab-title-subtitle-wrapper sp-d-flex sp-flex-col">
					<span className="sp-eab-accordion-title-wrapper sp-d-flex sp-align-center">{finalTitle}</span>
				</span>
			</span>

			<span
				className={`sp-eab-accordion-header-end ${
					toggleIconAnimatedSet ? "eab-icon-animated" : "eab-icon-static"
				}`}
			>
				{enableExpandAndCollapseIcon && (
					<span className="sp-eab-expand-collapse-icon sp-d-block">
						<span className={`sp-eab-expand-icon ${toggleIconsSet?.expand}`} />
						<span className={`sp-eab-collapse-icon ${toggleIconsSet?.collapse}`} />
					</span>
				)}
			</span>
		</span>
	);
};

export default memo(AccordionHeader);
