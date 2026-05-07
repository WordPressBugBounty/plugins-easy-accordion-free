import { __ } from "@wordpress/i18n";
import { MenuAccordionBlockIcon, PostAccordionTwoBlockIcon, ProductAccordionTwoBlockIcon } from "./icons";

export const upcomingBlocksList = [
	{ name: "sp-easy-accordion-pro/post-accordion-two", show: false },
	{ name: "sp-easy-accordion-pro/product-accordion-two", show: false },
	{ name: "sp-easy-accordion-pro/menu-accordion", show: false },
];

export const upcomingBlockInfo = {
	"sp-easy-accordion-pro/post-accordion-two": {
		icon: <PostAccordionTwoBlockIcon />,
		title: __("Post Accordion 02", "easy-accordion-free"),
		docLink: "",
		demoLink: "",
	},
	"sp-easy-accordion-pro/product-accordion-two": {
		icon: <ProductAccordionTwoBlockIcon />,
		title: __("Product Accordion 02", "easy-accordion-free"),
		docLink: "",
		demoLink: "",
	},
	"sp-easy-accordion-pro/menu-accordion": {
		icon: <MenuAccordionBlockIcon />,
		title: __("Category/Menu Accordion", "easy-accordion-free"),
		docLink: "",
		demoLink: "",
	},
};

export const proBlocks = [
	"sp-easy-accordion-pro/accordion-slider",
	"sp-easy-accordion-pro/media-accordion",
	"sp-easy-accordion-pro/user-faq-form",
];
