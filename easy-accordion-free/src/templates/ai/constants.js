import { __ } from "@wordpress/i18n";

/** FAQ counts the modal offers; counts above FREE_MAX_FAQS are Pro only. */
export const FAQ_COUNTS = [1, 3, 5, 10, 15, 20];

/** Most FAQs one free run writes — mirrors FAQ_Generator::MAX_FAQS. */
export const FREE_MAX_FAQS = Number(window.sp_eab_localize_data?.aiSettings?.maxFaqs) || 5;

/**
 * Block attribute value marking an accordion that already used its free AI
 * run (`generatedFaqItems`).
 */
export const FREE_RUN_USED = "5";

/** Where the free plugin's upgrade links point. */
export const UPGRADE_URL = "https://easyaccordion.io/pricing/?ref=1";

/** Form state of a fresh modal. */
export const DEFAULT_FORM = {
	keywords: "",
	prompt: "",
	count: "5",
	language: "english",
	tone: "balanced",
};

/** Source limits — mirror FAQ_Sources::MAX_POSTS / MAX_URLS / MAX_FILES. */
export const MAX_POSTS = 10;
export const MAX_URLS = 5;
export const MAX_FILES = 5;

/** Text files the browser reads and sends; the server compresses them to its budget. */
export const FILE_ACCEPT = ".txt,.md,.markdown,.csv,.json,.html,.htm";
export const FILE_MAX_BYTES = 2 * 1024 * 1024;
export const FILE_MAX_CHARS = 60000;

/** Most existing questions sent so the model skips them (FAQ_Generator::MAX_EXISTING). */
export const MAX_EXISTING = 30;

/** Source chips: label and colour per type. */
export const SOURCE_TYPES = {
	page: { label: __("Page", "easy-accordion-free"), color: "#E040A0" },
	post: { label: __("Post", "easy-accordion-free"), color: "#7B3FE4" },
	product: { label: __("Product", "easy-accordion-free"), color: "#A020C0" },
	url: { label: __("URL", "easy-accordion-free"), color: "#1567FF" },
	file: { label: __("File", "easy-accordion-free"), color: "#F08C00" },
};

/** Prompts offered while the prompt field is focused and empty. */
export const PROMPT_SUGGESTIONS = [
	__("Focus on questions first-time customers may ask", "easy-accordion-free"),
	__("Generate clear, beginner-friendly FAQs with concise answers", "easy-accordion-free"),
	__("Generate helpful FAQs that build customer trust and reduce confusion", "easy-accordion-free"),
	__("Prioritize practical customer concerns and buying decisions", "easy-accordion-free"),
	__("Create FAQs that help reduce customer support requests", "easy-accordion-free"),
];

/**
 * "Replace with …" is applied in the browser — the text after it becomes the
 * new question or answer, and no AI request is made.
 */
export const REPLACE_PREFIX = `${__("Replace with", "easy-accordion-free")} `;

/** Rewrite chips per field: [ label, instruction ]. */
export const REWRITE_CHIPS = {
	question: [
		[__("Shorter", "easy-accordion-free"), __("Make this shorter", "easy-accordion-free")],
		[__("Clearer", "easy-accordion-free"), __("Make this question clearer", "easy-accordion-free")],
		[__("More Casual", "easy-accordion-free"), __("Make this more casual", "easy-accordion-free")],
		[__("SEO Friendly", "easy-accordion-free"), __("Make this SEO friendly with keywords", "easy-accordion-free")],
		[__("Replace with…", "easy-accordion-free"), REPLACE_PREFIX],
	],
	answer: [
		[__("Shorter", "easy-accordion-free"), __("Make this shorter", "easy-accordion-free")],
		[__("More Casual", "easy-accordion-free"), __("Make this more casual", "easy-accordion-free")],
		[__("More Details", "easy-accordion-free"), __("Add more details", "easy-accordion-free")],
		[__("Replace with…", "easy-accordion-free"), REPLACE_PREFIX],
	],
};

/** Language and tone lists, localized from FAQ_Generator::options(). */
export const getLanguageOptions = () =>
	window.sp_eab_localize_data?.aiSettings?.languages || [{ value: "english", label: "English" }];

export const getToneOptions = () =>
	window.sp_eab_localize_data?.aiSettings?.tones || [
		{ value: "balanced", label: __("Balanced", "easy-accordion-free") },
	];
