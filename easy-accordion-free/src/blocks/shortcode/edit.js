import { __ } from "@wordpress/i18n";
import { useBlockProps } from "@wordpress/block-editor";
import { ShortcodeBlockIcon } from "./icons";

const ShortcodeEdit = ({ clientId, attributes, setAttributes }) => {
	const shortCodeList = sp_easy_accordion_pro?.shortCodeList;

	return (
		<div {...useBlockProps({ className: "sp-eap-shortcode-renderer-block" })}>
			<div className="components-placeholder is-large">
				<div className="components-placeholder__label sp-d-flex sp-align-center sp-gap-8px">
					<ShortcodeBlockIcon />
					<span>{__("Easy Accordion Shortcode", "easy-accordion-free")}</span>
				</div>
				{/* If Shortcodes available, but none selected */}
				{shortCodeList?.length > 0 ? (
					<div className="speap-gutenberg-shortcode editor-styles-wrapper">
						<select
							className="speap-shortcode-selector"
							onChange={(e) => setAttributes({ shortcode: e.target.value })}
							value={attributes?.shortcode}
							name={`sp-eap-select-${clientId}`}
						>
							<option value="">{__("-- Select a shortcode --", "easy-accordion-free")}</option>
							{shortCodeList?.map((shortcode) => {
								const title =
									shortcode.title.length > 35
										? `${shortcode.title.substring(0, 30)}.... #(${shortcode.id})`
										: `${shortcode.title} #(${shortcode.id})`;
								return (
									<option value={shortcode.id.toString()} key={shortcode.id.toString()}>
										{title}
									</option>
								);
							})}
						</select>
					</div>
				) : (
					<div className="sp-eap-shortcode-no-found-message">
						{__(
							"No shortcode found. Please use an Easy Accordion block to continue.",
							"easy-accordion-free"
						)}
					</div>
				)}
			</div>
		</div>
	);
};

export default ShortcodeEdit;
