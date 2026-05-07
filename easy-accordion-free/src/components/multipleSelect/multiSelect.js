import Select from "react-select";
import "./editor.scss";

const MultipleSelect = ({
	attributes,
	setAttributes,
	attributesKey,
	label,
	items,
	onChange = false,
	flex = false,
	reset = false,
	onInputChange = false,
}) => {
	const updateValue = (data) => {
		setAttributes({ [attributesKey]: data });
	};

	return (
		<div
			className={`sp-eab-multi-select${flex ? " sp-d-flex sp-align-center sp-justify-between" : ""} sp-eab-component-mb`}
		>
			<span className="sp-eab-component-title sp-mb-8px">{label}</span>
			<Select
				defaultValue={attributes}
				isMulti
				options={items}
				isClearable={reset}
				onChange={(data) => (onChange ? onChange(data) : updateValue(data))}
				onInputChange={(e) => (onInputChange ? onInputChange(e) : "")}
				className="sp-eab-basic-multi-select"
			/>
		</div>
	);
};

export default MultipleSelect;
