/**
 * Authentication Context
 * Manages global authentication state
 */

import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // Configure axios defaults
  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token]);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = async () => {
      if (token) {
        try {
          // Verify token is still valid
          const decoded = jwtDecode(token);
          if (decoded.exp * 1000 < Date.now()) {
            // Token expired
            logout();
          } else {
            // Fetch user data
            const response = await axios.get('/api/auth/me');
            setUser(response.data.data);
          }
        } catch (error) {
          console.error('Auth initialization error:', error);
          logout();
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const signup = async (userData) => {
    try {
      const response = await axios.post('/api/auth/signup', userData);
      const { token: newToken, user: newUser } = response.data.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Signup failed';
      return { success: false, error: errorMessage };
    }
  };

  const login = async (credentials) => {
    try {
      const response = await axios.post('/api/auth/login', credentials);
      const { token: newToken, user: newUser } = response.data.data;
      setToken(newToken);
      setUser(newUser);
      localStorage.setItem('token', newToken);
      return { success: true, data: response.data };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Call logout endpoint if user is authenticated
      if (token) {
        await axios.post('/api/auth/logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      // Clear state regardless of API call success
      setToken(null);
      setUser(null);
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['Authorization'];
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    token,
    loading,
    signup,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export default AuthContext;
