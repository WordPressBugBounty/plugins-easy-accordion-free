import { __ } from "@wordpress/i18n";
import {
	BgButtons,
	ColorPicker,
	InputControl,
	MediaPicker,
	SelectControl,
	SpGradientPicker,
} from "@easy-accordion/components";
import { BgIcon, GradientIcon, Image, Video } from "./svgIcons";
import "./editor.scss";

// Constants for better maintainability
const BACKGROUND_TYPES = {
	SOLID: "solid",
	GRADIENT: "gradient",
	IMAGE: "image",
	VIDEO: "video",
};

const VIDEO_TYPES = {
	HTML5: "html5",
	YOUTUBE: "youtube",
};

const BACKGROUND_OPTIONS = [
	{
		label: <BgIcon />,
		value: BACKGROUND_TYPES.SOLID,
		tooltip: __("Solid", "easy-accordion-free"),
	},
	{
		label: <GradientIcon />,
		value: BACKGROUND_TYPES.GRADIENT,
		tooltip: __("Gradient", "easy-accordion-free"),
	},
	{
		label: <Image />,
		value: BACKGROUND_TYPES.IMAGE,
		tooltip: __("Image", "easy-accordion-free"),
	},
	{
		label: <Video />,
		value: BACKGROUND_TYPES.VIDEO,
		tooltip: __("Video", "easy-accordion-free"),
	},
];

const IMAGE_POSITION_OPTIONS = [
	{ label: __("Inherit", "easy-accordion-free"), value: "inherit" },
	{ label: __("Bottom", "easy-accordion-free"), value: "bottom" },
	{ label: __("Center", "easy-accordion-free"), value: "center" },
	{ label: __("Top", "easy-accordion-free"), value: "top" },
	{ label: __("Right", "easy-accordion-free"), value: "right" },
	{ label: __("Left", "easy-accordion-free"), value: "left" },
	{ label: __("Initial", "easy-accordion-free"), value: "initial" },
];

const IMAGE_ATTACHMENT_OPTIONS = [
	{ label: __("Scroll", "easy-accordion-free"), value: "scroll" },
	{ label: __("Fixed", "easy-accordion-free"), value: "fixed" },
];

const IMAGE_REPEAT_OPTIONS = [
	{ label: __("No Repeat", "easy-accordion-free"), value: "no-repeat" },
	{ label: __("Repeat", "easy-accordion-free"), value: "repeat" },
	{ label: __("Repeat X", "easy-accordion-free"), value: "repeat-x" },
	{ label: __("Repeat Y", "easy-accordion-free"), value: "repeat-y" },
];

const IMAGE_SIZE_OPTIONS = [
	{ label: __("Auto", "easy-accordion-free"), value: "auto" },
	{ label: __("Cover", "easy-accordion-free"), value: "cover" },
	{ label: __("Contain", "easy-accordion-free"), value: "contain" },
];

