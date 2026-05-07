import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import SidebarItemEdit from "./edit";
import SidebarItemSave from "./save";
import metadata from "./block.json";

registerBlockType(metadata.name, {
	...metadata,
	title: __("Tab Single Item", "easy-accordion-free"),
	description: __("Display Accordion with Easy Accordion.", "easy-accordion-free"),
	icon: "admin-generic",
	edit: SidebarItemEdit,
	save: SidebarItemSave,
});
