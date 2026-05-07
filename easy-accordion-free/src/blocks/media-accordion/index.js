import { __ } from "@wordpress/i18n";
import { registerBlockType } from "@wordpress/blocks";
import { MediaAccordionBlockIcon, MediaBlockPreviewImage } from "./icons";
import { ProBlockPlaceholder } from "@easy-accordion/templates";
import metadata from "./block.json";

if (sp_eab_localize_data?.activeBlockList?.includes(metadata.name)) {
	registerBlockType(metadata.name, {
		...metadata,
		icon: <MediaAccordionBlockIcon />,
		edit: (props) => (props.attributes.isPreview ? <MediaBlockPreviewImage /> : <ProBlockPlaceholder {...props} />),
		save: () => null,
	});
}
