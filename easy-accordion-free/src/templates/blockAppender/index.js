import { __ } from "@wordpress/i18n";
import { memo } from "@wordpress/element";

const BlockAppender = ({ blockAppenderFn, label = __("Add New FAQ", "easy-accordion-free") }) => {
	return (
		<div onClick={blockAppenderFn} className="sp-eab-block-appender sp-cursor-pointer">
			<span className="sp-eab-block-appender-wrapper sp-d-flex sp-justify-center sp-align-center sp-gap-8px">
				<span className="eab-icon-plus-solid"></span>
				{label}
			</span>
		</div>
	);
};

export default memo(BlockAppender);
