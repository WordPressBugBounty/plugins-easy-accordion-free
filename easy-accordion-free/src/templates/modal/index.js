import { FaTimes } from "react-icons/fa";

export const Modal = ({ isOpen, onClose, children }) => {
	if (!isOpen) {
		return null;
	}

	return (
		<div className="sp-easy-accordion-faq-form-modal-overlay" onClick={onClose}>
			<div className="sp-easy-accordion-faq-form-modal-content" onClick={(e) => e.stopPropagation()}>
				<button title="close" className="sp-easy-accordion-faq-form-modal-close-button" onClick={onClose}>
					<FaTimes />
				</button>
				<div className="sp-easy-accordion-faq-form-modal-body">{children}</div>
			</div>
		</div>
	);
};
