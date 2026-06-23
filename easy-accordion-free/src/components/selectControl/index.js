import { memo } from "@wordpress/element";
import { SelectControl } from "@wordpress/components";
import { useDeviceType } from "@easy-accordion/controls";
import ComponentHeader from "../componentTopSection";

const SelectField = ({
	attributes,
	attributesKey,
	setAttributes,
	items,
	label = "",
	flexStyle = false,
	units = false,
	onChange = false,
	showHeading = true,
}) => {
	// Device check fn
	const deviceType = useDeviceType();

	const setNewValue = (newValue) => {
		if (onChange) {
			onChange(newValue);
		} else if (attributes?.device) {
			setAttributes({
				[attributesKey]: {
					device: { ...attributes?.device, [deviceType]: newValue },
				},
			});
		} else {
			setAttributes({ [attributesKey]: newValue });
		}
	};

	const selectItems = items.map(({ pro, ...item }) => ({
		...item,
		disabled: pro === true,
	}));

	// Get active button value
	const activeValue = attributes?.device ? attributes?.device[deviceType] : attributes;

	return (
		<div
			className={`sp-eab-select-field sp-eab-component-mb ${flexStyle ? "sp-d-flex sp-justify-between sp-align-center" : "sp-d-block"}`}
		>
			{showHeading && (
				<ComponentHeader
					label={label}
					attributes={attributes}
					attributesKey={attributesKey}
					setAttributes={setAttributes}
					units={units}
				/>
			)}
			<SelectControl
				className="custom-select-control"
				value={activeValue}
				options={selectItems}
				onChange={setNewValue}
				__nextHasNoMarginBottom
				__next40pxDefaultSize
			/>
		</div>
	);
};

export default memo(SelectField);
