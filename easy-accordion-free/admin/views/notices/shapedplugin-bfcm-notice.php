<?php
/**
 * ShapedPlugin Black Friday / Cyber Monday 2026 admin notice.
 *
 * This file is shared by every ShapedPlugin free plugin and MUST stay
 * byte-identical across them. The first loaded copy defines the class, each
 * plugin registers its own offer via ShapedPlugin_BFCM_Notice_2026::register(),
 * and a single renderer prints only ONE notice no matter how many of our
 * plugins are active. Dismissing it hides the campaign for all plugins.
 *
 * @package ShapedPlugin
 * @author  ShapedPlugin <support@shapedplugin.com>
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly.
}

if ( ! class_exists( 'ShapedPlugin_BFCM_Notice_2026' ) ) {

	/**
	 * Shared BFCM 2026 notice registry and renderer.
	 */
	final class ShapedPlugin_BFCM_Notice_2026 {

		/**
		 * Campaign start (site timezone).
		 */
		const START = '2026-11-14 00:00:00';

		/**
		 * Campaign end (site timezone).
		 */
		const END = '2026-12-10 23:59:59';

		/**
		 * Shared dismiss option key.
		 */
		const OPTION_KEY = 'shapedplugin_bfcm_2026_dismissed';

		/**
		 * Shared AJAX action and nonce action.
		 */
		const AJAX_ACTION = 'shapedplugin_bfcm_2026_dismiss';

		/**
		 * Singleton instance.
		 *
		 * @var self|null
		 */
		private static $instance = null;

		/**
		 * Registered plugin offers, keyed by slug.
		 *
		 * @var array
		 */
		private $plugins = array();

		/**
		 * Whether the notice was already printed in this request.
		 *
		 * @var bool
		 */
		private $rendered = false;

		/**
		 * Hook the renderer and the dismiss handler once.
		 */
		private function __construct() {
			add_action( 'admin_notices', array( $this, 'render' ) );
			add_action( 'wp_ajax_' . self::AJAX_ACTION, array( $this, 'dismiss' ) );
		}

		/**
		 * Get the singleton instance.
		 *
		 * @return self
		 */
		public static function instance() {
			if ( null === self::$instance ) {
				self::$instance = new self();
			}

			return self::$instance;
		}

		/**
		 * Register a plugin offer.
		 *
		 * @param array $args {
		 *     Offer arguments.
		 *
		 *     @type string $slug       Unique plugin slug. Required.
		 *     @type string $image      Full banner image URL. Required.
		 *     @type string $link       CTA URL the banner links to. Required.
		 *     @type string $name       Product name, used for the image alt text, e.g. "Easy Accordion Pro".
		 *     @type array  $post_types Post types whose admin screens belong to this plugin.
		 *     @type array  $screen_ids Screen ID prefixes that belong to this plugin.
		 * }
		 * @return void
		 */
		public static function register( array $args ) {
			$args = wp_parse_args(
				$args,
				array(
					'slug'       => '',
					'image'      => '',
					'link'       => '',
					'name'       => '',
					'post_types' => array(),
					'screen_ids' => array(),
				)
			);

			if ( '' === $args['slug'] || '' === $args['image'] || '' === $args['link'] ) {
				return;
			}

			self::instance()->plugins[ $args['slug'] ] = $args;
		}

		/**
		 * Whether the campaign window is open.
		 *
		 * @return bool
		 */
		private function is_active() {
			try {
				$timezone = wp_timezone();
				$now      = new DateTimeImmutable( 'now', $timezone );
				$active   = $now >= new DateTimeImmutable( self::START, $timezone )
					&& $now <= new DateTimeImmutable( self::END, $timezone );
			} catch ( Exception $e ) {
				$active = false;
			}

			/**
			 * Filters whether the BFCM 2026 notice campaign is active.
			 *
			 * @param bool $active Whether the current time is inside the campaign window.
			 */
			return (bool) apply_filters( 'shapedplugin_bfcm_2026_active', $active );
		}

		/**
		 * Pick the one offer to show.
		 *
		 * On a plugin's own admin screens that plugin wins; elsewhere a random
		 * registered plugin is picked.
		 *
		 * @param WP_Screen|null $screen Current admin screen.
		 * @return array
		 */
		private function pick_plugin( $screen ) {
			if ( $screen ) {
				foreach ( $this->plugins as $plugin ) {
					if ( $screen->post_type && in_array( $screen->post_type, (array) $plugin['post_types'], true ) ) {
						return $plugin;
					}

					foreach ( (array) $plugin['screen_ids'] as $prefix ) {
						if ( $prefix && 0 === strpos( $screen->id, $prefix ) ) {
							return $plugin;
						}
					}
				}
			}

			return $this->plugins[ array_rand( $this->plugins ) ];
		}

		/**
		 * Render the notice.
		 *
		 * @return void
		 */
		public function render() {
			// Print once, even if admin_notices fires more than once on a page.
			if ( $this->rendered || empty( $this->plugins ) || ! current_user_can( 'manage_options' ) ) {
				return;
			}

			if ( get_option( self::OPTION_KEY ) || ! $this->is_active() ) {
				return;
			}

			$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
			if ( $screen && method_exists( $screen, 'is_block_editor' ) && $screen->is_block_editor() ) {
				return;
			}

			$this->rendered = true;

			$plugin = $this->pick_plugin( $screen );
			$alt    = '' !== $plugin['name'] ? 'Black Friday deal on ' . $plugin['name'] : 'Black Friday deal';
			?>
			<style>
				/*
				 * Banner images are 2416x244: a 2320x163 banner (24px corner
				 * radius) inside a transparent drop-shadow area of 48px left/right,
				 * 8px top and 73px bottom. The link crops the image to the banner
				 * itself (2416 / 2320 = 104.138% wide, shifted 48 / 2320 = 2.069%
				 * left and 8 / 2320 = 0.345% up) and redraws the shadow with CSS,
				 * so the banner lines up with the page content edges and never
				 * causes horizontal scroll.
				 */
				#shapedplugin-bfcm-notice {
					position: relative;
					container-type: inline-size;
					/* container-type drops content sizing, so take the full row if a page puts it in a flex/grid header. */
					flex: 1 1 100%;
					grid-column: 1 / -1;
					margin: 12px 20px 14px 2px;
					padding: 0;
					border: 0;
					background: transparent;
					box-shadow: none;
					line-height: 0;
				}
				.wrap #shapedplugin-bfcm-notice {
					margin: 12px 0 14px;
				}
				/* Hidden until the script below places it under the page heading, so the page never jumps. */
				.js #shapedplugin-bfcm-notice:not(.spbf-placed) {
					display: none;
				}
				#shapedplugin-bfcm-notice .spbf-link {
					display: block;
					overflow: hidden;
					aspect-ratio: 2320 / 163;
					border-radius: 1.034% / 14.72%;
					box-shadow: 0 14px 30px -12px rgba(75, 30, 150, 0.45);
				}
				#shapedplugin-bfcm-notice .spbf-link:focus {
					box-shadow: none;
					outline: 0;
				}
				#shapedplugin-bfcm-notice .spbf-link:focus-visible {
					outline: 2px solid #7c3aed;
					outline-offset: 2px;
				}
				#shapedplugin-bfcm-notice .spbf-image {
					display: block;
					width: 104.138%;
					max-width: none;
					height: auto;
					margin-top: -0.345%;
					margin-inline-start: -2.069%;
				}
				/*
				 * Close button as in the design: on the 1160x81.5 banner the glyph
				 * centre sits 17.75px from the right (1.53% of the width) and 19.5px
				 * from the top (23.93% of the height), and the glyph is 7.25px wide
				 * (0.625cqw), so it scales with the banner image. The 24px button
				 * is the click target, centred on the glyph.
				 */
				#shapedplugin-bfcm-notice .spbf-close {
					position: absolute;
					z-index: 2;
					top: calc(23.93% - 12px);
					inset-inline-end: calc(1.53% - 12px);
					display: flex;
					align-items: center;
					justify-content: center;
					width: 24px;
					height: 24px;
					margin: 0;
					padding: 0;
					border: 0;
					border-radius: 50%;
					background: transparent;
					color: #99a1af;
					cursor: pointer;
					transition: color 0.2s ease;
				}
				#shapedplugin-bfcm-notice .spbf-close:hover {
					color: #fff;
				}
				#shapedplugin-bfcm-notice .spbf-close:focus {
					outline: 0;
				}
				#shapedplugin-bfcm-notice .spbf-close:focus-visible {
					outline: 2px solid #fff;
				}
				#shapedplugin-bfcm-notice .spbf-close svg {
					width: 10px;
					height: 10px;
					width: max(7.25px, 0.625cqw);
					height: max(7.25px, 0.625cqw);
				}
				/* Mobile: move the close button onto the corner so it never covers the CTA. */
				@media screen and (max-width: 782px) {
					#shapedplugin-bfcm-notice .spbf-close {
						top: -8px;
						inset-inline-end: -8px;
						width: 20px;
						height: 20px;
						background: #2b2833;
						color: #fff;
						box-shadow: 0 2px 6px rgba(0, 0, 0, 0.25);
					}
					#shapedplugin-bfcm-notice .spbf-close:hover {
						background: #000;
					}
					#shapedplugin-bfcm-notice .spbf-close svg {
						width: 8px;
						height: 8px;
					}
				}
			</style>
			<div id="shapedplugin-bfcm-notice" class="notice spbf-notice">
				<a class="spbf-link" href="<?php echo esc_url( $plugin['link'] ); ?>" target="_blank" rel="noopener">
					<img class="spbf-image" src="<?php echo esc_url( $plugin['image'] ); ?>" alt="<?php echo esc_attr( $alt ); ?>" width="2416" height="244">
				</a>
				<button type="button" class="spbf-close" aria-label="Dismiss this offer"
					data-action="<?php echo esc_attr( self::AJAX_ACTION ); ?>"
					data-nonce="<?php echo esc_attr( wp_create_nonce( self::AJAX_ACTION ) ); ?>"
					data-ajax-url="<?php echo esc_url( admin_url( 'admin-ajax.php' ) ); ?>">
					<svg viewBox="0 0 12 12" fill="none" aria-hidden="true" focusable="false"><path d="M1 1l10 10M11 1L1 11" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>
				</button>
			</div>
			<script>
				( function () {
					var notice = document.getElementById( 'shapedplugin-bfcm-notice' );
					var button = notice ? notice.querySelector( '.spbf-close' ) : null;
					if ( ! button ) {
						return;
					}
					var observer = null;
					// Where core's common.js moves notices: after .wp-header-end, else after the first .wrap h1/h2.
					var findTarget = function () {
						var end = document.querySelector( '.wp-header-end' );
						if ( end ) {
							return end;
						}
						var heading = document.querySelector( '.wrap h1, .wrap h2' );
						var next = heading ? heading.nextElementSibling : null;
						while ( next && ( next === notice || next.matches( '.page-title-action, .subtitle' ) ) ) {
							next = next.nextElementSibling;
						}
						// Settle on the heading only once what follows it is parsed, so a later .wp-header-end still wins.
						return next ? heading : null;
					};
					// Move the notice there while the page is still parsing, so it is never painted anywhere else.
					var place = function ( final ) {
						var target = findTarget();
						if ( target && target.nextElementSibling !== notice ) {
							target.parentNode.insertBefore( notice, target.nextSibling );
						}
						if ( target || final ) {
							notice.classList.add( 'spbf-placed' );
						}
						return !! target && target.classList.contains( 'wp-header-end' );
					};
					if ( ! place( false ) && window.MutationObserver ) {
						observer = new MutationObserver( function () {
							if ( place( !! document.getElementById( 'wpfooter' ) ) ) {
								observer.disconnect();
							}
						} );
						observer.observe( document.documentElement, { childList: true, subtree: true } );
					}
					document.addEventListener( 'DOMContentLoaded', function () {
						if ( observer ) {
							observer.disconnect();
						}
						place( true );
					} );
					button.addEventListener( 'click', function () {
						var data = new URLSearchParams();
						data.append( 'action', button.getAttribute( 'data-action' ) );
						data.append( 'nonce', button.getAttribute( 'data-nonce' ) );
						if ( window.fetch ) {
							window.fetch( button.getAttribute( 'data-ajax-url' ), { method: 'POST', credentials: 'same-origin', body: data } );
						}
						notice.style.transition = 'opacity 0.3s ease';
						notice.style.opacity = '0';
						window.setTimeout( function () {
							notice.parentNode && notice.parentNode.removeChild( notice );
						}, 300 );
					} );
				} )();
			</script>
			<?php
		}

		/**
		 * AJAX: dismiss the campaign for every ShapedPlugin plugin, site-wide.
		 *
		 * @return void
		 */
		public function dismiss() {
			if ( ! current_user_can( 'manage_options' ) ) {
				wp_send_json_error( null, 403 );
			}

			check_ajax_referer( self::AJAX_ACTION, 'nonce' );

			update_option( self::OPTION_KEY, time() );

			wp_send_json_success();
		}
	}

	ShapedPlugin_BFCM_Notice_2026::instance();
}
