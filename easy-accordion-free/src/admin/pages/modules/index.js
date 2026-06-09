import { __ } from "@wordpress/i18n";
import {
	AccordionFeaturedIcon,
	AccordionItemSubtitles,
	AdvancedPostQueryBuilderIcon,
	AJAXFAQSearchIcon,
	AJAXFormSubmissionIcon,
	AJAXPaginationsIcon,
	BuiltinProTemplatesIcon,
	ContentAnimationsIcon,
	ContentinCollapsedStateIcon,
	CustomReadMoreButtonIcon,
	EmailNotificationAndApprovalIcon,
	ExpandedAreaWidthControlIcon,
	ExportImportModuleIcon,
	ExtensiveCustomIconLibraryIcon,
	FAQAnalyticsIcon,
	FAQContentEqualHeightIcon,
	FAQTitleBadgesIcon,
	FAQTitleCustomLinkingIcon,
	FAQTitlePrefixSuffixIcon,
	FrontendLiveTaxonomyFilterIcon,
	GenerateFaqsWithAIIcon,
	GlobalToggleAllButtonIcon,
	ImageAccordionLightboxIcon,
	ImageFlipFocalPointIcon,
	ImageHoverEffectsIcon,
	InfiniteScrollPaginationIcon,
	MotionEffectsAnimationsIcon,
	MultilevelAccordionModuleIcon,
	MultipleUserFAQFormsIcon,
	OneClickFAQCloseButtonIcon,
	PatternLibraryIcon,
	PerItemCustomizationControlsIcon,
	PostProductMetaDisplayIcon,
	ProIndicatorButtonIcon,
	ReadyPatternsLibraryIcon,
	SaveTemplatesIcon,
	SEOSChemaMarkupModuleIcon,
	SpamProtectionreCAPTCHAIcon,
	WooCommerceProductFAQsIcon,
} from "./icons";
import RenderModuleCard from "./render";

const ModulesItems = [
	{
		id: 3,
		Icon: GenerateFaqsWithAIIcon,
		key: "generate_faqs_with_ai",
		label: __("Generate FAQs with AI", "easy-accordion-free"),
		desc: __(
			"Automatically generate relevant FAQs from your content, keywords, or Prompts to save time and streamline content creation.",
			"easy-accordion-free"
		),
		videoLink: "https://www.youtube.com/watch?v=xYL2HC6acgA",
		docLink: "https://easyaccordion.io/docs/generate-faqs-with-ai/",
	},
	{
		id: 8,
		Icon: SaveTemplatesIcon,
		key: "saved_templates",
		label: __("Saved Templates", "easy-accordion-free"),
		desc: __(
			"Create unlimited templates by converting Gutenberg blocks into shortcodes for use anywhere, including Elementor, Divi, etc.",
			"easy-accordion-free"
		),
		videoLink: "https://www.youtube.com/watch?v=HsbKNZ6NDKM",
		docLink: "https://easyaccordion.io/docs/saved-templates/",
	},
	{
		id: 7,
		Icon: PatternLibraryIcon,
		key: "pattern_library",
		label: __("Ready Patterns Library", "easy-accordion-free"),
		desc: __(
			"Access a large collection of pre-designed patterns to build layouts faster with consistent design quality.",
			"easy-accordion-free"
		),
		demoLink: "https://easyaccordion.io/patterns/",
		docLink: "https://easyaccordion.io/docs/ready-patterns-library/",
	},
	{
		id: 1,
		Icon: SEOSChemaMarkupModuleIcon,
		key: "seo_schema_markup",
		label: __("SEO Schema Markup", "easy-accordion-free"),
		desc: __(
			"This allows you to add structured FAQ schema, improving search visibility and increasing clicks with rich results.",
			"easy-accordion-free"
		),
		videoLink: "",
		docLink: "https://easyaccordion.io/docs/seo-schema-markup/",
	},
	{
		id: 2,
		Icon: MultilevelAccordionModuleIcon,
		label: __("Multi-Level Accordions", "easy-accordion-free"),
		desc: __(
			"This enables you to organize complex content with nested accordions for better structure and navigation.",
			"easy-accordion-free"
		),
		demoLink: "https://easyaccordion.io/multi-leve-accoridons/",
		docLink: "https://easyaccordion.io/docs/how-to-create-multi-level-or-nested-faq-accordion/",
	},
	{
		id: 6,
		Icon: ExportImportModuleIcon,
		key: "eap_tools",
		label: __("Export / Import FAQs", "easy-accordion-free"),
		desc: __(
			"This enables you to transfer FAQs across websites easily, saving time during migration, backup, or content duplication.",
			"easy-accordion-free"
		),
		videoLink: "https://www.youtube.com/watch?v=Yjycl8tAvIU",
		docLink: "https://easyaccordion.io/docs/export-import-faqs/",
	},
];

