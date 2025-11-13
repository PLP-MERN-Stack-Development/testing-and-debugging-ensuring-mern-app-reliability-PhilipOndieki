/**
 * Cypress E2E Support File
 * Loads custom commands and configuration
 */

// Import commands
import './commands';

// Hide fetch/XHR requests from command log for cleaner output
const app = window.top;
if (!app.document.head.querySelector('[data-hide-command-log-request]')) {
  const style = app.document.createElement('style');
  style.innerHTML =
    '.command-name-request, .command-name-xhr { display: none }';
  style.setAttribute('data-hide-command-log-request', '');
  app.document.head.appendChild(style);
}

// Cypress doesn't have access to your app's code, but you can add global hooks
Cypress.on('uncaught:exception', (err, runnable) => {
  // Returning false here prevents Cypress from failing the test
  // We might want to be more selective about which errors to ignore
  return false;
});
