import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { PostAccordionBlockIcon, PostBlockPreviewImage } from "./icons";
import PostAccordionEdit from "./edit";
import metadata from "./block.json";

if (sp_eab_localize_data?.activeBlockList?.includes(metadata.name)) {
	registerBlockType(metadata.name, {
		...metadata,
		icon: <PostAccordionBlockIcon />,
		title: __("Post Accordion 01", "easy-accordion-free"),
		description: __("Display blog posts in an interactive, expandable accordion layout.", "easy-accordion-free"),
		edit: (props) => (props.attributes.isPreview ? <PostBlockPreviewImage /> : <PostAccordionEdit {...props} />),
		save: () => null,
	});
}
