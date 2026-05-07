<?php
/**
 * Blocks Helper File.
 *
 * @since 4.0.0
 * @version 1.0.0
 *
 * @package EasyAccordion/Blocks
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * The help class for the Easy Accordion Pro Blocks.
 */
class Blocks_Helper {
	/**
	 * Method eab_get_active_block_list.
	 *
	 * @return array
	 */
	public static function sp_eab_get_active_block_list() {
		$blocks_visibility = (array) get_option( 'sp_easy_accordion_visibility_settings', array() );
		$active_block_list = array();
		foreach ( $blocks_visibility as $block ) {
			if ( $block['show'] ) {
				$active_block_list[] = $block['name'];
			}
		}
		return $active_block_list;
	}

	/**
	 * Custom set transient
	 *
	 * @param  mixed $cache_key Key.
	 * @param  mixed $cache_data data.
	 * @param  mixed $expiration data.
	 * @return void
	 */
	public static function set_transient( $cache_key, $cache_data, $expiration = 0 ) {
		if ( ! is_admin() ) {
			if ( is_multisite() ) {
				set_site_transient( $cache_key, $cache_data, $expiration );
			} else {
				set_transient( $cache_key, $cache_data, $expiration );
			}
		}
	}

	/**
	 * Custom get transient.
	 *
	 * @param  mixed $cache_key Cache key.
	 * @return content
	 */
	public static function get_transient( $cache_key ) {
		if ( is_admin() ) {
			return false;
		}
		if ( is_multisite() ) {
			$cached_data = get_site_transient( $cache_key );
		} else {
			$cached_data = get_transient( $cache_key );
		}
		return $cached_data;
	}

	/**
	 * Method sp_eab_strip_script_tags.
	 *
	 * @param string $content is block content.
	 *
	 * suggested by Baizid Ahmed for remove script tags from content.
	 * @return string
	 */
	public static function sp_eab_strip_script_tags( $content ) {
		if ( apply_filters( 'sp_eab_strip_script_tags', true ) ) {
			// Remove <script>...</script>.
			$content = preg_replace( '#<script\b[^>]*>(.*?)</script>#is', '', $content );
			// Remove unclosed <script> tags.
			$content = preg_replace( '#<script\b[^>]*/?>#is', '', $content );
			// 3. Remove orphan / unclosed closing </script> tags.
			$content = preg_replace( '#</script\s*>#is', '', $content );
		}
		return $content;
	}

	/**
	 * Rander Eab_schema
	 *
	 * @param  mixed $post_id selected block id.
	 * @param  mixed $schema_items_data schema data.
	 * @return void
	 */
	public static function eab_schema( $post_id, $schema_items_data ) {
		$eap_schema_markup = true;
		$accordion_type    = 'eab-block';
		include SP_EA_PATH . '/public/partials/schema-markup.php';
	}

	/**
	 * Shortcode list.
	 *
	 * @return array
	 */
	public static function sp_easy_accordion_pro_post_list() {
		$shortcodes = get_posts(
			array(
				'post_type'      => 'sp_easy_accordion',
				'post_status'    => 'publish',
				'posts_per_page' => 999,
			)
		);

		if ( count( $shortcodes ) < 1 ) {
			return array();
		}
		// shortcode list.
		$shortcode_list = array();
		foreach ( $shortcodes as $shortcode ) {
			$option           = array(
				'id'    => absint( $shortcode->ID ),
				'value' => absint( $shortcode->ID ),
				'label' => esc_html( $shortcode->post_title ),
			);
			$shortcode_list[] = $option;
		}
		return $shortcode_list;
	}

	/**
	 * Verifies the current user has the required capability for admin AJAX actions.
	 * Sends a 403 JSON error and halts execution if the check fails.
	 */
	public static function sp_eap_verify_capability() {
		if ( ! current_user_can( apply_filters( 'easy_accordion_access_capability', 'manage_options' ) ) ) {
			wp_send_json_error( __( 'Unauthorized access.', 'easy-accordion-free' ), 403 );
		}
	}

	/**
	 * Get saved template list for page builders.
	 *
	 * @return array Template list with ID as key and title as value.
	 */
	public static function get_save_template_list() {
		$templates = get_posts(
			array(
				'post_type'      => 'sp_eap_template',
				'post_status'    => 'publish',
				'posts_per_page' => 9999,
				'orderby'        => 'title',
				'order'          => 'ASC',
			)
		);

		$template_list = array(
			'' => esc_html__( 'Select Template', 'easy-accordion-free' ),
		);
		if ( ! empty( $templates ) ) {
			foreach ( $templates as $template ) {
				$template_list[ $template->ID ] = $template->post_title;
			}
		}

		return $template_list;
	}
}
