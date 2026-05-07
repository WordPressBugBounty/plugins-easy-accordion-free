<?php
/**
 * Vertical Accordion Dynamic Css Renderer File.
 *
 * @since 4.0.0
 * @version 1.0.1
 *
 * @package EasyAccordion/Blocks
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes\Utils;

use ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\Css_Helpers;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}
/**
 * AccordionSharedCss
 */
class AccordionSharedCss {
	/**
	 * Attributes.
	 *
	 * @var array
	 */
	public $attributes = array();

	/**
	 * Unique ID.
	 *
	 * @var string
	 */
	public $unique_id = '';

	/**
	 * Constructor.
	 *
	 * @param array $attributes Block attributes.
	 */
	public function __construct( $attributes ) {
		$this->attributes = $attributes;
		$this->unique_id  = isset( $attributes['uniqueId'] ) ? '.' . $attributes['uniqueId'] : '';
	}

	/**
	 * Method responsive_css.
	 *
	 * @param string $device_type is device type.
	 *
	 * @return array
	 */
	public function shared_responsive_css( $device_type = 'Desktop' ) {
		$attributes                  = $this->attributes;
		$unique_id                   = $this->unique_id;
		$parent_id                   = $attributes['parentId'] ?? '';
		$block_name                  = $attributes['blockName'] ?? '';
		$template                    = $attributes['template'] ?? 'vertical-one';
		$items_width                 = $attributes['itemsWidth'] ?? array();
		$items_expand_width          = $attributes['itemsExpandWidth'] ?? array();
		$items_vertical_gap          = $attributes['itemsVerticalGap'] ?? array();
		$items_height                = $attributes['itemsHeight'] ?? array();
		$accordion_title_padding     = $attributes['accordionTitlePadding'] ?? array();
		$enable_expand_collapse_icon = $attributes['enableExpandAndCollapseIcon'] ?? false;
		$toggle_icon_size            = $attributes['toggleIconSize'] ?? array();
		$toggle_icon_padding         = $attributes['toggleIconPadding'] ?? array();
		$toggle_icon_margin          = $attributes['toggleIconMargin'] ?? array();
		$accordion_content_padding   = $attributes['accordionContentPadding'] ?? array();
		$accordion_title_width       = $attributes['titleMinWidth'] ?? array();

		// max width selector.
		$max_width_selector = ".sp-easy-accordion-block $unique_id";

		$responsive_css = array(
			// template css.
			array(
				'selector' => $max_width_selector,
				'styles'   => array(
					'max-width' => Css_Helpers::css_data_check(
						$items_width['device'][ $device_type ],
						Css_Helpers::get_unit( $items_width, $device_type )
					),
				),
			),
			array(
				'selector' => "$unique_id>.sp-eab-accordion",
				'styles'   => array(
					'gap'    => Css_Helpers::css_data_check(
						$items_vertical_gap['device'][ $device_type ],
						Css_Helpers::get_unit( $items_vertical_gap, $device_type )
					),
					'height' => 'horizontal-accordion' === $block_name ? Css_Helpers::css_data_check(
						$items_height['device'][ $device_type ],
						Css_Helpers::get_unit( $items_height, $device_type )
					) : '',
				),
			),
			// accordion title css.
			array(
				'selector' => ".eab-heading-$parent_id" . ( 'vertical-six' === $template ? ' .sp-eab-accordion-header-start' : ' .sp-eab-accordion-header-wrapper' ),
				'styles'   => array(
					'padding' => Css_Helpers::css_data_check(
						$accordion_title_padding['device'][ $device_type ],
						Css_Helpers::get_unit( $accordion_title_padding, $device_type )
					),
				),
			),
			array(
				'selector' => ".eab-heading-$parent_id .sp-eab-accordion-title-text",
				'styles'   => array_merge(
					Css_Helpers::generate_typo_responsive( $attributes, $device_type, 'accordionTitle' ),
				),
			),
			// content css.
			array(
				'selector' => ".eab-content-$parent_id>." . ( 'vertical-three' === $template ? 'sp-eab-accordion-content-wrapper>.sp-eab-accordion-body' : 'sp-eab-accordion-content-wrapper' ),
				'styles'   => array_merge(
					Css_Helpers::generate_typo_responsive( $attributes, $device_type, 'accordionContent' ),
					array(
						'padding' => Css_Helpers::css_data_check( $accordion_content_padding['device'][ $device_type ], Css_Helpers::get_unit( $accordion_content_padding, $device_type ) ),
					)
				),
			),
		);

		// horizontal accordion css.
		if ( 'horizontal-accordion' === $block_name ) {
			$expand_width        = $items_expand_width['device'][ $device_type ] ?? 580;
			$expand_width_unit   = $items_expand_width['unit'][ $device_type ] ?? 'px';
			$expanded_item_width = $expand_width . $expand_width_unit;

			if ( '%' === $expand_width_unit ) {
				$full_width          = $items_width['device'][ $device_type ];
				$percent_value       = $full_width * ( $expand_width / 100 );
				$expanded_item_width = $percent_value . 'px';
			}

			$horizontal_accordion_css = array(
				array(
					'selector' => ".eab-heading-$parent_id",
					'styles'   => array(
						'width' => Css_Helpers::css_data_check( $accordion_title_width['device'][ $device_type ], Css_Helpers::get_unit( $accordion_title_width, $device_type ) ),
					),
				),
				array(
					'selector' => ".eab-content-$parent_id>.sp-eab-accordion-content-wrapper",
					'styles'   => array(
						'width' => $expanded_item_width,
					),
				),
			);
			// merge css.
			$responsive_css = array_merge( $responsive_css, $horizontal_accordion_css );
		}
		// sidebar tab accordion css.
		if ( 'sidebar-tab-accordion' === $block_name ) {
			$title_to_content_gap = $attributes['titleToContentGap'] ?? array();
			$tab_title_area_width = '40%';

			$sidebar_tab_responsive_css = array(
				array(
					'selector' => "$unique_id>.sp-eab-sidebar-tabs>.sp-eab-sidebar-tabs-nav-wrapper",
					'styles'   => array(
						'width' => $tab_title_area_width,
					),
				),
				array(
					'selector' => "$unique_id>.sp-eab-sidebar-tabs>.sp-eab-sidebar-tabs-content",
					'styles'   => array(
						'width' => "calc(100% - $tab_title_area_width)",
					),
				),
				array(
					'selector' => "$unique_id>.sp-eab-sidebar-tabs",
					'styles'   => array(
						'gap' => Css_Helpers::css_data_check( $title_to_content_gap['device'][ $device_type ], Css_Helpers::get_unit( $title_to_content_gap, $device_type ) ),
					),
				),
				array(
					'selector' => "$unique_id .sp-eab-sidebar-tabs-nav",
					'styles'   => array(
						'gap' => Css_Helpers::css_data_check( $items_vertical_gap['device'][ $device_type ], Css_Helpers::get_unit( $items_vertical_gap, $device_type ) ),
					),
				),
			);
			$responsive_css             = array_merge( $responsive_css, $sidebar_tab_responsive_css );
		}

		if ( $enable_expand_collapse_icon ) {
			$toggle_icon_css = array(
				array(
					'selector' => ".eab-heading-$parent_id .sp-eab-expand-collapse-icon",
					'styles'   => array(
						'font-size' => Css_Helpers::css_data_check( $toggle_icon_size['device'][ $device_type ], Css_Helpers::get_unit( $toggle_icon_size, $device_type ) ),
						'padding'   => Css_Helpers::css_data_check( $toggle_icon_padding['device'][ $device_type ], Css_Helpers::get_unit( $toggle_icon_padding, $device_type ) ),
						'margin'    => Css_Helpers::css_data_check( $toggle_icon_margin['device'][ $device_type ], Css_Helpers::get_unit( $toggle_icon_margin, $device_type ) ),
					),
				),
			);
			$responsive_css  = array_merge( $responsive_css, $toggle_icon_css );
		}

		return $responsive_css;
	}

