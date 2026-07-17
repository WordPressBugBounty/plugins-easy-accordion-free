import { __ } from "@wordpress/i18n";
import { ProIconLight } from "../../icons";
import { InfoText } from "../settings/template-parts";

const WordPressIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width={17} height={16} fill="none">
		<path
			fill="#6E6A69"
			d="M16.5 8c0-4.408-3.592-8-8-8-4.416 0-8 3.592-8 8 0 4.416 3.584 8 8 8 4.408 0 8-3.584 8-8Zm-9.776 4.296-2.728-7.32c.44-.016.936-.064.936-.064.4-.048.352-.904-.048-.888 0 0-1.16.088-1.896.088-.144 0-.296 0-.464-.008A7.097 7.097 0 0 1 8.5.888c1.864 0 3.56.696 4.84 1.872-.544-.088-1.32.312-1.32 1.264 0 .592.36 1.088.72 1.68.28.488.44 1.088.44 1.968 0 1.192-1.12 4-1.12 4L9.636 4.976c.432-.016.656-.136.656-.136.4-.04.352-1-.048-.976 0 0-1.152.096-1.904.096-.696 0-1.864-.096-1.864-.096-.4-.024-.448.96-.048.976l.736.064 1.008 2.728-1.448 4.664ZM14.428 8c.192-.512.592-1.496.344-3.4.56 1.032.84 2.168.84 3.4 0 2.632-1.384 4.992-3.52 6.224.776-2.072 1.552-4.16 2.336-6.224ZM5.38 14.472C2.996 13.32 1.388 10.824 1.388 8c0-1.04.184-1.984.576-2.872C3.1 8.24 4.236 11.36 5.38 14.472Zm3.224-5.304 2.064 5.584a6.734 6.734 0 0 1-2.168.36 6.301 6.301 0 0 1-1.832-.264c.648-1.904 1.296-3.792 1.936-5.68Z"
		/>
	</svg>
);

const StarIcon = ({ color = "#F4674D" }) => (
	<svg width={16} height={15} viewBox="0 0 16 15" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M7.70547 0L9.84795 5.15113L15.409 5.59696L11.1721 9.22637L12.4665 14.653L7.70547 11.745L2.94441 14.653L4.23887 9.22637L0.00191116 5.59696L5.56299 5.15113L7.70547 0Z"
			fill={color}
		/>
	</svg>
);

const HalfStarIcon = () => (
	<svg width={17} height={17} viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="m8.1 0 2.143 5.151 5.56.446-4.236 3.63 1.294 5.426L8.1 11.745l-4.761 2.908 1.294-5.427L.396 5.597l5.562-.446z"
			fill="#e0e0e0"
		/>
		<path d="m8.1 0-2.142 5.151-5.562.446 4.236 3.63-1.294 5.426L8.1 11.745V0z" fill="#f4674d" />
	</svg>
);

const TrustpilotIcon = () => (
	<svg width="21" height="20" viewBox="0 0 21 20" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="m10.5 15.252 4.563-1.164L16.969 20zM21 7.61h-8.031L10.5 0 8.031 7.61H0l6.5 4.717-2.469 7.61 6.5-4.717 4-2.893z"
			fill="#00b57a"
		/>
	</svg>
);

