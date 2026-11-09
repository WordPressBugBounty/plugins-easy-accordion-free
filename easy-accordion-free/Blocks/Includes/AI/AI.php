<?php
/**
 * AI provider layer.
 *
 * The single place an AI provider is configured, prompted and called: the
 * provider registry, credentials, provider order, transport and one universal
 * failure shape, plus a private request_<slug>() / parse_<slug>() pair per
 * provider. The FAQ generator (FAQ_Generator) goes through complete_json() and
 * never calls a provider itself.
 *
 * A provider is reached one of two ways, and callers never see which:
 * - through WordPress Connectors (Settings → Connectors, WP 7.0+) when the site
 *   owner configured the provider there — the key never passes through here
 *   (request_connector(), via the WP AI Client);
 * - otherwise through the key stored under integrations.<slug> in the
 *   dashboard settings (server-side only), over plain HTTP.
 *
 * Add a provider: add an entry to PROVIDERS, a `case` in api_request(), a
 * private request_<slug>() + parse_<slug>() pair, and a
 * Connector_Bridge::PROVIDER_CONNECTORS entry ('' when core ships no connector).
 *
 * @since      3.2.0
 * @package    Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/Blocks/Includes/AI
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes\AI;

use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Helper;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * AI Class.
 *
 * @since 3.2.0
 */
class AI {

	/**
	 * Supported providers, in registry order.
	 *
	 * A request tries the provider it names first, then the Primary picked on
	 * Settings → AI Configuration, then the rest in this array's order
	 * (provider_order()). Each default model must agree with AI_DEFAULT_MODELS
	 * in src/controls/aiProviders.js and the dashboard defaults.
	 *
	 * @var array<string, array{label: string, default_model: string}>
	 */
	const PROVIDERS = array(
		'gemini'    => array(
			'label'         => 'Google Gemini',
			'default_model' => 'gemini-3.1-flash-lite-preview',
		),
		'openai'    => array(
			'label'         => 'OpenAI',
			'default_model' => 'gpt-5.6-luna',
		),
		'anthropic' => array(
			'label'         => 'Anthropic Claude',
			'default_model' => 'claude-haiku-4-5',
		),
		'groq'      => array(
			'label'         => 'Groq',
			'default_model' => 'openai/gpt-oss-120b',
		),
	);

	/**
	 * Dashboard setting holding the Primary provider's slug.
	 *
	 * @var string
	 */
	const PRIMARY_SETTING = 'ai_primary_provider';

	/**
	 * The last failure, normalized, or null when the last run succeeded.
	 *
	 * @var array{provider: string, label: string, model: string, code: string, message: string}|null
	 */
	private static $last_error = null;

	/**
	 * The last failure, in the universal shape, or null after a success.
	 *
	 * @return array{provider: string, label: string, model: string, code: string, message: string}|null
	 */
	public static function last_error() {
		return self::$last_error;
	}

	/**
	 * Record a failure in the universal shape and log it.
	 *
	 * @param string $provider Provider slug ('' when none resolved).
	 * @param string $model    Model slug ('' when none resolved).
	 * @param string $code     Machine-readable failure code.
	 * @param string $message  Human-readable message, as the provider phrased it where there is one.
	 * @return void
	 */
	private static function fail( $provider, $model, $code, $message ) {
		$label = isset( self::PROVIDERS[ $provider ] ) ? self::PROVIDERS[ $provider ]['label'] : '';

		self::$last_error = array(
			'provider' => (string) $provider,
			'label'    => $label,
			'model'    => (string) $model,
			'code'     => (string) $code,
			'message'  => (string) $message,
		);

		self::log_error( $provider, $model, new \WP_Error( $code, $message ) );
	}

	/**
	 * One display sentence for a recorded failure.
	 *
	 * Plain text, never markup — whoever renders it owns the element and the
	 * escaping.
	 *
	 * @param array|null $error A `last_error()` array, or null for the last one.
	 * @return string Formatted message, or '' when there is no error.
	 */
	public static function format_error( $error = null ) {
		$error = ( null === $error ) ? self::$last_error : $error;
		if ( empty( $error ) || ! is_array( $error ) ) {
			return '';
		}

		$message = isset( $error['message'] ) ? (string) $error['message'] : '';
		$label   = isset( $error['label'] ) ? (string) $error['label'] : '';
		$model   = isset( $error['model'] ) ? (string) $error['model'] : '';

		if ( '' === $label ) {
			return $message;
		}

		if ( '' === $model ) {
			return sprintf(
				/* translators: 1: AI provider label, 2: error message from the provider. */
				__( '%1$s: %2$s', 'easy-accordion-free' ),
				$label,
				$message
			);
		}

		return sprintf(
			/* translators: 1: AI provider label, 2: model slug, 3: error message from the provider. */
			__( '%1$s (%2$s): %3$s', 'easy-accordion-free' ),
			$label,
			$model,
			$message
		);
	}

