<?php
/**
 * Css_Helpers File.
 *
 * Description of what this template does.
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
 * Css_Helpers
 */
class Css_Helpers {
	/**
	 * Method object_to_css_string
	 *
	 * @param array $dynamic_css array.
	 *
	 * @return string
	 */
	public static function object_to_css_string( $dynamic_css ) {
		$css = '';
		if ( ! empty( $dynamic_css ) && is_array( $dynamic_css ) ) {
			foreach ( $dynamic_css as $item ) {
				if ( isset( $item['styles'] ) && is_array( $item['styles'] ) ) {
					$styles = '';
					foreach ( $item['styles'] as $property => $value ) {
						if ( null !== $value && '' !== $value && false !== $value ) {
							$styles .= "{$property}: {$value};";
						}
					}
					if ( $styles ) {
						$css .= "{$item['selector']} {{$styles}}";
					}
				}
			}
		}
		return $css;
	}

	/**
	 * Merge duplicate CSS selectors and their styles.
	 *
	 * @param array $css_array Array of CSS selector/style definitions.
	 *
	 * @return array Filtered array with merged selectors.
	 */
	public static function filter_duplicate_selector( $css_array ) {
		if ( empty( $css_array ) || ! is_array( $css_array ) ) {
			return array();
		}

		$selector_map = array();

		foreach ( $css_array as $css ) {
			if ( empty( $css ) || ! isset( $css['selector'], $css['styles'] ) || ! is_array( $css['styles'] ) ) {
				continue;
			}

			$selector = $css['selector'];
			$styles   = $css['styles'];

			if ( empty( $styles ) ) {
				continue;
			}

			if ( isset( $selector_map[ $selector ] ) ) {
				// Merge existing styles with new ones (new overrides old).
				$selector_map[ $selector ]['styles'] = array_merge(
					$selector_map[ $selector ]['styles'],
					$styles
				);
			} else {
				$selector_map[ $selector ] = array(
					'selector' => $selector,
					'styles'   => $styles,
				);
			}
		}

		return array_values( $selector_map );
	}

	/**
	 * Generate responsive CSS string after filtering duplicate selectors.
	 *
	 * @param array $css_obj Array containing desktopCss, tabletCss, and mobileCss.
	 *
	 * @return string Complete responsive CSS string.
	 */
	public static function filter_responsive_dynamic_css( $css_obj ) {
		if ( empty( $css_obj ) || ! is_array( $css_obj ) ) {
			return '';
		}

		$desktop_css = isset( $css_obj['desktop_css'] ) ? $css_obj['desktop_css'] : array();
		$tablet_css  = isset( $css_obj['tablet_css'] ) ? $css_obj['tablet_css'] : array();
		$mobile_css  = isset( $css_obj['mobile_css'] ) ? $css_obj['mobile_css'] : array();

		$filtered_desktop_css = self::filter_duplicate_selector( $desktop_css );
		$filtered_tablet_css  = self::filter_duplicate_selector( $tablet_css );
		$filtered_mobile_css  = self::filter_duplicate_selector( $mobile_css );

		// Build CSS string.
		$css  = self::object_to_css_string( $filtered_desktop_css );
		$css .= ' @media only screen and (min-width: 600px) and (max-width: 1023px) { ';
		$css .= self::object_to_css_string( $filtered_tablet_css );
		$css .= ' } @media only screen and (max-width: 599px) {';
		$css .= self::object_to_css_string( $filtered_mobile_css );
		$css .= ' }';

		return trim( $css );
	}

