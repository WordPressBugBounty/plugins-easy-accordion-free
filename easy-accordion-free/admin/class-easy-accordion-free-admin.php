<?php
/**
 * The admin-specific of the plugin.
 *
 * @link https://shapedplugin.com
 * @since 2.0.0
 *
 * @package Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/admin
 */

if ( ! defined( 'ABSPATH' ) ) {
	die;
} // Cannot access directly.

/**
 * The class for the admin-specific functionality of the plugin.
 */
class Easy_Accordion_Free_Admin {

	/**
	 * Instance
	 *
	 * @since 2.1.10
	 *
	 * @access private
	 * @static
	 *
	 * @var Easy_Accordion_Free_Admin The single instance of the class.
	 */
	private static $instance = null;

	/**
	 * Allows for accessing single instance of class. Class should only be constructed once per call.
	 *
	 * @since 2.0.0
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
	 * Register the stylesheets for the admin area of the plugin.
	 *
	 * @since  2.0.0
	 * @return void
	 */
	public function enqueue_admin_styles() {
		$current_screen        = get_current_screen();
		$the_current_post_type = $current_screen->post_type;
		if ( 'sp_easy_accordion' === $the_current_post_type || 'sp_accordion_faqs' === $the_current_post_type ) {
			wp_enqueue_style( 'sp-ea-fontello-icons' );
			wp_enqueue_style( 'sp-ea-style' );

			wp_enqueue_script( 'sp-ea-accordion-js' );
		}
		$is_block_editor = isset( $current_screen->is_block_editor ) ? $current_screen->is_block_editor : false;
		if ( ! $is_block_editor ) {
			wp_enqueue_style( 'sp-ea-style-admin' );
		}
	}

	/**
	 * Change Accordion updated messages.
	 *
	 * @param string $messages The Update messages.
	 * @return statement
	 */
	public function eap_updated_messages( $messages ) {
		global $post, $post_ID;

		$revision_id = isset( $_GET['revision'] ) ? absint( $_GET['revision'] ) : false; // phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Safe read-only access

		$messages['sp_easy_accordion'] = array(
			0  => '', // Unused. Messages start at index 1.
			1  => sprintf( __( 'Accordion updated.', 'easy-accordion-free' ) ),
			2  => '',
			3  => '',
			4  => __( ' updated.', 'easy-accordion-free' ),
			5  => $revision_id ? sprintf( wp_kses_post( 'Accordion restored to revision from %s', 'easy-accordion-free' ), wp_post_revision_title( $revision_id, false ) ) : false,
			6  => sprintf( __( 'Accordion published.', 'easy-accordion-free' ) ),
			7  => __( 'Accordion saved.', 'easy-accordion-free' ),
			8  => sprintf( __( 'Accordion submitted.', 'easy-accordion-free' ) ),
			9  => sprintf( wp_kses_post( 'Accordion scheduled for: <strong>%1$s</strong>.', 'easy-accordion-free' ), date_i18n( __( 'M j, Y @ G:i', 'easy-accordion-free' ), strtotime( $post->post_date ) ) ),
			10 => sprintf( __( 'Accordion draft updated.', 'easy-accordion-free' ) ),
		);
		return $messages;
	}

	/**
	 * Add accordion admin columns.
	 *
	 * @return statement
	 */
	public function filter_accordion_admin_column() {
		$admin_columns['cb']        = '<input type="checkbox" />';
		$admin_columns['title']     = __( 'Accordion Group Title', 'easy-accordion-free' );
		$admin_columns['shortcode'] = __( 'Shortcode', 'easy-accordion-free' );
		$admin_columns['date']      = __( 'Date', 'easy-accordion-free' );

		return $admin_columns;
	}

	/**
	 * Display admin columns for the accordions.
	 *
	 * @param mix    $column The columns.
	 * @param string $post_id The post ID.
	 * @return void
	 */
	public function display_accordion_admin_fields( $column, $post_id ) {
		$upload_data    = get_post_meta( $post_id, 'sp_eap_upload_options', true );
		$accordion_type = isset( $upload_data['eap_accordion_type'] ) ? $upload_data['eap_accordion_type'] : '';
		switch ( $column ) {
			case 'shortcode':
				echo '<div class="sp_eap-after-copy-text"><i class="fa fa-check-circle"></i>  Shortcode  Copied to Clipboard! </div><input style="width: 270px; padding: 6px; cursor:pointer;"  type="text" onClick="this.select();" readonly="readonly" value="[sp_easyaccordion id=&quot;' . esc_attr( $post_id ) . '&quot;]"/>';
				break;
			case 'accordion_type':
				echo esc_html( ucwords( str_replace( '-', ' ', $accordion_type ) ) );
		} // end switch.
	}

