import { Arrow } from "../../icons";
import { ArrowRight } from "../../icons";
import { __ } from "@wordpress/i18n";
import {
	SmartPostIcon,
	EasyAccordionIcon,
	SmartTabsIcon,
	WooGalleryIcon,
	WPCarouselIcon,
	LogoShowcaseIcon,
	RealTestimonialIcon,
	WooProductIcon,
	SmartSwatch,
	WooCategoryIcon,
	SmartTeam,
	SmartBrand,
	LocationWeatherIcon,
} from "./icon";

// Plugin data for showcase - matching location-weather design
const morePlugins = [
	{
		name: "WP Carousel",
		description:
			"The most powerful and user-friendly multi-purpose carousel, slider, & gallery plugin for WordPress.",
		url: "https://wpcarousel.io/",
		icon: <WPCarouselIcon />,
	},
	{
		name: "Real Testimonial",
		description: "Simply collect, manage, and display Testimonials on your website and boost conversions.",
		url: "https://realtestimonials.io/",
		icon: <RealTestimonialIcon />,
	},
	{
		name: "Smart Tabs",
		description: "Best WooCommerce Custom Product Tabs & WordPress Tabs Builder Plugin to create responsive tabs.",
		url: "https://wptabs.com/",
		icon: <SmartTabsIcon />,
	},
	{
		name: "Smart Post",
		description:
			"Filter and display posts (any post types), pages, taxonomy, custom taxonomy, and custom field, in beautiful layouts.",
		url: "https://wpsmartpost.com/",
		icon: <SmartPostIcon />,
	},
	{
		name: "Smart Team",
		description: "Simply collect, manage, and display Testimonials on your website and boost conversions.",
		url: "https://getwpteam.com/",
		icon: <SmartTeam />,
	},
	{
		name: "Logo Carousel",
		description:
			"Showcase a group of logo images with Title, Description, Tooltips, Links, and Popup as a grid or in a carousel.",
		url: "https://logocarousel.com/",
		icon: <LogoShowcaseIcon />,
	},
	{
		name: "Location Weather",
		description:
			"Display beautiful weather update widgets to your WordPress site in a minute without coding skills!",
		url: "https://locationweather.io/",
		icon: <LocationWeatherIcon />,
	},
	{
		name: "WooGallery",
		description:
			"Product gallery slider and additional variation images gallery for WooCommerce and boost your sales.",
		url: "https://woogallery.io/",
		icon: <WooGalleryIcon />,
	},
	{
		name: "Product Slider for WooCommerce",
		description: "Boost sales by interactive product Slider, Grid, and Table in your WooCommerce website or store.",
		url: "https://wooproductslider.io/",
		icon: <WooProductIcon />,
	},
	{
		name: "WooCategory",
		description: "Display by filtering the list of categories aesthetically and boosting sales.",
		url: "https://shapedplugin.com/woocategory/",
		icon: <WooCategoryIcon />,
	},
	{
		name: "Smart Swatches",
		description: "Smart Swatches is a Best Product Variation Swatches for WooCommerce to Boost Your Store Sales.",
		url: "https://shapedplugin.com/smart-swatches-for-woocommerce",
		icon: <SmartSwatch />,
	},
	{
		name: "Smart Brands",
		description:
			"Smart Brands for WooCommerce Pro helps you display product brands in an attractive way on your online store.",
		url: "https://shapedplugin.com/smart-brands/",
		icon: <SmartBrand />,
	},
];

const AboutUs = () => {
	return (
		<section id="about-us-tab" className="sp-eab-about-page">
			<div className="sp-eab-about-box">
				<div className="sp-eab-about-info">
					<h3>
						{__(
							"The Most Powerful Accordion and FAQs Builder plugin for WordPress from the ",
							"easy-accordion-free"
						)}
						<span className="sp-eab-highlight-text">{__("ShapedPlugin Team", "easy-accordion-free")}</span>
					</h3>
					<p>
						{__("At", "easy-accordion-free")} <b>{__("ShapedPlugin LLC,", "easy-accordion-free")}</b>{" "}
						{__(
							"we have been looking for the best way to create FAQ pages or sections on WordPress sites. Unfortunately, we couldn't find any suitable plugin that met our needs. Hence, we set a simple goal: to develop a highly customizable and full-featured Accordion and FAQs builder plugin to minimize customer support costs.",
							"easy-accordion-free"
						)}{" "}
						{__(
							"The Easy Accordion plugin provides a convenient way to create visually appealing FAQ pages to reduce customer costs. Check it out now and experience the difference!",
							"easy-accordion-free"
						)}
					</p>
					<div className="sp-eab-video-section-btn">
						<ul>
							<li>
								<a
									target="_blank"
									rel="noreferrer"
									href="https://easyaccordion.io/"
									className="sp-eab-medium-btn"
								>
									{__("Explore Easy Accordion", "easy-accordion-free")}
								</a>
							</li>
							<li>
								<a
									target="_blank"
									rel="noreferrer"
									href="https://shapedplugin.com/about-us/"
									className="sp-eab-medium-btn sp-eab-arrow-btn"
								>
									{__("More About Us ", "easy-accordion-free")} <Arrow />
								</a>
							</li>
						</ul>
					</div>
				</div>
				<div className="sp-eab-about-img">
					<img
						src={`${sp_eab_admin_dashboard_localize?.pluginUrl}admin/img/shapedplugin-team.jpg`}
						alt="Team"
						height="402"
						width="610"
					/>
					<span>{__("The Creative Minds Behind the Easy Accordion Plugin", "easy-accordion-free")}</span>
				</div>
			</div>

			{/* More Plugins Section */}
			<div className="sp-eab-more-plugins-section">
				<div className="sp-eab-more-plugins-header">
					<h2 className="sp-eab-more-plugins-title">
						{__("Your Website Deserves More Than Typical — Go Premium Today!", "easy-accordion-free")}
					</h2>
					<p className="sp-eab-more-plugins-subtitle">
						{__(
							"Unlock powerful plugins built to boost performance, elevate design, and grow your business.",
							"easy-accordion-free"
						)}
					</p>
				</div>
				<div className="sp-eab-more-plugins-grid">
					{morePlugins.map((plugin) => (
						<a
							key={plugin.name}
							href={plugin.url}
							target="_blank"
							rel="noopener noreferrer"
							className="sp-eab-plugin-card"
						>
							<div className="sp-eab-plugin-card-icon">{plugin.icon}</div>
							<div className="sp-eab-plugin-card-content">
								<h3 className="sp-eab-plugin-card-title">{plugin.name}</h3>
								<p className="sp-eab-plugin-card-desc">{plugin.description}</p>
							</div>
							<span className="sp-eab-plugin-card-arrow">
								<ArrowRight />
							</span>
						</a>
					))}
				</div>
			</div>
		</section>
	);
};

export default AboutUs;
