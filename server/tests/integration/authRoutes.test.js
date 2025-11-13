/**
 * Authentication Routes Integration Tests
 * Tests for user authentication endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const User = require('../../src/models/User');

// Setup MongoDB Memory Server before all tests
let mongoServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
    binary: {
      version: '7.0.14', // Specify a compatible MongoDB version
    },
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
}, 60000); // Increase timeout for MongoDB download

// Cleanup after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Auth Routes Integration Tests', () => {
  let testUser;
  let authToken;

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});

    // Create a test user
    testUser = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      password: 'password123',
      role: 'user',
    });

    // Generate token for protected routes
    authToken = testUser.generateAuthToken();
  });

  afterEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/signup', () => {
    it('should register a new user successfully', async () => {
      const newUser = {
        name: 'New User',
        email: 'newuser@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(newUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('User registered successfully');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.name).toBe(newUser.name);
      expect(response.body.data.user.email).toBe(newUser.email);
      expect(response.body.data.user.role).toBe('user');
      expect(response.body.data.user).not.toHaveProperty('password');

      // Verify user was created in database
      const user = await User.findOne({ email: newUser.email });
      expect(user).toBeTruthy();
      expect(user.name).toBe(newUser.name);
    });

    it('should not register user with existing email', async () => {
      const duplicateUser = {
        name: 'Duplicate User',
        email: testUser.email,
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(duplicateUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('User already exists with this email');
    });

    it('should not register user without required fields', async () => {
      const incompleteUser = {
        name: 'Incomplete User',
        // missing email and password
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(incompleteUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should not register user with invalid email format', async () => {
      const invalidUser = {
        name: 'Invalid User',
        email: 'invalid-email',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidUser)
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should not register user with short password', async () => {
      const shortPasswordUser = {
        name: 'Short Password User',
        email: 'short@example.com',
        password: '12345', // Less than 6 characters
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(shortPasswordUser)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Password');
    });

    it('should hash password before saving', async () => {
      const newUser = {
        name: 'Hash Test User',
        email: 'hash@example.com',
        password: 'password123',
      };

      await request(app)
        .post('/api/auth/signup')
        .send(newUser)
        .expect(201);

      const user = await User.findOne({ email: newUser.email }).select('+password');
      expect(user.password).not.toBe(newUser.password);
      expect(user.password).toMatch(/^\$2[aby]\$\d{1,2}\$/); // bcrypt hash pattern
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login user with valid credentials', async () => {
      const credentials = {
        email: testUser.email,
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Login successful');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should not login user with invalid email', async () => {
      const credentials = {
        email: 'nonexistent@example.com',
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login user with invalid password', async () => {
      const credentials = {
        email: testUser.email,
        password: 'wrongpassword',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toBe('Invalid credentials');
    });

    it('should not login without email', async () => {
      const credentials = {
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('email');
    });

    it('should not login without password', async () => {
      const credentials = {
        email: testUser.email,
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('password');
    });

    it('should return a valid JWT token', async () => {
      const credentials = {
        email: testUser.email,
        password: 'password123',
      };

      const response = await request(app)
        .post('/api/auth/login')
        .send(credentials)
        .expect(200);

      expect(response.body.data.token).toBeTruthy();
      expect(typeof response.body.data.token).toBe('string');
      expect(response.body.data.token.split('.')).toHaveLength(3); // JWT has 3 parts
    });
  });

  describe('GET /api/auth/me', () => {
    it('should get current user profile with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.name).toBe(testUser.name);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should not get profile without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });

    it('should not get profile with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Invalid token');
    });

    it('should not get profile with malformed authorization header', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Logout successful');
    });

    it('should not logout without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('Not authorized');
    });
  });
});
