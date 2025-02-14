// config.js
export const CONFIG = {
  // URL to fetch the approved enterprise domains list
  DOMAINS_DB_URL: 'https://raw.githubusercontent.com/rrpbergsma/EnterpriseAppProtection/refs/heads/main/domains.json',
  // Update interval in hours (used in background.js)
  UPDATE_INTERVAL: 24,
  // Warning message template for links that seem suspicious
  WARNING_TEMPLATE: "Warning: This link claims to be {app} but goes to an unofficial domain."
};
