/**
 * Error Handling Middleware
 * Global error handler for the application
 */

const logger = require('../config/logger');
const { HTTP_STATUS, ERROR_MESSAGES } = require('../config/constants');

/**
 * Custom Error Classes
 */
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;
    Error.captureStackTrace(this, this.constructor);
  }
}

class ValidationError extends AppError {
  constructor(message = ERROR_MESSAGES.VALIDATION_ERROR) {
    super(message, HTTP_STATUS.BAD_REQUEST);
    this.name = 'ValidationError';
  }
}

class NotFoundError extends AppError {
  constructor(message = ERROR_MESSAGES.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND);
    this.name = 'NotFoundError';
  }
}

class DatabaseError extends AppError {
  constructor(message = ERROR_MESSAGES.DATABASE_ERROR) {
    super(message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
    this.name = 'DatabaseError';
  }
}

/**
 * Handle Mongoose Validation Errors
 * @param {object} err - Mongoose validation error
 * @returns {object} - Formatted error response
 */
const handleMongooseValidationError = (err) => {
  const errors = Object.values(err.errors).map((error) => ({
    field: error.path,
    message: error.message,
  }));

  return {
    message: ERROR_MESSAGES.VALIDATION_ERROR,
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errors,
  };
};

/**
 * Handle Mongoose Cast Errors (Invalid ID format)
 * @param {object} err - Mongoose cast error
 * @returns {object} - Formatted error response
 */
const handleMongooseCastError = (err) => {
  return {
    message: ERROR_MESSAGES.INVALID_ID,
    statusCode: HTTP_STATUS.BAD_REQUEST,
    errors: [{ field: err.path, message: `Invalid ${err.path}: ${err.value}` }],
  };
};

/**
 * Handle Mongoose Duplicate Key Errors
 * @param {object} err - Mongoose duplicate key error
 * @returns {object} - Formatted error response
 */
const handleMongooseDuplicateKeyError = (err) => {
  const field = Object.keys(err.keyValue)[0];
  const value = err.keyValue[field];

  return {
    message: 'Duplicate field value',
    statusCode: HTTP_STATUS.CONFLICT,
    errors: [{ field, message: `${field} '${value}' already exists` }],
  };
};

/**
 * Error Handler Middleware
 * @param {object} err - Error object
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log error
  logger.error(`Error: ${err.message}`, {
    error: err,
    stack: err.stack,
    url: req.url,
    method: req.method,
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const formatted = handleMongooseValidationError(err);
    error.message = formatted.message;
    error.statusCode = formatted.statusCode;
    error.errors = formatted.errors;
  }

  // Mongoose cast error (invalid ID)
  if (err.name === 'CastError') {
    const formatted = handleMongooseCastError(err);
    error.message = formatted.message;
    error.statusCode = formatted.statusCode;
    error.errors = formatted.errors;
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const formatted = handleMongooseDuplicateKeyError(err);
    error.message = formatted.message;
    error.statusCode = formatted.statusCode;
    error.errors = formatted.errors;
  }

  // Prepare response
  const statusCode = error.statusCode || HTTP_STATUS.INTERNAL_SERVER_ERROR;
  const message = error.message || ERROR_MESSAGES.INTERNAL_ERROR;

  const response = {
    success: false,
    message,
  };

  // Include errors array if available
  if (error.errors && error.errors.length > 0) {
    response.errors = error.errors;
  }

  // Include stack trace in development mode
  if (process.env.NODE_ENV === 'development') {
    response.stack = err.stack;
  }

  res.status(statusCode).json(response);
};

/**
 * Not Found Handler Middleware
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const notFoundHandler = (req, res, next) => {
  const error = new NotFoundError(`Route ${req.originalUrl} not found`);
  next(error);
};

module.exports = {
  errorHandler,
  notFoundHandler,
  AppError,
  ValidationError,
  NotFoundError,
  DatabaseError,
};
