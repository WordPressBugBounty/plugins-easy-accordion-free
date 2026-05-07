import { __ } from "@wordpress/i18n";
import { useCallback, useMemo, memo, useState } from "@wordpress/element";
import { decodeEntities } from "@wordpress/html-entities";
import { RadioControl, Tooltip } from "@wordpress/components";
import { HeartIcon, HeartIconFull, ImportIcon, PreviewIcon, ProBadgeIcon, RotateIcon } from "./icons";
import { DEFAULTS, KEYBOARD_KEYS, API_ENDPOINTS } from "./constants";
import { FilterPart, HeaderWithFilter } from "./filter/filterPart";
import { currentBlockTitle } from "./controls";

const RenderFilterLabel = ({ label, number }) => {
	return (
		<>
			<span>{label}</span>
			<span>{`(${number || 0})`}</span>
		</>
	);
};

const getPatternCategories = (categoryCounts, allCount) => {
	return [
		{
			label: <RenderFilterLabel label="All Patterns" number={allCount} />,
			value: "all",
		},
		...Object.keys(categoryCounts).map((blockName) => ({
			label: <RenderFilterLabel label={currentBlockTitle(blockName)} number={categoryCounts[blockName]} />,
			value: blockName,
		})),
	];
};

const Skeleton = (props) => {
	const { type, size, loop, unit, c_s, classes } = props;

	const getSize = () => {
		let css = {};
		switch (type) {
			case "image":
			case "circle":
				css = {
					width: size ? size + "px" : "300px",
					height: size ? size + "px" : "300px",
				};
				break;
			case "title":
				css = {
					width: `${size ? size : "100"}${unit ? unit : "%"}`,
				};
				break;
			case "button":
				css = { width: size ? size + "px" : "90px" };
				break;
			case "custom_size":
				css = {
					width: `${c_s.size1 ? c_s.size1 : "100"}${c_s.unit1 ? c_s.unit1 : "%"}`,
					height: `${c_s.size2 ? c_s.size2 : "20"}${c_s.unit2 ? c_s.unit2 : "px"}`,
					borderRadius: c_s.br ? c_s.br + "px" : "0px",
				};
				break;
			default:
				break;
		}
		return css;
	};
	return (
		<>
			{loop ? (
				<>
					{Array(parseInt(loop))
						.fill("1")
						.map((x, i) => {
							return (
								<div
									key={i}
									className={`sp_eab_patterns_skeleton__${type} sp-eap_patterns_frequency loop ${
										classes ? classes : ""
									}`}
									style={getSize()}
								></div>
							);
						})}
				</>
			) : (
				<div
					className={`sp_eab_patterns_skeleton__${type} sp-eap_patterns_frequency ${classes ? classes : ""}`}
					style={getSize()}
				></div>
			)}
		</>
	);
};

// Individual Card Component.
const PremadeCard = memo(({ data, wishListArr, setWListAction, reload, reloadId, onImport }) => {
	const isInWishlist = wishListArr?.includes(String(data.ID));
	const isLoading = reload && reloadId === data.ID;
	const isPro = data.pro;
	// const isPro = false;
	const handleWishlistClick = useCallback(() => {
		setWListAction(data.ID, isInWishlist ? "remove" : "");
	}, [data.ID, isInWishlist, setWListAction]);

	const handleImportClick = useCallback(() => {
		if (!isPro) {
			onImport(data.ID, data.pro);
		}
	}, [data.ID, data.pro, isPro, onImport]);

	return (
		<div className="sp-eab-pattern-card-body">
			<div className="sp-eap-patterns-item-list">
				<div className="sp-eap-patterns-item-list-overlay">
					<a className="sp-eap-pattern-img">
						<img src={data.image} loading="lazy" alt={data.name} />
					</a>
					<div className="sp-eap-pattern-overlay">
						<a
							className="sp-eap-patterns-overlay-view"
							href={`https://easyaccordion.io/patterns/#demo${data.ID}`}
							target="_blank"
							rel="noopener noreferrer"
							aria-label={__("Preview", "easy-accordion-free") + " " + data.name}
						>
							<PreviewIcon />
						</a>
					</div>
				</div>

				<div className="sp-eap-patterns-item-list-info">
					<div className="sp-eab-patterns-item-info">
						<span>{decodeEntities(data?.name || "")}</span>
					</div>

					<span className="sp-eap-patterns-action-btn">
						<Tooltip
							text={
								isInWishlist
									? __("Remove from wishlist", "easy-accordion-free")
									: __("Add to wishlist", "easy-accordion-free")
							}
							delay={300}
							placement="top"
						>
							<span
								className="sp-eap-pattern-wishlist"
								onClick={handleWishlistClick}
								role="button"
								tabIndex={0}
								onKeyPress={(e) => {
									if (e.key === KEYBOARD_KEYS.ENTER || e.key === KEYBOARD_KEYS.SPACE) {
										handleWishlistClick();
									}
								}}
								aria-label={
									isInWishlist
										? __("Remove from wishlist", "easy-accordion-free")
										: __("Add to wishlist", "easy-accordion-free")
								}
							>
								{isInWishlist ? <HeartIconFull /> : <HeartIcon />}
							</span>
						</Tooltip>

						{isPro ? (
							<a
								className="sp-eap-patterns-btn-pro"
								target="_blank"
								rel="noopener noreferrer"
								href={API_ENDPOINTS.UPGRADE_URL}
								aria-label={__("Upgrade to Pro to access this pattern", "easy-accordion-free")}
							>
								<ProBadgeIcon /> {__("PRO", "easy-accordion-free")}
							</a>
						) : (
							<span
								onClick={handleImportClick}
								className="sp-eap-patterns-import-btn"
								role="button"
								tabIndex={0}
								onKeyPress={(e) => {
									if (e.key === KEYBOARD_KEYS.ENTER || e.key === KEYBOARD_KEYS.SPACE) {
										handleImportClick();
									}
								}}
								aria-label={__("Import", "easy-accordion-free") + " " + data.name}
								style={
									isLoading
										? {
												pointerEvents: "none",
												opacity: 0.6,
											}
										: {}
								}
							>
								{isLoading ? (
									<i className=" sp-rotate">
										<RotateIcon />
									</i>
								) : (
									<>
										<ImportIcon /> {__("Import", "easy-accordion-free")}
									</>
								)}
							</span>
						)}
					</span>
				</div>
			</div>
		</div>
	);
});

