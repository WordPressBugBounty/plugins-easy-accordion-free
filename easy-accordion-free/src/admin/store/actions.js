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
			console.error("Error fetching data:", error.message);
		}
		dispatch(setLoading(false));
	};

/**
 * Save modified settings to the API.
 * The API returns the full updated state, which replaces the store data.
 *
 * @param {Object} modifiedData - The data to save (e.g. { pluginSettings: {...} }).
 */
export const saveSettings =
	(modifiedData) =>
	async ({ dispatch }) => {
		dispatch(setSaving(true));
		try {
			const data = new FormData();
			data.append("nonce", sp_eab_admin_dashboard_localize?.nonce);
			data.append("action", "sp_eab_admin_option_update");
			data.append("queryData", JSON.stringify(modifiedData));

			const response = await axios.post(sp_eab_admin_dashboard_localize?.ajax_url, data);
			dispatch(setApiData(response.data));
		} catch (error) {
			console.error("Error saving data:", error.message);
		}
		dispatch(setSaving(false));
	};
