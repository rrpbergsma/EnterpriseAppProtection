// background.js

console.log("Background service worker loaded");

let domainsDB = {};

async function updateDomainsDB() {
  chrome.storage.local.get(["domainsDBURL"], async function (result) {
    const domainsDBURL = result.domainsDBURL || "https://raw.githubusercontent.com/rrpbergsma/EnterpriseAppProtection/refs/heads/main/domains.json";
    console.log("updateDomainsDB: Starting update from URL:", domainsDBURL);
    try {
      const response = await fetch(domainsDBURL);
      if (!response.ok) {
        console.error("updateDomainsDB: Fetch failed with status", response.status, response.statusText);
        return;
      }
      domainsDB = await response.json();
      chrome.storage.local.set({
        domainsDB: domainsDB,
        lastUpdate: Date.now()
      }, () => {
        console.log("updateDomainsDB: Database updated successfully at", new Date().toLocaleString());
      });
    } catch (error) {
      console.error("updateDomainsDB: Failed to update domains database:", error);
    }
  });
}

// Run updates when the extension is installed or started
chrome.runtime.onInstalled.addListener(() => {
  console.log("Extension installed");
  updateDomainsDB();
});

chrome.runtime.onStartup.addListener(() => {
  console.log("Service worker started");
  updateDomainsDB();
});

// Periodic update based on UPDATE_INTERVAL (in hours)
setInterval(() => {
  chrome.storage.local.get(["updateInterval"], function (result) {
    const updateInterval = result.updateInterval || 24;
    console.log("Periodic update triggered");
    updateDomainsDB();
  });
}, 3600000);

// Listen for manual update messages (e.g., from the popup)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("onMessage: Received message:", message);

  if (message.action === "updateDB") {
    console.log("onMessage: Manual update triggered via Update Now button");
    updateDomainsDB().then(() => {
      console.log("onMessage: Manual update completed");
      sendResponse({ status: "updated" });
    });
    return true; // Keep message channel open for async response
  }

  if (message.action === "updatePopup") {
    // Store flagged links and update the total suspicious count
    chrome.storage.local.get(["totalSuspiciousLinks"], (result) => {
      let totalCount = result.totalSuspiciousLinks || 0;
      totalCount += message.flaggedLinks.length; // Add new links found in this session

      chrome.storage.local.set({
        flaggedLinks: message.flaggedLinks,
        totalSuspiciousLinks: totalCount
      }, () => {
        console.log(`Updated totalSuspiciousLinks: ${totalCount}`);
      });
    });
  }

  if (message.action === "getSuspiciousLinks") {
    // Retrieve both flagged links and total suspicious link count
    chrome.storage.local.get(["flaggedLinks", "totalSuspiciousLinks"], (data) => {
      sendResponse({
        count: data.totalSuspiciousLinks || 0,
        links: data.flaggedLinks || []
      });
    });
    return true; // Keep message channel open for async response
  }
});

// Debug Mode: Keep-alive mechanism for testing
const DEBUG_MODE = false; // Set to 'true' for testing

if (DEBUG_MODE) {
  chrome.alarms.create("keepAlive", { delayInMinutes: 0.1, periodInMinutes: 0.1 });
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "keepAlive") {
      console.log("keepAlive alarm triggered, service worker is active");
    }
  });
}