const BackgroundControl = ({
	label = __("Background", "easy-accordion-free"),
	attributes,
	attributesKey,
	setAttributes,
	activeState = false,
}) => {
	// Helper function to get nested attribute value
	const getAttributeValue = (key) => {
		if (activeState) {
			return attributes?.[activeState]?.[key];
		}
		return attributes?.[key];
	};

	// Helper function to get image settings value
	const getImageSettingsValue = (key) => {
		if (activeState) {
			return attributes?.[activeState]?.imageSettings?.[key];
		}
		return attributes?.imageSettings?.[key];
	};

	// Helper function to get video value
	const getVideoValue = (type) => {
		if (activeState) {
			return attributes?.[activeState]?.video?.[type];
		}
		return attributes?.video?.[type];
	};

	// Helper function to update attributes safely
	const updateAttributes = (updates) => {
		if (activeState) {
			setAttributes({
				[attributesKey]: {
					...attributes,
					[activeState]: {
						...attributes[activeState],
						...updates,
					},
				},
			});
		} else {
			setAttributes({
				[attributesKey]: {
					...attributes,
					...updates,
				},
			});
		}
	};

	// Helper function to update image settings
	const updateImageSettings = (updates) => {
		if (activeState) {
			setAttributes({
				[attributesKey]: {
					...attributes,
					[activeState]: {
						...attributes[activeState],
						imageSettings: {
							...attributes[activeState]?.imageSettings,
							...updates,
						},
					},
				},
			});
		} else {
			setAttributes({
				[attributesKey]: {
					...attributes,
					imageSettings: {
						...attributes?.imageSettings,
						...updates,
					},
				},
			});
		}
	};

	// Helper function to update video settings
	const updateVideoSettings = (updates) => {
		if (activeState) {
			setAttributes({
				[attributesKey]: {
					...attributes,
					[activeState]: {
						...attributes[activeState],
						video: {
							...attributes[activeState]?.video,
							...updates,
						},
					},
				},
			});
		} else {
			setAttributes({
				[attributesKey]: {
					...attributes,
					video: {
						...attributes?.video,
						...updates,
					},
				},
			});
		}
	};

	const changeBackgroundValue = (key, value) => {
		updateAttributes({ [key]: value });
	};

	const changeImageSettings = (key, value) => {
		updateImageSettings({ [key]: value });
	};

	const changeVideoValue = (type, value) => {
		updateVideoSettings({ [type]: value });
	};

	// Filter available background options based on actual attributes
	const getAvailableBackgroundOptions = () => {
		const targetAttributes = activeState ? attributes[activeState] : attributes;
		return BACKGROUND_OPTIONS.filter((option) => Object.keys(targetAttributes || {}).includes(option.value));
	};

	const backgroundType = getAttributeValue("style");
	const videoType = getAttributeValue("videoType");
	const availableBackgroundOptions = getAvailableBackgroundOptions();

	return (
		<div className="sp-eab-background-control-wrapper">
			{/* Background Type Selector */}
			<BgButtons
				label={label}
				items={availableBackgroundOptions}
				attributes={backgroundType}
				onClick={(value) => changeBackgroundValue("style", value)}
			/>
			{/* Solid Background */}
			{backgroundType === BACKGROUND_TYPES.SOLID && (
				<ColorPicker
					label={__("Background Color", "easy-accordion-free")}
					value={getAttributeValue("solid")}
					onChange={(value) => changeBackgroundValue("solid", value)}
				/>
			)}

			{/* Gradient Background */}
			{backgroundType === BACKGROUND_TYPES.GRADIENT && (
				<div className="sp-eab-background sp-eab-component-mb">
					<SpGradientPicker
						value={getAttributeValue("gradient")}
						gradients={[]}
						onChange={(value) => changeBackgroundValue("gradient", value)}
					/>
				</div>
			)}

			{/* Image Background */}
			{backgroundType === BACKGROUND_TYPES.IMAGE && (
				<>
					<MediaPicker
						enableImageSize={false}
						setAttributes={setAttributes}
						backgroundImage={getAttributeValue("image")}
						onSelect={(value) => changeBackgroundValue("image", value)}
					/>

					<SelectControl
						label={__("Position", "easy-accordion-free")}
						attributes={getImageSettingsValue("bgImagePosition")}
						flexStyle={true}
						items={IMAGE_POSITION_OPTIONS}
						onChange={(value) => changeImageSettings("bgImagePosition", value)}
					/>

					<SelectControl
						label={__("Attachment", "easy-accordion-free")}
						attributes={getImageSettingsValue("bgImageAttachment")}
						flexStyle={true}
						items={IMAGE_ATTACHMENT_OPTIONS}
						onChange={(value) => changeImageSettings("bgImageAttachment", value)}
					/>

					<SelectControl
						label={__("Repeat", "easy-accordion-free")}
						attributes={getImageSettingsValue("bgImageRepeat")}
						flexStyle={true}
						items={IMAGE_REPEAT_OPTIONS}
						onChange={(value) => changeImageSettings("bgImageRepeat", value)}
					/>

					<SelectControl
						label={__("Size", "easy-accordion-free")}
						attributes={getImageSettingsValue("bgImageSize")}
						flexStyle={true}
						items={IMAGE_SIZE_OPTIONS}
						onChange={(value) => changeImageSettings("bgImageSize", value)}
					/>
				</>
			)}

			{/* Video Background */}
			{backgroundType === BACKGROUND_TYPES.VIDEO && (
				<>
					{/* <ButtonGroup
						label={__("Video Type", "easy-accordion-free")}
						attributes={videoType}
						items={VIDEO_TYPE_OPTIONS}
						onClick={(value) => changeBackgroundValue("videoType", value)}
					/> */}

					{videoType === VIDEO_TYPES.HTML5 && (
						<MediaPicker
							label={__("Video", "easy-accordion-free")}
							mediaType="video"
							slug="video"
							enableImageSize={false}
							backgroundImage={getVideoValue("html5")}
							onSelect={(value) => changeVideoValue("html5", value)}
						/>
					)}

					{videoType === VIDEO_TYPES.YOUTUBE && (
						<InputControl
							label={__("YouTube Video Link", "easy-accordion-free")}
							attributes={getVideoValue("youtube")}
							onChange={(value) => changeVideoValue("youtube", value)}
							placeholder="https://www.youtube.com/watch?v=..."
							__next40pxDefaultSize
						/>
					)}
				</>
			)}

			{/* Overlay for Image and Video */}
			{(backgroundType === BACKGROUND_TYPES.VIDEO || backgroundType === BACKGROUND_TYPES.IMAGE) && (
				<ColorPicker
					label={__("Overlay Color", "easy-accordion-free")}
					value={getAttributeValue("bgOverlay")}
					onChange={(value) => changeBackgroundValue("bgOverlay", value)}
					help={__("Adds a color overlay on top of the background", "easy-accordion-free")}
				/>
			)}
		</div>
	);
};

export default BackgroundControl;
