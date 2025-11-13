/**
 * Utility helper functions
 */

import clsx from 'clsx';
import { BUG_STATUS, BUG_PRIORITY, BUG_SEVERITY } from './constants';

/**
 * Combines class names using clsx
 * @param  {...any} classes - Class names to combine
 * @returns {string} Combined class names
 */
export const cn = (...classes) => {
  return clsx(...classes);
};

/**
 * Gets the color class for a status badge
 * @param {string} status - Bug status
 * @returns {string} Tailwind color classes
 */
export const getStatusColor = (status) => {
  const colors = {
    [BUG_STATUS.OPEN]: 'bg-status-open/10 text-status-open border-status-open/20',
    [BUG_STATUS.IN_PROGRESS]: 'bg-status-progress/10 text-status-progress border-status-progress/20',
    [BUG_STATUS.RESOLVED]: 'bg-status-resolved/10 text-status-resolved border-status-resolved/20',
    [BUG_STATUS.CLOSED]: 'bg-status-closed/10 text-status-closed border-status-closed/20',
  };
  return colors[status] || colors[BUG_STATUS.OPEN];
};

/**
 * Gets the color class for a priority badge
 * @param {string} priority - Bug priority
 * @returns {string} Tailwind color classes
 */
export const getPriorityColor = (priority) => {
  const colors = {
    [BUG_PRIORITY.LOW]: 'bg-priority-low/10 text-priority-low border-priority-low/20',
    [BUG_PRIORITY.MEDIUM]: 'bg-priority-medium/10 text-priority-medium border-priority-medium/20',
    [BUG_PRIORITY.HIGH]: 'bg-priority-high/10 text-priority-high border-priority-high/20',
    [BUG_PRIORITY.CRITICAL]: 'bg-priority-critical/10 text-priority-critical border-priority-critical/20',
  };
  return colors[priority] || colors[BUG_PRIORITY.LOW];
};

/**
 * Gets the color class for a severity badge
 * @param {string} severity - Bug severity
 * @returns {string} Tailwind color classes
 */
export const getSeverityColor = (severity) => {
  const colors = {
    [BUG_SEVERITY.MINOR]: 'bg-severity-minor/10 text-severity-minor border-severity-minor/20',
    [BUG_SEVERITY.MAJOR]: 'bg-severity-major/10 text-severity-major border-severity-major/20',
    [BUG_SEVERITY.CRITICAL]: 'bg-severity-critical/10 text-severity-critical border-severity-critical/20',
  };
  return colors[severity] || colors[BUG_SEVERITY.MINOR];
};

/**
 * Groups bugs by status
 * @param {Array} bugs - Array of bug objects
 * @returns {Object} Bugs grouped by status
 */
export const groupBugsByStatus = (bugs) => {
  return bugs.reduce((acc, bug) => {
    const status = bug.status || BUG_STATUS.OPEN;
    if (!acc[status]) {
      acc[status] = [];
    }
    acc[status].push(bug);
    return acc;
  }, {});
};

/**
 * Filters bugs based on search term and filters
 * @param {Array} bugs - Array of bug objects
 * @param {Object} filters - Filter object
 * @returns {Array} Filtered bugs
 */
export const filterBugs = (bugs, filters) => {
  let filtered = [...bugs];

  // Search filter
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (bug) =>
        bug.title.toLowerCase().includes(searchLower) ||
        bug.description.toLowerCase().includes(searchLower) ||
        bug.createdBy.toLowerCase().includes(searchLower)
    );
  }

  // Priority filter
  if (filters.priority && filters.priority.length > 0) {
    filtered = filtered.filter((bug) => filters.priority.includes(bug.priority));
  }

  // Severity filter
  if (filters.severity && filters.severity.length > 0) {
    filtered = filtered.filter((bug) => filters.severity.includes(bug.severity));
  }

  // Status filter
  if (filters.status && filters.status.length > 0) {
    filtered = filtered.filter((bug) => filters.status.includes(bug.status));
  }

  return filtered;
};
