<?php
/**
 * Beaver Builder - Easy Accordion Module
 *
 * @package Easy_Accordion_Free
 */

use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Helper;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Cannot access directly.
}

/**
 * Easy Accordion Beaver Builder Module.
 *
 * Registers a custom module in Beaver Builder with a
 * Select field to choose and render an Easy Accordion
 * saved template via shortcode.
 */
class EAP_Beaver_Accordion_Module extends FLBuilderModule {

	/**
	 * Constructor - defines module properties.
	 */
	public function __construct() {
		parent::__construct(
			array(
				// Module name shown in the builder panel.
				'name'            => __( 'Saved Templates', 'easy-accordion-free' ),

				// Short description shown on hover.
				'description'     => __( 'Display an Easy Accordion saved template.', 'easy-accordion-free' ),

				// Module category in the builder panel.
				'category'        => __(
					'Easy Accordion',
					'easy-accordion-free'
				),

				// Folder path to this module's files .
				// frontend.php must be inside this directory.
				'dir'             => plugin_dir_path( __FILE__ ),
				// URL path to this module's files.
				'url'             => plugin_dir_url( __FILE__ ),
				// Module icon (SVG).
				'icon'            => file_get_contents( plugin_dir_path( __FILE__ ) . 'icon.svg' ),
				// Editor export enabled.
				'editor_export'   => true,
				// Module is enabled by default.
				'enabled'         => true,
				// Partial refresh on setting change (no full reload).
				'partial_refresh' => true,
			),
		);

			// Enqueue scripts for page builder.
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_scripts' ) );
	}

	/**
	 * Enqueue scripts for Beaver Builder.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		// Only load in Beaver builder editor.
		if ( ! FLBuilderModel::is_builder_active() ) {
			return;
		}

		// Define blocks URL if not already defined.
		if ( ! defined( 'SP_EAP_BLOCKS_URL' ) ) {
			define( 'SP_EAP_BLOCKS_URL', SP_EA_URL . 'Blocks/' );
		}

		// Register scripts first if not already registered.

		if ( ! wp_script_is( 'sp_easy_blocks_builder_js', 'registered' ) ) {
			wp_register_script( 'sp_easy_blocks_builder_js', SP_EA_URL . 'blocks/assets/js/builder-scripts.js', array( 'jquery' ), SP_EA_VERSION, true );
		}

		// Now enqueue in correct order.
		wp_enqueue_script( 'sp_easy_blocks_builder_js' );

		// Add inline script for Beaver builder change events.
		wp_add_inline_script(
			'sp_easy_blocks_builder_js',
			'jQuery(document).ready(function($) {
				// Re-initialize scripts when Beaver builder updates elements
				function reinitEasyBlocksScripts() {
					if (typeof window.sp_accordion_init === "function") {
						window.sp_accordion_init();
					}
				}

				// Listen for Beaver builder module updates
				$(document).on("fl-builder-preview-render", function() {
					reinitEasyBlocksScripts();
				});

				// Listen for Beaver builder layout changes
				$(document).on("fl-builder-layout-rendered", function() {
					reinitEasyBlocksScripts();
				});

				// Also observe DOM changes as fallback - watch for .eap-beaver-accordion-wrapper
				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						if (mutation.addedNodes.length) {
							for (var i = 0; i < mutation.addedNodes.length; i++) {
								var node = mutation.addedNodes[i];
								if (node.nodeType === 1) {
									if ($(node).hasClass("eap-beaver-accordion-wrapper") || $(node).find(".eap-beaver-accordion-wrapper").length) {
										reinitEasyBlocksScripts();
										break;
									}
								}
							}
						}
					});
				});

				// Start observing the document for changes
				if (document.body) {
					observer.observe(document.body, { childList: true, subtree: true });
				}
			});'
		);
	}
}


/**
 * Initialize and register the Beaver Builder module.
 *
 * All registration must happen inside this function so that
 * FLBuilder is guaranteed to be available at call time.
 *
 * @return void
 */
function eap_beaver_init_module() {

	// Check if Beaver Builder is active.
	if ( ! class_exists( 'FLBuilder' ) ) {
		return;
	}

	// Check if integration is enabled in dashboard settings.
	$dashboard_settings = get_option( 'sp_eap_dashboard_settings', array() );
	$beaver_enabled     = isset( $dashboard_settings['integrations']['beaver']['is_active'] ) && true === $dashboard_settings['integrations']['beaver']['is_active'];

	if ( ! $beaver_enabled ) {
		return;
	}

	// Register the module class together with its settings fields.
	// FLBuilder::register_module() must receive both the class name
	// and the settings array — never call it without arguments.
	FLBuilder::register_module(
		'EAP_Beaver_Accordion_Module',
		array(

			// ─── Settings Tab ──────────────────────────────────────────────
			'general' => array(
				'title'    => __( 'General', 'easy-accordion-free' ),

				// ─── Section inside the tab ────────────────────────────────
				'sections' => array(
					'content' => array(
						'title'  => __( 'Easy Accordion', 'easy-accordion-free' ),

						// ─── Fields inside the section ─────────────────────
						'fields' => array(

							// Select dropdown to pick a template.
							'template_id' => array(
								'type'    => 'select',
								'label'   => __( 'Saved Templates', 'easy-accordion-free' ),
								'default' => '',
								'options' => Blocks_Helper::get_save_template_list(),
								'help'    => __( 'Please Select a Saved Template', 'easy-accordion-free' ),
							),
						),
					),
				),
			),
		)
	);
}

// Use Beaver Builder's own hook to load modules at the right time.
eap_beaver_init_module();
