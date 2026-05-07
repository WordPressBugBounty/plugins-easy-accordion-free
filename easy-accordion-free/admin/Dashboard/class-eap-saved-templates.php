<?php
/**
 * Saved Easy Accordion Templates.
 *
 * @link http://shapedplugin.com
 * @since 4.1.0
 *
 * @package Easy_Accordion_Free.
 * @subpackage Easy_Accordion_Free/Admin.
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

use ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\Block_Dynamic_Style;

if ( ! class_exists( 'EAP_Saved_Templates' ) ) {
	/**
	 * Handle Saved Templates functionality.
	 */
	class EAP_Saved_Templates {

		/**
		 * Constructor.
		 *
		 * Initialize hooks for saved templates functionality including CPT registration,
		 * admin redirects, block editor enforcement, and shortcode handling.
		 *
		 * @return void
		 */
		public function __construct() {
			// add submenu page for saved templates under Easy Accordion menu.
			add_action(
				'admin_menu',
				function () {
					add_submenu_page(
						'edit.php?post_type=sp_easy_accordion',
						__( 'Easy Accordion Pro Saved Templates', 'easy-accordion-free' ),
						__( 'Saved Templates', 'easy-accordion-free' ),
						apply_filters( 'easy_accordion_access_capability', 'manage_options' ),
						'edit.php?post_type=sp_easy_accordion&page=eap_dashboard#saved_templates'
					);
				}
			);
			// Register the CPT early enough for REST requests (Gutenberg saves via REST).
			add_action( 'init', array( $this, 'sp_eap_register_post_type' ) );
			add_action( 'admin_init', array( $this, 'eap_redirect_saved_template_edit_page' ) );
			add_filter( 'use_block_editor_for_post_type', array( $this, 'eap_force_block_editor_for_save_templates' ), 100, 2 );
			add_shortcode( 'sp_eap_template', array( $this, 'eap_saved_template_callback' ) );
		}

		/**
		 * Easy Accordion Saved Template post type.
		 */
		public function sp_eap_register_post_type() {
			if ( post_type_exists( 'sp_eap_template' ) ) {
				return;
			}
			$show_ui = current_user_can( 'manage_options' ) ? true : false;
			// Set the easy accordion saved template post type labels.
			$labels = array(
				'name'                     => __( 'Saved Templates', 'easy-accordion-free' ),
				'singular_name'            => __( 'Saved Template', 'easy-accordion-free' ),
				'menu_name'                => __( 'Saved Templates', 'easy-accordion-free' ),
				'all_items'                => __( 'Saved Templates', 'easy-accordion-free' ),
				'add_new'                  => __( 'Add New Template', 'easy-accordion-free' ),
				'add_new_item'             => __( 'Add New Template', 'easy-accordion-free' ),
				'edit'                     => __( 'Edit', 'easy-accordion-free' ),
				'edit_item'                => __( 'Edit Template', 'easy-accordion-free' ),
				'view_item'                => __( 'View Template', 'easy-accordion-free' ),
				'new_item'                 => __( 'New Templates', 'easy-accordion-free' ),
				'search_items'             => __( 'Search Template', 'easy-accordion-free' ),
				'not_found'                => __( 'No Template found', 'easy-accordion-free' ),
				'not_found_in_trash'       => __( 'No Template found in Trash', 'easy-accordion-free' ),
				'item_published'           => __( 'Template Published', 'easy-accordion-free' ),
				'item_published_privately' => __( 'Template published privately.', 'easy-accordion-free' ),
				'item_reverted_to_draft'   => __( 'Template reverted to draft.', 'easy-accordion-free' ),
				'item_scheduled'           => __( 'Template scheduled.', 'easy-accordion-free' ),
				'item_updated'             => __( 'Template updated.', 'easy-accordion-free' ),
			);

			$args = array(
				'labels'              => $labels,
				'public'              => false,
				'supports'            => array( 'title', 'editor', 'revisions' ),
				'show_in_rest'        => true,
				'hierarchical'        => false,
				'rewrite'             => false,
				'show_ui'             => $show_ui,
				'show_in_menu'        => false,
				'show_in_nav_menu'    => true,
				'exclude_from_search' => true,
				'capability_type'     => 'page',
			);
			register_post_type( 'sp_eap_template', $args );
		}

		/**
		 * Redirect Saved Template edit page with proper sanitization.
		 *
		 * Sanitizes GET parameters and uses WordPress global $pagenow for robust
		 * admin page detection to prevent CSRF and URL manipulation attacks.
		 *
		 * @return void
		 */
		public function eap_redirect_saved_template_edit_page() {
			global $pagenow;

			// If we are on post.php and editing a post.
			if ( isset( $_GET['post'], $_GET['action'] ) && 'edit' === sanitize_text_field( wp_unslash( $_GET['action'] ) ) ) {
				$post_id   = absint( $_GET['post'] );
				$post_type = get_post_type( $post_id );
				// Check custom post type.
				if ( 'sp_eap_template' === $post_type ) {
					return;
				}
			}

			// When creating a new post (post-new.php) - use $pagenow for robust check.
			if ( 'post-new.php' === $pagenow ) {
				return; // DO NOT redirect.
			}

			// Redirect default list table edit.php?post_type=sp_eap_template.
			if ( isset( $_GET['post_type'] ) && 'sp_eap_template' === sanitize_text_field( wp_unslash( $_GET['post_type'] ) ) ) {
				$page = isset( $_GET['page'] ) ? sanitize_text_field( wp_unslash( $_GET['page'] ) ) : '';
				if ( 'eap_dashboard#saved_templates' !== $page ) {
					wp_safe_redirect( admin_url( 'admin.php?page=eap_dashboard#saved_templates' ) );
					exit;
				}
			}
		}

		/**
		 * Force to save template via block editor.
		 *
		 * @param object $use_block_editor .
		 * @param object $post_type is post type.
		 */
		public function eap_force_block_editor_for_save_templates( $use_block_editor, $post_type ) {
			if ( 'sp_eap_template' === $post_type ) {
				return true;
			}
			return $use_block_editor;
		}


		/**
		 * Method eap_saved_template_callback
		 *
		 * @param object $attributes is block attributes.
		 *
		 * @return string
		 */
		public function eap_saved_template_callback( $attributes ) {
			$attributes = shortcode_atts( array( 'id' => '' ), $attributes );
			$id         = $attributes['id'];
			$id         = is_numeric( $id ) ? absint( $id ) : false;
			// return if id is empty then.
			if ( ! $id ) {
				return '';
			}
			// return if post id or post type is not published.
			$post = get_post( $id );
			if ( ! $post || 'publish' !== $post->post_status ) {
				return '';
			}
			// return if post content is empty.
			$content = $post->post_content;
			if ( empty( $content ) ) {
				return '';
			}

			// Generate dynamic CSS for this template.
			$this->eap_generate_template_dynamic_css( $id, $content );

			$content = do_blocks( $content );
			$content = do_shortcode( $content );
			$content = trim( $content );
			return $content;
		}

		/**
		 * Generate dynamic CSS for saved template.
		 *
		 * This method generates CSS for templates used in page builders that don't use
		 * standard WordPress content parsing. Called from the shortcode callback.
		 *
		 * @param int    $template_id Template post ID.
		 * @param string $content     Template content.
		 *
		 * @return void
		 */
		private function eap_generate_template_dynamic_css( $template_id, $content ) {
			// Prevent duplicate CSS generation for the same template in current request.
			static $generated_templates = array();
			if ( isset( $generated_templates[ $template_id ] ) ) {
				return;
			}

			// Check if Block_Dynamic_Style class exists, if not, try to load it.
			if ( ! class_exists( 'ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\Block_Dynamic_Style' ) ) {
				return;
			}

			// Parse blocks from template content.
			if ( ! has_blocks( $content ) ) {
				return;
			}

			$blocks = parse_blocks( $content );
			if ( empty( $blocks ) ) {
				return;
			}

			// Get Block_Dynamic_Style instance.
			$block_style = Block_Dynamic_Style::instance();

			// Check if this template has our blocks.
			if ( ! $this->eap_template_has_our_blocks( $blocks, $block_style ) ) {
				return;
			}

			// Mark this template as processed.
			$generated_templates[ $template_id ] = true;

			// Check if CSS file already exists.
			if ( $block_style->css_file_exists( $template_id ) ) {
				$sp_rand = get_post_meta( $template_id, '_sp_eab_unique_version', true );
				$sp_rand = ! empty( $sp_rand ) ? $sp_rand : wp_rand( 1000, 9999 );
				wp_enqueue_style( 'sp-eab-css-' . $template_id, $block_style->css_url . 'sp-eab-style-' . $template_id . '.css', array(), 'sp-eab-' . $sp_rand );
				$font_lists = get_post_meta( $template_id, 'sp_eab_dynamic_fonts', true );
			} else {
				// Generate CSS file for this template.
				$dynamic_assets = $block_style->generate_post_css_file( $template_id, get_post( $template_id ) );
				if ( false !== $dynamic_assets && is_array( $dynamic_assets ) ) {
					$font_lists   = $dynamic_assets[1] ?? array();
					$inline_style = $dynamic_assets[0] ?? '';

					// Add inline CSS using virtual style handle.
					if ( ! empty( $inline_style ) ) {
						$style_handle = 'sp-eap-template-' . $template_id;
							wp_register_style( $style_handle, false, array(), SP_EA_VERSION );
							wp_add_inline_style( $style_handle, $inline_style );
							wp_enqueue_style( $style_handle );
					}

					$unique_id = wp_rand( 1000, 9999 );
					update_post_meta( $template_id, '_sp_eab_unique_version', $unique_id );
				} else {
					$font_lists = array();
				}
			}

			// Enqueue Google Fonts.
			if ( ! empty( $font_lists ) && is_array( $font_lists ) ) {
				$font_lists = array_unique( $font_lists );
				wp_enqueue_style( 'sp-eab-template-google-fonts-' . $template_id, 'https://fonts.googleapis.com/css?family=' . implode( '|', $font_lists ), array(), SP_EA_VERSION, 'all' );
			}
		}

		/**
		 * Check if template contains our blocks.
		 *
		 * @param array  $blocks      Parsed blocks.
		 * @param object $block_style Block_Dynamic_Style instance.
		 *
		 * @return bool
		 */
		private function eap_template_has_our_blocks( $blocks, $block_style ) {
			foreach ( $blocks as $block ) {
				if ( ! empty( $block['blockName'] ) && in_array( $block['blockName'], $block_style->our_blocks, true ) ) {
					return true;
				}

				if ( ! empty( $block['innerBlocks'] ) && $this->eap_template_has_our_blocks( $block['innerBlocks'], $block_style ) ) {
					return true;
				}
			}

			return false;
		}
	}
}
