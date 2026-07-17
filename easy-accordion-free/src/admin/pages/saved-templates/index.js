import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "@wordpress/element";
import { Tooltip, Spinner } from "@wordpress/components";
import { useDispatch, resolveSelect, useSelect } from "@wordpress/data";
import { copyText, toastErrorMsg, toastSuccessMsg } from "../../functions";
import { CheckIcon, CopyIcon, DeleteBinIcon, EditPencilIcon, LeftArrow, RightArrow } from "./icons";
import { SavedTemplatesPromo } from "./SavedTemplatesPromo";

const SavedTemplates = () => {
	const [selectBulkValue, setSelectBulkValue] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [allCheck, setAllCheck] = useState(false);
	const [checkId, setCheckId] = useState([]);
	const [shortcodeCopied, setShortcodeCopied] = useState("");
	const [noPostText, setNoPostText] = useState(false);
	const timeoutRef = useRef(null);

	// Get Block Editor Templates count.
	const blockTemplateCount = useSelect(
		(select) =>
			select("core")?.getEntityRecords("postType", "sp_eap_template", {
				status: "any",
				per_page: -1,
				search: searchValue,
				_fields: ["id"],
			})?.length || 0,
		[searchValue]
	);

	// Table columns for saved templates
	const tableCol = ["checkBox", "title", "shortcode", "date", "action"];

	// Total count for pagination.
	const totalPostCount = blockTemplateCount;

	// Get Block Editor Templates.
	const blockTemplateList = useSelect(
		(select) =>
			select("core")?.getEntityRecords("postType", "sp_eap_template", {
				status: "any",
				per_page: -1,
				search: searchValue,
				_fields: ["id", "modified", "title", "status"],
			}) || [],
		[searchValue]
	);

	// Sort by modified date (newest first).
	const allTemplates = blockTemplateList.sort((a, b) => {
		return new Date(b.modified) - new Date(a.modified);
	});

	// Paginate list.
	const savedTemplateList = allTemplates.slice(
		searchValue ? 0 : (currentPage - 1) * 10,
		searchValue ? 10 : currentPage * 10
	);

	// Copy Shortcode Upon Clicking Short code.
	const copyShortCodeHandler = (item) => {
		const shortcode = `[sp_eap_template id="${item.id}"]`;
		const copied = copyText(shortcode);

		if (copied) {
			setShortcodeCopied(item.id);
		} else {
			toastErrorMsg(__("Failed to copy shortcode", "easy-accordion-free"));
		}
	};

	const checkIdHandler = (itemId) => {
		const hasValue = checkId.includes(itemId);
		const updateValue = hasValue ? checkId?.filter((value) => value !== itemId) : [...checkId, itemId];
		setCheckId(updateValue);
		setAllCheck(false);
	};

	// Set Search value with debounce.
	const searchValueHandler = (e) => {
		const searchInputValue = e.target?.value;
		if (timeoutRef.current) {
			clearTimeout(timeoutRef.current);
		}
		timeoutRef.current = setTimeout(() => {
			setSearchValue(searchInputValue);
		}, 1000);
	};

	// Get Delete entity record.
	const { deleteEntityRecord, editEntityRecord, saveEntityRecord, saveEditedEntityRecord, invalidateResolution } =
		useDispatch("core");

	// Delete Item.
	const deleteItemHandler = async (itemId = null) => {
		const deleteId = itemId ? [itemId] : checkId;
		if (deleteId?.length < 1) {
			return;
		}
		// eslint-disable-next-line no-alert
		const confirmed = window.confirm("Are you sure you want to delete this saved template?");
		if (confirmed) {
			await Promise.all(
				deleteId.map(async (id) => {
					try {
						await deleteEntityRecord("postType", "sp_eap_template", id, { force: true });
					} catch (error) {
						// console.error(`Error deleting template ID: ${id}`, error);
						toastErrorMsg(`Error deleting template ID: ${id}: ${error} `);
					}
				})
			);
			const updateData = itemId ? checkId?.filter((itemValueId) => itemValueId !== deleteId[0]) : [];
			setCheckId(updateData);
			toastSuccessMsg("Template deleted successfully.");
		}
	};

	// Update Post Status.
	const updateStatusHandler = async (newStatus = "publish") => {
		const updateId = checkId;
		if (updateId?.length < 1) {
			return;
		}
		await Promise.all(
			updateId?.map(async (id) => {
				try {
					if (!id) {
						return;
					}
					// Check if record exists in the store
					const record = await resolveSelect("core").getEntityRecord("postType", "sp_eap_template", id);

					if (!record) {
						return;
					}
					await editEntityRecord("postType", "sp_eap_template", id, { status: newStatus });
					await saveEditedEntityRecord("postType", "sp_eap_template", id);
				} catch (error) {
					// console.error(`Error update template ID: ${id}`, error);
					toastErrorMsg(`Error while updating template ID: ${id}: ${error} `);
				}
			})
		);
		toastSuccessMsg("Template post status updated successfully.");
		setCheckId([]);
	};

	// Bulk Action Function.
	const bulkActionHandler = () => {
		if (selectBulkValue === "") {
			return;
		}
		switch (selectBulkValue) {
			case "publish":
				updateStatusHandler("publish");
				break;
			case "draft":
				updateStatusHandler("draft");
				break;
			case "delete":
				deleteItemHandler();
				break;
			default:
				break;
		}
		setCheckId([]);
		setAllCheck(false);
		setSelectBulkValue("");
	};

	const duplicateShortcodeHandler = async (item) => {
		try {
			// Block template duplication via data store.
			const original = await resolveSelect("core").getEntityRecord("postType", "sp_eap_template", item.id);

			if (!original) {
				toastErrorMsg("Template not found");
				return;
			}

			await saveEntityRecord("postType", "sp_eap_template", {
				title: `${original.title.raw || "(No title)"} (Copy)`,
				content: original.content?.raw || "",
				meta: original.meta || {},
				status: "draft",
			});

			// Invalidate list to refresh with exact query parameters
			invalidateResolution("getEntityRecords", [
				"postType",
				"sp_eap_template",
				{
					status: "any",
					per_page: -1,
					search: searchValue,
					_fields: ["id", "modified", "title", "status"],
				},
			]);

			toastSuccessMsg("Template duplicated successfully.");
		} catch (error) {
			toastErrorMsg(`Failed to duplicate template: ${error.message}`);
		}
	};

	useEffect(() => {
		if (!shortcodeCopied) {
			return;
		}

		const timer = setTimeout(() => {
			setShortcodeCopied("");
		}, 2000);

		return () => clearTimeout(timer);
	}, [shortcodeCopied]);

	useEffect(() => {
		if (savedTemplateList?.length < 1) {
			if (timeoutRef.current) {
				clearTimeout(timeoutRef.current);
			}
			timeoutRef.current = setTimeout(() => {
				setNoPostText(true);
			}, 1500);
		}
	}, [savedTemplateList]);

	// Pagination.
	const totalPages = Math.ceil(totalPostCount / 10);
	const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

	return (
		<div className="speap-saved-templates-page-wrapper">
			<div className="sp-eab-saved-templates-page-container sp-d-flex sp-flex-col">
				<div className="sp-eab-saved-template-header sp-d-flex sp-align-center sp-justify-between">
					<div className="sp-eab-saved-template-header-left sp-d-flex">
						<select
							name="bulk-action"
							className="sp-eab-saved-template-select"
							value={selectBulkValue}
							onChange={(e) => setSelectBulkValue(e.target.value)}
						>
							<option value="">Bulk Action</option>
							<option value={"publish"}>Publish</option>
							<option value={"draft"}>Draft</option>
							<option value={"delete"}>Delete</option>
						</select>
						<button className="sp-eab-saved-template-select-apply" onClick={bulkActionHandler}>
							Apply
						</button>
						<input
							name="search-weather-template"
							className="sp-eab-saved-template-search-field"
							type="text"
							placeholder="Search..."
							spellCheck="false"
							data-ms-editor="true"
							onChange={searchValueHandler}
						/>
					</div>
					<div className="sp-eab-saved-template-header-right">
						<a
							href={`${sp_eab_admin_dashboard_localize?.homeUrl}wp-admin/post-new.php?post_type=sp_eap_template`}
							className="sp-eab-saved-template-add-new sp-d-flex sp-align-center sp-justify-center sp-gap-8px sp-cursor-pointer"
							rel="noreferrer"
						>
							<i className="dashicons dashicons-plus-alt2"></i>
							Add New Template
						</a>
					</div>
				</div>
				<table className="sp-eab-saved-template-content-table">
					<thead className="sp-eab-saved-template-table-head">
						<tr>
							{tableCol?.map((item, i) => (
								<th key={i} className={`sp-eab-saved-template-table-${item}`}>
									{item === "checkBox" ? (
										<input
											type="checkbox"
											onChange={() => {
												setAllCheck((prev) => !prev);
												setCheckId(
													!allCheck ? savedTemplateList?.map((listItem) => listItem.id) : []
												);
											}}
											checked={allCheck}
										/>
									) : (
										item
									)}
								</th>
							))}
						</tr>
					</thead>
					<tbody className="sp-eab-saved-template-table-body">
						{!noPostText && (!savedTemplateList || savedTemplateList.length === 0) && (
							<tr>
								<td className="sp-eab-saved-template-preloader-no-data">
									<span className="sp-eab-saved-template-loading">
										<Spinner />
									</span>
								</td>
							</tr>
						)}
						{savedTemplateList?.map((item, i) => {
							const date = new Date(item?.modified);
							const checkBoxValue = allCheck ? true : checkId?.some((itemId) => itemId === item?.id);

							return (
								<tr key={i} className="sp-eab-saved-template-table-row">
									<td id={item?.id} className="sp-eab-saved-template-table-checkBox">
										<input
											type="checkbox"
											onChange={() => checkIdHandler(item?.id)}
											checked={checkBoxValue}
										/>
									</td>
									<td className="sp-eab-saved-template-table-title">
										<a
											href={`${sp_eab_admin_dashboard_localize?.homeUrl}wp-admin/post.php?post=${item?.id}&action=edit`}
											rel="noreferrer noopener"
										>
											<span
												dangerouslySetInnerHTML={{
													__html: item?.title?.rendered || "(No Title)",
												}}
											/>
										</a>
									</td>
									<td className="sp-eab-saved-template-table-shortcode">
										<span
											className="sp-eab-saved-template-shortcode-text"
											onClick={() => copyShortCodeHandler(item)}
										>
											{`[sp_eap_template id="${item?.id}"]`}
										</span>{" "}
										<span
											className="sp-eab-shortcode-copy-tooltip"
											style={{
												opacity: shortcodeCopied === item.id ? 1 : 0,
											}}
										>
											<CheckIcon />
											Copied!
										</span>
										{shortcodeCopied !== item.id && (
											<svg
												width="14"
												height="14"
												viewBox="0 0 14 14"
												fill="none"
												xmlns="http://www.w3.org/2000/svg"
											>
												<path
													fillRule="evenodd"
													clipRule="evenodd"
													d="M1.35417 1.25H9.47917C9.53667 1.25 9.58333 1.29667 9.58333 1.35417V9.47917C9.58333 9.50679 9.57236 9.53329 9.55282 9.55282C9.53329 9.57236 9.50679 9.58333 9.47917 9.58333H1.35417C1.32654 9.58333 1.30004 9.57236 1.28051 9.55282C1.26097 9.53329 1.25 9.50679 1.25 9.47917V1.35417C1.25 1.29667 1.29667 1.25 1.35417 1.25ZM0 1.35417C0 0.606667 0.606667 0 1.35417 0H9.47917C10.2275 0 10.8333 0.606667 10.8333 1.35417V9.47917C10.8333 10.2275 10.2275 10.8333 9.47917 10.8333H1.35417C0.995019 10.8333 0.650582 10.6907 0.396626 10.4367C0.142671 10.1828 0 9.83831 0 9.47917V1.35417ZM12.0833 11.0675V3.5675H13.3333V11.0675C13.3333 12.3333 12.3083 13.3333 11.0425 13.3333H1.875V12.0833H11.0425C11.6175 12.0833 12.0833 11.6433 12.0833 11.0675Z"
													fill="#757575"
												></path>
											</svg>
										)}
									</td>
									<td className="sp-eab-saved-template-table-date">
										<div>{item?.status}</div>
										<div>{date?.toLocaleString("en-US")}</div>
									</td>
									<td className="sp-eab-saved-template-table-action">
										<div className="sp-eab-saved-template-table-action-btn">
											<Tooltip text="Edit" delay={300} placement="top">
												<a
													aria-label="Edit"
													href={`${sp_eab_admin_dashboard_localize?.homeUrl}wp-admin/post.php?post=${item?.id}&action=edit`}
													className="sp-eab-saved-template-action sp-action-edit"
													rel="noreferrer"
												>
													<EditPencilIcon />
												</a>
											</Tooltip>
											<Tooltip text="Duplicate" delay={300} placement="top">
												<button
													aria-label="Duplicate"
													className="sp-eab-saved-template-action sp-action-copy"
													onClick={() => duplicateShortcodeHandler(item)}
												>
													<CopyIcon />
												</button>
											</Tooltip>
											<Tooltip text="Delete" delay={300} placement="top">
												<button
													aria-label="Delete"
													className="sp-eab-saved-template-action sp-action-delete"
													onClick={() => deleteItemHandler(item?.id)}
												>
													<DeleteBinIcon />
												</button>
											</Tooltip>
										</div>
									</td>
								</tr>
							);
						})}
						{noPostText && (!savedTemplateList || savedTemplateList.length === 0) && (
							<tr>
								<td className="sp-eab-saved-template-preloader-no-data">
									<span className="sp-eab-saved-template-no-data">
										{__("No saved template found!", "easy-accordion-free")}
									</span>
								</td>
							</tr>
						)}
					</tbody>
				</table>
				<div className="sp-eab-saved-template-footer">
					<div className="sp-eab-saved-template-count">
						Page {currentPage} of {Math.ceil(totalPostCount / 10) || 1} &nbsp;{" "}
						<span>[ {totalPostCount} Items ]</span>
					</div>
					<div className="sp-eab-saved-template-pagination">
						{pages?.length > 1 && (
							<>
								<button
									className={`sp-eab-saved-template-pagination-btn sp-btn-prev ${
										currentPage === 1 ? "btn-disabled" : ""
									}`}
									onClick={() => setCurrentPage(currentPage !== 1 ? currentPage - 1 : 1)}
								>
									<LeftArrow />
								</button>
								{pages.map((item, i) => (
									<button
										key={i}
										className={`sp-eab-saved-template-pagination-btn ${
											currentPage === item ? "btn-active" : "sp-btn-numb"
										}`}
										onClick={(e) => setCurrentPage(Number(e.target?.value))}
										value={item}
									>
										{item}
									</button>
								))}
								<button
									className={`sp-eab-saved-template-pagination-btn sp-btn-next ${
										currentPage === pages?.length ? "btn-disabled" : ""
									}`}
									onClick={() =>
										setCurrentPage(currentPage !== pages?.length ? currentPage + 1 : pages?.length)
									}
								>
									<RightArrow />
								</button>
							</>
						)}
					</div>
				</div>
			</div>
			<SavedTemplatesPromo />
		</div>
	);
};

export default SavedTemplates;
