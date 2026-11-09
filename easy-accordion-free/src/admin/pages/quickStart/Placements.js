/**
 * Dashboard card: "Accordion Placements".
 *
 * Lists every page, post, template and widget area that shows an Easy
 * Accordion block, classic shortcode accordion or saved template, and the
 * accordions and templates not placed anywhere yet. The report comes from
 * `sp_eab_block_usage` (EAP_Block_Usage::report()) and is stored server-side:
 * every visit shows it as it was last synced, and only the Sync button (or a
 * first visit, with nothing stored yet) scans the site.
 */

import { __, sprintf } from "@wordpress/i18n";
import { useCallback, useEffect, useMemo, useRef, useState } from "@wordpress/element";
import { toastErrorMsg } from "../../functions";
import useRelativeTime from "./useRelativeTime";
import { PAGE_SIZE, filterRows, formatDate, sourceFilters, sourceLabel, splitLayouts } from "./usageHelpers";

const ExternalIcon = () => (
	<svg
		viewBox="0 0 24 24"
		width="12"
		height="12"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
		focusable="false"
	>
		<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
		<path d="M15 3h6v6" />
		<path d="M10 14L21 3" />
	</svg>
);

const SyncIcon = () => (
	<svg
		viewBox="0 0 24 24"
		width="16"
		height="16"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
		aria-hidden="true"
		focusable="false"
	>
		<path d="M21 12a9 9 0 0 1-15.5 6.2L3 16" />
		<path d="M3 12a9 9 0 0 1 15.5-6.2L21 8" />
		<path d="M21 3v5h-5" />
		<path d="M3 21v-5h5" />
	</svg>
);

/**
 * Empty-state artwork: a browser window with three dashed accordion slots.
 *
 * @return {JSX.Element} Artwork.
 */
const EmptyArtwork = () => (
	<svg
		className="speap-placements__empty-art"
		viewBox="0 0 200 114"
		width="150"
		height="86"
		fill="none"
		aria-hidden="true"
		focusable="false"
	>
		<rect x="22" y="14" width="156" height="96" rx="10" fill="#fff" stroke="#dcdcde" />
		<path d="M22 24a10 10 0 0 1 10-10h136a10 10 0 0 1 10 10v8H22z" fill="#f6f7f7" />
		<line x1="22" y1="32" x2="178" y2="32" stroke="#dcdcde" />
		<circle cx="33" cy="23" r="2.5" fill="#dcdcde" />
		<circle cx="41" cy="23" r="2.5" fill="#dcdcde" />
		<circle cx="49" cy="23" r="2.5" fill="#dcdcde" />
		<rect x="34" y="52" width="38" height="5" rx="2.5" fill="#f2f3f4" />
		<rect x="44" y="66" width="30" height="24" rx="5" fill="#fff3ee" stroke="#ffcdbb" strokeDasharray="3 3" />
		<rect x="85" y="66" width="30" height="24" rx="5" fill="#fff3ee" stroke="#ffcdbb" strokeDasharray="3 3" />
		<rect x="126" y="66" width="30" height="24" rx="5" fill="#fff3ee" stroke="#ffcdbb" strokeDasharray="3 3" />
		<path d="M36 74l-4 4 4 4" stroke="#c3c4c7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
		<path d="M164 74l4 4-4 4" stroke="#c3c4c7" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
		<circle cx="92" cy="98" r="2" fill="var(--eab-primary-color)" />
		<circle cx="100" cy="98" r="2" fill="#dcdcde" />
		<circle cx="108" cy="98" r="2" fill="#dcdcde" />
		<circle cx="168" cy="18" r="15" fill="var(--eab-primary-color)" />
		<path d="M168 11v14M161 18h14" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
	</svg>
);

/**
 * Ask the dashboard endpoint for the placements report.
 *
 * @param {boolean} [force] Scan the site again instead of answering from the
 *                          cached report.
 * @return {Promise<Object>} Report.
 */
async function fetchPlacements(force = false) {
	const { ajax_url: ajaxUrl, nonce } = sp_eab_admin_dashboard_localize || {};
	const body = new FormData();
	body.append("action", "sp_eab_block_usage");
	body.append("nonce", nonce || "");
	if (force) {
		body.append("refresh", "true");
	}

	const response = await fetch(ajaxUrl, { method: "POST", credentials: "same-origin", body });
	const json = await response.json();

	if (!json?.success) {
		throw new Error(json?.data?.message || __("The placements could not be loaded.", "easy-accordion-free"));
	}

	return json.data;
}

