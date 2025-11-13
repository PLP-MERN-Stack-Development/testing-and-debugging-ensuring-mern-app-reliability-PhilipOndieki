/**
 * User Model Unit Tests
 * Tests for User model methods and validation
 */

const mongoose = require('mongoose');
const User = require('../../src/models/User');
const jwt = require('jsonwebtoken');

describe('User Model Unit Tests', () => {
  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('User Validation', () => {
    it('should create a valid user', async () => {
      const validUser = {
        name: 'John Doe',
        email: 'john@example.com',
        password: 'password123',
      };

      const user = await User.create(validUser);

      expect(user.name).toBe(validUser.name);
      expect(user.email).toBe(validUser.email);
      expect(user.role).toBe('user'); // default role
      expect(user.password).not.toBe(validUser.password); // should be hashed
    });

    it('should fail validation without name', async () => {
      const userWithoutName = {
        email: 'test@example.com',
        password: 'password123',
      };

      await expect(User.create(userWithoutName)).rejects.toThrow();
    });

    it('should fail validation without email', async () => {
      const userWithoutEmail = {
        name: 'Test User',
        password: 'password123',
      };

      await expect(User.create(userWithoutEmail)).rejects.toThrow();
    });

    it('should fail validation without password', async () => {
      const userWithoutPassword = {
        name: 'Test User',
        email: 'test@example.com',
      };

      await expect(User.create(userWithoutPassword)).rejects.toThrow();
    });

    it('should fail validation with invalid email format', async () => {
      const userWithInvalidEmail = {
        name: 'Test User',
        email: 'invalid-email',
        password: 'password123',
      };

      await expect(User.create(userWithInvalidEmail)).rejects.toThrow();
    });

    it('should fail validation with password less than 6 characters', async () => {
      const userWithShortPassword = {
        name: 'Test User',
        email: 'test@example.com',
        password: '12345',
      };

      await expect(User.create(userWithShortPassword)).rejects.toThrow();
    });

    it('should convert email to lowercase', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'TEST@EXAMPLE.COM',
        password: 'password123',
      });

      expect(user.email).toBe('test@example.com');
    });

    it('should trim name and email', async () => {
      const user = await User.create({
        name: '  John Doe  ',
        email: '  john@example.com  ',
        password: 'password123',
      });

      expect(user.name).toBe('John Doe');
      expect(user.email).toBe('john@example.com');
    });

    it('should enforce unique email constraint', async () => {
      const userData = {
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      await User.create(userData);

      // Try to create another user with same email
      await expect(
        User.create({
          name: 'Another User',
          email: 'test@example.com',
          password: 'password123',
        })
      ).rejects.toThrow();
    });

    it('should set default role to user', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(user.role).toBe('user');
    });

    it('should allow admin role', async () => {
      const adminUser = await User.create({
        name: 'Admin User',
        email: 'admin@example.com',
        password: 'password123',
        role: 'admin',
      });

      expect(adminUser.role).toBe('admin');
    });
  });

  describe('Password Hashing', () => {
    it('should hash password on save', async () => {
      const plainPassword = 'password123';
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: plainPassword,
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      expect(userWithPassword.password).not.toBe(plainPassword);
      expect(userWithPassword.password).toMatch(/^\$2[aby]\$\d{1,2}\$/); // bcrypt hash pattern
    });

    it('should not rehash password if not modified', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const originalHash = userWithPassword.password;

      // Update user without changing password
      userWithPassword.name = 'Updated Name';
      await userWithPassword.save();

      const updatedUser = await User.findById(user._id).select('+password');
      expect(updatedUser.password).toBe(originalHash);
    });

    it('should rehash password if modified', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const originalHash = userWithPassword.password;

      // Update password
      userWithPassword.password = 'newpassword123';
      await userWithPassword.save();

      const updatedUser = await User.findById(user._id).select('+password');
      expect(updatedUser.password).not.toBe(originalHash);
      expect(updatedUser.password).toMatch(/^\$2[aby]\$\d{1,2}\$/);
    });
  });

  describe('comparePassword method', () => {
    it('should return true for correct password', async () => {
      const plainPassword = 'password123';
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: plainPassword,
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword.comparePassword(plainPassword);

      expect(isMatch).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword.comparePassword('wrongpassword');

      expect(isMatch).toBe(false);
    });

    it('should be case sensitive', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'Password123',
      });

      const userWithPassword = await User.findById(user._id).select('+password');
      const isMatch = await userWithPassword.comparePassword('password123');

      expect(isMatch).toBe(false);
    });
  });

  describe('generateAuthToken method', () => {
    it('should generate a valid JWT token', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const token = user.generateAuthToken();

      expect(token).toBeTruthy();
      expect(typeof token).toBe('string');
      expect(token.split('.')).toHaveLength(3); // JWT has 3 parts
    });

    it('should include user id, email, and role in token', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
        role: 'admin',
      });

      const token = user.generateAuthToken();
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
      );

      expect(decoded.id).toBe(user._id.toString());
      expect(decoded.email).toBe(user.email);
      expect(decoded.role).toBe('admin');
    });

    it('should generate token with expiration', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const token = user.generateAuthToken();
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production'
      );

      expect(decoded.exp).toBeTruthy();
      expect(decoded.exp).toBeGreaterThan(decoded.iat);
    });

    it('should generate different tokens for same user at different times', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const token1 = user.generateAuthToken();

      // Wait a tiny bit to ensure different iat (issued at) timestamps
      await new Promise(resolve => setTimeout(resolve, 1000));

      const token2 = user.generateAuthToken();

      expect(token1).not.toBe(token2);
    });
  });

  describe('Password field security', () => {
    it('should not return password by default in queries', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const user = await User.findOne({ email: 'test@example.com' });

      expect(user.password).toBeUndefined();
    });

    it('should return password when explicitly selected', async () => {
      await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const user = await User.findOne({ email: 'test@example.com' }).select('+password');

      expect(user.password).toBeTruthy();
    });
  });

  describe('Timestamps', () => {
    it('should have createdAt and updatedAt timestamps', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      expect(user.createdAt).toBeTruthy();
      expect(user.updatedAt).toBeTruthy();
      expect(user.createdAt).toBeInstanceOf(Date);
      expect(user.updatedAt).toBeInstanceOf(Date);
    });

    it('should update updatedAt on modification', async () => {
      const user = await User.create({
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      });

      const originalUpdatedAt = user.updatedAt;

      // Wait a tiny bit
      await new Promise(resolve => setTimeout(resolve, 100));

      user.name = 'Updated Name';
      await user.save();

      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
