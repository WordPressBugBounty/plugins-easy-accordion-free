import axios from "axios";
import { useSelect } from "@wordpress/data";
import { defaultDashboardSettings } from "@easy-accordion/constants";

// Device type fn.
export const useDeviceType = () => {
	const { deviceType } = useSelect((select) => {
		return {
			deviceType: select("core/editor")?.getDeviceType() || "Desktop",
		};
	}, []);

	return deviceType || "";
};

export const getRandomId = (prefix = "") => {
	const randomNumber = Math.floor(10000000 + Math.random() * 90000000);
	const randomId = `${prefix}${randomNumber}`;
	return randomId;
};

export const inArray = (array, value) => {
	return array.includes(value);
};

export const jsonStringify = (data) => {
	return JSON.stringify(data);
};

export const jsonParse = (data) => {
	return JSON.parse(data);
};

export const queryFn = async (data) => {
	const response = await axios.post(sp_eab_localize_data.ajaxUrl, data, {
		headers: {
			"Content-Type": "multipart/form-data",
		},
	});
	return response.data;
};

export const cleanSchemaString = (string) => {
	if (!string) {
		return "";
	}
	return string
		.replace(/<\/?[^>]+(>|$)/g, "")
		.replace(/\s+/g, " ")
		.replace(/"/g, '\\"')
		.trim();
};

export const documentFinder = () => {
	const iframe = document.getElementsByTagName("iframe");
	let iframeDoc = iframe[0]?.contentWindow.document;
	iframeDoc = iframeDoc ? iframeDoc : document;
	return iframeDoc;
};

export const toUrlFormat = (str) => {
	return str.toLowerCase().replace(/[\s.]+/g, "-");
};

// Generate box shadow css.
export const boxShadowCss = (shadow = {}) => {
	if (!shadow?.isActive) {
		return "";
	}
	const { value, unit, color } = shadow;
	const shadowCss =
		`${unit === "inset" ? "inset " : ""}${value.top}px ${value.right}px ${value.bottom}px ${value.left}px ${color}`.trim();
	return shadowCss || "";
};

// Background controls fn.
export const spEabBackGroundControl = (backgroundAttr) => {
	const { style, solid, gradient, image } = backgroundAttr;
	const bgOptions = {
		transparent: "transparent",
		solid,
		gradient,
		image: image?.url ? `url(${image?.url})` : "",
	};
	return bgOptions[style];
};

export const spEabBackgroundImageCss = (attr) => {
	const style = attr?.style || "";
	const bgImg = attr?.imageSettings || {};

	if (style === "image") {
		return {
			"background-position": bgImg.bgImagePosition || "",
			"background-attachment": bgImg.bgImageAttachment || "",
			"background-repeat": bgImg.bgImageRepeat || "",
			"background-size": bgImg.bgImageSize || "",
		};
	}

	return {};
};

// Optimized CSS data check.
export const cssDataCheck = (value, unit = "", devided = "") => {
	if (!value) {
		return "";
	}
	if (typeof value === "object") {
		const filtered = Object.values(value).filter(
			(val) => val !== null && val !== undefined && val.toString().trim().length > 0
		);

		// if nothing left, return empty string
		if (filtered.length === 0) {
			return "";
		}

		return filtered.map((val) => `${devided > 1 ? val / devided : val}${unit}`).join(" ");
	}
	return value.toString().trim().length > 0 ? `${devided > 1 ? value / devided : value}${unit}` : "";
};

// Check unit single or object.
export const unit = (attributes, deviceType) => {
	if ("object" !== typeof attributes.unit) {
		return attributes.unit;
	}
	return attributes.unit[deviceType];
};

// Object to css convert fn.
export const cssString = (css) => {
	let result = "";
	for (const selector in css) {
		let cssProps = "";
		for (const property in css[selector]) {
			if (css[selector][property] && css[selector][property].length > 0) {
				cssProps += property + ":" + css[selector][property] + ";";
			}
		}
		result += "" !== cssProps ? selector + "{" + cssProps + "}" : "";
	}
	return result;
};

// dynamic css utils.
export const objectToCssString = (dynamicCss) => {
	let css = "";
	dynamicCss?.forEach((item) => {
		if (item.styles) {
			let styles = "";
			Object.entries(item.styles).forEach(([property, value]) => {
				if (value !== null && value !== undefined && value !== "") {
					styles += `${property}: ${value};`;
				}
			});
			if (styles) {
				css += `${item.selector} {${styles}}`;
			}
		}
	});
	return css;
};

export const generateTypographyCss = (typography) => {
	const { family, fontWeight, style, transform, decoration } = typography;
	const styles = {
		...(family && { "font-family": family }),
		...(fontWeight && { "font-weight": fontWeight }),
		...(style && style !== "normal" && { "font-style": style }),
		...(transform !== "none" && { "text-transform": transform }),
		...(decoration !== "none" && { "text-decoration": decoration }),
	};
	return styles;
};

export const generateTypoResponsive = (attributes, device, key) => {
	const fontSize = attributes[`${key}FontSize`].device[device];
	const lineHeight = attributes[`${key}LineHeight`].device[device];
	let letterSpacing = attributes[`${key}LetterSpacing`]?.device?.[device];

	if (letterSpacing === null || letterSpacing === undefined || letterSpacing === "") {
		letterSpacing = 0;
	}

	return {
		...(fontSize && {
			"font-size": fontSize + attributes[`${key}FontSize`].unit[device],
		}),
		...(lineHeight && {
			"line-height": lineHeight,
		}),
		...(letterSpacing !== undefined && {
			"letter-spacing": letterSpacing + (attributes[`${key}LetterSpacing`]?.unit?.[device] || "px"),
		}),
	};
};

export const generateBorderStyles = (border, borderWidth) => {
	const { style, color } = border;
	if (style === "none") {
		return { border: "none" };
	}
	const borderStyle = {
		"border-style": style,
		"border-color": color,
		"border-width": cssDataCheck(borderWidth?.value, borderWidth?.unit),
	};
	return borderStyle;
};

export const filterDuplicateSelector = (cssArray) => {
	const selectorMap = new Map();
	cssArray.forEach((css) => {
		if (css) {
			const { selector, styles } = css;
			if (Object.keys(styles).length > 0) {
				const existing = selectorMap.get(selector);
				selectorMap.set(selector, {
					selector,
					styles: existing ? { ...existing.styles, ...styles } : styles,
				});
			}
		}
	});
	return Array.from(selectorMap.values());
};

export const filterResponsiveDynamicCss = (cssObj) => {
	const { desktopCss, tabletCss, mobileCss } = cssObj;
	const filteredDesktopCss = filterDuplicateSelector(desktopCss);
	const filteredTabletCss = filterDuplicateSelector(tabletCss);
	const filteredMobileCss = filterDuplicateSelector(mobileCss);
	// css string for editor.
	const updatedCssString = `${objectToCssString(
		filteredDesktopCss
	)} @media only screen and (min-width: 600px) and (max-width: 1023px) { ${objectToCssString(
		filteredTabletCss
	)} } @media only screen and (max-width: 599px) {${objectToCssString(filteredMobileCss)}}`;
	return updatedCssString;
};

export const getSymbolFromNumber = (num, type = "roman", template = "vertical-one") => {
	if (typeof num !== "number" || num <= 0) {
		return null;
	}
	if (type === "number" || !inArray(["vertical-five", "horizontal-two", "sidebar-tab-accordion-two"], template)) {
		return num.toString() || "";
	}
	if (type === "alphabet") {
		let result = "";
		while (num > 0) {
			num--;
			result = String.fromCharCode(65 + (num % 26)) + result;
			num = Math.floor(num / 26);
		}
		return result;
	}
	if (type === "roman") {
		const romanMap = [
			[1000, "m"],
			[900, "cm"],
			[500, "d"],
			[400, "cd"],
			[100, "c"],
			[90, "xc"],
			[50, "l"],
			[40, "xl"],
			[10, "x"],
			[9, "ix"],
			[5, "v"],
			[4, "iv"],
			[1, "i"],
		];

		let result = "";
		for (const [value, symbol] of romanMap) {
			while (num >= value) {
				result += symbol;
				num -= value;
			}
		}
		return result;
	}
	return null;
};

export const getEabBlockProps = (blockProps, customIdName = "", customClassName = "") => {
	let props = {
		...blockProps,
		className: `sp-easy-accordion-block ${blockProps?.className}`,
	};
	if ("" !== customIdName) {
		props = { ...props, id: `${props?.id} ${customIdName}` };
	}
	if ("" !== customIdName) {
		props = { ...props, className: `${props?.className} ${customClassName}` };
	}
	return props;
};

export const getEabBlockUniqueId = (clientId) => {
	const shortClientId = clientId.split("-")?.pop();
	const unique_id = `sp-eab-${shortClientId}`;
	return unique_id;
};

// Google fonts list controls fn.
export const fontFamilyToUrlGenerator = (typographiesArray, page = "editor") => {
	const familyArray = typographiesArray?.filter(({ family }) => family?.length > 0);
	if (familyArray.length === 0) {
		return "";
	}
	if (page === "editor") {
		const familyString = familyArray
			?.map(({ family, fontWeight }) => `family=${family.replaceAll(" ", "+")}:wght@${fontWeight}&`)
			.join("&");
		return `@import url('https://fonts.googleapis.com/css2?${familyString}display=swap');`;
	}
	// Frontend fonts array (unique + cleaned).
	const fontList = familyArray?.map(({ family, fontWeight }) => `${family}:${fontWeight}`).filter(Boolean);
	const uniqueArray = [...new Set(fontList)];
	return jsonStringify(uniqueArray);
};

export const getVisibilityCss = (attributes) => {
	const { uniqueId, spEabHideOnDesktop, spEabHideOnTablet, spEabHideOnMobile } = attributes;
	// visibility show hide css.
	const toggle = (hidden) => [
		{
			selector: `.${uniqueId}`,
			styles: {
				opacity: hidden ? 0.4 : 1,
				background: hidden
					? `url("${sp_eab_localize_data?.pluginUrl}/assets/images/disable-bg-image.svg")`
					: "transparent",
				padding: hidden ? "10px" : "",
			},
		},
	];

	const visibility = {
		Desktop: toggle(spEabHideOnDesktop),
		Tablet: toggle(spEabHideOnTablet),
		Mobile: toggle(spEabHideOnMobile),
	};
	return visibility;
};

export const filterDndSelectValues = (values) => {
	const updatedValues = Array.isArray(values) && values?.map((val) => val.value);
	return updatedValues;
};

// export const filteredTaxonomiesValues = (taxonomies) => {
// 	const filteredTaxonomy = taxonomies?.map((taxonomy) => {
// 		return { ...taxonomy, value: filterDndSelectValues(taxonomy?.value) };
// 	});
// 	return filteredTaxonomy;
// };
export const filteredTaxonomiesValues = (selectedTaxonomy, selectedTerms = []) => {
	if (!selectedTaxonomy) {
		return null;
	}

	const filteredValue = filterDndSelectValues(selectedTerms);

	return {
		taxonomy: selectedTaxonomy,
		value: filteredValue,
	};
};

export const getObjectValuesToJsArray = (object) => {
	return Object?.values(object);
};
export const capitalizeString = (name) => {
	if (name === "post_format") {
		return "Post_Format";
	}
	return name.charAt(0).toUpperCase() + name.slice(1);
};
export const findDataFromArray = (itemsArray, firstKey, secondKey) => {
	const result = itemsArray?.find((f) => f[firstKey] === secondKey);
	return result;
};
// this function accept an random array, one label key and value key and return a array of objects that use for select fields options.
export const filterSelectOptions = (dataArray, labelKey, valueKey, indexKey = false) => {
	const selectFieldData = dataArray?.map((data, index) => {
		return {
			id: indexKey ? data[indexKey] : index,
			label: data[labelKey],
			value:
				"number" === typeof data[valueKey] ? data[valueKey] : data[valueKey].replace(/\s+/g, "_").toLowerCase(),
		};
	});
	return selectFieldData;
};

export const stringTrim = (content, attributes) => {
	const getWords = (data, length = 10) => {
		const words = data?.split(" ");
		return words?.slice(0, length).join(" ");
	};
	const getCharacters = (data, length = 10) => {
		if (!data) {
			return;
		}
		return data?.substring(0, length);
	};

	let newContent = "";

	if (typeof attributes === "object") {
		if (attributes.unit === "words") {
			newContent = getWords(content, attributes.value);
		} else if (attributes.unit === "chars") {
			newContent = getCharacters(content, attributes.value);
		}
	}

	return "" !== newContent ? newContent : content;
};

export const hexToRgba = (hex, opacity) => {
	const bigint = parseInt(hex?.replace("#", ""), 16);
	const r = (bigint >> 16) & 255;
	const g = (bigint >> 8) & 255;
	const b = bigint & 255;
	if (opacity) {
		return `rgba(${r}, ${g}, ${b}, ${opacity})`;
	}
	return `${r}, ${g}, ${b}`;
};

export const stripScriptsAndSanitizeText = (text) => {
	let result = text;
	// 1️⃣ Remove complete <script>...</script> blocks.
	result = result?.replace(/<script[\s\S]*?>[\s\S]*?<\/script>/gi, "");
	// 2️⃣ Remove only remaining opening <script> tags (no closing tag case).
	result = result?.replace(/<script[\s\S]*?>/gi, "");
	// 3️⃣ Remove all other HTML tags.
	result = result?.replace(/<[^>]+>/g, "");
	// 4️⃣ Normalize spaces.
	return result?.replace(/\s+/g, " ")?.trim();
};

// Build Prompt for ai based on user input data.
export const buildAiPrompt = (userData) => {
	return `
        You are an expert content writer specializing in FAQ generation.
        
        Task:
        Generate exactly ${userData?.numberOfFaqs} unique FAQs (questions and answers).
        
        Context:
        - Topic: ${userData?.prompt}
        ${userData?.selectedPost ? `- Reference URL: ${userData?.selectedPost}` : ""}
        
        Requirements:
        - Language: Write strictly in ${userData?.language}. Do not mix languages.
        - Tone: Use a ${userData?.tune} tone consistently across all FAQs.
        ${userData?.keywords ? `- Include these keywords naturally where relevant: ${userData?.keywords}` : ""}
        
        Guidelines:
        - Each question must be clear, natural, and directly related to the topic.
        - Each answer must be concise (2–3 sentences) and helpful.
        - Avoid duplicate or very similar questions.
        - Do NOT include numbering in questions.
        - Do NOT include explanations or extra text outside JSON.
        
        Output Rules (VERY IMPORTANT):
        - Return ONLY a valid JSON array.
        - Do NOT use markdown (no \`\`\`).
        - Do NOT include any text before or after JSON.
        - Ensure the JSON is properly formatted (no trailing commas).
        
        Expected Output:
        [
          {
            "question": "FAQ question here",
            "answer": "FAQ answer here"
          }
        ]
		`;
};

export const getModulesSettings = (module_name) => {
	const moduleData = sp_eab_localize_data?.dashboardSettings?.modules?.[module_name];
	return moduleData ? moduleData?.is_active : defaultDashboardSettings?.modules[module_name].is_active;
};

export const getIntegrationSettings = () => {
	const integrationData = sp_eab_localize_data?.dashboardSettings?.integrations || false;
	return integrationData ? integrationData : defaultDashboardSettings?.integrations;
};

export const checkIsEqual = (updated, old) => {
	// Get sorted keys to ensure consistent comparison.
	const updatedKeys = Object.keys(updated);
	// Compare each value
	return updatedKeys.every((key) => {
		const val1 = updated[key];
		const val2 = old[key];
		return val1 === val2;
	});
};
