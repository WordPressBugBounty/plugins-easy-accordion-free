import { cleanSchemaString, jsonStringify } from "../../controls";

const SchemaMarkup = ({ schemaData }) => {
	const generateQuestionSchema = (title, content) => {
		const cleanedTitle = cleanSchemaString(title);
		const cleanedContent = cleanSchemaString(content);

		return {
			"@type": "Question",
			name: cleanedTitle,
			acceptedAnswer: {
				"@type": "Answer",
				text: cleanedContent,
			},
		};
	};

	const generateSchema = () => {
		if (!schemaData || schemaData.length === 0) {
			return null;
		}

		const faqSchema = {
			"@context": "https://schema.org",
			"@type": "FAQPage",
			mainEntity: schemaData?.map((item) => generateQuestionSchema(item?.title, item?.striped_content)),
		};

		return jsonStringify(faqSchema);
	};

	return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: generateSchema() }} />;
};

export default SchemaMarkup;
