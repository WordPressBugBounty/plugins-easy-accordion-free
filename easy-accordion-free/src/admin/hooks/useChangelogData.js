import axios from "axios";
import { useState, useEffect } from "@wordpress/element";

const useChangelogData = (showSidebar) => {
	const [queryChangelog, setQueryChangelog] = useState("Loading...");

	const data = new FormData();

	data.append("nonce", sp_eab_admin_dashboard_localize.nonce);
	data.append("action", "sp_eap_changelog_data");

	const fetchApi = async (queryData) => {
		try {
			const response = await axios.post(ajaxurl, queryData);
			const { changelog } = response.data;
			setQueryChangelog(changelog);
		} catch (error) {
			console.error("Error fetching data:", error.message);
		}
	};
	useEffect(() => {
		if (showSidebar) {
			fetchApi(data);
		}
	}, [showSidebar]);
	return queryChangelog;
};

export default useChangelogData;
