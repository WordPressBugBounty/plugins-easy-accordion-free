import { TextareaControl } from "@wordpress/components";
import "./editor.scss";

const SPTextareaControl = ({ label = "", attributes, attributesKey = "", setAttributes }) => {
	return (
		<div className="sp-eab-text-area-control sp-eab-component-mb">
			<TextareaControl
				label={label}
				value={attributes}
				onChange={(value) => setAttributes({ [attributesKey]: value })}
			/>
		</div>
	);
};

export default SPTextareaControl;
