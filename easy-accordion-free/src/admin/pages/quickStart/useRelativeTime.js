/**
 * Keep a "1 second ago" label current without a timer that outlives the
 * component.
 *
 * The dashboard unmounts pages on every tab switch, so the interval is
 * cleared on unmount and re-scheduled at the next boundary that would
 * actually change the wording.
 */

import { useEffect, useState } from "@wordpress/element";
import { _n, sprintf } from "@wordpress/i18n";

/**
 * A relative "X seconds/minutes/hours/days ago" label.
 *
 * Pure.
 *
 * @param {number} timestamp Unix seconds of the moment being described.
 * @param {number} [now]     Unix seconds to compare against (injectable for tests).
 * @return {string} Label, or '' when there is no timestamp.
 */
export function formatRelativeTime(timestamp, now = Math.floor(Date.now() / 1000)) {
	if (!timestamp) {
		return "";
	}

	const seconds = Math.max(0, now - timestamp);

	if (60 > seconds) {
		const value = Math.max(1, seconds);
		return sprintf(
			/* translators: %d: number of seconds. */
			_n("%d second ago", "%d seconds ago", value, "easy-accordion-free"),
			value
		);
	}

	if (3600 > seconds) {
		const minutes = Math.floor(seconds / 60);
		return sprintf(
			/* translators: %d: number of minutes. */
			_n("%d minute ago", "%d minutes ago", minutes, "easy-accordion-free"),
			minutes
		);
	}

	if (86400 > seconds) {
		const hours = Math.floor(seconds / 3600);
		return sprintf(
			/* translators: %d: number of hours. */
			_n("%d hour ago", "%d hours ago", hours, "easy-accordion-free"),
			hours
		);
	}

	const days = Math.floor(seconds / 86400);
	return sprintf(
		/* translators: %d: number of days. */
		_n("%d day ago", "%d days ago", days, "easy-accordion-free"),
		days
	);
}

/**
 * How often the relative label needs re-computing: at the next boundary that
 * would change the wording, or null when it never changes again.
 *
 * Pure.
 *
 * @param {number} timestamp Unix seconds of the moment being described.
 * @param {number} [now]     Unix seconds to compare against (injectable for tests).
 * @return {number|null} Interval in milliseconds.
 */
export function getRelativeTimeInterval(timestamp, now = Math.floor(Date.now() / 1000)) {
	if (!timestamp) {
		return null;
	}

	const seconds = Math.max(0, now - timestamp);

	if (60 > seconds) {
		return 1000;
	}

	if (3600 > seconds) {
		return 30000;
	}

	if (86400 > seconds) {
		return 300000;
	}

	return null;
}

/**
 * @param {number} timestamp Unix seconds of the moment being described.
 * @return {string} The relative label, refreshed as time passes.
 */
export default function useRelativeTime(timestamp) {
	const [label, setLabel] = useState(() => formatRelativeTime(timestamp));

	useEffect(() => {
		setLabel(formatRelativeTime(timestamp));

		const interval = getRelativeTimeInterval(timestamp);

		if (null === interval) {
			return undefined;
		}

		const timer = setInterval(() => {
			setLabel(formatRelativeTime(timestamp));
		}, interval);

		return () => clearInterval(timer);
	}, [timestamp]);

	return label;
}
