import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";
import { ImageAccordionBlockIcon, ImageBlockPreviewImage } from "../image-accordion/icons";
import ImageAccordionEdit from "./edit";
import metadata from "./block.json";

if (sp_eab_localize_data?.activeBlockList?.includes(metadata.name)) {
	registerBlockType(metadata.name, {
		...metadata,
		icon: <ImageAccordionBlockIcon />,
		title: __("Image Accordion", "easy-accordion-free"),
		description: __("Show images in a stylish accordion layout with expand effects.", "easy-accordion-free"),
		edit: (props) => (props.attributes.isPreview ? <ImageBlockPreviewImage /> : <ImageAccordionEdit {...props} />),
		save: () => <InnerBlocks.Content />,
	});
}
