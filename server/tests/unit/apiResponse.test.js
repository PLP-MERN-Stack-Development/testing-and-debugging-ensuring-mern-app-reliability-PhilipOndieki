/**
 * Unit Tests for API Response Utilities
 */

const {
  successResponse,
  errorResponse,
  createdResponse,
  validationErrorResponse,
  notFoundResponse,
  serverErrorResponse,
  paginatedResponse,
} = require('../../src/utils/apiResponse');
const { HTTP_STATUS } = require('../../src/config/constants');

describe('API Response Utilities - Unit Tests', () => {
  let mockRes;

  beforeEach(() => {
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
  });

  describe('successResponse', () => {
    it('should send success response with data', () => {
      const data = { id: 1, name: 'Test Bug' };
      const message = 'Success';

      successResponse(mockRes, data, message);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message,
        data,
      });
    });

    it('should send success response without data', () => {
      const message = 'Operation successful';

      successResponse(mockRes, null, message);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message,
      });
    });

    it('should use custom status code', () => {
      const data = { id: 1 };
      const message = 'Success';
      const customStatus = 201;

      successResponse(mockRes, data, message, customStatus);

      expect(mockRes.status).toHaveBeenCalledWith(customStatus);
    });

    it('should use default message', () => {
      successResponse(mockRes, { test: 'data' });

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Success',
        data: { test: 'data' },
      });
    });

    it('should handle empty object as data', () => {
      successResponse(mockRes, {}, 'Empty data');

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Empty data',
        data: {},
      });
    });
  });

  describe('errorResponse', () => {
    it('should send error response without detailed errors', () => {
      const message = 'An error occurred';

      errorResponse(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message,
      });
    });

    it('should send error response with detailed errors', () => {
      const message = 'Validation failed';
      const errors = [
        { field: 'email', message: 'Invalid email' },
        { field: 'password', message: 'Password too short' },
      ];

      errorResponse(mockRes, message, HTTP_STATUS.BAD_REQUEST, errors);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message,
        errors,
      });
    });

    it('should use custom status code', () => {
      const message = 'Not found';
      const customStatus = HTTP_STATUS.NOT_FOUND;

      errorResponse(mockRes, message, customStatus);

      expect(mockRes.status).toHaveBeenCalledWith(customStatus);
    });

    it('should handle empty errors array', () => {
      errorResponse(mockRes, 'Error', HTTP_STATUS.BAD_REQUEST, []);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Error',
      });
    });
  });

  describe('createdResponse', () => {
    it('should send 201 created response', () => {
      const data = { id: 1, name: 'New Bug' };
      const message = 'Bug created';

      createdResponse(mockRes, data, message);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.CREATED);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message,
        data,
      });
    });

    it('should use default message', () => {
      const data = { id: 1 };

      createdResponse(mockRes, data);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message: 'Resource created successfully',
        data,
      });
    });
  });

  describe('validationErrorResponse', () => {
    it('should send validation error response', () => {
      const errors = [
        { field: 'title', message: 'Title is required' },
        { field: 'description', message: 'Description is too short' },
      ];
      const message = 'Validation failed';

      validationErrorResponse(mockRes, errors, message);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.BAD_REQUEST);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message,
        errors,
      });
    });

    it('should use default message', () => {
      const errors = [{ field: 'test', message: 'Test error' }];

      validationErrorResponse(mockRes, errors);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Validation failed',
        errors,
      });
    });
  });

  describe('notFoundResponse', () => {
    it('should send 404 not found response', () => {
      const message = 'Bug not found';

      notFoundResponse(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.NOT_FOUND);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message,
      });
    });

    it('should use default message', () => {
      notFoundResponse(mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Resource not found',
      });
    });
  });

  describe('serverErrorResponse', () => {
    it('should send 500 server error response', () => {
      const message = 'Database connection failed';

      serverErrorResponse(mockRes, message);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.INTERNAL_SERVER_ERROR);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message,
      });
    });

    it('should use default message', () => {
      serverErrorResponse(mockRes);

      expect(mockRes.json).toHaveBeenCalledWith({
        success: false,
        message: 'Internal server error',
      });
    });
  });

  describe('paginatedResponse', () => {
    it('should send paginated response with correct metadata', () => {
      const data = [
        { id: 1, name: 'Bug 1' },
        { id: 2, name: 'Bug 2' },
      ];
      const page = 1;
      const limit = 10;
      const total = 25;
      const message = 'Bugs retrieved';

      paginatedResponse(mockRes, data, page, limit, total, message);

      expect(mockRes.status).toHaveBeenCalledWith(HTTP_STATUS.OK);
      expect(mockRes.json).toHaveBeenCalledWith({
        success: true,
        message,
        data,
        pagination: {
          currentPage: 1,
          itemsPerPage: 10,
          totalItems: 25,
          totalPages: 3,
          hasNextPage: true,
          hasPreviousPage: false,
        },
      });
    });

    it('should calculate totalPages correctly', () => {
      const data = [];
      const page = 1;
      const limit = 10;
      const total = 47;

      paginatedResponse(mockRes, data, page, limit, total);

      const callArgs = mockRes.json.mock.calls[0][0];
      expect(callArgs.pagination.totalPages).toBe(5);
    });

    it('should set hasNextPage to false on last page', () => {
      const data = [];
      const page = 3;
      const limit = 10;
      const total = 25;

      paginatedResponse(mockRes, data, page, limit, total);

      const callArgs = mockRes.json.mock.calls[0][0];
      expect(callArgs.pagination.hasNextPage).toBe(false);
      expect(callArgs.pagination.hasPreviousPage).toBe(true);
    });

    it('should handle first page correctly', () => {
      const data = [];
      const page = 1;
      const limit = 10;
      const total = 100;

      paginatedResponse(mockRes, data, page, limit, total);

      const callArgs = mockRes.json.mock.calls[0][0];
      expect(callArgs.pagination.hasNextPage).toBe(true);
      expect(callArgs.pagination.hasPreviousPage).toBe(false);
    });

    it('should handle empty result set', () => {
      const data = [];
      const page = 1;
      const limit = 10;
      const total = 0;

      paginatedResponse(mockRes, data, page, limit, total);

      const callArgs = mockRes.json.mock.calls[0][0];
      expect(callArgs.pagination.totalPages).toBe(0);
      expect(callArgs.pagination.hasNextPage).toBe(false);
      expect(callArgs.pagination.hasPreviousPage).toBe(false);
    });

    it('should use default message', () => {
      paginatedResponse(mockRes, [], 1, 10, 0);

      const callArgs = mockRes.json.mock.calls[0][0];
      expect(callArgs.message).toBe('Data retrieved successfully');
    });

    it('should handle middle page correctly', () => {
      const data = [];
      const page = 5;
      const limit = 10;
      const total = 100;

      paginatedResponse(mockRes, data, page, limit, total);

      const callArgs = mockRes.json.mock.calls[0][0];
      expect(callArgs.pagination.hasNextPage).toBe(true);
      expect(callArgs.pagination.hasPreviousPage).toBe(true);
    });
  });
});
