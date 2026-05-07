<?php
/**
 * Utility helpers for block attributes.
 *
 * @package EasyAccordionPro
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes\Utils;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class EAB_Utils
 *
 * Provides reusable helper methods for generating
 * Gutenberg block attribute definitions.
 */
class EAB_Utils {

	/**
	 * Generate a colors attribute definition.
	 *
	 * @param string $normal Default normal color.
	 * @param string $hover  Default hover color.
	 * @param string $active Default active color.
	 *
	 * @return array Colors attribute configuration.
	 */
	public static function colors( $normal = '', $hover = '', $active = '' ) {
		return array(
			'type'    => 'object',
			'default' => array(
				'normal' => $normal,
				'hover'  => $hover,
				'active' => $active,
			),
		);
	}
	/**
	 * Generate a colors attribute definition.
	 *
	 * @param string $color Default color.
	 * @param string $hover_color Default hover color.
	 *
	 * @return array Colors attribute configuration.
	 */
	public static function color_obj( $color = '', $hover_color = '' ) {
		return array(
			'type'    => 'object',
			'default' => array(
				'color'      => $color,
				'hoverColor' => $hover_color,
			),
		);
	}

	/**
	 * Generate a typography attribute definition.
	 *
	 * @param string $font_weight Font weight value.
	 * @param string $style       Font style.
	 * @param string $transform   Text transform value.
	 * @param string $decoration  Text decoration value.
	 * @param string $family      Font family.
	 *
	 * @return array Typography attribute configuration.
	 */
	public static function typography( $font_weight = '400', $style = 'normal', $transform = 'none', $decoration = 'none', $family = '' ) {
		return array(
			'type'    => 'object',
			'default' => array(
				'family'     => $family,
				'fontWeight' => $font_weight,
				'style'      => $style,
				'transform'  => $transform,
				'decoration' => $decoration,
			),
		);
	}

	/**
	 * Generate a single responsive value attribute definition.
	 *
	 * @param string $desktop Desktop value.
	 * @param string $tablet  Tablet value.
	 * @param string $mobile  Mobile value.
	 * @param string $unit    CSS unit.
	 *
	 * @return array Responsive attribute configuration.
	 */
	public static function single_responsive( $desktop = '', $tablet = '', $mobile = '', $unit = 'px' ) {
		return array(
			'type'    => 'object',
			'default' => array(
				'device' => array(
					'Desktop' => $desktop,
					'Tablet'  => $tablet,
					'Mobile'  => $mobile,
				),
				'unit'   => array(
					'Desktop' => $unit,
					'Tablet'  => $unit,
					'Mobile'  => $unit,
				),
			),
		);
	}

	/**
	 * Generate a spacing attribute definition.
	 *
	 * @param string $top    Top spacing.
	 * @param string $right  Right spacing.
	 * @param string $bottom Bottom spacing.
	 * @param string $left   Left spacing.
	 * @param string $unit   CSS unit.
	 * @param string $all_change   change alll.
	 *
	 * @return array Spacing attribute configuration.
	 */
	public static function spacing( $top = '', $right = '', $bottom = '', $left = '', $unit = 'px', $all_change = false ) {
		return array(
			'type'    => 'object',
			'default' => array(
				'value'     => array(
					'top'    => $top,
					'right'  => $right,
					'bottom' => $bottom,
					'left'   => $left,
				),
				'unit'      => $unit,
				'allChange' => $all_change,
			),
		);
	}

	/**
	 * Generate a responsive spacing attribute definition.
	 *
	 * @param string $top top spacing values.
	 * @param string $right  right spacing values.
	 * @param string $bottom  bottom spacing values.
	 * @param string $left  left spacing values.
	 * @param string $unit    CSS unit.
	 * @param bolean $all_change    CSS unit.
	 *
	 * @return array Responsive spacing attribute configuration.
	 */
	public static function responsive_spacing( $top = '', $right = '', $bottom = '', $left = '', $unit = 'px', $all_change = false ) {
		return array(
			'type'    => 'object',
			'default' => array(
				'device'    => array(
					'Desktop' => array(
						'top'    => $top,
						'right'  => $right,
						'bottom' => $bottom,
						'left'   => $left,
					),
					'Tablet'  => array(
						'top'    => '',
						'right'  => '',
						'bottom' => '',
						'left'   => '',
					),
					'Mobile'  => array(
						'top'    => '',
						'right'  => '',
						'bottom' => '',
						'left'   => '',
					),
				),
				'unit'      => array(
					'Desktop' => $unit,
					'Tablet'  => $unit,
					'Mobile'  => $unit,
				),
				'allChange' => $all_change,
			),
		);
	}

	/**
	 * Usually used for fields which has four values (top, right, bottom, left).
	 *
	 * @param string $is_active active or not.
	 * @param string $top spacing top value.
	 * @param string $right spacing right value.
	 * @param string $bottom bottom value.
	 * @param string $left left value.
	 * @param string $color color.
	 * @param string $unit unit value.
	 *
	 * @return $spacing
	 */
	public static function box_shadow( $is_active = false, $top = '', $right = '', $bottom = '', $left = '', $color = '', $unit = 'Outset' ) {
		return array(
			'type'    => 'object',
			'default' => array(
				'value'    => array(
					'top'    => $top,
					'right'  => $right,
					'bottom' => $bottom,
					'left'   => $left,
				),
				'unit'     => $unit,
				'color'    => $color,
				'isActive' => $is_active,
			),
		);
	}

	/**
	 * Usually used for boolean.
	 *
	 * @param boolean $value default value.
	 *
	 * @return $spacing
	 */
	public static function boolean( $value = false ) {
		return array(
			'type'    => 'boolean',
			'default' => $value,
		);
	}
	/**
	 * Usually used for boolean.
	 *
	 * @param mixed $value default value.
	 *
	 * @return $spacing
	 */
	public static function string( $value = '' ) {
		return array(
			'type'    => 'string',
			'default' => $value,
		);
	}
	/**
	 * Usually used for border object.
	 *
	 * @param string $default_style default style.
	 * @param string $normal_color default color.
	 * @param string $hover_color default hover color.
	 * @param string $active_color default active color.
	 *
	 * @return $border
	 */
	public static function border( $default_style = 'none', $normal_color = '', $hover_color = null, $active_color = null ) {
		$default = array(
			'style' => $default_style,
			'color' => $normal_color,
		);

		if ( null !== $hover_color ) {
			$default['hoverColor'] = $hover_color;
		}
		if ( null !== $active_color ) {
			$default['activeColor'] = $active_color;
		}

		return array(
			'type'    => 'object',
			'default' => $default,
		);
	}

	/**
	 * Usually used for ranger control object.
	 *
	 * @param  mixed  $defaul_value default value.
	 * @param  string $unit default unit.
	 * @return object
	 */
	public static function range_control( $defaul_value, $unit = 'px' ) {
		return array(
			'type'    => 'object',
			'default' => array(
				'value' => $defaul_value,
				'unit'  => $unit,
			),
		);
	}

	/**
	 * Background object.
	 *
	 * @param  mixed $states states.
	 * @param  mixed $defaults default value.
	 * @return array
	 */
	public static function bg( $states = array( 'normal', 'hover', 'active' ), $defaults = array() ) {
		$base = array(
			'style'    => $defaults['style'] ?? 'solid',
			'solid'    => $defaults['solid'] ?? '',
			'gradient' => $defaults['gradient'] ?? 'var(--eab-gradient-color)',
		);

		$data = array();

		foreach ( $states as $state ) {
			$data[ $state ] = $base;
		}

		return array(
			'type'    => 'object',
			'default' => $data,
		);
	}
}
