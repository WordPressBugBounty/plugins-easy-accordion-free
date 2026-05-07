import { __ } from "@wordpress/i18n";
import {
	ButtonGroup,
	InputControl,
	SelectControl,
	ToggleControl,
	SPRangeControl,
	Divider,
	SortableItem,
	SpProNotice,
} from "@easy-accordion/components";
import {
	capitalizeString,
	filterSelectOptions,
	findDataFromArray,
	getObjectValuesToJsArray,
} from "@easy-accordion/controls";
import { animationEffectOptions, orderByOptions } from "@easy-accordion/constants";
import useMetaData from "../../hooks/useMetaData";
import { DndContext, PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { arrayMove, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";

export const QueryBuilderGeneralTab = ({ attributes, setAttributes }) => {
	const { blockName, postType, filterPost, orderBy, orderDirection, postLimit, taxonomyFilterEnable } = attributes;

	const { allPostTypes } = useMetaData(attributes, "editSite");

	const postTypeValues = getObjectValuesToJsArray(allPostTypes);
	const postTypeOptions = postTypeValues
		?.filter((pt) => pt !== "product") // exclude product
		.map((singlePostType) => ({
			label: `${capitalizeString(singlePostType)}`,
			value: singlePostType,
		}));

	const updatePostTypeOptions = postTypeOptions?.map((item, index) => ({
		id: index + 1,
		label: item.value === "attachment" ? "Media" : item.label,
		value: item.value,
	}));

	const defaultPostType = [
		{ label: "Posts", value: "post" },
		{ label: "Pages", value: "page" },
	];

	const isPostAccordion = blockName === "post-accordion";

	const baseFilterOptions = [
		{ label: __("Latest", "easy-accordion-free"), value: "latest" },
		{ label: __("Taxonomy (Pro)", "easy-accordion-free"), value: "taxonomy", pro: true },
		{ label: __("Specific (Pro)", "easy-accordion-free"), value: "specific_post", pro: true },
	];

	const productFilterOptions = [
		{ label: __("Best Selling (Pro)", "easy-accordion-free"), value: "best_selling", pro: true },
		{ label: __("Top Rated (Pro)", "easy-accordion-free"), value: "top_rated", pro: true },
		{ label: __("On Sale (Pro)", "easy-accordion-free"), value: "on_sale", pro: true },
	];

	const filterOptions = isPostAccordion ? baseFilterOptions : [...baseFilterOptions, ...productFilterOptions];

	const filterLabel = isPostAccordion
		? __("Filter Posts", "easy-accordion-free")
		: __("Filter Products", "easy-accordion-free");

	return (
		<>
			{blockName === "post-accordion" && (
				<SelectControl
					label={__("Post Type(s)", "easy-accordion-free")}
					items={updatePostTypeOptions?.length > 0 ? updatePostTypeOptions : defaultPostType}
					attributes={postType}
					attributesKey={"postType"}
					setAttributes={setAttributes}
					flexStyle={true}
				/>
			)}

			<SelectControl
				label={filterLabel}
				items={filterOptions}
				attributes={filterPost}
				flexStyle={true}
				attributesKey="filterPost"
				setAttributes={setAttributes}
			/>
			<SelectControl
				label={__("Order By", "easy-accordion-free")}
				items={orderByOptions}
				attributes={orderBy}
				attributesKey={"orderBy"}
				setAttributes={setAttributes}
				flexStyle={true}
			/>
			<ButtonGroup
				label={__("Order Direction", "easy-accordion-free")}
				items={[
					{ label: "Ascending", value: "ASC" },
					{ label: "Descending", value: "DESC" },
				]}
				attributes={orderDirection}
				attributesKey={"orderDirection"}
				setAttributes={setAttributes}
			/>
			<InputControl
				label={
					isPostAccordion
						? __("Posts To Show", "easy-accordion-free")
						: __("Products To Show", "easy-accordion-free")
				}
				// ajax={true}
				flex={true}
				attributes={postLimit}
				inputType="number"
				attributesKey={"postLimit"}
				setAttributes={setAttributes}
			/>
			<ToggleControl
				label={__("Taxonomy Filter", "easy-accordion-free")}
				attributes={taxonomyFilterEnable}
				attributesKey={"taxonomyFilterEnable"}
				setAttributes={setAttributes}
				onlyPro={true}
			/>
		</>
	);
};

export const PostMetaDataGeneralTab = ({ attributes, setAttributes }) => {
	const { metaDataOptions, metaDivider, blockName } = attributes;

	// drag and drop functions.
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 5 },
		})
	);

	const handleDragEnd = (event) => {
		const { active, over } = event;
		if (active && over && active.id !== over.id) {
			const oldIndex = metaDataOptions.findIndex((i) => active.id === i.id);
			const newIndex = metaDataOptions.findIndex((i) => over.id === i.id);

			setAttributes({
				metaDataOptions: arrayMove(metaDataOptions, oldIndex, newIndex),
			});
		}
	};

	const updateMetaDataOption = (id) => {
		const updatedArray = metaDataOptions?.map((option) => {
			if (option.id === id) {
				return { ...option, isActive: !option.isActive };
			}
			return option;
		});
		setAttributes({ metaDataOptions: updatedArray });
	};
	let ItemLabels = {};
	if (blockName === "post-accordion") {
		ItemLabels = {
			author: __("Author", "easy-accordion-free"),
			category: __("Category", "easy-accordion-free"),
			date: __("Date", "easy-accordion-free"),
		};
	}

	return (
		<>
			{blockName === "post-accordion" && (
				<DndContext sensors={sensors} onDragEnd={handleDragEnd} modifiers={[restrictToVerticalAxis]}>
					<SortableContext items={metaDataOptions} strategy={verticalListSortingStrategy}>
						{metaDataOptions?.map(({ value, isActive, id }) => (
							<SortableItem key={id} id={id}>
								<ToggleControl
									updated={true}
									label={ItemLabels[value]}
									attributes={isActive}
									onChange={() => updateMetaDataOption(id)}
								/>
							</SortableItem>
						))}
					</SortableContext>
				</DndContext>
			)}
		</>
	);
};

