import { __ } from "@wordpress/i18n";
import { RichText } from "@wordpress/block-editor";
import { memo } from "@wordpress/element";
import { inArray } from "@easy-accordion/controls";

const AccordionHeader = ({ attributes, onChangeTitle }) => {
	const { accordionTitle, toggleIconsSet, enableExpandAndCollapseIcon, toggleIconPosition, titleAlignment } =
		attributes;

	const toggleIconAnimatedSet = inArray([1, 4, 5, 6, 9, 10, 12], toggleIconsSet?.set);

	return (
		<span
			className={`sp-eab-accordion-header-wrapper sp-d-flex sp-align-center eab-icon-position-${toggleIconPosition}`}
		>
			<span className={`sp-eab-accordion-header-start sp-d-flex sp-justify-${titleAlignment} sp-align-center`}>
				<span className="sp-eab-title-subtitle-wrapper sp-d-flex">
					<span className="sp-eab-accordion-title-wrapper sp-d-flex sp-align-center">
						<RichText
							tagName="span"
							className="sp-eab-accordion-title-text"
							placeholder={__("Add your accordion title here", "easy-accordion-free")}
							value={accordionTitle}
							onChange={(value) => onChangeTitle(value)}
							allowedFormats={[]}
						/>
					</span>
				</span>
			</span>
			<span
				className={`sp-eab-accordion-header-end ${toggleIconAnimatedSet ? "eab-icon-animated" : "eab-icon-static"}`}
			>
				{enableExpandAndCollapseIcon && (
					<span className="sp-eab-expand-collapse-icon sp-d-block">
						<span className={`sp-eab-expand-icon ${toggleIconsSet?.expand}`}></span>
						<span className={`sp-eab-collapse-icon ${toggleIconsSet?.collapse}`}></span>
					</span>
				)}
			</span>
		</span>
	);
};

export default memo(AccordionHeader);