const proFeatureList = [
	{
		id: 1,
		Icon: BuiltinProTemplatesIcon,
		label: __("25+ Built-in Pro Templates", "easy-accordion-free"),
		desc: __(
			"Access professionally designed templates to quickly build attractive accordion layouts without starting from scratch.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 2,
		Icon: FAQTitlePrefixSuffixIcon,
		label: __("FAQ Title Prefix & Suffix", "easy-accordion-free"),
		desc: __(
			"Add custom text before or after titles to improve clarity and guide users through structured content.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 3,
		Icon: FAQTitleBadgesIcon,
		label: __("FAQ Title Badges", "easy-accordion-free"),
		desc: __(
			"Highlight important FAQs with badges, helping users quickly identify featured or critical information within content.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 4,
		Icon: AccordionItemSubtitles,
		label: __("Accordion Item Subtitles", "easy-accordion-free"),
		desc: __(
			"Add descriptive subtitles to each item, providing additional context and improving readability for better understanding.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 5,
		Icon: AccordionFeaturedIcon,
		label: __("Accordion Featured Icon", "easy-accordion-free"),
		desc: __(
			"Enhance accordion titles with icons to improve visual appeal and make content easier to scan quickly.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 6,
		Icon: AccordionFeaturedIcon,
		label: __("Item Anchor Links", "easy-accordion-free"),
		desc: __(
			"Automatically generate unique anchor links for each item, enabling direct navigation using the item title or ID for easy sharing.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 7,
		Icon: AJAXFAQSearchIcon,
		label: __("AJAX FAQ Search", "easy-accordion-free"),
		desc: __(
			"Enable instant FAQ search with real-time results, improving usability without requiring page reloads.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 8,
		Icon: FrontendLiveTaxonomyFilterIcon,
		label: __("Frontend Live Taxonomy Filter", "easy-accordion-free"),
		desc: __(
			"Allow users to filter FAQs dynamically by categories or tags, improving content discovery and navigation.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 9,
		Icon: FAQAnalyticsIcon,
		label: __("FAQ Analytics", "easy-accordion-free"),
		desc: __(
			"Monitor FAQ clicks and impressions to understand user behavior and measure content performance effectively.",
			"easy-accordion-free"
		),
		videoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 10,
		Icon: WooCommerceProductFAQsIcon,
		label: __("WooCommerce Product FAQs", "easy-accordion-free"),
		desc: __(
			"Add FAQs directly to WooCommerce product pages to reduce customer doubts and increase conversions with clear information.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 11,
		Icon: MotionEffectsAnimationsIcon,
		label: __("Motion Effects & Animations", "easy-accordion-free"),
		desc: __(
			"Add modern motion effects and interactive behaviors to create engaging and visually dynamic user experiences.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 12,
		Icon: MultipleUserFAQFormsIcon,
		label: __("Multiple User FAQ Forms", "easy-accordion-free"),
		desc: __(
			"Allow users to submit FAQs from the frontend, helping collect user-generated content efficiently.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 13,
		Icon: SpamProtectionreCAPTCHAIcon,
		label: __("Spam Protection (reCAPTCHA)", "easy-accordion-free"),
		desc: __(
			"Protect forms from spam submissions using Google reCAPTCHA, ensuring secure and reliable data collection.",
			"easy-accordion-free"
		),
		videoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 14,
		Icon: FAQContentEqualHeightIcon,
		label: __("FAQ Content Equal Height", "easy-accordion-free"),
		desc: __(
			"Maintain consistent height across accordion items for a balanced layout and improved visual presentation.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 15,
		Icon: ContentinCollapsedStateIcon,
		label: __("Content in Collapsed State", "easy-accordion-free"),
		desc: __(
			"Show partial content in collapsed items to encourage interaction while maintaining a clean and compact layout.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 16,
		Icon: GlobalToggleAllButtonIcon,
		label: __("Global Toggle All Button", "easy-accordion-free"),
		desc: __(
			"Enable users to expand or collapse all accordion items at once for faster navigation and better usability.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 17,
		Icon: ExtensiveCustomIconLibraryIcon,
		label: __("Extensive Custom Icon Library", "easy-accordion-free"),
		desc: __(
			"Choose from a wide range of icons to enhance design flexibility and improve visual communication within content.",
			"easy-accordion-free"
		),
		videoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 18,
		Icon: ImageAccordionLightboxIcon,
		label: __("Image Accordion Lightbox", "easy-accordion-free"),
		desc: __(
			"Open images in a popup view for distraction-free browsing and improved user focus on visual content.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 19,
		Icon: OneClickFAQCloseButtonIcon,
		label: __("One-Click FAQ Close Button", "easy-accordion-free"),
		desc: __(
			"Allow users to quickly close open accordion items, improving browsing control and enhancing overall user experience.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 20,
		Icon: ContentAnimationsIcon,
		label: __("25+ Content Animations", "easy-accordion-free"),
		desc: __(
			"Apply smooth animations to accordion content, creating dynamic interactions and improving user engagement.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 21,
		Icon: ImageHoverEffectsIcon,
		label: __("Image Hover Effects", "easy-accordion-free"),
		desc: __(
			"Add interactive hover animations to images, increasing engagement and enhancing the visual experience.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 22,
		Icon: ExpandedAreaWidthControlIcon,
		label: __("Expanded Area Width Control", "easy-accordion-free"),
		desc: __(
			"Control the width of expanded content areas to improve readability and fit different layout requirements.",
			"easy-accordion-free"
		),
		videoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 23,
		Icon: ImageFlipFocalPointIcon,
		label: __("Image Flip & Focal Point", "easy-accordion-free"),
		desc: __(
			"Flip images and adjust focal points to improve visual storytelling and highlight important content areas effectively.",
			"easy-accordion-free"
		),
		videoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 24,
		Icon: CustomReadMoreButtonIcon,
		label: __("Custom Read More Button", "easy-accordion-free"),
		desc: __(
			"Add expandable content sections with customizable buttons, helping users explore more without cluttering the layout.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 25,
		Icon: PostProductMetaDisplayIcon,
		label: __("Post & Product Meta Display", "easy-accordion-free"),
		desc: __(
			"Display additional post or product metadata within accordion items to provide more context and useful information.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 26,
		Icon: PerItemCustomizationControlsIcon,
		label: __("Per-Item Customization Controls", "easy-accordion-free"),
		desc: __(
			"Customize each accordion item individually to achieve precise control over content, styling, and behavior.",
			"easy-accordion-free"
		),
		videoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 27,
		Icon: AJAXPaginationsIcon,
		label: __("AJAX Paginations", "easy-accordion-free"),
		desc: __(
			"Load content dynamically without refreshing pages, ensuring smoother browsing and improved performance.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 28,
		Icon: InfiniteScrollPaginationIcon,
		label: __("Infinite Scroll Pagination", "easy-accordion-free"),
		desc: __(
			"Automatically load additional content as users scroll, creating a seamless and uninterrupted browsing experience.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 29,
		Icon: FAQTitleCustomLinkingIcon,
		label: __("FAQ Title Custom Linking", "easy-accordion-free"),
		desc: __(
			"Link accordion titles to external or internal pages, improving navigation and directing users to relevant resources.",
			"easy-accordion-free"
		),
		videoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 30,
		Icon: AJAXFormSubmissionIcon,
		label: __("AJAX Form Submission", "easy-accordion-free"),
		desc: __(
			"Submit forms instantly without page reload, improving user experience and increasing completion rates.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 31,
		Icon: EmailNotificationAndApprovalIcon,
		label: __("Email Notification & Approval", "easy-accordion-free"),
		desc: __(
			"Send instant notifications and manage approval workflows to control and moderate submitted content effectively.",
			"easy-accordion-free"
		),
		videoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 32,
		Icon: AdvancedPostQueryBuilderIcon,
		label: __("Advanced Post Query Builder", "easy-accordion-free"),
		desc: __(
			"Fetch and display dynamic content using flexible query controls for better content management and automation.",
			"easy-accordion-free"
		),
		videoLink: "#",
		docLink: "#",
		isPro: true,
	},
	{
		id: 33,
		Icon: ReadyPatternsLibraryIcon,
		label: __("200+ Ready Patterns Library", "easy-accordion-free"),
		desc: __(
			"Access a large collection of pre-designed patterns to build layouts faster with consistent design quality.",
			"easy-accordion-free"
		),
		demoLink: "#",
		docLink: "#",
		isPro: true,
	},
];

const Modules = () => {
	return (
		<div className="sp-eap-modules-page">
			<div className="eap-dashboard-page-header sp-d-flex sp-flex-col sp-gap-10px">
				<span className="eap-dashboard-page-header__label">{__("Manage Modules", "easy-accordion-free")}</span>
				<span className="eap-dashboard-page-header__desc">
					{__(
						"Enable only the modules you need to keep your site fast and optimized.",
						"easy-accordion-free"
					)}
				</span>
			</div>
			<RenderModuleCard items={ModulesItems} optionKey="modules" />
			<div className="eap-dashboard-page-header sp-d-flex sp-align-center sp-justify-between eaf-pro-modules">
				<span className="sp-d-flex sp-flex-col sp-gap-10px">
					<span className="eap-dashboard-page-header__label">
						{__("Unlock Powerful Features with Pro!", "easy-accordion-free")}
					</span>
					<span className="eap-dashboard-page-header__desc">
						{__(
							"Upgrade now to unlock advanced features and streamline your workflow.",
							"easy-accordion-free"
						)}
					</span>
				</span>
				<a
					href="https://easyaccordion.io/pricing/?ref=1"
					target="_blank"
					rel="noreferrer"
					className="eaf-pro-modules-indicator-button sp-d-flex sp-align-center sp-gap-6px"
				>
					<ProIndicatorButtonIcon />
					{__("Upgrade to Pro", "easy-accordion-free")}
				</a>
			</div>
			<RenderModuleCard items={proFeatureList} optionKey="modules" />
		</div>
	);
};

export { ModulesItems };
export default Modules;
