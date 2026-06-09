<?php
/**
 * The review admin notice.
 *
 * @since        2.0.4
 * @version      2.0.4
 *
 * @package    Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/admin/views/notices
 * @author     ShapedPlugin<support@shapedplugin.com>
 */

if ( ! defined( 'ABSPATH' ) ) {
	die;
} // Cannot access directly.

/**
 * Admin review notice class.
 */
class Easy_Accordion_Free_Review {

	/**
	 * Initialize the class and set its properties.
	 */
	public function __construct() {
		add_action( 'admin_notices', array( $this, 'render_blocks_promo_notice' ) );
		add_action( 'wp_ajax_ea_free_dismiss_blocks_promo_notice', array( $this, 'dismiss_blocks_promo_notice' ) );
		add_action( 'in_admin_header', array( $this, 'render_blocks_promo_modal' ) );
		add_action( 'wp_ajax_ea_free_dismiss_blocks_promo_modal', array( $this, 'dismiss_blocks_promo_modal' ) );
	}

	/**
	 * Display admin notice.
	 *
	 * @return void
	 */
	public function display_admin_notice() {
		// Show only to Admins.
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// Variable default value.
		$review = get_option( 'sp_eafree_review_notice_dismiss' );
		$time   = time();
		$load   = false;

		if ( ! $review ) {
			$review = array(
				'time'      => $time,
				'dismissed' => false,
			);
			add_option( 'sp_eafree_review_notice_dismiss', $review );
		} else {
			// Check if it has been dismissed or not.
			if ( ( isset( $review['dismissed'] ) && ! $review['dismissed'] ) && ( isset( $review['time'] ) && ( ( $review['time'] + ( DAY_IN_SECONDS * 3 ) ) <= $time ) ) ) {
				$load = true;
			}
		}

		// If we cannot load, return early.
		if ( ! $load ) {
			return;
		}
		$plugin_logo_image = 'https://ps.w.org/easy-accordion-free/assets/icon-256x256.gif';

		?>
		<div id="sp-eafree-review-notice" class="sp-eafree-review-notice">
			<div class="sp-eafree-plugin-icon">
				<img src="<?php echo esc_url( $plugin_logo_image ); ?>" alt="Easy Accordion">
			</div>
			<div class="sp-eafree-notice-text">
				<h3>Enjoying <strong>Easy Accordion</strong>?</h3>
				<p>We hope you had a wonderful experience using <strong>Easy Accordion</strong>. Please take a moment to leave a review on <a href="https://wordpress.org/support/plugin/easy-accordion-free/reviews/" target="_blank"><strong>WordPress.org</strong></a>.
				Your positive review will help us improve. Thank you! 😊</p>

				<p class="sp-eafree-review-actions">
					<a href="https://wordpress.org/support/plugin/easy-accordion-free/reviews/" target="_blank" class="button button-primary notice-dismissed rate-easy-accordion">Ok, you deserve ★★★★★</a>
					<a href="#" class="notice-dismissed remind-me-later"><span class="dashicons dashicons-clock"></span>Nope, maybe later
					</a>
					<a href="#" class="notice-dismissed never-show-again"><span class="dashicons dashicons-dismiss"></span>Never show again</a>
				</p>
			</div>
		</div>

		<script type='text/javascript'>

			jQuery(document).ready( function($) {
				$(document).on('click', '#sp-eafree-review-notice.sp-eafree-review-notice .notice-dismissed', function( event ) {
					if ( $(this).hasClass('rate-easy-accordion') ) {
						var notice_dismissed_value = "1";
					}
					if ( $(this).hasClass('remind-me-later') ) {
						var notice_dismissed_value =  "2";
						event.preventDefault();
					}
					if ( $(this).hasClass('never-show-again') ) {
						var notice_dismissed_value =  "3";
						event.preventDefault();
					}

					$.post( ajaxurl, {
						action: 'sp-eafree-never-show-review-notice',
						notice_dismissed_data : notice_dismissed_value,
						nonce: '<?php echo esc_attr( wp_create_nonce( 'sp_eafree_review_notice' ) ); ?>'
					});

					$('#sp-eafree-review-notice.sp-eafree-review-notice').hide();
				});
			});

		</script>
		<?php
	}

