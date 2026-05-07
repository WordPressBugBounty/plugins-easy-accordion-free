import { __ } from "@wordpress/i18n";
import { Tooltip } from "@wordpress/components";
import Select from "./Select";
import { GridTwoColIcon, GridThreeColIcon, HeartIcon, CloseIcon, RotateIcon, EasyAccordionLogo } from "../icons";
import { FILTER_OPTIONS } from "../constants";
import { currentBlockTitle } from "../controls";
import "./editor.scss";

export const FilterPart = (props) => {
	const { changeStates, column, showWishList, _fetchFile, fetching, searchQuery, fields, fieldValue, wishListArr } =
		props;

	return (
		<div className="sp-eap-patterns-template-filter">
			<div className="sp-eap-patterns-template-filter-search">
				<span>
					<i className="sp-eab-icon-search-icon"></i>
				</span>
				<input
					type="search"
					id="sp-eap-patterns-template-filter-search-field"
					placeholder="Search..."
					className="sp-eap-patterns-template-filter-search-input"
					value={searchQuery}
					onChange={(e) => {
						if (changeStates) {
							changeStates("search", e.target.value);
						}
					}}
				/>
			</div>
			<div className="sp-eap-patterns-template-filter-sort">
				{fields?.trend && fieldValue?.trend && (
					<Select
						value={fieldValue?.trend}
						onChange={(v) => {
							changeStates("trend", v);
						}}
						options={FILTER_OPTIONS.TREND.map((option) => ({
							...option,
							label: option.label,
						}))}
					/>
				)}
			</div>

			<div className="sp-eap-patterns-template-filter-grid-two-col" onClick={() => changeStates("column", "2")}>
				<button className={` ${column == "2" ? "active" : ""}`}>
					<GridTwoColIcon />
				</button>
			</div>
			<div
				className={`sp-eap-patterns-template-filter-grid-three-col ${
					column == "3" ? "sp-eab-patterns-col-active" : ""
				}`}
				onClick={() => changeStates("column", "3")}
			>
				<button className={` ${column == "3" ? "active" : ""}`}>
					<GridThreeColIcon />
				</button>
			</div>
			<Tooltip text={__("Refresh Patterns", "easy-accordion-free")} delay={300} placement="top">
				<div className="sp-eap-patterns-template-filter-reset">
					<button>
						<span className={"sp-eap-patterns-popup-sync"} onClick={() => _fetchFile()}>
							<i className={fetching ? " sp-rotate" : ""}>
								<RotateIcon />
							</i>
						</span>
					</button>
				</div>
			</Tooltip>
			<Tooltip text={__("Wishlist", "easy-accordion-free")} delay={300} placement="top">
				<div className="sp-eap-patterns-template-filter-love">
					<button
						onClick={() => {
							changeStates("wishlist", showWishList ? false : true);
						}}
						className={` ${showWishList ? "active" : ""}`}
					>
						<HeartIcon />
						{wishListArr?.length > 0 && (
							<span className="sp-eap-patterns-template-filter-love-count">{wishListArr?.length}</span>
						)}
					</button>
				</div>
			</Tooltip>
		</div>
	);
};

export const HeaderWithFilter = (props) => {
	const { changeStates, column, showWishList, _fetchFile, fetching, onClose, currentBlockName, wishListArr } = props;

	const filterBlockName = currentBlockTitle(currentBlockName);

	return (
		<div className="sp-eap-patterns-popup-header">
			<div className="sp-eap-patterns-popup-filter-title">
				<div className="sp-eap-patterns-popup-filter-image-head">
					<EasyAccordionLogo />
					<span>{filterBlockName}</span>
				</div>
				<div className="sp-eap-patterns-popup-filter-nav-right">
					<div
						className={`sp-eap-patterns-template-filter-grid-two-col `}
						onClick={() => changeStates("column", "2")}
					>
						<button className={` ${column == "2" ? "active" : ""}`}>
							<GridTwoColIcon />
						</button>
					</div>
					<div
						className={`sp-eap-patterns-template-filter-grid-three-col ${
							column == "3" ? "sp-eab-patterns-col-active" : ""
						}`}
						onClick={() => changeStates("column", "3")}
					>
						{" "}
						<button className={` ${column == "3" ? "active" : ""}`}>
							<GridThreeColIcon />
						</button>
					</div>
					<Tooltip text={__("Refresh Patterns", "easy-accordion-free")} delay={300} placement="top">
						<div className="sp-eap-patterns-template-filter-reset">
							<button>
								<span className={"sp-eap-patterns-popup-sync"} onClick={() => _fetchFile()}>
									<i className={fetching ? " sp-rotate" : ""}>
										<RotateIcon />
									</i>
								</span>
							</button>
						</div>
					</Tooltip>
					<Tooltip text={__("Wishlist", "easy-accordion-free")} delay={300} placement="top">
						<div className="sp-eap-patterns-template-filter-love">
							<button
								onClick={() => {
									changeStates("wishlist", showWishList ? false : true);
								}}
								className={` ${showWishList ? "active" : ""}`}
							>
								<HeartIcon />
								{wishListArr?.length > 0 && (
									<span className="sp-eap-patterns-template-filter-love-count">
										{wishListArr?.length}
									</span>
								)}
							</button>
						</div>
					</Tooltip>
					<div className="sp-eap-patterns-popup-filter-sync-close">
						<button
							className="sp-eap-patterns-btn-close"
							onClick={onClose}
							id="sp-eap-patterns-btn-close"
							aria-label={__("Close", "easy-accordion-free")}
						>
							<CloseIcon />
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};
