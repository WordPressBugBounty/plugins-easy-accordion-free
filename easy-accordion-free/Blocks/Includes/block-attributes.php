<?php
/**
 * Block Attributes File.
 *
 * @since 4.0.0
 * @version 1.0.0
 *
 * @package EasyAccordion/Blocks
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

use ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\EAB_Utils;

require SP_EA_PATH . 'Blocks/Includes/attributes.php';

/**
 * Accordion item blocks attributes array.
 *
 * @var array
 */

$accordion_item_override_attr = array(
	'blockName'                   => EAB_Utils::string( 'accordion-item' ),
	'parentBlockName'             => EAB_Utils::string( 'vertical-accordion' ),
	'template'                    => EAB_Utils::string(),
	'defaultOpen'                 => EAB_Utils::boolean(),
	'schemaMarkup'                => EAB_Utils::boolean(),
	'accordionTitleTag'           => EAB_Utils::string( 'h3' ),
	'accordionTitle'              => EAB_Utils::string( null ),
	'titleAlignment'              => EAB_Utils::string( 'left' ),
	'enableExpandAndCollapseIcon' => EAB_Utils::boolean( true ),
	'toggleIconPosition'          => EAB_Utils::string( 'end' ),
	'toggleIconsSet'              => array(
		'type'    => 'object',
		'default' => array(
			'set'      => 4,
			'expand'   => 'eab-icon-angle-down-solid',
			'collapse' => 'eab-icon-angle-up-solid',
		),
	),
	'accordionIconColors'         => EAB_Utils::string(),
	'accordionIconBorderColors'   => EAB_Utils::string(),
	'accordionIconBackground'     => EAB_Utils::string(),
	'accordionTitleColors'        => EAB_Utils::string(),
	'accordionTitleBorderColors'  => EAB_Utils::string(),
	'accordionTitleBackground'    => EAB_Utils::string(),
	'accordionContentBackground'  => EAB_Utils::string(),
	// styles colors.
	'accordionContentColors'      => EAB_Utils::string(),
	'contentAnimationEffect'      => EAB_Utils::string( 'none' ),
);

/**
 * Accordion Item Attr.
 *
 * @var array
 */
$accordion_item_attributes = array_merge(
	$block_required_attributes,
	$accordion_item_override_attr,
);

/**
 * Vertical Accordion block attributes array.
 *
 * @var array
 */
$vertical_accordion_override_attr = array(
	'blockName'      => EAB_Utils::string( 'vertical-accordion' ),
	'titleAlignment' => EAB_Utils::string( 'left' ),
);


$vertical_accordion_attributes = array_merge(
	$block_required_attributes,
	$shared_attributes,
	$accordion_content_attr,
	$accordion_title_attributes,
	$accordion_toggle_icon_attributes,
	$vertical_accordion_override_attr,
);

$image_accordion_override_attr = array(
	'blockName'                   => EAB_Utils::string( 'image-accordion' ),
	'itemsExpandWidth'            => EAB_Utils::single_responsive( 50, 50, 50, '%' ),
	'itemsHeight'                 => EAB_Utils::single_responsive( 800, 600, 400, 'px' ),
	'templateOrientation'         => EAB_Utils::string( 'vertical' ),
	'imageEffects'                => EAB_Utils::string( 'none' ),
	'openSelectedItem'            => EAB_Utils::string( '1' ),
	// Image border.
	'imgBorder'                   => EAB_Utils::border( 'none', '#CCCCCC' ),
	'imgBorderWidth'              => EAB_Utils::spacing( 1, 1, 1, 1, 'px', true ),
	'imgBorderRadius'             => EAB_Utils::spacing( 6, 6, 6, 6 ),
	'imgOverlayColor'             => EAB_Utils::string( '#00000075' ),
	'showTitle'                   => EAB_Utils::boolean( true ),
	'accordionTitleColors'        => EAB_Utils::string( '#fff' ),
	'accordionTitleTag'           => EAB_Utils::string( 'h3' ),
	'showDescription'             => EAB_Utils::boolean( true ),
	'linkOpenInNewTab'            => EAB_Utils::boolean(),
	'contentAlignment'            => EAB_Utils::string( 'center' ),
	'titleColor'                  => EAB_Utils::string( '#fff' ),
	'accordionTitleTypography'    => EAB_Utils::typography( '500', 'normal', 'capitalize' ),
	'accordionTitleFontSize'      => EAB_Utils::single_responsive( 24 ),
	'accordionTitleLineHeight'    => EAB_Utils::single_responsive( 1.3 ),
	'accordionTitleLetterSpacing' => EAB_Utils::single_responsive( 0 ),
	'collapseTitleFontSize'       => EAB_Utils::single_responsive( 32 ),
	'descriptionTypography'       => EAB_Utils::typography( '400' ),
	'descriptionFontSize'         => EAB_Utils::single_responsive( 16 ),
	'descriptionLineHeight'       => EAB_Utils::single_responsive( 1.2 ),
	'descriptionLetterSpacing'    => EAB_Utils::single_responsive( 0 ),
	'descriptionColor'            => EAB_Utils::string( '#fff' ),
	'contentPadding'              => EAB_Utils::responsive_spacing( 30, 30, 30, 30 ),
	'accordionGallery'            => array(
		'type'    => 'array',
		'default' => array(),
	),
	'contentAnimationEffect'      => EAB_Utils::string( 'fadeIn' ),
	'contentTransitionTime'       => EAB_Utils::range_control( 1000, 'ms' ),
	'showPreloader'               => EAB_Utils::boolean( true ),
);

