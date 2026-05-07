import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { memo, useContext, useEffect } from "@wordpress/element";
import { SidebarTabsContext } from "../../context";
import { useUniqueId } from "@easy-accordion/hooks";

const SidebarItemEdit = ({ clientId, attributes, setAttributes }) => {
	const { customClassName, uniqueId, parentId, contentAnimationEffect } = attributes;
	const { activeId } = useContext(SidebarTabsContext);

	useUniqueId(clientId, uniqueId, setAttributes);

	const blockProps = useBlockProps({
		className: `sp-eab-sidebar-tab-item eab-content-${parentId}${clientId === activeId ? " eab-expand" : ""}${customClassName ? ` ${customClassName}` : ""}`,
	});

	const props = { ...blockProps, id: uniqueId };

	return (
		<div {...props}>
			<div
				className={`sp-eab-accordion-content-wrapper${contentAnimationEffect !== "none" ? ` animated ${contentAnimationEffect}` : ""}`}
			>
				<InnerBlocks template={[["core/paragraph"]]} />
			</div>
		</div>
	);
};

export default memo(SidebarItemEdit);
