import { __ } from "@wordpress/i18n";
import { PanelBody } from "@wordpress/components";
import { TabControls, ToggleControl, SpProNotice } from "@easy-accordion/components";
import {
	AccordionInteractionsTabs,
	AccordionTemplateTabs,
	ImageContentGeneralTab,
	IconGeneralTab,
	ImageGeneralTabs,
	TitleGeneralTab,
	VerticalContentGeneralTab,
} from "./generalTabs";
import {
	ImageContentStyleTab,
	IconStyleTab,
	ImageStyleTab,
	TitleStyleTab,
	VerticalContentStyleTab,
	PostMetaStyleTab,
	PostContentStyleTab,
} from "./styleTabs";
import { AdvancedGeneralTab, AdvancedTab, VisibilityTab } from "../shared/advancedTab";
import { inArray } from "@easy-accordion/controls";
import { useTogglePanelBody } from "../../context";
import {
	PostContentGeneralTab,
	PostMetaDataGeneralTab,
	ProductContentGeneralTab,
	QueryBuilderGeneralTab,
} from "../post-accordion/generalTab";

const SharedInspector = ({ attributes, setAttributes }) => {
	const { blockName, template, enableExpandAndCollapseIcon } = attributes;
	const { togglePanelBody, openedPanelBody, activeTab, toggleActiveTab } = useTogglePanelBody();

	const checkOpenedPanelBody = (accordionName) => {
		return openedPanelBody === accordionName ? true : false;
	};

	const TITLE_LABELS = {
		"post-accordion": __("Post Title", "easy-accordion-free"),
		"product-accordion": __("Product Title", "easy-accordion-free"),
	};
	const CONTENT_LABELS = {
		"post-accordion": __("Post Content", "easy-accordion-free"),
		"product-accordion": __("Product Content", "easy-accordion-free"),
	};

	const title = TITLE_LABELS[blockName] || __("Title", "easy-accordion-free");
	const contentLabel = CONTENT_LABELS[blockName] || __("Content", "easy-accordion-free");

	return (
		<>
			<PanelBody
				title={__("Accordion Templates", "easy-accordion-free")}
				opened={checkOpenedPanelBody("defaultOpen")}
				onToggle={() => togglePanelBody("defaultOpen")}
				initialOpen={true}
			>
				<AccordionTemplateTabs attributes={attributes} setAttributes={setAttributes} />
			</PanelBody>
			{(blockName === "post-accordion" || blockName === "product-accordion") && (
				<>
					<PanelBody
						title={__("Query Builder", "easy-accordion-free")}
						opened={checkOpenedPanelBody("query-builder")}
						onToggle={() => togglePanelBody("query-builder")}
						initialOpen={true}
					>
						{checkOpenedPanelBody("query-builder") && (
							<QueryBuilderGeneralTab attributes={attributes} setAttributes={setAttributes} />
						)}
					</PanelBody>

					<PanelBody
						title={__("Taxonomy Filter", "easy-accordion-free")}
						opened={checkOpenedPanelBody("taxonomy-filter")}
						onToggle={() => togglePanelBody("taxonomy-filter")}
						className="sp-panel-pro"
					>
						{checkOpenedPanelBody("taxonomy-filter") && (
							<SpProNotice
								subtitle={__(
									"Unlock Powerful Taxonomy Filter options for your FAQs",
									"easy-accordion-free"
								)}
								features={[
									"List and Button Filter Style",
									"Choose Taxonomies to Filter",
									"Top, Left, Right Button Position",
									"Control Button Area Width",
									"Full Control Over Filter Styling",
								]}
								linkButton={true}
							/>
						)}
					</PanelBody>
				</>
			)}
			<PanelBody
				title={__("Accordion Interactions", "easy-accordion-free")}
				opened={checkOpenedPanelBody("general")}
				onToggle={() => togglePanelBody("general")}
			>
				<AccordionInteractionsTabs attributes={attributes} setAttributes={setAttributes} />
			</PanelBody>
			{(blockName === "image-accordion" || blockName === "accordion-slider") && (
				<>
					<PanelBody
						title={__("Image", "easy-accordion-free")}
						opened={checkOpenedPanelBody("image")}
						onToggle={() => togglePanelBody("image")}
					>
						<TabControls
							attributes={attributes}
							setAttributes={setAttributes}
							GeneralTab={ImageGeneralTabs}
							StyleTab={ImageStyleTab}
							tabName={activeTab}
							setTabName={toggleActiveTab}
						/>
					</PanelBody>
				</>
			)}
			{inArray(
				[
					"vertical-accordion",
					"horizontal-accordion",
					"post-accordion",
					"sidebar-tab-accordion",
					"product-accordion",
				],
				blockName
			) &&
				template !== "product-accordion-two" && (
					<>
						<PanelBody
							title={__("Toggle Icon", "easy-accordion-free")}
							opened={checkOpenedPanelBody("icon")}
							onToggle={() => togglePanelBody("icon")}
						>
							<ToggleControl
								label={__("Toggle Icon", "easy-accordion-free")}
								attributes={enableExpandAndCollapseIcon}
								attributesKey={"enableExpandAndCollapseIcon"}
								setAttributes={setAttributes}
							/>
							{enableExpandAndCollapseIcon && checkOpenedPanelBody("icon") && (
								<TabControls
									attributes={attributes}
									setAttributes={setAttributes}
									GeneralTab={IconGeneralTab}
									StyleTab={IconStyleTab}
									tabName={activeTab}
									setTabName={toggleActiveTab}
								/>
							)}
						</PanelBody>
						<PanelBody
							title={title}
							opened={checkOpenedPanelBody("title")}
							onToggle={() => togglePanelBody("title")}
						>
							{checkOpenedPanelBody("title") && (
								<TabControls
									attributes={attributes}
									setAttributes={setAttributes}
									GeneralTab={TitleGeneralTab}
									StyleTab={TitleStyleTab}
									tabName={activeTab}
									setTabName={toggleActiveTab}
								/>
							)}
						</PanelBody>
					</>
				)}
			{(blockName === "post-accordion" || blockName === "product-accordion") && (
				<PanelBody
					title={
						blockName === "product-accordion"
							? __("Product Meta", "easy-accordion-free")
							: __("Post Meta", "easy-accordion-free")
					}
					opened={checkOpenedPanelBody("post-meta")}
					onToggle={() => togglePanelBody("post-meta")}
					className={blockName === "product-accordion" ? "sp-panel-pro" : ""}
				>
					{blockName === "post-accordion" && checkOpenedPanelBody("post-meta") && (
						<TabControls
							attributes={attributes}
							setAttributes={setAttributes}
							GeneralTab={PostMetaDataGeneralTab}
							StyleTab={PostMetaStyleTab}
							tabName={activeTab}
							setTabName={toggleActiveTab}
						/>
					)}
					{blockName === "product-accordion" && checkOpenedPanelBody("post-meta") && (
						<SpProNotice
							subtitle={__(
								"Unlock advanced product details with smart meta options",
								"easy-accordion-free"
							)}
							features={["Show Category", "Product SKU", "Add Meta Divider & Divider Gap"]}
							linkButton={true}
						/>
					)}
				</PanelBody>
			)}
			<PanelBody
				title={contentLabel}
				opened={checkOpenedPanelBody("content")}
				onToggle={() => togglePanelBody("content")}
			>
				{(blockName === "image-accordion" || blockName === "accordion-slider") && (
					<TabControls
						attributes={attributes}
						setAttributes={setAttributes}
						GeneralTab={ImageContentGeneralTab}
						StyleTab={ImageContentStyleTab}
						tabName={activeTab}
						setTabName={toggleActiveTab}
					/>
				)}
				{blockName === "post-accordion" && (
					<TabControls
						attributes={attributes}
						setAttributes={setAttributes}
						GeneralTab={PostContentGeneralTab}
						StyleTab={PostContentStyleTab}
						tabName={activeTab}
						setTabName={toggleActiveTab}
					/>
				)}
				{blockName === "product-accordion" && (
					<TabControls
						attributes={attributes}
						setAttributes={setAttributes}
						GeneralTab={ProductContentGeneralTab}
						StyleTab={PostContentStyleTab}
						tabName={activeTab}
						setTabName={toggleActiveTab}
					/>
				)}
				{inArray(["vertical-accordion", "horizontal-accordion", "sidebar-tab-accordion"], blockName) && (
					<TabControls
						attributes={attributes}
						setAttributes={setAttributes}
						GeneralTab={VerticalContentGeneralTab}
						StyleTab={VerticalContentStyleTab}
						tabName={activeTab}
						setTabName={toggleActiveTab}
					/>
				)}
			</PanelBody>
			<PanelBody
				title={__("Motion Effects", "easy-accordion-free")}
				opened={checkOpenedPanelBody("motion-effect")}
				onToggle={() => togglePanelBody("motion-effect")}
				className="sp-panel-pro"
			>
				{checkOpenedPanelBody("motion-effect") && (
					<SpProNotice
						subtitle={__("Unlock Pro-level motion effects for your FAQs section", "easy-accordion-free")}
						features={[
							"Modern Scrolling Effect",
							"Sticky (Top, Bottom)",
							"25+ Entrance Animation",
							"Animation Delay and More...",
						]}
						linkButton={true}
					/>
				)}
			</PanelBody>
			<PanelBody
				title={__("Advanced", "easy-accordion-free")}
				opened={checkOpenedPanelBody("advanced")}
				onToggle={() => togglePanelBody("advanced")}
			>
				{checkOpenedPanelBody("advanced") && (
					<TabControls
						attributes={attributes}
						setAttributes={setAttributes}
						displayIcon={false}
						GeneralTab={AdvancedGeneralTab}
						VisibilityTab={VisibilityTab}
						AdvancedTab={AdvancedTab}
						tabName={activeTab}
						setTabName={toggleActiveTab}
					/>
				)}
			</PanelBody>
			<SpProNotice
				title={__("Design Without Limits", "easy-accordion-free")}
				subtitle={__("Unlock custom linking for your FAQs", "easy-accordion-free")}
				message={__(
					"Give your design a boost with premium templates & advanced features.",
					"easy-accordion-free"
				)}
				panelNotice={true}
				className="sp-inspector-pro-notice"
			/>
		</>
	);
};

export default SharedInspector;
