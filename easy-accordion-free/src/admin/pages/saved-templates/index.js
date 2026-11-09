/**
 * Saved Templates page.
 *
 * The list is server-paginated through `easy-accordion/v2/templates`
 * (sp_eap_template block templates + sp_easy_accordion classic shortcodes,
 * merged server-side): search, page and per_page go in the query, the rows
 * and the filtered total come back. Duplicate and delete stay React-side
 * handlers (useTemplates) — after each, this page refetches, clamping the
 * page so a delete never lands the user on an empty last page.
 *
 * Empty library: the hero card explains the feature and the table carries an
 * illustrated empty state; the toolbar and the pager only appear once there is
 * something to act on, so the "create" call to action is never duplicated.
 */

import { useState, useMemo, useEffect, useRef } from "@wordpress/element";
import { __, sprintf } from "@wordpress/i18n";
import { Spinner } from "@wordpress/components";
import useTemplates from "../../hooks/useTemplates";
import { toggleSelection, allSelected, toggleSelectAll } from "./utils";
import {
	EditPencilIcon,
	CopyIcon,
	DeleteBinIcon,
	LeftArrow,
	RightArrow,
	CheckIcon,
	PlusIcon,
	EmptyStateFolderIcon,
} from "./icons";
import SavedTemplatesHero from "./SavedTemplatesHero";

const PER_PAGE = 10;
const COLUMN_COUNT = 6;

/**
 * Column names. The header row prints them, and each body cell repeats its own
 * in `data-label` so the phone layout — where the header is hidden and every
 * row folds into a card — can show it in front of the value.
 *
 * @return {Object<string, string>} Column key => label.
 */
function columnLabels() {
	return {
		title: __("Title", "easy-accordion-free"),
		block: __("Block", "easy-accordion-free"),
		shortcode: __("Shortcode", "easy-accordion-free"),
		date: __("Date", "easy-accordion-free"),
		action: __("Actions", "easy-accordion-free"),
	};
}

/**
 * @param {string} text Text to copy.
 * @return {Promise<boolean>} Whether copy succeeded.
 */
async function copyToClipboard(text) {
	try {
		if (navigator.clipboard?.writeText) {
			await navigator.clipboard.writeText(text);
			return true;
		}
	} catch (e) {
		// Fall through.
	}

	try {
		const area = document.createElement("textarea");
		area.value = text;
		area.setAttribute("readonly", "");
		area.style.position = "absolute";
		area.style.left = "-9999px";
		document.body.appendChild(area);
		area.select();
		const ok = document.execCommand("copy");
		document.body.removeChild(area);
		return ok;
	} catch (e) {
		return false;
	}
}

/**
 * @return {JSX.Element} Saved Templates page.
 */
