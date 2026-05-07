import { TabPanel } from "@wordpress/components";
import { GeneralIcon, SliderStyleIcon, StyleIcon } from "./icons";
import "./editor.scss";

const TabControls = ({
	attributes,
	setAttributes,
	GeneralTab = "",
	StyleTab = "",
	AdvancedTab = "",
	VisibilityTab = "",
	SliderTab = "",
	tabName = "general",
	setTabName = () => {},
	displayIcon = true,
}) => {
	const Tabs = [];

	if (GeneralTab) {
		Tabs.push({
			name: "general",
			title: <span className="sp-eab-tab-panel-title">{displayIcon && GeneralIcon()} General</span>,
			className: "sp-eab-general-tab",
		});
	}
	if (StyleTab) {
		Tabs.push({
			name: "style",
			title: <span className="sp-eab-tab-panel-title">{displayIcon && StyleIcon()} Style</span>,
			className: "sp-eab-style-tab",
		});
	}
	if (SliderTab) {
		Tabs.push({
			name: "slider",
			title: <span className="sp-eab-tab-panel-title">{displayIcon && SliderStyleIcon()} Slider</span>,
			className: "sp-eab-style-tab",
		});
	}
	if (VisibilityTab) {
		Tabs.push({
			name: "visibility",
			title: <span className="sp-eab-tab-panel-title">Visibility</span>,
			className: "sp-eab-visibility-tab",
		});
	}

	if (AdvancedTab) {
		Tabs.push({
			name: "advanced",
			title: <span className="sp-eab-tab-panel-title">Advanced</span>,
			className: "sp-eab-advanced-tab",
		});
	}

	return (
		<TabPanel
			className="sp-easy-accordion-tab-panel"
			activeClass="active-tab"
			initialTabName={tabName}
			onSelect={(newVal) => setTabName(newVal)}
			tabs={Tabs}
		>
			{(tab) => {
				return (
					<>
						{tab.name === "general" && GeneralTab && (
							<GeneralTab attributes={attributes} setAttributes={setAttributes} />
						)}
						{tab.name === "style" && StyleTab && (
							<StyleTab attributes={attributes} setAttributes={setAttributes} />
						)}
						{tab.name === "slider" && SliderTab && (
							<SliderTab attributes={attributes} setAttributes={setAttributes} />
						)}
						{tab.name === "visibility" && VisibilityTab && (
							<VisibilityTab attributes={attributes} setAttributes={setAttributes} />
						)}
						{tab.name === "advanced" && AdvancedTab && (
							<AdvancedTab attributes={attributes} setAttributes={setAttributes} />
						)}
					</>
				);
			}}
		</TabPanel>
	);
};

export default TabControls;
