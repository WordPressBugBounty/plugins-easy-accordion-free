import { __, sprintf } from "@wordpress/i18n";
import { RichText } from "@wordpress/block-editor";
import { useInstanceId } from "@wordpress/compose";
import { memo, useEffect, useRef, useState } from "@wordpress/element";
import { ChevronIcon, ReturnIcon, RewriteIcon } from "./icon";
import { REWRITE_CHIPS } from "./constants";
import { useClickOutside } from "./utils";

/**
 * "Rewrite this…" — shown on hover over a question or an answer.
 *
 * @param {Object}   props
 * @param {Function} props.onClick Open the rewrite box.
 * @return {JSX.Element} Button.
 */
const RewriteButton = ({ onClick }) => (
	<button type="button" className="eab-ai-faq-rewrite-btn" onClick={onClick}>
		<RewriteIcon />
		{__("Rewrite this…", "easy-accordion-free")}
	</button>
);

/**
 * Instruction box for one question or answer. Stays open after a rewrite so
 * the text can be refined again.
 *
 * @param {Object}   props
 * @param {string}   props.field    "question" or "answer".
 * @param {boolean}  props.busy     A rewrite is running.
 * @param {Function} props.onSubmit `( instruction )` → Promise.
 * @param {Function} props.onClose  Close the box.
 * @return {JSX.Element} Popover.
 */
const RewritePopover = ({ field, busy, onSubmit, onClose }) => {
	const [text, setText] = useState("");
	const [error, setError] = useState("");
	const ref = useRef(null);
	const inputRef = useRef(null);

	useClickOutside(
		ref,
		() => {
			if (!busy) {
				onClose();
			}
		},
		true
	);

	useEffect(() => {
		inputRef.current?.focus();
	}, []);

	const submit = async () => {
		if (busy) {
			return;
		}
		setError("");
		try {
			await onSubmit(text.trim());
			setText("");
			inputRef.current?.focus();
		} catch (requestError) {
			setError(requestError?.message || __("The rewrite failed. Please try again.", "easy-accordion-free"));
		}
	};

	const pickChip = (instruction) => {
		setText(instruction);
		window.requestAnimationFrame(() => {
			const input = inputRef.current;
			if (input) {
				input.focus();
				input.setSelectionRange(instruction.length, instruction.length);
			}
		});
	};

	return (
		<div
			ref={ref}
			className={`eab-ai-faq-rewrite eab-ai-faq-rewrite--${field}`}
			onKeyDown={(event) => {
				if ("Escape" === event.key) {
					event.stopPropagation();
					onClose();
				}
			}}
		>
			<textarea
				ref={inputRef}
				className="eab-ai-faq-textarea"
				value={text}
				onChange={(event) => setText(event.target.value)}
				onKeyDown={(event) => {
					if ("Enter" === event.key && !event.shiftKey) {
						event.preventDefault();
						submit();
					}
				}}
				placeholder={
					"question" === field
						? __("Make this question clearer…", "easy-accordion-free")
						: __("Make this sound more professional…", "easy-accordion-free")
				}
				aria-label={
					"question" === field
						? __("How should the question change?", "easy-accordion-free")
						: __("How should the answer change?", "easy-accordion-free")
				}
			/>
			{error && <p className="eab-ai-faq-field-error">{error}</p>}
			<div className="eab-ai-faq-rewrite__actions">
				{REWRITE_CHIPS[field].map(([label, instruction]) => (
					<button key={label} type="button" className="eab-ai-faq-chip" onClick={() => pickChip(instruction)}>
						{label}
					</button>
				))}
				<span className="eab-ai-faq-rewrite__spacer" />
				<button type="button" className="eab-ai-faq-rewrite__submit" disabled={busy} onClick={submit}>
					{busy ? __("Rewriting…", "easy-accordion-free") : __("Rewrite", "easy-accordion-free")}
					<ReturnIcon />
				</button>
			</div>
		</div>
	);
};

/**
 * One generated FAQ: select, expand, edit the answer, rewrite either half.
 *
 * @param {Object}   props
 * @param {Object}   props.item           `{ id, question, answer, checked }`.
 * @param {boolean}  props.isOpen         Answer shown.
 * @param {Function} props.onToggle       Show or hide the answer.
 * @param {string}   props.rewriteField   Field whose rewrite box is open, or null.
 * @param {Function} props.onOpenRewrite  `( field )`.
 * @param {Function} props.onCloseRewrite Close the rewrite box.
 * @param {Function} props.onUpdate       `( patch )`.
 * @param {Function} props.onRewrite      `( field, instruction )` → Promise<string>.
 * @return {JSX.Element} Card.
 */