	/**
	 * Why a recorded failure happened, as one key a caller can phrase.
	 *
	 * Providers word the same failure differently and carry no shared code, so
	 * the message is matched: `limit` (quota, rate limit, credits, overload),
	 * `incomplete` (a reply with no usable JSON), `timeout`, `auth` (the key or
	 * its permissions were refused) or `error` for anything else.
	 *
	 * @param array|null $error A `last_error()` array, or null for the last one.
	 * @return string Reason key, or '' when there is no error.
	 */
	public static function failure_reason( $error = null ) {
		$error = ( null === $error ) ? self::$last_error : $error;
		if ( empty( $error ) || ! is_array( $error ) ) {
			return '';
		}

		$code    = isset( $error['code'] ) ? (string) $error['code'] : '';
		$message = isset( $error['message'] ) ? (string) $error['message'] : '';

		if ( preg_match( '/quota|rate[ _-]?limit|exhausted|too many requests|overloaded|credit balance|exceeded|\b429\b/i', $message ) ) {
			return 'limit';
		}

		if ( in_array( $code, array( 'invalid_json', 'empty_reply' ), true ) ) {
			return 'incomplete';
		}

		if ( preg_match( '/timed? ?out|cURL error 28/i', $message ) ) {
			return 'timeout';
		}

		if ( preg_match( '/api[ _-]?key|unauthori[sz]ed|authenticat|permission|\b40[13]\b/i', $message ) ) {
			return 'auth';
		}

		return 'error';
	}

	/**
	 * The Primary provider picked on Settings → AI Configuration.
	 *
	 * @return string Provider slug, or '' when none is stored.
	 */
	private static function primary_provider() {
		$primary = sanitize_key( (string) Blocks_Helper::get_dashboard_settings( self::PRIMARY_SETTING, '' ) );

		return isset( self::PROVIDERS[ $primary ] ) ? $primary : '';
	}

	/**
	 * Every provider slug in the order a request tries them: the requested
	 * one, then the Primary, then the rest in PROVIDERS order.
	 *
	 * @param string $requested Requested provider slug ('' for Auto).
	 * @return string[]
	 */
	private static function provider_order( $requested = '' ) {
		$order = array();
		foreach ( array_merge( array( sanitize_key( (string) $requested ), self::primary_provider() ), array_keys( self::PROVIDERS ) ) as $slug ) {
			if ( isset( self::PROVIDERS[ $slug ] ) && ! in_array( $slug, $order, true ) ) {
				$order[] = $slug;
			}
		}

		return $order;
	}

	/**
	 * The connected providers a request walks, in the order it tries them —
	 * provider_order() minus what is not connected.
	 *
	 * @param string $requested   Requested provider slug ('' for Auto).
	 * @param bool   $allow_probe Whether a connector check may cost an HTTP request.
	 * @return string[]
	 */
	private static function connected_in_order( $requested = '', $allow_probe = true ) {
		$connected = array();
		foreach ( self::provider_order( $requested ) as $slug ) {
			if ( self::is_connected( $slug, $allow_probe ) ) {
				$connected[] = $slug;
			}
		}

		return $connected;
	}

	/**
	 * Send one request to one provider — through its connector when it has
	 * one, else with its stored key.
	 *
	 * @param string       $provider    Provider slug.
	 * @param array        $credentials get_credentials() output (model possibly overridden).
	 * @param string|array $request     Prompt text, or a request spec.
	 * @return string|\WP_Error Generated text or error.
	 */
	private static function send( $provider, array $credentials, $request ) {
		$model = isset( $credentials['model'] ) ? (string) $credentials['model'] : '';

		if ( 'connector' === self::source_of( $provider ) ) {
			return self::request_connector( $provider, $model, $request );
		}

		if ( '' === $model ) {
			return new \WP_Error( 'no_model', __( 'No model is selected for this AI provider.', 'easy-accordion-free' ) );
		}

		return self::api_request( $provider, $credentials, $request );
	}

