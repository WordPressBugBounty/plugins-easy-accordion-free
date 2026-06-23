import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";

const VIDEO_ID = "xs3AlJKQHL4";

export const SavedTemplatesPromo = () => {
	const [isPlaying, setIsPlaying] = useState(false);

	const addNewUrl = `${sp_eab_admin_dashboard_localize?.homeUrl}wp-admin/post-new.php?post_type=sp_eap_template&eabblock_inserter`;

	return (
		<div className="speap-saved-template-promo">
			<div className="speap-saved-template-promo__text">
				<div className="speap-saved-template-promo__title-wrap">
					<h2 className="speap-saved-template-promo__title">
						{__("Design visually.", "easy-accordion-free")}{" "}
						<span>{__("Place it ", "easy-accordion-free")}</span>
						<span className="speap-saved-template-promo__title-accent">
							{__("anywhere.", "easy-accordion-free")}
						</span>
					</h2>
					<p className="speap-saved-template-promo__desc">
						Saved Templates let you build accordion layouts with Gutenberg blocks and use them as{" "}
						<b>shortcodes</b> — perfect for page builders like <b>Elementor, Divi, WPBakery</b>, and more.
					</p>
					<p className="speap-saved-template-promo__desc">
						Easy Accordion blocks work directly on any page or post in Gutenberg. To reuse blocks use
						WordPress's built-in{" "}
						<a
							href="https://easyaccordion.io/docs/how-to-create-gutenberg-reusable-blocks-with-patterns-in-wordpress/"
							target="_blank"
						>
							<b>Reusable Blocks (Patterns)</b>
						</a>{" "}
						feature.
					</p>
				</div>
				<a href={addNewUrl} rel="noreferrer" className="speap-saved-template-promo__cta">
					<i className="dashicons dashicons-plus-alt2"></i>
					{__("Add New Template", "easy-accordion-free")}
				</a>
			</div>
			<div className="speap-saved-template-promo__video">
				{isPlaying ? (
					<iframe
						className="speap-saved-template-promo__video-frame"
						src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1`}
						title={__("Easy Accordion overview video", "easy-accordion-free")}
						allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
						allowFullScreen
					></iframe>
				) : (
					<button
						type="button"
						className="speap-saved-template-promo__video-thumb"
						style={{
							backgroundImage: `url(https://img.youtube.com/vi/${VIDEO_ID}/maxresdefault.jpg)`,
						}}
						onClick={() => setIsPlaying(true)}
						aria-label={__("Play overview video", "easy-accordion-free")}
					>
						<span className="speap-saved-template-promo__video-overlay" />
						<span className="speap-saved-template-promo__video-play">
							<svg
								width="22"
								height="22"
								viewBox="0 0 22 22"
								fill="none"
								xmlns="http://www.w3.org/2000/svg"
								aria-hidden="true"
							>
								<path d="M19 11L4 19.6603L4 2.33975L19 11Z" fill="#F26C0D" />
							</svg>
						</span>
					</button>
				)}
			</div>
		</div>
	);
};
