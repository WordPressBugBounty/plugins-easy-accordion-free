import {
	cssDataCheck,
	filterResponsiveDynamicCss,
	generateTypographyCss,
	generateTypoResponsive,
	unit,
} from "@easy-accordion/controls";
import sharedDynamicCss from "../shared/dynamicCss";

const responsiveCss = (attributes, device = "Desktop") => {
	const { uniqueId, itemsWidth, itemsVerticalGap, itemsHeight, contentPadding } = attributes;

	const css = [
		{
			selector: `.${uniqueId} .sp-eab-block-appender`,
			styles: {
				"max-width": cssDataCheck(itemsWidth?.device[device], unit(itemsWidth, device)),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-image-accordion-container`,
			styles: {
				"max-width": cssDataCheck(itemsWidth?.device[device], unit(itemsWidth, device)),
				height: cssDataCheck(itemsHeight?.device[device], unit(itemsHeight, device)),
			},
		},
		{
			selector: `.${uniqueId} .block-editor-block-list__layout`,
			styles: {
				gap: cssDataCheck(itemsVerticalGap?.device[device], unit(itemsVerticalGap, device)),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-image-accordion-item .sp-eab-image-title`,
			styles: {
				...generateTypoResponsive(attributes, device, "accordionTitle"),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-image-accordion-item .sp-eab-overlay`,
			styles: {
				padding: cssDataCheck(contentPadding?.device[device], unit(contentPadding, device)),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-image-accordion-item .sp-eab-image-desc`,
			styles: {
				...generateTypoResponsive(attributes, device, "description"),
			},
		},
	];
	return css;
};

const dynamicCss = (attributes) => {
	const { sharedDesktopCss, sharedTabletCss, sharedMobileCss } = sharedDynamicCss(attributes);

	const {
		uniqueId,
		accordionTitleTypography,
		accordionTitleColors,
		descriptionTypography,
		descriptionColor,
		imgBorderRadius,
		imgBorder,
		imgBorderWidth,
		imgOverlayColor,
		contentTransitionTime,
	} = attributes;

	const overlaySelector = `.${uniqueId} .sp-eab-image-accordion-item`;

	const overlayStyles = [
		{
			selector: `${overlaySelector}:not(.active) .sp-eab-accordion-bg .sp-eab-overlay`,
			styles: {
				background: imgOverlayColor,
			},
		},
		{
			selector: `${overlaySelector}:is(.active) .sp-eab-accordion-bg .sp-eab-overlay`,
			styles: {
				background: imgOverlayColor,
			},
		},
		{
			selector: `${overlaySelector}:not(.active):hover .sp-eab-accordion-bg .sp-eab-overlay`,
			styles: {
				background: imgOverlayColor,
			},
		},
	];

	const desktopCss = [
		...responsiveCss(attributes, "Desktop"),
		...sharedDesktopCss,
		{
			selector: `.${uniqueId} .sp-eab-image-accordion-item .sp-eab-accordion-bg`,
			styles: {
				"border-style": imgBorder?.style,
				"border-color": imgBorder?.color,
				"border-width": cssDataCheck(imgBorderWidth.value, imgBorderWidth.unit),
				"border-radius": cssDataCheck(imgBorderRadius.value, imgBorderRadius.unit),
			},
		},
		...overlayStyles,
		{
			selector: `.${uniqueId} .sp-eab-image-accordion-item .sp-eab-image-title`,
			styles: {
				color: accordionTitleColors,
				...generateTypographyCss(accordionTitleTypography),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-image-accordion-item .sp-eab-image-desc`,
			styles: {
				color: descriptionColor,
				...generateTypographyCss(descriptionTypography),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-accordion-bg .animated `,
			styles: {
				"animation-duration": `${contentTransitionTime?.value}ms`,
			},
		},
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
