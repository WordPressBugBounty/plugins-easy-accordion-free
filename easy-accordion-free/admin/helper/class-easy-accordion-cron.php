<?php
/**
 * The admin-specific functionality of the plugin.
 *
 * @link        http://shapedplugin.com/
 * @since      2.0.19
 *
 * @package    Easy_Accordion_Free
 * @subpackage Easy_Accordion_Free/admin
 * @author     ShapedPlugin <support@shapedplugin.com>
 */

if ( ! defined( 'ABSPATH' ) ) {
	die;
} // Cannot access directly.

/**
 * Easy_Accordion_Pro_Cron
 */
class Easy_Accordion_Cron {

	/**
	 * Initialize the class and set its properties.
	 *
	 * @since    2.0.19
	 */
	public function __construct() {

		add_filter( 'cron_schedules', array( $this, 'add_schedules' ) );
		add_action( 'wp', array( $this, 'schedule_events' ) );
	}

	/**
	 * Registers new cron schedules.
	 *
	 * @since 2.0.19
	 *
	 * @param array $schedules schedules.
	 * @return array
	 */
	public function add_schedules( $schedules = array() ) {
		// Adds once weekly to the existing schedules.
		$schedules['weekly'] = array(
			'interval' => WEEK_IN_SECONDS,
			'display'  => __( 'Once Weekly', 'easy-accordion-free' ),
		);

		return $schedules;
	}

	/**
	 * Schedules our events
	 *
	 * @since 2.0.19
	 * @return void
	 */
	public function schedule_events() {
		$this->weekly_events();
	}

	/**
	 * Schedule weekly events
	 *
	 * @access private
	 * @since 2.0.19
	 * @return void
	 */
	private function weekly_events() {
		if ( ! wp_next_scheduled( 'easy_accordion_weekly_scheduled_events' ) ) {
			wp_schedule_event( time(), 'weekly', 'easy_accordion_weekly_scheduled_events' );
		}
	}
}

new Easy_Accordion_Cron();
