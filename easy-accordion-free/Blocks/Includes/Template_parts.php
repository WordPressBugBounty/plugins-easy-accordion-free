<?php
/**
 * Block Name Template Parts File.
 *
 * Description of what this template does.
 *
 * @since 3.2.0
 * @version 1.0.0
 *
 * @package EasyAccordionPro/Blocks
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes;

if ( ! defined( 'ABSPATH' ) ) {
	die;
}

use PhpMyAdmin\SqlParser\Statement;

class Template_parts {

	/**
	 * Truncate_text
	 *
	 * @param  mixed $text text.
	 * @param  mixed $limit limit.
	 * @return string
	 */
	private static function truncate_text( $text, $limit ) {
		if ( empty( $text ) || $limit <= 0 ) {
			return $text;
		}

		// Normalize whitespace.
		$text  = trim( wp_strip_all_tags( $text ) );
		$words = preg_split( '/\s+/u', $text );

		if ( count( $words ) <= $limit ) {
			return $text;
		}

		return implode( ' ', array_slice( $words, 0, $limit ) ) . '…';
	}


	/**
	 * Bool_attr
	 *
	 * @param  mixed $condition condition.
	 * @param  mixed $attr data attr.
	 * @return statement
	 */
	private static function bool_attr( $condition, $attr ) {
		return $condition ? $attr : '';
	}

	/**
	 * Accordion_post_header_renderer
	 *
	 * @param  mixed $data accordion header data.
	 * @param  mixed $image_data accordion image data.
	 * @return Statement
	 */
	public static function accordion_post_header_renderer( $data, $image_data ) {
		$title                 = $data['title'] ?? __( 'No Title Found!', 'easy-accordion-free' );
		$link                  = $data['link'] ?? '';
		$author_url            = $data['author_url'] ?? '';
		$author                = $data['author'] ?? '';
		$post_date             = $data['post_date'] ?? '';
		$category_list         = $data['category_list'] ?? '';
		$toggle_icons_set      = $data['toggleIconsSet'] ?? array();
		$enable_toggle_icon    = (bool) ( $data['enableExpandAndCollapseIcon'] ?? true );
		$toggle_icon_position  = $data['toggleIconPosition'] ?? 'end';
		$link_open_new_tab     = (bool) ( $data['linkOpenNewTab'] ?? false );
		$link_post_title       = (bool) ( $data['linkPostTitle'] ?? false );
		$title_length_mode     = $data['postTitleLenght'] ?? '';
		$title_length_limit    = (int) ( $data['postTitleLenghtNumber']['value'] ?? 0 );
		$meta_display_position = $data['metaDisplayPosition'] ?? '';
		$meta_data_options     = $data['metaDataOptions'] ?? array();

		/* Title truncate */
		$final_title = $title;
		if ( 'limit' === $title_length_mode && $title_length_limit > 0 ) {
			$final_title = self::truncate_text( $final_title, $title_length_limit );
		}

		/* Toggle animation set */
		$toggle_rotate_sets = in_array(
			$toggle_icons_set['set'] ?? null,
			array( 1, 4, 5, 6, 9, 10, 12 ),
			true
		);

		ob_start();
		?>
		<span class="sp-eab-accordion-header-wrapper sp-d-flex sp-align-center eab-icon-position-<?php echo esc_attr( $toggle_icon_position ); ?>">
			<span class="sp-eab-accordion-header-start sp-d-flex sp-align-center sp-gap-20px">
				<span class="sp-eab-title-subtitle-wrapper sp-d-flex sp-flex-col">

					<span class="sp-eab-accordion-title-wrapper">
						<?php echo esc_html( $final_title ); ?>
					</span>
				</span>
			</span>

			<span class="sp-eab-accordion-header-end <?php echo $toggle_rotate_sets ? 'eab-icon-animated' : 'eab-icon-static'; ?>">
				<?php if ( $enable_toggle_icon ) : ?>
					<span class="sp-eab-expand-collapse-icon">
						<span class="sp-eab-expand-icon <?php echo esc_attr( $toggle_icons_set['expand'] ?? '' ); ?>"></span>
						<span class="sp-eab-collapse-icon <?php echo esc_attr( $toggle_icons_set['collapse'] ?? '' ); ?>"></span>
					</span>
				<?php endif; ?>
			</span>
		</span>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render_metadata
	 *
	 * @param  mixed $data meta data attrs.
	 * @return statement
	 */
	public static function render_metadata( $data ) {
		$author_url        = $data['author_url'] ?? '';
		$author            = $data['author'] ?? '';
		$post_date         = $data['post_date'] ?? '';
		$category_list     = $data['category_list'] ?? '';
		$meta_data_options = $data['metaDataOptions'] ?? array();
		$block_type        = isset( $data['block_type'] ) ? $data['block_type'] : 'post-accordion';

		if ( empty( $meta_data_options ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="sp-meta-data sp-eab-post-meta-details sp-d-flex">
			<span class="sp-eab-post-details sp-d-flex sp-gap-10px <?php echo 'product-accordion' === $block_type ? 'sp-flex-col' : ''; ?>">
				<?php foreach ( $meta_data_options as $meta ) : ?>
					<?php
					if ( empty( $meta['isActive'] ) ) {
						continue;
					}
					?>

					<?php if ( 'author' === $meta['value'] && $author ) : ?>
						<span class="sp-eab-post-meta sp-eab-post-author">
							<a href="<?php echo esc_url( $author_url ); ?>" target="_blank" rel="noopener noreferrer">
								<span class="sp-eab-post-meta-icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Layer_1" x="0px" y="0px" viewBox="0 0 24 24" xml:space="preserve" fill="currentColor">
										<g>
											<path d="M12,11.8c-2.6,0-4.8-2.1-4.8-4.8S9.4,2.2,12,2.2s4.8,2.1,4.8,4.8S14.6,11.8,12,11.8z M12,3.8c-1.8,0-3.2,1.5-3.2,3.2   s1.5,3.2,3.2,3.2s3.2-1.5,3.2-3.2S13.8,3.8,12,3.8z"></path>
										</g>
										<g>
											<path d="M17,21.8H7c-1.5,0-2.8-1.2-2.8-2.8c0-3.2,2.6-5.8,5.8-5.8h4c3.2,0,5.8,2.6,5.8,5.8C19.8,20.5,18.5,21.8,17,21.8z M10,14.8   c-2.3,0-4.2,1.9-4.2,4.2c0,0.7,0.6,1.2,1.2,1.2h10c0.7,0,1.2-0.6,1.2-1.2c0-2.3-1.9-4.2-4.2-4.2H10z"></path>
										</g>
									</svg></span>
								<span class="sp-eab-post-meta-text"><?php echo esc_html( $author ); ?></span>
							</a>
						</span>
					<?php endif; ?>

					<?php if ( 'category' === $meta['value'] && $category_list ) : ?>
						<span class="sp-eab-post-meta sp-metadata-taxonomy">
							<?php
							if ( 'product-accordion' === $block_type ) {
								esc_html_e( 'Categories: ', 'easy-accordion-free' );
							} else {
								?>
								<span class="sp-metadata-taxonomy-icon sp-eab-post-meta-icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Layer_1" x="0px" y="0px" width="14px" height="14px" viewBox="0 0 24 24" xml:space="preserve" fill="currentColor">
										<g>
											<path d="M2,19.8c-0.4,0-0.8-0.3-0.8-0.8V7.5c0-1.5,0-2.3,0.3-3c0.4-0.9,1.1-1.6,2-2c0.7-0.3,1.5-0.3,3-0.3H7c0.8,0,1.6,0.4,2.1,1   l1.6,2H16c1.5,0,2.3,0,3,0.4c0.6,0.3,1.1,0.8,1.4,1.4c0.4,0.7,0.4,1.5,0.4,3v1c0,0.4-0.3,0.8-0.8,0.8s-0.8-0.3-0.8-0.8v-1   c0-1.2,0-1.9-0.2-2.3c-0.2-0.3-0.4-0.6-0.8-0.8c-0.4-0.2-1.1-0.2-2.3-0.2h-5.6c0,0,0,0,0,0H7C6.6,6.8,6.2,6.4,6.2,6S6.6,5.2,7,5.2   h1.9L8,4.2C7.8,3.9,7.4,3.8,7,3.8H6.5c-1.3,0-2,0-2.4,0.2c-0.5,0.2-1,0.6-1.2,1.2C2.8,5.5,2.8,6.2,2.8,7.5V19   C2.8,19.4,2.4,19.8,2,19.8z"></path>
										</g>
										<g>
											<path d="M14.9,21.8H6.9c-2.9,0-4.4,0-5.3-1.2c-0.8-1.2-0.2-2.7,0.8-5.3l0.7,0.3l-0.7-0.3l0.3-0.7c0.8-1.9,1.2-3,2.1-3.6   c1-0.6,2.1-0.6,4.1-0.6h8.1c2.9,0,4.4,0,5.2,1.2c0.8,1.2,0.2,2.7-0.8,5.3l-0.3,0.7c-0.8,1.9-1.2,3-2.1,3.6   C18.1,21.8,17,21.8,14.9,21.8z M9.1,11.8c-1.8,0-2.7,0-3.3,0.4c-0.6,0.4-0.9,1.2-1.6,2.9l-0.3,0.7l0,0l0,0c-0.8,2.1-1.3,3.4-1,3.9   c0.4,0.6,1.7,0.6,4,0.6h8.1c1.8,0,2.7,0,3.3-0.4c0.6-0.4,0.9-1.2,1.6-2.9l0.3-0.7c0.8-2.1,1.3-3.4,1-3.9c-0.4-0.6-1.7-0.6-4-0.6   H9.1z"></path>
										</g>
									</svg></span>
								<?php
							}
							?>

							<?php echo self::render_category($category_list); // phpcs:ignore 
							?>
						</span>
					<?php endif; ?>

					<?php if ( 'date' === $meta['value'] && $post_date ) : ?>
						<span class="sp-eab-post-meta sp-eab-post-date">
							<span class="sp-eab-post-meta-icon"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" id="Layer_1" x="0px" y="0px" viewBox="0 0 24 24" xml:space="preserve" fill="currentColor">
									<g>
										<path d="M18,4.8c-0.4,0-0.8-0.3-0.8-0.8V2c0-0.4,0.3-0.8,0.8-0.8s0.8,0.3,0.8,0.8v2C18.8,4.4,18.4,4.8,18,4.8z M6,4.8   C5.6,4.8,5.2,4.4,5.2,4V2c0-0.4,0.3-0.8,0.8-0.8S6.8,1.6,6.8,2v2C6.8,4.4,6.4,4.8,6,4.8z"></path>
									</g>
									<g>
										<path d="M12,18c-0.6,0-1-0.4-1-1s0.4-1,1-1h0c0.6,0,1,0.4,1,1S12.6,18,12,18z M8,18c-0.6,0-1-0.4-1-1s0.4-1,1-1h0c0.6,0,1,0.4,1,1   S8.6,18,8,18z M16,14c-0.6,0-1-0.4-1-1c0-0.6,0.4-1,1-1h0c0.6,0,1,0.4,1,1C17,13.6,16.6,14,16,14z M12,14c-0.6,0-1-0.4-1-1   c0-0.6,0.4-1,1-1h0c0.6,0,1,0.4,1,1C13,13.6,12.6,14,12,14z M8,14c-0.6,0-1-0.4-1-1c0-0.6,0.4-1,1-1h0c0.6,0,1,0.4,1,1   C9,13.6,8.6,14,8,14z"></path>
									</g>
									<g>
										<path d="M20.5,8.8h-17C3.1,8.8,2.8,8.4,2.8,8s0.3-0.8,0.8-0.8h17c0.4,0,0.8,0.3,0.8,0.8S20.9,8.8,20.5,8.8z"></path>
									</g>
									<g>
										<path d="M13,22.8H11c-4.2,0-6.4,0-7.8-1.6c-1.5-1.6-1.5-3.9-1.5-8.4v-0.5c0-4.5,0-6.8,1.5-8.4C4.7,2.2,6.8,2.2,11,2.2H13   c4.2,0,6.4,0,7.8,1.6c1.5,1.6,1.5,3.9,1.5,8.4v0.5c0,4.5,0,6.8-1.5,8.4C19.3,22.8,17.2,22.8,13,22.8z M11,3.8c-3.8,0-5.7,0-6.7,1.1   C3.2,6,3.2,8.1,3.2,12.2v0.5c0,4.2,0,6.2,1.1,7.4c1,1.1,2.9,1.1,6.7,1.1H13c3.8,0,5.7,0,6.7-1.1c1.1-1.1,1.1-3.2,1.1-7.4v-0.5   c0-4.2,0-6.2-1.1-7.4c-1-1.1-2.9-1.1-6.7-1.1H11z"></path>
									</g>
									<g>
										<path d="M21,8.8H3C2.6,8.8,2.2,8.4,2.2,8S2.6,7.2,3,7.2h18c0.4,0,0.8,0.3,0.8,0.8S21.4,8.8,21,8.8z"></path>
									</g>
								</svg></span>
							<span class="sp-eab-post-meta-text">
								<?php echo esc_html( $post_date['default'] ); ?>
							</span>

						</span>
					<?php endif; ?>
				<?php endforeach; ?>
			</span>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render_category
	 *
	 * @param  mixed $category_list category list.
	 * @return statement
	 */
	public static function render_category( $category_list ) {
		if ( empty( $category_list ) ) {
			return '';
		}

		return sprintf(
			'<span class="sp-eab-post-meta-text">%s</span>',
			wp_kses_post( $category_list )
		);
	}

	/**
	 * Render_excerpt
	 *
	 * @param  mixed $excerpt excerpt.
	 * @param  mixed $excerpt_limit excerpt limit.
	 * @param  mixed $excerpt_length lenght type.
	 * @return Statement
	 */
	public static function render_excerpt( $excerpt, $excerpt_limit, $excerpt_length ) {
		if ( empty( $excerpt ) ) {
			return '';
		}

		if ( 'limit' === $excerpt_length && ! empty( $excerpt_limit['value'] ) ) {
			$limit = (int) $excerpt_limit['value'];

			if ( 'words' === ( $excerpt_limit['unit'] ?? '' ) ) {
				$excerpt = wp_trim_words( $excerpt, $limit, '...' );
			} else {
				$excerpt = self::truncate_text( wp_strip_all_tags( $excerpt ), $limit );
			}
		}

		return sprintf(
			'<div class="sp-eab-post-excerpt-wrapper"><div class="sp-eab-post-excerpt">%s</div></div>',
			wp_kses_post( $excerpt )
		);
	}

	/**
	 * Render_featured_image
	 *
	 * @param  mixed $data image data.
	 * @param  mixed $link link.
	 * @param  mixed $block_name block name.
	 * @return statement
	 */
	public static function render_featured_image( $data, $link = '', $block_name = '' ) {
		$post_id    = absint( $data['post_id'] ?? 0 );
		$image_alt  = $data['image_alt'] ?? '';
		$post_title = $data['postTitle'] ?? '';
		$link_mode  = $data['generalLinkOpen'] ?? '';
		if ( ! $post_id ) {
			return '';
		}

		$thumb_id = get_post_thumbnail_id( $post_id );
		if ( 'product-accordion' === $block_name && ! $thumb_id ) {
			$thumb_id = get_option( 'woocommerce_placeholder_image', 0 );
		}

		if ( ! $thumb_id ) {
			return '';
		}

		// Image size (fallback to thumbnail).
		$image_size = $data['image_size'] ?? 'thumbnail';

		// Get image src.
		$image = wp_get_attachment_image_src( $thumb_id, $image_size );

		if ( ! $image ) {
			return '';
		}

		$image_url = $image[0];

		// Srcset & sizes (auto generated).
		$srcset = wp_get_attachment_image_srcset( $thumb_id, $image_size );
		$sizes  = wp_get_attachment_image_sizes( $thumb_id, $image_size );

		// Alt fallback logic.
		if ( empty( $image_alt ) ) {
			$image_alt = get_post_meta( $thumb_id, '_wp_attachment_image_alt', true );
		}

		$image_alt = $image_alt ?? $post_title;

		// Link handling.
		$is_real_link = in_array( $link_mode, array( 'current-tab', 'new-tab' ), true );
		$tag          = $is_real_link ? 'a' : 'div';

		ob_start();
		?>
		<<?php echo tag_escape( $tag ); ?>
			class="sp-eab-featured-image-wrapper"
			<?php if ( $is_real_link ) : ?>
			href="<?php echo esc_url( $link ); ?>"
			target="<?php echo esc_attr( 'new-tab' === $link_mode ? '_blank' : '_self' ); ?>"
			rel="noopener noreferrer"
			<?php endif; ?>>
			<img
				src="<?php echo esc_url( $image_url ); ?>"
				alt="<?php echo esc_attr( $image_alt ); ?>"
				<?php if ( $srcset ) : ?>
				srcset="<?php echo esc_attr( $srcset ); ?>"
				<?php endif; ?>
				<?php if ( $sizes ) : ?>
				sizes="<?php echo esc_attr( $sizes ); ?>"
				<?php endif; ?>
				loading="lazy"
				decoding="async" />
			<?php if ( $data['show_badge'] && ! empty( $data['badge_text'] ) ) { ?>
				<span class="sp-eab-sale-badge">
					<?php echo wp_kses_post( $data['badge_text'] ); ?>
				</span>
			<?php } ?>
		</<?php echo tag_escape( $tag ); ?>>
		<?php
		return ob_get_clean();
	}

	/**
	 * Render_read_more_button
	 *
	 * @param  mixed $link read more link.
	 * @param  mixed $open_new_tab link on open tab.
	 * @return statement
	 */
	public static function render_read_more_button( $link, $open_new_tab = false ) {
		if ( ! $link ) {
			return '';
		}

		return sprintf(
			'<div class="sp-eab-post-read-more-button">
				<a class="sp-eab-post-read-more-btn-link" href="%s" target="%s" rel="noopener noreferrer">%s</a>
			</div>',
			esc_url( $link ),
			$open_new_tab ? '_blank' : '_self',
			esc_html__( 'Read More', 'easy-accordion-free' )
		);
	}

	/**
	 * Eab_render_rating stars
	 *
	 * @param  mixed $rating rating.
	 * @return statement
	 */
	public static function eab_render_stars( $rating = 0 ) {
		$rating      = floatval( $rating );
		$full_stars  = floor( $rating );
		$has_half    = ( $rating - $full_stars ) >= 0.5;
		$empty_stars = 5 - $full_stars - ( $has_half ? 1 : 0 );

		ob_start();
		?>
		<div class="eab-stars">
			<?php for ( $i = 0; $i < $full_stars; $i++ ) : ?>
				<span class="eab-star full">★</span>
			<?php endfor; ?>

			<?php if ( $has_half ) : ?>
				<span class="eab-star half">★</span>
			<?php endif; ?>

			<?php for ( $i = 0; $i < $empty_stars; $i++ ) : ?>
				<span class="eab-star empty">★</span>
			<?php endfor; ?>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Eab_render_review_data
	 *
	 * @param  mixed $product product.
	 * @return statement
	 */
	public static function eab_render_review_data( $product ) {
		if ( empty( $product['average_rating'] ) || empty( $product['review_count'] ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="eab-product-review">
			<?php echo self::eab_render_stars( $product['average_rating'] ); //phpcs:ignore ?>
			<span class="eab-review-text">
				(
				<?php
					echo esc_html( $product['review_count'] );
					esc_html_e( ' reviews', 'easy-accordion-free' );
				?>
				)
			</span>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Eab_render_price_data
	 *
	 * @param  mixed $product product.
	 * @return statement
	 */
	public static function eab_render_price_data( $product ) {
		if ( empty( $product['product_price'] ) ) {
			return '';
		}

		return sprintf(
			'<div class="eab-product-price eab-price-%1$s">%2$s</div>',
			esc_attr( $product['type'] ?? 'simple' ),
			$product['product_price']
		);
	}

	/**
	 * Eab_render_quantity_input
	 *
	 * @param  mixed $min min quantity.
	 * @return statement
	 */
	public static function eab_render_quantity_input( $min = 1 ) {
		ob_start();
		?>
		<div class="eab-quantity">
			<button type="button" class="eab-qty-btn minus" aria-label="<?php esc_attr_e( 'Decrease quantity', 'easy-accordion-free' ); ?>">–</button>

			<input
				type="number"
				class="eab-quantity-input"
				min="<?php echo esc_attr( $min ); ?>"
				value="<?php echo esc_attr( $min ); ?>" />

			<button type="button" class="eab-qty-btn plus" aria-label="<?php esc_attr_e( 'Increase quantity', 'easy-accordion-free' ); ?>">+</button>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Eab_render_add_to_cart_button
	 *
	 * @param  mixed $data product.
	 * @param  mixed $label button label.
	 * @param  mixed $template selected template.
	 * @return statement
	 */
	public static function render_add_to_cart_from_data( $data, $label = '', $template = '' ) {
		if ( empty( $data['id'] ) || empty( $data['type'] ) ) {
			return '';
		}

		ob_start();
		?>
		<div class="eab-product-cart-wrapper">

			<?php if ( 'grouped' === $data['type'] ) : ?>

				<a href="<?php echo esc_url( $data['link'] ); ?>"
					class="button eab-add-to-cart">
					<?php esc_html_e( 'View products', 'easy-accordion-free' ); ?>
				</a>
			<?php elseif ( 'variable' === $data['type'] ) : ?>

				<a href="<?php echo esc_url( $data['link'] ); ?>"
					target="_blank"
					rel="noopener noreferrer"
					class="button eab-add-to-cart">
					<?php esc_html_e( 'Select Options', 'easy-accordion-free' ); ?>
				</a>

			<?php elseif ( 'external' === $data['type'] ) : ?>

				<a href="<?php echo esc_url( $data['link'] ); ?>"
					target="_blank"
					rel="noopener noreferrer"
					class="button eab-add-to-cart">
					<?php esc_html_e( 'Buy now', 'easy-accordion-free' ); ?>
				</a>

			<?php elseif ( 'simple' === $data['type'] ) : ?>

				<?php if ( 'product-accordion-two' !== $template ) : ?>
					<div class="eab-quantity">
						<input type="number" min="1" value="1" class="eab-quantity-input" aria-label="Quantity">
					</div>
				<?php endif; ?>

				<a href="?add-to-cart=<?php echo esc_attr( $data['id'] ); ?>"
					data-product_id="<?php echo esc_attr( $data['id'] ); ?>"
					class="button add_to_cart_button ajax_add_to_cart eab-add-to-cart">
					<?php echo esc_html( $label ); ?>
				</a>

				<?php
			endif;
			?>

		</div>
		<?php

		return ob_get_clean();
	}

	/**
	 * Render Product Name
	 *
	 * @param array $title_data {.
	 *     @type string $title
	 *     @type bool   $linkPostTitle
	 *     @type string $accordionTitleTag
	 *     @type string $postTitleLenght     full|limit
	 *     @type array  $postTitleLenghtNumber { value }
	 *     @type bool   $linkOpenNewTab
	 *     @type string $link
	 * }
	 */
	public static function eab_render_product_name( $title_data = array() ) {
		$title     = isset( $title_data['title'] ) ? $title_data['title'] : '';
		$title_tag = ! empty( $title_data['accordionTitleTag'] ) ? $title_data['accordionTitleTag'] : 'h3';

		if ( empty( $title ) ) {
			return;
		}
		$display_title = $title;

		$allowed_tags = array( 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span' );
		if ( ! in_array( strtolower( $title_tag ), $allowed_tags, true ) ) {
			$title_tag = 'h3';
		}

		printf(
			'<%1$s class="eab-product-title">%2$s</%1$s>',
			esc_html( $title_tag ),
			esc_html( $display_title )
		);
	}

	/**
	 * Build_image_data
	 *
	 * @param  mixed $data post data.
	 * @param  mixed $context attrs.
	 * @return array
	 */
	private static function build_image_data( $data, $context ) {
		return array(
			'post_id'             => $data['post_id'] ?? 0,
			'attachment_metadata' => $data['attachment_metadata'] ?? '',
			'image_size'          => $data['image_size'] ?? 'large',
			'image_alt'           => $data['image_alt'] ?? '',
			'postTitle'           => $data['title'] ?? '',
			'badge_text'          => $data['sale_badge'] ?? '',
			'generalLinkOpen'     => $context['generalLinkOpen'],
			'template'            => $context['template'],
			'show_badge'          => $context['showBadge'],
			'show_image'          => $context['showFeaturedImage'],
		);
	}

	/**
	 * Build_product_header_data
	 *
	 * @param  mixed $data post data.
	 * @param  mixed $context attrs.
	 * @return array
	 */
	private static function build_product_header_data( $data, $context ) {
		return array_merge(
			$data,
			array(
				'toggleIconsSet'              => $context['toggleIconsSet'],
				'enableExpandAndCollapseIcon' => $context['enableExpandAndCollapseIcon'],
				'toggleIconPosition'          => $context['toggleIconPosition'],
				'linkOpenNewTab'              => $context['linkOpenNewTab'],
				'postTitleLenght'             => $context['postTitleLenght'],
				'postTitleLenghtNumber'       => $context['postTitleLenghtNumber'],
				'metaDisplayPosition'         => $context['metaDisplayPosition'],
				'metaDataOptions'             => $context['metaDataOptions'],
			)
		);
	}

	/**
	 * Render_product_body
	 *
	 * @param  mixed $data product data.
	 * @param  mixed $context attrs.
	 * @param  mixed $header_data header data.
	 * @return void
	 */
	private static function render_product_body( $data, $context, $header_data ) {

		if ( $context['showRating'] ) {
			echo self::eab_render_review_data( $data ); // phpcs:ignore
		}

		if ( $context['showProductTitle'] && 'product-accordion-two' === $context['template'] ) {
			echo self::eab_render_product_name( $header_data ); // phpcs:ignore
		}

		if ( $context['showPrice'] ) {
			echo self::eab_render_price_data( $data ); // phpcs:ignore
		}

		if ( $context['showExcerpt'] ) {
			echo self::render_excerpt($data['excerpt'] ?? '',$context['excerptLimit'],$context['excerptLength']); // phpcs:ignore
		}

		if ( $context['showAddToCart'] ) {
			echo self::render_add_to_cart_from_data($data,$context['addToCartLabel'],$context['template']); // phpcs:ignore
		}
	}

	/**
	 * Post_single_item
	 *
	 * @param  mixed $data post data.
	 * @param  mixed $attributes post attrs.
	 * @return statement
	 */
	public static function post_single_item( $data, $attributes ) {
		$context       = Blocks_Query::prepare_post_item_attributes( $attributes );
		$image_data    = self::build_image_data( $data, $context );
		$header_data   = self::build_product_header_data( $data, $context );
		$post_id       = $data['post_id'] ?? 0;
		$link          = $data['link'] ?? '';
		$excerpt       = $data['excerpt'] ?? '';
		$author_url    = $data['author_url'] ?? '';
		$author        = $data['author'] ?? '';
		$post_date     = $data['post_date'] ?? '';
		$category_list = $data['category_list'] ?? '';
		$sku           = $data['sku'] ?? '';

		ob_start();
		?>
		<div
			class="sp-eab-accordion-item">

			<div class="sp-eab-accordion-item-wrapper">

				<!-- Accordion Heading -->
				<<?php echo tag_escape( $context['accordionTitleTag'] ); ?>
					class="sp-eab-accordion-heading sp-d-flex sp-align-center"
					role="button"
					tabindex="0">
				<?php
				echo self::accordion_post_header_renderer($header_data, $image_data); // phpcs:ignore
				?>
				</<?php echo tag_escape( $context['accordionTitleTag'] ); ?>>

				<!-- Accordion Content -->
				<div class="sp-eab-accordion-content">
					<div class="sp-eab-accordion-content-wrapper <?php echo esc_attr( 'none' !== $context['animationEffect'] ? ' animated ' . $context['animationEffect'] : '' ); ?>">
						<div class="sp-eab-accordion-body sp-d-flex sp-gap-20px">

						<?php
						if ( $context['showFeaturedImage'] && 'post-accordion-two' !== $context['template'] ) :
							echo self::render_featured_image($image_data, $link); // phpcs:ignore
							endif;
						?>

						<div class="sp-eab-post-content-wrapper">
							<?php
							if ( 'post-accordion' === $context['blockName'] ) :
								$meta_data = self::render_metadata(
									array(
										'author_url'      => $author_url,
										'author'          => $author,
										'post_date'       => $post_date,
										'category_list'   => $category_list ?? '',
										'metaDataOptions' => $attributes['metaDataOptions'] ?? array(),
									)
								);
									echo $meta_data; // phpcs:ignore
								if ( $context['showExcerpt'] ) {
									echo self::render_excerpt($excerpt, $context['excerptLimit'],$context['excerptLength']); // phpcs:ignore
								}
							endif;
							if ( 'product-accordion' === $context['blockName'] ) {
								self::render_product_body( $data, $context, $header_data );
							}
							if ( $context['showReadMore'] && 'post-accordion' === $context['blockName'] ) {
								echo self::render_read_more_button($link, $context['showReadMoreLinkInNewTab']); // phpcs:ignore
							}
							?>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
			<?php
			return ob_get_clean();
	}
}
