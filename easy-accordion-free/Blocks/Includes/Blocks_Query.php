<?php
/**
 * The plugin gutenberg block queries.
 *
 * @link       https://shapedplugin.com/
 * @since      2.5.3
 *
 * @package    Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/blocks/includes
 * @author     ShapedPlugin <support@shapedplugin.com>
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes;

use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Query_Handler;
use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Helper;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

if ( ! class_exists( 'Blocks_Query' ) ) {
	/**
	 * Blocks_Query class.
	 */
	class Blocks_Query {

		/**
		 * This plugin's instance.
		 *
		 * @var Query
		 */
		private static $instance;

		/**
		 * Main Query Instance.
		 *
		 * Insures that only one instance of Blocks exists in memory at any one
		 * time. Also prevents needing to define globals all over the place.
		 *
		 * @static
		 * @return object|Query The one true Blocks
		 */
		public static function instance() {
			if ( ! isset( self::$instance ) ) {
				self::$instance = new Blocks_Query();
				self::$instance->init();
			}
			return self::$instance;
		}

		/**
		 * Initialize function
		 *
		 * @return void
		 */
		public function init() {
			add_action( 'wp_ajax_eab_post_query', array( $this, 'eab_post_query' ) );
			add_action( 'wp_ajax_nopriv_eab_post_query', array( $this, 'eab_post_query' ) );
			// query functions for get all post.
			if ( is_admin() ) {
				add_action( 'wp_ajax_eab_all_post_query', array( $this, 'eab_all_post_query' ) );
				add_action( 'wp_ajax_nopriv_eab_all_post_query', array( $this, 'eab_all_post_query' ) );
			}

			// metadata query.
			add_action( 'wp_ajax_eab_meta_data_query', array( $this, 'eab_meta_data_query' ) );
			add_action( 'wp_ajax_nopriv_eab_meta_data_query', array( $this, 'eab_meta_data_query' ) );
		}

		/**
		 * Handles the frontend post query for the Post Block.
		 *
		 * @param array  $query_data The query data for fetching posts.
		 * @param string $block_id   Optional. The block ID.
		 * @return array             An array containing post data and total pages.
		 */
		public static function post_query_frontend( $query_data, $block_id = '' ) {
			$config = self::prepare_query_config( $query_data, $block_id );

			self::setup_image_filters( $config['image_srcset'] );

			$post_query   = Blocks_Query_Handler::query( $query_data, 'normal', $block_id );
			$the_query    = $post_query['the_query'];
			$total_pages  = $post_query['total_pages'] ?? 1;
			$all_post_ids = $post_query['post_ids'] ?? array();

			$post_data = self::process_query_posts( $the_query, $config );

			self::cleanup_image_filters( $config['image_srcset'] );

			return array( $post_data, $total_pages, $all_post_ids );
		}

		/**
		 * Prepare configuration data from query parameters.
		 *
		 * @param array  $query_data The query data.
		 * @param string $block_id   The block ID.
		 * @return array Configuration array.
		 */
		private static function prepare_query_config( $query_data, $block_id = '' ) {
			$config = array(
				'post_type'                  => $query_data['postType'] ?? 'post',
				'date_format_type'           => $query_data['metaDateFormat'] ?? 'default',
				'custom_date_format'         => $query_data['metaDateCustomDateFormat'] ?? '',
				'image_size'                 => $query_data['featuredImageSize'] ?? '',
				'unique_id'                  => $query_data['uniqueId'] ?? '',
				'exclude_post_without_image' => $query_data['excludePostWithoutImagePosts'] ?? false,
				'image_srcset'               => ! empty( $query_data['imageSrcset'] ) ? (bool) $query_data['imageSrcset'] : false,
				'image_lazy_enable'          => $query_data['imageLazyLoad'] ?? false,
			);

			$config['date_format']     = self::get_date_format( $config['date_format_type'], $config['custom_date_format'] );
			$config['image_lazy_load'] = $config['image_lazy_enable'] ? 'lazy' : 'eager';

			return $config;
		}

		/**
		 * Get the appropriate date format.
		 *
		 * @param string $date_format_type The date format type.
		 * @param string $custom_format    Custom date format.
		 * @return string The date format.
		 */
		private static function get_date_format( $date_format_type, $custom_format ) {
			return ( 'default' === $date_format_type ) ? get_option( 'date_format' ) : $custom_format;
		}

		/**
		 * Setup image-related filters.
		 *
		 * @param bool $image_srcset Whether srcset is enabled.
		 */
		private static function setup_image_filters( $image_srcset ) {
			if ( ! $image_srcset ) {
				add_filter( 'wp_get_attachment_image_attributes', array( self::class, 'remove_image_srcset' ), 10, 3 );
			}
		}

		/**
		 * Cleanup image-related filters.
		 *
		 * @param bool $image_srcset Whether srcset is enabled.
		 */
		private static function cleanup_image_filters( $image_srcset ) {
			if ( ! $image_srcset ) {
				remove_filter( 'wp_get_attachment_image_attributes', array( self::class, 'remove_image_srcset' ), 10, 3 );
			}
		}

		/**
		 * Process posts from the query.
		 *
		 * @param WP_Query $the_query The WordPress query object.
		 * @param array    $config    Configuration array.
		 * @return array Post data array.
		 */
		private static function process_query_posts( $the_query, $config ) {
			$post_data = array();

			if ( ! $the_query->have_posts() ) {
				return $post_data;
			}

			while ( $the_query->have_posts() ) {
				$the_query->the_post();

				$single_post_data = self::prepare_single_post_data( $config );
				$post_data[]      = $single_post_data;
			}
			wp_reset_postdata();
			return $post_data;
		}

		/**
		 * Prepare data for a single post.
		 *
		 * @param array $config   Configuration array.
		 * @return array Single post data.
		 */
		private static function prepare_single_post_data( $config ) {
			$post_id        = get_the_ID();
			$image_id       = get_post_thumbnail_id();
			$author_meta_id = get_the_author_meta( 'ID' );
			$current_date   = get_the_date( 'c' );

			$post_data = self::get_basic_post_data( $post_id, $image_id, $author_meta_id, $current_date, $config );

			// Add WooCommerce product data if applicable.
			if ( 'product' === $config['post_type'] && function_exists( 'wc_get_product' ) ) {
				$post_data = array_merge( $post_data, self::get_product_data( $post_id ) );
			}

			return $post_data;
		}

		/**
		 * Get basic post data.
		 *
		 * @param int    $post_id        Post ID.
		 * @param int    $image_id       Image ID.
		 * @param int    $author_meta_id Author ID.
		 * @param string $current_date   Current date.
		 * @param array  $config         Configuration array.
		 * @return array Basic post data.
		 */
		private static function get_basic_post_data( $post_id, $image_id, $author_meta_id, $current_date, $config ) {
			$taxonomies = get_object_taxonomies( $config['post_type'], 'names' );
			if ( 'product' === $config['post_type'] ) {
				$taxonomy = 'product_cat';
			} else {
				$taxonomy = 'sp_accordion_faqs' === $config['post_type'] ? 'faq_category' : $taxonomies[0];
			}

			$terms         = array();
			$category_list = '';

			if ( $taxonomy ) {
				$terms = get_the_terms( $post_id, $taxonomy );
				$terms = ( ! empty( $terms ) && ! is_wp_error( $terms ) ) ? $terms : array();

				$category_list = $terms ? get_the_term_list(
					$post_id,
					$taxonomy,
					'',
					', ',
					''
				) : '';
			}
			$archive_year  = get_the_time( 'Y' );
			$archive_month = get_the_time( 'm' );
			$archive_day   = get_the_time( 'd' );
			return array(
				'post_id'             => $post_id,
				'title'               => get_the_title(),
				'link'                => get_the_permalink(),
				'content'             => strip_shortcodes( get_the_content() ),
				'excerpt'             => get_the_excerpt(),
				'post_thumbnail'      => get_the_post_thumbnail(),
				'post_thumbnail_url'  => get_the_post_thumbnail_url( $post_id, $config['image_size'] ?? 'thumbnail' ),
				'image_size'          => $config['image_size'],
				'attachment_srcset'   => wp_get_attachment_image_srcset( $image_id ),
				'attachment_metadata' => 'product' === $config['post_type'] && ! $image_id ? wc_placeholder_img_src() : wp_get_attachment_metadata( $image_id ),
				'attachment_url'      => 'product' === $config['post_type'] && ! $image_id ? wc_placeholder_img_src() : wp_get_attachment_url( $image_id ),
				'post_thumbnail_id'   => $image_id,
				'author'              => get_the_author(),
				'author_id'           => $author_meta_id,
				'author_avatar_url'   => get_avatar_url( $author_meta_id ),
				'author_url'          => get_author_posts_url( $author_meta_id ),
				'category_list'       => $category_list,
				'tag_list'            => get_the_tag_list( '' ),
				'post_list'           => get_post_format( '' ),
				'category'            => $terms,
				'date'                => $current_date,
				'date_archive_url'    => get_day_link( $archive_year, $archive_month, $archive_day ),
				'image_title'         => get_the_title( $image_id ),
				'image_alt'           => get_post_meta( $image_id, '_wp_attachment_image_alt', true ),
				'post_date'           => self::format_post_dates( $current_date, $config['date_format'] ),
			);
		}

		/**
		 * Format post dates in various formats.
		 *
		 * @param string $current_date Current date.
		 * @param string $date_format  Date format.
		 * @return array Formatted dates.
		 */
		private static function format_post_dates( $current_date, $date_format ) {
			return array(
				'default' => date_i18n( $date_format, strtotime( $current_date ) ),
				'day'     => date_i18n( 'j', strtotime( $current_date ) ),
				'month'   => date_i18n( 'F', strtotime( $current_date ) ),
				'year'    => date_i18n( 'Y', strtotime( $current_date ) ),
			);
		}

		/**
		 * Get_variable_form_html
		 *
		 * @param  mixed $product product object.
		 * @return statment
		 */
		private static function get_variable_form_html( \WC_Product $product ) {
			if ( ! $product->is_type( 'variable' ) ) {
				return '';
			}

			ob_start();

			wc_get_template(
				'single-product/add-to-cart/variable.php',
				array(
					'available_variations' => $product->get_available_variations(),
					'attributes'           => $product->get_variation_attributes(),
					'selected_attributes'  => $product->get_default_attributes(),
					'product'              => $product,
				)
			);

			return ob_get_clean();
		}



		/**
		 * Get WooCommerce product data.
		 *
		 * @param int $post_id Post ID.
		 * @return array Product data.
		 */
		private static function get_product_data( $post_id ) {
			$product = wc_get_product( $post_id );

			if ( ! $product ) {
				return array();
			}
			$sale_badge      = '';
			$sale_text       = '';
			$sale_percentage = '';

			if ( $product->is_on_sale() ) {

				$sale_badge = apply_filters(
					'woocommerce_sale_flash',
					'<span class="onsale">' . esc_html__( 'Sale!', 'easy-accordion-free' ) . '</span>',
					$product,
					''
				);

				$sale_text = wp_strip_all_tags( $sale_badge );

				if ( $product->get_regular_price() && $product->get_sale_price() ) {
					$regular = (float) $product->get_regular_price();
					$sale    = (float) $product->get_sale_price();

					if ( $regular > 0 ) {
						$sale_percentage = '-' . round( ( ( $regular - $sale ) / $regular ) * 100 ) . '%';
					}
				}
			}

			return array(
				'id'              => $product->get_id(),
				'type'            => $product->get_type(),
				'sku'             => $product->get_sku(),
				'product_price'   => $product->get_price_html(),
				'add_to_cart'     => do_shortcode(
					'[add_to_cart id="' . $post_id . '" show_price="false" style="none"]'
				),
				'average_rating'  => $product->get_average_rating(),
				'review_count'    => $product->get_review_count(),
				'on_sale'         => $product->is_on_sale(),
				'sale_badge'      => $sale_badge,
				'sale_text'       => $sale_text,
				'sale_percentage' => $sale_percentage,
				'variations_html' => self::get_variable_form_html( $product ),
			);
		}

		/**
		 * Ajax query function - refactored version.
		 *
		 * @return void
		 */
		public function eab_post_query() {
			$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';

			if ( ! wp_verify_nonce( $nonce, 'sp_easy_accordion_block_nonce' ) ) {
				wp_send_json_error( array( 'message' => 'Security check failed.' ), 403 );
				return;
			}

			$query_data = isset( $_POST['queryData'] ) ? sanitize_text_field( wp_unslash( $_POST['queryData'] ) ) : '';
			$query_data = (array) json_decode( $query_data );

			if (
			isset( $query_data['postType'] ) &&
			'product' === $query_data['postType'] &&
			! class_exists( 'WooCommerce' )
			) {
				wp_send_json(
					array(
						'posts'        => array(),
						'post_count'   => 0,
						'posts_status' => false,
						'message'      => __( 'WooCommerce is required to display products. Please install and activate WooCommerce to use this block.', 'easy-accordion-free' ),
					)
				);
			}

			$config     = self::prepare_ajax_config( $query_data );
			$post_query = Blocks_Query_Handler::query( $query_data );
			$the_query  = $post_query['the_query'];
			$post_data  = self::process_query_posts( $the_query, $config );
			$post_count = self::calculate_post_count( $config, $post_query );

			wp_send_json(
				array(
					'posts'        => $post_data,
					'posts_status' => count( $post_data ) > 0,
					'post_count'   => $post_count,
				)
			);
		}

		/**
		 * Prepare configuration for AJAX request.
		 *
		 * @param array $query_data Query data.
		 * @return array Configuration array.
		 */
		private static function prepare_ajax_config( $query_data ) {
			$config = array(
				'post_type'          => $query_data['postType'] ?? 'post',
				'date_format_type'   => $query_data['metaDateFormat'] ?? 'default',
				'image_size'         => $query_data['featuredImageSize'] ?? '',
				'custom_date_format' => $query_data['metaDateCustomDateFormat'] ?? '',
			);

			$config['date_format'] = self::get_date_format( $config['date_format_type'], $config['custom_date_format'] );

			return $config;
		}

		/**
		 * Calculate total post count.
		 *
		 * @param array $config     Configuration array.
		 * @param array $post_query Post query results.
		 * @return int Post count.
		 */
		private static function calculate_post_count( $config, $post_query ) {
			if ( isset( $post_query['post_count'] ) && $post_query['post_count'] ) {
				return $post_query['post_count'];
			}

			$counts = wp_count_posts( $config['post_type'] );
			return isset( $counts->publish ) ? (int) $counts->publish : 0;
		}

		/**
		 * Method eab_all_post_query
		 *
		 * @return void
		 */
		public function eab_all_post_query() {
			$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';

			if ( ! wp_verify_nonce( $nonce, 'sp_easy_accordion_block_nonce' ) ) {
				wp_send_json_error( array( 'message' => 'Security check failed.' ), 403 );
				return;
			}

			$query_data = isset( $_POST['postQueryData'] ) ? sanitize_text_field( wp_unslash( $_POST['postQueryData'] ) ) : '';

			$query_data = (array) json_decode( $query_data );
			// queries.
			$post_type   = isset( $query_data['postType'] ) ? $query_data['postType'] : 'post';
			$search_text = isset( $query_data['liveSearchText'] ) ? $query_data['liveSearchText'] : '';

			$post_query_args                   = Blocks_Query_Handler::query( $query_data, 'args' )['args'];
			$post_query_args['fields']         = 'ids';
			$post_query_args['posts_per_page'] = 99999;

			$post_lists = get_posts( $post_query_args );

			$the_search_query = new \WP_Query(
				array(
					'post_type'      => $post_type,
					'posts_per_page' => 20,
					's'              => $search_text,
					'post__in'       => $post_lists,
				)
			);

			wp_send_json(
				array(
					'posts' => count( $post_lists ) > 0 ? $the_search_query->posts : array(),
				)
			);
		}

		/**
		 * Method eab_meta_data_query
		 *
		 * @return void
		 */
		public function eab_meta_data_query() {
			$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';

			if ( ! wp_verify_nonce( $nonce, 'sp_easy_accordion_block_nonce' ) ) {
				wp_send_json_error( array( 'message' => 'Security check failed.' ), 403 );
				return;
			}

			$query_data = isset( $_POST['metaQueryData'] ) ? sanitize_text_field( wp_unslash( $_POST['metaQueryData'] ) ) : '';
			$query_data = (array) json_decode( $query_data );
			// query data.
			$post_type = isset( $query_data['postType'] ) ? $query_data['postType'] : 'post';

			// all post type list.
			$all_post_type_list = get_post_types(
				array(
					'public' => true,
				)
			);

			$post_count = isset( wp_count_posts( $post_type )->publish ) ? (int) wp_count_posts( $post_type )->publish : 0;

			wp_send_json(
				array(
					'post_count'         => $post_count,
					'image_sizes'        => get_intermediate_image_sizes(),
					'all_post_type_list' => $all_post_type_list,
				)
			);
		}

		/**
		 * Get cached post query result
		 *
		 * @param  mixed $attributes Array of block attributes.
		 * @param  mixed $unique_id  Unique identifier for the block instance.
		 * @param  mixed $block_id  block identifier.
		 * @return data
		 */
		public static function get_cached_post_query_result( $attributes, $unique_id = '', $block_id = '' ) {

			// Bypass cache for AJAX live filter.
			if ( ! empty( $attributes['ajaxLiveFilter'] ) ) {
				return self::post_query_frontend( $attributes, $block_id );
			}
			$block              = isset( $_GET['block'] ) ? sanitize_text_field( wp_unslash( $_GET['block'] ) ) : '';
			$skip_cache_orderby = array( 'rand', 'most_viewed', 'most_liked', 'comment_count' );
			if ( ( isset( $attributes['orderBy'] ) && in_array( $attributes['orderBy'], $skip_cache_orderby, true ) ) || ( ( ! empty( $block ) && $block == $block_id ) ) ) {
				return self::post_query_frontend( $attributes, $block_id );
			}

			$transient_key = 'sp_eab_post_query_' . $block_id;

			// Track transient key.
			$keys = get_option( 'sp_eab_post_transients', array() );
			if ( ! in_array( $transient_key, $keys, true ) ) {
				$keys[] = $transient_key;
				update_option( 'sp_eab_post_transients', $keys, false );
			}
			$data = Blocks_Helper::get_transient( $transient_key );
			if ( false === $data ) {
				$data = self::post_query_frontend( $attributes, $block_id );
				Blocks_Helper::set_transient( $transient_key, $data, DAY_IN_SECONDS );
			}
			return $data;
		}

		/**
		 * Prepare post accordion attributes for single item or AJAX.
		 *
		 * @param array $attributes Block attributes from saved block or transient.
		 * @return array Sanitized attributes for rendering or query.
		 */
		public static function prepare_post_item_attributes( array $attributes ): array {
			return array(
				'uniqueId'                    => $attributes['uniqueId'] ?? '',
				'template'                    => $attributes['template'] ?? '',
				'blockName'                   => $attributes['blockName'] ?? '',
				'showFeaturedImage'           => (bool) ( $attributes['showFeaturedImage'] ?? false ),
				'showExcerpt'                 => (bool) ( $attributes['showExcerpt'] ?? false ),
				'showReadMore'                => (bool) ( $attributes['showReadMore'] ?? false ),
				'showReadMoreLinkInNewTab'    => (bool) ( $attributes['showReadMoreLinkInNewTab'] ?? false ),
				'metaDisplayPosition'         => $attributes['metaDisplayPosition'] ?? '',
				'excerptLimit'                => $attributes['excerptLimit'] ?? array(),
				'excerptLength'               => $attributes['excerptLength'] ?? '',
				'accordionTitleTag'           => $attributes['accordionTitleTag'] ?? 'h3',
				'animationEffect'             => $attributes['animationEffect'] ?? 'none',
				'toggleIconsSet'              => $attributes['toggleIconsSet'] ?? array(),
				'enableExpandAndCollapseIcon' => (bool) ( $attributes['enableExpandAndCollapseIcon'] ?? true ),
				'toggleIconPosition'          => $attributes['toggleIconPosition'] ?? 'end',
				'linkOpenNewTab'              => (bool) ( $attributes['linkOpenNewTab'] ?? false ),
				'postTitleLenght'             => $attributes['postTitleLenght'] ?? '',
				'postTitleLenghtNumber'       => $attributes['postTitleLenghtNumber'] ?? array(),
				'metaDataOptions'             => $attributes['metaDataOptions'] ?? array(),
				'metaDivider'                 => $attributes['metaDivider'] ?? false,
				'showRating'                  => (bool) ( $attributes['showRating'] ?? true ),
				'showPrice'                   => (bool) ( $attributes['showPrice'] ?? true ),
				'showProductAttrs'            => (bool) ( $attributes['showProductAttrs'] ?? true ),
				'showAddToCart'               => (bool) ( $attributes['showAddToCart'] ?? true ),
				'addToCartLabel'              => $attributes['addToCartLabel'] ?? 'Add to Cart',
				'imageEffects'                => $attributes['imageEffects'] ?? '',
				'showProductTitle'            => $attributes['showProductTitle'] ?? '',
				'generalLinkOpen'             => $attributes['generalLinkOpen'] ?? '',
				'showBadge'                   => $attributes['showBadge'] ?? '',
				'postType'                    => $attributes['postType'] ?? '',
			);
		}

		/**
		 * Remove srcset attribute from image attributes.
		 *
		 * @param array   $attr       Image attributes.
		 * @param WP_Post $attachment Attachment post object.
		 * @param string  $size       Image size.
		 * @return array Modified image attributes.
		 */
		public static function remove_image_srcset( $attr, $attachment, $size ) {
			unset( $attr['srcset'] );
			return $attr;
		}
	}
}
