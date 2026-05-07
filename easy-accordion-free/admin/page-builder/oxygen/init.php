<?php

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * Load Easy Accordion Oxygen Builder integration.
 *
 * @return void
 */
function eap_oxygen_builder_init() {
	// Check if Oxygen Builder is active.
	if ( defined( 'CT_VERSION' ) || class_exists( 'Oxygen_VSB_Divi_Block' ) ) {
		// Check if integration is enabled in dashboard settings.
		$dashboard_settings = get_option( 'sp_eap_dashboard_settings', array() );
		$oxygen_enabled     = isset( $dashboard_settings['integrations']['oxygen']['is_active'] ) && true === $dashboard_settings['integrations']['oxygen']['is_active'];

		if ( $oxygen_enabled ) {
			// Load the integration file.
			require_once SP_EA_PATH . 'admin/page-builder/oxygen/oxygen.php';
		}
	}
}
add_action( 'init', 'eap_oxygen_builder_init', 11 );
