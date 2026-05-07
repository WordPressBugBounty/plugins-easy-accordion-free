import { __ } from "@wordpress/i18n";
import { Accordion } from "@easy-accordion/templates";
import { useMemo } from "@wordpress/element";
import { Excerpt, FeaturedImage, MetadataRenderer, ReadMoreButton } from "./templatePart";
import AccordionHeader from "./accordionHeader";

const PostAccordionItem = ({ data, attributes, itemKey }) => {
	const {
		template,
		imageSize,
		featuredImageSize,
		generalLinkOpen,
		metaDataOptions,
		toggleIconsSet,
		enableExpandAndCollapseIcon,
		toggleIconPosition,
		accordionTitleTag,
		postTitleLenght,
		postTitleLenghtNumber,
		showExcerpt,
		showFeaturedImage,
	} = attributes;

	const {
		title,
		attachment_metadata,
		category_list,
		attachment_srcset,
		author,
		author_url,
		link,
		excerpt,
		content,
		image_alt,
		image_title,
		attachment_url,
		post_thumbnail_url,
		post_date,
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
			featuredImageSize,
		}),
		[generalLinkOpen, featuredImageSize, imageSize]
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
					<div className="sp-eab-accordion-body sp-d-flex sp-gap-20px">
						{showFeaturedImage && attachment_metadata && <FeaturedImage data={imageData} link={link} />}
						<div className="sp-eab-post-content-wrapper">
							<MetadataRenderer
								author_url={author_url}
								author={author}
								postDate={post_date}
								categoryList={category_list}
								metaDataOptions={metaDataOptions}
								onClick=""
							/>
							{showExcerpt && <Excerpt excerpt={excerpt} />}
						</div>
					</div>
				</Accordion.Content>
			</div>
		</Accordion.Item>
	);
};

export default PostAccordionItem;
