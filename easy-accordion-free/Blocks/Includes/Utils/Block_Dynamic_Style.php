<?php
/**
 * The plugin gutenberg block template dynamic CSS class.
 *
 * @link       https://shapedplugin.com/
 * @since      3.1.0
 *
 * @package    Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/blocks/includes
 * @author     ShapedPlugin <support@shapedplugin.com>
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes\Utils;

use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Helper;
use ShapedPlugin\EasyAccordion\Blocks\Includes\EAP_File_System;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block template dynamic css class.
 */
class Block_Dynamic_Style {

	/**
	 * Our blocks names.
	 *
	 * @var array
	 */
	public $our_blocks = array();

	/**
	 * Assets folder directory.
	 *
	 * @var string
	 */
	public $eab_assets_folder_dir = '/easy-accordion/assets/';

	/**
	 * CSS URL base.
	 *
	 * @var string
	 */
	public $css_url = '';

	/**
	 * Holds widget_css_option_name.
	 *
	 * @var string
	 */
	public $widget_css_option_name = 'sp_eab_widget_css_files';

	/**
	 * Holds class instance (Singleton).
	 *
	 * @var Block_Dynamic_Style|null
	 */
	private static $instance;

	/**
	 * Filesystem helper.
	 *
	 * @var EAP_File_System
	 */
	private $file_system;

	/**
	 * Cache for current theme stylesheet.
	 *
	 * @var string|null
	 */
	private $cached_theme_stylesheet = null;

	/**
	 * Returns Singleton instance.
	 *
	 * @return Block_Dynamic_Style
	 */
	public static function instance() {
		if ( ! isset( self::$instance ) ) {
			self::$instance = new self();
			self::$instance->init();
		}
		return self::$instance;
	}

	/**
	 * Constructor function.
	 *
	 * @param array $block_names Block names (optional).
	 */
	public function __construct( $block_names = array() ) {
		$this->file_system = new EAP_File_System();

		// manage our blocks.
		$child_blocks     = array(
			'sp-easy-accordion-pro/accordion-item',
			'sp-easy-accordion-pro/image-accordion-item',
			'sp-easy-accordion-pro/sidebar-tab-item',
		);
		$parent_blocks    = Blocks_Helper::sp_eab_get_active_block_list();
		$this->our_blocks = array_merge( $child_blocks, $parent_blocks );
		// get upload dir.
		$upload_dir    = wp_upload_dir();
		$this->css_url = trailingslashit( $upload_dir['baseurl'] ) . 'easy-accordion/assets/';
		if ( ! empty( $block_names ) && is_array( $block_names ) ) {
			$this->our_blocks = $block_names;
		}
		add_action( 'wp_enqueue_scripts', array( $this, 'collect_blocks_and_generate_css' ) );
		add_action( 'dynamic_sidebar_after', array( $this, 'generate_widget_dynamic_css' ) );
		add_filter(
			'dynamic_sidebar_params',
			function ( $params ) {
				global $sp_current_page_widgets;
				$widget_id = $params[0]['widget_id'] ?? '';
				if ( strpos( $widget_id, 'block-' ) === 0 ) {
					$sp_current_page_widgets[] = array(
						'sidebar_id'  => $params[0]['id'],
						'widget_id'   => $params[0]['widget_id'],
						'widget_name' => $params[0]['widget_name'],
					);
				}
				return $params;
			}
		);
	}

	/**
	 * Generates dynamic CSS for widgets in non-block themes.
	 *
	 * @return void
	 */
	public function generate_widget_dynamic_css() {
		// Only for classic themes.
		if ( function_exists( 'wp_is_block_theme' ) && wp_is_block_theme() ) {
			return;
		}
		global $sp_current_page_widgets, $wp_registered_sidebars;
		if ( empty( $wp_registered_sidebars ) || empty( $sp_current_page_widgets ) ) {
			return;
		}
		$widget_blocks     = get_option( 'widget_block', array() );
		$inline_style      = '';
		$google_fonts_list = array();
		foreach ( $sp_current_page_widgets as $widget ) {
			// Ensure widget ID exists.
			if ( empty( $widget['widget_id'] ) ) {
				continue;
			}
			$widget_id = $widget['widget_id']; // e.g. block-2.
			// Only block widgets (block-*).
			if ( strpos( $widget_id, 'block-' ) !== 0 ) {
				continue;
			}
			// Extract instance number from widget ID.
			if ( ! preg_match( '/-(\d+)$/', $widget_id, $matches ) ) {
				continue;
			}
			$instance = (int) $matches[1];
			// Validate widget content exists.
			if ( empty( $widget_blocks[ $instance ]['content'] ) ) {
				continue;
			}
			$widget_content = $widget_blocks[ $instance ]['content'];
			$blocks         = parse_blocks( $widget_content );
			if ( empty( $blocks ) ) {
				continue;
			}
			// Load cached dynamic CSS if exists.
			$sanitized_widget_id = sanitize_key( $instance );
			$widget_dynamic_css  = get_option( 'sp_eab_dynamic_css_' . $sanitized_widget_id, '' );
			$widget_fonts        = get_option( 'sp_eab_dynamic_fonts_' . $sanitized_widget_id, array() );
			// Generate CSS only if our blocks exist and CSS is empty.
			if ( empty( $widget_dynamic_css ) && $this->has_our_blocks( $blocks ) ) {
				$dynamic_assets = $this->generate_and_save_css_file(
					$widget_id,
					$blocks,
					'',
					true
				);
				if ( false !== $dynamic_assets && is_array( $dynamic_assets ) ) {
					$widget_dynamic_css = $dynamic_assets[0] ?? '';
					$widget_fonts       = $dynamic_assets[1] ?? array();
				}
			}
			if ( ! empty( $widget_dynamic_css ) ) {
				$inline_style .= $widget_dynamic_css;
			}
			if ( $widget_fonts && is_array( $widget_fonts ) ) {
				$google_fonts_list = array_merge( $google_fonts_list, $widget_fonts );
			}
		}
		// Output inline CSS directly in widget output because widget rendering happens after wp_head.
		if ( ! empty( $inline_style ) ) {
			echo '<style id="sp-eab-widget-dynamic-css">' . wp_strip_all_tags( $inline_style ) . '</style>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- widget rendering happens after wp_head.
		}
		if ( ! empty( $google_fonts_list ) ) {
			$google_fonts_list = array_unique( $google_fonts_list );
			$google_fonts      = array_map( 'rawurlencode', $google_fonts_list );
			echo '<link rel="stylesheet" id="sp-eab-widget-google-fonts" href="' . esc_url( 'https://fonts.googleapis.com/css?family=' . implode( '|', $google_fonts ) ) . '" />'; // phpcs:ignore -- WordPress.Security.EscapeOutput.OutputNotEscaped -- widget rendering happens after wp_head.
		}
	}

