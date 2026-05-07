import Editor from "@monaco-editor/react";
import "./editor.scss";

const CodeEditor = ({ label = "", attributes = "", setAttributes, attributesKey = "", onChange = false }) => {
	const setCustomCss = (value) => {
		if (onChange) {
			onChange(value);
		} else {
			setAttributes({ [attributesKey]: value });
		}
	};

	return (
		<div className="sp-eab-code-editor-component sp-eab-component-mb">
			<div className="sp-eab-code-editor-label">
				<p className="sp-eab-component-title">{label}</p>
			</div>
			<div className="sp-eab-code-editor">
				<Editor
					height="180px"
					defaultLanguage="css"
					theme="vs-dark"
					defaultValue=""
					value={attributes}
					onChange={(e) => setCustomCss(e)}
					options={{
						quickSuggestions: {
							other: "on",
							comments: "off",
							strings: "off",
						},
						quickSuggestionsDelay: 10,
						minimap: {
							enabled: false,
						},
						scrollbar: {
							vertical: "auto",
							horizontal: "auto",
							verticalScrollbarSize: 5,
							horizontalScrollbarSize: 5,
							scrollByPage: false,
							ignoreHorizontalScrollbarInContentHeight: false,
						},
						lineNumbersMinChars: 1,
						folding: false,
						wordWrap: "on",
					}}
				/>
			</div>
		</div>
	);
};
export default CodeEditor;
