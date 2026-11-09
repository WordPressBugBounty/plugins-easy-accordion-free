import { createRoot } from "@wordpress/element";
import { accordionBlocksInfo } from "@easy-accordion/constants";
import Library from "./Library";

export const currentBlockTitle = (blockName) => {
	const fullName = `sp-easy-accordion-pro/${blockName}`;
	const block = accordionBlocksInfo[fullName];
	return block ? block?.title : "";
};

// Close modal.
let modalRoot = null;

export const onRemoveSinglePatternPopup = () => {
	if (modalRoot) {
		modalRoot.unmount();
		modalRoot = null;
	}
	const modalNode = document.querySelector(".sp-eap-patterns-builder-modal");
	if (modalNode) {
		modalNode.remove();
	}
	document.body.classList.remove("sp-eap-patterns-popup-open");
};
// Open modal.
export const onOpenSinglePatternPopup = (e, blockName, removeBlock = false) => {
	e.preventDefault();

	// If modal already exists, do nothing.
	if (document.querySelector(".sp-eap-patterns-builder-modal")) {
		return;
	}

	const node = document.createElement("div");
	node.className = "sp-eap-patterns-builder-modal sp-eap-patterns-blocks-layouts";
	document.body.appendChild(node);

	modalRoot = createRoot(node);
	modalRoot.render(
		<Library
			isShow={true}
			onClose={onRemoveSinglePatternPopup}
			currentBlockName={blockName}
			removeBlock={removeBlock}
		/>
	);
	document.body.classList.add("sp-eap-patterns-popup-open");

	// Close when clicking outside.
	setTimeout(() => {
		node.addEventListener("click", (event) => {
			if (event.target === node) {
				onRemoveSinglePatternPopup();
			}
		});
	}, 0);
};
