import { __ } from "@wordpress/i18n";
import Drawer from "@mui/material/Drawer";
import { Fragment, useState } from "@wordpress/element";
import useChangelogData from "../hooks/useChangelogData";
import {
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
];

const HeaderItems = () => {
	const [showSidebar, setShowSidebar] = useState(false);

	const toggleDrawer = (newOpen) => () => {
		setShowSidebar(newOpen);
	};
	const changelog = useChangelogData(showSidebar);

	return (
		<>
			<div className="sp-eab-green-header-notice">
				<div className="sp-eab-green-header-notice-content">
					<GreenCheckIcon />
					<span className="sp-eab-green-header-notice-text">
						<strong>You're on Lite</strong> — unlock the full power at <strong>50% OFF. Lifetime Deal.</strong> Pay once, Use forever.
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
				</div>
			</div>
			<div className="sp-eab-admin-dashboard-header">
			<div className="sp-eab-block-setting-header-wrapper sp-d-flex sp-justify-between sp-align-center">
				<div className="sp-eab-admin-dashboard-header-left sp-d-flex sp-align-center sp-gap-10px">
					<Logo />
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
						<div className="sp-eab-changelog-details" dangerouslySetInnerHTML={{ __html: changelog }}></div>
					</Drawer>
				</div>
				<div className="sp-eab-admin-dashboard-header-right sp-d-flex sp-gap-4px sp-cursor-pointer">
					<Support />
					<span>{__("Get Help", "easy-accordion-free")}</span>
					<div className="sp-eab-help-drop-down sp-d-hidden sp-flex-col">
						{GetHelpItems?.map(({ title, link, Icon }, index) => (
							<Fragment key={index}>
								{link && (
									<a
										href={link}
										target="_blank"
										rel="noopener noreferrer"
										className="sp-eap-support-link sp-d-flex sp-align-center sp-gap-10px"
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
