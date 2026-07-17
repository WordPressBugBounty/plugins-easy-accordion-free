import { __ } from "@wordpress/i18n";
import { useDispatch, useSelect } from "@wordpress/data";
import { RichText } from "@wordpress/block-editor";
import { memo, useMemo, useState } from "@wordpress/element";
import { HeaderIcon, InfoIcon, TriggerButtonIcon } from "./icon";
import { ProIconLight } from "../../admin/icons";

// Writing tone list
const writingTonesList = [
	{ label: "Balanced", value: "balanced" },
	{ label: "Professional", value: "professional" },
	{ label: "Friendly", value: "friendly" },
	{ label: "Conversational", value: "conversational" },
	{ label: "Informative", value: "informative" },
	{ label: "Technical", value: "technical" },
	{ label: "Persuasive", value: "persuasive" },
	{ label: "Supportive", value: "supportive" },
	{ label: "Documentation Style", value: "documentation_style" },
	{ label: "Beginner-Friendly", value: "beginner_friendly" },
];

// Supported languages list
const supportedLanguagesList = [
	{ label: "English", value: "english" },
	{ label: "Bengali", value: "bengali" },
	{ label: "Hindi", value: "hindi" },
	{ label: "Spanish", value: "spanish" },
	{ label: "French", value: "french" },
	{ label: "German", value: "german" },
	{ label: "Portuguese", value: "portuguese" },
	{ label: "Chinese", value: "chinese" },
	{ label: "Japanese", value: "japanese" },
	{ label: "Korean", value: "korean" },
	{ label: "Arabic", value: "arabic" },
	{ label: "Urdu", value: "urdu" },
	{ label: "Turkish", value: "turkish" },
	{ label: "Indonesian", value: "indonesian" },
	{ label: "Russian", value: "russian" },
	{ label: "Italian", value: "italian" },
	{ label: "Dutch", value: "dutch" },
];

// Content source list
const faqContentSourceList = [
	{ label: "Select Source", value: "" },
	{ label: "Pages", value: "page" },
	{ label: "Posts", value: "post" },
	{ label: "Products", value: "product" },
];

const faqContentSourceLabels = {
	"": __("Select Content", "easy-accordion-free"),
	page: __("Select Page", "easy-accordion-free"),
	post: __("Select Post", "easy-accordion-free"),
	product: __("Select Product", "easy-accordion-free"),
};

// TriggerButton.
export const TriggerButton = memo(() => (
	<span className="sp-d-flex sp-align-center sp-gap-10px">
		<TriggerButtonIcon />
		{__("Generate FAQs with AI", "easy-accordion-free")}
	</span>
));

// Controlled Select.
const RenderSelect = ({ items, id, value, onChange }) => (
	<div className="eab-faq-gen-prompt-card__select">
		<select id={id} name={id} value={value} onChange={(e) => onChange(id, e.target.value)}>
			{items?.map(({ label, value: optVal, disabled }) => (
				<option key={optVal} value={optVal} disabled={disabled}>
					{label}
				</option>
			))}
		</select>
		<i className="eab-icon-angle-down-solid"></i>
	</div>
);

// PromptCardHeading.
export const PromptCardHeading = ({ onClose }) => (
	<div className="eab-faq-gen-prompt-card__header sp-d-flex sp-align-start sp-justify-between">
		<div className="sp-d-flex sp-align-center sp-gap-12px">
			<div className="eab-faq-gen-prompt-card__header-icon sp-d-flex sp-align-center sp-justify-center">
				<HeaderIcon />
			</div>
			<div className="eab-faq-gen-prompt-card__header-content sp-d-flex sp-flex-col sp-gap-4px">
				<h4 className="eab-faq-gen-prompt-card__header-label">
					{__("AI FAQs Generation", "easy-accordion-free")}
				</h4>
				<p className="eab-faq-gen-prompt-card__header-desc">
					{__(
						"Configure the AI parameters to generate desired FAQs for your content.",
						"easy-accordion-free"
					)}
				</p>
			</div>
		</div>
		<i
			onClick={() => onClose(null)}
			className="eab-faq-gen-prompt-card__close-btn eab-icon-cross sp-cursor-pointer"
		></i>
	</div>
);

