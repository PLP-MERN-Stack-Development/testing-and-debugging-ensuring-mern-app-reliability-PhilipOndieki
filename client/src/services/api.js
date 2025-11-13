/**
 * Axios API Configuration
 * Centralized HTTP client with interceptors
 */

import axios from 'axios';
import { API_BASE_URL } from '../utils/constants';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
api.interceptors.request.use(
  (config) => {
    // Add auth token if needed in the future
    // const token = localStorage.getItem('token');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle different error scenarios
    if (error.response) {
      // Server responded with error status
      const { status, data } = error.response;

      switch (status) {
      case 400:
        console.error('Bad Request:', data.message || 'Invalid request');
        break;
      case 404:
        console.error('Not Found:', data.message || 'Resource not found');
        break;
      case 422:
        console.error('Validation Error:', data.message || 'Validation failed');
        break;
      case 500:
        console.error('Server Error:', data.message || 'Internal server error');
        break;
      default:
        console.error('Error:', data.message || 'An error occurred');
      }
    } else if (error.request) {
      // Request was made but no response received
      if (error.code === 'ECONNABORTED') {
        console.error('Request timeout - please try again');
      } else {
        console.error('Network error - please check your connection');
      }
    } else {
      // Something else happened
      console.error('Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
