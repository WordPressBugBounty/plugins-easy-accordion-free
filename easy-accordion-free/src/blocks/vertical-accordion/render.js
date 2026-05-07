import { useDispatch } from "@wordpress/data";
import { InnerBlocks } from "@wordpress/block-editor";
import { Accordion, BlockAppender } from "@easy-accordion/templates";
import { memo, useState } from "@wordpress/element";
import { VideoPlayer } from "@easy-accordion/components";
import { getModulesSettings } from "@easy-accordion/controls";
import { PromptCard } from "@easy-accordion/templates";

const Render = ({ attributes, clientId, childBlocks, setAttributes }) => {
	const [insertedBlock, setInsertedBlock] = useState({});
	const {
		template,
		defaultAccordionOpen,
		blockName,
		uniqueId,
		contentAnimationEffect,
		eabBackground,
		generatedFaqItems,
	} = attributes;
	const { insertBlock } = useDispatch("core/block-editor");

	const blockAppender = () => {
		const newBlock = wp.blocks.createBlock("sp-easy-accordion-pro/accordion-item");
		insertBlock(newBlock, undefined, clientId);
		setInsertedBlock(newBlock);
	};

	// default open accordion.
	let defaultOpenItems = [];
	switch (defaultAccordionOpen) {
		case "first-item":
			defaultOpenItems = [childBlocks[0]?.clientId];
			break;
		case "open-all":
			defaultOpenItems = childBlocks.map((block) => block.clientId);
			break;
		case "close-all":
			defaultOpenItems = [];
			break;
		default:
			defaultOpenItems = [childBlocks[0]?.clientId];
			break;
	}

	if (insertedBlock?.clientId) {
		defaultOpenItems = [insertedBlock?.clientId];
	}

	const expandHeight = false;

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
				key={childBlocks?.length}
				multipleOpenAtATime={true}
				duration={600}
				className={`sp-eab-${template}`}
				accordionMode={"vertical"}
				defaultExpandItems={defaultOpenItems}
				expandHeight={expandHeight}
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
