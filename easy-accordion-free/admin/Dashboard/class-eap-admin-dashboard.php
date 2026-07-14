<?php
/**
 * The plugin block menu page for admin.
 *
 * @link       https://shapedplugin.com/
 * @since      4.1.0
 *
 * @package    Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/Admin
 * @author     ShapedPlugin <support@shapedplugin.com>
 */

use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Helper;

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'Eab_Admin_Dashboard' ) ) {

	/**
	 * Eab_Admin_Dashboard Class.
	 */
	class Eab_Admin_Dashboard {

		/**
		 * Eab_admin_dashboard_nonce_key.
		 *
		 * @var string
		 */
		private $eab_admin_dashboard_nonce_key = 'sp_eap_admin_dashboard_nonce';

		/**
		 * Eab_block_visibility_key.
		 *
		 * @var string
		 */
		private $eab_block_visibility_key = 'sp_easy_accordion_visibility_settings';

		/**
		 * Eap_dashboard_settings_key.
		 *
		 * @var string
		 */
		private $eap_dashboard_settings_key = 'sp_eap_dashboard_settings';

		/**
		 * Sp_eap_settings_key.
		 *
		 * @var string
		 */
		private $sp_eap_settings_key = 'sp_eap_settings';

		/**
		 * Plugins Path variable.
		 *
		 * @var array
		 */
		protected static $plugins = array(
			'woo-product-slider'             => 'main.php',
			'gallery-slider-for-woocommerce' => 'woo-gallery-slider.php',
			'post-carousel'                  => 'main.php',
			'woo-quickview'                  => 'woo-quick-view.php',
			'wp-expand-tabs-free'            => 'plugin-main.php',
			'logo-carousel-free'             => 'main.php',
		);


		/**
		 * Block constructor.
		 */
		public function __construct() {
			// admin menu customization.
			add_action( 'admin_menu', array( $this, 'sp_eab_admin_menu_customize' ) );
			// remove admin notices.
			add_action( 'current_screen', array( $this, 'remove_admin_notices' ) );
			// manage ajax request.
			add_action( 'wp_ajax_sp_eab_admin_option_update', array( $this, 'sp_eab_admin_option_update' ) );
			add_action( 'wp_ajax_sp_eap_changelog_data', array( $this, 'sp_eap_changelog_data' ) );
			add_action( 'wp_ajax_sp_eap_get_user_consent', array( $this, 'sp_eap_get_user_consent' ) );
			// manage admin dashboard assets.
			add_action( 'admin_enqueue_scripts', array( $this, 'sp_eab_admin_dashboard_enqueue_admin_assets' ) );
			// admin notices.
			add_action( 'init', array( $this, 'eap_submit_user_consent' ) );
			add_action( 'admin_notices', array( $this, 'eap_maybe_show_user_consent_notice' ) );
		}

		/**
		 * Add submenu page for blocks.
		 */
		public function sp_eab_admin_menu_customize() {
			add_submenu_page(
				'edit.php?post_type=sp_easy_accordion',
				__( 'Easy Accordion Pro Dashboard', 'easy-accordion-free' ),
				__( 'Getting Started', 'easy-accordion-free' ),
				apply_filters( 'easy_accordion_access_capability', 'manage_options' ),
				'eap_dashboard',
				array( $this, 'blocks_page_wrapper_callback' )
			);
			add_submenu_page(
				'edit.php?post_type=sp_easy_accordion',
				__( 'Easy Accordion Pro Blocks', 'easy-accordion-free' ),
				__( 'Blocks', 'easy-accordion-free' ) . '<span class="eap-menu-new-indicator" style="color: #f18200;font-size: 9px; padding-left: 3px;">' . __( ' NEW!', 'easy-accordion-free' ) . '</span>',
				apply_filters( 'easy_accordion_access_capability', 'manage_options' ),
				'edit.php?post_type=sp_easy_accordion&page=eap_dashboard#blocks'
			);
			add_submenu_page(
				'edit.php?post_type=sp_easy_accordion',
				__( 'Easy Accordion Pro Settings', 'easy-accordion-free' ),
				__( 'Settings', 'easy-accordion-free' ),
				apply_filters( 'easy_accordion_access_capability', 'manage_options' ),
				'edit.php?post_type=sp_easy_accordion&page=eap_dashboard#settings'
			);
			add_submenu_page(
				'edit.php?post_type=sp_easy_accordion',
				__( 'Easy Accordion', 'easy-accordion-free' ),
				__( 'Lite vs Pro', 'easy-accordion-free' ),
				'manage_options',
				'edit.php?post_type=sp_easy_accordion&page=eap_dashboard#lite_vs_pro'
			);
			add_submenu_page(
				'edit.php?post_type=sp_easy_accordion',
				__( 'Upgrade to Pro', 'easy-accordion-free' ),
				'<a class="eab-upgrade-btn-wrapper" href="https://easyaccordion.io/pricing/?ref=1" target="_blank">
        		<span class="sp-eab-upgrade-btn">
            		<span class="sp-go-pro-icon"></span> Upgrade to Pro
        		</span>
    		</a>',
				'manage_options',
				'eab_upgrade_to_pro',
				'__return_null',
			);

			// Reorder submenu items.
			add_action(
				'admin_menu',
				function () {

					global $submenu;

					$menu_key = 'edit.php?post_type=sp_easy_accordion';

					if ( empty( $submenu[ $menu_key ] ) ) {
						return;
					}

					$items = $submenu[ $menu_key ];

					// Index submenu items by slug.
					$indexed = array();
					foreach ( $items as $item ) {
						$indexed[ $item[2] ] = $item;
					}

					// Define priority order (these will appear first).
					$priority_items = array(
						'eap_dashboard',
						'edit.php?post_type=sp_easy_accordion&page=eap_dashboard#blocks',
						'edit.php?post_type=sp_easy_accordion&page=eap_dashboard#saved_templates',
						'edit.php?post_type=sp_easy_accordion&page=eap_dashboard#settings',
						'edit.php?post_type=sp_easy_accordion',
						'post-new.php?post_type=sp_easy_accordion',
						'edit.php?post_type=sp_accordion_faqs',
						'post-new.php?post_type=sp_accordion_faqs',
						'eap_form',
						'eap_analytics',
						'eap_tools',
						'edit.php?post_type=sp_easy_accordion&page=eap_dashboard#lite_vs_pro',
						'eab_upgrade_to_pro',
					);

					$new_menu = array();

					// Add priority items first.
					foreach ( $priority_items as $slug ) {
						if ( isset( $indexed[ $slug ] ) ) {
							$new_menu[] = $indexed[ $slug ];
							unset( $indexed[ $slug ] );
						}
					}

					// Append remaining submenu items automatically.
					foreach ( $indexed as $item ) {
						$new_menu[] = $item;
					}

					// Replace submenu.
					// phpcs:disable WordPress.WP.GlobalVariablesOverride.Prohibited
					$submenu[ $menu_key ] = $new_menu;
					// phpcs:enable
				},
				999
			);
		}

		/**
		 * Callback function for the blocks page.
		 */
		public function blocks_page_wrapper_callback() {
			// Handle activation/deactivation requests that come back via the action links.
			$action   = isset( $_GET['action'] ) ? sanitize_text_field( wp_unslash( $_GET['action'] ) ) : '';
			$plugin   = isset( $_GET['plugin'] ) ? sanitize_text_field( wp_unslash( $_GET['plugin'] ) ) : '';
			$_wpnonce = isset( $_GET['_wpnonce'] ) ? sanitize_text_field( wp_unslash( $_GET['_wpnonce'] ) ) : '';

			if ( isset( $action, $plugin ) && 'activate' === $action && wp_verify_nonce( $_wpnonce, 'activate-plugin_' . $plugin ) ) {
				if ( current_user_can( 'activate_plugins' ) ) {
					activate_plugin( $plugin, '', false, true );
				}
			}
			?>
				<div id="sp-eab-admin-dashboard-wrapper" class="sp-eab-admin-dashboard-wrapper">
					<div class="eab-recommended-plugins-wrapper" style="display: none;">
						<h2 class="sp-eab-section-title"><?php esc_html_e( 'Supercharge Your Website with Our Free Plugins — Trusted by 360,050+ Users', 'easy-accordion-free' ); ?></h2>
						<div class="eab-wp-list-table plugin-install-php">
							<div class="eab-recommended-plugins" id="the-list">
								<?php
								$this->eab_plugins_info_api_help_page();
								?>
							</div>
						</div>
					</div>
				</div>
			<?php
		}

		/**
		 * Eab_plugins_info_api_help_page function.
		 *
		 * @return void
		 */
		public function eab_plugins_info_api_help_page() {
			$plugins_arr = get_transient( 'spea_plugins_data' );
			if ( false === $plugins_arr ) {
				$args = array(
					'author'   => 'shapedplugin',
					'per_page' => '120',
					'page'     => '1',
					'fields'   => array(
						'slug',
						'name',
						'version',
						'downloaded',
						'active_installs',
						'last_updated',
						'rating',
						'num_ratings',
						'short_description',
						'author',
						'icons',
					),
				);

				if ( ! function_exists( 'plugins_api' ) ) {
					require_once ABSPATH . 'wp-admin/includes/plugin-install.php';
				}

				$plugin_info = plugins_api( 'query_plugins', $args );

				if ( ! is_wp_error( $plugin_info ) ) {

					$plugins_arr = array();
					if ( isset( $plugin_info->plugins ) && ( count( $plugin_info->plugins ) > 0 ) ) {
						foreach ( $plugin_info->plugins as $pl ) {
							$plugins_arr[] = array(
								'slug'              => $pl['slug'],
								'name'              => $pl['name'],
								'version'           => $pl['version'],
								'downloaded'        => $pl['downloaded'],
								'active_installs'   => $pl['active_installs'],
								'last_updated'      => strtotime( $pl['last_updated'] ),
								'rating'            => $pl['rating'],
								'num_ratings'       => $pl['num_ratings'],
								'short_description' => $pl['short_description'],
								'icons'             => $pl['icons']['2x'],
							);
						}
					}

					set_transient( 'spea_plugins_data', $plugins_arr, 24 * HOUR_IN_SECONDS );
				}
			}

			if ( is_array( $plugins_arr ) && ( count( $plugins_arr ) > 0 ) ) {
				$no_of_active_installs = array_column( $plugins_arr, 'active_installs' );
				array_multisort( $no_of_active_installs, SORT_DESC, $plugins_arr );
				foreach ( $plugins_arr as $plugin ) {
					$plugin_slug = $plugin['slug'];
					$plugin_icon = $plugin['icons'];
					if ( isset( self::$plugins[ $plugin_slug ] ) ) {
						$plugin_file = self::$plugins[ $plugin_slug ];
					} else {
						$plugin_file = $plugin_slug . '.php';
					}
					// Skip the plugin if it is not installed.
					if ( 'easy-accordion-free' === $plugin_slug ) {
						continue;
					}

					$details_link = network_admin_url( 'plugin-install.php?tab=plugin-information&amp;plugin=' . $plugin['slug'] . '&amp;TB_iframe=true&amp;width=745&amp;height=550' );
					?>
				<div class="plugin-card <?php echo esc_attr( $plugin_slug ); ?>" id="<?php echo esc_attr( $plugin_slug ); ?>">
					<div class="plugin-card-top">
						<div class="name column-name">
							<h3>
								<a class="thickbox" title="<?php echo esc_attr( $plugin['name'] ); ?>" href="<?php echo esc_url( $details_link ); ?>">
									<?php echo esc_html( $plugin['name'] ); ?>
									<img src="<?php echo esc_url( $plugin_icon ); ?>" class="plugin-icon" />
								</a>
							</h3>
						</div>
						<div class="action-links">
							<ul class="plugin-action-buttons">
								<li>
									<?php
									if ( $this->is_plugin_installed( $plugin_slug, $plugin_file ) ) {
										if ( $this->is_plugin_active( $plugin_slug, $plugin_file ) ) {
											?>
											<button type="button" class="button button-disabled" disabled="disabled">Active</button>
											<?php
										} else {
											?>
											<a href="<?php echo esc_url( $this->activate_plugin_link( $plugin_slug, $plugin_file ) ); ?>" class="button button-primary activate-now">
												<?php esc_html_e( 'Activate', 'easy-accordion-free' ); ?>
											</a>
											<?php
										}
									} else {
										?>
										<a href="<?php echo esc_url( $this->install_plugin_link( $plugin_slug ) ); ?>" class="button install-now">
										<?php esc_html_e( 'Install Now', 'easy-accordion-free' ); ?>
										</a>
									<?php } ?>
								</li>
								<li>
										<?php /* translators: %s: plugin name */ ?>
									<a href="<?php echo esc_url( $details_link ); ?>" class="thickbox open-plugin-details-modal" aria-label="<?php echo esc_attr( sprintf( esc_html__( 'More information about %s', 'easy-accordion-free' ), $plugin['name'] ) ); ?>" title="<?php echo esc_attr( $plugin['name'] ); ?>">
										<?php esc_html_e( 'More Details', 'easy-accordion-free' ); ?>
									</a>
								</li>
							</ul>
						</div>
						<div class="desc column-description">
							<p><?php echo esc_html( isset( $plugin['short_description'] ) ? $plugin['short_description'] : '' ); ?></p>
						</div>
					</div>
						<?php
						echo '<div class="plugin-card-bottom">';

						if ( isset( $plugin['rating'], $plugin['num_ratings'] ) ) {
							?>
						<div class="vers column-rating">
							<?php
							wp_star_rating(
								array(
									'rating' => $plugin['rating'],
									'type'   => 'percent',
									'number' => $plugin['num_ratings'],
								)
							);
							?>
							<span class="num-ratings">(<?php echo esc_html( number_format_i18n( $plugin['num_ratings'] ) ); ?>)</span>
						</div>
							<?php
						}
						if ( isset( $plugin['version'] ) ) {
							?>
						<div class="column-updated">
							<strong><?php esc_html_e( 'Version:', 'easy-accordion-free' ); ?></strong>
							<span><?php echo esc_html( $plugin['version'] ); ?></span>
						</div>
							<?php
						}

						if ( isset( $plugin['active_installs'] ) ) {
							?>
						<div class="column-downloaded">
							<?php echo esc_html( number_format_i18n( $plugin['active_installs'] ) ) . esc_html__( '+ Active Installations', 'easy-accordion-free' ); ?>
						</div>
							<?php
						}

						if ( isset( $plugin['last_updated'] ) ) {
							?>
						<div class="column-compatibility">
							<strong><?php esc_html_e( 'Last Updated:', 'easy-accordion-free' ); ?></strong>
							<span>
								<?php
								printf(
									/* translators: %s: time ago */
									esc_html__( '%s ago', 'easy-accordion-free' ),
									esc_html( human_time_diff( $plugin['last_updated'] ) )
								);
								?>
							</span>
						</div>
							<?php
						}

						echo '</div>';
						?>
				</div>
					<?php
				}
			}
		}

		/**
		 * Check plugins installed function.
		 *
		 * @param string $plugin_slug Plugin slug.
		 * @param string $plugin_file Plugin file.
		 * @return boolean
		 */
		public function is_plugin_installed( $plugin_slug, $plugin_file ) {
			return file_exists( WP_PLUGIN_DIR . '/' . $plugin_slug . '/' . $plugin_file );
		}

		/**
		 * Check active plugin function
		 *
		 * @param string $plugin_slug Plugin slug.
		 * @param string $plugin_file Plugin file.
		 * @return boolean
		 */
		public function is_plugin_active( $plugin_slug, $plugin_file ) {
			return is_plugin_active( $plugin_slug . '/' . $plugin_file );
		}

		/**
		 * Install plugin link.
		 *
		 * @param string $plugin_slug Plugin slug.
		 * @return string
		 */
		public function install_plugin_link( $plugin_slug ) {
			return wp_nonce_url( self_admin_url( 'update.php?action=install-plugin&plugin=' . $plugin_slug ), 'install-plugin_' . $plugin_slug );
		}

		/**
		 * Active Plugin Link function
		 *
		 * @param string $plugin_slug Plugin slug.
		 * @param string $plugin_file Plugin file.
		 * @return string
		 */
		public function activate_plugin_link( $plugin_slug, $plugin_file ) {
			return wp_nonce_url( admin_url( 'edit.php?post_type=sp_easy_accordion&page=eap_dashboard&action=activate&plugin=' . $plugin_slug . '/' . $plugin_file . '#our_plugins' ), 'activate-plugin_' . $plugin_slug . '/' . $plugin_file );
		}

		/**
		 * Enqueue admin scripts and styles.
		 *
		 * @return void
		 */
		public function sp_eab_admin_dashboard_enqueue_admin_assets() {
			if ( ! isset( $_GET['page'] ) || 'eap_dashboard' !== $_GET['page'] ) { //phpcs:ignore WordPress.Security.NonceVerification.Recommended
				return;
			}
			// load dependencies.
			$dependencies = array( 'wp-element', 'wp-i18n', 'wp-components' );
			$asset_file   = SP_EA_PATH . 'admin/Dashboard/build/ea-dashboard.asset.php';
			if ( file_exists( $asset_file ) ) {
				$asset = require $asset_file;
				if ( ! empty( $asset['dependencies'] ) && is_array( $asset['dependencies'] ) ) {
					$dependencies = $asset['dependencies'];
				}
			}
			/**
			 * Enqueue block admin dashboard main script.
			 * react-jsx-runtime,
			 */
			wp_enqueue_script( 'sp-eab-admin-dashboard-script', SP_EA_URL . 'admin/Dashboard/build/ea-dashboard.js', $dependencies, SP_EA_VERSION, true );
			/**
			 * Enqueue block admin dashboard main style.
			 */
			wp_enqueue_style( 'sp-eab-admin-dashboard-style', SP_EA_URL . 'admin/Dashboard/build/style-ea-dashboard.css', array(), SP_EA_VERSION, 'all' );
			/**
			 * Check WooCommerce is Active.
			 */
			$is_active_woocommerce = false;
			if ( defined( 'WC_VERSION' ) && class_exists( 'WooCommerce' ) ) {
				$is_active_woocommerce = true;
			}
			$dashboard_settings = $this->get_dashboard_settings();
			$current_user       = wp_get_current_user();

			$user_name = $current_user->display_name;

			/**
			 * Admin Settings page localization.
			 */
			wp_localize_script(
				'sp-eab-admin-dashboard-script',
				'sp_eab_admin_dashboard_localize',
				array(
					'ajax_url'              => admin_url( 'admin-ajax.php' ),
					'pluginUrl'             => SP_EA_URL,
					'pluginVersion'         => SP_EA_VERSION,
					'isActiveWooCommerce'   => $is_active_woocommerce,
					'homeUrl'               => home_url( '/' ),
					'dashboardInfo'         => $dashboard_settings,
					'nonce'                 => wp_create_nonce( $this->eab_admin_dashboard_nonce_key ),
					'eab_user_consent'      => $dashboard_settings['eap_allow_anonymous_data'] ?? 'undefined',
					'userName'              => $user_name,
					'eap_editor_preference' => get_option( 'ea_free_blocks_promo_modal_choice', '' ),
					'savedTemplatesUrl'     => admin_url( 'edit.php?post_type=sp_easy_accordion&page=eap_dashboard#saved_templates' ),
				)
			);
		}

		/**
		 * Blocks admin panel settings option update function.
		 *
		 * @return void
		 * */
		public function sp_eab_admin_option_update() {
			// Check user capabilities, current_user_can() is called internally.
			Blocks_Helper::sp_eap_verify_capability();

			// Verify nonce.
			$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';

			if ( ! wp_verify_nonce( $nonce, $this->eab_admin_dashboard_nonce_key ) ) {
				wp_send_json_error( array( 'message' => 'Security check failed.' ), 403 );
				return;
			}
			$query_data = isset( $_POST['queryData'] ) ? sanitize_text_field( wp_unslash( $_POST['queryData'] ) ) : '';
			$query_data = (array) json_decode( $query_data, true );
			// manage visibility options.
			$visibility_option = $query_data['blockVisibility'] ?? array();
			if ( ! empty( $visibility_option ) ) {
				update_option( $this->eab_block_visibility_key, $visibility_option );
			}
			// manage plugin settings options.
			$plugin_settings = $query_data['pluginSettings'] ?? array();
			if ( ! empty( $plugin_settings ) ) {
				update_option( $this->sp_eap_settings_key, $plugin_settings );
			}
			// update dashboard settings.
			$dashboard_settings = $query_data['dashboardSettings'] ?? array();
			if ( ! empty( $dashboard_settings ) ) {
				update_option( $this->eap_dashboard_settings_key, $dashboard_settings );
			}

			// Handle editor preference for promo modal.
			if ( isset( $_POST['editorPreference'] ) ) {
				$editor_preference = sanitize_key( wp_unslash( $_POST['editorPreference'] ) );
				$allowed_editors   = array( 'block_editor', 'classic_shortcode' );
				if ( in_array( $editor_preference, $allowed_editors, true ) ) {
					update_option( 'ea_free_blocks_promo_modal_choice', $editor_preference, false );
				} else {
					delete_option( 'ea_free_blocks_promo_modal_choice' );
				}
			}
			// send response.
			$query_response = array(
				'pluginSettings'    => get_option( $this->sp_eap_settings_key, array() ),
				'blockVisibility'   => get_option( $this->eab_block_visibility_key, array() ),
				'eapShortcodes'     => Blocks_Helper::sp_easy_accordion_pro_post_list(),
				'dashboardSettings' => $this->get_dashboard_settings(),
			);

			wp_send_json( $query_response );
		}

		/**
		 * Handles the AJAX request to retrieve the plugin changelog.
		 *
		 * - Attempts to retrieve the changelog data from a cached transient.
		 * - If no cached data exists, fetches the changelog from the remote API.
		 * - Returns the changelog data as a JSON response.
		 *
		 * @return void
		 */
		public function sp_eap_changelog_data() {
			// Check user capabilities, current_user_can() is called internally.
			Blocks_Helper::sp_eap_verify_capability();
			// Verify nonce.
			$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
			if ( ! wp_verify_nonce( $nonce, $this->eab_admin_dashboard_nonce_key ) ) {
				wp_send_json_error( array( 'message' => 'Security check failed.' ), 403 );
				return;
			}

			$changelog = get_transient( 'sp_ea_changelogs' );

			if ( empty( $changelog ) ) {
				$changelog = $this->eap_fetch_changelog_from_api();
			}

			wp_send_json(
				array(
					'changelog' => $changelog,
				)
			);
		}

		/**
		 * Fetches changelog from the remote API.
		 * Stores the changelog in a transient for caching (1 day).
		 *
		 * @return string The changelog content or empty string on failure.
		 */
		protected function eap_fetch_changelog_from_api() {
			$api_url  = 'https://api.wordpress.org/plugins/info/1.0/easy-accordion-free.json';
			$response = wp_safe_remote_get(
				esc_url_raw( $api_url ),
				array(
					'timeout' => 15,
				)
			);

			if ( is_wp_error( $response ) || 200 !== wp_remote_retrieve_response_code( $response ) ) {
				return '';
			}

			$api_data = json_decode( wp_remote_retrieve_body( $response ), true );
			if ( ! isset( $api_data['sections']['changelog'] ) ) {
				return '';
			}

			$changelog = wp_kses_post( $api_data['sections']['changelog'] );
			set_transient( 'sp_ea_changelogs', $changelog, DAY_IN_SECONDS );

			return $changelog;
		}


		/**
		 * Method remove_admin_notices.
		 *
		 * @param object $screen is current screen.
		 * @return void
		 */
		public function remove_admin_notices( $screen ) {
			if ( $screen && 'sp_easy_accordion_page_eap_dashboard' === $screen->id ) {
				// Disable all other admin notices on this screen.
				add_action(
					'admin_head',
					function () {
						remove_all_actions( 'admin_notices' );
						remove_all_actions( 'all_admin_notices' );
						remove_all_actions( 'network_admin_notices' );
						remove_action( 'admin_notices', 'update_nag', 3 );
					},
					1
				);
			}
		}

		/**
		 * Method get_dashboard_settings.
		 *
		 * @param string $field_key dashboard settings key name.
		 * @param string $field_default_value dashboard settings default value.
		 *
		 * @return mixed
		 */
		public function get_dashboard_settings( $field_key = '', $field_default_value = '' ) {
			$dashboard_settings = get_option( $this->eap_dashboard_settings_key, array() );
			if ( ! empty( $field_key ) ) {
				$field_value = isset( $dashboard_settings[ $field_key ] ) ? $dashboard_settings[ $field_key ] : $field_default_value;
				return $field_value;
			}
			return $dashboard_settings;
		}
		/**
		 * Method update_dashboard_settings.
		 *
		 * @param string $field_key dashboard settings key name.
		 * @param string $field_value dashboard settings value.
		 *
		 * @return void
		 */
		private function update_dashboard_settings( $field_key, $field_value ) {
			$dashboard_settings               = $this->get_dashboard_settings();
			$dashboard_settings[ $field_key ] = $field_value;
			update_option( $this->eap_dashboard_settings_key, $dashboard_settings );
		}

		/**
		 * Method init_eap_data_storing.
		 *
		 * @return void
		 */
		public function init_eap_data_storing() {
			$is_user_allow = $this->get_dashboard_settings( 'eap_allow_anonymous_data', false );
			if ( $is_user_allow ) {
				$this->sp_eap_send_data_to_ea_sdr();
			}
		}

		/**
		 * Handle AJAX request to get and save user consent.
		 *
		 * This function processes user consent preferences for anonymous data sharing.
		 * It requires user authentication and nonce verification for security.
		 * Updates options for setup wizard visit status, anonymous data sharing preference,
		 * Easy Accordion SDR service.
		 *
		 * @return void Sends JSON response with success or error message.
		 */
		public function sp_eap_get_user_consent() {
			// Check user capabilities, current_user_can() is called internally.
			Blocks_Helper::sp_eap_verify_capability();

			// Verify nonce.
			$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
			if ( ! wp_verify_nonce( $nonce, $this->eab_admin_dashboard_nonce_key ) ) {
				wp_send_json_error( array( 'message' => 'Security check failed.' ), 403 );
					return;
			}

			// query data.
			$query_data = isset( $_POST['queryData'] ) ? sanitize_text_field( wp_unslash( $_POST['queryData'] ) ) : '';
			$query_data = (array) json_decode( $query_data, true );
			// user consent.
			$allow_anonymous_data = false;
			$user_consent         = $query_data['shareData'] ?? false;
			if ( $user_consent ) {
				$allow_anonymous_data = true;
				$this->sp_eap_send_data_to_ea_sdr();
			}
			// update option data.
			$this->update_dashboard_settings( 'visited_setup_wizard', true );
			$this->update_dashboard_settings( 'eap_allow_anonymous_data', $allow_anonymous_data );
			// send response.
			wp_send_json_success(
				array(
					'message' => 'Successfully done',
				)
			);
		}

		/**
		 * Method sp_eap_send_data_to_ea_sdr.
		 *
		 * It performs nonce verification to ensure the request is legitimate.
		 */
		public function sp_eap_send_data_to_ea_sdr() {
			// ---- Prevent sending data from local/dev sites ----
			$site_url = home_url();
			$host     = wp_parse_url( $site_url, PHP_URL_HOST );

			// Check for local sites.
			if ( 'localhost' === $host || '127.0.0.1' === $host || '::1' === $host || str_ends_with( $host, '.local' ) || str_ends_with( $host, '.test' ) || str_ends_with( $host, '.dev' ) || 1 === preg_match( '/^192\.168\./', $host ) || 1 === preg_match( '/^10\./', $host ) || 1 === preg_match( '/^172\.(1[6-9]|2[0-9]|3[0-1])\./', $host ) ) {
				return; // Stop here, do not collect or send data.
			}

			$theme = wp_get_theme();
			// PHP version.
			$php_version = phpversion();

			// Database version.
			$db_version = get_option( 'easy_accordion_free_db_version' );

			$site_language = get_locale();

			// Active plugins list.
			$active_plugins = array();
			$plugins        = get_plugins();

			foreach ( (array) get_option( 'active_plugins', array() ) as $plugin_path ) {
				if ( isset( $plugins[ $plugin_path ] ) ) {
					$active_plugins[] = array(
						'name'    => $plugins[ $plugin_path ]['Name'],
						'version' => $plugins[ $plugin_path ]['Version'],
					);
				}
			}

			// Get used blocks.
			$used_blocks = array();
			global $wpdb;

			// Search in posts, pages, custom post types, templates, etc.
			$post_contents = $wpdb->get_col( $wpdb->prepare( "SELECT post_content FROM {$wpdb->posts} WHERE post_status = 'publish' AND post_content LIKE %s", '%<!-- wp:sp-easy-accordion-pro/%' ) );
			foreach ( $post_contents as $post_content ) {
				if ( has_blocks( $post_content ) ) {
					$blocks = parse_blocks( $post_content );
					$this->find_eap_blocks_recursive( $blocks, $used_blocks );
				}
			}

			// Search in widgets.
			$widget_blocks = get_option( 'widget_block' );
			if ( ! empty( $widget_blocks ) && is_array( $widget_blocks ) ) {
				foreach ( $widget_blocks as $widget_block ) {
					if ( is_array( $widget_block ) && isset( $widget_block['content'] ) ) {
						if ( has_blocks( $widget_block['content'] ) ) {
							$blocks = parse_blocks( $widget_block['content'] );
							$this->find_eap_blocks_recursive( $blocks, $used_blocks );
						}
					}
				}
			}

			$used_blocks = array_values( $used_blocks );

			// Collect data.
			$data = array(
				'user_email'     => get_option( 'admin_email' ),
				'site_url'       => get_option( 'siteurl' ),
				'site_language'  => $site_language,
				'theme_name'     => $theme->get( 'Name' ),
				'plugin_version' => SP_EA_VERSION,
				'wp_version'     => get_bloginfo( 'version' ),
				'php_version'    => $php_version,
				'db_version'     => $db_version,
				'active_plugins' => $active_plugins,
				'used_blocks'    => $used_blocks,
			);

			// send post request.
			wp_remote_post(
				'https://api.shapedplugin.com/wp-json/spda/v1/easy-accordion-collect',
				array(
					'headers' => array(
						'Content-Type' => 'application/json',
						'x-api-key'    => SP_EA_SDR_KEY,
						'User-Agent'   => 'eap-sdr-collector/' . home_url(),
					),
					'body'    => wp_json_encode( $data ),
				)
			);
		}
		/**
		 * Find blocks by name recursively in a parsed block structure.
		 *
		 * @param array $blocks The array of blocks to search.
		 * @param array $used_blocks The array to store the found block names.
		 * @return void
		 */
		private function find_eap_blocks_recursive( $blocks, &$used_blocks ) {
			foreach ( $blocks as $block ) {
				if ( ! empty( $block['blockName'] ) && strpos( $block['blockName'], 'sp-easy-accordion-pro/' ) === 0 ) {
					$used_blocks[] = $block['blockName'];
				}
				if ( ! empty( $block['innerBlocks'] ) ) {
					$this->find_eap_blocks_recursive( $block['innerBlocks'], $used_blocks );
				}
			}
		}
		/**
		 * Conditionally display the anonymous data consent notice.
		 *
		 * Ensures the current user has sufficient permissions, the notice
		 * has not been ignored, a valid license is active, and the delay
		 * period has passed before showing the notice.
		 *
		 * @return void
		 */
		public function eap_maybe_show_user_consent_notice() {
			if ( ! current_user_can( 'manage_options' ) ) {
				return;
			}

			$ignored_consent_notice = $this->get_dashboard_settings( 'eap_ignored_consent_notice', false );
			$allow_anonymous_data   = $this->get_dashboard_settings( 'eap_allow_anonymous_data', false );

			// Do not show if already allowed or ignored.
			if ( $allow_anonymous_data || $ignored_consent_notice ) {
				return;
			}

			// delay logic (7 days).
			$this->eap_maybe_set_notice_start_time();

			if ( ! $this->eap_has_notice_delay_passed( 7 ) ) {
				return;
			}

			// Finally show notice.
			$this->eap_notice_for_user_consent();
		}

		/**
		 * Render the anonymous data consent admin notice.
		 *
		 * Displays an admin notice prompting the user to allow or deny
		 * anonymous data collection if consent has not yet been given.
		 *
		 * @return void
		 */
		public function eap_notice_for_user_consent() {
			$plugin_logo_image = 'https://ps.w.org/easy-accordion-free/assets/icon-256x256.gif';
			?>
				<style>
					.sp-eap-anonymous-data-notice {
						background-color: #ffffff;
						border: none;
						border: 1px solid rgba(204, 204, 204, 1);
						border-left: 4px solid #FF980F;
						margin-bottom: 20px;
						display: flex;
						padding: 14px;
						align-items: flex-start;
						gap: 16px;
						box-shadow: 0 16px 32px -4px rgba(12, 12, 13, 0.05), 0 4px 4px -4px rgba(12, 12, 13, 0.02);
						position: relative;
						border-radius: 4px;
						}

					button.sp_eap_anonymous_data_cross {
						border: none;
						background: transparent;
						position: absolute;
						top: 0;
						right: 7px;
						cursor: pointer;
						color: #b6b6b6;
						font-size: 16px;
						}

					.sp-eap-anonymous-data-notice-wrapper {
						display: flex;
						gap: 26px;
						}

					.sp-eap-anonymous-data-notice img {
						width: 52px;
						border-radius: 4px;
						}
					.sp-eap-anonymous-data-notice h3 {
						font-weight: 600;
						font-size: 18px;
						color: #2C2D2F;
						margin: 0 0 8px 0;
						}
					.sp-eap-anonymous-data-notice p, .sp-eap-anonymous-data-notice a {
						color: #6E6F72;
						font-size: 14px;
						margin: 0 0 2px 0;
						}
					.sp-eap-anonymous-data-notice a {
						text-decoration: underline;
						}
					.sp-eap-anonymous-data-notice .button {
						font-size: 14px;
						font-weight: 500;
						}
					.sp-eap-anonymous-data-notice .button {
						font-size: 14px;
						font-weight: 500;
						background-color: #ffffff;
						color: #6E6F72;
						border: 1px solid #ECEDF0;
						transition: all 0.2s ease;
						margin-top: 8px;
						}
					.sp-eap-anonymous-data-notice .button:hover {
						border: 1px solid #b7b8bb;
						color: #6E6F72;
						background-color: #ffffff;
						}
					.sp-eap-anonymous-data-notice .sp_eap_anonymous_data_connect {
						background-color: rgba(30, 30, 30, 1);
						color: #ffffff;
						line-height: 14px;
						border-radius: 4px;
						font-size: 13px;
						}
					.sp-eap-anonymous-data-notice .sp_eap_anonymous_data_connect:hover {
						background-color: rgb(46, 46, 46);
						color: #ffffff;
						}
					.sp-eap-anonymous-data-notice .sp_eap_anonymous_data_connect:focus {
						border: none;
						box-shadow: none;
						out-line: none;
						}
				</style>

				<div class="notice notice-info sp-eap-anonymous-data-notice">
					<img src="<?php echo esc_url( $plugin_logo_image ); ?>" alt="Easy Accordion"/>
					<div class="sp-eap-anonymous-data-notice-wrapper">
						<div>
							<h3>
							<?php esc_html_e( 'Help us make Easy Accordion even more awesome?', 'easy-accordion-free' ); ?>
							</h3>
							<p>
							<?php
							esc_html_e(
								'Allow us to collect non-sensitive diagnostic data to resolve problems faster and improve performance.',
								'easy-accordion-free'
							);
							?>
							<a href="https://easyaccordion.io/information-we-collect/" target="_blank"><?php esc_html_e( 'Learn More', 'easy-accordion-free' ); ?></a>
							</p>
						</div>
						<div style="display:flex; gap:10px;">
							<form method="post" style="display:inline;">
							<?php wp_nonce_field( 'eap_anonymous_data_action', 'eap_anonymous_data_nonce' ); ?>
								<input type="hidden" name="eap_anonymous_data_action" value="allow" />
								<button type="submit" class="sp_eap_anonymous_data_connect button">
								<?php esc_html_e( 'Accept & Close', 'easy-accordion-free' ); ?>
								</button>
							</form>

							<form method="post" style="display:inline;">
							<?php wp_nonce_field( 'eap_anonymous_data_action', 'eap_anonymous_data_nonce' ); ?>
								<input type="hidden" name="eap_anonymous_data_action" value="deny" />
								<button type="submit" class="sp_eap_anonymous_data_cross dashicons dashicons-dismiss">
								</button>
							</form>
						</div>
					</div>
				</div>
			<?php
		}
		/**
		 * Set the consent notice start time if it does not already exist.
		 *
		 * Stores the current timestamp to track when the consent notice
		 * delay period begins.
		 *
		 * @return void
		 */
		private function eap_maybe_set_notice_start_time() {
			if ( ! $this->get_dashboard_settings( 'eap_consent_notice_start_time', null ) ) {
				$this->update_dashboard_settings( 'eap_consent_notice_start_time', time() );
			}
		}
		/**
		 * Check whether the consent notice delay period has passed.
		 *
		 * Compares the stored notice start time with the current time
		 * to determine if the specified delay duration has elapsed.
		 *
		 * @param int $days Number of days to wait before showing the notice.
		 * @return bool True if the delay has passed, false otherwise.
		 */
		private function eap_has_notice_delay_passed( $days = 7 ) {
			$start_time = $this->get_dashboard_settings( 'eap_consent_notice_start_time' );

			if ( ! $start_time ) {
				return false;
			}

			return ( time() - $start_time ) >= ( DAY_IN_SECONDS * $days );
		}
		/**
		 * Handle user consent submission for anonymous data collection.
		 *
		 * Processes the admin notice form submission, verifies the nonce,
		 * stores the user’s consent choice, and prevents form resubmission
		 * on page refresh.
		 *
		 * @return void
		 */
		public function eap_submit_user_consent() {
			// Handle POST action for the notice buttons.
			if ( isset( $_POST['eap_anonymous_data_action'] ) && check_admin_referer( 'eap_anonymous_data_action', 'eap_anonymous_data_nonce' ) ) {
				if ( 'allow' === $_POST['eap_anonymous_data_action'] ) {
					$this->update_dashboard_settings( 'eap_allow_anonymous_data', true );
				} elseif ( 'deny' === $_POST['eap_anonymous_data_action'] ) {
					$this->update_dashboard_settings( 'eap_ignored_consent_notice', true );
				}
				// Avoid resubmission on refresh.
				echo '<script>window.location = window.location.href;</script>';
				exit;
			}
		}
	}
}
