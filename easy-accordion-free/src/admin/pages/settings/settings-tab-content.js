import { __ } from "@wordpress/i18n";
import Toggle from "react-toggle";
import { useState } from "@wordpress/element";
import { CheckboxControl } from "@wordpress/components";
import { CodeEditor } from "@easy-accordion/components";
import { InfoText, UserDataInfoModal } from "./template-parts";
import { jsToPhpBool, phpToJsBool } from "../../functions";
import { pluginSettingOptions } from "../../constants";

export const AdvancedControls = ({ pluginSettings, updateSettingsOption }) => {
	// User data info modal.
	const [isOpenModal, setOpenModal] = useState(false);
	const closeModal = () => setOpenModal(false);

	return (
		<div className="sp-eap-dashboard-advanced-settings sp-d-flex sp-flex-col">
			{pluginSettingOptions?.map((option) => {
				const { option_name, label, infoText, inputType } = option;
				const optionValue = phpToJsBool(pluginSettings?.[option_name]);
				return (
					<div
						key={option_name}
						className="sp-eap-settings-option sp-d-flex sp-align-center sp-justify-between"
					>
						<span className="sp-eap-component-title sp-d-flex sp-align-center sp-gap-6px">
							{label}
							{infoText && <InfoText text={infoText} />}
						</span>
						{inputType === "toggle" && (
							<Toggle
								icons={false}
								key={optionValue}
								defaultChecked={optionValue}
								onChange={() => updateSettingsOption(option_name, jsToPhpBool(!optionValue))}
							/>
						)}
						{inputType === "checkbox" && (
							<CheckboxControl
								checked={optionValue}
								__nextHasNoMarginBottom
								onChange={() => updateSettingsOption(option_name, jsToPhpBool(!optionValue))}
							/>
						)}
					</div>
				);
			})}
			{isOpenModal && <UserDataInfoModal closeModal={closeModal} />}
		</div>
	);
};

export const CustomCssAndJs = ({ pluginSettings, updateSettingsOption }) => {
	return (
		<div className="sp-eap-settings-custom-assets sp-d-flex sp-flex-col">
			<CodeEditor
				label={__("Custom CSS", "easy-accordion-free")}
				attributes={pluginSettings?.ea_custom_css}
				onChange={(value) => updateSettingsOption("ea_custom_css", value)}
				height="200px"
			/>
			<CodeEditor
				label={__("Custom JS", "easy-accordion-free")}
				attributes={pluginSettings?.custom_js}
				onChange={(value) => updateSettingsOption("custom_js", value)}
				defaultLanguage="javascript"
				height="200px"
			/>
		</div>
	);
};
