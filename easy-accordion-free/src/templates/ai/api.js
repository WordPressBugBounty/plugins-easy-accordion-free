import { __ } from "@wordpress/i18n";

const apiErrorMessages = {
	400: __("Invalid request. Please check API key or parameters.", "easy-accordion-free"),
	401: __("Unauthorized. Invalid or missing API key.", "easy-accordion-free"),
	403: __("Access denied. Check API permissions.", "easy-accordion-free"),
	404: __("Model not found. Please use a valid model.", "easy-accordion-free"),
	405: __("Method not allowed.", "easy-accordion-free"),
	429: __("Rate limit exceeded. Please try again later.", "easy-accordion-free"),
	500: __("Server error. Please try again later.", "easy-accordion-free"),
	503: __("Service unavailable. Try again shortly.", "easy-accordion-free"),
	default: __("Something went wrong.", "easy-accordion-free"),
	unknown: __("An unknown error occurred.", "easy-accordion-free"),
	networkError: __("Network request failed.", "easy-accordion-free"),
};

// gemini api request.
export const geminiRequest = async (prompt, model, apiKey, maxTokens) => {
	try {
		const response = await fetch(
			`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					contents: [{ parts: [{ text: prompt }] }],
					generationConfig: {
						maxOutputTokens: maxTokens, // token: set limit for token.
						temperature: 0.7, // Optional: adjust for creativity.
					},
				}),
			}
		);

		const data = await response.json();

		// 1. Handle API-specific errors (like Invalid API Key)
		if (!response.ok || data.error) {
			const code = data?.error?.code || response.status;
			return {
				error: true,
				code,
				message: apiErrorMessages[code] || data?.error?.message || apiErrorMessages?.unknown,
			};
		}

		// 2. Safely extract text
		const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
		if (!rawText) {
			throw new Error("Empty response from model");
		}

		// 3. Robust JSON Parsing.
		try {
			const cleanJson = JSON.parse(rawText.replace(/```json|```/g, "").trim());
			return { success: true, data: cleanJson };
		} catch (parseError) {
			// console.error("JSON Parse Error:", rawText);
			return { error: true, message: apiErrorMessages?.default };
		}
	} catch (error) {
		// 4. Handle Network or unexpected errors
		// console.error("Gemini Request Exception:", error);
		return {
			error: true,
			message: error.message || apiErrorMessages?.networkError,
		};
	}
};
