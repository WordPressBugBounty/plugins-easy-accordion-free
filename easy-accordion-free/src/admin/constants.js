import { __ } from "@wordpress/i18n";
import { AdditionalCodesIcon, AdvancedIcon, IntegrationsTabIcon, KeyIcon, ToolsIcon, WooCommerceFAQsTabIcon } from "./pages/settings/icons";

export const pluginSettingOptions = [
	{
		option_name: "eap_data_remove",
		label: __("Clean-up Data on Deletion", "easy-accordion-free"),
		infoText: __(
			"Check this if you would like Easy Accordion to completely remove all of its data when the plugin is deleted.",
			"easy-accordion-free"
		),
		inputType: "checkbox",
	},
	{
		option_name: "eap_focus_style",
		label: __("Focus Style for Accessibility", "easy-accordion-free"),
		infoText: __("Check this to enable focus style to improve accessibility.", "easy-accordion-free"),
		inputType: "checkbox",
	},
	// {
	// 	option_name: "eap_editor_preference",
	// 	label: __("Default Editor", "easy-accordion-free"),
	// 	infoText: __(
	// 		"Choose which editor opens when you click 'Add New Accordion'. Pick 'Ask each time' to keep the welcome popup.",
	// 		"easy-accordion-free"
	// 	),
	// 	inputType: "select",
	// 	items: [
	// 		{
	// 			label: __("Ask each time", "easy-accordion-free"),
	// 			value: "",
	// 		},
	// 		{
	// 			label: __("Block Editor", "easy-accordion-free"),
	// 			value: "block_editor",
	// 		},
	// 		{
	// 			label: __("Classic Shortcode", "easy-accordion-free"),
	// 			value: "classic_shortcode",
	// 		},
	// 	],
	// },
];

export const pluginSettingDefaultValues = {
	advanced: {
		eap_data_remove: "0",
		eap_focus_style: "0",
		eap_editor_preference: "",
	},
	additional: {
		ea_custom_css: "",
		custom_js: "",
	},
	"woocommerce-faqs": {
		eap_woo_faq: "0",
		eap_woo_faq_label: "FAQs",
		eap_woo_faq_label_priority: "50",
		eap_woo_set_tab: [],
	},
	integrations: {},
	tools: {},
};

export const settingsTabNavigation = [
	{
		label: __("Advanced Controls", "easy-accordion-free"),
		Icon: AdvancedIcon,
		value: "advanced",
	},
	{
		label: __("WooCommerce FAQs", "easy-accordion-free"),
		Icon: WooCommerceFAQsTabIcon,
		value: "woocommerce-faqs",
	},
	{
		label: __("Integrations", "easy-accordion-free"),
		Icon: IntegrationsTabIcon,
		value: "integrations",
	},
	{
		label: __("Additional CSS & JS", "easy-accordion-free"),
		Icon: AdditionalCodesIcon,
		value: "additional",
	},
	{
		label: __("Tools", "easy-accordion-free"),
		Icon: ToolsIcon,
		value: "tools",
	},
];

export const wooFaqTypes = [
	{
		id: 1,
		label: __("All Products", "easy-accordion-free"),
		value: "all",
	},
	{
		id: 2,
		label: __("Category (Pro)", "easy-accordion-free"),
		value: "taxonomy",
		pro: true,
	},
	{
		id: 3,
		label: __("Specific Products (Pro)", "easy-accordion-free"),
		value: "Specific_Products",
		pro: true,
	},
];
