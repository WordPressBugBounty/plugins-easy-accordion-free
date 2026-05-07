import { __ } from "@wordpress/i18n";
import { RightSymbolIcon } from "../../icons";
import "./editor.scss";

const Layout = ({ layout, handleActive, activeLayout, displayActive, preset = true }) => {
	const { Icon, value, label, onlyPro } = layout;

	const navigateToPricing = () => {
		window.open("https://easyaccordion.io/pricing/", "_blank", "noopener,noreferrer");
	};

	return (
		<div
			// onClick={() => !onlyPro && handleActive(value)}
			onClick={() => {
				if (onlyPro) {
					navigateToPricing();
				} else {
					handleActive(value);
				}
			}}
			className={`sp-easy-accordion-layout-card ${value === activeLayout ? "active" : "inactive"} ${onlyPro ? "sp-eab-only-pro-card" : ""}`}
		>
			{value === activeLayout && displayActive && (
				<span className="active-symbol">
					<RightSymbolIcon />
				</span>
			)}
			{/* {Icon && <Icon />} */}
			<div className="sp-eab-preset-icon-wrapper">
				<Icon activeStyle={value === activeLayout} />
				{onlyPro && (
					<span className="sp-eab-pro-badge">
						<a
							href={"https://easyaccordion.io/pricing/"}
							target="_blank"
							rel="noopener noreferrer"
							className="sp-eab-pro-card-link"
						>
							{" "}
							PRO{" "}
						</a>
					</span>
				)}
			</div>
			{label && !preset && <p className="sp-easy-accordion-layout-title">{label}</p>}
		</div>
	);
};

const Layouts = ({
	attributes,
	setAttributes,
	attributesKey,
	displayActive = false,
	label = "",
	grid = 2,
	items,
	preset = false,
	blockName = "",
	demoLink = "https://easyaccordion.io/pricing/",
	onClick = false,
}) => {
	const handleActive = (value) => {
		if (value === attributes) {
			return;
		}
		setAttributes({ [attributesKey]: value });
	};

	return (
		<div className="sp-easy-accordion-layout-picker sp-eab-component-mb">
			{label && <span className="sp-eab-component-title">{label}</span>}
			<div className={`sp-easy-accordion-layouts grid-${grid}`}>
				{items?.map((layout, index) => (
					<Layout
						key={index}
						layout={layout}
						displayActive={displayActive}
						handleActive={onClick ? onClick : handleActive}
						activeLayout={attributes}
						preset={preset}
					/>
				))}
			</div>
			{preset && blockName === "vertical-accordion" && (
				<div className="sp-eab-see-more-overlay">
					<a
						href="https://easyaccordion.io/blocks/#demoId15"
						target="_blank"
						rel="noopener noreferrer"
						className="sp-eab-pro-link"
					>
						{__("See More", "location-weather")}
					</a>
				</div>
			)}
		</div>
	);
};

export default Layouts;
