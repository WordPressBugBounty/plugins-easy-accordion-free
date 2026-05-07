import Select from "react-select";
import { __ } from "@wordpress/i18n";
import { RangeControl } from "@wordpress/components";
import { useEffect, useState, memo } from "@wordpress/element";
import { InputControl, SelectControl, ComponentHeader, Button, Popover } from "@easy-accordion/components";
import { useDeviceType } from "@easy-accordion/controls";
import { fetchFonts, fontWeightMap, getFontWeightList, textStylesOptions } from "./utils";
import { PopupTriggerIcon } from "./svgIcon";
import "./editor.scss";

const TypographyNew = ({
	attributes,
	setAttributes,
	label = __("Typography", "easy-accordion-free"),
	fontSizeDefault = { unit: "px", value: 16 },
}) => {
	const [allFonts, setAllFonts] = useState([]);
	const [fontLists, setFontLists] = useState([]);
	const {
		typography,
		typographyKey,
		fontSize,
		fontSizeKey,
		letterSpacing,
		letterSpacingKey,
		lineHeight,
		lineHeightKey,
	} = attributes;
	const deviceType = useDeviceType();

	useEffect(() => {
		if (allFonts.length === 0) {
			fetchFonts().then((data) => {
				const fonts = data.items.map((item) => {
					return {
						label: item.family,
						value: item.family,
						font: { family: item.family, variants: item.variants },
					};
				});
				setAllFonts(fonts);
				setFontLists(fonts.filter((font, i) => i < 50 && font));
			});
		}
	}, []);

	const fontSearch = (inputValue) => {
		const filteredFonts = allFonts
			.filter((font) => {
				return font.label.toLowerCase().includes(inputValue.toLowerCase());
			})
			.filter((font, i) => i < 30 && font);
		setFontLists(filteredFonts);
	};

	// font family.
	const { family, fontWeight, style } = typography;
	const defaultFamilyOption = {
		label: "Default",
		value: "Default",
		font: {
			family: "Default",
			variants: ["300", "400", "500", "600", "700", "800"],
		},
	};
	const activeFontFamily = family === "" ? defaultFamilyOption : allFonts?.find(({ value }) => value === family);

	const allFamilyList = [defaultFamilyOption, ...fontLists];
	const isAvailableOnList = allFamilyList?.find((font) => font.value === activeFontFamily?.value);
	const fontFamilySelectOptions = isAvailableOnList
		? allFamilyList
		: [defaultFamilyOption, activeFontFamily, ...fontLists];

	// functions.
	const onChangeFontStyle = (fontStyle) => {
		const arrayOfStyles = fontWeightMap[fontStyle]?.split(" ");
		const newStyle = fontWeightMap[fontStyle].includes("italic") ? "italic" : "";
		const newFontWeight = arrayOfStyles[arrayOfStyles?.length - 1];

		setAttributes({
			[typographyKey]: {
				...typography,
				fontWeight: newFontWeight,
				style: newStyle,
			},
		});
	};

	const onChangeLineHeight = (value) => {
		setAttributes({
			[lineHeightKey]: {
				...lineHeight,
				device: {
					...lineHeight?.device,
					[deviceType]: value,
				},
			},
		});
	};

	const onChangeFontSize = (newValue) => {
		setAttributes({
			[fontSizeKey]: {
				...fontSize,
				device: {
					...fontSize?.device,
					[deviceType]: newValue,
				},
			},
		});
	};

	const onChangeTextStyles = (attributesKey, value) => {
		const newValue = typography[attributesKey] === value ? "" : value;
		setAttributes({
			[typographyKey]: {
				...typography,
				[attributesKey]: newValue,
			},
		});
	};

	const withTypographyIcon = () => (
		<span className="sp-eab-typography-icon">
			<PopupTriggerIcon />
		</span>
	);

	return (
		<Popover label={label} toggleIcon={withTypographyIcon()}>
			<div className="sp-eab-typography">
				<div className="sp-eab-typography-header sp-eab-component-mb sp-d-flex sp-align-center">
					<span>Typography</span>
				</div>
				<div className="sp-eab-typography-select-fields sp-d-flex sp-justify-between sp-align-center">
					<div className="sp-eab-typography-family sp-eab-select-field sp-eab-component-mb">
						<div className="sp-eab-font-family-header sp-mb-8px">
							<span className="sp-eab-component-title">Font family</span>
						</div>
						<Select
							classNamePrefix={"sp-eab-font-family-select"}
							options={fontFamilySelectOptions}
							value={activeFontFamily}
							placeholder={activeFontFamily?.label}
							onChange={(nextFont) => {
								setAttributes({
									[typographyKey]: {
										...typography,
										family: "Default" !== nextFont?.font?.family ? nextFont?.font?.family : "",
										fontWeight:
											"regular" === nextFont?.font?.variants[0]
												? "400"
												: nextFont?.font?.variants[0],
									},
								});
							}}
							onInputChange={(inputValue) => fontSearch(inputValue)}
						/>
					</div>
					<SelectControl
						label={__("Font Style", "easy-accordion-free")}
						attributes={
							activeFontFamily?.font?.variants.includes(`${fontWeight}${style}`)
								? `${fontWeight}${style}`
								: fontWeight
						}
						items={getFontWeightList(activeFontFamily)}
						onChange={(newStyle) => onChangeFontStyle(newStyle)}
						__nextHasNoMarginBottom
					/>
				</div>
				<div className="sp-eab-typography-font-size-picker sp-eab-component-mb">
					<ComponentHeader
						label={__("Font Size", "easy-accordion-free")}
						attributes={fontSize}
						attributesKey={fontSizeKey}
						setAttributes={setAttributes}
						units={["px", "%", "em"]}
						onReset={() => {
							setAttributes({
								[fontSizeKey]: {
									...fontSize,
									unit: {
										...fontSize.unit,
										[deviceType]: fontSizeDefault?.unit,
									},
								},
							});
							onChangeFontSize(fontSizeDefault?.value);
						}}
					/>
					<RangeControl
						color="#f26c0d"
						value={fontSize?.device[deviceType]}
						onChange={(newValue) => onChangeFontSize(newValue)}
						__next40pxDefaultSize
						__nextHasNoMarginBottom
					/>
				</div>
				<div className="sp-eab-typography-select-fields sp-d-flex sp-justify-between sp-align-center">
					<div className="sp-eab-typography-line-height-picker">
						<ComponentHeader
							label={__("Line Height", "easy-accordion-free")}
							attributes={lineHeight}
							attributesKey={lineHeightKey}
							setAttributes={setAttributes}
							units={false}
						/>
						<InputControl
							attributes={lineHeight?.device[deviceType]}
							mb={false}
							step={0.1}
							min={0}
							inputType="number"
							onChange={(newValue) => onChangeLineHeight(newValue)}
							__next40pxDefaultSize
						/>
					</div>
					<div className="sp-eab-typography-letter-spacing-picker">
						<ComponentHeader
							label={__("Letter Spacing", "easy-accordion-free")}
							attributes={letterSpacing}
							attributesKey={letterSpacingKey}
							setAttributes={setAttributes}
							units={["px", "%", "em"]}
						/>
						<InputControl
							attributes={letterSpacing?.device?.[deviceType] ?? 0}
							mb={false}
							inputType="number"
							onChange={(newValue) => {
								setAttributes({
									[letterSpacingKey]: {
										...(letterSpacing || {}),
										device: {
											...(letterSpacing?.device || {}),
											[deviceType]: newValue ?? 0,
										},
									},
								});
							}}
							__next40pxDefaultSize
						/>
					</div>
				</div>
				<div className="sp-eab-button-group sp-eab-component-mb">
					<span className="sp-eab-component-title sp-mb-8px">{__("Text Format", "easy-accordion-free")}</span>
					<div
						className="sp-eab-button-group-items sp-d-flex sp-align-center"
						style={{ "--total-buttons": textStylesOptions?.length }}
					>
						{textStylesOptions?.map(({ label, key, value }, index) => (
							<Button
								key={index}
								className={`${typography[key] === value ? " active" : ""}`}
								onClick={() => onChangeTextStyles(key, value)}
							>
								<span title={value}>{label}</span>
							</Button>
						))}
					</div>
				</div>
			</div>
		</Popover>
	);
};

export default memo(TypographyNew);
