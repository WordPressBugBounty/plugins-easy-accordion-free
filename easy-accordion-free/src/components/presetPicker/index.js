import { __ } from "@wordpress/i18n";

const PresetPicker = ({
	label = __("Select Preset", "easy-accordion-free"),
	items = [],
	activeItem = null,
	onSelect = () => {},
	type = "icon", // "icon" | "single-icon" | "image"
	customClass = "",
}) => {
	return (
		<div className="sp-eab-toggle-icon-picker sp-eab-component-mb">
			<span className="sp-eab-component-title sp-mb-8px">{label}</span>

			<div className={`sp-eab-toggle-icon-sets sp-d-grid sp-grid-cols-4 sp-gap-10px ${customClass}`}>
				{items?.map((item, index) => {
					// Active state detection for all possible item types
					const isActive = type === "icon" ? item.expand === activeItem?.expand : item === activeItem;

					return (
						<div
							key={item.set || index}
							className={`sp-eab-icon-set sp-cursor-pointer sp-d-flex sp-align-center sp-justify-center${
								isActive ? " active" : ""
							}${item?.pro ? " sp-eab-pro-preset" : ""}`}
							onClick={() => onSelect(item)}
						>
							{/* Dual icon (expand/collapse) */}
							{type === "icon" && (
								<>
									{item.expand && <span className={item.expand}></span>}
									{item.collapse && <span className={item.collapse}></span>}
								</>
							)}

							{/* Single icon set (e.g., lightbox icon sets) */}
							{type === "single-icon" && <span className={item}></span>}

							{/* For possible image presets */}
							{type === "image" && (
								<img src={item.src} alt={item.alt || "preset"} className="sp-eab-preset-img" />
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
};

export default PresetPicker;
