/**
 * Auth Routes Integration Tests
 * Tests for authentication endpoints
 */

const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const User = require('../../src/models/User');

describe('Auth Routes Integration Tests', () => {
  // Test data
  const validUserData = {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123'
  };

  const validUserData2 = {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password456'
  };

  beforeAll(async () => {
    // Database connection is handled in global setup
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  beforeEach(async () => {
    // Clear users collection before each test
    await User.deleteMany({});
  }, 10000); // 10 second timeout for setup

  describe('POST /api/auth/signup', () => {
    it('should register a new user with valid data', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(validUserData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user).toHaveProperty('id');
      expect(response.body.data.user.name).toBe(validUserData.name);
      expect(response.body.data.user.email).toBe(validUserData.email);
      expect(response.body.data.user.role).toBe('user');
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should hash the password before saving', async () => {
      await request(app)
        .post('/api/auth/signup')
        .send(validUserData)
        .expect(201);

      const user = await User.findOne({ email: validUserData.email }).select('+password');
      expect(user.password).not.toBe(validUserData.password);
      expect(user.password).toMatch(/^\$2[aby]\$.{56}$/); // bcrypt hash pattern
    });

    it('should return JWT token in response', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(validUserData)
        .expect(201);

      expect(response.body.data.token).toBeDefined();
      expect(typeof response.body.data.token).toBe('string');
      expect(response.body.data.token.split('.').length).toBe(3); // JWT format
    });

    it('should set HTTP-only cookie with token', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send(validUserData)
        .expect(201);

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(cookie => cookie.startsWith('token='))).toBe(true);
      expect(cookies.some(cookie => cookie.includes('HttpOnly'))).toBe(true);
    });

    it('should fail with duplicate email', async () => {
      // Create first user
      await request(app)
        .post('/api/auth/signup')
        .send(validUserData)
        .expect(201);

      // Try to create user with same email
      const response = await request(app)
        .post('/api/auth/signup')
        .send(validUserData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/email already exists/i);
    });

    it('should fail with invalid email format', async () => {
      const invalidData = {
        ...validUserData,
        email: 'invalid-email'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/valid email/i);
    });

    it('should fail with short password', async () => {
      const invalidData = {
        ...validUserData,
        password: '12345'
      };

      const response = await request(app)
        .post('/api/auth/signup')
        .send(invalidData)
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/at least 6 characters/i);
    });

    it('should fail with missing required fields', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({ email: 'test@example.com' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBeDefined();
    });

    it('should fail with missing name', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          email: 'test@example.com',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          password: 'password123'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@example.com'
        })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a user for login tests
      await request(app)
        .post('/api/auth/signup')
        .send(validUserData);
    }, 10000);

    it('should login with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.email,
          password: validUserData.password
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('token');
      expect(response.body.data).toHaveProperty('user');
      expect(response.body.data.user.email).toBe(validUserData.email);
      expect(response.body.data.user).not.toHaveProperty('password');
    });

    it('should return JWT token on successful login', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.email,
          password: validUserData.password
        })
        .expect(200);

      expect(response.body.data.token).toBeDefined();
      expect(typeof response.body.data.token).toBe('string');
      expect(response.body.data.token.split('.').length).toBe(3);
    });

    it('should fail with wrong password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.email,
          password: 'wrongpassword'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/invalid credentials/i);
    });

    it('should fail with non-existent email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'nonexistent@example.com',
          password: 'password123'
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/invalid credentials/i);
    });

    it('should fail with missing credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/provide email and password/i);
    });

    it('should fail with missing email', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ password: 'password123' })
        .expect(400);

      expect(response.body.success).toBe(false);
    });

    it('should fail with missing password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({ email: validUserData.email })
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    let authToken;

    beforeEach(async () => {
      // Create and login user
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(validUserData);

      authToken = signupResponse.body.data.token;
    }, 10000);

    it('should return current user when authenticated', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveProperty('_id');
      expect(response.body.data.email).toBe(validUserData.email);
      expect(response.body.data.name).toBe(validUserData.name);
      expect(response.body.data).not.toHaveProperty('password');
    });

    it('should fail without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/not authorized/i);
    });

    it('should fail with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/invalid token/i);
    });

    it('should work with token in cookie', async () => {
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(validUserData2);

      const cookies = signupResponse.headers['set-cookie'];

      const response = await request(app)
        .get('/api/auth/me')
        .set('Cookie', cookies)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.email).toBe(validUserData2.email);
    });
  });

  describe('POST /api/auth/logout', () => {
    let authToken;

    beforeEach(async () => {
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(validUserData);

      authToken = signupResponse.body.data.token;
    }, 10000);

    it('should logout user successfully', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toMatch(/logged out/i);
    });

    it('should clear cookie on logout', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      const cookies = response.headers['set-cookie'];
      expect(cookies).toBeDefined();
      expect(cookies.some(cookie => cookie.includes('token=none'))).toBe(true);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
    });
  });

  describe('PUT /api/auth/profile', () => {
    let authToken;
    let userId;

    beforeEach(async () => {
      const signupResponse = await request(app)
        .post('/api/auth/signup')
        .send(validUserData);

      authToken = signupResponse.body.data.token;
      userId = signupResponse.body.data.user.id;
    }, 10000);

    it('should update user name', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'John Updated' })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.name).toBe('John Updated');
      expect(response.body.data.user.email).toBe(validUserData.email);
    });

    it('should update user email', async () => {
      const newEmail = 'newemail@example.com';
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: newEmail })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(newEmail);
    });

    it('should update password', async () => {
      const newPassword = 'newpassword123';
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: newPassword })
        .expect(200);

      expect(response.body.success).toBe(true);

      // Try to login with new password
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .send({
          email: validUserData.email,
          password: newPassword
        })
        .expect(200);

      expect(loginResponse.body.success).toBe(true);
    });

    it('should fail with email already in use', async () => {
      // Create another user
      await request(app)
        .post('/api/auth/signup')
        .send(validUserData2);

      // Try to update email to existing email
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ email: validUserData2.email })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/email already in use/i);
    });

    it('should fail with short password', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ password: '12345' })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toMatch(/at least 6 characters/i);
    });

    it('should fail without authentication', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .send({ name: 'New Name' })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return new token after update', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', `Bearer ${authToken}`)
        .send({ name: 'Updated Name' })
        .expect(200);

      expect(response.body.data.token).toBeDefined();
      expect(typeof response.body.data.token).toBe('string');
    });
  });
});
