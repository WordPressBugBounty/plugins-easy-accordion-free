import apiFetch from "@wordpress/api-fetch";
import { useEffect, useState } from "@wordpress/element";

const useIconList = () => {
	const [icon, setIcon] = useState([]);

	const fetchIconList = async () => {
		await apiFetch({
			path: `easy-accordion/v2/icon-list`,
			method: "POST",
			headers: {
				"X-WP-Nonce": sp_eab_localize_data?.spEabAjaxNonce,
			},
			data: {
				someParam: "example",
			},
		})
			.then((response) => {
				setIcon(JSON.parse(response));
			})
			.catch((error) => {
				console.error("Error fetching icon list:", error);
			});
	};

	useEffect(() => {
		if (icon.length < 1) {
			fetchIconList();
		}
	}, [icon]);

	return icon;
};

export default useIconList;
