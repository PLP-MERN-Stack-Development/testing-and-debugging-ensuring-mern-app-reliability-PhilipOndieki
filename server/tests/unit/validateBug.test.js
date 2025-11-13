/**
 * Unit Tests for Bug Validation Utilities
 */

const {
  validateTitle,
  validateDescription,
  validateStatus,
  validatePriority,
  validateSeverity,
  validateCreatedBy,
  validateBugData,
  sanitizeBugData,
} = require('../../src/utils/validateBug');

describe('Bug Validation Utilities - Unit Tests', () => {
  describe('validateTitle', () => {
    it('should return valid for a proper title', () => {
      const result = validateTitle('Valid Bug Title');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return invalid for title that is too short', () => {
      const result = validateTitle('AB');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 3 characters');
    });

    it('should return invalid for title that is too long', () => {
      const longTitle = 'A'.repeat(101);
      const result = validateTitle(longTitle);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must not exceed 100 characters');
    });

    it('should return invalid for empty title', () => {
      const result = validateTitle('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should return invalid for null title', () => {
      const result = validateTitle(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should return invalid for non-string title', () => {
      const result = validateTitle(123);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a string');
    });

    it('should handle whitespace correctly', () => {
      const result = validateTitle('   Valid   ');
      expect(result.isValid).toBe(true);
    });
  });

  describe('validateDescription', () => {
    it('should return valid for a proper description', () => {
      const result = validateDescription('This is a valid bug description with enough characters');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return invalid for description that is too short', () => {
      const result = validateDescription('Short');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 10 characters');
    });

    it('should return invalid for description that is too long', () => {
      const longDescription = 'A'.repeat(1001);
      const result = validateDescription(longDescription);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must not exceed 1000 characters');
    });

    it('should return invalid for empty description', () => {
      const result = validateDescription('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should return invalid for non-string description', () => {
      const result = validateDescription({ desc: 'test' });
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a string');
    });
  });

  describe('validateStatus', () => {
    it('should return valid for "open" status', () => {
      const result = validateStatus('open');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return valid for "in-progress" status', () => {
      const result = validateStatus('in-progress');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for "resolved" status', () => {
      const result = validateStatus('resolved');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for "closed" status', () => {
      const result = validateStatus('closed');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for invalid status', () => {
      const result = validateStatus('invalid-status');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be one of');
    });

    it('should return valid for undefined status (optional field)', () => {
      const result = validateStatus(undefined);
      expect(result.isValid).toBe(true);
    });
  });

  describe('validatePriority', () => {
    it('should return valid for "low" priority', () => {
      const result = validatePriority('low');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return valid for "medium" priority', () => {
      const result = validatePriority('medium');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for "high" priority', () => {
      const result = validatePriority('high');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for "critical" priority', () => {
      const result = validatePriority('critical');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for invalid priority', () => {
      const result = validatePriority('urgent');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be one of');
    });

    it('should return invalid for missing priority', () => {
      const result = validatePriority(undefined);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
    });
  });

  describe('validateSeverity', () => {
    it('should return valid for "minor" severity', () => {
      const result = validateSeverity('minor');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return valid for "major" severity', () => {
      const result = validateSeverity('major');
      expect(result.isValid).toBe(true);
    });

    it('should return valid for "critical" severity', () => {
      const result = validateSeverity('critical');
      expect(result.isValid).toBe(true);
    });

    it('should return invalid for invalid severity', () => {
      const result = validateSeverity('blocker');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be one of');
    });

    it('should return invalid for missing severity', () => {
      const result = validateSeverity(null);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
    });
  });

  describe('validateCreatedBy', () => {
    it('should return valid for a proper createdBy value', () => {
      const result = validateCreatedBy('John Doe');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    it('should return invalid for createdBy that is too short', () => {
      const result = validateCreatedBy('A');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('at least 2 characters');
    });

    it('should return invalid for createdBy that is too long', () => {
      const longName = 'A'.repeat(51);
      const result = validateCreatedBy(longName);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must not exceed 50 characters');
    });

    it('should return invalid for empty createdBy', () => {
      const result = validateCreatedBy('');
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('required');
    });

    it('should return invalid for non-string createdBy', () => {
      const result = validateCreatedBy(12345);
      expect(result.isValid).toBe(false);
      expect(result.error).toContain('must be a string');
    });
  });

  describe('validateBugData', () => {
    const validBugData = {
      title: 'Valid Bug Title',
      description: 'This is a valid bug description with enough characters',
      status: 'open',
      priority: 'high',
      severity: 'major',
      createdBy: 'John Doe',
    };

    it('should return valid for complete valid bug data', () => {
      const result = validateBugData(validBugData);
      expect(result.isValid).toBe(true);
      expect(result.errors).toHaveLength(0);
    });

    it('should return invalid for bug data with multiple errors', () => {
      const invalidBugData = {
        title: 'AB',
        description: 'Short',
        status: 'invalid',
        priority: 'invalid',
        severity: 'invalid',
        createdBy: 'A',
      };

      const result = validateBugData(invalidBugData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should collect all validation errors', () => {
      const invalidBugData = {
        title: '',
        description: '',
        priority: '',
        severity: '',
        createdBy: '',
      };

      const result = validateBugData(invalidBugData);
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(3);
    });

    it('should handle missing fields', () => {
      const incompleteBugData = {
        title: 'Valid Title',
      };

      const result = validateBugData(incompleteBugData);
      expect(result.isValid).toBe(false);
      expect(result.errors.some(err => err.field === 'description')).toBe(true);
      expect(result.errors.some(err => err.field === 'priority')).toBe(true);
    });
  });

  describe('sanitizeBugData', () => {
    it('should trim whitespace from all fields', () => {
      const bugData = {
        title: '  Title with spaces  ',
        description: '  Description with spaces  ',
        status: '  open  ',
        priority: '  high  ',
        severity: '  major  ',
        createdBy: '  John Doe  ',
      };

      const sanitized = sanitizeBugData(bugData);
      expect(sanitized.title).toBe('Title with spaces');
      expect(sanitized.description).toBe('Description with spaces');
      expect(sanitized.status).toBe('open');
      expect(sanitized.priority).toBe('high');
      expect(sanitized.severity).toBe('major');
      expect(sanitized.createdBy).toBe('John Doe');
    });

    it('should convert enum fields to lowercase', () => {
      const bugData = {
        status: 'OPEN',
        priority: 'HIGH',
        severity: 'MAJOR',
      };

      const sanitized = sanitizeBugData(bugData);
      expect(sanitized.status).toBe('open');
      expect(sanitized.priority).toBe('high');
      expect(sanitized.severity).toBe('major');
    });

    it('should handle missing fields gracefully', () => {
      const bugData = {
        title: 'Test Title',
      };

      const sanitized = sanitizeBugData(bugData);
      expect(sanitized.title).toBe('Test Title');
      expect(sanitized.description).toBeUndefined();
    });

    it('should return empty object for empty input', () => {
      const sanitized = sanitizeBugData({});
      expect(Object.keys(sanitized).length).toBe(0);
    });
  });
});
