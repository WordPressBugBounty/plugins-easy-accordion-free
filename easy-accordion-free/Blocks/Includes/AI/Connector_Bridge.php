<?php
/**
 * WordPress Connectors bridge.
 *
 * Reads WordPress 7.0+ Connectors (Settings → Connectors) so an AI provider the
 * site owner already configured there is reused instead of asking for the same
 * API key a second time in Easy Accordion → Settings → AI Configuration.
 *
 * @since      3.2.0
 * @package    Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/Blocks/Includes/AI
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes\AI;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * Connector_Bridge Class.
 *
 * Everything here degrades to "no connector" on a WordPress without the
 * Connectors API, so the plugin's own key storage stays the working path there.
 *
 * Two levels of detection, kept apart on purpose:
 *
 * - `has_credential()` is free — it only asks whether a credential exists in an
 *   environment variable, a constant or the option core registered for the
 *   connector. Safe on any request.
 * - `is_connected()` is authoritative but costs an HTTP round trip, because
 *   core answers it by asking the provider. It is cached in a transient, and
 *   never runs unless `has_credential()` already passed.
 *
 * @since 3.2.0
 */
class Connector_Bridge {

	/**
	 * Plugin provider slug => core connector id.
	 *
	 * Gemini differs: core names Google's connector after the company, this
	 * plugin after the model family. Groq maps to '' — core ships no Groq
	 * connector, so it always uses the key stored in plugin settings.
	 */
	const PROVIDER_CONNECTORS = array(
		'gemini'    => 'google',
		'openai'    => 'openai',
		'anthropic' => 'anthropic',
		'groq'      => '',
	);

	/**
	 * No Connectors API on this WordPress, or the site switched AI off.
	 */
	const STATUS_UNSUPPORTED = 'unsupported';

	/**
	 * Connectors exist, but none is registered for this provider.
	 */
	const STATUS_UNAVAILABLE = 'unavailable';

	/**
	 * A connector is registered, but holds no usable credential.
	 */
	const STATUS_DISCONNECTED = 'disconnected';

	/**
	 * The provider is configured through Connectors and ready to use.
	 */
	const STATUS_CONNECTED = 'connected';

	/**
	 * Transient prefix for the cached connection probe.
	 */
	const STATUS_TRANSIENT_PREFIX = 'sp_eab_ai_connector_status_';

	/**
	 * How long a connection probe is trusted. Short enough that a key revoked
	 * in Connectors shows up quickly, long enough that reopening the editor does
	 * not probe every time.
	 */
	const STATUS_TTL = 15 * MINUTE_IN_SECONDS;

	/**
	 * Option name prefix core gives AI connector keys by default. Only the
	 * fallback — a connector may register any `setting_name`.
	 */
	const OPTION_PREFIX = 'connectors_ai_';

	/**
	 * Keep the cached connector state honest.
	 *
	 * Without these, connecting a provider in Settings → Connectors would take
	 * up to STATUS_TTL to show up here, and deactivating the provider plugin
	 * would leave the FAQ generator offering a provider it can no longer
	 * reach.
	 *
	 * @return void
	 */
	public static function init() {
		add_action( 'added_option', array( __CLASS__, 'maybe_flush_for_option' ) );
		add_action( 'updated_option', array( __CLASS__, 'maybe_flush_for_option' ) );
		add_action( 'deleted_option', array( __CLASS__, 'maybe_flush_for_option' ) );
		add_action( 'activated_plugin', array( __CLASS__, 'flush_all' ) );
		add_action( 'deactivated_plugin', array( __CLASS__, 'flush_all' ) );
	}

	/**
	 * Clear the cache when a connector credential option changes.
	 *
	 * @param string $option Option name that changed.
	 * @return void
	 */
	public static function maybe_flush_for_option( $option ) {
		if ( ! is_string( $option ) || '' === $option ) {
			return;
		}

		if ( 0 === strpos( $option, self::OPTION_PREFIX ) || in_array( $option, self::credential_option_names(), true ) ) {
			self::flush_cache();
		}
	}

	/**
	 * Clear the cache for every provider, ignoring any hook arguments.
	 *
	 * @return void
	 */
	public static function flush_all() {
		self::flush_cache();
	}

