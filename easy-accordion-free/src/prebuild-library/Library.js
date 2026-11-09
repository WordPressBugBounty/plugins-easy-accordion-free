import { __ } from "@wordpress/i18n";
import { parse } from "@wordpress/blocks";
import { useState, useEffect, useRef, useCallback } from "@wordpress/element";
import { accordionBlocksInfo } from "@easy-accordion/constants";
import StarterSites from "./starterSites";
import PreviewDrawer from "./PreviewDrawer";
import ErrorBoundary from "./ErrorBoundary";
import { EasyAccordionLogo } from "./icons";
import { API_ENDPOINTS, CSS_CLASSES, KEYBOARD_KEYS } from "./constants";
import "./editor.scss";

// Default attribute values — reset on insert so an imported pattern queries the
// user's own content instead of the demo's saved selection.
const getDefaultAttributes = (blockName = "") => {
	let attr = {
		postType: "post",
		filterPost: "latest",
		selectedTaxonomy: "category",
		selectedTerms: [],
		taxonomies: [
			{
				id: 1,
				type: "",
				value: [],
				operator: "IN",
				initialOpen: true,
			},
		],
		postOperator: "IN",
		includeOnlyPost: [],
		orderBy: "date",
		orderDirection: "DESC",
		postLimit: "8",
		itemPerPage: "4",
		taxonomyFilterEnable: false,
		taxonomyType: "category",
		categoriesToShow: "all",
		includeTerms: [],
		excludeTerms: [],
		displayLimit: "8",
		showEmptyTerms: false,
	};

	if (blockName === "sp-easy-accordion-pro/menu-accordion") {
		attr = {
			...attr,
			orderBy: "title",
			orderDirection: "ASC",
		};
	}

	if (
		blockName === "sp-easy-accordion-pro/product-accordion" ||
		blockName === "sp-easy-accordion-pro/product-accordion-two"
	) {
		attr = {
			...attr,
			postType: "product",
		};
	}

	return attr;
};

/**
 * Reset query-related attributes to defaults after parsing, before insertion.
 * Recurses through innerBlocks. Only touches sp-easy-accordion-pro/* blocks.
 *
 * @param {Array} blocks - Parsed block objects.
 * @return {Array} Modified blocks.
 */
const modifyBlockAttributes = (blocks) => {
	if (!Array.isArray(blocks)) {
		return blocks;
	}

	return blocks.map((block) => {
		const modifiedBlock = {
			...block,
			attributes: {
				...block.attributes,
			},
		};

		if (block.name && block.name.startsWith("sp-easy-accordion-pro/") && block.attributes) {
			const defaultAttributes = getDefaultAttributes(block?.name);

			Object.keys(defaultAttributes)?.forEach((attrName) => {
				if (modifiedBlock.attributes.hasOwnProperty(attrName)) {
					const defaultValue = defaultAttributes[attrName];
					modifiedBlock.attributes[attrName] = Array.isArray(defaultValue)
						? JSON.parse(JSON.stringify(defaultValue))
						: defaultValue;
				}
			});
		}

		if (block.innerBlocks && Array.isArray(block.innerBlocks) && block.innerBlocks.length > 0) {
			modifiedBlock.innerBlocks = modifyBlockAttributes(block.innerBlocks);
		}

		return modifiedBlock;
	});
};

/**
 * Humanized label for a block slug the block map does not know.
 *
 * @param {string} slug Block slug.
 * @return {string} Label.
 */
const humanizeSlug = (slug) =>
	slug.replace(/-(\w)/g, (_, char) => " " + char.toUpperCase()).replace(/^(\w)/, (_, char) => char.toUpperCase());

