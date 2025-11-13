/**
 * Authentication Middleware
 * Protects routes and handles authorization
 */

const jwt = require('jsonwebtoken');
const User = require('../models/User');
const logger = require('../config/logger');

/**
 * Protect routes - verify JWT token
 * Middleware to authenticate users via JWT token
 */
exports.protect = async (req, res, next) => {
  try {
    let token;

    // Check for token in Authorization header (Bearer token)
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
    // Check for token in cookies
    else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // Check if token exists
    if (!token) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized to access this route. Please login.'
      });
    }

    try {
      // Verify token
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key-change-in-production'
      );

      // Find user by ID from token payload
      const user = await User.findById(decoded.id).select('-password');

      if (!user) {
        return res.status(401).json({
          success: false,
          error: 'User not found. Token may be invalid.'
        });
      }

      // Attach user to request object
      req.user = user;
      next();
    } catch (error) {
      logger.error('Token verification failed:', error);

      if (error.name === 'TokenExpiredError') {
        return res.status(401).json({
          success: false,
          error: 'Token has expired. Please login again.'
        });
      }

      return res.status(401).json({
        success: false,
        error: 'Invalid token. Please login again.'
      });
    }
  } catch (error) {
    logger.error('Auth middleware error:', error);
    return res.status(500).json({
      success: false,
      error: 'Server error during authentication'
    });
  }
};

/**
 * Authorize specific roles
 * Middleware to restrict access based on user roles
 * @param  {...string} roles - Allowed roles (e.g., 'admin', 'user')
 */
exports.authorize = (...roles) => {
  return (req, res, next) => {
    // Check if user exists (should be set by protect middleware)
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: 'Not authorized. Please login first.'
      });
    }

    // Check if user's role is in the allowed roles
    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        error: `User role '${req.user.role}' is not authorized to access this route`
      });
    }

    next();
  };
};

/**
 * Optional auth - attach user if token exists, but don't require it
 * Useful for routes that work differently for authenticated vs non-authenticated users
 */
exports.optionalAuth = async (req, res, next) => {
  try {
    let token;

    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    // If no token, just continue without attaching user
    if (!token) {
      return next();
    }

    try {
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-secret-key-change-in-production'
      );
      const user = await User.findById(decoded.id).select('-password');

      if (user) {
        req.user = user;
      }
    } catch (error) {
      // Invalid token, but we don't fail the request
      logger.debug('Optional auth - invalid token:', error.message);
    }

    next();
  } catch (error) {
    logger.error('Optional auth middleware error:', error);
    next(); // Continue even on error
  }
};