const ResultItem = ({ item, isOpen, onToggle, rewriteField, onOpenRewrite, onCloseRewrite, onUpdate, onRewrite }) => {
	const [busy, setBusy] = useState(null);

	const runRewrite = async (field, instruction) => {
		setBusy(field);
		try {
			const text = await onRewrite(field, instruction);
			onUpdate({ [field]: text });
		} finally {
			setBusy(null);
		}
	};

	const classes = [
		"eab-ai-faq-result",
		isOpen && "is-open",
		item.checked && "is-checked",
		rewriteField && `is-rewriting is-rewriting-${rewriteField}`,
	]
		.filter(Boolean)
		.join(" ");

	return (
		<div className={classes}>
			<div className="eab-ai-faq-result__head">
				<input
					type="checkbox"
					checked={item.checked}
					onChange={(event) => onUpdate({ checked: event.target.checked })}
					aria-label={sprintf(
						/* translators: %s: FAQ question */
						__("Select: %s", "easy-accordion-free"),
						item.question
					)}
				/>
				<div
					className="eab-ai-faq-result__q"
					role="button"
					tabIndex={0}
					aria-expanded={isOpen}
					onClick={onToggle}
					onKeyDown={(event) => {
						if (event.target === event.currentTarget && ("Enter" === event.key || " " === event.key)) {
							event.preventDefault();
							onToggle();
						}
					}}
				>
					<span className={`eab-ai-faq-result__q-text${"question" === busy ? " is-busy" : ""}`}>
						{item.question}
						{!rewriteField && (
							<RewriteButton
								onClick={(event) => {
									event.stopPropagation();
									onOpenRewrite("question");
								}}
							/>
						)}
					</span>
					<span className="eab-ai-faq-result__chevron">
						<ChevronIcon />
					</span>
				</div>
			</div>

			{"question" === rewriteField && (
				<RewritePopover
					field="question"
					busy={"question" === busy}
					onSubmit={(instruction) => runRewrite("question", instruction)}
					onClose={onCloseRewrite}
				/>
			)}

			{isOpen && (
				<div className="eab-ai-faq-result__a">
					{!rewriteField && <RewriteButton onClick={() => onOpenRewrite("answer")} />}
					<RichText
						tagName="div"
						className={`eab-ai-faq-result__a-text${"answer" === busy ? " is-busy" : ""}`}
						value={item.answer}
						onChange={(answer) => onUpdate({ answer })}
						allowedFormats={["core/bold", "core/italic", "core/link"]}
						aria-label={__("Answer", "easy-accordion-free")}
					/>
					{"answer" === rewriteField && (
						<RewritePopover
							field="answer"
							busy={"answer" === busy}
							onSubmit={(instruction) => runRewrite("answer", instruction)}
							onClose={onCloseRewrite}
						/>
					)}
				</div>
			)}
		</div>
	);
};

/**
 * Step two: pick, edit and rewrite the generated FAQs, then add them.
 *
 * @param {Object}   props
 * @param {Array}    props.results     Generated FAQs.
 * @param {Function} props.onUpdate    `( id, patch )`.
 * @param {Function} props.onSelectAll `( checked )`.
 * @param {Function} props.onRewrite   `( item, field, instruction )` → Promise<string>.
 * @param {Function} props.onBack      Back to the form.
 * @param {Function} props.onAdd       Insert the selected FAQs.
 * @return {JSX.Element} Results.
 */
const ResultsStep = ({ results, onUpdate, onSelectAll, onRewrite, onBack, onAdd }) => {
	const [openId, setOpenId] = useState(results[0]?.id ?? null);
	const [rewriting, setRewriting] = useState(null);
	const selectAllRef = useRef(null);
	const selectAllId = useInstanceId(ResultsStep, "eab-ai-faq-select-all");
	const selected = results.filter((item) => item.checked).length;

	useEffect(() => {
		if (selectAllRef.current) {
			selectAllRef.current.indeterminate = selected > 0 && selected < results.length;
		}
	}, [selected, results.length]);

	return (
		<div className="eab-ai-faq-results">
			<label className="eab-ai-faq-select-all" htmlFor={selectAllId}>
				<input
					id={selectAllId}
					ref={selectAllRef}
					type="checkbox"
					checked={results.length > 0 && selected === results.length}
					onChange={(event) => onSelectAll(event.target.checked)}
				/>
				{__("Select All", "easy-accordion-free")}
			</label>

			<div className="eab-ai-faq-results__list">
				{results.map((item) => (
					<ResultItem
						key={item.id}
						item={item}
						isOpen={openId === item.id}
						onToggle={() => {
							setRewriting(null);
							setOpenId((current) => (current === item.id ? null : item.id));
						}}
						rewriteField={rewriting?.id === item.id ? rewriting.field : null}
						onOpenRewrite={(field) => setRewriting({ id: item.id, field })}
						onCloseRewrite={() => setRewriting(null)}
						onUpdate={(patch) => onUpdate(item.id, patch)}
						onRewrite={(field, instruction) => onRewrite(item, field, instruction)}
					/>
				))}
			</div>

			<div className="eab-ai-faq-results__footer">
				<button type="button" className="eab-ai-faq-btn eab-ai-faq-btn--secondary" onClick={onBack}>
					{__("Back to Settings", "easy-accordion-free")}
				</button>
				<button
					type="button"
					className="eab-ai-faq-btn eab-ai-faq-btn--primary"
					disabled={!selected}
					onClick={onAdd}
				>
					{__("Add Selected FAQs", "easy-accordion-free")}
				</button>
			</div>
		</div>
	);
};

export default memo(ResultsStep);
