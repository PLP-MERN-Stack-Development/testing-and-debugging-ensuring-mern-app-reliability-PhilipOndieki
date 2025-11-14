/**
 * Unit Tests for Error Handler Middleware
 */

const {
  errorHandler,
  NotFoundError,
  ValidationError,
  AuthenticationError,
  DatabaseError,
} = require('../../src/middleware/errorHandler');

describe('Error Handler Middleware - Unit Tests', () => {
  let mockReq, mockRes, mockNext;

  beforeEach(() => {
    mockReq = {
      method: 'GET',
      url: '/test',
    };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockNext = jest.fn();
  });

  describe('errorHandler', () => {
    it('should handle NotFoundError with 404 status', () => {
      const error = new NotFoundError('Resource not found');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(404);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Resource not found',
          error: 'NotFoundError',
        })
      );
    });

    it('should handle ValidationError with 400 status', () => {
      const error = new ValidationError('Invalid input', [
        { field: 'email', message: 'Invalid email format' },
      ]);

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Invalid input',
          error: 'ValidationError',
          details: expect.arrayContaining([
            expect.objectContaining({
              field: 'email',
              message: 'Invalid email format',
            }),
          ]),
        })
      );
    });

    it('should handle AuthenticationError with 401 status', () => {
      const error = new AuthenticationError('Not authenticated');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Not authenticated',
          error: 'AuthenticationError',
        })
      );
    });

    it('should handle DatabaseError with 500 status', () => {
      const error = new DatabaseError('Database connection failed');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Database connection failed',
          error: 'DatabaseError',
        })
      );
    });

    it('should handle Mongoose validation error', () => {
      const error = {
        name: 'ValidationError',
        message: 'Validation failed',
        errors: {
          title: {
            message: 'Title is required',
          },
          description: {
            message: 'Description is too short',
          },
        },
      };

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'ValidationError',
        })
      );
    });

    it('should handle Mongoose CastError', () => {
      const error = {
        name: 'CastError',
        message: 'Cast to ObjectId failed',
        path: '_id',
        value: 'invalid-id',
      };

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'CastError',
        })
      );
    });

    it('should handle Mongoose duplicate key error', () => {
      const error = {
        name: 'MongoServerError',
        code: 11000,
        keyPattern: { email: 1 },
        keyValue: { email: 'test@example.com' },
      };

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(400);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'Duplicate field error',
        })
      );
    });

    it('should handle JWT errors', () => {
      const error = {
        name: 'JsonWebTokenError',
        message: 'Invalid token',
      };

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'JsonWebTokenError',
        })
      );
    });

    it('should handle TokenExpiredError', () => {
      const error = {
        name: 'TokenExpiredError',
        message: 'Token expired',
      };

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(401);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          error: 'TokenExpiredError',
        })
      );
    });

    it('should handle generic errors with 500 status', () => {
      const error = new Error('Something went wrong');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.status).toHaveBeenCalledWith(500);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          success: false,
          message: 'Something went wrong',
          error: 'Error',
        })
      );
    });

    it('should not include stack trace in production', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'production';

      const error = new Error('Production error');

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.not.objectContaining({
          stack: expect.any(String),
        })
      );

      process.env.NODE_ENV = originalEnv;
    });

    it('should include stack trace in development', () => {
      const originalEnv = process.env.NODE_ENV;
      process.env.NODE_ENV = 'development';

      const error = new Error('Development error');
      error.stack = 'Error stack trace';

      errorHandler(error, mockReq, mockRes, mockNext);

      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({
          stack: expect.any(String),
        })
      );

      process.env.NODE_ENV = originalEnv;
    });
  });

  describe('Custom Error Classes', () => {
    it('should create NotFoundError with correct properties', () => {
      const error = new NotFoundError('Not found');

      expect(error.message).toBe('Not found');
      expect(error.name).toBe('NotFoundError');
      expect(error.statusCode).toBe(404);
      expect(error instanceof Error).toBe(true);
    });

    it('should create ValidationError with correct properties', () => {
      const details = [{ field: 'name', message: 'Required' }];
      const error = new ValidationError('Validation failed', details);

      expect(error.message).toBe('Validation failed');
      expect(error.name).toBe('ValidationError');
      expect(error.statusCode).toBe(400);
      expect(error.details).toEqual(details);
      expect(error instanceof Error).toBe(true);
    });

    it('should create AuthenticationError with correct properties', () => {
      const error = new AuthenticationError('Unauthorized');

      expect(error.message).toBe('Unauthorized');
      expect(error.name).toBe('AuthenticationError');
      expect(error.statusCode).toBe(401);
      expect(error instanceof Error).toBe(true);
    });

    it('should create DatabaseError with correct properties', () => {
      const error = new DatabaseError('Database error');

      expect(error.message).toBe('Database error');
      expect(error.name).toBe('DatabaseError');
      expect(error.statusCode).toBe(500);
      expect(error instanceof Error).toBe(true);
    });
  });
});
