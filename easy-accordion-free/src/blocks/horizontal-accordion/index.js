import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";
import { HorizontalAccordionBlockIcon, HorizontalBlockPreviewImage } from "./icons";
import HorizontalAccordionEdit from "./edit";
import metadata from "./block.json";

if (sp_eab_localize_data?.activeBlockList?.includes(metadata.name)) {
	registerBlockType(metadata.name, {
		...metadata,
		icon: <HorizontalAccordionBlockIcon />,
		title: __("Horizontal Accordion", "easy-accordion-free"),
		description: __(
			"Showcase FAQs in a horizontal accordion layout with an expanding effect.",
			"easy-accordion-free"
		),
		edit: (props) =>
			props.attributes.isPreview ? <HorizontalBlockPreviewImage /> : <HorizontalAccordionEdit {...props} />,
		save: () => <InnerBlocks.Content />,
	});
}
