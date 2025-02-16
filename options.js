document.addEventListener("DOMContentLoaded", function () {
    // Load saved values
    chrome.storage.local.get(["trustedDomains", "blockedDomains", "safeBrowsingApiKey"], function (data) {
        document.getElementById("trusted").value = (data.trustedDomains || []).join("\n");
        document.getElementById("blocked").value = (data.blockedDomains || []).join("\n");
        document.getElementById("apiKey").value = data.safeBrowsingApiKey || "";
    });

    // Save new values
    document.getElementById("save").addEventListener("click", function () {
        const trusted = document.getElementById("trusted").value.split("\n").map(d => d.trim()).filter(d => d);
        const blocked = document.getElementById("blocked").value.split("\n").map(d => d.trim()).filter(d => d);
        const apiKey = document.getElementById("apiKey").value.trim();

        chrome.storage.local.set({ trustedDomains: trusted, blockedDomains: blocked, safeBrowsingApiKey: apiKey }, function () {
            alert("Settings saved!");
        });
    });
});

