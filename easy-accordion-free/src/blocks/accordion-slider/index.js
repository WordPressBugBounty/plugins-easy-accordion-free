import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { AccordionSliderBlockIcon, AccordionSliderPreviewImage } from "./icons";
import { ProBlockPlaceholder } from "@easy-accordion/templates";
import metadata from "./block.json";

if (sp_eab_localize_data?.activeBlockList?.includes(metadata.name)) {
	registerBlockType(metadata.name, {
		...metadata,
		icon: <AccordionSliderBlockIcon />,
		title: __("Accordion Slider", "easy-accordion-free"),
		description: __(
			"Slide and expand multiple images with an interactive accordion slider.",
			"easy-accordion-free"
		),
		edit: (props) =>
			props.attributes.isPreview ? <AccordionSliderPreviewImage /> : <ProBlockPlaceholder {...props} />,
		save: () => null,
	});
}
