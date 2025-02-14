let domainsDB = {};

async function updateDomainsDB() {
  try {
    const response = await fetch(CONFIG.DOMAINS_DB_URL);
    domainsDB = await response.json();
    chrome.storage.local.set({
      domainsDB,
      lastUpdate: Date.now()
    });
  } catch (error) {
    console.error('Failed to update domains database:', error);
  }
}

// Update on extension startup
chrome.runtime.onStartup.addListener(updateDomainsDB);

// Periodic update based on UPDATE_INTERVAL (in hours)
setInterval(updateDomainsDB, CONFIG.UPDATE_INTERVAL * 3600000);

// Listen for messages from the popup (e.g., "Update Now" button)
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'updateDB') {
    updateDomainsDB().then(() => {
      sendResponse({ status: 'updated' });
    });
    // Return true to indicate you want to send a response asynchronously
    return true;
  }
});
