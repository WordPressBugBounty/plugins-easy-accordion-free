module.exports = {
	root: true,
	extends: ["plugin:@wordpress/eslint-plugin/recommended"],

	env: {
		browser: true,
		es6: true,
		node: true,
	},

	ignorePatterns: [
		"node_modules/",
		"Blocks/build/",
		"admin/BlocksSettings/build/",
		"build/",
		"*.min.js",
		"public",
		"admin/js",
		"admin/views",
	],

	rules: {
		camelcase: "off",
		"prettier/prettier": "off",
		"@wordpress/no-global-event-listener": "off",
		"import/no-unresolved": "off",
		"react/jsx-curly-spacing": "off",
		"react-hooks/exhaustive-deps": "off", // dependency warning off. 
		// quotes: [
		// 	"error",
		// 	"double",
		// 	{ allowTemplateLiterals: true, avoidEscape: true },
		// ],
		quotes: "off",
		"quote-props": ["error", "as-needed"],

		"jsx-a11y/click-events-have-key-events": "off",
		"jsx-a11y/no-static-element-interactions": "off",

		"@wordpress/i18n-text-domain": [
			"error",
			{ allowedTextDomain: "easy-accordion-free" },
		],
		"object-shorthand": ["error", "always"],
		"space-before-function-paren": [
			"error",
			{
				anonymous: "always",
				named: "never",
				asyncArrow: "always",
			},
		],
	},

	overrides: [
		{
			files: [
				"src/**/*.{js,jsx,ts,tsx}"
			],
			rules: {
				"object-shorthand": ["error", "always"],
				"quote-props": ["error", "as-needed"],
			},
		},
		{
			files: [
				"src/**/styling.{js,jsx,ts,tsx}",
				"src/**/inline-styles.{js,jsx,ts,tsx}",
			],
			rules: {
				"object-shorthand": ["error", "always"],
				"quote-props": ["error", "as-needed"],
			},
		},
	],

	globals: {
		wp: "readonly",
		React: "readonly",
		ReactDOM: "readonly",
		sp_eab_localize_data: "readonly",
		sp_eab_admin_dashboard_localize: "readonly",
		sp_easy_accordion_pro: "readonly",
	},
};