// Main Library Component.
const Library = (props) => {
	const [wishListArr, setWishlistArr] = useState([]);
	// Pattern currently shown in the preview drawer (null = drawer closed). A ref
	// mirrors it so the document-level ESC handler (registered once) can read the
	// latest value without a stale closure.
	const [previewPattern, setPreviewPattern] = useState(null);
	const previewPatternRef = useRef(null);
	// The grid's visible patterns when the preview opened — the drawer's Prev / Next sequence.
	const [previewList, setPreviewList] = useState([]);
	const modalRef = useRef(null);

	const showPreview = useCallback((pattern) => {
		if (!pattern) {
			return;
		}
		previewPatternRef.current = pattern;
		setPreviewPattern(pattern);
	}, []);
	const openPreview = useCallback(
		(pattern, list = []) => {
			setPreviewList(list);
			showPreview(pattern);
		},
		[showPreview]
	);
	const closePreview = useCallback(() => {
		previewPatternRef.current = null;
		setPreviewPattern(null);
	}, []);
	const isBlockPattern = props.currentBlockName ? true : false;
	const currentBlockName = props.currentBlockName || "all";
	// `initialBlockType` only *preselects* the Block Type facet — unlike
	// `currentBlockName` it keeps the sidebar visible and `designs` holding the
	// full catalog, so the user can widen back out to "All Patterns".
	const initialBlockType = !isBlockPattern && props.initialBlockType ? props.initialBlockType : "";
	// The preselect is a one-shot: once consumed, a later refetch (the Refresh
	// button) must keep whatever facet the user has since chosen.
	const preselectAppliedRef = useRef(false);

	const [state, setState] = useState({
		isPopup: props.isShow || false,
		designs: [],
		reloadId: "",
		reload: false,
		error: false,
		fetching: false,
		designFilter: initialBlockType || currentBlockName || "all",
		current: [],
		blocks: [],
		categoryTypes: [],
		freeCount: false,
		proCount: false,
		loading: false,
	});

	const { isPopup, designFilter, reload, reloadId } = state;
	// Flatten the grouped pattern object ({ blockSlug: items[] }) into a single
	// array, tagging each item with its block slug so it can be filtered by block.
	// The same pattern can exist under multiple block slugs; render it once.
	const handleDesignData = (patternsData) => {
		const transformedData = [];
		const seenIds = new Set();
		for (const blockSlug in patternsData) {
			if (!Array.isArray(patternsData[blockSlug])) {
				continue;
			}
			patternsData[blockSlug].forEach((item) => {
				if (seenIds.has(item.ID)) {
					return;
				}
				seenIds.add(item.ID);
				transformedData.push({
					...item,
					blockCategory: blockSlug,
				});
			});
		}
		return transformedData;
	};

	// Fetch Premade pattern data from the Ready Patterns REST API.
	const fetchTemplates = async () => {
		setState((prev) => ({ ...prev, loading: true, error: false }));
		try {
			const response = await wp.apiFetch({
				path: API_ENDPOINTS.PATTERNS,
				method: "POST",
				data: { type: "get_data" },
			});

			if (!response) {
				throw new Error(__("No response received from server", "easy-accordion-free"));
			}

			if (response.success && response.data) {
				const parsed = JSON.parse(response.data);

				// Two catalog shapes arrive here: the v2 envelope
				// { meta_data: { blocks, categories }, patterns: { blockSlug: [] } } and
				// the legacy flat { blockSlug: [] } with no meta at all. Block Type and
				// Category Type facets come from meta_data — nothing hard-coded; on the
				// legacy shape the block axis is derived from the slug keys and the
				// category axis render-gates off until the remote upgrades.
				const hasEnvelope = parsed && parsed.meta_data && parsed.patterns;
				const patternsData = hasEnvelope ? parsed.patterns : parsed;
				const meta = hasEnvelope ? parsed.meta_data : {};
				const blocks = Array.isArray(meta.blocks)
					? meta.blocks
					: Object.keys(patternsData).map((slug) => ({
							label: accordionBlocksInfo[`sp-easy-accordion-pro/${slug}`]?.title || humanizeSlug(slug),
							value: slug,
							count: Array.isArray(patternsData[slug]) ? patternsData[slug].length : 0,
						}));
				const categoryTypes = Array.isArray(meta.categories) ? meta.categories : [];

				const designData = handleDesignData(patternsData);
				const freeCount = designData.filter((data) => !data.pro).length;
				const proCount = designData.filter((data) => data.pro).length;

				let categorisedData = [];
				const dataForCategory = isBlockPattern && currentBlockName;

				if (dataForCategory) {
					categorisedData = patternsData[currentBlockName] || [];
				}

				// The preselect arrives from a URL arg, so only honour it when the
				// catalog actually advertises that block — an unknown slug would
				// otherwise leave the grid permanently empty.
				const isKnownBlockType =
					initialBlockType && blocks.some((block) => String(block.value) === String(initialBlockType));
				const preselected = isKnownBlockType ? initialBlockType : "all";

				setState((prev) => {
					// First load honours the preselect; a refetch keeps the live facet.
					const nextFilter = preselectAppliedRef.current ? prev.designFilter : preselected;

					return {
						...prev,
						// `designs` always holds the full catalog outside single-block mode,
						// so switching the facet back to "All Patterns" still works.
						current: dataForCategory ? categorisedData : filterByCategoryKey(designData, nextFilter),
						designs: dataForCategory ? categorisedData : designData,
						designFilter: dataForCategory ? prev.designFilter : nextFilter,
						blocks,
						categoryTypes,
						freeCount,
						proCount,
						loading: false,
						error: false,
					};
				});
				preselectAppliedRef.current = true;
			} else {
				throw new Error(response.message || __("Failed to load patterns", "easy-accordion-free"));
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error fetching templates:", error);
			setState((prev) => ({
				...prev,
				loading: false,
				error: error.message || __("An unexpected error occurred", "easy-accordion-free"),
			}));
		}
	};

	// Force fetch and refresh local JSON cache
	const fetchAllData = async () => {
		setState((prev) => ({ ...prev, fetching: true }));

		try {
			const response = await wp.apiFetch({
				path: API_ENDPOINTS.PATTERNS,
				method: "POST",
				data: { type: "refresh" }, // tells PHP to re-fetch from remote
			});

			if (!response) {
				throw new Error(__("No response received from server", "easy-accordion-free"));
			}

			if (response.success) {
				// after successful refresh, reload data
				await fetchTemplates();
			} else {
				throw new Error(response.message || __("Failed to refresh patterns", "easy-accordion-free"));
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error fetching all data:", error);
			setState((prev) => ({
				...prev,
				error: error.message || __("Failed to refresh data", "easy-accordion-free"),
			}));
		} finally {
			setState((prev) => ({ ...prev, fetching: false }));
		}
	};

	// Close modal — through the mount owner (unmounts the React root), with a
	// node-removal fallback when no owner was passed.
	const closeModal = () => {
		if (props.onClose) {
			props.onClose();
			return;
		}
		const element = document.querySelector(`.${CSS_CLASSES.MODAL}`);
		if (element) {
			element.remove();
		}
		setState((prev) => ({ ...prev, isPopup: false }));
	};

	// Clicking the dimmed backdrop (outside the modal box) closes the modal — but
	// never while the preview drawer is open (the drawer owns that interaction).
	const handleBackdropMouseDown = (e) => {
		if (previewPatternRef.current) {
			return;
		}
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			closeModal();
		}
	};

	// Handle ESC key press
	const handleKeyDown = (e) => {
		if (e.keyCode === KEYBOARD_KEYS.ESCAPE) {
			if (previewPatternRef.current) {
				closePreview();
			} else {
				closeModal();
			}
		}
	};

	// Insert block into editor
	const insertBlock = async (templateID) => {
		if (!templateID) {
			return;
		}
		// delete block if user insert pattern from layout selector popup.
		if (props?.removeBlock) {
			props?.removeBlock();
		}
		setState((prev) => ({
			...prev,
			reload: true,
			reloadId: templateID,
		}));
		try {
			const response = await fetch(API_ENDPOINTS.SINGLE_PATTERN, {
				method: "POST",
				headers: {
					"Content-Type": "application/x-www-form-urlencoded",
				},
				body: new URLSearchParams({
					license: "",
					template_id: templateID,
				}),
			});

			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}
			const jsonData = await response.json();
			if (jsonData.success && jsonData.rawData) {
				const blockEditor = wp.data.dispatch("core/block-editor");
				if (blockEditor && blockEditor.insertBlocks) {
					// Parse the raw block data - parse() returns an array of blocks
					let blocks = [];
					try {
						blocks = parse(jsonData.rawData);
					} catch (parseError) {
						throw new Error(__("Failed to parse block data", "easy-accordion-free"));
					}

					// Validate that blocks is an array and not empty
					if (!Array.isArray(blocks)) {
						throw new Error(__("Invalid block data format", "easy-accordion-free"));
					}

					if (blocks.length === 0) {
						throw new Error(__("No blocks found in pattern", "easy-accordion-free"));
					}

					// Reset query attrs so the pattern uses the user's content.
					blocks = modifyBlockAttributes(blocks);

					// Insert all blocks into the editor
					// insertBlocks accepts an array of block objects
					blockEditor.insertBlocks(blocks);

					closeModal();
					setState((prev) => ({
						...prev,
						isPopup: false,
						reload: false,
						reloadId: "",
						error: false,
					}));
				} else {
					throw new Error(__("Block editor is not available", "easy-accordion-free"));
				}
			} else {
				throw new Error(jsonData.message || __("Failed to import pattern", "easy-accordion-free"));
			}
		} catch (error) {
			setState((prev) => ({
				...prev,
				error: error.message || __("Failed to import pattern", "easy-accordion-free"),
				reload: false,
			}));
		}
	};

	// Handle block import. Pro patterns are locked in the free plugin — their
	// cards and the preview drawer show an upgrade link instead of Insert.
	const handleBlockImport = (templateID, isPro = false) => {
		if (isPro) {
			return;
		}
		insertBlock(templateID);
	};

	// Split archive data by block slug (set on each item as `blockCategory`).
	const filterByCategoryKey = (data = [], key = "") => {
		// Return early if no data or not an array
		if (!Array.isArray(data) || data.length === 0) {
			return [];
		}

		// If key is empty or 'all', return all data
		if (!key || key === "all") {
			return data;
		}

		return data.filter((item) => item?.blockCategory === key);
	};

	// Handle wishlist actions
	const handleWishlistAction = async (id, action = "", type = "") => {
		try {
			const response = await wp.apiFetch({
				path: API_ENDPOINTS.WISHLIST,
				method: "POST",
				data: { id, action, type },
			});

			if (!response) {
				throw new Error(__("No response received from server", "easy-accordion-free"));
			}

			if (response.success) {
				const wishlist = Array.isArray(response.wishListArr)
					? response.wishListArr
					: Object.values(response.wishListArr || {});
				setWishlistArr(wishlist);
			} else {
				throw new Error(response.message || __("Failed to update wishlist", "easy-accordion-free"));
			}
		} catch (error) {
			// eslint-disable-next-line no-console
			console.error("Error updating wishlist:", error);
			// Optionally show user-friendly error message
		}
	};

	// Initialize on mount
	useEffect(() => {
		handleWishlistAction("", "", "fetchData");
		fetchTemplates();
		document.addEventListener("keydown", handleKeyDown);

		return () => {
			document.removeEventListener("keydown", handleKeyDown);
		};
	}, []);

	return (
		<>
			{isPopup && (
				<ErrorBoundary
					onError={(error, errorInfo) => {
						// eslint-disable-next-line no-console
						console.error("Library Error Boundary:", error, errorInfo);
					}}
					onRetry={fetchTemplates}
				>
					<div className="sp-eap-ready-patterns-backdrop" onMouseDown={handleBackdropMouseDown}>
						<div
							className="sp-eap-ready-patterns-modal"
							ref={modalRef}
							role="dialog"
							aria-modal="true"
							aria-label={__("Ready Patterns Library", "easy-accordion-free")}
						>
							<header className="sp-eap-ready-patterns-header">
								<div className="sp-eap-ready-patterns-brand">
									<EasyAccordionLogo />
									<h2 className="sp-eap-ready-patterns-title">
										{__("Ready Patterns Library", "easy-accordion-free")}
									</h2>
								</div>
								<div className="sp-eap-ready-patterns-header-actions">
									<button
										type="button"
										className="sp-eap-ready-patterns-close"
										onClick={closeModal}
										aria-label={__("Close", "easy-accordion-free")}
									>
										<span className="dashicons dashicons-no-alt" />
									</button>
								</div>
							</header>

							<StarterSites
								filterValue={designFilter}
								currentBlockName={props.currentBlockName}
								isSingleBlock={isBlockPattern}
								state={state}
								setState={setState}
								_fetchFile={fetchAllData}
								_changeVal={handleBlockImport}
								filterByCategoryKey={filterByCategoryKey}
								setWListAction={handleWishlistAction}
								wishListArr={wishListArr}
								setWishlistArr={setWishlistArr}
								onPreview={openPreview}
							/>

							{previewPattern ? (
								<PreviewDrawer
									pattern={previewPattern}
									patterns={previewList}
									onNavigate={showPreview}
									onClose={closePreview}
									onInsert={() => handleBlockImport(previewPattern.ID, previewPattern.pro)}
									isInserting={reload && reloadId === previewPattern.ID}
								/>
							) : null}
						</div>
					</div>
				</ErrorBoundary>
			)}
		</>
	);
};

export default Library;
