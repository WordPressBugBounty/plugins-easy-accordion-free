import { createContext } from "@wordpress/element";

export const SidebarTabsContext = createContext({
	activeId: 1,
	setActiveId: () => {},
	contentAnimationEffect: "",
});
