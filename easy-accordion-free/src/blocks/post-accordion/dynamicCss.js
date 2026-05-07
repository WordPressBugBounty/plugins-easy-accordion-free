import {
	unit,
	inArray,
	boxShadowCss,
	cssDataCheck,
	filterResponsiveDynamicCss,
	generateTypographyCss,
	generateTypoResponsive,
	generateBorderStyles,
	hexToRgba,
} from "@easy-accordion/controls";
import sharedDynamicCss from "../shared/dynamicCss";

const responsiveCss = (attributes, device = "Desktop") => {
	const {
		uniqueId,
		blockName,
		itemsWidth,
		itemsVerticalGap,
		enableExpandAndCollapseIcon,
		toggleIconSize,
		toggleIconPadding,
		accordionTitlePadding,
		postMetaGap,
		postMetaMargin,
		contentPadding,
		toggleIconMargin,
		cartButtonPadding,
		metaDividerGap,
		imgToDescGap,
	} = attributes;

	// max width selector.
	const isMultipleBlockEnabled = false;
	const maxWidthSelector = isMultipleBlockEnabled
		? `.sp-eab-parent-block:has(.${uniqueId}) :is(.sp-eab-faq-search-block, .sp-eab-toggle-all-block, .sp-eab-ajax-pagination-block, .${uniqueId})`
		: `.${uniqueId}.sp-eab-wrapper`;

	const css = [
		{
			selector: maxWidthSelector,
			styles: {
				"max-width": cssDataCheck(itemsWidth?.device[device], unit(itemsWidth, device)),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-accordion`,
			styles: {
				gap: cssDataCheck(itemsVerticalGap?.device[device], unit(itemsVerticalGap, device)),
			},
		},
		{
			selector: `.${uniqueId}  .sp-eab-accordion-header-wrapper`,
			styles: {
				padding: cssDataCheck(accordionTitlePadding.device[device], unit(accordionTitlePadding, device)),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-accordion-title-wrapper`,
			styles: {
				...generateTypoResponsive(attributes, device, "accordionTitle"),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-accordion-body`,
			styles: {
				padding: cssDataCheck(contentPadding?.device[device], unit(contentPadding, device)),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-post-details`,
			styles: {
				gap: cssDataCheck(postMetaGap?.device[device], unit(postMetaGap, device)),
				margin: cssDataCheck(postMetaMargin?.device[device], unit(postMetaMargin, device)),
				...generateTypoResponsive(attributes, device, "postMeta"),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-post-excerpt`,
			styles: {
				...generateTypoResponsive(attributes, device, "excerpt"),
			},
		},
		// toggle icon css.
		...(enableExpandAndCollapseIcon
			? [
					{
						selector: `.${uniqueId} .sp-eab-expand-collapse-icon`,
						styles: {
							"font-size": cssDataCheck(toggleIconSize.device[device], unit(toggleIconSize, device)),
							padding: cssDataCheck(toggleIconPadding.device[device], unit(toggleIconPadding, device)),
						},
					},
				]
			: []),
		// toggle icon css.
		...(enableExpandAndCollapseIcon
			? [
					{
						selector: `.${uniqueId} .sp-eab-expand-collapse-icon`,
						styles: {
							"font-size": cssDataCheck(toggleIconSize.device[device], unit(toggleIconSize, device)),
							padding: cssDataCheck(toggleIconPadding.device[device], unit(toggleIconPadding, device)),
							margin: cssDataCheck(toggleIconMargin.device[device], unit(toggleIconMargin, device)),
						},
					},
				]
			: []),

		...(blockName === "product-accordion"
			? [
					{
						selector: `.${uniqueId} .sp-eab-accordion-title-wrapper`,
						styles: {
							...generateTypoResponsive(attributes, device, "accordionTitle"),
						},
					},
					{
						selector: `.${uniqueId} .sp-eab-accordion-body`,
						styles: {
							gap: cssDataCheck(imgToDescGap.device[device], unit(imgToDescGap, device)),
						},
					},
					{
						selector: `.${uniqueId} .eab-product-price .woocommerce-Price-amount`,
						styles: {
							...generateTypoResponsive(attributes, device, "price"),
						},
					},
					{
						selector: `.${uniqueId} .eab-add-to-cart`,
						styles: {
							...generateTypoResponsive(attributes, device, "addToCart"),
							padding: cssDataCheck(cartButtonPadding.device[device], unit(cartButtonPadding, device)),
						},
					},
					{
						selector: `.${uniqueId} .single_add_to_cart_button`,
						styles: {
							...generateTypoResponsive(attributes, device, "addToCart"),
							padding: cssDataCheck(cartButtonPadding.device[device], unit(cartButtonPadding, device)),
						},
					},
					{
						selector: `.${uniqueId} .eab-meta-divider`,
						styles: {
							margin: `${cssDataCheck(metaDividerGap.device[device], unit(metaDividerGap, device))} auto`,
						},
					},
				]
			: []),
	];
	return css;
};

const titleDynamicCss = (attributes) => {
	const {
		uniqueId,
		template,
		accordionTitleBorder,
		accordionTitleTypography,
		accordionTitleNormalBoxShadow,
		accordionTitleBorderWidth,
		accordionTitleBorderRadius,
		accordionTitleColors,
		accordionTitleBackground,
	} = attributes;

	const css = [
		// accordion item as title.
		{
			selector: `.${uniqueId} .sp-eab-accordion-item`,
			styles: {
				...generateBorderStyles(accordionTitleBorder, accordionTitleBorderWidth),
				"border-radius": cssDataCheck(accordionTitleBorderRadius.value, unit(accordionTitleBorderRadius)),
				"box-shadow": boxShadowCss(accordionTitleNormalBoxShadow),
			},
		},
		// accordion heading.
		{
			selector: `.${uniqueId} .sp-eab-accordion-title-wrapper`,
			styles: {
				...generateTypographyCss(accordionTitleTypography),
			},
		},
		// title background css.
		{
			selector: `.${uniqueId}.sp-eab-wrapper .sp-eab-accordion-heading`,
			styles: {
				color: accordionTitleColors,
				background: accordionTitleBackground,
			},
		},
	];
	return css;
};

const dynamicCss = (attributes) => {
	const { sharedDesktopCss, sharedTabletCss, sharedMobileCss } = sharedDynamicCss(attributes);

	const {
		uniqueId,
		template,
		blockName,
		postMetaColor,
		excerptColor,
		postMetaTypography,
		excerptTypography,
		ContentBackground,
		animationTransitionDuration,
		animationEffect,
		enableExpandAndCollapseIcon,
		toggleIconColors,
		toggleIconBackground,
		toggleIconBorderRadius,
		rotate90deg,
		toggleIconsSet,
		toggleIconBorder,
		toggleIconBorderWidth,
		priceTypography,
		priceColor,
		addToCartTypography,
		cartButtonColors,
		cartButtonBgColors,
		cartButtonBorder,
		cartButtonBorderWidth,
		cartButtonBorderRadius,
		metaDividerColor,
	} = attributes;

	const desktopCss = [
		...responsiveCss(attributes, "Desktop"),
		...sharedDesktopCss,
		...(template !== "product-accordion-two" ? titleDynamicCss(attributes) : []),

		{
			selector: `.${uniqueId} div:is(.sp-eab-accordion-body,.sp-eab-product-content-wrapper)`,
			styles: {
				background: ContentBackground,
			},
		},

		{
			selector: `.${uniqueId} .sp-eab-post-details`,
			styles: {
				color: postMetaColor,
				...generateTypographyCss(postMetaTypography),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-post-excerpt`,
			styles: {
				color: excerptColor,
				...generateTypographyCss(excerptTypography),
			},
		},
		// content css.
		animationEffect !== "none" && {
			selector: `.${uniqueId} div:is(.eab-product-slider-content,.sp-eab-accordion-content-wrapper)`,
			styles: {
				"animation-duration": `${animationTransitionDuration?.value || ""}${animationTransitionDuration?.unit || ""}`,
			},
		},
		// toggle icon css.
		...(enableExpandAndCollapseIcon
			? [
					{
						selector: `.${uniqueId} .sp-eab-expand-collapse-icon`,
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
				]
			: []),
		...(blockName === "product-accordion"
			? [
					{
						selector: `.${uniqueId} .eab-product-price .woocommerce-Price-amount`,
						styles: {
							color: priceColor,
							...generateTypographyCss(priceTypography),
						},
					},
					{
						selector: `.${uniqueId} .eab-review-text`,
						styles: {
							color: excerptColor,
							...generateTypographyCss(excerptTypography),
						},
					},
					{
						selector: `.${uniqueId} .eab-product-price del .woocommerce-Price-amount`,
						styles: {
							color: hexToRgba(priceColor, 0.5),
						},
					},
					{
						selector: `.${uniqueId} .eab-product-price del`,
						styles: {
							color: hexToRgba(priceColor, 0.5),
						},
					},
					{
						selector: `.${uniqueId} .eab-add-to-cart`,
						styles: {
							color: cartButtonColors.color,
							background: cartButtonBgColors.color,
							...generateBorderStyles(cartButtonBorder, cartButtonBorderWidth),
							"border-radius": cssDataCheck(cartButtonBorderRadius.value, cartButtonBorderRadius.unit),
							...generateTypographyCss(addToCartTypography),
						},
					},
					{
						selector: `.${uniqueId} .single_add_to_cart_button`,
						styles: {
							color: cartButtonColors.color,
							background: cartButtonBgColors.color,
							...generateBorderStyles(cartButtonBorder, cartButtonBorderWidth),
							"border-radius": cssDataCheck(cartButtonBorderRadius.value, cartButtonBorderRadius.unit),
							...generateTypographyCss(addToCartTypography),
						},
					},
					{
						selector: `.${uniqueId} .eab-add-to-cart:hover`,
						styles: {
							color: cartButtonColors.hoverColor,
							background: cartButtonBgColors.hoverColor,
						},
					},
					{
						selector: `.${uniqueId} .single_add_to_cart_button:hover`,
						styles: {
							color: cartButtonColors.hoverColor,
							background: cartButtonBgColors.hoverColor,
						},
					},
					{
						selector: `.${uniqueId} .eab-meta-divider`,
						styles: {
							"border-top-color": metaDividerColor,
						},
					},
				]
			: []),
	];
	const tabletCss = [...responsiveCss(attributes, "Tablet"), ...sharedTabletCss];
	const mobileCss = [...responsiveCss(attributes, "Mobile"), ...sharedMobileCss];

	const cssObj = {
		desktopCss,
		tabletCss,
		mobileCss,
	};

	const css = filterResponsiveDynamicCss(cssObj);
	return css;
};

export default dynamicCss;
