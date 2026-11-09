import { useEffect, useRef } from "@wordpress/element";
import { FILE_MAX_CHARS, MAX_EXISTING, REPLACE_PREFIX } from "./constants";

/**
 * Markup-free text.
 *
 * @param {string} html HTML.
 * @return {string} Text.
 */
export const stripTags = (html = "") =>
	String(html)
		.replace(/<[^>]*>/g, " ")
		.replace(/&nbsp;/g, " ")
		.replace(/\s+/g, " ")
		.trim();

/**
 * The text after "Replace with", when an instruction is one — applied in the
 * browser, so no AI request is made.
 *
 * @param {string} instruction Rewrite instruction.
 * @return {string|null} Replacement, or null when the instruction asks the AI.
 */
export const getReplacement = (instruction = "") => {
	const text = instruction.trim();
	for (const prefix of [REPLACE_PREFIX.trim(), "Replace with"]) {
		if (text.toLowerCase().startsWith(prefix.toLowerCase())) {
			const rest = text
				.slice(prefix.length)
				.replace(/^[:\s]+/, "")
				.trim();
			return rest || null;
		}
	}
	return null;
};

/**
 * Paragraph contents of a generated answer — blank-line breaks become
 * separate paragraph blocks.
 *
 * @param {string} answer Answer HTML.
 * @return {string[]} Paragraphs.
 */
export const answerToParagraphs = (answer = "") =>
	String(answer)
		.split(/(?:<br\s*\/?>\s*){2,}/i)
		.map((paragraph) => paragraph.replace(/^(?:<br\s*\/?>\s*)+|(?:<br\s*\/?>\s*)+$/gi, "").trim())
		.filter(Boolean);

/**
 * Whether a child item is still the untouched placeholder a new accordion starts with.
 *
 * @param {Object} block Child block.
 * @return {boolean} Untouched.
 */
export const isPlaceholderItem = (block) =>
	!stripTags(block?.attributes?.accordionTitle || "") &&
	(block?.innerBlocks || []).every(
		(inner) => inner.name === "core/paragraph" && !stripTags(String(inner.attributes?.content ?? ""))
	);

/**
 * Questions the accordion already holds, sent so the AI does not write them
 * again (an FAQ thrown away is an FAQ paid for).
 *
 * @param {Array}  blocks    Child blocks of the accordion.
 * @param {string} childName Item block name.
 * @return {string[]} Titles.
 */
export const getExistingQuestions = (blocks = [], childName) =>
	blocks
		.filter((block) => block.name === childName)
		.map((block) => stripTags(block.attributes?.accordionTitle || "").slice(0, 120))
		.filter(Boolean)
		.slice(0, MAX_EXISTING);

/**
 * Read a picked file as text, capped.
 *
 * @param {File} file File.
 * @return {Promise<string>} Text.
 */
export const readTextFile = (file) =>
	new Promise((resolve, reject) => {
		const reader = new window.FileReader();
		reader.onload = () => resolve(String(reader.result || "").slice(0, FILE_MAX_CHARS));
		reader.onerror = () => reject(reader.error);
		reader.readAsText(file);
	});

/**
 * Call `onOutside` on a pointer press outside `ref` while `active`.
 *
 * @param {Object}   ref       Element ref.
 * @param {Function} onOutside Handler.
 * @param {boolean}  active    Listen only while true.
 */
export const useClickOutside = (ref, onOutside, active) => {
	const handler = useRef(onOutside);
	handler.current = onOutside;

	useEffect(() => {
		const node = ref.current;
		if (!active || !node) {
			return undefined;
		}
		const doc = node.ownerDocument;
		const onPointerDown = (event) => {
			if (ref.current && !ref.current.contains(event.target)) {
				handler.current(event);
			}
		};
		doc.addEventListener("mousedown", onPointerDown);
		return () => doc.removeEventListener("mousedown", onPointerDown);
	}, [active]);
};
