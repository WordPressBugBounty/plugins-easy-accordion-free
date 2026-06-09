<?php
/**
 * Elementor Easy Accordion Saved Template Widget.
 *
 * @since      4.1.0
 * @package     Easy_Accordion_Free
 * @subpackage  Easy_Accordion_Free/admin/ElementAddons
 */

use ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\Block_Dynamic_Style;

/**
 * SP_Eap_Saved_Template_Widget
 *
 * Elementor widget for Easy Accordion saved templates.
 *
 * @since 4.1.0
 */
class SP_Eap_Saved_Template_Widget extends \Elementor\Widget_Base {

	/**
	 * Get widget name.
	 *
	 * @since 4.1.0
	 * @access public
	 *
	 * @return string Widget name.
	 */
	public function get_name() {
		return 'sp_easy_accordion_saved_template';
	}

	/**
	 * Get widget title.
	 *
	 * @since 4.1.0
	 * @access public
	 *
	 * @return string Widget title.
	 */
	public function get_title() {
		return __( 'Easy Accordion Saved Template', 'easy-accordion-free' );
	}

	/**
	 * Get widget icon.
	 *
	 * @since 4.1.0
	 * @access public
	 *
	 * @return string Widget icon.
	 */
	public function get_icon() {
		return 'eap-icon-accordion-menu';
	}

	/**
	 * Get widget categories.
	 *
	 * @since 4.1.0
	 * @access public
	 *
	 * @return array Widget categories.
	 */
	public function get_categories() {
		return array( 'basic' );
	}

	/**
	 * Enqueue scripts for editor preview.
	 *
	 * @since 4.1.0
	 * @access public
	 *
	 * @return array Script handles.
	 */
	public function get_script_depends() {
		return array(
			'sp-eap-accordion',
			'sp_eab_script_js',
		);
	}

	/**
	 * Enqueue styles for editor preview.
	 *
	 * @since 4.1.0
	 * @access public
	 *
	 * @return array Style handles.
	 */
	public function get_style_depends() {
		return array(
			'sp_eab_main_css',
			'sp_eab_fontello_style',
		);
	}

	/**
	 * Get saved template list.
	 *
	 * @since 4.1.0
	 * @access private
	 *
	 * @return array Template list.
	 */
	private function get_saved_template_list() {
		$template_list = array(
			'0' => __( '- Select Template -', 'easy-accordion-free' ),
		);

		$query = new \WP_Query(
			array(
				'post_type'      => 'sp_eap_template',
				'post_status'    => 'publish',
				'posts_per_page' => 10000,
			)
		);

		if ( $query->have_posts() ) {
			foreach ( $query->posts as $post ) {
				$template_list[ $post->ID ] = ! empty( $post->post_title ) ? $post->post_title : '#' . $post->ID;
			}
		}

		krsort( $template_list );
		return $template_list;
	}

	/**
	 * Controls register.
	 *
	 * @since 4.1.0
	 * @access protected
	 *
	 * @return void
	 */
	protected function register_controls() {
		$this->start_controls_section(
			'content_section',
			array(
				'label' => __( 'Content', 'easy-accordion-free' ),
				'tab'   => \Elementor\Controls_Manager::TAB_CONTENT,
			)
		);

		$this->add_control(
			'sp_eap_saved_template',
			array(
				'label'       => __( 'Saved Template', 'easy-accordion-free' ),
				'type'        => \Elementor\Controls_Manager::SELECT2,
				'label_block' => true,
				'default'     => '0',
				'options'     => $this->get_saved_template_list(),
			)
		);

		// Edit This Template button.
		$this->add_control(
			'sp_eap_edit_template',
			array(
				'type'            => \Elementor\Controls_Manager::RAW_HTML,
				'raw'             => $this->get_edit_template_button(),
				'content_classes' => 'sp-eap-elementor-template-actions',
			)
		);

		$this->end_controls_section();
	}

