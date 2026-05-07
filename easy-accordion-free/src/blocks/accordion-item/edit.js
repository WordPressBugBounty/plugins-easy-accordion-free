import { useMemo } from "@wordpress/element";
import { InspectorControl } from "@easy-accordion/components";
import { InnerBlocks, useBlockProps } from "@wordpress/block-editor";
import { Accordion } from "@easy-accordion/templates";
import AccordionHeader from "./accordionHeader";
import dynamicCss from "./dynamicCss";
import Inspector from "./inspector";
import { useUniqueId } from "@easy-accordion/hooks";

const AccordionItemEdit = ({ clientId, attributes, setAttributes }) => {
	const { parentId, uniqueId, accordionTitleTag, disableItem, customClassName } = attributes;
	useUniqueId(clientId, uniqueId, setAttributes, "sp-eab-item-");

	const dynamicStyles = useMemo(() => dynamicCss(attributes), [attributes]);

	const blockProps = useBlockProps({
		className: `sp-eab-accordion-item eab-item-${parentId}${customClassName ? ` ${customClassName}` : ""}`,
		style: { marginLeft: 0, marginRight: 0, opacity: disableItem ? 0.6 : 1 },
	});

	// load font family

	const onChangeTitle = (newTitle) => {
		setAttributes({ accordionTitle: newTitle });
	};

	return (
		<Accordion.Item eventKey={clientId} blockProps={{ ...blockProps, id: uniqueId }}>
			<style>{dynamicStyles}</style>
			<InspectorControl
				attributes={{ ...attributes, clientId }}
				setAttributes={setAttributes}
				Inspector={Inspector}
			/>
			<div className="sp-eab-accordion-item-wrapper">
				<Accordion.Heading TagName={accordionTitleTag} className={`eab-heading-${parentId}`}>
					<AccordionHeader attributes={attributes} onChangeTitle={onChangeTitle} />
				</Accordion.Heading>
				<Accordion.Content className={`eab-content-${parentId}`}>
					<div className="sp-eab-accordion-body">
						<InnerBlocks template={[["core/paragraph"]]} renderAppender={false} />
					</div>
				</Accordion.Content>
			</div>
		</Accordion.Item>
	);
};

export default AccordionItemEdit;
