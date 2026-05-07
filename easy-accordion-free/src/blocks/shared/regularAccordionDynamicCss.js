import {
	unit,
	inArray,
	boxShadowCss,
	cssDataCheck,
	filterResponsiveDynamicCss,
	spEabBackGroundControl,
	generateTypographyCss,
	generateTypoResponsive,
	generateBorderStyles,
	spEabBackgroundImageCss,
} from "@easy-accordion/controls";
import sharedDynamicCss from "./dynamicCss";

const responsiveCssFn = (attributes, deviceType = "Desktop") => {
	const {
		uniqueId,
		parentId,
		blockName,
		template,
		accordionTitlePadding,
		enableExpandAndCollapseIcon,
		toggleIconSize,
		toggleIconPadding,
		toggleIconMargin,
		accordionContentPadding,
		itemsWidth,
		itemsVerticalGap,
		itemsHeight,
		titleMinWidth,
		titleToContentGap,
	} = attributes;

	// max width selector.
	const isMultipleBlockEnabled = false;
	const maxWidthSelector = isMultipleBlockEnabled
		? `.sp-eab-parent-block:has(.${uniqueId}) :is(.sp-eab-faq-search-block, .sp-eab-toggle-all-block, .sp-eab-ajax-pagination-block, .${uniqueId})`
		: `.sp-easy-accordion-block>.${uniqueId}`;

	let responsiveCss = [
		// template css.
		{
			selector: maxWidthSelector,
			styles: {
				"max-width": cssDataCheck(itemsWidth.device[deviceType], unit(itemsWidth, deviceType)),
			},
		},
		{
			selector: `.${uniqueId}>.sp-eab-accordion>.block-editor-inner-blocks>.block-editor-block-list__layout`,
			styles: {
				gap: cssDataCheck(itemsVerticalGap.device[deviceType], unit(itemsVerticalGap, deviceType)),
			},
		},
		// accordion title css.
		{
			selector: `.eab-heading-${parentId} .${template === "vertical-six" ? "sp-eab-accordion-header-start" : "sp-eab-accordion-header-wrapper"}`,
			styles: {
				padding: cssDataCheck(
					accordionTitlePadding.device[deviceType],
					unit(accordionTitlePadding, deviceType)
				),
			},
		},
		{
			selector: `.eab-heading-${parentId} .sp-eab-accordion-title-text`,
			styles: {
				...generateTypoResponsive(attributes, deviceType, "accordionTitle"),
			},
		},
		// content css.
		{
			selector: `.eab-content-${parentId}>.${template === "vertical-three" ? "sp-eab-accordion-content-wrapper>.sp-eab-accordion-body" : "sp-eab-accordion-content-wrapper"}`,
			styles: {
				padding: cssDataCheck(
					accordionContentPadding.device[deviceType],
					unit(accordionContentPadding, deviceType)
				),
				...generateTypoResponsive(attributes, deviceType, "accordionContent"),
			},
		},
	];

	if (blockName === "horizontal-accordion") {
		responsiveCss = [
			...responsiveCss,
			{
				selector: `.eab-item-${parentId}`,
				styles: {
					height: cssDataCheck(itemsHeight.device[deviceType], unit(itemsHeight, deviceType)),
				},
			},
			{
				selector: `.eab-heading-${parentId}`,
				styles: {
					width: cssDataCheck(titleMinWidth.device[deviceType], unit(titleMinWidth, deviceType)),
				},
			},
		];
	}

	// toggle icon css.
	if (enableExpandAndCollapseIcon) {
		responsiveCss = [
			...responsiveCss,
			{
				selector: `.eab-heading-${parentId} .sp-eab-expand-collapse-icon`,
				styles: {
					"font-size": cssDataCheck(toggleIconSize.device[deviceType], unit(toggleIconSize, deviceType)),
					padding: cssDataCheck(toggleIconPadding.device[deviceType], unit(toggleIconPadding, deviceType)),
					margin: cssDataCheck(toggleIconMargin.device[deviceType], unit(toggleIconMargin, deviceType)),
				},
			},
		];
	}

	if ("sidebar-tab-accordion" === blockName) {
		responsiveCss = [
			...responsiveCss,
			{
				selector: `.${uniqueId}>.sp-eab-sidebar-tabs>.sp-eab-sidebar-tabs-nav-wrapper`,
				styles: {
					width: "40%",
				},
			},
			{
				selector: `.${uniqueId}>.sp-eab-sidebar-tabs>.sp-eab-sidebar-tabs-content`,
				styles: {
					width: `calc(100% - 40%)`,
				},
			},
			{
				selector: `.${uniqueId}>.sp-eab-sidebar-tabs`,
				styles: {
					gap: cssDataCheck(titleToContentGap.device[deviceType], unit(titleToContentGap, deviceType)),
				},
			},
			{
				selector: `.${uniqueId} .sp-eab-sidebar-tabs-nav`,
				styles: {
					gap: cssDataCheck(itemsVerticalGap.device[deviceType], unit(itemsVerticalGap, deviceType)),
				},
			},
		];
	}

	return responsiveCss;
};

