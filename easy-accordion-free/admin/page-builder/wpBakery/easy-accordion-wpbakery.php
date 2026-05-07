<?php
/**
 * WPBakery Page Builder - Easy Accordion Element
 *
 * @package Easy_Accordion_Free
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Cannot access directly.
}

/**
 * Register the Easy Accordion element with WPBakery.
 *
 * This function maps a new shortcode element in WPBakery
 * with a Select field to choose an Easy Accordion template.
 */
function eap_wpbakery_register_element() {
	// Check if WPBakery Page Builder is active.
	if ( ! defined( 'WPB_VC_VERSION' ) ) {
		return;
	}

	// Check if WPBakery integration is enabled in dashboard settings.
	$dashboard_settings = get_option( 'sp_eap_dashboard_settings', array() );
	$wpbakery_enabled   = isset( $dashboard_settings['integrations']['wpbakery']['is_active'] ) && true === $dashboard_settings['integrations']['wpbakery']['is_active'];

	if ( ! $wpbakery_enabled ) {
		return;
	}

	vc_map(
		array(
			// ── Basic Info ────────────────────────────────────────────────
			'name'        => __( 'Saved Templates', 'easy-accordion-free' ),
			'base'        => 'eap_wpbakery_shortcode',
			'description' => __( 'Display an Easy Accordion saved templates.', 'easy-accordion-free' ),
			'category'    => __( 'Easy Accordion', 'easy-accordion-free' ),
			'icon'        => 'eab-icon-logo-wpBakery',

			// ── Fields (Params) ───────────────────────────────────────────
			'params'      => array(
				// Select field to choose a template.
				array(
					'type'        => 'dropdown',
					'heading'     => __( 'Saved Templates', 'easy-accordion-free' ),
					'param_name'  => 'template_id',
					'value'       => eap_wpbakery_get_template_list(),
					'std'         => 'none',
					'description' => __( 'Please Select a Saved Template', 'easy-accordion-free' ),
					'save_always' => true,
				),

			),
		)
	);
}

// Register the element after WPBakery has fully loaded.
add_action( 'vc_before_init', 'eap_wpbakery_register_element' );

/**
 * Retrieve all published Easy Accordion Templates for the dropdown.
 *
 * WPBakery dropdown options format: array( 'Label' => 'value' )
 *
 * @return array
 */
/**
 * Retrieve all published Easy Accordion Templates.
 *
 * @return array Template list.
 */
function eap_wpbakery_get_template_list() {
	$list  = array( 'none' => esc_html__( 'Select Template', 'easy-accordion-free' ) );
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

		// Sort by ID descending so the latest template appears first.
		krsort( $list );

	}

	// WPBakery format: label => ID (flip from Helper's ID => label).
	$template_list = array();
	foreach ( $list as $id => $title ) {
		$template_list[ $title ] = $id;
	}
	return $template_list;
}

/**
 * Shortcode handler for [eap_wpbakery_shortcode].
 *
 * This function is called when WPBakery renders the element
 * on the frontend. It executes the Easy Accordion shortcode
 * with the selected template ID.
 *
 * @param array  $atts    Shortcode attributes.
 * @param string $content Inner content (not used).
 * @return string HTML output.
 */
function eap_wpbakery_render_element( $atts, $content = null ) {

	// Extract and sanitize shortcode attributes.
	$atts = shortcode_atts(
		array(
			'template_id' => '',
		),
		$atts,
		'eap_wpbakery_shortcode'
	);

	$template_id = (int) $atts['template_id'];

	// Show a placeholder if no template has been selected.
	if ( empty( $template_id ) ) {
		return '<div style="
			text-align: center;
			padding: 20px;
			border: 2px dashed #ccc;
			color: #999;
			font-size: 14px;
		">
			Please select a Saved Template
		</div>';
	}

	// Execute the shortcode and return the rendered output.
	$output = do_shortcode( '[sp_eap_template id="' . $template_id . '"]' );

	return '<div class="sp-easy-accordion-builder-wrap" data-builderTemplateId="' . esc_attr( $template_id ) . '">' . $output . '</div>';
}

// Register the shortcode handler for the WPBakery element.
add_shortcode( 'eap_wpbakery_shortcode', 'eap_wpbakery_render_element' );

// Enqueue scripts for WPBakery in both frontend and admin.
add_action( 'wp_enqueue_scripts', 'eap_wpbakery_enqueue_scripts' );
add_action( 'admin_enqueue_scripts', 'eap_wpbakery_enqueue_scripts' );

/**
 * Enqueue scripts for WPBakery frontend editor.
 *
 * Registers and enqueues JavaScript files for the WPBakery builder functionality.
 * Only loads in WPBakery editor (backend or frontend editor mode), not on regular frontend.
 *
 * @since 4.0.0
 * @return void
 */
function eap_wpbakery_enqueue_scripts() {
	// Only load in WPBakery editor (backend admin or frontend editor mode), not on regular frontend.
	if ( ! defined( 'WPB_VC_VERSION' ) ) {
		return;
	}

	$scripts = array(
		'sp_easy_blocks_builder_js' => 'blocks/assets/js/builder-scripts.js',
	);

	foreach ( $scripts as $handle => $path ) {
		wp_enqueue_script(
			$handle,
			SP_EA_URL . $path,
			array( 'jquery' ),
			SP_EA_VERSION,
			true
		);
	}

	// Add inline script to reinitialize after WPBakery frontend editor updates.
	wp_add_inline_script(
		'sp_easy_blocks_builder_js',
		'jQuery(document).ready(function($) {
			// Re-initialize scripts when WPBakery updates content
			function reinitEasyBlocksScripts() {
				if (typeof window.sp_accordion_init === "function") {
					window.sp_accordion_init();
				}
			}

			// Listen for various WPBakery events
			$(document).on("vc_js_reload", reinitEasyBlocksScripts);
			$(document).on("vc_frontend_default_editor_loaded", reinitEasyBlocksScripts);
			$(document).on("vc_frontend_render", reinitEasyBlocksScripts);

			// Also observe DOM changes as fallback - watch for .sp-easy-accordion-builder-wrap
			var observer = new MutationObserver(function(mutations) {
				mutations.forEach(function(mutation) {
					if (mutation.addedNodes.length) {
						for (var i = 0; i < mutation.addedNodes.length; i++) {
							var node = mutation.addedNodes[i];
							if (node.nodeType === 1) {
								if ($(node).hasClass("sp-easy-accordion-builder-wrap") || $(node).find(".sp-easy-accordion-builder-wrap").length) {
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
