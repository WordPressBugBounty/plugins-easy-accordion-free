<?php
/**
 * The help page for the Easy Accordion Free
 *
 * @package Easy Accordion Free
 * @subpackage easy-accordion-free/admin
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * The help class for the Easy Accordion Free
 */
class Easy_Accordion_Free_Help {

	/**
	 * Single instance of the class
	 *
	 * @var null
	 */
	protected static $_instance = null;

	/**
	 * Easy_Accordion_Free_Help construct function.
	 */
	public function __construct() {
		add_action( 'admin_menu', array( $this, 'analytics_admin_menu' ), 55 );
		add_action( 'admin_menu', array( $this, 'faq_form_admin_menu' ), 50 );
	}

	/**
	 * Main Easy_Accordion_Free_Help Instance
	 *
	 * @static
	 * @see Easy_Accordion_Free_Help()
	 * @return self Main instance
	 */
	public static function instance() {
		if ( is_null( self::$_instance ) ) {
			self::$_instance = new self();
		}

		return self::$_instance;
	}

	/**
	 * Add admin menu analytics sub menu.
	 *
	 * @return void
	 */
	public function analytics_admin_menu() {
		add_submenu_page(
			'edit.php?post_type=sp_easy_accordion',
			__( 'Easy Accordion Analytics', 'easy-accordion-free' ),
			__( 'Analytics', 'easy-accordion-free' ) . '<span class="eap-menu-new-indicator" style="color: #f18200;font-size: 9px; padding-left: 3px;">' . __( ' NEW!', 'easy-accordion-free' ) . '</span>',
			'manage_options',
			'eap_analytics',
			array(
				$this,
				'analytics_page_callback',
			)
		);
	}

	/**
	 * The Easy Accordion analytics Callback.
	 *
	 * @return void
	 */
	public function analytics_page_callback() {
		?>
		<div class="sp-eap-indicator-notice">Want to know <a href="https://easyaccordion.io/faq-analytics" target="_blank">valuable insights or analytics</a> into FAQs performance? To track impressions, clicks, and more to optimize engagement, <a href="https://easyaccordion.io/pricing/?ref=1" target="_blank"><b>Upgrade to Pro!</b></a></div>
		<div class="sp-eap-indicator">
		<?php echo esc_html( $this->sp_eap_upgrade_to_pro_btn() ); ?>
		<img src="<?php echo esc_url( SP_EA_URL . 'admin/help-page/img/analytics.webp' ); ?>" alt="faqs-indicator">
		</div>
		<?php
	}

	/**
	 * Display the upgrade to pro button.
	 *
	 * @return void
	 */
	public function sp_eap_upgrade_to_pro_btn() {
		?>
		<div class="sp-eap-upgrade-to-pro-button">
			<a href="https://easyaccordion.io/pricing/?ref=1" target="_blank">
				Upgrade to Pro!
			</a>
		</div>
		<?php
	}

	/**
	 * Add admin menu analytics sub menu.
	 *
	 * @return void
	 */
	public function faq_form_admin_menu() {
		add_submenu_page(
			'edit.php?post_type=sp_easy_accordion',
			__( 'Easy Accordion Form', 'easy-accordion-free' ),
			__( 'FAQ Forms', 'easy-accordion-free' ) . '<span class="eap-menu-new-indicator" style="color: #f18200;font-size: 9px; padding-left: 3px;">' . __( ' HOT!', 'easy-accordion-free' ) . '</span>',
			'manage_options',
			'eap_form',
			array(
				$this,
				'form_page_callback',
			)
		);
	}

	/**
	 * The Easy Accordion analytics Callback.
	 *
	 * @return void
	 */
	public function form_page_callback() {
		?>
		<div class="sp-eap-indicator-notice">To allow users to submit FAQ suggestions using the <a href="https://easyaccordion.io/faq-forms/" target="_blank"><b>FAQs Form</b></a>, <a href="https://easyaccordion.io/pricing/?ref=1" target="_blank"><b>Upgrade to Pro!</b></a></div>
		<div class="eap-faq-form">
		<?php echo esc_html( $this->sp_eap_upgrade_to_pro_btn() ); ?>
		<img src="<?php echo esc_url( SP_EA_URL . 'admin/help-page/img/form.webp' ); ?>" alt="forms" class="eap-form-img"/>
		</div>
		<?php
	}
}

Easy_Accordion_Free_Help::instance();
