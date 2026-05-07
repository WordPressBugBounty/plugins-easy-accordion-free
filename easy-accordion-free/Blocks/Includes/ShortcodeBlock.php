<?php
/**
 * Block Name Template Renderer File.
 *
 * Description of what this template does.
 *
 * @since 3.2.0
 * @version 1.0.0
 *
 * @package EasyAccordion/Blocks
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * ShortcodeBlock.
 */
class ShortcodeBlock {
	/**
	 * This plugin's instance.
	 *
	 * @var Blocks
	 */
	private static $instance;

	/**
	 * Main Blocks Instance.
	 *
	 * Insures that only one instance of Blocks exists in memory at any one
	 * time. Also prevents needing to define globals all over the place.
	 *
	 * @static
	 * @return object|Blocks The one true Blocks
	 */
	public static function instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}
		return self::$instance;
	}

	/**
	 * Method init
	 *
	 * @return void
	 */
	public function init() {
		if ( $this->sp_eap_is_shortcode_block_visible() ) {
			$this->sp_eab_shortcode_block_register();
			// add block assets.
			add_action( 'enqueue_block_assets', array( $this, 'eab_shortcode_block_enqueue_file' ) );
		}
	}

	/**
	 * Method eab_shortcode_block_enqueue_file.
	 *
	 * @return void
	 */
	public function eab_shortcode_block_enqueue_file() {
		wp_register_script( 'sp_eab_admin_index_js', plugin_dir_url( __FILE__ ) . '../build/ea-blocks.js', array(), SP_EA_VERSION, true );
		wp_localize_script(
			'sp_eab_admin_index_js',
			'sp_easy_accordion_pro',
			array(
				'shortCodeList' => $this->sp_easy_accordion_pro_post_list(),
			)
		);
	}

	/**
	 * Shortcode list.
	 *
	 * @return array
	 */
	public function sp_easy_accordion_pro_post_list() {
		$shortcodes = get_posts(
			array(
				'post_type'      => 'sp_easy_accordion',
				'post_status'    => 'publish',
				'posts_per_page' => 999,
			)
		);

		if ( count( $shortcodes ) < 1 ) {
			return array();
		}

		return array_map(
			function ( $shortcode ) {
					return (object) array(
						'id'    => absint( $shortcode->ID ),
						'title' => esc_html( $shortcode->post_title ),
					);
			},
			$shortcodes
		);
	}

	/**
	 * Register Gutenberg shortcode block.
	 */
	public function sp_eab_shortcode_block_register() {
		$attributes = array(
			'shortcode'          => array(
				'type'    => 'string',
				'default' => '',
			),
			'showInputShortcode' => array(
				'type'    => 'boolean',
				'default' => true,
			),
			'preview'            => array(
				'type'    => 'boolean',
				'default' => false,
			),
			'is_admin'           => array(
				'type'    => 'boolean',
				'default' => is_admin(),
			),
			'align'              => array(
				'type'    => 'string',
				'default' => 'none',
			),
		);
		register_block_type(
			'sp-easy-accordion-pro/shortcode',
			array(
				'attributes'      => $attributes,
				'editor_script'   => array( 'sp_eab_admin_index_js' ),
				'render_callback' => array( $this, 'sp_eap_render_shortcode' ),
			)
		);
	}

	/**
	 * Render callback.
	 *
	 * @param string $attributes Shortcode.
	 * @return string
	 */
	public function sp_eap_render_shortcode( $attributes ) {
		// class name.
		$align      = $attributes['align'] ?? 'none';
		$class_name = "align$align";

		return '<div class="' . $class_name . '">' . do_shortcode( '[sp_easyaccordion id="' . sanitize_text_field( $attributes['shortcode'] ) . '"]' ) . '</div>';
	}
	/**
	 * Check if SP Easy Accordion shortcode block is enabled to show.
	 *
	 * @return bool
	 */
	public function sp_eap_is_shortcode_block_visible() {
		$blocks_visibility = (array) get_option( 'sp_easy_accordion_visibility_settings', array() );
		foreach ( $blocks_visibility as $block ) {
			if ( 'sp-easy-accordion-pro/shortcode' === $block['name'] ) {
				return (bool) $block['show'];
			}
		}
	}
}