	/**
	 * Generate dynamic CSS for template in Elementor editor.
	 *
	 * This method uses the same CSS generation logic as the saved templates shortcode.
	 * In Elementor editor, CSS is echoed directly for immediate loading.
	 *
	 * @since 4.1.0
	 * @access protected
	 *
	 * @param int    $template_id Template post ID.
	 * @param string $content     Template content.
	 *
	 * @return void
	 */
	protected function enqueue_template_dynamic_css( $template_id, $content = '' ) {
		// Prevent duplicate CSS generation for the same template in current request.
		static $generated_templates = array();
		if ( isset( $generated_templates[ $template_id ] ) ) {
			return;
		}

		// Check if Block_Dynamic_Style class exists, if not, try to load it.
		if ( ! class_exists( 'ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\Block_Dynamic_Style' ) ) {
			// Try to load the Block_Dynamic_Style file.
			$block_style_file = SP_EA_PATH . 'Blocks/Includes/Utils/Block_Dynamic_Style.php';
			if ( file_exists( $block_style_file ) ) {
				require_once $block_style_file;
			}

			// Check again after attempting to load.
			if ( ! class_exists( 'ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\Block_Dynamic_Style' ) ) {
				return;
			}
		}

		// Get template content if not provided.
		if ( empty( $content ) ) {
			$template_post = get_post( $template_id );
			if ( ! $template_post ) {
				return;
			}
			$content = $template_post->post_content;
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
		if ( ! $this->template_has_our_blocks( $blocks, $block_style ) ) {
			return;
		}

		// Mark this template as processed.
		$generated_templates[ $template_id ] = true;

		// Check if CSS file already exists.
		if ( $block_style->css_file_exists( $template_id ) ) {

			// Echo CSS link tag for Elementor editor.
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<link rel="stylesheet" href="' . esc_url( $block_style->css_url . 'sp-eab-style-' . $template_id . '.css?v=' . SP_EA_VERSION ) . '">'; // phpcs:ignore
			}

			$font_lists = get_post_meta( $template_id, 'sp_eab_dynamic_fonts', true );
		} else {
			// Generate CSS file for this template.
			$dynamic_assets = $block_style->generate_post_css_file( $template_id, get_post( $template_id ) );
			if ( false !== $dynamic_assets && is_array( $dynamic_assets ) ) {
				$font_lists   = $dynamic_assets[1] ?? array();
				$inline_style = $dynamic_assets[0] ?? '';

				// Add inline CSS using virtual style handle.
				if ( ! empty( $inline_style ) ) {
					// Echo inline style for Elementor editor.
					if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
						echo '<style id="eap-elementor-dynamic-css-' . esc_attr( $template_id ) . '">' . $inline_style . '</style>'; // phpcs:ignore WordPress.Security.EscapeOutput.OutputNotEscaped -- CSS output is already escaped in the meta.
					}
				}
			} else {
				$font_lists = array();
			}
		}

