<?php
/**
 * The file that defines the query filter class.
 *
 * A class definition that includes attributes and functions used to filter posts.
 *
 * @link       https://shapedplugin.com/
 *
 * @package    easyAccordion
 * @subpackage easyAccordion/blocks
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes;

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Class to handle WordPress post queries with advanced filtering.
 */
class Blocks_Query_Handler {
	/**
	 * Post query function.
	 *
	 * @param array       $query_data Query data.
	 * @param string|null $type Query type.
	 * @param string|null $block_id block id.
	 * @return array Query results or arguments.
	 */
	public static function query( $query_data, $type = null, $block_id = '' ) {
		// Default query parameters.
		$post_type       = $query_data['postType'] ?? '';
		$filter_type     = $query_data['filterPost'] ?? 'latest';
		$post_limit      = (int) ( ! empty( $query_data['postLimit'] ) ? $query_data['postLimit'] : 8 );
		$order_by        = $query_data['orderBy'] ?? 'date';
		$order_direction = $query_data['orderDirection'] ?? 'DESC';
		$item_per_page   = (int) ( $query_data['itemPerPage'] ?? 5 );
		$current_page    = max( 1, (int) ( $query_data['currentPage'] ?? 1 ) );

		$multiple_post_type = array( $post_type );

		// Calculate total post limit.
		$all_post_limit = 0;
		foreach ( $multiple_post_type as $value ) {
			$all_post_limit += (int) ( wp_count_posts( $value )->publish ?? 0 );
		}

		if ( 1 === $current_page ) {
			$posts_per_page = $post_limit;
			$offset         = 0;
		} else {
			$posts_per_page = $item_per_page;
			$offset         = $post_limit + ( ( $current_page - 2 ) * $item_per_page );
		}

		// Base query arguments.
		$args          = array(
			'post_type'           => $multiple_post_type,
			'posts_per_page'      => $posts_per_page,
			'offset'              => $offset,
			'orderby'             => $order_by,
			'order'               => $order_direction,
			'post_status'         => in_array( 'attachment', $multiple_post_type, true ) ? array( 'publish', 'inherit' ) : 'publish',
			'ignore_sticky_posts' => true,
			'no_found_rows'       => false,
		);
		$wp_query_data = new \WP_Query( $args );

		$total_posts_after_filter = $wp_query_data->found_posts;

		$total_pages = 1;
		if ( $total_posts_after_filter > $post_limit ) {
			$total_pages += (int) ceil(
				( $total_posts_after_filter - $post_limit ) / max( 1, $item_per_page )
			);
		}

		$total_pages = max( $total_pages, 1 );

		if ( 'args' === $type ) {
			return array(
				'args'        => $args,
				'post_limit'  => $posts_per_page,
				'offset'      => $offset,
				'total_pages' => $total_pages,
			);
		}
		$wp_query_data = new \WP_Query( $args );

		return array(
			'the_query'   => $wp_query_data,
			'post_count'  => $total_posts_after_filter,
			'total_pages' => $total_pages,
			'post_ids'    => wp_list_pluck( $wp_query_data->posts, 'ID' ),
		);
		return $result;
	}
}