/**
 * Sync button: scans the site again. Its tooltip says when the report was
 * last built, kept current by its own timer so the table does not re-render
 * every second.
 *
 * @param {Object}   props
 * @param {boolean}  props.syncing   A scan is running.
 * @param {number}   props.scannedAt Unix seconds of the last scan.
 * @param {Function} props.onSync    Start a scan.
 * @return {JSX.Element} Button with tooltip.
 */
function SyncButton({ syncing, scannedAt, onSync }) {
	const ago = useRelativeTime(scannedAt);
	const justNow = scannedAt && Math.floor(Date.now() / 1000) - scannedAt < 10;
	const title = syncing
		? __("Scanning your site…", "easy-accordion-free")
		: __("Sync placements", "easy-accordion-free");
	let detail = __("Looking for blocks & shortcodes", "easy-accordion-free");

	if (!syncing) {
		detail = sprintf(
			/* translators: %s: when the placements were last scanned, e.g. "2 minutes ago" or "just now" */
			__("Last synced %s", "easy-accordion-free"),
			justNow ? __("just now", "easy-accordion-free") : ago
		);
	}

	return (
		<span className="speap-placements__tip-wrap">
			<button
				type="button"
				className={`speap-placements__sync${syncing ? " is-syncing" : ""}`}
				onClick={onSync}
				disabled={syncing}
				aria-label={title}
				aria-describedby="speap-placements-sync-tip"
			>
				<SyncIcon />
			</button>
			<span className="speap-placements__tip" id="speap-placements-sync-tip" role="tooltip">
				{title}
				{(syncing || scannedAt) && <span className="speap-placements__tip-sub">{detail}</span>}
			</span>
		</span>
	);
}

/**
 * "Used on" cell: where the placement is, with Edit / View on hover.
 *
 * @param {Object} props
 * @param {Object} props.row Report row.
 * @return {JSX.Element} Cell.
 */
function UsedOn({ row }) {
	const { location } = row;

	if (!location) {
		return (
			<div className="speap-placements__where">
				<div className="speap-placements__unused">{__("Not used yet", "easy-accordion-free")}</div>
				<div className="speap-placements__sub">
					<span
						className={`speap-placements__meta speap-placements__meta--unused${row.editUrl ? " has-actions" : ""}`}
					>
						{__("Add it to a page or post", "easy-accordion-free")}
					</span>
					{row.editUrl && (
						<span className="speap-placements__actions">
							<a href={row.editUrl} className="speap-placements__action">
								{__("Edit", "easy-accordion-free")}
							</a>
						</span>
					)}
				</div>
			</div>
		);
	}

	const hasActions = location.editUrl || location.viewUrl;

	return (
		<div className="speap-placements__where">
			<div className="speap-placements__title-line">
				{location.editUrl ? (
					<a href={location.editUrl} className="speap-placements__title">
						{location.title}
					</a>
				) : (
					<span className="speap-placements__title">{location.title}</span>
				)}
				{location.statusLabel && <span className="speap-placements__status">{location.statusLabel}</span>}
			</div>
			<div className="speap-placements__sub">
				<span className={`speap-placements__meta${hasActions ? " has-actions" : ""}`}>{location.type}</span>
				{hasActions && (
					<span className="speap-placements__actions">
						{location.editUrl && (
							<a href={location.editUrl} className="speap-placements__action">
								{__("Edit", "easy-accordion-free")}
							</a>
						)}
						{location.editUrl && location.viewUrl && (
							<span className="speap-placements__sep" aria-hidden="true">
								|
							</span>
						)}
						{location.viewUrl && (
							<a
								href={location.viewUrl}
								className="speap-placements__action"
								target="_blank"
								rel="noreferrer"
							>
								{__("View", "easy-accordion-free")}
								<ExternalIcon />
							</a>
						)}
					</span>
				)}
			</div>
		</div>
	);
}

/**
 * "Type & Layouts" cell: the source, then its layouts, the tail folded
 * behind a "+N" toggle.
 *
 * @param {Object} props
 * @param {Object} props.row Report row.
 * @return {JSX.Element} Cell.
 */
