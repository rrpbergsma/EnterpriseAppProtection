// content.js

function analyzePageContent() {
  chrome.storage.local.get(['domainsDB'], function(result) {
    const domainsDB = result.domainsDB || {};
    const links = document.getElementsByTagName("a");

    for (const link of links) {
      try {
        const url = new URL(link.href);
        const domain = url.hostname.toLowerCase();
        const surroundingText = ((link.innerText || "") + " " + (link.parentElement ? link.parentElement.innerText : "")).toLowerCase();

        for (const [appName, validDomains] of Object.entries(domainsDB)) {
          if (surroundingText.includes(appName.toLowerCase())) {
            const isValid = validDomains.some(validDomain => domain.includes(validDomain.toLowerCase()));
            if (!isValid) {
              if (!link.nextElementSibling || !link.nextElementSibling.classList.contains("warning-alert")) {
                const warning = document.createElement("div");
                warning.classList.add("warning-alert");
                warning.style.cssText = `
                  background: #fff3cd;
                  color: #856404;
                  padding: 10px;
                  border: 1px solid #ffeeba;
                  border-radius: 4px;
                  margin: 5px 0;
                  font-size: 14px;
                `;
                warning.textContent = CONFIG.WARNING_TEMPLATE.replace("{app}", appName);
                link.parentElement.insertBefore(warning, link.nextSibling);
              }
            }
          }
        }
      } catch (e) {
        // Skip links that have invalid URLs
      }
    }
  });
}

document.addEventListener("DOMContentLoaded", analyzePageContent);
const observer = new MutationObserver(analyzePageContent);
observer.observe(document.body, { childList: true, subtree: true });
