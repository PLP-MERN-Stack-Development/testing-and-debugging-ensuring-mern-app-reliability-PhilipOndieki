/**
 * Cypress Custom Commands
 * Reusable test helpers
 */

/**
 * Custom command to login a user
 * @param {string} email - User email
 * @param {string} password - User password
 */
Cypress.Commands.add('login', (email, password) => {
  cy.visit('/login');
  cy.get('input[name="email"]').type(email);
  cy.get('input[name="password"]').type(password);
  cy.get('button[type="submit"]').click();
  cy.url().should('eq', `${Cypress.config().baseUrl}/`);
});

/**
 * Custom command to register a new user
 * @param {object} userData - User registration data
 */
Cypress.Commands.add('signup', (userData) => {
  cy.visit('/signup');
  cy.get('input[name="name"]').type(userData.name);
  cy.get('input[name="email"]').type(userData.email);
  cy.get('input[name="password"]').type(userData.password);
  cy.get('input[name="confirmPassword"]').type(userData.confirmPassword);
  cy.get('button[type="submit"]').click();
});

/**
 * Custom command to logout
 */
Cypress.Commands.add('logout', () => {
  cy.get('[data-testid="logout-button"]').click();
  cy.url().should('include', '/login');
});

/**
 * Custom command to create a bug
 * @param {object} bugData - Bug data
 */
Cypress.Commands.add('createBug', (bugData) => {
  cy.get('[data-testid="create-bug-button"]').click();
  cy.get('input[name="title"]').type(bugData.title);
  cy.get('textarea[name="description"]').type(bugData.description);
  if (bugData.priority) {
    cy.get('select[name="priority"]').select(bugData.priority);
  }
  if (bugData.status) {
    cy.get('select[name="status"]').select(bugData.status);
  }
  cy.get('[data-testid="submit-bug"]').click();
});

/**
 * Custom command to login via API (faster for setup)
 * @param {string} email - User email
 * @param {string} password - User password
 */
Cypress.Commands.add('loginViaAPI', (email, password) => {
  cy.request('POST', `${Cypress.env('apiUrl')}/auth/login`, {
    email,
    password,
  }).then((response) => {
    localStorage.setItem('token', response.body.data.token);
    localStorage.setItem('user', JSON.stringify(response.body.data.user));
  });
});

/**
 * Custom command to create user via API
 * @param {object} userData - User data
 */
Cypress.Commands.add('createUserViaAPI', (userData) => {
  return cy.request('POST', `${Cypress.env('apiUrl')}/auth/signup`, userData);
});
