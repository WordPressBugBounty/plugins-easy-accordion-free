<?php
/**
 * Elementor shortcode block.
 *
 * @since      2.1.6
 * @package     easy-accordion-free
 * @subpackage  easy-accordion-free/admin
 */

if ( ! defined( 'ABSPATH' ) ) {
	die;
} // Cannot access directly.

/**
 * Easy_Accordion_Free_Element_Shortcode_Addons
 */
class Easy_Accordion_Free_Element_Shortcode_Addons {
	/**
	 * Instance
	 *
	 * @since 2.1.6
	 *
	 * @access private
	 * @static
	 *
	 * @var Easy_Accordion_Free_Element_Shortcode_Addons The single instance of the class.
	 */
	private static $_instance = null;

	/**
	 * Instance
	 *
	 * Ensures only one instance of the class is loaded or can be loaded.
	 *
	 * @since 2.1.6
	 *
	 * @access public
	 * @static
	 *
	 * @return Elementor_Test_Extension An instance of the class.
	 */
	public static function instance() {

		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}
		return self::$_instance;
	}

	/**
	 * Constructor
	 *
	 * @since 2.1.6
	 *
	 * @access public
	 */
	public function __construct() {
		$this->on_plugins_loaded();
		add_action( 'elementor/preview/enqueue_styles', array( $this, 'eaf_addons_enqueue_styles' ) );
		add_action( 'elementor/preview/enqueue_scripts', array( $this, 'eaf_addons_enqueue_scripts' ) );
		add_action( 'elementor/editor/before_enqueue_scripts', array( $this, 'easy_accordion_free_addons_icon' ) );
	}

	/**
	 * Elementor block icon.
	 *
	 * @since    2.1.6
	 * @return void
	 */
	public function easy_accordion_free_addons_icon() {
		wp_enqueue_style( 'easy_accordion_free_elementor_addons_icon', SP_EA_URL . 'admin/css/fontello.min.css', array(), SP_EA_VERSION, 'all' );
	}

	/**
	 * Register the styles for the elementor block area.
	 *
	 * @since    2.1.6
	 */
	public function eaf_addons_enqueue_styles() {
		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in easy_accordion_free_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The easy_accordion_free_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// Old styles - keep for backward compatibility.
		wp_enqueue_style( 'sp-ea-fontello-icons' );
		wp_enqueue_style( 'sp-ea-style' );
	}
	/**
	 * Register the JavaScript for the elementor block area.
	 *
	 * @since    2.1.6
	 */
	public function eaf_addons_enqueue_scripts() {
		/**
		 * This function is provided for demonstration purposes only.
		 *
		 * An instance of this class should be passed to the run() function
		 * defined in easy_accordion_free_Loader as all of the hooks are defined
		 * in that particular class.
		 *
		 * The easy_accordion_free_Loader will then create the relationship
		 * between the defined hooks and the functions defined in this
		 * class.
		 */

		// Old scripts - keep for backward compatibility.
		wp_enqueue_script( 'sp-ea-accordion-js' );
		wp_enqueue_script( 'sp-ea-accordion-config' );

		// Define blocks URL if not already defined.
		if ( ! defined( 'SP_EAP_BLOCKS_URL' ) ) {
			define( 'SP_EAP_BLOCKS_URL', SP_EA_URL . 'Blocks/' );
		}

		if ( ! wp_script_is( 'sp_easy_blocks_builder_js', 'registered' ) ) {
			wp_register_script( 'sp_easy_blocks_builder_js', SP_EA_URL . 'blocks/assets/js/builder-scripts.js', array( 'jquery' ), SP_EA_VERSION, true );
		}

		// Enqueue blocks scripts.
		wp_enqueue_script( 'sp_easy_blocks_builder_js' );

		// Add inline script for Elementor editor change events.
		wp_add_inline_script(
			'sp_easy_blocks_builder_js',
			'jQuery(document).ready(function($) {
				// Re-initialize scripts when Elementor updates elements
				function reinitEasyBlocksScripts() {
					if (typeof window.sp_accordion_init === "function") {
						window.sp_accordion_init();
					}
				}

				// Listen for Elementor preview changes
				$(document).on("elementor/render/preview", function() {
					reinitEasyBlocksScripts();
				});

				// Listen for Elementor widget updates
				$(window).on("elementor/frontend/element_ready/widget", function() {
					reinitEasyBlocksScripts();
				});

				// Also observe DOM changes as fallback - watch for .eap-elementor-accordion-wrapper
				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						if (mutation.addedNodes.length) {
							for (var i = 0; i < mutation.addedNodes.length; i++) {
								var node = mutation.addedNodes[i];
								if (node.nodeType === 1) {
									if ($(node).hasClass("eap-elementor-accordion-wrapper") || $(node).find(".eap-elementor-accordion-wrapper").length) {
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

	/**
	 * On Plugins Loaded
	 *
	 * Checks if Elementor has loaded, and performs some compatibility checks.
	 * If All checks pass, inits the plugin.
	 *
	 * Fired by `plugins_loaded` action hook.
	 *
	 * @since 2.1.6
	 *
	 * @access public
	 */
	public function on_plugins_loaded() {
		add_action( 'elementor/init', array( $this, 'init' ) );
	}

	/**
	 * Initialize the plugin
	 *
	 * Load the plugin only after Elementor (and other plugins) are loaded.
	 * Load the files required to run the plugin.
	 *
	 * Fired by `plugins_loaded` action hook.
	 *
	 * @since 2.1.6
	 *
	 * @access public
	 */
	public function init() {
		// Add Plugin actions.
		add_action( 'elementor/widgets/register', array( $this, 'init_widgets' ) );
	}

	/**
	 * Init Widgets
	 *
	 * Include widgets files and register them
	 *
	 * @since 2.1.6
	 *
	 * @access public
	 */
	public function init_widgets() {
		// Register Shortcode widget.
		require_once SP_EA_PATH . 'admin/ElementAddons/Sp_Easy_Accordion_Shortcode_Widget.php';
		\Elementor\Plugin::instance()->widgets_manager->register( new Sp_Easy_Accordion_Shortcode_Widget() );

		$dashboard_settings = get_option( 'sp_eap_dashboard_settings', array() );
		$integrations       = $dashboard_settings['integrations'] ?? array();

		/**
		 * WPBakery Page Builder Integration.
		 */
		$elementor_integration = $integrations['elementor']['is_active'] ?? false;

		if ( $elementor_integration ) {
			// Register Saved Template widget.
			require_once SP_EA_PATH . 'admin/ElementAddons/SP_Eap_Saved_Template_Widget.php';
			\Elementor\Plugin::instance()->widgets_manager->register( new SP_Eap_Saved_Template_Widget() );
		}
	}
}

Easy_Accordion_Free_Element_Shortcode_Addons::instance();
