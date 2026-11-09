/**
 * Generate FAQs with AI — icons.
 */

const SPARKLE_PATH =
	"M14 3l1.6 5.4L21 10l-5.4 1.6L14 17l-1.6-5.4L7 10l5.4-1.6zM6 14l.8 2.2L9 17l-2.2.8L6 20l-.8-2.2L3 17l2.2-.8zM6 3l.6 1.4L8 5l-1.4.6L6 7l-.6-1.4L4 5l1.4-.6z";

/**
 * Sparkles — trigger and Generate buttons.
 *
 * @param {Object} props
 * @param {number} props.size Width and height in px.
 * @return {JSX.Element} Icon.
 */
export const SparkleIcon = ({ size = 22 }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
		<path d={SPARKLE_PATH} fill="currentColor" />
	</svg>
);

/**
 * Modal logo: the form shows the plain tile, the results add a check badge.
 *
 * @param {Object}  props
 * @param {boolean} props.done Results step.
 */
export const AiLogo = ({ done = false }) => (
	<svg width={56} height={56} viewBox="0 0 56 56" fill="none" aria-hidden="true" focusable="false">
		<defs>
			<linearGradient id="eab-ai-faq-logo" x1="6" y1="6" x2="50" y2="50" gradientUnits="userSpaceOnUse">
				<stop stopColor="#1567FF" />
				<stop offset="1" stopColor="#8B5CF6" />
			</linearGradient>
		</defs>
		<rect x="6" y="6" width="44" height="44" rx="12" fill="url(#eab-ai-faq-logo)" />
		<path d={SPARKLE_PATH} fill="#fff" transform="translate(14 14) scale(1.17)" />
		{done && (
			<>
				<circle cx="45" cy="45" r="9" fill="#12B76A" stroke="#fff" strokeWidth="2.5" />
				<path
					d="M41 45.2l2.6 2.6 5-5.2"
					stroke="#fff"
					strokeWidth="2"
					strokeLinecap="round"
					strokeLinejoin="round"
				/>
			</>
		)}
	</svg>
);

/** Pen with a sparkle — "Rewrite this…". */
export const RewriteIcon = () => (
	<svg width={16} height={16} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
		<path
			d="M4 20h4L18.5 9.5l-4-4L4 16v4zM13 7l4 4"
			stroke="currentColor"
			strokeWidth="1.8"
			strokeLinejoin="round"
		/>
		<path d="M19.5 1.5l.6 1.4 1.4.6-1.4.6-.6 1.4-.6-1.4-1.4-.6 1.4-.6z" fill="currentColor" />
	</svg>
);

export const CloseIcon = ({ size = 22, strokeWidth = 1.7 }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
		<path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth={strokeWidth} />
	</svg>
);

export const ChevronIcon = ({ size = 20, strokeWidth = 1.8 }) => (
	<svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
		<path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth={strokeWidth} fill="none" />
	</svg>
);

export const ReturnIcon = () => (
	<svg width={14} height={14} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
		<path d="M20 5v7H6M10 8l-4 4 4 4" stroke="currentColor" strokeWidth="2" fill="none" />
	</svg>
);

/** Source button glyphs. */
export const SourceIcons = {
	page: () => (
		<svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
			<path d="M6 3h8l4 4v14H6z" stroke="currentColor" strokeWidth="1.5" />
			<path d="M9 11h6M9 14h6M9 17h4" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	),
	post: () => (
		<svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
			<rect x="4" y="4" width="16" height="16" rx="1" stroke="currentColor" strokeWidth="1.5" />
			<path d="M4 8h16M7 11h4v5H7zM13 12h4M13 15h4" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	),
	product: () => (
		<svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
			<path d="M5 8h14l-1 13H6z" stroke="currentColor" strokeWidth="1.5" />
			<path d="M9 10V6a3 3 0 016 0v4" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	),
	url: () => (
		<svg width={18} height={18} viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
			<path
				d="M10 14a4 4 0 005.7 0l3-3a4 4 0 00-5.7-5.7l-1 1M14 10a4 4 0 00-5.7 0l-3 3a4 4 0 005.7 5.7l1-1"
				stroke="currentColor"
				strokeWidth="1.5"
			/>
		</svg>
	),
	file: () => (
		<svg width={18} height={18} viewBox="0 0 24 24" aria-hidden="true" focusable="false">
			<path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.5" />
		</svg>
	),
};

export const GlobeIcon = () => (
	<svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
		<path
			d="M7 12.83A5.83 5.83 0 107 1.17a5.83 5.83 0 000 11.66zM1.17 7h11.66M7 1.17A8.9 8.9 0 019.33 7 8.9 8.9 0 017 12.83 8.9 8.9 0 014.67 7 8.9 8.9 0 017 1.17z"
			stroke="#757575"
			strokeLinecap="round"
			strokeLinejoin="round"
		/>
	</svg>
);

export const ToneIcon = () => (
	<svg width={14} height={14} viewBox="0 0 14 14" fill="none" aria-hidden="true" focusable="false">
		<g stroke="#757575" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round">
			<path d="M12.79 7.95c.46.46.71 1.07.71 1.72 0 .65-.25 1.26-.71 1.72" />
			<path d="M11.64 9.1c.32.32.32.83 0 1.14" />
			<path d="M9.67 5.89v-.54a4.59 4.59 0 10-9.17 0V6c0 1.46.7 2.82 1.89 3.67v3.56h4.85v-1.67h1.62c.45 0 .81-.36.81-.81v-.54l-1.08-.67 1.08-.67V7.78l1.08-.27-1.08-1.62z" />
			<path d="M4.6 7.98c-.31.45-.85.5-1.33.08-.57-.5-.83-1.49-.59-2.21.2-.6.7-.82 1.19-.59" />
		</g>
	</svg>
);
