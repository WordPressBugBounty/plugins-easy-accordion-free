import { memo } from "@wordpress/element";
import { Arrow, DocIcon, SupportIcon, TeamIcon } from "../../icons";

const QuickStart = () => {
	return (
		<div className="sp-eab-getting-start-page sp-d-flex">
			<div className="sp-eab-video-section">
				<div className="sp-eab-video-section-text">
					<h3>Welcome to Easy Accordion!</h3>
					<span>
						Thank you for installing Easy Accordion! This video will help you get started with the plugin.
						Enjoy!
					</span>
				</div>
				<div className="sp-eab-video-section-video">
					<iframe
						width="724"
						height="416"
						src="https://www.youtube.com/embed/u3lRDX0zG9Y"
						title="YouTube video player"
					></iframe>
				</div>
				<div className="sp-eab-video-section-btn">
					<ul className="sp-d-flex">
						<li>
							<a
								href={`${sp_eab_admin_dashboard_localize?.homeUrl}wp-admin/post-new.php?post_type=page&eabblock_inserter=true`}
								target="_blank"
								rel="noreferrer"
							>
								Explore Blocks
							</a>
						</li>
						<li>
							<a
								href="https://easyaccordion.io/"
								target="_blank"
								rel="noreferrer"
								className="sp-d-flex sp-align-center sp-gap-4px"
							>
								See Full Features <Arrow />
							</a>
						</li>
					</ul>
				</div>
			</div>
			<div className="sp-eab-sidebar-section sp-d-flex sp-flex-col">
				<div className="sp-eab-sidebar-info-card">
					<div className="sp-eab-sidebar-info-card-title sp-d-flex sp-align-center sp-gap-10px">
						<span>
							<DocIcon />
						</span>
						<h4>Documentation</h4>
					</div>
					<p className="sp-eab-sidebar-info-card-text">
						Explore Easy Accordion plugin capabilities in our enriched documentation.
					</p>
					<a
						href="https://easyaccordion.io/docs/"
						className="sp-eab-sidebar-info-card-btn"
						target="_blank"
						rel="noreferrer"
					>
						Browse Now
					</a>
				</div>
				<div className="sp-eab-sidebar-info-card">
					<div className="sp-eab-sidebar-info-card-title sp-d-flex sp-align-center sp-gap-10px">
						<span>
							<SupportIcon />
						</span>
						<h4>Technical Support</h4>
					</div>
					<p className="sp-eab-sidebar-info-card-text">
						For personalized assistance, reach out to our skilled support team for prompt help.
					</p>
					<a
						href="https://shapedplugin.com/create-new-ticket/"
						className="sp-eab-sidebar-info-card-btn"
						target="_blank"
						rel="noreferrer"
					>
						Ask Now
					</a>
				</div>
				<div className="sp-eab-sidebar-info-card">
					<div className="sp-eab-sidebar-info-card-title sp-d-flex sp-align-center sp-gap-10px">
						<span>
							<TeamIcon />
						</span>
						<h4>Join The Community</h4>
					</div>
					<p className="sp-eab-sidebar-info-card-text">
						Join the official ShapedPlugin Community to share your experiences, thoughts, and ideas.
					</p>
					<a
						href="https://community.shapedplugin.com/portal/"
						className="sp-eab-sidebar-info-card-btn"
						target="_blank"
						rel="noreferrer"
					>
						Join Now
					</a>
				</div>
			</div>
		</div>
	);
};

export default memo(QuickStart);
