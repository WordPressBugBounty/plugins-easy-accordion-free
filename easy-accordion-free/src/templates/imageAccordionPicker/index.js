import { __ } from "@wordpress/i18n";
import { MediaUpload, MediaUploadCheck } from "@wordpress/block-editor";
import { Button, FormFileUpload } from "@wordpress/components";
import { mediaUpload } from "@wordpress/editor";
import { useRef } from "@wordpress/element";
import { ImgUploadIcon } from "../../blocks/image-accordion/icons";
import "./editor.scss";

const ImageAccordionPicker = ({ images = [], onChange }) => {
	const uploadedIds = useRef(new Set());

	const mergeUnique = (existing, incoming) => {
		const combined = [...existing, ...incoming];
		const map = new Map();
		combined.forEach((img) => map.set(img.id, img));
		return [...map.values()];
	};

	/* ----------------------------------------------
	   DIRECT UPLOAD (This fires FIRST)
	------------------------------------------------ */
	const handleDirectUpload = (fileList) => {
		mediaUpload({
			filesList: fileList,
			allowedTypes: ["image"],

			onFileChange: (mediaItems) => {
				if (!mediaItems?.length) {
					return;
				}

				// WordPress sometimes returns objects without ID on first cycle — skip them
				const valid = mediaItems.filter((img) => img?.id);

				if (!valid.length) {
					return;
				}

				// Track uploaded IDs
				valid.forEach((img) => uploadedIds.current.add(img.id));

				const formatted = valid.map((img) => ({
					id: img.id,
					url: img.url || img.source_url || "",
					alt: img.alt || "",
					title: img.title || "",
					caption: img.caption || "",
					description: "",
				}));

				onChange(mergeUnique(images, formatted));
			},
		});
	};

	/* --------------------------------------------------------------
		MEDIA LIBRARY SELECT (This fires AFTER direct upload)
	--------------------------------------------------------------- */
	const handleSelect = (selected) => {
		const list = Array.isArray(selected) ? selected : [selected];

		// Filter out files that were JUST uploaded
		const filtered = list.filter((img) => !uploadedIds.current.has(img.id));

		if (!filtered.length) {
			// This was triggered by direct upload — ignore it
			uploadedIds.current.clear();
			return;
		}

		const formatted = filtered.map((img) => ({
			id: img.id,
			url: img.url || img.sizes?.full?.url || "",
			alt: img.alt || "",
			title: img.title || "",
			caption: img.caption || "",
			description: "",
		}));

		onChange(mergeUnique(images, formatted));

		// Reset uploaded set — next operations are safe
		uploadedIds.current.clear();
	};

	return (
		<div className="sp-eab-image-accordion-picker">
			<div className="sp-eab-image-accordion-empty sp-d-flex sp-align-center sp-justify-center">
				<div className="sp-eab-card sp-d-flex sp-flex-col sp-justify-center sp-align-center">
					<h3>{__("Choose Images for Accordion", "easy-accordion-free")}</h3>
					<p>
						{__(
							"Upload or select images from your media library to use in the accordion.",
							"easy-accordion-free"
						)}
					</p>

					<div className="sp-eab-upload-buttons sp-d-flex sp-justify-center sp-align-center">
						{/* Direct upload */}
						<MediaUploadCheck>
							<FormFileUpload
								accept="image/*"
								multiple
								onChange={(event) => handleDirectUpload(event.target.files)}
								__next40pxDefaultSize
							>
								<div
									className="sp-eab-image-preset-btn sp-eab-upload sp-d-flex sp-align-center"
									role="button"
								>
									<span className="eab-image-upload-icon sp-d-flex sp-align-center sp-justify-center">
										<ImgUploadIcon />
									</span>
									<span className="eab-image-upload--text">Upload</span>
								</div>
							</FormFileUpload>
						</MediaUploadCheck>

						{/* Media Library */}
						<MediaUploadCheck>
							<MediaUpload
								onSelect={handleSelect}
								allowedTypes={["image"]}
								gallery
								multiple
								render={({ open }) => (
									<Button variant="secondary" className="sp-eab-library" onClick={open}>
										Media Library
									</Button>
								)}
							/>
						</MediaUploadCheck>
					</div>
				</div>
			</div>
		</div>
	);
};

export default ImageAccordionPicker;
