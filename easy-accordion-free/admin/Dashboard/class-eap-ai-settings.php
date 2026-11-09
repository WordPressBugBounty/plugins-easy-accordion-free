<?php
/**
 * Dashboard side of Settings → AI Configuration.
 *
 * AI provider keys live under `integrations.<slug>.api_key` in the dashboard
 * settings option and never reach the browser unmasked: every dashboard
 * payload goes through mask_settings(), and every save through
 * resolve_settings(), which turns an echoed-back mask into the stored key.
 * Also registers `/ai-verify`, the save-time key check. Masking lives here
 * only — the AI layer and the stored option never see a mask.
 *
 * @package    Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/Admin
 * @author     ShapedPlugin <support@shapedplugin.com>
 */

use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Helper;
use ShapedPlugin\EasyAccordion\Blocks\Includes\AI\AI;
use ShapedPlugin\EasyAccordion\Blocks\Includes\AI\Connector_Bridge;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'EAP_AI_Settings' ) ) {

	/**
	 * AI key masking and the `/ai-verify` route.
	 */
	class EAP_AI_Settings {

		/**
		 * REST namespace.
		 */
		const NAMESPACE = 'easy-accordion/v2';

		/**
		 * Character a masked key is padded with. No provider key contains it,
		 * so a submitted value carrying it is a mask the dashboard echoed back.
		 */
		const KEY_MASK_CHAR = '*';

		/**
		 * Constructor.
		 */
		public function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		}

		/**
		 * Register the `/ai-verify` route.
		 *
		 * @return void
		 */
		public function register_routes() {
			register_rest_route(
				self::NAMESPACE,
				'/ai-verify',
				array(
					'methods'             => 'POST',
					'callback'            => array( $this, 'verify_ai_credentials' ),
					'permission_callback' => array( $this, 'check_permission' ),
					'args'                => array(
						'provider'     => array(
							'type'              => 'string',
							'required'          => true,
							'enum'              => array_keys( AI::PROVIDERS ),
							'sanitize_callback' => 'sanitize_key',
							'validate_callback' => 'rest_validate_request_arg',
						),
						'api_key'      => array(
							'type'              => 'string',
							'required'          => true,
							'sanitize_callback' => 'sanitize_text_field',
						),
						'model'        => array(
							'type'              => 'string',
							'default'           => '',
							'sanitize_callback' => 'sanitize_text_field',
						),
						'workspace_id' => array(
							'type'              => 'string',
							'default'           => '',
							'sanitize_callback' => 'sanitize_text_field',
						),
					),
				)
			);
		}

		/**
		 * Permission callback: the dashboard capability.
		 *
		 * @return bool
		 */
		public function check_permission() {
			return current_user_can( apply_filters( 'easy_accordion_access_capability', 'manage_options' ) );
		}

		/**
		 * REST: verify unsaved AI provider credentials with one tiny request.
		 *
		 * @param WP_REST_Request $request Request.
		 * @return WP_REST_Response|WP_Error
		 */
		public function verify_ai_credentials( $request ) {
			$result = AI::verify_credentials(
				$request['provider'],
				array(
					// A masked key means "the stored one": only the workspace changed.
					'api_key'      => self::resolve_submitted_key( $request['provider'], $request['api_key'] ),
					'model'        => $request['model'],
					'workspace_id' => $request['workspace_id'],
				)
			);

			if ( is_wp_error( $result ) ) {
				return $result;
			}

			return new WP_REST_Response( array( 'valid' => true ), 200 );
		}

		/**
		 * Dashboard settings with every AI key masked.
		 *
		 * @param mixed $settings Dashboard settings.
		 * @return mixed
		 */
		public static function mask_settings( $settings ) {
			return self::map_ai_keys(
				$settings,
				function ( $api_key ) {
					return self::mask_api_key( $api_key );
				}
			);
		}

		/**
		 * Submitted dashboard settings with every echoed-back mask turned into
		 * the stored key.
		 *
		 * @param mixed $settings Submitted dashboard settings.
		 * @return mixed
		 */
		public static function resolve_settings( $settings ) {
			return self::map_ai_keys(
				$settings,
				function ( $api_key, $slug ) {
					return self::resolve_submitted_key( $slug, $api_key );
				}
			);
		}

		/**
		 * Read-only AI data the AI Configuration tab needs. Credential presence
		 * only, so opening the dashboard never calls a provider.
		 *
		 * @return array{aiConnectors: array, aiProviderOrder: string[], connectorsUrl: string}
		 */
		public static function dashboard_info() {
			return array(
				'aiConnectors'    => Connector_Bridge::get_public_statuses( array_keys( AI::PROVIDERS ), false ),
				// Registry order, which picks the Primary when none is stored.
				'aiProviderOrder' => array_keys( AI::PROVIDERS ),
				'connectorsUrl'   => Connector_Bridge::settings_url(),
			);
		}

		/**
		 * Obscure a key: up to six characters at each end around a fixed run of
		 * 24 mask characters, so the mask never tells the key's length. Each
		 * end shows at most a quarter of the key; one of 8 characters or fewer
		 * is masked entirely.
		 *
		 * @param string $api_key Raw key.
		 * @return string Empty string when there is no key.
		 */
		private static function mask_api_key( $api_key ) {
			$api_key = trim( (string) $api_key );
			$length  = mb_strlen( $api_key );

			if ( 0 === $length ) {
				return '';
			}

			if ( $length <= 8 ) {
				return str_repeat( self::KEY_MASK_CHAR, $length );
			}

			$visible = min( 6, intdiv( $length, 4 ) );

			return mb_substr( $api_key, 0, $visible ) . str_repeat( self::KEY_MASK_CHAR, 24 ) . mb_substr( $api_key, -$visible );
		}

		/**
		 * The key a dashboard request means: a value carrying the mask
		 * character is the mask echoed back and stands for the stored key;
		 * anything else is a key the user typed, and an empty value clears it.
		 *
		 * @param string $provider  Provider slug.
		 * @param string $submitted Key as the dashboard sent it.
		 * @return string Raw key.
		 */
		private static function resolve_submitted_key( $provider, $submitted ) {
			// Same cleaning `/ai-verify`'s schema applies, so the key saved is the key that was verified.
			$submitted = sanitize_text_field( (string) $submitted );

			if ( false === strpos( $submitted, self::KEY_MASK_CHAR ) ) {
				return $submitted;
			}

			$integrations = (array) Blocks_Helper::get_dashboard_settings( 'integrations', array() );
			$stored       = $integrations[ $provider ]['api_key'] ?? '';

			return is_string( $stored ) ? trim( $stored ) : '';
		}

		/**
		 * Run a callback over integrations.<slug>.api_key for every AI provider.
		 *
		 * @param mixed    $settings Dashboard settings.
		 * @param callable $callback Receives ( $api_key, $slug ), returns the replacement.
		 * @return mixed
		 */
		private static function map_ai_keys( $settings, $callback ) {
			if ( ! is_array( $settings ) || ! isset( $settings['integrations'] ) || ! is_array( $settings['integrations'] ) ) {
				return $settings;
			}

			foreach ( array_keys( AI::PROVIDERS ) as $slug ) {
				if ( ! isset( $settings['integrations'][ $slug ] ) || ! is_array( $settings['integrations'][ $slug ] ) ) {
					continue;
				}

				if ( ! array_key_exists( 'api_key', $settings['integrations'][ $slug ] ) ) {
					continue;
				}

				$api_key = $settings['integrations'][ $slug ]['api_key'];

				$settings['integrations'][ $slug ]['api_key'] = is_string( $api_key ) ? call_user_func( $callback, $api_key, $slug ) : '';
			}

			return $settings;
		}
	}
}