$image_accordion_attributes = array_merge(
	$block_required_attributes,
	$shared_attributes,
	$accordion_toggle_icon_attributes,
	$image_accordion_override_attr
);

$image_accordion_item = array(
	'blockName'       => EAB_Utils::string( 'image-accordion-item' ),
	'uniqueId'        => EAB_Utils::string(),
	// Image data.
	'singleImgData'   => array(
		'type'    => 'object',
		'default' => array(),
	),
	'singleImgId'     => array(
		'type' => 'number',
	),
	'singleImgUrl'    => EAB_Utils::string( null ),
	'singleImgAttr'   => EAB_Utils::string( null ),
	'singleImgTitle'  => EAB_Utils::string( null ),
	'singleImgDesc'   => EAB_Utils::string( null ),
	// Parent / shared settings.
	'parentSettings'  => array(
		'type'    => 'object',
		'default' => array(),
	),
	'customClassName' => EAB_Utils::string(),
);

$horizontal_accordion_override_attr = array(
	'blockName'            => EAB_Utils::string( 'horizontal-accordion' ),
	'verticalViewInMobile' => EAB_Utils::boolean( true ),
	'itemsHeight'          => EAB_Utils::single_responsive( 400, 400, 400, 'px' ),
	'titleMinWidth'        => EAB_Utils::single_responsive( 66, 66, 66, 'px' ),
	'itemsExpandWidth'     => EAB_Utils::single_responsive( 598, 400, 200, 'px' ),
	'titleAlignment'       => EAB_Utils::string( 'start' ),
);


$horizontal_accordion_attributes = array_merge(
	$block_required_attributes,
	$shared_attributes,
	$accordion_content_attr,
	$accordion_title_attributes,
	$accordion_toggle_icon_attributes,
	$horizontal_accordion_override_attr,
);

$accordion_slider_attributes = array(
	'blockName' => EAB_Utils::string( 'accordion-slider' ),
	'isPreview' => EAB_Utils::boolean(),
	'uniqueId'  => EAB_Utils::string(),
	'align'     => EAB_Utils::string( 'full' ),
);

$post_query_attributes = array(
	'postType'             => EAB_Utils::string( 'post' ),
	'filterPost'           => EAB_Utils::string( 'latest' ),
	'orderBy'              => EAB_Utils::string( 'date' ),
	'orderDirection'       => EAB_Utils::string( 'DESC' ),
	'postLimit'            => EAB_Utils::string( '8' ),
	'taxonomyFilterEnable' => EAB_Utils::boolean( false ),
);

$post_title_attrs = array(
	'postTitleLenght'       => EAB_Utils::string( 'full' ),
	'postTitleLenghtNumber' => EAB_Utils::range_control( 8, 'words' ),
	'linkOpenNewTab'        => EAB_Utils::boolean( true ),
);

