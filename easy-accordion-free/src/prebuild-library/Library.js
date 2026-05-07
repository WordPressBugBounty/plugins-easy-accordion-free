import { __ } from "@wordpress/i18n";
import { parse } from "@wordpress/blocks";
import { useState, useEffect } from "@wordpress/element";
import StarterSites from "./starterSites";
import ErrorBoundary from "./ErrorBoundary";
import { CloseIcon, EasyAccordionLogo } from "./icons";
import { API_ENDPOINTS, KEYBOARD_KEYS } from "./constants";
import "./editor.scss";

// Default attribute values.
const getDefaultAttributes = (blockName = "") => {
	let attr = {
		postType: "post",
		postOperator: "IN",
		orderBy: "date",
		orderDirection: "DESC",
		postLimit: "8",
		categoriesToShow: "all",
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

	return attr;
};

/**
 * Modify block attributes after parsing but before insertion
 * This function recursively processes blocks and their innerBlocks
 * to reset query-related attributes to their default values
 *
 * @param {Array} blocks - Array of parsed block objects
 * @returns {Array} - Modified blocks array
 */
const modifyBlockAttributes = (blocks) => {
	if (!Array.isArray(blocks)) {
		return blocks;
	}

	return blocks.map((block) => {
		// Create a new block object to avoid mutating the original
		const modifiedBlock = {
			...block,
			attributes: {
				...block.attributes,
			},
		};
		// Only modify Easy Accordion blocks
		if (block.name && block.name.startsWith("sp-easy-accordion-pro/") && block.attributes) {
			// Reset all query-related attributes to default values if they exist
			const defaultAttributes = getDefaultAttributes(block?.name);

			Object.keys(defaultAttributes)?.forEach((attrName) => {
				if (modifiedBlock.attributes.hasOwnProperty(attrName)) {
					// Get default value
					const defaultValue = defaultAttributes[attrName];
					// Handle array defaults (deep clone)
					if (Array.isArray(defaultValue)) {
						modifiedBlock.attributes[attrName] = JSON.parse(JSON.stringify(defaultValue));
					} else {
						modifiedBlock.attributes[attrName] = defaultValue;
					}
				}
			});
		}

		// Recursively process innerBlocks
		if (block.innerBlocks && Array.isArray(block.innerBlocks) && block.innerBlocks.length > 0) {
			modifiedBlock.innerBlocks = modifyBlockAttributes(block.innerBlocks);
		}

		return modifiedBlock;
	});
};

// Header Component.
const LibraryHeader = ({ onClose }) => {
	return (
		<div className="sp-eap-patterns-popup-header">
			<div className="sp-eap-patterns-popup-filter-title">
				<div className="sp-eap-patterns-popup-filter-image-head">
					<EasyAccordionLogo fill={"#ffffff"} />
					<span>{__("Easy Accordion Patterns Library", "easy-accordion-free")}</span>
				</div>
				<div className="sp-eap-patterns-popup-filter-sync-close">
					<button
						className="sp-eap-patterns-btn-close"
						onClick={onClose}
						id="sp-eap-patterns-btn-close"
						aria-label={__("Close", "easy-accordion-free")}
					>
						<CloseIcon />
					</button>
				</div>
			</div>
		</div>
	);
};

// Main Library Component.
const Library = (props) => {
	const [wishListArr, setWishlistArr] = useState([]);
	const isBlockPattern = props.currentBlockName ? true : false;
	const currentBlockName = props.currentBlockName || "all";

	const [state, setState] = useState({
		isPopup: props.isShow || false,
		designs: [],
		reloadId: "",
		reload: false,
		error: false,
		fetching: false,
		designFilter: currentBlockName || "all",
		current: [],
		sidebarOpen: true,
		templatekitCol: "sp-eap-pattern-col3",
		categoryCounts: false,
		freeCount: false,
		proCount: false,
		loading: false,
	});

	const { isPopup, designFilter } = state;
	// const localizedData = sp_eab_patterns_post_block_localize || {};
	// Transform nested category data to flat array.
	const handleDesignData = (data) => {
		const transformedData = [];
		for (const category in data) {
			data[category].forEach((item) => {
				transformedData.push({
					...item,
					category,
				});
			});
		}
		return transformedData;
	};

	// Fetch Premade pattern data from Location Weather REST API.
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
				const allDesignData = JSON.parse(response.data);
				// Calculate count of items per block category,
				const categoryCounts = {};
				Object.keys(allDesignData).forEach((category) => {
					categoryCounts[category] = Array.isArray(allDesignData[category])
						? allDesignData[category].length
						: 0;
				});

				const designData = handleDesignData(allDesignData);
				const freeCount = designData.filter((data) => !data.pro).length;
				const proCount = designData.filter((data) => data.pro).length;

				let categorisedData = [];
				const dataForCategory = isBlockPattern && currentBlockName;

				if (dataForCategory) {
					categorisedData = allDesignData[currentBlockName] || [];
				}

				setState((prev) => ({
					...prev,
					current: dataForCategory ? categorisedData : designData,
					designs: dataForCategory ? categorisedData : designData,
					categoryCounts,
					freeCount,
					proCount,
					loading: false,
					error: false,
				}));
			} else {
				throw new Error(response.message || __("Failed to load patterns", "easy-accordion-free"));
			}
		} catch (error) {
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
			console.error("Error fetching all data:", error);
			setState((prev) => ({
				...prev,
				error: error.message || __("Failed to refresh data", "easy-accordion-free"),
			}));
		} finally {
			setState((prev) => ({ ...prev, fetching: false }));
		}
	};

	// Close modal
	const closeModal = () => {
		const element = document.querySelector(".sp-eap-patterns-builder-modal");
		if (element) {
			element.remove();
		}
		setState((prev) => ({ ...prev, isPopup: false }));
	};

	// Handle ESC key press
	const handleKeyDown = (e) => {
		if (e.keyCode === KEYBOARD_KEYS.ESCAPE) {
			closeModal();
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

					// Modify block attributes after parsing but before insertion
					// This allows you to change default attributes, reset IDs, etc.
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

	// Handle block import
	const handleBlockImport = (templateID, isPro) => {
		// if ( isPro ) {
		// 	return;
		// }

		insertBlock(templateID);
	};

	// Split archive data by category key.
	const filterByCategoryKey = (data = [], key = "") => {
		// Return early if no data or not an array
		if (!Array.isArray(data) || data.length === 0) {
			return [];
		}

		// If key is empty or 'all', return all data
		if (!key || key === "all") {
			return data;
		}

		return data.filter((item) => {
			const category = item?.category;

			// Handle category as array
			if (Array.isArray(category)) {
				return category.some((cat) => cat?.slug === key);
			}

			// Handle category as string or object
			if (typeof category === "string") {
				return category === key;
			}

			if (category && typeof category === "object") {
				return category.slug === key;
			}

			return false;
		});
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
						console.error("Library Error Boundary:", error, errorInfo);
					}}
					onRetry={fetchTemplates}
				>
					<div className="sp-eap-patterns-builder-modal-shadow">
						<div className="sp-eap-patterns-popup-wrap">
							{!isBlockPattern && <LibraryHeader onClose={closeModal} />}
							<StarterSites
								filterValue={designFilter}
								currentBlockName={props.currentBlockName}
								isSingleBlock={isBlockPattern}
								onClose={closeModal}
								state={state}
								setState={setState}
								_fetchFile={fetchAllData}
								_changeVal={handleBlockImport}
								filterByCategoryKey={filterByCategoryKey}
								setWListAction={handleWishlistAction}
								wishListArr={wishListArr}
								setWishlistArr={setWishlistArr}
							/>
						</div>
					</div>
				</ErrorBoundary>
			)}
		</>
	);
};

export default Library;
