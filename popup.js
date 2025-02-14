// popup.js

document.getElementById("updateNow").addEventListener("click", () => {
  chrome.runtime.sendMessage({ action: "updateDB" }, (response) => {
    console.log("Update response:", response);
    chrome.storage.local.get(["lastUpdate"], function(result) {
      const lastUpdate = result.lastUpdate ? new Date(result.lastUpdate).toLocaleString() : "Never";
      document.getElementById("lastUpdate").textContent = lastUpdate;
    });
  });
});

chrome.storage.local.get(["lastUpdate"], function(result) {
  const lastUpdate = result.lastUpdate ? new Date(result.lastUpdate).toLocaleString() : "Never";
  document.getElementById("lastUpdate").textContent = lastUpdate;
});
