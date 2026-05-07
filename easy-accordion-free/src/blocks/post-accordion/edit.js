import { useEffect, useRef } from "@wordpress/element";
import { useBlockProps } from "@wordpress/block-editor";
import { InspectorControl } from "@easy-accordion/components";
import SharedInspector from "../shared/inspector";
import dynamicCss from "./dynamicCss";
import Render from "./render";
import { TogglePanelBodyProvider } from "../../context";
import { LayoutPreset } from "@easy-accordion/templates";
import useApiData from "../../hooks/useApiData";
import { fontFamilyToUrlGenerator } from "@easy-accordion/controls";
import { useUniqueId } from "@easy-accordion/hooks";

const PostAccordionEdit = ({ attributes, setAttributes, clientId }) => {
	const { uniqueId, blockName, template, accordionTitleTypography, postMetaTypography, excerptTypography } =
		attributes;

	useUniqueId(clientId, uniqueId, setAttributes);

	const { posts, queryData } = useApiData(attributes);

	//improvement: update queryData on save rather saving on every render
	useEffect(() => {
		if (attributes?.postQuery !== JSON.stringify(queryData)) {
			setAttributes({
				postQuery: JSON.stringify(queryData),
			});
		}
	}, [queryData]);

	const typographyList = [accordionTitleTypography, postMetaTypography, excerptTypography];

	useEffect(() => {
		setAttributes({ fontLists: fontFamilyToUrlGenerator(typographyList, "frontend") });
	}, [accordionTitleTypography, postMetaTypography, excerptTypography]);

	return (
		<div {...useBlockProps({ className: "sp-easy-accordion-block" })}>
			<style>{dynamicCss(attributes, "editor")}</style>
			<style>{fontFamilyToUrlGenerator(typographyList, "editor")}</style>
			<TogglePanelBodyProvider>
				<InspectorControl attributes={attributes} setAttributes={setAttributes} Inspector={SharedInspector} />

				{template ? (
					<Render attributes={attributes} setAttributes={setAttributes} posts={posts} />
				) : (
					<LayoutPreset blockName={blockName} setAttributes={setAttributes} />
				)}
			</TogglePanelBodyProvider>
		</div>
	);
};

export default PostAccordionEdit;
