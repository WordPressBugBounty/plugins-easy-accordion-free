import { memo } from "@wordpress/element";
import { Button } from "@wordpress/components";
import { SpacingControlActiveIcon, SpacingControlIcon } from "./icons";
import { useDeviceType } from "@easy-accordion/controls";
import ComponentHeader from "../componentTopSection";
import classNames from "classnames";
import "./editor.scss";

const Spacing = ({
	label,
	attributes,
	attributesKey,
	setAttributes,
	units = ["px", "%", "em"],
	linkButton = true,
	labelItem = false,
	defaultValue = {
		unit: "px",
		value: {
			top: "0",
			right: "0",
			bottom: "0",
			left: "0",
		},
	},
	radiusIndicators = false,
}) => {
	const deviceType = useDeviceType();
	const isLinked = attributes?.allChange;
	// always return true or false.
	const isResponsiveValue = !!attributes?.device;

	// Get values from device-specific field if available, otherwise use default value.
	const spacingValues = isResponsiveValue ? attributes?.device[deviceType] : attributes?.value;

	const setSpacingData = (newValue, typeKey) => {
		// check attributes and update new spacingValues.
		let updateValue = {};
		if (!isLinked) {
			const targetedValue = isResponsiveValue
				? {
						top: spacingValues?.top || 0,
						right: spacingValues?.right || 0,
						bottom: spacingValues?.bottom || 0,
						left: spacingValues?.left || 0,
					}
				: attributes.value;
			updateValue = { ...targetedValue, [typeKey]: newValue };
		} else {
			updateValue = { top: newValue, right: newValue, bottom: newValue, left: newValue };
		}

		// update attributes.
		let updatedAttributes = {};
		if (isResponsiveValue) {
			updatedAttributes = {
				...attributes,
				device: {
					...attributes.device,
					[deviceType]: updateValue,
				},
			};
		} else {
			updatedAttributes = { ...attributes, value: updateValue };
		}

		// Save changes to attributes
		setAttributes({ [attributesKey]: updatedAttributes });
	};

	const setDefaultValue = () => {
		// Prepare default sides.
		const defaultSides = defaultValue?.value;
		const defaultUnit = defaultValue?.unit;

		// Prepare updated data.
		let updatedData = {};
		if (isResponsiveValue) {
			updatedData = {
				...attributes,
				device: {
					...attributes.device,
					[deviceType]: defaultSides,
				},
				unit: {
					...attributes.unit,
					[deviceType]: defaultUnit,
				},
			};
		} else {
			updatedData = {
				...attributes,
				value: defaultSides,
				unit: defaultUnit,
			};
		}
		// Save updated attributes.
		setAttributes({ [attributesKey]: updatedData });
	};

	return (
		<div className="sp-eab-spacing sp-eab-component-mb">
			<ComponentHeader
				label={label}
				attributes={attributes}
				setAttributes={setAttributes}
				attributesKey={attributesKey}
				units={units}
				onReset={setDefaultValue}
			/>
			<div
				className={classNames("sp-eab-spacing-part-2 sp-d-flex", {
					"sp-eab-radius-indicators": radiusIndicators,
					"sp-eab-spacing-indicators": !labelItem && !radiusIndicators,
				})}
			>
				{Object.keys(spacingValues)?.map((position) => {
					const spacingValue = spacingValues[position]?.toString() || "0";
					return (
						<div
							key={position}
							className={classNames(`sp-eab-spacing-${position}`, {
								box: !linkButton && position === "left",
							})}
						>
							<input
								id={`sp-eab-${attributesKey || "spacing"}-${position}`}
								onChange={(e) => setSpacingData(e.target.value, position)}
								type="number"
								value={spacingValue}
							/>
							{labelItem && (
								<span className="sp-eab-spacing-indicator-label sp-d-block">{labelItem[position]}</span>
							)}
						</div>
					);
				})}
				{linkButton && (
					<div className="sp-eab-spacing-all">
						<Button
							className={attributes?.allChange ? "active" : ""}
							onClick={(e) => {
								e.stopPropagation();
								setAttributes({
									[attributesKey]: {
										...attributes,
										allChange: !attributes?.allChange,
									},
								});
							}}
						>
							{isLinked ? <SpacingControlActiveIcon /> : <SpacingControlIcon />}
						</Button>
					</div>
				)}
			</div>
		</div>
	);
};

export default memo(Spacing);
