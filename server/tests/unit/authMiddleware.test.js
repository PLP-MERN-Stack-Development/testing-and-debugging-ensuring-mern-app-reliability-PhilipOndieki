/**
 * Auth Middleware Unit Tests
 * Tests for protect and authorize middleware
 */

const jwt = require('jsonwebtoken');
const { protect, authorize } = require('../../src/middleware/authMiddleware');
const User = require('../../src/models/User');

// Mock logger to avoid actual logging during tests
jest.mock('../../src/config/logger', () => ({
  warn: jest.fn(),
  error: jest.fn(),
  info: jest.fn(),
}));

describe('Auth Middleware Unit Tests', () => {
  let req, res, next;

  beforeEach(() => {
    // Reset mocks before each test
    req = {
      headers: {},
      user: null,
    };
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    next = jest.fn();
  });

  afterEach(async () => {
    await User.deleteMany({});
    jest.clearAllMocks();
  });

  describe('protect middleware', () => {
    it('should call next() for valid token and existing user', async () => {
      // Create a test user
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const token = user.generateAuthToken();

      req.headers.authorization = `Bearer ${token}`;

      await protect(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeTruthy();
      expect(req.user.email).toBe(user.email);
      expect(req.user.password).toBeUndefined(); // Password should not be included
    });

    it('should return 401 when no token provided', async () => {
      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to access this route. Please log in.',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when authorization header is malformed', async () => {
      req.headers.authorization = 'InvalidFormat token';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to access this route. Please log in.',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for invalid token', async () => {
      req.headers.authorization = 'Bearer invalid-token';

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 for expired token', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      // Create an expired token
      const expiredToken = jwt.sign(
        { id: user._id, email: user.email, role: user.role },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
        { expiresIn: '1ms' } // Expires immediately
      );

      // Wait to ensure token is expired
      await new Promise(resolve => setTimeout(resolve, 10));

      req.headers.authorization = `Bearer ${expiredToken}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Token expired. Please log in again.',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when user not found', async () => {
      const nonExistentUserId = '507f1f77bcf86cd799439011';

      // Create a token with non-existent user ID
      const token = jwt.sign(
        { id: nonExistentUserId, email: 'nonexistent@example.com', role: 'user' },
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production',
        { expiresIn: '7d' }
      );

      req.headers.authorization = `Bearer ${token}`;

      await protect(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'User not found',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should extract token from Bearer authorization header', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const token = user.generateAuthToken();
      req.headers.authorization = `Bearer ${token}`;

      await protect(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(req.user).toBeTruthy();
    });

    it('should not include password in req.user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const token = user.generateAuthToken();
      req.headers.authorization = `Bearer ${token}`;

      await protect(req, res, next);

      expect(req.user.password).toBeUndefined();
    });
  });

  describe('authorize middleware', () => {
    beforeEach(() => {
      // Set up a user in the request (simulate protect middleware has run)
      req.user = {
        _id: '507f1f77bcf86cd799439011',
        name: 'Test User',
        email: 'test@example.com',
        role: 'user',
      };
    });

    it('should call next() when user has required role', () => {
      const middleware = authorize('user', 'admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should return 403 when user does not have required role', () => {
      req.user.role = 'user';
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: "User role 'user' is not authorized to access this route",
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should return 401 when no user in request', () => {
      req.user = null;
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        success: false,
        message: 'Not authorized to access this route',
      });
      expect(next).not.toHaveBeenCalled();
    });

    it('should allow access when user has admin role', () => {
      req.user.role = 'admin';
      const middleware = authorize('admin');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should allow access when user role matches one of multiple allowed roles', () => {
      req.user.role = 'user';
      const middleware = authorize('user', 'admin', 'moderator');

      middleware(req, res, next);

      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it('should deny access when user role does not match any allowed roles', () => {
      req.user.role = 'user';
      const middleware = authorize('admin', 'moderator');

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });

    it('should be case sensitive with roles', () => {
      req.user.role = 'user';
      const middleware = authorize('User'); // Different case

      middleware(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(next).not.toHaveBeenCalled();
    });
  });
});
