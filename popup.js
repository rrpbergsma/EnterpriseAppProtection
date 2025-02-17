// popup.js

// Open the options/settings page when the "Settings" button is clicked
document.getElementById("settings").addEventListener("click", function () {
  chrome.runtime.openOptionsPage();
});

// Update the domains database when clicking the "Update Database" button
document.getElementById("updateDB").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "updateDB" }, (response) => {
      console.log("Update response:", response);
      chrome.storage.local.get(["lastUpdate"], function(result) {
        if (result.lastUpdate) {
            const date = new Date(result.lastUpdate);
    
            // Format: dd-MM-yyyy HH:mm (24-hour format, no seconds)
            const formattedDate = `${String(date.getDate()).padStart(2, '0')}-${String(date.getMonth() + 1).padStart(2, '0')}-${date.getFullYear()} ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
    
            const lastUpdateElement = document.getElementById("lastUpdate");
            if (lastUpdateElement) {
                lastUpdateElement.textContent = `Last Updated: ${formattedDate}`;
            }
        } else {
            const lastUpdateElement = document.getElementById("lastUpdate");
            if (lastUpdateElement) {
                lastUpdateElement.textContent = "Last Updated: Never";
            }
        }
    });

      // Show an alert to the user
      alert(response.status === "updated" ? "✅ Database successfully updated!" : "❌ Failed to update database.");
  });
});

// Open the domains management page when the "Manage Domains" button is clicked
document.getElementById("manageDomains").addEventListener("click", function () {
  chrome.tabs.create({ url: chrome.runtime.getURL("domains_management.html") });
});

// Load total suspicious links count and update UI
chrome.storage.local.get(["totalSuspiciousLinks"], function (result) {
  document.getElementById("suspiciousCount").innerText = result.totalSuspiciousLinks || 0;
});

// Retrieve flagged links and display them
chrome.runtime.sendMessage({ action: "getSuspiciousLinks" }, response => {
  document.getElementById("suspiciousLinks").innerHTML = response.links.length
      ? response.links.map(link => `<li>${link}</li>`).join("")
      : "<li>No suspicious links detected.</li>";
});

// Listen for updates from content.js
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "updatePopup") {
      document.getElementById("suspiciousCount").innerText = message.totalCount; // Persist total count
      document.getElementById("suspiciousLinks").innerHTML = message.flaggedLinks.length
          ? message.flaggedLinks.map(link => `<li>${link}</li>`).join("")
          : "<li>No suspicious links detected.</li>";
  }
});

document.getElementById("resetCounter").addEventListener("click", function () {
  chrome.storage.local.set({ totalSuspiciousLinks: 0, flaggedLinks: [] }, function () {
      alert("Suspicious links counter has been reset.");

      // Force the UI to update immediately
      document.getElementById("suspiciousCount").innerText = "0";
      document.getElementById("suspiciousLinks").innerHTML = "<li>No suspicious links detected.</li>";

      // Notify the background script (optional, if needed)
      chrome.runtime.sendMessage({ action: "resetCounter" });
  });
});