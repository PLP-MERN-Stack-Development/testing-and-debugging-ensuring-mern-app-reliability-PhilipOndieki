/**
 * Application Constants
 */

export const BUG_STATUS = {
  OPEN: 'open',
  IN_PROGRESS: 'in-progress',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
};

export const BUG_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
};

export const BUG_SEVERITY = {
  MINOR: 'minor',
  MAJOR: 'major',
  CRITICAL: 'critical',
};

export const VALIDATION_RULES = {
  TITLE: {
    MIN_LENGTH: 3,
    MAX_LENGTH: 100,
  },
  DESCRIPTION: {
    MIN_LENGTH: 10,
    MAX_LENGTH: 1000,
  },
  CREATED_BY: {
    MIN_LENGTH: 2,
    MAX_LENGTH: 50,
  },
};

export const STATUS_LABELS = {
  [BUG_STATUS.OPEN]: 'Open',
  [BUG_STATUS.IN_PROGRESS]: 'In Progress',
  [BUG_STATUS.RESOLVED]: 'Resolved',
  [BUG_STATUS.CLOSED]: 'Closed',
};

export const PRIORITY_LABELS = {
  [BUG_PRIORITY.LOW]: 'Low',
  [BUG_PRIORITY.MEDIUM]: 'Medium',
  [BUG_PRIORITY.HIGH]: 'High',
  [BUG_PRIORITY.CRITICAL]: 'Critical',
};

export const SEVERITY_LABELS = {
  [BUG_SEVERITY.MINOR]: 'Minor',
  [BUG_SEVERITY.MAJOR]: 'Major',
  [BUG_SEVERITY.CRITICAL]: 'Critical',
};

export const STATUS_OPTIONS = Object.entries(STATUS_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const PRIORITY_OPTIONS = Object.entries(PRIORITY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

export const SEVERITY_OPTIONS = Object.entries(SEVERITY_LABELS).map(([value, label]) => ({
  value,
  label,
}));

// Use default for Jest tests, Vite will replace this at build time
export const API_BASE_URL = 'http://localhost:5000/api';

export const DEBOUNCE_DELAY = 300; // milliseconds
