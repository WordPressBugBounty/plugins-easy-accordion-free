import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";
import { ImageAccordionBlockIcon } from "../image-accordion/icons";
import ImageAccordionItemEdit from "./edit";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	...metadata,
	title: __("Single (Image) Accordion Item", "easy-accordion-free"),
	description: __("Easily manage & style individual images with advanced customizations.", "easy-accordion-free"),
	icon: <ImageAccordionBlockIcon />,
	edit: ImageAccordionItemEdit,
	save: () => <InnerBlocks.Content />,
});
