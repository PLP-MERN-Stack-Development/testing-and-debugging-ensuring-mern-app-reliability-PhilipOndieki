// Mock for Vite import.meta
export const meta = {
  env: {
    VITE_API_URL: 'http://localhost:5000/api',
    VITE_NODE_ENV: 'test',
    VITE_APP_NAME: 'Bug Tracker',
    VITE_APP_VERSION: '1.0.0',
    DEV: false,
    PROD: false,
  },
};

// Make it available globally for tests
global.import = {
  meta,
};
