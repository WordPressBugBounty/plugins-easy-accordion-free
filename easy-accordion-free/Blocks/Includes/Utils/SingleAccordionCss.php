<?php
/**
 * SingleAccordionCss File.
 *
 * @since 4.0.0
 * @version 1.0.0
 *
 * @package EasyAccordion/Blocks
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes\Utils;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * SingleAccordionCss
 */
class SingleAccordionCss {
	/**
	 * Attributes.
	 *
	 * @var array
	 */
	public $attributes = array();

	/**
	 * Attributes.
	 *
	 * @var array
	 */
	public $unique_id = '';

	/**
	 * Method __construct
	 *
	 * @param array $attributes is block $attributes.
	 * @return void
	 */
	public function __construct( $attributes ) {
		$this->attributes = $attributes;
		$this->unique_id  = isset( $attributes['uniqueId'] ) ? '#' . $attributes['uniqueId'] : '';
	}

	/**
	 * Method eab_single_accordion_block_css.
	 *
	 * @return array
	 */
	public function eab_single_accordion_block_css() {
		$attributes                    = $this->attributes ?? array();
		$unique_id                     = $this->unique_id ?? '';
		$parent_id                     = $attributes['parentId'] ?? '';
		$accordion_title_colors        = $attributes['accordionTitleColors'] ?? '';
		$accordion_title_border_colors = $attributes['accordionTitleBorderColors'] ?? '';
		$accordion_content_colors      = $attributes['accordionContentColors'] ?? '';
		$accordion_title_background    = $attributes['accordionTitleBackground'] ?? '';
		$accordion_content_background  = $attributes['accordionContentBackground'] ?? '';
		$enable_toggle_icon            = $attributes['enableExpandAndCollapseIcon'] ?? false;
		$accordion_icon_background     = $attributes['accordionIconBackground'] ?? '';
		$accordion_icon_colors         = $attributes['accordionIconColors'] ?? '';
		$accordion_icon_border_colors  = $attributes['accordionIconBorderColors'] ?? '';

		$desktop_css = array(
			// wrapper css.
			array(
				'selector' => "$unique_id.sp-eab-accordion-item",
				'styles'   => array(
					'border-color' => $accordion_title_border_colors,
				),
			),
			// heading css.
			array(
				'selector' => "$unique_id .eab-heading-$parent_id",
				'styles'   => array(
					'background' => $accordion_title_background,
				),
			),
			// title css.
			array(
				'selector' => "$unique_id .eab-heading-$parent_id .sp-eab-accordion-title-text",
				'styles'   => array(
					'color' => $accordion_title_colors,
				),
			),
			// accordion content css.
			array(
				'selector' => "$unique_id .eab-content-$parent_id>.sp-eab-accordion-content-wrapper",
				'styles'   => array_merge(
					array(
						'color'      => $accordion_content_colors,
						'background' => $accordion_content_background,
					),
				),
			),
		);
		// toggle icon css.
		if ( $enable_toggle_icon ) {
			$toggle_icon_css = array(
				array(
					'selector' => "$unique_id .eab-heading-$parent_id .sp-eab-expand-collapse-icon",
					'styles'   => array(
						'color'        => $accordion_icon_colors,
						'background'   => $accordion_icon_background,
						'border-color' => $accordion_icon_border_colors,
					),
				),
			);
			$desktop_css     = array_merge( $desktop_css, $toggle_icon_css );
		}

		$css_array = array(
			'desktop_css' => $desktop_css,
			'tablet_css'  => array(),
			'mobile_css'  => array(),
		);

		return $css_array;
	}
}
