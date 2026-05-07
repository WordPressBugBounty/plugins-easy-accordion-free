import { __ } from "@wordpress/i18n";
import { InnerBlocks, MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { createContext, useEffect, useState, useRef, useCallback, useMemo } from "@wordpress/element";
import { createBlock } from "@wordpress/blocks";
import { BlockAppender, ImageAccordionPicker } from "@easy-accordion/templates";
import { useAccordionGallery } from "../accordion-slider/getSliderData";
import { VideoPlayer } from "@easy-accordion/components";

export const AccordionContext = createContext();

const ALLOWED_BLOCKS = ["sp-easy-accordion-pro/image-accordion-item"];

const ImageAccordionEdit = ({ attributes, setAttributes, clientId }) => {
	const {
		uniqueId,
		blockName,
		align,
		customClassName,
		accordionGallery = [],
		activeEvent = "click",
		openSelectedItem,
		defaultAccordionOpen,
		imageEffects,
		accordionTitleTag,
		showTitle,
		showDescription,
		contentAlignment,
		template,
		contentAnimationEffect,
		titleAlignment,
		schemaMarkup,
		eabBackground,
	} = attributes;

	const parentAttrs = useMemo(
		() => ({
			imageEffects,
			accordionTitleTag,
			showTitle,
			showDescription,
			contentAlignment,
			uniqueId,
			template,
			contentAnimationEffect,
			titleAlignment,
			blockName,
			accordionGallery,
			schemaMarkup,
		}),
		[
			imageEffects,
			accordionTitleTag,
			showTitle,
			showDescription,
			contentAlignment,
			uniqueId,
			template,
			contentAnimationEffect,
			titleAlignment,
			blockName,
			accordionGallery,
			schemaMarkup,
		]
	);

	const [activeIndex, setActiveIndex] = useState(0);
	const intervalRef = useRef(null);
	const autoPlayInterval = 3000;
	const prevInnerBlocksLength = useRef(0);
	const prevGalleryLength = useRef(0);

	const { handleAddImages, handleUpdateImage, innerBlocksToRender } = useAccordionGallery(
		accordionGallery,
		setAttributes,
		clientId,
		parentAttrs
	);

	useEffect(() => {
		if (!clientId || !accordionGallery.length) {
			return;
		}

		const block = wp.data.select("core/block-editor").getBlock(clientId);
		if (!block) {
			return;
		}

		const innerBlocks = block.innerBlocks || [];

		// First run: replace all blocks if there are none
		if (innerBlocks.length === 0) {
			wp.data.dispatch("core/block-editor").replaceInnerBlocks(clientId, innerBlocksToRender, false);
			return;
		}

		// For subsequent runs: insert only new images
		const missingImages = accordionGallery.filter(
			(img) => !innerBlocks.some((b) => b.attributes.singleImgId === img?.id)
		);

		if (missingImages.length > 0) {
			const newBlocks = missingImages.map((img) =>
				createBlock("sp-easy-accordion-pro/image-accordion-item", {
					singleImgTitle: img?.title,
					singleImgDesc: img?.description,
					singleImgData: img,
					singleImgId: img?.id,
					parentSettings: parentAttrs,
				})
			);

			wp.data.dispatch("core/block-editor").insertBlocks(newBlocks, innerBlocks.length, clientId);
		}
	}, [accordionGallery, clientId, innerBlocksToRender, parentAttrs]);

	// Auto-sync parent settings → child blocks
	useEffect(() => {
		if (!clientId) {
			return;
		}

		const block = wp.data.select("core/block-editor").getBlock(clientId);
		if (!block) {
			return;
		}

		block.innerBlocks?.forEach((child) => {
			wp.data
				.dispatch("core/block-editor")
				.updateBlockAttributes(child.clientId, { parentSettings: parentAttrs });
		});
	}, [parentAttrs, clientId]);

	useEffect(() => {
		if (!clientId) {
			return;
		}

		const unsubscribe = wp.data.subscribe(() => {
			const block = wp.data.select("core/block-editor").getBlock(clientId);
			if (!block) {
				return;
			}

			const innerBlocks = block.innerBlocks || [];
			const innerBlocksIds = innerBlocks.map((b) => b.attributes.singleImgId);
			const currentGallery = block.attributes.accordionGallery || [];

			// Only run when a child block was deleted
			if (innerBlocks.length < prevInnerBlocksLength.current && currentGallery.length > innerBlocks.length) {
				const newGallery = currentGallery.filter((img) => innerBlocksIds.includes(img?.id));

				// Only update if the gallery actually changed
				if (newGallery.length !== currentGallery.length) {
					wp.data.dispatch("core/block-editor").updateBlockAttributes(clientId, {
						accordionGallery: newGallery,
					});
				}
			}

			// Update previous lengths
			prevInnerBlocksLength.current = innerBlocks.length;
			prevGalleryLength.current = currentGallery.length;
		});

		return () => unsubscribe();
	}, [clientId]);

	useEffect(() => {
		if (!accordionGallery.length) {
			return;
		}
		if (defaultAccordionOpen === "first-item") {
			setActiveIndex(0);
		} else if (defaultAccordionOpen === "close-all") {
			setActiveIndex(-1);
		} else if (defaultAccordionOpen === "open-selected-item") {
			const selectedIndex = openSelectedItem - 1;
			if (selectedIndex >= 0 && selectedIndex < accordionGallery.length) {
				setActiveIndex(selectedIndex);
			} else {
				setActiveIndex(0);
			}
		}
	}, [accordionGallery.length, defaultAccordionOpen, openSelectedItem]);

	// Autoplay logic
	useEffect(() => {
		if (activeEvent !== "auto" || accordionGallery.length <= 1) {
			return;
		}

		intervalRef.current = setInterval(() => {
			setActiveIndex((prev) => (prev + 1) % accordionGallery.length);
		}, autoPlayInterval);

		return () => clearInterval(intervalRef.current);
	}, [activeEvent, accordionGallery]);

	const handleActivate = useCallback(
		(index) => {
			setActiveIndex((prev) => (prev === index && defaultAccordionOpen === "close-all" ? -1 : index));
			if (activeEvent === "auto") {
				clearInterval(intervalRef.current);
				intervalRef.current = setInterval(() => {
					setActiveIndex((prev) => (prev + 1) % accordionGallery.length);
				}, autoPlayInterval);
			}
		},
		[activeEvent, accordionGallery.length, defaultAccordionOpen]
	);

	return (
		<>
			<div
				className={`sp-easy-accordion-block sp-eab-${blockName} eab-${template} ${uniqueId} align${align}${customClassName ? ` ${customClassName}` : ""}`}
			>
				<AccordionContext.Provider
					value={{ activeIndex, handleActivate, activeEvent, handleUpdateImage, parentData: parentAttrs }}
				>
					{/* Initial Picker */}
					{accordionGallery.length === 0 && (
						<ImageAccordionPicker images={accordionGallery} onChange={handleAddImages} />
					)}

					{/* Accordion Preview */}
					{accordionGallery.length > 0 && (
						<div className="sp-eab-image-accordion-container">
							{eabBackground?.style === "video" && (
								<VideoPlayer
									videoType={eabBackground?.videoType}
									bgVideo={eabBackground?.video?.html5}
									youtubeVideo={eabBackground?.video?.youtube}
								/>
							)}
							<div
								className={`sp-eab-image-accordion-items sp-d-flex eab-accordion-orientation-vertical sp-flex-col ${imageEffects !== "none" ? "eab-image-effect" : ""}`}
							>
								<InnerBlocks allowedBlocks={ALLOWED_BLOCKS} renderAppender={false} />
							</div>
						</div>
					)}

					{/* Add New Image Button */}
					{accordionGallery.length > 0 && (
						<MediaUploadCheck>
							<MediaUpload
								onSelect={handleAddImages}
								allowedTypes={["image"]}
								multiple
								gallery
								render={({ open }) => (
									<BlockAppender
										blockAppenderFn={open}
										label={__("Add New Image Accordion", "easy-accordion-free")}
									/>
								)}
							/>
						</MediaUploadCheck>
					)}
				</AccordionContext.Provider>
			</div>
		</>
	);
};

export default ImageAccordionEdit;
