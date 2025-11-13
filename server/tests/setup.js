/**
 * Test Setup File
 * Global configuration for Jest tests
 */

// Set test environment variables
process.env.NODE_ENV = 'test';
process.env.PORT = '5001';
process.env.LOG_LEVEL = 'error';
process.env.API_PREFIX = '/api';

// Set longer timeout for database operations
jest.setTimeout(10000);

// Mock console methods to reduce noise in test output
global.console = {
  ...console,
  log: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warn: jest.fn(),
  // Keep error and other methods for debugging
  error: console.error,
};

// Global test utilities
global.testUtils = {
  /**
   * Create a valid bug data object for testing
   * @param {object} overrides - Fields to override
   * @returns {object} Bug data object
   */
  createValidBugData: (overrides = {}) => ({
    title: 'Test Bug Title',
    description: 'This is a test bug description with enough characters for validation',
    priority: 'medium',
    severity: 'major',
    status: 'open',
    createdBy: 'Test User',
    ...overrides,
  }),

  /**
   * Sleep for testing async operations
   * @param {number} ms - Milliseconds to sleep
   * @returns {Promise}
   */
  sleep: (ms) => new Promise((resolve) => setTimeout(resolve, ms)),
};
