/**
 * Bug API Service
 * All bug-related API calls
 */

import api from './api';

export const bugService = {
  /**
   * Get all bugs with optional filters
   * @param {Object} params - Query parameters (page, limit, status, priority, severity)
   * @returns {Promise} API response
   */
  getAllBugs: (params = {}) => {
    return api.get('/bugs', { params });
  },

  /**
   * Get a single bug by ID
   * @param {string} id - Bug ID
   * @returns {Promise} API response
   */
  getBugById: (id) => {
    return api.get(`/bugs/${id}`);
  },

  /**
   * Create a new bug
   * @param {Object} data - Bug data
   * @returns {Promise} API response
   */
  createBug: (data) => {
    return api.post('/bugs', data);
  },

  /**
   * Update a bug (full update)
   * @param {string} id - Bug ID
   * @param {Object} data - Updated bug data
   * @returns {Promise} API response
   */
  updateBug: (id, data) => {
    return api.put(`/bugs/${id}`, data);
  },

  /**
   * Partial update (e.g., status change)
   * @param {string} id - Bug ID
   * @param {Object} data - Partial bug data
   * @returns {Promise} API response
   */
  patchBug: (id, data) => {
    return api.patch(`/bugs/${id}`, data);
  },

  /**
   * Delete a bug
   * @param {string} id - Bug ID
   * @returns {Promise} API response
   */
  deleteBug: (id) => {
    return api.delete(`/bugs/${id}`);
  },

  /**
   * Get bug statistics
   * @returns {Promise} API response
   */
  getBugStats: () => {
    return api.get('/bugs/stats');
  },
};
