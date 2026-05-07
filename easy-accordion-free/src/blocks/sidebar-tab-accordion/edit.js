import { useEffect, useMemo, useRef } from "@wordpress/element";
import { useBlockProps } from "@wordpress/block-editor";
import { useSelect, dispatch } from "@wordpress/data";
import { fontFamilyToUrlGenerator, getEabBlockProps, getSymbolFromNumber } from "@easy-accordion/controls";
import { InspectorControl } from "@easy-accordion/components";
import { useUniqueId } from "@easy-accordion/hooks";
import SharedInspector from "../shared/inspector";
import { LayoutPreset } from "../../templates";
import { TogglePanelBodyProvider } from "../../context";
import dynamicCss from "../shared/regularAccordionDynamicCss";
import toggleDefaultValue from "./toggleDefaultValue";
import Render from "./render";

const SidebarTabsEdit = ({ clientId, attributes, setAttributes }) => {
	const {
		parentId,
		uniqueId,
		customIdName,
		customClassName,
		blockName,
		template,
		toggleIconsSet,
		enableExpandAndCollapseIcon,
		accordionTitleTag,
		toggleIconPosition,
		featuredIconVerticalAlignment,
		titleAlignment,
		accordionTitleTypography,
		accordionContentTypography,
		contentAnimationEffect,
	} = attributes;
	// custom hooks.
	useUniqueId(clientId, uniqueId, setAttributes);

	const parentBlock = useSelect((select) => select("core/block-editor").getBlock(clientId), [clientId]);
	const innerBlocks = parentBlock?.innerBlocks;

	// On template change, update attributes to default values for the new template.
	const previousTemplateRef = useRef(template);
	useEffect(() => {
		if (previousTemplateRef.current !== template) {
			previousTemplateRef.current = template;
			const defaultValues = toggleDefaultValue(attributes);
			if (defaultValues) {
				setAttributes(defaultValues);
			}
		}
	}, [template]);

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
				contentAnimationEffect,
			});
		});
	}, [
		template,
		blockName,
		// parentBlock,
		innerBlocks?.length,
		toggleIconsSet,
		enableExpandAndCollapseIcon,
		accordionTitleTag,
		toggleIconPosition,
		titleAlignment,
		featuredIconVerticalAlignment,
		contentAnimationEffect,
		parentId,
	]);

	const blockProps = getEabBlockProps(useBlockProps(), customIdName, customClassName);
	const cssString = useMemo(() => dynamicCss(attributes), [attributes]);

	// font family load.
	const typographyList = [accordionTitleTypography, accordionContentTypography];

	useEffect(() => {
		setAttributes({ fontLists: fontFamilyToUrlGenerator(typographyList, "frontend") });
	}, [accordionTitleTypography, accordionContentTypography]);

	return (
		<TogglePanelBodyProvider>
			<div {...blockProps}>
				<style>{cssString}</style>
				<style>{fontFamilyToUrlGenerator(typographyList, "editor")}</style>
				<InspectorControl attributes={attributes} setAttributes={setAttributes} Inspector={SharedInspector} />
				{template ? (
					<Render
						clientId={clientId}
						attributes={attributes}
						setAttributes={setAttributes}
						childBlocks={innerBlocks}
					/>
				) : (
					<LayoutPreset blockName={blockName} setAttributes={setAttributes} />
				)}
			</div>
		</TogglePanelBodyProvider>
	);
};

export default SidebarTabsEdit;
