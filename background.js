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

// Check for updates on extension startup and periodically
chrome.runtime.onStartup.addListener(updateDomainsDB);
setInterval(updateDomainsDB, CONFIG.UPDATE_INTERVAL * 3600000);