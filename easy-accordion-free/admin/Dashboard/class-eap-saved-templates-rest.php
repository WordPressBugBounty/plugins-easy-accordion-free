<?php
/**
 * REST controller for the Saved Templates dashboard tab.
 *
 * Exposes list / duplicate / delete over the saved-template and classic
 * accordion post types under `easy-accordion/v2/templates`. Every route is
 * capability-gated (manage_options, filterable) and protected by the core
 * cookie + `wp_rest` nonce the SPA sends as `X-WP-Nonce`.
 *
 * @package    Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/Admin
 * @author     ShapedPlugin <support@shapedplugin.com>
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'EAP_Saved_Templates_Rest' ) ) {

	/**
	 * CRUD-lite REST endpoints for saved templates.
	 */
	class EAP_Saved_Templates_Rest {

		/**
		 * REST namespace.
		 *
		 * @var string
		 */
		const NAMESPACE = 'easy-accordion/v2';

		/**
		 * REST base.
		 *
		 * @var string
		 */
		const BASE = 'templates';

		/**
		 * Post types the tab lists: block templates and classic accordions.
		 *
		 * @var string[]
		 */
		const POST_TYPES = array( 'sp_eap_template', 'sp_easy_accordion' );

		/**
		 * Constructor.
		 */
		public function __construct() {
			add_action( 'rest_api_init', array( $this, 'register_routes' ) );
		}

		/**
		 * Register the REST routes.
		 *
		 * Not module-gated: the classic accordion listing is core plugin
		 * functionality and must stay reachable; the dashboard tab itself is
		 * hidden when the saved-templates module is off.
		 *
		 * @return void
		 */
		public function register_routes() {
			$permission = array( $this, 'check_permission' );

			register_rest_route(
				self::NAMESPACE,
				'/' . self::BASE,
				array(
					array(
						'methods'             => 'GET',
						'callback'            => array( $this, 'get_items' ),
						'permission_callback' => $permission,
						'args'                => array(
							'search'   => array(
								'default'           => '',
								'sanitize_callback' => 'sanitize_text_field',
							),
							'page'     => array(
								'default'           => 1,
								'sanitize_callback' => 'absint',
								'validate_callback' => static function ( $value ) {
									return absint( $value ) >= 1;
								},
							),
							'per_page' => array(
								'default'           => 10,
								'sanitize_callback' => 'absint',
								'validate_callback' => static function ( $value ) {
									return absint( $value ) >= 1 && absint( $value ) <= 100;
								},
							),
						),
					),
				)
			);

			register_rest_route(
				self::NAMESPACE,
				'/' . self::BASE . '/duplicate',
				array(
					array(
						'methods'             => 'POST',
						'callback'            => array( $this, 'duplicate_item' ),
						'permission_callback' => $permission,
						'args'                => array(
							'id' => array(
								'required'          => true,
								'sanitize_callback' => 'absint',
								'validate_callback' => static function ( $value ) {
									return absint( $value ) > 0;
								},
							),
						),
					),
				)
			);

			register_rest_route(
				self::NAMESPACE,
				'/' . self::BASE . '/delete',
				array(
					array(
						'methods'             => 'POST',
						'callback'            => array( $this, 'delete_items' ),
						'permission_callback' => $permission,
						'args'                => array(
							'ids' => array(
								'required' => true,
							),
						),
					),
				)
			);
		}

		/**
		 * Capability check for every route.
		 *
		 * @return bool
		 */
		public function check_permission() {
			$capability = apply_filters( 'easy_accordion_access_capability', 'manage_options' );

			return current_user_can( $capability );
		}

		/**
		 * GET /templates — one server-paginated page of templates and classic
		 * accordions, newest first, with the filtered total.
		 *
		 * Pagination and search run in the query (offset + found_posts, `s`),
		 * the same way the Pro dashboard list does; the response is a custom
		 * envelope so the client needs no header sniffing.
		 *
		 * @param WP_REST_Request $request Request (search, page, per_page).
		 * @return WP_REST_Response { templates: array, total_items: int }.
		 */
		public function get_items( WP_REST_Request $request ) {
			$search   = (string) $request->get_param( 'search' );
			$page     = max( 1, absint( $request->get_param( 'page' ) ) );
			$per_page = min( 100, max( 1, absint( $request->get_param( 'per_page' ) ) ) );

			$query = new WP_Query(
				array(
					'post_type'              => self::POST_TYPES,
					'post_status'            => array( 'publish', 'draft', 'pending', 'private', 'future' ),
					'posts_per_page'         => $per_page,
					'offset'                 => ( $page - 1 ) * $per_page,
					's'                      => $search,
					'orderby'                => 'date',
					'order'                  => 'DESC',
					'update_post_meta_cache' => false,
					'update_post_term_cache' => false,
					'suppress_filters'       => false,
				)
			);

			$items = array();
			foreach ( $query->posts as $post ) {
				$items[] = $this->prepare_item( $post );
			}

			return rest_ensure_response(
				array(
					'templates'   => $items,
					'total_items' => (int) $query->found_posts,
				)
			);
		}

		/**
		 * POST /templates/duplicate — clone a template as a draft.
		 *
		 * Block templates copy their content; classic accordions copy their
		 * meta (with the {#ID#} placeholder resolved to the new id), the same
		 * way the Tools duplicate does — without depending on the eap_tools
		 * module being active.
		 *
		 * @param WP_REST_Request $request Request.
		 * @return WP_REST_Response|WP_Error
		 */
		public function duplicate_item( WP_REST_Request $request ) {
			$id     = absint( $request->get_param( 'id' ) );
			$source = get_post( $id );

			if ( ! $source || ! in_array( $source->post_type, self::POST_TYPES, true ) ) {
				return new WP_Error(
					'eap_template_not_found',
					__( 'Template not found.', 'easy-accordion-free' ),
					array( 'status' => 404 )
				);
			}

			if ( ! current_user_can( 'edit_post', $id ) ) {
				return new WP_Error(
					'eap_template_forbidden',
					__( 'You do not have permission to duplicate this template.', 'easy-accordion-free' ),
					array( 'status' => 403 )
				);
			}

			$title = $this->duplicate_title( $source->post_title );

			$new_id = wp_insert_post(
				array(
					'post_type'    => $source->post_type,
					'post_status'  => 'draft',
					'post_title'   => $title,
					'post_content' => 'sp_easy_accordion' === $source->post_type ? '' : $source->post_content,
				),
				true
			);

			if ( is_wp_error( $new_id ) ) {
				return new WP_Error(
					'eap_template_duplicate_failed',
					__( 'Could not duplicate the template.', 'easy-accordion-free' ),
					array( 'status' => 500 )
				);
			}

			if ( 'sp_easy_accordion' === $source->post_type ) {
				$this->copy_classic_meta( $id, $new_id );
			}

			return rest_ensure_response( $this->prepare_item( get_post( $new_id ) ) );
		}

		/**
		 * Copy every meta row of a classic accordion onto its duplicate.
		 *
		 * Mirrors Easy_Accordion_Import_Export::duplicate_classic_shortcode:
		 * first value per key, {#ID#} replaced with the new id, serialized
		 * values unserialized again.
		 *
		 * @param int $source_id Duplicated accordion id.
		 * @param int $new_id    Duplicate id.
		 * @return void
		 */
		private function copy_classic_meta( $source_id, $new_id ) {
			$meta_data = get_post_meta( $source_id );
			if ( ! is_array( $meta_data ) ) {
				return;
			}

			foreach ( $meta_data as $meta_key => $meta_values ) {
				// Take the first value only (most meta has single value).
				$meta_value = $meta_values[0];

				// Replace {#ID#} placeholder with new post ID.
				$data = str_replace( '{#ID#}', $new_id, $meta_value );

				// Unserialize if the data is serialized.
				if ( is_serialized( $data ) ) {
					$data = unserialize( $data, array( 'allowed_classes' => false ) );
				}

				update_post_meta( $new_id, $meta_key, wp_slash( $data ) );
			}
		}

		/**
		 * POST /templates/delete — trash one or many templates.
		 *
		 * @param WP_REST_Request $request Request.
		 * @return WP_REST_Response|WP_Error
		 */
		public function delete_items( WP_REST_Request $request ) {
			$ids = self::normalize_ids( $request->get_param( 'ids' ) );

			if ( empty( $ids ) ) {
				return new WP_Error(
					'eap_template_no_ids',
					__( 'No templates selected.', 'easy-accordion-free' ),
					array( 'status' => 400 )
				);
			}

			$deleted = array();
			foreach ( $ids as $id ) {
				$post = get_post( $id );

				if ( ! $post || ! in_array( $post->post_type, self::POST_TYPES, true ) ) {
					continue;
				}

				if ( ! current_user_can( 'delete_post', $id ) ) {
					continue;
				}

				if ( wp_trash_post( $id ) ) {
					$deleted[] = $id;
				}
			}

			return rest_ensure_response( array( 'deleted' => $deleted ) );
		}

		/**
		 * Shape a post for the dashboard table.
		 *
		 * @param WP_Post $post Template or classic accordion post.
		 * @return array<string, mixed>
		 */
		private function prepare_item( $post ) {
			$title    = get_the_title( $post );
			$edit_url = get_edit_post_link( $post->ID, 'raw' );
			$is_block = 'sp_eap_template' === $post->post_type;

			$blocks = $is_block ? self::block_types( $post->post_content ) : array();

			return array(
				'id'          => (int) $post->ID,
				'title'       => '' !== $title ? $title : __( '(no title)', 'easy-accordion-free' ),
				'status'      => $post->post_status,
				'date'        => $post->post_date,
				'dateDisplay' => get_the_date( '', $post ),
				'source'      => $is_block ? 'block' : 'classic',
				'shortcode'   => $is_block
					? '[sp_eap_template id="' . $post->ID . '"]'
					: '[sp_easyaccordion id="' . $post->ID . '"]',
				'editUrl'     => $edit_url ? $edit_url : admin_url( 'post.php?post=' . $post->ID . '&action=edit' ),
				'blockTypes'  => $blocks,
				'blockLabel'  => $is_block ? self::block_label( $blocks ) : '',
			);
		}

		/**
		 * Display names for the blocks this plugin ships.
		 *
		 * @return array<string, string> Block slug => column label.
		 */
		private static function block_names() {
			return array(
				'vertical-accordion'    => __( 'Vertical Accordion', 'easy-accordion-free' ),
				'horizontal-accordion'  => __( 'Horizontal Accordion', 'easy-accordion-free' ),
				'image-accordion'       => __( 'Image Accordion', 'easy-accordion-free' ),
				'media-accordion'       => __( 'Media Accordion', 'easy-accordion-free' ),
				'accordion-slider'      => __( 'Accordion Slider', 'easy-accordion-free' ),
				'post-accordion'        => __( 'Post Accordion', 'easy-accordion-free' ),
				'product-accordion'     => __( 'Product Accordion', 'easy-accordion-free' ),
				'sidebar-tab-accordion' => __( 'Sidebar Tab Accordion', 'easy-accordion-free' ),
				'shortcode'             => __( 'Shortcode', 'easy-accordion-free' ),
				'user-faq-form'         => __( 'User FAQ Form', 'easy-accordion-free' ),
			);
		}

		/**
		 * Which of this plugin's blocks a template holds, in document order.
		 *
		 * Reads the serialized block delimiters rather than `parse_blocks()`:
		 * the column needs names only, and the list endpoint runs this over
		 * every template in the library. Pure.
		 *
		 * @param string $content Saved template content.
		 * @return string[] Unique block labels, first use first.
		 */
		public static function block_types( $content ) {
			if ( ! is_string( $content ) || '' === $content ) {
				return array();
			}

			if ( ! preg_match_all( '#<!--\s+wp:sp-easy-accordion-pro/([a-z0-9-]+)#', $content, $matches ) ) {
				return array();
			}

			$known  = self::block_names();
			$labels = array();

			foreach ( $matches[1] as $slug ) {
				$label = isset( $known[ $slug ] ) ? $known[ $slug ] : ucwords( str_replace( '-', ' ', $slug ) );

				$labels[ $label ] = $label;
			}

			return array_values( $labels );
		}

		/**
		 * Collapse the block list into the single Block-column label.
		 *
		 * @param string[] $types Labels from block_types().
		 * @return string Empty when the template holds none of our blocks.
		 */
		public static function block_label( array $types ) {
			if ( empty( $types ) ) {
				return '';
			}

			if ( 1 === count( $types ) ) {
				return $types[0];
			}

			/* translators: 1: first block name, 2: how many further block types the template holds. */
			return sprintf( __( '%1$s +%2$d', 'easy-accordion-free' ), $types[0], count( $types ) - 1 );
		}

		/**
		 * Append " (Copy)" to a duplicated template's title.
		 *
		 * @param string $title Source title.
		 * @return string
		 */
		private function duplicate_title( $title ) {
			$title = '' !== $title ? $title : __( 'Untitled template', 'easy-accordion-free' );

			/* translators: %s: source template title. */
			return sprintf( __( '%s (Copy)', 'easy-accordion-free' ), $title );
		}

		/**
		 * Coerce a raw `ids` param (array or JSON/CSV string) to positive ints
		 * (pure).
		 *
		 * @param mixed $raw Incoming ids.
		 * @return int[] Unique positive integers.
		 */
		public static function normalize_ids( $raw ) {
			if ( is_string( $raw ) ) {
				$decoded = json_decode( $raw, true );
				$raw     = is_array( $decoded ) ? $decoded : explode( ',', $raw );
			}

			if ( ! is_array( $raw ) ) {
				$raw = array( $raw );
			}

			$ids = array();
			foreach ( $raw as $value ) {
				$id = absint( $value );
				if ( $id > 0 ) {
					$ids[ $id ] = $id;
				}
			}

			return array_values( $ids );
		}
	}
}
