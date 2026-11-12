import axios from "axios";
import { __, sprintf } from "@wordpress/i18n";
import { toastErrorMsg } from "../functions";
import { readSettingsResponse, responseExcerpt } from "./response";

export const setApiData = (data) => ({
	type: "SET_API_DATA",
	data,
});

export const setLoading = (isLoading) => ({
	type: "SET_LOADING",
	isLoading,
});

export const setSaving = (isSaving) => ({
	type: "SET_SAVING",
	isSaving,
});

export const setLoadError = (loadError) => ({
	type: "SET_LOAD_ERROR",
	loadError,
});

// The message a failed request carries: ours (`wp_send_json_error`), else axios's own.
const requestErrorMessage = (error) => error?.response?.data?.data?.message || error?.message || "";

/**
 * Fetch initial API data (sends empty queryData).
 */
export const fetchApiData =
	() =>
	async ({ dispatch }) => {
		dispatch(setLoading(true));
		try {
			const data = new FormData();
			data.append("nonce", sp_eab_admin_dashboard_localize?.nonce);
			data.append("action", "sp_eab_admin_option_update");
			data.append("queryData", JSON.stringify({}));

			const response = await axios.post(sp_eab_admin_dashboard_localize?.ajax_url, data);
			const settings = readSettingsResponse(response.data);
			if (settings) {
				dispatch(setApiData(settings));
				dispatch(setLoadError(null));
			} else {
				// Rendering nothing here left the whole dashboard blank, with no error anywhere.
				dispatch(
					setLoadError({
						message: __(
							"The server sent an unexpected response. This is often a PHP notice or warning, or other text, printed by a plugin or theme.",
							"easy-accordion-free"
						),
						response: responseExcerpt(response.data),
					})
				);
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error fetching data:", error.message);
			dispatch(
				setLoadError({
					message: requestErrorMessage(error),
					response: responseExcerpt(error?.response?.data),
				})
			);
		}
		dispatch(setLoading(false));
	};

/**
 * Save modified settings to the API.
 * The API returns the full updated state, which replaces the store data.
 *
 * @param {Object} modifiedData - The data to save (e.g. { pluginSettings: {...} }).
 * @param {string} editorPreference - The editor preference value.
 * @return {Promise<boolean>} Whether the save went through.
 */
export const saveSettings =
	(modifiedData, editorPreference) =>
	async ({ dispatch }) => {
		dispatch(setSaving(true));
		let isSaved = false;
		try {
			const data = new FormData();
			data.append("nonce", sp_eab_admin_dashboard_localize?.nonce);
			data.append("action", "sp_eab_admin_option_update");
			data.append("queryData", JSON.stringify(modifiedData));
			if (editorPreference !== undefined) {
				data.append("editorPreference", editorPreference);
			}

			const response = await axios.post(sp_eab_admin_dashboard_localize?.ajax_url, data);
			// A refused request answers `{ success: false }` instead of the settings.
			const settings = readSettingsResponse(response.data);
			if (settings) {
				dispatch(setApiData(settings));
				isSaved = true;
			} else {
				// eslint-disable-next-line no-console
				console.error("Error saving data: unexpected response", responseExcerpt(response.data));
				toastErrorMsg(
					__("The settings could not be saved: the server sent an unexpected response.", "easy-accordion-free")
				);
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error saving data:", error.message);
			toastErrorMsg(
				sprintf(
					/* translators: %s: the error message. */
					__("The settings could not be saved: %s", "easy-accordion-free"),
					requestErrorMessage(error)
				)
			);
		}
		dispatch(setSaving(false));
		return isSaved;
	};