	/**
	 * Get background value based on background attributes.
	 *
	 * @param array $background_attr Background attribute array containing style, solid, and gradient.
	 *
	 * @return string|null Background value (solid, gradient, or transparent) or null if not found.
	 */
	public static function sp_eab_background_control( $background_attr ) {
		if ( empty( $background_attr ) || ! is_array( $background_attr ) ) {
			return null;
		}

		$style     = isset( $background_attr['style'] ) ? $background_attr['style'] : 'solid';
		$solid     = isset( $background_attr['solid'] ) ? $background_attr['solid'] : '';
		$gradient  = isset( $background_attr['gradient'] ) ? $background_attr['gradient'] : '';
		$image_url = isset( $background_attr['image']['url'] ) ? $background_attr['image']['url'] : '';

		$bg_options = array(
			'transparent' => 'transparent',
			'solid'       => $solid,
			'gradient'    => $gradient,
			'image'       => "url($image_url)",
		);

		return isset( $bg_options[ $style ] ) ? $bg_options[ $style ] : null;
	}

	/**
	 * Method sp_eab_bg_image_css_settings.
	 *
	 * @param  array $background bg .
	 * @return array
	 */
	public static function sp_eab_bg_image_css_settings( $background ) {
		$image_settings = array();
		$bg_style       = $background['style'] ?? 'solid';
		if ( 'image' !== $bg_style ) {
			return $image_settings;
		}
		$settings       = $background['imageSettings'] ?? array();
		$image_settings = array(
			'background-position'   => $settings['bgImagePosition'] ?? '',
			'background-attachment' => $settings['bgImageAttachment'] ?? '',
			'background-repeat'     => $settings['bgImageRepeat'] ?? '',
			'background-size'       => $settings['bgImageSize'] ?? '',
		);
		return $image_settings;
	}

	/**
	 * Check and format CSS data values with an optional unit.
	 *
	 * @param mixed  $value Value or array of values to format.
	 * @param string $unit  Optional. Unit to append to each value (e.g., 'px', '%').
	 * @param string $divided  Optional divided.
	 *
	 * @return string Formatted CSS value string or empty string if invalid.
	 */
	public static function css_data_check( $value, $unit = '', $divided = '' ) {
		// If undefined or null, return empty string.
		if ( ! isset( $value ) ) {
			return '';
		}

		// If value is an array (object in JS).
		if ( is_array( $value ) ) {
			$filtered = array();
			foreach ( $value as $val ) {
				if ( null !== $val && '' !== trim( (string) $val ) ) {
					$filtered[] = $divided > 1 ? (int) $val / $divided . $unit : $val . $unit;
				}
			}

			// If nothing left after filtering.
			if ( empty( $filtered ) ) {
				return '';
			}

			return implode( ' ', $filtered );
		}

		// If it's a scalar value, append unit.
		if ( trim( (string) $value ) !== '' ) {
			return $divided > 1 ? (int) $value / $divided . $unit : $value . $unit;
		}

		return '';
	}

	/**
	 * Get the unit value based on device type.
	 *
	 * @param array  $attributes Attributes array containing unit information.
	 * @param string $device_type Device type key (e.g., 'Desktop', 'Tablet', 'Mobile').
	 *
	 * @return string|null Unit string or null if not found.
	 */
	public static function get_unit( $attributes, $device_type = 'Desktop' ) {
		$unit = $attributes['unit'] ?? 'px';
		// If unit is not an array (single value).
		$current_unit = '';
		if ( is_array( $unit ) ) {
			$current_unit = isset( $unit[ $device_type ] ) ? $unit[ $device_type ] : 'px';
		} else {
			$current_unit = $unit;
		}
		return $current_unit;
	}

