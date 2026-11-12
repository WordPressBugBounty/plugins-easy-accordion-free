const DEFAULT_STATE = {
	apiData: {},
	isLoading: false,
	isSaving: false,
	// Why the settings couldn't be loaded ({ message, response }), shown instead of the dashboard.
	loadError: null,
};

const reducer = (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case "SET_API_DATA":
			return { ...state, apiData: action.data };
		case "SET_LOADING":
			return { ...state, isLoading: action.isLoading };
		case "SET_SAVING":
			return { ...state, isSaving: action.isSaving };
		case "SET_LOAD_ERROR":
			return { ...state, loadError: action.loadError };
		default:
			return state;
	}
};

export default reducer;