	/**
	 * Whether a provider is toggled on AND reachable — through a connector or a
	 * stored API key.
	 *
	 * @param string $slug        Provider slug.
	 * @param bool   $allow_probe Whether a connector check may cost an HTTP request.
	 * @return bool
	 */
	private static function is_connected( $slug, $allow_probe = true ) {
		$credentials = self::get_credentials( $slug );
		if ( empty( $credentials ) ) {
			return false;
		}

		$is_active = isset( $credentials['is_active'] ) ? (bool) $credentials['is_active'] : true;
		$api_key   = isset( $credentials['api_key'] ) ? (string) $credentials['api_key'] : '';

		return $is_active && ( '' !== $api_key || Connector_Bridge::is_connected( $slug, $allow_probe ) );
	}

	/**
	 * Which route a connected provider takes: 'connector' or 'plugin'.
	 *
	 * @param string $slug        Provider slug.
	 * @param bool   $allow_probe Whether a connector check may cost an HTTP request.
	 * @return string
	 */
	private static function source_of( $slug, $allow_probe = true ) {
		return Connector_Bridge::is_connected( $slug, $allow_probe ) ? 'connector' : 'plugin';
	}

	/**
	 * Connected providers as { slug, label, source, model } rows.
	 *
	 * This is all the editor is told: the FAQ generator's provider picker
	 * lists exactly these, and `model` (the saved default) is what its model
	 * picker preselects. Listed in provider_order(), so the Primary comes
	 * first. It never exposes an API key and never makes an
	 * outbound call.
	 *
	 * @return array<int, array{slug: string, label: string, source: string, model: string}>
	 */
	public static function connected_providers() {
		$providers = array();
		foreach ( self::provider_order() as $slug ) {
			if ( ! self::is_connected( $slug, false ) ) {
				continue;
			}
			$credentials = self::get_credentials( $slug );
			$providers[] = array(
				'slug'   => $slug,
				'label'  => self::PROVIDERS[ $slug ]['label'],
				'source' => self::source_of( $slug, false ),
				'model'  => $credentials['model'],
			);
		}

		return $providers;
	}

	/**
	 * Where to connect a provider, in words.
	 *
	 * @return string
	 */
	public static function no_provider_message() {
		if ( Connector_Bridge::is_supported() ) {
			return __( 'No AI provider is connected. Connect one under Settings → Connectors, or add an API key under Easy Accordion → Settings → AI Configuration.', 'easy-accordion-free' );
		}

		return __( 'No AI provider is connected. Add an API key under Easy Accordion → Settings → AI Configuration.', 'easy-accordion-free' );
	}

	/**
	 * Read stored credentials for a provider from integrations.<slug>.
	 *
	 * `workspace_id` is Anthropic-only and normally empty: it is required only
	 * when the stored key is an organization-level key.
	 *
	 * @param string $slug Provider slug.
	 * @return array { is_active: bool, api_key: string, model: string, workspace_id: string }
	 */
	private static function get_credentials( $slug ) {
		if ( '' === $slug || ! isset( self::PROVIDERS[ $slug ] ) ) {
			return array();
		}
		$integrations = (array) Blocks_Helper::get_dashboard_settings( 'integrations', array() );
		$config       = isset( $integrations[ $slug ] ) && is_array( $integrations[ $slug ] ) ? $integrations[ $slug ] : array();

		return array(
			'is_active'    => isset( $config['is_active'] ) ? $config['is_active'] : true,
			'api_key'      => isset( $config['api_key'] ) ? trim( (string) $config['api_key'] ) : '',
			'model'        => ! empty( $config['model'] ) ? sanitize_text_field( $config['model'] ) : self::PROVIDERS[ $slug ]['default_model'],
			'workspace_id' => isset( $config['workspace_id'] ) ? sanitize_text_field( trim( (string) $config['workspace_id'] ) ) : '',
		);
	}

	/**
	 * Stored credentials, with a caller's model taking over when the provider
	 * is the one the caller asked for.
	 *
	 * @param string $slug      Provider slug.
	 * @param string $requested Requested provider slug ('' for Auto).
	 * @param string $model     Model override ('' for the saved one).
	 * @return array get_credentials() output.
	 */
	private static function credentials_for( $slug, $requested = '', $model = '' ) {
		$credentials = self::get_credentials( $slug );
		$model       = sanitize_text_field( (string) $model );
		if ( '' !== $model && ! empty( $credentials ) && sanitize_key( (string) $requested ) === $slug ) {
			$credentials['model'] = $model;
		}

		return $credentials;
	}