	/**
	 * Method accordion_block_shared_css
	 *
	 * @return array
	 */
	public function accordion_block_shared_css() {
		$attributes                        = $this->attributes;
		$unique_id                         = $this->unique_id;
		$parent_id                         = $attributes['parentId'] ?? '';
		$block_name                        = $attributes['blockName'] ?? 'vertical-accordion';
		$template                          = $attributes['template'] ?? 'vertical-one';
		$enable_expand_collapse_icon       = $attributes['enableExpandAndCollapseIcon'] ?? false;
		$toggle_icon_colors                = $attributes['toggleIconColors'] ?? '';
		$toggle_icon_background            = $attributes['toggleIconBackground'] ?? '';
		$toggle_icon_border_radius         = $attributes['toggleIconBorderRadius'] ?? array();
		$content_height                    = $attributes['contentHeight'] ?? 'auto';
		$content_max_height                = $attributes['contentMaxHeight'] ?? array();
		$accordion_content_typography      = $attributes['accordionContentTypography'] ?? array();
		$accordion_content_color           = $attributes['accordionContentColor'] ?? '';
		$accordion_content_background      = $attributes['accordionContentBackground'] ?? '';
		$rotate_90deg                      = $attributes['rotate90deg'] ?? false;
		$toggle_icons_set                  = $attributes['toggleIconsSet'] ?? array();
		$toggle_icon_border                = $attributes['toggleIconBorder'] ?? array();
		$toggle_icon_border_width          = $attributes['toggleIconBorderWidth'] ?? array();
		$content_animation_effect          = $attributes['contentAnimationEffect'] ?? 'none';
		$content_transition_time           = $attributes['contentTransitionTime'] ?? array();
		$show_content_close_button         = $attributes['contentShowCloseButton'] ?? false;
		$content_close_button_color        = $attributes['accordionContentCloseButtonColor'] ?? '';
		$content_close_button_bgcolor      = $attributes['accordionContentCloseButtonBgColor'] ?? '';
		$accordion_title_colors            = $attributes['accordionTitleColors'] ?? '';
		$accordion_title_background        = $attributes['accordionTitleBackground'] ?? '';
		$accordion_title_typography        = $attributes['accordionTitleTypography'] ?? array();
		$accordion_title_normal_box_shadow = $attributes['accordionTitleNormalBoxShadow'] ?? array();
		$accordion_title_border            = $attributes['accordionTitleBorder'] ?? '';
		$accordion_title_border_width      = $attributes['accordionTitleBorderWidth'] ?? array();
		$accordion_title_border_radius     = $attributes['accordionTitleBorderRadius'] ?? array();
		$is_regular_accordion              = in_array( $block_name, array( 'vertical-accordion', 'horizontal-accordion' ), true );

		$desktop_css = array(
			// accordion title css.
			array(
				'selector' => "$unique_id.sp-eab-wrapper .eab-heading-$parent_id",
				'styles'   => array_merge(
					array(
						'color'      => $accordion_title_colors,
						'background' => $accordion_title_background,
					),
					Css_Helpers::generate_typography_css( $accordion_title_typography ),
				),
			),
			// content bg.
			array(
				'selector' => "$unique_id.sp-eab-wrapper .eab-content-$parent_id>.sp-eab-accordion-content-wrapper",
				'styles'   => array_merge(
					array(
						'color'      => $accordion_content_color,
						'background' => $accordion_content_background,
					),
					Css_Helpers::generate_typography_css( $accordion_content_typography ),
				),
			),
			// content animation.
			'none' !== $content_animation_effect ? array(
				'selector' => ".eab-content-$parent_id>.sp-eab-accordion-content-wrapper",
				'styles'   => array(
					'animation-duration' => ( $content_transition_time['value'] ?? '' ) . ( $content_transition_time['unit'] ?? '' ),
				),
			) : array(),
			// content close button.
			$show_content_close_button ? array(
				'selector' => "$unique_id .sp-eab-accordion-inner-close-button",
				'styles'   => array(
					'color'            => $content_close_button_color,
					'background-color' => $content_close_button_bgcolor,
				),
			) : array(),
		);
		// toggle icon css.
		if ( $enable_expand_collapse_icon ) {
			$toggle_icon_dynamic_css = array(
				array(
					'selector' => ".eab-heading-$parent_id .sp-eab-expand-collapse-icon",
					'styles'   => array_merge(
						Css_Helpers::get_border_styles( $toggle_icon_border, $toggle_icon_border_width ),
						array(
							'color'         => $toggle_icon_colors,
							'background'    => $toggle_icon_background,
							'border-radius' => Css_Helpers::css_data_check(
								$toggle_icon_border_radius['value'],
								Css_Helpers::get_unit( $toggle_icon_border_radius )
							),
						)
					),
				),
			);
			if ( $rotate_90deg && in_array( $toggle_icons_set['set'], array( 1, 4, 5, 6, 9, 10, 12 ), true ) ) {
				$toggle_icon_dynamic_css[] = array(
					'selector' => ".eab-heading-$parent_id .sp-eab-expand-collapse-icon",
					'styles'   => array(
						'display'   => 'block',
						'transform' => 'rotate(-90deg)',
					),
				);
			}
			$desktop_css = array_merge( $desktop_css, $toggle_icon_dynamic_css );
		}
		// block specific css.
		if ( $is_regular_accordion ) {
			$full_item_dynamic_css = array(
				// accordion item border css.
				array(
					'selector' => ".eab-item-$parent_id",
					'styles'   => array_merge(
						Css_Helpers::get_border_styles( $accordion_title_border, $accordion_title_border_width ),
						array(
							'border-radius' => Css_Helpers::css_data_check(
								$accordion_title_border_radius['value'],
								Css_Helpers::get_unit( $accordion_title_border_radius )
							),
							'box-shadow'    => Css_Helpers::box_shadow_css( $accordion_title_normal_box_shadow ),
						)
					),
				),
			);

			$desktop_css = array_merge( $desktop_css, $full_item_dynamic_css );
		}
		// sidebar tab css.
		if ( 'sidebar-tab-accordion' === $block_name ) {
			$accordion_title_border        = $attributes['accordionTitleBorder'] ?? '';
			$accordion_title_border_width  = $attributes['accordionTitleBorderWidth'] ?? array();
			$accordion_title_border_radius = $attributes['accordionTitleBorderRadius'] ?? array();
			$item_content_border           = $attributes['itemContentBorder'] ?? array();
			$item_content_border_width     = $attributes['itemContentBorderWidth'] ?? array();
			$item_content_border_radius    = $attributes['itemContentBorderRadius'] ?? array();

			$tab_accordion_dynamic_css = array(
				array(
					'selector' => "$unique_id ." . ( 'sidebar-tab-accordion-one' === $template ? 'sp-eab-sidebar-tabs-nav' : 'sp-eab-accordion-heading' ),
					'styles'   => array_merge(
						Css_Helpers::get_border_styles( $accordion_title_border, $accordion_title_border_width ),
						array(
							'border-radius' => Css_Helpers::css_data_check(
								$accordion_title_border_radius['value'],
								$accordion_title_border_radius['unit']
							),
						),
						'sidebar-tab-accordion-one' === $template ? array(
							'margin-right'               => ( '-' . $accordion_title_border_width['value']['right'] . $accordion_title_border_width['unit'] ),
							'overflow'                   => 'hidden',
							'border-top-right-radius'    => 0,
							'border-bottom-right-radius' => 0,
						) : array(),
					),
				),
				array(
					'selector' => "$unique_id .sp-eab-sidebar-tabs-content",
					'styles'   => array_merge(
						Css_Helpers::get_border_styles( $item_content_border, $item_content_border_width ),
						array(
							'border-radius' => Css_Helpers::css_data_check(
								$item_content_border_radius['value'],
								$item_content_border_radius['unit']
							),
						),
						'sidebar-tab-accordion-one' === $template ? array( 'border-top-left-radius' => 0 ) : array(),
					),
				),
			);

			$desktop_css = array_merge( $desktop_css, $tab_accordion_dynamic_css );
		}
		// advance tab css.
		$block_wrapper_css = Css_Helpers::block_advanced_panel_shared_css( $attributes );

		// desktop css object.
		$merged_desktop_css = array_merge( $desktop_css, $block_wrapper_css['desktop_css'], $this->shared_responsive_css( 'Desktop' ) );
		// tablet css object.
		$merged_tablet_css = array_merge( $block_wrapper_css['tablet_css'], $this->shared_responsive_css( 'Tablet' ) );
		// mobile css object.
		$merged_mobile_css = array_merge( $block_wrapper_css['mobile_css'], $this->shared_responsive_css( 'Mobile' ) );

		$css_array = array(
			'desktop_css' => $merged_desktop_css,
			'tablet_css'  => $merged_tablet_css,
			'mobile_css'  => $merged_mobile_css,
		);
		return $css_array;
	}
}
