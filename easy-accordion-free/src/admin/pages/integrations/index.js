import { __ } from "@wordpress/i18n";
import {
	BeaverIntegrationIcon,
	BricksIntegrationIcon,
	ChatGPTIcon,
	DiviIntegrationIcon,
	ElementorIntegrationIcon,
	GeminiIcon,
	GoogleRecaptchaIcon,
	OxygenIntegrationIcon,
	WPBakeryIntegrationIcon,
} from "./icons";
import RenderModuleCard from "../modules/render";

const integrationsItems = [
	{
		id: 1,
		Icon: GeminiIcon,
		key: "gemini",
		label: "Google Gemini",
		desc: __(
			"Configure API key and token to enable AI-powered FAQ generation from your content, keywords, or custom prompts.",
			"easy-accordion-free"
		),
		videoLink: "https://www.youtube.com/watch?v=bRVTr1kki1w",
		docLink: "https://easyaccordion.io/docs/google-gemini/",
	},
	// upcoming.
	{
		upcoming: true,
		id: 2,
		Icon: GoogleRecaptchaIcon,
		key: "google_recaptcha",
		label: "Google reCAPTCHA",
		desc: __(
			"Add site key and secret key to protect forms from spam and ensure secure, verified user submissions.",
			"easy-accordion-free"
		),
		videoLink: "https://www.youtube.com/watch?v=O_-HQWS3SnI",
		docLink: "https://easyaccordion.io/docs/google-recaptcha/",
	},
	{
		upcoming: true,
		id: 3,
		Icon: ChatGPTIcon,
		key: "chatgpt",
		label: "ChatGPT",
		desc: __(
			"Easy Accordion integrates ChatGPT into the WordPress Dashboard, allowing you to generate content effortlessly.",
			"easy-accordion-free"
		),
		videoLink: "#",
		docLink: "#",
	},
];

const pageBuilderAddons = [
	{
		id: 1,
		key: "elementor",
		label: "Elementor",
		Icon: ElementorIntegrationIcon,
		desc: __(
			"This addon lets you use Easy Accordion Gutenberg blocks in Elementor by generating reusable shortcodes from saved templates.",
			"easy-accordion-free"
		),
		// demoLink: "#",
		docLink:
			"https://easyaccordion.io/docs/page-builder-integrations/easy-accordion-pro-with-elementor-elementor-pro/",
	},
	{
		id: 2,
		key: "divi",
		label: "Divi",
		Icon: DiviIntegrationIcon,
		desc: __(
			"This addon lets you use Easy Accordion Gutenberg blocks in Divi by generating reusable shortcodes from saved templates.",
			"easy-accordion-free"
		),
		// demoLink: "#",
		docLink: "https://easyaccordion.io/docs/page-builder-integrations/integrate-with-divi/",
	},
	{
		id: 3,
		key: "wpbakery",
		label: "WPBakery",
		Icon: WPBakeryIntegrationIcon,
		desc: __(
			"This addon lets you use Easy Accordion Gutenberg blocks in WPBakery by generating reusable shortcodes from saved templates.",
			"easy-accordion-free"
		),
		// demoLink: "#",
		docLink: "https://easyaccordion.io/docs/page-builder-integrations/integrate-with-wpbakery/",
	},
	{
		id: 5,
		key: "beaver",
		label: "Beaver Builder",
		Icon: BeaverIntegrationIcon,
		desc: __(
			"This addon lets you use Easy Accordion Gutenberg blocks in Beaver by generating reusable shortcodes from saved templates.",
			"easy-accordion-free"
		),
		// demoLink: "#",
		docLink: "https://easyaccordion.io/docs/page-builder-integrations/integrate-with-beaver-builder/",
	},
	{
		id: 6,
		key: "bricks",
		label: "Bricks",
		Icon: BricksIntegrationIcon,
		desc: __(
			"This addon lets you use Easy Accordion Gutenberg blocks in Bricks by generating reusable shortcodes from saved templates.",
			"easy-accordion-free"
		),
		// demoLink: "#",
		docLink: "https://easyaccordion.io/docs/page-builder-integrations/integrate-with-bricks/",
	},
	{
		id: 4,
		key: "oxygen",
		label: "Oxygen",
		Icon: OxygenIntegrationIcon,
		desc: __(
			"This addon lets you use Easy Accordion Gutenberg blocks in Oxygen by generating reusable shortcodes from saved templates.",
			"easy-accordion-free"
		),
		// demoLink: "#",
		docLink: "https://easyaccordion.io/docs/page-builder-integrations/integrate-with-oxygen/",
	},
];

const Integrations = () => {
	return (
		<div className="sp-eap-integrations-page">
			<div className="eap-dashboard-page-header">
				<span className="eap-dashboard-page-header__label">
					{__("API Integrations", "easy-accordion-free")}
				</span>
			</div>
			<RenderModuleCard items={integrationsItems} optionKey="integrations" />
			{/* upcoming integrations */}
			<div className="eap-dashboard-page-header eap-upcoming-modules">
				<span className="eap-dashboard-page-header__label">
					{__("Page Builder Addons", "easy-accordion-free")}
				</span>
			</div>
			<RenderModuleCard items={pageBuilderAddons} optionKey="integrations" type="page-builder" />
		</div>
	);
};

export default Integrations;
