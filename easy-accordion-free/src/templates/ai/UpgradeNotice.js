import { __, sprintf } from "@wordpress/i18n";
import { createInterpolateElement, memo } from "@wordpress/element";
import { FREE_MAX_FAQS, UPGRADE_URL } from "./constants";

/**
 * The free plan's AI limit, above the form: a note before the accordion's
 * one run, an upgrade prompt after it.
 *
 * @param {Object}  props
 * @param {boolean} props.limitReached The accordion already used its free run.
 * @return {JSX.Element} Notice.
 */
const UpgradeNotice = ({ limitReached }) => {
	const link = (
		// eslint-disable-next-line jsx-a11y/anchor-has-content -- content supplied by createInterpolateElement
		<a className="eab-ai-faq-upgrade__link" href={UPGRADE_URL} target="_blank" rel="noreferrer" />
	);

	if (limitReached) {
		return (
			<div className="eab-ai-faq-alert is-error eab-ai-faq-upgrade" role="status">
				{createInterpolateElement(
					__(
						"You’ve reached the free AI FAQ generation limit for this accordion. <link>Upgrade to Pro</link> to generate unlimited FAQs.",
						"easy-accordion-free"
					),
					{ link }
				)}
			</div>
		);
	}

	return (
		<p className="eab-ai-faq-upgrade-note">
			{createInterpolateElement(
				sprintf(
					/* translators: %d: most FAQs the free version generates for one accordion */
					__(
						"The free version generates up to %d FAQs once per accordion. <link>Upgrade to Pro</link> for unlimited FAQs.",
						"easy-accordion-free"
					),
					FREE_MAX_FAQS
				),
				{ link }
			)}
		</p>
	);
};

export default memo(UpgradeNotice);
