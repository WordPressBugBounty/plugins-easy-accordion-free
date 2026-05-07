import { __ } from "@wordpress/i18n";
import { useEffect, useRef, useState } from "@wordpress/element";
import { Tooltip, Spinner } from "@wordpress/components";
import { useDispatch, resolveSelect, useSelect } from "@wordpress/data";
import { copyText, toastErrorMsg, toastSuccessMsg } from "../../functions";
import { CopyIcon, DeleteBinIcon, EditPencilIcon, LeftArrow, RightArrow } from "./icons";

const SavedTemplates = () => {
	const tableCol = ["checkBox", "title", "shortcode", "date", "action"];
	const [selectBulkValue, setSelectBulkValue] = useState("");
	const [searchValue, setSearchValue] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [allCheck, setAllCheck] = useState(false);
	const [checkId, setCheckId] = useState([]);
	const [shortcodeCopied, setShortcodeCopied] = useState("");
	const [noPostText, setNoPostText] = useState(false);
	const timeoutRef = useRef(null);

	// Get All Post Count.
	const totalPostCount = useSelect(
		(select) =>
			select("core")?.getEntityRecords("postType", "sp_eap_template", {
				status: "any",
				per_page: -1,
				search: searchValue,
				_fields: ["id"],
			})?.length,
		[searchValue]
	);

	const savedTemplateList = useSelect(
		(select) =>
			select("core")?.getEntityRecords("postType", "sp_eap_template", {
				status: "any",
				per_page: 10,
				offset: searchValue ? 0 : (currentPage - 1) * 10,
				search: searchValue,
				_fields: ["id", "modified", "title", "status"],
			}),
		[searchValue, currentPage]
	);

	// Copy Shortcode Upon Clicking Short code.
	const copyShortCodeHandler = (value) => {
		const updateValue = `[sp_eap_template id="${value}"]`;
		const copied = copyText(updateValue);

		if (copied) {
			setShortcodeCopied(value);
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
		}, 100);
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
			const updateData = itemId ? checkId?.filter((itemValueId) => itemValueId !== deleteId) : [];
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
					setCheckId([]);
					toastSuccessMsg("Template post status updated successfully.");
				} catch (error) {
					// console.error(`Error update template ID: ${id}`, error);
					toastErrorMsg(`Error while updating template ID: ${id}: ${error} `);
				}
			})
		);
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

	const duplicateShortcodeHandler = async (templateId) => {
		try {
			// Get original template
			const original = await resolveSelect("core").getEntityRecord("postType", "sp_eap_template", templateId);

			if (!original) {
				toastErrorMsg("Template not found");
				return;
			}

			// Save new template (no ID = new record)
			await saveEntityRecord("postType", "sp_eap_template", {
				title: `${original.title.raw || "(No title)"} (Copy)`,
				content: original.content?.raw || "",
				meta: original.meta || {},
				status: "draft",
			});

			// Refresh list
			invalidateResolution("getEntityRecords", ["postType", "sp_eap_template"]);

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
						target="_blank"
						className="sp-eab-saved-template-add-new sp-d-flex sp-align-center sp-justify-center sp-gap-8px sp-cursor-pointer"
						rel="noreferrer"
					>
						<i className="dashicons dashicons-plus-alt2"></i>
						Add New
					</a>
				</div>
			</div>
			<table className="sp-eab-saved-template-content-table">
				<thead className="sp-eab-saved-template-table-head">
					<tr>
						{tableCol?.map((item, i) => (
							<th key={i} className={`sp-eab-saved-template-table-${item}`}>
								{item !== "checkBox" ? (
									item
								) : (
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
										target="_blank"
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
										onClick={() => copyShortCodeHandler(item?.id)}
									>
										{`[sp_eap_template id="${item?.id}"]`}
										<CopyIcon />
									</span>{" "}
									<span
										className="sp-eab-shortcode-copy-tooltip"
										style={{
											opacity: shortcodeCopied === item.id ? 1 : 0,
										}}
									>
										Copied!
									</span>
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
												target="_blank"
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
												onClick={() => duplicateShortcodeHandler(item?.id)}
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
	);
};

export default SavedTemplates;
