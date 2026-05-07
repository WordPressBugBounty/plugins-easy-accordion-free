import axios from "axios";
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
			console.warn("Clipboard API failed, using fallback.", e);
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
