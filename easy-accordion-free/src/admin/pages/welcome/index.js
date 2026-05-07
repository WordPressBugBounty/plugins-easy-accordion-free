import { __ } from "@wordpress/i18n";
import { useState } from "@wordpress/element";

const FeatureCheckIcon = () => (
	<svg width={14} height={14} viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M11.376 6.139a.62.62 0 0 0-.622.622v4.5a.474.474 0 0 1-.474.473H2.156a.474.474 0 0 1-.474-.473V3.136c0-.261.213-.473.474-.473H8.82a.622.622 0 0 0 0-1.245H2.156A1.72 1.72 0 0 0 .437 3.136v8.125a1.72 1.72 0 0 0 1.719 1.718h8.124A1.72 1.72 0 0 0 12 11.26v-4.5a.62.62 0 0 0-.623-.622"
			fill="#ff5b2e"
		/>
		<path
			d="M12.5 1.204 5.576 8.153l-1.78-1.786a.622.622 0 0 0-.881.88L4.893 9.23a.96.96 0 0 0 .684.285.96.96 0 0 0 .684-.285l7.12-7.147a.622.622 0 1 0-.882-.879"
			fill="#ff5b2e"
		/>
	</svg>
);

const WelcomePage = () => {
	const [showVideo, setShowVideo] = useState(false);
	const featureLists = [
		{
			title: __("Vertical & Horizontal Accordion", "easy-accordion-free"),
		},
		{
			title: __("FAQ Search & Pagination", "easy-accordion-free"),
			hot: true,
		},
		{
			title: __("Image and Accordion Slider", "easy-accordion-free"),
			hot: true,
		},
		{
			title: __("FAQ Analytics & FAQ Form", "easy-accordion-free"),
		},
		{
			title: __("Post and Product Accordion", "easy-accordion-free"),
		},
		{
			title: __("Generate FAQs with AI", "easy-accordion-free"),
			upcoming: true,
		},
		{
			title: __("Menu and Category Accordion", "easy-accordion-free"),
		},
		{
			title: __("Easy Customization Options", "easy-accordion-free"),
		},
	];

	const hour = new Date().getHours();
	let greeting = "Good Night";

	if (hour >= 5 && hour < 12) {
		greeting = "Good Morning";
	} else if (hour >= 12 && hour < 17) {
		greeting = "Good Afternoon";
	} else if (hour >= 17 && hour < 21) {
		greeting = "Good Evening";
	}
	// const greeting = sp_eab_admin_dashboard_localize?.greeting;
	const userName = sp_eab_admin_dashboard_localize?.userName;
	return (
		<div className="sp-eap-setup-welcome-page sp-d-flex sp-align-center">
			<div className="sp-eap-setup-welcome-page-left sp-d-flex sp-flex-col">
				<div className="sp-eap-setup-welcome-page-greeting">
					{greeting}, {userName}
				</div>
				<h3 className="sp-eap-setup-page-title sp-welcome-title">
					Welcome to <span>Easy Accordion!</span>
				</h3>
				<p className="sp-eap-setup-page-desc">
					Thanks for installing Easy Accordion — This plugin gives you everything you need to create clean and
					interactive accordion sections, without touching a line of code.
				</p>
				<p className="sp-eap-setup-page-desc">
					Get set up in minutes and start showcasing accordions using
					<b> 15+ flexible blocks and 100+ ready-made patterns.</b> Packed with features, including:
				</p>
				<div className="sp-eap-setup-feature-lists sp-d-grid sp-grid-cols-2 sp-gap-10px">
					{featureLists?.map((item, index) => (
						<div key={index} className="sp-eap-setup-feature-list sp-d-flex sp-align-center sp-gap-8px">
							<span className="sp-eap-setup-feature-check-icon">
								<FeatureCheckIcon />
							</span>
							<span className="sp-eap-feature-list-title">
								{item.title}

								{item.hot && <span className="sp-eap-badge-hot">HOT</span>}

								{item.upcoming && <span className="sp-eap-badge-upcoming">Upcoming</span>}
							</span>
						</div>
					))}
				</div>
			</div>
			<div
				className="sp-eap-setup-welcome-page-right sp-d-flex"
				style={{
					backgroundImage: `url(${sp_eab_admin_dashboard_localize?.pluginUrl}admin/img/setup-wizard/video-thumbnail.png)`,
				}}
			>
				{showVideo ? (
					<iframe
						width="510"
						height="410"
						src="https://www.youtube.com/embed/videoseries?list=PLoUb-7uG-5jPNXkpGII8cTTfB-L4TCaqv&autoplay=1"
						title="YouTube video player"
						allow="autoplay; encrypted-media"
					></iframe>
				) : (
					<div className="sp-eap-setup-video-overlay sp-d-flex sp-align-center sp-justify-center">
						<button
							id="sp-eap-play-btn"
							className="sp-eap-play-btn-sonar sp-d-flex sp-align-center sp-justify-center sp-cursor-pointer"
							onClick={() => setShowVideo(true)}
						>
							<img
								src={`${sp_eab_admin_dashboard_localize?.pluginUrl}admin/img/setup-wizard/video-play.svg`}
								alt="video-play"
							/>
						</button>
					</div>
				)}
			</div>
		</div>
	);
};

export default WelcomePage;
