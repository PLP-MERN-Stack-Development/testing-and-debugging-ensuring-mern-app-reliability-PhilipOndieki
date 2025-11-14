/**
 * Unit Tests for Validator Middleware
 */

const { validationResult } = require('express-validator');
const {
  handleValidationErrors,
} = require('../../src/middleware/validator');

// Mock express-validator
jest.mock('express-validator', () => ({
  ...jest.requireActual('express-validator'),
  validationResult: jest.fn(),
}));

describe('Validator Middleware - Unit Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      body: {},
      params: {},
      query: {},
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
    jest.clearAllMocks();
  });

  describe('handleValidationErrors', () => {
    it('should call next() when there are no validation errors', () => {
      validationResult.mockReturnValue({
        isEmpty: () => true,
        array: () => [],
      });

      handleValidationErrors(mockReq, mockRes, mockNext);

      expect(mockNext).toHaveBeenCalled();
      expect(mockRes.status).not.toHaveBeenCalled();
      expect(mockRes.json).not.toHaveBeenCalled();
    });

    it('should return 400 with errors when validation fails', () => {
      const errors = [
        { path: 'title', msg: 'Title is required' },
        { path: 'priority', msg: 'Invalid priority' },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => errors,
      });

      handleValidationErrors(mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Validation failed',
          errors: expect.arrayContaining([
            { field: 'title', message: 'Title is required' },
            { field: 'priority', message: 'Invalid priority' },
          ]),
        })
      );
      expect(mockNext).not.toHaveBeenCalled();
    });

    it('should handle errors with param field', () => {
      const errors = [
        { param: 'id', msg: 'Invalid ID format' },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => errors,
      });

      handleValidationErrors(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            { field: 'id', message: 'Invalid ID format' },
          ]),
        })
      );
    });

    it('should format multiple validation errors', () => {
      const errors = [
        { path: 'title', msg: 'Title is required' },
        { path: 'description', msg: 'Description too short' },
        { path: 'priority', msg: 'Invalid priority value' },
      ];

      validationResult.mockReturnValue({
        isEmpty: () => false,
        array: () => errors,
      });

      handleValidationErrors(mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          errors: expect.arrayContaining([
            { field: 'title', message: 'Title is required' },
            { field: 'description', message: 'Description too short' },
            { field: 'priority', message: 'Invalid priority value' },
          ]),
        })
      );
      expect(mockRes.json.mock.calls[0][0].errors).toHaveLength(3);
    });
  });
});
