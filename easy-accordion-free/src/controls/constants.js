import { __ } from "@wordpress/i18n";
import {
	VerticalAccordionBlockIcon,
	VerticalTemplateFiveIcon,
	VerticalTemplateFourIcon,
	VerticalTemplateOneIcon,
	VerticalTemplateSixIcon,
	VerticalTemplateThreeIcon,
	VerticalTemplateTwoIcon,
} from "../blocks/vertical-accordion/icons";
import {
	HorizontalAccordionBlockIcon,
	HorizontalTemplateOneIcon,
	HorizontalTemplateTwoIcon,
} from "../blocks/horizontal-accordion/icons";
import {
	ImageAccordionBlockIcon,
	ImgAccordionTemplateFourIcon,
	ImgAccordionTemplateOneIcon,
	ImgAccordionTemplateThreeIcon,
	ImgAccordionTemplateTwoIcon,
} from "../blocks/image-accordion/icons";
import { ShortcodeBlockIcon } from "../blocks/shortcode/icons";
import {
	AccordionSliderBlockIcon,
	AccordionSliderTemplateOneIcon,
	AccordionSliderTemplateThreeIcon,
	AccordionSliderTemplateTwoIcon,
} from "../blocks/accordion-slider/icons";
import {
	PostAccordionBlockIcon,
	PostAccordionTemplateFourIcon,
	PostAccordionTemplateOneIcon,
	PostAccordionTemplateThreeIcon,
	PostAccordionTemplateTwoIcon,
} from "../blocks/post-accordion/icons";
import {
	SidebarAccordionBlockIcon,
	SidebarAccordionTemplateOneIcon,
	SidebarAccordionTemplateTwoIcon,
} from "../blocks/sidebar-tab-accordion/icons";
import {
	ProductAccordionBlockIcon,
	ProductAccordionTemplateFourIcon,
	ProductAccordionTemplateOneIcon,
	ProductAccordionTemplateThreeIcon,
	ProductAccordionTemplateTwoIcon,
} from "../blocks/product-accordion/icons";
import { MediaAccordionBlockIcon } from "../blocks/media-accordion/icons";
import { FaqFormBlockIcon } from "../blocks/user-faq-form/icons";
import {
	AjaxPaginationBlockIcon,
	FaqSearchBlockIcon,
	MenuAccordionBlockIcon,
	PostAccordionBlockTwoIcon,
	ProductAccordionTwoBlockIcon,
	ToggleAllBlockIcon,
} from "./upcomingBlocksIcon";

export const orderByOptions = [
	{ label: "None", value: "all", type: "order_by" },
	{ label: "ID", value: "ID", type: "order_by" },
	{ label: "Date", value: "date", type: "order_by" },
	{ label: "Random", value: "rand", type: "order_by" },
	{ label: "Title", value: "title", type: "order_by" },
	{ label: "Modified", value: "modified", type: "order_by" },
	{ label: "Menu Order", value: "menu_order", type: "order_by", pro: true },
	{
		label: "Drag & Drop",
		value: "post__in",
		type: "order_by",
		pro: true,
	},
];

export const animationEffectOptions = [
	{ value: "none", label: "None" },
	{ value: "fadeIn", label: "fadeIn" },
	{ value: "fadeInUp", label: "fadeInUp" },
	{ value: "fadeInLeft", label: "fadeInLeft", pro: true },
	{ value: "fadeInDownBig", label: "fadeInDownBig", pro: true },
	{ value: "shake", label: "shake", pro: true },
	{ value: "swing", label: "swing", pro: true },
	{ value: "rollIn", label: "rollIn", pro: true },
	{ value: "bounce", label: "bounce", pro: true },
	{ value: "wobble", label: "wobble", pro: true },
	{ value: "slideInDown", label: "slideInDown", pro: true },
	{ value: "slideInLeft", label: "slideInLeft", pro: true },
	{ value: "slideInUp", label: "slideInUp", pro: true },
	{ value: "zoomIn", label: "zoomIn", pro: true },
	{ value: "zoomInDown", label: "zoomInDown", pro: true },
	{ value: "zoomInUp", label: "zoomInUp", pro: true },
	{ value: "zoomInLeft", label: "zoomInLeft", pro: true },
	{ value: "bounceIn", label: "bounceIn", pro: true },
	{ value: "bounceInDown", label: "bounceInDown", pro: true },
	{ value: "bounceInUp", label: "bounceInUp", pro: true },
	{ value: "jello", label: "jello", pro: true },
	{ value: "rubberBand", label: "rubberBand", pro: true },
];