$post_meta_attributes = array(
	'metaDataOptions'       => array(
		'type'    => 'array',
		'default' => array(
			array(
				'id'       => 1,
				'value'    => 'author',
				'isActive' => true,
			),
			array(
				'id'       => 2,
				'value'    => 'category',
				'isActive' => true,
			),
			array(
				'id'       => 3,
				'value'    => 'date',
				'isActive' => true,
			),
		),
	),
	'postMetaTypography'    => EAB_Utils::typography(),
	'postMetaFontSize'      => EAB_Utils::single_responsive( 14 ),
	'postMetaLineHeight'    => EAB_Utils::single_responsive( 1.2 ),
	'postMetaLetterSpacing' => EAB_Utils::single_responsive( 0 ),
	'postMetaColor'         => EAB_Utils::string( '#6D6D6D' ),
	'postMetaGap'           => EAB_Utils::single_responsive( 15 ),
	'postMetaMargin'        => EAB_Utils::responsive_spacing( 0, 0, 12, 0 ),

);

$post_content_attributes = array(
	'showFeaturedImage'           => EAB_Utils::boolean( true ),
	'featuredImageSize'           => EAB_Utils::string( 'medium' ),
	'featuredImageWidth'          => EAB_Utils::single_responsive( 380 ),
	'featuredImageHeight'         => EAB_Utils::single_responsive( 100, 100, 100, '%' ),
	'showExcerpt'                 => EAB_Utils::boolean( true ),
	'excerptLength'               => EAB_Utils::string( 'full' ),
	'excerptLimit'                => EAB_Utils::range_control( 50, 'words' ),
	'showReadMore'                => EAB_Utils::boolean( true ),
	'showReadMoreLinkInNewTab'    => EAB_Utils::boolean( true ),
	'contentHeight'               => EAB_Utils::string( 'auto' ),
	'contentMaxHeight'            => EAB_Utils::single_responsive( 320 ),
	'animationEffect'             => EAB_Utils::string( 'fadeIn' ),
	'animationTransitionDuration' => EAB_Utils::range_control( 1000, 'ms' ),
	'excerptTypography'           => EAB_Utils::typography(),
	'excerptFontSize'             => EAB_Utils::single_responsive( 16 ),
	'excerptLineHeight'           => EAB_Utils::single_responsive( 1.2 ),
	'excerptLetterSpacing'        => EAB_Utils::single_responsive( 0 ),
	'excerptColor'                => EAB_Utils::string( '#2F2F2F' ),
	'ContentBackground'           => EAB_Utils::string(),
	'contentPadding'              => EAB_Utils::responsive_spacing( 20, 24, 20, 24 ),
);

$post_accordion_data_attr = array(
	'blockName'        => EAB_Utils::string( 'post-accordion' ),
	'postQuery'        => EAB_Utils::string(),
	'spBlockId'        => EAB_Utils::string(),
	'titleMinWidth'    => EAB_Utils::single_responsive( 66, 66, 66, 'px' ),
	'itemsExpandWidth' => EAB_Utils::single_responsive( 598, 400, 200, 'px' ),
);

$post_accordion_attributes = array_merge(
	$block_required_attributes,
	$shared_attributes,
	$accordion_toggle_icon_attributes,
	$accordion_title_attributes,
	$post_title_attrs,
	$post_query_attributes,
	$post_meta_attributes,
	$post_content_attributes,
	$post_accordion_data_attr
);

$sidebar_accordion_override_attr = array(
	'blockName'               => EAB_Utils::string( 'sidebar-tab-accordion' ),
	'titleAreaWidth'          => EAB_Utils::single_responsive( 40, 40, 100, '%' ),
	'titleToContentGap'       => EAB_Utils::single_responsive( 0, 0, 10, 'px' ),
	'itemContentBorder'       => EAB_Utils::border( 'solid' ),
	'itemContentBorderWidth'  => EAB_Utils::spacing( 1, 1, 1, 1, 'px', true ),
	'itemContentBorderRadius' => EAB_Utils::spacing( 4, 4, 4, 4 ),
	'accordionTitleBorder'    => EAB_Utils::border( 'solid' ),
);

$sidebar_tab_accordion_attributes = array_merge(
	$block_required_attributes,
	$shared_attributes,
	$accordion_toggle_icon_attributes,
	$accordion_title_attributes,
	$accordion_content_attr,
	$sidebar_accordion_override_attr,
);

