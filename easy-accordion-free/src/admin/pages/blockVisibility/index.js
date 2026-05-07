import { __ } from "@wordpress/i18n";
import { toast } from "react-hot-toast";
import ToggleCard from "../../templates/toggleCard";
import { upcomingBlocksList } from "../upcomingBlocks";
import { useDispatch, useSelect } from "@wordpress/data";
import { STORE_NAME } from "../../store/constants";

const BlockVisibility = ({ showHeading = true }) => {
	const blockVisibility = useSelect((select) => select(STORE_NAME).getBlockVisibility());
	const { saveSettings } = useDispatch(STORE_NAME);
	// notification message.
	const show_notification = (block) => {
		const message = block.show
			? __("Block disabled successfully", "easy-accordion-free")
			: __("Block enabled successfully", "easy-accordion-free");
		toast.success(message, { style: { marginTop: "20px", fontSize: "14px" } });
	};
	// Handler to toggle block visibility.
	const blockShowHideHandler = (name) => {
		const updatedVisibility = blockVisibility?.map((item) => {
			if (name === item.name) {
				show_notification(item);
				return { ...item, show: !item.show };
			}
			return item;
		});
		saveSettings({ blockVisibility: updatedVisibility });
	};

	return (
		<div className="sp-eab-visibility-page">
			{showHeading && (
				<div className="eap-dashboard-page-header sp-d-flex sp-flex-col sp-gap-10px">
					<span className="eap-dashboard-page-header__label">
						{__("Control Blocks", "easy-accordion-free")}
					</span>
					<span className="eap-dashboard-page-header__desc">
						{__("Turn blocks on or off as needed to improve performance.", "easy-accordion-free")}
					</span>
				</div>
			)}
			<div className="sp-eab-all-block-list sp-d-grid sp-grid-cols-3">
				{blockVisibility?.map((card, i) => (
					<ToggleCard key={i} attributes={card} blockShowHideHandler={blockShowHideHandler} />
				))}
			</div>
			<div className="eap-dashboard-page-header sp-d-flex sp-flex-col sp-gap-10px" style={{ marginTop: "48px" }}>
				<span className="eap-dashboard-page-header__label">{__("Upcoming Blocks", "easy-accordion-free")}</span>
			</div>
			<div className="sp-eab-all-block-list sp-d-grid sp-grid-cols-3">
				{upcomingBlocksList?.map((card, i) => (
					<ToggleCard
						key={i}
						attributes={card}
						blockShowHideHandler={blockShowHideHandler}
						isUpcomingBlock={true}
					/>
				))}
			</div>
		</div>
	);
};

export default BlockVisibility;
