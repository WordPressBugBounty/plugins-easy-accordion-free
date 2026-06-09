<?php
/**
 * Framework shortcode field.
 *
 * @link       https://shapedplugin.com/
 * @since      2.0.0
 *
 * @package    easy-accordion-free
 * @subpackage easy-accordion-free/framework
 */

if ( ! defined( 'ABSPATH' ) ) {
	die; } // Cannot access directly.

if ( ! class_exists( 'SP_EAP_Field_shortcode' ) ) {
	/**
	 *
	 * Field: shortcode
	 *
	 * @since 1.0.0
	 * @version 1.0.0
	 */
	class SP_EAP_Field_shortcode extends SP_EAP_Fields {

		/**
		 * Shortcode field constructor.
		 *
		 * @param array  $field The field type.
		 * @param string $value The values of the field.
		 * @param string $unique The unique ID for the field.
		 * @param string $where To where show the output CSS.
		 * @param string $parent The parent args.
		 */
		public function __construct( $field, $value = '', $unique = '', $where = '', $parent = '' ) {
			parent::__construct( $field, $value, $unique, $where, $parent );
		}

		/**
		 * Render field
		 *
		 * @return void
		 */
		public function render() {

			// Get the Post ID.
			$post_id = get_the_ID();

			if ( ! empty( $this->field['shortcode'] ) && 'pro_notice' === $this->field['shortcode'] ) {
				if ( ! empty( $post_id ) ) {

					$icon = '<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M6.47461 1.24707C6.85097 3.76847 8.83144 5.7481 11.3525 6.125L12.5225 6.2998L11.3525 6.47461C8.83157 6.85179 6.85112 8.83112 6.47461 11.3525L6.2998 12.5225L6.125 11.3525C5.74845 8.83092 3.76819 6.85166 1.24707 6.47461L0.0761719 6.2998L1.24707 6.125C3.76832 5.74824 5.7486 3.76856 6.125 1.24707L6.2998 0.0761719L6.47461 1.24707Z" fill="#FF734C" stroke="#FF734C" stroke-width="0.0224423"/></svg>';

					$features = array(
						array(
							'label' => __( 'Unlimited FAQs Generation with AI', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/generate-high-converting-faqs-withpowerful-ai-in-seconds/',
						),
						array(
							'label' => __( '200+ Ready Patterns Library', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/patterns/',
						),
						array(
							'label' => __( '15+ Powerful Gutenberg Blocks', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/blocks/',
						),
						array(
							'label' => __( 'Interactive Accordion Slider', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/patterns/#accordion-slider',
						),
						array(
							'label' => __( 'FAQ Title Badges, Prefix & Suffix', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/core-accordion-content-features/#FAQ-Title-Prefix-&-Suffix',
						),
						array(
							'label' => __( 'Accordion Subtitles & Featured Icon', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/core-accordion-content-features/#Accordion-Featured-Icon',
						),
						array(
							'label' => __( 'FAQ Title Custom Linking', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/faq-title-custom-linking/',
						),
						array(
							'label' => __( 'WooCommerce Product FAQ Tab', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/woocommerce-product-faqs-tab/',
						),
						array(
							'label' => __( 'Frontend Live Taxonomy Filter', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/add-smart-faq-search-filters-to-help-usersfind-answers-faster/',
						),
						array(
							'label' => __( 'FAQ Analytics (Impressions & Clicks)', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/faq-analytics/',
						),
						array(
							'label' => __( 'User FAQ Submission Forms', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/user-faq-forms/',
						),
						array(
							'label' => __( 'Motion Effects & Animations', 'easy-accordion-free' ),
							'url'   => 'https://easyaccordion.io/accordion-animation/',
						),
					);

					echo '<div class="eap_shortcode-area eap-pro-notice-wrapper">';

					echo '<div class="eap-pro-notice-heading">' . sprintf(
						/* translators: 1: start span tag wrapping the product name, 2: close tag. */
						esc_html__( 'Go Pro & Unlock More! 🚀', 'easy-accordion-free' ),
					) . '</div>';

					echo '<p>Unlock the full potential of Easy Accordion to create and manage FAQs /  accordions.</p>';

					echo '<ul class="eap-pro-notice-features">';
					foreach ( $features as $feature ) {

						echo '<li>';
						echo '<span class="eap-pro-feature__icon">';
						echo $icon; // phpcs:ignore -- No user input.
						echo '</span>';

						if ( ! empty( $feature['url'] ) ) {
							echo '<a class="eap-pro-feature__link" href="' . esc_url( $feature['url'] ) . '" target="_blank" rel="noopener">';
							echo esc_html( $feature['label'] );
							echo '<svg class="eap-pro-feature__arrow" width="9" height="9" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M.75 7.417 7.417.75m0 5.128V.75H2.288" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
							echo '</a>';
						} else {
							echo '<span class="eap-pro-feature__label">' . esc_html( $feature['label'] ) . '</span>';
						}
						echo '</li>';
					}
					echo '</ul>';

					echo '<div class="eap-pro-notice-button">';
					echo '<a class="eap-open-live-demo" href="https://easyaccordion.io/pricing/?ref=1" target="_blank" rel="noopener">';
					echo '<span class="sp-go-pro-icon"></span>';
					echo '<span>' . esc_html__( 'Upgrade to Pro Now', 'easy-accordion-free' ) . '</span>';
					echo '</a>';
					echo '</div>';

					echo '</div>';
				}
			} elseif ( ! empty( $this->field['shortcode'] ) && 'builder_option' === $this->field['shortcode'] ) {
				echo ( ! empty( $post_id ) ) ? '
					<div class="eap-scode-wrap">
						<p>
							' .
								sprintf(
									/* translators: 1: start strong tag, 2: close tag. */
									esc_html__( 'Easy Accordion integrates seamlessly with %1$sGutenberg%2$s, Classic Editor, %1$sElementor%2$s, Divi, Bricks, Beaver, Oxygen, WPBakery Builder, and more.', 'easy-accordion-free' ),
									'<strong>',
									'</strong>'
								)
							. '
						</p>
					</div>
					' : '';
			} else {
				echo ( ! empty( $post_id ) ) ? '<div class="eap-scode-wrap"><p>To display the Accordion FAQs group, copy and paste this shortcode into your post, page, custom post, block editor, or page builder. <a href="https://docs.shapedplugin.com/docs/easy-accordion-pro/configurations/how-to-use-easy-accordion-shortcode-to-your-theme-files-or-php-templates/" target="_blank">Learn how</a> to include it in your template file.</p><span class="eap-shortcode-selectable">[sp_easyaccordion id="' . esc_attr( $post_id ) . '"]</span></div> <div class="eap-live-editor-promo"><h4 class="eap-live-editor-promo__title">Want a Live Visual Editor?</h4><p class="eap-live-editor-promo__desc">Design visually and see every change instantly. <a class="eap-live-editor-promo__link" href="' . esc_url( admin_url( 'post-new.php?post_type=sp_eap_template&amp;eabblock_inserter=true' ) ) . '">Try Block Editor ↗</a></p></div> <div class="sp_eap-after-copy-text"><i class="fa fa-check-circle"></i> Shortcode Copied to Clipboard! </div>' : '';
			}
		}
	}
}
