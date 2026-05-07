import { filterResponsiveDynamicCss } from "@easy-accordion/controls";

const dynamicCss = (attributes) => {
	const {
		uniqueId,
		parentId,
		accordionTitleColors,
		accordionTitleBorderColors,
		enableExpandAndCollapseIcon,
		accordionIconColors,
		accordionIconBorderColors,
		accordionContentColors,
		accordionTitleBackground,
		accordionIconBackground,
		accordionContentBackground,
	} = attributes;

	const desktopCss = [
		// heading css.
		{
			selector: `#${uniqueId} .eab-heading-${parentId}`,
			styles: {
				background: accordionTitleBackground,
			},
		},
		//accordion content css.
		{
			selector: `#${uniqueId} .eab-content-${parentId}>.sp-eab-accordion-content-wrapper`,
			styles: {
				color: accordionContentColors,
				background: accordionContentBackground,
			},
		},
		// wrapper css.
		{
			selector: `#${uniqueId}.sp-eab-accordion-item`,
			styles: {
				"border-color": accordionTitleBorderColors,
			},
		},
		// title css.
		{
			selector: `#${uniqueId} .eab-heading-${parentId} .sp-eab-accordion-title-text`,
			styles: {
				color: accordionTitleColors,
			},
		},
		// expand collapse icon css.
		...(enableExpandAndCollapseIcon
			? [
					{
						selector: `#${uniqueId} .eab-heading-${parentId} .sp-eab-expand-collapse-icon`,
						styles: {
							color: accordionIconColors,
							background: accordionIconBackground,
							"border-color": accordionIconBorderColors,
						},
					},
				]
			: []),
	];
	const tabletCss = [];
	const mobileCss = [];

	const cssObj = {
		desktopCss,
		tabletCss,
		mobileCss,
	};

	const css = filterResponsiveDynamicCss(cssObj);

	return css;
};

export default dynamicCss;
