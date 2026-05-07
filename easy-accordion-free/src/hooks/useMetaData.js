import { useEffect, useState } from "@wordpress/element";
import { filterDndSelectValues, filteredTaxonomiesValues, queryFn, jsonStringify } from "@easy-accordion/controls";

const useMetaData = (attributes, editSite = "frontend") => {
	const { postType, postLimit, orderBy, orderDirection, filterProduct, blockName, filterPost, page_id } = attributes;

	const postId = 0;

	const [metaData, setMetaData] = useState({
		authors: [],
		authorList: [],
		postCount: {},
		imageSizes: [],
		allPostTypes: [],
	});

	const dependencies = {
		postType,
		blockName,
		postLimit,
		orderBy,
		orderDirection,
		filterProduct,
		filterPost,
		postId,
		page_id,
		editSite,
	};

	const queryData = {
		...dependencies,
	};

	const data = new FormData();
	// const queryData = { postType, multiplePostType };
	data.append("nonce", sp_eab_localize_data.spEabAjaxNonce);
	data.append("action", "eab_meta_data_query");
	data.append("metaQueryData", jsonStringify(queryData));

	const fetchMetaData = async () => {
		try {
			const apiData = await queryFn(data);
			const { authors, post_count, image_sizes, all_post_type_list } = apiData;
			setMetaData({
				authors,
				postCount: post_count,
				imageSizes: image_sizes,
				allPostTypes: all_post_type_list ? all_post_type_list : {},
			});
		} catch (error) {
			console.log("Error fetching metadata:", error.message);
		}
	};

	useEffect(() => {
		const allTemplatesRoute =
			window.location.search.includes("p=%2Ftemplate") || window.location.search.includes("p=/template");
		if (!allTemplatesRoute) {
			fetchMetaData();
		}
	}, [jsonStringify(queryData)]);
	return metaData;
};

export default useMetaData;
