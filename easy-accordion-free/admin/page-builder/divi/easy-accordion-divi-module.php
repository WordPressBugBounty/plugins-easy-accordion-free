<?php
/**
 * Divi Builder - Easy Accordion Module
 *
 * @package Easy_Accordion_Free
 */

use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Helper;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Cannot access directly.
}

/**
 * Register Easy Accordion module with Divi Builder.
 *
 * @return void
 */
function eap_template_divi_modules() {

	// Check if Divi Builder is active.
	if ( ! class_exists( 'ET_Builder_Module' ) ) {
		return;
	}

	// Check if integration is enabled in dashboard settings.
	$dashboard_settings = get_option( 'sp_eap_dashboard_settings', array() );
	$divi_enabled       = isset( $dashboard_settings['integrations']['divi']['is_active'] ) && true === $dashboard_settings['integrations']['divi']['is_active'];

	if ( ! $divi_enabled ) {
		return;
	}

	/**
	 * Divi Module class
	 */
	class EAP_Template_Divi_Module extends ET_Builder_Module {

		/**
		 * Module slug.
		 *
		 * @var string
		 */
		public $slug = 'eap_template';

		/**
		 * Visual Builder support.
		 *
		 * @var string
		 */
		public $vb_support = 'partial';

		/**
		 * Initialize the module.
		 *
		 * @return void
		 */
		public function init() {
			$this->name      = esc_html__( 'Saved Templates', 'easy-accordion-free' );
			$this->icon_path = plugin_dir_path( __FILE__ ) . 'icon.svg';

			// Enqueue scripts for page builder.
			add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_page_builder_scripts' ) );
			add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_page_builder_scripts' ) );
		}

		/**
		 * Get fields.
		 *
		 * @return array
		 */
		public function get_fields() {
			// Get template list.
			$template_list = $this->eap_get_template_list();

			return array(
				'template_id' => array(
					'label'           => esc_html__( 'Saved Templates', 'easy-accordion-free' ),
					'type'            => 'select',
					'option_category' => 'basic_option',
					'options'         => $template_list,
					'default'         => 'none',
					'description'     => esc_html__( 'Please Select a Saved Template', 'easy-accordion-free' ),
					'toggle_slug'     => 'main_content',
				),
			);
		}

		/**
		 * Render shortcode output.
		 *
		 * @param  array  $attrs       Unprocessed module attributes.
		 * @param  string $content     Content.
		 * @param  string $render_slug Slug of module.
		 * @return string
		 */
		public function render( $attrs, $content = null, $render_slug = '' ) {
			// Get template ID.
			$template_id = $this->props['template_id'];

			// Show placeholder if no template selected.
			if ( 'none' === $template_id ) {
				return '<div style="
					text-align: center;
					padding: 20px;
					border: 2px dashed #ccc;
					color: #999;
					font-size: 14px;
				">
					' . esc_html__( 'Please Select a Saved Template', 'easy-accordion-free' ) . '
				</div>';
			}

			// Get template post.
			$template_post = get_post( $template_id );
			if ( ! $template_post || 'publish' !== $template_post->post_status ) {
				return '<div style="
				text-align: center;
				padding: 20px;
				border: 2px dashed #ccc;
				color: #999;
				font-size: 14px;
			">
				' . esc_html__( 'Saved template not found or not published.', 'easy-accordion-free' ) . '
			</div>';
			}

			$content = $template_post->post_content;
			if ( empty( $content ) ) {
				return '<div style="
				text-align: center;
				padding: 20px;
				border: 2px dashed #ccc;
				color: #999;
				font-size: 14px;
			">
				' . esc_html__( 'Saved template content is empty.', 'easy-accordion-free' ) . '
			</div>';
			}

			// Generate dynamic CSS for this template.
			$output = $this->enqueue_template_dynamic_css( $template_id, $content );

			// Render the shortcode.
			$output .= do_shortcode( '[sp_eap_template id="' . absint( $template_id ) . '"]' );

			// Wrap output with builder-specific class and reinitialize after Divi AJAX renders.
			return '<div class="eap-divi-accordion-wrapper" data-builder-template-id="' . esc_attr( $template_id ) . '">' .
				$output .
			'</div>';
		}

		/**
		 * Check if template contains our blocks.
		 *
		 * @since 4.1.0
		 * @access protected
		 *
		 * @param array  $blocks      Parsed blocks.
		 * @param object $block_style Block_Dynamic_Style instance.
		 *
		 * @return bool
		 */
		protected function template_has_our_blocks( $blocks, $block_style ) {
			foreach ( $blocks as $block ) {
				if ( ! empty( $block['blockName'] ) && in_array( $block['blockName'], $block_style->our_blocks, true ) ) {
					return true;
				}

				if ( ! empty( $block['innerBlocks'] ) && $this->template_has_our_blocks( $block['innerBlocks'], $block_style ) ) {
					return true;
				}
			}

			return false;
		}

		/**
		 * Generate dynamic CSS for template in Divi builder.
		 *
		 * This method uses the same CSS generation logic as the saved templates shortcode.
		 * In Divi builder, CSS is returned directly for immediate loading after AJAX render.
		 *
		 * @since 4.1.0
		 * @access protected
		 *
		 * @param int    $template_id Template post ID.
		 * @param string $content     Template content.
		 *
		 * @return string
		 */
		protected function enqueue_template_dynamic_css( $template_id, $content = '' ) {
			// Prevent duplicate CSS generation for the same template in current request.
			static $generated_templates = array();
			if ( isset( $generated_templates[ $template_id ] ) ) {
				return '';
			}

			// Check if Block_Dynamic_Style class exists.
			if ( ! class_exists( '\ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\Block_Dynamic_Style' ) ) {
				return '';
			}

			// Get template content if not provided.
			if ( empty( $content ) ) {
				$template_post = get_post( $template_id );
				if ( ! $template_post ) {
					return '';
				}
				$content = $template_post->post_content;
			}

			// Parse blocks from template content.
			if ( ! has_blocks( $content ) ) {
				return '';
			}

			$blocks = parse_blocks( $content );
			if ( empty( $blocks ) ) {
				return '';
			}

			// Get Block_Dynamic_Style instance.
			$block_style = \ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\Block_Dynamic_Style::instance();

			// Check if this template has our blocks.
			if ( ! $this->template_has_our_blocks( $blocks, $block_style ) ) {
				return '';
			}

			// Mark this template as processed.
			$generated_templates[ $template_id ] = true;

			$output = '';

			// Check if CSS file already exists.
			if ( $block_style->css_file_exists( $template_id ) ) {
				$sp_rand = get_post_meta( $template_id, '_sp_eab_unique_version', true );
				$sp_rand = ! empty( $sp_rand ) ? $sp_rand : SP_EA_VERSION;
				$output .= '<link rel="stylesheet" id="sp-eab-css-' . esc_attr( $template_id ) . '" href="' . esc_url( $block_style->css_url . 'sp-eab-style-' . $template_id . '.css?ver=' . $sp_rand ) . '" media="all">'; // phpcs:ignore

				$font_lists = get_post_meta( $template_id, 'sp_eab_dynamic_fonts', true );
			} else {
				// Generate CSS file for this template.
				$dynamic_assets = $block_style->generate_post_css_file( $template_id, get_post( $template_id ) );
				if ( false !== $dynamic_assets && is_array( $dynamic_assets ) ) {
					$font_lists   = $dynamic_assets[1] ?? array();
					$inline_style = $dynamic_assets[0] ?? '';

					if ( ! empty( $inline_style ) ) {
						$output .= '<style id="sp-eab-css-' . esc_attr( $template_id ) . '">' . str_replace( '</style', '<\/style', $inline_style ) . '</style>';
					}

					$unique_id = wp_rand( 1000, 9999 );
					update_post_meta( $template_id, '_sp_eab_unique_version', $unique_id );
				} else {
					$font_lists = array();
				}
			}

			// Enqueue Google Fonts.
			if ( ! empty( $font_lists ) && is_array( $font_lists ) ) {
				$font_lists = array_unique( $font_lists );

				$output .= '<link rel="stylesheet" id="sp-eab-template-google-fonts-' . esc_attr( $template_id ) . '" href="' . esc_url( add_query_arg( 'family', implode( '|', $font_lists ), 'https://fonts.googleapis.com/css' ) ) . '" media="all">'; // phpcs:ignore
			}

			return $output;
		}

		/**
		 * Enqueue page builder scripts.
		 *
		 * @return void
		 */
		public function enqueue_page_builder_scripts() {
			// Only load in Divi builder editor, not the regular frontend.
			if ( ! eap_template_divi_is_builder_editor() ) {
				return;
			}

			// Define blocks URL if not already defined.
			if ( ! defined( 'SP_EAP_BLOCKS_URL' ) ) {
				define( 'SP_EAP_BLOCKS_URL', SP_EA_URL . 'Blocks/' );
			}

			eap_template_divi_enqueue_builder_assets();

			// Add inline script for Divi builder change events.
			wp_add_inline_script(
				'sp_easy_blocks_builder_js',
				'jQuery(document).ready(function($) {
					// Re-initialize scripts when Divi builder updates elements
					function reinitEasyBlocksScripts() {
						if (typeof window.sp_accordion_init === "function") {
							window.sp_accordion_init();
						}
					}

					// Listen for Divi Visual Builder events
					$(document).on("divi:module:updated", function(e, moduleId) {
						reinitEasyBlocksScripts();
					});

					// Listen for Divi AJAX render events
					$(document).on("divi:ajax:render:success", function() {
						reinitEasyBlocksScripts();
					});

					// Listen for Divi builder save events
					$(document).on("divi:builder:save", function() {
						reinitEasyBlocksScripts();
					});

					// Also observe DOM changes as fallback - watch for .eap-divi-accordion-wrapper
					var observer = new MutationObserver(function(mutations) {
						mutations.forEach(function(mutation) {
							if (mutation.addedNodes.length) {
								for (var i = 0; i < mutation.addedNodes.length; i++) {
									var node = mutation.addedNodes[i];
									if (node.nodeType === 1) {
										if ($(node).hasClass("eap-divi-accordion-wrapper") || $(node).find(".eap-divi-accordion-wrapper").length) {
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
		 * Check if currently in Divi builder editor.
		 *
		 * @return bool
		 */
		private function is_divi_builder_editor() {
			return eap_template_divi_is_builder_editor();
		}
		/**
		 * Retrieve all published Easy Accordion Templates.
		 *
		 * @return array Template list.
		 */
		private function eap_get_template_list() {
			$list = array(
				'none' => esc_html__( 'Select Template', 'easy-accordion-free' ),
			);

			$query = new \WP_Query(
				// phpcs:ignore WordPress.WP.PostsPerPage.posts_per_page_posts_per_page -- High limit needed for template selection
				array(
					'post_type'      => 'sp_eap_template',
					'post_status'    => 'publish',
					'posts_per_page' => 10000,
				)
			);

			if ( $query->have_posts() ) {
				foreach ( $query->posts as $post ) {
					$list[ $post->ID ] = $post->post_title;
				}
			}

			return $list;
		}
	}

	new EAP_Template_Divi_Module();
}
add_action( 'et_builder_ready', 'eap_template_divi_modules' );

/**
 * Check if the current request is for Divi Builder or Visual Builder.
 *
 * @return bool
 */
function eap_template_divi_is_builder_editor() {
	if ( wp_doing_ajax() && isset( $_REQUEST['action'] ) && 0 === strpos( sanitize_key( wp_unslash( $_REQUEST['action'] ) ), 'et_' ) ) {
		return true;
	}

	if ( isset( $_GET['et_fb'] ) || isset( $_GET['et_bfb'] ) || isset( $_GET['et_pb_preview'] ) ) {
		return true;
	}

	if ( isset( $GLOBALS['et_fb'] ) && $GLOBALS['et_fb'] ) {
		return true;
	}

	if ( function_exists( 'et_builder_is_loaded' ) && et_builder_is_loaded() ) {
		return true;
	}

	if ( function_exists( 'et_core_is_fb_enabled' ) && et_core_is_fb_enabled() ) {
		return true;
	}

	return false;
}

/**
 * Register and enqueue block frontend assets needed by saved templates in Divi.
 *
 * @return void
 */
function eap_template_divi_enqueue_builder_assets() {
	// Define blocks URL if not already defined.
	if ( ! defined( 'SP_EAP_BLOCKS_URL' ) ) {
		define( 'SP_EAP_BLOCKS_URL', SP_EA_URL . 'Blocks/' );
	}

	// Register scripts first if not already registered.
	if ( ! wp_script_is( 'sp_easy_blocks_builder_js', 'registered' ) ) {
		wp_register_script( 'sp_easy_blocks_builder_js', SP_EA_URL . 'blocks/assets/js/builder-scripts.js', array(), SP_EA_VERSION, true );
	}

	// Now enqueue in correct order.
	wp_enqueue_script( 'sp_easy_blocks_builder_js' );
}
