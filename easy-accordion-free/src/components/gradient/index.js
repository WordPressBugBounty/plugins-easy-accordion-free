import { GradientPicker } from "@wordpress/components";
import "./editor.scss";

const SpGradientPicker = ({ value = "", attributesKey = "", setAttributes, onChange = false, gradients = [] }) => {
	const onChangeValue = (newValue) => {
		if (onChange) {
			onChange(newValue);
		} else {
			setAttributes({ [attributesKey]: newValue });
		}
	};

	const defaultGradientColor = "linear-gradient(90deg, rgba(255, 71, 81, 0.4), rgba(255, 145, 10, 0.4))";
	const gradientValue = value === "var(--eab-gradient-color)" ? defaultGradientColor : value;

	return (
		<div className="sp-eab-gradient-color-picker-component">
			<GradientPicker
				value={gradientValue}
				gradients={gradients}
				onChange={(newValue) => onChangeValue(newValue)}
			/>
		</div>
	);
};

export default SpGradientPicker;
