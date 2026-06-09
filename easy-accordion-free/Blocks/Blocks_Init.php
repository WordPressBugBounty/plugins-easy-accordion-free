<?php
/**
 * The plugin gutenberg block Initializer.
 *
 * @link       https://shapedplugin.com/
 * @since      4.0.0
 *
 * @package    Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/blocks
 * @author     ShapedPlugin <support@shapedplugin.com>
 */

namespace ShapedPlugin\EasyAccordion\Blocks;

use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Helper;
use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Register;
use ShapedPlugin\EasyAccordion\Blocks\Includes\ShortcodeBlock;
use ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\Block_Dynamic_Style;
use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Query;
use ShapedPlugin\EasyAccordion\Blocks\Includes\EAP_Ready_Patterns;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Blocks_Init
 */
class Blocks_Init {

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
	 * Load actions
	 *
	 * @return void
	 */
	private function init() {
		Blocks_Register::instance();
		Blocks_Query::instance();
		Block_Dynamic_Style::instance();
		ShortcodeBlock::instance();
		EAP_Ready_Patterns::instance();

		/**
		 * Enqueue block assets.
		 */
		add_action( 'enqueue_block_assets', array( $this, 'easy_accordion_block_enqueue_file' ) );
		/**
		 * Block color picker ajax query.
		 */
		add_action( 'wp_ajax_sp_eab_color_settings_ajax', array( $this, 'sp_eab_color_settings_ajax' ) );
		/**
		 * Rest API Init.
		 */
		// add_action( 'rest_api_init', array( $this, 'eab_rest_api_register' ) );
		// Create Block category.
		if ( version_compare( $GLOBALS['wp_version'], '5.7', '<' ) ) {
			add_filter( 'block_categories', array( $this, 'easy_accordion_block_category_register' ), 10, 2 );
		} else {
			add_filter( 'block_categories_all', array( $this, 'easy_accordion_block_category_register' ), 10, 2 );
		}
		add_action( 'save_post', array( $this, 'clear_cache' ), 10, 1 );
		add_action( 'deleted_post', array( $this, 'clear_cache' ), 10, 1 );
	}

	/**
	 * Method sp_eab_color_settings_ajax
	 *
	 * @return $colors
	 */
	public function sp_eab_color_settings_ajax() {
		// Check user capabilities, current_user_can() is called internally.
		Blocks_Helper::sp_eap_verify_capability();

		// Verify nonce.
		$nonce = isset( $_POST['spEabAjaxNonce'] ) ? sanitize_text_field( wp_unslash( $_POST['spEabAjaxNonce'] ) ) : '';

		if ( ! wp_verify_nonce( $nonce, 'sp_easy_accordion_block_nonce' ) ) {
			wp_send_json_error( array( 'message' => 'Security check failed.' ), 403 );
			return;
		}

		$query_data = isset( $_POST['colorSettingsData'] ) ? sanitize_text_field( wp_unslash( $_POST['colorSettingsData'] ) ) : array();
		$query_data = json_decode( $query_data );

		if ( isset( $query_data ) ) {
			update_option( 'sp_eab_custom_colors_options', $query_data );
		}

		// theme colors.
		$global_settings  = wp_get_global_settings();
		$theme_colors     = isset( $global_settings['color']['palette']['theme'] ) ? $global_settings['color']['palette']['theme'] : array();
		$custom_colors    = isset( $global_settings['color']['palette']['custom'] ) ? $global_settings['color']['palette']['custom'] : array();
		$theme_all_colors = array_merge( $theme_colors, $custom_colors );

		// send response.
		$response = array(
			'theme_colors'  => $theme_all_colors,
			'custom_colors' => get_option( 'sp_eab_custom_colors_options', array() ),
		);
		wp_send_json_success( $response );
		wp_die();
	}

