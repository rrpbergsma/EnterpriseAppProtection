// content.js

let SAFE_BROWSING_API_KEY = ""; // Initialize with an empty string

// ✅ Store domain data globally to prevent async issues
let domainsDB = {};
let trustedDomains = [];
let blockedDomains = [];
let isDomainsLoaded = false; // ✅ Prevent analysis before data is ready

// ✅ Get the top-level domain (TLD)
function getTopLevelDomain(hostname) {
    const domainParts = hostname.split(".");
    const knownTLDs = ["co.uk", "com.au", "gov.uk", "edu.au"];

    if (domainParts.length > 2) {
        const lastTwoParts = domainParts.slice(-2).join(".");
        if (knownTLDs.includes(lastTwoParts)) {
            return domainParts.slice(-3).join(".");
        }
    }
    return domainParts.slice(-2).join(".");
}

// ✅ Check if a domain is valid
function isValidDomain(domain, validDomains, trustedDomains) {
    const extractedTLD = getTopLevelDomain(domain);

    if (trustedDomains.includes(domain) || trustedDomains.includes(extractedTLD)) {
        return true; // User has explicitly marked this domain as safe
    }

    return validDomains.some(validDomain => {
        const validTLD = getTopLevelDomain(validDomain);
        return extractedTLD === validTLD;
    });
}

// ✅ Check Google Safe Browsing API for dangerous links
async function checkGoogleSafeBrowsing(url) {
  console.log("🔍 Checking Google Safe Browsing for:", url);

  if (!SAFE_BROWSING_API_KEY) {
      console.warn("⚠️ API key is not set. Skipping Safe Browsing check.");
      return false;
  }

  const response = await fetch(`https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${SAFE_BROWSING_API_KEY}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
          client: { clientId: "enterprise-app-protection", clientVersion: "1.0" },
          threatInfo: {
              threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
              platformTypes: ["ANY_PLATFORM"],
              threatEntryTypes: ["URL"],
              threatEntries: [{ url }]
          }
      })
  });

  const data = await response.json();
  console.log("🔹 Google Safe Browsing API Response:", data);
  return data.matches ? true : false;
}

// ✅ Scan page content for suspicious links
function analyzePageContent() {
  if (!isDomainsLoaded || !domainsDB || Object.keys(domainsDB).length === 0) {
      console.warn("⚠️ domainsDB is not ready yet. Skipping analysis.");
      return;
  }

  const links = document.querySelectorAll("a:not(.checked-by-extension)");
  let newFlaggedLinks = new Set();

  links.forEach(link => {
      try {
          // ✅ Validate the URL before using it
          let url;
          try {
              url = new URL(link.href);
          } catch (e) {
              console.warn("⚠️ Skipping invalid URL:", link.href);
              return; // Stop processing this link
          }

          const domain = url.hostname.toLowerCase();
          const linkText = link.innerText.trim();

          // ✅ Mark link as processed
          link.classList.add("checked-by-extension");

          // ✅ Skip trusted domains
          if (trustedDomains.includes(domain) || trustedDomains.includes(getTopLevelDomain(domain))) {
              console.log("Skipping trusted domain:", domain);
              return;
          }

          let matchedApp = null;

          // ✅ Find the most specific matching app name (ONLY full word matches)
          for (const [appName, validDomains] of Object.entries(domainsDB)) {
              const regex = new RegExp(`\\b${appName}\\b`, "i"); // Ensure full-word match
              if (regex.test(linkText)) {
                  matchedApp = appName; // Keep the most specific match
              }
          }

          if (matchedApp && domainsDB[matchedApp]) {
              const validDomains = domainsDB[matchedApp];
              const isValid = isValidDomain(domain, validDomains, trustedDomains);

              if (!isValid) {
                  newFlaggedLinks.add(url.href);

                  // ✅ Add warning immediately
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

                  warning.textContent = `⚠️ This link claims to be ${matchedApp} but goes to an unofficial domain.`;
                  warning.setAttribute("title", `This link goes to ${domain} instead of an official ${matchedApp} domain.`);
                  link.parentElement.insertBefore(warning, link.nextSibling);

                  // ✅ Update warning if Google Safe Browsing confirms danger
                  checkGoogleSafeBrowsing(url.href).then(isUnsafe => {
                      if (isUnsafe) {
                          warning.textContent = `⚠️ This link is confirmed dangerous by Google Safe Browsing!`;
                      }
                  });
              }
          }
      } catch (e) {
          console.error("Unexpected error processing link:", e);
      }
  });

  // ✅ Store flagged links without waiting for Safe Browsing API
  chrome.storage.local.get(["flaggedLinks", "totalSuspiciousLinks"], function (result) {
      let existingLinks = new Set(result.flaggedLinks || []);
      let totalCount = existingLinks.size;

      let newLinksToAdd = [...newFlaggedLinks].filter(link => !existingLinks.has(link));

      if (newLinksToAdd.length > 0) {
          totalCount += newLinksToAdd.length;

          chrome.storage.local.set({
              totalSuspiciousLinks: totalCount,
              flaggedLinks: [...existingLinks, ...newLinksToAdd]
          }, () => {
              chrome.runtime.sendMessage({ action: "updatePopup", flaggedLinks: [...existingLinks, ...newLinksToAdd], totalCount });
          });
      }
  });
}

// ✅ Load domains and start analysis once ready
function loadDomainsAndAnalyze() {
    chrome.storage.local.get(["domainsDB", "trustedDomains", "blockedDomains", "safeBrowsingApiKey"], function (result) {
        domainsDB = result.domainsDB || {};
        trustedDomains = result.trustedDomains || [];
        blockedDomains = result.blockedDomains || [];
        SAFE_BROWSING_API_KEY = result.safeBrowsingApiKey || "";
        console.log("✅ Loaded API Key:", SAFE_BROWSING_API_KEY); // Debugging line
        isDomainsLoaded = true;
        console.log("✅ Domains database loaded:", domainsDB);
        analyzePageContent(); // Run scan after loading
    });
}

// ✅ MutationObserver to detect dynamically added phishing links
function observePageForLinks() {
    const observer = new MutationObserver(() => analyzePageContent());

    observer.observe(document.body, { childList: true, subtree: true });

    function observeIframes() {
        document.querySelectorAll("iframe").forEach((iframe) => {
            try {
                const iframeDoc = iframe.contentDocument || iframe.contentWindow.document;
                if (iframeDoc) {
                    observer.observe(iframeDoc.body, { childList: true, subtree: true });
                    console.log("Observing links inside iframe:", iframe.src);
                }
            } catch (e) {
                console.warn("Cannot access iframe due to cross-origin restrictions:", iframe.src);
            }
        });
    }

    // ✅ Run iframe observer every 3 seconds for Office 365 dynamic content
    setInterval(observeIframes, 3000);
}

// ✅ Initialize extension scanning
document.addEventListener("DOMContentLoaded", loadDomainsAndAnalyze);
window.addEventListener("load", loadDomainsAndAnalyze);
observePageForLinks();