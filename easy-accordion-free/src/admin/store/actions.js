import axios from "axios";

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
			dispatch(setApiData(response.data));
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error fetching data:", error.message);
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
			if (response?.data?.dashboardSettings || response?.data?.pluginSettings) {
				dispatch(setApiData(response.data));
				isSaved = true;
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error saving data:", error.message);
		}
		dispatch(setSaving(false));
		return isSaved;
	};
