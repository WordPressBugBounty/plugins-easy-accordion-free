import { useDispatch } from "@wordpress/data";
import { memo, useState } from "@wordpress/element";
import { InnerBlocks } from "@wordpress/block-editor";
import { Accordion, BlockAppender, PromptCard } from "@easy-accordion/templates";
import { getModulesSettings, useDeviceType } from "@easy-accordion/controls";
import { VideoPlayer } from "@easy-accordion/components";

const Render = ({ clientId, attributes, childBlocks, setAttributes }) => {
	const [insertedBlock, setInsertedBlock] = useState({});
	const {
		template,
		blockName,
		uniqueId,
		contentAnimationEffect,
		itemsExpandWidth,
		itemsWidth,
		eabBackground,
		generatedFaqItems,
	} = attributes;
	const { insertBlock, selectBlock } = useDispatch("core/block-editor");
	const deviceType = useDeviceType();

	const blockAppender = () => {
		const newBlock = wp.blocks.createBlock("sp-easy-accordion-pro/accordion-item");
		insertBlock(newBlock, undefined, clientId, false);
		setInsertedBlock(newBlock);
		// focus block after insert.
		setTimeout(() => {
			selectBlock(newBlock?.clientId);
		}, 200);
	};

	const totalAccordionItems = childBlocks.length;
	let defaultOpenItems = [childBlocks[0]?.clientId];
	if (insertedBlock?.clientId) {
		defaultOpenItems = [insertedBlock?.clientId];
	}
	// calculate expanded area width.
	let expandWidth = itemsExpandWidth?.device[deviceType];
	const expandWidthUnit = itemsExpandWidth?.unit[deviceType];
	if (expandWidthUnit === "%") {
		expandWidth = itemsWidth?.device[deviceType] * (expandWidth / 100);
	}

	return (
		<div className={`sp-eab-wrapper sp-eab-${blockName} ${uniqueId}`}>
			{eabBackground?.style === "video" && (
				<VideoPlayer
					videoType={eabBackground?.videoType}
					bgVideo={eabBackground?.video?.html5}
					youtubeVideo={eabBackground?.video?.youtube}
				/>
			)}
			{getModulesSettings("generate_faqs_with_ai") && (
				<PromptCard parentId={clientId} generatedFaqItems={generatedFaqItems} setAttributes={setAttributes} />
			)}
			<Accordion
				key={totalAccordionItems}
				multipleOpenAtATime={false}
				duration={800}
				className={`sp-eab-${template}`}
				accordionMode={"horizontal"}
				expandWidth={expandWidth}
				defaultExpandItems={defaultOpenItems}
				animationEffect={contentAnimationEffect}
			>
				<InnerBlocks
					allowedBlocks={["sp-easy-accordion-pro/accordion-item"]}
					template={[
						["sp-easy-accordion-pro/accordion-item"],
						["sp-easy-accordion-pro/accordion-item"],
						["sp-easy-accordion-pro/accordion-item"],
					]}
					renderAppender={false}
				/>
				<BlockAppender blockAppenderFn={blockAppender} />
			</Accordion>
		</div>
	);
};

export default memo(Render);
