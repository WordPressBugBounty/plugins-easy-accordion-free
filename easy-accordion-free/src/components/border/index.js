import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { Spacing, ButtonGroup, ColorPicker, Popover } from "@easy-accordion/components";
import { borderStyles } from "@easy-accordion/constants";
import "./editor.scss";

const Border = ({
	attributes,
	attributesKey,
	setAttributes,
	defaultValue = {
		unit: "px",
		value: {
			top: "0",
			right: "0",
			bottom: "0",
			left: "0",
		},
	},
	label = __("Border", "easy-accordion-free"),
}) => {
	const { border, borderWidth } = attributes;

	const [activeState, setActiveState] = useState("color");

	const borderColor = (newColor) => {
		setAttributes({
			[attributesKey.border]: {
				...attributes?.border,
				[activeState]: newColor,
			},
		});
	};

	const borderOptions = {
		color: "Default",
		hoverColor: "Hover",
		activeColor: "Active",
	};

	const borderColorOptions = Object.entries(borderOptions).reduce(
		(acc, [key, l]) => (key === "color" || key in border ? [...acc, { label: l, value: key }] : acc),
		[]
	);

	return (
		<Popover label={label}>
			<Popover.Content>
				<div className="sp-eab-border-component">
					<ButtonGroup
						label={__("Border Style", "easy-accordion-free")}
						attributes={border?.style}
						items={borderStyles}
						onClick={(newStyle) => {
							setAttributes({
								[attributesKey.border]: {
									...attributes.border,
									style: newStyle,
								},
							});
						}}
					/>
					<Spacing
						label={__("Border Width", "easy-accordion-free")}
						attributes={borderWidth}
						attributesKey={attributesKey.borderWidth}
						setAttributes={setAttributes}
						defaultValue={defaultValue}
					/>
					{/* Border Color */}
					{borderColorOptions?.length > 1 && (
						<ButtonGroup
							label={false}
							attributes={activeState}
							items={borderColorOptions}
							onClick={(value) => setActiveState(value)}
						/>
					)}
					<ColorPicker
						label={__("Color", "easy-accordion-free")}
						value={border[activeState]}
						onChange={borderColor}
					/>
				</div>
			</Popover.Content>
		</Popover>
	);
};

export default Border;
