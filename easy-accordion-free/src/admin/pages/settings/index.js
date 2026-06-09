import { memo, useState } from "@wordpress/element";
import { CustomCssAndJs, AdvancedControls, Tools } from "./settings-tab-content";
import { pluginSettingDefaultValues, settingsTabNavigation } from "../../constants";
import { checkIsEqual } from "@easy-accordion/controls";
import WooCommerceFAQs from "./wooCommerceFaqTabs";
import { SaveAndReset } from "./template-parts";
import { useDispatch, useSelect } from "@wordpress/data";
import { STORE_NAME } from "../../store/constants";

const getTabSettings = (settings, tab) => {
	const keys = Object.keys(pluginSettingDefaultValues[tab]) || [];
	return keys.reduce((acc, key) => {
		acc[key] = settings[key];
		return acc;
	}, {});
};

const defaultActiveTab = window.location?.hash?.replace("#", "")?.split("=")[1] || "advanced";
const initialEditorPreference = sp_eab_admin_dashboard_localize?.eap_editor_preference || "";

const SettingsPage = () => {
	const { pluginSettings, eapShortcodes } = useSelect((select) => ({
		pluginSettings: select(STORE_NAME).getPluginSettings(),
		eapShortcodes: select(STORE_NAME).getEapShortcodes(),
	}));
	const { saveSettings } = useDispatch(STORE_NAME);
	const [activeTab, setActiveTab] = useState(defaultActiveTab);
	const [allSettingsData, setAllSettingsData] = useState(pluginSettings);
	const [tabSettingsData, setTabSettingsData] = useState(getTabSettings(pluginSettings, activeTab));
	const [isChangeAnything, setIsChangeAnything] = useState(false);
	const [editorPreference, setEditorPreference] = useState(initialEditorPreference);

	// handle tab active.
	const updateSettingsOption = (optionName, value) => {
		const updatedTabSettings = { ...tabSettingsData, [optionName]: value };
		setIsChangeAnything(!checkIsEqual(updatedTabSettings, pluginSettings));
		setTabSettingsData(updatedTabSettings);
		setAllSettingsData((prev) => ({ ...prev, ...updatedTabSettings }));
	};

	// handle tab active.
	const handleActiveTab = (newTab) => {
		setActiveTab(newTab);
		window.location.hash = `#settings=${newTab}`;
		const tabSettings = getTabSettings(allSettingsData, newTab);
		setIsChangeAnything(!checkIsEqual(tabSettings, pluginSettings));
		setTabSettingsData(tabSettings);
	};

	// handle setting save.
	const handleSettingsSave = () => {
		const modifiedData = { ...pluginSettings, ...tabSettingsData };
		saveSettings({ pluginSettings: modifiedData }, editorPreference);
		setIsChangeAnything(false);
	};

	// handle setting reset.
	const handleSettingsReset = () => {
		const resetItems = pluginSettingDefaultValues[activeTab] || {};
		const updatedSettings = { ...pluginSettings, ...resetItems };
		saveSettings({ pluginSettings: updatedSettings });
	};

	return (
		<div className="sp-eap-settings-page-container sp-d-flex">
			<div className="sp-eap-setting-tabs-wrapper sp-d-block">
				<ul className="sp-eap-setting-tabs">
					{settingsTabNavigation?.map(({ label, value, Icon }) => (
						// eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
						<li
							key={value}
							className={`sp-eap-setting-tab sp-d-flex sp-cursor-pointer sp-gap-8px${activeTab === value ? " active" : ""}`}
							onClick={() => handleActiveTab(value)}
						>
							<span className="sp-eap-setting-icon">
								<Icon />
							</span>{" "}
							<span>{label}</span>
						</li>
					))}
				</ul>
				<div className="sp-eap-setting-tabs-bottom"></div>
			</div>
			<div className="sp-eap-setting-tab-content">
				{activeTab === "advanced" && (
					<AdvancedControls
						pluginSettings={tabSettingsData}
						updateSettingsOption={updateSettingsOption}
						editorPreference={editorPreference}
						setEditorPreference={setEditorPreference}
					/>
				)}
				{activeTab === "woocommerce-faqs" && (
					<WooCommerceFAQs
						pluginSettings={tabSettingsData}
						eapShortcodes={eapShortcodes}
						updateSettingsOption={updateSettingsOption}
					/>
				)}
				{activeTab === "additional" && (
					<CustomCssAndJs pluginSettings={tabSettingsData} updateSettingsOption={updateSettingsOption} />
				)}
				{activeTab === "tools" && <Tools />}
				{activeTab !== "license-key" && activeTab !== "tools" && (
					<SaveAndReset
						onSave={handleSettingsSave}
						onReset={handleSettingsReset}
						isChanged={isChangeAnything}
					/>
				)}
			</div>
		</div>
	);
};

export default memo(SettingsPage);
