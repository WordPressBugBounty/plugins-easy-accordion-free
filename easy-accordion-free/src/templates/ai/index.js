import { __, sprintf } from "@wordpress/i18n";
import apiFetch from "@wordpress/api-fetch";
import { createBlock } from "@wordpress/blocks";
import { store as blockEditorStore } from "@wordpress/block-editor";
import { Modal } from "@wordpress/components";
import { useInstanceId } from "@wordpress/compose";
import { useDispatch, useRegistry } from "@wordpress/data";
import { memo, useMemo, useState } from "@wordpress/element";
import { getAiModelOptions, getSavedAiModel } from "@easy-accordion/constants";
import PromptForm from "./PromptForm";
import ResultsStep from "./ResultsStep";
import WarningMessage from "./WarningMessage";
import { AiLogo, CloseIcon, SparkleIcon } from "./icon";
import { DEFAULT_FORM, FREE_MAX_FAQS, FREE_RUN_USED } from "./constants";
import { answerToParagraphs, getExistingQuestions, getReplacement, isPlaceholderItem, stripTags } from "./utils";
import "./editor.scss";

/**
 * Generate FAQs with AI.
 *
 * Step one collects the brief (sources, keywords, prompt, count, language,
 * tone, model); step two lists the FAQs to pick, edit or rewrite before they
 * become accordion items. Everything AI happens server-side
 * (`/easy-accordion/v2/ai-generate-faqs` and `/ai-rewrite-faq`, FAQ_Generator)
 * with the providers connected under Settings → AI Configuration — no key
 * reaches the browser.
 *
 * Credits are only spent on purpose: closing the modal keeps the form and the
 * unused results, "Replace with…" rewrites and answer edits never call the
 * AI, and the accordion's existing questions are sent so none is written
 * twice.
 *
 * The free version runs once per accordion, up to FREE_MAX_FAQS FAQs: a
 * successful run sets the block's `generatedFaqItems` attribute, and the
 * FAQs of that run stay available to insert until they are used.
 *
 * @param {Object}   props
 * @param {string}   props.parentId          Accordion block the FAQs are added to.
 * @param {string}   props.childName         Child block each FAQ becomes.
 * @param {string}   props.generatedFaqItems The accordion's free-run marker.
 * @param {Function} props.setAttributes     Accordion attribute setter.
 * @return {JSX.Element} Trigger button and modal.
 */
