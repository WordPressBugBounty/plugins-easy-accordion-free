<?php
/**
 * Register easy accordion free custom post type.
 *
 * @link       https://shapedplugin.com/
 * @since      2.0.0
 *
 * @package    easy-accordion-free
 * @subpackage easy-accordion-free/includes
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

/**
 * The file that defines the carousel post type.
 *
 * A class the that defines the carousel post type and make the plugins' menu.
 */

/**
 * Custom post class to register the carousel.
 */
class Easy_Accordion_Free_Post_Type {

	/**
	 * The single instance of the class.
	 *
	 * @var self
	 * @since 2.0.0
	 */
	private static $instance;

	/**
	 * Path to the file.
	 *
	 * @since 2.0.0
	 *
	 * @var string
	 */
	public $file = __FILE__;

	/**
	 * Holds the base class object.
	 *
	 * @since 2.0.0
	 *
	 * @var object
	 */
	public $base;

	/**
	 * Allows for accessing single instance of class. Class should only be constructed once per call.
	 *
	 * @since 1.0.0
	 * @static
	 * @return self Main instance.
	 */
	public static function instance() {
		if ( is_null( self::$instance ) ) {
			self::$instance = new self();
		}
		return self::$instance;
	}

	/**
	 * Easy Accordion post type
	 */
	public function easy_accordion_post_type() {

		if ( post_type_exists( 'sp_easy_accordion' ) ) {
			return;
		}

		$capability      = apply_filters( 'sp_easy_accordion_ui_permission', 'manage_options' );
		$is_user_capable = current_user_can( $capability ) ? true : false;

		// Set the easy accordion post type labels.
		$labels = apply_filters(
			'sp_easy_accordion_post_type_labels',
			array(
				'name'               => esc_html__( 'Manage FAQ Groups', 'easy-accordion-free' ),
				'singular_name'      => esc_html__( 'Easy Accordion', 'easy-accordion-free' ),
				'add_new'            => esc_html__( 'Add New FAQ Group', 'easy-accordion-free' ),
				'add_new_item'       => esc_html__( 'Add New FAQ Group', 'easy-accordion-free' ),
				'edit_item'          => esc_html__( 'Edit FAQ Group', 'easy-accordion-free' ),
				'new_item'           => esc_html__( 'New New FAQ', 'easy-accordion-free' ),
				'view_item'          => esc_html__( 'View New FAQ', 'easy-accordion-free' ),
				'search_items'       => esc_html__( 'Search FAQ Group', 'easy-accordion-free' ),
				'not_found'          => esc_html__( 'No WP FAQ found.', 'easy-accordion-free' ),
				'not_found_in_trash' => esc_html__( 'No WP FAQ found in trash.', 'easy-accordion-free' ),
				'parent_item_colon'  => esc_html__( 'Parent FAQ:', 'easy-accordion-free' ),
				'menu_name'          => esc_html__( 'Easy Accordion', 'easy-accordion-free' ),
				'all_items'          => esc_html__( 'Manage FAQ Groups', 'easy-accordion-free' ),
			)
		);

		// Base 64 encoded SVG image.
		$icon      = 'PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB2ZXJzaW9uPSIxLjEiIGlkPSJMYXllcl8xIiB4PSIwcHgiIHk9IjBweCIgdmlld0JveD0iMCAwIDUxMiA1MTIiIHN0eWxlPSJlbmFibGUtYmFja2dyb3VuZDpuZXcgMCAwIDUxMiA1MTI7IiB4bWw6c3BhY2U9InByZXNlcnZlIj4NCiAgICAgICAgPHN0eWxlIHR5cGU9InRleHQvY3NzIj4NCiAgICAgICAgICAgIC5zdDB7ZmlsbDojQTBBNUFBO30NCiAgICAgICAgPC9zdHlsZT4NCiAgICAgICAgPGc+DQogICAgICAgICAgICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMCwxMjh2MjU2aDUxMlYxMjhIMHogTTQ4MCwzNTJIMzJWMjI0aDQ0OFYzNTJ6Ii8+DQogICAgICAgICAgICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMCwwaDUxMnY5NkgwVjB6Ii8+DQogICAgICAgICAgICA8cGF0aCBjbGFzcz0ic3QwIiBkPSJNMCw0MTZoNTEydjk2SDBWNDE2eiIvPg0KICAgICAgICA8L2c+DQogICAgPC9zdmc+';
		$menu_icon = 'data:image/svg+xml;base64,' . $icon;

		// Set the easy accordion post type arguments.
		$args = apply_filters(
			'sp_easy_accordion_post_type_args',
			array(
				'labels'              => $labels,
				'public'              => false,
				'hierarchical'        => false,
				'exclude_from_search' => true,
				'show_ui'             => $is_user_capable,
				'show_in_admin_bar'   => false,
				'show_in_rest'        => true,
				'menu_position'       => apply_filters( 'sp_easy_accordion_menu_position', 116 ),
				'menu_icon'           => $menu_icon,
				'rewrite'             => false,
				'query_var'           => false,
				'supports'            => array(
					'title',
				),
			)
		);
		register_post_type( 'sp_easy_accordion', $args );
	}

