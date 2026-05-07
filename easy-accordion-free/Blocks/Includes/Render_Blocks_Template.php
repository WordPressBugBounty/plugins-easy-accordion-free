<?php
/**
 * Block Name Template Renderer File.
 *
 * Description of what this template does.
 *
 * @since 4.0.0
 * @version 1.0.0
 *
 * @package EasyAccordionPro/Blocks
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes;

use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Helper;
use ShapedPlugin\EasyAccordion\Blocks\Includes\Blocks_Query;
use ShapedPlugin\EasyAccordion\Blocks\Includes\Template_parts;
use ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\DynamicCssGenerator;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * Render_Block_Templates
 */
class Render_Blocks_Template {
	/**
	 * Accordion_items_data.
	 *
	 * @var 4.0.0
	 */
	public static $accordion_items_data = array();

	/**
	 * Allowed_inline_tags.
	 *
	 * @var array
	 */
	public $title_allowed_inline_tags = array(
		'a'      => array(
			'href'   => true,
			'title'  => true,
			'target' => true,
			'rel'    => true,
		),
		'b'      => array(),
		'strong' => array(),
		'i'      => array(),
		'em'     => array(),
		'span'   => array(
			'class' => true,
			'style' => true,
		),
		'br'     => array(),
		'u'      => array(),
	);

	/**
	 * Method generate_inline_style.
	 *
	 * @param array $attributes is block attributes.
	 *
	 * @return void
	 */
	public function generate_inline_style( $attributes ) {
		$css_class   = new DynamicCssGenerator( $attributes );
		$dynamic_css = $css_class->eab_generate_dynamic_css();
		$block_name  = $attributes['blockName'] ?? '';
		$css_key     = $block_name . '_eab_dynamic_css';
		wp_register_style( $css_key, false );
		wp_enqueue_style( $css_key );
		wp_add_inline_style( $css_key, $dynamic_css );
	}

	/**
	 * Method accordion_header_renderer.
	 *
	 * @param array $attributes block attributes.
	 *
	 * @return string
	 */
	public function accordion_header_renderer( $attributes ) {
		$unique_id           = $attributes['uniqueId'] ?? '';
		$parent_id           = $attributes['parentId'] ?? '';
		$template            = $attributes['template'] ?? 'vertical-one';
		$parent_block_name   = $attributes['parentBlockName'] ?? 'vertical-accordion';
		$accordion_title_tag = $attributes['accordionTitleTag'] ?? 'h3';
		$accordion_title     = $attributes['accordionTitle'] ?? 'No Title';
		$title_alignment     = $attributes['titleAlignment'] ?? 'start';
		$enable_toggle_icon  = $attributes['enableExpandAndCollapseIcon'] ?? true;
		$toggle_icons_set    = $attributes['toggleIconsSet'] ?? array();
		$icon_position       = $attributes['toggleIconPosition'] ?? 'end';

		$toggle_rotate_sets = in_array( $toggle_icons_set['set'], array( 1, 4, 5, 6, 9, 10, 12 ), true );

		ob_start();
		?>
			<<?php echo esc_attr( $accordion_title_tag ); ?> class='<?php echo esc_attr( "sp-eab-accordion-heading sp-d-flex sp-align-center eab-heading-$parent_id" ); ?>'
			<?php
			if ( 'sidebar-tab-accordion' === $parent_block_name ) {
				echo 'data-tabid="' . esc_attr( $unique_id ) . '"';
			}
			?>
			>
				<span class='sp-eab-accordion-header-wrapper sp-d-flex sp-align-center eab-icon-position-<?php echo esc_attr( $icon_position ); ?>'>
					<span class='sp-eab-accordion-header-start sp-d-flex sp-justify-<?php echo esc_attr( $title_alignment ); ?> sp-align-center'>
						<span class='sp-eab-title-subtitle-wrapper sp-d-flex'>
							<span class='sp-eab-accordion-title-wrapper sp-d-flex sp-align-center'>
								<span class='sp-eab-accordion-title-text'>
									<?php echo wp_kses( $accordion_title, $this->title_allowed_inline_tags ); ?>
								</span>
							</span>
						</span>
					</span>
					<span class='sp-eab-accordion-header-end <?php echo $toggle_rotate_sets ? 'eab-icon-animated' : 'eab-icon-static'; ?>'>
						<?php if ( $enable_toggle_icon ) : ?>
						<span class='sp-eab-expand-collapse-icon sp-d-block'>
							<i class='sp-eab-expand-icon <?php echo esc_attr( $toggle_icons_set['expand'] ); ?>'></i>
							<i class='sp-eab-collapse-icon <?php echo esc_attr( $toggle_icons_set['collapse'] ); ?>'></i>
						</span>
						<?php endif; ?>
					</span>
				</span>
			</<?php echo esc_attr( $accordion_title_tag ); ?>>
		<?php
		return ob_get_clean();
	}

