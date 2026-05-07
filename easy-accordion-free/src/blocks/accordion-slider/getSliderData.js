import { useCallback, useMemo } from "@wordpress/element";
import { createBlock } from "@wordpress/blocks";

export const useAccordionGallery = (accordionGallery, setAttributes, clientId, parentAttrs) => {
	const handleAddImages = useCallback(
		(newImages) => {
			const formatted = newImages.map((img) => ({
				id: img?.id,
				url: img?.url,
				alt: img?.alt,
				title: img?.caption || "",
				description: img?.description || "",
				caption: img?.caption || "",
			}));

			setAttributes({
				accordionGallery: [...accordionGallery, ...formatted],
			});
		},
		[accordionGallery, setAttributes]
	);
	const handleUpdateImage = useCallback(
		(index, updates) => {
			const block = wp.data.select("core/block-editor").getBlock(clientId);
			if (!block) {
				return;
			}

			const targetBlock = block.innerBlocks?.[index];
			if (!targetBlock) {
				return;
			}

			wp.data.dispatch("core/block-editor").updateBlockAttributes(targetBlock.clientId, updates);

			const updatedGallery = [...accordionGallery];
			updatedGallery[index] = { ...updatedGallery[index], ...updates };
			setAttributes({ accordionGallery: updatedGallery });
		},
		[clientId, accordionGallery, setAttributes]
	);

	// -----------------------
	// Generate inner blocks
	// -----------------------
	const innerBlocksToRender = useMemo(() => {
		return accordionGallery.length
			? accordionGallery.map((img) =>
					createBlock("sp-easy-accordion-pro/image-accordion-item", {
						singleImgTitle: img?.title,
						singleImgDesc: img?.description,
						singleImgData: img,
						singleImgId: img?.id,
						parentSettings: parentAttrs,
					})
				)
			: [];
	}, [accordionGallery, parentAttrs]);

	return {
		handleAddImages,
		handleUpdateImage,
		innerBlocksToRender,
	};
};
