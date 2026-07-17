import { __ } from "@wordpress/i18n";
import Drawer from "@mui/material/Drawer";
import { Fragment, useState, useEffect, useRef } from "@wordpress/element";
import useChangelogData from "../hooks/useChangelogData";
import {
	AboutUsIcon,
	Arrow,
	ArrowRight,
	Blog,
	ChangelogIcon,
	CloseIcon,
	Community,
	DocumentationIcon,
	FeatRequest,
	Logo,
	Roadmap,
	SetupWizard,
	Support,
	TechSupport,
	Video,
	WhatsNew,
} from "../icons";

const GreenCheckIcon = () => (
	<img
		src={`${sp_eab_admin_dashboard_localize?.pluginUrl}/assets/images/bell-icon.gif`}
		width={18}
		height={18}
		alt=""
	/>
);

const GetHelpItems = [
	{
		title: __("Documentation", "easy-accordion-free"),
		Icon: DocumentationIcon,
		link: "https://easyaccordion.io/docs/",
	},
	{
		title: __("Technical Support", "easy-accordion-free"),
		Icon: TechSupport,
		link: "https://shapedplugin.com/create-new-ticket/",
	},
	{
		title: __("Setup Wizard", "easy-accordion-free"),
		Icon: SetupWizard,
		link: `${sp_eab_admin_dashboard_localize?.homeUrl}wp-admin/admin.php?page=eap_dashboard#setupwizard`,
	},
	{
		title: __("Public Roadmap", "easy-accordion-free"),
		Icon: Roadmap,
		link: "",
	},
	{
		title: __("Request a Feature", "easy-accordion-free"),
		Icon: FeatRequest,
		link: "https://shapedplugin.com/contact-us/",
	},
	{
		title: __("Video Tutorials", "easy-accordion-free"),
		Icon: Video,
		link: "https://youtu.be/JEv8hP5NvnY?si=-a4iL5GV-NZmo9bI",
	},
	{
		title: __("What's New", "easy-accordion-free"),
		Icon: WhatsNew,
		link: "https://easyaccordion.io/changelog/",
	},
	{
		title: __("Blog: Latest News", "easy-accordion-free"),
		Icon: Blog,
		link: "https://shapedplugin.com/blog/",
	},
	{
		title: __("Join Community", "easy-accordion-free"),
		Icon: Community,
		link: " https://community.shapedplugin.com/",
	},
	{
		title: __("About Us", "easy-accordion-free"),
		Icon: AboutUsIcon,
		link: "#about_us",
	},
];

