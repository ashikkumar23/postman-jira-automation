// Clear testResults variable at the start of the collection
if (!pm.collectionVariables.has("testResults")) {
    pm.collectionVariables.set("testResults", "[]");
    console.log("Cleared testResults variable at the start of the collection");
} else {
    console.log("testResults variable already exists:", pm.collectionVariables.get("testResults"));
}