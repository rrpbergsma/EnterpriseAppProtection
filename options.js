document.addEventListener("DOMContentLoaded", function () {
    // Load saved values
    chrome.storage.local.get(["trustedDomains", "blockedDomains"], function (data) {
        document.getElementById("trusted").value = (data.trustedDomains || []).join("\n");
        document.getElementById("blocked").value = (data.blockedDomains || []).join("\n");
    });

    // Save new values
    document.getElementById("save").addEventListener("click", function () {
        const trusted = document.getElementById("trusted").value.split("\n").map(d => d.trim()).filter(d => d);
        const blocked = document.getElementById("blocked").value.split("\n").map(d => d.trim()).filter(d => d);

        chrome.storage.local.set({ trustedDomains: trusted, blockedDomains: blocked }, function () {
            alert("Settings saved!");
        });
    });
});

