import { useBlockProps } from "@wordpress/block-editor";
import { useEffect, useMemo } from "@wordpress/element";
import { useSelect, dispatch } from "@wordpress/data";
import { InspectorControl } from "@easy-accordion/components";
import { LayoutPreset } from "@easy-accordion/templates";
import { useUniqueId } from "@easy-accordion/hooks";
import { getSymbolFromNumber, getEabBlockProps, fontFamilyToUrlGenerator } from "@easy-accordion/controls";
import regularAccordionDynamicCss from "../shared/regularAccordionDynamicCss";
import { TogglePanelBodyProvider } from "../../context";
import SharedInspector from "../shared/inspector";
import Render from "./render";

const HorizontalAccordionEdit = ({ clientId, attributes, setAttributes }) => {
	const {
		uniqueId,
		blockName,
		template,
		parentId,
		toggleIconsSet,
		enableExpandAndCollapseIcon,
		accordionTitleTag,
		toggleIconPosition,
		featuredIconVerticalAlignment,
		titleAlignment,
		customIdName,
		customClassName,
		accordionTitleTypography,
		accordionContentTypography,
		schemaMarkup,
	} = attributes;

	// custom hook call.
	useUniqueId(clientId, uniqueId, setAttributes, "sp-eab-", true);

	const parentBlock = useSelect(
		(select) => {
			return select("core/block-editor").getBlock(clientId);
		},
		[clientId]
	);

	const innerBlocksLength = useMemo(() => parentBlock?.innerBlocks?.length, [parentBlock?.innerBlocks?.length]);

	useEffect(() => {
		parentBlock.innerBlocks.forEach((innerBlock, index) => {
			dispatch("core/block-editor").updateBlockAttributes(innerBlock.clientId, {
				template,
				parentId,
				toggleIconsSet,
				enableExpandAndCollapseIcon,
				accordionTitleTag,
				toggleIconPosition,
				featuredIconVerticalAlignment,
				titleAlignment,
				parentBlockName: blockName,
				contentShowCloseButton: false,
				schemaMarkup,
			});
		});
	}, [
		template,
		blockName,
		parentId,
		innerBlocksLength,
		toggleIconsSet,
		enableExpandAndCollapseIcon,
		accordionTitleTag,
		toggleIconPosition,
		titleAlignment,
		featuredIconVerticalAlignment,
		schemaMarkup,
	]);

	const cssString = useMemo(() => regularAccordionDynamicCss(attributes), [attributes]);
	const blockProps = getEabBlockProps(useBlockProps(), customIdName, customClassName);

	// font family load.
	const typographyList = [accordionTitleTypography, accordionContentTypography];
	useEffect(() => {
		setAttributes({ fontLists: fontFamilyToUrlGenerator(typographyList, "frontend") });
	}, [accordionTitleTypography, accordionContentTypography]);

	return (
		<div {...blockProps}>
			<style>{cssString}</style>
			<style>{fontFamilyToUrlGenerator(typographyList, "editor")}</style>
			<TogglePanelBodyProvider>
				<InspectorControl attributes={attributes} setAttributes={setAttributes} Inspector={SharedInspector} />
				{template ? (
					<Render
						clientId={clientId}
						attributes={attributes}
						setAttributes={setAttributes}
						childBlocks={parentBlock?.innerBlocks}
					/>
				) : (
					<LayoutPreset blockName={blockName} setAttributes={setAttributes} />
				)}
			</TogglePanelBodyProvider>
		</div>
	);
};

export default HorizontalAccordionEdit;
