import { __, _n, sprintf } from "@wordpress/i18n";
import { memo, useMemo, useState } from "@wordpress/element";
import SourcePicker from "./SourcePicker";
import { ChevronIcon, GlobeIcon, SparkleIcon, ToneIcon } from "./icon";
import UpgradeNotice from "./UpgradeNotice";
import { FAQ_COUNTS, FREE_MAX_FAQS, PROMPT_SUGGESTIONS, getLanguageOptions, getToneOptions } from "./constants";

/**
 * Compact select with an optional leading icon.
 *
 * @param {Object}   props
 * @param {string}   props.label    Accessible name.
 * @param {string}   props.value    Value.
 * @param {Array}    props.options  `{ value, label }` options.
 * @param {Function} props.onChange New value.
 * @param {Element}  props.icon     Leading icon.
 * @return {JSX.Element} Pill.
 */
const PillSelect = ({ label, value, options, onChange, icon = null }) => (
	<div className="eab-ai-faq-pill">
		{icon}
		<select value={value} onChange={(event) => onChange(event.target.value)} aria-label={label}>
			{options.map((option) => (
				<option key={option.value} value={option.value} disabled={option.disabled}>
					{option.label}
				</option>
			))}
		</select>
		<ChevronIcon size={12} strokeWidth={2.2} />
	</div>
);

/**
 * Step one: sources, keywords, prompt, count / language / tone, model.
 *
 * @param {Object}   props
 * @param {Object}   props.form             Field values.
 * @param {Function} props.onFieldChange    `( name, value )`.
 * @param {Array}    props.sources          Picked sources.
 * @param {Function} props.onSources        Replace the sources.
 * @param {string}   props.sourceError      Source field message.
 * @param {Function} props.onSourceError    Set that message.
 * @param {Array}    props.providers        Connected provider rows.
 * @param {string}   props.provider         Picked provider slug.
 * @param {Function} props.onProviderChange New provider.
 * @param {Array}    props.modelOptions     Models of the picked provider.
 * @param {string}   props.model            Picked model.
 * @param {Function} props.onModelChange    New model.
 * @param {boolean}  props.loading          A request is running.
 * @param {boolean}  props.canGenerate      Generate is allowed.
 * @param {Function} props.onGenerate       Generate.
 * @param {number}   props.resultCount      FAQs from the last run still unused.
 * @param {Function} props.onShowResults    Back to those FAQs.
 * @param {boolean}  props.limitReached     The accordion already used its free run.
 * @return {JSX.Element} Form.
 */
