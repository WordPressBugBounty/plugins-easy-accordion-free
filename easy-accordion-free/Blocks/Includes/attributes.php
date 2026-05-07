<?php
/**
 * Block Attributes Parts File.
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

$block_required_attributes = array(
	'uniqueId'           => EAB_Utils::string(),
	'parentId'           => EAB_Utils::string(),
	'template'           => EAB_Utils::string(),
	'align'              => EAB_Utils::string( 'wide' ),
	'isPreview'          => EAB_Utils::boolean(),
	'fontLists'          => EAB_Utils::string(),
	// visibility attr.
	'spEabHideOnDesktop' => EAB_Utils::boolean(),
	'spEabHideOnTablet'  => EAB_Utils::boolean(),
	'spEabHideOnMobile'  => EAB_Utils::boolean(),
	'customClassName'    => EAB_Utils::string(),
	'customIdName'       => EAB_Utils::string(),
	'preloader'          => EAB_Utils::boolean(),
	'generatedFaqItems'  => EAB_Utils::string( '0' ),
);

/**
 * Accordion Title attributes array.
 *
 * @var array
 */
$accordion_title_attributes = array(
	'accordionTitleTag'             => EAB_Utils::string( 'h3' ),
	'titleAlignment'                => EAB_Utils::string( 'left' ),
	'accordionTitleTypography'      => EAB_Utils::typography( '500' ),
	'accordionTitleFontSize'        => EAB_Utils::single_responsive( 18 ),
	'accordionTitleLineHeight'      => EAB_Utils::single_responsive( 1.2 ),
	'accordionTitleLetterSpacing'   => EAB_Utils::single_responsive( 0 ),
	'accordionTitleColors'          => EAB_Utils::string(),
	'accordionTitleBackground'      => EAB_Utils::string(),
	// accordion title border.
	'accordionTitleBorder'          => EAB_Utils::border( 'solid' ),
	'accordionTitleBorderWidth'     => EAB_Utils::spacing( 1, 1, 1, 1, 'px', true ),
	'accordionTitleBorderRadius'    => EAB_Utils::spacing( 4, 4, 4, 4 ),
	'accordionTitlePadding'         => EAB_Utils::responsive_spacing( 20, 24, 20, 24 ),
	// accordion title box shadow.
	'accordionTitleNormalBoxShadow' => EAB_Utils::box_shadow( false, 0, 0, 9, 0, '#E0E0E0' ),
);
/**
 * Accordion Title attributes array.
 *
 * @var array
 */
$accordion_toggle_icon_attributes = array(
	// toggle icon attr.
	'enableExpandAndCollapseIcon' => EAB_Utils::boolean( true ),
	'toggleIconsSet'              => array(
		'type'    => 'object',
		'default' => array(
			'set'      => 4,
			'expand'   => 'eab-icon-angle-down-solid',
			'collapse' => 'eab-icon-angle-up-solid',
		),
	),
	'rotate90deg'                 => EAB_Utils::boolean(),
	'toggleIconSize'              => EAB_Utils::single_responsive( 24 ),
	'toggleIconPosition'          => EAB_Utils::string( 'end' ),
	'toggleIconColors'            => EAB_Utils::string(),
	'toggleIconBackground'        => EAB_Utils::string(),
	'toggleIconBorder'            => EAB_Utils::border(),
	'toggleIconBorderWidth'       => EAB_Utils::spacing( 1, 1, 1, 1, 'px', true ),
	'toggleIconBorderRadius'      => EAB_Utils::spacing( 0, 0, 0, 0 ),
	'toggleIconPadding'           => EAB_Utils::responsive_spacing( 0, 0, 0, 0 ),
	'toggleIconMargin'            => EAB_Utils::responsive_spacing( 0, 0, 0, 0 ),
);

/**
 * Shared attributes array.
 *
 * @var array
 */
$shared_attributes = array(
	// template tabs attr.
	'itemsVerticalGap'             => EAB_Utils::single_responsive( 10, 10, 10, 'px' ),
	'itemsHeight'                  => EAB_Utils::single_responsive( 480, 480, 480, 'px' ),
	'itemsWidth'                   => EAB_Utils::single_responsive( 900, 668, 400, 'px' ),
	'itemsExpandWidth'             => EAB_Utils::single_responsive( 30, 30, 30, '%' ),
	'activeEvent'                  => EAB_Utils::string( 'click' ),
	'accordionAutoplayDelayTime'   => EAB_Utils::range_control( 3000, 'ms' ),
	'defaultAccordionOpen'         => EAB_Utils::string( 'first-item' ),
	'openSelectedItem'             => EAB_Utils::string( '1' ),
	'openMultiItemAtaTime'         => EAB_Utils::boolean(),
	'accordionItemToUrl'           => EAB_Utils::boolean(),
	'activeEventAutoPlayDelayTime' => EAB_Utils::range_control( 1500, 'ms' ),
	'scrollToActiveItem'           => EAB_Utils::boolean(),
	'schemaMarkup'                 => EAB_Utils::boolean(),
	// block attr.
	'eabBackground'                => array(
		'type'    => 'object',
		'default' => array(
			'style'         => 'solid',
			'solid'         => '',
			'gradient'      => 'var(--eab-gradient-color)',
			'image'         => array(),
			'videoType'     => 'html5',
			'video'         => array(
				'html5' => array(),
			),
			'bgOverlay'     => '#00000075',
			'imageSettings' => array(
				'bgImagePosition'   => 'center',
				'bgImageAttachment' => 'scroll',
				'bgImageRepeat'     => 'no-repeat',
				'bgImageSize'       => 'cover',
			),
		),
	),
	'eabBorder'                    => EAB_Utils::border( 'none', '#CCCCCC' ),
	'eabBorderWidth'               => EAB_Utils::spacing( 1, 1, 1, 1, 'px', true ),
	'eabBorderRadius'              => EAB_Utils::spacing( 0, 0, 0, 0 ),
	'eabBoxShadow'                 => EAB_Utils::box_shadow( false, 0, 0, 9, 0, '#E0E0E0' ),
	'eabPadding'                   => EAB_Utils::responsive_spacing( 0, 0, 0, 0 ),
	'eabMargin'                    => EAB_Utils::responsive_spacing( 0, 0, 20, 0 ),
	'eabAccessibility'             => EAB_Utils::boolean( true ),
	'showPreloader'                => EAB_Utils::boolean(),
);

// accordion content attr.
$accordion_content_attr = array(
	'contentHeight'                 => EAB_Utils::string( 'auto' ),
	'contentMaxHeight'              => EAB_Utils::range_control( 320 ),
	'contentAnimationEffect'        => EAB_Utils::string( 'none' ),
	'contentTransitionTime'         => EAB_Utils::range_control( 1000, 'ms' ),
	'contentShowCloseButton'        => EAB_Utils::boolean(),
	'accordionContentTypography'    => EAB_Utils::typography( '400' ),
	'accordionContentFontSize'      => EAB_Utils::single_responsive( 16 ),
	'accordionContentLineHeight'    => EAB_Utils::single_responsive( 1.3 ),
	'accordionContentLetterSpacing' => EAB_Utils::single_responsive( 0 ),
	'accordionContentColor'         => EAB_Utils::string( 'var(--eab-primary-text-color)' ),
	'accordionContentBackground'    => EAB_Utils::string(),
	'accordionContentPadding'       => EAB_Utils::responsive_spacing( 18, 24, 18, 24 ),
);
