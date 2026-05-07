<?php
/**
 * ImageAccordionCss File.
 *
 * @since 4.0.0
 * @version 1.0.0
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
class ImageAccordionCss {
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

		// Short helper to reduce boilerplate.
		$val = function ( $attr ) use ( $attributes, $device_type ) {
			return Css_Helpers::css_data_check(
				$attributes[ $attr ]['device'][ $device_type ] ?? '',
				Css_Helpers::get_unit( $attributes[ $attr ] ?? array(), $device_type )
			);
		};

		$css = array(
			// Main block wrapper.
			array(
				'selector' => $unique_id . '.sp-easy-accordion-block',
				'styles'   => array(
					'max-width' => $val( 'itemsWidth' ),
					'height'    => $val( 'itemsHeight' ),
					'padding'   => $val( 'eabPadding' ),
					'margin'    => $val( 'eabMargin' ),
				),
			),
			array(
				'selector' => $unique_id . '.sp-easy-accordion-block .sp-eab-image-accordion-container',
				'styles'   => array(
					'max-width' => $val( 'itemsWidth' ),
				),
			),

			// items gap.
			array(
				'selector' => "$unique_id.sp-easy-accordion-block .sp-eab-image-accordion-items",
				'styles'   => array(
					'gap' => $val( 'itemsVerticalGap' ),
				),
			),

			// Active accordion expanded item.
			array(
				'selector' => $unique_id . '.sp-easy-accordion-block .sp-eab-image-accordion-item:is(.active)',
				'styles'   => array(
					'flex-basis' => '50%',
				),
			),
			// accordion title typography.
			array(
				'selector' => "$unique_id .sp-eab-image-accordion-item .sp-eab-image-title",
				'styles'   => Css_Helpers::generate_typo_responsive( $attributes, $device_type, 'accordionTitle' ),
			),

			// Overlay padding.
			array(
				'selector' => $unique_id . ' .sp-eab-image-accordion-item .sp-eab-overlay',
				'styles'   => array(
					'padding' => $val( 'contentPadding' ),
				),
			),

			// Description typography.
			array(
				'selector' => $unique_id . ' .sp-eab-image-accordion-item .sp-eab-image-desc',
				'styles'   => Css_Helpers::generate_typo_responsive( $attributes, $device_type, 'description' ),
			),
		);

		return $css;
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
		// === Extract Attributes === //
		$accordion_title_typography = $attributes['accordionTitleTypography'] ?? array();
		$accordion_title_colors     = $attributes['accordionTitleColors'] ?? '';
		$description_typography     = $attributes['descriptionTypography'] ?? array();
		$description_color          = $attributes['descriptionColor'] ?? '';
		$description_gap            = $attributes['descriptionGap'] ?? array();
		$image_content_bg           = $attributes['imageContentBackground'] ?? array();

		// Content icon attrs.
		$img_border_radius       = $attributes['imgBorderRadius'] ?? array();
		$img_border              = $attributes['imgBorder'] ?? array();
		$img_border_width        = $attributes['imgBorderWidth'] ?? array();
		$content_animation_delay = $attributes['contentTransitionTime'] ?? array();
		$img_overlay_color       = $attributes['imgOverlayColor'] ?? '';

		$img_overlay        = $img_overlay_color;
		$img_active_overlay = $img_overlay_color;
		$template           = $attributes['template'] ?? 'image-accordion-one';

		$overlay_selector = $unique_id . ' .sp-eab-image-accordion-item';

		// === Overlay Styles === //
		$overlay_styles = array(
			array(
				'selector' => $overlay_selector . ':not(.active) .sp-eab-accordion-bg .sp-eab-overlay',
				'styles'   => array(
					'background' => $img_overlay,
				),
			),
			array(
				'selector' => $overlay_selector . ':is(.active) .sp-eab-accordion-bg .sp-eab-overlay',
				'styles'   => array(
					'background' => $img_active_overlay,
				),
			),
			array(
				'selector' => $overlay_selector . ':not(.active):hover .sp-eab-accordion-bg .sp-eab-overlay',
				'styles'   => array(
					'background' => $img_active_overlay,
				),
			),
		);

		// === Desktop CSS === //
		$dynamic_css = array_merge(
			array(
				array(
					'selector' => $unique_id . ' .sp-eab-image-accordion-item .sp-eab-accordion-bg',
					'styles'   => array_merge(
						Css_Helpers::get_border_styles( $img_border, $img_border_width ),
						array( 'border-radius' => Css_Helpers::css_data_check( $img_border_radius['value'] ?? '', $img_border_radius['unit'] ?? '' ) ),
					),
				),
			),
			$overlay_styles,
			array(
				array(
					'selector' => $unique_id . ' .sp-eab-image-accordion-item .sp-eab-image-title',
					'styles'   => array_merge(
						Css_Helpers::generate_typography_css( $accordion_title_typography ),
						array( 'color' => $accordion_title_colors )
					),
				),
				array(
					'selector' => $unique_id . ' .sp-eab-image-accordion-item .sp-eab-image-desc',
					'styles'   => array_merge(
						Css_Helpers::generate_typography_css( $description_typography ),
						array(
							'color'  => $description_color,
							'margin' => ( $description_gap['value'] ?? '10' ) . ( $description_gap['unit'] ?? 'px' ) . ' 0 0 0',
						)
					),
				),
				array(
					'selector' => $unique_id . ' .sp-eab-accordion-bg .animated ',
					'styles'   => array(
						'animation-duration' => $content_animation_delay['value'] . 'ms',
					),
				),
			)
		);

		return $dynamic_css;
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
	 * Sp_eab_background_image_css
	 *
	 * @param  mixed $attr bg .
	 * @return array
	 */
	public function sp_eab_background_image_css( $attr ) {
		$style  = isset( $attr['style'] ) ? $attr['style'] : '';
		$bg_img = isset( $attr['imageSettings'] ) ? $attr['imageSettings'] : '';
		return 'image' === $style ? array(
			'background-position'   => $bg_img['bgImagePosition'] ?? '',
			'background-attachment' => $bg_img['bgImageAttachment'] ?? '',
			'background-repeat'     => $bg_img['bgImageRepeat'] ?? '',
			'background-size'       => $bg_img['bgImageSize'] ?? '',
		) : array();
	}

	/**
	 * Generate shared style (border, background, shadow, visibility).
	 *
	 * @param string $device_type Device type.
	 * @return array
	 */
	public function shared_style( $device_type = 'Desktop' ) {
		$attributes = $this->attributes;
		$unique_id  = $this->unique_id;

		$eab_border        = $attributes['eabBorder'] ?? array();
		$eab_border_width  = $attributes['eabBorderWidth'] ?? array();
		$eab_border_radius = $attributes['eabBorderRadius'] ?? array();
		$eab_box_shadow    = $attributes['eabBoxShadow'] ?? array();
		$eab_background    = $attributes['eabBackground'] ?? array();

		$hide_desktop = $attributes['spEabHideOnDesktop'] ?? false;
		$hide_tablet  = $attributes['spEabHideOnTablet'] ?? false;
		$hide_mobile  = $attributes['spEabHideOnMobile'] ?? false;

		$hide_conditions = array(
			'Desktop' => $hide_desktop,
			'Tablet'  => $hide_tablet,
			'Mobile'  => $hide_mobile,
		);

		$shared = array(
			array(
				'selector' => $unique_id . '.sp-easy-accordion-block',
				'styles'   => array_merge(
					Css_Helpers::get_border_styles( $eab_border, $eab_border_width ),
					array(
						'border-radius' => Css_Helpers::css_data_check( $eab_border_radius['value'] ?? '', $eab_border_radius['unit'] ?? 'px' ),
						'box-shadow'    => Css_Helpers::box_shadow_css( $eab_box_shadow ),
						'background'    => $this->sp_eab_background_control( $eab_background ),
					),
					$this->sp_eab_background_image_css( $eab_background )
				),
			),
		);

		// bg overlay.
		if ( in_array( $eab_background['style'], array( 'image', 'video' ), true ) ) {
			$eab_background_overlay = array(
				array(
					'selector' => "$unique_id" . ( 'image' === $eab_background['style'] ? '.sp-easy-accordion-block::after' : ' .sp-eab-video-player::after' ),
					'styles'   => array(
						'content'          => "''",
						'background-color' => $eab_background['bgOverlay'] ?? '',
					),
				),
				array(
					'selector' => "$unique_id" . ( 'image' === $eab_background['style'] ? '.sp-easy-accordion-block::after' : ' .sp-eab-video-player' ),
					'styles'   => array(
						'border-radius' => Css_Helpers::css_data_check( $eab_border_radius['value'] ?? '', $eab_border_radius['unit'] ?? 'px' ),
					),
				),
			);

			$shared = array_merge( $shared, $eab_background_overlay );
		}

		if ( ! empty( $eab_background['color'] ) ) {
			$shared[0]['styles']['background'] = $eab_background['color'];
		}

		if ( ! empty( $hide_conditions[ $device_type ] ) ) {
			$shared[] = array(
				'selector' => $unique_id,
				'styles'   => array( 'display' => 'none' ),
			);
		}

		return $shared;
	}

	/**
	 * Combine shared and responsive CSS.
	 *
	 * @return array
	 */
	public function shared_dynamic_css() {
		return array(
			'desktop_css' => array_merge( $this->responsive_css( 'Desktop' ), $this->shared_style( 'Desktop' ) ),
			'tablet_css'  => array_merge( $this->responsive_css( 'Tablet' ), $this->shared_style( 'Tablet' ) ),
			'mobile_css'  => array_merge( $this->responsive_css( 'Mobile' ), $this->shared_style( 'Mobile' ) ),
		);
	}

	/**
	 * Generate all block CSS combined.
	 *
	 * @return array
	 */
	public function eab_image_accordion_block_css() {
		$shared = $this->shared_dynamic_css();

		return array(
			'desktop_css' => array_merge( $this->dynamic_css(), $shared['desktop_css'] ),
			'tablet_css'  => $shared['tablet_css'],
			'mobile_css'  => $shared['mobile_css'],
		);
	}
}