// Loading Skeleton Component.
const LoadingSkeleton = memo(() => (
	<div className="sp-eap-pattern-grid sp-eap-pattern-col3 skeletonOverflow">
		{Array(25)
			.fill(null)
			.map((_, i) => (
				<div key={i} className="sp-eap-patterns-item-list">
					<div className="sp-eap-patterns-item-list-overlay">
						<Skeleton
							type="custom_size"
							c_s={{
								size1: 100,
								unit1: "%",
								size2: 400,
								unit2: "px",
							}}
						/>
					</div>
					<div className="sp-eap-patterns-item-list-info">
						<Skeleton
							type="custom_size"
							c_s={{
								size1: 50,
								unit1: "%",
								size2: 25,
								unit2: "px",
								br: 2,
							}}
						/>
						<span className="sp-eap-patterns-action-btn">
							<span className="sp-eap-pattern-wishlist">
								<Skeleton
									type="custom_size"
									c_s={{
										size1: 30,
										unit1: "px",
										size2: 25,
										unit2: "px",
										br: 2,
									}}
								/>
							</span>
							<Skeleton
								type="custom_size"
								c_s={{
									size1: 70,
									unit1: "px",
									size2: 25,
									unit2: "px",
									br: 2,
								}}
							/>
						</span>
					</div>
				</div>
			))}
	</div>
));

// Empty State Component.
const EmptyState = memo(() => (
	<span className="sp-eap-patterns-image-rotate">{__("No Data found...", "easy-accordion-free")}</span>
));

// Main Grid Component.
const PremadeGrid = memo(
	({
		premadeLists,
		column,
		searchQuery,
		freePro,
		showWishList,
		wishListArr,
		// localizedData,
		setWListAction,
		reload,
		reloadId,
		onImport,
		loading,
	}) => {
		// Memoize filter function
		const filteredLists = useMemo(() => {
			return premadeLists.filter((data) => {
				const searchMatch = !searchQuery || data.name?.toLowerCase().includes(searchQuery.toLowerCase());

				const freeProMatch =
					freePro === "all" || (freePro === "pro" && data.pro) || (freePro === "free" && !data.pro);
				const wishListMatch = !showWishList || wishListArr?.includes(String(data.ID));
				return searchMatch && freeProMatch && wishListMatch;
			});
		}, [premadeLists, searchQuery, freePro, showWishList, wishListArr]);

		// Loading state.
		if (loading) {
			return <LoadingSkeleton />;
		}

		// Empty state
		if (filteredLists.length === 0) {
			return <EmptyState />;
		}

		// Grid with data
		return (
			<div className={`sp-eap-pattern-grid sp-eap-pattern-col${column}`}>
				{filteredLists.map((data) => (
					<PremadeCard
						key={data.ID}
						data={data}
						// localizedData={localizedData}
						wishListArr={wishListArr}
						setWListAction={setWListAction}
						reload={reload}
						reloadId={reloadId}
						onImport={onImport}
					/>
				))}
			</div>
		);
	}
);

