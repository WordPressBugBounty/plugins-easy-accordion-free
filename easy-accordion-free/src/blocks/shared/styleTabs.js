import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";
import {
	ColorPicker,
	TypographyNew,
	Spacing,
	SPRangeControl,
	ButtonGroup,
	BoxShadow,
	Popover,
	FlatBorder,
	Divider,
	Border,
	SpProNotice,
} from "@easy-accordion/components";

export const TitleStyleTab = ({ attributes, setAttributes }) => {
	const [colorState, setColorState] = useState("normal");
	const {
		accordionTitleTypography,
		accordionTitleFontSize,
		accordionTitleLetterSpacing,
		accordionTitleLineHeight,
		accordionTitleBackground,
		accordionTitlePadding,
		accordionTitleColors,
		accordionTitleBorderRadius,
		accordionTitleBorder,
		accordionTitleBorderWidth,
	} = attributes;

	const shadowKey = {
		normal: "accordionTitleNormalBoxShadow",
		hover: "accordionTitleHoverBoxShadow",
		active: "accordionTitleActiveBoxShadow",
	};

	return (
		<>
			<TypographyNew
				label={__("Title Typography", "easy-accordion-free")}
				attributes={{
					typography: accordionTitleTypography,
					typographyKey: "accordionTitleTypography",
					fontSize: accordionTitleFontSize,
					fontSizeKey: "accordionTitleFontSize",
					letterSpacing: accordionTitleLetterSpacing,
					letterSpacingKey: "accordionTitleLetterSpacing",
					lineHeight: accordionTitleLineHeight,
					lineHeightKey: "accordionTitleLineHeight",
				}}
				setAttributes={setAttributes}
				fontSizeDefault={{ unit: "px", value: 18 }}
			/>
			<ColorPicker
				label={__("Title Color", "easy-accordion-free")}
				value={accordionTitleColors}
				attributesKey={"accordionTitleColors"}
				setAttributes={setAttributes}
			/>
			<ColorPicker
				label={__("Background", "easy-accordion-free")}
				value={accordionTitleBackground}
				attributesKey={"accordionTitleBackground"}
				setAttributes={setAttributes}
			/>
			<BoxShadow
				attributes={attributes[shadowKey[colorState]]}
				attributesKey={shadowKey[colorState]}
				setAttributes={setAttributes}
			/>
			<Divider />
			<Border
				attributes={{
					border: accordionTitleBorder,
					borderWidth: accordionTitleBorderWidth,
				}}
				attributesKey={{
					border: "accordionTitleBorder",
					borderWidth: "accordionTitleBorderWidth",
				}}
				defaultValue={{
					unit: "px",
					value: {
						top: "1",
						right: "1",
						bottom: "1",
						left: "1",
					},
				}}
				setAttributes={setAttributes}
			/>
			{/* title background */}
			<Spacing
				label={__("Border Radius", "easy-accordion-free")}
				attributes={accordionTitleBorderRadius}
				attributesKey={"accordionTitleBorderRadius"}
				setAttributes={setAttributes}
				defaultValue={{
					unit: "px",
					value: {
						top: "4",
						right: "4",
						bottom: "4",
						left: "4",
					},
				}}
				radiusIndicators={true}
			/>
			<Spacing
				label={__("Padding", "easy-accordion-free")}
				attributes={accordionTitlePadding}
				attributesKey={"accordionTitlePadding"}
				setAttributes={setAttributes}
				units={["px", "%", "em"]}
				defaultValue={{
					unit: "px",
					value: {
						top: "20",
						right: "24",
						bottom: "20",
						left: "24",
					},
				}}
			/>
			<SpProNotice
				message={__("Customize Title & Icon state — Normal, Hover & Active.", "easy-accordion-free")}
				className="normal"
			/>
		</>
	);
};
export const IconStyleTab = ({ attributes, setAttributes }) => {
	const {
		toggleIconColors,
		toggleIconBackground,
		toggleIconBorder,
		toggleIconBorderWidth,
		toggleIconBorderRadius,
		toggleIconPadding,
		toggleIconMargin,
	} = attributes;

	return (
		<>
			<ColorPicker
				label={__("Color", "easy-accordion-free")}
				value={toggleIconColors}
				attributesKey={"toggleIconColors"}
				setAttributes={setAttributes}
			/>
			<ColorPicker
				label={__("Background Color", "easy-accordion-free")}
				value={toggleIconBackground}
				attributesKey={"toggleIconBackground"}
				setAttributes={setAttributes}
			/>
			<Divider />
			<Border
				attributes={{
					border: toggleIconBorder,
					borderWidth: toggleIconBorderWidth,
				}}
				attributesKey={{
					border: "toggleIconBorder",
					borderWidth: "toggleIconBorderWidth",
				}}
				defaultValue={{
					unit: "px",
					value: {
						top: "0",
						right: "0",
						bottom: "0",
						left: "0",
					},
				}}
				setAttributes={setAttributes}
			/>
			<Spacing
				label={__("Border Radius", "easy-accordion-free")}
				attributes={toggleIconBorderRadius}
				attributesKey={"toggleIconBorderRadius"}
				setAttributes={setAttributes}
				defaultValue={{
					unit: "px",
					value: {
						top: "0",
						right: "0",
						bottom: "0",
						left: "0",
					},
				}}
				radiusIndicators={true}
			/>
			<Spacing
				label={__("Padding", "easy-accordion-free")}
				attributes={toggleIconPadding}
				attributesKey={"toggleIconPadding"}
				setAttributes={setAttributes}
				units={["px", "%", "em"]}
				defaultValue={{
					unit: "px",
					value: {
						top: "0",
						right: "0",
						bottom: "0",
						left: "0",
					},
				}}
			/>
			<Spacing
				label={__("Margin", "easy-accordion-free")}
				attributes={toggleIconMargin}
				attributesKey={"toggleIconMargin"}
				setAttributes={setAttributes}
				units={["px", "%", "em"]}
				defaultValue={{
					unit: "px",
					value: {
						top: "0",
						right: "0",
						bottom: "0",
						left: "0",
					},
				}}
			/>
			<SpProNotice
				message={__("Customize each state — Normal, Hover & Active with ease.", "easy-accordion-free")}
				className="normal"
			/>
		</>
	);
};
export const ImageStyleTab = ({ attributes, setAttributes }) => {
	const { imgBorder, imgBorderWidth, imgBorderRadius, imgOverlayColor } = attributes;

	return (
		<>
			<Popover label={__("Border", "easy-accordion-free")}>
				<FlatBorder
					attributes={{
						border: imgBorder,
						borderWidth: imgBorderWidth,
					}}
					attributesKey={{
						border: "imgBorder",
						borderWidth: "imgBorderWidth",
					}}
					defaultValue={{
						unit: "px",
						value: {
							top: "1",
							right: "1",
							bottom: "1",
							left: "1",
						},
					}}
					setAttributes={setAttributes}
				/>
			</Popover>
			<Spacing
				label={__("Border Radius", "easy-accordion-free")}
				attributes={imgBorderRadius}
				attributesKey={"imgBorderRadius"}
				setAttributes={setAttributes}
				defaultValue={{
					unit: "px",
					value: {
						top: "6",
						right: "6",
						bottom: "6",
						left: "6",
					},
				}}
				radiusIndicators={true}
			/>
			<ColorPicker
				label={__("Overlay Color", "easy-accordion-free")}
				value={imgOverlayColor}
				attributesKey={"imgOverlayColor"}
				setAttributes={setAttributes}
			/>
		</>
	);
};
export const ImageContentStyleTab = ({ attributes, setAttributes }) => {
	const {
		accordionTitleColors,
		accordionTitleTypography,
		accordionTitleFontSize,
		accordionTitleLineHeight,
		accordionTitleLetterSpacing,
		descriptionTypography,
		descriptionFontSize,
		descriptionLineHeight,
		descriptionLetterSpacing,
		descriptionColor,
		contentPadding,
		showTitle,
		showDescription,
	} = attributes;

	return (
		<>
			{showTitle && (
				<>
					<TypographyNew
						label={__("Title Typography", "easy-accordion-free")}
						attributes={{
							typography: accordionTitleTypography,
							typographyKey: "accordionTitleTypography",
							fontSize: accordionTitleFontSize,
							fontSizeKey: "accordionTitleFontSize",
							letterSpacing: accordionTitleLetterSpacing,
							letterSpacingKey: "accordionTitleLetterSpacing",
							lineHeight: accordionTitleLineHeight,
							lineHeightKey: "accordionTitleLineHeight",
						}}
						setAttributes={setAttributes}
						fontSizeDefault={{
							unit: "px",
							value: 24,
						}}
					/>
					<ColorPicker
						label={__("Title Color", "easy-accordion-free")}
						value={accordionTitleColors}
						attributesKey={"accordionTitleColors"}
						setAttributes={setAttributes}
						defaultColor={"#2F2F2F"}
					/>
				</>
			)}
			{showDescription && (
				<>
					<TypographyNew
						label={__("Description Typography", "easy-accordion-free")}
						attributes={{
							typography: descriptionTypography,
							typographyKey: "descriptionTypography",
							fontSize: descriptionFontSize,
							fontSizeKey: "descriptionFontSize",
							letterSpacing: descriptionLetterSpacing,
							letterSpacingKey: "descriptionLetterSpacing",
							lineHeight: descriptionLineHeight,
							lineHeightKey: "descriptionLineHeight",
						}}
						setAttributes={setAttributes}
						fontSizeDefault={{
							unit: "px",
							value: 16,
						}}
					/>
					<ColorPicker
						label={__("Description Color", "easy-accordion-free")}
						value={descriptionColor}
						attributesKey={"descriptionColor"}
						setAttributes={setAttributes}
						defaultColor={"#2F2F2F"}
					/>
				</>
			)}
			<Spacing
				label={__("Content Padding", "easy-accordion-free")}
				attributes={contentPadding}
				attributesKey={"contentPadding"}
				setAttributes={setAttributes}
				defaultValue={{
					unit: "px",
					value: {
						top: "0",
						right: "0",
						bottom: "0",
						left: "0",
					},
				}}
			/>
		</>
	);
};
export const VerticalContentStyleTab = ({ attributes, setAttributes }) => {
	const {
		accordionContentTypography,
		accordionContentFontSize,
		accordionContentLineHeight,
		accordionContentLetterSpacing,
		accordionContentColor,
		accordionContentBackground,
		accordionContentPadding,
		contentShowCloseButton,
		blockName,
		itemContentBorder,
		itemContentBorderWidth,
		itemContentBorderRadius,
	} = attributes;

	return (
		<>
			<TypographyNew
				label={__("Typography", "easy-accordion-free")}
				attributes={{
					typography: accordionContentTypography,
					typographyKey: "accordionContentTypography",
					fontSize: accordionContentFontSize,
					fontSizeKey: "accordionContentFontSize",
					lineHeight: accordionContentLineHeight,
					lineHeightKey: "accordionContentLineHeight",
					letterSpacing: accordionContentLetterSpacing,
					letterSpacingKey: "accordionContentLetterSpacing",
				}}
				setAttributes={setAttributes}
				fontSizeDefault={{ unit: "px", value: 16 }}
			/>
			<ColorPicker
				label={__("Content Color", "easy-accordion-free")}
				value={accordionContentColor}
				attributesKey={"accordionContentColor"}
				setAttributes={setAttributes}
			/>
			<ColorPicker
				label={__("Background", "easy-accordion-free")}
				value={accordionContentBackground}
				attributesKey={"accordionContentBackground"}
				setAttributes={setAttributes}
			/>
			{blockName === "sidebar-tab-accordion" && (
				<>
					<Border
						attributes={{
							border: itemContentBorder,
							borderWidth: itemContentBorderWidth,
						}}
						attributesKey={{
							border: "itemContentBorder",
							borderWidth: "itemContentBorderWidth",
						}}
						defaultValue={{
							unit: "px",
							value: {
								top: "1",
								right: "1",
								bottom: "1",
								left: "1",
							},
						}}
						setAttributes={setAttributes}
					/>
					<Spacing
						label={__("Border Radius", "easy-accordion-free")}
						attributes={itemContentBorderRadius}
						attributesKey={"itemContentBorderRadius"}
						setAttributes={setAttributes}
						defaultValue={{
							unit: "px",
							value: {
								top: "4",
								right: "4",
								bottom: "4",
								left: "4",
							},
						}}
						radiusIndicators={true}
					/>
				</>
			)}
			<Spacing
				label={__("Padding", "easy-accordion-free")}
				attributes={accordionContentPadding}
				attributesKey={"accordionContentPadding"}
				setAttributes={setAttributes}
				units={["px", "%", "em"]}
				defaultValue={{
					unit: "px",
					value: {
						top: "18",
						right: "24",
						bottom: "18",
						left: "24",
					},
				}}
			/>
		</>
	);
};

