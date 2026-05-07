import { __ } from "@wordpress/i18n";
import { PanelBody } from "@wordpress/components";
import { MainStyleTab } from "./styleTab";
import { InputControl, SpProNotice } from "@easy-accordion/components";
import { useTogglePanelBody } from "../../context";

const Inspector = ({ attributes, setAttributes }) => {
	const { customClassName, customIdName } = attributes;
	const { togglePanelBody, openedPanelBody, activeTab, toggleActiveTab } = useTogglePanelBody();

	return (
		<>
			<PanelBody
				title={__("General", "easy-accordion-free")}
				opened={openedPanelBody === "defaultOpen"}
				onToggle={() => togglePanelBody("defaultOpen")}
				initialOpen={true}
			>
				<MainStyleTab attributes={attributes} setAttributes={setAttributes} />
			</PanelBody>
			<PanelBody
				title={__("Title Prefix & Suffix", "easy-accordion-free")}
				opened={openedPanelBody === "prefixAndSuffix"}
				onToggle={() => togglePanelBody("prefixAndSuffix")}
				className="sp-panel-pro"
			>
				<SpProNotice
					subtitle={__("Unlock powerful prefix & suffix customization controls", "easy-accordion-free")}
					features={[
						"Title Prefix & Suffix Label",
						"Badges for Accordion Item",
						"Prefix & Suffix Typography",
						"Color, Background, Padding and More...",
					]}
					linkButton={true}
				/>
			</PanelBody>
			<PanelBody
				title={__("Title Featured Icon", "easy-accordion-free")}
				opened={openedPanelBody === "feature-icon"}
				onToggle={() => togglePanelBody("feature-icon")}
				className="sp-panel-pro"
			>
				<SpProNotice
					subtitle={__("Unlock title styling with icon library & upload custom icons", "easy-accordion-free")}
					features={[
						"Featured Icon Library",
						"Upload Custom Featured Icon",
						"Customize Color, Background, Border",
						"Stylize for Normal, Hover & Active State",
					]}
					linkButton={true}
				/>
			</PanelBody>
			<PanelBody
				title={__("Title Link", "easy-accordion-free")}
				opened={openedPanelBody === "title-link"}
				onToggle={() => togglePanelBody("title-link")}
				className="sp-panel-pro"
			>
				<SpProNotice
					subtitle={__("Unlock custom linking for your FAQs", "easy-accordion-free")}
					features={[
						"Title Custom Linking",
						"Link Types (Icon, Title Text & Item)",
						"Customize Icon Size & Color",
						"Stylize for Normal, Hover & Active State",
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
				<InputControl
					label={__("Custom CSS ID", "easy-accordion-free")}
					placeholder={__("Custom ID", "easy-accordion-free")}
					inputType="text"
					attributes={customIdName}
					attributesKey={"customIdName"}
					setAttributes={setAttributes}
				/>
			</PanelBody>
			<SpProNotice
				title={__("Design Without Limits", "easy-accordion-free")}
				subtitle={__("Unlock custom linking for your FAQs", "easy-accordion-free")}
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
