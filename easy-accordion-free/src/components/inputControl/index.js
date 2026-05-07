import { __experimentalInputControl as Input } from "@wordpress/components";
import { useDeviceType } from "@easy-accordion/controls";
import Responsive from "../responsive";
import "./editor.scss";

const InputControl = ({
	attributes,
	attributesKey,
	setAttributes,
	label,
	flex = false,
	inputType = "text",
	placeholder,
	onChange = false,
	help = false,
	min = 1,
	step = 1,
}) => {
	// Check device (desktop/tablet/mobile).
	const deviceType = useDeviceType();

	const value = attributes?.device ? attributes?.device[deviceType] : attributes;

	const setInputValue = (newValue) => {
		if (attributes?.device) {
			setAttributes({
				[attributesKey]: {
					...attributes,
					device: { ...attributes.device, [deviceType]: newValue },
				},
			});
		} else {
			setAttributes({ [attributesKey]: newValue });
		}
	};

	// Set value function.
	const setValue = (newValue) => {
		setInputValue(newValue);
	};

	return (
		<div className="sp-eab-input-control sp-eab-component-mb">
			<div
				className={`sp-eab-input-control-header ${flex ? "sp-flex-input sp-d-flex sp-justify-between" : "sp-block-input"}`}
			>
				<div className={`sp-eab-input-control-header-left ${flex ? "sp-d-flex sp-align-center" : "sp-mb-8px"}`}>
					<span className="sp-eab-component-title">{label}</span>
					{attributes?.device && <Responsive />}
				</div>
				<div className="sp-eab-input-control-field">
					<Input
						type={inputType}
						value={value}
						step={step}
						onChange={(val) => (onChange ? onChange(val) : setValue(val))}
						placeholder={placeholder} // Use placeholder prop here
						help={help}
						min={min}
						__next40pxDefaultSize
					/>
				</div>
			</div>
		</div>
	);
};

export default InputControl;
