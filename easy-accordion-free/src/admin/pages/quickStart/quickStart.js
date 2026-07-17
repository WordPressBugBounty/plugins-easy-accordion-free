import { DocIcon, TeamIcon, ProIconLight } from "../../icons";
import {
	AiFaqIcon,
	BlocksIcon,
	PatternsIcon,
	WooIcon,
	FaqSearchIcon,
	AnimationIcon,
	IconPacksIcon,
	StylingIcon,
	SchemaIcon,
	CustomCssIcon,
	ArrowRight,
	PlayIcon,
} from "./icons";
import { __ } from "@wordpress/i18n";
import { useState, useEffect, useMemo } from "@wordpress/element";
import { useDispatch, useSelect } from "@wordpress/data";
import { toast } from "react-hot-toast";
import ToggleCard from "../../templates/toggleCard";
import { STORE_NAME } from "../../store/constants";
import RenderModuleCard from "../modules/render";
import { ModulesItems } from "../modules";

// Modules to display in quick start grid (first 4 modules)
const quickStartModules = ["generate_faqs_with_ai", "saved_templates", "pattern_library", "seo_schema_markup"];

// Blocks to display in quick start grid (10 blocks)
const quickStartBlocks = [
	"sp-easy-accordion-pro/vertical-accordion",
	"sp-easy-accordion-pro/horizontal-accordion",
	"sp-easy-accordion-pro/image-accordion",
	"sp-easy-accordion-pro/accordion-slider",
	"sp-easy-accordion-pro/sidebar-tab-accordion",
	// "sp-easy-accordion-pro/post-accordion",
	// "sp-easy-accordion-pro/product-accordion",
	"sp-easy-accordion-pro/menu-accordion",
	// "sp-easy-accordion-pro/media-accordion",
	// "sp-easy-accordion-pro/user-faq-form",
];

// Pro features list (from Figma design)
const sparkleIcon = (
	<svg width="13" height="13" viewBox="0 0 13 13" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path
			d="M6.47461 1.24707C6.85097 3.76847 8.83144 5.7481 11.3525 6.125L12.5225 6.2998L11.3525 6.47461C8.83157 6.85179 6.85112 8.83112 6.47461 11.3525L6.2998 12.5225L6.125 11.3525C5.74845 8.83092 3.76819 6.85166 1.24707 6.47461L0.0761719 6.2998L1.24707 6.125C3.76832 5.74824 5.7486 3.76856 6.125 1.24707L6.2998 0.0761719L6.47461 1.24707Z"
			fill="#FF734C"
			stroke="#FF734C"
			strokeWidth="0.0224423"
		/>
	</svg>
);

const proFeatures = [
	{
		url: "https://easyaccordion.io/generate-high-converting-faqs-withpowerful-ai-in-seconds/",
		icon: sparkleIcon,
		label: __("Unlimited FAQs Generation with AI", "easy-accordion-free"),
		hot: true,
	},
	{
		url: "https://easyaccordion.io/patterns/",
		icon: sparkleIcon,
		label: __("200+ Ready Patterns Library", "easy-accordion-free"),
	},
	{
		url: "https://easyaccordion.io/blocks/",
		icon: sparkleIcon,
		label: __("15+ Powerful Gutenberg Blocks", "easy-accordion-free"),
	},
	{
		url: "https://easyaccordion.io/patterns/#accordion-slider",
		icon: sparkleIcon,
		label: __("Interactive Accordion Slider", "easy-accordion-free"),
	},
	{
		url: "https://easyaccordion.io/core-accordion-content-features/#FAQ-Title-Prefix-&-Suffix",
		icon: sparkleIcon,
		label: __("FAQ Title Badges, Prefix & Suffix", "easy-accordion-free"),
		hot: true,
	},
	{
		url: "https://easyaccordion.io/core-accordion-content-features/#Accordion-Featured-Icon",
		icon: sparkleIcon,
		label: __("Accordion Subtitles & Featured Icon", "easy-accordion-free"),
		// hot: true,
	},
	{
		url: "https://easyaccordion.io/faq-title-custom-linking/",
		icon: sparkleIcon,
		label: __("FAQ Title Custom Linking", "easy-accordion-free"),
	},
	{
		url: "https://easyaccordion.io/woocommerce-product-faqs-tab/",
		icon: sparkleIcon,
		label: __("WooCommerce Product FAQ Tab", "easy-accordion-free"),
	},
	{
		url: "https://easyaccordion.io/add-smart-faq-search-filters-to-help-usersfind-answers-faster/",
		icon: sparkleIcon,
		label: __("Frontend Live Taxonomy Filter", "easy-accordion-free"),
	},
	{
		url: "https://easyaccordion.io/faq-analytics/",
		icon: sparkleIcon,
		label: __("FAQ Analytics (Impressions & Clicks)", "easy-accordion-free"),
		// hot: true,
	},
	{
		url: "https://easyaccordion.io/user-faq-forms/",
		icon: sparkleIcon,
		label: __("User FAQ Submission Forms", "easy-accordion-free"),
	},
	{
		url: "https://easyaccordion.io/accordion-animation/",
		icon: sparkleIcon,
		label: __("Motion Effects & Animations", "easy-accordion-free"),
	},
];

