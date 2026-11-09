<?php
/**
 * Generate FAQs with AI — reference sources.
 *
 * Reads the sources picked in the modal (pages, posts, products, URLs and
 * text files) as plain text and squeezes them into one fixed character
 * budget before anything is sent to a provider. The budget does not grow
 * with the number of sources: each source gets a share, a source shorter
 * than its share hands the rest on, repeated passages are sent once, and an
 * over-long source keeps the passages that match the prompt and keywords.
 * Input tokens are what a reference costs, so this is where most of a
 * request's credits are saved.
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
 * FAQ_Sources Class.
 *
 * @since 3.2.0
 */
class FAQ_Sources {

	/**
	 * Most pages, posts and products one request may reference.
	 */
	const MAX_POSTS = 10;

	/**
	 * Most URLs one request may reference.
	 */
	const MAX_URLS = 5;

	/**
	 * Most files one request may reference.
	 */
	const MAX_FILES = 5;

	/**
	 * Characters read from one source before it is compressed.
	 */
	const SOURCE_MAX = 60000;

	/**
	 * Characters of reference text sent with one request, all sources together
	 * (about 1,500 tokens). Filter `sp_eab_ai_faq_source_budget`.
	 */
	const BUDGET = 6000;

	/**
	 * Target passage length when a long paragraph is split.
	 */
	const PASSAGE = 400;

	/**
	 * How long a fetched URL's text is kept, in seconds.
	 */
	const URL_CACHE_TTL = 21600;

	/**
	 * Words too common to tell passages apart.
	 */
	const STOPWORDS = array( 'the', 'and', 'for', 'are', 'but', 'not', 'you', 'your', 'with', 'this', 'that', 'from', 'they', 'have', 'has', 'was', 'were', 'will', 'what', 'when', 'where', 'which', 'who', 'how', 'why', 'can', 'all', 'any', 'our', 'out', 'about', 'into', 'than', 'then', 'them', 'their', 'there', 'these', 'those', 'its', 'also', 'more', 'most', 'some', 'such', 'only', 'other', 'each', 'make', 'faq', 'faqs', 'question', 'questions', 'answer', 'answers', 'generate', 'write', 'create', 'focus', 'please' );

	/**
	 * Read every source as `{ label, text }`.
	 *
	 * @param int[]    $post_ids Page, post and product ids.
	 * @param string[] $urls     URLs.
	 * @param array    $files    `{ name, content }` text files read in the browser.
	 * @return array{docs: array<int, array{label: string, text: string}>, skipped: string[]}
	 */
	public static function collect( array $post_ids, array $urls, array $files ) {
		$docs    = array();
		$skipped = array();

		foreach ( array_slice( array_unique( array_map( 'absint', $post_ids ) ), 0, self::MAX_POSTS ) as $post_id ) {
			$doc = $post_id ? self::post_doc( $post_id ) : null;
			if ( $doc ) {
				$docs[] = $doc;
			} elseif ( $post_id ) {
				/* translators: %d: post id. */
				$skipped[] = sprintf( __( 'Post #%d', 'easy-accordion-free' ), $post_id );
			}
		}

		foreach ( array_slice( array_unique( array_map( 'trim', array_map( 'strval', $urls ) ) ), 0, self::MAX_URLS ) as $url ) {
			$doc = '' !== $url ? self::url_doc( $url ) : null;
			if ( $doc ) {
				$docs[] = $doc;
			} elseif ( '' !== $url ) {
				$skipped[] = $url;
			}
		}

		foreach ( array_slice( $files, 0, self::MAX_FILES ) as $file ) {
			$doc = is_array( $file ) ? self::file_doc( $file ) : null;
			if ( $doc ) {
				$docs[] = $doc;
			} elseif ( is_array( $file ) && ! empty( $file['name'] ) ) {
				$skipped[] = sanitize_file_name( (string) $file['name'] );
			}
		}

		return array(
			'docs'    => $docs,
			'skipped' => $skipped,
		);
	}

