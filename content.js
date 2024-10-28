function analyzePageContent() {
    chrome.storage.local.get(['domainsDB'], function(result) {
      const domainsDB = result.domainsDB || {};
      
      // Get all links on the page
      const links = document.getElementsByTagName('a');
      
      for (const link of links) {
        const url = new URL(link.href);
        const domain = url.hostname.toLowerCase();
        
        // Check content around the link for application names
        const surroundingText = link.innerText.toLowerCase() + 
                               (link.parentElement ? link.parentElement.innerText.toLowerCase() : '');
        
        for (const [appName, validDomains] of Object.entries(domainsDB)) {
          if (surroundingText.includes(appName.toLowerCase()) && 
              !validDomains.some(validDomain => domain.includes(validDomain))) {
            
            // Create warning element
            const warning = document.createElement('div');
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
            
            // Insert warning after the link
            link.parentElement.insertBefore(warning, link.nextSibling);
          }
        }
      }
    });
  }
  
  // Run analysis when page loads
  document.addEventListener('DOMContentLoaded', analyzePageContent);