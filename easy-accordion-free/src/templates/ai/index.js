import { __ } from "@wordpress/i18n";
import { Modal } from "@wordpress/components";
import { memo, useMemo, useState } from "@wordpress/element";
import { buildAiPrompt, getIntegrationSettings } from "@easy-accordion/controls";
import {
	ManageGeneratedData,
	PromptCard,
	PromptCardHeading,
	TriggerButton,
	UpgradeToProMessage,
	WarningMessage,
} from "./template";
import { geminiRequest } from "./api";
import "./editor.scss";

// Default form state
const DEFAULT_FORM_STATE = {
	numberOfFaqs: "5",
	language: "english",
	tune: "balanced",
	contentSource: "",
	selectedPost: "",
	keywords: "",
	prompt: "",
	selectedModel: "gemini",
};

const GenerateFaqsWithAI = ({
	parentId,
	childName = "sp-easy-accordion-pro/accordion-item",
	generatedFaqItems = "5",
	setAttributes,
}) => {
	const [step, setStep] = useState("prompt-modal");
	const [isOpenPopup, setIsOpenPopup] = useState(false);
	const [apiResult, setApiResult] = useState([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [formData, setFormData] = useState(DEFAULT_FORM_STATE);

	// Integration data
	const integrations = getIntegrationSettings();

	// Reset form to defaults
	const resetForm = () => {
		setFormData(DEFAULT_FORM_STATE);
		setError("");
	};

	// Handle individual field change
	const handleFieldChange = (name, value) => {
		setFormData((prev) => ({ ...prev, [name]: value }));
	};

	// Handle form submission
	const handleFormSubmit = async (event) => {
		event.preventDefault();
		setError("");

		const selectedModel = formData.selectedModel;
		const activeAIInfo = integrations?.[selectedModel];
		const apiKey = activeAIInfo?.api_key;
		const model = activeAIInfo?.model;
		const maxTokens = activeAIInfo?.max_token;

		if (!apiKey && !model) {
			setError("AI FAQ generation requires an API key and model. Please add your API key and model in the");
			return;
		}
		if (!apiKey) {
			setError("AI FAQ generation requires an API key. Please add your API key in the");
			return;
		}
		if (!model) {
			setError("AI FAQ generation requires an API model. Please add your model in the");
			return;
		}

		// loading start.
		setLoading(true);

		// build prompt.
		const prompt = buildAiPrompt(formData);

		// api request.
		if (selectedModel === "gemini") {
			const response = await geminiRequest(prompt, model, apiKey, maxTokens);
			if (response?.success) {
				setApiResult(response?.data);
				setStep("faqs-selection");
				setAttributes({ generatedFaqItems: "5" });
			}
			if (response?.error) {
				setError(`${response?.message} Go to`);
			}
		}

		setLoading(false);
	};

	const updatedResponseData = useMemo(() => {
		if (apiResult?.length <= 0) {
			return [];
		}
		return apiResult.map((item, index) => ({
			id: index,
			isSelected: false,
			...item,
		}));
	}, [apiResult]);

	const modelOptions = useMemo(() => {
		// TODO: make it dynamic if other ai will be implemented.
		if (integrations?.gemini?.is_active) {
			return [{ label: "Gemini", value: "gemini" }];
		}
		// return modelsData?.filter((option) => integrations[option.value]?.is_active);
	}, []);

	const errorMessage =
		modelOptions?.length === 0
			? __("No AI models available. Please enable an integration to generate FAQs. Go to", "easy-accordion-free")
			: error;

	return (
		<div className="eab-generate-faqs-with-ai-section">
			<div className="sp-eab-popup-trigger-button-wrapper sp-d-flex sp-align-center sp-justify-end">
				<button className="sp-eab-popup-trigger-button sp-cursor-pointer" onClick={() => setIsOpenPopup(true)}>
					<TriggerButton />
				</button>
			</div>

			{isOpenPopup && (
				<Modal
					className="eab-generate-faqs-with-ai-modal"
					onRequestClose={() => setIsOpenPopup(null)}
					__experimentalHideHeader={true}
				>
					<div className="eab-faq-gen-prompt-card">
						{/* Heading */}
						<PromptCardHeading onClose={setIsOpenPopup} />
						{/* Alert */}
						{errorMessage && (
							<WarningMessage errorMessage={errorMessage} generatedFaqItems={generatedFaqItems} />
						)}
						{generatedFaqItems === "5" && <UpgradeToProMessage />}
						{/* Prompt modal */}
						{step === "prompt-modal" && (
							<PromptCard
								formData={formData}
								onFieldChange={handleFieldChange}
								handleFormSubmit={handleFormSubmit}
								loading={loading}
								modelOptions={modelOptions}
								generatedFaqItems={generatedFaqItems}
							/>
						)}
						{/* Generated faqs selection popup */}
						{step === "faqs-selection" && (
							<ManageGeneratedData
								apiResult={updatedResponseData}
								parentId={parentId}
								setStep={setStep}
								setIsOpenPopup={setIsOpenPopup}
								setApiResult={setApiResult}
								childName={childName}
								resetForm={resetForm}
							/>
						)}
					</div>
				</Modal>
			)}
		</div>
	);
};

export default memo(GenerateFaqsWithAI);