const HeaderItems = ({ menuItems = [], currentPage = "", setPageAndHash = () => {} }) => {
	const [showSidebar, setShowSidebar] = useState(false);
	const [showUpgradeNotice, setShowUpgradeNotice] = useState(false);
	const [activeItemPosition, setActiveItemPosition] = useState({ left: 0, width: 0 });
	const navRef = useRef();
	const itemsRef = useRef({});

	const toggleDrawer = (newOpen) => () => {
		setShowSidebar(newOpen);
	};
	const { status: changelogStatus, changelog, errorMessage: changelogError } = useChangelogData(showSidebar);

	// Check if upgrade notice should be shown
	useEffect(() => {
		setShowUpgradeNotice(sp_eab_admin_dashboard_localize?.showUpgradeNotice ?? false);
	}, []);

	// Handle close button click for upgrade notice
	const handleUpgradeNoticeClose = () => {
		setShowUpgradeNotice(false);

		// Send AJAX request to update the option
		const formData = new FormData();
		formData.append("action", "sp_eab_hide_upgrade_notice");
		formData.append("nonce", sp_eab_admin_dashboard_localize?.nonce);

		fetch(sp_eab_admin_dashboard_localize?.ajax_url, {
			method: "POST",
			body: formData,
		})
			.then((response) => response.json())
			.catch((error) => {
				console.error("Error hiding upgrade notice:", error);
			});
	};

	// Update sliding indicator position when current page changes
	useEffect(() => {
		if (itemsRef.current[currentPage]) {
			const item = itemsRef.current[currentPage];
			const nav = navRef.current;
			if (item && nav) {
				const navRect = nav.getBoundingClientRect();
				const itemRect = item.getBoundingClientRect();
				setActiveItemPosition({
					left: itemRect.left - navRect.left,
					width: itemRect.width,
				});
			}
		}
	}, [currentPage]);

	return (
		<>
			{showUpgradeNotice && (
				<div className="sp-eab-green-header-notice">
					<div className="sp-eab-green-header-notice-content">
						<GreenCheckIcon />
						<span className="sp-eab-green-header-notice-text">
							You're currently using <strong>Easy Accordion Lite</strong>. To access additional features, consider
						</span>
						<a
							className="sp-eab-green-header-notice-link"
							href="https://easyaccordion.io/pricing/?ref=1"
							target="_blank"
							rel="noopener noreferrer"
						>
							{__("Upgrade to Pro", "easy-accordion-free")}
							<ArrowRight />
						</a>
						<button
							className="sp-eab-green-header-notice-close"
							onClick={handleUpgradeNoticeClose}
							type="button"
						>
							<CloseIcon />
						</button>
					</div>
				</div>
			)}
			<div className="sp-eab-admin-dashboard-header">
				<div className="sp-eab-block-setting-header-wrapper sp-d-flex sp-justify-between sp-align-center">
					{/* Left: Logo + Version */}
					<div className="sp-eab-admin-dashboard-header-left sp-d-flex sp-align-center sp-gap-10px">
						<span className="sp-eap-dashboard-logo">
							<Logo />
						</span>
						<span onClick={toggleDrawer(true)} className="sp-eap-plugin-version">
							<ChangelogIcon />
							{sp_eab_admin_dashboard_localize?.pluginVersion}
						</span>
						<Drawer
							anchor="right"
							open={showSidebar}
							onClose={toggleDrawer(false)}
							slotProps={{
								paper: {
									className: "sp-eab-admin-changelog-wrapper",
								},
							}}
						>
							<div className="sp-eab-changelog-heading sp-d-flex sp-justify-between">
								<p className="sp-eab-changelog-heading-title">Latest Updates - Changelog</p>
								<button
									className="sp-eab-changelog-close-btn sp-d-flex sp-align-center sp-cursor-pointer"
									onClick={toggleDrawer(false)}
								>
									<CloseIcon />
								</button>
							</div>
							{changelogStatus === "loading" && (
								<div className="sp-eab-changelog-details">{__("Loading…", "easy-accordion-free")}</div>
							)}
							{changelogStatus === "error" && (
								<div className="sp-eab-changelog-details sp-eab-changelog-error">
									<p>{__("Couldn't load the latest changelog.", "easy-accordion-free")}</p>
									{changelogError && <p className="sp-eab-changelog-error-detail">{changelogError}</p>}
									<a href="https://easyaccordion.io/changelog/" target="_blank" rel="noopener noreferrer">
										{__("View changelog on easyaccordion.io", "easy-accordion-free")}
									</a>
								</div>
							)}
							{changelogStatus === "success" && (
								<div
									className="sp-eab-changelog-details"
									dangerouslySetInnerHTML={{ __html: changelog }}
								></div>
							)}
						</Drawer>
					</div>

					{/* Center: Navigation with sliding indicator */}
					<div className="sp-eab-admin-dashboard-nav" ref={navRef}>
						<span
							className="sp-eap-nav-sliding-indicator"
							style={{ left: `${activeItemPosition.left}px`, width: `${activeItemPosition.width}px` }}
						></span>
						<ul className="sp-d-flex">
							{menuItems?.map((item) => (
								<li
									key={item.value}
									className={item.value === "lite_vs_pro" ? "sp-eap-nav-divider" : ""}
								>
									<a
										ref={(el) => (itemsRef.current[item.value] = el)}
										href={item.hash}
										className={`${currentPage === item.value ? "active" : ""} ${item.icon ? "sp-eap-nav-item-with-icon" : ""}`}
										onClick={(e) => {
											e.preventDefault();
											setPageAndHash(item.value);
										}}
									>
										{item.icon}
										{item.label}
										{item.badge && (
											<span className="sp-eab-nav-badge">
												{__("NEW!", "easy-accordion-free")}
											</span>
										)}
									</a>
								</li>
							))}
						</ul>
					</div>

					{/* Right: Get Help */}
					<div className="sp-eab-admin-dashboard-header-right sp-d-flex sp-gap-6px sp-cursor-pointer">
						<Support />
						<span>{__("Get Help", "easy-accordion-free")}</span>
						<div className="sp-eab-help-drop-down sp-d-hidden sp-flex-col">
							{GetHelpItems?.map(({ title, link, Icon }, index) => (
								<Fragment key={index}>
									{link && (
										<a
											href={link}
											target={link.startsWith("#") ? "" : "_blank"}
											rel={link.startsWith("#") ? "" : "noopener noreferrer"}
											className="sp-eap-support-link sp-d-flex sp-align-center sp-gap-10px"
											onClick={(e) => {
												if (link.startsWith("#")) {
													e.preventDefault();
													setPageAndHash(link.replace("#", ""));
												}
											}}
										>
											<Icon />
											<span>{title}</span>
											<span className="drop-down-arrow">
												<Arrow />
											</span>
										</a>
									)}
								</Fragment>
							))}
						</div>
					</div>
				</div>
			</div>
		</>
	);
};

export default HeaderItems;
