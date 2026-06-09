import Toggle from "react-toggle";
import { __ } from "@wordpress/i18n";
import { useSelect } from "@wordpress/data";
import { arrayMoveImmutable } from "array-move";
import { memo, useMemo, useState } from "@wordpress/element";
import { InputControl, MultipleSelectWithDnd } from "@easy-accordion/components";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { jsToPhpBool, phpToJsBool } from "../../functions";
import { DeleteBinIcon, CopyIcon } from "../saved-templates/icons";
import { InfoText } from "./template-parts";
import { wooFaqTypes } from "../../constants";

const WooFaqTabSingleItem = ({
	id,
	item,
	shortCodeOptions = [],
	onUpdateValue,
	duplicateItem,
	deleteItem,
	activeTabId,
	setActiveTabId,
}) => {
	const uniqueId = Math.random();
	const { eap_display_tab_for } = item;

	const modifiedSelectVal = (updateValues) => {
		return updateValues?.map((val) => val?.value?.toString());
	};
	const activeWooFaqType = wooFaqTypes?.find(({ value }) => value === eap_display_tab_for);

	const getActiveOptions = (options, activeValues) => {
		return options.filter((option) => activeValues?.includes(option?.value?.toString()));
	};

	return (
		<div className="sp-eap-woo-faq-tab-item">
			<div className="sp-eap-woo-faq-tab-header sp-d-flex sp-algin-center sp-justify-between">
				<span
					className="sp-eap-woo-faq-tab-label"
					onClick={() => setActiveTabId((prev) => (prev === id ? null : id))}
				>
					{activeWooFaqType?.label}
				</span>
				<div className="sp-eap-cloneable-helper sp-d-flex sp-align-center sp-gap-8px">
					<span className="eap-cloneable-clone sp-cursor-pointer" onClick={() => duplicateItem(id)}>
						<CopyIcon />
					</span>
					<span
						className="eap-cloneable-remove sp-cursor-pointer"
						onClick={() => {
							if (window.confirm("Are you sure you want to delete this item?")) {
								deleteItem(id);
							}
						}}
					>
						<DeleteBinIcon />
					</span>
				</div>
			</div>
			{activeTabId === id && (
				<div className="sp-eap-woo-faq-tab-content sp-d-flex sp-flex-col sp-gap-10px">
					<div className="sp-eap-woo-faq-type eap-draggable-content sp-d-flex sp-align-center sp-justify-between">
						<span className="sp-eap-woo-faq-tab-label">{__("Display FAQs on", "easy-accordion-free")}</span>
						<select
							name="eap_woo_set_tab"
							onChange={(e) => onUpdateValue(id, "eap_display_tab_for", e.target.value)}
							value={eap_display_tab_for}
						>
							{wooFaqTypes?.map(({ label, value, pro }) => (
								<option key={value} value={value} disabled={pro}>
									{label}
								</option>
							))}
						</select>
					</div>
					{/* category selector */}
					{/* {eap_display_tab_for === "taxonomy" && (
						<div className="sp-eap-woo-faq-category eap-draggable-content sp-d-flex sp-align-center sp-justify-between">
							<span className="sp-eap-woo-faq-tab-label">
								{__("Category Term(s)", "easy-accordion-free")}
							</span>
							<MultipleSelectWithDnd
								label={false}
								uniqueId={uniqueId}
								items={termsOptions}
								values={getActiveOptions(termsOptions, item?.eap_taxonomy_terms)}
								searchable={true}
								onChange={(values) =>
									onUpdateValue(id, "eap_taxonomy_terms", modifiedSelectVal(values))
								}
							/>
						</div>
					)} */}
					{/* select specific products */}
					{/* {eap_display_tab_for === "Specific_Products" && (
						<div className="sp-eap-woo-faq-category eap-draggable-content sp-d-flex sp-align-center sp-justify-between">
							<span className="sp-eap-woo-faq-tab-label">
								{__("Specific Product(s)", "easy-accordion-free")}
							</span>
							<MultipleSelectWithDnd
								label={false}
								uniqueId={uniqueId}
								items={productOptions}
								values={getActiveOptions(productOptions, item?.eap_specific_product)}
								searchable={true}
								onChange={(values) =>
									onUpdateValue(id, "eap_specific_product", modifiedSelectVal(values))
								}
							/>
						</div>
					)} */}
					{/* select eap shortcodes */}
					<div className="sp-eap-woo-faq-posts eap-draggable-content sp-d-flex sp-align-center sp-justify-between">
						<span className="sp-eap-woo-faq-tab-label">
							{__("Select FAQs Group(s)", "easy-accordion-free")}
						</span>
						<MultipleSelectWithDnd
							label={false}
							uniqueId={uniqueId}
							items={shortCodeOptions}
							values={getActiveOptions(shortCodeOptions, item?.eap_woo_tab_shortcode)}
							searchable={true}
							onChange={(values) => onUpdateValue(id, "eap_woo_tab_shortcode", modifiedSelectVal(values))}
						/>
					</div>
				</div>
			)}
		</div>
	);
};