	/**
	 * Shortcode Post Type
	 */
	public function register_faq_post_type() {
		$capability      = apply_filters( 'sp_easy_accordion_ui_permission', 'manage_options' );
		$is_user_capable = current_user_can( $capability ) ? true : false;
		$labels          = apply_filters(
			'sp_accordion_faq_labels',
			array(
				'name'               => __( 'All FAQ Items', 'easy-accordion-free' ),
				'singular_name'      => __( 'FAQ', 'easy-accordion-free' ),
				'menu_name'          => __( 'Easy Accordion', 'easy-accordion-free' ),
				'all_items'          => __( 'All FAQ Items', 'easy-accordion-free' ),
				'add_new'            => __( 'Add New', 'easy-accordion-free' ),
				'add_new_item'       => __( 'Add New FAQ', 'easy-accordion-free' ),
				'edit'               => __( 'Edit FAQ', 'easy-accordion-free' ),
				'edit_item'          => __( 'Edit FAQ', 'easy-accordion-free' ),
				'item_updated'       => __( 'FAQ updated', 'easy-accordion-free' ),
				'new_item'           => __( 'New FAQ', 'easy-accordion-free' ),
				'search_items'       => __( 'Search FAQ', 'easy-accordion-free' ),
				'not_found'          => __( 'No FAQ found', 'easy-accordion-free' ),
				'not_found_in_trash' => __( 'No FAQ found in Trash', 'easy-accordion-free' ),
				'parent'             => __( 'Parent FAQ', 'easy-accordion-free' ),
			)
		);
		register_post_type(
			'sp_accordion_faqs',
			array(
				'labels'              => $labels,
				'public'              => true,
				'hierarchical'        => false,
				'has_archive'         => false,
				'publicly_queryable'  => true,
				'exclude_from_search' => true,
				'show_ui'             => $is_user_capable,
				'show_in_menu'        => 'edit.php?post_type=sp_easy_accordion',
				'menu_position'       => 50,
				'capability_type'     => 'post',
				'supports'            => array( 'title', 'editor', 'thumbnail', 'revisions' ),
				'show_in_rest'        => true,
			)
		);

		// Flush rewrite rules on plugin activation.
		if ( post_type_exists( 'sp_easy_accordion' ) && ! get_option( 'sp_eap_flush_rewrite_rules' ) ) {
			flush_rewrite_rules();
			update_option( 'sp_eap_flush_rewrite_rules', true );
		}
	}

	/**
	 * Add_faq_groups_submenu
	 *
	 * @return void
	 */
	public function add_faq_submenu() {
		$capability = apply_filters( 'sp_easy_accordion_ui_permission', 'manage_options' );

		// Add submenu under Easy Accordion.
		if ( current_user_can( $capability ) ) {
			add_submenu_page(
				'edit.php?post_type=sp_easy_accordion',
				__( 'All FAQ Items', 'easy-accordion-free' ),
				__( 'Add FAQ Item', 'easy-accordion-free' ),
				$capability,
				'post-new.php?post_type=sp_accordion_faqs',
				null,
				3
			);
		}
	}

	/**
	 * Add custom button next to "Add New" button on post list page
	 *
	 * @param array $views The existing views.
	 * @return array Modified views with the new button.
	 */
	public function add_visual_block_editor_button( $views ) {
		$block_editor_url = admin_url( 'post-new.php?post_type=page&eabblock_inserter=true&eab_auto_insert=sp-easy-accordion-pro/vertical-accordion' );
		$button_html      = '<a href="' . esc_url( $block_editor_url ) . '" class="page-title-action sp-eab-visual-block-btn" style="margin-left: 4px; padding: 5px 20px; background-color: #3858e9; border-color: #3858e9; margin-left: 10px; color: #fff; transition: background-color 0.3s ease, border-color 0.3s ease;">' . __( 'Start with Visual Block Editor', 'easy-accordion-free' ) . '</a>';

		// Sanitize button HTML with wp_kses.
		$allowed_html = array(
			'a' => array(
				'href'  => array(),
				'class' => array(),
				'style' => array(),
			),
		);

		// Add JavaScript to inject the button after the "Add New" button with hover effect.
		echo '<script>
			jQuery(document).ready(function($) {
				$(".page-title-action").first().css("padding", "5px 20px");
				var $newBtn = $(' . wp_json_encode( wp_kses( $button_html, $allowed_html ) ) . ');
				$newBtn.on("mouseenter", function() { $(this).css("background-color", "#1b40e3").css("border-color", "#1b40e3"); });
				$newBtn.on("mouseleave", function() { $(this).css("background-color", "#3858e9").css("border-color", "#3858e9"); });
				$(".page-title-action").first().after($newBtn);
			});
		</script>';

		return $views;
	}
}
