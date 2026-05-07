import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { ProductAccordionBlockIcon, ProductBlockPreviewImage } from "./icons";
import ProductAccordionEdit from "./edit";
import metadata from "./block.json";

if (sp_eab_localize_data?.activeBlockList?.includes(metadata.name)) {
	registerBlockType(metadata.name, {
		...metadata,
		icon: <ProductAccordionBlockIcon />,
		title: __("Product Accordion 01", "easy-accordion-free"),
		description: __(
			"Display WooCommerce products in organized, collapsible accordion panels.",
			"easy-accordion-free"
		),
		edit: (props) =>
			props.attributes.isPreview ? <ProductBlockPreviewImage /> : <ProductAccordionEdit {...props} />,
		save: () => null,
	});
}