const GenerateFaqsWithAI = ({
	parentId,
	childName = "sp-easy-accordion-pro/accordion-item",
	generatedFaqItems = "0",
	setAttributes,
}) => {
	const providers = useMemo(() => window.sp_eab_localize_data?.aiProviders || [], []);
	const titleId = useInstanceId(GenerateFaqsWithAI, "eab-ai-faq-title");
	const registry = useRegistry();
	const { insertBlocks, removeBlocks } = useDispatch(blockEditorStore);

	const [isOpen, setIsOpen] = useState(false);
	const [step, setStep] = useState("form");
	const [form, setForm] = useState(DEFAULT_FORM);
	const [sources, setSources] = useState([]);
	const [sourceError, setSourceError] = useState("");
	// Opens on the Primary (listed first) with its saved model.
	const [provider, setProvider] = useState(providers[0]?.slug || "");
	const [model, setModel] = useState(() => getSavedAiModel(providers[0]));
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [notice, setNotice] = useState("");
	const [results, setResults] = useState([]);

	const limitReached = FREE_RUN_USED === generatedFaqItems;
	const hasBrief = !!(form.prompt.trim() || form.keywords.trim() || sources.length);
	const canGenerate = !loading && providers.length > 0 && hasBrief && !limitReached;

	const onFieldChange = (name, value) => setForm((current) => ({ ...current, [name]: value }));

	const modelOptions = useMemo(
		() => getAiModelOptions(providers.find(({ slug }) => slug === provider)),
		[providers, provider]
	);

	const onProviderChange = (slug) => {
		setProvider(slug);
		setModel(getSavedAiModel(providers.find((row) => row.slug === slug)));
		setError("");
	};

	const generate = async () => {
		if (!canGenerate) {
			return;
		}

		setError("");
		setNotice("");
		setLoading(true);
		try {
			const response = await apiFetch({
				path: "/easy-accordion/v2/ai-generate-faqs",
				method: "POST",
				data: {
					prompt: form.prompt.trim(),
					keywords: form.keywords.trim(),
					numberOfFaqs: Math.min(parseInt(form.count, 10) || 5, FREE_MAX_FAQS),
					language: form.language,
					tone: form.tone,
					postIds: sources.filter((source) => source.id).map((source) => source.id),
					urls: sources.filter((source) => "url" === source.type).map((source) => source.name),
					files: sources
						.filter((source) => "file" === source.type)
						.map(({ name, content }) => ({ name, content })),
					existing: getExistingQuestions(registry.select(blockEditorStore).getBlocks(parentId), childName),
					provider,
					model,
				},
			});

			const faqs = Array.isArray(response?.faqs) ? response.faqs : [];
			if (!faqs.length) {
				setError(__("The AI could not write FAQs from this brief.", "easy-accordion-free"));
				return;
			}

			setResults(
				faqs.map((faq, index) => ({ id: index, question: faq.question, answer: faq.answer, checked: false }))
			);
			// This accordion's free run is used.
			setAttributes?.({ generatedFaqItems: FREE_RUN_USED });
			if (response.skipped?.length) {
				setNotice(
					sprintf(
						/* translators: %s: comma-separated source names */
						__("Some sources could not be read and were left out: %s", "easy-accordion-free"),
						response.skipped.join(", ")
					)
				);
			}
			setStep("results");
		} catch (requestError) {
			setError(
				requestError?.message ||
					__("Something went wrong while talking to the AI provider.", "easy-accordion-free")
			);
		} finally {
			setLoading(false);
		}
	};

	// "Replace with …" is applied here; anything else is one small AI request.
	const rewrite = async (item, field, instruction) => {
		const replacement = getReplacement(instruction);
		if (replacement) {
			return "question" === field ? stripTags(replacement) : replacement;
		}

		const response = await apiFetch({
			path: "/easy-accordion/v2/ai-rewrite-faq",
			method: "POST",
			data: {
				field: "question" === field ? "q" : "a",
				question: stripTags(item.question),
				answer: item.answer,
				instruction,
				language: form.language,
				provider,
				model,
			},
		});
		if (!response?.text) {
			throw new Error(__("The AI could not rewrite this.", "easy-accordion-free"));
		}
		return response.text;
	};

	const updateResult = (id, patch) =>
		setResults((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));

	const addSelected = () => {
		const picked = results.filter((item) => item.checked);
		if (!picked.length) {
			return;
		}

		const blocks = picked.map(({ question, answer }) =>
			createBlock(
				childName,
				{ accordionTitle: question },
				answerToParagraphs(answer).map((content) => createBlock("core/paragraph", { content }))
			)
		);

		// A fresh accordion's untouched placeholder items give way to the FAQs.
		const items = registry
			.select(blockEditorStore)
			.getBlocks(parentId)
			.filter((block) => block.name === childName);
		const placeholders = items.length && items.every(isPlaceholderItem) ? items.map((block) => block.clientId) : [];

		insertBlocks(blocks, undefined, parentId, false);
		if (placeholders.length) {
			removeBlocks(placeholders, false);
		}

		setResults([]);
		setNotice("");
		setStep("form");
		setIsOpen(false);
	};

	const isResults = "results" === step && results.length > 0;
	const title = isResults
		? __("AI Generated FAQs", "easy-accordion-free")
		: __("AI FAQ Generation", "easy-accordion-free");

	return (
		<div className="eab-ai-faq">
			<div className="eab-ai-faq-trigger-wrap">
				<button type="button" className="eab-ai-faq-trigger" onClick={() => setIsOpen(true)}>
					{__("Generate FAQs", "easy-accordion-free")}
					<SparkleIcon />
				</button>
			</div>

			{isOpen && (
				<Modal
					className="eab-ai-faq-modal"
					overlayClassName="eab-ai-faq-overlay"
					onRequestClose={() => setIsOpen(false)}
					__experimentalHideHeader
					aria={{ labelledby: titleId }}
				>
					<button
						type="button"
						className="eab-ai-faq-modal__close"
						onClick={() => setIsOpen(false)}
						aria-label={__("Close", "easy-accordion-free")}
					>
						<CloseIcon />
					</button>

					<div className="eab-ai-faq-modal__header">
						<AiLogo done={isResults} />
						<div className="eab-ai-faq-modal__heading">
							<h2 id={titleId} className="eab-ai-faq-modal__title">
								{title}
							</h2>
							{!isResults && (
								<p className="eab-ai-faq-modal__sub">
									{__("Faster FAQ Creation, Better User Experience", "easy-accordion-free")}
								</p>
							)}
						</div>
					</div>

					{0 === providers.length && (
						<WarningMessage
							message={__("Connect an AI provider to generate FAQs.", "easy-accordion-free")}
							showConnectors
						/>
					)}
					{error && <WarningMessage message={error} />}
					{isResults && notice && <WarningMessage message={notice} tone="info" showLinks={false} />}

					{isResults ? (
						<ResultsStep
							results={results}
							onUpdate={updateResult}
							onSelectAll={(checked) =>
								setResults((current) => current.map((item) => ({ ...item, checked })))
							}
							onRewrite={rewrite}
							onBack={() => {
								setError("");
								setStep("form");
							}}
							onAdd={addSelected}
						/>
					) : (
						<PromptForm
							form={form}
							onFieldChange={onFieldChange}
							sources={sources}
							onSources={setSources}
							sourceError={sourceError}
							onSourceError={setSourceError}
							providers={providers}
							provider={provider}
							onProviderChange={onProviderChange}
							modelOptions={modelOptions}
							model={model}
							onModelChange={(value) => {
								setModel(value);
								setError("");
							}}
							loading={loading}
							canGenerate={canGenerate}
							onGenerate={generate}
							resultCount={results.length}
							onShowResults={() => {
								setError("");
								setStep("results");
							}}
							limitReached={limitReached}
						/>
					)}
				</Modal>
			)}
		</div>
	);
};

export default memo(GenerateFaqsWithAI);
