import { __ } from "@wordpress/i18n";
import Toggle from "react-toggle";
import { useState, useEffect } from "@wordpress/element";
import { CheckboxControl } from "@wordpress/components";
import Select from "react-select";
import { CodeEditor, SelectField } from "@easy-accordion/components";
import { InfoText, UserDataInfoModal } from "./template-parts";
import { jsToPhpBool, phpToJsBool } from "../../functions";
import { pluginSettingOptions } from "../../constants";

export const AdvancedControls = ({ pluginSettings, updateSettingsOption, editorPreference, setEditorPreference }) => {
	// User data info modal.
	const [isOpenModal, setOpenModal] = useState(false);
	const closeModal = () => setOpenModal(false);

	return (
		<div className="sp-eap-dashboard-advanced-settings sp-d-flex sp-flex-col">
			{pluginSettingOptions?.map((option) => {
				const { option_name, label, infoText, inputType, items } = option;
				const optionValue = phpToJsBool(pluginSettings?.[option_name]);
				return (
					<div
						key={option_name}
						className="sp-eap-settings-option sp-d-flex sp-align-center sp-justify-between"
					>
						<div className="sp-eap-option-label-wrapper sp-d-flex sp-flex-col">
							<span className="sp-eap-component-title">{label}</span>
							{infoText && <span className="sp-eap-option-help-text">{infoText}</span>}
						</div>
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
						{inputType === "select" && (
							<SelectField
								value={option_name === "eap_editor_preference" ? editorPreference : (pluginSettings?.[option_name] || "")}
							onChange={(val) => {
									if (option_name === "eap_editor_preference") {
										setEditorPreference(val);
									}
									updateSettingsOption(option_name, val);
								}}
								items={items}
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

export const Tools = () => {
	const [exportType, setExportType] = useState("all-faqs");
	const [selectedFile, setSelectedFile] = useState(null);
	const [fileName, setFileName] = useState(__("No File Chosen", "easy-accordion-free"));
	const [shortcodeList, setShortcodeList] = useState([]);
	const [selectedShortcodes, setSelectedShortcodes] = useState([]);
	const [isImporting, setIsImporting] = useState(false);
	const [allowUnsanitized, setAllowUnsanitized] = useState(false);
	const [isDragging, setIsDragging] = useState(false);

	// Fetch shortcode list using AJAX
	useEffect(() => {
		const formData = new FormData();
		formData.append("action", "eap_get_shortcode_list_for_export");
		formData.append("nonce", sp_eab_admin_dashboard_localize?.nonce);

		fetch(ajaxurl, {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.then((data) => {
				if (data.success && Array.isArray(data.data)) {
					const list = data.data.map((post) => ({
						label: post.title || `#${post.id}`,
						value: post.id,
					}));
					setShortcodeList(list);
				} else {
					setShortcodeList([]);
				}
			})
			.catch((error) => {
				console.error("Error fetching shortcode list:", error);
				setShortcodeList([]);
			});
	}, []);

	const handleFileChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			setSelectedFile(file);
			setFileName(file.name);
		}
	};

	const handleDragOver = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(true);
	};

	const handleDragLeave = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
	};

	const handleDrop = (e) => {
		e.preventDefault();
		e.stopPropagation();
		setIsDragging(false);
		const file = e.dataTransfer.files[0];
		if (file && file.name.endsWith('.json')) {
			setSelectedFile(file);
			setFileName(file.name);
		}
	};

	const handleExport = () => {
		// Export functionality
		const exportValue = exportType === "all-faqs" ? "all_faqs" : exportType === "all-shortcodes" ? "all_shortcodes" : "selected_shortcodes";
		const selectedShortcode = exportValue === "selected_shortcodes" ? selectedShortcodes.join(",") : exportValue;

		if (
			exportValue === "all_faqs" ||
			exportValue === "all_shortcodes" ||
			(exportValue === "selected_shortcodes" && selectedShortcodes.length > 0)
		) {
			const formData = new FormData();
			formData.append("action", "eap_export_accordions");
			formData.append("nonce", sp_eab_admin_dashboard_localize?.nonce);
			formData.append("eap_ids", selectedShortcode);

			fetch(ajaxurl, {
				method: "POST",
				body: formData,
			})
				.then((response) => response.text())
				.then((resp) => {
					if (resp) {
						// Convert JSON Array to string.
						let json;
						try {
							const parsed = JSON.parse(resp);
							json = JSON.stringify(parsed);
						} catch {
							json = JSON.stringify(resp);
						}

						// Convert JSON string to BLOB.
						const blob = new Blob([json], { type: "application/json" });
						const link = document.createElement("a");
						const timestamp = Date.now();
						link.href = window.URL.createObjectURL(blob);
						link.download = "easy-accordion-" + timestamp + ".json";
						link.click();
					}
				});
		}
	};

	const handleImport = () => {
		// Import functionality
		if (selectedFile) {
			setIsImporting(true);
			const reader = new FileReader();
			reader.onload = (e) => {
				const fileContent = e.target.result;
				const formData = new FormData();
				formData.append("action", "eap_import_accordions");
				formData.append("nonce", sp_eab_admin_dashboard_localize?.nonce);
				formData.append("accordion", fileContent);
				formData.append("unSanitize", allowUnsanitized ? "1" : "0");

				fetch(ajaxurl, {
					method: "POST",
					body: formData,
				})
					.then((response) => response.json())
					.then((data) => {
						setIsImporting(false);
						if (data.success) {
							alert(__("Import successful!", "easy-accordion-free"));
							setSelectedFile(null);
							setFileName(__("No File Chosen", "easy-accordion-free"));
						} else {
							alert(data.data?.message || __("Import failed.", "easy-accordion-free"));
						}
					})
					.catch((error) => {
						setIsImporting(false);
						console.error("Import error:", error);
						alert(__("Import failed.", "easy-accordion-free"));
					});
			};
			reader.readAsText(selectedFile);
		}
	};

	return (
		<div className="sp-eap-settings-tools-controls">
			<div className="sp-eap-settings-tools-section">
				<div className="sp-eap-settings-tools-section-header">
					<h3 className="sp-eap-settings-tools-section-title">{__("Export", "easy-accordion-free")}</h3>
				</div>
				<div className="sp-eap-settings-tools-section-content">
					<p className="sp-eap-settings-tools-subtitle">{__("Choose What to Export", "easy-accordion-free")}</p>
					<div className="sp-eap-settings-tools-radio-group">
						<label className={`sp-eap-settings-tools-radio ${exportType === "all-faqs" ? "active" : ""}`}>
							<input
								type="radio"
								name="export-type"
								value="all-faqs"
								checked={exportType === "all-faqs"}
								onChange={() => setExportType("all-faqs")}
							/>
							<span className="sp-eap-settings-tools-radio-label">{__("All FAQs", "easy-accordion-free")}</span>
						</label>
						<label className={`sp-eap-settings-tools-radio ${exportType === "all-shortcodes" ? "active" : ""}`}>
							<input
								type="radio"
								name="export-type"
								value="all-shortcodes"
								checked={exportType === "all-shortcodes"}
								onChange={() => setExportType("all-shortcodes")}
							/>
							<span className="sp-eap-settings-tools-radio-label">
								{__("All Accordion Groups", "easy-accordion-free")}
							</span>
						</label>
						<label
							className={`sp-eap-settings-tools-radio ${exportType === "selected-shortcodes" ? "active" : ""}`}
						>
							<input
								type="radio"
								name="export-type"
								value="selected-shortcodes"
								checked={exportType === "selected-shortcodes"}
								onChange={() => setExportType("selected-shortcodes")}
							/>
							<span className="sp-eap-settings-tools-radio-label">
								{__("Selected Accordion Group(s)", "easy-accordion-free")}
							</span>
						</label>
					</div>

					{exportType === "selected-shortcodes" && (
						<div className="sp-eap-settings-tools-multiselect">
							<Select
								isMulti
								value={shortcodeList.filter((item) => selectedShortcodes.includes(item.value))}
								onChange={(selectedOptions) => {
									const values = selectedOptions ? selectedOptions.map((opt) => opt.value) : [];
									setSelectedShortcodes(values);
								}}
								options={shortcodeList}
								placeholder={__("Choose group(s)", "easy-accordion-free")}
								className="sp-eap-tools-multi-select"
								classNamePrefix="sp-eap-tools"
								noOptionsMessage={() => __("No groups available", "easy-accordion-free")}
							/>
						</div>
					)}
					<button
						className="sp-eap-settings-tools-btn sp-eap-settings-tools-btn-primary"
						onClick={handleExport}
					>
						{__("Export File", "easy-accordion-free")}
					</button>
				</div>
			</div>

			<div className="sp-eap-settings-tools-divider"></div>

			<div className="sp-eap-settings-tools-section">
				<div className="sp-eap-settings-tools-section-header">
					<h3 className="sp-eap-settings-tools-section-title">{__("Import", "easy-accordion-free")}</h3>
				</div>
				<div className="sp-eap-settings-tools-section-content">
					<p className="sp-eap-settings-tools-subtitle">
						{__("Import JSON File to Upload", "easy-accordion-free")}
					</p>
					<label className="sp-eap-settings-tools-checkbox">
						<input
							type="checkbox"
							checked={allowUnsanitized}
							onChange={(e) => setAllowUnsanitized(e.target.checked)}
							style={{ marginRight: "8px" }}
						/>
						<span className="sp-eap-settings-tools-checkbox-label">
							{__("Allow Iframe/Script Tags", "easy-accordion-free")}
						</span>
					</label>
					<p className="sp-eap-settings-tools-checkbox-help">
						{__("Enabling this option, you are allowing to import accordions which contain iframe, script or embed tags.", "easy-accordion-free")}
					</p>
					<div
						className={`sp-eap-settings-tools-file-input${isDragging ? " dragging" : ""}`}
						onDragOver={handleDragOver}
						onDragLeave={handleDragLeave}
						onDrop={handleDrop}
					>
						<label className="sp-eap-settings-tools-file-btn">
							{__("Choose File", "easy-accordion-free")}
							<input
								type="file"
								accept=".json"
								onChange={handleFileChange}
								style={{ display: "none" }}
							/>
						</label>
						<span className="sp-eap-settings-tools-file-name">{fileName}</span>
					</div>
					<button
						className={`sp-eap-settings-tools-btn sp-eap-settings-tools-btn-secondary${
							selectedFile ? " has-file" : ""
						}`}
						onClick={handleImport}
						disabled={!selectedFile || isImporting}
					>
						{isImporting ? __("Importing...", "easy-accordion-free") : __("Import File", "easy-accordion-free")}
					</button>
				</div>
			</div>
		</div>
	);
};
