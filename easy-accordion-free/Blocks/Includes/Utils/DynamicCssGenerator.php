<?php
/**
 * Dynamic Css Renderer File.
 *
 * @since 4.0.0
 * @version 1.0.0
 *
 * @package EasyAccordion/Blocks
 */

namespace ShapedPlugin\EasyAccordion\Blocks\Includes\Utils;

use ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\Css_Helpers;
use ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\SingleAccordionCss;
use ShapedPlugin\EasyAccordion\Blocks\Includes\Utils\AccordionSharedCss;

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	die;
}

/**
 * DynamicCssGenerator
 */
class DynamicCssGenerator {
	/**
	 * Attributes.
	 *
	 * @var array
	 */
	public $attributes = array();

	/**
	 * Method __construct
	 *
	 * @param array $attributes is block attributes.
	 *
	 * @return void
	 */
	public function __construct( $attributes ) {
		$this->attributes = $attributes;
	}

	/**
	 * Method eab_generate_dynamic_css
	 *
	 * @return array
	 */
	public function eab_generate_dynamic_css() {
		$block_name = $this->attributes['blockName'] ?? '';
		$css_object = array();
		$shared_css = new AccordionSharedCss( $this->attributes );

		switch ( $block_name ) {
			case 'accordion-item':
				$accordion_item_css = new SingleAccordionCss( $this->attributes );
				$css_object         = $accordion_item_css->eab_single_accordion_block_css();
				break;
			case 'vertical-accordion':
			case 'horizontal-accordion':
			case 'sidebar-tab-accordion':
				$css_object = $shared_css->accordion_block_shared_css();
				break;
			case 'image-accordion':
				$accordion_style = new ImageAccordionCss( $this->attributes );
				$css_object      = $accordion_style->eab_image_accordion_block_css();
				break;
			case 'post-accordion':
			case 'product-accordion':
				$accordion_style = new PostAccordionCss( $this->attributes );
				$css_object      = $accordion_style->eab_accordion_block_css();
				break;
			default:
				// code...
				break;
		}
		$css_str = Css_Helpers::filter_responsive_dynamic_css( $css_object );
		return $css_str;
	}
}
