import { RangeControl } from "@wordpress/components";
import { memo } from "@wordpress/element";
import { useDeviceType } from "@easy-accordion/controls";
import ComponentHeader from "../componentTopSection";
import "./editor.scss";

const SPRangeControl = ({
	attributes,
	attributesKey,
	setAttributes,
	label,
	units = ["px", "%", "em"],
	resetIcon = true,
	min = 0,
	max = 200,
	step = 1,
	defaultValue = { unit: "px", value: 10 },
}) => {
	// Check device (desktop/tablet/mobile).
	const deviceType = useDeviceType();

	// Ranger single value and multiple device value.
	let value = 0;
	if (attributes?.device) {
		value = attributes?.device[deviceType];
	} else if (attributes?.value !== undefined) {
		value = attributes?.value;
	} else {
		value = attributes;
	}
	const unit = attributes?.unit?.[deviceType] || attributes?.unit;
	// Ranger value set function.
	const setValue = (newValue) => {
		let newAttributes;
		if (attributes?.device) {
			// Update object type responsive attribute.
			newAttributes = {
				...attributes,
				device: { ...attributes.device, [deviceType]: newValue },
			};
		} else if (attributes?.value !== undefined) {
			// Update object type nonresponsive attribute.
			newAttributes = {
				...attributes,
				value: newValue,
			};
		} else {
			// Update single number type attribute.
			newAttributes = newValue;
		}

		setAttributes({ [attributesKey]: newAttributes });
	};

	// Set default value function and reset.
	const setDefault = () => {
		let newAttributes;

		if (attributes?.device) {
			newAttributes = {
				...attributes,
				device: {
					...attributes.device,
					[deviceType]: defaultValue.value,
				},
				unit: {
					...attributes.unit,
					[deviceType]: defaultValue.unit,
				},
			};
		} else if (attributes?.value !== undefined) {
			newAttributes = {
				value: defaultValue.value,
				unit: defaultValue.unit,
			};
		} else {
			newAttributes = defaultValue;
		}

		setAttributes({
			[attributesKey]: newAttributes,
		});
	};

	return (
		<div className="sp-eab-range-control sp-eab-component-mb">
			<ComponentHeader
				label={label}
				attributes={attributes}
				setAttributes={setAttributes}
				attributesKey={attributesKey}
				units={units}
				onReset={resetIcon ? () => setDefault() : false}
			/>
			<RangeControl
				value={value}
				color="#FF5B2E"
				onChange={(newValue) => setValue(newValue)}
				min={min}
				max={attributes?.unit && unit === "%" ? 100 : max}
				step={step}
				__next40pxDefaultSize
				__nextHasNoMarginBottom
			/>
		</div>
	);
};

export default memo(SPRangeControl);
