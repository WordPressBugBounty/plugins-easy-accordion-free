<?php
/**
 * Generate FAQs with AI — server side of the accordion's "Generate FAQs with
 * AI" modal.
 *
 * Builds the FAQ prompt from the modal's fields (count, language, tone,
 * keywords, the picked sources, the author's prompt) and asks the provider
 * picked in the modal through AI::complete_json(), with the keys saved on
 * Settings → AI Configuration (or WordPress Connectors). No key ever reaches
 * the browser. A second, much smaller request rewrites one question or answer
 * on the results screen.
 *
 * Credits are spent on input tokens (the prompt and the sources), output
 * tokens (the FAQs) and, on reasoning models, thinking tokens. So: the
 * sources go through FAQ_Sources' fixed budget, the prompt and the reply
 * shape are terse (`q` / `a`), questions the block already has are named so
 * none is written twice, reasoning runs at low effort, the token cap follows
 * the FAQ count, and a reply cut off at that cap still yields every FAQ it
 * completed instead of being thrown away.
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
 * FAQ_Generator Class.
 *
 * @since 3.2.0
 */
class FAQ_Generator {

	/**
	 * Dashboard module key.
	 */
	const MODULE = 'generate_faqs_with_ai';

	/**
	 * Most FAQs one request may ask for. The free plugin writes up to five per
	 * run; Easy Accordion Pro raises this to 20.
	 */
	const MAX_FAQS = 5;

	/**
	 * Most existing questions named to the model as already answered.
	 */
	const MAX_EXISTING = 30;

	/**
	 * Languages the modal offers, value => name the model reads.
	 */
	const LANGUAGES = array(
		'english'             => 'English',
		'arabic'              => 'Arabic',
		'bengali'             => 'Bengali',
		'bulgarian'           => 'Bulgarian',
		'chinese_simplified'  => 'Chinese (Simplified)',
		'chinese_traditional' => 'Chinese (Traditional)',
		'croatian'            => 'Croatian',
		'czech'               => 'Czech',
		'danish'              => 'Danish',
		'dutch'               => 'Dutch',
		'estonian'            => 'Estonian',
		'finnish'             => 'Finnish',
		'french'              => 'French',
		'german'              => 'German',
		'greek'               => 'Greek',
		'gujarati'            => 'Gujarati',
		'hebrew'              => 'Hebrew',
		'hindi'               => 'Hindi',
		'hungarian'           => 'Hungarian',
		'indonesian'          => 'Indonesian',
		'italian'             => 'Italian',
		'japanese'            => 'Japanese',
		'kannada'             => 'Kannada',
		'korean'              => 'Korean',
		'latvian'             => 'Latvian',
		'lithuanian'          => 'Lithuanian',
		'malay'               => 'Malay',
		'malayalam'           => 'Malayalam',
		'marathi'             => 'Marathi',
		'norwegian'           => 'Norwegian',
		'persian'             => 'Persian',
		'polish'              => 'Polish',
		'portuguese'          => 'Portuguese',
		'punjabi'             => 'Punjabi',
		'romanian'            => 'Romanian',
		'russian'             => 'Russian',
		'serbian'             => 'Serbian',
		'slovak'              => 'Slovak',
		'slovenian'           => 'Slovenian',
		'spanish'             => 'Spanish',
		'swahili'             => 'Swahili',
		'swedish'             => 'Swedish',
		'tamil'               => 'Tamil',
		'telugu'              => 'Telugu',
		'thai'                => 'Thai',
		'turkish'             => 'Turkish',
		'ukrainian'           => 'Ukrainian',
		'urdu'                => 'Urdu',
		'vietnamese'          => 'Vietnamese',
	);

	/**
	 * Languages written in a script that costs about twice the tokens per word
	 * of a Latin one — their FAQs get a larger token cap.
	 */
	const WIDE_SCRIPT_LANGUAGES = array( 'arabic', 'bengali', 'bulgarian', 'chinese_simplified', 'chinese_traditional', 'greek', 'gujarati', 'hebrew', 'hindi', 'japanese', 'kannada', 'korean', 'malayalam', 'marathi', 'persian', 'punjabi', 'russian', 'serbian', 'tamil', 'telugu', 'thai', 'ukrainian', 'urdu' );

