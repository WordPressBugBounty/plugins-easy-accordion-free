import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";
import { VerticalAccordionBlockIcon } from "./icons";
import metadata from "./block.json";
import AccordionItemEdit from "./edit";

registerBlockType(metadata.name, {
	...metadata,
	title: __("Accordion Single Item", "easy-accordion-free"),
	description: __(
		"Easily manage & style individual accordion items with advanced customizations.",
		"easy-accordion-free"
	),
	icon: <VerticalAccordionBlockIcon />,
	edit: AccordionItemEdit,
	save: () => <InnerBlocks.Content />,
});
