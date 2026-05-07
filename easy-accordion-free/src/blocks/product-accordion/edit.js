import { __ } from "@wordpress/i18n";
import { useEffect, useRef } from "@wordpress/element";
import { useBlockProps } from "@wordpress/block-editor";
import { InspectorControl } from "@easy-accordion/components";
import SharedInspector from "../shared/inspector";
import dynamicCss from "../post-accordion/dynamicCss";
import Render from "./render";
import { TogglePanelBodyProvider } from "../../context";
import { LayoutPreset } from "@easy-accordion/templates";
import useApiData from "../../hooks/useApiData";
import { fontFamilyToUrlGenerator } from "@easy-accordion/controls";
import { useUniqueId } from "@easy-accordion/hooks";

const ProductAccordionEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		uniqueId,
		blockName,
		template,
		accordionTitleTypography,
		postMetaTypography,
		excerptTypography,
		priceTypography,
		addToCartTypography,
	} = attributes;

	useUniqueId(clientId, uniqueId, setAttributes);

	const { posts, queryData, postsStatus, message } = useApiData(attributes);

	//improvement: update queryData on save rather saving on every render
	useEffect(() => {
		if (attributes?.postQuery !== JSON.stringify(queryData)) {
			setAttributes({
				postQuery: JSON.stringify(queryData),
			});
		}
	}, [queryData]);

	const typographyList = [
		accordionTitleTypography,
		postMetaTypography,
		excerptTypography,
		priceTypography,
		addToCartTypography,
	];

	useEffect(() => {
		setAttributes({ fontLists: fontFamilyToUrlGenerator(typographyList, "frontend") });
	}, [accordionTitleTypography, postMetaTypography, excerptTypography, priceTypography, addToCartTypography]);

	return (
		<div {...useBlockProps({ className: "sp-easy-accordion-block" })}>
			<style>{dynamicCss(attributes, "editor")}</style>
			<style>{fontFamilyToUrlGenerator(typographyList, "editor")}</style>
			<TogglePanelBodyProvider>
				{postsStatus === false && message ? (
					<div className="eab-notice eab-notice--error">{message || "No produts found."}</div>
				) : (
					<>
						<InspectorControl
							attributes={attributes}
							setAttributes={setAttributes}
							Inspector={SharedInspector}
						/>

						{postsStatus === false && !posts?.length && (
							<div className="eab-notice eab-notice--warning">
								{__("No products found.", "easy-accordion-free")}
							</div>
						)}

						{template ? (
							<Render attributes={attributes} setAttributes={setAttributes} posts={posts} />
						) : (
							<LayoutPreset blockName={blockName} setAttributes={setAttributes} />
						)}
					</>
				)}
			</TogglePanelBodyProvider>
		</div>
	);
};

export default ProductAccordionEdit;
