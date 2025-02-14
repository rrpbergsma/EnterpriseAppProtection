document.getElementById("updateNow").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "updateDB" }, (response) => {
    console.log("Update response:", response);
    // Refresh the last update timestamp after manual update
    chrome.storage.local.get(["lastUpdate"], function(result) {
      const lastUpdate = result.lastUpdate ? new Date(result.lastUpdate).toLocaleString() : "Never";
      document.getElementById("lastUpdate").textContent = lastUpdate;
    });
  });
});

// Also update the last update timestamp when the popup loads
chrome.storage.local.get(["lastUpdate"], function(result) {
  const lastUpdate = result.lastUpdate ? new Date(result.lastUpdate).toLocaleString() : "Never";
  document.getElementById("lastUpdate").textContent = lastUpdate;
});
