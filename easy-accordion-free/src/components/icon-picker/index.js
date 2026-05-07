import { Dropdown, Tooltip } from "@wordpress/components";
import { useEffect, useRef, useState } from "@wordpress/element";
import icons from "./icon-lists";
import "./editor.scss";

const SPIconPicker = ({
	attributes,
	attributesKey,
	setAttributes,
	label,
	closeBtn = true,
	defaultCategory = "All",
}) => {
	const activeIconRef = useRef(null);
	const [searchQuery, setSearchQuery] = useState("");
	const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const handleChange = (newIcon) => {
		const icon = newIcon.split(" ")[1];
		setAttributes({ [attributesKey]: icon });
	};
	const handleClose = () => {
		setAttributes({ [attributesKey]: "" });
	};
	const flatIcons = selectedCategory === "All" ? Object.values(icons).flat() : icons[selectedCategory];
	const activeIcon = "fa " + attributes;
	const categories = Object.keys(icons);
	// Filter icons based on search query
	const filteredIcons = flatIcons.filter((icon) => icon.toLowerCase().includes(searchQuery.toLowerCase()));

	const iconNameHandle = (icon) => {
		const iconName = icon?.replace("fa fa-", "")?.replaceAll("-", " ");
		const capitalizedName = iconName?.replace(/\b\w/g, (char) => char.toUpperCase());
		return capitalizedName;
	};

	useEffect(() => {
		if (isDropdownOpen && activeIconRef.current) {
			setTimeout(() => {
				activeIconRef.current.scrollIntoView({
					behavior: "smooth",
					block: "center",
				});
			}, 100);
		}
	}, [isDropdownOpen]);

	return (
		<div className="sp-eab-icon-picker-area sp-eab-component-mb sp-d-flex sp-flex-col sp-gap-8px">
			<span className="sp-eab-component-title">{label}</span>
			{/* modal */}
			<Dropdown
				popoverProps={{ placement: "bottom-start" }}
				renderToggle={({ isOpen, onToggle }) => (
					<div
						onClick={() => {
							setIsDropdownOpen((prev) => !prev);
							onToggle();
						}}
						aria-expanded={isOpen}
					>
						<div className="sp-eab-media-control__wrapper sp-d-flex sp-align-center sp-justify-center sp-cursor-pointer">
							{attributes ? (
								<>
									<div className="sp-eab-icon-picker-active-icon">
										<i className={activeIcon}></i>
									</div>
									{closeBtn && (
										<button
											className="sp-eab-icon-picker-close-btn sp-eab-icon-picker-btn sp-d-flex sp-align-center sp-justify-center sp-cursor-pointer"
											onClick={handleClose}
										>
											<i className="fa fa-times" />
										</button>
									)}
								</>
							) : (
								<button className="sp-eab-icon-picker-add-btn sp-eab-icon-picker-btn sp-d-flex sp-align-center sp-justify-center sp-cursor-pointer">
									<i className="fa fa-plus" />
								</button>
							)}
							<div className="sp-eab-media-picker-tooltip">
								<span>{attributes ? "Change Icon" : "Choose Icon"}</span>
							</div>
						</div>
					</div>
				)}
				onClose={(event, isInside) => {
					setIsDropdownOpen(false);
					if (isInside) {
						event.stopPropagation();
					}
				}}
				renderContent={() => (
					<div
						onMouseDown={(event) => {
							event.stopPropagation();
						}}
						className="sp-eab-icon-picker-popup"
					>
						<div className="sp-eab-icon-picker-popup-top-section">
							<span className="sp-eab-icon-search-heading">Select an Icon</span>
							<span className="sp-eab-icon-search-sub-heading">Choose an icon for this collection.</span>
							<div className="sp-eab-icon-picker-search-and-category-wrapper">
								{/* Search Input */}
								<input
									type="text"
									placeholder="Search..."
									value={searchQuery}
									onChange={(e) => setSearchQuery(e.target.value)}
									className="sp-eab-icon-picker-search"
								/>
								{/* Category Dropdown */}
								<select
									className="sp-eab-icon-picker-category"
									value={selectedCategory}
									onChange={(e) => setSelectedCategory(e.target.value)}
								>
									<option value="All">All</option>
									{categories.map((category, index) => (
										<option key={index} value={category}>
											{category}
										</option>
									))}
								</select>
							</div>
						</div>
						<div className="sp-eab-icon-picker-list">
							{filteredIcons?.map((icon, index) => (
								<Tooltip
									key={index}
									text={iconNameHandle(icon)}
									className="sp-eab-component-tooltip"
									position="top"
								>
									<span
										key={index}
										ref={activeIcon === icon ? activeIconRef : null}
										className={`sp-eab-icon-picker-item ${activeIcon === icon ? "active" : ""}`}
										onClick={() => handleChange(icon)}
									>
										<i className={icon}></i>
									</span>
								</Tooltip>
							))}
						</div>
					</div>
				)}
			/>
		</div>
	);
};

export default SPIconPicker;