	/**
	 * Writing tones the modal offers, value => wording the model reads.
	 */
	const TONES = array(
		'balanced'            => 'balanced',
		'professional'        => 'professional',
		'friendly'            => 'friendly',
		'conversational'      => 'conversational',
		'informative'         => 'informative',
		'technical'           => 'technical',
		'persuasive'          => 'persuasive',
		'supportive'          => 'supportive',
		'documentation_style' => 'documentation-style',
		'beginner_friendly'   => 'beginner-friendly',
	);

	/**
	 * Output tokens one FAQ may take (Latin script, then wide script), and the
	 * room left for a reasoning model's low-effort thinking.
	 */
	const TOKENS_PER_FAQ      = 150;
	const TOKENS_PER_FAQ_WIDE = 300;
	const TOKENS_REASONING    = 1024;

	/**
	 * Longest question accepted, in characters.
	 */
	const QUESTION_MAX = 300;

	/**
	 * Longest answer accepted, in characters.
	 */
	const ANSWER_MAX = 2000;

	/**
	 * Longest rewrite instruction accepted, in characters.
	 */
	const INSTRUCTION_MAX = 300;

	/**
	 * Inline tags an answer may keep.
	 */
	const ANSWER_TAGS = array(
		'a'      => array(
			'href'   => true,
			'title'  => true,
			'target' => true,
			'rel'    => true,
		),
		'strong' => array(),
		'b'      => array(),
		'em'     => array(),
		'i'      => array(),
		'code'   => array(),
		'br'     => array(),
	);

	/**
	 * Whether the FAQ generator is available: its module is on and the site
	 * has not switched AI off.
	 *
	 * @return bool
	 */
	public static function is_enabled() {
		$modules = (array) Blocks_Helper::get_dashboard_settings( 'modules', array() );

		// A module the settings never stored counts as on, the way the dashboard defaults it.
		$is_active = ! isset( $modules[ self::MODULE ]['is_active'] ) || (bool) $modules[ self::MODULE ]['is_active'];

		return $is_active && Connector_Bridge::site_allows_ai();
	}

	/**
	 * The modal's language and tone lists, as `{ value, label }` options.
	 *
	 * @return array{languages: array, tones: array}
	 */
	public static function options() {
		$tones = array(
			'balanced'            => __( 'Balanced', 'easy-accordion-free' ),
			'professional'        => __( 'Professional', 'easy-accordion-free' ),
			'friendly'            => __( 'Friendly', 'easy-accordion-free' ),
			'conversational'      => __( 'Conversational', 'easy-accordion-free' ),
			'informative'         => __( 'Informative', 'easy-accordion-free' ),
			'technical'           => __( 'Technical', 'easy-accordion-free' ),
			'persuasive'          => __( 'Persuasive', 'easy-accordion-free' ),
			'supportive'          => __( 'Supportive', 'easy-accordion-free' ),
			'documentation_style' => __( 'Documentation Style', 'easy-accordion-free' ),
			'beginner_friendly'   => __( 'Beginner-Friendly', 'easy-accordion-free' ),
		);

		$to_options = function ( $list ) {
			$options = array();
			foreach ( $list as $value => $label ) {
				$options[] = array(
					'value' => $value,
					'label' => $label,
				);
			}
			return $options;
		};

		return array(
			'languages' => $to_options( self::LANGUAGES ),
			'tones'     => $to_options( $tones ),
		);
	}

