const DEFAULT_STATE = {
	apiData: {},
	isLoading: false,
	isSaving: false,
};

const reducer = (state = DEFAULT_STATE, action) => {
	switch (action.type) {
		case "SET_API_DATA":
			return { ...state, apiData: action.data };
		case "SET_LOADING":
			return { ...state, isLoading: action.isLoading };
		case "SET_SAVING":
			return { ...state, isSaving: action.isSaving };
		default:
			return state;
	}
};

export default reducer;