	/**
	 * Log a provider failure when debugging is enabled.
	 *
	 * @param string    $provider Provider slug.
	 * @param string    $model    Model slug the request named.
	 * @param \WP_Error $error    The failure.
	 * @return void
	 */
	private static function log_error( $provider, $model, $error ) {
		if ( ! defined( 'WP_DEBUG' ) || ! WP_DEBUG ) {
			return;
		}

		error_log( // phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			sprintf(
				'Easy Accordion AI request failed [%1$s / %2$s] %3$s: %4$s',
				$provider,
				$model,
				$error->get_error_code(),
				$error->get_error_message()
			)
		);
	}

	/**
	 * Route a request to a provider's request method.
	 *
	 * @param string       $provider    Provider slug.
	 * @param array        $credentials Stored credentials (get_credentials() output).
	 * @param string|array $request     Prompt text, or a request spec.
	 * @return string|\WP_Error Generated text or error.
	 */
	private static function api_request( $provider, array $credentials, $request ) {
		$request = self::normalize_request( $request );
		$reply   = self::dispatch( $provider, $credentials, $request );

		// A model that takes no reasoning setting rejects the request before any
		// work is billed; ask once more without it.
		if ( is_wp_error( $reply ) && '' !== $request['effort'] && preg_match( '/reasoning|thinking/i', $reply->get_error_message() ) ) {
			$request['effort'] = '';
			$reply             = self::dispatch( $provider, $credentials, $request );
		}

		return $reply;
	}

	/**
	 * Send a normalized request to a provider's request method.
	 *
	 * @param string $provider    Provider slug.
	 * @param array  $credentials Stored credentials (get_credentials() output).
	 * @param array  $request     Normalized request spec.
	 * @return string|\WP_Error Generated text or error.
	 */
	private static function dispatch( $provider, array $credentials, array $request ) {
		$api_key = isset( $credentials['api_key'] ) ? (string) $credentials['api_key'] : '';
		$model   = isset( $credentials['model'] ) ? (string) $credentials['model'] : '';

		switch ( $provider ) {
			case 'gemini':
				return self::request_gemini( $api_key, $model, $request );
			case 'openai':
				return self::request_openai( $api_key, $model, $request );
			case 'anthropic':
				$workspace_id = isset( $credentials['workspace_id'] ) ? (string) $credentials['workspace_id'] : '';
				return self::request_anthropic( $api_key, $model, $request, $workspace_id );
			case 'groq':
				return self::request_groq( $api_key, $model, $request );
			default:
				return new \WP_Error( 'unknown_provider', __( 'Unknown AI provider.', 'easy-accordion-free' ) );
		}
	}

	/**
	 * Fill a request spec with its defaults.
	 *
	 * `effort` ('' or 'low') asks a reasoning model to think less: short
	 * structured writing needs little of it, and reasoning tokens are billed
	 * as output.
	 *
	 * @param string|array $request Prompt text, or a request spec.
	 * @return array{user: string, system: string, json: bool, max_tokens: int, effort: string}
	 */
	private static function normalize_request( $request ) {
		if ( ! is_array( $request ) ) {
			$request = array( 'user' => (string) $request );
		}

		return array(
			'user'       => isset( $request['user'] ) ? (string) $request['user'] : '',
			'system'     => isset( $request['system'] ) ? (string) $request['system'] : '',
			'json'       => ! empty( $request['json'] ),
			'max_tokens' => isset( $request['max_tokens'] ) ? absint( $request['max_tokens'] ) : 0,
			'effort'     => isset( $request['effort'] ) ? sanitize_key( (string) $request['effort'] ) : '',
		);
	}

	/**
	 * Ask a connected provider for a JSON object.
	 *
	 * Any failure — an error or a reply that is not JSON — hands the request to
	 * the next connected provider; when every one fails, the first failure is
	 * the one reported. With `failover` false only the requested provider is
	 * tried, so the caller can offer the next one itself.
	 *
	 * @param string $system   System instruction.
	 * @param string $user     User message.
	 * @param string $provider Requested provider slug ('' for Auto).
	 * @param array  $opts     Optional `max_tokens` (default 4096), `model` — a
	 *                         model of the requested provider, used only when that
	 *                         provider is the one that answers — `failover`
	 *                         (default true), `effort` ('' or 'low', see
	 *                         normalize_request()) and `salvage`, a callable that
	 *                         gets a reply that is not valid JSON (one cut off at
	 *                         the token limit, say) and may return what it can
	 *                         still read as an array, so a paid reply is not
	 *                         thrown away.
	 * @return array|null Decoded object, or null — read last_error() for why.
	 */
	public static function complete_json( $system, $user, $provider = '', $opts = array() ) {
		self::$last_error = null;

		$requested = sanitize_key( (string) $provider );
		$request   = array(
			'system'     => $system,
			'user'       => $user,
			'json'       => true,
			'max_tokens' => isset( $opts['max_tokens'] ) ? absint( $opts['max_tokens'] ) : 4096,
			'effort'     => isset( $opts['effort'] ) ? (string) $opts['effort'] : '',
		);
		$salvage   = isset( $opts['salvage'] ) && is_callable( $opts['salvage'] ) ? $opts['salvage'] : null;

		$candidates = self::connected_in_order( $requested );
		if ( isset( $opts['failover'] ) && ! $opts['failover'] ) {
			if ( '' !== $requested && ! in_array( $requested, $candidates, true ) ) {
				self::fail( $requested, '', 'provider_inactive', __( 'This AI provider is not connected.', 'easy-accordion-free' ) );
				return null;
			}
			$candidates = array_slice( $candidates, 0, 1 );
		}

		$failure = null;
		foreach ( $candidates as $index => $slug ) {
			$credentials = self::credentials_for( $slug, $requested, isset( $opts['model'] ) ? $opts['model'] : '' );
			$model       = isset( $credentials['model'] ) ? (string) $credentials['model'] : '';

			$text    = self::send( $slug, $credentials, $request );
			$decoded = is_wp_error( $text ) ? null : self::decode_json_reply( $text );
			if ( null === $decoded && $salvage && ! is_wp_error( $text ) ) {
				$decoded = call_user_func( $salvage, (string) $text );
				$decoded = is_array( $decoded ) && ! empty( $decoded ) ? $decoded : null;
			}
			if ( null !== $decoded ) {
				return $decoded;
			}

			$error = is_wp_error( $text ) ? $text : new \WP_Error( 'invalid_json', __( 'The AI provider replied, but not with a readable JSON object.', 'easy-accordion-free' ) );
			if ( null === $failure ) {
				$failure = array( $slug, $model, $error );
			}
			if ( isset( $candidates[ $index + 1 ] ) ) {
				self::log_error( $slug, $model, $error );
			}
		}

		if ( null === $failure ) {
			self::fail( '', '', 'no_provider', self::no_provider_message() );
			return null;
		}

		self::fail( $failure[0], $failure[1], $failure[2]->get_error_code(), $failure[2]->get_error_message() );
		return null;
	}

	/**
	 * Check a set of credentials with one tiny request before they are saved.
	 *
	 * The probe travels the same request_<slug>() / parse_<slug>() path a real
	 * run takes, so the key, the model, the Anthropic workspace header and the
	 * account's quota are all checked at once. A 200 with no text still counts.
	 *
	 * @param string $provider    Provider slug.
	 * @param array  $credentials Unsaved { api_key, model, workspace_id }.
	 * @return true|\WP_Error True when the provider accepted the request.
	 */
	public static function verify_credentials( $provider, array $credentials ) {
		self::$last_error = null;

		if ( ! isset( self::PROVIDERS[ $provider ] ) ) {
			self::fail( '', '', 'unknown_provider', __( 'Unknown AI provider.', 'easy-accordion-free' ) );
			return new \WP_Error( 'unknown_provider', self::format_error(), array( 'status' => 400 ) );
		}

		$model       = isset( $credentials['model'] ) ? sanitize_text_field( (string) $credentials['model'] ) : '';
		$credentials = array(
			'api_key'      => isset( $credentials['api_key'] ) ? trim( (string) $credentials['api_key'] ) : '',
			'model'        => '' !== $model ? $model : self::PROVIDERS[ $provider ]['default_model'],
			'workspace_id' => isset( $credentials['workspace_id'] ) ? trim( (string) $credentials['workspace_id'] ) : '',
		);

		if ( '' === $credentials['api_key'] ) {
			self::fail( $provider, $credentials['model'], 'no_api_key', __( 'Enter an API key to verify.', 'easy-accordion-free' ) );
			return new \WP_Error( 'no_api_key', self::format_error(), array( 'status' => 400 ) );
		}

		$reply = self::api_request(
			$provider,
			$credentials,
			array(
				'user'       => 'Reply with OK.',
				'max_tokens' => 16,
			)
		);

		if ( is_wp_error( $reply ) ) {
			self::fail( $provider, $credentials['model'], $reply->get_error_code(), $reply->get_error_message() );
			return new \WP_Error( $reply->get_error_code(), self::format_error(), array( 'status' => 400 ) );
		}

		return true;
	}

	/**
	 * Decode a model reply that should be a JSON object.
	 *
	 * Models asked for raw JSON still wrap it in a ```json fence or add a line
	 * of prose, so the outermost `{…}` is decoded when the whole reply is not.
	 *
	 * @param string $text Reply text.
	 * @return array|null
	 */
	private static function decode_json_reply( $text ) {
		$text = trim( (string) $text );
		$text = preg_replace( '/^```(?:json)?\s*|\s*```$/i', '', $text );

		$decoded = json_decode( $text, true );
		if ( is_array( $decoded ) ) {
			return $decoded;
		}

		$start = strpos( $text, '{' );
		$end   = strrpos( $text, '}' );
		if ( false === $start || false === $end || $end <= $start ) {
			return null;
		}

		$decoded = json_decode( substr( $text, $start, $end - $start + 1 ), true );
		return is_array( $decoded ) ? $decoded : null;
	}

	/**
	 * Run a request through the WordPress AI Client (Connectors path).
	 *
	 * No key passes through here: core injects the connector's stored key into
	 * the AI client registry, so naming the provider is enough. The model is a
	 * preference, so a retired id degrades instead of failing.
	 *
	 * @param string       $provider Provider slug.
	 * @param string       $model    Preferred model slug, possibly ''.
	 * @param string|array $request  Prompt text, or a request spec.
	 * @return string|\WP_Error Generated text or error.
	 */
	private static function request_connector( $provider, $model, $request ) {
		if ( ! function_exists( 'wp_ai_client_prompt' ) ) {
			return new \WP_Error( 'connector_unavailable', __( 'The WordPress AI Client is not available on this site.', 'easy-accordion-free' ) );
		}

		$request = self::normalize_request( $request );
		$builder = wp_ai_client_prompt( $request['user'] )->using_provider( Connector_Bridge::connector_id( $provider ) );

		if ( '' !== $request['system'] ) {
			$builder = $builder->using_system_instruction( $request['system'] );
		}
		if ( $request['max_tokens'] ) {
			$builder = $builder->using_max_tokens( $request['max_tokens'] );
		}
		if ( $request['json'] ) {
			$builder = $builder->as_json_response();
		}
		if ( '' !== $model ) {
			$builder = $builder->using_model_preference( $model );
		}

		$text = $builder->generate_text();

		if ( is_wp_error( $text ) ) {
			return $text;
		}

		return trim( is_string( $text ) ? $text : '' );
	}

	/**
	 * POST a JSON payload and decode the JSON response.
	 *
	 * @param string $url     Endpoint URL.
	 * @param array  $headers Request headers (Content-Type is added here).
	 * @param array  $payload Request body, JSON-encoded here.
	 * @return array|\WP_Error Decoded response body, or error.
	 */
	private static function post_json( $url, array $headers, array $payload ) {
		/**
		 * Filter the AI provider request timeout (seconds).
		 *
		 * @param int    $timeout Timeout in seconds.
		 * @param string $url     Endpoint being called.
		 */
		$timeout = (int) apply_filters( 'sp_eab_ai_request_timeout', 60, $url );

		$response = wp_remote_post(
			$url,
			array(
				'timeout' => max( 5, $timeout ),
				'headers' => array_merge( array( 'Content-Type' => 'application/json' ), $headers ),
				'body'    => wp_json_encode( $payload ),
			)
		);

		if ( is_wp_error( $response ) ) {
			return $response;
		}

		$status = (int) wp_remote_retrieve_response_code( $response );
		$body   = json_decode( wp_remote_retrieve_body( $response ), true );
		if ( ! is_array( $body ) ) {
			return new \WP_Error(
				'malformed_payload',
				sprintf(
					/* translators: %d: HTTP status code returned by the AI provider. */
					__( 'The AI provider returned an unexpected response (HTTP %d).', 'easy-accordion-free' ),
					$status
				)
			);
		}

		return $body;
	}

	/**
	 * Call Google Gemini's generateContent endpoint.
	 *
	 * The key travels in the `x-goog-api-key` header rather than a `?key=` query
	 * arg — a URL is written to access logs and proxy caches, a header is not.
	 *
	 * @param string $api_key Gemini API key.
	 * @param string $model   Model slug.
	 * @param array  $request Normalized request spec.
	 * @return string|\WP_Error Generated text or error.
	 */
	private static function request_gemini( $api_key, $model, array $request ) {
		$url = 'https://generativelanguage.googleapis.com/v1beta/models/' . rawurlencode( $model ) . ':generateContent';

		$payload = array(
			'contents'         => array(
				array(
					'parts' => array(
						array( 'text' => $request['user'] ),
					),
				),
			),
			'generationConfig' => array(
				'temperature'     => $request['json'] ? 0.2 : 0.3,
				'maxOutputTokens' => $request['max_tokens'] ? $request['max_tokens'] : 512,
			),
		);

		if ( '' !== $request['system'] ) {
			$payload['systemInstruction'] = array(
				'parts' => array(
					array( 'text' => $request['system'] ),
				),
			);
		}

		if ( $request['json'] ) {
			$payload['generationConfig']['responseMimeType'] = 'application/json';
		}

		// Gemini 3 thinks by default; thinking tokens are billed as output.
		if ( '' !== $request['effort'] && 0 === strpos( $model, 'gemini-3' ) ) {
			$payload['generationConfig']['thinkingConfig'] = array( 'thinkingLevel' => $request['effort'] );
		}

		$body = self::post_json( $url, array( 'x-goog-api-key' => $api_key ), $payload );

		if ( is_wp_error( $body ) ) {
			return $body;
		}

		return self::parse_gemini( $body );
	}

	/**
	 * Read the generated text out of a Gemini response body.
	 *
	 * @param array $body Decoded response body.
	 * @return string|\WP_Error
	 */
	private static function parse_gemini( array $body ) {
		if ( isset( $body['error'] ) ) {
			$message = isset( $body['error']['message'] ) ? $body['error']['message'] : __( 'Gemini API request failed.', 'easy-accordion-free' );
			return new \WP_Error( 'gemini_error', $message );
		}

		$text = $body['candidates'][0]['content']['parts'][0]['text'] ?? '';
		return trim( (string) $text );
	}

	/**
	 * Call OpenAI's Chat Completions endpoint.
	 *
	 * No `temperature` is sent: the offered models are reasoning models and
	 * reject it. `max_completion_tokens` is the current spelling.
	 *
	 * @param string $api_key OpenAI API key.
	 * @param string $model   Model slug.
	 * @param array  $request Normalized request spec.
	 * @return string|\WP_Error Generated text or error.
	 */
	private static function request_openai( $api_key, $model, array $request ) {
		$body = self::post_json(
			'https://api.openai.com/v1/chat/completions',
			array( 'Authorization' => 'Bearer ' . $api_key ),
			self::chat_completion_payload( $model, $request )
		);

		if ( is_wp_error( $body ) ) {
			return $body;
		}

		return self::parse_chat_completion( $body, 'openai_error', __( 'OpenAI API request failed.', 'easy-accordion-free' ) );
	}

	/**
	 * Call Groq's OpenAI-compatible Chat Completions endpoint.
	 *
	 * Core ships no Groq connector, so a Groq request is always made with the
	 * stored key.
	 *
	 * @param string $api_key Groq API key.
	 * @param string $model   Model slug.
	 * @param array  $request Normalized request spec.
	 * @return string|\WP_Error Generated text or error.
	 */
	private static function request_groq( $api_key, $model, array $request ) {
		$body = self::post_json(
			'https://api.groq.com/openai/v1/chat/completions',
			array( 'Authorization' => 'Bearer ' . $api_key ),
			self::chat_completion_payload( $model, $request )
		);

		if ( is_wp_error( $body ) ) {
			return $body;
		}

		return self::parse_chat_completion( $body, 'groq_error', __( 'Groq API request failed.', 'easy-accordion-free' ) );
	}

	/**
	 * Build a Chat Completions request body, shared by every provider that
	 * speaks OpenAI's wire format.
	 *
	 * @param string $model   Model slug.
	 * @param array  $request Normalized request spec.
	 * @return array
	 */
	private static function chat_completion_payload( $model, array $request ) {
		$messages = array();
		if ( '' !== $request['system'] ) {
			$messages[] = array(
				'role'    => 'system',
				'content' => $request['system'],
			);
		}
		$messages[] = array(
			'role'    => 'user',
			'content' => $request['user'],
		);

		$payload = array(
			'model'                 => $model,
			'messages'              => $messages,
			'max_completion_tokens' => $request['max_tokens'] ? $request['max_tokens'] : 2048,
		);

		if ( $request['json'] ) {
			$payload['response_format'] = array( 'type' => 'json_object' );
		}

		$effort = self::reasoning_effort( $model, $request['effort'] );
		if ( '' !== $effort ) {
			$payload['reasoning_effort'] = $effort;
		}

		return $payload;
	}

	/**
	 * The `reasoning_effort` a Chat Completions model takes for a requested
	 * effort, or '' for a model that has no such setting.
	 *
	 * GPT-5 / o-series and GPT-OSS take the effort as is; Qwen3 on Groq only
	 * switches reasoning off ('none') or on. A model this does not know is sent
	 * nothing, and api_request() resends without the setting if a known one
	 * still rejects it.
	 *
	 * @param string $model  Model slug.
	 * @param string $effort Requested effort ('' for none).
	 * @return string
	 */
	private static function reasoning_effort( $model, $effort ) {
		if ( '' === $effort ) {
			return '';
		}

		if ( preg_match( '#^(gpt-5|o[1-9])#', $model ) || false !== strpos( $model, 'gpt-oss' ) ) {
			return $effort;
		}

		if ( false !== strpos( $model, 'qwen3' ) ) {
			return 'none';
		}

		return '';
	}

	/**
	 * Read the generated text out of a Chat Completions body.
	 *
	 * @param array  $body     Decoded response body.
	 * @param string $code     Error code for a provider-reported failure.
	 * @param string $fallback Message when the error carries none.
	 * @return string|\WP_Error
	 */
	private static function parse_chat_completion( array $body, $code, $fallback ) {
		if ( isset( $body['error'] ) ) {
			$message = isset( $body['error']['message'] ) ? $body['error']['message'] : $fallback;
			return new \WP_Error( $code, $message );
		}

		$text = $body['choices'][0]['message']['content'] ?? '';
		return trim( (string) $text );
	}

	/**
	 * Call Anthropic's Messages endpoint.
	 *
	 * No `temperature` is sent: thinking-capable models reject a non-default
	 * one. `anthropic-workspace-id` is sent only when a workspace id is stored
	 * — an organization-level key needs it, a workspace-scoped key rejects it.
	 *
	 * @param string $api_key      Anthropic API key.
	 * @param string $model        Model slug.
	 * @param array  $request      Normalized request spec.
	 * @param string $workspace_id Optional workspace id for an org-level key.
	 * @return string|\WP_Error Generated text or error.
	 */
	private static function request_anthropic( $api_key, $model, array $request, $workspace_id = '' ) {
		$headers = array(
			'x-api-key'         => $api_key,
			'anthropic-version' => '2023-06-01',
		);

		if ( '' !== $workspace_id ) {
			$headers['anthropic-workspace-id'] = $workspace_id;
		}

		$payload = array(
			'model'      => $model,
			'max_tokens' => $request['max_tokens'] ? $request['max_tokens'] : 2048,
			'messages'   => array(
				array(
					'role'    => 'user',
					'content' => $request['user'],
				),
			),
		);

		if ( '' !== $request['system'] ) {
			$payload['system'] = $request['system'];
		}

		$body = self::post_json( 'https://api.anthropic.com/v1/messages', $headers, $payload );

		if ( is_wp_error( $body ) ) {
			return $body;
		}

		return self::parse_anthropic( $body );
	}

	/**
	 * Read the generated text out of an Anthropic response body.
	 *
	 * The content list is scanned for the first `text` block rather than read
	 * at index 0 — a thinking-capable model puts a `thinking` block first.
	 *
	 * @param array $body Decoded response body.
	 * @return string|\WP_Error
	 */
	private static function parse_anthropic( array $body ) {
		if ( isset( $body['error'] ) ) {
			$message = isset( $body['error']['message'] ) ? $body['error']['message'] : __( 'Anthropic API request failed.', 'easy-accordion-free' );
			return new \WP_Error( 'anthropic_error', $message );
		}

		$blocks = isset( $body['content'] ) && is_array( $body['content'] ) ? $body['content'] : array();
		foreach ( $blocks as $block ) {
			if ( is_array( $block ) && isset( $block['type'] ) && 'text' === $block['type'] ) {
				return trim( (string) ( $block['text'] ?? '' ) );
			}
		}

		return '';
	}
}
