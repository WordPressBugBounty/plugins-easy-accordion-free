import { __ } from "@wordpress/i18n";
import { InnerBlocks } from "@wordpress/block-editor";
import { dispatch, useDispatch } from "@wordpress/data";
import { BlockAppender, PromptCard } from "@easy-accordion/templates";
import { VideoPlayer } from "@easy-accordion/components";
import { Tooltip } from "@wordpress/components";
import { memo, useEffect, useLayoutEffect, useRef, useState } from "@wordpress/element";
import AccordionHeader from "../accordion-item/accordionHeader";
import { ToolbarBlockDuplicateIcon, ToolbarPlusIcon, RemoveIcon } from "./icons";
import { SidebarTabsContext } from "../../context";
import { getModulesSettings } from "@easy-accordion/controls";

const Render = ({ clientId, attributes, childBlocks, setAttributes }) => {
	const {
		uniqueId,
		parentId,
		template,
		accordionTitleTag,
		contentHeight,
		contentAnimationEffect,
		itemsVerticalGap,
		enableExpandAndCollapseIcon,
		eabBackground,
		generatedFaqItems,
	} = attributes;

	// states.
	const [activeId, setActiveId] = useState(childBlocks[0]?.clientId);
	const [contentMinHeight, setContentMinHeight] = useState("100%");
	const [contentStyle, setContentStyle] = useState({});
	const [focusedBlock, setFocusedBlock] = useState();
	// references.
	const headingRef = useRef(null);
	const contentRef = useRef(null);

	const updateAttributesByClientId = (id, attr) => {
		dispatch("core/block-editor").updateBlockAttributes(id, attr);
	};

	// new child block insert state.
	const { insertBlock, moveBlockToPosition, duplicateBlocks, removeBlocks } = useDispatch("core/block-editor");
	const blockAppender = (index = undefined) => {
		const newBlock = wp.blocks.createBlock("sp-easy-accordion-pro/sidebar-tab-item");
		insertBlock(newBlock, index, clientId);
	};

	const TitleTag = accordionTitleTag;

	useEffect(() => {
		if (contentHeight === "limit") {
			setContentMinHeight("100%");
			return;
		}
		setTimeout(() => {
			setContentMinHeight(`${headingRef?.current?.offsetHeight}px`);
		}, 100);
	}, [childBlocks.length, template, contentHeight, itemsVerticalGap?.device?.Desktop, enableExpandAndCollapseIcon]);

	useLayoutEffect(() => {
		if (template !== "sidebar-tab-accordion-one" || !headingRef.current || !contentRef.current) {
			setContentStyle({});
			return;
		}
		const headingHeightPx = headingRef.current.offsetHeight;
		const contentHeightPx = contentRef.current.offsetHeight;
		setContentStyle({ borderBottomLeftRadius: contentHeightPx > headingHeightPx ? "" : 0 });
	}, [template, activeId, contentMinHeight]);

	// move block up and down.
	const moveBlockPosition = (index) => {
		moveBlockToPosition(focusedBlock, clientId, clientId, index);
	};
	// duplicate block.
	const duplicateItem = () => {
		duplicateBlocks([focusedBlock]);
	};
	// remove block.
	const removeItem = () => {
		removeBlocks([focusedBlock]);
	};

	return (
		<SidebarTabsContext.Provider value={{ activeId, setActiveId, contentAnimationEffect }}>
			<div className={`sp-eab-wrapper sp-eab-sidebar-tab-accordion ${uniqueId}`}>
				{eabBackground?.style === "video" && (
					<VideoPlayer
						videoType={eabBackground?.videoType}
						bgVideo={eabBackground?.video?.html5}
						youtubeVideo={eabBackground?.video?.youtube}
					/>
				)}
				{getModulesSettings("generate_faqs_with_ai") && (
					<PromptCard
						parentId={clientId}
						childName={"sp-easy-accordion-pro/sidebar-tab-item"}
						generatedFaqItems={generatedFaqItems}
						setAttributes={setAttributes}
					/>
				)}
				<div className={`sp-eab-sidebar-tabs sp-eab-${template} sp-d-flex`}>
					{/* LEFT: TAB TITLES */}
					<div className="sp-eab-sidebar-tabs-nav-wrapper">
						<div className="sp-eab-sidebar-tabs-nav sp-d-flex sp-flex-col" ref={headingRef}>
							{childBlocks?.map((block, index) => (
								<TitleTag
									key={block?.clientId}
									className={`sp-eab-accordion-heading sp-d-flex sp-align-center eab-heading-${parentId}${activeId === block?.clientId ? " eab-expand" : ""}`}
									onClick={() => {
										setActiveId(block?.clientId);
										setFocusedBlock(block?.clientId);
									}}
								>
									{focusedBlock === block?.clientId && (
										<span className="sp-eab-editor-toolbar sp-d-flex sp-align-center">
											<Tooltip text={__("Move Item", "easy-accordion-free")}>
												<span className="eab-toolbar-button sp-d-flex sp-flex-col">
													<i
														className="eab-icon-angle-up-regular"
														onClick={() => moveBlockPosition(index - 1)}
													></i>
													<i
														className="eab-icon-angle-down-regular"
														onClick={() => moveBlockPosition(index + 1)}
													></i>
												</span>
											</Tooltip>
											<Tooltip text={__("Duplicate", "easy-accordion-free")}>
												<span className="eab-toolbar-button" onClick={duplicateItem}>
													<ToolbarBlockDuplicateIcon />
												</span>
											</Tooltip>
											<Tooltip text={__("Add New Item After Current", "easy-accordion-free")}>
												<span
													className="eab-toolbar-button"
													onClick={() => blockAppender(index + 1)}
												>
													<ToolbarPlusIcon />
												</span>
											</Tooltip>
											<Tooltip text={__("Remove Item", "easy-accordion-free")}>
												<span className="eab-toolbar-button" onClick={removeItem}>
													<RemoveIcon />
												</span>
											</Tooltip>
										</span>
									)}
									{template === "sidebar-tab-accordion-two" && (
										<span className="sp-eab-title-number sp-d-flex sp-align-center sp-justify-center">
											{block?.attributes?.faqNumber}
										</span>
									)}
									<AccordionHeader
										attributes={block?.attributes}
										onChangeTitle={(newTitle) =>
											updateAttributesByClientId(block.clientId, {
												accordionTitle: newTitle,
											})
										}
										onChangeSubtitle={(newSubtitle) =>
											updateAttributesByClientId(block.clientId, {
												accordionSubtitle: newSubtitle,
											})
										}
									/>
								</TitleTag>
							))}
						</div>
					</div>
					{/* RIGHT: TAB CONTENT */}
					<div
						className="sp-eab-sidebar-tabs-content sp-d-flex"
						ref={contentRef}
						style={{ minHeight: contentMinHeight, ...contentStyle }}
					>
						<InnerBlocks
							allowedBlocks={["sp-easy-accordion-pro/sidebar-tab-item"]}
							template={[
								["sp-easy-accordion-pro/sidebar-tab-item"],
								["sp-easy-accordion-pro/sidebar-tab-item"],
								["sp-easy-accordion-pro/sidebar-tab-item"],
							]}
							renderAppender={false}
						/>
					</div>
				</div>
				<BlockAppender blockAppenderFn={() => blockAppender(undefined)} />
			</div>
		</SidebarTabsContext.Provider>
	);
};

export default memo(Render);
