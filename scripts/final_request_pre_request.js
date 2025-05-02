// Fetch the consolidated test results
const testResults = JSON.parse(pm.collectionVariables.get("testResults") || "[]");

if (!testResults.length) {
    console.error("No test results found in testResults variable!");
} else {
    console.log("Final testResults variable before posting to Jira:", testResults);
}

// Remove duplicate test scenarios by using a Set to track unique names
const uniqueTestResults = Array.from(
    new Map(testResults.map(result => [result.name, result])).values()
);

console.log("Unique testResults after deduplication:", uniqueTestResults);

// Function to create a heading in Jira doc format
function createHeading(text, level = 3) {
    return {
        type: "heading",
        attrs: { level },
        content: [
            {
                text,
                type: "text"
            }
        ]
    };
}

// Function to create a paragraph in Jira doc format
function createParagraph(textArray) {
    return {
        type: "paragraph",
        content: textArray.map(text => (
            typeof text === "string"
                ? { text, type: "text" }
                : text // If it's already a formatted object (e.g., bold text), include it as is
        ))
    };
}

// Function to create a bold text block in Jira doc format
function createBoldText(text) {
    return {
        text,
        type: "text",
        marks: [{ type: "strong" }]
    };
}

// Function to create a code block in Jira doc format
function createCodeBlock(text) {
    return {
        type: "codeBlock",
        content: [
            {
                text,
                type: "text"
            }
        ]
    };
}

// Construct the Jira comment body
const jiraComment = {
    body: {
        type: "doc",
        version: 1,
        content: [
            createHeading("Consolidated Test Results"), // Main heading
            ...uniqueTestResults.flatMap(result => [
                createHeading(result.name, 3), // Heading for each test scenario
                createParagraph([
                    createBoldText("Request Method: "),
                    {
                        text: `${result.details.method}`,
                        type: "text"
                    }
                ]),
                createParagraph([
                    createBoldText("Request URI: "),
                    {
                        text: `${result.details.uri}`,
                        type: "text"
                    }
                ]),
                createParagraph([
                    createBoldText("Request Payload: "),
                    {
                        text: JSON.stringify(result.details.payload || {}, null, 2),
                        type: "text"
                    }
                ]),
                createParagraph([
                    createBoldText("Request Query Params: "),
                    {
                        text: JSON.stringify(result.details.queryParams || {}, null, 2),
                        type: "text"
                    }
                ]),
                createParagraph([
                    createBoldText("Response Status Code: "),
                    {
                        text: `${result.details.statusCode}`,
                        type: "text"
                    }
                ]),
                createParagraph([
                    createBoldText("Response Body:")
                ]),
                createCodeBlock(JSON.stringify(result.details.responseBody, null, 2)) // JSON-formatted response body
            ])
        ]
    }
};

// Log the constructed payload for Jira
console.log("Constructed Jira Comment Payload:", JSON.stringify(jiraComment, null, 2));

// Set the constructed comment as the request body
pm.request.body.raw = JSON.stringify(jiraComment);