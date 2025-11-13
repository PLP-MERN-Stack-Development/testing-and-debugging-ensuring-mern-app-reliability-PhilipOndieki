/**
 * Bug Validation Utilities
 * Custom validation functions for bug data
 */

const {
  BUG_STATUS,
  BUG_PRIORITY,
  BUG_SEVERITY,
  VALIDATION_RULES,
} = require('../config/constants');

/**
 * Validate bug title
 * @param {string} title - Bug title
 * @returns {object} - Validation result { isValid: boolean, error: string }
 */
const validateTitle = (title) => {
  if (!title || typeof title !== 'string') {
    return { isValid: false, error: 'Title is required and must be a string' };
  }

  const trimmedTitle = title.trim();

  if (trimmedTitle.length < VALIDATION_RULES.TITLE.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Title must be at least ${VALIDATION_RULES.TITLE.MIN_LENGTH} characters`,
    };
  }

  if (trimmedTitle.length > VALIDATION_RULES.TITLE.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Title must not exceed ${VALIDATION_RULES.TITLE.MAX_LENGTH} characters`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate bug description
 * @param {string} description - Bug description
 * @returns {object} - Validation result { isValid: boolean, error: string }
 */
const validateDescription = (description) => {
  if (!description || typeof description !== 'string') {
    return { isValid: false, error: 'Description is required and must be a string' };
  }

  const trimmedDescription = description.trim();

  if (trimmedDescription.length < VALIDATION_RULES.DESCRIPTION.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Description must be at least ${VALIDATION_RULES.DESCRIPTION.MIN_LENGTH} characters`,
    };
  }

  if (trimmedDescription.length > VALIDATION_RULES.DESCRIPTION.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Description must not exceed ${VALIDATION_RULES.DESCRIPTION.MAX_LENGTH} characters`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate bug status
 * @param {string} status - Bug status
 * @returns {object} - Validation result { isValid: boolean, error: string }
 */
const validateStatus = (status) => {
  if (!status) {
    return { isValid: true, error: null }; // Status is optional (has default)
  }

  if (!Object.values(BUG_STATUS).includes(status)) {
    return {
      isValid: false,
      error: `Status must be one of: ${Object.values(BUG_STATUS).join(', ')}`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate bug priority
 * @param {string} priority - Bug priority
 * @returns {object} - Validation result { isValid: boolean, error: string }
 */
const validatePriority = (priority) => {
  if (!priority) {
    return { isValid: false, error: 'Priority is required' };
  }

  if (!Object.values(BUG_PRIORITY).includes(priority)) {
    return {
      isValid: false,
      error: `Priority must be one of: ${Object.values(BUG_PRIORITY).join(', ')}`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate bug severity
 * @param {string} severity - Bug severity
 * @returns {object} - Validation result { isValid: boolean, error: string }
 */
const validateSeverity = (severity) => {
  if (!severity) {
    return { isValid: false, error: 'Severity is required' };
  }

  if (!Object.values(BUG_SEVERITY).includes(severity)) {
    return {
      isValid: false,
      error: `Severity must be one of: ${Object.values(BUG_SEVERITY).join(', ')}`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate createdBy field
 * @param {string} createdBy - Creator name
 * @returns {object} - Validation result { isValid: boolean, error: string }
 */
const validateCreatedBy = (createdBy) => {
  if (!createdBy || typeof createdBy !== 'string') {
    return { isValid: false, error: 'Created by is required and must be a string' };
  }

  const trimmedCreatedBy = createdBy.trim();

  if (trimmedCreatedBy.length < VALIDATION_RULES.CREATED_BY.MIN_LENGTH) {
    return {
      isValid: false,
      error: `Created by must be at least ${VALIDATION_RULES.CREATED_BY.MIN_LENGTH} characters`,
    };
  }

  if (trimmedCreatedBy.length > VALIDATION_RULES.CREATED_BY.MAX_LENGTH) {
    return {
      isValid: false,
      error: `Created by must not exceed ${VALIDATION_RULES.CREATED_BY.MAX_LENGTH} characters`,
    };
  }

  return { isValid: true, error: null };
};

/**
 * Validate complete bug data
 * @param {object} bugData - Bug data object
 * @returns {object} - Validation result { isValid: boolean, errors: array }
 */
const validateBugData = (bugData) => {
  const errors = [];

  const titleValidation = validateTitle(bugData.title);
  if (!titleValidation.isValid) {
    errors.push({ field: 'title', message: titleValidation.error });
  }

  const descriptionValidation = validateDescription(bugData.description);
  if (!descriptionValidation.isValid) {
    errors.push({ field: 'description', message: descriptionValidation.error });
  }

  const statusValidation = validateStatus(bugData.status);
  if (!statusValidation.isValid) {
    errors.push({ field: 'status', message: statusValidation.error });
  }

  const priorityValidation = validatePriority(bugData.priority);
  if (!priorityValidation.isValid) {
    errors.push({ field: 'priority', message: priorityValidation.error });
  }

  const severityValidation = validateSeverity(bugData.severity);
  if (!severityValidation.isValid) {
    errors.push({ field: 'severity', message: severityValidation.error });
  }

  const createdByValidation = validateCreatedBy(bugData.createdBy);
  if (!createdByValidation.isValid) {
    errors.push({ field: 'createdBy', message: createdByValidation.error });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Sanitize bug data
 * @param {object} bugData - Bug data object
 * @returns {object} - Sanitized bug data
 */
const sanitizeBugData = (bugData) => {
  const sanitized = {};

  if (bugData.title) {
    sanitized.title = bugData.title.trim();
  }

  if (bugData.description) {
    sanitized.description = bugData.description.trim();
  }

  if (bugData.status) {
    sanitized.status = bugData.status.toLowerCase().trim();
  }

  if (bugData.priority) {
    sanitized.priority = bugData.priority.toLowerCase().trim();
  }

  if (bugData.severity) {
    sanitized.severity = bugData.severity.toLowerCase().trim();
  }

  if (bugData.createdBy) {
    sanitized.createdBy = bugData.createdBy.trim();
  }

  return sanitized;
};

module.exports = {
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
  validateSeverity,
  validateCreatedBy,
  validateBugData,
  sanitizeBugData,
};
