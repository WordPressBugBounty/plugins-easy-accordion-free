/**
 * WordPress dependencies
 */
import { registerPlugin } from "@wordpress/plugins";
import { debounce } from "@wordpress/compose";
import { subscribe } from "@wordpress/data";
import { createRoot } from "@wordpress/element";
import { CSS_CLASSES, DEFAULTS } from "./constants";
import { getModulesSettings } from "@easy-accordion/controls";
import { EasyAccordionLogo } from "./icons";
import Library from "./Library";
import "./editor.scss";

/**
 * Add Prebuilt Library button to Gutenberg toolbar
 */

let modalRoot;

export function ToolbarLibrary() {
	if (!getModulesSettings("pattern_library")) {
		return;
	}
	const renderButton = (selector) => {
		// Avoid adding duplicate buttons.
		if (selector.querySelector(`.${CSS_CLASSES.TOOLBAR_LIBRARY}`)) {
			return;
		}
		const patternButton = document.createElement("div");
		patternButton.classList.add(CSS_CLASSES.TOOLBAR_LIBRARY);
		selector.appendChild(patternButton);

		const root = createRoot(patternButton);
		root.render(
			<span id="sp-eab-patterns-library-modal-button" className="popup-button" onClick={onInsertButtonClick}>
				<EasyAccordionLogo fill="#ffffff" />
				Easy Accordion Patterns Library
			</span>
		);
	};

	const onInsertButtonClick = (e) => {
		e.preventDefault();
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

	const debouncedRender = debounce(() => {
		const editToolbar = document.querySelector(".edit-post-header-toolbar");
		if (editToolbar) {
			renderButton(editToolbar);
		}
	}, DEFAULTS.DEBOUNCE_DELAY);

	const unsubscribe = subscribe(() => {
		debouncedRender();
		unsubscribe();
	});

	return null;
}

registerPlugin("sp-eab-patterns-toolbar-library", {
	render: ToolbarLibrary,
});
