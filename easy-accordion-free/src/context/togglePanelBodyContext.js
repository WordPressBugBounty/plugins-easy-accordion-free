import { createContext, useContext, useState, useCallback } from "@wordpress/element";

export const TogglePanelBodyContext = createContext();

const STORAGE_KEY = "sp-eab-panel-data";
const DEFAULT_STATE = { accordion: "defaultOpen", tab: "general" };

// READ FROM STORAGE.
const getStoredState = () => {
	const raw = localStorage.getItem(STORAGE_KEY);
	const data = raw ? JSON.parse(raw) : DEFAULT_STATE;
	return data;
};
// SAVE ON STORAGE.
const saveState = (accordion, tab) => {
	localStorage.setItem(STORAGE_KEY, JSON.stringify({ accordion, tab }));
};

export const TogglePanelBodyProvider = ({ children }) => {
	const stored = getStoredState();
	const [openedPanelBody, setOpenedPanelBody] = useState(stored.accordion);
	const [activeTab, setActiveTab] = useState(stored.tab);
	// TOGGLE PANEL BODY.
	const togglePanelBody = useCallback((panel, event = false) => {
		setOpenedPanelBody((prev) => {
			// If clicking same panel with 'event' props, do nothing.
			if (event && prev === panel) {
				return prev;
			}

			const nextPanel = prev === panel ? "" : panel;

			// SAVE NEW STATE.
			saveState(nextPanel, "general");

			// RESET DEFAULT TAB.
			setActiveTab("general");

			// TRIGGER ANIMATION IF EVENT EXIST.
			if (event) {
				setTimeout(() => {
					const currentPanel = document.querySelector(".components-panel__body.is-opened");
					if (!currentPanel) {
						return;
					}

					currentPanel.classList.add("active");

					setTimeout(() => {
						currentPanel.classList.remove("active");
					}, 800);
				}, 300);
			}

			return nextPanel;
		});
	}, []);

	// TOGGLE ACTIVE TAB.
	const toggleActiveTab = useCallback(
		(tabName) => {
			setActiveTab(tabName);
			saveState(openedPanelBody, tabName);
		},
		[openedPanelBody]
	);
	// CONTEXT VALUE.
	const contextValue = {
		activeTab,
		toggleActiveTab,
		openedPanelBody,
		togglePanelBody,
	};

	return <TogglePanelBodyContext.Provider value={contextValue}>{children}</TogglePanelBodyContext.Provider>;
};

export const useTogglePanelBody = () => useContext(TogglePanelBodyContext);
