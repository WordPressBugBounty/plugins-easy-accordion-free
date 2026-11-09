import { __, sprintf } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import {
	ChevronLeftIcon,
	ChevronRightIcon,
	CloseIcon,
	DesktopIcon,
	DownloadIcon,
	MobileIcon,
	TabletIcon,
} from "./icons";
import ProUpgradeLink from "./ProUpgradeLink";

/**
 * Preview device widths. The iframe renders at this width, then scales down with
 * a CSS transform to fit the measured stage box.
 */
const PREVIEW_DEVICES = [
	{ key: "desktop", width: 1440, Icon: DesktopIcon },
	{ key: "tablet", width: 834, Icon: TabletIcon },
	{ key: "mobile", width: 390, Icon: MobileIcon },
];

// Frame height used before the stage has been measured, and in the (theoretical)
// environment without ResizeObserver.
const FALLBACK_STAGE_HEIGHT = 560;

/**
 * Translated label for a device key.
 *
 * @param {string} key Device key.
 * @return {string} Label.
 */
function deviceLabel(key) {
	if ("tablet" === key) {
		return __("Tablet", "easy-accordion-free");
	}
	if ("mobile" === key) {
		return __("Mobile", "easy-accordion-free");
	}
	return __("Desktop", "easy-accordion-free");
}

/**
 * In-modal preview drawer: a header row — title, the centered device switcher,
 * Insert (an upgrade link on Pro patterns) + close (close returns to the pattern grid) — over a full-width stage
 * holding the live iframe, and a footer that steps through the grid's visible
 * patterns ("Patterns N of M" + Prev / Next).
 *
 * The iframe is sandboxed without `allow-same-origin` so the framed demo page
 * cannot reach the editor origin. The drawer owns Escape (capture phase) while
 * mounted so it never bubbles up to close the whole modal.
 *
 * @param {Object}   props
 * @param {Object}   props.pattern     Manifest item being previewed.
 * @param {Array}    props.patterns    The grid's visible patterns, in grid order — the Prev / Next sequence.
 * @param {Function} props.onNavigate  Show another pattern — receives the pattern.
 * @param {Function} props.onClose     Close the preview — back to the pattern grid.
 * @param {Function} props.onInsert    Insert handler — receives the pattern.
 * @param {boolean}  props.isInserting Whether this pattern's import is in flight.
 */