	/**
	 * Generate FAQs.
	 *
	 * @param array  $fields   `{ prompt, numberOfFaqs, language, tone, keywords, postIds, urls, files, existing }`.
	 * @param string $provider Provider slug picked in the modal ('' for the Primary).
	 * @param string $model    Model of that provider ('' for its saved one).
	 * @return array|\WP_Error `{ faqs: [{ question, answer }], skipped: string[] }` — `skipped` names sources that could not be read.
	 */
	public static function generate( array $fields, $provider = '', $model = '' ) {
		$prompt   = isset( $fields['prompt'] ) ? trim( (string) $fields['prompt'] ) : '';
		$keywords = isset( $fields['keywords'] ) ? trim( (string) $fields['keywords'] ) : '';
		$sources  = FAQ_Sources::collect(
			isset( $fields['postIds'] ) ? (array) $fields['postIds'] : array(),
			isset( $fields['urls'] ) ? (array) $fields['urls'] : array(),
			isset( $fields['files'] ) ? (array) $fields['files'] : array()
		);

		if ( '' === $prompt && '' === $keywords && empty( $sources['docs'] ) ) {
			$message = empty( $sources['skipped'] )
				? __( 'Describe what the FAQs should be about, or pick a source.', 'easy-accordion-free' )
				: __( 'None of the picked sources could be read. Describe what the FAQs should be about, or pick another source.', 'easy-accordion-free' );
			return new \WP_Error( 'sp_eab_ai_empty_prompt', $message, array( 'status' => 400 ) );
		}

		if ( empty( AI::connected_providers() ) ) {
			return new \WP_Error( 'sp_eab_ai_no_provider', AI::no_provider_message(), array( 'status' => 400 ) );
		}

		$count    = isset( $fields['numberOfFaqs'] ) ? min( max( (int) $fields['numberOfFaqs'], 1 ), self::MAX_FAQS ) : 5;
		$language = self::language( $fields );
		$existing = self::existing_questions( isset( $fields['existing'] ) ? (array) $fields['existing'] : array() );
		$per_faq  = in_array( $language, self::WIDE_SCRIPT_LANGUAGES, true ) ? self::TOKENS_PER_FAQ_WIDE : self::TOKENS_PER_FAQ;

		$answer = AI::complete_json(
			self::system_prompt(),
			self::user_prompt( $prompt, $keywords, $count, $language, $fields, $existing, FAQ_Sources::digest( $sources['docs'], $prompt . ' ' . $keywords ) ),
			$provider,
			array(
				'model'      => $model,
				'failover'   => false,
				'effort'     => 'low',
				'max_tokens' => self::TOKENS_REASONING + $count * $per_faq,
				'salvage'    => function ( $text ) {
					return self::salvage( $text );
				},
			)
		);

		if ( null === $answer ) {
			return self::provider_error();
		}

		$list = isset( $answer['faqs'] ) ? $answer['faqs'] : $answer;
		$faqs = self::clean_faqs( is_array( $list ) ? $list : array(), $existing );

		if ( empty( $faqs ) ) {
			return new \WP_Error( 'sp_eab_ai_invalid_json', __( 'The AI provider replied, but no FAQs could be read from the answer. Please try again.', 'easy-accordion-free' ), array( 'status' => 502 ) );
		}

		return array(
			'faqs'    => array_slice( $faqs, 0, $count ),
			'skipped' => $sources['skipped'],
		);
	}

	/**
	 * Rewrite one generated question or answer.
	 *
	 * Only that pair travels — no sources, no other FAQs — and the reply is one
	 * short field, so a rewrite costs a small fraction of a generation.
	 *
	 * @param array  $fields   `{ field: 'q'|'a', question, answer, instruction, language }`.
	 * @param string $provider Provider slug picked in the modal ('' for the Primary).
	 * @param string $model    Model of that provider ('' for its saved one).
	 * @return string|\WP_Error The rewritten question (plain text) or answer (inline HTML).
	 */
	public static function rewrite( array $fields, $provider = '', $model = '' ) {
		$is_question = isset( $fields['field'] ) && 'q' === $fields['field'];
		$question    = self::cap( sanitize_text_field( isset( $fields['question'] ) ? (string) $fields['question'] : '' ), self::QUESTION_MAX );
		$answer      = self::cap( trim( wp_strip_all_tags( isset( $fields['answer'] ) ? (string) $fields['answer'] : '' ) ), self::ANSWER_MAX );
		$instruction = self::cap( trim( isset( $fields['instruction'] ) ? (string) $fields['instruction'] : '' ), self::INSTRUCTION_MAX );
		$target      = $is_question ? $question : $answer;
		if ( '' === $instruction ) {
			$instruction = $is_question ? 'Make this question clearer.' : 'Make this sound more professional.';
		}

		if ( '' === $target ) {
			return new \WP_Error( 'sp_eab_ai_empty_prompt', __( 'There is nothing to rewrite.', 'easy-accordion-free' ), array( 'status' => 400 ) );
		}

		if ( empty( AI::connected_providers() ) ) {
			return new \WP_Error( 'sp_eab_ai_no_provider', AI::no_provider_message(), array( 'status' => 400 ) );
		}

		$language = self::LANGUAGES[ self::language( $fields ) ];
		$system   = $is_question
			? 'You edit one FAQ question. Return only JSON: {"text":"..."}. Follow the instruction, keep the meaning, write in ' . $language . ', one line ending with a question mark, no numbering.'
			: 'You edit one FAQ answer. Return only JSON: {"text":"..."}. Follow the instruction, keep the facts (add none that are not given), write in ' . $language . ', plain sentences, no markdown.';

		// The other half of the pair is context only; a long answer is cut short.
		$user = $is_question
			? "Instruction: {$instruction}\nQuestion: {$question}\nAnswer (context): " . self::cap( $answer, 400 )
			: "Instruction: {$instruction}\nQuestion (context): {$question}\nAnswer: {$answer}";

		$reply = AI::complete_json(
			$system,
			$user,
			$provider,
			array(
				'model'      => $model,
				'failover'   => false,
				'effort'     => 'low',
				'max_tokens' => self::TOKENS_REASONING + ( $is_question ? 120 : 600 ),
			)
		);

		if ( null === $reply ) {
			return self::provider_error();
		}

		$text = isset( $reply['text'] ) && is_scalar( $reply['text'] ) ? (string) $reply['text'] : '';
		$text = $is_question ? self::cap( sanitize_text_field( $text ), self::QUESTION_MAX ) : str_replace( "\n", '<br>', self::to_answer( $text ) );

		if ( '' === $text ) {
			return new \WP_Error( 'sp_eab_ai_invalid_json', __( 'The AI provider replied, but no rewrite could be read from the answer. Please try again.', 'easy-accordion-free' ), array( 'status' => 502 ) );
		}

		return $text;
	}

