/**
 * Pure helpers for the dashboard welcome card copy.
 *
 * A first visit (no accordion placed anywhere yet) is welcomed to the plugin;
 * a returning author is invited to build the next one.
 */

import { __, sprintf } from "@wordpress/i18n";

/**
 * The greeting line: "Good morning, Saiful 👋", or "Good morning 👋" without
 * a name.
 *
 * @param {string} greeting    "Good morning" / "Good afternoon" / "Good evening".
 * @param {string} displayName The user's display name, ready to show.
 * @return {string} Greeting line.
 */
export function getSalutation(greeting, displayName) {
	if (displayName) {
		return sprintf(
			/* translators: 1: "Good morning" / "Good afternoon" / "Good evening", 2: the user's display name */
			__("%1$s, %2$s 👋", "easy-accordion-free"),
			greeting,
			displayName
		);
	}

	return sprintf(
		/* translators: %s: "Good morning" / "Good afternoon" / "Good evening" */
		__("%s 👋", "easy-accordion-free"),
		greeting
	);
}

/**
 * The returning-user lead, naming only the ways to start this site offers —
 * Ready Patterns can be switched off. Whole sentences per case so each one
 * translates on its own.
 *
 * @param {Object}  options
 * @param {boolean} options.patterns Ready Patterns is offered.
 * @return {string} Lead sentence.
 */
function getReturningLead({ patterns }) {
	if (patterns) {
		return __("Start from a ready pattern, or start blank.", "easy-accordion-free");
	}

	return __("Start blank in the block editor.", "easy-accordion-free");
}

/**
 * Title and lead for the welcome card.
 *
 * @param {Object}  options
 * @param {boolean} options.hasPlacements The site already has an accordion or FAQ placed.
 * @param {boolean} options.patterns      Ready Patterns is offered.
 * @return {{title: string, lead: string}} Copy.
 */
export function getWelcomeCopy({ hasPlacements = false, patterns = false } = {}) {
	if (hasPlacements) {
		return {
			title: __("Ready to create your next accordion or FAQ?", "easy-accordion-free"),
			lead: getReturningLead({ patterns }),
		};
	}

	return {
		title: __("Welcome to Easy Accordion", "easy-accordion-free"),
		lead: __(
			"Answer questions before visitors ask, with clean accordions and FAQs built in minutes. Choose how you'd like to start.",
			"easy-accordion-free"
		),
	};
}
