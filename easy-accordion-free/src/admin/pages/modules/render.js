import Toggle from "react-toggle";
import { __ } from "@wordpress/i18n";
import { toast } from "react-hot-toast";
import { Modal } from "@wordpress/components";
import { memo, useEffect, useState } from "@wordpress/element";
import { useSelect, useDispatch } from "@wordpress/data";
import { defaultDashboardSettings } from "@easy-accordion/constants";
import { checkIsEqual } from "@easy-accordion/controls";
import { Demos, Docs, SettingsIcon, VideoPlayIcon } from "../../icons";
import { SaveAndReset } from "../settings/template-parts";
import { AISettingsModal, ReCaptchaPopup } from "../integrations/templates";
import { STORE_NAME } from "../../store";
import { ProIndicatorIcon } from "./icons";

const modalHeaderLabel = {
	google_recaptcha: __("Google reCAPTCHA Settings", "easy-accordion-free"),
	gemini: __("Google Gemini API Settings", "easy-accordion-free"),
	chatgpt: __("ChatGPT API Settings", "easy-accordion-free"),
	deepseek: __("DeepSeek API Settings", "easy-accordion-free"),
};

const dynamicMenuItems = [
	{
		index: 3,
		key: "saved_templates",
		label: __("Saved Templates", "easy-accordion-free"),
		href: "edit.php?post_type=sp_easy_accordion&page=eap_dashboard#saved_templates",
	},
	{
		index: 12,
		key: "eap_tools",
		label: __("Tools", "easy-accordion-free"),
		href: "edit.php?post_type=sp_easy_accordion&page=eap_tools",
	},
];

// handle toggle menus.
const handleMenus = (name, isActive) => {
	const menuItem = dynamicMenuItems?.find((i) => i.key === name);
	const menuWrapper = document.querySelector("#menu-posts-sp_easy_accordion .wp-submenu-wrap");
	// return if menu item or wrapper is not exist.
	if (!menuItem || !menuWrapper) {
		return;
	}
	const existingLink = menuWrapper.querySelector(`a[href="${menuItem.href}"]`);
	// REMOVE ITEM.
	if (!isActive) {
		if (existingLink) {
			const li = existingLink.closest("li");
			li?.remove();
		}
		return;
	}
	// RESTORE ITEM (if missing).
	if (isActive && !existingLink) {
		const li = document.createElement("li");
		const a = document.createElement("a");
		a.href = menuItem.href;
		a.textContent = menuItem.label;
		li.appendChild(a);
		// get reference to existing child at that index.
		const referenceNode = menuWrapper.children[menuItem.index];
		menuWrapper.insertBefore(li, referenceNode);
	}
};

// notification message.
const show_notification = (enabled, optionKey = "modules") => {
	const message =
		(optionKey === "modules" ? __("Module", "easy-accordion-free") : __("Integration", "easy-accordion-free")) +
		(enabled
			? __(" enabled successfully", "easy-accordion-free")
			: __(" disabled successfully", "easy-accordion-free"));
	toast.success(message, { style: { marginTop: "20px", fontSize: "14px" } });
};