	/**
	 * Initializes all hooks for CSS generation and enqueueing.
	 *
	 * @return void
	 */
	public function init() {
		// Post save hooks.
		add_action( 'save_post', array( $this, 'eab_delete_css_file_by_id' ), 10, 2 );
		// FSE template hooks.
		add_action( 'wp_after_insert_post', array( $this, 'eab_handle_fse_template_delete' ), 10, 2 );
		// Delete css file.
		add_action( 'before_delete_post', array( $this, 'eab_delete_css_file_by_id' ) );
		add_action( 'wp_trash_post', array( $this, 'eab_delete_css_file_by_id' ) );
		// Widget update hooks.
		add_action( 'update_option_widget_block', array( $this, 'eab_generate_widget_css' ), 10, 2 );
	}

	/**
	 * Main method to collect blocks from all sources and generate CSS files.
	 * Similar to class-block-template-css.php approach.
	 *
	 * @return void
	 */
	public function collect_blocks_and_generate_css() {
		global $_wp_current_template_content, $post;
		$inline_style      = '';
		$google_fonts_list = array();

		// Collect blocks from current post.
		if ( ! empty( $post ) ) {
			if ( $this->css_file_exists( $post->ID ) ) {
				$sp_rand = get_post_meta( $post->ID, '_sp_eab_unique_version', true );
				$sp_rand = ! empty( $sp_rand ) ? $sp_rand : wp_rand( 1000, 9999 );
				wp_enqueue_style( 'sp-eab-css-' . $post->ID, $this->css_url . 'sp-eab-style-' . $post->ID . '.css', array(), 'sp-eab-' . $sp_rand );
				$font_lists = get_post_meta( $post->ID, 'sp_eab_dynamic_fonts', true );
			} else {
				$dynamic_assets = $this->generate_post_css_file( $post->ID, $post );
				if ( false !== $dynamic_assets && is_array( $dynamic_assets ) ) {
					$font_lists    = $dynamic_assets[1] ?? array();
					$inline_style .= $dynamic_assets[0] ?? '';
					$unique_id     = wp_rand( 1000, 9999 );
					update_post_meta( $post->ID, '_sp_eab_unique_version', $unique_id );
				} else {
					$font_lists = array();
				}
			}

			if ( $font_lists && is_array( $font_lists ) ) {
				$google_fonts_list = array_merge( $google_fonts_list, $font_lists );
			}

			if ( isset( $post->post_content ) ) {
				$reusable_ids     = $this->get_reusable_ids( $post->post_content );
				$eap_template_ids = $this->get_custom_save_template_ids( $post->post_content );
				if ( ! empty( $eap_template_ids ) ) {
					$reusable_ids = array_merge( $reusable_ids, $eap_template_ids );
				}
				if ( ! empty( $reusable_ids ) ) {
					foreach ( $reusable_ids as $reusable_id ) {
						if ( $this->css_file_exists( $reusable_id ) ) {
							$sp_rand = get_post_meta( $reusable_id, '_sp_eab_unique_version', true );
							$sp_rand = ! empty( $sp_rand ) ? $sp_rand : wp_rand( 1000, 9999 );
							wp_enqueue_style( 'sp-eab-css-' . $reusable_id, $this->css_url . 'sp-eab-style-' . $reusable_id . '.css', array(), 'sp-eab-' . $sp_rand );
							$font_lists = get_post_meta( $reusable_id, 'sp_eab_dynamic_fonts', true );
						} else {
							$dynamic_assets = $this->generate_post_css_file( $reusable_id );
							if ( false !== $dynamic_assets && is_array( $dynamic_assets ) ) {
								$font_lists    = $dynamic_assets[1] ?? array();
								$inline_style .= $dynamic_assets[0] ?? '';
								$unique_id     = wp_rand( 1000, 9999 );
								update_post_meta( $reusable_id, '_sp_eab_unique_version', $unique_id );
							} else {
								$font_lists = array();
							}
						}
						if ( $font_lists && is_array( $font_lists ) ) {
							$google_fonts_list = array_merge( $google_fonts_list, $font_lists );
						}
					}
				}
			}
		}

		// Collect blocks from current template content.
		if ( ! empty( $_wp_current_template_content ) ) {
			// Parse blocks once and reuse to avoid multiple parse_blocks() calls on same content.
			$blocks = parse_blocks( $_wp_current_template_content );
			// Cache theme name to avoid repeated calls.
			if ( null === $this->cached_theme_stylesheet ) {
				$this->cached_theme_stylesheet = wp_get_theme()->get_stylesheet();
			}
			$theme = $this->cached_theme_stylesheet;

			// First, check if main template has our blocks and generate CSS.
			if ( $this->has_our_blocks( $blocks ) ) {
				global $_wp_current_template_id;
				$template_id = ! empty( $_wp_current_template_id ) ? $_wp_current_template_id : 'current-template';
				// Extract only the last part if template_id contains / or //.
				if ( strpos( $template_id, '/' ) !== false || strpos( $template_id, '//' ) !== false ) {
					// Split by // first, then by /, and get the last part.
					$parts       = preg_split( '#//?#', $template_id );
					$template_id = end( $parts );
				}
				$sanitized_theme       = sanitize_key( $theme );
				$sanitized_template_id = sanitize_key( $template_id );
				$dynamic_css           = get_option( 'sp_eab_dynamic_css_' . $sanitized_theme . $sanitized_template_id );
				$font_lists            = get_option( 'sp_eab_dynamic_fonts_' . $sanitized_theme . $sanitized_template_id );
				if ( empty( $dynamic_css ) ) {
					$dynamic_assets = $this->generate_and_save_css_file( $template_id, $blocks, $theme, true );
					if ( false !== $dynamic_assets && is_array( $dynamic_assets ) ) {
						$font_lists  = $dynamic_assets[1] ?? array();
						$dynamic_css = $dynamic_assets[0] ?? '';
					} else {
						$dynamic_css = '';
						$font_lists  = array();
					}
				}

				$inline_style .= $dynamic_css;
				if ( is_array( $font_lists ) && ! empty( $font_lists ) ) {
					$google_fonts_list = array_merge( $google_fonts_list, $font_lists );
				}
			}

			// Reuse already parsed blocks for reusable IDs extraction.
			$reusable_ids = $this->get_reusable_ids_from_parsed_blocks( $blocks );

			if ( ! empty( $reusable_ids ) ) {
				foreach ( $reusable_ids as $reusable_id ) {
					if ( $this->css_file_exists( $reusable_id ) ) {
						$sp_rand = get_post_meta( $reusable_id, '_sp_eab_unique_version', true );
						$sp_rand = ! empty( $sp_rand ) ? $sp_rand : wp_rand( 1000, 9999 );
						wp_enqueue_style( 'sp-eab-css-' . $reusable_id, $this->css_url . 'sp-eab-style-' . $reusable_id . '.css', array(), 'sp-eab-' . $sp_rand );
						$font_lists = get_post_meta( $reusable_id, 'sp_eab_dynamic_fonts', true );
					} else {
						$dynamic_assets = $this->generate_post_css_file( $reusable_id );
						if ( false !== $dynamic_assets && is_array( $dynamic_assets ) ) {
							$font_lists    = $dynamic_assets[1] ?? array();
							$inline_style .= $dynamic_assets[0] ?? '';
							$unique_id     = wp_rand( 1000, 9999 );
							update_post_meta( $reusable_id, '_sp_eab_unique_version', $unique_id );
						} else {
							$font_lists = array();
						}
					}
					if ( is_array( $font_lists ) && ! empty( $font_lists ) ) {
						$google_fonts_list = array_merge( $google_fonts_list, $font_lists );
					}
				}
			}

			// Extract template part blocks and generate CSS for each template part (including nested ones).
			$template_parts = $this->extract_template_parts( $blocks, $theme );
			if ( ! empty( $template_parts ) ) {
				// Process each template part (handles nested template parts recursively).
				foreach ( $template_parts as $template_part_data ) {
					$template_part_content = $template_part_data['content'] ?? '';
					$template_part_slug    = $template_part_data['slug'] ?? '';
					$template_part_theme   = $template_part_data['theme'] ?? $theme;

					if ( ! empty( $template_part_content ) ) {
						// Process reusable blocks within template part.
						$reusable_ids = $this->get_reusable_ids( $template_part_content );
						// custom template css.
						$eap_template_ids = $this->get_custom_save_template_ids( $template_part_content );
						if ( ! empty( $eap_template_ids ) ) {
							$reusable_ids = array_merge( $reusable_ids, $eap_template_ids );
						}
						if ( ! empty( $reusable_ids ) ) {
							foreach ( $reusable_ids as $reusable_id ) {
								if ( $this->css_file_exists( $reusable_id ) ) {
									$sp_rand = get_post_meta( $reusable_id, '_sp_eab_unique_version', true );
									$sp_rand = ! empty( $sp_rand ) ? $sp_rand : wp_rand( 1000, 9999 );
									wp_enqueue_style( 'sp-eab-css-' . $reusable_id, $this->css_url . 'sp-eab-style-' . $reusable_id . '.css', array(), 'sp-eab-' . $sp_rand );
									$font_lists = get_post_meta( $reusable_id, 'sp_eab_dynamic_fonts', true );
								} else {
									$dynamic_assets = $this->generate_post_css_file( $reusable_id );
									if ( false !== $dynamic_assets && is_array( $dynamic_assets ) ) {
										$font_lists    = $dynamic_assets[1] ?? array();
										$inline_style .= $dynamic_assets[0] ?? '';
										$unique_id     = wp_rand( 1000, 9999 );
										update_post_meta( $reusable_id, '_sp_eab_unique_version', $unique_id );
									} else {
										$font_lists = array();
									}
								}
								if ( is_array( $font_lists ) && ! empty( $font_lists ) ) {
									$google_fonts_list = array_merge( $google_fonts_list, $font_lists );
								}
							}
						}

						// Parse template part blocks and process inner blocks.
						$template_part_blocks = parse_blocks( $template_part_content );

						// Process inner blocks recursively to extract nested template parts and generate CSS.
						$template_part_blocks = $this->get_all_blocks_from_template( $template_part_blocks );

						$file_id           = $template_part_slug;
						$sanitized_theme   = sanitize_key( $template_part_theme );
						$sanitized_file_id = sanitize_key( $file_id );
						$dynamic_css       = get_option( 'sp_eab_dynamic_css_' . $sanitized_theme . $sanitized_file_id ) ?? '';
						$font_lists        = get_option( 'sp_eab_dynamic_fonts_' . $sanitized_theme . $sanitized_file_id ) ?? array();

						if ( empty( $dynamic_css ) ) {
							if ( $this->has_our_blocks( $template_part_blocks ) ) {
								$dynamic_assets = $this->generate_and_save_css_file( $file_id, $template_part_blocks, $template_part_theme, true );
								if ( false !== $dynamic_assets && is_array( $dynamic_assets ) ) {
									$dynamic_css = $dynamic_assets[0] ?? '';
									$font_lists  = $dynamic_assets[1] ?? array();
								} else {
									$dynamic_css = '';
									$font_lists  = array();
								}
							}
						}

						if ( is_array( $font_lists ) && ! empty( $font_lists ) ) {
							$google_fonts_list = array_merge( $google_fonts_list, $font_lists );
						}

						$inline_style .= $dynamic_css;
					}
				}
			}
		}

		if ( ! empty( $inline_style ) ) {
			// Sanitize CSS to prevent injection attacks.
			$sanitized_css = wp_strip_all_tags( $inline_style );
			// Additional CSS sanitization: remove potentially dangerous patterns..
			// $sanitized_css = preg_replace( '/expression\s*\(/i', '', $sanitized_css );.
			// $sanitized_css = preg_replace( '/javascript\s*:/i', '', $sanitized_css );.
			// $sanitized_css = preg_replace( '/@import/i', '', $sanitized_css );.
			wp_add_inline_style( 'sp_eab_main_css', $sanitized_css );
		}
		if ( ! empty( $google_fonts_list ) ) {
			$google_fonts_list = array_unique( $google_fonts_list );
			wp_enqueue_style( 'sp-eab-google-fonts', 'https://fonts.googleapis.com/css?family=' . implode( '|', $google_fonts_list ), array(), SP_EA_VERSION, 'all' );
		}
	}

