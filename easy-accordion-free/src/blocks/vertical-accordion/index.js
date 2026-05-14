import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";
import metadata from "./block.json";
import VerticalAccordionEdit from "./edit";
import { VerticalAccordionBlockIcon, VerticalBlockPreviewImage } from "./icons";

if (sp_eab_localize_data?.activeBlockList?.includes(metadata.name)) {
	registerBlockType(metadata.name, {
		...metadata,
		icon: <VerticalAccordionBlockIcon />,
		title: __("FAQ / Vertical Accordion", "easy-accordion-free"),
		description: __(
			"Display FAQs vertically in an expandable accordion layout for better readability.",
			"easy-accordion-free"
		),
		edit: (props) =>
			props.attributes.isPreview ? <VerticalBlockPreviewImage /> : <VerticalAccordionEdit {...props} />,
		save: () => <InnerBlocks.Content />,
	});
}