function TypeAndLayouts({ row }) {
	const [expanded, setExpanded] = useState(false);
	const { shown, rest } = splitLayouts(row.layouts);
	const names = (row.names || []).filter(Boolean).join(", ");

	return (
		<div className="speap-placements__layouts" title={names || undefined}>
			<span className={`speap-placements__type speap-placements__type--${row.source}`}>
				{sprintf(
					/* translators: %s: "Block", "Shortcode" or "Saved Template" */
					__("%s:", "easy-accordion-free"),
					sourceLabel(row.source)
				)}
			</span>{" "}
			{shown.join(", ")}
			{rest.length > 0 && (
				<>
					{" "}
					<button
						type="button"
						className="speap-placements__more"
						aria-expanded={expanded}
						onClick={() => setExpanded((open) => !open)}
					>
						{expanded
							? __("Show less", "easy-accordion-free")
							: sprintf(
									/* translators: %d: number of hidden layouts */
									__("+%d", "easy-accordion-free"),
									rest.length
								)}
					</button>
					<div className={`speap-placements__rest${expanded ? " is-open" : ""}`} aria-hidden={!expanded}>
						<div className="speap-placements__rest-clip">
							<div className="speap-placements__rest-text">{rest.join(", ")}</div>
						</div>
					</div>
				</>
			)}
		</div>
	);
}

/**
 * The card.
 *
 * @param {Object}   props
 * @param {string}   props.createUrl  Where "Add to a Page" goes, for the empty state.
 * @param {Function} [props.onReport] Called with each report that loads.
 * @return {JSX.Element} Card.
 */