	/**
	 * Dismiss review notice
	 *
	 * @since  2.0.4
	 *
	 * @return void
	 **/
	public function dismiss_review_notice() {
		// Check user capabilities, current_user_can() is called internally.
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		$post_data = wp_unslash( $_POST );
		$review    = get_option( 'sp_eafree_review_notice_dismiss' );

		if ( ! isset( $post_data['nonce'] ) || ! wp_verify_nonce( sanitize_key( $post_data['nonce'] ), 'sp_eafree_review_notice' ) ) {
			return;
		}

		if ( ! $review ) {
			$review = array();
		}
		$dismiss_status = isset( $post_data['notice_dismissed_data'] ) ? sanitize_text_field( $post_data['notice_dismissed_data'] ) : '';
		switch ( $dismiss_status ) {
			case '1':
				$review['time']      = time();
				$review['dismissed'] = true;
				break;
			case '2':
				$review['time']      = time();
				$review['dismissed'] = false;
				break;
			case '3':
				$review['time']      = time();
				$review['dismissed'] = true;
				break;
		}
		update_option( 'sp_eafree_review_notice_dismiss', $review );
		die;
	}

	/**
	 * Render the "Meet the new Easy Accordion" promo banner that surfaces
	 * the block editor + ready patterns on the classic sp_easy_accordion edit
	 * screens. Dismissed per-user via user_meta.
	 *
	 * @return void
	 */
	public function render_blocks_promo_notice() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}

		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || 'sp_easy_accordion' !== $screen->post_type ) {
			return;
		}
		if ( 'post' !== $screen->base ) {
			return;
		}

		if ( get_option( 'ea_free_blocks_promo_notice_dismissed' ) ) {
			return;
		}

		$block_editor_url = admin_url( 'post-new.php?post_type=sp_eap_template&eabblock_inserter=true' );
		$nonce            = wp_create_nonce( 'ea_free_blocks_promo_notice' );
		?>
		<div class="notice ea-free-blocks-promo-notice" data-ea-free-nonce="<?php echo esc_attr( $nonce ); ?>">
			<div class="ea-free-blocks-promo-notice__text">
				<?php
				$highlight_open   = '<a class="ea-free-blocks-promo-notice__highlight" href="https://easyaccordion.io/patterns/" target="_blank" rel="noopener">';
				$highlight_blocks = '<a class="ea-free-blocks-promo-notice__highlight" href="https://easyaccordion.io/blocks/" target="_blank" rel="noopener">';
				echo wp_kses(
					sprintf(
						/* translators: 1: opening strong, 2: closing strong, 3: opening anchor to block editor, 4: closing anchor. */
						__( '%1$sMeet the new Easy Accordion%2$s — gives you %3$s15+ Gutenberg Blocks%4$s and %5$s200+ Ready Patterns%6$s to design visually — see every change live.', 'easy-accordion-free' ),
						'<strong>',
						'</strong>',
						$highlight_blocks,
						'</a>',
						$highlight_open,
						'</a>'
					),
					array(
						'strong' => array(),
						'a'      => array(
							'class'  => array(),
							'href'   => array(),
							'target' => array(),
							'rel'    => array(),
						),
					)
				);
				?>
			</div>
			<div class="ea-free-blocks-promo-notice__actions">
				<a class="ea-free-blocks-promo-notice__cta" href="<?php echo esc_url( $block_editor_url ); ?>">
					<?php esc_html_e( 'Try Block Editor', 'easy-accordion-free' ); ?>
					<svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
						<path d="M2.25 6h7.5M6.75 2.25 10.5 6 6.75 9.75" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
					</svg>
				</a>
				<button type="button" class="ea-free-blocks-promo-notice__dismiss" aria-label="<?php esc_attr_e( 'Dismiss this notice', 'easy-accordion-free' ); ?>">
					<span class="dashicons dashicons-no-alt"></span>
				</button>
			</div>
		</div>
		<style>
			.ea-free-blocks-promo-notice {
				display: flex;
				align-items: center;
				gap: 24px;
				margin: 16px 20px 16px 0;
				padding: 12px 20px 12px 24px;
				background: #fff3cd;
				border: 1px solid #f0c040;
				border-left-width: 4px;
				border-radius: 4px;
				box-shadow: none;
				color: #473400;
			}
			.ea-free-blocks-promo-notice__text {
				flex: 1 1 auto;
				font: 400 15px/20px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
				color: #473400;
			}
			.ea-free-blocks-promo-notice__text strong {
				font-weight: 600;
				color: #473400;
			}
			.ea-free-blocks-promo-notice .ea-free-blocks-promo-notice__highlight{
				color: #473400;
				font-weight: 600;
				text-decoration: underline;
			}
			.ea-free-blocks-promo-notice .ea-free-blocks-promo-notice__highlight:hover,
			.ea-free-blocks-promo-notice .ea-free-blocks-promo-notice__highlight:focus {
				color: #1a74e4;
				box-shadow: none;
				outline: none;
			}
			.ea-free-blocks-promo-notice__actions {
				display: flex;
				align-items: center;
				gap: 12px;
				flex-shrink: 0;
			}
			.ea-free-blocks-promo-notice .ea-free-blocks-promo-notice__cta {
				display: inline-flex;
				align-items: center;
				gap: 5px;
				padding: 8px 12px;
				background: #1a74e4;
				border: 1px solid #1a74e4;
				border-radius: 2px;
				color: #fff;
				font: 600 13px/18px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
				text-decoration: none;
				box-shadow: none;
			}
			.ea-free-blocks-promo-notice .ea-free-blocks-promo-notice__cta:hover,
			.ea-free-blocks-promo-notice .ea-free-blocks-promo-notice__cta:focus {
				background: #1565c0;
				border-color: #1565c0;
				color: #fff;
				outline: none;
			}
			.ea-free-blocks-promo-notice__cta svg {
				flex-shrink: 0;
			}
			.ea-free-blocks-promo-notice__dismiss {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 24px;
				height: 24px;
				padding: 0;
				background: transparent;
				border: 0;
				color: #473400;
				cursor: pointer;
			}
			.ea-free-blocks-promo-notice__dismiss:hover,
			.ea-free-blocks-promo-notice__dismiss:focus {
				color: #000;
				outline: none;
			}
			.ea-free-blocks-promo-notice__dismiss .dashicons {
				font-size: 20px;
				width: 20px;
				height: 20px;
			}
		</style>
		<script>
			( function() {
				document.addEventListener( 'click', function( event ) {
					var dismiss = event.target.closest( '.ea-free-blocks-promo-notice__dismiss' );
					if ( ! dismiss ) {
						return;
					}
					var notice = dismiss.closest( '.ea-free-blocks-promo-notice' );
					if ( ! notice ) {
						return;
					}
					notice.style.display = 'none';
					var data = new FormData();
					data.append( 'action', 'ea_free_dismiss_blocks_promo_notice' );
					data.append( 'nonce', notice.getAttribute( 'data-ea-free-nonce' ) || '' );
					if ( window.fetch && window.ajaxurl ) {
						fetch( window.ajaxurl, { method: 'POST', credentials: 'same-origin', body: data } );
					}
				} );
			} )();
		</script>
		<?php
	}

	/**
	 * Persist dismissal of the blocks promo notice site-wide.
	 *
	 * @return void
	 */
	public function dismiss_blocks_promo_notice() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$nonce = isset( $_POST['nonce'] ) ? sanitize_key( wp_unslash( $_POST['nonce'] ) ) : '';
		if ( ! wp_verify_nonce( $nonce, 'ea_free_blocks_promo_notice' ) ) {
			wp_send_json_error();
		}
		update_option( 'ea_free_blocks_promo_notice_dismissed', 1, false );
		wp_send_json_success();
	}

	/**
	 * Render a one-time welcome modal on the Add New Accordion screen pointing
	 * users at the block editor. Stored dismissal lives in wp_options so the
	 * popup never appears twice for the site.
	 *
	 * @return void
	 */
	public function render_blocks_promo_modal() {
		if ( ! current_user_can( 'edit_posts' ) ) {
			return;
		}

		$screen = function_exists( 'get_current_screen' ) ? get_current_screen() : null;
		if ( ! $screen || 'sp_easy_accordion' !== $screen->post_type || 'add' !== $screen->action ) {
			return;
		}

		if ( get_option( 'ea_free_blocks_promo_modal_choice' ) ) {
			return;
		}

		$block_editor_url = admin_url( 'post-new.php?post_type=sp_eap_template&eabblock_inserter=true' );
		$nonce            = wp_create_nonce( 'ea_free_blocks_promo_modal' );
		$modal_video_url  = 'https://easyaccordion.io/wp-content/uploads/2026/06/EA-Popup-V01-2.mp4';
		?>
		<div class="ea-free-blocks-promo-modal" data-ea-free-nonce="<?php echo esc_attr( $nonce ); ?>" role="dialog" aria-modal="true" aria-labelledby="ea-free-blocks-promo-modal__title">
			<div class="ea-free-blocks-promo-modal__backdrop" data-ea-free-modal-close="1"></div>
			<div class="ea-free-blocks-promo-modal__dialog">
				<div class="ea-free-blocks-promo-modal__header">
					<div class="ea-free-blocks-promo-modal__heading">
						<h2 id="ea-free-blocks-promo-modal__title" class="ea-free-blocks-promo-modal__title">
							<?php esc_html_e( 'How would you like to create your accordion?', 'easy-accordion-free' ); ?>
						</h2>
						<p class="ea-free-blocks-promo-modal__subtitle">
							<?php esc_html_e( 'Choose the workflow that suits you best — you can always switch later.', 'easy-accordion-free' ); ?>
						</p>
					</div>
					<button type="button" class="ea-free-blocks-promo-modal__close" data-ea-free-modal-close="1" aria-label="<?php esc_attr_e( 'Close', 'easy-accordion-free' ); ?>">
						<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
							<path fill="currentColor" d="M12 13.06l3.712 3.713 1.061-1.06L13.061 12l3.712-3.712-1.06-1.06L12 10.938 8.288 7.227l-1.061 1.06L10.939 12l-3.712 3.712 1.06 1.061L12 13.061z"/>
						</svg>
					</button>
				</div>
				<div class="ea-free-blocks-promo-modal__body">
					<div class="ea-free-blocks-promo-modal__preview" aria-hidden="true">
						<video class="ea-free-blocks-promo-modal__video" src="<?php echo esc_url( $modal_video_url ); ?>" autoplay loop muted playsinline preload="metadata"></video>
					</div>
					<div class="ea-free-blocks-promo-modal__actions">
						<a class="ea-free-blocks-promo-modal__cta" href="<?php echo esc_url( $block_editor_url ); ?>">
							<?php esc_html_e( 'Start with Block Editor', 'easy-accordion-free' ); ?>
							<svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">
								<path d="M2.625 7h8.75M7.875 2.625 12.25 7l-4.375 4.375" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
							</svg>
						</a>
						<button type="button" class="ea-free-blocks-promo-modal__skip" data-ea-free-modal-close="1">
							<?php esc_html_e( 'Continue with Classic Shortcode', 'easy-accordion-free' ); ?>
						</button>
					</div>
				</div>
				<div class="ea-free-blocks-promo-modal__footer">
					<label class="ea-free-blocks-promo-modal__checkbox">
						<input type="checkbox" class="ea-free-blocks-promo-modal__checkbox-input" />
						<span class="ea-free-blocks-promo-modal__checkbox-label">
							<?php esc_html_e( 'Remember this choice and skip this step next time.', 'easy-accordion-free' ); ?>
						</span>
					</label>
				</div>
			</div>
		</div>
		<style>
			#wpcontent:has(.ea-free-blocks-promo-modal) {
				position: relative;
			}
			.ea-free-blocks-promo-modal {
				position: absolute;
				inset: 0;
				min-height: calc(100vh - 32px);
				z-index: 99998;
			}
			@media screen and (max-width: 782px) {
				.ea-free-blocks-promo-modal {
					min-height: calc(100vh - 46px);
				}
			}
			.ea-free-blocks-promo-modal__backdrop {
				position: absolute;
				inset: 0;
				background: rgba(0, 0, 0, 0.85);
			}
			.ea-free-blocks-promo-modal__dialog {
				position: fixed;
				top: 50%;
				left: 50%;
				transform: translate(-50%, -50%);
				display: flex;
				flex-direction: column;
				width: calc(100% - 48px);
				max-width: 660px;
				background: #fff;
				border-radius: 12px;
				overflow: hidden;
				box-shadow: 0 24px 48px rgba(0, 0, 0, 0.18);
				font: 400 13px/20px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
				color: #3d434b;
			}
			.ea-free-blocks-promo-modal__header {
				display: flex;
				align-items: center;
				gap: 5px;
				padding: 18px 32px;
				background: #f6f7f7;
				border-bottom: 1px solid #ddd;
			}
			.ea-free-blocks-promo-modal__heading {
				flex: 1 1 auto;
				display: flex;
				flex-direction: column;
				gap: 5px;
			}
			.ea-free-blocks-promo-modal__title {
				margin: 0;
				font: 600 20px/24px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
				color: #1d2327;
			}
			.ea-free-blocks-promo-modal__subtitle {
				margin: 0;
				font: 400 12px/16px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
				color: #3d434b;
			}
			.ea-free-blocks-promo-modal__close {
				display: inline-flex;
				align-items: center;
				justify-content: center;
				width: 32px;
				height: 32px;
				padding: 0;
				background: #fff;
				border: 1px solid #c3c4c7;
				border-radius: 999px;
				color: #1d2327;
				cursor: pointer;
				flex-shrink: 0;
			}
			.ea-free-blocks-promo-modal__close:hover,
			.ea-free-blocks-promo-modal__close:focus {
				background: #f6f7f7;
				outline: none;
			}
			.ea-free-blocks-promo-modal__body {
				display: flex;
				flex-direction: column;
				gap: 23px;
				padding: 28px 32px;
			}
			.ea-free-blocks-promo-modal__preview {
				width: 100%;
				height: 356px;
				background: #d9d9d9;
				border-radius: 6px;
				border: 1px solid #DFDFDF;
				overflow: hidden;
			}
			.ea-free-blocks-promo-modal__video {
				display: block;
				width: 100%;
				height: 100%;
				object-fit: cover;
				border-radius: inherit;
			}
			.ea-free-blocks-promo-modal__actions {
				display: flex;
				gap: 10px;
				align-items: center;
			}
			.ea-free-blocks-promo-modal .ea-free-blocks-promo-modal__cta {
				display: inline-flex;
				align-items: center;
				gap: 5px;
				padding: 13px 18px;
				background: #1a74e4;
				border: 1px solid #1a74e4;
				border-radius: 4px;
				color: #fff;
				font: 600 13px/18px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
				text-decoration: none;
				box-shadow: none;
			}
			.ea-free-blocks-promo-modal .ea-free-blocks-promo-modal__cta:hover,
			.ea-free-blocks-promo-modal .ea-free-blocks-promo-modal__cta:focus {
				background: #1565c0;
				border-color: #1565c0;
				color: #fff;
				outline: none;
			}
			.ea-free-blocks-promo-modal__skip {
				display: inline-flex;
				align-items: center;
				gap: 5px;
				padding: 13px 18px;
				background: #fff;
				border: 1px solid #c3c4c7;
				border-radius: 4px;
				color: #1d2327;
				font: 600 13px/18px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
				cursor: pointer;
			}
			.ea-free-blocks-promo-modal__skip:hover,
			.ea-free-blocks-promo-modal__skip:focus {
				background: #f6f7f7;
				outline: none;
			}
			.ea-free-blocks-promo-modal__footer {
				padding: 8px 32px;
				background: #f6f7f7;
			}
			.ea-free-blocks-promo-modal__checkbox {
				display: inline-flex;
				align-items: center;
				gap: 10px;
				cursor: pointer;
			}
			.ea-free-blocks-promo-modal__checkbox .ea-free-blocks-promo-modal__checkbox-input {
				width: 16px;
				height: 16px;
				margin: 0;
				background: #fff;
				border: 1px solid #949494;
				border-radius: 2px;
			}
			.ea-free-blocks-promo-modal__checkbox-label {
				font: 400 13px/20px Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
				color: #3d434b;
			}
		</style>
		<script>
			( function() {
				var modal = document.querySelector( '.ea-free-blocks-promo-modal' );
				if ( ! modal ) {
					return;
				}
				var checkbox = modal.querySelector( '.ea-free-blocks-promo-modal__checkbox-input' );
				function persistChoice( choice ) {
					if ( ! checkbox || ! checkbox.checked || ! window.ajaxurl ) {
						return;
					}
					var data = new FormData();
					data.append( 'action', 'ea_free_dismiss_blocks_promo_modal' );
					data.append( 'nonce', modal.getAttribute( 'data-ea-free-nonce' ) || '' );
					data.append( 'choice', choice );
					if ( navigator.sendBeacon ) {
						navigator.sendBeacon( window.ajaxurl, data );
					} else if ( window.fetch ) {
						fetch( window.ajaxurl, {
							method: 'POST',
							credentials: 'same-origin',
							body: data,
							keepalive: true,
						} );
					}
				}
				function close() {
					modal.style.display = 'none';
				}
				var skip = modal.querySelector( '.ea-free-blocks-promo-modal__skip' );
				if ( skip ) {
					skip.addEventListener( 'click', function() {
						persistChoice( 'classic_shortcode' );
					} );
				}
				var cta = modal.querySelector( '.ea-free-blocks-promo-modal__cta' );
				if ( cta ) {
					cta.addEventListener( 'click', function() {
						persistChoice( 'block_editor' );
					} );
				}
				modal.addEventListener( 'click', function( event ) {
					var target = event.target.closest( '[data-ea-free-modal-close]' );
					if ( target ) {
						event.preventDefault();
						close();
					}
				} );
				document.addEventListener( 'keydown', function( event ) {
					if ( event.key === 'Escape' && modal.style.display !== 'none' ) {
						close();
					}
				} );
			} )();
		</script>
		<?php
	}

	/**
	 * Persist the user's workflow choice from the Add New Accordion welcome modal.
	 *
	 * Only fires when the "Remember this choice" checkbox is ticked. The stored
	 * value records which button the user picked so the modal can be skipped
	 * on subsequent visits.
	 *
	 * @return void
	 */
	public function dismiss_blocks_promo_modal() {
		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}
		$nonce = isset( $_POST['nonce'] ) ? sanitize_key( wp_unslash( $_POST['nonce'] ) ) : '';
		if ( ! wp_verify_nonce( $nonce, 'ea_free_blocks_promo_modal' ) ) {
			wp_send_json_error();
		}
		$choice  = isset( $_POST['choice'] ) ? sanitize_key( wp_unslash( $_POST['choice'] ) ) : '';
		$allowed = array( 'block_editor', 'classic_shortcode' );
		if ( ! in_array( $choice, $allowed, true ) ) {
			wp_send_json_error();
		}
		update_option( 'ea_free_blocks_promo_modal_choice', $choice, false );
		wp_send_json_success();
	}
}
