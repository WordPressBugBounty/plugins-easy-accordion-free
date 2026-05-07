import { __ } from "@wordpress/i18n";
import { PanelBody } from "@wordpress/components";
import { SingleImageGeneralTab } from "../shared/generalTabs";
import { InputControl, SpProNotice } from "@easy-accordion/components";
import { useTogglePanelBody } from "../../context";

const Inspector = ({ attributes, setAttributes }) => {
	const { customClassName } = attributes;
	const { togglePanelBody, openedPanelBody } = useTogglePanelBody();
	const checkOpenedPanelBody = (accordionName) => {
		return openedPanelBody === accordionName ? true : false;
	};

	return (
		<>
			<PanelBody
				title={__("Accordion Item", "easy-accordion-free")}
				opened={checkOpenedPanelBody("defaultOpen")}
				onToggle={() => togglePanelBody("defaultOpen")}
			>
				{checkOpenedPanelBody("defaultOpen") && (
					<SingleImageGeneralTab attributes={attributes} setAttributes={setAttributes} />
				)}
			</PanelBody>
			<PanelBody
				title={__("Icon", "easy-accordion-free")}
				opened={checkOpenedPanelBody("ea-single-item-icon")}
				onToggle={() => togglePanelBody("ea-single-item-icon")}
				className="sp-panel-pro"
			>
				<SpProNotice
					subtitle={__("Unlock Advanced Lightbox Options for Image Accordions", "easy-accordion-free")}
					features={[
						"Add Icon from Library",
						"Upload Custom Icon",
						"Stylize Icon Color, Border & Background",
					]}
					linkButton={true}
				/>
			</PanelBody>
			<PanelBody
				title={__("Advanced", "easy-accordion-free")}
				opened={openedPanelBody === "advanced"}
				onToggle={() => togglePanelBody("advanced")}
			>
				<InputControl
					label={__("Custom CSS Class", "easy-accordion-free")}
					placeholder={__("Custom Class", "easy-accordion-free")}
					inputType="text"
					attributes={customClassName}
					attributesKey={"customClassName"}
					setAttributes={setAttributes}
				/>
			</PanelBody>
			<SpProNotice
				title={__("Design Without Limits", "easy-accordion-free")}
				message={__(
					"Give your design a boost with premium templates & advanced features.",
					"easy-accordion-free"
				)}
				panelNotice={true}
				className="sp-inspector-pro-notice"
			/>
		</>
	);
};

export default Inspector;
