import { __ } from "@wordpress/i18n";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

const SortableItem = ({ id, children }) => {
	const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: id });
	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div style={style} ref={setNodeRef} {...attributes} {...listeners} className="sp-eab-sortable-item">
			{children}
		</div>
	);
};

export default SortableItem;