	/**
	 * Whether the site allows AI features at all.
	 *
	 * `WP_AI_SUPPORT` / the `wp_supports_ai` filter switch AI off for the whole
	 * site, and that answer covers this plugin's own HTTP path too. Older
	 * WordPress has no such switch, so everything is allowed there.
	 *
	 * @return bool
	 */
	public static function site_allows_ai() {
		if ( ! function_exists( 'wp_supports_ai' ) ) {
			return true;
		}

		return (bool) wp_supports_ai();
	}

	/**
	 * Whether this WordPress can serve credentials through Connectors.
	 *
	 * @return bool
	 */
	public static function is_supported() {
		return function_exists( 'wp_get_connector' ) && function_exists( 'wp_ai_client_prompt' ) && self::site_allows_ai();
	}

	/**
	 * Core connector id for a plugin provider slug.
	 *
	 * @param string $provider Plugin provider slug.
	 * @return string Connector id, or '' when core has none.
	 */
	public static function connector_id( $provider ) {
		return isset( self::PROVIDER_CONNECTORS[ $provider ] ) ? self::PROVIDER_CONNECTORS[ $provider ] : '';
	}

	/**
	 * The registered connector definition for a provider.
	 *
	 * @param string $provider Plugin provider slug.
	 * @return array|null `wp_get_connector()` data, or null.
	 */
	public static function get_connector( $provider ) {
		if ( ! self::is_supported() ) {
			return null;
		}

		$connector_id = self::connector_id( $provider );
		if ( '' === $connector_id ) {
			return null;
		}

		$connector = wp_get_connector( $connector_id );
		if ( ! is_array( $connector ) || 'ai_provider' !== ( $connector['type'] ?? '' ) ) {
			return null;
		}

		return $connector;
	}

	/**
	 * Whether core registers a connector for this provider.
	 *
	 * @param string $provider Plugin provider slug.
	 * @return bool
	 */
	public static function is_registered( $provider ) {
		return null !== self::get_connector( $provider );
	}

	/**
	 * Whether a credential exists for the provider's connector, without asking
	 * the provider whether it works.
	 *
	 * Same resolution order as core — environment variable, PHP constant, then
	 * the registered option — reading only the public connector definition.
	 *
	 * @param string $provider Plugin provider slug.
	 * @return bool
	 */
	public static function has_credential( $provider ) {
		$connector = self::get_connector( $provider );
		if ( null === $connector ) {
			return false;
		}

		$auth = isset( $connector['authentication'] ) ? (array) $connector['authentication'] : array();
		if ( 'api_key' !== ( $auth['method'] ?? '' ) ) {
			return false;
		}

		$env_var_name = (string) ( $auth['env_var_name'] ?? '' );
		if ( '' !== $env_var_name ) {
			$env_value = getenv( $env_var_name );
			if ( false !== $env_value && '' !== $env_value ) {
				return true;
			}
		}

		$constant_name = (string) ( $auth['constant_name'] ?? '' );
		if ( '' !== $constant_name && defined( $constant_name ) ) {
			$constant_value = constant( $constant_name );
			if ( is_string( $constant_value ) && '' !== $constant_value ) {
				return true;
			}
		}

		$setting_name = (string) ( $auth['setting_name'] ?? '' );

		return '' !== $setting_name && '' !== (string) get_option( $setting_name, '' );
	}

	/**
	 * Whether the provider is registered, credentialed and actually reachable.
	 *
	 * Core's Anthropic / Google / OpenAI connectors are metadata that point at
	 * separate provider plugins — a stored key is still unusable while that
	 * plugin is missing. Only the AI client registry knows, so that is asked,
	 * behind a transient.
	 *
	 * `$allow_probe` false answers from the credential alone on a cold cache, so
	 * building the editor's localized data or the dashboard never makes an
	 * outbound call. Being wrong that way costs a clear error at generation time.
	 *
	 * @param string $provider    Plugin provider slug.
	 * @param bool   $allow_probe Whether a cold cache may cost an HTTP request.
	 * @return bool
	 */
	public static function is_connected( $provider, $allow_probe = true ) {
		if ( ! self::has_credential( $provider ) ) {
			return false;
		}

		$connector_id = self::connector_id( $provider );
		$cached       = get_transient( self::STATUS_TRANSIENT_PREFIX . $connector_id );
		if ( false !== $cached ) {
			return 'yes' === $cached;
		}

		if ( ! $allow_probe ) {
			return true;
		}

		$connected = self::probe_provider( $connector_id );
		set_transient( self::STATUS_TRANSIENT_PREFIX . $connector_id, $connected ? 'yes' : 'no', self::STATUS_TTL );

		return $connected;
	}

