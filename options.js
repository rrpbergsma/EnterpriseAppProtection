document.addEventListener("DOMContentLoaded", function () {
    // Get UI elements safely
    const apiKeyElement = document.getElementById("apiKey");
    const domainsDBURLElement = document.getElementById("domainsDBURL");
    const updateIntervalElement = document.getElementById("updateInterval");
    const warningTemplateElement = document.getElementById("warningTemplate");
    const saveButton = document.getElementById("save");

    // Check if warningTemplateElement exists before setting value
    if (!warningTemplateElement) {
        console.error("⚠️ Element with ID 'warningTemplate' not found in options.html!");
    }

    // Default values
    const defaultValues = {
        safeBrowsingApiKey: "",
        domainsDBURL: "https://raw.githubusercontent.com/rrpbergsma/EnterpriseAppProtection/refs/heads/main/domains.json",
        updateInterval: 24,
        warningTemplate: "Warning: This link claims to be {app} but goes to an unofficial domain."
    };

    // Load stored settings and apply defaults where needed
    chrome.storage.local.get(["safeBrowsingApiKey", "domainsDBURL", "updateInterval", "warningTemplate"], function (data) {
        if (apiKeyElement) apiKeyElement.value = data.safeBrowsingApiKey || defaultValues.safeBrowsingApiKey;
        if (domainsDBURLElement) domainsDBURLElement.value = data.domainsDBURL || defaultValues.domainsDBURL;
        if (updateIntervalElement) updateIntervalElement.value = data.updateInterval || defaultValues.updateInterval;
        if (warningTemplateElement) {
            warningTemplateElement.value = data.warningTemplate || defaultValues.warningTemplate;
        }
    });

    // Save settings when clicking "Save"
    if (saveButton) {
        saveButton.addEventListener("click", function () {
            const apiKey = apiKeyElement && apiKeyElement.value.trim() ? apiKeyElement.value.trim() : defaultValues.safeBrowsingApiKey;
            const domainsDBURL = domainsDBURLElement && domainsDBURLElement.value.trim() ? domainsDBURLElement.value.trim() : defaultValues.domainsDBURL;
            const updateInterval = updateIntervalElement && updateIntervalElement.value.trim()
                ? parseInt(updateIntervalElement.value.trim()) || defaultValues.updateInterval
                : defaultValues.updateInterval;
            const warningTemplate = warningTemplateElement && warningTemplateElement.value.trim()
                ? warningTemplateElement.value.trim()
                : defaultValues.warningTemplate;

            chrome.storage.local.set({
                safeBrowsingApiKey: apiKey,
                domainsDBURL: domainsDBURL,
                updateInterval: updateInterval,
                warningTemplate: warningTemplate
            }, function () {
                alert("✅ Settings saved successfully!");
            });
        });
    }
});