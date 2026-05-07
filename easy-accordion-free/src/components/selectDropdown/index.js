import { Popover } from "@easy-accordion/components";
import "./editor.scss";

const SelectDropdown = ({ label, options, attributes, setAttributes, attributesKey }) => {
	return (
		<Popover label={label}>
			<ul className="sp-eab-select-dropdown">
				{options?.map(({ value, label, icon }, index) => (
					<li
						key={index}
						className={`sp-eab-select-dropdown-option${attributes === value ? " active" : ""}`}
						onClick={() =>
							setAttributes({
								[attributesKey]: value,
							})
						}
					>
						{label && <span>{label}</span>}
						{icon && <span>{icon}</span>}
					</li>
				))}
			</ul>
		</Popover>
	);
};

export default SelectDropdown;
