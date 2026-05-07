import { __ } from "@wordpress/i18n";
import { Border, Spacing, BoxShadow, InputControl, ToggleControl, BackgroundControl } from "@easy-accordion/components";

export const AdvancedGeneralTab = ({ attributes, setAttributes }) => {
	const {
		eabBackground,
		eabBorder,
		eabBorderWidth,
		eabBorderRadius,
		eabBoxShadow,
		eabPadding,
		eabMargin,
		eabAccessibility,
	} = attributes;

	return (
		<>
			<BackgroundControl
				label={__("Background Type", "easy-accordion-free")}
				attributes={eabBackground}
				attributesKey={"eabBackground"}
				setAttributes={setAttributes}
			/>
			<Border
				attributes={{
					border: eabBorder,
					borderWidth: eabBorderWidth,
				}}
				attributesKey={{
					border: "eabBorder",
					borderWidth: "eabBorderWidth",
				}}
				setAttributes={setAttributes}
				btnType="normal"
				defaultValue={{
					unit: "px",
					value: {
						top: "1",
						right: "1",
						bottom: "1",
						left: "1",
					},
				}}
			/>
			<Spacing
				label={__("Border Radius", "easy-accordion-free")}
				attributes={eabBorderRadius}
				attributesKey={"eabBorderRadius"}
				setAttributes={setAttributes}
				radiusIndicators={true}
				units={["Px", "%", "em"]}
				defaultValue={{
					unit: "px",
					value: {
						top: "0",
						right: "0",
						bottom: "0",
						left: "0",
					},
				}}
			/>
			<BoxShadow
				shadowColorBtn={false}
				attributes={eabBoxShadow}
				attributesKey={"eabBoxShadow"}
				setAttributes={setAttributes}
			/>
			<Spacing
				label={__("Padding", "easy-accordion-free")}
				attributes={eabPadding}
				attributesKey={"eabPadding"}
				setAttributes={setAttributes}
				units={["px", "%", "em"]}
				defaultValue={{
					unit: "px",
					value: {
						top: "0",
						right: "0",
						bottom: "0",
						left: "0",
					},
				}}
			/>
			<Spacing
				label={__("Margin", "easy-accordion-free")}
				attributes={eabMargin}
				attributesKey={"eabMargin"}
				setAttributes={setAttributes}
				units={["Px", "%", "em"]}
				defaultValue={{
					unit: "px",
					value: {
						top: "0",
						right: "0",
						bottom: "20",
						left: "0",
					},
				}}
			/>
			<ToggleControl
				label={__("Accessibility", "easy-accordion-free")}
				attributes={eabAccessibility}
				attributesKey={"eabAccessibility"}
				setAttributes={setAttributes}
			/>
		</>
	);
};

export const VisibilityTab = ({ attributes, setAttributes }) => {
	const { spEabHideOnMobile, spEabHideOnTablet, spEabHideOnDesktop } = attributes;
	return (
		<>
			<ToggleControl
				label={__("Hide on Desktop", "easy-accordion-free")}
				attributes={spEabHideOnDesktop}
				attributesKey={"spEabHideOnDesktop"}
				setAttributes={setAttributes}
			/>
			<ToggleControl
				label={__("Hide on Tablet", "easy-accordion-free")}
				attributes={spEabHideOnTablet}
				attributesKey={"spEabHideOnTablet"}
				setAttributes={setAttributes}
			/>
			<ToggleControl
				label={__("Hide on Mobile", "easy-accordion-free")}
				attributes={spEabHideOnMobile}
				attributesKey={"spEabHideOnMobile"}
				setAttributes={setAttributes}
			/>
		</>
	);
};

export const AdvancedTab = ({ attributes, setAttributes }) => {
	const { customClassName, customIdName } = attributes;

	return (
		<>
			<InputControl
				label={__("Custom CSS Class", "easy-accordion-free")}
				inputType="text"
				attributes={customClassName}
				attributesKey={"customClassName"}
				setAttributes={setAttributes}
			/>
			<InputControl
				label={__("Custom CSS ID", "easy-accordion-free")}
				inputType="text"
				attributes={customIdName}
				attributesKey={"customIdName"}
				setAttributes={setAttributes}
			/>
		</>
	);
};
