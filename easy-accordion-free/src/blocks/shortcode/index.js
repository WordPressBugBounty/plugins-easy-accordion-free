import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { ShortcodeBlockIcon } from "./icons";
import ShortcodeEdit from "./edit";

const blockOptions = {
	apiVersion: 3,
	icon: <ShortcodeBlockIcon />,
	category: "sp-easy-accordion-pro",
	textdomain: "easy-accordion-free",
	name: "sp-easy-accordion-pro/shortcode",
	title: __("Easy Accordion Shortcode", "easy-accordion-free"),
	description: __("Insert Easy Accordion classic accordions using the shortcode block.", "easy-accordion-free"),
	supports: {
		align: ["wide", "full"],
		customClassName: false,
	},
	example: {
		attributes: {
			preview: true,
		},
	},
	edit: ShortcodeEdit,
	save: () => null,
};

const registerBlockTypeFn = () => {
	if (sp_eab_localize_data?.activeBlockList?.includes(blockOptions?.name)) {
		const shortCodeList = sp_easy_accordion_pro?.shortCodeList;
		if (shortCodeList) {
			registerBlockType(blockOptions.name, blockOptions);
		}
	}
};

registerBlockTypeFn();
