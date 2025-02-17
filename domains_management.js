// domains_management.js

document.getElementById("saveDomains").addEventListener("click", function () {
    // Show confirmation popup
    const userConfirmed = confirm("Are you sure you want to save these changes?");
    
    if (userConfirmed) {
        // Retrieve the updated domains list from the input field (or another source)
        const domains = document.getElementById("domainList").value.split("\n").map(domain => domain.trim()).filter(domain => domain);

        // Save the updated domains to Chrome storage
        chrome.storage.local.set({ allowedDomains: domains }, function () {
            alert("✅ Changes saved successfully!");
        });
    } else {
        alert("❌ Changes were not saved.");
    }
});