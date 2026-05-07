import { memo } from "@wordpress/element";
import Responsive from "../responsive";
import ResetButton from "../resetButton";
import Units from "../units";
import "./editor.scss";

const ComponentHeader = ({ label, attributes, setAttributes, attributesKey = "", units = false, onReset = false }) => {
	return (
		<div className="sp-eab-component-header sp-d-flex sp-justify-between sp-mb-8px">
			<div className="sp-eab-component-header-left sp-d-flex sp-align-center">
				<span className="sp-eab-component-title">{label}</span>
				{attributes?.device && <Responsive />}
			</div>
			<div className="sp-eab-component-header-right sp-d-flex sp-align-center">
				{onReset && <ResetButton onClick={() => onReset()} />}
				{units && (
					<Units
						attributes={attributes}
						setAttributes={setAttributes}
						attributesKey={attributesKey}
						units={units}
					/>
				)}
			</div>
		</div>
	);
};

export default memo(ComponentHeader);
