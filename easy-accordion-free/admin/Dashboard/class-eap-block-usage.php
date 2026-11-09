<?php
/**
 * Block Usage.
 *
 * Builds the dashboard's "Accordion Placements" table: every page, post,
 * template and widget area that shows an Easy Accordion block, a classic
 * shortcode accordion or a saved template, plus the classic accordions and
 * saved templates that are not placed anywhere yet.
 *
 * @package Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/Admin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'EAP_Block_Usage' ) ) {

	/**
	 * Scans content for Easy Accordion placements.
	 */
	class EAP_Block_Usage {

		/**
		 * Block namespace every Easy Accordion block shares.
		 */
		const NAMESPACE_PREFIX = 'sp-easy-accordion-pro/';

		/**
		 * The legacy block that embeds a classic accordion by id.
		 */
		const SHORTCODE_BLOCK = 'sp-easy-accordion-pro/shortcode';

		/**
		 * Classic shortcode accordion post type.
		 */
		const SHORTCODE_POST_TYPE = 'sp_easy_accordion';

		/**
		 * Saved template post type.
		 */
		const TEMPLATE_POST_TYPE = 'sp_eap_template';

		/**
		 * Shortcode tags that embed something, what they embed, and the
		 * attribute holding its id.
		 *
		 * @var array<string, array{0: string, 1: string}>
		 */
		const SHORTCODE_TAGS = array(
			'sp_easyaccordion' => array( 'shortcode', 'id' ),
			'sp_eap_template'  => array( 'template', 'id' ),
		);

		/**
		 * Option holding when widgets were last saved. WordPress keeps widgets
		 * in options, which carry no date, so the plugin records one.
		 */
		const WIDGETS_MODIFIED_OPTION = 'sp_eap_widgets_modified';

		/**
		 * Widget options whose save counts as "widgets updated".
		 *
		 * @var string[]
		 */
		const WIDGET_OPTIONS = array( 'widget_block', 'widget_text', 'sidebars_widgets' );

		/**
		 * Most posts one scan reads. A site with more still gets a table; the
		 * response says it was capped.
		 */
		const MAX_POSTS = 500;

		/**
		 * Option holding the last scan. An option, not a transient: the table
		 * shows this report until someone syncs, so nothing may expire it.
		 */
		const CACHE_OPTION = 'sp_eap_placements_report';

		/**
		 * Shape version of the stored report. A report saved in an older
		 * shape is scanned again rather than served.
		 */
		const CACHE_VERSION = 1;

		/**
		 * Statuses a placement is listed under. Anything but "publish" is
		 * flagged in the table (Draft, Scheduled, …).
		 *
		 * @var string[]
		 */
		const STATUSES = array( 'publish', 'future', 'draft', 'pending', 'private' );

		/**
		 * Post types that are never a placement: the plugin's own content and
		 * WordPress internals.
		 *
		 * @var string[]
		 */
		const EXCLUDED_TYPES = array(
			'revision',
			'nav_menu_item',
			'customize_changeset',
			'oembed_cache',
			'user_request',
			'wp_global_styles',
			'wp_font_family',
			'wp_font_face',
			'attachment',
			'sp_easy_accordion',
			self::SHORTCODE_POST_TYPE,
			self::TEMPLATE_POST_TYPE,
			'sp_accordion_faqs',
		);

		/**
		 * Count Easy Accordion blocks in parsed blocks, nested ones included.
		 *
		 * Pure: walks what parse_blocks() returned.
		 *
		 * @param array $blocks Parsed blocks.
		 * @return array<string, int> Block slug (e.g. "vertical-accordion") → count.
		 */
		public static function count_blocks( array $blocks ) {
			$counts = array();

			foreach ( $blocks as $block ) {
				if ( ! is_array( $block ) ) {
					continue;
				}

				$name = isset( $block['blockName'] ) ? (string) $block['blockName'] : '';
				if ( 0 === strpos( $name, self::NAMESPACE_PREFIX ) ) {
					$slug            = substr( $name, strlen( self::NAMESPACE_PREFIX ) );
					$counts[ $slug ] = ( isset( $counts[ $slug ] ) ? $counts[ $slug ] : 0 ) + 1;
				}

				if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
					foreach ( self::count_blocks( $block['innerBlocks'] ) as $slug => $count ) {
						$counts[ $slug ] = ( isset( $counts[ $slug ] ) ? $counts[ $slug ] : 0 ) + $count;
					}
				}
			}

			return $counts;
		}

		/**
		 * Classic accordion ids embedded through the legacy shortcode block.
		 *
		 * Pure: walks what parse_blocks() returned.
		 *
		 * @param array $blocks Parsed blocks.
		 * @return int[] Accordion ids, in page order, repeats kept.
		 */
		public static function find_block_shortcode_ids( array $blocks ) {
			$ids = array();

			foreach ( $blocks as $block ) {
				if ( ! is_array( $block ) ) {
					continue;
				}

				$name = isset( $block['blockName'] ) ? (string) $block['blockName'] : '';
				if ( self::SHORTCODE_BLOCK === $name && ! empty( $block['attrs']['shortcode'] ) ) {
					$id = absint( $block['attrs']['shortcode'] );
					if ( $id ) {
						$ids[] = $id;
					}
				}

				if ( ! empty( $block['innerBlocks'] ) && is_array( $block['innerBlocks'] ) ) {
					$ids = array_merge( $ids, self::find_block_shortcode_ids( $block['innerBlocks'] ) );
				}
			}

			return $ids;
		}

		/**
		 * Classic accordion and saved template ids a piece of content embeds.
		 *
		 * Pure. An escaped shortcode (`[[sp_easyaccordion id="1"]]`) prints as
		 * text, so it is not counted.
		 *
		 * @param string $content Raw content.
		 * @return array{shortcode: int[], template: int[]} Unique ids per source.
		 */
		public static function find_shortcode_ids( $content ) {
			$found = array(
				'shortcode' => array(),
				'template'  => array(),
			);

			$content = (string) $content;
			if ( false === strpos( $content, '[' ) ) {
				return $found;
			}

			$tags = implode( '|', array_map( 'preg_quote', array_keys( self::SHORTCODE_TAGS ) ) );

			if ( ! preg_match_all( '/(?<!\[)\[(' . $tags . ')(?=[\s\]\/])([^\]]*)\](?!\])/i', $content, $matches, PREG_SET_ORDER ) ) {
				return $found;
			}

			foreach ( $matches as $match ) {
				list( $source, $attribute ) = self::SHORTCODE_TAGS[ strtolower( $match[1] ) ];

				if ( preg_match( '/(?:^|\s)' . $attribute . '\s*=\s*(["\']?)(\d+)\1/i', $match[2], $id_match ) ) {
					$id = absint( $id_match[2] );
					if ( $id && ! in_array( $id, $found[ $source ], true ) ) {
						$found[ $source ][] = $id;
					}
				}
			}

			return $found;
		}

		/**
		 * Display name of a classic accordion's layout.
		 *
		 * Pure. Reads the `eap_accordion_type` the shortcode editor saved; a view
		 * saved before a type was picked is the default content accordion.
		 *
		 * @param mixed $shortcode_options The accordion's `sp_eap_shortcode_options` meta.
		 * @return string Layout name.
		 */
		public static function classic_layout_label( $shortcode_options ) {
			$options = is_array( $shortcode_options ) ? $shortcode_options : array();
			$layout  = ! empty( $options['eap_accordion_type'] ) ? (string) $options['eap_accordion_type'] : 'content-accordion';

			// The names the accordion editor's Content Type field shows.
			$names = array(
				'content-accordion' => __( 'Content Accordion', 'easy-accordion-free' ),
				'post-accordion'    => __( 'Post Accordion', 'easy-accordion-free' ),
				'image-accordion'   => __( 'Image Accordion', 'easy-accordion-free' ),
			);

			if ( isset( $names[ $layout ] ) ) {
				return $names[ $layout ];
			}

			return ucwords( str_replace( array( '-', '_' ), ' ', $layout ) );
		}

		/**
		 * Display names of counted blocks, most used first.
		 *
		 * Pure.
		 *
		 * @param array<string, int>    $blocks Block slug → count.
		 * @param array<string, string> $labels Block slug → display name.
		 * @return string[] Names.
		 */
		public static function block_layouts( array $blocks, array $labels = array() ) {
			arsort( $blocks );

			$layouts = array();
			foreach ( array_keys( $blocks ) as $slug ) {
				$layouts[] = isset( $labels[ $slug ] ) ? (string) $labels[ $slug ] : ucwords( str_replace( array( '-', '_' ), ' ', (string) $slug ) );
			}

			return $layouts;
		}

		/**
		 * Turn scanned locations and sources into table rows.
		 *
		 * Pure. A location gets one row per kind of placement it holds (its
		 * blocks, its classic accordions, its saved templates), listing the
		 * layouts shown there. A classic accordion or saved template placed
		 * nowhere gets a row with no location. Newest first.
		 *
		 * @param array $locations    Locations: key, title, type, status, statusLabel,
		 *                            editUrl, viewUrl, modified, blocks (slug → count),
		 *                            shortcodes (ids), templates (ids).
		 * @param array $shortcodes   Accordion id → title, layouts, editUrl, modified.
		 * @param array $templates    Template id → title, layouts, editUrl, modified.
		 * @param array $block_labels Block slug → display name.
		 * @return array<int, array<string, mixed>> Rows.
		 */
		public static function build_rows( array $locations, array $shortcodes, array $templates, array $block_labels = array() ) {
			$rows    = array();
			$sources = array(
				'shortcode' => $shortcodes,
				'template'  => $templates,
			);
			$placed  = array(
				'shortcode' => array(),
				'template'  => array(),
			);

			foreach ( $locations as $location ) {
				$place    = array(
					'title'       => isset( $location['title'] ) ? (string) $location['title'] : '',
					'type'        => isset( $location['type'] ) ? (string) $location['type'] : '',
					'status'      => isset( $location['status'] ) ? (string) $location['status'] : 'publish',
					'statusLabel' => isset( $location['statusLabel'] ) ? (string) $location['statusLabel'] : '',
					'editUrl'     => isset( $location['editUrl'] ) ? (string) $location['editUrl'] : '',
					'viewUrl'     => isset( $location['viewUrl'] ) ? (string) $location['viewUrl'] : '',
				);
				$key      = isset( $location['key'] ) ? (string) $location['key'] : '';
				$modified = isset( $location['modified'] ) ? (int) $location['modified'] : 0;

				$blocks = isset( $location['blocks'] ) && is_array( $location['blocks'] ) ? $location['blocks'] : array();
				if ( ! empty( $blocks ) ) {
					$rows[] = array(
						'key'      => $key . ':block',
						'source'   => 'block',
						'location' => $place,
						'layouts'  => self::block_layouts( $blocks, $block_labels ),
						'names'    => array(),
						'modified' => $modified,
						'editUrl'  => $place['editUrl'],
					);
				}

				foreach ( array(
					'shortcode' => 'shortcodes',
					'template'  => 'templates',
				) as $source => $field ) {
					$ids     = isset( $location[ $field ] ) && is_array( $location[ $field ] ) ? $location[ $field ] : array();
					$layouts = array();
					$names   = array();

					foreach ( array_unique( array_map( 'intval', $ids ) ) as $id ) {
						if ( ! isset( $sources[ $source ][ $id ] ) ) {
							continue;
						}

						$item                     = $sources[ $source ][ $id ];
						$placed[ $source ][ $id ] = true;
						$names[]                  = isset( $item['title'] ) ? (string) $item['title'] : '';
						$layouts                  = array_merge( $layouts, isset( $item['layouts'] ) ? (array) $item['layouts'] : array() );
					}

					if ( empty( $names ) ) {
						continue;
					}

					$rows[] = array(
						'key'      => $key . ':' . $source,
						'source'   => $source,
						'location' => $place,
						'layouts'  => array_values( array_unique( $layouts ) ),
						'names'    => $names,
						'modified' => $modified,
						'editUrl'  => $place['editUrl'],
					);
				}
			}

			foreach ( $sources as $source => $items ) {
				foreach ( $items as $id => $item ) {
					if ( isset( $placed[ $source ][ $id ] ) ) {
						continue;
					}

					$rows[] = array(
						'key'      => $source . '-' . $id . ':unused',
						'source'   => $source,
						'location' => null,
						'layouts'  => array_values( array_unique( isset( $item['layouts'] ) ? (array) $item['layouts'] : array() ) ),
						'names'    => array( isset( $item['title'] ) ? (string) $item['title'] : '' ),
						'modified' => isset( $item['modified'] ) ? (int) $item['modified'] : 0,
						'editUrl'  => isset( $item['editUrl'] ) ? (string) $item['editUrl'] : '',
					);
				}
			}

			// Stable newest-first: equal dates keep scan order.
			$order = array_keys( $rows );
			array_multisort( array_column( $rows, 'modified' ), SORT_DESC, $order, SORT_ASC, $rows );

			return $rows;
		}

		/**
		 * Record the time whenever widgets are saved, from any screen: the
		 * block widget editor (REST), the classic Widgets screen or the
		 * Customizer. Runs on every request, not only on the dashboard.
		 *
		 * @return void
		 */
		public static function register_hooks() {
			foreach ( self::WIDGET_OPTIONS as $option ) {
				add_action( 'add_option_' . $option, array( __CLASS__, 'touch_widgets' ) );
				add_action( 'update_option_' . $option, array( __CLASS__, 'touch_widgets' ) );
			}
		}

		/**
		 * Stamp the widgets as updated now.
		 *
		 * WordPress fires the update hook only when the stored value really
		 * changed, so opening a screen without saving leaves the date alone.
		 *
		 * @return void
		 */
		public static function touch_widgets() {
			update_option( self::WIDGETS_MODIFIED_OPTION, time(), false );
		}

		/**
		 * The placements report.
		 *
		 * Served from the stored report whenever there is one — content edited
		 * since does not change it. The site is scanned only when nothing is
		 * stored yet (the first visit) or when `$force` asks for it (the
		 * dashboard's Sync button).
		 *
		 * @param bool $force Scan the site again and replace the stored report.
		 * @return array<string, mixed> Report: rows, capped, scannedAt.
		 */
		public static function report( $force = false ) {
			$cached = get_option( self::CACHE_OPTION );

			if ( ! $force && self::is_current_cache( $cached ) ) {
				return $cached['report'];
			}

			$report = self::scan();
			update_option(
				self::CACHE_OPTION,
				array(
					'version' => self::CACHE_VERSION,
					'report'  => $report,
				),
				false
			);

			return $report;
		}

		/**
		 * Whether a stored value is a report this version can serve.
		 *
		 * Pure.
		 *
		 * @param mixed $cached What the cache option holds.
		 * @return bool
		 */
		public static function is_current_cache( $cached ) {
			return is_array( $cached )
				&& isset( $cached['version'], $cached['report'] )
				&& self::CACHE_VERSION === $cached['version']
				&& is_array( $cached['report'] )
				&& isset( $cached['report']['rows'] )
				&& is_array( $cached['report']['rows'] );
		}

		/**
		 * Whether the stored report has at least one row — null until one exists.
		 *
		 * Reads the cache only, so the dashboard bootstrap never triggers a scan.
		 *
		 * @return bool|null
		 */
		public static function stored_has_placements() {
			return self::cache_has_rows( get_option( self::CACHE_OPTION ) );
		}

		/**
		 * Whether a stored value is a current report with at least one row.
		 *
		 * Pure.
		 *
		 * @param mixed $cached What the cache option holds.
		 * @return bool|null Null when the value is not a report this version can serve.
		 */
		public static function cache_has_rows( $cached ) {
			if ( ! self::is_current_cache( $cached ) ) {
				return null;
			}

			return count( $cached['report']['rows'] ) > 0;
		}

		/**
		 * Whether saved templates are on (their CPT and shortcode are live).
		 *
		 * @return bool
		 */
		private static function templates_enabled() {
			return class_exists( 'SP_EAP' ) && (bool) SP_EAP::eap_manage_module_settings( 'saved_templates' );
		}

		/**
		 * Read every place that shows an Easy Accordion, and what it shows.
		 *
		 * The LIKE narrows the read to posts whose content mentions a block or
		 * shortcode at all; parse_blocks() and the shortcode matcher then read
		 * what is really there, so a post quoting the markup as text is not
		 * reported as using it.
		 *
		 * @return array<string, mixed>
		 */
		private static function scan() {
			global $wpdb;

			$types = array_values( array_diff( get_post_types( array(), 'names' ), self::EXCLUDED_TYPES ) );

			if ( empty( $types ) ) {
				return self::empty_report();
			}

			$markers = array( '<!-- wp:' . self::NAMESPACE_PREFIX, '<!-- wp:' . self::SHORTCODE_BLOCK );
			foreach ( array_keys( self::SHORTCODE_TAGS ) as $tag ) {
				$markers[] = '[' . $tag;
			}

			$likes = array();
			foreach ( $markers as $marker ) {
				$likes[] = '%' . $wpdb->esc_like( $marker ) . '%';
			}

			$type_placeholders   = implode( ', ', array_fill( 0, count( $types ), '%s' ) );
			$status_placeholders = implode( ', ', array_fill( 0, count( self::STATUSES ), '%s' ) );
			$like_clauses        = implode( ' OR ', array_fill( 0, count( $likes ), 'post_content LIKE %s' ) );

			// phpcs:disable WordPress.DB.DirectDatabaseQuery.DirectQuery, WordPress.DB.DirectDatabaseQuery.NoCaching, WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare, WordPress.DB.PreparedSQL.InterpolatedNotPrepared, WordPress.DB.PreparedSQLPlaceholders.ReplacementsWrongNumber -- one bounded read, cached above; placeholders are built from counted arrays.
			$ids = $wpdb->get_col(
				$wpdb->prepare(
					"SELECT ID FROM {$wpdb->posts} WHERE post_type IN ( {$type_placeholders} ) AND post_status IN ( {$status_placeholders} ) AND ( {$like_clauses} ) ORDER BY post_modified_gmt DESC LIMIT %d",
					array_merge( $types, self::STATUSES, $likes, array( self::MAX_POSTS + 1 ) )
				)
			);
			// phpcs:enable

			$capped    = count( $ids ) > self::MAX_POSTS;
			$ids       = array_slice( array_map( 'absint', (array) $ids ), 0, self::MAX_POSTS );
			$locations = array();

			foreach ( $ids as $id ) {
				$post = get_post( $id );
				if ( ! $post ) {
					continue;
				}

				$location = self::post_location( $post );
				if ( $location ) {
					$locations[] = $location;
				}
			}

			$widgets = self::widget_location();
			if ( $widgets ) {
				$locations[] = $widgets;
			}

			$templates = self::templates_enabled() ? self::sources( self::TEMPLATE_POST_TYPE ) : array();

			return array(
				'rows'      => self::build_rows( $locations, self::sources( self::SHORTCODE_POST_TYPE ), $templates, self::block_labels() ),
				'capped'    => $capped,
				'scannedAt' => time(),
			);
		}

		/**
		 * What one post shows, or null when it shows nothing.
		 *
		 * @param WP_Post $post Post.
		 * @return array<string, mixed>|null
		 */
		private static function post_location( $post ) {
			$parsed  = parse_blocks( $post->post_content );
			$blocks  = self::count_blocks( $parsed );
			$found   = self::find_shortcode_ids( $post->post_content );
			$views   = array_values( array_unique( array_merge( self::find_block_shortcode_ids( $parsed ), $found['shortcode'] ) ) );
			$library = $found['template'];

			if ( empty( $blocks ) && empty( $views ) && empty( $library ) ) {
				return null;
			}

			$type_object = get_post_type_object( $post->post_type );
			$is_public   = $type_object && ( $type_object->public || $type_object->publicly_queryable );
			$status      = get_post_status_object( $post->post_status );
			$view_url    = '';

			if ( $is_public ) {
				$view_url = in_array( $post->post_status, array( 'publish', 'private' ), true )
					? (string) get_permalink( $post )
					: (string) get_preview_post_link( $post );
			}

			return array(
				'key'         => 'post-' . $post->ID,
				'title'       => self::title( $post ),
				'type'        => $type_object ? $type_object->labels->singular_name : $post->post_type,
				'status'      => $post->post_status,
				'statusLabel' => 'publish' === $post->post_status ? '' : ( $status ? $status->label : $post->post_status ),
				'editUrl'     => current_user_can( 'edit_post', $post->ID ) ? (string) get_edit_post_link( $post->ID, 'raw' ) : '',
				'viewUrl'     => $view_url,
				'modified'    => (int) get_post_modified_time( 'U', true, $post ),
				'blocks'      => $blocks,
				'shortcodes'  => $views,
				'templates'   => $library,
			);
		}

		/**
		 * The active widget areas, as one location, or null when no active
		 * widget shows anything.
		 *
		 * Block widgets and Text widgets are read; a widget parked under
		 * "Inactive widgets" is not on the site.
		 *
		 * @return array<string, mixed>|null
		 */
		private static function widget_location() {
			$sidebars = get_option( 'sidebars_widgets' );
			if ( ! is_array( $sidebars ) ) {
				return null;
			}

			$active = array();
			foreach ( $sidebars as $sidebar => $widget_ids ) {
				if ( 'wp_inactive_widgets' === $sidebar || ! is_array( $widget_ids ) ) {
					continue;
				}
				foreach ( $widget_ids as $widget_id ) {
					$active[ (string) $widget_id ] = true;
				}
			}

			$content = '';
			foreach ( array(
				'block' => 'content',
				'text'  => 'text',
			) as $base => $field ) {
				$instances = get_option( 'widget_' . $base );
				if ( ! is_array( $instances ) ) {
					continue;
				}
				foreach ( $instances as $number => $instance ) {
					if ( isset( $active[ $base . '-' . $number ] ) && is_array( $instance ) && ! empty( $instance[ $field ] ) ) {
						$content .= "\n" . (string) $instance[ $field ];
					}
				}
			}

			if ( '' === $content ) {
				return null;
			}

			$parsed = parse_blocks( $content );
			$found  = self::find_shortcode_ids( $content );
			$blocks = self::count_blocks( $parsed );
			$views  = array_values( array_unique( array_merge( self::find_block_shortcode_ids( $parsed ), $found['shortcode'] ) ) );

			if ( empty( $blocks ) && empty( $views ) && empty( $found['template'] ) ) {
				return null;
			}

			return array(
				'key'         => 'widgets',
				'title'       => __( 'Widgets', 'easy-accordion-free' ),
				'type'        => __( 'Widget', 'easy-accordion-free' ),
				'status'      => 'publish',
				'statusLabel' => '',
				'editUrl'     => current_user_can( 'edit_theme_options' ) ? admin_url( 'widgets.php' ) : '',
				'viewUrl'     => home_url( '/' ),
				// 0 (shown as a dash) until widgets are next saved after this
				// was added — there is no earlier date to recover.
				'modified'    => absint( get_option( self::WIDGETS_MODIFIED_OPTION, 0 ) ),
				'blocks'      => $blocks,
				'shortcodes'  => $views,
				'templates'   => $found['template'],
			);
		}

		/**
		 * Classic accordions or saved templates, keyed by id.
		 *
		 * @param string $post_type Source post type.
		 * @return array<int, array<string, mixed>>
		 */
		private static function sources( $post_type ) {
			$posts = get_posts(
				array(
					'post_type'              => $post_type,
					'post_status'            => self::STATUSES,
					'numberposts'            => self::MAX_POSTS,
					'orderby'                => 'modified',
					'order'                  => 'DESC',
					'suppress_filters'       => true,
					'update_post_term_cache' => false,
				)
			);

			$labels  = self::block_labels();
			$sources = array();

			foreach ( $posts as $post ) {
				if ( self::SHORTCODE_POST_TYPE === $post_type ) {
					$layouts = array( self::classic_layout_label( get_post_meta( $post->ID, 'sp_eap_shortcode_options', true ) ) );
				} else {
					$layouts = self::block_layouts( self::count_blocks( parse_blocks( $post->post_content ) ), $labels );
				}

				$sources[ (int) $post->ID ] = array(
					'title'    => self::title( $post ),
					'layouts'  => $layouts,
					'editUrl'  => current_user_can( 'edit_post', $post->ID ) ? (string) get_edit_post_link( $post->ID, 'raw' ) : '',
					'modified' => (int) get_post_modified_time( 'U', true, $post ),
				);
			}

			return $sources;
		}

		/**
		 * Display names of the registered Easy Accordion blocks.
		 *
		 * @return array<string, string> Block slug → title.
		 */
		private static function block_labels() {
			$labels = array();

			if ( ! class_exists( '\WP_Block_Type_Registry' ) ) {
				return $labels;
			}

			foreach ( \WP_Block_Type_Registry::get_instance()->get_all_registered() as $name => $type ) {
				if ( 0 === strpos( $name, self::NAMESPACE_PREFIX ) && ! empty( $type->title ) ) {
					$labels[ substr( $name, strlen( self::NAMESPACE_PREFIX ) ) ] = (string) $type->title;
				}
			}

			return $labels;
		}

		/**
		 * A post's title as plain text, or a placeholder for an untitled one.
		 *
		 * @param WP_Post $post Post.
		 * @return string
		 */
		private static function title( $post ) {
			$title = get_the_title( $post );

			return '' !== trim( $title ) ? wp_strip_all_tags( html_entity_decode( $title, ENT_QUOTES, 'UTF-8' ) ) : __( '(no title)', 'easy-accordion-free' );
		}

		/**
		 * A report for a site with nothing to scan.
		 *
		 * @return array<string, mixed>
		 */
		private static function empty_report() {
			return array(
				'rows'      => array(),
				'capped'    => false,
				'scannedAt' => time(),
			);
		}
	}
}
