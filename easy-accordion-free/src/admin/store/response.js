/**
 * Reading the `sp_eab_admin_option_update` AJAX response.
 *
 * axios hands back the raw text instead of an object when the body isn't pure JSON: a PHP notice or
 * warning printed with `display_errors` on, a stray echo, or whitespace from any plugin or theme,
 * before or after our JSON. The settings are still in that text, so they are recovered from it.
 */

const isObject = (value) => !!value && typeof value === "object" && !Array.isArray(value);

// Every answer of the endpoint carries the full settings state; the dashboard can't render without `pluginSettings`.
const isSettingsPayload = (data) => isObject(data) && isObject(data.pluginSettings);

/**
 * The index of the `}` that closes the object opening at `start`, or -1.
 *
 * @param {string} text  The response text.
 * @param {number} start The index of a `{`.
 * @return {number} The index of its closing brace, or -1 when it isn't closed.
 */
const findObjectEnd = (text, start) => {
	let depth = 0;
	let inString = false;
	for (let i = start; i < text.length; i++) {
		const char = text[i];
		if (inString) {
			if (char === "\\") {
				i++;
			} else if (char === '"') {
				inString = false;
			}
		} else if (char === '"') {
			inString = true;
		} else if (char === "{") {
			depth++;
		} else if (char === "}") {
			depth--;
			if (depth === 0) {
				return i;
			}
		}
	}
	return -1;
};

/**
 * The settings payload of a `sp_eab_admin_option_update` response.
 *
 * @param {*} body The response body, as axios returns it (an object, or the raw text when it wasn't pure JSON).
 * @return {Object|null} The payload, or null when the response holds none.
 */
export const readSettingsResponse = (body) => {
	if (isSettingsPayload(body)) {
		return body;
	}
	if (typeof body !== "string") {
		return null;
	}
	// Try each `{"` (or `{}`) as the start of our JSON object; notice text before or after it is skipped.
	for (let start = body.indexOf("{"); start !== -1; start = body.indexOf("{", start + 1)) {
		if (!/^\{\s*["}]/.test(body.slice(start, start + 20))) {
			continue;
		}
		const end = findObjectEnd(body, start);
		if (end === -1) {
			continue;
		}
		try {
			const parsed = JSON.parse(body.slice(start, end + 1));
			if (isSettingsPayload(parsed)) {
				return parsed;
			}
		} catch (e) {
			// Not our JSON; try the next brace.
		}
	}
	return null;
};

/**
 * The start of a response body as plain text, to show the user (or support) what the server answered.
 *
 * @param {*}      body  The response body.
 * @param {number} limit The most characters to keep.
 * @return {string} The text, cut to `limit` characters.
 */
export const responseExcerpt = (body, limit = 500) => {
	let text = "";
	if (typeof body === "string") {
		text = body;
	} else if (body !== undefined && body !== null) {
		try {
			text = JSON.stringify(body);
		} catch (e) {
			text = String(body);
		}
	}
	text = text.trim();
	return text.length > limit ? `${text.slice(0, limit)}…` : text;
};
