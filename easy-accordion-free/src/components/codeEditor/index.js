import CodeMirror from "@uiw/react-codemirror";
import { css } from "@codemirror/lang-css";
import { javascript } from "@codemirror/lang-javascript";
import { oneDark } from "@codemirror/theme-one-dark";
import { autocompletion } from "@codemirror/autocomplete";
import "./editor.scss";

const CodeEditor = ({
	label = "",
	attributes = "",
	setAttributes,
	attributesKey = "",
	onChange = false,
	height = "180px",
	defaultLanguage = "css"
}) => {
	const setCustomCode = (value) => {
		if (onChange) {
			onChange(value);
		} else if (setAttributes && attributesKey) {
			setAttributes({ [attributesKey]: value });
		}
	};

	// Get the language extension with autocompletion
	const getLanguageExtension = (lang) => {
		const extensions = [];

		switch (lang) {
			case "javascript":
				// JavaScript with JSX support and autocompletion
				extensions.push(javascript({ jsx: true }));
				break;
			case "css":
			default:
				extensions.push(css());
				break;
		}

		// Add autocompletion for all languages
		extensions.push(autocompletion());

		return extensions;
	};

	return (
		<div className="sp-eab-code-editor-component sp-eab-component-mb">
			<div className="sp-eab-code-editor-label">
				<p className="sp-eab-component-title">{label}</p>
			</div>
			<div className="sp-eab-code-editor" style={{ height }}>
				<div className="sp-eab-codemirror-wrapper" style={{ backgroundColor: "#1e1e1e" }}>
					<CodeMirror
						value={attributes || ""}
						height={height || "180px"}
						extensions={getLanguageExtension(defaultLanguage || "css")}
						theme={oneDark}
						onChange={setCustomCode}
						basicSetup={{
							lineNumbers: true,
							highlightActiveLineGutter: true,
							highlightSpecialChars: true,
							foldGutter: true,
							drawSelection: true,
							dropCursor: true,
							allowMultipleSelections: true,
							indentOnInput: true,
							syntaxHighlighting: true,
							bracketMatching: true,
							closeBrackets: true,
							autocompletion: true,
							rectangularSelection: true,
							crosshairCursor: true,
							highlightActiveLine: true,
							highlightSelectionMatches: true,
							closeBracketsKeymap: true,
							searchKeymap: true,
							foldKeymap: true,
							tabSize: 4,
						}}
					/>
				</div>
			</div>
		</div>
	);
};

export default CodeEditor;
