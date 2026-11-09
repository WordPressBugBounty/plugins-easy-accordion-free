import { __, sprintf } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { store as coreStore } from "@wordpress/core-data";
import { Spinner } from "@wordpress/components";
import { decodeEntities } from "@wordpress/html-entities";
import { memo, useEffect, useRef, useState } from "@wordpress/element";
import { CloseIcon, SourceIcons } from "./icon";
import { FILE_ACCEPT, FILE_MAX_BYTES, MAX_FILES, MAX_POSTS, MAX_URLS, SOURCE_TYPES } from "./constants";
import { readTextFile, useClickOutside } from "./utils";

/**
 * A source's identity in the picked list.
 *
 * @param {Object} source Source.
 * @return {string} Key.
 */
export const sourceKey = (source) => `${source.type}:${source.id || source.name}`;

const PICKER_TITLES = {
	page: __("Select pages", "easy-accordion-free"),
	post: __("Select posts", "easy-accordion-free"),
	product: __("Select products", "easy-accordion-free"),
};

/**
 * Checkbox list of published pages, posts or products, searchable.
 *
 * @param {Object}   props
 * @param {string}   props.type     Post type.
 * @param {Array}    props.sources  Picked sources.
 * @param {boolean}  props.full     The post limit is reached.
 * @param {Function} props.onToggle Add or remove one.
 * @return {JSX.Element} Picker.
 */
const EntityPicker = ({ type, sources, full, onToggle }) => {
	const [search, setSearch] = useState("");
	const [query, setQuery] = useState("");

	useEffect(() => {
		const timer = setTimeout(() => setQuery(search.trim()), 300);
		return () => clearTimeout(timer);
	}, [search]);

	const { records, isLoading } = useSelect(
		(select) => {
			const args = { per_page: 20, status: "publish", _fields: "id,title", ...(query ? { search: query } : {}) };
			return {
				records: select(coreStore).getEntityRecords("postType", type, args),
				isLoading: !select(coreStore).hasFinishedResolution("getEntityRecords", ["postType", type, args]),
			};
		},
		[type, query]
	);

	return (
		<div className="eab-ai-faq-picker" role="dialog" aria-label={PICKER_TITLES[type]}>
			<div className="eab-ai-faq-picker__title">{PICKER_TITLES[type]}</div>
			<input
				type="search"
				className="eab-ai-faq-picker__search"
				value={search}
				onChange={(event) => setSearch(event.target.value)}
				placeholder={__("Search…", "easy-accordion-free")}
				aria-label={__("Search", "easy-accordion-free")}
				autoFocus // eslint-disable-line jsx-a11y/no-autofocus
			/>
			<div className="eab-ai-faq-picker__list">
				{isLoading && !records?.length && (
					<div className="eab-ai-faq-picker__empty">
						<Spinner />
					</div>
				)}
				{!isLoading && !records?.length && (
					<div className="eab-ai-faq-picker__empty">{__("Nothing found.", "easy-accordion-free")}</div>
				)}
				{(records || []).map((record) => {
					const name =
						decodeEntities(record.title?.raw || record.title?.rendered || "").trim() ||
						__("(no title)", "easy-accordion-free");
					const checked = sources.some((source) => source.type === type && source.id === record.id);
					const optionId = `eab-ai-faq-${type}-${record.id}`;
					return (
						<label key={record.id} className="eab-ai-faq-picker__option" htmlFor={optionId}>
							<input
								id={optionId}
								type="checkbox"
								checked={checked}
								disabled={!checked && full}
								onChange={() => onToggle({ type, id: record.id, name })}
							/>
							<span>{name}</span>
						</label>
					);
				})}
			</div>
		</div>
	);
};

/**
 * One-field URL form.
 *
 * @param {Object}   props
 * @param {Function} props.onAdd   Add the URL.
 * @param {Function} props.onError Report a bad URL.
 * @return {JSX.Element} Popover.
 */
const UrlPicker = ({ onAdd, onError }) => {
	const [value, setValue] = useState("");

	const add = () => {
		const raw = value.trim();
		if (!raw) {
			return;
		}
		const url = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
		try {
			new window.URL(url); // eslint-disable-line no-new
		} catch (e) {
			onError(__("Enter a valid URL, e.g. https://example.com/page", "easy-accordion-free"));
			return;
		}
		onAdd({ type: "url", name: url });
	};

	return (
		<div className="eab-ai-faq-picker eab-ai-faq-picker--url">
			<input
				type="url"
				className="eab-ai-faq-picker__url"
				value={value}
				onChange={(event) => setValue(event.target.value)}
				onKeyDown={(event) => {
					if (event.key === "Enter") {
						event.preventDefault();
						add();
					}
				}}
				placeholder="https://example.com/page"
				aria-label={__("Page URL", "easy-accordion-free")}
				autoFocus // eslint-disable-line jsx-a11y/no-autofocus
			/>
			<button type="button" className="eab-ai-faq-picker__add" onClick={add}>
				{__("Add", "easy-accordion-free")}
			</button>
		</div>
	);
};

/**
 * One picked source: type, name, remove.
 *
 * @param {Object}   props
 * @param {Object}   props.source   Source.
 * @param {Function} props.onRemove Remove it.
 * @return {JSX.Element} Row.
 */
const SourceChip = ({ source, onRemove }) => (
	<div className="eab-ai-faq-selected__item">
		<span className="eab-ai-faq-selected__type" style={{ color: SOURCE_TYPES[source.type]?.color }}>
			{SOURCE_TYPES[source.type]?.label}
		</span>
		<span className={`eab-ai-faq-selected__name${"url" === source.type ? " is-url" : ""}`} title={source.name}>
			{source.name}
		</span>
		<button
			type="button"
			className="eab-ai-faq-selected__remove"
			onClick={() => onRemove(source)}
			aria-label={sprintf(
				/* translators: %s: source name */
				__("Remove %s", "easy-accordion-free"),
				source.name
			)}
		>
			<CloseIcon size={8} strokeWidth={3} />
		</button>
	</div>
);

