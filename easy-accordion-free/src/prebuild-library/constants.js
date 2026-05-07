/**
 * Constants for Smart Design Library
 */

// API Endpoints
export const API_ENDPOINTS = {
	PATTERNS: "/eap-accordion/v2/get_premade_patterns",
	WISHLIST: "/eap-accordion/v2/save_wishlist_item",
	SINGLE_PATTERN: "https://demo.easyaccordion.io/wp-json/easy-accordion/v1/single-pattern",
	UPGRADE_URL: "https://easyaccordion.io/pricing/",
};

// CSS Classes
export const CSS_CLASSES = {
	MODAL: "sp-eap-patterns-builder-modal",
	POPUP_OPEN: "sp-eap-patterns-popup-open",
	TOOLBAR_LIBRARY: "sp-eap-patterns-toolbar-design-library",
	PATTERN_GRID: "sp-eap-pattern-grid",
	PATTERN_COL2: "sp-eap-pattern-col2",
	PATTERN_COL3: "sp-eap-pattern-col3",
};

// Default Values
export const DEFAULTS = {
	COLUMN: "3",
	SEARCH_QUERY: "",
	TREND: "default",
	FREE_PRO: "all",
	DEBOUNCE_DELAY: 200,
	SKELETON_COUNT: 25,
};

// Keyboard Keys
export const KEYBOARD_KEYS = {
	ESCAPE: 27,
	ENTER: "Enter",
	SPACE: " ",
};

// Filter Options
export const FILTER_OPTIONS = {
	TREND: [
		{ value: "default", label: "Sort By" },
		{ value: "popular", label: "Popular" },
		{ value: "latest", label: "Latest" },
	],
};
