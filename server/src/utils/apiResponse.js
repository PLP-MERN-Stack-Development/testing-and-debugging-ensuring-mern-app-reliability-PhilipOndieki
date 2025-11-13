/**
 * API Response Utilities
 * Standardized response formatters for API endpoints
 */

const { HTTP_STATUS } = require('../config/constants');

/**
 * Success response
 * @param {object} res - Express response object
 * @param {object} data - Response data
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code
 * @returns {object} - Express response
 */
const successResponse = (res, data = null, message = 'Success', statusCode = HTTP_STATUS.OK) => {
  const response = {
    success: true,
    message,
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

/**
 * Error response
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code
 * @param {array} errors - Detailed errors array
 * @returns {object} - Express response
 */
const errorResponse = (res, message = 'Error', statusCode = HTTP_STATUS.INTERNAL_SERVER_ERROR, errors = null) => {
  const response = {
    success: false,
    message,
  };

  if (errors && errors.length > 0) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};

/**
 * Created response (201)
 * @param {object} res - Express response object
 * @param {object} data - Created resource data
 * @param {string} message - Success message
 * @returns {object} - Express response
 */
const createdResponse = (res, data, message = 'Resource created successfully') => {
  return successResponse(res, data, message, HTTP_STATUS.CREATED);
};

/**
 * Validation error response (400)
 * @param {object} res - Express response object
 * @param {array} errors - Validation errors
 * @param {string} message - Error message
 * @returns {object} - Express response
 */
const validationErrorResponse = (res, errors, message = 'Validation failed') => {
  return errorResponse(res, message, HTTP_STATUS.BAD_REQUEST, errors);
};

/**
 * Not found response (404)
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @returns {object} - Express response
 */
const notFoundResponse = (res, message = 'Resource not found') => {
  return errorResponse(res, message, HTTP_STATUS.NOT_FOUND);
};

/**
 * Internal server error response (500)
 * @param {object} res - Express response object
 * @param {string} message - Error message
 * @returns {object} - Express response
 */
const serverErrorResponse = (res, message = 'Internal server error') => {
  return errorResponse(res, message, HTTP_STATUS.INTERNAL_SERVER_ERROR);
};

/**
 * Pagination response
 * @param {object} res - Express response object
 * @param {array} data - Paginated data
 * @param {number} page - Current page
 * @param {number} limit - Items per page
 * @param {number} total - Total items
 * @param {string} message - Success message
 * @returns {object} - Express response
 */
const paginatedResponse = (res, data, page, limit, total, message = 'Data retrieved successfully') => {
  const totalPages = Math.ceil(total / limit);

  const response = {
    success: true,
    message,
    data,
    pagination: {
      currentPage: page,
      itemsPerPage: limit,
      totalItems: total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPreviousPage: page > 1,
    },
  };

  return res.status(HTTP_STATUS.OK).json(response);
};

module.exports = {
  successResponse,
  errorResponse,
  createdResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
  paginatedResponse,
};
