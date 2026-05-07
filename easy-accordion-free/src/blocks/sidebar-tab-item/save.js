import { InnerBlocks } from "@wordpress/block-editor";

const SidebarItemSave = ({ attributes }) => {
	const { uniqueId, parentId, customClassName, contentAnimationEffect } = attributes;
	return (
		<div
			id={uniqueId}
			className={`sp-eab-sidebar-tab-item eab-content-${parentId}${customClassName ? ` ${customClassName}` : ""}`}
		>
			<div
				className={`sp-eab-accordion-content-wrapper${contentAnimationEffect !== "none" ? ` animated ${contentAnimationEffect}` : ""}`}
			>
				<InnerBlocks.Content />
			</div>
		</div>
	);
};

export default SidebarItemSave;