const PromptForm = ({
	form,
	onFieldChange,
	sources,
	onSources,
	sourceError,
	onSourceError,
	providers,
	provider,
	onProviderChange,
	modelOptions,
	model,
	onModelChange,
	loading,
	canGenerate,
	onGenerate,
	resultCount,
	onShowResults,
	limitReached,
}) => {
	const [promptFocused, setPromptFocused] = useState(false);
	const languages = useMemo(getLanguageOptions, []);
	const tones = useMemo(getToneOptions, []);
	const counts = useMemo(
		() =>
			FAQ_COUNTS.map((count) => {
				const isPro = count > FREE_MAX_FAQS;
				return {
					value: String(count),
					label: isPro
						? sprintf(
								/* translators: %d: number of FAQs */
								__("%d FAQs (Pro)", "easy-accordion-free"),
								count
							)
						: sprintf(
								/* translators: %d: number of FAQs */
								_n("%d FAQ", "%d FAQs", count, "easy-accordion-free"),
								count
							),
					disabled: isPro,
				};
			}),
		[]
	);

	const showSuggestions = promptFocused && !form.prompt.trim();

	return (
		<div className="eab-ai-faq-form">
			<div className="eab-ai-faq-label">{__("Source", "easy-accordion-free")}</div>
			<SourcePicker sources={sources} onChange={onSources} error={sourceError} onError={onSourceError} />

			<label className="eab-ai-faq-label" htmlFor="eab-ai-faq-keywords">
				{__("Keywords", "easy-accordion-free")}
			</label>
			<input
				id="eab-ai-faq-keywords"
				type="text"
				className="eab-ai-faq-input"
				value={form.keywords}
				onChange={(event) => onFieldChange("keywords", event.target.value)}
				placeholder={__("Add keywords, e.g. account, returns, pricing", "easy-accordion-free")}
			/>

			<label className="eab-ai-faq-label" htmlFor="eab-ai-faq-prompt">
				{__("Prompt", "easy-accordion-free")}
			</label>
			<div className="eab-ai-faq-prompt">
				<textarea
					id="eab-ai-faq-prompt"
					className="eab-ai-faq-textarea"
					value={form.prompt}
					onChange={(event) => onFieldChange("prompt", event.target.value)}
					onFocus={() => setPromptFocused(true)}
					onBlur={() => setPromptFocused(false)}
					onKeyDown={(event) => {
						if ("Enter" === event.key && (event.metaKey || event.ctrlKey)) {
							event.preventDefault();
							if (canGenerate) {
								onGenerate();
							}
						}
						if ("Escape" === event.key && showSuggestions) {
							event.stopPropagation();
							setPromptFocused(false);
						}
					}}
					placeholder={__(
						"Add specific instructions, e.g. focus on questions first-time customers might ask",
						"easy-accordion-free"
					)}
				/>
				{showSuggestions && (
					<div
						className="eab-ai-faq-suggest"
						role="listbox"
						aria-label={__("Prompt ideas", "easy-accordion-free")}
					>
						{PROMPT_SUGGESTIONS.map((suggestion) => (
							<button
								key={suggestion}
								type="button"
								role="option"
								aria-selected={false}
								className="eab-ai-faq-suggest__item"
								onMouseDown={(event) => {
									event.preventDefault();
									onFieldChange("prompt", suggestion);
									setPromptFocused(false);
								}}
							>
								{suggestion}
							</button>
						))}
					</div>
				)}
			</div>

			<div className="eab-ai-faq-pills">
				<PillSelect
					label={__("Number of FAQs", "easy-accordion-free")}
					value={form.count}
					options={counts}
					onChange={(value) => onFieldChange("count", value)}
				/>
				<PillSelect
					label={__("Language", "easy-accordion-free")}
					value={form.language}
					options={languages}
					onChange={(value) => onFieldChange("language", value)}
					icon={<GlobeIcon />}
				/>
				<PillSelect
					label={__("Tone", "easy-accordion-free")}
					value={form.tone}
					options={tones}
					onChange={(value) => onFieldChange("tone", value)}
					icon={<ToneIcon />}
				/>
			</div>

			<UpgradeNotice limitReached={limitReached} />

			<div className="eab-ai-faq-form__footer">
				{resultCount > 0 && (
					<button type="button" className="eab-ai-faq-link" onClick={onShowResults}>
						{sprintf(
							/* translators: %d: number of generated FAQs */
							_n("View %d generated FAQ", "View %d generated FAQs", resultCount, "easy-accordion-free"),
							resultCount
						)}
					</button>
				)}
				<span className="eab-ai-faq-form__spacer" />
				{providers.length > 0 && (
					<div className="eab-ai-faq-model">
						<select
							value={provider}
							onChange={(event) => onProviderChange(event.target.value)}
							aria-label={__("AI provider", "easy-accordion-free")}
						>
							{providers.map(({ slug, label }) => (
								<option key={slug} value={slug}>
									{label}
								</option>
							))}
						</select>
						<ChevronIcon />
					</div>
				)}
				{modelOptions.length > 0 && (
					<div className="eab-ai-faq-model">
						<select
							value={model}
							onChange={(event) => onModelChange(event.target.value)}
							aria-label={__("AI model", "easy-accordion-free")}
						>
							{modelOptions.map(({ value, label }) => (
								<option key={value} value={value}>
									{label}
								</option>
							))}
						</select>
						<ChevronIcon />
					</div>
				)}
				<button
					type="button"
					className="eab-ai-faq-generate"
					disabled={!canGenerate}
					aria-busy={loading}
					onClick={onGenerate}
				>
					{loading ? __("Generating…", "easy-accordion-free") : __("Generate FAQs", "easy-accordion-free")}
					{loading ? <span className="eab-ai-faq-spinner" aria-hidden="true" /> : <SparkleIcon />}
				</button>
			</div>
		</div>
	);
};

export default memo(PromptForm);
