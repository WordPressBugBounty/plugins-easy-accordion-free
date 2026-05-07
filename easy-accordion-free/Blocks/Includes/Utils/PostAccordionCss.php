<?php
/**
 * ImageAccordionCss File.
 *
 * @since 3.2.0
 * @version 2.0.0
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
 * ImageAccordionCss Class
 */
class PostAccordionCss {
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
	 * Generate responsive CSS for the image accordion block.
	 *
	 * @param string $device_type The device type (Desktop, Tablet, or Mobile).
	 * @return array CSS selector/style pairs.
	 */
	public function responsive_css( $device_type = 'Desktop' ) {

		$attributes = $this->attributes;
		$unique_id  = $this->unique_id;

		/**
		 * Short helper to reduce boilerplate.
		 */
		$val = function ( $attr ) use ( $attributes, $device_type ) {
			return Css_Helpers::css_data_check(
				$attributes[ $attr ]['device'][ $device_type ] ?? '',
				Css_Helpers::get_unit( $attributes[ $attr ] ?? array(), $device_type )
			);
		};

		$is_product_accordion  = isset( $attributes['blockName'] ) && 'product-accordion' === $attributes['blockName'];
		$accordion_title_width = $attributes['titleMinWidth'] ?? array();
		$items_expand_width    = $attributes['itemsExpandWidth'] ?? array();

		// max width selector.
		$max_width_selector = ".sp-easy-accordion-block $unique_id.sp-eab-wrapper";

		$is_product_accordion = isset( $attributes['blockName'] ) && 'product-accordion' === $attributes['blockName'];
		$template             = $attributes['template'] ?? '';

		$css = array(

			/**
			 * Wrapper max width
			 */
			array(
				'selector' => $max_width_selector,
				'styles'   => array(
					'max-width' => $val( 'itemsWidth' ),
				),
			),

			array(
				'selector' => $unique_id . ' .sp-eab-' . $template,
				'styles'   => array(
					'padding' => $val( 'eabPadding' ),
					'margin'  => $val( 'eabMargin' ),
				),
			),

			/**
			 * Accordion gap
			 */
			array(
				'selector' => $unique_id . ' .sp-eab-accordion',
				'styles'   => array(
					'gap' => $val( 'itemsVerticalGap' ),
				),
			),

			/**
			 * Accordion header padding
			 */
			array(
				'selector' => $unique_id . ' .sp-eab-accordion-header-wrapper',
				'styles'   => array(
					'padding' => $val( 'accordionTitlePadding' ),
				),
			),

			/**
			 * Accordion title typography
			 */
			array(
				'selector' => $unique_id . ' .sp-eab-accordion-title-wrapper',
				'styles'   => Css_Helpers::generate_typo_responsive(
					$attributes,
					$device_type,
					'accordionTitle'
				),
			),

			/**
			 * Content padding
			 */
			array(
				'selector' => $unique_id . ' .sp-eab-accordion-body',
				'styles'   => array(
					'padding' => $val( 'contentPadding' ),
				),
			),

			/**
			 * Post meta (single item)
			 */
			array(
				'selector' => $unique_id . ' .sp-eab-post-details',
				'styles'   => array_merge(
					array(
						'gap'    => $val( 'postMetaGap' ),
						'margin' => $val( 'postMetaMargin' ),
					),
					Css_Helpers::generate_typo_responsive(
						$attributes,
						$device_type,
						'postMeta'
					)
				),
			),

			/**
			 * Post excerpt typography
			 */
			array(
				'selector' => $unique_id . ' .sp-eab-post-excerpt',
				'styles'   => Css_Helpers::generate_typo_responsive(
					$attributes,
					$device_type,
					'excerpt'
				),
			),
		);

		/**
		 * Expand / collapse icon
		 */
		if ( ! empty( $attributes['enableExpandAndCollapseIcon'] ) ) {
			$css[] = array(
				'selector' => $unique_id . ' .sp-eab-expand-collapse-icon',
				'styles'   => array(
					'font-size' => $val( 'toggleIconSize' ),
					'padding'   => $val( 'toggleIconPadding' ),
					'margin'    => $val( 'toggleIconMargin' ),
				),
			);
		}

		/**
		 * Product accordion styles
		 */
		if ( $is_product_accordion ) {

			/**
			 * Product price typography
			 */
			$css[] = array(
				'selector' => $unique_id . ' .eab-product-price .woocommerce-Price-amount',
				'styles'   => Css_Helpers::generate_typo_responsive(
					$attributes,
					$device_type,
					'price'
				),
			);

			$css[] = array(
				'selector' => $unique_id . ' .sp-eab-accordion-body',
				'styles'   => array(
					'gap' => $val( 'imgToDescGap' ),
				),
			);

			/**
			 * Add to cart button
			 */
			$css[] = array(
				'selector' => $unique_id . ' a.eab-add-to-cart',
				'styles'   => array_merge(
					array(
						'padding' => $val( 'cartButtonPadding' ),
					),
					Css_Helpers::generate_typo_responsive(
						$attributes,
						$device_type,
						'addToCart'
					)
				),
			);
			$css[] = array(
				'selector' => $unique_id . ' .single_add_to_cart_button',
				'styles'   => array_merge(
					array(
						'padding' => $val( 'cartButtonPadding' ),
					),
					Css_Helpers::generate_typo_responsive(
						$attributes,
						$device_type,
						'addToCart'
					)
				),
			);

			/**
			 * Meta divider spacing
			 */
			$css[] = array(
				'selector' => $unique_id . ' .eab-meta-divider',
				'styles'   => array(
					'margin' => sprintf(
						'%s auto',
						$val( 'metaDividerGap' ),
					),
				),
			);
		}

		/**
		 * Cleanup null entries
		 */
		return array_values( array_filter( $css ) );
	}