	/**
	 * Generate box-shadow CSS string from shadow settings.
	 *
	 * @param array $shadow Shadow settings array.
	 *
	 * @return string CSS box-shadow value.
	 */
	public static function box_shadow_css( $shadow ) {
		if ( empty( $shadow ) || ! is_array( $shadow ) ) {
			return 'none';
		}

		$is_active = isset( $shadow['isActive'] ) ? (bool) $shadow['isActive'] : false;

		if ( ! $is_active ) {
			return 'none';
		}

		$unit   = isset( $shadow['unit'] ) ? $shadow['unit'] : '';
		$values = isset( $shadow['value'] ) ? $shadow['value'] : array();
		$color  = isset( $shadow['color'] ) ? $shadow['color'] : '';

		$top    = isset( $values['top'] ) ? $values['top'] : 0;
		$right  = isset( $values['right'] ) ? $values['right'] : 0;
		$bottom = isset( $values['bottom'] ) ? $values['bottom'] : 0;
		$left   = isset( $values['left'] ) ? $values['left'] : 0;

		$inset = ( 'inset' === $unit ) ? 'inset ' : '';

		return sprintf(
			'%s%dpx %dpx %dpx %dpx %s',
			$inset,
			$top,
			$right,
			$bottom,
			$left,
			$color
		);
	}

	/**
	 * Generate typography CSS array from typography settings.
	 *
	 * @param array $typography Typography attributes array.
	 *
	 * @return array CSS properties array.
	 */
	public static function generate_typography_css( $typography ) {
		if ( empty( $typography ) || ! is_array( $typography ) ) {
			return array();
		}

		$family      = isset( $typography['family'] ) ? $typography['family'] : '';
		$font_weight = isset( $typography['fontWeight'] ) ? $typography['fontWeight'] : '';
		$style       = isset( $typography['style'] ) ? $typography['style'] : '';
		$transform   = isset( $typography['transform'] ) ? $typography['transform'] : '';
		$decoration  = isset( $typography['decoration'] ) ? $typography['decoration'] : '';

		$styles = array();

		if ( $family ) {
			$styles['font-family'] = $family;
		}

		if ( $font_weight ) {
			$styles['font-weight'] = $font_weight;
		}

		if ( $style && 'normal' !== $style ) {
			$styles['font-style'] = $style;
		}

		if ( $transform && 'none' !== $transform ) {
			$styles['text-transform'] = $transform;
		}

		if ( $decoration && 'none' !== $decoration ) {
			$styles['text-decoration'] = $decoration;
		}

		return $styles;
	}

	/**
	 * Generate responsive typography CSS for a specific device.
	 *
	 * @param array  $attributes Typography attributes array.
	 * @param string $device     Device type ('Desktop', 'Tablet', 'Mobile').
	 * @param string $key        Base key for typography (e.g., 'title', 'content').
	 *
	 * @return array CSS properties array.
	 */
	public static function generate_typo_responsive( $attributes, $device, $key ) {
		$font_size_attr   = isset( $attributes[ $key . 'FontSize' ] ) ? $attributes[ $key . 'FontSize' ] : array();
		$line_height_attr = isset( $attributes[ $key . 'LineHeight' ] ) ? $attributes[ $key . 'LineHeight' ] : array();
		$spacing_attr     = isset( $attributes[ $key . 'LetterSpacing' ] ) ? $attributes[ $key . 'LetterSpacing' ] : array();

		$font_size      = isset( $font_size_attr['device'][ $device ] ) ? $font_size_attr['device'][ $device ] : '';
		$line_height    = isset( $line_height_attr['device'][ $device ] ) ? $line_height_attr['device'][ $device ] : '';
		$letter_spacing = isset( $spacing_attr['device'][ $device ] ) ? $spacing_attr['device'][ $device ] : 0;

		$unit_font_size = isset( $font_size_attr['unit'][ $device ] ) ? $font_size_attr['unit'][ $device ] : 'px';
		$unit_spacing   = isset( $spacing_attr['unit'][ $device ] ) ? $spacing_attr['unit'][ $device ] : 'px';

		$styles = array();

		if ( $font_size ) {
			$styles['font-size'] = $font_size . $unit_font_size;
		}

		if ( $line_height ) {
			$styles['line-height'] = $line_height;
		}

		if ( null !== $letter_spacing && '' !== $letter_spacing ) {
			$styles['letter-spacing'] = $letter_spacing . $unit_spacing;
		}

		return $styles;
	}

