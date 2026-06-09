import { updateCategory } from "@wordpress/blocks";
import { CategoryIcon, ProBlocksCategoryIcon } from "../icons";
import { ToolbarLibrary } from "../prebuild-library/toolbarButton";
import "./editor.scss";
import "./style.scss";
import "../controls/redirect";
import "../admin/saved-template-sidebar/index";
import "./accordion-item";
import "./vertical-accordion";
import "./horizontal-accordion";
import "./sidebar-tab-item";
import "./sidebar-tab-accordion";
import "./media-accordion";
import "./image-accordion-item";
import "./image-accordion";
import "./accordion-slider";
import "./post-accordion";
import "./product-accordion";
import "./user-faq-form";
import "./shortcode";

// update block category icon.
updateCategory("sp-easy-accordion-pro", {
	icon: <CategoryIcon />,
});

updateCategory("sp-easy-accordion-pro-blocks", {
	icon: <ProBlocksCategoryIcon />,
});
// toolbar button for accordion patterns library.
ToolbarLibrary();
