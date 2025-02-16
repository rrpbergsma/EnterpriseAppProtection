# Enterprise App Protection

## 🔍 What This Extension Does

Protect yourself and your organization from phishing attacks that impersonate common enterprise applications like DocuSign, Salesforce, Microsoft 365, and hundreds more. This extension:

- ✓ **Automatically scans links** in your browser and emails in real time
- ✓ **Alerts you** when a link claims to be from a trusted enterprise app but leads to an unofficial domain
- ✓ **Uses Google Safe Browsing API** to detect phishing and malware threats beyond known fake domains
- ✓ **Maintains an up-to-date database** of legitimate enterprise application domains
- ✓ **Detects dynamically added links** (e.g., in Outlook Web, Teams, SharePoint)
- ✓ **Works with 150+ enterprise applications**
- ✓ **Functions completely offline** after initial setup (except for Safe Browsing checks)

![Enterprise App Protection Screenshot](https://raw.githubusercontent.com/rrpbergsma/EnterpriseAppProtection/refs/heads/main/EnterpriseAppProtection.png)

---

## ⚙️ How It Works

When you visit a webpage or open an email, the extension:
1. **Scans all links** and detects if any enterprise applications (like "DocuSign" or "Salesforce") are mentioned
2. **Verifies if the associated links actually go to official domains**
3. **Checks Google Safe Browsing** to detect malware and phishing links not in its internal database
4. **Detects links inside dynamically loaded content** (like Outlook Web, Microsoft Teams, SharePoint)
5. **Shows a clear warning** if a potential impersonation attempt is detected

---

## 🔐 Privacy & Security

- **Zero Data Collection:** This extension does not collect, store, or transmit any personal data, browsing history, or email content.
- **Completely Offline:** After initial installation, all domain checks are performed locally on your device.
- **No Cloud Processing:** All link analysis happens directly in your browser.
- **Uses Google Safe Browsing API:** Checks URLs against Google’s real-time phishing and malware database.
- **Open Source:** All code is available for review.

---

## 🚫 What This Extension Doesn't Do

- ❌ Does **NOT** access, read, or store your email content or attachments.
- ❌ Does **NOT** track your browsing history.
- ❌ Does **NOT** require an account or registration.
- ❌ Does **NOT** send any data back to our servers.
- ❌ Does **NOT** modify or alter any content—it only shows warnings.
- ❌ Does **NOT** prevent you from visiting any websites.

---

## 🔹 Trusted & Blocked Domains

- **Trusted Domains:** These domains are always allowed and will not be flagged.
- **Blocked Domains:** These domains will always be marked as unsafe.

To modify trusted/blocked domains:
1. Open the **extension options page**.
2. Add or remove domains under **"Trusted Domains"** or **"Blocked Domains"**.
3. Click **"Update Database"** to apply changes.

---

## 🔍 Google Safe Browsing API

This extension integrates with **Google Safe Browsing** to detect additional phishing and malware sites.  
If Google **does not recognize a site as unsafe**, it will not be flagged unless it is in the **blocked domains list**.

🔹 **Report new phishing domains to Google** → [Submit a phishing site](https://safebrowsing.google.com/safebrowsing/report_phish/)

---

## 👥 Perfect For

- **Business professionals** who regularly use enterprise applications
- **IT security teams** looking to protect their organizations
- **Anyone concerned about phishing attacks** targeting business services
- **Organizations using multiple cloud-based enterprise applications**
- **Microsoft 365 users** (Outlook, Teams, SharePoint) who want extra security

---

## 🖥️ System Requirements

- **Google Chrome 88+ / Microsoft Edge 88+**
- **Works with Microsoft Outlook Web, Teams, and SharePoint**
- **Internet connection required for Safe Browsing checks (optional)**

---

## 🛠️ Troubleshooting

### **❓ Why is a suspicious site not flagged?**
- It might **not be in the `domains.json` database**.
- Google Safe Browsing **does not recognize it as a phishing site**.
- The domain may be a **legitimate subdomain** of an official service.

### **❓ Why is a link incorrectly flagged?**
- If the link **contains a word matching an app name** but is not actually phishing.
- You can add the domain to **"Trusted Domains"** in the options page.

---

## 🔥 Latest Updates
### ✅ **Final Version Features**
- **⚡ Dynamic Link Scanning:** Detects phishing links inside emails, Teams, and SharePoint without reloading the page.
- **🎯 Google Safe Browsing Support:** Detects additional phishing sites beyond known fake domains.
- **🛡️ Improved Matching:** Ensures only full app names trigger warnings.
- **🚀 Optimized Performance:** No duplicate warnings, reduced false positives.
- **📡 No More Debugging Logs:** Production-ready version with clean console logs.

---

## 🏆 Credits

Developed with 💙 to protect businesses from phishing threats!  
Stay secure in your daily work—let **Enterprise App Protection** be your first line of defense against phishing attacks.

---