import { __ } from "@wordpress/i18n";
import { memo } from "@wordpress/element";
import { GridTwoColIcon, GridThreeColIcon } from "./icons";

const SORT_OPTIONS = [
	{ value: "default", label: __("Sort By", "easy-accordion-free") },
	{ value: "popular", label: __("Popular", "easy-accordion-free") },
	{ value: "latest", label: __("Latest", "easy-accordion-free") },
];

/**
 * Main-area toolbar: sort, column density, favorites toggle, refresh.
 *
 * @param {Object}   props
 * @param {string}   props.sort              Active sort key.
 * @param {Function} props.onSortChange      Sort change handler.
 * @param {string}   props.columns           Grid column count ("2"|"3").
 * @param {Function} props.onColumnsChange   Columns change handler.
 * @param {number}   props.favoritesCount    Wishlist item count.
 * @param {boolean}  props.showFavoritesOnly Whether only favorites are shown.
 * @param {Function} props.onToggleFavorites Toggle favorites-only view.
 * @param {Function} props.onRefresh         Refresh handler.
 * @param {boolean}  props.refreshing        Whether a refresh is in flight.
 */
const Toolbar = ({
	sort,
	onSortChange,
	columns,
	onColumnsChange,
	favoritesCount,
	showFavoritesOnly,
	onToggleFavorites,
	onRefresh,
	refreshing,
}) => {
	const activeSortLabel =
		SORT_OPTIONS.find((option) => option.value === sort)?.label || __("Sort By", "easy-accordion-free");

	return (
		<div className="sp-eap-ready-patterns-toolbar">
			<div className="sp-eap-ready-patterns-toolbar-left">
				<div className="sp-eap-ready-patterns-sort">
					<span className="sp-eap-ready-patterns-sort-label">{activeSortLabel}</span>
					<span className="dashicons dashicons-arrow-down-alt2 sp-eap-ready-patterns-sort-chevron" />
					<select
						className="sp-eap-ready-patterns-sort-select"
						value={sort}
						onChange={(event) => onSortChange(event.target.value)}
						aria-label={__("Sort patterns", "easy-accordion-free")}
					>
						{SORT_OPTIONS.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				</div>
			</div>

			<div className="sp-eap-ready-patterns-toolbar-actions">
				<div className="sp-eap-ready-patterns-density">
					<button
						type="button"
						className={`sp-eap-ready-patterns-density-btn${columns === "2" ? " is-active" : ""}`}
						aria-pressed={columns === "2"}
						aria-label={__("2 columns", "easy-accordion-free")}
						onClick={() => onColumnsChange("2")}
					>
						<GridTwoColIcon />
					</button>
					<button
						type="button"
						className={`sp-eap-ready-patterns-density-btn${columns === "3" ? " is-active" : ""}`}
						aria-pressed={columns === "3"}
						aria-label={__("3 columns", "easy-accordion-free")}
						onClick={() => onColumnsChange("3")}
					>
						<GridThreeColIcon />
					</button>
				</div>

				<button
					type="button"
					className={`sp-eap-ready-patterns-favorites-btn${showFavoritesOnly ? " is-active" : ""}`}
					aria-pressed={showFavoritesOnly}
					aria-label={
						showFavoritesOnly
							? __("Showing wishlist", "easy-accordion-free")
							: __("Show wishlist only", "easy-accordion-free")
					}
					onClick={onToggleFavorites}
				>
					<span className="dashicons dashicons-heart" />
					{favoritesCount > 0 ? (
						<span className="sp-eap-ready-patterns-favorites-count">{favoritesCount}</span>
					) : null}
				</button>

				<button
					type="button"
					className={`sp-eap-ready-patterns-refresh-btn${refreshing ? " is-refreshing" : ""}`}
					aria-label={__("Refresh", "easy-accordion-free")}
					onClick={onRefresh}
					disabled={refreshing}
				>
					<span className="dashicons dashicons-update" />
				</button>
			</div>
		</div>
	);
};

export default memo(Toolbar);