	/**
	 * Method accordion dynamic css.
	 *
	 * @return array
	 */
	/**
	 * Generate dynamic CSS for the image accordion block.
	 *
	 * @return array CSS rules for desktop, tablet, and mobile.
	 */
	public function dynamic_css() {

		$attributes = $this->attributes;
		$unique_id  = $this->unique_id;

		$template = $attributes['template'] ?? '';

		// Accordion title.
		$title_border        = $attributes['accordionTitleBorder'] ?? '';
		$title_border_width  = $attributes['accordionTitleBorderWidth'] ?? array();
		$title_border_radius = $attributes['accordionTitleBorderRadius'] ?? array();
		$title_typography    = $attributes['accordionTitleTypography'] ?? array();
		$title_colors        = $attributes['accordionTitleColors'] ?? '';
		$title_bg            = $attributes['accordionTitleBackground'] ?? '';
		$title_shadow_normal = $attributes['accordionTitleNormalBoxShadow'] ?? array();

		// Content.
		$content_bg = $attributes['ContentBackground'] ?? '';

		// Post.
		$post_meta_color      = $attributes['postMetaColor'] ?? '';
		$post_meta_typography = $attributes['postMetaTypography'] ?? array();
		$excerpt_color        = $attributes['excerptColor'] ?? '';
		$excerpt_typography   = $attributes['excerptTypography'] ?? array();

		// Animation.
		$animation_effect   = $attributes['animationEffect'] ?? 'none';
		$animation_duration = $attributes['animationTransitionDuration'] ?? array();

		// Toggle icon.
		$enable_expand_collapse_icon = ! empty( $attributes['enableExpandAndCollapseIcon'] );
		$toggle_icon_border          = $attributes['toggleIconBorder'] ?? array();
		$toggle_icon_border_width    = $attributes['toggleIconBorderWidth'] ?? array();
		$toggle_icon_border_radius   = $attributes['toggleIconBorderRadius'] ?? array();
		$toggle_icon_colors          = $attributes['toggleIconColors'] ?? '';
		$toggle_icon_background      = $attributes['toggleIconBackground'] ?? '';
		$toggle_icons_set            = $attributes['toggleIconsSet'] ?? array();
		$rotate_90deg                = ! empty( $attributes['rotate90deg'] );
		$is_product_accordion        = isset( $attributes['blockName'] ) && 'product-accordion' === $attributes['blockName'];

		$css = array(

			/* ---------- Accordion Item (Title Wrapper) ---------- */

			array(
				'selector' => $unique_id . ' .sp-eab-accordion-item',
				'styles'   => array_merge(
					Css_Helpers::get_border_styles( $title_border, $title_border_width ),
					array(
						'border-radius' => Css_Helpers::css_data_check(
							$title_border_radius['value'] ?? '',
							$title_border_radius['unit'] ?? ''
						),
						'box-shadow'    => Css_Helpers::box_shadow_css( $title_shadow_normal ),
					)
				),
			),
			/* ---------- Accordion Heading ---------- */
			array(
				'selector' => $unique_id . ' .sp-eab-accordion-title-wrapper',
				'styles'   => array_merge(
					Css_Helpers::generate_typography_css( $title_typography ),
				),
			),

			/* ---------- Title Background States ---------- */

			array(
				'selector' => $unique_id . '.sp-eab-wrapper .sp-eab-accordion-heading',
				'styles'   => array(
					'color'      => $title_colors,
					'background' => $title_bg,
				),
			),

			/* ---------- Content ---------- */

			array(
				'selector' => $unique_id . ' div:is(.sp-eab-accordion-body,.sp-eab-product-content-wrapper)',
				'styles'   => array(
					'background' => $content_bg,
				),
			),

			/* ---------- Post Meta ---------- */

			array(
				'selector' => $unique_id . ' .sp-eab-post-details',
				'styles'   => array_merge(
					Css_Helpers::generate_typography_css( $post_meta_typography ),
					array( 'color' => $post_meta_color )
				),
			),

			array(
				'selector' => $unique_id . ' .sp-eab-post-excerpt',
				'styles'   => array_merge(
					Css_Helpers::generate_typography_css( $excerpt_typography ),
					array( 'color' => $excerpt_color )
				),
			),
		);

		/* ---------- Content Animation ---------- */

		if ( 'none' !== $animation_effect ) {
			$css[] = array(
				'selector' => $unique_id . ' div:is(.sp-eab-accordion-content-wrapper,.eab-product-slider-content)',
				'styles'   => array(
					'animation-duration' =>
						( $animation_duration['value'] ?? '' ) .
						( $animation_duration['unit'] ?? '' ),
				),
			);
		}
		/* ---------- Toggle (Expand / Collapse) Icon ---------- */

		if ( $enable_expand_collapse_icon ) {

			// Normal state.
			$css[] = array(
				'selector' => $unique_id . ' .sp-eab-expand-collapse-icon',
				'styles'   => array_merge(
					Css_Helpers::get_border_styles(
						$toggle_icon_border,
						$toggle_icon_border_width
					),
					array(
						'color'         => $toggle_icon_colors,
						'background'    => $toggle_icon_background,
						'border-radius' => Css_Helpers::css_data_check(
							$toggle_icon_border_radius['value'] ?? '',
							$toggle_icon_border_radius['unit'] ?? ''
						),
					)
				),
			);

			// Rotate icon (specific icon sets only).
			if (
				$rotate_90deg &&
				in_array(
					(int) ( $toggle_icons_set['set'] ?? 0 ),
					array( 1, 4, 5, 6, 9, 10, 12 ),
					true
				)
			) {
				$css[] = array(
					'selector' => $unique_id . ' .sp-eab-expand-collapse-icon',
					'styles'   => array(
						'display'   => 'block',
						'transform' => 'rotate(-90deg)',
					),
				);
			}
		}

		/**
		 * Product accordion styles
		*/
		if ( $is_product_accordion ) {
			// Product (WooCommerce).
			$price_color         = $attributes['priceColor'] ?? '';
			$price_typography    = $attributes['priceTypography'] ?? array();
			$cart_btn_colors     = $attributes['cartButtonColors'] ?? array();
			$cart_btn_bg_colors  = $attributes['cartButtonBgColors'] ?? array();
			$cart_btn_border     = $attributes['cartButtonBorder'] ?? array();
			$cart_btn_border_w   = $attributes['cartButtonBorderWidth'] ?? array();
			$cart_btn_radius     = $attributes['cartButtonBorderRadius'] ?? array();
			$cart_btn_typography = $attributes['addToCartTypography'] ?? array();
			$meta_divider_color  = $attributes['metaDividerColor'] ?? '';

			/* ---------- Product Price ---------- */

			$css[] = array(
				'selector' => $unique_id . ' .eab-product-price .woocommerce-Price-amount',
				'styles'   => array_merge(
					Css_Helpers::generate_typography_css( $price_typography ),
					array(
						'color' => $price_color,
					)
				),
			);

			/* ---------- Sale Price (del) ---------- */

			$css[] = array(
				'selector' => $unique_id . ' .eab-product-price del .woocommerce-Price-amount',
				'styles'   => array(
					'color' => Css_Helpers::hex_to_rgba( $price_color, 0.5 ),
				),
			);

			$css[] = array(
				'selector' => $unique_id . ' .eab-product-price del',
				'styles'   => array(
					'color' => Css_Helpers::hex_to_rgba( $price_color, 0.5 ),
				),
			);

			/* ---------- Add to Cart Button ---------- */

			$css[] = array(
				'selector' => $unique_id . ' a.eab-add-to-cart',
				'styles'   => array_merge(
					Css_Helpers::generate_typography_css( $cart_btn_typography ),
					Css_Helpers::get_border_styles(
						$cart_btn_border,
						$cart_btn_border_w
					),
					array(
						'color'         => $cart_btn_colors['color'] ?? '',
						'background'    => $cart_btn_bg_colors['color'] ?? '',
						'border-radius' => Css_Helpers::css_data_check(
							$cart_btn_radius['value'] ?? '',
							$cart_btn_radius['unit'] ?? ''
						),
					)
				),
			);

			$css[] = array(
				'selector' => $unique_id . ' .single_add_to_cart_button',
				'styles'   => array_merge(
					Css_Helpers::generate_typography_css( $cart_btn_typography ),
					Css_Helpers::get_border_styles(
						$cart_btn_border,
						$cart_btn_border_w
					),
					array(
						'color'         => $cart_btn_colors['color'] ?? '',
						'background'    => $cart_btn_bg_colors['color'] ?? '',
						'border-radius' => Css_Helpers::css_data_check(
							$cart_btn_radius['value'] ?? '',
							$cart_btn_radius['unit'] ?? ''
						),
					)
				),
			);

			$css[] = array(
				'selector' => $unique_id . ' a.eab-add-to-cart:hover',
				'styles'   => array(
					'color'      => $cart_btn_colors['hoverColor'] ?? '',
					'background' => $cart_btn_bg_colors['hoverColor'] ?? '',
				),
			);

			$css[] = array(
				'selector' => $unique_id . ' .single_add_to_cart_button:hover',
				'styles'   => array(
					'color'      => $cart_btn_colors['hoverColor'] ?? '',
					'background' => $cart_btn_bg_colors['hoverColor'] ?? '',
				),
			);

			/* ---------- Meta Divider ---------- */

			$css[] = array(
				'selector' => $unique_id . ' .eab-meta-divider',
				'styles'   => array(
					'border-top-color' => $meta_divider_color,
				),
			);
		}

		return array_values( array_filter( $css ) );
	}


