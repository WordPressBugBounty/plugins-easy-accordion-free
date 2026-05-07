// export default memo(Toggle);
import { ToggleControl } from "@wordpress/components";
import { memo, useState } from "@wordpress/element";
import { InfoIcon, DndIndicatorIcon } from "../icons";
import "./editor.scss";

const Toggle = ({
	label,
	attributes,
	setAttributes = true,
	attributesKey,
	onChange = false,
	updated = false,
	enableInfoIcon = false,
	InfoText = "",
	onlyPro = false,
	demoLink = "https://easyaccordion.io/pricing/",
}) => {
	const [isVisible, setIsVisible] = useState(false);
	const toggleVisible = () => {
		setIsVisible((state) => !state);
	};

	return (
		<div
			className={`sp-eab-toggle sp-eab-component-mb${
				updated ? " updated-toggle" : ""
			}${enableInfoIcon ? " sp-eab-toggle-info-icon" : ""}${onlyPro ? " eab-only-pro-toggle" : ""}`}
		>
			{onlyPro && !updated && (
				<div className="sp-eab-toggle-left sp-d-flex sp-align-i-center">
					{/* { updated && <WeatherTitleIcon /> } */}
					<span className="eab-pro-title">{label}</span>
					{demoLink ? (
						<a
							className="eab-pro-badge"
							href={demoLink}
							target="_blank
						"
						>
							(Pro)
						</a>
					) : (
						<span className="eab-pro-badge">(Pro)</span>
					)}
				</div>
			)}

			{(updated || enableInfoIcon) && (
				<div className="sp-eab-toggle-left">
					{updated && <DndIndicatorIcon />}
					{onlyPro ? (
						<div className="sp-eab-toggle-left">
							{/* { updated && <WeatherTitleIcon /> } */}
							<span className="eab-pro-title">{label}</span>
							{onlyPro && <span className="eab-pro-badge">(Pro)</span>}
						</div>
					) : (
						<span>{label}</span>
					)}
					{enableInfoIcon && (
						<span className="toggle-info-icon" onMouseEnter={toggleVisible} onMouseLeave={toggleVisible}>
							{<InfoIcon />}
						</span>
					)}
				</div>
			)}
			{enableInfoIcon && (
				<div
					onMouseEnter={() => setIsVisible(true)}
					onMouseLeave={() => setIsVisible(false)}
					className="toggle-info"
				>
					<div className={`toggle-info-popup ${isVisible ? "show" : ""}`}>
						<InfoText />
					</div>
				</div>
			)}
			<ToggleControl
				label={!(updated || enableInfoIcon || onlyPro) ? label : ""}
				checked={attributes}
				onChange={(newField) =>
					onChange
						? onChange(!newField)
						: setAttributes({
								[attributesKey]: !attributes,
							})
				}
				__nextHasNoMarginBottom={true}
			/>
		</div>
	);
};

export default memo(Toggle);
