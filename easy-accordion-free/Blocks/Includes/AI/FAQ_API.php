<?php
/**
 * Generate FAQs with AI — REST routes.
 *
 * `/ai-generate-faqs` writes the FAQs for the accordion modal and
 * `/ai-rewrite-faq` rewrites one generated question or answer. Both run
 * through FAQ_Generator, so no provider is called and no key is read in the
 * browser.
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
 * FAQ_API Class.
 *
 * @since 3.2.0
 */
class FAQ_API {

	/**
	 * Instance.
	 *
	 * @var self
	 */
	private static $instance;

	/**
	 * Get instance.
	 *
	 * @return self
	 */
	public static function instance() {
		if ( ! self::$instance ) {
			self::$instance = new self();
			add_action( 'rest_api_init', array( self::$instance, 'register_routes' ) );
		}
		return self::$instance;
	}

	/**
	 * Register the FAQ generator routes.
	 *
	 * @return void
	 */
	public function register_routes() {
		// Generate FAQs with AI — the accordion modal's questions and answers.
		register_rest_route(
			'easy-accordion/v2',
			'/ai-generate-faqs',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'ai_generate_faqs' ),
				'permission_callback' => array( $this, 'check_faq_generator_permission' ),
				'args'                => array(
					'prompt'       => array(
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => 'sanitize_textarea_field',
					),
					'numberOfFaqs' => array(
						'type'    => 'integer',
						'default' => 5,
						'minimum' => 1,
						'maximum' => FAQ_Generator::MAX_FAQS,
					),
					'language'     => array(
						'type'              => 'string',
						'default'           => 'english',
						'enum'              => array_keys( FAQ_Generator::LANGUAGES ),
						'sanitize_callback' => 'sanitize_key',
						'validate_callback' => 'rest_validate_request_arg',
					),
					'tone'         => array(
						'type'              => 'string',
						'default'           => 'balanced',
						'enum'              => array_keys( FAQ_Generator::TONES ),
						'sanitize_callback' => 'sanitize_key',
						'validate_callback' => 'rest_validate_request_arg',
					),
					'keywords'     => array(
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => 'sanitize_text_field',
					),
					'postIds'      => array(
						'type'     => 'array',
						'default'  => array(),
						'maxItems' => FAQ_Sources::MAX_POSTS,
						'items'    => array(
							'type'    => 'integer',
							'minimum' => 1,
						),
					),
					'urls'         => array(
						'type'     => 'array',
						'default'  => array(),
						'maxItems' => FAQ_Sources::MAX_URLS,
						'items'    => array( 'type' => 'string' ),
					),
					'files'        => array(
						'type'     => 'array',
						'default'  => array(),
						'maxItems' => FAQ_Sources::MAX_FILES,
						'items'    => array(
							'type'       => 'object',
							'properties' => array(
								'name'    => array( 'type' => 'string' ),
								'content' => array( 'type' => 'string' ),
							),
						),
					),
					'existing'     => array(
						'type'     => 'array',
						'default'  => array(),
						'maxItems' => 100,
						'items'    => array( 'type' => 'string' ),
					),
					'provider'     => array(
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => 'sanitize_key',
					),
					'model'        => array(
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);

		// Rewrite one generated question or answer from the modal's results.
		register_rest_route(
			'easy-accordion/v2',
			'/ai-rewrite-faq',
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'ai_rewrite_faq' ),
				'permission_callback' => array( $this, 'check_faq_generator_permission' ),
				'args'                => array(
					'field'       => array(
						'type'     => 'string',
						'required' => true,
						'enum'     => array( 'q', 'a' ),
					),
					'question'    => array(
						'type'    => 'string',
						'default' => '',
					),
					'answer'      => array(
						'type'    => 'string',
						'default' => '',
					),
					'instruction' => array(
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => 'sanitize_textarea_field',
					),
					'language'    => array(
						'type'              => 'string',
						'default'           => 'english',
						'enum'              => array_keys( FAQ_Generator::LANGUAGES ),
						'sanitize_callback' => 'sanitize_key',
						'validate_callback' => 'rest_validate_request_arg',
					),
					'provider'    => array(
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => 'sanitize_key',
					),
					'model'       => array(
						'type'              => 'string',
						'default'           => '',
						'sanitize_callback' => 'sanitize_text_field',
					),
				),
			)
		);
	}

	/**
	 * Permission for the FAQ generator route: its module must be on, then the
	 * user must be able to edit posts.
	 *
	 * @return bool|\WP_Error
	 */
	public function check_faq_generator_permission() {
		if ( ! FAQ_Generator::is_enabled() ) {
			return new \WP_Error( 'sp_eab_ai_module_disabled', __( 'Generate FAQs with AI is switched off under Easy Accordion → Modules.', 'easy-accordion-free' ), array( 'status' => 403 ) );
		}

		return current_user_can( 'edit_posts' );
	}

	/**
	 * Generate FAQs with AI: questions and answers for the accordion modal.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function ai_generate_faqs( $request ) {
		$result = FAQ_Generator::generate(
			array(
				'prompt'       => $request['prompt'],
				'numberOfFaqs' => $request['numberOfFaqs'],
				'language'     => $request['language'],
				'tone'         => $request['tone'],
				'keywords'     => $request['keywords'],
				'postIds'      => $request['postIds'],
				'urls'         => $request['urls'],
				'files'        => $request['files'],
				'existing'     => $request['existing'],
			),
			$request['provider'],
			$request['model']
		);

		if ( is_wp_error( $result ) ) {
			return $result;
		}

		return rest_ensure_response( array_merge( array( 'success' => true ), $result ) );
	}

	/**
	 * Rewrite one generated question or answer.
	 *
	 * @param \WP_REST_Request $request Request.
	 * @return \WP_REST_Response|\WP_Error
	 */
	public function ai_rewrite_faq( $request ) {
		$text = FAQ_Generator::rewrite(
			array(
				'field'       => $request['field'],
				'question'    => $request['question'],
				'answer'      => $request['answer'],
				'instruction' => $request['instruction'],
				'language'    => $request['language'],
			),
			$request['provider'],
			$request['model']
		);

		if ( is_wp_error( $text ) ) {
			return $text;
		}

		return rest_ensure_response(
			array(
				'success' => true,
				'text'    => $text,
			)
		);
	}
}
