import toast from "react-hot-toast";
import { __ } from "@wordpress/i18n";

export const toastSuccessMsg = (message) => {
	return toast.success(message, {
		style: {
			marginTop: "28px",
			fontSize: "15px",
			padding: "10px 18px",
		},
	});
};

export const toastErrorMsg = (message) => {
	return toast.error(message, {
		style: {
			marginTop: "28px",
			fontSize: "15px",
			padding: "10px 18px",
		},
	});
};

export const copyText = async (text) => {
	// First try Clipboard API
	if (navigator.clipboard && navigator.clipboard.writeText) {
		try {
			await navigator.clipboard.writeText(text);
			return true;
		} catch (e) {
			// Fall through to the execCommand fallback.
		}
	}

	// Fallback method: hidden textarea + execCommand
	try {
		const textarea = document.createElement("textarea");
		textarea.value = text;

		// Hide from screen
		textarea.style.position = "fixed";
		textarea.style.opacity = "0";
		textarea.style.pointerEvents = "none";

		document.body.appendChild(textarea);
		textarea.select();

		const success = document.execCommand("copy");
		document.body.removeChild(textarea);

		return success;
	} catch (err) {
		// eslint-disable-next-line no-console
		console.error("Fallback copy failed:", err);
		return false;
	}
};

export const jsToPhpBool = (val) => {
	return val ? "1" : "0";
};

export const phpToJsBool = (val) => {
	if (val === "1" || val === "1" || val === 1 || val === true) {
		return true;
	}
	return false;
};

/**
 * A time-of-day greeting for the dashboard hero.
 *
 * @param {number} hour Hour of the day (0-23).
 * @return {string} Greeting.
 */
export const getGreeting = (hour) => {
	if (hour < 12) {
		return __("Good morning", "easy-accordion-free");
	}

	if (hour < 18) {
		return __("Good afternoon", "easy-accordion-free");
	}

	return __("Good evening", "easy-accordion-free");
};

/**
 * A display name with the first letter of each word in capitals, for the
 * greeting ("saiful" → "Saiful", "john doe" → "John Doe"). The rest of each
 * word is left as typed, so "McDonald" or "DeShawn" keep their own capitals.
 *
 * @param {string} name Display name.
 * @return {string} Name for the greeting.
 */
export const capitalizeName = (name) => {
	return String(name || "")
		.trim()
		.replace(/(^|[\s-])(\p{L})/gu, (match, before, letter) => before + letter.toLocaleUpperCase());
};

/**
 * The name a greeting addresses the user by: the profile's First Name when
 * set, otherwise the first word of the display name ("jahirul islam" →
 * "Jahirul"). A set First Name is used whole, so "Mary Jane" stays intact.
 *
 * @param {string} firstName   Profile First Name; may be empty.
 * @param {string} displayName Display name, the fallback.
 * @return {string} First name, capitalised; empty when neither is set.
 */
export const getFirstName = (firstName, displayName) => {
	const first = String(firstName || "").trim();

	if (first) {
		return capitalizeName(first);
	}

	return capitalizeName(
		String(displayName || "")
			.trim()
			.split(/\s+/)[0]
	);
};
