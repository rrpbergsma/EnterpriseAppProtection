document.addEventListener("DOMContentLoaded", function () {
    const saveButton = document.getElementById("save");
    const trustedInput = document.getElementById("trusted");
    const blockedInput = document.getElementById("blocked");

    // Load saved domains
    chrome.storage.local.get(["trustedDomains", "blockedDomains"], function (data) {
        if (data.trustedDomains) trustedInput.value = data.trustedDomains.join("\n");
        if (data.blockedDomains) blockedInput.value = data.blockedDomains.join("\n");
    });

    // Save button event
    saveButton.addEventListener("click", function () {
        // Retrieve domains from input fields
        const trustedDomains = trustedInput.value.split("\n").map(d => d.trim()).filter(d => d);
        const blockedDomains = blockedInput.value.split("\n").map(d => d.trim()).filter(d => d);

        // Save to Chrome storage
        chrome.storage.local.set({ trustedDomains, blockedDomains }, function () {
            showPopup("✅ Changes saved successfully!");
        });
    });

    // Function to show styled popup message
    function showPopup(message) {
        const popup = document.getElementById("popupMessage");
        const popupText = document.getElementById("popupText");
        const popupClose = document.getElementById("popupClose");

        popupText.innerText = message;
        popup.classList.remove("hidden");
        popup.classList.add("visible");

        popupClose.addEventListener("click", function () {
            popup.classList.remove("visible");
            popup.classList.add("hidden");
        });
    }
});