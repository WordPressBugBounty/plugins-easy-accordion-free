import axios from "axios";
import { __ } from "@wordpress/i18n";
import { Button, ColorPicker, ColorIndicator, Dropdown } from "@wordpress/components";
import { memo, useState } from "@wordpress/element";
import { ResetButton } from "../index";
import { NewColorAddIcon } from "./icons";
import "./editor.scss";

const ColorPalateDisplay = ({
	label,
	colors = [],
	onChangePanelColor,
	showNewColorAdd = false,
	handleCustomColor = false,
	palateName = "custom",
}) => {
	return (
		<div className="sp-eab-color-picker-palette-display-container">
			<div className="sp-eab-palette-title-wrapper sp-d-flex sp-justify-between">
				<span className="sp-eab-color-picker-palette-title">{label}</span>
			</div>
			<ul className="sp-eab-color-picker-palette sp-d-grid">
				{colors?.map((item, i) => (
					<li
						key={i}
						style={{
							backgroundColor: item?.color,
						}}
						title={item?.name}
					>
						<Button
							onClick={() => {
								const newColor = item?.color;
								const isHexColor = /^#([0-9A-Fa-f]{3}){1,2}$/.test(newColor);
								const isColorMix = newColor?.includes("color-mix");
								if (isHexColor || isColorMix) {
									onChangePanelColor(newColor);
								} else {
									const variableNameMatch = newColor.match(/--[\w-]+/);
									if (variableNameMatch) {
										const rootStyles = getComputedStyle(document.documentElement);
										const astColor = rootStyles.getPropertyValue(variableNameMatch[0]).trim();
										onChangePanelColor(astColor);
									}
								}
							}}
							value={item.color}
						/>
						{palateName === "custom" && i > 3 && (
							<span
								onClick={(e) => {
									e.stopPropagation();
									handleCustomColor("remove", item?.name);
								}}
								className="sp-eab-color-remove-button"
							>
								<svg
									xmlns="http://www.w3.org/2000/svg"
									fill="none"
									viewBox="0 0 24 24"
									height={24}
									width={24}
								>
									<path
										fill="#1E1E1E"
										d="m12 13.06 3.712 3.713 1.06-1.061-3.712-3.713 3.713-3.712-1.061-1.06-3.713 3.712-3.712-3.712-1.06 1.06L10.939 12l-3.712 3.713 1.06 1.06L12 13.06Z"
									/>
								</svg>
							</span>
						)}
					</li>
				))}
				{showNewColorAdd && (
					<li
						title={__("Add this color to custom colors", "easy-accordion-free")}
						className="sp-d-flex sp-align-center sp-justify-center sp-cursor-pointer"
					>
						<span
							className="sp-d-flex sp-align-center sp-justify-center"
							onClick={(e) => {
								e.stopPropagation();
								handleCustomColor("add", `color-${colors?.length + 1}`);
							}}
						>
							<NewColorAddIcon />
						</span>
					</li>
				)}
			</ul>
		</div>
	);
};

const SpColorPicker = ({
	setAttributes,
	value,
	attributesKey,
	label,
	onChange,
	defaultColor = "",
	resetButton = true,
	showThemeColors = true,
	activeState = false,
}) => {
	const activeValue = activeState ? value[activeState] : value;
	const [activeColor, setActiveColor] = useState(activeValue);
	const [themeColors, setThemeColors] = useState([]);
	const [savedCustomColors, setSavedCustomColors] = useState([]);
	const [showNewColorAdd, setShowNewColorAdd] = useState(false);

	const customColors = [
		{ name: "color-0", color: "#FF5B2E" },
		{ name: "color-1", color: "#FFFFFF" },
		{ name: "color-2", color: "#2F2F2F" },
		{ name: "color-3", color: "#757575" },
		...savedCustomColors,
	];

	// api data and colors options.
	const getApiData = async (newColors) => {
		const formData = new FormData();
		formData.append("action", "sp_eab_color_settings_ajax");
		formData.append("colorSettingsData", JSON.stringify(newColors));
		formData.append("spEabAjaxNonce", sp_eab_localize_data?.spEabAjaxNonce);
		const response = await axios.post(sp_eab_localize_data.ajaxUrl, formData);
		const apiData = await response?.data?.data;
		setSavedCustomColors(apiData?.custom_colors || []);
		setThemeColors(apiData?.theme_colors || []);
	};

	const handleCustomColor = (event, name) => {
		let updatedColors = [];
		if (event === "add") {
			updatedColors = [...savedCustomColors, { name, color: activeColor }];
		} else {
			updatedColors = savedCustomColors.filter((item) => item.name !== name);
		}
		setSavedCustomColors(updatedColors);
		getApiData(updatedColors);
		setShowNewColorAdd(false);
	};

	// color picker panel color change function.
	const onChangePanelColor = (newColor) => {
		const allColors = [...customColors, ...themeColors];
		const findResult = allColors?.find((item) => item.color === newColor);
		const isExist = findResult ? true : false;
		setShowNewColorAdd(!isExist);
		// set new color.
		setActiveColor(newColor);
		if (onChange) {
			onChange(newColor);
			return;
		}
		if (activeState) {
			setAttributes({ [attributesKey]: { ...value, [activeState]: newColor } });
		} else {
			setAttributes({ [attributesKey]: newColor });
		}
	};

	// color reset function.
	const setDefault = () => {
		onChangePanelColor(defaultColor);
	};

	return (
		<div className="sp-eab-color-picker sp-eab-component-mb sp-d-flex sp-justify-between sp-align-center">
			<span className="sp-eab-component-title">{label}</span>
			<div className="sp-eab-color-picker-right-area sp-d-flex sp-align-center">
				{resetButton && <ResetButton onClick={() => setDefault()} />}
				<Dropdown
					popoverProps={{ placement: "bottom-start" }}
					renderToggle={({ isOpen, onToggle }) => (
						<Button onClick={onToggle} aria-expanded={isOpen}>
							<ColorIndicator colorValue={activeValue} onClick={() => getApiData()} />
						</Button>
					)}
					onClose={(event, isInside) => {
						if (isInside) {
							event.stopPropagation();
						}
					}}
					renderContent={() => (
						<div
							onMouseDown={(event) => {
								event.stopPropagation();
							}}
							className="sp-eab-color-picker-renderer"
						>
							<ColorPicker
								className="sp-eab-color-picker"
								color={activeColor}
								onChange={onChangePanelColor}
								colors={customColors}
								enableAlpha
							/>
							{/* theme colors  */}
							{showThemeColors && themeColors?.length > 0 && (
								<ColorPalateDisplay
									label={__("Theme colors", "easy-accordion-free")}
									colors={themeColors}
									onChangePanelColor={onChangePanelColor}
									palateName="theme"
								/>
							)}
							{/* custom colors  */}
							{customColors?.length > 0 && (
								<ColorPalateDisplay
									label={__("Custom colors", "easy-accordion-free")}
									colors={customColors}
									onChangePanelColor={onChangePanelColor}
									showNewColorAdd={showNewColorAdd}
									handleCustomColor={handleCustomColor}
								/>
							)}
						</div>
					)}
				/>
			</div>
		</div>
	);
};

export default memo(SpColorPicker);