const SavedTemplates = () => {
	const { items, totalItems, loading, error, fetchTemplates, duplicate, remove } = useTemplates();
	const [searchValue, setSearchValue] = useState("");
	const [debouncedSearch, setDebouncedSearch] = useState("");
	const [selected, setSelected] = useState([]);
	const [bulkAction, setBulkAction] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [copiedId, setCopiedId] = useState(null);
	const [showEmpty, setShowEmpty] = useState(false);
	const searchTimer = useRef(null);
	const { newTemplateUrl = "" } = sp_eab_admin_dashboard_localize || {};

	// Debounce the search box; committing a term always restarts at page 1 of
	// the filtered set.
	useEffect(() => {
		clearTimeout(searchTimer.current);
		searchTimer.current = setTimeout(() => {
			setDebouncedSearch(searchValue.trim());
			setCurrentPage(1);
		}, 300);
		return () => clearTimeout(searchTimer.current);
	}, [searchValue]);

	// The list lives on the server: page and search changes fetch it.
	useEffect(() => {
		fetchTemplates(debouncedSearch, currentPage, PER_PAGE);
	}, [fetchTemplates, debouncedSearch, currentPage]);

	const totalPages = Math.max(1, Math.ceil(totalItems / PER_PAGE));

	// Brief spinner before empty copy.
	useEffect(() => {
		setShowEmpty(false);
		if (loading) {
			return undefined;
		}
		if (items.length > 0) {
			return undefined;
		}
		const t = setTimeout(() => setShowEmpty(true), 800);
		return () => clearTimeout(t);
	}, [loading, items.length]);

	const headerChecked = items.length > 0 && allSelected(items, selected);

	// Library size from the server, not the current page — an unmatched search
	// must not read as an empty library and bring the hero back.
	const hasTemplates = totalItems > 0;
	const showHero = !loading && !error && 0 === totalItems && "" === debouncedSearch;

	/**
	 * @param {number[]} ids IDs to delete.
	 */
	const handleDelete = async (ids) => {
		const list = Array.isArray(ids) ? ids : [ids];
		const message =
			list.length > 1
				? sprintf(
						/* translators: %d: number of templates. */
						__("Delete %d templates? They will be moved to Trash.", "easy-accordion-free"),
						list.length
					)
				: __("Delete this template? It will be moved to Trash.", "easy-accordion-free");

		// eslint-disable-next-line no-alert
		if (!window.confirm(message)) {
			return;
		}

		const deleted = await remove(list);
		if (deleted.length) {
			const removedSet = new Set(deleted);
			setSelected((prev) => prev.filter((id) => !removedSet.has(id)));

			// Clamp the page: emptying the last page steps back to the new
			// last page instead of showing an empty one.
			const remainingPages = Math.max(1, Math.ceil((totalItems - deleted.length) / PER_PAGE));
			const nextPage = Math.min(currentPage, remainingPages);
			setCurrentPage(nextPage);
			// An explicit fetch: nextPage can equal currentPage, in which case
			// the effect above does not re-run on its own.
			fetchTemplates(debouncedSearch, nextPage, PER_PAGE);
		}
	};

	const applyBulk = async () => {
		if ("delete" !== bulkAction || 0 === selected.length) {
			return;
		}
		await handleDelete(selected);
		setBulkAction("");
	};

	/**
	 * Duplicate, then land on page 1 where the draft copy now sits.
	 *
	 * @param {number} id Template id.
	 */
	const handleDuplicate = async (id) => {
		const ok = await duplicate(id);
		if (ok) {
			setCurrentPage(1);
			// Same explicit-refetch rule as delete: page 1 may already be current.
			fetchTemplates(debouncedSearch, 1, PER_PAGE);
		}
	};

	/**
	 * @param {Object} row Template row.
	 */
	const copyShortcode = async (row) => {
		const ok = await copyToClipboard(row.shortcode);
		if (!ok) {
			return;
		}
		setCopiedId(row.id);
		setTimeout(() => {
			setCopiedId((id) => (id === row.id ? null : id));
		}, 2000);
	};

	/**
	 * The Block column: a "Classic" badge for classic shortcodes, the parsed
	 * block label for block templates, or a dash for an empty template.
	 *
	 * @param {Object} row Template row.
	 * @return {JSX.Element} Cell content.
	 */
	const renderBlockCell = (row) => {
		if ("classic" === row.source) {
			return (
				<span
					className="speap-saved-template-block-badge speap-saved-template-block-badge--classic"
					title={__("Classic shortcode accordion", "easy-accordion-free")}
				>
					{__("Classic", "easy-accordion-free")}
				</span>
			);
		}
		if (row.blockLabel) {
			return (
				<span className="speap-saved-template-block-badge" title={(row.blockTypes || []).join(", ")}>
					{row.blockLabel}
				</span>
			);
		}
		return (
			<span
				className="speap-saved-template-block-empty"
				aria-label={__("No accordion block yet", "easy-accordion-free")}
			>
				&mdash;
			</span>
		);
	};

	const labels = useMemo(() => columnLabels(), []);
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
	const rangeStart = items.length === 0 ? 0 : (currentPage - 1) * PER_PAGE + 1;
	const rangeEnd = (currentPage - 1) * PER_PAGE + items.length;

	return (
		<div className="speap-saved-templates-page-wrapper">
			{showHero && <SavedTemplatesHero />}

			<div
				className={`speap-saved-templates-page-container${
					hasTemplates ? "" : " speap-saved-templates-page-container--bare"
				}`}
			>
				{hasTemplates && (
					<div className="speap-saved-template-header">
						<div className="speap-saved-template-header-left">
							<select
								name="bulk-action"
								className="speap-saved-template-select"
								value={bulkAction}
								onChange={(e) => setBulkAction(e.target.value)}
								aria-label={__("Bulk action", "easy-accordion-free")}
							>
								<option value="">{__("Bulk Action", "easy-accordion-free")}</option>
								<option value="delete">{__("Delete", "easy-accordion-free")}</option>
							</select>
							<button
								type="button"
								className="speap-saved-template-select-apply"
								onClick={applyBulk}
								disabled={!bulkAction || 0 === selected.length}
							>
								{__("Apply", "easy-accordion-free")}
							</button>
							<input
								name="search-templates"
								className="speap-saved-template-search-field"
								type="text"
								placeholder={__("Search…", "easy-accordion-free")}
								spellCheck="false"
								value={searchValue}
								onChange={(e) => setSearchValue(e.target.value)}
								aria-label={__("Search templates", "easy-accordion-free")}
							/>
						</div>
						<div className="speap-saved-template-header-right">
							{newTemplateUrl ? (
								<a href={newTemplateUrl} className="speap-saved-template-add-new" rel="noreferrer">
									<PlusIcon />
									{__("Create a Saved Template", "easy-accordion-free")}
								</a>
							) : null}
						</div>
					</div>
				)}

				<table className="speap-saved-template-content-table">
					<thead className="speap-saved-template-table-head">
						<tr>
							<th className="speap-saved-template-table-checkBox">
								<input
									type="checkbox"
									checked={headerChecked}
									onChange={() => setSelected(toggleSelectAll(items, selected))}
									disabled={items.length === 0}
									aria-label={__("Select all templates", "easy-accordion-free")}
								/>
							</th>
							<th className="speap-saved-template-table-title">{labels.title}</th>
							<th className="speap-saved-template-table-block">{labels.block}</th>
							<th className="speap-saved-template-table-shortcode">{labels.shortcode}</th>
							<th className="speap-saved-template-table-date">{labels.date}</th>
							<th className="speap-saved-template-table-action">{labels.action}</th>
						</tr>
					</thead>
					<tbody className="speap-saved-template-table-body">
						{loading && (
							<tr className="speap-saved-template-state-row">
								<td colSpan={COLUMN_COUNT} className="speap-saved-template-preloader-no-data">
									<span className="speap-saved-template-loading">
										<Spinner />
										{__("Loading templates…", "easy-accordion-free")}
									</span>
								</td>
							</tr>
						)}

						{!loading && error && (
							<tr className="speap-saved-template-state-row">
								<td colSpan={COLUMN_COUNT} className="speap-saved-template-no-data">
									<p>{error}</p>
									<button
										type="button"
										className="speap-saved-template-select-apply"
										onClick={() => fetchTemplates(debouncedSearch, currentPage, PER_PAGE)}
									>
										{__("Retry", "easy-accordion-free")}
									</button>
								</td>
							</tr>
						)}

						{!loading && !error && 0 === items.length && !showEmpty && (
							<tr className="speap-saved-template-state-row">
								<td colSpan={COLUMN_COUNT} className="speap-saved-template-preloader-no-data">
									<span className="speap-saved-template-loading">
										<Spinner />
									</span>
								</td>
							</tr>
						)}

						{!loading && !error && 0 === items.length && showEmpty && (
							<tr className="speap-saved-template-state-row speap-saved-template-empty-row">
								<td colSpan={COLUMN_COUNT} className="speap-saved-template-preloader-no-data">
									<div className="speap-saved-template-empty">
										<div className="speap-saved-template-empty__message">
											<EmptyStateFolderIcon />
											<p className="speap-saved-template-empty__text">
												{debouncedSearch
													? __("No templates match your search.", "easy-accordion-free")
													: __("No saved templates yet.", "easy-accordion-free")}
											</p>
										</div>
										{!hasTemplates && newTemplateUrl ? (
											<a
												href={newTemplateUrl}
												rel="noreferrer"
												className="speap-saved-template-empty__cta"
											>
												{__("Create a Saved Template", "easy-accordion-free")}
												<PlusIcon />
											</a>
										) : null}
									</div>
								</td>
							</tr>
						)}

						{!loading &&
							!error &&
							items.map((row) => (
								<tr key={row.id}>
									<td className="speap-saved-template-table-checkBox">
										<input
											type="checkbox"
											checked={selected.includes(row.id)}
											onChange={() => setSelected(toggleSelection(selected, row.id))}
											aria-label={sprintf(
												/* translators: %s: template title. */
												__("Select %s", "easy-accordion-free"),
												row.title
											)}
										/>
									</td>
									<td className="speap-saved-template-table-title">
										<a href={row.editUrl}>{row.title}</a>
										{"publish" !== row.status && (
											<span className="speap-saved-template-badge">{row.status}</span>
										)}
									</td>
									<td className="speap-saved-template-table-block" data-label={labels.block}>
										{renderBlockCell(row)}
									</td>
									<td className="speap-saved-template-table-shortcode" data-label={labels.shortcode}>
										<span
											className="speap-saved-template-shortcode-text"
											onClick={() => copyShortcode(row)}
											onKeyDown={(e) => {
												if ("Enter" === e.key || " " === e.key) {
													e.preventDefault();
													copyShortcode(row);
												}
											}}
											role="button"
											tabIndex={0}
											title={__("Click to copy", "easy-accordion-free")}
										>
											{row.shortcode}
										</span>
										{copiedId === row.id && (
											<span className="speap-shortcode-copy-tooltip">
												<CheckIcon />
												{__("Copied!", "easy-accordion-free")}
											</span>
										)}
									</td>
									<td className="speap-saved-template-table-date" data-label={labels.date}>
										<span className="speap-saved-template-date-value">
											{row.status}
											<br />
											{row.dateDisplay}
										</span>
									</td>
									<td className="speap-saved-template-table-action" data-label={labels.action}>
										<div className="speap-saved-template-table-action-btn">
											<a
												className="speap-saved-template-action speap-action-edit"
												href={row.editUrl}
												aria-label={__("Edit", "easy-accordion-free")}
												title={__("Edit", "easy-accordion-free")}
											>
												<EditPencilIcon />
											</a>
											<button
												type="button"
												className="speap-saved-template-action speap-action-copy"
												onClick={() => handleDuplicate(row.id)}
												aria-label={__("Duplicate", "easy-accordion-free")}
												title={__("Duplicate", "easy-accordion-free")}
											>
												<CopyIcon />
											</button>
											<button
												type="button"
												className="speap-saved-template-action speap-action-delete"
												onClick={() => handleDelete([row.id])}
												aria-label={__("Delete", "easy-accordion-free")}
												title={__("Delete", "easy-accordion-free")}
											>
												<DeleteBinIcon />
											</button>
										</div>
									</td>
								</tr>
							))}
					</tbody>
				</table>

				{!loading && !error && items.length > 0 && (
					<div className="speap-saved-template-footer">
						<p className="speap-saved-template-count">
							{sprintf(
								/* translators: 1: start, 2: end, 3: total */
								__("%1$d–%2$d of %3$d items", "easy-accordion-free"),
								rangeStart,
								rangeEnd,
								totalItems
							)}
						</p>
						{totalPages > 1 && (
							<div className="speap-saved-template-pagination">
								<button
									type="button"
									className={`speap-saved-template-pagination-btn${
										currentPage <= 1 ? " btn-disabled" : ""
									}`}
									disabled={currentPage <= 1}
									onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
									aria-label={__("Previous page", "easy-accordion-free")}
								>
									<LeftArrow />
								</button>
								{pages.map((n) => (
									<button
										key={n}
										type="button"
										className={`speap-saved-template-pagination-btn${
											n === currentPage ? " btn-active" : ""
										}`}
										onClick={() => setCurrentPage(n)}
									>
										{n}
									</button>
								))}
								<button
									type="button"
									className={`speap-saved-template-pagination-btn${
										currentPage >= totalPages ? " btn-disabled" : ""
									}`}
									disabled={currentPage >= totalPages}
									onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
									aria-label={__("Next page", "easy-accordion-free")}
								>
									<RightArrow />
								</button>
							</div>
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default SavedTemplates;