const WooCommerceFAQs = ({ pluginSettings, eapShortcodes, updateSettingsOption }) => {
	const eap_woo_faq = phpToJsBool(pluginSettings?.eap_woo_faq);
	const isActiveWooCommerce = phpToJsBool(sp_eab_admin_dashboard_localize?.isActiveWooCommerce);
	const eapWooFaq = isActiveWooCommerce ? eap_woo_faq : false;
	// states.
	const [wooFaqTabs, setWooFaqTabs] = useState(pluginSettings?.eap_woo_set_tab || []);
	const [activeTabId, setActiveTabId] = useState();
	// query product categories.
	// const productCategories = useSelect(
	// 	(select) =>
	// 		select("core").getEntityRecords("taxonomy", "product_cat", {
	// 			per_page: -1,
	// 			hide_empty: false,
	// 		}),
	// 	[]
	// );
	// const categoryOptions = useMemo(() => {
	// 	return (
	// 		productCategories?.map((cat) => ({
	// 			label: cat.name,
	// 			value: cat.id,
	// 			id: cat.id,
	// 		})) || []
	// 	);
	// }, [productCategories]);
	// query product categories.
	// const allProducts = useSelect(
	// 	(select) =>
	// 		select("core").getEntityRecords("postType", "product", {
	// 			per_page: 100,
	// 			status: "publish",
	// 		}),
	// 	[]
	// );
	// const productOptions = useMemo(() => {
	// 	return (
	// 		allProducts?.map((product) => ({
	// 			label: product?.title?.raw,
	// 			value: product.id,
	// 			id: product.id,
	// 		})) || []
	// 	);
	// }, [allProducts]);

	// update state.
	const setUpdatedValueOnState = (updatedValue) => {
		setWooFaqTabs(updatedValue);
		updateSettingsOption("eap_woo_set_tab", updatedValue);
	};
	// on update data.
	const onUpdateValue = (id, objectKey, value) => {
		const updated = wooFaqTabs?.map((option, index) => {
			if (id === index) {
				return { ...option, [objectKey]: value };
			}
			return option;
		});
		setUpdatedValueOnState(updated);
	};
	// insert a new item.
	const onClickNewItemInserter = () => {
		setUpdatedValueOnState([...wooFaqTabs, { eap_display_tab_for: "all", eap_woo_tab_shortcode: [] }]);
	};
	// duplicate a item.
	const duplicateItem = (id) => {
		const items = wooFaqTabs?.flatMap((item, index) => {
			if (index === id) {
				return [item, item];
			}
			return item;
		});
		setUpdatedValueOnState(items);
	};
	// delete a item.
	const deleteItem = (id) => {
		setUpdatedValueOnState(wooFaqTabs?.filter((item, index) => index !== id));
	};
	//  dnd functionality.
	const onDragEnd = (result) => {
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		const from = source.index;
		const to = destination.index;
		const updatedArray = arrayMoveImmutable(wooFaqTabs, from, to);
		setUpdatedValueOnState(updatedArray);
	};

	return (
		<>
			{!isActiveWooCommerce && (
				<div className="sp-eab-dashboard-woo-notice woo-inactive sp-d-flex sp-align-center sp-gap-4px">
					<i className="dashicons dashicons-info-outline"></i>
					<a href="https://wordpress.org/plugins/woocommerce/" target="_blank" rel="noreferrer">
						{" "}
						WooCommerce{" "}
					</a>
					<span>{__("is required to use this feature.", "easy-accordion-free")}</span>
				</div>
			)}
			<div className="sp-eap-dashboard-advanced-settings eap-woocommerce-settings-tab sp-d-flex sp-flex-col">
				<div
					className={`sp-eap-settings-option sp-d-flex sp-align-center eap-woo-${isActiveWooCommerce ? "active" : "inactive"}`}
				>
					<div className="sp-eap-option-label-wrapper sp-d-flex sp-flex-col">
						<span className="sp-eap-component-title">
							{__("WooCommerce FAQs Tab", "easy-accordion-free")}
						</span>
						<span className="sp-eap-option-help-text">
							{__(
								"WooCommerce's FAQs tab gives quick answers to common customer queries about products and services.",
								"easy-accordion-free"
							)}
						</span>
					</div>
					<Toggle
						icons={false}
						defaultChecked={eapWooFaq}
						onChange={() => updateSettingsOption("eap_woo_faq", jsToPhpBool(!eapWooFaq))}
					/>
				</div>
				{eapWooFaq && (
					<>
						<div className="sp-eap-settings-option sp-d-flex sp-align-center">
							<div className="sp-eap-option-label-wrapper sp-d-flex sp-flex-col">
								<span className="sp-eap-component-title">
									{__("FAQs Tab Label", "easy-accordion-free")}
								</span>
								<span className="sp-eap-option-help-text">
									{__("Set custom text for faq tab.", "easy-accordion-free")}
								</span>
							</div>
							<InputControl
								attributes={pluginSettings?.eap_woo_faq_label}
								onChange={(value) => updateSettingsOption("eap_woo_faq_label", value)}
							/>
						</div>
						<div className="sp-eap-settings-option sp-d-flex sp-align-center">
							<div className="sp-eap-option-label-wrapper sp-d-flex sp-flex-col">
								<span className="sp-eap-component-title">
									{__("FAQs Tab Priority", "easy-accordion-free")}
								</span>
								<span className="sp-eap-option-help-text">
									{__(
										"Set WooCommerce FAQs tab priority position. Default value is 50.",
										"easy-accordion-free"
									)}
								</span>
							</div>
							<InputControl
								inputType={"number"}
								attributes={pluginSettings?.eap_woo_faq_label_priority}
								onChange={(value) => updateSettingsOption("eap_woo_faq_label_priority", value)}
							/>
						</div>
						<div className="sp-eap-settings-option sp-d-flex sp-align-start">
							<span className="sp-eap-component-title sp-d-flex sp-align-center sp-gap-6px">
								{__("FAQs Tabs", "easy-accordion-free")}
							</span>
							<div className="sp-eap-woo-faq-tab-items">
								<DragDropContext onDragEnd={onDragEnd}>
									<Droppable droppableId="sp-eap-woo-faq-tab-dnd" direction="vertical">
										{(provided) => (
											<div ref={provided.innerRef} {...provided.droppableProps}>
												{wooFaqTabs?.map((item, index) => (
													<Draggable
														key={index + 2}
														draggableId={String(index + 2)}
														index={index}
													>
														{(providedItem) => (
															<div
																ref={providedItem.innerRef}
																{...providedItem.draggableProps}
																{...providedItem.dragHandleProps}
															>
																<WooFaqTabSingleItem
																	id={index}
																	item={item}
																	// termsOptions={categoryOptions}
																	// productOptions={productOptions}
																	shortCodeOptions={eapShortcodes}
																	onUpdateValue={onUpdateValue}
																	duplicateItem={duplicateItem}
																	deleteItem={deleteItem}
																	activeTabId={activeTabId}
																	setActiveTabId={setActiveTabId}
																/>
															</div>
														)}
													</Draggable>
												))}
											</div>
										)}
									</Droppable>
								</DragDropContext>
								<div className="sp-eap-woo-faq-tab-inserter">
									<button
										className="sp-eap-woo-faq-tab-inserter-button sp-d-flex sp-align-center sp-gap-4px sp-cursor-pointer"
										onClick={() => onClickNewItemInserter()}
									>
										<i className="dashicons dashicons-plus-alt2"></i>
										{__("Add New Tabs", "easy-accordion-free")}
									</button>
								</div>
							</div>
						</div>
					</>
				)}
			</div>
		</>
	);
};

export default memo(WooCommerceFAQs);