	/**
	 * The last provider failure as a 502 the modal can explain.
	 *
	 * @return \WP_Error
	 */
	private static function provider_error() {
		$error = AI::last_error();

		return new \WP_Error(
			'sp_eab_ai_provider_error',
			AI::format_error( $error ),
			array(
				'status'   => 502,
				'provider' => isset( $error['provider'] ) ? $error['provider'] : '',
				'label'    => isset( $error['label'] ) ? $error['label'] : '',
				'reason'   => AI::failure_reason( $error ),
			)
		);
	}

	/**
	 * The requested language key, English when unknown.
	 *
	 * @param array $fields Request fields.
	 * @return string
	 */
	private static function language( array $fields ) {
		return isset( $fields['language'], self::LANGUAGES[ $fields['language'] ] ) ? $fields['language'] : 'english';
	}

	/**
	 * Questions the block already holds, plain and capped.
	 *
	 * @param array $list Titles.
	 * @return string[]
	 */
	private static function existing_questions( array $list ) {
		$questions = array();
		foreach ( $list as $title ) {
			$title = is_scalar( $title ) ? self::cap( sanitize_text_field( (string) $title ), 120 ) : '';
			if ( '' !== $title ) {
				$questions[ self::question_key( $title ) ] = $title;
			}
		}

		return array_slice( array_values( $questions ), 0, self::MAX_EXISTING );
	}

	/**
	 * Read every complete `{ q, a }` pair out of a reply that is not valid JSON
	 * — typically one cut off at the token cap. The unfinished pair is lost,
	 * the finished ones are kept.
	 *
	 * @param string $text Reply text.
	 * @return array|null `{ faqs: [...] }`, or null when no pair is complete.
	 */
	private static function salvage( $text ) {
		$string = '"((?:[^"\\\\]|\\\\.)*)"';
		if ( ! preg_match_all( '/"(?:q|question|title)"\s*:\s*' . $string . '\s*,\s*"(?:a|answer|content)"\s*:\s*' . $string . '/s', (string) $text, $matches, PREG_SET_ORDER ) ) {
			return null;
		}

		$faqs = array();
		foreach ( $matches as $match ) {
			$question = json_decode( '"' . $match[1] . '"' );
			$answer   = json_decode( '"' . $match[2] . '"' );
			if ( is_string( $question ) && is_string( $answer ) ) {
				$faqs[] = array(
					'q' => $question,
					'a' => $answer,
				);
			}
		}

		return empty( $faqs ) ? null : array( 'faqs' => $faqs );
	}

	/**
	 * Clean the pairs the model wrote: plain-text questions, answers with
	 * inline markup only, no question twice or already in the block, capped
	 * at MAX_FAQS. `q` / `a`, `question` / `answer` and `title` / `content`
	 * are read as the same pair.
	 *
	 * @param array    $list     Model list.
	 * @param string[] $existing Questions the block already holds.
	 * @return array<int, array{question: string, answer: string}>
	 */
	private static function clean_faqs( array $list, array $existing = array() ) {
		$seen = array();
		foreach ( $existing as $title ) {
			$seen[ self::question_key( $title ) ] = true;
		}

		$faqs = array();
		foreach ( $list as $item ) {
			if ( count( $faqs ) >= self::MAX_FAQS ) {
				break;
			}
			if ( ! is_array( $item ) ) {
				continue;
			}

			$question = self::first_of( $item, array( 'q', 'question', 'title' ) );
			$answer   = self::first_of( $item, array( 'a', 'answer', 'content' ) );
			$question = is_scalar( $question ) ? self::cap( sanitize_text_field( (string) $question ), self::QUESTION_MAX ) : '';
			$answer   = self::to_answer( $answer );
			$key      = self::question_key( $question );

			if ( '' === $question || '' === $answer || isset( $seen[ $key ] ) ) {
				continue;
			}

			$seen[ $key ] = true;
			$faqs[]       = array(
				'question' => $question,
				'answer'   => str_replace( "\n", '<br>', $answer ),
			);
		}

		return $faqs;
	}