const features = [
	{
		title: __("All Core Plugin Features", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Gutenberg Accordion Blocks", "easy-accordion-free"),
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
		title: __("Accordion Patterns Library", "easy-accordion-free"),
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
		title: __("Stunning Vertical Q & A, Timeline, Numbered Templates", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Horizontal & Vertical Image Accordion", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Accordion Slider with Image Hover Effects", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		new: true,
		hot: true,
	},
	{
		title: __("Display Posts & Products in FAQ Accordions", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Sidebar Tab Accordion", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Taxonomy or WordPress Menu Accordion", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("FAQ Submission Forms", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		new: true,
	},
	{
		title: __("Create Unlimited Multi-level / Nested Accordion", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
		hot: true,
	},
	// {
	// 	title: __("Create, Edit & Delete FAQs as Needed", "easy-accordion-free"),
	// 	free: "yes",
	// 	pro: "yes",
	// },
	{
		title: __("FAQ Schema Markup (Google rich results)", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
		hot: true,
	},
	{
		title: __("FAQ Analytics (Impressions & Clicks)", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Add FAQ Subtitle & Featured Icon", "easy-accordion-free"),
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
		title: __("Custom Title Linking", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	
	{
		title: __("Accordion Expand/Collapse All Button", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Image Flip & Custom Focal Point", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		new: true,
	},
	{
		title: __("Activator Events (On Click, Hover, AutoPlay)", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Initial Accordion Display (Single, Multiple, Selected)", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Accordion Item Anchor Links (Title / ID)", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("FAQ Close Button (Reduces Long Scrolling)", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("Live Taxonomy Filter for Posts & Products Accordion", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		new: true,
	},
	{
		title: __("Live AJAX FAQs Search", "easy-accordion-free"),
		free: "no",
		pro: "yes",
		hot: true,
	},
	{
		title: __("AJAX FAQ Pagination (Load More, Infinite Scroll & Numbered)", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	
	{
		title: __("Image Lightbox for FAQ Images", "easy-accordion-free"),
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
		title: __("45+ Entrance & Content Animations, Scrolling Effects", "easy-accordion-free"),
		free: "no",
		pro: "yes",
	},
	
	// {
	// 	title: __("Disable / Inactive Specific Accordion Item", "easy-accordion-free"),
	// 	free: "no",
	// 	pro: "yes",
	// },
	// {
	// 	title: __("Display posts from Posts, Pages, Media & Custom Post Types", "easy-accordion-free"),
	// 	free: "no",
	// 	pro: "yes",
	// },
	// {
	// 	title: __("Advanced Post and Product Query Builder", "easy-accordion-free"),
	// 	free: "no",
	// 	pro: "yes",
	// },
	// {
	// 	title: __("Show WooCommerce Product Meta Data", "easy-accordion-free"),
	// 	free: "no",
	// 	pro: "yes",
	// },
	// {
	// 	title: __("Show Post Meta Data", "easy-accordion-free"),
	// 	free: "yes",
	// 	pro: "yes",
	// },
	// {
	// 	title: __("Link Posts and Products to the Single Pages", "easy-accordion-free"),
	// 	free: "no",
	// 	pro: "yes",
	// },
	{
		title: __("Accordion Expand & Collapse Toggle Icon Styles", "easy-accordion-free"),
		free: 8,
		pro: 16,
	},
	{
		title: __("Import / Export Accordion FAQs", "easy-accordion-free"),
		free: "yes",
		pro: "yes",
	},
	{
		title: __("Security Enhancements & Compatibility", "easy-accordion-free"),
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
		user: "wordpress",
		name: "Michael Kastler",
		role: "Managing Director, Newbe Marketing",
		img: "/admin/img/michael.png",
	},
	{
		text: __(
			"My colleagues are very impressed with the result of the multiple accordion. Just what we needed:-) Very useful having the video tutorial, many alternatives don’t. However there is a piece missing from...",
			"easy-accordion-free"
		),
		user: "wordpress",
		name: "Joel Roberts",
		role: "Web Developer",
		img: "/admin/img/joel.png",
	},
	{
		text: __(
			"Nice, simple plugin with a few useful extra options in the Pro version. However, it is the service/support that needs a special mention. I got prompt and helpful replies within a few hours (allowing for...",
			"easy-accordion-free"
		),
		user: "trustpilot",
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
											<span className="sp-eab-settings-info-text"></span>
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
						" people are using Easy Accordion on their websites to create beautiful showcase, why won't you!",
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
					{/* <a
						target="_blank"
						rel="noreferrer"
						className="sp-eab-upgrade-to-pro-btn"
						href="https://easyaccordion.io/blocks/"
					>
						{__("Pro Live Demo", "easy-accordion-free")}
					</a> */}
				</div>
			</div>

			{/* Testimonial Section */}
			<div className="sp-eab-testimonial">
				<div className="sp-eab-testimonial-header">
					<div className="sp-eab-testimonial-ratings">
						<a
							href="https://wordpress.org/support/plugin/easy-accordion-free/reviews/"
							target="_blank"
							rel="noreferrer"
							className="sp-eab-testimonial-rating-item"
							title="Reviews on WordPress"
						>
							<div className="sp-eab-testimonial-rating-wordpress">
								<div className="sp-eab-wp-mark">
									<WordPressIcon />
								</div>
								<div className="sp-eab-wp-text">
									<StarIcon />
									<StarIcon />
									<StarIcon />
									<StarIcon />
									<HalfStarIcon />
								</div>
							</div>
							<span className="sp-eab-testimonial-rating-score">4.5/5</span>
							<span className="sp-eab-testimonial-review-count">350+ Reviews</span>
						</a>
						<a
							href="https://www.trustpilot.com/review/shapedplugin.com"
							target="_blank"
							rel="noreferrer"
							className="sp-eab-testimonial-rating-item"
							title="Reviews on Trustpilot"
						>
							<div className="sp-eab-testimonial-rating-trustpilot">
								<div className="sp-eab-trustpilot-mark">
									<TrustpilotIcon />
								</div>
							</div>
							<div className="sp-eab-trustpilot-stars">
								<StarIcon color="#fff" />
								<StarIcon color="#fff" />
								<StarIcon color="#fff" />
								<StarIcon color="#fff" />
								<StarIcon color="#fff" />
							</div>
							<span className="sp-eab-testimonial-rating-score">4.9/5</span>
							<span className="sp-eab-testimonial-review-count">140+ Reviews</span>
						</a>
					</div>
					<h2 className="sp-eab-testimonial-title">
						{__("Don't Just Take Our Word for It — See What Users Say!", "easy-accordion-free")}
					</h2>
				</div>
				<div className="sp-eab-testimonial-wrap">
					{testimonials?.map((item, index) => (
						<div
							className={`sp-eab-testimonial-card ${item?.user === "trustpilot" ? "sp-eab-testimonial-card-trustpilot" : ""}`}
							key={index}
						>
							<div className="sp-eab-testimonial-card-header">
								<div className="sp-eab-testimonial-reviewer">
									<div className="sp-eab-testimonial-avatar">
										{item?.user === "trustpilot" ? (
											<div className="sp-eab-testimonial-avatar-initials">
												<span>{item.name.slice(0, 2).toUpperCase()}</span>
											</div>
										) : (
											<img
												src={`${sp_eab_admin_dashboard_localize?.pluginUrl}${item?.img}`}
												alt={item?.name}
											/>
										)}
										<div className="sp-eab-testimonial-source-badge">
											{item?.user === "trustpilot" ? <TrustpilotIcon /> : <WordPressIcon />}
										</div>
									</div>
									<div className="sp-eab-testimonial-reviewer-info">
										<h3>{item.name}</h3>
										<p>{item.role}</p>
									</div>
								</div>
							</div>
							<div className="sp-eab-testimonial-rating-stars">
								{item?.user === "trustpilot" ? (
									<div className="sp-eab-testimonial-rating-trustpilot-stars">
										<span className="sp-eab-trustpilot-star-item">
											<StarIcon color="#fff" />
										</span>
										<span className="sp-eab-trustpilot-star-item">
											<StarIcon color="#fff" />
										</span>
										<span className="sp-eab-trustpilot-star-item">
											<StarIcon color="#fff" />
										</span>
										<span className="sp-eab-trustpilot-star-item">
											<StarIcon color="#fff" />
										</span>
										<span className="sp-eab-trustpilot-star-item">
											<StarIcon color="#fff" />
										</span>
									</div>
								) : (
									<span>★★★★★</span>
								)}
							</div>
							<div className="sp-eab-testimonial-card-content">
								<p>{item?.text}</p>
							</div>
						</div>
					))}
				</div>
			</div>
		</section>
	);
};

export default LiteVsPro;
