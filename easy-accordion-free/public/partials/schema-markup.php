<?php
/**
 * The Accordion FAQs schema markup template.
 *
 * @package easy_accordion_free
 */

if ( ! function_exists( 'sp_clean_schema' ) ) {
	/**
	 * Sp_clean_schema clean schema function.
	 *
	 * @param  mixed $string string.
	 * @return statement
	 */
	function sp_clean_schema( $string ) {
		$string = strip_shortcodes( $string );
		$string = strip_tags( $string, '<p><b><i><strong><em>' );
		$string = preg_replace( '/<p>\s*<\/p>|<b>\s*<\/b>|<i>\s*<\/i>|<strong>\s*<\/strong>|<em>\s*<\/em>/', '', $string );
		$string = preg_replace( '/\s+/', ' ', $string );
		$string = trim( $string );
		$string = str_replace( '"', '\"', $string );

		return $string;
	}
}

if ( ! function_exists( 'schema_markup' ) ) {
	/**
	 * Schema_markup
	 *
	 * @param  mixed $title title of the accordion.
	 * @param  mixed $content accordion content.
	 * @return statement
	 */
	function schema_markup( $title = null, $content = null ) {
		$title   = sp_clean_schema( $title );
		$content = sp_clean_schema( $content );
		$markup  = '{
			"@type": "Question",
			"name": "' . esc_html( $title ) . '",
			"acceptedAnswer": {
				"@type": "Answer",
				"text": "' . esc_html( $content ) . '"
			}
		}';
		return $markup;
	}
}

if ( ! function_exists( 'minify_markup' ) ) {
	/**
	 * Minify the provided HTML markup by removing unnecessary whitespace.
	 *
	 * @param string $markup The HTML markup to minify.
	 * @return string The minified HTML markup.
	 */
	function minify_markup( $markup ) {
		$markup = preg_replace( array( '/\>[^\S ]+/s', '/[^\S ]+\</s', '/(\s)+/s', '/\s*(<[^>]+>)\s*/' ), array( '>', '<', ' ', '$1' ), $markup );

		return trim( $markup );
	}
}

if ( $eap_schema_markup ) {
	$markup = '<script type="application/ld+json">
	{
		"@context": "https://schema.org",
		"@type": "FAQPage",
		"mainEntity": [';
	if ( 'content-accordion' === $accordion_type && is_array( $content_sources ) ) {
		foreach ( $content_sources as $keys => $content_source ) {
			$accordion_title     = $content_source['accordion_content_title'];
			$content_description = $content_source['accordion_content_description'];
			$markup             .= schema_markup( $accordion_title, $content_description );
			$keys++;
			if ( $keys !== $key ) {
				$markup .= ',';
			}
		}
	} elseif ( 'post-accordion' === $accordion_type ) {
		$post_schema_query = $post_query;
		$accordion_count   = 0;
		if ( $post_schema_query->have_posts() ) {
			while ( $post_schema_query->have_posts() ) {
				$post_schema_query->the_post();
				$key             = get_the_ID();
				$accordion_title = get_the_title( $key );
				$content_main    = get_the_content();
				$markup         .= schema_markup( $accordion_title, $content_main );
				++$accordion_count;
				if ( $count_total_post !== $accordion_count ) {
					$markup .= ',';
				}
			}
			wp_reset_postdata();
		}
	}
	$markup .= ']
	}
	</script>';
	echo minify_markup( $markup );
}