$product_accordion_attr       = array(
	'blockName'                     => EAB_Utils::string( 'product-accordion' ),
	'postType'                      => EAB_Utils::string( 'product' ),
	'showBadge'                     => EAB_Utils::boolean( true ),
	'showRating'                    => EAB_Utils::boolean( true ),
	'showPrice'                     => EAB_Utils::boolean( true ),
	'showProductAttrs'              => EAB_Utils::boolean( true ),
	'showAddToCart'                 => EAB_Utils::boolean( true ),
	'addToCartLabel'                => EAB_Utils::string( 'Add to Cart' ),
	'imgToDescGap'                  => EAB_Utils::single_responsive( 24 ),
	'priceTypography'               => EAB_Utils::typography( '500' ),
	'priceFontSize'                 => EAB_Utils::single_responsive( 24 ),
	'priceLineHeight'               => EAB_Utils::single_responsive( 1.3 ),
	'priceLetterSpacing'            => EAB_Utils::single_responsive( 0 ),
	'priceColor'                    => EAB_Utils::string( '#121212' ),
	'addToCartTypography'           => EAB_Utils::typography( '500' ),
	'addToCartFontSize'             => EAB_Utils::single_responsive( 16 ),
	'addToCartLineHeight'           => EAB_Utils::single_responsive( 1.2 ),
	'addToCartLetterSpacing'        => EAB_Utils::single_responsive( 0 ),
	'cartButtonColors'              => EAB_Utils::color_obj( '#2F2F2F', '#FFFFFF' ),
	'cartButtonBgColors'            => EAB_Utils::color_obj( '#FFFFFF', '#2F2F2F' ),
	'cartButtonBorderWidth'         => EAB_Utils::spacing( 1, 1, 1, 1 ),
	'cartButtonBorderRadius'        => EAB_Utils::spacing( 4, 4, 4, 4 ),
	'cartButtonBorder'              => EAB_Utils::border( 'solid', '#CCCCCC', '#CCCCCC' ),
	'cartButtonPadding'             => EAB_Utils::responsive_spacing( 12, 16, 12, 16 ),
	'metaDataOptions'               => array(
		'type'    => 'array',
		'default' => array(
			array(
				'id'       => 1,
				'value'    => 'category',
				'isActive' => true,
			),
			array(
				'id'       => 3,
				'value'    => 'sku',
				'isActive' => true,
			),
		),
	),
	'metaDivider'                   => EAB_Utils::boolean( true ),
	'showProductTitle'              => EAB_Utils::boolean( true ),
	'metaDividerColor'              => EAB_Utils::string( '#dddddd' ),
	'metaDividerGap'                => EAB_Utils::single_responsive( 24 ),
	'postMetaGap'                   => EAB_Utils::single_responsive( 8 ),
	'imageEffects'                  => EAB_Utils::string( 'none' ),
	'imgHoverGrayScale'             => EAB_Utils::boolean( true ),
	'imageHoverTransitionTime'      => EAB_Utils::range_control( 300, 'ms' ),
	'imageScale'                    => EAB_Utils::string( 'cover' ),
	'imagePosition'                 => EAB_Utils::string( 'center' ),
	'productImageBorderWidth'       => EAB_Utils::spacing( 1, 1, 1, 1, 'px', true ),
	'productImageBorderRadius'      => EAB_Utils::spacing( 2, 2, 2, 2 ),
	'productImageBorder'            => EAB_Utils::border( 'none' ),
	'imgOverlayType'                => EAB_Utils::string( 'bgColor' ),
	'imgOverlayUseType'             => EAB_Utils::string( 'imgOverlayForCollapse' ),
	'imgOverlayColor'               => EAB_Utils::string( '#00000075' ),
	'imgOverlayGradientColor'       => EAB_Utils::string(
		'linear-gradient(135deg, #A1C4FD4D 0%, #C2E9FB4D 50%, #E0EAFC 100%)'
	),
	'imgOverlayActiveColor'         => EAB_Utils::string( '#00000075' ),
	'imgOverlayActiveGradientColor' => EAB_Utils::string(
		'linear-gradient(135deg, #A1C4FD4D 0%, #C2E9FB4D 50%, #E0EAFC 100%)'
	),
	'contentVerticalPosition'       => EAB_Utils::string( 'center' ),
	'contentHorizontalPosition'     => EAB_Utils::string( 'center' ),
	'contentAlignment'              => EAB_Utils::string( 'center' ),
	'accordionTitleColors'          => EAB_Utils::string( '#2F2F2F' ),
	'featuredImageWidth'            => EAB_Utils::single_responsive( 400 ),
);
$product_accordion_attributes = array_merge(
	$post_accordion_attributes,
	$product_accordion_attr,
);
