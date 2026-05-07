import "./editor.scss";

const Button = ({ children, className, ...props }) => {
	return (
		<button {...props} className={`sp-eab-button-component${className ? " " + className : ""}`}>
			{children}
		</button>
	);
};

export default Button;
