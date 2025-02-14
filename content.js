function analyzePageContent() {
  chrome.storage.local.get(['domainsDB'], function(result) {
    const domainsDB = result.domainsDB || {};

    // Get all links on the page
    const links = document.getElementsByTagName('a');

    for (const link of links) {
      try {
        const url = new URL(link.href);
        const domain = url.hostname.toLowerCase();
        
        // Combine link text and parent's text for context
        const surroundingText = (link.innerText + ' ' + (link.parentElement ? link.parentElement.innerText : '')).toLowerCase();

        for (const [appName, validDomains] of Object.entries(domainsDB)) {
          // Check if the app name appears in the surrounding text and the domain does not match any valid domain
          if (surroundingText.includes(appName.toLowerCase()) &&
              !validDomains.some(validDomain => domain.includes(validDomain))) {

            // Create warning element if one hasn't already been added
            if (!link.nextElementSibling || !link.nextElementSibling.classList.contains('warning-alert')) {
              const warning = document.createElement('div');
              warning.classList.add('warning-alert');
              warning.style.cssText = `
                background: #fff3cd;
                color: #856404;
                padding: 10px;
                border: 1px solid #ffeeba;
                border-radius: 4px;
                margin: 5px 0;
                font-size: 14px;
              `;
              warning.textContent = CONFIG.WARNING_TEMPLATE.replace('{app}', appName);
              link.parentElement.insertBefore(warning, link.nextSibling);
            }
          }
        }
      } catch (e) {
        // Ignore invalid URLs
      }
    }
  });
}

// Run analysis when page loads
document.addEventListener('DOMContentLoaded', analyzePageContent);

// Optionally, observe DOM changes if you expect dynamic content:
const observer = new MutationObserver(analyzePageContent);
observer.observe(document.body, { childList: true, subtree: true });