	/**
	 * Get All Reusable IDs from content.
	 *
	 * @param string $ea_post_content Post content.
	 *
	 * @return array
	 */
	public function get_reusable_ids( $ea_post_content ) {
		$reusable_id = array();
		if ( ! empty( $ea_post_content ) ) {
			if ( has_blocks( $ea_post_content ) && strpos( $ea_post_content, 'wp:block' ) && strpos( $ea_post_content, '"ref"' ) !== false
			) {
				$blocks = parse_blocks( $ea_post_content );
				foreach ( $blocks as $key => $value ) {
					if ( isset( $value['attrs']['ref'] ) && ! empty( $value['attrs']['ref'] ) ) {
						$reusable_id[] = $value['attrs']['ref'];
					}
					// Recursively check inner blocks.
					if ( ! empty( $value['innerBlocks'] ) ) {
						$inner_reusable_ids = $this->get_reusable_ids_from_blocks( $value['innerBlocks'] );
						$reusable_id        = array_merge( $reusable_id, $inner_reusable_ids );
					}
				}
			}
		}
		return array_unique( $reusable_id );
	}
	/**
	 * Get All Reusable IDs from content.
	 *
	 * @param string $ea_post_content Post content.
	 *
	 * @return array
	 */
	public function get_custom_save_template_ids( $ea_post_content ) {
		$reusable_id = array();

		if ( has_shortcode( $ea_post_content, 'sp_eap_template' ) ) {
			preg_match_all(
				'/\[sp_eap_template[^\]]*id=["\']?(\d+)["\']?[^\]]*\]/',
				$ea_post_content,
				$matches
			);

			if ( ! empty( $matches[1] ) ) {
				$reusable_id = $matches[1];
			}
		}
		return array_unique( $reusable_id );
	}

