import { registerBlockType } from "@wordpress/blocks";
import { FaqFormBlockIcon, FaqFormBlockPreview } from "./icons";
import { ProBlockPlaceholder } from "@easy-accordion/templates";
import metadata from "./block.json";

if (sp_eab_localize_data?.activeBlockList?.includes(metadata.name)) {
	registerBlockType(metadata.name, {
		...metadata,
		icon: <FaqFormBlockIcon />,
		edit: (props) => (props.attributes.isPreview ? <FaqFormBlockPreview /> : <ProBlockPlaceholder {...props} />),
		save: () => null,
	});
}