	/**
	 * Bottom review notice.
	 *
	 * @param string $text The review notice.
	 * @return string
	 */
	public function sp_eap_review_text( $text ) {
		$screen = get_current_screen();
		if ( 'sp_easy_accordion' === $screen->post_type || 'sp_accordion_faqs' === $screen->post_type || 'sp_easy_accordion_page_eap_dashboard' === $screen->base ) {
			$heart_icon = '<svg class="eap-footer-heart" width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
				<path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" fill="#E25555"/>
			</svg>';

			$social_icons = array(
				'linkedin'  => array(
					'url'  => 'https://www.linkedin.com/company/shapedplugin',
					'icon' => '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M13 0c.563 0 1 .469 1 1v12c0 .563-.437 1-1 1H1c-.562 0-1-.437-1-1V1c0-.531.438-1 1-1zM4.219 12h.031V5.313H2.156V12zM3.187 2C2.532 2 2 2.531 2 3.219c0 .656.531 1.187 1.188 1.187s1.218-.531 1.218-1.187A1.22 1.22 0 0 0 3.188 2M12 12V8.344c0-1.813-.375-3.188-2.469-3.188-1.031 0-1.687.563-1.969 1.063h-.03v-.907h-2V12h2.093V8.688c0-.876.156-1.72 1.219-1.72 1.062 0 1.094 1 1.094 1.782V12z" fill="#757575"/></svg>',
				),
				'twitter'   => array(
					'url'  => 'https://www.x.com/shapedplugin/',
					'icon' => '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 0h10c1.094 0 2 .906 2 2v10c0 1.094-.906 2-2 2H2c-1.094 0-2-.906-2-2V2C0 .906.906 0 2 0m9.281 2.625H9.812L7.345 5.438 5.25 2.625H2.188l3.656 4.781-3.469 3.969h1.469L6.53 8.313l2.344 3.062h2.969L8.03 6.344zM10.094 10.5H9.28L3.906 3.469h.875z" fill="#757575"/></svg>',
				),
				'wordpress' => array(
					'url'  => 'https://profiles.wordpress.org/shapedplugin/#content-plugins',
					'icon' => '<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1.688 5.031a6.6 6.6 0 0 0-.594 2.719 6.62 6.62 0 0 0 3.75 5.969zM12.25 7.406c0 .594-.219 1.25-.5 2.157l-.687 2.218-2.376-7.156c.376 0 .75-.062.75-.062.344-.032.313-.563-.062-.532 0 0-1.062.063-1.75.063-.656 0-1.75-.063-1.75-.063-.375-.031-.406.532-.062.532 0 0 .343.062.718.062l1.032 2.844-1.47 4.375-2.405-7.219c.406 0 .75-.062.75-.062.343-.032.312-.563-.032-.532 0 0-1.093.063-1.781.063h-.437a6.65 6.65 0 0 1 5.562-3c1.719 0 3.313.656 4.5 1.75h-.094c-.656 0-1.125.562-1.125 1.187 0 .532.313 1 .656 1.563.25.437.563 1 .563 1.812m-4.375.938 2.031 5.594c.031.03.031.062.063.093a6.5 6.5 0 0 1-2.219.375 6.2 6.2 0 0 1-1.875-.281zm5.719-3.781c.5.937.812 2.03.812 3.187 0 2.469-1.344 4.594-3.312 5.75l2.031-5.875c.375-.937.5-1.719.5-2.375 0-.25 0-.469-.031-.687M0 7.75a7.75 7.75 0 0 0 7.75 7.75 7.75 7.75 0 0 0 7.75-7.75A7.75 7.75 0 0 0 7.75 0 7.75 7.75 0 0 0 0 7.75m15.156 0a7.4 7.4 0 0 1-7.406 7.406A7.4 7.4 0 0 1 .344 7.75 7.4 7.4 0 0 1 7.75.344a7.4 7.4 0 0 1 7.406 7.406" fill="#757575"/></svg>',
				),
				'facebook'  => array(
					'url'  => 'https://www.facebook.com/shapedplugin/',
					'icon' => '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 0h10c1.094 0 2 .906 2 2v10c0 1.094-.906 2-2 2H7.969V9.438h2.156L10.594 7H7.969v-.875c0-1.281.5-1.781 1.812-1.781.406 0 .75 0 .938.031V2.156c-.375-.094-1.25-.187-1.75-.187-2.656 0-3.906 1.25-3.906 3.968V7H3.406v2.438h1.656V14H2c-1.094 0-2-.906-2-2V2C0 .906.906 0 2 0" fill="#757575"/></svg>',
				),
				'youtube'   => array(
					'url'  => 'https://www.youtube.com/@shapedplugin',
					'icon' => '<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="m8.813 7-2.97 1.688V5.312zM12 0c1.094 0 2 .906 2 2v10c0 1.094-.906 2-2 2H2c-1.094 0-2-.906-2-2V2C0 .906.906 0 2 0zm.438 4.25c-.126-.5-.5-.875-1-1C10.562 3 7 3 7 3s-3.562 0-4.437.25c-.5.125-.876.5-1 1-.25.906-.25 2.75-.25 2.75s0 1.875.25 2.781c.125.469.5.844 1 .969C3.437 11 7 11 7 11s3.563 0 4.438-.25c.5-.125.874-.5 1-1 .25-.875.25-2.75.25-2.75s0-1.844-.25-2.75" fill="#757575"/></svg>',
				),
			);

			$social_html = '';
			foreach ( $social_icons as $platform => $data ) {
				$social_html .= sprintf(
					'<a href="%s" target="_blank" rel="noopener noreferrer" class="eap-footer-social-link" title="%s">%s</a>',
					esc_url( $data['url'] ),
					esc_attr( ucfirst( $platform ) ),
					$data['icon']
				);
			}

			$text = sprintf(
				'<div class="eap-footer-container">
					<div class="eap-footer-left">
						<span class="eap-footer-made-with">%s</span>
						%s
						<span class="eap-footer-by">%s</span>
						<a href="https://shapedplugin.com/about-us/" target="_blank" rel="noopener noreferrer" class="eap-footer-team-link">ShapedPlugin LLC Team</a>
					</div>
					<div class="eap-footer-social">Get Connected with %s</div>
				</div>',
				esc_html__( 'Made with', 'easy-accordion-free' ),
				$heart_icon,
				esc_html__( 'by the', 'easy-accordion-free' ),
				$social_html
			);
		}
		return $text;
	}
	/**
	 * Bottom version notice.
	 *
	 * @param string $text Version notice.
	 * @return string
	 */
	public function sp_eap_version_text( $text ) {
		$screen = get_current_screen();
		if ( 'sp_easy_accordion' === $screen->post_type || 'sp_accordion_faqs' === $screen->post_type || 'sp_easy_accordion_page_eap_dashboard' === $screen->base ) {
			$default = sprintf( 'Enjoyed <b>Easy Accordion?</b> <a class="sp-ea-footer-text" href="https://wordpress.org/support/plugin/easy-accordion-free/reviews/" target="_blank"> Rate us! ★★★★★ </a>' );
			echo wp_kses_post( $default );
		}
	}
	/**
	 *  Add plugin row meta link
	 *
	 * @param [array] $plugin_meta Add plugin row meta link.
	 * @param [url]   $file plugin row meta link.
	 * @return array
	 */
	public function after_easy_accodion_row_meta( $plugin_meta, $file ) {
		if ( SP_EA_BASENAME === $file ) {
			$plugin_meta[] = '<a href="https://easyaccordion.io/patterns/" target="_blank">' . __( 'Ready Patterns', 'easy-accordion-free' ) . '</a> | <a href="https://easyaccordion.io/docs/" target="_blank">' . __( 'Docs', 'easy-accordion-free' ) . '</a> | <a href="https://www.youtube.com/watch?v=u3lRDX0zG9Y&list=PLoUb-7uG-5jPNXkpGII8cTTfB-L4TCaqv" target="_blank">' . __( 'Video Tutorials', 'easy-accordion-free' ) . '</a>';
		}
		return $plugin_meta;
	}
	/**
	 * Redirect after activation.
	 *
	 * @param string $plugin Path to the plugin file, relative to the plugin.
	 * @return void
	 */
	public function sp_ea_redirect_after_activation( $plugin ) {
		// return if plugin name is not match.
		if ( SP_EA_BASENAME !== $plugin ) {
			return;
		}
		// check is user visited setup wizard.
		$dashboard_settings      = get_option( 'sp_eap_dashboard_settings', array() );
		$is_visited_setup_wizard = $dashboard_settings['visited_setup_wizard'] ?? false;
		// manage redirect url.
		$redirect_url = $is_visited_setup_wizard ? 'edit.php?post_type=sp_easy_accordion&page=eap_dashboard' : 'admin.php?page=eap_dashboard#setupwizard';
		wp_safe_redirect( admin_url( $redirect_url ) );
		exit;
	}

	/**
	 * Add plugin action menu
	 *
	 * @param array  $links The action link.
	 * @param string $file The file.
	 *
	 * @return array
	 */
	public function add_plugin_action_links( $links, $file ) {

		if ( SP_EA_BASENAME === $file ) {
			$new_links =
				sprintf( '<a href="%s">%s</a>', admin_url( 'post-new.php?post_type=sp_eap_template&eabblock_inserter=true' ), __( 'Add FAQs or Accordions', 'easy-accordion-free' ) );
			array_unshift( $links, $new_links );

			$links['go_pro'] = sprintf( '<a target="_blank" href="%1$s" style="color: #35b747; font-weight: 700;">Go Pro!</a>', 'https://easyaccordion.io/pricing/?ref=1' );
		}

		return $links;
	}
}