	/**
	 * Get reusable IDs from already parsed blocks (performance optimization).
	 *
	 * @param array $blocks Parsed blocks.
	 *
	 * @return array
	 */
	private function get_reusable_ids_from_parsed_blocks( $blocks ) {
		$reusable_id = array();
		if ( ! empty( $blocks ) ) {
			foreach ( $blocks as $key => $value ) {
				if ( isset( $value['attrs']['ref'] ) && ! empty( $value['attrs']['ref'] ) ) {
					$reusable_id[] = $value['attrs']['ref'];
				}
				// Recursively check inner blocks.
				if ( ! empty( $value['innerBlocks'] ) ) {
					$inner_reusable_ids = $this->get_reusable_ids_from_blocks( $value['innerBlocks'] );
					$reusable_id        = array_merge( $reusable_id, $inner_reusable_ids );
				}
			}
		}
		return array_unique( $reusable_id );
	}

	/**
	 * Get reusable IDs from blocks recursively.
	 *
	 * @param array $blocks Parsed blocks.
	 *
	 * @return array
	 */
	private function get_reusable_ids_from_blocks( $blocks ) {
		$reusable_ids = array();
		foreach ( $blocks as $block ) {
			if ( isset( $block['attrs']['ref'] ) && ! empty( $block['attrs']['ref'] ) && 'core/block' === $block['blockName'] ) {
				$reusable_ids[] = $block['attrs']['ref'];
			}
			if ( ! empty( $block['innerBlocks'] ) ) {
				$inner_ids    = $this->get_reusable_ids_from_blocks( $block['innerBlocks'] );
				$reusable_ids = array_merge( $reusable_ids, $inner_ids );
			}
		}
		return $reusable_ids;
	}

