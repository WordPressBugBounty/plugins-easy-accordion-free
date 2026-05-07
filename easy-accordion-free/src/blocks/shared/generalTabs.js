import { __ } from "@wordpress/i18n";
import {
	ButtonGroup,
	InputControl,
	SelectControl,
	ToggleControl,
	SPRangeControl,
	Border,
	Spacing,
	MediaPicker,
	Divider,
	PresetPicker,
	SpProNotice,
	LayoutsToggle,
} from "@easy-accordion/components";
import { inArray, stripScriptsAndSanitizeText } from "@easy-accordion/controls";
import { animationEffectOptions, layoutTemplateIcon, expandCollapseIconSets } from "@easy-accordion/constants";
import { useMetaData, useTogglePanelBody } from "@easy-accordion/hooks";
import { AlignCenter, AlignLeft, AlignRight } from "../../icons";
import { dispatch } from "@wordpress/data";

export const AccordionTemplateTabs = ({ attributes, setAttributes }) => {
	const {
		blockName,
		template,
		itemsWidth,
		itemsHeight,
		schemaMarkup,
		itemsExpandWidth,
		itemsVerticalGap,
		templateOrientation,
		titleMinWidth,
		preloader,
		titleToContentGap,
	} = attributes;

	const PRO_OPTIONS_MAP = {
		"vertical-accordion": [
			"4 Stunning Templates",
			"FAQ Search",
			"Toggle All Button",
			"Ajax Pagination",
			"Item Line Indicator Styling",
		],

		"horizontal-accordion": [
			"1 Stunning Template",
			"Control Expanded Area Width",
			"Control Collapse title Width",
			"FAQ Search",
		],

		"image-accordion": [
			"Horizontal Image Accordion",
			"3 Stunning Templates",
			"Control Expanded Area Width & Height",
		],

		"post-accordion": [
			"Horizontal Post Accordion",
			"3 Stunning Templates",
			"Meta Display Position",
			"FAQ Search",
			"Toggle All Button",
			"Ajax Pagination",
		],

		"product-accordion": ["3 Stunning Templates", "FAQ Search", "Toggle All Button", "Ajax Pagination"],

		"sidebar-tab-accordion": ["1 Stunning Templates", "Control Title Area Width"],
	};

	return (
		<>
			<LayoutsToggle
				attributes={template}
				displayActive={true}
				grid={2}
				setAttributes={setAttributes}
				attributesKey={"template"}
				items={layoutTemplateIcon[blockName]}
				preset={true}
				blockName={blockName}
			/>
			<SPRangeControl
				label={__("Item Gap", "easy-accordion-free")}
				attributes={itemsVerticalGap}
				attributesKey={"itemsVerticalGap"}
				setAttributes={setAttributes}
				max={200}
				units={["px", "em"]}
				defaultValue={{ unit: "px", value: 10 }}
			/>
			{blockName === "sidebar-tab-accordion" && (
				<>
					<SPRangeControl
						label={__("Title to Content Gap", "easy-accordion-free")}
						attributes={titleToContentGap}
						attributesKey={"titleToContentGap"}
						setAttributes={setAttributes}
						max={500}
						units={["px", "em"]}
						defaultValue={{
							value: template === "sidebar-tab-accordion-one" ? 0 : 12,
							unit: "px",
						}}
					/>
				</>
			)}
			<SPRangeControl
				label={
					inArray(["image-accordion", "horizontal-accordion", "accordion-slider"], blockName)
						? __("Width", "easy-accordion-free")
						: __("Max Width", "easy-accordion-free")
				}
				attributes={itemsWidth}
				attributesKey={"itemsWidth"}
				setAttributes={setAttributes}
				max={2000}
				min={200}
				units={["px"]}
				defaultValue={{ unit: "px", value: 900 }}
			/>
			{inArray(["accordion-slider", "horizontal-accordion"], blockName) && (
				<>
					<SPRangeControl
						label={__("Height", "easy-accordion-free")}
						attributes={itemsHeight}
						attributesKey={"itemsHeight"}
						setAttributes={setAttributes}
						max={2000}
						min={200}
						units={["px"]}
						defaultValue={{ unit: "px", value: "horizontal-accordion" === blockName ? 400 : 480 }}
					/>
				</>
			)}
			<ToggleControl
				label={__("FAQ Schema Markup", "easy-accordion-free")}
				attributes={schemaMarkup}
				attributesKey={"schemaMarkup"}
				setAttributes={setAttributes}
			/>
			<ToggleControl
				label={__("Preloader", "easy-accordion-free")}
				attributes={preloader}
				attributesKey={"preloader"}
				setAttributes={setAttributes}
			/>
			<SpProNotice
				subtitle={__("Unlock powerful options for your FAQs", "easy-accordion-free")}
				features={PRO_OPTIONS_MAP[blockName]}
				linkButton={true}
			/>
		</>
	);
};
export const AccordionInteractionsTabs = ({ attributes, setAttributes }) => {
	const {
		blockName,
		template,
		openMultiItemAtaTime,
		activeEvent,
		defaultAccordionOpen,
		scrollActiveItemTopOnToggle,
		accordionItemToUrl,
		scrollToActiveItem,
		openSelectedItem,
		accordionAutoplayDelayTime,
	} = attributes;

	let initialOpenOptions = [];
	switch (blockName) {
		case "vertical-accordion":
			initialOpenOptions = [
				{ label: "Open First Item", value: "first-item" },
				{ label: "Close All Items", value: "close-all" },
				{ label: "Open All Items", value: "open-all" },
			];
			break;
		case "horizontal-accordion":
		case "accordion-slider":
		case "sidebar-tab-accordion":
			initialOpenOptions = [
				{ label: "Open First Item", value: "first-item" },
				{ label: "Open Selected Items", value: "open-selected-item" },
			];
			break;
		case "image-accordion":
			initialOpenOptions = [
				{ label: "Open First Item", value: "first-item" },
				{ label: "Close All Items", value: "close-all" },
				{ label: "Open Selected Items", value: "open-selected-item" },
			];
			break;
		default:
			initialOpenOptions = [
				{ label: "Open First Item", value: "first-item" },
				{ label: "Close All Items", value: "close-all" },
				{ label: "Open All Items", value: "open-all" },
				{ label: "Open Selected Items", value: "open-selected-item" },
			];
			break;
	}
	if (blockName === "product-accordion" && template !== "product-accordion-one") {
		initialOpenOptions = [
			{ label: "Open First Item", value: "first-item" },
			{ label: "Open Selected Items", value: "open-selected-item" },
		];
	}

	const isSlider =
		inArray(["accordion-slider", "sidebar-tab-accordion"], blockName) ||
		(blockName === "product-accordion" && template !== "product-accordion-one");

	return (
		<>
			<ButtonGroup
				label={__("Activator Event", "easy-accordion-free")}
				attributes={activeEvent}
				items={
					!isSlider
						? [
								{ label: "On Click", value: "click" },
								{ label: "Hover", value: "hover" },
								{ label: "AutoPlay", value: "auto" },
							]
						: [
								{ label: "On Click", value: "click" },
								{ label: "Hover", value: "hover" },
							]
				}
				onClick={(val) => {
					setAttributes({ activeEvent: val });
				}}
			/>
			{activeEvent === "auto" ? (
				<SPRangeControl
					label={__("AutoPlay Delay", "easy-accordion-free")}
					attributes={accordionAutoplayDelayTime}
					attributesKey={"accordionAutoplayDelayTime"}
					setAttributes={setAttributes}
					units={["ms"]}
					max={20000}
					defaultValue={{ unit: "ms", value: 3000 }}
				/>
			) : (
				<SelectControl
					label={__("Initial Accordion Display", "easy-accordion-free")}
					items={initialOpenOptions}
					attributes={defaultAccordionOpen}
					onChange={(value) => {
						setAttributes({ defaultAccordionOpen: value });
						if (value === "open-all") {
							setAttributes({ openMultiItemAtaTime: true });
						}
					}}
				/>
			)}
			{defaultAccordionOpen === "open-selected-item" && (
				<InputControl
					label={__("Open Selected Item", "easy-accordion-free")}
					attributes={openSelectedItem}
					attributesKey={"openSelectedItem"}
					setAttributes={setAttributes}
					flex={false}
					inputType="number"
				/>
			)}
			{(blockName === "vertical-accordion" ||
				blockName === "post-accordion" ||
				blockName === "product-accordion") &&
				activeEvent !== "auto" &&
				defaultAccordionOpen !== "open-all" &&
				!isSlider && (
					<ToggleControl
						label={__("Multiple Open Together", "easy-accordion-free")}
						attributes={openMultiItemAtaTime}
						attributesKey={"openMultiItemAtaTime"}
						setAttributes={setAttributes}
					/>
				)}

			<ToggleControl
				label={__("Scroll to Opened Item on Load", "easy-accordion-free")}
				attributes={scrollToActiveItem}
				attributesKey={"scrollToActiveItem"}
				setAttributes={setAttributes}
			/>
			{!isSlider && activeEvent !== "auto" && (
				<>
					<ToggleControl
						label={__("Anchor Links for Item", "easy-accordion-free")}
						attributes={accordionItemToUrl}
						attributesKey={"accordionItemToUrl"}
						setAttributes={setAttributes}
						onlyPro={true}
					/>
				</>
			)}
			{blockName === "vertical-accordion" && (
				<ToggleControl
					label={__("Scroll Item to Top on Toggle", "easy-accordion-free")}
					attributes={scrollActiveItemTopOnToggle}
					attributesKey={"scrollActiveItemTopOnToggle"}
					setAttributes={setAttributes}
					onlyPro={true}
				/>
			)}
		</>
	);
};
export const ImageGeneralTabs = ({ attributes, setAttributes }) => {
	const { imageEffects, imageLightbox } = attributes;
	return (
		<>
			<SelectControl
				label={__("Image Effect", "easy-accordion-free")}
				items={[
					{ label: "None", value: "none" },
					{ label: "Zoom Out", value: "zoomOut" },
					{ label: "Zoom In", value: "zoomIn", pro: true },
					{ label: "GrayScale In", value: "GrayScaleIn", pro: true },
					{ label: "GrayScale Out", value: "GrayScaleOut", pro: true },
					{ label: "Blur In", value: "blurIn", pro: true },
					{ label: "Blur Out", value: "blurOut", pro: true },
				]}
				attributes={imageEffects}
				attributesKey={"imageEffects"}
				setAttributes={setAttributes}
			/>
			<ToggleControl
				label={__("Lightbox", "easy-accordion-free")}
				attributes={imageLightbox}
				attributesKey={"imageLightbox"}
				setAttributes={setAttributes}
				onlyPro={true}
			/>
			<SpProNotice
				subtitle={__("Unlock Advanced Lightbox Options for Image Accordion.", "easy-accordion-free")}
				features={[
					"Display Images in Lightbox",
					"15+ Lightbox Icon Styles",
					"Control Lightbox Icon Size & Position",
					"Stylize Icon Color, Border, & Background",
				]}
				linkButton={true}
			/>
		</>
	);
};
export const ImageContentGeneralTab = ({ attributes, setAttributes }) => {
	const {
		showContentIcon,
		showTitle,
		accordionTitleTag,
		showDescription,
		showReadMoreButton,
		contentAlignment,
		contentAnimationEffect,
		contentTransitionTime,
	} = attributes;

	return (
		<>
			<ToggleControl
				label={__("Title", "easy-accordion-free")}
				attributes={showTitle}
				attributesKey={"showTitle"}
				setAttributes={setAttributes}
			/>
			{showTitle && (
				<>
					<ButtonGroup
						label={__("HTML Tag", "easy-accordion-free")}
						items={[
							{ label: "H1", value: "h1" },
							{ label: "H2", value: "h2" },
							{ label: "H3", value: "h3" },
							{ label: "h4", value: "h4" },
							{ label: "H5", value: "h5" },
							{ label: "H6", value: "h6" },
							{ label: "Span", value: "span" },
						]}
						attributes={accordionTitleTag}
						attributesKey={"accordionTitleTag"}
						setAttributes={setAttributes}
					/>
					<Divider />
				</>
			)}
			<ToggleControl
				label={__("Description", "easy-accordion-free")}
				attributes={showDescription}
				attributesKey={"showDescription"}
				setAttributes={setAttributes}
			/>
			<ButtonGroup
				label={__("Content Alignment", "easy-accordion-free")}
				attributes={contentAlignment}
				attributesKey={"contentAlignment"}
				setAttributes={setAttributes}
				items={[
					{ label: <AlignLeft />, value: "left" },
					{ label: <AlignCenter />, value: "center" },
					{ label: <AlignRight />, value: "right" },
				]}
			/>
			<SelectControl
				label={__("Animation Effects", "easy-accordion-free")}
				items={animationEffectOptions}
				attributes={contentAnimationEffect}
				attributesKey={"contentAnimationEffect"}
				setAttributes={setAttributes}
				flexStyle={true}
			/>
			{contentAnimationEffect !== "none" && (
				<SPRangeControl
					label={__("Transition Time", "easy-accordion-free")}
					attributes={contentTransitionTime}
					attributesKey={"contentTransitionTime"}
					setAttributes={setAttributes}
					units={["ms"]}
					max={10000}
					defaultValue={{ unit: "ms", value: 1000 }}
				/>
			)}
			<ToggleControl
				label={__("Icon", "easy-accordion-free")}
				attributes={showContentIcon}
				attributesKey={"showContentIcon"}
				setAttributes={setAttributes}
				onlyPro={true}
			/>
			<ToggleControl
				label={__("Button", "easy-accordion-free")}
				attributes={showReadMoreButton}
				attributesKey={"showReadMoreButton"}
				setAttributes={setAttributes}
				onlyPro={true}
			/>

			<SpProNotice
				subtitle={__("Unlock Advanced Content Controls for Image Accordion", "easy-accordion-free")}
				features={[
					"Add or Upload Custom Icon",
					"Control Icon Size, Position, Gap",
					"Display Icon on Collapsed Item",
					"Add Button & Change Button Label",
					"Add Custom Button URL",
					"3 Content Position",
					"Stylize Button as per Your Need",
					"Stylize Icon Color, Size & Background",
				]}
				linkButton={true}
			/>
		</>
	);
};
export const VerticalContentGeneralTab = ({ attributes, setAttributes }) => {
	const {
		blockName,
		contentHeight,
		contentMaxHeight,
		contentAnimationEffect,
		contentTransitionTime,
		contentShowCloseButton,
	} = attributes;

	return (
		<>
			{blockName !== "horizontal-accordion" && (
				<ButtonGroup
					label={__("Content Height", "easy-accordion-free")}
					attributes={contentHeight}
					attributesKey={"contentHeight"}
					setAttributes={setAttributes}
					items={[
						{ label: "Auto", value: "auto" },
						{ label: "Limit", value: "limit", pro: true },
					]}
				/>
			)}
			<SelectControl
				label={__("Animation Effects", "easy-accordion-free")}
				items={animationEffectOptions}
				attributes={contentAnimationEffect}
				attributesKey={"contentAnimationEffect"}
				setAttributes={setAttributes}
				flexStyle={true}
			/>
			{contentAnimationEffect !== "none" && (
				<SPRangeControl
					label={__("Transition Time", "easy-accordion-free")}
					attributes={contentTransitionTime}
					attributesKey={"contentTransitionTime"}
					setAttributes={setAttributes}
					units={["ms"]}
					max={5000}
					defaultValue={{ unit: "ms", value: 1000 }}
				/>
			)}
			{blockName === "vertical-accordion" && (
				<>
					{/* <Divider /> */}
					<ToggleControl
						label={__("Close Button", "easy-accordion-free")}
						attributes={contentShowCloseButton}
						attributesKey={"contentShowCloseButton"}
						setAttributes={setAttributes}
						onlyPro={true}
					/>
				</>
			)}
		</>
	);
};
export const TitleGeneralTab = ({ attributes, setAttributes }) => {
	const {
		blockName,
		template,
		accordionTitleTag,
		showSubtitle,
		enableTitleFeaturedIcon,
		titleAlignment,
		linkPostTitle,
		postTitleLenght,
		postTitleLenghtNumber,
		showFeaturedImage,
		featuredImageSize,
		featuredImageWidth,
		featuredImageHeight,
	} = attributes;

	const { imageSizes } = useMetaData(attributes);

	const imageSizesOption = imageSizes
		? imageSizes?.map((size) => {
				return { label: size, value: size };
			})
		: [];

	const verticalAlignOptions = [
		{ label: <AlignLeft />, value: "left" },
		{ label: <AlignCenter />, value: "center" },
		{ label: <AlignRight />, value: "right" },
	];
	const horizontalAlignOptions = [
		{ label: "Top", value: "end" },
		{ label: "Center", value: "center" },
		{ label: "Bottom", value: "start" },
	];

	let titleAlignmentOptions = [];

	switch (blockName) {
		case "vertical-accordion":
			titleAlignmentOptions = verticalAlignOptions;
			break;
		case "horizontal-accordion":
			titleAlignmentOptions = horizontalAlignOptions;
			break;
		default:
			titleAlignmentOptions = verticalAlignOptions;
			break;
	}

	return (
		<>
			{template === "post-accordion-two" && (
				<>
					<ToggleControl
						label={__("Featured Image", "easy-accordion-free")}
						attributes={showFeaturedImage}
						attributesKey={"showFeaturedImage"}
						setAttributes={setAttributes}
					/>
					{showFeaturedImage && (
						<>
							<SelectControl
								label={__("Image Size", "easy-accordion-free")}
								attributes={featuredImageSize}
								attributesKey={"featuredImageSize"}
								setAttributes={setAttributes}
								items={[
									...imageSizesOption,
									{
										label: __("Custom Size", "easy-accordion-free"),
										value: "custom",
									},
								]}
							/>
							{"custom" === featuredImageSize && (
								<>
									<SPRangeControl
										label={__("Width", "easy-accordion-free")}
										attributes={featuredImageWidth}
										attributesKey={"featuredImageWidth"}
										setAttributes={setAttributes}
										units={["px", "%", "Em"]}
										defaultValue={{ unit: "%", value: 380 }}
										max={1200}
									/>
									<SPRangeControl
										label={__("Height", "easy-accordion-free")}
										attributes={featuredImageHeight}
										attributesKey={"featuredImageHeight"}
										setAttributes={setAttributes}
										units={["px", "%", "Em"]}
										defaultValue={{ unit: "px", value: 266 }}
										max={700}
									/>
								</>
							)}
							<Divider />
						</>
					)}
				</>
			)}
			<ButtonGroup
				label={__("HTML Tag", "easy-accordion-free")}
				attributes={accordionTitleTag}
				items={[
					{ label: "h1", value: "h1" },
					{ label: "h2", value: "h2" },
					{ label: "h3", value: "h3" },
					{ label: "h4", value: "h4" },
					{ label: "h5", value: "h5" },
					{ label: "h6", value: "h6" },
					{ label: "p", value: "p" },
					{ label: "span", value: "span" },
				]}
				attributesKey={"accordionTitleTag"}
				setAttributes={setAttributes}
			/>
			{!(blockName === "post-accordion" || blockName === "product-accordion") && (
				<>
					<ButtonGroup
						label={__("Alignment", "easy-accordion-free")}
						items={titleAlignmentOptions}
						attributes={titleAlignment}
						attributesKey={"titleAlignment"}
						setAttributes={setAttributes}
					/>
					<ToggleControl
						label={__("Subtitle", "easy-accordion-free")}
						attributes={showSubtitle}
						attributesKey={"showSubtitle"}
						setAttributes={setAttributes}
						onlyPro={true}
					/>
					{blockName !== "sidebar-tab-accordion" && (
						<ToggleControl
							label={__("Title Featured Icon", "easy-accordion-free")}
							attributes={enableTitleFeaturedIcon}
							attributesKey={"enableTitleFeaturedIcon"}
							setAttributes={setAttributes}
							onlyPro={true}
						/>
					)}
				</>
			)}
			{(blockName === "post-accordion" || blockName === "product-accordion") && (
				<>
					<ButtonGroup
						label={__("Title Length", "easy-accordion-free")}
						items={[
							{ label: "Full", value: "full" },
							{ label: "Limit", value: "limit", pro: true },
						]}
						attributes={postTitleLenght}
						attributesKey={"postTitleLenght"}
						setAttributes={setAttributes}
					/>
					<ToggleControl
						label={
							blockName === "post-accordion"
								? __("Link Post Title", "easy-accordion-free")
								: __("Link Product Title", "easy-accordion-free")
						}
						attributes={linkPostTitle}
						attributesKey={"linkPostTitle"}
						setAttributes={setAttributes}
						onlyPro={true}
					/>
				</>
			)}
		</>
	);
};

