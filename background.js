let domainsDB = {};

async function updateDomainsDB() {
  console.log("updateDomainsDB: Starting update from URL:", CONFIG.DOMAINS_DB_URL);
  try {
    const response = await fetch(CONFIG.DOMAINS_DB_URL);
    if (!response.ok) {
      console.error(
        "updateDomainsDB: Fetch failed with status",
        response.status,
        response.statusText
      );
      return;
    }
    domainsDB = await response.json();
    chrome.storage.local.set(
      {
        domainsDB,
        lastUpdate: Date.now()
      },
      () => {
        console.log(
          "updateDomainsDB: Database updated successfully at",
          new Date().toLocaleString()
        );
      }
    );
  } catch (error) {
    console.error("updateDomainsDB: Failed to update domains database:", error);
  }
}

// Trigger update on extension startup
chrome.runtime.onStartup.addListener(() => {
  console.log("onStartup: Service worker started");
  updateDomainsDB();
});

// Periodic update based on UPDATE_INTERVAL (in hours)
setInterval(() => {
  console.log("Periodic update triggered");
  updateDomainsDB();
}, CONFIG.UPDATE_INTERVAL * 3600000);

// Listen for messages from the popup (e.g., "Update Now" button)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  console.log("onMessage: Received message:", message);
  if (message.action === "updateDB") {
    console.log("onMessage: Manual update triggered via Update Now button");
    updateDomainsDB().then(() => {
      console.log("onMessage: Manual update completed");
      sendResponse({ status: "updated" });
    });
    // Return true to indicate asynchronous response.
    return true;
  }
});
