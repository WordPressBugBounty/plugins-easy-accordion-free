import axios from "axios";
import { useState, useEffect } from "@wordpress/element";

const useChangelogData = (showSidebar) => {
	const [status, setStatus] = useState("idle");
	const [changelog, setChangelog] = useState("");
	const [errorMessage, setErrorMessage] = useState("");

	const data = new FormData();

	data.append("nonce", sp_eab_admin_dashboard_localize.nonce);
	data.append("action", "sp_eap_changelog_data");

	const fetchApi = async (queryData) => {
		try {
			setStatus("loading");
			const response = await axios.post(ajaxurl, queryData);
			const { changelog: changelogData } = response.data;
			setChangelog(changelogData);
			setStatus("success");
		} catch (error) {
			console.error("Error fetching data:", error.message);
			setStatus("error");
			setErrorMessage(error.message || "Failed to load changelog");
		}
	};
	useEffect(() => {
		if (showSidebar) {
			fetchApi(data);
		}
	}, [showSidebar]);
	return { status, changelog, errorMessage };
};

export default useChangelogData;