export const IconGeneralTab = ({ attributes, setAttributes }) => {
	const { blockName, toggleIconsSet, toggleIconPosition, rotate90deg, toggleIconSize, templateOrientation } =
		attributes;

	const verticalAlignItems = [
		{ label: "Start", value: "start" },
		{ label: "End", value: "end" },
	];
	const horizontalAlignItems = [
		{ label: "Top", value: "end" },
		{ label: "Bottom", value: "start" },
	];

	const iconPositionOptions = inArray(["vertical-accordion", "sidebar-tab-accordion", "post-accordion"], blockName)
		? verticalAlignItems
		: horizontalAlignItems;

	return (
		<>
			<PresetPicker
				label={__("Toggle Icon Style", "easy-accordion-free")}
				type="icon"
				items={expandCollapseIconSets}
				activeItem={toggleIconsSet}
				onSelect={(iconSet) => setAttributes({ toggleIconsSet: iconSet })}
			/>
			{inArray([1, 4, 5, 6, 9, 10, 12], toggleIconsSet.set) && (
				<ToggleControl
					label={__("Angle Right 90°", "easy-accordion-free")}
					attributes={rotate90deg}
					attributesKey={"rotate90deg"}
					setAttributes={setAttributes}
				/>
			)}
			<SPRangeControl
				label={__("Icon Size", "easy-accordion-free")}
				attributes={toggleIconSize}
				attributesKey={"toggleIconSize"}
				setAttributes={setAttributes}
				units={["px", "%", "em"]}
				defaultValue={{ unit: "px", value: 24 }}
			/>
			<ButtonGroup
				label={__("Icon Position", "easy-accordion-free")}
				items={iconPositionOptions}
				attributes={toggleIconPosition}
				attributesKey={"toggleIconPosition"}
				setAttributes={setAttributes}
			/>
		</>
	);
};
export const FeatureImageGeneralTab = ({ attributes, setAttributes }) => {
	const { imageSizes } = useMetaData(attributes);
	const {
		showThumbnailImage,
		thumbnailImageSize,
		thumbnailImageBorder,
		thumbnailImageBorderWidth,
		thumbnailImageBorderRadius,
		thumbnailImageWidth,
		thumbnailImageHeight,
	} = attributes;

	const imageSizesOption = imageSizes
		? imageSizes?.map((size) => {
				return { label: size, value: size };
			})
		: [];

	return (
		<>
			<ToggleControl
				label={__("Featured Image", "easy-accordion-free")}
				attributes={showThumbnailImage}
				attributesKey={"showThumbnailImage"}
				setAttributes={setAttributes}
			/>
			{showThumbnailImage && (
				<>
					<SelectControl
						label={__("Size", "easy-accordion-free")}
						items={[...imageSizesOption, { label: "Custom", value: "custom" }]}
						attributes={thumbnailImageSize}
						attributesKey={"thumbnailImageSize"}
						setAttributes={setAttributes}
					/>
					{thumbnailImageSize === "custom" && (
						<>
							<SPRangeControl
								label={__("Width", "easy-accordion-free")}
								attributes={thumbnailImageWidth}
								attributesKey={"thumbnailImageWidth"}
								setAttributes={setAttributes}
								units={["Px", "%", "Em"]}
								defaultValue={{ unit: "%", value: 100 }}
								max={1200}
							/>
							<SPRangeControl
								label={__("Height", "easy-accordion-free")}
								attributes={thumbnailImageHeight}
								attributesKey={"thumbnailImageHeight"}
								setAttributes={setAttributes}
								units={["Px", "%", "Em"]}
								defaultValue={{ unit: "%", value: 100 }}
								max={700}
							/>
						</>
					)}
					<Border
						attributes={{
							border: thumbnailImageBorder,
							borderWidth: thumbnailImageBorderWidth,
						}}
						attributesKey={{
							border: "thumbnailImageBorder",
							borderWidth: "thumbnailImageBorderWidth",
						}}
						setAttributes={setAttributes}
					/>
					<Spacing
						label={__("Border Radius", "easy-accordion-free")}
						attributes={thumbnailImageBorderRadius}
						attributesKey={"thumbnailImageBorderRadius"}
						setAttributes={setAttributes}
						radiusIndicators={true}
						units={["px", "%", "em"]}
						defaultValue={{
							unit: "px",
							value: {
								top: "0",
								right: "0",
								bottom: "0",
								left: "0",
							},
						}}
					/>
				</>
			)}
		</>
	);
};
export const SingleImageGeneralTab = ({ attributes, setAttributes }) => {
	const { clientId, singleImgData, singleImgDesc, singleImgTitle, singleImgFlipEnable } = attributes;

	const { togglePanelBody, toggleActiveTab } = useTogglePanelBody();

	const handleStyleTabClick = () => {
		const { getBlockParents } = wp.data.select("core/block-editor");
		const parents = getBlockParents(clientId);
		if (!parents?.length) {
			return;
		}
		const parentClientId = parents[parents?.length - 1];
		dispatch("core/block-editor").selectBlock(parentClientId);
		togglePanelBody("content");
		toggleActiveTab("style");
	};

	const singleItemTitle = () => {
		return (
			<span className="sp-d-flex sp-align-center sp-justify-between sp-cursor-pointer">
				{__("Image Title", "easy-accordion-free")}
				<span
					onClick={() => handleStyleTabClick()}
					title={__("Style", "easy-accordion-free")}
					className="dashicons dashicons-admin-generic sp-d-flex sp-align-center"
				></span>
			</span>
		);
	};

	return (
		<>
			<MediaPicker
				customClass="sp-eab-image-picker"
				imageKey="singleImgData"
				imgFocalPoint={false}
				label=""
				enableImageSize={false}
				setAttributes={setAttributes}
				backgroundImage={singleImgData}
				onSelect={(value) => setAttributes({ singleImgData: value })}
			/>
			<InputControl
				label={singleItemTitle()}
				placeholder={__("Add an image title", "easy-accordion-free")}
				flex={false}
				inputType="text"
				attributes={singleImgTitle}
				onChange={(value) => {
					const sanitizeValue = stripScriptsAndSanitizeText(value);
					setAttributes({ singleImgTitle: sanitizeValue });
				}}
			/>
			<InputControl
				label={__("Image Description", "easy-accordion-free")}
				placeholder={__("Add an image description", "easy-accordion-free")}
				flex={false}
				inputType="text"
				attributes={singleImgDesc}
				onChange={(value) => {
					const sanitizeValue = stripScriptsAndSanitizeText(value);
					setAttributes({ singleImgDesc: sanitizeValue });
				}}
			/>
			<ToggleControl
				label={__("Image Flip", "easy-accordion-free")}
				attributes={singleImgFlipEnable}
				attributesKey={"singleImgFlipEnable"}
				setAttributes={setAttributes}
				onlyPro={true}
			/>
			<SpProNotice
				message={__("Enable Image Flip, FocalPoint and Custom URL for Each Item.", "easy-accordion-free")}
				className="normal"
			/>
		</>
	);
};
