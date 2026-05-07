import { arrayMoveImmutable } from "array-move";
import { useEffect, useRef, useState } from "@wordpress/element";
import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";
import { DeleteIcon, ArrowIconOne, ArrowIconTwo } from "../icons";
import "./editor.scss";

const MultipleSelectWithDnd = ({
	label = "",
	items,
	values,
	onChange,
	onInputChange = false,
	searchable = false,
	uniqueId = "",
}) => {
	const [allOptions, setAllOptions] = useState([]);
	const [searchFieldData, setSearchFieldData] = useState("");
	const [toggleSelectField, setToggleSelectField] = useState(false);
	const allValues = values?.map((item) => item.value);
	const containerRef = useRef(null);

	const filterNotSelectedItems = (selectFieldItems) => {
		const result = selectFieldItems?.filter((item) => !allValues.includes(item.value));
		return result;
	};

	useEffect(() => {
		let options = [];
		if (toggleSelectField) {
			options = filterNotSelectedItems(items);
		} else {
			options = [];
		}
		setAllOptions(options);
	}, [items, values, toggleSelectField]);

	const handleSelectField = (data) => {
		const { id, value, label } = data;
		const newValue = [...values, { id, value, label }];
		setSearchFieldData("");
		onChange(newValue);
	};

	const handleSearchField = (event) => {
		const value = event.target.value.toLowerCase();
		setSearchFieldData(value);
		const searchableArray = filterNotSelectedItems(items);
		const matchedOption = searchableArray.filter((i) => i.label.toLowerCase().includes(value));
		onInputChange ? onInputChange(value) : setAllOptions(matchedOption);
	};

	const handleRemoveItems = (id) => {
		const updatedValues = values?.filter((val) => val.id !== id);
		onChange(updatedValues);
	};

	// dnd
	const onDragEnd = (result) => {
		const { source, destination } = result;
		if (!destination) {
			return;
		}
		const from = source.index;
		const to = destination.index;
		const updatedArray = arrayMoveImmutable(values, from, to);
		onChange(updatedArray);
	};

	const toggleSelectFieldVal = () => {
		setToggleSelectField((prev) => !prev);
	};

	const containerHeight = values?.length * 32 + 2 + "px";
	return (
		<div className="shaped-plugin-multiple-select sp-eab-component-mb">
			<div className="sp-multiple-select-dnd-label">
				<p> {label}</p>
			</div>
			<div className="sp-multiple-select-dnd-container" ref={containerRef}>
				<div onClick={toggleSelectFieldVal} className="sp-select-header">
					<div className="sp-selected-options" style={{ height: containerHeight }}>
						<DragDropContext onDragEnd={onDragEnd}>
							<Droppable droppableId={`select-field-dnd-${uniqueId}`} direction="vertical">
								{(provided) => (
									<div ref={provided.innerRef} {...provided.droppableProps}>
										{values?.map((item, i) => (
											<Draggable key={item?.id} draggableId={item?.id?.toString()} index={i}>
												{(provided) => (
													<div
														ref={provided.innerRef}
														{...provided.draggableProps}
														{...provided.dragHandleProps}
													>
														<div className="sp-selected-option">
															<span className="sp-select-label">{item?.label}</span>
															<span
																className="sp-select-remove-button"
																onClick={() => handleRemoveItems(item.id)}
															>
																<DeleteIcon />
															</span>
														</div>
													</div>
												)}
											</Draggable>
										))}
									</div>
								)}
							</Droppable>
						</DragDropContext>
					</div>
					<span className="custom-select-arrow">
						{toggleSelectField ? <ArrowIconTwo /> : <ArrowIconOne />}
					</span>
				</div>
				{toggleSelectField && (
					<div className="sp-select-options">
						{searchable && (
							<input
								placeholder="Search here for more..."
								value={searchFieldData}
								onChange={(e) => handleSearchField(e)}
								className="sp-select-search-field"
							/>
						)}
						{allOptions?.length > 0 &&
							allOptions?.map((option, i) => {
								return (
									<div key={i}>
										{option.label && option.value && (
											<div
												onClick={() => handleSelectField(option)}
												className={`sp-select-option ${
													values === option.value ? "selected" : ""
												}`}
											>
												{option.label}
											</div>
										)}
									</div>
								);
							})}
					</div>
				)}
			</div>
		</div>
	);
};

export default MultipleSelectWithDnd;