		// Enqueue Google Fonts.
		if ( ! empty( $font_lists ) && is_array( $font_lists ) ) {
			$font_lists = array_unique( $font_lists );

			// Echo Google Fonts link for Elementor editor.
			if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
				echo '<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=' . implode( '|', array_map( 'esc_url', $font_lists ) ) . '">'; // phpcs:ignore
			}
		}
	}

	/**
	 * Check if template contains our blocks.
	 *
	 * @since 4.1.0
	 * @access protected
	 *
	 * @param array  $blocks      Parsed blocks.
	 * @param object $block_style Block_Dynamic_Style instance.
	 *
	 * @return bool
	 */
	protected function template_has_our_blocks( $blocks, $block_style ) {
		foreach ( $blocks as $block ) {
			if ( ! empty( $block['blockName'] ) && in_array( $block['blockName'], $block_style->our_blocks, true ) ) {
				return true;
			}

			if ( ! empty( $block['innerBlocks'] ) && $this->template_has_our_blocks( $block['innerBlocks'], $block_style ) ) {
				return true;
			}
		}

		return false;
	}

	/**
	 * Render easy accordion saved template widget output on the frontend.
	 *
	 * @since 4.1.0
	 * @access protected
	 *
	 * @return void
	 */
	protected function render() {
		$settings        = $this->get_settings_for_display();
		$sp_eap_template = $settings['sp_eap_saved_template'];
		$template_id     = (int) $sp_eap_template;

		if ( empty( $template_id ) || 0 === $template_id ) {
			echo '<div style="
				text-align: center;
				padding: 20px;
				border: 2px dashed #ccc;
				color: #999;
				font-size: 14px;
			">
				' . esc_html__( 'Please Select a Saved Template', 'easy-accordion-free' ) . '
			</div>';
			return;
		}

		// Get template post.
		$template_post = get_post( $template_id );
		if ( ! $template_post || 'publish' !== $template_post->post_status ) {
			echo '<div style="
				text-align: center;
				padding: 20px;
				border: 2px dashed #ccc;
				color: #999;
				font-size: 14px;
			">
				' . esc_html__( 'Template not found or not published.', 'easy-accordion-free' ) . '
			</div>';
			return;
		}

		$content = $template_post->post_content;
		if ( empty( $content ) ) {
			echo '<div style="
				text-align: center;
				padding: 20px;
				border: 2px dashed #ccc;
				color: #999;
				font-size: 14px;
			">
				' . esc_html__( 'Template content is empty.', 'easy-accordion-free' ) . '
			</div>';
			return;
		}

		if ( \Elementor\Plugin::$instance->editor->is_edit_mode() ) {
			// In Elementor editor, use the same CSS generation as shortcode.
			$this->enqueue_template_dynamic_css( $template_id, $content );

			echo '<div class="eap-elementor-accordion-wrapper" data-builder-template-id="' . esc_attr( $template_id ) . '">';

			echo do_shortcode( '[sp_eap_template id="' . absint( $template_id ) . '"]' );

			echo '</div>';
		} else {
			// On frontend, just render the shortcode.
			echo do_shortcode( '[sp_eap_template id="' . absint( $template_id ) . '"]' );
		}
	}

	/**
	 * Get edit template and add new template buttons HTML.
	 *
	 * @since 4.2.0
	 *
	 * @return string Buttons HTML.
	 */
	protected function get_edit_template_button() {
		$template_url = admin_url( 'edit.php?post_type=sp_easy_accordion&page=eap_dashboard#saved_templates' );

		$new_template_url = admin_url( 'post-new.php?post_type=sp_eap_template&eabblock_inserter' );

		ob_start();
		?>

		<div class="sp-eap-elementor-template-buttons">
			<a class="sp-eap-edit-template-btn" href="<?php echo esc_url( $template_url ); ?>" style="color:#fff; background-color:#3e3e40; padding:12px 24px; border-radius:4px; display:inline-block; font-size: 14px" onmouseover="this.style.backgroundColor='#4b4b4d'" onmouseout="this.style.backgroundColor='#3e3e40'">
				<span style="display:inline-block; transform: rotate(70deg); margin-right: 4px">✎</span>
				<span><?php echo esc_html__( 'Edit This Template', 'easy-accordion-free' ); ?></span>
			</a>
			<a href="<?php echo esc_url( $new_template_url ); ?>" class="sp-eap-add-template-btn" style="color:#fff; background-color:#F26C0D; padding: 10px 23px; border-radius:4px; display:inline-block; margin-top: 15px; font-size: 14px" onmouseover="this.style.backgroundColor='#f27b26'" onmouseout="this.style.backgroundColor='#F26C0D'">
				<span style="display:inline-block; font-size: 18px; margin-right: 4px;">+</span>
				<span><?php echo esc_html__( 'Add New Template', 'easy-accordion-free' ); ?></span>
			</a>
		</div>
		<?php
		return ob_get_clean();
	}
}