export const formFieldsArray = [
	{
		id: 1,
		tag: "input",
		inputType: "text",
		fieldsType: "First Name",
		registerKey: "firstName",
		required: false,
		label: "First Name",
		placeholder: "First Name",
		helpText: "",
		columnWidth: "50%",
	},
	{
		id: 2,
		tag: "input",
		inputType: "text",
		fieldsType: "Last Name",
		registerKey: "lastName",
		required: false,
		label: "Last Name",
		placeholder: "Last Name",
		helpText: "",
		columnWidth: "50%",
	},
	{
		id: 3,
		tag: "input",
		inputType: "email",
		fieldsType: "Email",
		registerKey: "email",
		required: true,
		label: "Email",
		placeholder: "Email Address",
		helpText: "",
		columnWidth: "100%",
	},
	{
		id: 4,
		tag: "input",
		inputType: "text",
		fieldsType: "FAQs Title",
		registerKey: "faqsTitle",
		required: true,
		label: "Question",
		placeholder: "",
		helpText: "",
		columnWidth: "100%",
	},
	{
		id: 5,
		tag: "textarea",
		inputType: "text",
		fieldsType: "Answer Description",
		registerKey: "answerDescription",
		required: false,
		label: "Answer",
		placeholder: "",
		helpText: "",
		columnWidth: "100%",
	},
];

export const faqFormFieldTypes = [
	{ id: 0, label: "Select", value: "" },
	{ id: 1, label: "First Name", value: "firstName" },
	{ id: 2, label: "Last Name", value: "lastName" },
	{ id: 3, label: "Email", value: "email" },
	{ id: 4, label: "FAQs Title", value: "faqsTitle" },
	{ id: 5, label: "Answer Description", value: "answerDescription" },
	{ id: 6, label: "Categories", value: "categories" },
];

export const borderStyles = [
	{
		label: <span className="sp-eab-border-none">None</span>,
		value: "none",
	},
	{
		label: <span className="sp-eab-border-solid">Solid</span>,
		value: "solid",
	},
	{
		label: <span className="sp-eab-border-dashed">Dashed</span>,
		value: "dashed",
	},
	{
		label: <span className="sp-eab-border-dotted">Dotted</span>,
		value: "dotted",
	},
	{
		label: <span className="sp-eab-border-double">Double</span>,
		value: "double",
	},
];

