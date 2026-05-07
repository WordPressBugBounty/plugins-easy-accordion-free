import { __ } from "@wordpress/i18n";

const ProIcon = () => (
	<svg xmlns="http://www.w3.org/2000/svg" width={16} height={16} fill="none" viewBox="0 0 16 16">
		<path
			className="sp-pro-icon-stroke"
			stroke="#3D9E56"
			strokeWidth={1.185}
			d="M10.384 5.882c.18.329.478.572.842.648.322.068.652-.007.922-.203l.112-.092 1.396-1.279 1.159-1.062-.81 6.437H2.124l-.812-6.437 2.556 2.341c.288.264.666.373 1.035.295.364-.076.662-.32.841-.648l2.32-4.254 2.32 4.254Z"
		/>
		<path
			className="sp-pro-icon-fill"
			fill="#3D9E56"
			d="M13.851 14.873H2.274c-.373 0-.674-.369-.674-.824V12.24h12.925v1.81c0 .454-.301.823-.674.823Z"
		/>
	</svg>
);

const ProNotice = ({
	title = __("Pro Features", "easy-accordion-free"),
	message = "",
	link = "https://easyaccordion.io/pricing/",
	linkText = "Upgrade to Pro!",
	className = "",
	features = [],
	subtitle = "",
	icon = true,
	panelNotice = false,
	linkButton = false,
}) => {
	return (
		<div className={`sp-block-pro-notice ${className}`}>
			{features.length > 0 ? (
				<>
					<div className="sp-pro-notice-header sp-d-flex">
						{icon && <div className="sp-pro-notice-icon">{<ProIcon />}</div>}
						<h4 className="sp-pro-notice-title">{title}</h4>
					</div>
					<div className="sp-pro-notice-subtitle">{subtitle}</div>
					<ul className="sp-pro-notice-list">
						{features.map((item, i) => (
							<li key={i}>{item}</li>
						))}
					</ul>
					{linkButton && (
						<div className="sp-pro-button-wrapper sp-d-flex sp-justify-center">
							<a
								href={link}
								className="sp-pro-notice-button normal sp-d-i-flex sp-align-center sp-justify-center"
								target="_blank"
								rel="noopener noreferrer"
							>
								{__(linkText, "easy-accordion-free")}
							</a>
						</div>
					)}
				</>
			) : panelNotice ? (
				<>
					<div className="sp-pro-notice-header sp-d-flex sp-flex-col sp-justify-center sp-align-center">
						{icon && <div className="sp-pro-notice-icon">{<ProIcon />}</div>}
						<h4 className="sp-pro-notice-title">{title}</h4>
					</div>
					<div className="sp-pro-notice-message">{message}</div>
					<div className="sp-pro-button-wrapper sp-d-flex sp-justify-center">
						<a
							href={link}
							className="sp-pro-notice-button sp-d-i-flex sp-align-center sp-justify-center"
							target="_blank"
							rel="noopener noreferrer"
						>
							{__(linkText, "easy-accordion-free")}
						</a>
					</div>
				</>
			) : (
				<>
					{message}{" "}
					<a href={link} target="_blank" rel="noopener noreferrer">
						{__(linkText, "easy-accordion-free")}
					</a>
				</>
			)}
		</div>
	);
};

export default ProNotice;
