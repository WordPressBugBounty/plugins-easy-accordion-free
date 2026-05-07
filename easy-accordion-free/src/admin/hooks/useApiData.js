import axios from "axios";
import { useState, useEffect } from "@wordpress/element";

const useApiData = (modifiedData, setModifiedData) => {
	const [apiData, setApiData] = useState({});
	const data = new FormData();

	data.append("nonce", sp_eab_admin_dashboard_localize.nonce);
	data.append("action", "sp_eab_admin_option_update");
	data.append("queryData", JSON.stringify(modifiedData));

	const fetchApi = async (queryData) => {
		try {
			const response = await axios.post(ajaxurl, queryData);
			setApiData(response.data);
			setModifiedData({});
		} catch (error) {
			console.error("Error fetching options:", error.message);
		}
	};

	useEffect(() => {
		fetchApi(data);
	}, [JSON.stringify(modifiedData)]);

	return apiData;
};

export default useApiData;