const PreviewDrawer = ({ pattern, patterns = [], onNavigate, onClose, onInsert, isInserting }) => {
	const [device, setDevice] = useState(PREVIEW_DEVICES[0].key);
	const [isFrameLoading, setIsFrameLoading] = useState(true);
	// Measured content box of the stage — the frame is scaled to fit it, so the
	// preview stays fitted at any drawer width and through window resizes.
	const [stage, setStage] = useState({ width: 0, height: 0 });
	const closeRef = useRef(null);
	const stageRef = useRef(null);
	const drawerRef = useRef(null);

	useEffect(() => {
		closeRef.current?.focus();
	}, []);

	useEffect(() => {
		const handleKeyDown = (event) => {
			if ("Escape" === event.key) {
				event.preventDefault();
				event.stopPropagation();
				onClose();
			}
		};
		document.addEventListener("keydown", handleKeyDown, true);
		return () => document.removeEventListener("keydown", handleKeyDown, true);
	}, [onClose]);

	useEffect(() => {
		const node = stageRef.current;
		if (!node || "undefined" === typeof ResizeObserver) {
			return;
		}
		const observer = new ResizeObserver(([entry]) => {
			// `contentRect` excludes the stage's own padding.
			const { width, height } = entry.contentRect;
			setStage({ width: Math.round(width), height: Math.round(height) });
		});
		observer.observe(node);
		return () => observer.disconnect();
	}, []);

	// Mouse-down rather than click, so releasing a text selection that started
	// inside the drawer never counts as clicking the dimmed area.
	const handleBackdropMouseDown = (event) => {
		if (drawerRef.current && !drawerRef.current.contains(event.target)) {
			onClose();
		}
	};

	const activeDevice = PREVIEW_DEVICES.find((entry) => entry.key === device) || PREVIEW_DEVICES[0];
	const scale = stage.width ? Math.min(1, stage.width / activeDevice.width) : 1;
	const frameHeight = Math.round((stage.height || FALLBACK_STAGE_HEIGHT) / scale);
	const previewUrl = pattern?.url || "";
	const patternName = decodeEntities(pattern?.name || "");
	const thumb = pattern?.image || "";
	const patternIndex = patterns.findIndex((entry) => entry.ID === pattern?.ID);
	const prevPattern = patternIndex > 0 ? patterns[patternIndex - 1] : null;
	const nextPattern = patternIndex > -1 && patternIndex < patterns.length - 1 ? patterns[patternIndex + 1] : null;

	// A new pattern swaps the iframe src — show the preloader again until it lands.
	// Device switching only resizes the frame, so it must not reset this.
	useEffect(() => {
		setIsFrameLoading(true);
	}, [previewUrl]);

	return (
		<div className="sp-eap-ready-patterns-drawer-backdrop" onMouseDown={handleBackdropMouseDown}>
			<section
				className="sp-eap-ready-patterns-drawer"
				ref={drawerRef}
				role="dialog"
				aria-modal="true"
				aria-labelledby="sp-eap-ready-patterns-drawer-title"
			>
				<header className="sp-eap-ready-patterns-drawer-header">
					<div className="sp-eap-ready-patterns-drawer-header-left">
						<h2 className="sp-eap-ready-patterns-drawer-title" id="sp-eap-ready-patterns-drawer-title">
							{patternName}
						</h2>
					</div>

					<div
						className="sp-eap-ready-patterns-drawer-devices"
						role="group"
						aria-label={__("Preview width", "easy-accordion-free")}
					>
						{PREVIEW_DEVICES.map((entry) => {
							const { Icon } = entry;
							return (
								<button
									key={entry.key}
									type="button"
									className={`sp-eap-ready-patterns-drawer-device${
										entry.key === device ? " is-active" : ""
									}`}
									aria-pressed={entry.key === device}
									aria-label={deviceLabel(entry.key)}
									title={deviceLabel(entry.key)}
									onClick={() => setDevice(entry.key)}
								>
									<Icon />
								</button>
							);
						})}
					</div>

					<div className="sp-eap-ready-patterns-drawer-header-right sp-d-flex sp-align-center">
						{pattern?.pro ? (
							<ProUpgradeLink label={__("Upgrade to Pro", "easy-accordion-free")} />
						) : (
							<button
								type="button"
								className={`sp-eap-ready-patterns-insert-btn${isInserting ? " is-busy" : ""}`}
								onClick={() => onInsert(pattern)}
								disabled={isInserting}
							>
								{isInserting
									? __("Inserting…", "easy-accordion-free")
									: __("Insert", "easy-accordion-free")}
								{isInserting ? (
									<span className="dashicons dashicons-update sp-eap-ready-patterns-spin" />
								) : (
									<DownloadIcon />
								)}
							</button>
						)}
						<button
							type="button"
							className="sp-eap-ready-patterns-drawer-close"
							aria-label={__("Close preview", "easy-accordion-free")}
							onClick={onClose}
							ref={closeRef}
						>
							<CloseIcon />
						</button>
					</div>
				</header>

				<div className="sp-eap-ready-patterns-drawer-body">
					<div className="sp-eap-ready-patterns-drawer-stage" ref={stageRef}>
						{previewUrl ? (
							<iframe
								className={`sp-eap-ready-patterns-drawer-frame${isFrameLoading ? " is-loading" : ""}`}
								title={
									patternName
										? sprintf(
												/* translators: %s: pattern name */ __(
													"Preview of %s",
													"easy-accordion-free"
												),
												patternName
											)
										: __("Pattern preview", "easy-accordion-free")
								}
								src={previewUrl}
								sandbox="allow-scripts allow-forms allow-popups"
								onLoad={() => setIsFrameLoading(false)}
								style={{
									width: `${activeDevice.width}px`,
									height: `${frameHeight}px`,
									transform: `scale(${scale})`,
								}}
							/>
						) : (
							<div className="sp-eap-ready-patterns-drawer-thumb">
								{thumb ? (
									<img src={thumb} alt="" />
								) : (
									<p>{__("No preview available for this pattern.", "easy-accordion-free")}</p>
								)}
							</div>
						)}

						{previewUrl && isFrameLoading ? (
							<div className="sp-eap-ready-patterns-drawer-loader" aria-hidden="true">
								<span className="sp-eap-ready-patterns-drawer-loader-spinner" />
								<span className="sp-eap-ready-patterns-drawer-loader-text">
									{__("Loading preview…", "easy-accordion-free")}
								</span>
							</div>
						) : null}
					</div>
				</div>

				<footer className="sp-eap-ready-patterns-drawer-footer sp-d-flex sp-align-center sp-justify-between">
					<p className="sp-eap-ready-patterns-drawer-count" aria-live="polite">
						{sprintf(
							/* translators: 1: current pattern position, 2: total patterns */
							__("Patterns %1$d of %2$d", "easy-accordion-free"),
							patternIndex > -1 ? patternIndex + 1 : 1,
							Math.max(patterns.length, 1)
						)}
					</p>
					<div className="sp-d-flex sp-align-center sp-gap-12px">
						<button
							type="button"
							className="sp-eap-ready-patterns-drawer-nav sp-d-flex sp-align-center sp-gap-4px"
							onClick={() => onNavigate(prevPattern)}
							disabled={!prevPattern}
						>
							<ChevronLeftIcon />
							{__("Prev", "easy-accordion-free")}
						</button>
						<button
							type="button"
							className="sp-eap-ready-patterns-drawer-nav sp-d-flex sp-align-center sp-gap-4px"
							onClick={() => onNavigate(nextPattern)}
							disabled={!nextPattern}
						>
							{__("Next", "easy-accordion-free")}
							<ChevronRightIcon />
						</button>
					</div>
				</footer>
			</section>
		</div>
	);
};

export default PreviewDrawer;
