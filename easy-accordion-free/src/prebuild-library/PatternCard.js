import { __ } from "@wordpress/i18n";
import { memo } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { DownloadIcon, HeartIcon, HeartIconFull } from "./icons";
import ProUpgradeLink from "./ProUpgradeLink";

/**
 * Single pattern card: a fixed 3:2 thumbnail with a hover overlay Preview
 * button, and a footer row of title + favorite + import (an upgrade link on
 * Pro patterns).
 *
 * @param {Object}   props
 * @param {Object}   props.pattern          Pattern item ({ ID, name, image, ... }).
 * @param {Function} props.onInsert         Insert handler — receives the pattern.
 * @param {Function} props.onPreview        Preview handler — receives the pattern.
 * @param {*}        props.insertingId      ID of the pattern currently importing.
 * @param {boolean}  props.isFavorite       Whether this pattern is in the wishlist.
 * @param {Function} props.onToggleFavorite Toggle-wishlist handler.
 */
const PatternCard = ({ pattern, onInsert, onPreview, insertingId, isFavorite, onToggleFavorite }) => {
	const isBusy = insertingId === pattern.ID;

	return (
		<article className="sp-eap-ready-patterns-card" role="listitem">
			<div className="sp-eap-ready-patterns-card-thumb">
				{pattern.image ? (
					<img src={pattern.image} alt={decodeEntities(pattern.name || "")} loading="lazy" />
				) : (
					<span className="sp-eap-ready-patterns-card-thumb-placeholder" />
				)}
				<button type="button" className="sp-eap-ready-patterns-preview-link" onClick={() => onPreview(pattern)}>
					<span className="dashicons dashicons-visibility" />
					{__("Preview", "easy-accordion-free")}
				</button>
			</div>
			<div className="sp-eap-ready-patterns-card-body">
				<h3 className="sp-eap-ready-patterns-card-title">{decodeEntities(pattern.name || "")}</h3>
				<button
					type="button"
					className={`sp-eap-ready-patterns-favorite-btn${isFavorite ? " is-favorite" : ""}`}
					aria-label={
						isFavorite
							? __("Remove from wishlist", "easy-accordion-free")
							: __("Add to wishlist", "easy-accordion-free")
					}
					aria-pressed={isFavorite}
					onClick={onToggleFavorite}
				>
					{isFavorite ? <HeartIconFull /> : <HeartIcon />}
				</button>
				{pattern.pro ? (
					<ProUpgradeLink />
				) : (
					<button
						type="button"
						className={`sp-eap-ready-patterns-insert-btn${isBusy ? " is-busy" : ""}`}
						onClick={() => onInsert(pattern)}
						disabled={isBusy}
					>
						{isBusy ? __("Inserting…", "easy-accordion-free") : __("Insert", "easy-accordion-free")}
						{isBusy ? (
							<span className="dashicons dashicons-update sp-eap-ready-patterns-spin" />
						) : (
							<DownloadIcon />
						)}
					</button>
				)}
			</div>
		</article>
	);
};

export default memo(PatternCard);