	/**
	 * Resolve a provider's connector state.
	 *
	 * @param string $provider    Plugin provider slug.
	 * @param bool   $allow_probe Whether a cold cache may cost an HTTP request.
	 * @return string One of the STATUS_* constants.
	 */
	public static function get_status( $provider, $allow_probe = true ) {
		if ( ! self::is_supported() ) {
			return self::STATUS_UNSUPPORTED;
		}

		if ( ! self::is_registered( $provider ) ) {
			return self::STATUS_UNAVAILABLE;
		}

		return self::is_connected( $provider, $allow_probe ) ? self::STATUS_CONNECTED : self::STATUS_DISCONNECTED;
	}

	/**
	 * Connector state for each provider, in a shape the dashboard reads as-is.
	 *
	 * `connected` means "usable as far as this request can tell"; `verified`
	 * says whether a probe actually confirmed it.
	 *
	 * @param string[] $providers   Provider slugs.
	 * @param bool     $allow_probe Whether a cold cache may cost an HTTP request.
	 * @return array<string, array{status: string, name: string, registered: bool, connected: bool, verified: bool, credentialsUrl: string}>
	 */
	public static function get_public_statuses( array $providers, $allow_probe = true ) {
		$statuses = array();

		foreach ( $providers as $provider ) {
			$connector = self::get_connector( $provider );
			$status    = self::get_status( $provider, $allow_probe );
			$connected = self::STATUS_CONNECTED === $status;

			$statuses[ $provider ] = array(
				'status'         => $status,
				'name'           => null !== $connector ? (string) $connector['name'] : '',
				'registered'     => null !== $connector,
				'connected'      => $connected,
				'verified'       => $connected && self::has_probe_result( $provider ),
				'credentialsUrl' => null !== $connector ? (string) ( $connector['authentication']['credentials_url'] ?? '' ) : '',
			);
		}

		return $statuses;
	}

	/**
	 * URL of the core Connectors screen.
	 *
	 * @return string Admin URL, or '' when the screen does not exist.
	 */
	public static function settings_url() {
		if ( ! function_exists( 'wp_get_connector' ) ) {
			return '';
		}

		return admin_url( 'options-connectors.php' );
	}

	/**
	 * Drop cached probe results.
	 *
	 * @param string $provider Provider slug, or '' for every provider.
	 * @return void
	 */
	public static function flush_cache( $provider = '' ) {
		$providers = '' !== $provider ? array( $provider ) : array_keys( self::PROVIDER_CONNECTORS );

		foreach ( $providers as $slug ) {
			$connector_id = self::connector_id( $slug );
			if ( '' !== $connector_id ) {
				delete_transient( self::STATUS_TRANSIENT_PREFIX . $connector_id );
			}
		}
	}

	/**
	 * Ask the AI client registry whether a provider is ready.
	 *
	 * @param string $connector_id Core connector id.
	 * @return bool
	 */
	private static function probe_provider( $connector_id ) {
		if ( ! class_exists( '\WordPress\AiClient\AiClient' ) ) {
			return false;
		}

		try {
			$registry = \WordPress\AiClient\AiClient::defaultRegistry();
			return $registry->hasProvider( $connector_id ) && $registry->isProviderConfigured( $connector_id );
		} catch ( \Exception $e ) {
			return false;
		}
	}

	/**
	 * Whether a probe has actually run for this provider.
	 *
	 * @param string $provider Plugin provider slug.
	 * @return bool
	 */
	private static function has_probe_result( $provider ) {
		$connector_id = self::connector_id( $provider );
		return '' !== $connector_id && false !== get_transient( self::STATUS_TRANSIENT_PREFIX . $connector_id );
	}

	/**
	 * Option names the mapped connectors store their keys in.
	 *
	 * @return string[]
	 */
	private static function credential_option_names() {
		$names = array();

		foreach ( array_keys( self::PROVIDER_CONNECTORS ) as $provider ) {
			$connector = self::get_connector( $provider );
			$setting   = null !== $connector ? (string) ( $connector['authentication']['setting_name'] ?? '' ) : '';
			if ( '' !== $setting ) {
				$names[] = $setting;
			}
		}

		return $names;
	}
}
