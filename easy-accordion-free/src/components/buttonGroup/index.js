import { useDeviceType } from "@easy-accordion/controls";
import Responsive from "../responsive";
import Button from "../button";
import "./editor.scss";

const ButtonGroup = ({ attributes, attributesKey, setAttributes, items, label = "", onClick = false }) => {
	// Device type
	const deviceType = useDeviceType();
	const isResponsiveValue = attributes?.device ? true : false;

	// Update button group value
	const setButtonGroup = (newValue) => {
		if (isResponsiveValue) {
			setAttributes({
				[attributesKey]: {
					...attributes.device,
					[deviceType]: newValue,
				},
			});
		} else {
			setAttributes({ [attributesKey]: newValue });
		}
	};

	// Get the active value
	const activeValue = isResponsiveValue ? attributes.device[deviceType] : attributes;

	// Handle button click
	const handleClick = (value) => {
		if (onClick) {
			onClick(value);
		} else {
			setButtonGroup(value);
		}
	};

	return (
		<div className="sp-eab-button-group sp-eab-component-mb">
			{label && (
				<div className="sp-eab-component-top sp-eab-component-title-mb">
					<span className="sp-eab-component-title">{label}</span>
					{isResponsiveValue && <Responsive />}
				</div>
			)}
			<div
				className="sp-eab-button-group-items sp-d-flex sp-align-center"
				style={{ "--total-buttons": items?.length }}
			>
				{items?.map((item, i) => {
					const isPro = item?.pro;

					return (
						<Button
							key={i}
							className={`${activeValue === item.value ? "active" : ""} ${isPro ? "is-pro" : ""}`}
							value={item.value}
							disabled={isPro}
							onClick={() => {
								if (!isPro) {
									handleClick(item.value);
								}
							}}
						>
							<span
								{...(item.tooltip && { title: item.tooltip })}
								className="sp-eab-button-group-content"
							>
								{item?.label} {isPro ? "(Pro)" : ""}
							</span>
						</Button>
					);
				})}
			</div>
		</div>
	);
};

export default ButtonGroup;