	/**
	 * Generate and save CSS file for a post.
	 *
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post    Post object (optional).
	 *
	 * @return string|false CSS string or false.
	 */
	public function generate_post_css_file( $post_id, $post = null ) {
		if ( null === $post ) {
			$post = get_post( $post_id );
		}

		if ( ! $post ) {
			return false;
		}

		$content = isset( $post->post_content ) ? $post->post_content : '';
		if ( empty( $content ) ) {
			$this->delete_css_file( $post_id );
			return false;
		}

		$blocks = parse_blocks( $content );
		if ( ! $this->has_our_blocks( $blocks ) ) {
			$this->delete_css_file( $post_id );
			return false;
		}

		return $this->generate_and_save_css_file( $post_id, $blocks );
	}

	/**
	 * Check if blocks contain our plugin blocks.
	 *
	 * @param array $blocks Parsed blocks.
	 *
	 * @return bool
	 */
	private function has_our_blocks( $blocks ) {
		foreach ( $blocks as $block ) {
			if ( ! empty( $block['blockName'] ) && in_array( $block['blockName'], $this->our_blocks, true ) ) {
				return true;
			}

			if ( ! empty( $block['innerBlocks'] ) && $this->has_our_blocks( $block['innerBlocks'] ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Recursively collects all blocks including nested template parts.
	 *
	 * @param array $blocks Parsed blocks.
	 *
	 * @return array All collected blocks.
	 */
	private function get_all_blocks_from_template( $blocks ) {

		$all_blocks = array();

		foreach ( $blocks as $block ) {

			$all_blocks[] = $block;

			// Normal inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$all_blocks = array_merge(
					$all_blocks,
					$this->get_all_blocks_from_template( $block['innerBlocks'] )
				);
			}

			// Resolve template parts.
			if ( 'core/template-part' === $block['blockName'] && ! empty( $block['attrs']['slug'] ) ) {

				$slug = $block['attrs']['slug'];
				// Cache theme name to avoid repeated calls.
				if ( null === $this->cached_theme_stylesheet ) {
					$this->cached_theme_stylesheet = wp_get_theme()->get_stylesheet();
				}
				$theme = $block['attrs']['theme'] ?? $this->cached_theme_stylesheet;
				$area  = $block['attrs']['area'] ?? '';

				$template_part = get_block_template(
					$theme . '//' . $slug,
					'wp_template_part'
				);

				if ( $template_part && ! empty( $template_part->content ) ) {
					$template_blocks = parse_blocks( $template_part->content );

					$all_blocks = array_merge(
						$all_blocks,
						$this->get_all_blocks_from_template( $template_blocks )
					);
				}
			}
		}

		return $all_blocks;
	}

	/**
	 * Extract CSS from blocks recursively.
	 *
	 * @param array  $blocks Parsed blocks.
	 * @param string $post_id is post id.
	 *
	 * @return string Combined CSS string.
	 */
	private function extract_css_from_blocks( $blocks, $post_id = '' ) {
		$style      = '';
		$custom_css = '';
		$fonts      = array();
		foreach ( $blocks as $block ) {
			// Check if this is one of our blocks.
			if ( ! empty( $block['blockName'] ) && in_array( $block['blockName'], $this->our_blocks, true ) ) {
				// Always generate CSS using DynamicCssGenerator.
				$generated_asset = $this->generate_css_from_attributes( $block );
				$generated_css   = $generated_asset[0] ?? '';
				$generated_fonts = $generated_asset[1] ?? array();

				if ( is_array( $generated_fonts ) ) {
					$fonts = array_merge( $fonts, $generated_fonts );
				}
				if ( ! empty( $generated_css ) ) {
					$style .= $generated_css;
				}
			}

			// Recursively process inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$generated_asset = $this->extract_css_from_blocks( $block['innerBlocks'], $post_id );
				$generated_css   = $generated_asset[0] ?? '';
				$generated_fonts = $generated_asset[1] ?? array();

				if ( is_array( $generated_fonts ) ) {
					$fonts = array_merge( $fonts, $generated_fonts );
				}
				if ( ! empty( $generated_css ) ) {
					$style .= $generated_css;
				}
			}
		}

		$dynamic_css = $style;
		return array( $dynamic_css, $fonts );
	}

	/**
	 * Generate CSS from block attributes using DynamicCssGenerator.
	 *
	 * @param array $block Block data.
	 *
	 * @return string Generated CSS.
	 */
	private function generate_css_from_attributes( $block ) {
		$block_name = $block['blockName'] ?? '';
		if ( empty( $block_name ) ) {
			return array( '', array() );
		}

		// Extract block name without namespace (e.g., 'vertical-accordion' from 'sp-easy-accordion-pro/vertical-accordion').
		$block_name_parts = explode( '/', $block_name );
		$block_name_short = end( $block_name_parts );

		// Get saved attributes.
		$saved_attrs = $block['attrs'] ?? array();

		// Get block type to merge with defaults.
		$block_type = \WP_Block_Type_Registry::get_instance()->get_registered( $block_name );
		$defaults   = array();

		if ( $block_type ) {
			$schema = $block_type->get_attributes();
			foreach ( $schema as $key => $attr ) {
				if ( isset( $attr['default'] ) ) {
					$defaults[ $key ] = $attr['default'];
				}
			}
		}

		// Merge saved attributes with defaults.
		$attributes = wp_parse_args( $saved_attrs, $defaults );

		// Add blockName to attributes for DynamicCssGenerator.
		$attributes['blockName'] = $block_name_short;

		// Generate CSS using DynamicCssGenerator.
		$css_generator = new DynamicCssGenerator( $attributes );
		$font_lists    = json_decode( $attributes['fontLists'] ?? '' ) ?? array();
		$css           = $css_generator->eab_generate_dynamic_css();

		return array( $css, $font_lists );
	}

	/**
	 * Get Pattern Content.
	 *
	 * @param array $attributes Attributes.
	 *
	 * @return string
	 */
	private function get_pattern_content( $attributes ) {
		$content = '';
		if ( isset( $attributes['slug'] ) ) {
			$block   = \WP_Block_Patterns_Registry::get_instance()->get_registered( $attributes['slug'] );
			$content = isset( $block ) ? $block['content'] : $content;
		}
		return $content;
	}

	/**
	 * Get Template Part Content.
	 *
	 * @param array $attributes Attributes.
	 *
	 * @return string
	 */
	private function get_template_part_content( $attributes ) {
		$content = '';

		// Cache theme name to avoid repeated calls.
		if ( null === $this->cached_theme_stylesheet ) {
			$this->cached_theme_stylesheet = wp_get_theme()->get_stylesheet();
		}

		if (
			isset( $attributes['slug'] ) &&
			isset( $attributes['theme'] ) &&
			$this->cached_theme_stylesheet === $attributes['theme']
		) {
			$template_part_query = new \WP_Query(
				array(
					'post_type'      => 'wp_template_part',
					'post_status'    => 'publish',
					'post_name__in'  => array( $attributes['slug'] ),
					'tax_query'      => array(
						array(
							'taxonomy' => 'wp_theme',
							'field'    => 'slug',
							'terms'    => $attributes['theme'],
						),
					),
					'posts_per_page' => 1,
					'no_found_rows'  => true,
				)
			);

			if ( $template_part_query->have_posts() ) {
				$template_part_post = $template_part_query->next_post();
				$content            = $template_part_post->post_content;
			} else {
				// Try to get from theme files.
				$parent_theme_folders        = get_block_theme_folders( get_template() );
				$child_theme_folders         = get_block_theme_folders( get_stylesheet() );
				$child_theme_part_file_path  = get_theme_file_path( '/' . $child_theme_folders['wp_template_part'] . '/' . $attributes['slug'] . '.html' );
				$parent_theme_part_file_path = get_theme_file_path( '/' . $parent_theme_folders['wp_template_part'] . '/' . $attributes['slug'] . '.html' );
				$template_part_file_path     = 0 === validate_file( $attributes['slug'] ) && file_exists( $child_theme_part_file_path ) ? $child_theme_part_file_path : $parent_theme_part_file_path;

				if ( 0 === validate_file( $attributes['slug'] ) && file_exists( $template_part_file_path ) ) {
					if ( $this->file_system->safe_filesystem_exists( $template_part_file_path ) ) {
						$content = $this->file_system->safe_filesystem_get_contents( $template_part_file_path );
					}
				}
			}
		}

		return $content;
	}

	/**
	 * Generate and save CSS file.
	 *
	 * @param int|string $file_id Post ID, widget ID, template ID, or template part ID.
	 * @param array      $blocks  Parsed blocks.
	 * @param string     $theme   Theme name (for FSE templates).
	 * @param bool       $is_fse_template Whether this is an FSE template.
	 *
	 * @return string|false CSS string or false.
	 */
	private function generate_and_save_css_file( $file_id, $blocks, $theme = '', $is_fse_template = false ) {
		// Extract CSS from blocks.
		$dynamic_assets = $this->extract_css_from_blocks( $blocks, $file_id );
		$css            = $dynamic_assets[0] ?? '';
		$font_lists     = $dynamic_assets[1] ?? array();

		if ( empty( $css ) ) {
			return false;
		}

		// Minify CSS.
		$css = $this->minify_css( $css );

		if ( $is_fse_template ) {
			$sanitized_theme   = sanitize_key( $theme );
			$sanitized_file_id = sanitize_key( $file_id );
			update_option( 'sp_eab_dynamic_css_' . $sanitized_theme . $sanitized_file_id, $css );
			update_option( 'sp_eab_dynamic_fonts_' . $sanitized_theme . $sanitized_file_id, $font_lists );
			return array( $css, $font_lists );
		}

		// Create CSS folder.
		$this->create_css_folder();

		// Get file path.
		$css_folder = $this->get_css_folder();
		$file_name  = $this->get_css_file_name( $file_id );
		$file_path  = $css_folder . $file_name;

		// Save file.
		$written = $this->file_system->safe_filesystem_put_contents( $file_path, $css );
		if ( ! $written ) {
			return false;
		}
		update_post_meta( $file_id, 'sp_eab_dynamic_fonts', $font_lists );
		return array( $css, $font_lists );
	}

	/**
	 * Create CSS folder if it doesn't exist.
	 *
	 * @return void
	 */
	private function create_css_folder() {
		$folder = $this->get_css_folder();

		if ( ! file_exists( $folder ) ) {
			wp_mkdir_p( $folder );
		}
	}

	/**
	 * Get CSS folder path.
	 *
	 * @return string
	 */
	private function get_css_folder() {
		$upload_dir = wp_upload_dir();
		return $upload_dir['basedir'] . $this->eab_assets_folder_dir;
	}

	/**
	 * Get CSS file name.
	 *
	 * @param int|string $id Post ID, widget ID, template ID, or template part ID.
	 *
	 * @return string
	 */
	private function get_css_file_name( $id ) {
		return "sp-eab-style-$id.css";
	}

	/**
	 * Minify CSS.
	 *
	 * @param string $css CSS content.
	 *
	 * @return string
	 */
	private function minify_css( $css ) {
		$css = preg_replace( '!/\*[^*]*\*+([^/][^*]*\*+)*/!', '', $css );
		$css = str_replace( array( "\r\n", "\n", "\t", '  ', '    ' ), '', $css );
		$css = str_replace( array( ' {', '{ ' ), '{', $css );
		$css = str_replace( array( ' }', '} ' ), '}', $css );
		$css = str_replace( array( ' ;', '; ' ), ';', $css );
		$css = str_replace( array( '@media only screen and (max-width: 599px){}', '@media only screen and (min-width: 600px) and (max-width: 1023px){}' ), '', $css );
		return trim( $css );
	}

	/**
	 * Check if CSS file exists by file name.
	 *
	 * @param string $file_name CSS file name (e.g., 'sp-eab-style-123.css').
	 *
	 * @return bool
	 */
	public function css_file_exists_by_name( $file_name ) {
		$folder    = $this->get_css_folder();
		$file_path = $folder . $file_name;

		return $this->file_system->safe_filesystem_exists( $file_path );
	}

	/**
	 * Check if CSS file exists by file ID.
	 *
	 * @param int|string $file_id Post ID, widget ID, template ID, or template part ID.
	 *
	 * @return bool
	 */
	public function css_file_exists( $file_id ) {
		$file_name = $this->get_css_file_name( $file_id );
		return $this->css_file_exists_by_name( $file_name );
	}

	/**
	 * Delete CSS file.
	 *
	 * @param int|string $file_id Post ID, widget ID, template ID, or template part ID.
	 *
	 * @return void
	 */
	public function delete_css_file( $file_id ) {
		$folder    = $this->get_css_folder();
		$file_path = $folder . $this->get_css_file_name( $file_id );

		$this->file_system->safe_filesystem_delete( $file_path );
	}

	/**
	 * Deletes CSS file associated with a post.
	 *
	 * @param int|string $css_file_id Post ID.
	 *
	 * @return void|boolean
	 */
	public function eab_delete_css_file_by_id( $css_file_id ) {
		$folder    = $this->get_css_folder();
		$file_path = $folder . $this->get_css_file_name( $css_file_id );

		if ( $this->file_system->safe_filesystem_delete( $file_path ) ) {
			delete_post_meta( $css_file_id, 'sp_eab_dynamic_fonts' );
			delete_post_meta( $css_file_id, '_sp_eab_unique_version' );
		}
	}

	/**
	 * Handles CSS deletion when FSE templates or parts are saved.
	 *
	 * @param int     $post_id Post ID.
	 * @param WP_Post $post    Post object.
	 *
	 * @return void
	 */
	public function eab_handle_fse_template_delete( $post_id, $post ) {

		if ( ! in_array( $post->post_type, array( 'wp_template', 'wp_template_part' ), true ) ) {
			return;
		}
		$field_id = get_post_field( 'post_name', $post_id );
		// Cache theme name to avoid repeated calls.
		if ( null === $this->cached_theme_stylesheet ) {
			$this->cached_theme_stylesheet = wp_get_theme()->get_stylesheet();
		}
		$theme              = $this->cached_theme_stylesheet;
		$sanitized_theme    = sanitize_key( $theme );
		$sanitized_field_id = sanitize_key( $field_id );

		delete_option( 'sp_eab_dynamic_css_' . $sanitized_theme . $sanitized_field_id );
		delete_option( 'sp_eab_dynamic_fonts_' . $sanitized_theme . $sanitized_field_id );
	}

	/**
	 * Generates CSS when a widget block is updated.
	 *
	 * @param mixed $old_value Old widget data.
	 * @param mixed $new_value New widget data.
	 *
	 * @return void
	 */
	public function eab_generate_widget_css( $old_value, $new_value ) {
		if ( ! is_array( $new_value ) ) {
			return;
		}
		foreach ( $new_value as $widget_id => $widget_data ) {
			if ( empty( $widget_data['content'] ) ) {
				continue;
			}

			$blocks              = parse_blocks( $widget_data['content'] );
			$sanitized_widget_id = sanitize_key( $widget_id );
			delete_option( 'sp_eab_dynamic_css_' . $sanitized_widget_id );
			delete_option( 'sp_eab_dynamic_fonts_' . $sanitized_widget_id );
		}
	}

	/**
	 * Extract template part slugs from blocks recursively.
	 *
	 * @param array $blocks Parsed blocks.
	 *
	 * @return array Array of unique template part slugs.
	 */
	private function extract_template_part_slugs( $blocks ) {
		$slugs = array();

		foreach ( $blocks as $block ) {
			// Check if this is a template part block.
			if ( 'core/template-part' === $block['blockName'] ) {
				$attrs = $block['attrs'] ?? array();
				if ( isset( $attrs['slug'] ) && ! empty( $attrs['slug'] ) ) {
					$slugs[] = $attrs['slug'];
				}
			}

			// Recursively check inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$inner_slugs = $this->extract_template_part_slugs( $block['innerBlocks'] );
				$slugs       = array_merge( $slugs, $inner_slugs );
			}

			// Handle reusable blocks (core/block).
			if ( isset( $block['attrs']['ref'] ) && ! empty( $block['attrs']['ref'] ) && 'core/block' === $block['blockName'] ) {
				$reusable_block = get_post( $block['attrs']['ref'] );
				if ( $reusable_block ) {
					$reusable_blocks = parse_blocks( $reusable_block->post_content );
					$inner_slugs     = $this->extract_template_part_slugs( $reusable_blocks );
					$slugs           = array_merge( $slugs, $inner_slugs );
				}
			}

			// Handle patterns (core/pattern).
			if ( 'core/pattern' === $block['blockName'] ) {
				$pattern_content = $this->get_pattern_content( $block['attrs'] );
				if ( ! empty( $pattern_content ) ) {
					$pattern_blocks = parse_blocks( $pattern_content );
					$inner_slugs    = $this->extract_template_part_slugs( $pattern_blocks );
					$slugs          = array_merge( $slugs, $inner_slugs );
				}
			}
		}

		return array_unique( $slugs );
	}

