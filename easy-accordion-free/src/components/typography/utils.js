import { useMemo } from "@wordpress/element";
import { DecorationLineThrough, DecorationUnderline, ItalicIcon } from "./svgIcon";

export const fetchFonts = async () => {
	try {
		const response = await fetch(
			"https://www.googleapis.com/webfonts/v1/webfonts?key=AIzaSyCJIzfKoHlACqsmK1zDzl-OAsgtJPk8BtI"
		);
		if (response.status === 200) {
			return response.json();
		}
	} catch (error) {
		console.error("Error fetching Google Fonts:", error);
	}
};

export const fontWeightMap = {
	100: "Thin 100",
	200: "Extra Light 200",
	300: "Light 300",
	400: "Regular 400",
	500: "Medium 500",
	600: "Semi Bold 600",
	700: "Bold 700",
	800: "Extra Bold 800",
	900: "Black 900",
	"100italic": "italic 100",
	"200italic": "italic 200",
	"300italic": "italic 300",
	italic: "italic 400",
	"400italic": "italic 400",
	"500italic": "italic 500",
	"600italic": "italic 600",
	"700italic": "italic 700",
	"800italic": "italic 800",
	"900italic": "italic 900",
};

export const textStylesOptions = [
	{
		label: <ItalicIcon />,
		key: "style",
		value: "italic",
	},
	{
		label: <DecorationUnderline />,
		key: "decoration",
		value: "underline",
	},
	{
		label: <DecorationLineThrough />,
		key: "decoration",
		value: "line-through",
	},
	{
		label: "AB",
		key: "transform",
		value: "uppercase",
	},
	{
		label: "ab",
		key: "transform",
		value: "lowercase",
	},
	{
		label: "Ab",
		key: "transform",
		value: "capitalize",
	},
];

export const getFontWeightList = (activeFontFamily) => {
	const data = useMemo(() => {
		const weightLists = activeFontFamily?.font?.variants?.map((value) => {
			if ("regular" === value) {
				value = "400";
			}
			if (fontWeightMap[value]) {
				return { label: fontWeightMap[value], value };
			}
		});
		return weightLists;
	}, [activeFontFamily]);
	return data;
};
