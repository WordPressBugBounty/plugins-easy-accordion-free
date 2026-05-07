<?php
/**
 * Saved Easy Accordion Ready Patterns.
 *
 * @link http://shapedplugin.com
 * @since 3.1.0
 *
 * @package Easy_Accordion_Free.
 * @subpackage Easy_Accordion_Free/Admin.
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes;

use ShapedPlugin\EasyAccordion\Blocks\Includes\EAP_File_System;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * EAP_Ready_Patterns
 */
class EAP_Ready_Patterns {

	/**
	 * This plugin's ready patterns instance.
	 *
	 * @var Blocks
	 */
	private static $instance;

	/**
	 * Filesystem helper.
	 *
	 * @var EAP_File_System
	 */
	private $file_system;

	/**
	 * Constructor.
	 */
	public function __construct() {
		$this->file_system = new EAP_File_System();
	}

	/**
	 * Method instance
	 *
	 * @return object|string patterns instance.
	 */
	public static function instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}
		return self::$instance;
	}

	/**
	 * Init function.
	 *
	 * Registers REST routes for the premade design library.
	 *
	 * @return void
	 */
	public function init() {
		add_action( 'rest_api_init', array( $this, 'register_rest_route' ) );
	}

	/**
	 * Register REST route for getting and refreshing the premade pattern library.
	 *
	 * @return void
	 */
	public function register_rest_route() {
		register_rest_route(
			'eap-accordion/v2',
			'/get_premade_patterns/',
			array(
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'eap_get_premade_patterns_callback' ),
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
				),
			)
		);
		register_rest_route(
			'eap-accordion/v2',
			'/save_wishlist_item',
			array(
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'eap_save_wishlist_item' ),
					'permission_callback' => function () {
						return current_user_can( 'edit_others_posts' );
					},
					'args'                => array(),
				),
			)
		);
	}

	/**
	 * Handle saving and retrieving the premade wishlist.
	 *
	 * @param WP_REST_Request $request REST request object.
	 * @return WP_REST_Response
	 */
	public function eap_save_wishlist_item( $request ) {
		$params       = $request->get_params();
		$id           = isset( $params['id'] ) ? $this->sanitize_params( $params['id'] ) : '';
		$action       = isset( $params['action'] ) ? $this->sanitize_params( $params['action'] ) : '';
		$request_type = isset( $params['type'] ) ? $this->sanitize_params( $params['type'] ) : '';
		$wishlist     = get_option( 'easy_accordion_premade_wishlist', array() );

		// Process add/remove only when ID is provided and not a fetch request.
		if ( $id && 'fetchData' !== $request_type ) {
			if ( 'remove' === $action ) {
				$index = array_search( $id, $wishlist, true );
				if ( false !== $index ) {
					unset( $wishlist[ $index ] );
				}
				$message = __( 'Item has been removed from wishlist.', 'easy-accordion-free' );
			} else {
				if ( ! in_array( $id, $wishlist, true ) ) {
					$wishlist[] = $id;
				}
				$message = __( 'Item added to wishlist.', 'easy-accordion-free' );
			}

			update_option( 'easy_accordion_premade_wishlist', array_values( $wishlist ) );
		} else {
			$message = __( 'Wishlist fetched successfully.', 'easy-accordion-free' );
		}

		return rest_ensure_response(
			array(
				'success'     => true,
				'message'     => $message,
				'wishListArr' => $wishlist, // No need for wp_json_encode(), REST API does this automatically.
			)
		);
	}

	/**
	 * Sanitize REST API parameters recursively.
	 *
	 * @param mixed $params Parameters to sanitize.
	 * @return mixed Sanitized parameters.
	 */
	public function sanitize_params( $params ) {
		if ( is_array( $params ) ) {
			return array_map( array( $this, 'sanitize_params' ), $params );
		} elseif ( is_bool( $params ) ) {
			return rest_sanitize_boolean( $params );
		} elseif ( is_object( $params ) ) {
			return $params;
		}
		return sanitize_text_field( $params );
	}

	/**
	 * Callback for REST API endpoint to fetch or refresh premade pattern data.
	 *
	 * @param \WP_REST_Request $request REST request.
	 * @return array Response data.
	 */
	public function eap_get_premade_patterns_callback( $request ) {
		try {
			$params = $this->sanitize_params( $request->get_params() );
			$type   = isset( $params['type'] ) ? $params['type'] : '';

			$file_path = $this->get_local_file_path();

			// If type is 'refresh' — force fetch new data.
			if ( 'refresh' === $type ) {
				return $this->fetch_and_cache_patterns( true );
			}

			// Auto refresh if file older than 3 days.
			if ( file_exists( $file_path ) && ( time() - filemtime( $file_path ) >= 3 * DAY_IN_SECONDS ) ) {
				$this->fetch_and_cache_patterns( true );
			} elseif ( ! file_exists( $file_path ) ) {
				$this->fetch_and_cache_patterns( true );
			}

			// If cached file exists, return it.
			if ( file_exists( $file_path ) ) {
				return array(
					'success' => true,
					'data'    => $this->get_file_contents( $file_path ),
				);
			}

			// Otherwise fetch and return.
			return $this->fetch_and_cache_patterns( true );

		} catch ( \Exception $e ) {
			return array(
				'success' => false,
				'message' => $e->getMessage(),
			);
		}
	}

	/**
	 * Fetch the latest pattern library from remote and store it locally.
	 *
	 * @param bool $force Whether to overwrite existing file.
	 * @return array Response data.
	 */
	private function fetch_and_cache_patterns( $force = false ) {
		$file_path = $this->get_local_file_path();

		if ( file_exists( $file_path ) && ! $force ) {
			return array(
				'success' => true,
				'data'    => $this->get_file_contents( $file_path ),
				'cached'  => true,
			);
		}

		$response = wp_remote_get(
			'https://demo.easyaccordion.io/wp-json/easy-accordion/v1/pattern-list/',
			array( 'timeout' => 150 )
		);

		if ( is_wp_error( $response ) ) {
			return array(
				'success' => false,
				'message' => __( 'Failed to fetch remote data.', 'easy-accordion-free' ),
			);
		}

		$body = wp_remote_retrieve_body( $response );

		if ( empty( $body ) ) {
			return array(
				'success' => false,
				'message' => __( 'Empty response from remote server.', 'easy-accordion-free' ),
			);
		}

		$this->file_system->safe_filesystem_put_contents( $file_path, $body );

		return array(
			'success' => true,
			'data'    => json_decode( $body, true ),
			'cached'  => false,
			'message' => __( 'Data fetched successfully!', 'easy-accordion-free' ),
		);
	}

	/**
	 * Get the full local file path for the cached JSON.
	 *
	 * @return string File path.
	 */
	private function get_local_file_path() {
		$upload_dir = wp_upload_dir();
		$dir        = trailingslashit( $upload_dir['basedir'] ) . 'easy-accordion/';
		wp_mkdir_p( $dir );

		return $dir . 'premade-patterns.json';
	}

	/**
	 * Read the contents of a file using WP_Filesystem.
	 *
	 * @param string $path File path.
	 * @return string File contents.
	 */
	private function get_file_contents( $path ) {
		if ( ! $this->file_system->safe_filesystem_exists( $path ) ) {
			return '';
		}

		return $this->file_system->safe_filesystem_get_contents( $path );
	}
}
