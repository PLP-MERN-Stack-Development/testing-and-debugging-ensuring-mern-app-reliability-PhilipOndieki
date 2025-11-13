/**
 * Authentication Service
 * Handles API calls for authentication
 */

import api from './api';

const API_URL = '/auth';

/**
 * Register a new user
 * @param {Object} userData - User registration data
 * @returns {Promise} Response with user and token
 */
export const signup = async (userData) => {
  const response = await api.post(`${API_URL}/signup`, userData);

  if (response.data.success && response.data.data.token) {
    // Store token in localStorage
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }

  return response.data;
};

/**
 * Login user
 * @param {Object} credentials - User login credentials
 * @returns {Promise} Response with user and token
 */
export const login = async (credentials) => {
  const response = await api.post(`${API_URL}/login`, credentials);

  if (response.data.success && response.data.data.token) {
    // Store token in localStorage
    localStorage.setItem('token', response.data.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.data.user));
  }

  return response.data;
};

/**
 * Logout user
 * @returns {Promise} Response
 */
export const logout = async () => {
  try {
    const token = localStorage.getItem('token');

    if (token) {
      await api.post(`${API_URL}/logout`);
    }
  } catch (error) {
    // Even if the API call fails, we still want to clear local storage
    console.error('Logout error:', error);
  } finally {
    // Clear token and user from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

/**
 * Get current user profile
 * @returns {Promise} Response with user data
 */
export const getMe = async () => {
  const response = await api.get(`${API_URL}/me`);
  return response.data;
};

/**
 * Get stored user from localStorage
 * @returns {Object|null} User object or null
 */
export const getStoredUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Error parsing stored user:', error);
    return null;
  }
};

/**
 * Get stored token from localStorage
 * @returns {string|null} Token or null
 */
export const getStoredToken = () => {
  return localStorage.getItem('token');
};

/**
 * Check if user is authenticated
 * @returns {boolean} True if authenticated, false otherwise
 */
export const isAuthenticated = () => {
  const token = getStoredToken();
  return !!token;
};

export default {
  signup,
  login,
  logout,
  getMe,
  getStoredUser,
  getStoredToken,
  isAuthenticated,
};
