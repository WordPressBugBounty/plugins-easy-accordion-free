import { FacebookIcon, LoveIcon, TwitterXIcon, WordPressIcon, YoutubeIcon } from "../icons";

const Footer = () => {
	const socialMediaUrl = [
		{
			name: "Facebook",
			url: "https://www.facebook.com/ShapedPlugin",
			Icon: FacebookIcon,
		},
		{
			name: "X",
			url: "https://x.com/ShapedPlugin",
			Icon: TwitterXIcon,
		},
		{
			name: "WordPress",
			url: "https://profiles.wordpress.org/shapedplugin",
			Icon: WordPressIcon,
		},
		{
			name: "Youtube",
			url: "https://www.youtube.com/@ShapedPlugin",
			Icon: YoutubeIcon,
		},
	];

	return (
		<div className="sp-eab-admin-dashboard-footer">
			<div className="sp-eab-admin-dashboard-footer-wrapper sp-d-flex sp-flex-col sp-align-center">
				<div className="sp-eab-admin-dashboard-footer-title sp-d-flex sp-align-center">
					<h4 className="sp-d-flex sp-align-center">
						Made with <LoveIcon /> by the{" "}
						<a
							href="https://shapedplugin.com"
							target="_blank"
							rel="noreferrer"
							className="sp-eap-company-name"
						>
							ShapedPlugin LLC
						</a>{" "}
						Team
					</h4>
				</div>
				<div className="sp-eab-admin-dashboard-footer-social-media">
					<h4>Get connected with</h4>
					<ul>
						{socialMediaUrl?.map(({ Icon, name, url }, i) => (
							<li title={name} key={i}>
								<a href={url} target="_blank" rel="noreferrer">
									<Icon />
								</a>
							</li>
						))}
					</ul>
				</div>
			</div>
		</div>
	);
};

export default Footer;