/**
 * Source buttons (Pages, Posts, Products, Add URL, Upload File), their
 * pickers, and the picked list. Every source is read server-side and fitted
 * into one fixed budget, so adding sources does not add credits.
 *
 * @param {Object}   props
 * @param {Array}    props.sources  Picked sources.
 * @param {Function} props.onChange Replace the list.
 * @param {string}   props.error    Message under the buttons.
 * @param {Function} props.onError  Set that message.
 * @return {JSX.Element} Source field.
 */
const SourcePicker = ({ sources, onChange, error, onError }) => {
	const [open, setOpen] = useState(null);
	const wrapRef = useRef(null);
	const fileRef = useRef(null);
	const hasProducts = useSelect((select) => !!select(coreStore).getPostType("product"), []);

	useClickOutside(wrapRef, () => setOpen(null), !!open);

	const postCount = sources.filter((source) => source.id).length;
	const urlCount = sources.filter((source) => "url" === source.type).length;
	const fileCount = sources.filter((source) => "file" === source.type).length;

	const add = (source) => {
		onError("");
		if (!sources.some((item) => sourceKey(item) === sourceKey(source))) {
			onChange([...sources, source]);
		}
	};
	const remove = (source) => onChange(sources.filter((item) => sourceKey(item) !== sourceKey(source)));
	const toggle = (source) =>
		sources.some((item) => sourceKey(item) === sourceKey(source)) ? remove(source) : add(source);

	const onFiles = async (event) => {
		const picked = Array.from(event.target.files || []);
		event.target.value = "";
		const accepted = FILE_ACCEPT.split(",");
		const room = MAX_FILES - fileCount;
		const next = [];

		for (const file of picked.slice(0, Math.max(room, 0))) {
			const extension = `.${file.name.split(".").pop().toLowerCase()}`;
			if (!accepted.includes(extension)) {
				onError(__("Only text files can be used: .txt, .md, .csv, .json or .html.", "easy-accordion-free"));
				continue;
			}
			if (file.size > FILE_MAX_BYTES) {
				onError(
					sprintf(
						/* translators: %s: file name */
						__("%s is larger than 2 MB.", "easy-accordion-free"),
						file.name
					)
				);
				continue;
			}
			try {
				const content = await readTextFile(file);
				if (content.trim()) {
					next.push({ type: "file", name: file.name, content });
				}
			} catch (e) {
				onError(
					sprintf(
						/* translators: %s: file name */
						__("%s could not be read.", "easy-accordion-free"),
						file.name
					)
				);
			}
		}

		if (next.length) {
			onChange([...sources.filter((item) => !next.some((file) => sourceKey(file) === sourceKey(item))), ...next]);
		}
	};

	const buttons = [
		{ type: "page", label: __("Pages", "easy-accordion-free"), full: postCount >= MAX_POSTS },
		{ type: "post", label: __("Posts", "easy-accordion-free"), full: postCount >= MAX_POSTS },
		hasProducts && { type: "product", label: __("Products", "easy-accordion-free"), full: postCount >= MAX_POSTS },
		{ type: "url", label: __("Add URL", "easy-accordion-free"), full: urlCount >= MAX_URLS },
		{ type: "file", label: __("Upload File", "easy-accordion-free"), full: fileCount >= MAX_FILES },
	].filter(Boolean);

	const left = sources.filter((source) => "page" === source.type || "post" === source.type);
	const right = sources.filter((source) => "page" !== source.type && "post" !== source.type);

	return (
		<div className="eab-ai-faq-sources">
			<div
				ref={wrapRef}
				className="eab-ai-faq-sources__buttons"
				onKeyDown={(event) => {
					if ("Escape" === event.key && open) {
						event.stopPropagation();
						setOpen(null);
					}
				}}
			>
				{buttons.map(({ type, label, full }) => {
					const Icon = SourceIcons[type];
					const isList = !!PICKER_TITLES[type];
					return (
						<div key={type} className="eab-ai-faq-sources__slot">
							<button
								type="button"
								className={`eab-ai-faq-source-btn${open === type ? " is-active" : ""}`}
								aria-expanded={"file" === type ? undefined : open === type}
								disabled={full && !isList}
								onClick={() => {
									onError("");
									if ("file" === type) {
										setOpen(null);
										fileRef.current?.click();
										return;
									}
									setOpen((current) => (current === type ? null : type));
								}}
							>
								<Icon />
								{label}
							</button>
							{open === type && isList && (
								<EntityPicker type={type} sources={sources} full={full} onToggle={toggle} />
							)}
							{open === type && "url" === type && (
								<UrlPicker
									onAdd={(source) => {
										add(source);
										setOpen(null);
									}}
									onError={onError}
								/>
							)}
						</div>
					);
				})}
				<input
					ref={fileRef}
					type="file"
					accept={FILE_ACCEPT}
					multiple
					hidden
					onChange={onFiles}
					tabIndex={-1}
				/>
			</div>

			{error && <p className="eab-ai-faq-field-error">{error}</p>}

			{sources.length > 0 && (
				<div className={`eab-ai-faq-selected${left.length && right.length ? " has-two" : ""}`}>
					{[left, right]
						.filter((list) => list.length)
						.map((list, index) => (
							<div key={index} className="eab-ai-faq-selected__col">
								{list.map((source) => (
									<SourceChip key={sourceKey(source)} source={source} onRemove={remove} />
								))}
							</div>
						))}
				</div>
			)}
		</div>
	);
};

export default memo(SourcePicker);