	/**
	 * Method get_border_styles
	 *
	 * @param array $border border.
	 * @param array $border_width border width.
	 *
	 * @return array
	 */
	public static function get_border_styles( $border, $border_width ) {
		$border_style = $border['style'] ?? 'solid';
		if ( 'none' === $border_style ) {
			return array( 'border' => 'none' );
		}
		$border_array = array(
			'border-style' => $border_style,
			'border-color' => $border['color'] ?? '',
			'border-width' => self::css_data_check(
				$border_width['value'] ?? '',
				$border_width['unit'] ?? ''
			),
		);
		return $border_array;
	}

	/**
	 * Method shared_container_responsive_css
	 *
	 * @param array  $attributes is block attributes.
	 * @param string $device_type is device type.
	 *
	 * @return array
	 */
	public static function shared_container_responsive_css( $attributes, $device_type = 'Desktop' ) {
		$unique_id   = $attributes['uniqueId'] ?? '';
		$template    = $attributes['template'] ?? '';
		$eab_padding = $attributes['eabPadding'] ?? array();
		$eab_margin  = $attributes['eabMargin'] ?? array();

		return array(
			array(
				'selector' => ".$unique_id .sp-eab-$template",
				'styles'   => array(
					'padding' => self::css_data_check(
						$eab_padding['device'][ $device_type ] ?? '',
						self::get_unit( $eab_padding, $device_type )
					),
					'margin'  => self::css_data_check(
						$eab_margin['device'][ $device_type ] ?? '',
						self::get_unit( $eab_margin, $device_type )
					),
				),
			),
		);
	}

	/**
	 * Method eab_get_visibility_css
	 *
	 * @param array $attributes block attributes.
	 *
	 * @return array
	 */
	public static function eab_get_visibility_css( $attributes ) {
		$unique_id    = $attributes['uniqueId'] ?? '';
		$hide_desktop = $attributes['spEabHideOnDesktop'] ?? false;
		$hide_tablet  = $attributes['spEabHideOnTablet'] ?? false;
		$hide_mobile  = $attributes['spEabHideOnMobile'] ?? false;
		$desktop_css  = array();
		$tablet_css   = array();
		$mobile_css   = array();

		if ( $hide_desktop ) {
			$desktop_css[] = array(
				'selector' => ".$unique_id",
				'styles'   => array( 'display' => 'none' ),
			);
		}
		if ( $hide_tablet ) {
			$tablet_css[] = array(
				'selector' => ".$unique_id",
				'styles'   => array( 'display' => 'none' ),
			);
		} else {
			$tablet_css[] = array(
				'selector' => ".$unique_id",
				'styles'   => array( 'display' => 'block' ),
			);
		}

		if ( $hide_mobile ) {
			$mobile_css[] = array(
				'selector' => ".$unique_id",
				'styles'   => array( 'display' => 'none' ),
			);
		} else {
			$mobile_css[] = array(
				'selector' => ".$unique_id",
				'styles'   => array( 'display' => 'block' ),
			);
		}
		$css_array = array(
			'Desktop' => $desktop_css,
			'Tablet'  => $tablet_css,
			'Mobile'  => $mobile_css,
		);
		return $css_array;
	}

