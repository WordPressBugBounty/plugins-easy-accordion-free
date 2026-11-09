import { __ } from "@wordpress/i18n";
import { AI_DEFAULT_MODELS } from "@easy-accordion/constants";
import {
	ClaudeIntegrationIcon,
	GeminiIcon,
	GroqIntegrationIcon,
	OpenAIIntegrationIcon,
} from "../../integrations/icons";

/**
 * Provider cards on the AI Configuration tab, in display order.
 *
 * `slug` is the key under integrations.<slug>. `workspaceField` is Anthropic
 * only — an organization-level key needs a workspace id.
 */
export const AI_PROVIDER_CONFIG = [
	{
		slug: "anthropic",
		label: __("Anthropic (Claude)", "easy-accordion-free"),
		name: "Anthropic",
		Icon: ClaudeIntegrationIcon,
		defaultModel: AI_DEFAULT_MODELS.anthropic,
		keyUrl: "https://console.anthropic.com/settings/keys",
		workspaceField: {
			label: __("Workspace ID", "easy-accordion-free"),
			placeholder: __("Optional — only for organization-level keys", "easy-accordion-free"),
			help: __(
				"Leave empty when your API key belongs to a workspace. Required only if Anthropic replies that the key is not scoped to a workspace.",
				"easy-accordion-free"
			),
			link: {
				url: "https://console.anthropic.com/settings/workspaces",
				label: __("Find your workspace ID.", "easy-accordion-free"),
			},
		},
	},
	{
		slug: "gemini",
		label: __("Google Gemini", "easy-accordion-free"),
		name: "Gemini",
		Icon: GeminiIcon,
		defaultModel: AI_DEFAULT_MODELS.gemini,
		keyUrl: "https://aistudio.google.com/app/api-keys",
	},
	{
		slug: "openai",
		label: __("OpenAI (ChatGPT)", "easy-accordion-free"),
		name: "OpenAI",
		Icon: OpenAIIntegrationIcon,
		defaultModel: AI_DEFAULT_MODELS.openai,
		keyUrl: "https://platform.openai.com/api-keys",
	},
	{
		slug: "groq",
		label: __("Groq", "easy-accordion-free"),
		name: "Groq",
		Icon: GroqIntegrationIcon,
		defaultModel: AI_DEFAULT_MODELS.groq,
		keyUrl: "https://console.groq.com/keys",
	},
];

/**
 * Whether a provider is connected the way AI::is_connected() decides it — not
 * switched off, and a stored key or a WordPress Connectors credential.
 *
 * @param {Object} settings     Dashboard settings.
 * @param {Object} aiConnectors `dashboardInfo.aiConnectors`.
 * @param {string} slug         Provider slug.
 * @return {boolean} Connected.
 */
export const isProviderConnected = (settings, aiConnectors, slug) => {
	const saved = settings?.integrations?.[slug] || {};
	return false !== saved.is_active && (!!saved.api_key || !!aiConnectors?.[slug]?.connected);
};

/**
 * The provider AI::provider_order() puts first on Auto: the stored Primary
 * while it is connected, else the first connected one in the server's
 * registry order.
 *
 * @param {Object}   settings     Dashboard settings.
 * @param {Object}   aiConnectors `dashboardInfo.aiConnectors`.
 * @param {string[]} order        `dashboardInfo.aiProviderOrder`.
 * @return {string} Provider slug, or "" when nothing is connected.
 */
export const resolvePrimaryProvider = (settings, aiConnectors, order) => {
	const isConnected = (slug) => isProviderConnected(settings, aiConnectors, slug);
	const stored = settings?.ai_primary_provider || "";
	if (stored && isConnected(stored)) {
		return stored;
	}
	return (order || AI_PROVIDER_CONFIG.map(({ slug }) => slug)).find(isConnected) || "";
};
