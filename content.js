function analyzePageContent() {
  chrome.storage.local.get(['domainsDB'], function(result) {
    const domainsDB = result.domainsDB || {};
    const links = document.getElementsByTagName("a");

    for (const link of links) {
      try {
        const url = new URL(link.href);
        const domain = url.hostname.toLowerCase();
        // Combine the link text and its parent element's text for context
        const surroundingText = ((link.innerText || "") + " " + (link.parentElement ? link.parentElement.innerText : "")).toLowerCase();

        // Loop through each enterprise app in the database
        for (const [appName, validDomains] of Object.entries(domainsDB)) {
          if (surroundingText.includes(appName.toLowerCase())) {
            // Check if the link's domain does not include any valid domain substring
            const isValid = validDomains.some(validDomain => domain.includes(validDomain.toLowerCase()));
            if (!isValid) {
              // Prevent duplicate warnings for the same link
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

// Run analysis when the DOM is fully loaded
document.addEventListener("DOMContentLoaded", analyzePageContent);

// Use MutationObserver to re-run analysis when the DOM changes (for dynamic pages)
const observer = new MutationObserver(analyzePageContent);
observer.observe(document.body, { childList: true, subtree: true });
