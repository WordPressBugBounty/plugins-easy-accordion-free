import { useEffect, useMemo, useState } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { __ } from "@wordpress/i18n";
import { Toaster } from "react-hot-toast";
import HeaderItems from "./templates/headerItems";
import QuickStart from "./pages/quickStart/quickStart";
import BlockVisibility from "./pages/blockVisibility";
import SavedTemplates from "./pages/saved-templates";
import SettingsPage from "./pages/settings";
// import Integrations from "./pages/integrations"; // Moved to Settings page as a tab
import Modules from "./pages/modules";
import Footer from "./templates/footer";
import SetupWizard from "./setup-wizard";
import { STORE_NAME } from "./store";
import "./style.scss";
import LiteVsPro from "./pages/lite-vs-pro";
import AboutUs from "./pages/about-us";
import { OurPluginsIcon } from "./icons";

// Inject Crisp chat script
const initCrispChat = () => {
	if (window.$crisp) {
		return;
	}
	window.$crisp = [];
	window.CRISP_WEBSITE_ID = "3770a55e-947f-424d-87b8-d93a86f2cd7b";
	(function () {
		const d = document;
		const s = d.createElement("script");
		s.src = "https://client.crisp.chat/l.js";
		s.async = 1;
		d.getElementsByTagName("head")[0].appendChild(s);
	})();
};

// Function to update the active state of sidebar menu items.
const updateSidebarActive = (pageName) => {
	const postMenu = document.getElementById("menu-posts-sp_easy_accordion");
	if (!postMenu) {
		return;
	}

	// Remove 'current' class from all items
	postMenu.querySelectorAll("li").forEach((el) => el.classList.remove("current"));
	// Determine selector based on pageName
	const selector =
		pageName === "getting-start" || pageName === ""
			? 'li a[href="edit.php?post_type=sp_easy_accordion&page=eap_dashboard"]'
			: `li a[href*="#${pageName}"]`;
	// Add 'current' class if match found
	postMenu.querySelector(selector)?.closest("li")?.classList.add("current");
};

const Render = () => {
	const hashValue = window.location?.hash?.replace("#", "")?.split("=")[0];
	const pluginsContainer = document.querySelector(".eab-recommended-plugins-wrapper");
	// Update Sidebar active menu based on hash link.
	updateSidebarActive(hashValue);
	const [page, setPage] = useState(hashValue ? hashValue : "getting-start");

	useEffect(() => {
		if (hashValue === "our_plugins" && pluginsContainer) {
			pluginsContainer.style.display = "block";
		}
		const postMenu = document.getElementById("menu-posts-sp_easy_accordion");
		const allItems = postMenu.querySelectorAll("li");

		const removeCurrentClass = () => {
			allItems.forEach((element) => {
				element.classList.remove("current");
			});
		};

		const postMenuAction = (e) => {
			const currentItem = e.target.closest("li");
			removeCurrentClass();

			currentItem.classList.add("current");

			setTimeout(() => {
				setPage(window.location.hash.replace("#", ""));
			}, 0);
		};
		postMenu.addEventListener("click", postMenuAction);

		return () => postMenu.removeEventListener("click", postMenuAction);
	}, []);

	const setPageAndHash = (pageName) => {
		setPage(pageName);
		if (pageName === "our_plugins" && pluginsContainer) {
			pluginsContainer.style.display = "block";
		} else if (pluginsContainer) {
			pluginsContainer.style.display = "none";
		}
		window.location.hash = pageName;
	};

	// Fetch settings data from the Redux store.
	const { pluginSettings, blockVisibility, dashboardSettings } = useSelect((select) => ({
		pluginSettings: select(STORE_NAME).getPluginSettings(),
		blockVisibility: select(STORE_NAME).getBlockVisibility(),
		dashboardSettings: select(STORE_NAME).getDashboardSettings(),
	}));

	const { fetchApiData } = useDispatch(STORE_NAME);

	useEffect(() => {
		fetchApiData();
	}, [fetchApiData]);

	// Initialize Crisp chat
	useEffect(() => {
		initCrispChat();
	}, []);

	const menuItems = useMemo(() => {
		if (!dashboardSettings) {
			return [];
		}
		let items = [
			{ label: "Dashboard", value: "getting-start", hash: "#" },
			{ label: "Saved Templates", value: "saved_templates", hash: "#saved_templates" },
			{ label: "Blocks", value: "blocks", hash: "#blocks", badge: "new" },
			{ label: "Modules", value: "modules", hash: "#modules" },
			// { label: "Integrations", value: "integrations", hash: "#integrations" }, // Moved to Settings page as a tab
			{ label: "Settings", value: "settings", hash: "#settings" },
			{ label: "Lite vs Pro", value: "lite_vs_pro", hash: "#lite_vs_pro" },
			{ label: "Our Plugins", value: "our_plugins", hash: "#our_plugins", icon: <OurPluginsIcon /> },
		];
		const isActiveTemplates = dashboardSettings?.modules?.saved_templates
			? dashboardSettings?.modules?.saved_templates?.is_active
			: true;
		if (!isActiveTemplates) {
			items = items?.filter((i) => i.value !== "saved_templates");
		}
		return items;
	}, [dashboardSettings]);

	// if not exist plugin settings then return.;

	if (!pluginSettings) {
		return null;
	}

	if (page === "setupwizard") {
		return <SetupWizard />;
	}

	return (
		<>
			<div className="sp-eab-admin-dashboard-container">
				{/* header */}
				<HeaderItems menuItems={menuItems} currentPage={page} setPageAndHash={setPageAndHash} />
				<div className="sp-eab-admin-dashboard-body">
					{/* Render pages based on tab click */}
					<div className="sp-eab-admin-dashboard-content">
						{page === "getting-start" && <QuickStart setPageAndHash={setPageAndHash} />}
						{page === "blocks" && blockVisibility && <BlockVisibility />}
						{page === "modules" && <Modules />}
						{/* {page === "integrations" && dashboardSettings && <Integrations />} */} {/* Moved to Settings page as a tab */}
						{page === "saved_templates" && <SavedTemplates />}
						{page === "settings" && <SettingsPage />}
						{page === "about_us" && <AboutUs />}
						{page === "lite_vs_pro" && <LiteVsPro />}
					</div>
				</div>
				{/* {page === "getting-start" && <Footer />} */}
			</div>
			{/* React Hot Toast Container for notifications */}
			<Toaster
				position="top-right"
				toastOptions={{
					style: {
						padding: "16px 24px",
						fontSize: "18px",
						borderRadius: "10px",
						maxWidth: "400px",
					},
				}}
			/>
		</>
	);
};

export default Render;
