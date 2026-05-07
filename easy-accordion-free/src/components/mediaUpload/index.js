import { __ } from "@wordpress/i18n";
import { BaseControl, FocalPointPicker, SelectControl } from "@wordpress/components";
import { ButtonGroup, Popover, VideoPlayer } from "@easy-accordion/components";
import { MediaUpload } from "@wordpress/block-editor";
import { PopOverImgToggleIcon } from "../popover/icons";
import "./editor.scss";

const MediaPicker = ({
	backgroundImage,
	imageKey,
	setAttributes,
	imageSizeValue,
	imageSizeKey,
	slug = "image",
	label = __("Image", "easy-accordion-free"),
	disableLabel = false,
	disableRemove = false,
	mediaType = "image",
	enableImageSize = true,
	onSelect = false,
	removeImage = false,
	imgFocalPoint = false,
	customClass = "",
}) => {
	// Read from attributes if passed
	const toggleState = backgroundImage?.toggleState || "expanded";
	const focalPoint = backgroundImage?.focalPoints?.[toggleState] || { x: 0.5, y: 0.5 };
	const toggleStateScale = backgroundImage?.scale || "cover";

	const updateFocalPoint = (newPoint) => {
		setAttributes({
			[imageKey]: {
				...backgroundImage,
				focalPoints: {
					...(backgroundImage?.focalPoints || {}),
					[toggleState]: newPoint, // ✅ state-based save
				},
			},
		});
	};

	const updateToggleState = (newState) => {
		setAttributes({
			[imageKey]: {
				...backgroundImage,
				toggleState: newState,
			},
		});
	};

	const updateScale = (newScale) => {
		setAttributes({
			[imageKey]: {
				...backgroundImage,
				scale: newScale,
			},
		});
	};
	/*
	 * Event to set Image as while adding.
	 */
	const onSelectImage = (media) => {
		if (!media?.url) {
			setAttributes({ [imageKey]: null });
			return;
		}

		setAttributes({
			[imageKey]: {
				...backgroundImage, // keep focalPoints, scale, toggleState
				...media,
				focalPoints: backgroundImage?.focalPoints || {
					collapsed: { x: 0.5, y: 0.5 },
					expanded: { x: 0.5, y: 0.5 },
				},
				toggleState: backgroundImage?.toggleState || "collapsed",
				scale: backgroundImage?.scale || "cover",
			},
		});
	};

	const style = {
		backgroundImage: `url(${backgroundImage?.url})`,
		backgroundPosition: `${focalPoint.x * 100}% ${focalPoint.y * 100}%`,
		backgroundSize: backgroundImage?.scale || "cover",
	};

	const imagesSizeOptions = (image) => {
		const sizeArr = [];
		for (const size in image.sizes) {
			if (image.sizes.hasOwnProperty(size)) {
				const p = {
					value: size,
					label: size.charAt(0).toUpperCase() + size.slice(1),
				};
				sizeArr.push(p);
			}
		}
		return sizeArr;
	};

	/*
	 * Event to set Image as null while removing.
	 */
	const onRemoveImage = () => {
		if (onSelect) {
			onSelect({});
		} else {
			setAttributes({ [imageKey]: "" });
		}
	};

	// These are the localized texts that will show on the Select / Change Button and Popup.
	const labels = {
		video: {
			selectMediaLabel: __("Select Video", "easy-accordion-free"),
			replaceMediaLabel: __("Change Video", "easy-accordion-free"),
		},
		lottie: {
			selectMediaLabel: __("Select Lottie Animation", "easy-accordion-free"),
			replaceMediaLabel: __("Change Lottie Animation", "easy-accordion-free"),
		},
	}[slug] || {
		selectMediaLabel: __("Select Image", "easy-accordion-free"),
		replaceMediaLabel: __("Change Image", "easy-accordion-free"),
	};
	const { selectMediaLabel, replaceMediaLabel } = labels;

	const renderMediaUploader = (open) => {
		const uploadType = backgroundImage?.url ? "replace" : "add";
		return (
			<button
				className={`sp-eab-media-control__clickable sp-eab-media-control__clickable--${uploadType}`}
				onClick={open}
			>
				{"add" === uploadType ? (
					renderButton(uploadType)
				) : (
					<div className="sp-eab-control-label">{replaceMediaLabel}</div>
				)}
			</button>
		);
	};

	const renderButton = (buttonType) => (
		<div className={`sp-eab-media-control__button sp-eab-media-control__button--${buttonType}`}>
			<span>{"close" === buttonType ? "×" : "+"}</span>
		</div>
	);

	return (
		<>
			<BaseControl
				className="sp-eab-media-control sp-eab-component-mb"
				id={`sp-eab-option-selector-${slug}`}
				label={label}
				hideLabelFromVision={disableLabel}
				__nextHasNoMarginBottom
			>
				<div
					className={`sp-eab-media-control__wrapper ${customClass}`}
					style={{
						...("image" === mediaType && {
							background: `url(${backgroundImage?.url})`,
						}),
						position: "relative",
					}}
				>
					{"video" === mediaType && backgroundImage?.url && (
						<VideoPlayer bgVideo={backgroundImage} videoType={"html5"} youtubeVideo={""} />
					)}
					<MediaUpload
						title={selectMediaLabel}
						onSelect={onSelect ? onSelect : onSelectImage}
						allowedTypes={mediaType}
						value={backgroundImage}
						render={({ open }) => renderMediaUploader(open)}
					/>
					{!disableRemove && backgroundImage?.url && (
						<button
							className="sp-eab-media-control__clickable sp-eab-media-control__clickable--close"
							onClick={removeImage ? removeImage : onRemoveImage}
						>
							{renderButton("close")}
						</button>
					)}
					{imgFocalPoint && backgroundImage?.url && (
						<Popover toggleIcon={<PopOverImgToggleIcon />}>
							<ButtonGroup
								items={[
									{ label: "Collapsed", value: "collapsed" },
									{ label: "Expanded", value: "expanded" },
								]}
								attributes={toggleState}
								onClick={(value) => updateToggleState(value)}
							/>
							<FocalPointPicker
								url={backgroundImage?.url}
								value={focalPoint}
								onChange={updateFocalPoint}
								onDragStart={updateFocalPoint}
								onDrag={updateFocalPoint}
								__nextHasNoMarginBottom
							/>
							<ButtonGroup
								label={__("Image Scale", "easy-accordion-free")}
								items={[
									{ label: "Cover", value: "cover" },
									{ label: "Contain", value: "contain" },
									{ label: "Fill", value: "fill" },
								]}
								attributes={toggleStateScale}
								onClick={(value) => updateScale(value)}
							/>
							<div style={style} />
						</Popover>
					)}
				</div>
			</BaseControl>

			{backgroundImage && enableImageSize && backgroundImage.url !== "null" && backgroundImage.url !== "" && (
				<>
					<SelectControl
						label={__("Image Size", "easy-accordion-free")}
						value={imageSizeValue}
						options={imagesSizeOptions(backgroundImage)}
						onChange={(newSize) => setAttributes({ [imageSizeKey]: newSize })}
						__nextHasNoMarginBottom
					/>
				</>
			)}
		</>
	);
};

export default MediaPicker;