	/**
	 * Sp_easy_accordion_pro block enqueue function.
	 *
	 * @return void
	 */
	public function easy_accordion_block_enqueue_file() {
		/**
		 * Register Block editor style.
		 */
		wp_register_style( 'sp_eab_editor_style', plugin_dir_url( __FILE__ ) . 'build/ea-blocks.css', array(), SP_EA_VERSION, 'all' );
		/**
		 * Register Fontello Icon.
		 */
		wp_register_style( 'sp_eab_fontello_style', plugin_dir_url( __FILE__ ) . 'assets/css/fontello.min.css', array(), SP_EA_VERSION, 'all' );
		/**
		 * Register block main style.
		 */
		wp_register_style( 'sp_eab_main_css', plugin_dir_url( __FILE__ ) . 'build/style-ea-blocks.css', array(), SP_EA_VERSION, 'all' );
		/**
		 * Register block editor script.
		 */
		wp_register_script( 'sp_eab_admin_index_js', plugin_dir_url( __FILE__ ) . 'build/ea-blocks.js', array(), SP_EA_VERSION, true );

		/**
		 * Register animation style.
		 */
		wp_register_style( 'sp-ea-animation', plugin_dir_url( __FILE__ ) . 'assets/css/animate.min.css', array(), SP_EA_VERSION, 'all' );

		// REGISTER ASSETS ONLY FOR FRONTEND.
		if ( ! is_admin() ) {
			/**
			 * Register accordion script.
			 */
			wp_register_script( 'sp-eap-accordion', plugin_dir_url( __FILE__ ) . 'assets/js/sp-eap-accordion.js', array(), SP_EA_VERSION, true );
			/**
			 * Register block frontend script.
			 */
			wp_register_script( 'sp_eab_script_js', plugin_dir_url( __FILE__ ) . 'assets/js/script.js', array(), SP_EA_VERSION, true );

			// Custom global js.
			$settings     = get_option( 'sp_eap_settings' );
			$ea_custom_js = isset( $settings['custom_js'] ) ? trim( html_entity_decode( $settings['custom_js'] ) ) : '';
			if ( ! empty( $ea_custom_js ) ) {
				wp_add_inline_script( 'sp_eab_script_js', $ea_custom_js );
			}

			// Extract customCss if it exists.
			$ea_custom_css = isset( $settings['ea_custom_css'] ) ? trim( $settings['ea_custom_css'] ) : '';
			$focus_style   = isset( $settings['eap_focus_style'] ) ? $settings['eap_focus_style'] : false;

			$inline_style = '';
			if ( $ea_custom_css ) {
				$inline_style .= $ea_custom_css;
			}
			if ( $focus_style ) {
				$inline_style .= '.sp-easy-accordion-block .sp-eab-accordion-item:focus-within {
				box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25) !important;
			}';
			}
			if ( ! empty( $inline_style ) ) {
				wp_add_inline_style( 'sp_eab_main_css', $inline_style );
			}
		}

		/**
		 * Block Localization.
		 */
		wp_localize_script(
			'sp_eab_admin_index_js',
			'sp_eab_localize_data',
			array(
				'ajaxUrl'           => admin_url( 'admin-ajax.php' ),
				'pluginUrl'         => plugin_dir_url( __FILE__ ),
				'homeUrl'           => home_url( '/' ),
				'uploadFile'        => wp_upload_dir(),
				'spEabAjaxNonce'    => wp_create_nonce( 'sp_easy_accordion_block_nonce' ),
				'activeBlockList'   => Blocks_Helper::sp_eab_get_active_block_list(),
				'dashboardSettings' => get_option( 'sp_eap_dashboard_settings', array() ),
				'savedTemplatesUrl' => admin_url( 'edit.php?post_type=sp_easy_accordion&page=eap_dashboard#saved_templates' ),
			)
		);

		wp_localize_script(
			'sp_eab_script_js',
			'sp_eab_ajax',
			array(
				'ajax_url' => admin_url( 'admin-ajax.php' ),
				'nonce'    => wp_create_nonce( 'sp_eab_ajax_nonce' ),
			)
		);
	}

	/**
	 * Register category function
	 *
	 * @param array  $categories Categories list.
	 * @param object $post Post.
	 * @return array
	 */
	public function easy_accordion_block_category_register( $categories, $post ) {
		return array_merge(
			array(
				array(
					'slug'  => 'sp-easy-accordion-pro',
					'title' => __( 'EASY ACCORDION', 'easy-accordion-free' ),
				),
				array(
					'slug'  => 'sp-easy-accordion-pro-blocks',
					'title' => __( 'EASY ACCORDION PRO BLOCKS', 'easy-accordion-free' ),
				),
			),
			$categories
		);
	}

	/**
	 * Purge all the transients associated with our plugin.
	 *
	 * @return void
	 */
	public function clear_cache( $post_id ) {
		// Avoid running during autosave or revisions.
		if ( wp_is_post_autosave( $post_id ) || wp_is_post_revision( $post_id ) ) {
			return;
		}
		$keys = get_option( 'sp_eab_post_transients', array() );
		foreach ( $keys as $key ) {
			delete_transient( $key ); // Delete query cache.
		}
		delete_option( 'sp_eab_post_transients' );
		// Build transient key for this post.
		$transient_key = 'sp_eab_post_dynamic_css_' . $post_id;
		// Delete it.
		delete_transient( $transient_key );
	}
}