	/**
	 * Fit the sources into the budget, as one block of text.
	 *
	 * @param array  $docs  `{ label, text }` list from collect().
	 * @param string $focus Prompt and keywords — what the FAQs are about.
	 * @return string '' when there is nothing to send.
	 */
	public static function digest( array $docs, $focus ) {
		if ( empty( $docs ) ) {
			return '';
		}

		/**
		 * Filter the characters of reference text one FAQ request may send.
		 *
		 * @param int $budget Characters, all sources together.
		 */
		$budget = max( 1000, (int) apply_filters( 'sp_eab_ai_faq_source_budget', self::BUDGET ) );
		$terms  = self::terms( $focus );

		// Passages per source, a passage already seen in an earlier source dropped.
		$seen     = array();
		$passages = array();
		foreach ( $docs as $index => $doc ) {
			$passages[ $index ] = array();
			foreach ( self::passages( $doc['text'] ) as $passage ) {
				$key = md5( self::normalize( $passage ) );
				if ( isset( $seen[ $key ] ) ) {
					continue;
				}
				$seen[ $key ]         = true;
				$passages[ $index ][] = $passage;
			}
		}

		// An even share each; a short source hands what it leaves on to the rest.
		$shares  = array();
		$pending = array_keys( $docs );
		$left    = $budget;
		while ( ! empty( $pending ) ) {
			$share = (int) floor( $left / count( $pending ) );
			$fits  = array();
			foreach ( $pending as $index ) {
				$length = self::length( implode( "\n", $passages[ $index ] ) );
				if ( $length <= $share ) {
					$fits[ $index ] = $length;
				}
			}
			if ( empty( $fits ) ) {
				foreach ( $pending as $index ) {
					$shares[ $index ] = $share;
				}
				break;
			}
			foreach ( $fits as $index => $length ) {
				$shares[ $index ] = $length;
				$left            -= $length;
			}
			$pending = array_values( array_diff( $pending, array_keys( $fits ) ) );
		}

		$blocks = array();
		foreach ( $docs as $index => $doc ) {
			$text = self::select( $passages[ $index ], $terms, $shares[ $index ] );
			if ( '' !== $text ) {
				$blocks[] = '[' . $doc['label'] . "]\n" . $text;
			}
		}

		return implode( "\n\n", $blocks );
	}

	/**
	 * A page, post or product the user may read.
	 *
	 * @param int $post_id Post id.
	 * @return array{label: string, text: string}|null
	 */
	private static function post_doc( $post_id ) {
		$post = get_post( $post_id );
		if ( ! $post || in_array( $post->post_status, array( 'trash', 'auto-draft', 'inherit' ), true ) || ! current_user_can( 'read_post', $post_id ) ) {
			return null;
		}

		$type  = get_post_type_object( $post->post_type );
		$title = html_entity_decode( wp_strip_all_tags( get_the_title( $post ) ), ENT_QUOTES, 'UTF-8' );
		$parts = array( $title );

		if ( '' !== trim( (string) $post->post_excerpt ) ) {
			$parts[] = self::html_to_text( $post->post_excerpt );
		}

		if ( 'product' === $post->post_type && function_exists( 'wc_get_product' ) ) {
			$product = wc_get_product( $post_id );
			if ( $product && '' !== (string) $product->get_price() ) {
				$parts[] = 'Price: ' . wp_strip_all_tags( html_entity_decode( wc_price( $product->get_price() ), ENT_QUOTES, 'UTF-8' ) );
			}
		}

		$parts[] = self::html_to_text( strip_shortcodes( (string) $post->post_content ) );
		$text    = trim( implode( "\n", array_filter( $parts ) ) );
		if ( '' === $text ) {
			return null;
		}

		return array(
			'label' => ( $type ? $type->labels->singular_name : __( 'Post', 'easy-accordion-free' ) ) . ': ' . $title,
			'text'  => self::cap( $text, self::SOURCE_MAX ),
		);
	}

