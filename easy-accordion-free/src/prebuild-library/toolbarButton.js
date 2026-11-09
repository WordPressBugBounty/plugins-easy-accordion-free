/**
 * WordPress dependencies
 */
import { __ } from "@wordpress/i18n";
import { createRoot } from "@wordpress/element";
import { getModulesSettings } from "@easy-accordion/controls";
import { registerHeaderToolbarButton } from "../blocks/shared/headerToolbarButton";
import { CSS_CLASSES } from "./constants";
import { EasyAccordionLogo } from "./icons";
import Library from "./Library";
import "./editor.scss";

let modalRoot;

const removeModal = () => {
	const modal = document.querySelector(`.${CSS_CLASSES.MODAL}`);
	if (modal) {
		// Unmount React component first.
		if (modalRoot) {
			modalRoot.unmount();
		}

		// Then remove modal from DOM.
		modal.remove();
		document.body.classList.remove(CSS_CLASSES.POPUP_OPEN);
	}
};

const openModal = () => {
	// If modal already exists, don't create another.
	if (document.querySelector(`.${CSS_CLASSES.MODAL}`)) {
		return;
	}
	const node = document.createElement("div");
	node.className = `${CSS_CLASSES.MODAL} sp-eab-patterns-blocks-layouts`;
	document.body.appendChild(node);

	modalRoot = createRoot(node);
	modalRoot.render(<Library isShow={true} onClose={removeModal} />);
	document.body.classList.add(CSS_CLASSES.POPUP_OPEN);

	// Optional: close when clicking outside
	setTimeout(() => {
		node.addEventListener("click", (event) => {
			if (event.target === node) {
				removeModal();
			}
		});
	}, 0);
};

const onInsertButtonClick = (e) => {
	e.preventDefault();
	openModal();
};

/**
 * Register the Patterns Library header launcher.
 *
 * The button's id is load-bearing: the `?eab_pattern_library` redirect
 * (`controls/redirect.js`) clicks it.
 */
export const initPatternsLibrary = () => {
	if (!getModulesSettings("pattern_library")) {
		return;
	}

	registerHeaderToolbarButton({
		slotClass: CSS_CLASSES.TOOLBAR_LIBRARY,
		button: (
			<button type="button" id="sp-eab-patterns-library-modal-button" className="popup-button">
				<EasyAccordionLogo fill="#ffffff" />
				{__("Patterns Library", "easy-accordion-free")}
			</button>
		),
		onClick: onInsertButtonClick,
	});
};
