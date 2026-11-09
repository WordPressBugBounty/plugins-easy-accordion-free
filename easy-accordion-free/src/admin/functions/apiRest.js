/**
 * Shared REST helper for the `easy-accordion/v2` namespace.
 *
 * Sends the core `wp_rest` nonce as `X-WP-Nonce`, JSON-encodes the body for
 * writes, and normalizes WordPress REST error envelopes into thrown Errors.
 */

import { __ } from "@wordpress/i18n";

/**
 * Call an `easy-accordion/v2` REST route.
 *
 * @param {string} path             Route path relative to the namespace (e.g. "templates").
 * @param {Object} [options]        Request options.
 * @param {string} [options.method] HTTP method (default GET).
 * @param {Object} [options.data]   JSON body for writes.
 * @return {Promise<*>} Parsed JSON response.
 * @throws {Error} When the request fails or WordPress returns an error.
 */
export async function apiRest(path, { method = "GET", data } = {}) {
	const { restUrl, restNonce } = sp_eab_admin_dashboard_localize || {};

	const base = String(restUrl || "").replace(/\/$/, "");
	const url = `${base}/${String(path).replace(/^\//, "")}`;

	const options = {
		method,
		credentials: "same-origin",
		headers: { "X-WP-Nonce": restNonce || "" },
	};

	if (undefined !== data) {
		options.headers["Content-Type"] = "application/json";
		options.body = JSON.stringify(data);
	}

	const response = await fetch(url, options);
	const json = await response.json().catch(() => null);

	if (!response.ok) {
		const message = json && json.message ? json.message : __("Request failed", "easy-accordion-free");
		throw new Error(message);
	}

	return json;
}
