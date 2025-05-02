// Fetch existing test results or initialize an empty array
let testResults = pm.collectionVariables.get("testResults") || "[]";
testResults = JSON.parse(testResults);

// Helper function to construct the full URL
function getFullRequestURL() {
    return pm.request.url.toString(); // Use toString() to get the full URL as a string
}

// Add the current test case results
testResults.push({
    name: pm.info.requestName,
    status: pm.response.code === 200 ? "PASS" : "FAIL",
    details: {
        method: pm.request.method,
        uri: getFullRequestURL(), // Use the helper function to get the URL
        payload: pm.request.body ? pm.request.body.raw : null,
        queryParams: pm.request.url.query ? pm.request.url.query.toObject() : null,
        statusCode: pm.response.code,
        responseBody: pm.response.json()
    }
});

// Update the collection variable with the new results
pm.collectionVariables.set("testResults", JSON.stringify(testResults));
console.log(`Updated testResults variable after ${pm.info.requestName}:`, testResults);