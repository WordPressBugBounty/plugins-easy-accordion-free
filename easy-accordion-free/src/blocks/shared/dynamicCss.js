import {
	boxShadowCss,
	cssDataCheck,
	unit,
	spEabBackGroundControl,
	generateBorderStyles,
	spEabBackgroundImageCss,
	inArray,
	getVisibilityCss,
} from "@easy-accordion/controls";

const responsiveCss = (attributes, device = "Desktop") => {
	const { uniqueId, blockName, template, itemsExpandWidth, eabPadding, eabMargin } = attributes;

	const style = [
		{
			selector: `.${uniqueId} .${inArray(["vertical-accordion", "horizontal-accordion", "post-accordion", "product-accordion", "sidebar-tab-accordion"], blockName) ? `sp-eab-${template}` : "sp-eab-image-accordion-container"}`,
			styles: {
				padding: cssDataCheck(eabPadding?.device[device], unit(eabPadding, device)),
			},
		},
		{
			selector: `.${uniqueId}${inArray(["vertical-accordion", "horizontal-accordion", "sidebar-tab-accordion", "post-accordion", "product-accordion"], blockName) ? ` .sp-eab-${template}` : `.eab-${template}`}`,
			styles: {
				margin: cssDataCheck(eabMargin?.device[device], unit(eabMargin, device)),
			},
		},
		{
			selector: `.${uniqueId} .sp-eab-image-accordion-item.active`,
			styles: {
				"flex-basis": "50%",
			},
		},
	];
	return style;
};

const sharedDynamicCss = (attributes) => {
	const { uniqueId, blockName, template, eabBackground, eabBorder, eabBorderWidth, eabBorderRadius, eabBoxShadow } =
		attributes;

	const visibility = getVisibilityCss(attributes);

	let overlaySelector = "";
	let radiusSelector = "";
	if (eabBackground?.style === "image") {
		switch (blockName) {
			case "vertical-accordion":
			case "horizontal-accordion":
				overlaySelector = "sp-eab-accordion::after";
				break;
			case "image-accordion":
			case "accordion-slider":
				overlaySelector = "sp-eab-image-accordion-container::after";
				break;
			case "sidebar-tab-accordion":
				overlaySelector = "sp-eab-sidebar-tabs::after";
				break;
			default:
				overlaySelector = "sp-eab-accordion::after";
				break;
		}
		radiusSelector = overlaySelector;
	} else if (eabBackground?.style === "video") {
		overlaySelector = "sp-eab-video-player::after";
		radiusSelector = "sp-eab-video-player";
	}

	const sharedDesktopCss = [
		...visibility?.Desktop,
		...responsiveCss(attributes, "Desktop"),
		{
			selector: `.${uniqueId} .${inArray(["vertical-accordion", "horizontal-accordion", "post-accordion", "product-accordion", "sidebar-tab-accordion"], blockName) ? `sp-eab-${template}` : "sp-eab-image-accordion-container"}`,
			styles: {
				background: spEabBackGroundControl(eabBackground),
				...(eabBackground?.style === "image" && spEabBackgroundImageCss(eabBackground)),
				...generateBorderStyles(eabBorder, eabBorderWidth),
				"border-radius": cssDataCheck(eabBorderRadius.value, eabBorderRadius.unit),
				"box-shadow": boxShadowCss(eabBoxShadow),
			},
		},
		// bg overlay for image and video background.
		...(inArray(["image", "video"], eabBackground?.style)
			? [
					{
						selector: `.${uniqueId} .${overlaySelector}`,
						styles: {
							content: "''",
							"background-color": eabBackground?.bgOverlay,
						},
					},
					{
						selector: `.${uniqueId} .${radiusSelector}`,
						styles: {
							"border-radius": cssDataCheck(eabBorderRadius.value, eabBorderRadius.unit),
						},
					},
				]
			: []),
	];
	const sharedTabletCss = [...visibility?.Tablet, ...responsiveCss(attributes, "Tablet")];
	const sharedMobileCss = [...visibility?.Mobile, ...responsiveCss(attributes, "Mobile")];

	const cssObject = {
		sharedDesktopCss,
		sharedTabletCss,
		sharedMobileCss,
	};
	return cssObject;
};

export default sharedDynamicCss;