	/**
	 * A web page. A URL of this site is read from the database; any other is
	 * fetched once (wp_safe_remote_get(), so no private or local address) and
	 * its text kept for URL_CACHE_TTL.
	 *
	 * @param string $url URL.
	 * @return array{label: string, text: string}|null
	 */
	private static function url_doc( $url ) {
		$url = esc_url_raw( $url, array( 'http', 'https' ) );
		if ( '' === $url || ! wp_http_validate_url( $url ) ) {
			return null;
		}

		$post_id = url_to_postid( $url );
		if ( $post_id ) {
			return self::post_doc( $post_id );
		}

		$cache_key = 'sp_eab_ai_src_' . md5( $url );
		$cached    = get_transient( $cache_key );
		if ( is_array( $cached ) && isset( $cached['label'], $cached['text'] ) ) {
			return $cached;
		}

		$response = wp_safe_remote_get(
			$url,
			array(
				'timeout'             => 10,
				'redirection'         => 3,
				'limit_response_size' => 1048576,
				'user-agent'          => 'Easy Accordion FAQ Generator; ' . home_url( '/' ),
			)
		);
		if ( is_wp_error( $response ) || 200 !== (int) wp_remote_retrieve_response_code( $response ) ) {
			return null;
		}

		$type = (string) wp_remote_retrieve_header( $response, 'content-type' );
		$body = (string) wp_remote_retrieve_body( $response );
		if ( '' !== $type && false === stripos( $type, 'html' ) && false === stripos( $type, 'text/' ) ) {
			return null;
		}

		$title = '';
		if ( preg_match( '#<title[^>]*>(.*?)</title>#is', $body, $match ) ) {
			$title = trim( html_entity_decode( wp_strip_all_tags( $match[1] ), ENT_QUOTES, 'UTF-8' ) );
		}

		$text = ( '' === $type || false !== stripos( $type, 'html' ) ) ? self::html_to_text( $body ) : self::plain( $body );
		if ( '' === $text ) {
			return null;
		}

		$doc = array(
			'label' => 'URL: ' . ( '' !== $title ? $title : $url ),
			'text'  => self::cap( $text, self::SOURCE_MAX ),
		);
		set_transient( $cache_key, $doc, self::URL_CACHE_TTL );

		return $doc;
	}

	/**
	 * A text file the browser read (.txt, .md, .csv, .json, .html).
	 *
	 * @param array $file `{ name, content }`.
	 * @return array{label: string, text: string}|null
	 */
	private static function file_doc( array $file ) {
		$name    = isset( $file['name'] ) ? sanitize_file_name( (string) $file['name'] ) : '';
		$content = isset( $file['content'] ) && is_string( $file['content'] ) ? self::cap( $file['content'], self::SOURCE_MAX * 2 ) : '';
		if ( '' === trim( $content ) ) {
			return null;
		}

		$text = preg_match( '/\.html?$/i', $name ) ? self::html_to_text( $content ) : self::plain( $content );
		if ( '' === $text ) {
			return null;
		}

		return array(
			'label' => 'File: ' . $name,
			'text'  => self::cap( $text, self::SOURCE_MAX ),
		);
	}

	/**
	 * Readable text of an HTML document or fragment: no markup, no scripts or
	 * page chrome, the main content when the page marks one, line breaks kept
	 * between blocks.
	 *
	 * @param string $html HTML.
	 * @return string
	 */
	private static function html_to_text( $html ) {
		$html  = (string) $html;
		$clean = preg_replace( '#<(script|style|noscript|svg|template|iframe|nav|header|footer|aside|form)\b[^>]*>.*?</\1>#is', ' ', $html );
		$html  = is_string( $clean ) ? $clean : $html;

		if ( preg_match( '#<main\b[^>]*>(.*)</main>#is', $html, $match ) || preg_match( '#<article\b[^>]*>(.*)</article>#is', $html, $match ) || preg_match( '#<body\b[^>]*>(.*)</body>#is', $html, $match ) ) {
			$html = $match[1];
		}

		$html = preg_replace( '#<(br|/p|/div|/li|/h[1-6]|/tr|/dt|/dd|/section|/blockquote)\b[^>]*>#i', "\n", $html );
		$text = html_entity_decode( wp_strip_all_tags( (string) $html ), ENT_QUOTES | ENT_HTML5, 'UTF-8' );

		return self::plain( $text );
	}

	/**
	 * Whitespace-normalized plain text, one passage per line.
	 *
	 * @param string $text Text.
	 * @return string
	 */
	private static function plain( $text ) {
		$text = str_replace( array( "\r\n", "\r" ), "\n", (string) $text );
		$text = preg_replace( '/[ \t\x{00A0}]+/u', ' ', $text );
		$text = preg_replace( '/ *\n */', "\n", (string) $text );
		$text = preg_replace( "/\n{2,}/", "\n", (string) $text );

		return trim( (string) $text );
	}