	/**
	 * Method render_accordion_item_block
	 *
	 * @param array  $attributes block attributes.
	 * @param string $content block content.
	 *
	 * @return string
	 */
	public function render_accordion_item_block( $attributes, $content ) {
		$disable_item = $attributes['disableItem'] ?? false;
		// if item is disable then return.
		if ( $disable_item ) {
			return;
		}
		$unique_id         = $attributes['uniqueId'] ?? '';
		$parent_id         = $attributes['parentId'] ?? '';
		$template          = $attributes['template'] ?? 'vertical-one';
		$default_open      = $attributes['defaultOpen'] ?? true;
		$custom_class_name = $attributes['customClassName'] ?? '';
		// --- Add to schema array if enabled
		$accordion_title      = $attributes['accordionTitle'] ?? 'No Title';
		$enable_schema_markup = $attributes['schemaMarkup'] ?? false;
		if ( $enable_schema_markup ) {
			$schema_content = preg_replace( '/<!--\/?wp:.*?-->/', '', $content );
			// Remove all tags except <p>.
			$schema_content = strip_tags( $schema_content, '<p>' );
			// Normalize whitespace.
			$schema_content = trim( preg_replace( '/\s+/', ' ', $schema_content ) );

			self::$accordion_items_data[] = array(
				'title'       => $accordion_title ?? '',
				'description' => $schema_content ?? '',
			);
		}
		// template based dynamic class.
		$wrapper_class = "sp-eab-accordion-item eab-item-$parent_id" . ( $custom_class_name ? " $custom_class_name" : '' );

		ob_start();
		?>
			<div
				id ="<?php echo esc_attr( $unique_id ); ?>"
				class="<?php echo esc_attr( $wrapper_class ); ?>"
				<?php
				// default open data attr.
				if ( $default_open ) {
					echo 'data-default-open="' . esc_attr( $default_open ) . '"';
				}
				?>
			>
				<div class="sp-eab-accordion-item-wrapper">
					<?php
						// Safe to output: all necessary sanitization/escaping is handled inside accordion_header_renderer().
			           echo $this->accordion_header_renderer( $attributes ); // phpcs:ignore
					?>
					<!-- accordion body -->
					<div class='sp-eab-accordion-content eab-content-<?php echo esc_attr( $parent_id ); ?>'>
						<?php
						$accordion_content = Blocks_Helper::sp_eab_strip_script_tags( $content ); //phpcs:ignore
						if ( $accordion_content ) :
							?>
						<div class='sp-eab-accordion-content-wrapper'>
							<div class='sp-eab-accordion-body'>
			    				<?php echo $accordion_content; //phpcs:ignore ?>
							</div>
						</div>
						<?php endif; ?>
					</div>
				</div>
			</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Method render_regular_accordion_block.
	 *
	 * @since 4.0.0
	 *
	 * @param string $attributes attributes.
	 * @param string $content block content.
	 * @return string Block content.
	 */
	public function render_regular_accordion_block( $attributes, $content ) {
		// block attr.
		$block_name               = $attributes['blockName'] ?? 'vertical-accordion';
		$template                 = $attributes['template'] ?? 'vertical-one';
		$unique_id                = $attributes['uniqueId'];
		$align                    = $attributes['align'] ?? 'wide';
		$custom_class_name        = $attributes['customClassName'] ?? '';
		$custom_id_name           = $attributes['customIdName'] ?? '';
		$active_event             = $attributes['activeEvent'] ?? 'click';
		$default_accordion_open   = $attributes['defaultAccordionOpen'] ?? 'first-item';
		$open_selected_item       = $attributes['openSelectedItem'] ?? 1;
		$open_multi_item_ata_time = $attributes['openMultiItemAtaTime'] ?? false;
		$enable_schema_markup     = $attributes['schemaMarkup'] ?? false;
		$scroll_to_top_on_load    = $attributes['scrollToActiveItem'] ?? false;
		$content_animation        = $attributes['contentAnimationEffect'] ?? 'none';
		$preloader                = $attributes['preloader'] ?? false;
		$eab_accessibility        = $attributes['eabAccessibility'] ?? true;
		$background               = $attributes['eabBackground'] ?? array();
		// convert horizontal to vertical on mobile device.
		$vertical_view_in_mobile = $attributes['verticalViewInMobile'] ?? true;
		$is_forced_vertical_view = 'horizontal-accordion' === $block_name && $vertical_view_in_mobile && wp_is_mobile();
		if ( $is_forced_vertical_view ) {
			$block_name = 'vertical-accordion';
			$template   = 'vertical-one';
		}
		// content animation.
		$animation_effect = 'none' === $content_animation ? false : $content_animation;
		$accordion_mode   = 'vertical-accordion' === $block_name ? 'vertical' : 'horizontal';
		// entrance animations.

		$accordion_data = array(
			'mode'                 => $accordion_mode,
			'activeEvent'          => $active_event,
			'defaultAccordionOpen' => $default_accordion_open,
			'selectedItemOpen'     => (int) ( $open_selected_item - 1 ),
			'openMultiItemAtaTime' => $open_multi_item_ata_time,
			'scrollToTopOnLoad'    => $scroll_to_top_on_load,
			'scrollToTopOnClick'   => false,
			'accordionItemToUrl'   => false,
			'animationEffect'      => $animation_effect,
			'applyAccessibility'   => $eab_accessibility,
		);

		ob_start();
		?>
		<div class="sp-easy-accordion-block sp-eab-regular-accordion align<?php echo esc_attr( $align . ( $custom_class_name ? " $custom_class_name" : '' ) . ( $is_forced_vertical_view ? ' eab-vertical-on-horizontal-layout' : '' ) ); ?>"
		<?php
		if ( $custom_id_name ) {
			echo 'id="' . esc_attr( $custom_id_name ) . '"';
		}
		?>
		>
			<div class="sp-eab-wrapper sp-eab-<?php echo esc_attr( $block_name . ' ' . $unique_id ); ?>">
				<?php
				echo $this->preloader_html( $preloader, $unique_id );//phpcs:ignore
				echo self::eab_video_player_bg( $background ); //phpcs:ignore
				?>
				<div class='sp-eab-accordion sp-eab-mode-<?php echo esc_attr( $accordion_mode ); ?> sp-eab-<?php echo esc_attr( $template ); ?> sp-d-flex' data-accordion-settings="<?php echo esc_attr( wp_json_encode( $accordion_data ) ); ?>">
        	    	<?php echo $content; //phpcs:ignore ?>
				</div>
			</div>
		</div>
		<?php
		if ( $enable_schema_markup ) {
			$schema_data = self::$accordion_items_data;
			Blocks_Helper::eab_schema( $unique_id, $schema_data );
		}
		return ob_get_clean();
	}

	/**
	 * Method render_image_accordion_item_block.
	 *
	 * @since 4.0.0
	 *
	 * @param string $attributes attributes.
	 * @param string $content block content.
	 * @return string Block content.
	 */
	public function render_image_accordion_item_block( $attributes, $content ) {
		// --- Extract single item attributes.
		$single_img_data  = $attributes['singleImgData'] ?? array();
		$single_img_title = $attributes['singleImgTitle'] ?? '';
		$single_img_desc  = $attributes['singleImgDesc'] ?? '';
		$unique_id        = $attributes['uniqueId'] ?? '';
		$custom_class     = $attributes['customClassName'] ?? '';
		// --- Extract parent settings
		$parent_settings      = $attributes['parentSettings'] ?? array();
		$content_alignment    = $parent_settings['contentAlignment'] ?? 'center';
		$template             = $parent_settings['template'] ?? '';
		$accordion_tag        = $parent_settings['accordionTitleTag'] ?? 'h3';
		$show_title           = ! empty( $parent_settings['showTitle'] );
		$show_desc            = ! empty( $parent_settings['showDescription'] );
		$active_event         = $parent_settings['activeEvent'] ?? 'click';
		$img_hover_gray_scale = ! empty( $parent_settings['imgHoverGrayScale'] ) && 'click' === $active_event ?? false;

		// --- Image data
		$image_url = $single_img_data['url'] ?? '';
		$image_alt = $single_img_data['alt'] ?? '';
		// --- Background image CSS vars
		$css_vars             = array();
		$css_vars['--bg-url'] = 'url(' . esc_url( $image_url ) . ')';

		$bg_style = '';
		foreach ( $css_vars as $var => $value ) {
			$bg_style .= sprintf( '%s:%s;', esc_attr( $var ), esc_attr( $value ) );
		}

		// --- Add to schema array if enabled
		$schema_markup = $parent_settings['schemaMarkup'] ?? false;
		if ( $schema_markup ) {
			self::$accordion_items_data[] = array(
				'title'       => $single_img_title ?? 'No Title',
				'description' => $single_img_desc ?? '',
			);
		}

		// Target attribute.
		$image_effects = $parent_settings['imageEffects'] ?? '';

		// Determine if we need to render the overlay.
		$show_overlay         = $show_title || $show_desc;
		$show_overlay_content = ( $show_title && $single_img_title ) || ( $show_desc && $single_img_desc );

		// Classes for overlay wrapper.
		$overlay_classes = array(
			'sp-eab-overlay',
			"eab-content-alignment-{$content_alignment}",
		);

		// Classes for content wrapper.
		$content_wrapper_classes = array(
			'eab-img-content-wrapper',
			'sp-d-flex',
			'sp-align-center',
			'sp-flex-col',
			'eab-animation',
		);

		ob_start();
		?>
		<div class="sp-eab-image-accordion-item <?php echo esc_attr( $unique_id . ( $custom_class ? " $custom_class" : '' ) ); ?>" data-image-effect="<?php echo esc_attr( $image_effects ); ?>" data-hover-gray-scale="<?php echo esc_attr( $img_hover_gray_scale ); ?>">
			<div class="sp-eab-accordion-bg sp-d-flex sp-align-center sp-justify-center" role="img"
				aria-label="<?php echo esc_attr( $image_alt ); ?>" style="<?php echo esc_attr( $bg_style ); ?>">

				<?php if ( $show_overlay ) : ?>
				<div class="<?php echo esc_attr( implode( ' ', $overlay_classes ) ); ?>">
					<?php if ( $show_overlay_content ) : ?>
					<div class="<?php echo esc_attr( implode( ' ', $content_wrapper_classes ) ); ?>">
						<?php if ( $show_title || $show_desc ) : ?>
						<div class="eab-content-section">

							<?php if ( $show_title && $single_img_title && 'accordion-slider-two' !== $template ) : ?>
								<<?php echo tag_escape( $accordion_tag ); ?> class="sp-eab-image-title">
										<?php echo wp_kses( $single_img_title, $this->title_allowed_inline_tags ); ?>
								</<?php echo tag_escape( $accordion_tag ); ?>>
							<?php endif; ?>

							<?php if ( $show_desc && $single_img_desc ) : ?>
								<p class="sp-eab-image-desc"><?php echo wp_kses( $single_img_desc, $this->title_allowed_inline_tags ); ?></p>
							<?php endif; ?>
						</div>
						<?php endif; ?>
					</div>
					<?php endif; ?>
				</div>
				<?php endif; ?>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Method render_image_accordion_block.
	 *
	 * @since 4.0.0
	 *
	 * @param string $attributes attributes.
	 * @param string $content block content.
	 * @return string Block content.
	 */
	public function render_image_accordion_block( $attributes, $content ) {
		// Extract main block attributes with defaults.
		$block_name               = $attributes['blockName'] ?? 'image-accordion';
		$template                 = $attributes['template'] ?? 'image-accordion-one';
		$unique_id                = $attributes['uniqueId'] ?? '';
		$custom_class             = $attributes['customClassName'] ?? '';
		$default_accordion_open   = $attributes['defaultAccordionOpen'] ?? 'first-item';
		$active_event             = $attributes['activeEvent'] ?? 'click';
		$selected_accordion_open  = $attributes['openSelectedItem'] ?? '';
		$template_orientation     = 'vertical';
		$schema_markup            = $attributes['schemaMarkup'] ?? false;
		$scroll_to_active_item    = $attributes['scrollToActiveItem'] ?? false;
		$content_animation_effect = $attributes['contentAnimationEffect'] ?? 'none';
		$preloader                = $attributes['preloader'] ?? false;
		$accordion_autoplay_delay = $attributes['accordionAutoplayDelayTime']['value'] ?? 4000;

		// Slider & navigation attributes.
		$eab_accessibility = $attributes['eabAccessibility'] ?? false;
		$image_effects     = $attributes['imageEffects'] ?? 'none';
		$align             = $attributes['align'] ?? 'wide';
		$custom_id_name    = $attributes['customIdName'] ?? '';
		$background        = $attributes['eabBackground'] ?? array();
		// Begin output.
		ob_start();
		?>

	<div class="sp-eab-image-accordion-wrapper sp-d-flex sp-justify-center align<?php echo esc_attr( $align ); ?>" <?php echo $custom_id_name ? 'id="' . esc_attr( $custom_id_name ) . '"' : ''; ?>>
		<div class="sp-easy-accordion-block sp-eab-<?php echo esc_attr( "{$block_name} {$unique_id} eab-{$template}" ); ?><?php echo esc_attr( $custom_class ? ' ' . $custom_class : '' ); ?>"
			data-default-open="<?php echo esc_attr( $default_accordion_open ); ?>"
			data-active-event="<?php echo esc_attr( $active_event ); ?>"
			data-autoplay-delay="<?php echo esc_attr( $accordion_autoplay_delay ); ?>"
			data-selected-accordion="<?php echo esc_attr( $selected_accordion_open ); ?>"
			data-scroll-to-active-item="<?php echo esc_attr( $scroll_to_active_item ); ?>"
			data-animation="<?php echo esc_attr( $content_animation_effect ); ?>"
			data-eab-accessibility="<?php echo esc_attr( $eab_accessibility ); ?>">
			<?php
			echo $this->preloader_html( $preloader, $unique_id );//phpcs:ignore
			echo self::eab_video_player_bg( $background ); //phpcs:ignore
			?>
			<div class="sp-eab-image-accordion-container">

				<?php if ( 'image-accordion' === $block_name ) : ?>
					<div class="sp-eab-image-accordion-items sp-d-flex eab-accordion-orientation-<?php echo esc_attr( $template_orientation ); ?> <?php echo 'vertical' === $template_orientation ? 'sp-flex-col' : ''; ?> <?php echo 'none' !== $image_effects ? 'eab-image-effect' : ''; ?>">
						<?php echo $content; // phpcs:ignore ?>
					</div>
				<?php endif; ?>
			</div>
		</div>
	</div>

		<?php
		// Include schema markup if enabled.
		if ( $schema_markup ) {
			$schema_data = self::$accordion_items_data;
			Blocks_Helper::eab_schema( $unique_id, $schema_data );
		}

		return ob_get_clean();
	}

	/**
	 * Render_post_accordion_block
	 *
	 * @param  mixed $attributes blooks attr.
	 * @param  mixed $content content.
	 * @param  mixed $blocks blocks.
	 * @return statement
	 */
	public function render_post_accordion_block( $attributes, $content = '', $blocks = array() ) {
		// Extract main block attributes with defaults.
		$block_name     = $attributes['blockName'] ?? 'post-accordion';
		$unique_id      = $attributes['uniqueId'] ?? '';
		$template       = $attributes['template'] ?? 'post-accordion-one';
		$custom_class   = $attributes['customClassName'] ?? '';
		$align          = $attributes['align'] ?? 'wide';
		$custom_id_name = $attributes['customIdName'] ?? '';
		$post_type      = $attributes['postType'] ?? 'post';

		if ( 'product-accordion' === $block_name &&
			! class_exists( 'WooCommerce' ) ) {
				return;
		}

		$query_attr = ( ! empty( $attributes['postQuery'] ) && isset( $attributes['postQuery'] ) ) ? (array) json_decode( $attributes['postQuery'] ) : $attributes;
		$post_query = Blocks_Query::get_cached_post_query_result( $query_attr, $unique_id, $unique_id );
		$post_query = $post_query[0];

		$active_event             = $attributes['activeEvent'] ?? 'click';
		$default_accordion_open   = $attributes['defaultAccordionOpen'] ?? 'first-item';
		$open_multi_item_ata_time = $attributes['openMultiItemAtaTime'] ?? false;
		$scroll_to_top_on_load    = $attributes['scrollToActiveItem'] ?? false;
		$content_animation        = $attributes['animationEffect'] ?? 'none';
		$preloader                = $attributes['preloader'] ?? false;

		$eab_accessibility = $attributes['eabAccessibility'] ?? false;
		$image_effects     = $attributes['imageEffects'] ?? 'none';

		// content animation.
		$animation_effect = 'none' === $content_animation ? false : $content_animation;
		$accordion_mode   = 'vertical';
		// entrance and scrolling animations.
		$schema_markup = $attributes['schemaMarkup'] ?? false;

		$accordion_data = array(
			'mode'                 => $accordion_mode,
			'activeEvent'          => $active_event,
			'defaultAccordionOpen' => $default_accordion_open,
			'openMultiItemAtaTime' => $open_multi_item_ata_time,
			'scrollToTopOnLoad'    => $scroll_to_top_on_load,
			'scrollToTopOnClick'   => false,
			'accordionItemToUrl'   => false,
			'animationEffect'      => $animation_effect,
		);

		ob_start();
		?>
		<div class="sp-easy-accordion-block <?php echo 'sp-eab-' . esc_attr( $block_name ) . ' ' . esc_attr( $unique_id ); ?> align<?php echo esc_attr( $align . ( $custom_class ? ' ' . $custom_class : '' ) ); ?>"
		<?php
		if ( $custom_id_name ) {
			echo 'id="' . esc_attr( $custom_id_name ) . '"';
		}
		?>
		data-eab-accessibility="<?php echo esc_attr( $eab_accessibility ); ?>"
		>
		<div class="sp-eab-wrapper <?php echo esc_attr( $unique_id ); ?> ">
			<?php
			echo $this->preloader_html( $preloader, $unique_id );//phpcs:ignore
			?>
			<div class="sp-eab-accordion sp-d-flex sp-eab-mode-<?php echo esc_attr( $accordion_mode ); ?> sp-eab-<?php echo esc_attr( $template ); ?>" data-accordion-settings="<?php echo esc_attr( wp_json_encode( $accordion_data ) ); ?>"
			>
				<?php
					self::render_non_list_accordion_content(
						array(
							'post_query' => $post_query,
							'attributes' => $attributes,
						)
					);
				?>
			</div>
		</div>
		</div>
		<?php
		// Include schema markup if enabled.
		if ( $schema_markup && ! empty( $post_query ) && is_array( $post_query ) ) {
			// Reset static data to avoid duplication.
			self::$accordion_items_data = array();

			foreach ( $post_query as $post ) {
				if ( empty( $post['title'] ) || empty( $post['content'] ) ) {
					continue;
				}
				self::$accordion_items_data[] = array(
					'title'       => wp_strip_all_tags( $post['title'] ),
					'description' => wp_strip_all_tags( $post['content'] ),
				);
			}
			// Only output schema if we have valid items.
			if ( ! empty( self::$accordion_items_data ) ) {
				Blocks_Helper::eab_schema(
					$unique_id,
					self::$accordion_items_data
				);
			}
		}
		return ob_get_clean();
	}

	/**
	 * Render accordion content when taxonomy list is disabled.
	 *
	 * @param array $args Render arguments.
	 */
	public static function render_non_list_accordion_content( array $args ) {
		$post_query = $args['post_query'] ?? array();
		$attributes = $args['attributes'] ?? array();
		// Default post accordion output.
		foreach ( $post_query as $data ) :
			echo Template_parts::post_single_item( $data, $attributes );// phpcs:ignore
		endforeach;
	}

	/**
	 * Preloader_html
	 *
	 * @param  mixed $preloader preloader.
	 * @param  mixed $unique_id unique id.
	 * @return statement
	 */
	private function preloader_html( $preloader, $unique_id ) {
		if ( ! $preloader ) {
			return '';
		}
		ob_start();
		?>
		<div class="sp-eab-preloader" data-preloader="<?php echo esc_attr( $unique_id ); ?>">
			<div class="eab-spinner"></div>
		</div>
		<?php
		return ob_get_clean();
	}

	/**
	 * Method eab_video_player_bg.
	 *
	 * @param array $background is background attributes.
	 * @return mixed
	 */
	public static function eab_video_player_bg( $background ) {
		$background_type = $background['style'] ?? 'solid';
		$wp_media        = $background['video']['html5'] ?? '';

		if ( 'video' !== $background_type ) {
			return '';
		}

		ob_start()
		?>
		<div class="sp-eab-video-player sp-w-full">
			<video autoplay muted loop>
				<source src="<?php echo esc_url( $wp_media['url'] ?? '' ); ?>" type="video/mp4" />
			</video>
		</div>
		<?php
		return ob_get_clean();
	}
	/**
	 * Method eab_sidebar_tab_accordion_block_renderer
	 *
	 * @param array  $attributes block attributes.
	 * @param string $content block content.
	 * @param object $block child block.
	 *
	 * @return string
	 */
	public function eab_sidebar_tab_accordion_block_renderer( $attributes, $content, $block ) {
		// block attr.
		if ( empty( $block->inner_blocks ) ) {
			return '';
		}
		$tabs = $block->inner_blocks;
		// attributes.
		$unique_id              = $attributes['uniqueId'] ?? '';
		$template               = $attributes['template'] ?? 'sidebar-tab-one';
		$align                  = $attributes['align'] ?? 'wide';
		$active_event           = $attributes['activeEvent'] ?? 'click';
		$default_accordion_open = $attributes['defaultAccordionOpen'] ?? 'first-item';
		$open_selected_item     = $attributes['openSelectedItem'] ?? 1;
		$content_height         = $attributes['contentHeight'] ?? 'auto';
		$background             = $attributes['eabBackground'] ?? array();
		$preloader              = $attributes['preloader'] ?? false;
		// tabs attr data.
		$data_tab_accordion = array(
			'activeEvent'        => $active_event,
			'defaultOpenItem'    => $default_accordion_open,
			'selectedItemOpen'   => (int) $open_selected_item,
			'scrollToTopOnLoad'  => true,
			'accordionItemToUrl' => true,
			'contentHeight'      => $content_height,
			'template'           => $template,
		);

		ob_start();
		?>
		<div class="sp-easy-accordion-block sp-eab-tabs-accordion align<?php echo esc_attr( $align ); ?>">
			<div class="sp-eab-wrapper sp-eab-sidebar-tab-accordion <?php echo esc_attr( $unique_id ); ?>">
				<?php
				   echo $this->preloader_html( $preloader, $unique_id ); //phpcs:ignore
				   echo self::eab_video_player_bg( $background ); //phpcs:ignore
				?>
				<div class="sp-eab-sidebar-tabs sp-eab-<?php echo esc_attr( $template ); ?> sp-d-flex" data-tab-settings="<?php echo esc_attr( wp_json_encode( $data_tab_accordion ) ); ?>">
					<!-- LEFT: TAB TITLES -->
					<div class="sp-eab-sidebar-tabs-nav-wrapper">
						<div class="sp-eab-sidebar-tabs-nav sp-d-flex sp-flex-col">
							<?php
							foreach ( $tabs as $tab ) {
							   echo $this->accordion_header_renderer( $tab->attributes ); // phpcs:ignore
							}
							?>
						</div>
					</div>
					<!-- RIGHT: TAB CONTENT -->
					<div class="sp-eab-sidebar-tabs-content sp-d-flex">
						<?php
						foreach ( $tabs as $tab ) {
							echo $tab->render(); // phpcs:ignore
						}
						?>
					</div>
				</div>
			</div>
		</div>
		<?php
		return ob_get_clean();
	}
}
