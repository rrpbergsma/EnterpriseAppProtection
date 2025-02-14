// config.js
const CONFIG = {
  // URL to fetch the approved enterprise domains list
  DOMAINS_DB_URL: 'https://raw.githubusercontent.com/rrpbergsma/EnterpriseAppProtection/refs/heads/main/domains.json',
  // Update interval in hours
  UPDATE_INTERVAL: 24,
  // Warning message template for suspicious links
  WARNING_TEMPLATE: "Warning: This link claims to be {app} but goes to an unofficial domain."
};
