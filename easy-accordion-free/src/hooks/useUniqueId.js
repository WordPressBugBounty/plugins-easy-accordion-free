import { useSelect } from "@wordpress/data";
import { useEffect } from "@wordpress/element";

const useUniqueId = (clientId, uniqueId, setAttributes, prefix = "sp-eab-", saveIdForChild = false) => {
	const isDuplicateUniqueId = useSelect(
		(select) => {
			if (!uniqueId) {
				return false;
			}
			const blocks = select("core/block-editor")?.getBlocks() || [];
			return blocks.some(
				(block) =>
					block.clientId !== clientId &&
					block.name?.startsWith("sp-easy-accordion-pro") &&
					block.attributes?.uniqueId === uniqueId
			);
		},
		[uniqueId, clientId]
	);

	useEffect(() => {
		if (!clientId) {
			return;
		}
		if (!uniqueId || isDuplicateUniqueId) {
			const shortClientId = clientId.split("-")?.pop();
			const unique_id = `${prefix}${shortClientId}`;
			let updatedAttr = { uniqueId: unique_id };
			if (saveIdForChild) {
				const parent_id = clientId?.substring(clientId?.length - 6, clientId?.length);
				updatedAttr = { ...updatedAttr, parentId: parent_id };
			}
			setAttributes(updatedAttr);
		}
	}, [clientId, uniqueId, isDuplicateUniqueId]);
};

export default useUniqueId;