	/**
	 * Sp_eab_background_control
	 *
	 * @param  mixed $background_attr get all data.
	 * @return statement
	 */
	public function sp_eab_background_control( $background_attr ) {
		$style    = isset( $background_attr['style'] ) ? $background_attr['style'] : '';
		$solid    = isset( $background_attr['solid'] ) ? $background_attr['solid'] : '';
		$gradient = isset( $background_attr['gradient'] ) ? $background_attr['gradient'] : '';
		$bg_img   = isset( $background_attr['image'] ) ? $background_attr['image'] : '';

		$bg_options = array(
			'transparent' => 'transparent',
			'solid'       => $solid,
			'gradient'    => $gradient,
			'image'       => isset( $bg_img['url'] ) ? 'url(' . esc_url( $bg_img['url'] ) . ')' : '',
		);

		// Return the matched style OR empty if not found.
		return isset( $bg_options[ $style ] ) ? $bg_options[ $style ] : '';
	}

	/**
	 * Combine shared and responsive CSS.
	 *
	 * @return array
	 */
	public function shared_dynamic_css() {
		$attributes = $this->attributes;
		// advance tab css.
		$advanced_panel_shared = Css_Helpers::block_advanced_panel_shared_css( $attributes );
		return array(
			'desktop_css' => array_merge( $this->responsive_css( 'Desktop' ), $advanced_panel_shared['desktop_css'] ),
			'tablet_css'  => array_merge( $this->responsive_css( 'Tablet' ), $advanced_panel_shared['tablet_css'] ),
			'mobile_css'  => array_merge( $this->responsive_css( 'Mobile' ), $advanced_panel_shared['mobile_css'] ),
		);
	}

	/**
	 * Generate all block CSS combined.
	 *
	 * @return array
	 */
	public function eab_accordion_block_css() {
		$shared = $this->shared_dynamic_css();

		return array(
			'desktop_css' => array_merge( $this->dynamic_css(), $shared['desktop_css'] ),
			'tablet_css'  => $shared['tablet_css'],
			'mobile_css'  => $shared['mobile_css'],
		);
	}
}
