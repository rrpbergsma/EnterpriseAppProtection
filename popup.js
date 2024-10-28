document.getElementById('updateNow').addEventListener('click', async () => {
    chrome.runtime.sendMessage({ action: 'updateDB' });
  });
  
  // Update last update timestamp
  chrome.storage.local.get(['lastUpdate'], function(result) {
    const lastUpdate = result.lastUpdate ? new Date(result.lastUpdate).toLocaleString() : 'Never';
    document.getElementById('lastUpdate').textContent = lastUpdate;
  });