import { __ } from "@wordpress/i18n";
import { ProIconLight } from "../../icons";
import { InfoText } from "../settings/template-parts";

const features = [
	{
		title: __("All Core Plugin Features", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Advanced Gutenberg Accordion Blocks", "easy-accordion-free"),
		free: 7,
		pro: 15,
		new: true,
		hot: true,
	},
	{
		title: __("Pre-Made Templates (Vertical, Horizontal, Slider, etc.)", "easy-accordion-free"),
		free: 7,
		pro: 25,
	},
	{
		title: __("Ready-to-use Rich Accordion Patterns Library", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Reusable Saved Templates", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("WooCommerce Custom FAQ Tab (Per Product & Category)", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Stunning Vertical Q & A, Timeline, Numbered & Multi Shaped Templates ", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Striking Horizontal & Vertical Image Accordion", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Dynamic Accordion Slider with Image Hover Effects", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		new: true,
		hot: true,
	},
	{
		title: __("Display Posts and Products in FAQ Accordion Blocks", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Create FAQs in compact Sidebar Tab Accordion", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Create an Accordion with Taxonomy or WordPress Menu  (Upcoming)", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Collect Queries using FAQ Forms (Upcoming)", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
		new: true,
	},
	{
		title: __("Create Unlimited Multi-level / Nested Accordion", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Create, Edit & Delete FAQs as Needed", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Schema FAQs Markup Supported", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Get Real-time FAQs Analytics Data", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Accordion Expand & Collapse Toggle Icon Styles", "easy-accordion-free"),
		free: 8,
		pro: 16,
	},
	{
		title: __("Accordion Expand/Collapse All Button", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Live AJAX FAQs Search Bar", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Dynamic Navigation Arrow (10 Styles)", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Multiple AJAX Paginations (Load More, Infinite Scroll, Number, etc.)", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Image Flip & Custom Focal Point", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		new: true,
		hot: true,
	},
	{
		title: __("Advanced Image Lightbox (15+ Icon Styles)", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Upload Custom or Featured Icon from Rich Icon Library", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Control Accordion Items Expanded Area Width", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		new: true,
	},
	{
		title: __("Dynamic Activator Events (On Click, Hover, AutoPlay)", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Initial Accordion Display (Single, Multiple, Selected)", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("20+ Animation Effects for Accordion Content", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("25+ Entrance Animations Effects", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Interactive Vertical Scrolling Effects", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Accordion Item Anchor Links (Title / ID)", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Make Horizontal Accordion in Vertical on Mobile", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		new: true,
	},
	{
		title: __("Reduce Long Scrolling with Close Button", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Disable / Inactive Specific Accordion Item", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Add Subtitle & Featured Icon", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		new: true,
	},
	{
		title: __("Add Prefix & Suffix to Accordion Title", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Enable Custom Title Linking", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Display posts from Posts, Pages, Media & Custom Post Types", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Advanced Post and Product Query Builder", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Powerful Frontend Taxonomy Filter (Button, List)", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		new: true,
	},
	{
		title: __("Show WooCommerce Product Meta Data", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Show Post Meta Data", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Link Posts and Products to the Single Pages", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Import / Export Accordion FAQs", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("All Premium Features, Security Enhancements & Compatibility", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	{
		title: __("Multisite Compatible", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Priority Top-Notch Support", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
];
const testimonials = [
	{
		text: __(
			"Just wanted to drop a quick note to confirm that not only does the plugin operate as well as – if not better then – you’d expect from the description and other reviews here, but also they have o...",
			"easy-accordion-free"
		),
		name: "Michael Kastler",
		role: "Managing Director, Newbe Marketing",
		img: "/admin/img/michael.png",
	},
	{
		text: __(
			"My colleagues are very impressed with the result of the multiple accordion. Just what we needed:-) Very useful having the video tutorial, many alternatives don’t. However there is a piece missing from...",
			"easy-accordion-free"
		),
		name: "Joel Roberts",
		role: "Web Developer",
		img: "/admin/img/joel.png",
	},
	{
		text: __(
			"Nice, simple plugin with a few useful extra options in the Pro version. However, it is the service/support that needs a special mention. I got prompt and helpful replies within a few hours (allowing for...",
			"easy-accordion-free"
		),
		name: "Richard Joss",
		role: "Freelancer, Upwork",
		img: "/admin/img/richard.png",
	},
];

const generateFreeOrProContent = (content) => {
	if (typeof content === "number") {
		return <b>{content}</b>;
	} else {
		if (content === "yes") {
			return <i className="dashicons dashicons-saved"></i>;
		} else if (content === "no") {
			return <i className="dashicons dashicons-no-alt"></i>;
		} else {
			return content;
		}
	}
};

const LiteVsPro = () => {
	return (
		<section className="sp-eab-pro-page" id="lite-pro-tab">
			<div className="sp-eab-pro-table">
				<div className="sp-eab-pro-header">
					<div>
						<h2 className="sp-eab-section-title">{__("Lite vs Pro Comparison", "easy-accordion-free")}</h2>
						<span className="sp-eab-pro-subtitle">
							{__(
								"Get Easy Accordion Pro Today and Unlock all the Powerful Features",
								"easy-accordion-free"
							)}
						</span>
					</div>
					<a
						target="_blank"
						rel="noreferrer"
						href="https://easyaccordion.io/pricing/?ref=1"
						className="sp-eab-upgrade-to-pro-btn"
					>
						{/* <ProIconFill /> */}
						{__("Upgrade to Pro Now!", "easy-accordion-free")}
					</a>
				</div>
				<div className="sp-eab-pro-table-list">
					<ul>
						<li className="sp-eab-pro-table-row sp-eab-header">
							<span className="sp-eab-title">{__("FEATURES", "easy-accordion-free")}</span>
							<span className="sp-eab-free">{__("LITE", "easy-accordion-free")}</span>
							<span className="sp-eab-pro sp-eab-pro-icon">
								<ProIconLight />
								{__("PRO", "easy-accordion-free")}
							</span>
						</li>
						{features.map((item, index) => (
							<li className="sp-eab-pro-table-row" key={index}>
								<span className="sp-eab-title">
									{item?.title}
									{item?.info && <InfoText text={item?.info} />}
									{item?.video && (
										<span className="sp-eab-settings-info">
											{/* <VideoTooltipIcon color="#757575" /> */}
											<span className="sp-eab-settings-info-text">
												{/* <video src={item?.video} autoPlay loop muted /> */}
											</span>
										</span>
									)}
									{item?.new && (
										<span className="sp-eab-new">{__("new", "easy-accordion-free")}</span>
									)}
									{item?.hot && (
										<span className="sp-eab-hot">{__("hot", "easy-accordion-free")}</span>
									)}
								</span>
								<span className="sp-eab-free">{generateFreeOrProContent(item?.free)}</span>
								<span className="sp-eab-pro">{generateFreeOrProContent(item?.pro)}</span>
							</li>
						))}
					</ul>
				</div>
			</div>
			<div className="sp-eab-upgrade-to-pro-promotion">
				<h2 className="sp-eab-section-title">
					{__("Upgrade To PRO & Enjoy Advanced Features!", "easy-accordion-free")}
				</h2>
				<span className="sp-eab-section-subtitle">
					{__("Already, ", "easy-accordion-free")}
					<b>{__("100,000+", "easy-accordion-free")}</b>
					{__(
						" people are using Easy Accordion on their websites to create beautiful showcase, why won’t you!",
						"easy-accordion-free"
					)}
				</span>
				<div className="sp-eab-upgrade-to-pro-btn-wrapper">
					<a
						target="_blank"
						rel="noreferrer"
						href="https://easyaccordion.io/pricing/?ref=1"
						className="sp-eab-upgrade-to-pro-btn"
					>
						{__("Upgrade to Pro Now!", "easy-accordion-free")}
					</a>
					<a
						target="_blank"
						rel="noreferrer"
						href="https://easyaccordion.io/"
						className="sp-eab-upgrade-to-pro-btn"
					>
						{__("See All Features", "easy-accordion-free")}
					</a>
					<a
						target="_blank"
						rel="noreferrer"
						className="sp-eab-upgrade-to-pro-btn"
						href="https://easyaccordion.io/blocks/"
					>
						{__("Pro Live Demo", "easy-accordion-free")}
					</a>
				</div>
			</div>
			<div className="sp-eab-testimonial">
				<div className="sp-eab-testimonial-title-section">
					<span className="sp-eab-testimonial-subtitle">
						{__("NO NEED TO TAKE OUR WORD FOR IT", "easy-accordion-free")}
					</span>
					<h2 className="sp-eab-section-title">
						{__("Our Users Love Easy Accordion Pro!", "easy-accordion-free")}
					</h2>
				</div>
				<div className="sp-eab-testimonial-wrap">
					{testimonials?.map((item, index) => (
						<div className="sp-eab-testimonial-area" key={index}>
							<div className="sp-eab-testimonial-content">
								<p>{item?.text}</p>
							</div>

							<div className="sp-eab-testimonial-info">
								<div className="sp-eab-img">
									<img
										src={`${sp_eab_admin_dashboard_localize?.pluginUrl}${item?.img}`}
										alt={item?.name}
									/>
								</div>

								<div className="sp-eab-info">
									<h3>{item.name}</h3>
									<div className="sp-eab-star">
										<i>★★★★★</i>
									</div>
								</div>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default LiteVsPro;
