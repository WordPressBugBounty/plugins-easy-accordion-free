<?php
defined( 'ABSPATH' ) || exit;

/**
 * Register Easy Accordion element with Bricks Builder.
 *
 * @return void
 */
function eap_bricks_builder_register() {
	// Check if Bricks Builder is active.
	if ( defined( 'BRICKS_VERSION' ) ) {
		// Register the element.
		\Bricks\Elements::register_element( SP_EA_PATH . 'admin/page-builder/bricks/bricksbuilder.php' );
	}
}
add_action( 'init', 'eap_bricks_builder_register', 11 );