// PromptCard.
export const PromptCard = memo(
	({ formData, onFieldChange, handleFormSubmit, loading, modelOptions = [], generatedFaqItems }) => {
		// Fetch posts based on selected content source
		const allPosts = useSelect(
			(select) =>
				select("core").getEntityRecords("postType", formData?.contentSource, {
					per_page: 100,
					status: "publish",
				}),
			[formData?.contentSource]
		);

		const postOptions = useMemo(() => {
			return (
				allPosts?.map((post) => ({
					label: post?.title?.raw.length > 60 ? post?.title?.raw.substring(0, 60) + "..." : post?.title?.raw,
					value: post?.link,
					id: post?.id,
				})) || []
			);
		}, [allPosts]);

		return (
			<form onSubmit={handleFormSubmit} className="eab-faq-gen-prompt-card__form">
				<div className="eab-faq-gen-prompt-card__body sp-d-flex sp-flex-col">
					{/* Row 1 */}
					<div className="eab-faq-gen-prompt-card__body-top sp-d-flex">
						<div className="eab-faq-gen-prompt-card__field sp-w-1/3">
							<label htmlFor="numberOfFaqs">{__("Number of FAQs", "easy-accordion-free")}</label>
							<RenderSelect
								items={[
									{ label: "5 FAQs", value: "5" },
									{ label: "10 FAQs (Pro)", value: "10", disabled: true },
									{ label: "15 FAQs (Pro)", value: "15", disabled: true },
									{ label: "20 FAQs (Pro)", value: "20", disabled: true },
								]}
								id="numberOfFaqs"
								value={formData.numberOfFaqs}
								onChange={onFieldChange}
							/>
						</div>
						<div className="eab-faq-gen-prompt-card__field sp-w-1/3">
							<label htmlFor="language">{__("Select a Language", "easy-accordion-free")}</label>
							<RenderSelect
								items={supportedLanguagesList}
								id="language"
								value={formData.language}
								onChange={onFieldChange}
							/>
						</div>
						<div className="eab-faq-gen-prompt-card__field sp-w-1/3">
							<label htmlFor="tune">{__("Select a Tone", "easy-accordion-free")}</label>
							<RenderSelect
								items={writingTonesList}
								id="tune"
								value={formData.tune}
								onChange={onFieldChange}
							/>
						</div>
					</div>

					{/* Row 2 */}
					<div className="eab-faq-gen-prompt-card__page-source sp-d-flex sp-align-end">
						<div className="eab-faq-gen-prompt-card__field sp-w-1/2">
							<label htmlFor="contentSource">{__("FAQ Content Source", "easy-accordion-free")}</label>
							<div className="eab-faq-gen-prompt-card__select">
								<select
									id="contentSource"
									name="contentSource"
									value={formData.contentSource}
									onChange={(e) => {
										onFieldChange("contentSource", e.target.value);
										onFieldChange("selectedPost", "");
									}}
								>
									{faqContentSourceList.map(({ label, value }) => (
										<option key={value} value={value}>
											{label}
										</option>
									))}
								</select>
								<i className="eab-icon-angle-down-solid"></i>
							</div>
						</div>
						<div className="eab-faq-gen-prompt-card__field sp-w-1/2">
							<RenderSelect
								items={[
									{
										label:
											faqContentSourceLabels[formData.contentSource] ||
											faqContentSourceLabels.post,
										value: "",
									},
									...postOptions,
								]}
								id="selectedPost"
								value={formData.selectedPost}
								onChange={onFieldChange}
							/>
						</div>
					</div>

					{/* Keywords */}
					<div className="eab-faq-gen-prompt-card__field">
						<label htmlFor="keywords">{__("Keywords & Focus Areas", "easy-accordion-free")}</label>
						<input
							type="text"
							id="keywords"
							name="keywords"
							value={formData.keywords}
							onChange={(e) => onFieldChange("keywords", e.target.value)}
						/>
						<span className="eab-faq-gen-prompt-card__help sp-d-block">
							{__(
								"Add keywords to guide the AI and generate more relevant FAQs. Separate with commas.",
								"easy-accordion-free"
							)}
						</span>
					</div>

					{/* Prompt */}
					<div className="eab-faq-gen-prompt-card__field">
						<label htmlFor="prompt">{__("AI Prompt", "easy-accordion-free")}</label>
						<textarea
							className="eab-faq-gen-prompt-card-prompt sp-d-block"
							id="prompt"
							name="prompt"
							rows={5}
							required
							value={formData.prompt}
							onChange={(e) => onFieldChange("prompt", e.target.value)}
						/>
						<span className="eab-faq-gen-prompt-card__help sp-d-block">
							{__(
								"Briefly describe your product, service, or content to generate relevant FAQs.",
								"easy-accordion-free"
							)}
						</span>
					</div>
				</div>

				{/* Footer */}
				<div className="eab-faq-gen-prompt-card__footer sp-d-flex sp-align-center sp-justify-end sp-gap-12px">
					<span
						className="eab-faq-gen-prompt-card__notice"
						style={{ marginRight: "auto", display: "flex", alignItems: "center", fontSize: "15px" }}
					>
						{__("To generate unlimited FAQs with AI,", "easy-accordion-free")}
						<a
							href="https://easyaccordion.io/pricing/"
							target="_blank"
							rel="noopener noreferrer"
							style={{ marginLeft: "4px" }}
						>
							{__("Upgrade to Pro!", "easy-accordion-free")}
						</a>
					</span>
					{modelOptions?.length > 0 && (
						<div className="eab-faq-gen-prompt-card__field">
							<RenderSelect
								items={modelOptions}
								id="selectedModel"
								value={formData.selectedModel}
								onChange={onFieldChange}
							/>
						</div>
					)}
					<button
						type="submit"
						className="eab-faq-gen-prompt-card__submit sp-d-flex sp-align-center sp-gap-10px"
						disabled={loading || modelOptions?.length === 0 || generatedFaqItems === "5"}
					>
						<TriggerButtonIcon />
						{loading ? (
							<span className="sp-d-flex sp-align-end sp-gap-2px">
								{__("Generating FAQs", "easy-accordion-free")}
								<span className="eab-generating-spinner"></span>
							</span>
						) : (
							__("Generate FAQs", "easy-accordion-free")
						)}
					</button>
				</div>
			</form>
		);
	}
);

