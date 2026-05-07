import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { ButtonGroup, ColorPicker, Spacing, ToggleControl } from "@easy-accordion/components";

const BoxShadow = ({ attributes, attributesKey, setAttributes, defaultShadowColor = "#949494" }) => {
	const [buttonTab, setButtonTab] = useState("color");

	const shadowColor = (newColor) => {
		setAttributes({
			[attributesKey]: { ...attributes, [buttonTab]: newColor },
		});
	};
	const isActiveShadow = attributes?.isActive;

	return (
		<div className="sp-eab-box-shadow-component">
			<ToggleControl
				label={__("Enable Box Shadow", "easy-accordion-free")}
				attributes={isActiveShadow}
				onChange={() => setAttributes({ [attributesKey]: { ...attributes, isActive: !isActiveShadow } })}
			/>
			{isActiveShadow && (
				<>
					<Spacing
						label={__("Box Shadow", "easy-accordion-free")}
						attributes={attributes}
						attributesKey={attributesKey}
						setAttributes={setAttributes}
						boxUnits={true}
						defaultValue={{
							unit: "Outset",
							value: {
								top: "0",
								right: "3",
								bottom: "6",
								left: "0",
							},
						}}
						linkButton={false}
						units={["Outset", "Inset"]}
						labelItem={{
							top: __("X Offset", "easy-accordion-free"),
							right: __("Y Offset", "easy-accordion-free"),
							bottom: __("Blur", "easy-accordion-free"),
							left: __("Spread", "easy-accordion-free"),
						}}
					/>
					{/* Shadow Color */}
					{attributes?.hoverColor && (
						<ButtonGroup
							label={__("Shadow Color", "easy-accordion-free")}
							attributes={buttonTab}
							items={[
								{ label: "Default", value: "color" },
								{ label: "Hover", value: "hoverColor" },
							]}
							onClick={(value) => setButtonTab(value)}
						/>
					)}
					<ColorPicker
						label={__("Shadow Color", "easy-accordion-free")}
						value={attributes[buttonTab]}
						onChange={shadowColor}
						defaultColor={defaultShadowColor}
					/>
				</>
			)}
		</div>
	);
};

export default BoxShadow;
