import { useEffect, useRef, useState } from "@wordpress/element";
import { Button } from "@wordpress/components";
import { jsonParse } from "@easy-accordion/controls";
import { BorderIcon } from "../../icons";
import "./editor.scss";

const Popup = ({ label, children, toggleButton }) => {
	const [isContentsVisible, setIsContentsVisible] = useState(false);
	const popupRef = useRef(null);
	const buttonRef = useRef(null);

	const handleButtonClick = () => {
		setIsContentsVisible((prev) => !prev);
	};
	// Close the dropdown when clicking outside of it.
	useEffect(() => {
		const handleClickOutside = (event) => {
			const typographyPopup = document.querySelector(".sp-easy-accordion-typography-fonts");
			if (
				popupRef.current &&
				!typographyPopup &&
				!popupRef.current.contains(event.target) &&
				!buttonRef.current.contains(event.target)
			) {
				setIsContentsVisible(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [popupRef, buttonRef]);

	const value = toggleButton?.props?.attributes;
	const isActivePopUpButton = value ? jsonParse(value) : true;

	return (
		<>
			<div className="sp-easy-accordion-button sp-eab-component-mb">
				<div className={`sp-easy-accordion-header-left ${toggleButton && "wide-area"}`}>
					{label && <span className="sp-eab-component-title">{label}</span>}
					{toggleButton && toggleButton}
				</div>
				<div className="sp-easy-accordion-header-right">
					<Button
						disabled={!isActivePopUpButton}
						className={`sp-easy-accordion-border-icon-button ${
							isActivePopUpButton ? "active" : ""
						} ${isContentsVisible ? "button-clicked" : ""}`}
						icon={<BorderIcon color={isContentsVisible ? "#ffffff" : "#2F2F2F"} />}
						ref={buttonRef}
						onClick={handleButtonClick}
					/>
				</div>
			</div>
			{isContentsVisible && isActivePopUpButton && (
				<div ref={popupRef} className="sp-easy-accordion-popup-content">
					{children} {/* Render children content here */}
				</div>
			)}
		</>
	);
};

export default Popup;
