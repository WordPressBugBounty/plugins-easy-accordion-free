/**
 * Saved-templates data hook.
 *
 * Fetches one server-paginated page of the template list from
 * `easy-accordion/v2/templates` (sp_eap_template block templates + sp_easy_accordion
 * classic shortcodes, merged server-side): search, page and per_page go in the
 * query, the rows and the filtered total come back. The duplicate / delete
 * handlers stay here on the React side: each calls its REST endpoint, toasts,
 * and the page component refetches — no local list mutation to drift out of
 * step with the server's ordering.
 *
 * Post ids are unique across the two listed post types (`sp_eap_template`
 * and `sp_easy_accordion`): WordPress draws every post id from the same
 * wp_posts sequence, so bare numeric ids select rows safely.
 */

import { useState, useEffect, useCallback, useRef } from "@wordpress/element";
import { __ } from "@wordpress/i18n";
import { toastSuccessMsg, toastErrorMsg } from "../functions";
import { apiRest } from "../functions/apiRest";

/**
 * @typedef {Object} TemplatesData
 * @property {Array<Object>} items          Rows on the current page.
 * @property {number}        totalItems     Filtered total, from the server.
 * @property {boolean}       loading        Fetch-in-flight flag.
 * @property {string|null}   error          Load error message, if any.
 * @property {Function}      fetchTemplates (search, page, perPage) => Promise<void>.
 * @property {Function}      duplicate      (id) => Promise<boolean>.
 * @property {Function}      remove         (ids) => Promise<number[]> Deleted ids.
 */

/**
 * @return {TemplatesData} Page state + actions.
 */
export default function useTemplates() {
	const [items, setItems] = useState([]);
	const [totalItems, setTotalItems] = useState(0);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState(null);

	const mounted = useRef(true);
	// Latest in-flight request: a slow page 1 answer arriving after the user
	// has already moved to page 3 must not paint over it.
	const requestId = useRef(0);
	useEffect(() => {
		mounted.current = true;
		return () => {
			mounted.current = false;
		};
	}, []);

	/**
	 * Load one page of the list.
	 *
	 * @param {string} search  Search text ('' lists everything).
	 * @param {number} page    1-based page number.
	 * @param {number} perPage Rows per page.
	 * @return {Promise<void>}
	 */
	const fetchTemplates = useCallback(async (search = "", page = 1, perPage = 10) => {
		const id = ++requestId.current;
		setLoading(true);
		setError(null);

		const params = new URLSearchParams();
		if (search) {
			params.set("search", search);
		}
		params.set("page", String(page));
		params.set("per_page", String(perPage));

		try {
			const data = await apiRest(`templates?${params.toString()}`);
			if (mounted.current && id === requestId.current) {
				setItems(Array.isArray(data?.templates) ? data.templates : []);
				setTotalItems(Number(data?.total_items) || 0);
			}
		} catch (e) {
			if (mounted.current && id === requestId.current) {
				setError(e.message || __("Could not load templates.", "easy-accordion-free"));
				setItems([]);
				setTotalItems(0);
			}
		} finally {
			if (mounted.current && id === requestId.current) {
				setLoading(false);
			}
		}
	}, []);

	useEffect(() => {
		fetchTemplates();
	}, [fetchTemplates]);

	/**
	 * Duplicate a template; the caller refetches (the draft copy is the
	 * newest post, so page 1 is where it lands).
	 *
	 * @param {number} id Template id.
	 * @return {Promise<boolean>} Whether the call succeeded.
	 */
	const duplicate = useCallback(async (id) => {
		try {
			await apiRest("templates/duplicate", {
				method: "POST",
				data: { id },
			});

			toastSuccessMsg(__("Template duplicated.", "easy-accordion-free"));
			return true;
		} catch (e) {
			toastErrorMsg(e.message || __("Could not duplicate the template.", "easy-accordion-free"));
			return false;
		}
	}, []);

	/**
	 * Trash templates server-side; the caller refetches with a clamped page.
	 *
	 * @param {number[]} ids Template ids.
	 * @return {Promise<number[]>} Ids the server actually trashed.
	 */
	const remove = useCallback(async (ids) => {
		const list = (Array.isArray(ids) ? ids : [ids]).map((id) => parseInt(id, 10)).filter((id) => id > 0);

		if (0 === list.length) {
			return [];
		}

		try {
			const res = await apiRest("templates/delete", {
				method: "POST",
				data: { ids: list },
			});

			toastSuccessMsg(
				1 === list.length
					? __("Template deleted.", "easy-accordion-free")
					: __("Templates deleted.", "easy-accordion-free")
			);

			return res && Array.isArray(res.deleted) ? res.deleted : list;
		} catch (e) {
			toastErrorMsg(e.message || __("Could not delete the template.", "easy-accordion-free"));
			return [];
		}
	}, []);

	return { items, totalItems, loading, error, fetchTemplates, duplicate, remove };
}
