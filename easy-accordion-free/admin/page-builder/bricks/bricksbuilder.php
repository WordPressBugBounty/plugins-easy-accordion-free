<?php
/**
 * Bricks Builder - Easy Accordion Element
 *
 * @package Easy_Accordion_Free
 */

use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Helper;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Easy Accordion Bricks Builder Element.
 */
class EAP_Bricks_Accordion_Element extends \Bricks\Element {

	/**
	 * Element properties.
	 *
	 * @var string
	 */
	public $category = 'basic';

	/**
	 * Element name.
	 *
	 * @var string
	 */
	public $name = 'eap-bricks-accordion';

	/**
	 * Element icon.
	 *
	 * @var string
	 */
	public $icon = 'ti-layout-accordion-separated';

	/**
	 * CSS selector.
	 *
	 * @var string
	 */
	public $css_selector = '.eap-bricks-accordion-wrapper';

	/**
	 * Get element label.
	 *
	 * @return string
	 */
	public function get_label() {
		return esc_html__( 'Saved Templates', 'easy-accordion-free' );
	}

	/**
	 * Enqueue scripts for Bricks builder.
	 *
	 * @return void
	 */
	public function enqueue_scripts() {
		// Only load in Bricks builder editor.
		if ( ! $this->is_bricks_builder() ) {
			return;
		}

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

		// Add inline script for Bricks builder change events.
		wp_add_inline_script(
			'sp_easy_blocks_builder_js',
			'jQuery(document).ready(function($) {
				// Re-initialize scripts when Bricks builder updates elements
				function reinitEasyBlocksScripts() {
					if (typeof window.sp_accordion_init === "function") {
						window.sp_accordion_init();
					}
				}

				// Listen for Bricks elements ready event
				$(document).on("bricksElementsReady", function() {
					reinitEasyBlocksScripts();
				});

				// Listen for Bricks setup frontend event
				$(document).on("bricks/setup_frontend", function() {
					reinitEasyBlocksScripts();
				});

				// Listen for page render events
				$(document).on("bricks/pages/render", function() {
					reinitEasyBlocksScripts();
				});

				// Listen for element after render event
				$(document).on("bricks/element/after_render", function() {
					reinitEasyBlocksScripts();
				});

				// Listen for Bricks AJAX render
				$(document).on("bricksAjaxRender", function() {
					reinitEasyBlocksScripts();
				});

				// Also observe DOM changes as fallback - watch for .eap-bricks-accordion-wrapper
				var observer = new MutationObserver(function(mutations) {
					mutations.forEach(function(mutation) {
						if (mutation.addedNodes.length) {
							for (var i = 0; i < mutation.addedNodes.length; i++) {
								var node = mutation.addedNodes[i];
								if (node.nodeType === 1) {
									if ($(node).hasClass("eap-bricks-accordion-wrapper") || $(node).find(".eap-bricks-accordion-wrapper").length) {
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
	 * Set controls for the element.
	 *
	 * @return void
	 */
	public function set_controls() {
		$this->controls['template_id'] = array(
			'type'        => 'select',
			'label'       => esc_html__( 'Saved Templates', 'easy-accordion-free' ),
			'options'     => Blocks_Helper::get_save_template_list(),
			'clearable'   => false,
			'default'     => '',
			'pasteStyles' => true,
			'inline'      => true,
		);

		$this->controls['separator'] = array(
			'type' => 'separator',
		);

		$this->controls['help'] = array(
			'type'    => 'info',
			'content' => 'Please Select a Saved Template',
		);
	}

	/**
	 * Check if currently rendering in Bricks Builder.
	 *
	 * @return bool
	 */
	private function is_bricks_builder() {
		// Check if Bricks builder is active via URL parameter or function.
		if ( isset( $_GET['bricks'] ) ) {
			return true;
		}

		// Check if Bricks builder functions exist.
		if ( function_exists( 'bricks_is_builder_main' ) && bricks_is_builder_main() ) {
			return true;
		}

		if ( function_exists( 'bricks_is_builder_call' ) && bricks_is_builder_call() ) {
			return true;
		}

		return false;
	}

	/**
	 * Render the element output on the frontend.
	 *
	 * Called by Bricks Builder when rendering the element
	 * on the page — both in the editor and on the frontend.
	 *
	 * @return void
	 */
	public function render() {

		// Get the selected template ID from element settings.
		$template_id = isset( $this->settings['template_id'] ) ? (int) $this->settings['template_id'] : 0;

		// Show a placeholder if no template has been selected.
		if ( empty( $template_id ) ) {
			echo '<div style="
				text-align: center;
				padding: 20px;
				border: 2px dashed #ccc;
				color: #999;
				font-size: 14px;
			">' . esc_html__( 'Please Select a Saved Template', 'easy-accordion-free' ) . '</div>';
			return;
		}

		// Get template post.
		$template_post = get_post( $template_id );
		if ( ! $template_post || 'publish' !== $template_post->post_status ) {
			echo '<div style="
				text-align: center;
				padding: 20px;
				border: 2px dashed #ccc;
				color: #999;
				font-size: 14px;
			">' . esc_html__( 'Saved template not found or not published.', 'easy-accordion-free' ) . '</div>';
			return;
		}

		$content = $template_post->post_content;
		if ( empty( $content ) ) {
			echo '<div style="
				text-align: center;
				padding: 20px;
				border: 2px dashed #ccc;
				color: #999;
				font-size: 14px;
			">' . esc_html__( 'Saved template content is empty.', 'easy-accordion-free' ) . '</div>';
			return;
		}

		$output = '';

		// Generate dynamic CSS for this template if in builder.
		if ( $this->is_bricks_builder() ) {
			$output .= $this->enqueue_template_dynamic_css( $template_id, $content );
		}

		// Execute the Easy Accordion shortcode.
		$shortcode_output = do_shortcode( '[sp_eap_template id="' . absint( $template_id ) . '"]' );

		// Output the wrapping element tag (Bricks handles root attributes).
		echo '<div ' . $this->render_attributes( '_root' ) . '>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Attributes are properly escaped in render_attributes method.
		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS output is already escaped in the function.
		// Output the shortcode content.
		echo '<div class="eap-bricks-accordion-wrapper" data-builder-template-id="' . esc_attr( $template_id ) . '">';
		echo $shortcode_output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Shortcode output may contain HTML and is expected to be rendered as-is.
		echo '</div>';

		echo '</div>';
	}

	/**
	 * Check if template contains our blocks.
	 *
	 * @since 4.2.0
	 * @access private
	 *
	 * @param array  $blocks      Parsed blocks.
	 * @param object $block_style Block_Dynamic_Style instance.
	 *
	 * @return bool
	 */
	private function template_has_our_blocks( $blocks, $block_style ) {
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
	 * Generate dynamic CSS for template in Bricks builder.
	 *
	 * This method uses the same CSS generation logic as the saved templates shortcode.
	 * In Bricks builder, CSS is returned directly for immediate loading.
	 *
	 * @since 4.2.0
	 * @access private
	 *
	 * @param int    $template_id Template post ID.
	 * @param string $content     Template content.
	 *
	 * @return string
	 */
	private function enqueue_template_dynamic_css( $template_id, $content = '' ) {
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
					$output .= '<style id="sp-eab-css-' . esc_attr( $template_id ) . '">' . $inline_style . '</style>';
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
}
