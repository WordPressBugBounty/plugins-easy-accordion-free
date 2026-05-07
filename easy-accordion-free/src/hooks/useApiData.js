import { useEffect, useState, useMemo } from "@wordpress/element";
import { filterDndSelectValues, filteredTaxonomiesValues, queryFn } from "@easy-accordion/controls";
import { useSelect } from "@wordpress/data";

const useApiData = (attributes) => {
	const {
		postType,
		postLimit,
		taxonomies,
		categories,
		orderBy,
		orderDirection,
		includeOnlyPost,
		termId,
		filterProduct,
		relation,
		currentPage,
		blockName,
		page_id,
		paginationEnable,
		imageLazyLoad,
		imageSrcset,
		featuredImageSize,
		filterPost,
		selectedTerms,
		selectedTaxonomy,
		postOperator,
		itemPerPage,
	} = attributes;

	// Use Gutenberg's current post ID (stable).
	const pageId = useSelect((select) => select("core/editor").getCurrentPostId(), []);
	const postId = page_id || pageId;

	// Initial state.
	const [allData, setAllData] = useState({
		posts: [],
		postCount: {},
		postsStatus: true,
		message: "",
	});

	// -----------------------------------------
	// 1️⃣ Memoize processed values
	// -----------------------------------------

	const filteredTaxonomies = useMemo(
		() => filteredTaxonomiesValues(selectedTaxonomy, selectedTerms),
		[selectedTaxonomy, selectedTerms]
	);

	const filteredIncludedPost = useMemo(() => filterDndSelectValues(includeOnlyPost), [includeOnlyPost]);

	// -----------------------------------------
	// 2️⃣ Memoize query dependencies (stable object)
	// -----------------------------------------

	const queryData = useMemo(
		() => ({
			postType,
			postLimit,
			orderBy,
			orderDirection,
			categories,
			termId,
			filterProduct,
			relation,
			currentPage,
			blockName,
			postId,
			page_id,
			imageLazyLoad,
			imageSrcset,
			featuredImageSize,
			filterPost,
			selectedTerms,
			selectedTaxonomy,
			postOperator,
			paginationEnable,
			taxonomies: filteredTaxonomies,
			includeOnlyPost: filteredIncludedPost,
			itemPerPage,
		}),
		[
			postType,
			postLimit,
			orderBy,
			orderDirection,
			categories,
			termId,
			filterProduct,
			relation,
			currentPage,
			blockName,
			postId,
			page_id,
			imageLazyLoad,
			imageSrcset,
			featuredImageSize,
			filterPost,
			selectedTerms,
			selectedTaxonomy,
			postOperator,
			paginationEnable,
			filteredTaxonomies,
			filteredIncludedPost,
			itemPerPage,
		]
	);

	// -----------------------------------------
	// 3️⃣ Fetch posts only when queryData changes
	// -----------------------------------------

	useEffect(() => {
		let isMounted = true;

		const fetchPosts = async () => {
			try {
				const data = new FormData();
				data.append("action", "eab_post_query");
				data.append("nonce", sp_eab_localize_data.spEabAjaxNonce);
				data.append("queryData", JSON.stringify(queryData));
				const response = await queryFn(data);
				const { posts, post_count, posts_status, message } = response;

				if (isMounted) {
					setAllData({
						posts,
						postCount: post_count,
						postsStatus: posts_status,
						message,
					});
				}
			} catch (error) {
				console.error("Error fetching posts:", error.message);
			}
		};

		fetchPosts();

		return () => {
			isMounted = false;
		};
	}, [queryData]);

	return { ...allData, queryData };
};

export default useApiData;
