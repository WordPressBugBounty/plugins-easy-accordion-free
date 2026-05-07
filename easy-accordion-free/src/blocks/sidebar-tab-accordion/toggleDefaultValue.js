const toggleDefaultValue = (attributes) => {
	const { template, titleToContentGap, itemsVerticalGap } = attributes;

	const attr = {
		titleToContentGap: {
			...titleToContentGap,
			device: {
				...titleToContentGap.device,
				Desktop: "sidebar-tab-accordion-one" === template ? 0 : 12,
			},
		},
		itemsVerticalGap: {
			...itemsVerticalGap,
			device: {
				...itemsVerticalGap.device,
				Desktop: "sidebar-tab-accordion-one" === template ? 0 : 10,
			},
		},
		enableExpandAndCollapseIcon: "sidebar-tab-accordion-one" === template ? true : false,
	};
	return attr;
};
export default toggleDefaultValue;