const RenderModuleCard = ({ items = [], optionKey = "integrations", hideUpcoming = false, type = "" }) => {
	const dashboardSettings = useSelect((select) => select(STORE_NAME).getDashboardSettings());
	const { saveSettings } = useDispatch(STORE_NAME);
	// default settings.
	const tabDefaultSettings = defaultDashboardSettings[optionKey];
	const defaultSettings = dashboardSettings?.[optionKey] || tabDefaultSettings;
	const [openedPopup, setOpenedPopup] = useState(null);
	const [moduleData, setModuleData] = useState(defaultSettings);
	const [isChangeAnything, setIsChangeAnything] = useState(false);

	const handleSaveData = (queryData = moduleData) => {
		const modifiedData = { ...dashboardSettings, [optionKey]: queryData };
		saveSettings({ dashboardSettings: modifiedData });
		setIsChangeAnything(false);
	};

	const handleReset = () => {
		const resetValue = { ...moduleData, [openedPopup]: tabDefaultSettings[openedPopup] };
		handleSaveData(resetValue);
		setModuleData(resetValue);
	};

	const handleToggle = (key, newValue) => {
		handleSaveData({ ...moduleData, [key]: { ...moduleData[key], is_active: newValue } });
		show_notification(newValue, optionKey);
		// toggle menu.
		if (optionKey === "modules") {
			handleMenus(key, newValue);
		}
	};

	const updateSettingsOption = (name, value) => {
		const updatedModalData = { ...moduleData?.[openedPopup], [name]: value };
		setIsChangeAnything(!checkIsEqual(updatedModalData, defaultSettings?.[openedPopup]));
		setModuleData({ ...moduleData, [openedPopup]: updatedModalData });
	};

	useEffect(() => {
		setModuleData(defaultSettings);
	}, [dashboardSettings]);

	return (
		<div className="sp-eab-integrations-page-items-wrapper sp-d-grid sp-grid-cols-3">
			{items?.map(({ id, key, Icon, label, desc, demoLink, docLink, videoLink, upcoming, isPro }) => (
				<div
					key={id}
					className={`sp-eap-integrations-card sp-d-flex${upcoming ? " sp-eap-upcoming-card" : ""}`}
				>
					<div className="sp-eap-integrations-card__icon">
						<Icon />
					</div>
					<div className="sp-eap-integrations-card__content sp-d-flex sp-flex-col sp-justify-between">
						<div className="sp-d-flex sp-flex-col sp-gap-8px">
							<div className="sp-d-flex sp-align-center sp-justify-between">
								<h4 className="sp-eap-integrations-card__label">
									{label}
									{!hideUpcoming && upcoming && (
										<span className="sp-eap-dashboard-upcoming-text small">
											{__("Upcoming", "easy-accordion-free")}
										</span>
									)}
								</h4>
								{key && (
									<Toggle
										icons={false}
										defaultChecked={upcoming ? false : moduleData?.[key]?.is_active}
										onChange={() => {
											if (!upcoming) {
												handleToggle(key, !moduleData?.[key]?.is_active);
											}
										}}
									/>
								)}
								{isPro && <ProIndicatorIcon />}
							</div>
							{type !== "quick-start" && <span className="sp-eap-integrations-card__desc">{desc}</span>}
						</div>
						{type !== "quick-start" && (
						<div className="sp-eap-integrations-card__links sp-d-flex sp-align-center sp-justify-between">
							{(docLink || demoLink || videoLink) && (
								<div className="sp-d-flex sp-align-center sp-gap-10px">
									{demoLink && (
										<a
											className="sp-d-flex sp-align-center sp-gap-4px"
											href={demoLink}
											target="_blank"
											rel="noreferrer"
											{...(demoLink === "#" && {
												style: { pointerEvents: "none", cursor: "default" },
											})}
										>
											<Demos /> Demo
										</a>
									)}
									{videoLink && (
										<a
											className="sp-d-flex sp-align-center sp-gap-4px"
											href={videoLink}
											target="_blank"
											rel="noreferrer"
											{...(videoLink === "#" && {
												style: { pointerEvents: "none", cursor: "default" },
											})}
										>
											<VideoPlayIcon /> Video
										</a>
									)}
									{docLink && (
										<a
											className="sp-d-flex sp-align-center sp-gap-4px"
											href={docLink}
											target="_blank"
											rel="noreferrer"
											{...(docLink === "#" && {
												style: { pointerEvents: "none", cursor: "default" },
											})}
										>
											<Docs /> Docs
										</a>
									)}
								</div>
							)}
							{optionKey === "integrations" && type !== "page-builder" && (
								<div className="sp-eap-integrations-card__settings sp-cursor-pointer">
									<span
										onClick={() => {
											if (!upcoming) {
												setOpenedPopup(key);
											}
										}}
									>
										<SettingsIcon />
									</span>
								</div>
							)}
						</div>
						)}
					</div>
					{openedPopup === key && (
						<Modal
							className="sp-eap-integrations__modal"
							title={modalHeaderLabel[key]}
							onRequestClose={() => setOpenedPopup(null)}
						>
							<div className="sp-eap-integrations__modal-content">
								{openedPopup === "google_recaptcha" ? (
									<ReCaptchaPopup
										settings={moduleData?.google_recaptcha}
										updateSettingsOption={updateSettingsOption}
									/>
								) : (
									<AISettingsModal
										openedPopup={openedPopup}
										settings={moduleData?.[openedPopup]}
										updateSettingsOption={updateSettingsOption}
									/>
								)}
								<SaveAndReset
									onSave={() => handleSaveData()}
									onReset={handleReset}
									isChanged={isChangeAnything}
								/>
							</div>
						</Modal>
					)}
				</div>
			))}
		</div>
	);
};

export default memo(RenderModuleCard);