	/**
	 * The first of several keys an item carries.
	 *
	 * @param array    $item Item.
	 * @param string[] $keys Keys, in order of preference.
	 * @return mixed '' when none is set.
	 */
	private static function first_of( array $item, array $keys ) {
		foreach ( $keys as $key ) {
			if ( isset( $item[ $key ] ) ) {
				return $item[ $key ];
			}
		}

		return '';
	}

	/**
	 * Comparison key for spotting the same question twice.
	 *
	 * @param string $question Question.
	 * @return string
	 */
	private static function question_key( $question ) {
		$question = function_exists( 'mb_strtolower' ) ? mb_strtolower( $question ) : strtolower( $question );

		return (string) preg_replace( '/[^\p{L}\p{N}]+/u', '', $question );
	}

	/**
	 * An answer: inline markup only, paragraphs separated by a blank line.
	 *
	 * @param mixed $value Model value.
	 * @return string
	 */
	private static function to_answer( $value ) {
		if ( ! is_scalar( $value ) ) {
			return '';
		}

		$text = str_replace( array( "\r\n", "\r" ), "\n", (string) $value );
		$text = preg_replace( '@<(script|style)[^>]*?>.*?</\\1>@si', '', $text );
		$text = preg_replace( '#</p>\s*<p[^>]*>#i', "\n\n", $text );
		$text = preg_replace( '#</?p[^>]*>#i', '', $text );
		$text = wp_kses( $text, self::ANSWER_TAGS );
		$text = preg_replace( "/\n{3,}/", "\n\n", trim( $text ) );

		return self::cap( $text, self::ANSWER_MAX );
	}

	/**
	 * Cut a string to a length, multibyte-safe when possible.
	 *
	 * @param string $text   Text.
	 * @param int    $length Most characters kept.
	 * @return string
	 */
	private static function cap( $text, $length ) {
		return function_exists( 'mb_substr' ) ? mb_substr( $text, 0, $length ) : substr( $text, 0, $length );
	}

	/**
	 * The system instruction — short, since it is billed on every request.
	 *
	 * @return string
	 */
	private static function system_prompt() {
		return <<<'PROMPT'
You write website FAQs. Return only JSON: {"faqs":[{"q":"question","a":"answer"}]}
Rules: natural, distinct questions without numbering; answers of 2-3 concise sentences; use only facts from the topic and sources; never invent prices, dates, contact details or policies.
PROMPT;
	}

	/**
	 * The user message: what to write, in which language and tone, what the
	 * block already answers, and the digested sources.
	 *
	 * @param string   $prompt   Author's prompt.
	 * @param string   $keywords Keywords.
	 * @param int      $count    Number of FAQs.
	 * @param string   $language Language key.
	 * @param array    $fields   Modal fields.
	 * @param string[] $existing Questions the block already holds.
	 * @param string   $sources  FAQ_Sources::digest() text.
	 * @return string
	 */
	private static function user_prompt( $prompt, $keywords, $count, $language, array $fields, array $existing, $sources ) {
		$tone  = isset( $fields['tone'], self::TONES[ $fields['tone'] ] ) ? self::TONES[ $fields['tone'] ] : 'balanced';
		$lines = array( sprintf( 'Write %d FAQs in %s, %s tone.', $count, self::LANGUAGES[ $language ], $tone ) );

		if ( '' !== $prompt ) {
			$lines[] = 'Brief: ' . $prompt;
		}
		if ( '' !== $keywords ) {
			$lines[] = 'Keywords to use naturally: ' . $keywords;
		}
		if ( ! empty( $existing ) ) {
			$lines[] = 'Already answered, do not repeat: ' . implode( ' | ', $existing );
		}
		if ( '' !== $sources ) {
			$lines[] = "Sources:\n" . $sources;
		}

		return implode( "\n", $lines );
	}
}
