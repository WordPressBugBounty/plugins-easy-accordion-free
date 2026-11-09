/**
 * Editor header launcher — "Patterns Library".
 *
 * A plain DOM node appended inside the document tools toolbar, so it sits
 * after List View, and re-asserted on every `@wordpress/data` store tick.
 * Gutenberg exposes no header slot and remounts that toolbar — a foreign
 * tabbable child flips it `Toolbar` → `NavigableMenu`, and responsive layouts
 * swap it — wiping the node; the next tick re-adds it synchronously.
 * Idempotent: a present slot short-circuits.
 */
import { subscribe } from "@wordpress/data";
import { renderToString } from "@wordpress/element";

const TOOLBAR_SELECTORS = [".edit-post-header-toolbar", ".editor-header__toolbar"];

/**
 * Keep one launcher button in the header toolbar for the life of the editor.
 * Launchers are appended in registration order.
 *
 * @param {Object}   options
 * @param {string}   options.slotClass Class of the wrapper — how a present launcher is found.
 * @param {Object}   options.button    Element rendered once to static markup; its root must be the clickable node.
 * @param {Function} options.onClick   Click handler bound to that root.
 */
export const registerHeaderToolbarButton = ({ slotClass, button, onClick }) => {
	let markup = "";

	const ensureButton = () => {
		const toolbar = TOOLBAR_SELECTORS.map((selector) => document.querySelector(selector)).find(Boolean);
		if (!toolbar || toolbar.querySelector(`.${slotClass}`)) {
			return;
		}

		markup = markup || renderToString(button);
		const slot = document.createElement("div");
		slot.className = slotClass;
		slot.innerHTML = markup;
		slot.firstElementChild.addEventListener("click", onClick);
		toolbar.appendChild(slot);
	};

	subscribe(ensureButton);
	ensureButton();
};