export const accordionBlocksInfo = {
	// child blocks.
	"sp-easy-accordion-pro/faq-search": {
		icon: <FaqSearchBlockIcon />,
		title: __("FAQ Search", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/faq-searchchild-block/",
		demoLink: "",
	},
	"sp-easy-accordion-pro/ajax-pagination": {
		icon: <AjaxPaginationBlockIcon />,
		title: __("Ajax Pagination", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/ajax-pagination-child-block/",
		demoLink: "",
	},
	"sp-easy-accordion-pro/toggle-all": {
		icon: <ToggleAllBlockIcon />,
		title: __("Toggle All Button", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/toggle-all-buttonchild-block/",
		demoLink: "",
	},
	"sp-easy-accordion-pro/accordion-item": {
		icon: <VerticalAccordionBlockIcon />,
		title: __("Accordion Single Item", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/accordion-single-item/",
		demoLink: "",
	},
	"sp-easy-accordion-pro/image-accordion-item": {
		icon: <ImageAccordionBlockIcon />,
		title: __("Single (Image) Accordion Item", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/single-image-accordion-item/",
		demoLink: "",
	},
	// parent blocks.
	// v4.0.0
	"sp-easy-accordion-pro/vertical-accordion": {
		icon: <VerticalAccordionBlockIcon />,
		title: __("FAQ / Vertical Accordion", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/vertical-accordion/",
		demoLink: "https://easyaccordion.io/blocks/#demoId15",
	},
	"sp-easy-accordion-pro/horizontal-accordion": {
		icon: <HorizontalAccordionBlockIcon />,
		title: __("Horizontal Accordion", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/horizontal-accordion/",
		demoLink: "https://easyaccordion.io/blocks/#demoId9",
	},
	"sp-easy-accordion-pro/image-accordion": {
		icon: <ImageAccordionBlockIcon />,
		title: __("Image Accordion", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/image-accordion/",
		demoLink: "https://easyaccordion.io/blocks/#demoId11",
	},
	"sp-easy-accordion-pro/accordion-slider": {
		icon: <AccordionSliderBlockIcon />,
		title: __("Accordion Slider", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/accordion-slider/",
		demoLink: "https://easyaccordion.io/blocks/#demoId13",
	},
	// v4.1.0
	"sp-easy-accordion-pro/sidebar-tab-accordion": {
		icon: <SidebarAccordionBlockIcon />,
		title: __("Sidebar Tab Accordion", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/sidebar-tab-accordion/",
		demoLink: "https://easyaccordion.io/blocks/#demoId119",
	},
	"sp-easy-accordion-pro/post-accordion": {
		icon: <PostAccordionBlockIcon />,
		title: __("Post Accordion 01", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/post-accordion-01/",
		demoLink: "https://easyaccordion.io/blocks/#demoId121",
	},
	"sp-easy-accordion-pro/product-accordion": {
		icon: <ProductAccordionBlockIcon />,
		title: __("Product Accordion 01", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/product-accordion-01/",
		demoLink: "https://easyaccordion.io/blocks/#demoId123",
	},
	// v4.2.0
	"sp-easy-accordion-pro/post-accordion-block-two": {
		icon: <PostAccordionBlockTwoIcon />,
		title: __("Post Accordion 02", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/post-accordion-02/",
		demoLink: "https://easyaccordion.io/blocks/#demoId122",
	},
	"sp-easy-accordion-pro/post-accordion-two": {
		icon: <PostAccordionBlockTwoIcon />,
		title: __("Post Accordion 02", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/post-accordion-02/",
		demoLink: "https://easyaccordion.io/blocks/#demoId122",
	},
	"sp-easy-accordion-pro/product-accordion-two": {
		icon: <ProductAccordionTwoBlockIcon />,
		title: __("Product Accordion 02", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/product-accordion-02/",
		demoLink: "https://easyaccordion.io/blocks/#demoId124",
	},
	"sp-easy-accordion-pro/menu-accordion": {
		icon: <MenuAccordionBlockIcon />,
		title: __("Category or Menu Accordion", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/category-or-menu-accordion/",
		demoLink: "https://easyaccordion.io/blocks/#demoId125",
	},
	"sp-easy-accordion-pro/media-accordion": {
		icon: <MediaAccordionBlockIcon />,
		title: __("Media Accordion", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/media-accordion/",
		demoLink: "https://easyaccordion.io/blocks/#demoId120",
	},
	"sp-easy-accordion-pro/user-faq-form": {
		icon: <FaqFormBlockIcon />,
		title: __("User FAQ Forms", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/user-faq-forms/",
		demoLink: "https://easyaccordion.io/blocks/#demoId126",
	},
	"sp-easy-accordion-pro/user-faq-forms": {
		icon: <FaqFormBlockIcon />,
		title: __("User FAQ Forms", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/user-faq-forms/",
		demoLink: "https://easyaccordion.io/blocks/#demoId126",
	},
	// shortcode block.
	"sp-easy-accordion-pro/shortcode": {
		icon: <ShortcodeBlockIcon />,
		title: __("Easy Accordion Shortcode", "easy-accordion-free"),
		docLink: "https://easyaccordion.io/docs/easy-accordion-shortcode/",
		demoLink: "",
	},
};

export const expandCollapseIconSets = [
	{ set: 1, expand: "eab-icon-angle-down-solid", collapse: "eab-icon-angle-up-solid" },
	{ set: 2, expand: "eab-icon-plus-regular", collapse: "eab-icon-minus-solid-1" },
	{ set: 3, expand: "eab-icon-plus-solid", collapse: "eab-icon-minus-solid" },
	{ set: 4, expand: "eab-icon-triangle-down", collapse: "eab-icon-triangle-up" },
	{ set: 5, expand: "eab-icon-double-angle-down", collapse: "eab-icon-double-angle-up" },
	{ set: 6, expand: "eab-icon-arrow-down-regular", collapse: "eab-icon-arrow-up-regular" },
	{ set: 7, expand: "eab-icon-dots", collapse: "eab-icon-dots" },
	{ set: 8, expand: "eab-icon-check-mark", collapse: "eab-icon-cross" },
	{ set: 9, expand: "eab-icon-angle-down-light", collapse: "eab-icon-angle-up-light", pro: true },
	{ set: 10, expand: "eab-icon-angle-down-regular", collapse: "eab-icon-angle-up-regular", pro: true },
	{ set: 11, expand: "eab-icon-plus-light", collapse: "eab-icon-minus-light", pro: true },
	{ set: 12, expand: "eab-icon-angle-down-circle", collapse: "eab-icon-angle-up-circle", pro: true },
	{
		set: 13,
		expand: "eab-icon-plus-circle-border",
		collapse: "eab-icon-minus-circle-border",
		pro: true,
	},
	{
		set: 14,
		expand: "eab-icon-plus-radius-border",
		collapse: "eab-icon-minus-radius-border",
		pro: true,
	},
	{ set: 15, expand: "eab-icon-plus-fill", collapse: "eab-icon-minus-fill", pro: true },
	{ set: 16, expand: "eab-icon-disclosure-q", collapse: "eab-icon-disclosure-a", pro: true },
];
export const lightboxIconSets = [
	"eab-icon-search",
	"eab-icon-zoom-in",
	"eab-icon-fullscreen-in",
	"eab-icon-focus-view",
	"eab-icon-open-in-new-tab",
	"eab-icon-fullscreen-in-1",
	"eab-icon-preview-window",
	"eab-icon-plus-solid",
	"eab-icon-image-preview",
	"eab-icon-zoom-plus",
	"eab-icon-info-circle",
	"eab-icon-expand-box",
	"eab-icon-expand-arrows",
	"eab-icon-diagonalxpand",
	"eab-icon-eye-view",
];
export const navArrowIconSets = [
	"eab-icon-angle-right-light",
	"eab-icon-angle-right-regular",
	"eab-icon-angle-down-solid",
	"eab-icon-double-angle-right",
	"eab-icon-arrow-right-regular",
	"eab-icon-arrow-right-outline",
	"eab-icon-arrow-minimal",
	"eab-icon-angle-up-right",
	"eab-icon-double-chevron-outline",
	"eab-icon-triangle-right",
];

export const layoutTemplateIcon = {
	"vertical-accordion": [
		{
			label: "Template One",
			value: "vertical-one",
			Icon: VerticalTemplateOneIcon,
		},
		{
			label: "Template Two",
			value: "vertical-two",
			Icon: VerticalTemplateTwoIcon,
		},
		{
			label: "Template Three",
			value: "vertical-three",
			Icon: VerticalTemplateThreeIcon,
			onlyPro: true,
		},
		{
			label: "Template Four",
			value: "vertical-four",
			Icon: VerticalTemplateFourIcon,
			onlyPro: true,
		},
		{
			label: "Template Five",
			value: "vertical-five",
			Icon: VerticalTemplateFiveIcon,
			onlyPro: true,
		},
		{
			label: "Template Six",
			value: "vertical-six",
			Icon: VerticalTemplateSixIcon,
			onlyPro: true,
		},
	],
	"horizontal-accordion": [
		{
			label: "Template One",
			value: "horizontal-one",
			Icon: HorizontalTemplateOneIcon,
		},
		{
			label: "Template Two",
			value: "horizontal-two",
			Icon: HorizontalTemplateTwoIcon,
			onlyPro: true,
		},
	],
	"image-accordion": [
		{
			label: "Template One",
			value: "image-accordion-one",
			Icon: ImgAccordionTemplateOneIcon,
		},
		{
			label: "Template Two",
			value: "image-accordion-two",
			Icon: ImgAccordionTemplateTwoIcon,
			onlyPro: true,
		},
		{
			label: "Template Three",
			value: "image-accordion-three",
			Icon: ImgAccordionTemplateThreeIcon,
			onlyPro: true,
		},
		{
			label: "Template Four",
			value: "image-accordion-four",
			Icon: ImgAccordionTemplateFourIcon,
			onlyPro: true,
		},
	],
	"accordion-slider": [
		{
			label: "Template One",
			value: "accordion-slider-one",
			Icon: AccordionSliderTemplateOneIcon,
		},
		{
			label: "Template Two",
			value: "accordion-slider-two",
			Icon: AccordionSliderTemplateTwoIcon,
		},
		{
			label: "Template Three",
			value: "accordion-slider-three",
			Icon: AccordionSliderTemplateThreeIcon,
		},
	],
	"post-accordion": [
		{
			label: "Template One",
			value: "post-accordion-one",
			Icon: PostAccordionTemplateOneIcon,
		},
		{
			label: "Template Two",
			value: "post-accordion-two",
			Icon: PostAccordionTemplateTwoIcon,
			onlyPro: true,
		},
		{
			label: "Template Three",
			value: "post-accordion-three",
			Icon: PostAccordionTemplateThreeIcon,
			onlyPro: true,
		},
		{
			label: "Template Four",
			value: "post-accordion-four",
			Icon: PostAccordionTemplateFourIcon,
			onlyPro: true,
		},
	],
	"product-accordion": [
		{
			label: "Template One",
			value: "product-accordion-one",
			Icon: ProductAccordionTemplateOneIcon,
		},
		{
			label: "Template Two",
			value: "product-accordion-two",
			Icon: ProductAccordionTemplateTwoIcon,
			onlyPro: true,
		},
		{
			label: "Template Three",
			value: "product-accordion-three",
			Icon: ProductAccordionTemplateThreeIcon,
			onlyPro: true,
		},
		{
			label: "Template Four",
			value: "product-accordion-four",
			Icon: ProductAccordionTemplateFourIcon,
			onlyPro: true,
		},
	],
	"sidebar-tab-accordion": [
		{
			label: "Template One",
			value: "sidebar-tab-accordion-one",
			Icon: SidebarAccordionTemplateOneIcon,
		},
		{
			label: "Template Two",
			value: "sidebar-tab-accordion-two",
			Icon: SidebarAccordionTemplateTwoIcon,
			onlyPro: true,
		},
	],
};

// admin dashboard constants.
export const defaultDashboardSettings = {
	// modules.
	modules: {
		generate_faqs_with_ai: {
			is_active: true,
		},
		saved_templates: {
			is_active: true,
		},
		pattern_library: {
			is_active: true,
		},
	},
	// integrations.
	integrations: {
		gemini: {
			is_active: true,
			model: "gemini-3.1-flash-lite-preview",
			api_key: "",
			max_token: 2000,
		},
		google_recaptcha: {
			is_active: true,
			site_key_v2: "",
			secret_key_v2: "",
			site_key_v3: "",
			secret_key_v3: "",
		},
	},
};