const regularAccordionDynamicCss = (attributes) => {
	const { sharedDesktopCss, sharedTabletCss, sharedMobileCss } = sharedDynamicCss(attributes);
	const {
		uniqueId,
		parentId,
		template,
		enableExpandAndCollapseIcon,
		toggleIconColors,
		toggleIconBackground,
		accordionContentTypography,
		rotate90deg,
		toggleIconsSet,
		toggleIconBorder,
		toggleIconBorderWidth,
		toggleIconBorderRadius,
		contentAnimationEffect,
		contentTransitionTime,
		accordionTitleColors,
		accordionTitleBackground,
		accordionContentColor,
		accordionContentBackground,
		contentHeight,
		contentMaxHeight,
		// sidebar tab options.
		itemContentBorder,
		itemContentBorderWidth,
		itemContentBorderRadius,
		blockName,
		accordionTitleBorder,
		accordionTitleTypography,
		accordionTitleNormalBoxShadow,
		accordionTitleBorderWidth,
		accordionTitleBorderRadius,
	} = attributes;

	const isRegularAccordion = inArray(["vertical-accordion", "horizontal-accordion"], blockName);

	let desktopCss = [
		...sharedDesktopCss,
		...responsiveCssFn(attributes, "Desktop"),
		// title background css.
		{
			selector: `.${uniqueId}.sp-eab-wrapper .eab-heading-${parentId}`,
			styles: {
				color: accordionTitleColors,
				background: accordionTitleBackground,
				...generateTypographyCss(accordionTitleTypography),
			},
		},
		// content background css.
		{
			selector: `.${uniqueId}.sp-eab-wrapper .eab-content-${parentId}>.sp-eab-accordion-content-wrapper`,
			styles: {
				color: accordionContentColor,
				background: accordionContentBackground,
				...generateTypographyCss(accordionContentTypography),
				// ...spEabBackgroundImageCss(accordionContentBackground),
				// ...(contentHeight === "limit" && { height: `${contentMaxHeight?.value}${contentMaxHeight?.unit}` }),
			},
		},
		// content css.
		contentAnimationEffect !== "none" && {
			selector: `.eab-content-${parentId}>.sp-eab-accordion-content-wrapper`,
			styles: {
				"animation-duration": `${contentTransitionTime?.value || ""}${contentTransitionTime?.unit || ""}`,
			},
		},
	];
	// toggle icon css.
	if (enableExpandAndCollapseIcon) {
		desktopCss = [
			...desktopCss,
			{
				selector: `.eab-heading-${parentId} .sp-eab-expand-collapse-icon`,
				styles: {
					color: toggleIconColors,
					background: toggleIconBackground,
					"border-radius": cssDataCheck(toggleIconBorderRadius.value, unit(toggleIconBorderRadius)),
					...(rotate90deg &&
						inArray([1, 4, 5, 6, 9, 10, 12], toggleIconsSet.set) && {
							display: "block",
							transform: "rotate(-90deg)",
						}),
					...generateBorderStyles(toggleIconBorder, toggleIconBorderWidth),
				},
			},
		];
	}

	// block specific css.
	if (isRegularAccordion) {
		desktopCss = [
			...desktopCss,
			// accordion item border css.
			{
				selector: `.eab-item-${parentId}`,
				styles: {
					...generateBorderStyles(accordionTitleBorder, accordionTitleBorderWidth),
					"border-radius": cssDataCheck(accordionTitleBorderRadius.value, unit(accordionTitleBorderRadius)),
					"box-shadow": boxShadowCss(accordionTitleNormalBoxShadow),
				},
			},
		];
	}

	if (blockName === "sidebar-tab-accordion") {
		desktopCss = [
			...desktopCss,
			{
				selector: `.${uniqueId} .${template === "sidebar-tab-accordion-one" ? "sp-eab-sidebar-tabs-nav" : "sp-eab-accordion-heading"}`,
				styles: {
					...generateBorderStyles(accordionTitleBorder, accordionTitleBorderWidth),
					"border-radius": cssDataCheck(accordionTitleBorderRadius.value, accordionTitleBorderRadius?.unit),
					...(template === "sidebar-tab-accordion-one" && {
						"margin-right": `-${accordionTitleBorderWidth?.value?.right}${accordionTitleBorderWidth.unit}`,
						overflow: "hidden",
						"border-top-right-radius": 0,
						"border-bottom-right-radius": 0,
					}),
				},
			},
			{
				selector: `.${uniqueId} .sp-eab-sidebar-tabs-content`,
				styles: {
					...generateBorderStyles(itemContentBorder, itemContentBorderWidth),
					"border-radius": cssDataCheck(itemContentBorderRadius.value, itemContentBorderRadius?.unit),
					...(template === "sidebar-tab-accordion-one" && {
						"border-top-left-radius": 0,
					}),
				},
			},
		];
	}

	const tabletCss = [...sharedTabletCss, ...responsiveCssFn(attributes, "Tablet")];
	const mobileCss = [...sharedMobileCss, ...responsiveCssFn(attributes, "Mobile")];

	const cssObj = {
		desktopCss,
		tabletCss,
		mobileCss,
	};

	const css = filterResponsiveDynamicCss(cssObj);
	return css;
};

export default regularAccordionDynamicCss;
