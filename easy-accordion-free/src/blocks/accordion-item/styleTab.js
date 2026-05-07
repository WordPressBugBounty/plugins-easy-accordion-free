import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import { ColorPicker, ButtonGroup, ToggleControl, Divider, SpProNotice } from "@easy-accordion/components";
import { useTogglePanelBody } from "@easy-accordion/hooks";
import { dispatch } from "@wordpress/data";
import { ArrowUpRight } from "../../components/icons";

export const MainStyleTab = ({ attributes, setAttributes }) => {
	const { accordionContentColors, showBlockSubtitle, disableItem, clientId } = attributes;
	const [itemType, setItemType] = useState("accordionTitle");

	const colorAttrKey = `${itemType}Colors`;
	const backgroundAttrKey = `${itemType}Background`;
	const borderColorAttrKey = `${itemType}BorderColors`;
	const colorLabels = {
		accordionTitle: __("Title Color", "easy-accordion-free"),
		accordionIcon: __("Icon Color", "easy-accordion-free"),
	};

	const { togglePanelBody, toggleActiveTab } = useTogglePanelBody();

	const handleStyleTabClick = () => {
		const { getBlockParents } = wp.data.select("core/block-editor");
		const parents = getBlockParents(clientId);
		if (!parents?.length) {
			return;
		}
		const parentClientId = parents[parents?.length - 1];
		dispatch("core/block-editor").selectBlock(parentClientId);
		togglePanelBody(itemType === "accordionTitle" ? "title" : "icon");
		toggleActiveTab("style");
	};

	return (
		<>
			<ButtonGroup
				items={[
					{ label: "Title", value: "accordionTitle" },
					{ label: "Toggle Icon", value: "accordionIcon" },
					{ label: "Content", value: "accordionContent" },
				]}
				attributes={itemType}
				onClick={(state) => setItemType(state)}
			/>
			{itemType !== "accordionContent" && (
				<>
					<ColorPicker
						label={colorLabels[itemType]}
						value={attributes[colorAttrKey]}
						onChange={(value) => setAttributes({ [colorAttrKey]: value })}
						defaultColor={"#2F2F2F"}
					/>
				</>
			)}
			{itemType === "accordionContent" && (
				<ColorPicker
					label={__("Text Color", "easy-accordion-free")}
					setAttributes={setAttributes}
					value={accordionContentColors}
					attributesKey={"accordionContentColors"}
					defaultColor={"#2F2F2F"}
				/>
			)}
			<ColorPicker
				label={__("Background", "easy-accordion-free")}
				value={attributes[backgroundAttrKey]}
				onChange={(value) => setAttributes({ [backgroundAttrKey]: value })}
			/>
			{itemType !== "accordionContent" && (
				<ColorPicker
					label={__("Border Color", "easy-accordion-free")}
					value={attributes[borderColorAttrKey]}
					onChange={(value) => setAttributes({ [borderColorAttrKey]: value })}
					defaultColor={"#E2E2E2"}
				/>
			)}
			{itemType !== "accordionContent" && (
				<div className="eab-style-indicator">
					To set the {itemType === "accordionTitle" ? "Title" : "Icon"} global style,{" "}
					<a
						href="#"
						onClick={(e) => {
							e.preventDefault();
							handleStyleTabClick();
						}}
					>
						click here <ArrowUpRight />
					</a>
				</div>
			)}
			<Divider />
			<ToggleControl
				label={__("Subtitle", "easy-accordion-free")}
				attributes={showBlockSubtitle}
				attributesKey={"showBlockSubtitle"}
				setAttributes={setAttributes}
				onlyPro={true}
			/>
			<ToggleControl
				label={__("Disable Item", "easy-accordion-free")}
				attributesKey={"disableItem"}
				attributes={disableItem}
				setAttributes={setAttributes}
				onlyPro={true}
			/>
			<SpProNotice
				message={__("Customize Item state — Normal, Hover & Active with ease.", "easy-accordion-free")}
				className="normal"
			/>
		</>
	);
};