export const PostContentGeneralTab = ({ attributes, setAttributes }) => {
	const {
		template,
		showFeaturedImage,
		featuredImageSize,
		showExcerpt,
		excerptLength,
		animationEffect,
		animationTransitionDuration,
		showCloseButton,
		contentHeight,
	} = attributes;

	const { imageSizes } = useMetaData(attributes);

	const imageSizesOption = imageSizes
		? imageSizes?.map((size) => {
				return { label: size, value: size };
			})
		: [];

	return (
		<>
			{template === "post-accordion-one" && (
				<>
					<ToggleControl
						label={__("Featured Image", "easy-accordion-free")}
						attributes={showFeaturedImage}
						attributesKey={"showFeaturedImage"}
						setAttributes={setAttributes}
					/>
					{showFeaturedImage && (
						<>
							<SelectControl
								label={__("Image Size", "easy-accordion-free")}
								attributes={featuredImageSize}
								attributesKey={"featuredImageSize"}
								setAttributes={setAttributes}
								items={[
									...imageSizesOption,
									{
										label: __("Custom Size (Pro)", "easy-accordion-free"),
										value: "custom",
										pro: true,
									},
								]}
							/>
							<Divider />
						</>
					)}
				</>
			)}
			<ToggleControl
				label={__("Excerpt", "easy-accordion-free")}
				attributes={showExcerpt}
				attributesKey={"showExcerpt"}
				setAttributes={setAttributes}
			/>
			<ButtonGroup
				label={__("Excerpt Type", "easy-accordion-free")}
				items={[
					{ label: "Full", value: "full" },
					{ label: "Limit", value: "limit", pro: true },
				]}
				attributes={excerptLength}
				attributesKey={"excerptLength"}
				setAttributes={setAttributes}
			/>
			<Divider />
			<ButtonGroup
				label={__("Content Height", "easy-accordion-free")}
				items={[
					{ label: "Auto", value: "auto" },
					{ label: "Limit", value: "limit", pro: true },
				]}
				attributes={contentHeight}
				attributesKey={"contentHeight"}
				setAttributes={setAttributes}
			/>
			<SelectControl
				label={__("Animation Effects", "easy-accordion-free")}
				items={animationEffectOptions}
				attributes={animationEffect}
				attributesKey={"animationEffect"}
				setAttributes={setAttributes}
				flexStyle={true}
			/>
			<SPRangeControl
				label={__("Transition Time", "easy-accordion-free")}
				attributes={animationTransitionDuration}
				attributesKey={"animationTransitionDuration"}
				setAttributes={setAttributes}
				units={["ms"]}
				max={10000}
				defaultValue={{ unit: "ms", value: 400 }}
			/>
			<ToggleControl
				label={__("Close Button", "easy-accordion-free")}
				attributes={showCloseButton}
				attributesKey={"showCloseButton"}
				setAttributes={setAttributes}
				onlyPro={true}
			/>
			<SpProNotice
				subtitle={__("Unlock Advanced Content Controls for Post Accordion", "easy-accordion-free")}
				features={[
					"Featured Image Custom Sizing",
					"Limit Excerpt Length by Words",
					"Read More Button and Button Label",
					"Control Accordion Content Height",
					"25+ Content Animation Effects",
				]}
				linkButton={true}
			/>
		</>
	);
};
export const ProductContentGeneralTab = ({ attributes, setAttributes }) => {
	const {
		template,
		showFeaturedImage,
		featuredImageSize,
		showExcerpt,
		excerptLength,
		showBadge,
		showRating,
		showPrice,
		showProductAttrs,
		showAddToCart,
		imgToDescGap,
		contentHeight,
		animationEffect,
		animationTransitionDuration,
		postTitleLenght,
		linkPostTitle,
		linkOpenNewTab,
		showProductTitle,
		accordionTitleTag,
	} = attributes;

	const { imageSizes } = useMetaData(attributes);

	const imageSizesOption = imageSizes
		? imageSizes?.map((size) => {
				return { label: size, value: size };
			})
		: [];

	return (
		<>
			{template === "product-accordion-one" && (
				<>
					<ToggleControl
						label={__("Product Image", "easy-accordion-free")}
						attributes={showFeaturedImage}
						attributesKey={"showFeaturedImage"}
						setAttributes={setAttributes}
					/>
					{showFeaturedImage && (
						<>
							<SelectControl
								label={__("Image Size", "easy-accordion-free")}
								attributes={featuredImageSize}
								attributesKey={"featuredImageSize"}
								setAttributes={setAttributes}
								items={[
									...imageSizesOption,
									{
										label: __("Custom Size (Pro)", "easy-accordion-free"),
										value: "custom",
										pro: true,
									},
								]}
							/>
							<Divider />
							<SPRangeControl
								label={__("Image to Description Gap", "easy-accordion-free")}
								attributes={imgToDescGap}
								attributesKey={"imgToDescGap"}
								setAttributes={setAttributes}
								units={["px", "%", "Em"]}
								defaultValue={{ unit: "px", value: 24 }}
								max={200}
							/>
						</>
					)}
				</>
			)}
			{template !== "product-accordion-one" && (
				<>
					<ToggleControl
						label={__("Product Title", "easy-accordion-free")}
						attributes={showProductTitle}
						attributesKey={"showProductTitle"}
						setAttributes={setAttributes}
					/>
					{showProductTitle && (
						<>
							<ButtonGroup
								label={__("HTML Tag", "easy-accordion-free")}
								attributes={accordionTitleTag}
								items={[
									{ label: "h1", value: "h1" },
									{ label: "h2", value: "h2" },
									{ label: "h3", value: "h3" },
									{ label: "h4", value: "h4" },
									{ label: "h5", value: "h5" },
									{ label: "h6", value: "h6" },
									{ label: "p", value: "p" },
									{ label: "span", value: "span" },
								]}
								attributesKey={"accordionTitleTag"}
								setAttributes={setAttributes}
							/>
							<ButtonGroup
								label={__("Title Length", "easy-accordion-free")}
								items={[
									{ label: "Full", value: "full" },
									{ label: "Limit", value: "limit", pro: true },
								]}
								attributes={postTitleLenght}
								attributesKey={"postTitleLenght"}
								setAttributes={setAttributes}
							/>
							<ToggleControl
								label={__("Link Product Title", "easy-accordion-free")}
								attributes={linkPostTitle}
								attributesKey={"linkPostTitle"}
								setAttributes={setAttributes}
							/>
							{linkPostTitle && (
								<ToggleControl
									label={__("Link Open in a New Tab", "easy-accordion-free")}
									attributes={linkOpenNewTab}
									attributesKey={"linkOpenNewTab"}
									setAttributes={setAttributes}
								/>
							)}
							<Divider />
						</>
					)}
				</>
			)}

			<ToggleControl
				label={__("Badge", "easy-accordion-free")}
				attributes={showBadge}
				attributesKey={"showBadge"}
				setAttributes={setAttributes}
			/>
			<ToggleControl
				label={__("Rating", "easy-accordion-free")}
				attributes={showRating}
				attributesKey={"showRating"}
				setAttributes={setAttributes}
			/>
			<ToggleControl
				label={__("Price", "easy-accordion-free")}
				attributes={showPrice}
				attributesKey={"showPrice"}
				setAttributes={setAttributes}
			/>
			<ToggleControl
				label={__("Short Description", "easy-accordion-free")}
				attributes={showExcerpt}
				attributesKey={"showExcerpt"}
				setAttributes={setAttributes}
			/>
			{showExcerpt && (
				<>
					<ButtonGroup
						label={__("Description Type", "easy-accordion-free")}
						items={[
							{ label: "Full", value: "full" },
							{ label: "Limit", value: "limit", pro: true },
						]}
						attributes={excerptLength}
						attributesKey={"excerptLength"}
						setAttributes={setAttributes}
					/>
				</>
			)}

			<ToggleControl
				label={__("Attributes", "easy-accordion-free")}
				attributes={showProductAttrs}
				attributesKey={"showProductAttrs"}
				setAttributes={setAttributes}
				onlyPro={true}
			/>
			<ToggleControl
				label={__("Add to Cart", "easy-accordion-free")}
				attributes={showAddToCart}
				attributesKey={"showAddToCart"}
				setAttributes={setAttributes}
			/>
			<Divider />
			<ButtonGroup
				label={__("Content Height", "easy-accordion-free")}
				items={[
					{ label: "Auto", value: "auto" },
					{ label: "Limited", value: "limit", pro: true },
				]}
				attributes={contentHeight}
				attributesKey={"contentHeight"}
				setAttributes={setAttributes}
			/>
			<SelectControl
				label={__("Animation Effects", "easy-accordion-free")}
				items={animationEffectOptions}
				attributes={animationEffect}
				attributesKey={"animationEffect"}
				setAttributes={setAttributes}
				flexStyle={true}
			/>
			<SPRangeControl
				label={__("Transition Time", "easy-accordion-free")}
				attributes={animationTransitionDuration}
				attributesKey={"animationTransitionDuration"}
				setAttributes={setAttributes}
				units={["ms"]}
				max={10000}
				defaultValue={{ unit: "ms", value: 400 }}
			/>
			<SpProNotice
				subtitle={__("Unlock Advanced Content Controls for Product Accordion", "easy-accordion-free")}
				features={[
					"Product Image Custom Sizing",
					"Control Product Description Length",
					"Show Product Attributes (Size, Color)",
					"Change Add to Cart Button Label",
					"Control Accordion Content Height",
					"25+ Content Animation Effects",
				]}
				linkButton={true}
			/>
		</>
	);
};
