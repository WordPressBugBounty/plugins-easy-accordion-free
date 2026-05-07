import { Popover } from "@wordpress/components";
import { useEffect, useState } from "@wordpress/element";
import { getRandomId } from "@easy-accordion/controls";
import { PopOverToggleIcon } from "./icons";
import "./editor.scss";

// compound component.
const SpPopover = ({ children, label = "popover", toggleIcon = false, className = "" }) => {
	const [open, setOpen] = useState(false);
	const uniqueId = `${getRandomId("sp-eab")}popover`;

	useEffect(() => {
		const clickOutSite = (e) => {
			const componentView = e.target.closest(".sp-eab-popover__content-visible");
			const colorPicker = e.target.closest(".sp-eab-color-picker-renderer");
			const buttonTarget = e.target.closest(`.sp-eab-popover-toggle-button.${uniqueId}`);
			const select = e.target.closest(".css-1nmdiq5-menu");
			if (open && !componentView && !buttonTarget && !select && !colorPicker) {
				setOpen(false);
			}
		};
		window.addEventListener("click", clickOutSite);

		return () => window.removeEventListener("click", clickOutSite);
	});

	return (
		<div className={`sp-eab-popover-component sp-eab-component-mb${className ? ` ${className}` : ""}`}>
			{label && (
				<div className="sp-eab-popover-toggle-wrapper sp-d-flex sp-justify-between">
					<span className="sp-eab-component-title">{label}</span>
					<button
						onClick={() => setOpen((prev) => !prev)}
						className={`sp-eab-popover-toggle-button ${uniqueId} sp-cursor-pointer${open ? " active" : ""}`}
					>
						{toggleIcon ? toggleIcon : <PopOverToggleIcon />}
					</button>
				</div>
			)}
			{open && (
				<Popover shift={true}>
					<div className="sp-eab-popover__content-visible sp-easy-accordion-tabs-panel">
						<div className="sp-eab-popover__content-visible-content">{children}</div>
					</div>
				</Popover>
			)}
		</div>
	);
};

SpPopover.Header = ({ children }) => <div className="sp-eab-popover__content-visible-label">{children}</div>;

SpPopover.Content = ({ children }) => <div className="sp-eab-popover__content">{children}</div>;

export default SpPopover;
