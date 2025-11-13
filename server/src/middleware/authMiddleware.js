/**
 * Authentication Middleware
 * Handles JWT token verification and role-based authorization
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

/**
 * Protect routes - Verify JWT token
 */
const protect = async (req, res, next) => {
  let token;

  // Check if token exists in Authorization header
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  // Make sure token exists
  if (!token) {
    logger.warn('No token provided for protected route');
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route. Please log in.',
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
    );

    // Find user by ID from token
    const user = await User.findById(decoded.id).select('-password');

    if (!user) {
      logger.warn(`Token valid but user not found: ${decoded.id}`);
      return res.status(401).json({
        success: false,
        message: 'User not found',
      });
    }

    // Attach user to request object
    req.user = user;
    next();
  } catch (error) {
    logger.error(`Token verification failed: ${error.message}`);

    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token expired. Please log in again.',
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route',
    });
  }
};

/**
 * Authorize roles - Check if user has required role
 * @param  {...string} roles - Allowed roles
 */
const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      logger.warn('Authorize middleware called without user in request');
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route',
      });
    }

    if (!roles.includes(req.user.role)) {
      logger.warn(
        `User ${req.user.email} with role ${req.user.role} tried to access resource requiring roles: ${roles.join(', ')}`
      );
      return res.status(403).json({
        success: false,
        message: `User role '${req.user.role}' is not authorized to access this route`,
      });
    }

    next();
  };
};

module.exports = { protect, authorize };