// Helper: Capitalize first letter
const capitalize = (str) => str.charAt(0).toUpperCase() + str.slice(1);

const QuickStart = ({ setPageAndHash }) => {
	// Redux state management (same as BlockVisibility)
	const blockVisibility = useSelect((select) => select(STORE_NAME).getBlockVisibility());
	const dashboardSettings = useSelect((select) => select(STORE_NAME).getDashboardSettings());
	const { saveSettings } = useDispatch(STORE_NAME);

	const [isVideoModalOpen, setIsVideoModalOpen] = useState(false);
	const [userName, setUserName] = useState("");

	// Memoized greeting based on time of day
	const greeting = useMemo(() => {
		const hour = new Date().getHours();
		if (hour < 12) {
			return __("Good morning", "easy-accordion-free");
		}
		if (hour < 17) {
			return __("Good afternoon", "easy-accordion-free");
		}
		if (hour < 21) {
			return __("Good evening", "easy-accordion-free");
		}
		return __("Good night", "easy-accordion-free");
	}, []);

	// Fetch user name on mount
	useEffect(() => {
		const getUserName = () => {
			// Priority: Localized data
			if (sp_eab_admin_dashboard_localize?.current_user) {
				return capitalize(sp_eab_admin_dashboard_localize.current_user);
			}

			// Fallback: wp.data store
			try {
				const store = wp.data?.select("core");
				if (store) {
					const user = store.getCurrentUser?.() || store.currentUser;
					return user?.display_name || user?.name || "";
				}
			} catch {
				// Silent fail
			}

			return "";
		};

		const name = getUserName();
		if (name) {
			setUserName(`, ${name}`);
		}
	}, []);

	// Notification message (same as BlockVisibility)
	const show_notification = (block) => {
		const message = block.show
			? __("Block disabled successfully", "easy-accordion-free")
			: __("Block enabled successfully", "easy-accordion-free");
		toast.success(message, { style: { marginTop: "20px", fontSize: "14px" } });
	};

	// Handler to toggle block visibility (same as BlockVisibility)
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

	const handleViewMoreBlocks = () => {
		setPageAndHash("blocks");
		setTimeout(() => window.scrollTo(0, 0), 100);
	};

	const handleBlockInsert = (blockName) => {
		const url = `${sp_eab_admin_dashboard_localize?.homeUrl}wp-admin/post-new.php?post_type=page&eabblock_inserter=true&eab_auto_insert=${blockName}`;
		window.location.href = url;
	};

	return (
		<div className="speap-settings-getting-start-page">
			<div className="speap-settings-getting-start-page-content">
				{/* Left Side */}
				<div className="speap-qs-left">
					{/* About Section */}
					<div className="speap-qs-about-section">
						<div className="speap-qs-about-content">
							<div className="speap-qs-about-text">
								<p className="speap-qs-greeting">{greeting + userName}</p>
								<h3 className="speap-qs-welcome-title">
									{__("Welcome to Easy Accordion!", "easy-accordion-free")}
								</h3>
								<p className="speap-qs-welcome-desc">
									{__(
										"Thank you for installing Easy Accordion! Start creating your FAQs directly in the visual block editor. Enjoy!",
										"easy-accordion-free"
									)}
								</p>
								<a
									href={`${sp_eab_admin_dashboard_localize?.homeUrl}wp-admin/post-new.php?post_type=page&eabblock_inserter=true&eab_auto_insert=sp-easy-accordion-pro/vertical-accordion`}
									className="speap-qs-create-btn"
								>
									<i className="dashicons dashicons-plus-alt2"></i>
									{__("Add Your First FAQs / Accordion", "easy-accordion-free")}
								</a>
							</div>
							<div className="speap-qs-video-wrapper">
								<img
									src={`${sp_eab_admin_dashboard_localize?.pluginUrl}/admin/img/video-overlay.jpg`}
									alt={__("Video Tutorial", "easy-accordion-free")}
									className="speap-qs-video-placeholder"
								/>
								<button className="speap-qs-play-btn" onClick={() => setIsVideoModalOpen(true)}>
									<PlayIcon color={"#F26C0D"} />
								</button>
							</div>
						</div>
					</div>

					{/* Accordion Blocks Section */}
					<div className="speap-qs-blocks-section sp-eab-visibility-page">
						<div className="speap-qs-section-header">
							<h3 className="speap-qs-section-title">{__("Accordion Blocks", "easy-accordion-free")}</h3>
							<button className="speap-qs-view-more-btn" onClick={handleViewMoreBlocks}>
								{__("View All Blocks", "easy-accordion-free")}
								<ArrowRight />
							</button>
						</div>
						<div className="speap-qs-blocks-grid sp-eab-all-block-list sp-d-grid sp-grid-cols-2">
							{quickStartBlocks.map((blockName) => {
								const blockSetting = blockVisibility?.find((b) => b.name === blockName);
								const attributes = {
									name: blockName,
									show: blockSetting ? blockSetting.show : true,
								};
								return (
									<ToggleCard
										key={blockName}
										attributes={attributes}
										onlyLiveDemo={true}
										blockShowHideHandler={blockShowHideHandler}
										type="quick-start"
									/>
								);
							})}
						</div>
						<div className="speap-qs-blocks-gradient"></div>
					</div>

					{/* Documentation & Support Cards */}
					<div className="speap-qs-info-cards-section" style={{ display: "flex", gap: "24px" }}>
						{/* Documentation Card */}
						<div className="speap-qs-info-card">
							<div className="speap-qs-info-header">
								<div className="speap-qs-info-icon">
									<DocIcon />
								</div>
								<h4 className="speap-qs-info-title">{__("Documentation", "easy-accordion-free")}</h4>
							</div>
							<div className="speap-qs-info-content-wrapper">
								<p className="speap-qs-info-desc">
									{__(
										"Explore Easy Accordion plugin capabilities in our enriched documentation.",
										"easy-accordion-free"
									)}
								</p>
								<div className="speap-qs-info-link-wrapper">
									<a
										href="https://easyaccordion.io/docs/"
										target="_blank"
										rel="noreferrer"
										className="speap-qs-info-link"
									>
										{__("Browse Now", "easy-accordion-free")}
										<ArrowRight />
									</a>
								</div>
							</div>
						</div>

						{/* Technical Support Card */}
						<div className="speap-qs-info-card">
							<div className="speap-qs-info-header">
								<div className="speap-qs-info-icon">
									<TeamIcon />
								</div>
								<h4 className="speap-qs-info-title">{__("Technical Support", "easy-accordion-free")}</h4>
							</div>
							<div className="speap-qs-info-content-wrapper">
								<p className="speap-qs-info-desc">
									{__(
										"For personalized assistance, reach out to our skilled support team for prompt help.",
										"easy-accordion-free"
									)}
								</p>
								<div className="speap-qs-info-link-wrapper">
									<a
										href="https://easyaccordion.io/support/"
										target="_blank"
										rel="noreferrer"
										className="speap-qs-info-link"
									>
										{__("Ask Now", "easy-accordion-free")}
										<ArrowRight />
									</a>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* Right Side - Sidebar */}
				<div className="speap-qs-sidebar">
					{/* Accordion Patterns Library Card */}
					<div className="speap-qs-patterns-card">
						<div className="speap-qs-patterns-image">
							<div className="speap-qs-patterns-bg"></div>
							<img
								src={`${sp_eab_admin_dashboard_localize?.pluginUrl}/admin/img/patterns-card.png`}
								alt={__("Accordion Patterns", "easy-accordion-free")}
								className="speap-qs-patterns-cards"
							/>
							<span className="speap-qs-hot-tag">{__("Hot", "easy-accordion-free")}</span>
							<div className="speap-qs-patterns-gradient">
								<span className="speap-qs-patterns-text">200+ Ready Patterns Library</span>
							</div>
						</div>
						<div className="speap-qs-patterns-content">
							<h4 className="speap-qs-patterns-title">
								{__("Ready Accordion Patterns Made Easy", "easy-accordion-free")}
							</h4>
							<p className="speap-qs-patterns-desc">
								{__(
									"Choose from beautifully crafted accordion layouts and launch stunning FAQs in seconds.",
									"easy-accordion-free"
								)}
							</p>
							<div className="speap-qs-patterns-btn-wrapper">
								<a
									href={`${sp_eab_admin_dashboard_localize?.homeUrl}wp-admin/post-new.php?post_type=page&eab_pattern_library`}
									className="speap-qs-patterns-btn"
								>
									{__("Start with Ready Patterns", "easy-accordion-free")}
								</a>
							</div>
						</div>
					</div>

					{/* Go Pro Card */}
					<div className="speap-qs-pro-card">
						<div className="speap-qs-pro-content">
							<div className="speap-qs-pro-header">
								<h4 className="speap-qs-pro-title">
									{__("Go Pro & Unlock More! 🚀", "easy-accordion-free")}
								</h4>
								<p className="speap-qs-pro-desc">
									{__(
										"Unlock the full potential of Easy Accordion to create and manage FAQs / accordions.",
										"easy-accordion-free"
									)}
								</p>
							</div>
							<div className="speap-qs-pro-features">
								{proFeatures.map((feature, index) => (
									<a
										key={index}
										href={feature.url}
										target="_blank"
										rel="noreferrer"
										className="speap-qs-pro-feature"
									>
										<span className="speap-qs-pro-icon">{feature.icon}</span>
										<span>
											{feature.label}
											{feature.hot && " 🔥"}
										</span>
										<ArrowRight className="speap-qs-pro-feature-arrow" />
									</a>
								))}
							</div>
							<div className="speap-qs-pro-buttons">
								<a
									href="https://easyaccordion.io/pricing/?ref=1"
									target="_blank"
									rel="noreferrer"
									className="speap-qs-pro-upgrade-btn"
								>
									<ProIconLight />
									{__("Upgrade to Pro", "easy-accordion-free")}
								</a>
								<button
									onClick={() => {
										setPageAndHash("lite_vs_pro");
										setTimeout(() => window.scrollTo(0, 0), 100);
									}}
									className="speap-qs-pro-compare-btn"
								>
									{__("Lite vs Pro", "easy-accordion-free")}
								</button>
							</div>
						</div>
					</div>
				</div>
			</div>

			{/* Video Modal */}
			{isVideoModalOpen && (
				<div className="speap-qs-video-modal" onClick={() => setIsVideoModalOpen(false)}>
					<div className="speap-qs-video-modal-content" onClick={(e) => e.stopPropagation()}>
						<button className="speap-qs-video-modal-close" onClick={() => setIsVideoModalOpen(false)}>
							×
						</button>
						<div className="speap-qs-video-modal-wrapper">
							<iframe
								width="100%"
								height="100%"
								src="https://www.youtube.com/embed/u3lRDX0zG9Y?si=uG_yZ6xfFjWkRqqW&autoplay=1"
								title="YouTube video player"
								frameBorder="0"
								allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
								allowFullScreen
							></iframe>
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default QuickStart;
