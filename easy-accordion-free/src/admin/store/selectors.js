export const getApiData = (state) => state.apiData;
export const getPluginSettings = (state) => state.apiData?.pluginSettings;
export const getBlockVisibility = (state) => state.apiData?.blockVisibility;
export const getDashboardSettings = (state) => state.apiData?.dashboardSettings;
export const getEapShortcodes = (state) => state.apiData?.eapShortcodes;
export const isLoading = (state) => state.isLoading;
export const isSaving = (state) => state.isSaving;