// Main StarterSites Component
const StarterSites = (props) => {
	const {
		filterValue,
		state,
		setState,
		// useState,
		// useEffect,
		// useRef,
		_changeVal,
		filterByCategoryKey,
		setWListAction,
		wishListArr,
		_fetchFile,
		onClose,
		currentBlockName,
		isSingleBlock,
	} = props;

	const { current, designs, reload, reloadId, categoryCounts, freeCount, proCount, fetching, loading } = state;

	// const localizedData = sp_eab_patterns_post_block_localize || {};
	// Local state management.
	const [column, setColumn] = useState(DEFAULTS.COLUMN);
	const [searchQuery, setSearchQuery] = useState(DEFAULTS.SEARCH_QUERY);
	const [trend, setTrend] = useState(DEFAULTS.TREND);
	const [freePro, setFreePro] = useState(DEFAULTS.FREE_PRO);
	const [showWishList, setShowWishList] = useState(false);

	const totalCount = freeCount + proCount;

	// Memoize sorted lists.
	const premadeLists = useMemo(() => {
		if (!current.length) return [];

		const lists = [...current];

		if (trend === "latest" || trend === "all") {
			return lists.sort((a, b) => b.ID - a.ID);
		}

		if (trend === "popular" && lists[0]?.hit !== undefined) {
			return lists.sort((a, b) => b.hit - a.hit);
		}

		return lists;
	}, [current, trend]);

	const allCategoryCount = premadeLists?.length;

	const patternCategories = getPatternCategories(categoryCounts, totalCount);

	// Handle filter changes.
	const handleFilterChange = useCallback(
		(type) => {
			const filteredData = type === "all" ? designs : filterByCategoryKey(designs, type);
			setState((prev) => ({
				...prev,
				designFilter: type,
				current: filteredData,
			}));
		},
		[designs, filterByCategoryKey, setState]
	);

	// Unified state change handler.
	const changeStates = useCallback(
		(type, value) => {
			const handlers = {
				freePro: () => setFreePro(value),
				search: () => setSearchQuery(value),
				column: () => setColumn(value),
				wishlist: () => setShowWishList(value),
				trend: () => setTrend(value),
				filter: () => handleFilterChange(value),
			};

			handlers[type]?.();
		},
		[handleFilterChange]
	);

	// Memoize import handler.
	const handleImport = useCallback(
		(templateID, isPro) => {
			_changeVal(templateID, isPro);
		},
		[_changeVal]
	);

	const freeProOptions = [
		{
			value: "all",
			label: <RenderFilterLabel label="All" number={totalCount} />,
		},
		{
			value: "free",
			label: <RenderFilterLabel label="Free" number={freeCount} />,
		},
		{
			value: "pro",
			label: <RenderFilterLabel label="Pro" number={proCount} />,
		},
	];

	return (
		<>
			{isSingleBlock && (
				<HeaderWithFilter
					changeStates={changeStates}
					useState={useState}
					onClose={onClose}
					currentBlockName={currentBlockName}
					column={column}
					showWishList={showWishList}
					searchQuery={searchQuery}
					fetching={fetching}
					_fetchFile={_fetchFile}
					fields={{ filter: true, trend: true, freePro: true }}
					fieldOptions={{
						trendArr: [],
						freeProArr: [],
					}}
					fieldValue={{ filter: filterValue, trend, freePro }}
					wishListArr={wishListArr}
				/>
			)}
			<div className="sp-eap-patterns-template-wrap sp-eab-pattern">
				{!isSingleBlock && (
					<div className="sp-eap-patterns-left-sidebar">
						<RadioControl
							label={__("Pattern Type", "easy-accordion-free")}
							selected={freePro}
							options={freeProOptions}
							onChange={(v) => {
								changeStates("freePro", v);
							}}
						/>
						<RadioControl
							label={__("Block Type", "easy-accordion-free")}
							selected={filterValue}
							options={patternCategories}
							onChange={(v) => {
								changeStates("filter", v);
							}}
						/>
					</div>
				)}
				<div className="sp-eap-pattern-list-container sp-eab-pattern-card">
					{!isSingleBlock && (
						<FilterPart
							changeStates={changeStates}
							useState={useState}
							column={column}
							showWishList={showWishList}
							searchQuery={searchQuery}
							fetching={fetching}
							_fetchFile={_fetchFile}
							fields={{
								filter: true,
								trend: true,
								freePro: true,
							}}
							fieldOptions={{
								trendArr: [],
								freeProArr: [],
							}}
							fieldValue={{
								filter: filterValue,
								trend,
								freePro,
							}}
							wishListArr={wishListArr}
						/>
					)}

					<PremadeGrid
						premadeLists={premadeLists}
						column={column}
						searchQuery={searchQuery}
						freePro={freePro}
						showWishList={showWishList}
						wishListArr={wishListArr}
						// localizedData={localizedData}
						setWListAction={setWListAction}
						reload={reload}
						reloadId={reloadId}
						onImport={handleImport}
						loading={loading}
					/>
				</div>
			</div>
		</>
	);
};

export default StarterSites;
