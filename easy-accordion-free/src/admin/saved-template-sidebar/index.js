import { __ } from "@wordpress/i18n";
import { registerPlugin } from "@wordpress/plugins";
import { useSelect } from "@wordpress/data";
import { createPortal, useEffect, useState } from "@wordpress/element";
import "./editor.scss";

const CopyIcon = () => (
	<svg
		width="18"
		height="18"
		viewBox="0 0 18 18"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
		aria-hidden="true"
		focusable="false"
	>
		<path
			d="M6 6V3.75A.75.75 0 0 1 6.75 3h7.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75H12M3.75 6.75h7.5a.75.75 0 0 1 .75.75v7.5a.75.75 0 0 1-.75.75h-7.5a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 .75-.75Z"
			stroke="currentColor"
			strokeWidth="1.2"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

const PORTAL_CLASSNAME = "speap-shortcode-portal";

const copyText = async (text) => {
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

const SavedTemplateSidebar = () => {
	const { postType, postId } = useSelect(
		(select) => ({
			postType: select("core/editor")?.getCurrentPostType?.() || null,
			postId: select("core/editor")?.getCurrentPostId?.() || null,
		}),
		[]
	);

	const [copied, setCopied] = useState(false);
	const [portalTarget, setPortalTarget] = useState(null);

	useEffect(() => {
		if (postType !== "sp_eap_template") {
			setPortalTarget(null);
			return undefined;
		}

		let container = null;

		const ensureContainer = () => {
			const fill = document.querySelector(".interface-complementary-area__fill");
			if (!fill) {
				return;
			}

			let existing = fill.querySelector(`:scope > .${PORTAL_CLASSNAME}`);
			if (!existing) {
				existing = document.createElement("div");
				existing.className = PORTAL_CLASSNAME;
				fill.insertBefore(existing, fill.firstChild);
			} else if (fill.firstElementChild !== existing) {
				fill.insertBefore(existing, fill.firstChild);
			}

			if (existing !== container) {
				container = existing;
				setPortalTarget(existing);
			}
		};

		ensureContainer();

		const observer = new window.MutationObserver(ensureContainer);
		observer.observe(document.body, { childList: true, subtree: true });

		return () => {
			observer.disconnect();
			if (container && container.parentNode) {
				container.parentNode.removeChild(container);
			}
			setPortalTarget(null);
		};
	}, [postType]);

	if (postType !== "sp_eap_template" || !portalTarget) {
		return null;
	}

	const idForShortcode = postId || 0;
	const shortcode = `[sp_eap_template id="${idForShortcode}"]`;
	const savedTemplatesUrl =
		(window.sp_eab_localize_data && window.sp_eab_localize_data.savedTemplatesUrl) ||
		(window.sp_eab_admin_dashboard_localize && window.sp_eab_admin_dashboard_localize.savedTemplatesUrl) ||
		"";

	const handleCopy = async () => {
		const ok = await copyText(shortcode);
		if (!ok) {
			return;
		}
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1500);
	};

	return createPortal(
		<div className="speap-shortcode-panel">
			<p className="speap-shortcode-panel__intro">
				{__("You can use this shortcode anywhere and manage it from", "easy-accordion-free")}{" "}
				<a className="speap-shortcode-panel__link hello" href={savedTemplatesUrl} rel="noopener noreferrer">
					{__("Saved Templates.", "easy-accordion-free")}
				</a>
			</p>
			<button
				type="button"
				className="speap-shortcode-panel__chip"
				onClick={handleCopy}
				aria-label={
					copied ? __("Shortcode copied", "easy-accordion-free") : __("Copy shortcode", "easy-accordion-free")
				}
			>
				<span className="speap-shortcode-panel__code">{shortcode}</span>
				<span className="speap-shortcode-panel__copy">
					{copied ? <span className="speap-shortcode-panel__copy-text">Copied!</span> : <CopyIcon />}
				</span>
			</button>
		</div>,
		portalTarget
	);
};

registerPlugin("speap-saved-template-sidebar", {
	render: SavedTemplateSidebar,
});
