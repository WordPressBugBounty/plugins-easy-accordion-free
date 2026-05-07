import { __ } from "@wordpress/i18n";
import { memo, Fragment, useEffect, useRef } from "@wordpress/element";
import { AuthorIcon, CalenderIcon, CategoryIcon } from "./icons";
import { stringTrim } from "@easy-accordion/controls";

export const FeaturedImage = memo(({ data, link, onClick }) => {
	const {
		attachment_metadata,
		attachment_srcset,
		image_alt,
		generalLinkOpen,
		imageSrcset,
		lazy = false,
		postTitle,
		attachment_url,
		showBadge,
		sale_badge,
		featuredImageSize,
	} = data;

	const editPage = true;

	const imageSrcsetAttr = imageSrcset ? attachment_srcset : "";

	const isRealLink = !editPage && (generalLinkOpen === "current-tab" || generalLinkOpen === "new-tab");
	let mediaUrl = attachment_url || "";

	if (attachment_metadata && featuredImageSize !== "custom") {
		const selectedSize = attachment_metadata.sizes?.[featuredImageSize];
		if (selectedSize) {
			// WordPress stores files relative to uploads
			// Construct full URL by replacing filename in main URL
			const baseUrl = attachment_url?.replace(/\/[^\/]+$/, "/"); // remove filename
			mediaUrl = `${baseUrl}${selectedSize.file}`;
		}
	}

	return (
		<div data-component="general" className="sp-eab-featured-image-wrapper">
			{attachment_metadata && (
				<img
					src={mediaUrl}
					alt={image_alt || postTitle}
					srcSet={imageSrcsetAttr}
					loading={lazy ? "lazy" : undefined}
				/>
			)}
			{showBadge && sale_badge && (
				<span className="sp-eab-sale-badge" dangerouslySetInnerHTML={{ __html: sale_badge }} />
			)}
		</div>
	);
});

export const MetadataRenderer = memo(
	({ author_url, author, postDate, categoryList, metaDataOptions, sku, type, onClick }) => {
		// Inline metadata mapping object
		const metaDataMapping = {
			author: (
				<Fragment key={"1"}>
					<span className={`sp-eab-post-meta sp-eab-post-author`}>
						<a href="#" rel="noreferrer">
							{/* If author showcase Name with Icon */}
							<span className={`sp-eab-post-meta-icon`}>
								<AuthorIcon />
							</span>
							<span className={"sp-eab-post-meta-text"}>{author}</span>
						</a>
					</span>
				</Fragment>
			),
			category: (
				<Fragment key={"2"}>
					<Category categoryList={categoryList} type={type} />
				</Fragment>
			),
			date: (
				<Fragment key={"3"}>
					<>
						<span className="sp-eab-post-meta sp-eab-post-date">
							<span className={`sp-eab-post-meta-icon`}>
								<CalenderIcon />
							</span>

							<span className={"sp-eab-post-meta-text"}>{postDate?.default + " "}</span>
						</span>
					</>
				</Fragment>
			),
		};

		const editPage = true;

		return (
			<div className={`sp-meta-data sp-eab-post-meta-details sp-d-flex`}>
				<>
					<span
						key={metaDataOptions}
						className="sp-eab-post-details sp-d-flex sp-gap-10px"
						onClick={(editPage && onClick) || null}
						data-component="meta_data"
					>
						{metaDataOptions?.map((meta) => {
							const metaItem = meta?.isActive ? metaDataMapping[meta.value] : null;
							return metaItem ? metaItem : null;
						})}
					</span>
				</>
			</div>
		);
	}
);

export const Category = memo(({ categoryList, type }) => {
	const categoryListRef = useRef(null);

	useEffect(() => {
		if (categoryListRef.current) {
			const taxonomyItems = categoryListRef.current.querySelectorAll("li a");
			taxonomyItems.forEach((item) => {
				const handleClick = (e) => {
					e.preventDefault(); // this stops the link navigation
				};

				item.addEventListener("click", handleClick);

				// cleanup on unmount
				return () => {
					item.removeEventListener("click", handleClick);
				};
			});
		}
	}, []);

	return (
		categoryList && (
			<span className={`sp-eab-post-meta sp-metadata-taxonomy`} ref={categoryListRef}>
				{type !== "product" ? (
					<span className={`sp-metadata-taxonomy-icon sp-eab-post-meta-icon`}>
						<CategoryIcon />
					</span>
				) : (
					"Categories: "
				)}

				<span className={`sp-eab-post-meta-text`} dangerouslySetInnerHTML={{ __html: categoryList }} />
			</span>
		)
	);
});

// Excerpt render component.
export const Excerpt = memo(({ excerpt }) => {
	return (
		<div className={`sp-eab-post-excerpt-wrapper`}>
			<div className="sp-eab-post-excerpt" dangerouslySetInnerHTML={{ __html: excerpt }} />
		</div>
	);
});