export const PostMetaStyleTab = ({ attributes, setAttributes }) => {
	const {
		postMetaFontSize,
		postMetaTypography,
		postMetaLetterSpacing,
		postMetaLineHeight,
		postMetaColor,
		postMetaGap,
		postMetaMargin,
	} = attributes;

	return (
		<>
			<TypographyNew
				label={__("Typography", "easy-accordion-free")}
				attributes={{
					typography: postMetaTypography,
					typographyKey: "postMetaTypography",
					fontSize: postMetaFontSize,
					fontSizeKey: "postMetaFontSize",
					lineHeight: postMetaLineHeight,
					lineHeightKey: "postMetaLineHeight",
					letterSpacing: postMetaLetterSpacing,
					letterSpacingKey: "postMetaLetterSpacing",
				}}
				setAttributes={setAttributes}
				fontSizeDefault={{ unit: "px", value: 14 }}
			/>
			<ColorPicker
				label={__("Color", "easy-accordion-free")}
				value={postMetaColor}
				attributesKey={"postMetaColor"}
				setAttributes={setAttributes}
				defaultColor={"#6D6D6D"}
			/>
			<SPRangeControl
				label={__("Gap Between Meta Data", "easy-accordion-free")}
				attributes={postMetaGap}
				attributesKey={"postMetaGap"}
				setAttributes={setAttributes}
				max={100}
				min={0}
				units={["px", "%", "em"]}
				defaultValue={{ unit: "px", value: 15 }}
			/>
			<Spacing
				label={__("Margin", "easy-accordion-free")}
				attributes={postMetaMargin}
				attributesKey={"postMetaMargin"}
				setAttributes={setAttributes}
				defaultValue={{
					unit: "px",
					value: {
						top: "0",
						right: "0",
						bottom: "12",
						left: "0",
					},
				}}
			/>
		</>
	);
};
export const PostContentStyleTab = ({ attributes, setAttributes }) => {
	const {
		template,
		blockName,
		excerptFontSize,
		excerptTypography,
		excerptLetterSpacing,
		excerptLineHeight,
		excerptColor,
		contentPadding,
		ContentBackground,
		priceTypography,
		priceFontSize,
		priceLineHeight,
		priceLetterSpacing,
		priceColor,
		addToCartTypography,
		addToCartFontSize,
		addToCartLineHeight,
		addToCartLetterSpacing,
		cartButtonColors,
		cartButtonBgColors,
		cartButtonBorder,
		cartButtonBorderWidth,
		cartButtonBorderRadius,
		cartButtonPadding,
		accordionTitleColors,
		accordionTitleTypography,
		accordionTitleFontSize,
		accordionTitleFontSpacing,
		accordionTitleLineHeight,
	} = attributes;

	const [toggleState, setToggleState] = useState("color");
	const toggleBtnColors = {
		color: "#2F2F2F",
		hoverColor: "#FFFFFF",
	};
	const toggleBtnBgColors = {
		color: "#FAFAFA",
		hoverColor: "#2F2F2F",
	};

	return (
		<>
			{blockName === "product-accordion" && (
				<>
					{template !== "product-accordion-one" && (
						<>
							<TypographyNew
								label={__("Title Typography", "easy-accordion-free")}
								attributes={{
									typography: accordionTitleTypography,
									typographyKey: "accordionTitleTypography",
									fontSize: accordionTitleFontSize,
									fontSizeKey: "accordionTitleFontSize",
									letterSpacing: accordionTitleFontSpacing,
									letterSpacingKey: "accordionTitleFontSpacing",
									lineHeight: accordionTitleLineHeight,
									lineHeightKey: "accordionTitleLineHeight",
								}}
								setAttributes={setAttributes}
								fontSizeDefault={{
									unit: "px",
									value: 24,
								}}
							/>
							<ColorPicker
								label={__("Title Color", "easy-accordion-free")}
								value={accordionTitleColors}
								attributesKey={"accordionTitleColors"}
								setAttributes={setAttributes}
								defaultColor={"#2F2F2F"}
							/>
						</>
					)}
					<TypographyNew
						label={__("Price Typography", "easy-accordion-free")}
						attributes={{
							typography: priceTypography,
							typographyKey: "priceTypography",
							fontSize: priceFontSize,
							fontSizeKey: "priceFontSize",
							lineHeight: priceLineHeight,
							lineHeightKey: "priceLineHeight",
							letterSpacing: priceLetterSpacing,
							letterSpacingKey: "priceLetterSpacing",
						}}
						setAttributes={setAttributes}
						fontSizeDefault={{ unit: "px", value: 16 }}
					/>
					<ColorPicker
						label={__("Price Color", "easy-accordion-free")}
						value={priceColor}
						attributesKey={"priceColor"}
						setAttributes={setAttributes}
						defaultColor={"#2F2F2F"}
					/>
				</>
			)}
			<TypographyNew
				label={
					blockName === "post-accordion"
						? __("Excerpt Typography", "easy-accordion-free")
						: __("Short Description Typography", "easy-accordion-free")
				}
				attributes={{
					typography: excerptTypography,
					typographyKey: "excerptTypography",
					fontSize: excerptFontSize,
					fontSizeKey: "excerptFontSize",
					lineHeight: excerptLineHeight,
					lineHeightKey: "excerptLineHeight",
					letterSpacing: excerptLetterSpacing,
					letterSpacingKey: "excerptLetterSpacing",
				}}
				setAttributes={setAttributes}
				fontSizeDefault={{ unit: "px", value: 16 }}
			/>
			<ColorPicker
				label={
					blockName === "post-accordion"
						? __("Excerpt Color", "easy-accordion-free")
						: __("Short Description Color", "easy-accordion-free")
				}
				value={excerptColor}
				attributesKey={"excerptColor"}
				setAttributes={setAttributes}
				defaultColor={"#2F2F2F"}
			/>
			{blockName === "product-accordion" && (
				<>
					<TypographyNew
						label={__("Add to Cart Typography", "easy-accordion-free")}
						attributes={{
							typography: addToCartTypography,
							typographyKey: "addToCartTypography",
							fontSize: addToCartFontSize,
							fontSizeKey: "addToCartFontSize",
							lineHeight: addToCartLineHeight,
							lineHeightKey: "addToCartLineHeight",
							letterSpacing: addToCartLetterSpacing,
							letterSpacingKey: "addToCartLetterSpacing",
						}}
						setAttributes={setAttributes}
						fontSizeDefault={{ unit: "px", value: 16 }}
					/>
					<Popover label={__("Add to Cart Button", "easy-accordion-free")}>
						<ButtonGroup
							attributes={toggleState}
							items={[
								{
									label: "Normal",
									value: "color",
								},
								{
									label: "Hover",
									value: "hoverColor",
								},
							]}
							onClick={(e) => setToggleState(e)}
						/>
						<ColorPicker
							label={__("Color", "easy-accordion-free")}
							value={cartButtonColors[toggleState]}
							onChange={(e) =>
								setAttributes({
									cartButtonColors: {
										...cartButtonColors,
										[toggleState]: e,
									},
								})
							}
							defaultColor={toggleBtnColors[toggleState]}
						/>
						<ColorPicker
							label={__("Background", "easy-accordion-free")}
							value={cartButtonBgColors[toggleState]}
							onChange={(e) =>
								setAttributes({
									cartButtonBgColors: {
										...cartButtonBgColors,
										[toggleState]: e,
									},
								})
							}
							defaultColor={toggleBtnBgColors[toggleState]}
						/>
						<Divider />
						<FlatBorder
							attributes={{
								border: cartButtonBorder,
								borderWidth: cartButtonBorderWidth,
							}}
							attributesKey={{
								border: "cartButtonBorder",
								borderWidth: "cartButtonBorderWidth",
							}}
							defaultValue={{
								unit: "px",
								value: {
									top: "1",
									right: "1",
									bottom: "1",
									left: "1",
								},
							}}
							setAttributes={setAttributes}
						/>
						<Divider />
						<Spacing
							label={__("Border Radius", "easy-accordion-free")}
							attributes={cartButtonBorderRadius}
							attributesKey={"cartButtonBorderRadius"}
							setAttributes={setAttributes}
							defaultValue={{
								unit: "px",
								value: {
									top: "2",
									right: "2",
									bottom: "2",
									left: "2",
								},
							}}
							radiusIndicators={true}
						/>
						<Spacing
							label={__("Padding", "easy-accordion-free")}
							attributes={cartButtonPadding}
							attributesKey={"cartButtonPadding"}
							setAttributes={setAttributes}
							defaultValue={{
								unit: "px",
								value: {
									top: "12",
									right: "18",
									bottom: "12",
									left: "18",
								},
							}}
						/>
					</Popover>
				</>
			)}
			<ColorPicker
				label={__("Background Color", "easy-accordion-free")}
				value={ContentBackground}
				attributesKey={"ContentBackground"}
				setAttributes={setAttributes}
				defaultColor={"#FFFFFF"}
			/>
			<Spacing
				label={__("Padding", "easy-accordion-free")}
				attributes={contentPadding}
				attributesKey={"contentPadding"}
				setAttributes={setAttributes}
				defaultValue={{
					unit: "px",
					value: {
						top: "20",
						right: "24",
						bottom: "20",
						left: "24",
					},
				}}
			/>
		</>
	);
};
