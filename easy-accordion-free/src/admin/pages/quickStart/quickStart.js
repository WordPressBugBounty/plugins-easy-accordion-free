/**
 * Dashboard page.
 *
 * A welcome card — greeting, the ways to start and the intro video — above
 * the "Accordion Placements" table.
 */

import { __ } from "@wordpress/i18n";
import { useEffect, useState } from "@wordpress/element";
import { getFirstName, getGreeting } from "../../functions";
import Placements from "./Placements";
import { getSalutation, getWelcomeCopy } from "./welcomeCopy";

/** Intro video shown in the hero and the modal. */
const INTRO_VIDEO = {
	id: "u3lRDX0zG9Y",
	playlist: "PLoUb-7uG-5jPNXkpGII8cTTfB-L4TCaqv",
};

/**
 * Dashboard page.
 *
 * @return {JSX.Element} Page.
 */
export default function QuickStart() {
	const localize = sp_eab_admin_dashboard_localize || {};
	const {
		homeUrl = "",
		pluginUrl = "",
		userName = "",
		userFirstName = "",
		hasPlacements = null,
		dashboardInfo = {},
	} = localize;

	// Every entry point opens a new page in the block editor — where an
	// accordion actually gets built. "Start Blank" lands with the inserter
	// open, scrolled to the EASY ACCORDION category; a saved template is a
	// different job, and the Saved Templates tab owns it.
	const createUrl = `${homeUrl}wp-admin/post-new.php?post_type=page&eabblock_inserter=true`;
	const newPageUrl = `${homeUrl}wp-admin/post-new.php?post_type=page`;

	// The sibling deep link, with the Ready Patterns library already open
	// rather than sending the author off to the website. Hidden when the
	// module is off, since the library button is not registered at all in
	// that case.
	const patternsEnabled = dashboardInfo?.modules?.pattern_library?.is_active !== false;
	const readyPatternsUrl = patternsEnabled
		? `${homeUrl}wp-admin/post-new.php?post_type=page&eab_pattern_library`
		: "";

	// The ways to start, in order; the first one shown is the primary.
	const startActions = [
		readyPatternsUrl && {
			key: "patterns",
			href: readyPatternsUrl,
			label: __("Use a Pattern", "easy-accordion-free"),
			icon: "dashicons-screenoptions",
		},
		createUrl && {
			key: "scratch",
			href: createUrl,
			label: __("Start Blank", "easy-accordion-free"),
			icon: "dashicons-plus-alt2",
		},
	].filter(Boolean);
	const [videoOpen, setVideoOpen] = useState(false);

	// First visit or returning: known on load from the stored placements
	// report, and kept current by the report itself — its first scan when
	// nothing was stored, and every Sync after that.
	const [placementsExist, setPlacementsExist] = useState(true === hasPlacements);

	useEffect(() => {
		if (!videoOpen) {
			return undefined;
		}
		const onKeyDown = (e) => {
			if (e.key === "Escape") {
				setVideoOpen(false);
			}
		};
		document.addEventListener("keydown", onKeyDown);
		return () => document.removeEventListener("keydown", onKeyDown);
	}, [videoOpen]);

	const salutation = getSalutation(getGreeting(new Date().getHours()), getFirstName(userFirstName, userName));
	const welcome = getWelcomeCopy({
		hasPlacements: placementsExist,
		patterns: !!readyPatternsUrl,
	});

	return (
		<section className="speap-qs-page">
			<div className="speap-qs-hero">
				<div className="speap-qs-hero__text">
					<p className="speap-qs-greeting">{salutation}</p>
					<h1 className="speap-qs-title">{welcome.title}</h1>
					<p className="speap-qs-lead">{welcome.lead}</p>
					{startActions.length > 0 && (
						<div className="speap-qs-actions">
							{startActions.map((action, index) => (
								<a
									key={action.key}
									className={`speap-qs-start-btn speap-qs-start-btn--${action.key}${
										0 === index ? " is-primary" : ""
									}`}
									href={action.href}
								>
									<span className={`dashicons ${action.icon}`} aria-hidden="true" />
									{action.label}
								</a>
							))}
						</div>
					)}
				</div>

				<button
					type="button"
					className="speap-qs-video"
					onClick={() => setVideoOpen(true)}
					aria-label={__("Play the introduction video", "easy-accordion-free")}
				>
					{pluginUrl && (
						<img
							className="speap-qs-video__thumb"
							src={`${pluginUrl}/admin/img/video-overlay.jpg`}
							alt=""
							width="800"
							height="450"
							loading="eager"
							decoding="async"
						/>
					)}
					<span className="speap-qs-play-btn">
						<span className="dashicons dashicons-controls-play" aria-hidden="true" />
					</span>
				</button>
			</div>

			<Placements
				createUrl={newPageUrl}
				onReport={(report) => setPlacementsExist(Array.isArray(report?.rows) && report.rows.length > 0)}
			/>

			{videoOpen ? (
				<div
					className="speap-qs-modal"
					onClick={(e) => {
						if (e.target === e.currentTarget) {
							setVideoOpen(false);
						}
					}}
				>
					<div className="speap-qs-modal__content" role="dialog" aria-modal="true">
						<button
							type="button"
							className="speap-qs-modal__close"
							onClick={() => setVideoOpen(false)}
							aria-label={__("Close", "easy-accordion-free")}
						>
							×
						</button>
						<div className="speap-qs-modal__video">
							<iframe
								title={__("Easy Accordion video tutorial", "easy-accordion-free")}
								src={`https://www.youtube.com/embed/${INTRO_VIDEO.id}?autoplay=1&list=${INTRO_VIDEO.playlist}`}
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							/>
						</div>
					</div>
				</div>
			) : null}
		</section>
	);
}