export default function Placements({ createUrl = "", onReport }) {
	const [report, setReport] = useState(null);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [source, setSource] = useState("all");
	const [query, setQuery] = useState("");
	const [limit, setLimit] = useState(PAGE_SIZE);
	const [syncing, setSyncing] = useState(false);

	// Every visit shows the stored report as it was last synced; the server
	// scans by itself only when it has none yet (the very first visit).
	const load = useCallback(async () => {
		setLoading(true);
		setError("");

		try {
			setReport(await fetchPlacements());
		} catch (loadError) {
			setError(loadError.message);
		} finally {
			setLoading(false);
		}
	}, []);

	useEffect(() => {
		load();
	}, [load]);

	// Tell the page about every report that lands (first load and each Sync).
	// Held in a ref so a new callback each render does not re-fire it.
	const onReportRef = useRef(onReport);
	onReportRef.current = onReport;

	useEffect(() => {
		if (report && onReportRef.current) {
			onReportRef.current(report);
		}
	}, [report]);

	// Sync: the only way the report changes after that. The table stays up
	// while it runs, and a failed scan keeps it and says so in a toast.
	const sync = useCallback(async () => {
		setSyncing(true);

		try {
			setReport(await fetchPlacements(true));
		} catch (syncError) {
			toastErrorMsg(syncError.message);
		} finally {
			setSyncing(false);
		}
	}, []);

	const allRows = useMemo(() => (Array.isArray(report?.rows) ? report.rows : []), [report]);
	const filters = useMemo(() => sourceFilters(allRows), [allRows]);
	// A tab that is no longer offered (one type left after a reload) falls
	// back to All rather than filtering by something the user cannot see.
	const activeSource = filters.some((filter) => filter.key === source) ? source : "all";
	const rows = useMemo(() => filterRows(allRows, { source: activeSource, query }), [allRows, activeSource, query]);
	const visibleRows = rows.slice(0, limit);
	const isEmpty = !!report && !error && 0 === allRows.length;
	const isFilled = !!report && !error && allRows.length > 0;

	const pickSource = (key) => {
		setSource(key);
		setLimit(PAGE_SIZE);
	};

	return (
		<section className="speap-placements" aria-busy={loading || syncing}>
			<div className="speap-placements__head">
				<div>
					<h2 className="speap-placements__heading">{__("Accordion Placements", "easy-accordion-free")}</h2>
					<p className="speap-placements__intro">
						{__(
							"Track every block, shortcode, and saved template across your site.",
							"easy-accordion-free"
						)}
					</p>
				</div>

				{isEmpty && (
					<div className="speap-placements__tools">
						<SyncButton syncing={syncing} scannedAt={report.scannedAt} onSync={sync} />
					</div>
				)}

				{isFilled && (
					<div className="speap-placements__tools">
						{filters.length > 0 && (
							<div
								className="speap-placements__filters"
								role="group"
								aria-label={__("Filter by type", "easy-accordion-free")}
							>
								{filters.map((filter) => (
									<button
										key={filter.key}
										type="button"
										className={`speap-placements__filter${activeSource === filter.key ? " is-active" : ""}`}
										aria-pressed={activeSource === filter.key}
										onClick={() => pickSource(filter.key)}
									>
										{filter.label}
									</button>
								))}
							</div>
						)}
						<SyncButton syncing={syncing} scannedAt={report.scannedAt} onSync={sync} />
						<label className="speap-placements__search" htmlFor="speap-placements-search-input">
							<span className="dashicons dashicons-search" aria-hidden="true" />
							<input
								id="speap-placements-search-input"
								type="search"
								value={query}
								onChange={(event) => {
									setQuery(event.target.value);
									setLimit(PAGE_SIZE);
								}}
								placeholder={__("Search", "easy-accordion-free")}
								aria-label={__("Search placements", "easy-accordion-free")}
							/>
						</label>
					</div>
				)}
			</div>

			{error && (
				<div className="speap-placements__state" role="alert">
					<p>{error}</p>
					<button type="button" className="speap-placements__load-more" onClick={load}>
						{__("Try again", "easy-accordion-free")}
					</button>
				</div>
			)}

			{!error && !report && (
				<div className="speap-placements__skeleton" aria-hidden="true">
					{[0, 1, 2].map((i) => (
						<span key={i} className="speap-placements__skeleton-row" />
					))}
				</div>
			)}

			{isFilled && (
				<>
					<div className="speap-placements__table" role="table">
						<div className="speap-placements__row speap-placements__row--head" role="row">
							<span role="columnheader">{__("Used on", "easy-accordion-free")}</span>
							<span role="columnheader">{__("Type & Layouts", "easy-accordion-free")}</span>
							<span role="columnheader">{__("Last updated", "easy-accordion-free")}</span>
						</div>

						{visibleRows.map((row) => (
							<div key={row.key} className="speap-placements__row" role="row">
								<div role="cell" className="speap-placements__cell">
									<UsedOn row={row} />
								</div>
								<div role="cell" className="speap-placements__cell">
									<TypeAndLayouts row={row} />
								</div>
								<div role="cell" className="speap-placements__cell speap-placements__date">
									{formatDate(row.modified)}
								</div>
							</div>
						))}

						{0 === rows.length && (
							<div className="speap-placements__no-match">
								{__("Nothing matches your filter.", "easy-accordion-free")}
							</div>
						)}
					</div>

					<div className="speap-placements__foot">
						{rows.length > limit && (
							<button
								type="button"
								className="speap-placements__load-more"
								onClick={() => setLimit((current) => current + PAGE_SIZE)}
							>
								{__("Load more", "easy-accordion-free")}
								<span className="dashicons dashicons-arrow-down-alt2" aria-hidden="true" />
							</button>
						)}
						<span>
							{sprintf(
								/* translators: 1: rows shown, 2: rows matching */
								__("Showing %1$d of %2$d", "easy-accordion-free"),
								visibleRows.length,
								rows.length
							)}
							{report.capped &&
								" · " +
									__("Only the 500 most recently updated items were scanned.", "easy-accordion-free")}
						</span>
					</div>
				</>
			)}

			{isEmpty && (
				<div className="speap-placements__empty">
					<EmptyArtwork />
					<h3 className="speap-placements__empty-title">{__("No Accordions Yet", "easy-accordion-free")}</h3>
					<p className="speap-placements__empty-text">
						{__(
							"Add a block, shortcode, or saved template to any page or post, and it will show up here.",
							"easy-accordion-free"
						)}
					</p>
					{createUrl && (
						<a className="speap-placements__empty-link" href={createUrl}>
							{__("Add to a Page", "easy-accordion-free")}
							<span className="dashicons dashicons-plus-alt2" aria-hidden="true" />
						</a>
					)}
				</div>
			)}
		</section>
	);
}
