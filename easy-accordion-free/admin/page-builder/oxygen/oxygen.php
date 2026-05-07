<?php
/**
 * Oxygen Builder - Easy Accordion Element
 *
 * @package Easy_Accordion_Free
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Easy Accordion Oxygen Builder Element.
 */
class EasyAccordionOxygenElement extends OxyEl {

	/**
	 * Element name.
	 *
	 * @return string
	 */
	public function name() {
		return __( 'Saved Templates', 'easy-accordion-free' );
	}

	/**
	 * Element slug.
	 *
	 * @return string
	 */
	public function slug() {
		return 'easy-accordion-templates';
	}

	/**
	 * Element icon.
	 *
	 * @return string
	 */
	public function icon() {
		return SP_EA_URL . 'admin/page-builder/oxygen/icon.svg';
	}

	/**
	 * Button priority.
	 *
	 * @return int
	 */
	public function button_priority() {
		return 9;
	}

	/**
	 * Element tag.
	 *
	 * @return string
	 */
	public function tag() {
		return 'div';
	}

	/**
	 * Enable full CSS.
	 *
	 * @return bool
	 */
	public function enableFullCSS() {
		return true;
	}

	/**
	 * After init hook.
	 *
	 * @return void
	 */
	public function afterInit() {
		// Enqueue scripts for page builder.
		add_action( 'wp_enqueue_scripts', array( $this, 'enqueue_page_builder_scripts' ) );
	}

	/**
	 * Enqueue scripts and styles for Oxygen builder.
	 *
	 * @return void
	 */
	public function enqueue_page_builder_scripts() {
		// Only load in Oxygen builder editor.
		if ( ! $this->is_oxygen_builder_editor() ) {
			return;
		}

		// Define blocks URL if not already defined.
		if ( ! defined( 'SP_EAP_BLOCKS_URL' ) ) {
			define( 'SP_EAP_BLOCKS_URL', SP_EA_URL . 'Blocks/' );
		}

		// Enqueue builder scripts for initialization.
		wp_enqueue_script(
			'sp_easy_blocks_builder_js',
			SP_EA_URL . 'blocks/assets/js/builder-scripts.js',
			array( 'jquery' ),
			SP_EA_VERSION,
			true
		);

		// Add inline script to reinitialize after builder updates.
		wp_add_inline_script(
			'sp_easy_blocks_builder_js',
			'jQuery(document).ready(function($) {
				// Re-initialize when Oxygen builder updates elements
				$(document).on("oxygen-ajax-element-loaded", function() {
					if (typeof window.sp_accordion_init === "function") {
						window.sp_accordion_init();
					}
				});
			});'
		);
	}

	/**
	 * Check if currently in Oxygen builder editor.
	 *
	 * @return bool
	 */
	private function is_oxygen_builder_editor() {
		// Check if Oxygen builder is active via function.
		if ( function_exists( 'ct_get_current_screen' ) && ct_get_current_screen() === 'oxy_settings_iframe' ) {
			return true;
		}

		// Check for Oxygen builder via URL parameter.
		if ( isset( $_GET['oxygen_iframe'] ) ) {
			return true;
		}

		// Check if we're in an Oxygen AJAX request.
		if ( isset( $_GET['action'] ) && strpos( sanitize_key( $_GET['action'] ), 'oxy_render_oxy' ) !== false ) {
			return true;
		}

		return false;
	}

	/**
	 * Render element output.
	 *
	 * @param array  $options    Element options.
	 * @param array  $defaults   Default values.
	 * @param string $content   Inner content.
	 * @return statement
	 */
	public function render( $options, $defaults, $content ) {
		$template_id = $options['template_id'] ?? '';

		$is_ajax_render = isset( $_GET['action'] ) && strpos( sanitize_key( $_GET['action'] ), 'oxy_render_oxy' ) !== false;

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

		if ( $template_id ) {
			// Enqueue block assets for template rendering.
			if ( $is_ajax_render ) {
				$this->enqueue_template_assets( $template_id, $content );
				// Render the shortcode.
				echo '<div class="eap-oxygen-accordion-wrapper" data-builder-template-id="' . esc_attr( $template_id ) . '">';
			}

			echo do_shortcode( '[sp_eap_template id="' . absint( $template_id ) . '"]' );

			if ( $is_ajax_render ) {
				echo '</div>';
			}
		} elseif ( isset( $_GET['action'] ) && strpos( sanitize_key( $_GET['action'] ), 'oxy_render_oxy' ) !== false ) {
			// Show placeholder if no template selected.
			echo '<div style="
				text-align: center;
				padding: 20px;
				border: 2px dashed #ccc;
				color: #999;
				font-size: 14px;
			">
				' . esc_html__( 'Please Select a Saved Template', 'easy-accordion-free' ) . '
			</div>';
		}
	}

	/**
	 * Enqueue template assets for rendering.
	 *
	 * @param int  $template_id    Template ID.
	 * @param bool $content Whether this is an AJAX render.
	 * @return statement
	 */
	private function enqueue_template_assets( $template_id, $content = '' ) {
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

		echo $output; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- Output is already escaped where it's generated.
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
	 * Element controls.
	 *
	 * @return void
	 */
	public function controls() {
		// Get template list.
		$template_list = $this->eap_get_template_list();

		$this->addOptionControl(
			array(
				'type'    => 'dropdown',
				'name'    => esc_html__( 'Saved Templates', 'easy-accordion-free' ),
				'slug'    => 'template_id',
				'default' => '',
			)
		)->setValue( $template_list )->rebuildElementOnChange();
	}

	/**
	 * Retrieve all published Easy Accordion Templates.
	 *
	 * @return array Template list.
	 */
	private function eap_get_template_list() {
		$list = array(
			'' => esc_html__( 'Select Template', 'easy-accordion-free' ),
		);

		$query = new \WP_Query(
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

// Register the element.
new EasyAccordionOxygenElement();
