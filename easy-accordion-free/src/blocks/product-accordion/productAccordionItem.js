import { __ } from "@wordpress/i18n";
import { Accordion } from "@easy-accordion/templates";
import { useMemo } from "@wordpress/element";
import { Excerpt, FeaturedImage } from "../post-accordion/templatePart";
import AccordionHeader from "../post-accordion/accordionHeader";
import { AddToCartButton, PriceData, ProductAttributes, ReviewData } from "./templates";

const ProductAccordionItem = ({ data, attributes, itemKey }) => {
	const {
		template,
		imageSize,
		featuredImageSize,
		generalLinkOpen,
		toggleIconsSet,
		enableExpandAndCollapseIcon,
		toggleIconPosition,
		accordionTitleTag,
		postTitleLenght,
		postTitleLenghtNumber,
		showExcerpt,
		excerptLimit,
		excerptLength,
		showFeaturedImage,
		addToCartLabel,
		showAddToCart,
		showProductAttrs,
		showPrice,
		showRating,
		showBadge,
	} = attributes;

	const {
		title,
		attachment_metadata,
		attachment_srcset,
		link,
		excerpt,
		content,
		image_alt,
		image_title,
		attachment_url,
		post_thumbnail_url,
		sale_badge,
	} = data;

	const imageData = useMemo(
		() => ({
			attachment_metadata,
			content,
			attachment_srcset,
			image_title,
			image_alt,
			postTitle: title,
			attachment_url,
			post_thumbnail_url,
			showFeaturedImage,
			template,
			sale_badge,
			showBadge,
			featuredImageSize,
		}),
		[generalLinkOpen, featuredImageSize, imageSize, showBadge, showFeaturedImage, template]
	);
	const titleAttr = useMemo(
		() => ({
			title,
			link,
			toggleIconsSet,
			enableExpandAndCollapseIcon,
			toggleIconPosition,
			postTitleLenght,
			postTitleLenghtNumber,
		}),
		[toggleIconsSet, enableExpandAndCollapseIcon, toggleIconPosition, postTitleLenght, postTitleLenghtNumber]
	);

	const blockProps = {
		className: `sp-eab-accordion-item`,
		style: { marginLeft: 0, marginRight: 0, opacity: 1 },
	};

	return (
		<Accordion.Item eventKey={itemKey} blockProps={{ ...blockProps }}>
			<div className="sp-eab-accordion-item-wrapper">
				<Accordion.Heading TagName={accordionTitleTag}>
					<AccordionHeader data={titleAttr} imageData={imageData} />
				</Accordion.Heading>
				<Accordion.Content>
					<div className="sp-eab-accordion-body sp-d-flex">
						{showFeaturedImage && attachment_metadata && <FeaturedImage data={imageData} link={link} />}
						<div className="sp-eab-post-content-wrapper">
							{showRating && <ReviewData product={data} />}
							{showPrice && <PriceData product={data} />}
							{showExcerpt && <Excerpt excerpt={excerpt} />}
							{showAddToCart && <AddToCartButton product={data} label={addToCartLabel} />}
						</div>
					</div>
				</Accordion.Content>
			</div>
		</Accordion.Item>
	);
};

export default ProductAccordionItem;