	/**
	 * Split text into passages: one per paragraph, a long paragraph cut at
	 * sentence ends near PASSAGE characters, a heading-length line joined to
	 * the passage after it.
	 *
	 * @param string $text Text.
	 * @return string[]
	 */
	private static function passages( $text ) {
		$passages = array();
		$heading  = '';
		foreach ( explode( "\n", (string) $text ) as $line ) {
			$line = trim( $line );
			if ( '' === $line ) {
				continue;
			}
			if ( self::length( $line ) < 60 && ! preg_match( '/[.!?。！？]$/u', $line ) ) {
				$heading = trim( $heading . ' ' . $line );
				continue;
			}

			$line    = '' !== $heading ? $heading . ': ' . $line : $line;
			$heading = '';
			if ( self::length( $line ) <= self::PASSAGE * 1.5 ) {
				$passages[] = $line;
				continue;
			}

			$chunk = '';
			foreach ( preg_split( '/(?<=[.!?。！？])\s+/u', $line ) as $sentence ) {
				if ( '' !== $chunk && self::length( $chunk . ' ' . $sentence ) > self::PASSAGE ) {
					$passages[] = $chunk;
					$chunk      = '';
				}
				$chunk = trim( $chunk . ' ' . $sentence );
			}
			if ( '' !== $chunk ) {
				$passages[] = $chunk;
			}
		}
		if ( '' !== $heading ) {
			$passages[] = $heading;
		}

		return $passages;
	}

	/**
	 * The passages of one source that fit its share, in reading order. With
	 * focus terms the best-matching passages win (the opening two get a small
	 * lead, since they usually say what the page is); without, the source is
	 * read from the top.
	 *
	 * @param string[] $passages Passages.
	 * @param string[] $terms    Focus terms.
	 * @param int      $share    Characters allowed.
	 * @return string
	 */
	private static function select( array $passages, array $terms, $share ) {
		if ( empty( $passages ) || $share <= 0 ) {
			return '';
		}

		$order = array_keys( $passages );
		if ( ! empty( $terms ) && self::length( implode( "\n", $passages ) ) > $share ) {
			$scores = array();
			foreach ( $passages as $index => $passage ) {
				$score = $index < 2 ? 1 : 0;
				foreach ( $terms as $term ) {
					if ( false !== self::contains( $passage, $term ) ) {
						$score += 2;
					}
				}
				$scores[ $index ] = $score;
			}
			usort(
				$order,
				function ( $a, $b ) use ( $scores ) {
					return $scores[ $b ] === $scores[ $a ] ? $a - $b : $scores[ $b ] - $scores[ $a ];
				}
			);
		}

		$picked = array();
		$used   = 0;
		foreach ( $order as $index ) {
			$length = self::length( $passages[ $index ] ) + 1;
			if ( $used + $length > $share ) {
				if ( empty( $picked ) ) {
					$picked[ $index ] = self::cap( $passages[ $index ], $share );
					break;
				}
				continue;
			}
			$picked[ $index ] = $passages[ $index ];
			$used            += $length;
		}
		ksort( $picked );

		return implode( "\n", $picked );
	}

	/**
	 * Distinct words of the prompt and keywords worth matching on.
	 *
	 * @param string $focus Prompt and keywords.
	 * @return string[]
	 */
	private static function terms( $focus ) {
		$focus = function_exists( 'mb_strtolower' ) ? mb_strtolower( (string) $focus ) : strtolower( (string) $focus );
		$words = preg_split( '/[^\p{L}\p{N}]+/u', $focus, -1, PREG_SPLIT_NO_EMPTY );
		$terms = array();
		foreach ( (array) $words as $word ) {
			if ( self::length( $word ) >= 3 && ! in_array( $word, self::STOPWORDS, true ) ) {
				$terms[ $word ] = true;
			}
		}

		return array_slice( array_keys( $terms ), 0, 30 );
	}

	/**
	 * Case-insensitive lookup, multibyte-safe when possible.
	 *
	 * @param string $haystack Text.
	 * @param string $needle   Term.
	 * @return int|false
	 */
	private static function contains( $haystack, $needle ) {
		return function_exists( 'mb_stripos' ) ? mb_stripos( $haystack, $needle ) : stripos( $haystack, $needle );
	}

	/**
	 * Comparison key for spotting the same passage twice.
	 *
	 * @param string $text Text.
	 * @return string
	 */
	private static function normalize( $text ) {
		$text = function_exists( 'mb_strtolower' ) ? mb_strtolower( $text ) : strtolower( $text );

		return (string) preg_replace( '/[^\p{L}\p{N}]+/u', '', $text );
	}

	/**
	 * Character length, multibyte-safe when possible.
	 *
	 * @param string $text Text.
	 * @return int
	 */
	private static function length( $text ) {
		return function_exists( 'mb_strlen' ) ? mb_strlen( $text ) : strlen( $text );
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
}
