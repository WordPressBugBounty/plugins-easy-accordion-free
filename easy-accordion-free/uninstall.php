<?php
/**
 * Uninstall.php for cleaning plugin database.
 *
 * Trigger the file when plugin is deleted.
 *
 * @since 1.0.0
 * @package   easy-accordion-free
 * @subpackage easy-accordion-free/includes
 */

defined( 'WP_UNINSTALL_PLUGIN' ) || exit;

// Load LCP file.
require_once 'plugin-main.php';

$settings = get_option( 'sp_eap_settings', array() );
if ( ! empty( $settings['eap_data_remove'] ) && '1' === $settings['eap_data_remove'] ) {
	// Delete Accordions and shortcodes.
	$accordions = get_posts(
		array(
			'post_type'      => array( 'sp_easy_accordion', 'sp_accordion_faqs' ),
			'posts_per_page' => -1,
			'fields'         => 'ids',
		)
	);

	if ( ! empty( $accordions ) ) {
		foreach ( $accordions as $accordion_id ) {
			wp_delete_post( $accordion_id, true );
		}
	}

	// Remove option.
	delete_option( 'sp_eap_flush_rewrite_rules' );
	delete_option( 'sp_eap_settings' );
	delete_option( 'sp_eafree_review_notice_dismiss' );
	delete_option( '_transient_timeout_sp-eap-framework-transient' );
	delete_option( '_transient_sp-eap-framework-transient' );
	delete_option( '_transient_timeout_eapro-metabox-transient' );
	delete_option( '_transient_eapro-metabox-transient' );
	delete_transient( 'spea_plugins' );
	delete_transient( 'spea_plugins_data' );
	// Delete setup wizard visited option.
	delete_option( 'visited_setup_wizard' );
	delete_site_option( 'visited_setup_wizard' );

	// Delete dashboard settings (incl. stored AI provider API keys) and placements report.
	delete_option( 'sp_eap_dashboard_settings' );
	delete_option( 'sp_eap_placements_report' );
	delete_option( 'sp_eap_widgets_modified' );

	// Delete AI transients.
	foreach ( array( 'google', 'openai', 'anthropic' ) as $connector ) {
		delete_transient( 'sp_eab_ai_connector_status_' . $connector );
	}
	global $wpdb;
	// phpcs:ignore WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching
	$wpdb->query(
		$wpdb->prepare(
			"DELETE FROM {$wpdb->options} WHERE option_name LIKE %s OR option_name LIKE %s",
			$wpdb->esc_like( '_transient_sp_eab_ai_src_' ) . '%',
			$wpdb->esc_like( '_transient_timeout_sp_eab_ai_src_' ) . '%'
		)
	);

	// Remove options in Multisite.
	delete_site_option( 'sp_eap_settings' );
	delete_site_option( 'sp_eafree_review_notice_dismiss' );
	delete_site_option( '_transient_timeout_spf-eap-framework-transient' );
	delete_site_option( '_transient_spf-eap-framework-transient' );
	delete_site_option( '_transient_timeout_eapro-metabox-transient' );
	delete_site_option( '_transient_eapro-metabox-transient' );

	// Delete offer banner related option keys.
	delete_option( 'shapedplugin_offer_banner_dismissed_black_friday_2025' );
	delete_option( 'shapedplugin_offer_banner_dismissed_new_year_2026' );
	delete_option( 'shapedplugin_bfcm_2026_dismissed' );
} else {
	update_option( 'sp_eap_flush_rewrite_rules', false );
}
