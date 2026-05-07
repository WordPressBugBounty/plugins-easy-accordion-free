import { Accordion } from "@easy-accordion/templates";
import { Fragment, memo, useEffect, useMemo, useState } from "@wordpress/element";
import { VideoPlayer } from "@easy-accordion/components";
import PostAccordionItem from "./postAccordionItem";
import { useDeviceType } from "@easy-accordion/controls";

const Render = ({ attributes, posts }) => {
	const {
		template,
		defaultAccordionOpen,
		blockName,
		uniqueId,
		animationEffect,
		eabBackground,
		openMultiItemAtaTime,
		openSelectedItem,
		activeEvent,
	} = attributes;

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

			{/* ===== SINGLE Accordion ===== */}
			<Accordion
				key={`${defaultAccordionOpen}-${openSelectedItem}-${activeEvent}-${posts?.length}-${template}`}
				multipleOpenAtATime={openMultiItemAtaTime}
				duration={600}
				className={`sp-eab-${template}`}
				accordionMode={"vertical"}
				defaultExpandItems={defaultOpenItems}
				expandHeight={expandHeight}
				animationEffect={animationEffect}
				activatorEvent={activeEvent}
			>
				{posts?.map((post, i) => (
					<PostAccordionItem
						key={post.post_id ?? i}
						data={post}
						attributes={attributes}
						index={i}
						itemKey={post.post_id ?? i}
					/>
				))}
			</Accordion>
		</div>
		// </div>
	);
};

export default memo(Render);
