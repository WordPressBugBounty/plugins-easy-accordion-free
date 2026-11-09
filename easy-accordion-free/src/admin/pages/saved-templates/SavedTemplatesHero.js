/**
 * Saved Templates hero — shown while the library is empty: explain the
 * feature and offer the one action worth taking. Once templates exist the
 * toolbar takes over and the hero goes away, so the "create" call to action
 * is never duplicated.
 */

import { __ } from "@wordpress/i18n";
import { PlusIcon } from "./icons";

/**
 * @return {JSX.Element} Hero card.
 */
export default function SavedTemplatesHero() {
	const { newTemplateUrl = "", pluginUrl = "" } = sp_eab_admin_dashboard_localize || {};

	return (
		<div className="speap-saved-template-hero">
			<div className="speap-saved-template-hero__text">
				<div className="speap-saved-template-hero__title-wrap">
					<h2 className="speap-saved-template-hero__title">
						{__("Create Reusable Templates", "easy-accordion-free")}
					</h2>
					<p className="speap-saved-template-hero__desc">
						{__(
							"Build an accordion once and reuse it anywhere with a shortcode — pages, posts, widgets, or page builders like Elementor, Divi and WPBakery.",
							"easy-accordion-free"
						)}
					</p>
				</div>
				{newTemplateUrl ? (
					<a href={newTemplateUrl} rel="noreferrer" className="speap-saved-template-hero__cta">
						<PlusIcon />
						{__("Create a Saved Template", "easy-accordion-free")}
					</a>
				) : null}
			</div>
			<div className="speap-saved-template-hero__media">
				<img
					className="speap-saved-template-hero__art"
					src={`${pluginUrl}Blocks/assets/images/saved-template-banner-image.png`}
					alt={__("Saved template accordion preview", "easy-accordion-free")}
					width={337}
					height={241}
				/>
			</div>
		</div>
	);
}
