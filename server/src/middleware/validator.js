/**
 * Validation Middleware
 * Express-validator middleware for request validation
 */

const { body, param, query, validationResult } = require('express-validator');
const { BUG_STATUS, BUG_PRIORITY, BUG_SEVERITY, VALIDATION_RULES } = require('../config/constants');
const { validationErrorResponse } = require('../utils/apiResponse');
const mongoose = require('mongoose');

/**
 * Validation rules for creating a bug
 */
const createBugValidation = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: VALIDATION_RULES.TITLE.MIN_LENGTH, max: VALIDATION_RULES.TITLE.MAX_LENGTH })
    .withMessage(
      `Title must be between ${VALIDATION_RULES.TITLE.MIN_LENGTH} and ${VALIDATION_RULES.TITLE.MAX_LENGTH} characters`
    ),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: VALIDATION_RULES.DESCRIPTION.MIN_LENGTH, max: VALIDATION_RULES.DESCRIPTION.MAX_LENGTH })
    .withMessage(
      `Description must be between ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} and ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`
    ),

  body('status')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(Object.values(BUG_STATUS))
    .withMessage(`Status must be one of: ${Object.values(BUG_STATUS).join(', ')}`),

  body('priority')
    .trim()
    .notEmpty()
    .withMessage('Priority is required')
    .toLowerCase()
    .isIn(Object.values(BUG_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(BUG_PRIORITY).join(', ')}`),

  body('severity')
    .trim()
    .notEmpty()
    .withMessage('Severity is required')
    .toLowerCase()
    .isIn(Object.values(BUG_SEVERITY))
    .withMessage(`Severity must be one of: ${Object.values(BUG_SEVERITY).join(', ')}`),

  body('createdBy')
    .trim()
    .notEmpty()
    .withMessage('Created by is required')
    .isLength({ min: VALIDATION_RULES.CREATED_BY.MIN_LENGTH, max: VALIDATION_RULES.CREATED_BY.MAX_LENGTH })
    .withMessage(
      `Created by must be between ${VALIDATION_RULES.CREATED_BY.MIN_LENGTH} and ${VALIDATION_RULES.CREATED_BY.MAX_LENGTH} characters`
    ),
];

/**
 * Validation rules for updating a bug
 */
const updateBugValidation = [
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: VALIDATION_RULES.TITLE.MIN_LENGTH, max: VALIDATION_RULES.TITLE.MAX_LENGTH })
    .withMessage(
      `Title must be between ${VALIDATION_RULES.TITLE.MIN_LENGTH} and ${VALIDATION_RULES.TITLE.MAX_LENGTH} characters`
    ),

  body('description')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Description cannot be empty')
    .isLength({ min: VALIDATION_RULES.DESCRIPTION.MIN_LENGTH, max: VALIDATION_RULES.DESCRIPTION.MAX_LENGTH })
    .withMessage(
      `Description must be between ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} and ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`
    ),

  body('status')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(Object.values(BUG_STATUS))
    .withMessage(`Status must be one of: ${Object.values(BUG_STATUS).join(', ')}`),

  body('priority')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(Object.values(BUG_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(BUG_PRIORITY).join(', ')}`),

  body('severity')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(Object.values(BUG_SEVERITY))
    .withMessage(`Severity must be one of: ${Object.values(BUG_SEVERITY).join(', ')}`),

  body('createdBy')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Created by cannot be empty')
    .isLength({ min: VALIDATION_RULES.CREATED_BY.MIN_LENGTH, max: VALIDATION_RULES.CREATED_BY.MAX_LENGTH })
    .withMessage(
      `Created by must be between ${VALIDATION_RULES.CREATED_BY.MIN_LENGTH} and ${VALIDATION_RULES.CREATED_BY.MAX_LENGTH} characters`
    ),
];

/**
 * Validation rules for partial update (status change)
 */
const patchBugValidation = [
  body('status')
    .trim()
    .notEmpty()
    .withMessage('Status is required')
    .toLowerCase()
    .isIn(Object.values(BUG_STATUS))
    .withMessage(`Status must be one of: ${Object.values(BUG_STATUS).join(', ')}`),
];

/**
 * Validation rules for MongoDB ObjectId parameter
 */
const validateObjectId = [
  param('id')
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error('Invalid bug ID format');
      }
      return true;
    }),
];

/**
 * Validation rules for query parameters
 */
const queryValidation = [
  query('status')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(Object.values(BUG_STATUS))
    .withMessage(`Status must be one of: ${Object.values(BUG_STATUS).join(', ')}`),

  query('priority')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(Object.values(BUG_PRIORITY))
    .withMessage(`Priority must be one of: ${Object.values(BUG_PRIORITY).join(', ')}`),

  query('severity')
    .optional()
    .trim()
    .toLowerCase()
    .isIn(Object.values(BUG_SEVERITY))
    .withMessage(`Severity must be one of: ${Object.values(BUG_SEVERITY).join(', ')}`),

  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),

  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),

  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'priority', 'severity', 'status'])
    .withMessage('Invalid sort field'),

  query('order')
    .optional()
    .toLowerCase()
    .isIn(['asc', 'desc'])
    .withMessage('Order must be asc or desc'),
];

/**
 * Middleware to handle validation results
 * @param {object} req - Express request object
 * @param {object} res - Express response object
 * @param {function} next - Express next function
 */
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path || error.param,
      message: error.msg,
    }));

    return validationErrorResponse(res, formattedErrors);
  }

  next();
};

module.exports = {
  createBugValidation,
  updateBugValidation,
  patchBugValidation,
  validateObjectId,
  queryValidation,
  handleValidationErrors,
};
