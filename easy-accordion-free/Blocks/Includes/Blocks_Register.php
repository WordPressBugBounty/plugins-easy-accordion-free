<?php
/**
 * Block Name Template Renderer File.
 *
 * @since 4.0.0
 * @version 1.0.0
 *
 * @package EasyAccordion/Blocks
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes;

use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Helper;
use ShapedPlugin\EasyAccordion\Blocks\Includes\Render_Blocks_Template;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * Blocks_Register
 */
class Blocks_Register {
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
		$this->sp_easy_accordion_blocks_init();
	}

	/**
	 * Visibility_key.
	 *
	 * @var string
	 */
	private $visibility_settings_option_name = 'sp_easy_accordion_visibility_settings';

	/**
	 * Method add_block_options_on_settings
	 *
	 * @param array $our_blocks .
	 *
	 * @return void
	 */
	private function sp_eab_add_block_settings_option( $our_blocks ) {
		$updated_options = array_map(
			function ( $block ) {
				return array(
					'name' => $block['name'],
					'show' => true,
				);
			},
			$our_blocks
		);

		$updated_options[] = array(
			'name' => 'sp-easy-accordion-pro/shortcode',
			'show' => true,
		);

		// Fetch existing saved options.
		$existing_options = get_option( $this->visibility_settings_option_name, array() );
		// insert if not exist on db.
		if ( empty( $existing_options ) ) {
			update_option( $this->visibility_settings_option_name, $updated_options );
			return;
		}
		// if not changed anything return.
		if ( count( $existing_options ) === count( $updated_options ) ) {
			return;
		}
		// final options.
		$final_options = array();
		foreach ( $updated_options as $block ) {
			$existing_block  = wp_list_filter( $existing_options, array( 'name' => $block['name'] ) );
			$existing_block  = reset( $existing_block );
			$final_options[] = $existing_block ? $existing_block : $block;
		}
		update_option( $this->visibility_settings_option_name, $final_options );
	}

	/**
	 * Register child blocks.
	 *
	 * @param array $our_child_blocks Prepared blocks.
	 * @return void
	 */
	private function sp_eab_register_child_blocks( $our_child_blocks ) {
		$active_block_list = Blocks_Helper::sp_eab_get_active_block_list();

		foreach ( $our_child_blocks as $block_options ) {
			$block_name = $block_options['name'] ?? '';
			$parents    = $block_options['parent'] ?? array();
			if ( array_intersect( $active_block_list, $parents ) ) {
				register_block_type( $block_name, $block_options );
			}
		}
	}

	/**
	 * Register only active blocks.
	 *
	 * @param array $our_blocks Prepared blocks.
	 * @return void
	 */
	private function sp_eab_register_parent_blocks( $our_blocks ) {
		$active_block_list = Blocks_Helper::sp_eab_get_active_block_list();

		foreach ( $our_blocks as $block_options ) {
			$block_name = $block_options['name'];
			if ( in_array( $block_name, $active_block_list, true ) ) {
				register_block_type( $block_name, $block_options );
			}
		}
	}

	/**
	 * Blocks register function.
	 *
	 * @since 1.0.0
	 *
	 * @return void
	 */
	public function sp_easy_accordion_blocks_init() {
		// INCLUDE BLOCK ATTRIBUTES FILE.
		include SP_EA_PATH . 'Blocks/Includes/block-attributes.php';
		$template_renderer = new Render_Blocks_Template();

		$shared_editor_assets = array(
			'editor_script' => array( 'sp_eab_admin_index_js' ),
			'editor_style'  => array( 'sp_eab_editor_style' ),
		);

		$base_accordion_scripts = array(
			'sp-eap-accordion',
			'sp_eab_script_js',
		);

		$base_accordion_styles = array(
			'sp_eab_main_css',
			'sp_eab_google_fonts',
			'sp_eab_fontello_style',
			'sp-ea-animation',
		);

		// CHILD BLOCKS OPTIONS.
		$eab_child_blocks = array(
			array(
				'name'            => 'sp-easy-accordion-pro/accordion-item',
				'attributes'      => $accordion_item_attributes,
				'parent'          => array( 'sp-easy-accordion-pro/vertical-accordion', 'sp-easy-accordion-pro/horizontal-accordion' ),
				'render_callback' => array( $template_renderer, 'render_accordion_item_block' ),
			),
			array(
				'name'            => 'sp-easy-accordion-pro/image-accordion-item',
				'attributes'      => $image_accordion_item,
				'parent'          => array( 'sp-easy-accordion-pro/image-accordion', 'sp-easy-accordion-pro/accordion-slider' ),
				'render_callback' => array( $template_renderer, 'render_image_accordion_item_block' ),
			),
			array(
				'name'       => 'sp-easy-accordion-pro/sidebar-tab-item',
				'attributes' => $accordion_item_attributes,
				'parent'     => array( 'sp-easy-accordion-pro/sidebar-tab-accordion' ),
			),
		);

		// PARENT BLOCKS OPTIONS.
		$eab_parent_block_options = array(

			array_merge(
				array(
					'name'            => 'sp-easy-accordion-pro/vertical-accordion',
					'attributes'      => $vertical_accordion_attributes,
					'render_callback' => array( $template_renderer, 'render_regular_accordion_block' ),
					'script'          => $base_accordion_scripts,
					'style'           => $base_accordion_styles,
				),
				$shared_editor_assets
			),

			array_merge(
				array(
					'name'            => 'sp-easy-accordion-pro/horizontal-accordion',
					'attributes'      => $horizontal_accordion_attributes,
					'render_callback' => array( $template_renderer, 'render_regular_accordion_block' ),
					'script'          => $base_accordion_scripts,
					'style'           => $base_accordion_styles,
				),
				$shared_editor_assets
			),

			array_merge(
				array(
					'name'            => 'sp-easy-accordion-pro/sidebar-tab-accordion',
					'attributes'      => $sidebar_tab_accordion_attributes,
					'render_callback' => array( $template_renderer, 'eab_sidebar_tab_accordion_block_renderer' ),
					'script'          => $base_accordion_scripts,
					'style'           => $base_accordion_styles,
				),
				$shared_editor_assets
			),

			array_merge(
				array(
					'name' => 'sp-easy-accordion-pro/media-accordion',
				),
				$shared_editor_assets
			),

			array_merge(
				array(
					'name'            => 'sp-easy-accordion-pro/image-accordion',
					'attributes'      => $image_accordion_attributes,
					'render_callback' => array( $template_renderer, 'render_image_accordion_block' ),
					'script'          => array(
						'sp_eab_lightbox_js',
						'sp_eab_script_js',
					),
					'style'           => array_merge(
						$base_accordion_styles,
						array( 'sp_eab_lightBox_style' )
					),
				),
				$shared_editor_assets
			),

			array_merge(
				array(
					'name'            => 'sp-easy-accordion-pro/accordion-slider',
					'attributes'      => $accordion_slider_attributes,
					'render_callback' => array( $template_renderer, 'render_image_accordion_block' ),
					'script'          => array(
						'sp_eab_lightbox_js',
						'sp-eap-swiper',
						'sp_eab_script_js',
					),
					'style'           => array_merge(
						$base_accordion_styles,
						array(
							'sp_eab_lightBox_style',
							'sp_eab_swiper_style',
						)
					),
				),
				$shared_editor_assets
			),

			array_merge(
				array(
					'name'            => 'sp-easy-accordion-pro/post-accordion',
					'attributes'      => $post_accordion_attributes,
					'render_callback' => array( $template_renderer, 'render_post_accordion_block' ),
					'script'          => $base_accordion_scripts,
					'style'           => $base_accordion_styles,
				),
				$shared_editor_assets
			),

			array_merge(
				array(
					'name'            => 'sp-easy-accordion-pro/product-accordion',
					'attributes'      => $product_accordion_attributes,
					'render_callback' => array( $template_renderer, 'render_post_accordion_block' ),
					'script'          => array_merge(
						$base_accordion_scripts,
						array(
							'sp-eap-swiper',
						)
					),
					'style'           => array_merge(
						$base_accordion_styles,
						array(
							'sp_eab_lightBox_style',
							'sp_eab_swiper_style',
						)
					),
				),
				$shared_editor_assets
			),

			array_merge(
				array(
					'name' => 'sp-easy-accordion-pro/user-faq-form',
				),
				$shared_editor_assets
			),
		);

		// SET BLOCKS FOR TOGGLE VISIBILITY.
		$this->sp_eab_add_block_settings_option( $eab_parent_block_options );
		// REGISTER EASY ACCORDIONS CHILD BLOCKS.
		$this->sp_eab_register_child_blocks( $eab_child_blocks );
		// REGISTER EASY ACCORDIONS PARENT BLOCKS.
		$this->sp_eab_register_parent_blocks( $eab_parent_block_options );
	}
}