// ManageGeneratedData.
export const ManageGeneratedData = memo(
	({ apiResult, setStep, parentId, setIsOpenPopup, setApiResult, childName, resetForm }) => {
		const [generatedFaqs, setGeneratedFaqs] = useState(apiResult);
		const [activeId, setActiveId] = useState(0);

		const { insertBlock } = useDispatch("core/block-editor");

		const createFaqsWithContent = () => {
			generatedFaqs?.forEach(({ question, answer, isSelected }) => {
				if (isSelected && question && answer) {
					const newBlock = wp.blocks.createBlock(childName, { accordionTitle: question }, [
						wp.blocks.createBlock("core/paragraph", { content: answer }),
					]);
					insertBlock(newBlock, undefined, parentId);
				}
			});
			// Reset everything after inserting
			setIsOpenPopup(false);
			setApiResult([]);
			setStep("prompt-modal");
			resetForm(); // ← resets form state to defaults
		};

		// update single faqs value.
		const updateFaqsValue = (id, key, value) => {
			setGeneratedFaqs((prev) => prev.map((item) => (item.id === id ? { ...item, [key]: value } : item)));
		};

		// update all faqs value.
		const handleFilteringAllFaqs = (value) => {
			setGeneratedFaqs((prev) => prev.map((item) => ({ ...item, isSelected: value })));
		};

		const totalSelectedItems = generatedFaqs?.filter((item) => item.isSelected)?.length;

		return (
			<div className="eab-manage-generated-faqs">
				<div className="eab-manage-generated-faqs__header sp-d-flex sp-align-center sp-justify-between">
					<div className="eab-manage-generated-faqs__header-titles">
						<h4>{__("Generated FAQs", "easy-accordion-free")}</h4>
						<span className="sp-d-block">
							{__("Select the FAQs you want to add to your block ", "easy-accordion-free")}
							{"("}
							{totalSelectedItems}
							{__(" selected", "easy-accordion-free")}
							{")"}
						</span>
					</div>
					<div className="eab-manage-generated-faqs__header-buttons sp-d-flex sp-align-center sp-gap-10px">
						<button
							disabled={totalSelectedItems === generatedFaqs?.length}
							onClick={() => handleFilteringAllFaqs(true)}
						>
							{__("Select All", "easy-accordion-free")}
						</button>
						<button disabled={totalSelectedItems === 0} onClick={() => handleFilteringAllFaqs(false)}>
							{__("Deselect All", "easy-accordion-free")}
						</button>
					</div>
				</div>

				<div className="eab-manage-generated-faqs__body">
					{generatedFaqs?.map(({ id, question, answer, isSelected }, i) => (
						<div
							key={i}
							className={`eab-manage-generated-faqs__accordion${activeId === id ? " active" : ""}`}
						>
							<div
								className="eab-manage-generated-faqs__accordion-header sp-d-flex sp-align-center sp-justify-between"
								onClick={() => setActiveId((prev) => (prev === id ? null : id))}
							>
								<span className="sp-d-flex sp-align-center sp-gap-10px">
									<input
										type="checkbox"
										checked={isSelected}
										onChange={() => updateFaqsValue(id, "isSelected", !isSelected)}
										onClick={(e) => e.stopPropagation()}
									/>
									<RichText
										tagName="span"
										className="eab-manage-generated-faqs__accordion-title"
										value={question}
										onChange={(value) => updateFaqsValue(id, "question", value)}
									/>
								</span>
								<i
									className={
										activeId === id ? "eab-icon-angle-up-solid" : "eab-icon-angle-down-solid"
									}
								/>
							</div>

							{activeId === id && (
								<div className="eab-manage-generated-faqs__accordion-content">
									<RichText
										tagName="span"
										value={answer}
										onChange={(value) => updateFaqsValue(id, "answer", value)}
									/>
								</div>
							)}
						</div>
					))}
				</div>

				<div className="eab-faq-gen-prompt-card__footer sp-d-flex sp-align-center sp-justify-between">
					<button className="eab-manage-generated-faqs__back-button" onClick={() => setStep("prompt-modal")}>
						{__("Back to Settings", "easy-accordion-free")}
					</button>
					<button
						className="eab-manage-generated-faqs__next-button"
						onClick={createFaqsWithContent}
						disabled={totalSelectedItems <= 0}
					>
						{__("Add Selected FAQs", "easy-accordion-free")}
					</button>
				</div>
			</div>
		);
	}
);

// WarningMessage.
export const WarningMessage = memo(({ errorMessage }) => (
	<div className="eab-faq-gen-prompt-card__alert">
		{errorMessage}
		<a
			href={`${sp_eab_localize_data?.homeUrl}wp-admin/edit.php?post_type=sp_easy_accordion&page=eap_dashboard#integrations`}
			target="_blank"
			rel="noreferrer"
		>
			{__(" Integrations settings ", "easy-accordion-free")}
		</a>
		{__("to continue.", "easy-accordion-free")}
	</div>
));

// upgrade message.
export const UpgradeToProMessage = memo(() => (
	<div className="eab-faq-gen-prompt-card__alert eap-upgrade-message sp-d-flex sp-align-center sp-justify-between sp-gap-10px">
		{__(
			"You’ve reached your AI FAQ generation limit. Upgrade to Pro to continue generating unlimited FAQs.",
			"easy-accordion-free"
		)}
		<a
			href="https://easyaccordion.io/pricing/?ref=1"
			target="_blank"
			rel="noreferrer"
			className="sp-d-flex sp-align-center sp-gap-8px"
		>
			<ProIconLight />
			{__("Upgrade to Pro", "easy-accordion-free")}
		</a>
	</div>
));
