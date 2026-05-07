import { createContext, memo, useContext, useRef, useState } from "@wordpress/element";

const AccordionContext = createContext();

const Accordion = ({
	children,
	transitionDuration = 600,
	multipleOpenAtATime = false,
	className = "",
	accordionMode = "vertical",
	defaultExpandItems = [],
	expandWidth = "",
	expandHeight = false,
	animationEffect = "none",
	activatorEvent = "click",
}) => {
	const [openItems, setOpenItems] = useState(defaultExpandItems);

	const toggleItem = (index) => {
		setOpenItems((prev) => {
			if (prev.includes(index)) {
				if (accordionMode === "horizontal") {
					return prev;
				}
				return prev.filter((i) => i !== index);
			}
			if (multipleOpenAtATime) {
				return [...prev, index];
			}
			return [index];
		});
	};

	const contextValue = {
		accordionMode,
		openItems,
		toggleItem,
		transitionDuration,
		expandWidth,
		expandHeight,
		animationEffect,
		activatorEvent,
	};

	return (
		<AccordionContext.Provider value={contextValue}>
			<div
				className={`sp-eab-accordion sp-eab-mode-${accordionMode}${className ? ` ${className}` : ""} sp-d-flex`}
			>
				{children}
			</div>
		</AccordionContext.Provider>
	);
};

const AccordionItem = memo(({ children, eventKey, blockProps }) => {
	const { openItems } = useContext(AccordionContext);
	const isOpen = openItems.includes(eventKey);
	const updatedProps = { ...blockProps, className: `${blockProps.className}${isOpen ? " eab-expand" : ""}` };

	return (
		<AccordionContext.Provider value={{ ...useContext(AccordionContext), eventKey }}>
			<div {...updatedProps}>{children}</div>
		</AccordionContext.Provider>
	);
});

const AccordionHeading = memo(({ children, TagName = "h3", className = "" }) => {
	const { toggleItem, eventKey, activatorEvent } = useContext(AccordionContext);

	const handlers = {};

	if (activatorEvent !== "hover") {
		handlers.onClick = (e) => {
			e.stopPropagation();
			toggleItem(eventKey);
		};
	}

	if (activatorEvent === "hover") {
		handlers.onMouseEnter = () => toggleItem(eventKey);
	}

	return (
		<TagName
			className={`sp-eab-accordion-heading sp-d-flex sp-align-center${className ? ` ${className}` : ""}`}
			{...handlers}
		>
			{children}
		</TagName>
	);
});

const AccordionContent = memo(({ children, className = "" }) => {
	const { openItems, eventKey, transitionDuration, accordionMode, expandWidth, expandHeight, animationEffect } =
		useContext(AccordionContext);
	const isOpen = openItems.includes(eventKey);
	// manage open accordion.
	const contentRef = useRef(null);
	let contentStyle = {};
	if (accordionMode === "vertical") {
		const height = expandHeight ? expandHeight : contentRef?.current?.scrollHeight;
		contentStyle = {
			maxHeight: `${isOpen ? height : 0}px`,
			transition: `max-height ${transitionDuration}ms`,
			...(expandHeight && { overflowY: "auto" }),
		};
	} else {
		contentStyle = {
			width: `${isOpen ? expandWidth : 0}px`,
			transition: `width ${transitionDuration}ms`,
		};
	}

	return (
		<div className={`sp-eab-accordion-content${className !== "" ? ` ${className}` : ""}`} style={contentStyle}>
			<div
				className={`sp-eab-accordion-content-wrapper${isOpen ? ` animated ${animationEffect}` : ""}`}
				ref={contentRef}
			>
				{children}
			</div>
		</div>
	);
});

Accordion.Item = AccordionItem;
Accordion.Heading = AccordionHeading;
Accordion.Content = AccordionContent;

export default Accordion;
