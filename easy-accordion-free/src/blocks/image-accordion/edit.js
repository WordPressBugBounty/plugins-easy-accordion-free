import { useBlockProps } from "@wordpress/block-editor";
import { useEffect } from "@wordpress/element";
import { LayoutPreset } from "@easy-accordion/templates";
import { InspectorControl } from "@easy-accordion/components";
import { TogglePanelBodyProvider } from "../../context";
import SharedInspector from "../shared/inspector";
import Render from "./render";
import dynamicCss from "./dynamicCss";
import { fontFamilyToUrlGenerator } from "@easy-accordion/controls";
import { useUniqueId } from "@easy-accordion/hooks";

const ImageAccordionEdit = ({ clientId, attributes, setAttributes }) => {
	const { uniqueId, template, blockName, accordionTitleTypography, descriptionTypography } = attributes;

	useUniqueId(clientId, uniqueId, setAttributes);

	const cssString = dynamicCss(attributes);
	// font family load.
	const typographyList = [accordionTitleTypography, descriptionTypography];
	useEffect(() => {
		setAttributes({ fontLists: fontFamilyToUrlGenerator(typographyList, "frontend") });
	}, [accordionTitleTypography, descriptionTypography]);

	return (
		<div {...useBlockProps()}>
			<style>{cssString}</style>
			<style>{fontFamilyToUrlGenerator(typographyList, "editor")}</style>
			<TogglePanelBodyProvider>
				<InspectorControl attributes={attributes} setAttributes={setAttributes} Inspector={SharedInspector} />
				{!template ? (
					<LayoutPreset blockName={blockName} setAttributes={setAttributes} />
				) : (
					<Render attributes={attributes} setAttributes={setAttributes} clientId={clientId} />
				)}
			</TogglePanelBodyProvider>
		</div>
	);
};

export default ImageAccordionEdit;
