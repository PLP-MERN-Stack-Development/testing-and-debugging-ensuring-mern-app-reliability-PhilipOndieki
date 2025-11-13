/**
 * Authentication E2E Tests
 * Tests for signup, login, and logout flows
 */

describe('Authentication Flow', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    cy.clearLocalStorage();
  });

  describe('Signup', () => {
    it('should display signup form', () => {
      cy.visit('/signup');
      cy.contains('Create Account').should('be.visible');
      cy.get('input[name="name"]').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
      cy.get('input[name="confirmPassword"]').should('be.visible');
    });

    it('should successfully register a new user', () => {
      const uniqueEmail = `test${Date.now()}@example.com`;

      cy.visit('/signup');
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type(uniqueEmail);
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Should redirect to home page after successful signup
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);

      // Should have token in localStorage
      cy.window().then((window) => {
        expect(window.localStorage.getItem('token')).to.exist;
      });
    });

    it('should show validation errors for invalid data', () => {
      cy.visit('/signup');
      cy.get('button[type="submit"]').click();

      // Should show required field errors
      cy.contains('Name is required').should('be.visible');
      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should show error for password mismatch', () => {
      cy.visit('/signup');
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password456');
      cy.get('button[type="submit"]').click();

      cy.contains('Passwords do not match').should('be.visible');
    });

    it('should show error for duplicate email', () => {
      const email = 'existing@example.com';

      // Create user first
      cy.createUserViaAPI({
        name: 'Existing User',
        email,
        password: 'password123',
      });

      // Try to signup with same email
      cy.visit('/signup');
      cy.get('input[name="name"]').type('Test User');
      cy.get('input[name="email"]').type(email);
      cy.get('input[name="password"]').type('password123');
      cy.get('input[name="confirmPassword"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Should show error toast
      cy.contains('already exists').should('be.visible');
    });

    it('should navigate to login page from signup', () => {
      cy.visit('/signup');
      cy.contains('Sign in instead').click();
      cy.url().should('include', '/login');
    });
  });

  describe('Login', () => {
    beforeEach(() => {
      // Create a test user before each login test
      cy.createUserViaAPI({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
    });

    it('should display login form', () => {
      cy.visit('/login');
      cy.contains('Welcome Back').should('be.visible');
      cy.get('input[name="email"]').should('be.visible');
      cy.get('input[name="password"]').should('be.visible');
    });

    it('should successfully login with valid credentials', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      // Should redirect to home page
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);

      // Should have token in localStorage
      cy.window().then((window) => {
        expect(window.localStorage.getItem('token')).to.exist;
      });
    });

    it('should show error for invalid email', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('nonexistent@example.com');
      cy.get('input[name="password"]').type('password123');
      cy.get('button[type="submit"]').click();

      cy.contains('Invalid credentials').should('be.visible');
    });

    it('should show error for invalid password', () => {
      cy.visit('/login');
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('input[name="password"]').type('wrongpassword');
      cy.get('button[type="submit"]').click();

      cy.contains('Invalid credentials').should('be.visible');
    });

    it('should show validation errors for empty fields', () => {
      cy.visit('/login');
      cy.get('button[type="submit"]').click();

      cy.contains('Email is required').should('be.visible');
      cy.contains('Password is required').should('be.visible');
    });

    it('should navigate to signup page from login', () => {
      cy.visit('/login');
      cy.contains('Create an account').click();
      cy.url().should('include', '/signup');
    });
  });

  describe('Logout', () => {
    beforeEach(() => {
      // Create and login user
      cy.createUserViaAPI({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
      cy.loginViaAPI('test@example.com', 'password123');
    });

    it('should successfully logout', () => {
      cy.visit('/');
      cy.logout();

      // Should redirect to login
      cy.url().should('include', '/login');

      // Should clear localStorage
      cy.window().then((window) => {
        expect(window.localStorage.getItem('token')).to.be.null;
      });
    });
  });

  describe('Protected Routes', () => {
    it('should redirect to login when not authenticated', () => {
      cy.visit('/');
      cy.url().should('include', '/login');
    });

    it('should allow access to protected routes when authenticated', () => {
      cy.createUserViaAPI({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
      cy.loginViaAPI('test@example.com', 'password123');

      cy.visit('/');
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
      cy.contains('Bug Tracker').should('be.visible');
    });

    it('should persist authentication on page refresh', () => {
      cy.createUserViaAPI({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });
      cy.loginViaAPI('test@example.com', 'password123');

      cy.visit('/');
      cy.reload();

      // Should still be on protected route
      cy.url().should('eq', `${Cypress.config().baseUrl}/`);
    });
  });
});
