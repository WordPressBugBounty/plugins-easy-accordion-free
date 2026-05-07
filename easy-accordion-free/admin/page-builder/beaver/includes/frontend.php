<?php
/**
 * Beaver Builder - Easy Accordion Module Frontend Template
 *
 * This file is automatically loaded by Beaver Builder when
 * rendering the module output on the frontend.
 *
 * The $module, $id, and $settings variables are available
 * automatically by Beaver Builder's rendering engine.
 *
 * @package Easy_Accordion_Free
 *
 * @var EAP_Beaver_Accordion_Module $module   The module instance.
 * @var string                       $id       The module's unique node ID.
 * @var object                       $settings The module's saved settings.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Cannot access directly.
}

// Get the selected template ID from module settings.
$template_id = isset( $settings->template_id ) ? (int) $settings->template_id : 0;

// Show a placeholder if no template has been selected.
if ( empty( $template_id ) ) : ?>
	<div style="
		text-align: center;
		padding: 20px;
		border: 2px dashed #ccc;
		color: #999;
		font-size: 14px;
	">
		<?php esc_html_e( 'Please Select a Saved Template', 'easy-accordion-free' ); ?>
	</div>
<?php else : ?>
	<?php
	// Generate dynamic CSS for this template if in builder.
	if ( FLBuilderModel::is_builder_active() ) {
		echo eap_beaver_get_template_dynamic_css( $template_id ); // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS output is already escaped in the function.
	}
	?>
	<div class="eap-beaver-accordion-wrapper" data-builderTemplateId="<?php echo esc_attr( $template_id ); ?>">
		<?php
		// Execute the Easy Accordion shortcode and output the result.
		echo do_shortcode( '[sp_eap_template id="' . absint( $template_id ) . '"]' );
		?>
	</div>
	<?php
endif;

/**
 * Generate dynamic CSS for template in Beaver builder.
 *
 * This method uses the same CSS generation logic as the saved templates shortcode.
 * In Beaver builder, CSS is returned directly for immediate loading.
 *
 * @since 4.2.0
 *
 * @param int $template_id Template post ID.
 *
 * @return string
 */
function eap_beaver_get_template_dynamic_css( $template_id ) {
	// Prevent duplicate CSS generation for the same template in current request.
	static $generated_templates = array();
	if ( isset( $generated_templates[ $template_id ] ) ) {
		return '';
	}

	// Check if Block_Dynamic_Style class exists.
	if ( ! class_exists( '\ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\Block_Dynamic_Style' ) ) {
		return '';
	}

	// Get template post.
	$template_post = get_post( $template_id );
	if ( ! $template_post ) {
		return '';
	}

	$content = $template_post->post_content;
	if ( empty( $content ) ) {
		return '';
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
	if ( ! eap_beaver_template_has_our_blocks( $blocks, $block_style ) ) {
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
		$dynamic_assets = $block_style->generate_post_css_file( $template_id, $template_post );
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

/**
 * Check if template contains our blocks.
 *
 * @since 4.2.0
 *
 * @param array  $blocks      Parsed blocks.
 * @param object $block_style Block_Dynamic_Style instance.
 *
 * @return bool
 */
function eap_beaver_template_has_our_blocks( $blocks, $block_style ) {
	foreach ( $blocks as $block ) {
		if ( ! empty( $block['blockName'] ) && in_array( $block['blockName'], $block_style->our_blocks, true ) ) {
			return true;
		}

		if ( ! empty( $block['innerBlocks'] ) && eap_beaver_template_has_our_blocks( $block['innerBlocks'], $block_style ) ) {
			return true;
		}
	}

	return false;
}

