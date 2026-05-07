import { Arrow } from "../../icons";
import { __ } from "@wordpress/i18n";

const AboutUs = () => {
	return (
		<section id="about-us-tab" className="sp-eab-about-page">
			<div className="sp-eab-about-box">
				<div className="sp-eab-about-info">
					<h3>
						{__("The Most Powerful Accordion and FAQs Builder plugin for WordPress", "easy-accordion-free")}
					</h3>
					<p>
						{__("At", "easy-accordion-free")} <b>{__("ShapedPlugin LLC,", "easy-accordion-free")}</b>{" "}
						{__(
							"we have been looking for the best way to create FAQ pages or sections on WordPress sites. Unfortunately, we couldn't find any suitable plugin that met our needs. Hence, we set a simple goal: to develop a highly customizable and full-featured Accordion and FAQs builder plugin to minimize customer support costs.",
							"easy-accordion-free"
						)}{" "}
						<br />
						<br />
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
		</section>
	);
};

export default AboutUs;
