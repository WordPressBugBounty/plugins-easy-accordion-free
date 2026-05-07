import { Accordion } from "@easy-accordion/templates";
import { memo, useMemo } from "@wordpress/element";
import { VideoPlayer } from "@easy-accordion/components";
import ProductAccordionItem from "./productAccordionItem";

const Render = ({ attributes, posts }) => {
	const {
		template,
		defaultAccordionOpen,
		blockName,
		uniqueId,
		contentHeight,
		contentMaxHeight,
		animationEffect,
		eabBackground,
		openMultiItemAtaTime,
		openSelectedItem,
		activeEvent,
		templateOrientation,
		imageSize,
		featuredImageSize,
		generalLinkOpen,
		metaDataOptions,
		toggleIconsSet,
		enableExpandAndCollapseIcon,
		toggleIconPosition,
		accordionTitleTag,
		linkOpenNewTab,
		linkPostTitle,
		postTitleLenght,
		postTitleLenghtNumber,
		showExcerpt,
		excerptLimit,
		excerptLength,
		showFeaturedImage,
		metaDisplayPosition,
		addToCartLabel,
		showAddToCart,
		showProductAttrs,
		showPrice,
		showRating,
		showBadge,
		metaDivider,
		imageEffects,
		showProductTitle,
		imgHoverGrayScale,
	} = attributes;

	const productsAttributes = useMemo(
		() => ({
			uniqueId,
			template,
			imageSize,
			featuredImageSize,
			generalLinkOpen,
			metaDataOptions,
			toggleIconsSet,
			enableExpandAndCollapseIcon,
			toggleIconPosition,
			accordionTitleTag,
			linkOpenNewTab,
			linkPostTitle,
			postTitleLenght,
			postTitleLenghtNumber,
			showExcerpt,
			excerptLimit,
			excerptLength,
			showFeaturedImage,
			metaDisplayPosition,
			templateOrientation,
			addToCartLabel,
			showAddToCart,
			showProductAttrs,
			showPrice,
			showRating,
			showBadge,
			metaDivider,
			imgHoverGrayScale,
			showProductTitle,
			imageEffects,
			activeEvent,
		}),
		[
			uniqueId,
			template,
			imageSize,
			featuredImageSize,
			generalLinkOpen,
			metaDataOptions,
			toggleIconsSet,
			enableExpandAndCollapseIcon,
			toggleIconPosition,
			accordionTitleTag,
			linkOpenNewTab,
			linkPostTitle,
			postTitleLenght,
			postTitleLenghtNumber,
			showExcerpt,
			excerptLimit,
			excerptLength,
			showFeaturedImage,
			metaDisplayPosition,
			templateOrientation,
			addToCartLabel,
			showAddToCart,
			showProductAttrs,
			showPrice,
			showRating,
			showBadge,
			metaDivider,
			imgHoverGrayScale,
			showProductTitle,
			imageEffects,
			activeEvent,
		]
	);

	//Open default item.
	const defaultOpenItems = useMemo(() => {
		if (!posts?.length) {
			return [];
		}

		switch (defaultAccordionOpen) {
			case "first-item":
				return [posts[0]?.post_id ?? 0];
			case "open-all":
				return posts.map((post, index) => post.post_id ?? index);
			case "open-selected-item":
				const selectedIndex = Number(openSelectedItem) - 1;

				// Validate index
				if (Number.isInteger(selectedIndex) && selectedIndex >= 0 && selectedIndex < posts.length) {
					return [posts[selectedIndex]?.post_id ?? selectedIndex];
				}

				// Fallback (safe)
				return [posts[0]?.post_id ?? 0];
			case "close-all":
				return [];

			default:
				return [posts[0]?.post_id ?? 0];
		}
	}, [defaultAccordionOpen, openSelectedItem, posts]);

	const expandHeight = false;

	// Button or no filter → flat list
	const items = posts;

	return (
		<div className={`sp-eab-wrapper sp-eab-${blockName} ${uniqueId}`}>
			{/* ===== Background Video ===== */}
			{eabBackground?.style === "video" && (
				<VideoPlayer
					videoType={eabBackground?.videoType}
					bgVideo={eabBackground?.video?.html5}
					youtubeVideo={eabBackground?.video?.youtube}
				/>
			)}
			{/* ===== Button Filters ===== */}
			<Accordion
				key={`${defaultAccordionOpen}-${openSelectedItem}-${activeEvent}-${posts?.length}`}
				multipleOpenAtATime={openMultiItemAtaTime}
				duration={600}
				className={`sp-eab-${template}`}
				accordionMode={templateOrientation}
				defaultExpandItems={defaultOpenItems}
				expandHeight={expandHeight}
				animationEffect={animationEffect}
				activatorEvent={activeEvent}
			>
				{items?.map((post, i) => (
					<ProductAccordionItem
						key={post.post_id ?? i}
						data={post}
						attributes={productsAttributes}
						index={i}
						itemKey={post.post_id ?? i}
					/>
				))}
			</Accordion>
		</div>
	);
};

export default memo(Render);