	/**
	 * Extract template parts with full details from blocks recursively.
	 * Handles nested template parts and inner blocks.
	 *
	 * @param array  $blocks Parsed blocks.
	 * @param string $theme  Theme name.
	 * @param array  $processed_slugs Already processed slugs to avoid infinite loops.
	 *
	 * @return array Array of template parts with slug, theme, area, and content.
	 */
	private function extract_template_parts( $blocks, $theme = '', $processed_slugs = array() ) {
		$template_parts = array();

		// Cache theme name to avoid repeated calls.
		if ( empty( $theme ) ) {
			if ( null === $this->cached_theme_stylesheet ) {
				$this->cached_theme_stylesheet = wp_get_theme()->get_stylesheet();
			}
			$theme = $this->cached_theme_stylesheet;
		}

		foreach ( $blocks as $block ) {
			// Check if this is a template part block.
			if ( 'core/template-part' === $block['blockName'] ) {
				$attrs       = $block['attrs'] ?? array();
				$slug        = $attrs['slug'] ?? '';
				$area        = $attrs['area'] ?? '';
				$block_theme = $attrs['theme'] ?? $theme;

				if ( ! empty( $slug ) ) {
					// Create unique key to avoid processing the same template part multiple times.
					$unique_key = $block_theme . '//' . $slug;

					// Skip if already processed to avoid infinite loops with nested template parts.
					if ( ! in_array( $unique_key, $processed_slugs, true ) ) {
						$processed_slugs[] = $unique_key;

						$template_part_attrs = array(
							'slug'  => $slug,
							'theme' => $block_theme,
							'area'  => $area,
						);

						$template_part_content = $this->get_template_part_content( $template_part_attrs );

						if ( ! empty( $template_part_content ) ) {
							$template_parts[] = array(
								'slug'    => $slug,
								'theme'   => $block_theme,
								'area'    => $area,
								'content' => $template_part_content,
							);

							// Recursively extract nested template parts from this template part.
							$nested_blocks = parse_blocks( $template_part_content );
							if ( ! empty( $nested_blocks ) ) {
								$nested_template_parts = $this->extract_template_parts( $nested_blocks, $block_theme, $processed_slugs );
								$template_parts        = array_merge( $template_parts, $nested_template_parts );
							}
						}
					}
				}
			}

			// Recursively check inner blocks.
			if ( ! empty( $block['innerBlocks'] ) ) {
				$inner_template_parts = $this->extract_template_parts( $block['innerBlocks'], $theme, $processed_slugs );
				$template_parts       = array_merge( $template_parts, $inner_template_parts );
			}

			// Handle reusable blocks (core/block).
			if ( isset( $block['attrs']['ref'] ) && ! empty( $block['attrs']['ref'] ) && 'core/block' === $block['blockName'] ) {
				$reusable_block = get_post( $block['attrs']['ref'] );
				if ( $reusable_block ) {
					$reusable_blocks      = parse_blocks( $reusable_block->post_content );
					$inner_template_parts = $this->extract_template_parts( $reusable_blocks, $theme, $processed_slugs );
					$template_parts       = array_merge( $template_parts, $inner_template_parts );
				}
			}

			// Handle patterns (core/pattern).
			if ( 'core/pattern' === $block['blockName'] ) {
				$pattern_content = $this->get_pattern_content( $block['attrs'] );
				if ( ! empty( $pattern_content ) ) {
					$pattern_blocks       = parse_blocks( $pattern_content );
					$inner_template_parts = $this->extract_template_parts( $pattern_blocks, $theme, $processed_slugs );
					$template_parts       = array_merge( $template_parts, $inner_template_parts );
				}
			}
		}

		// Remove duplicates based on unique key (theme + slug).
		$unique_template_parts = array();
		$seen_keys             = array();

		foreach ( $template_parts as $template_part ) {
			$unique_key = ( $template_part['theme'] ?? '' ) . '//' . ( $template_part['slug'] ?? '' );
			if ( ! in_array( $unique_key, $seen_keys, true ) ) {
				$seen_keys[]             = $unique_key;
				$unique_template_parts[] = $template_part;
			}
		}

		return $unique_template_parts;
	}
}