	/**
	 * Method block_advanced_panel_shared_css.
	 *
	 * @param array $attributes is block attributes.
	 * @return array
	 */
	public static function block_advanced_panel_shared_css( $attributes ) {
		$unique_id      = $attributes['uniqueId'] ?? '';
		$block_name     = $attributes['blockName'] ?? '';
		$template       = $attributes['template'] ?? '';
		$eab_background = $attributes['eabBackground'] ?? array();
		$eab_border     = $attributes['eabBorder'] ?? array();
		$border_width   = $attributes['eabBorderWidth'] ?? array();
		$border_radius  = $attributes['eabBorderRadius'] ?? array();
		$box_shadow     = $attributes['eabBoxShadow'] ?? array();

		$desktop_css = array(
			array(
				'selector' => ".$unique_id .sp-eab-$template",
				'styles'   => array_merge(
					array(
						'background'    => self::sp_eab_background_control( $eab_background ),
						'border-style'  => $eab_border['style'] ?? '',
						'border-color'  => $eab_border['color'] ?? '',
						'border-width'  => self::css_data_check(
							$border_width['value'] ?? '',
							$border_width['unit'] ?? ''
						),
						'border-radius' => self::css_data_check(
							$border_radius['value'] ?? '',
							$border_radius['unit'] ?? ''
						),
						'box-shadow'    => self::box_shadow_css( $box_shadow ),
					),
					self::sp_eab_bg_image_css_settings( $eab_background )
				),
			),
		);

		// bg overlay.
		if ( in_array( $eab_background['style'], array( 'image', 'video' ), true ) ) {
			$overlay_selector = '';
			$radius_selector  = '';
			if ( 'image' === $eab_background['style'] ) {
				$overlay_selector = 'sidebar-tab-accordion' === $block_name ? 'sp-eab-sidebar-tabs::after' : 'sp-eab-accordion::after';
				$radius_selector  = $overlay_selector;
			} else {
				$overlay_selector = 'sp-eab-video-player::after';
				$radius_selector  = 'sp-eab-video-player';
			}

			$eab_background_overlay = array(
				array(
					'selector' => ".$unique_id .$overlay_selector",
					'styles'   => array(
						'content'          => "''",
						'background-color' => $eab_background['bgOverlay'] ?? '',
					),
				),
				array(
					'selector' => ".$unique_id .$radius_selector",
					'styles'   => array(
						'border-radius' => self::css_data_check(
							$border_radius['value'] ?? '',
							$border_radius['unit'] ?? ''
						),
					),
				),
			);
			$desktop_css            = array_merge( $desktop_css, $eab_background_overlay );
		}

		// Visibility css.
		$visibility_css = self::eab_get_visibility_css( $attributes );
		/**----------- Desktop CSS -------- */
		$desktop_css = array_merge(
			$desktop_css,
			$visibility_css['Desktop'],
			self::shared_container_responsive_css( $attributes, 'Desktop' ),
		);
		/** ---------- Tablet CSS ---------- */
		$tablet_css = array_merge(
			$visibility_css['Tablet'],
			self::shared_container_responsive_css( $attributes, 'Tablet' ),
		);
		/** ---------- Mobile CSS ---------- */
		$mobile_css = array_merge(
			$visibility_css['Mobile'],
			self::shared_container_responsive_css( $attributes, 'Mobile' ),
		);

		return array(
			'desktop_css' => $desktop_css,
			'tablet_css'  => $tablet_css,
			'mobile_css'  => $mobile_css,
		);
	}

	/**
	 * Convert HEX color to RGBA or RGB components.
	 *
	 * @param string     $hex     Hex color (e.g. #ff0000 or ff0000).
	 * @param float|null $opacity Opacity value (0–1). Optional.
	 * @return string
	 */
	public static function hex_to_rgba( $hex, $opacity = null ) {

		$hex = str_replace( '#', '', $hex );

		// Support short hex (fff).
		if ( 3 === strlen( $hex ) ) {
			$hex = $hex[0] . $hex[0] . $hex[1] . $hex[1] . $hex[2] . $hex[2];
		}

		if ( 6 !== strlen( $hex ) ) {
			return '';
		}

		$int = hexdec( $hex );

		$r = ( $int >> 16 ) & 255;
		$g = ( $int >> 8 ) & 255;
		$b = $int & 255;

		if ( null !== $opacity ) {
			return sprintf(
				'rgba(%d, %d, %d, %s)',
				$r,
				$g,
				$b,
				$opacity
			);
		}

		// Return RGB values only (same as JS behavior).
		return sprintf(
			'%d, %d, %d',
			$r,
			$g,
			$b
		);
	}
}
