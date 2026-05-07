import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { InnerBlocks } from "@wordpress/block-editor";
import { SidebarAccordionBlockIcon, SidebarAccordionPreviewImage } from "./icons";
import SidebarAccordionEdit from "./edit";
import metadata from "./block.json";

if (sp_eab_localize_data?.activeBlockList?.includes(metadata.name)) {
	registerBlockType(metadata.name, {
		...metadata,
		icon: <SidebarAccordionBlockIcon />,
		title: __("Sidebar Tab Accordion", "easy-accordion-free"),
		description: __("Display FAQs compactly using a sidebar tab accordion to save space.", "easy-accordion-free"),
		edit: (props) =>
			props.attributes.isPreview ? <SidebarAccordionPreviewImage /> : <SidebarAccordionEdit {...props} />,
		save: () => <InnerBlocks.Content />,
	});
}
