/**
 * Jest Test Setup
 * Configuration for React Testing Library
 */

import '@testing-library/jest-dom';

// Mock import.meta for Vite
global.import = {
  meta: {
    env: {
      VITE_API_URL: 'http://localhost:5000/api',
      VITE_NODE_ENV: 'test',
      VITE_APP_NAME: 'Bug Tracker',
      VITE_APP_VERSION: '1.0.0',
      DEV: false,
      PROD: false,
    },
  },
};

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {}
  disconnect() {}
  observe() {}
  takeRecords() {
    return [];
  }
  unobserve() {}
};
