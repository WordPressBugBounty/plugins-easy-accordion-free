import { __ } from "@wordpress/i18n";
import { memo } from "@wordpress/element";

/**
 * One facet row: label + count badge + active state.
 *
 * @param {Object}   props
 * @param {string}   props.label    Row label.
 * @param {number}   props.count    Item count badge.
 * @param {boolean}  props.isActive Whether this row is selected.
 * @param {Function} props.onSelect Click handler.
 */
const FacetRow = ({ label, count, isActive, onSelect }) => (
	<button
		type="button"
		className={`sp-eap-ready-patterns-category${isActive ? " is-active" : ""}`}
		aria-pressed={isActive}
		onClick={onSelect}
	>
		<span className="sp-eap-ready-patterns-category-label">{label}</span>
		<span className="sp-eap-ready-patterns-badge">{count ?? 0}</span>
	</button>
);

/**
 * Left sidebar: tier (All/Free/Pro), search, and the Block Type + Category Type
 * browse axes. Axes with a single option are not rendered — the legacy remote
 * catalog ships no category meta, so the Category Type axis stays hidden until
 * the remote upgrades.
 *
 * @param {Object}   props
 * @param {string}   props.tier                 Active tier ("all"|"free"|"pro").
 * @param {Function} props.onTierChange         Tier change handler.
 * @param {Object}   props.tierCounts           { all, free, pro } counts.
 * @param {string}   props.search               Search query.
 * @param {Function} props.onSearchChange       Search change handler.
 * @param {string}   props.blockType            Active Block Type filter.
 * @param {Function} props.onBlockTypeChange    Block Type change handler.
 * @param {Array}    props.blockOptions         [{ label, value, count }] (incl. "all").
 * @param {string}   props.categoryType         Active Category Type filter.
 * @param {Function} props.onCategoryTypeChange Category Type change handler.
 * @param {Array}    props.categoryOptions      [{ label, value, count }] (incl. "all").
 */
const Sidebar = ({
	tier,
	onTierChange,
	tierCounts,
	search,
	onSearchChange,
	blockType,
	onBlockTypeChange,
	blockOptions,
	categoryType,
	onCategoryTypeChange,
	categoryOptions,
}) => {
	const tierOptions = [
		{ value: "all", label: __("All", "easy-accordion-free") },
		{ value: "free", label: __("Free", "easy-accordion-free") },
		{ value: "pro", label: __("Pro", "easy-accordion-free") },
	];

	return (
		<aside className="sp-eap-ready-patterns-sidebar">
			<div className="sp-eap-ready-patterns-tier">
				{tierOptions.map((option) => (
					<button
						key={option.value}
						type="button"
						className={`sp-eap-ready-patterns-tier-btn${option.value === tier ? " is-active" : ""}`}
						aria-pressed={option.value === tier}
						onClick={() => onTierChange(option.value)}
					>
						{option.label}
						<span className="sp-eap-ready-patterns-tier-count">{tierCounts?.[option.value] ?? 0}</span>
					</button>
				))}
			</div>

			<div className="sp-eap-ready-patterns-search">
				<label className="screen-reader-text" htmlFor="sp-eap-ready-patterns-search-input">
					{__("Search patterns", "easy-accordion-free")}
				</label>
				<span className="dashicons dashicons-search" />
				<input
					type="search"
					id="sp-eap-ready-patterns-search-input"
					className="sp-eap-ready-patterns-search-input"
					placeholder={__("Search patterns", "easy-accordion-free")}
					value={search}
					onChange={(event) => onSearchChange(event.target.value)}
				/>
			</div>

			{blockOptions && blockOptions.length > 1 ? (
				<>
					<h3 className="sp-eap-ready-patterns-sidebar-heading">{__("Block Type", "easy-accordion-free")}</h3>
					<nav
						className="sp-eap-ready-patterns-categories"
						aria-label={__("Pattern block types", "easy-accordion-free")}
					>
						{blockOptions.map((option) => (
							<FacetRow
								key={option.value}
								label={option.label}
								count={option.count}
								isActive={String(blockType) === String(option.value)}
								onSelect={() => onBlockTypeChange(option.value)}
							/>
						))}
					</nav>
				</>
			) : null}

			{categoryOptions && categoryOptions.length > 1 ? (
				<>
					<h3 className="sp-eap-ready-patterns-sidebar-heading">
						{__("Category Type", "easy-accordion-free")}
					</h3>
					<nav
						className="sp-eap-ready-patterns-categories"
						aria-label={__("Pattern categories", "easy-accordion-free")}
					>
						{categoryOptions.map((option) => (
							<FacetRow
								key={option.value}
								label={option.label}
								count={option.count}
								isActive={String(categoryType) === String(option.value)}
								onSelect={() => onCategoryTypeChange(option.value)}
							/>
						))}
					</nav>
				</>
			) : null}
		</aside>
	);
};

export default memo(Sidebar);
