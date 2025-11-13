/**
 * Integration Tests for Bug API Routes
 */

const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../../src/app');
const Bug = require('../../src/models/Bug');

let mongoServer;

// Setup MongoDB Memory Server before all tests
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create({
  });
  const mongoUri = mongoServer.getUri();
  await mongoose.connect(mongoUri);
});

// Clean database between tests
afterEach(async () => {
  await Bug.deleteMany({});
});

// Cleanup after all tests
afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Bug API Routes - Integration Tests', () => {
  describe('POST /api/bugs', () => {
    const validBugData = {
      title: 'Test Bug Title',
      description: 'This is a test bug description with enough characters',
      priority: 'high',
      severity: 'major',
      createdBy: 'John Doe',
    };

    it('should create a new bug with valid data', async () => {
      const res = await request(app)
        .post('/api/bugs')
        .send(validBugData);

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('_id');
      expect(res.body.data.title).toBe(validBugData.title);
      expect(res.body.data.description).toBe(validBugData.description);
      expect(res.body.data.priority).toBe(validBugData.priority);
      expect(res.body.data.severity).toBe(validBugData.severity);
      expect(res.body.data.status).toBe('open'); // Default status
    });

    it('should create bug with custom status', async () => {
      const bugWithStatus = { ...validBugData, status: 'in-progress' };

      const res = await request(app)
        .post('/api/bugs')
        .send(bugWithStatus);

      expect(res.status).toBe(201);
      expect(res.body.data.status).toBe('in-progress');
    });

    it('should return 400 for missing title', async () => {
      const invalidData = { ...validBugData };
      delete invalidData.title;

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
      expect(res.body.errors).toBeDefined();
    });

    it('should return 400 for missing description', async () => {
      const invalidData = { ...validBugData };
      delete invalidData.description;

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for missing priority', async () => {
      const invalidData = { ...validBugData };
      delete invalidData.priority;

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for missing severity', async () => {
      const invalidData = { ...validBugData };
      delete invalidData.severity;

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for title that is too short', async () => {
      const invalidData = { ...validBugData, title: 'AB' };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for description that is too short', async () => {
      const invalidData = { ...validBugData, description: 'Short' };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid status', async () => {
      const invalidData = { ...validBugData, status: 'invalid-status' };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid priority', async () => {
      const invalidData = { ...validBugData, priority: 'invalid' };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid severity', async () => {
      const invalidData = { ...validBugData, severity: 'invalid' };

      const res = await request(app)
        .post('/api/bugs')
        .send(invalidData);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should trim whitespace from string fields', async () => {
      const dataWithSpaces = {
        title: '  Test Bug  ',
        description: '  Test description with enough characters  ',
        priority: '  high  ',
        severity: '  major  ',
        createdBy: '  John Doe  ',
      };

      const res = await request(app)
        .post('/api/bugs')
        .send(dataWithSpaces);

      expect(res.status).toBe(201);
      expect(res.body.data.title).toBe('Test Bug');
      expect(res.body.data.createdBy).toBe('John Doe');
    });
  });

  describe('GET /api/bugs', () => {
    beforeEach(async () => {
      // Create test bugs
      await Bug.create([
        {
          title: 'Bug 1',
          description: 'Description for bug 1',
          priority: 'high',
          severity: 'major',
          status: 'open',
          createdBy: 'User1',
        },
        {
          title: 'Bug 2',
          description: 'Description for bug 2',
          priority: 'low',
          severity: 'minor',
          status: 'closed',
          createdBy: 'User2',
        },
        {
          title: 'Bug 3',
          description: 'Description for bug 3',
          priority: 'critical',
          severity: 'critical',
          status: 'in-progress',
          createdBy: 'User1',
        },
      ]);
    });

    it('should return all bugs', async () => {
      const res = await request(app).get('/api/bugs');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveLength(3);
      expect(res.body.pagination).toBeDefined();
      expect(res.body.pagination.totalItems).toBe(3);
    });

    it('should filter bugs by status', async () => {
      const res = await request(app).get('/api/bugs?status=open');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].status).toBe('open');
    });

    it('should filter bugs by priority', async () => {
      const res = await request(app).get('/api/bugs?priority=high');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].priority).toBe('high');
    });

    it('should filter bugs by severity', async () => {
      const res = await request(app).get('/api/bugs?severity=critical');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(1);
      expect(res.body.data[0].severity).toBe('critical');
    });

    it('should filter bugs by createdBy', async () => {
      const res = await request(app).get('/api/bugs?createdBy=User1');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(2);
    });

    it('should support pagination', async () => {
      // Create more bugs
      const moreBugs = [];
      for (let i = 4; i <= 15; i++) {
        moreBugs.push({
          title: `Bug ${i}`,
          description: `Description for bug ${i}`,
          priority: 'medium',
          severity: 'major',
          createdBy: 'TestUser',
        });
      }
      await Bug.insertMany(moreBugs);

      const res = await request(app).get('/api/bugs?page=1&limit=5');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(5);
      expect(res.body.pagination.currentPage).toBe(1);
      expect(res.body.pagination.itemsPerPage).toBe(5);
      expect(res.body.pagination.hasNextPage).toBe(true);
    });

    it('should sort bugs by createdAt descending by default', async () => {
      const res = await request(app).get('/api/bugs');

      expect(res.status).toBe(200);
      const dates = res.body.data.map(bug => new Date(bug.createdAt));
      for (let i = 1; i < dates.length; i++) {
        expect(dates[i - 1].getTime()).toBeGreaterThanOrEqual(dates[i].getTime());
      }
    });

    it('should support custom sorting', async () => {
      const res = await request(app).get('/api/bugs?sortBy=title&order=asc');

      expect(res.status).toBe(200);
      expect(res.body.data[0].title).toBe('Bug 1');
    });

    it('should return empty array when no bugs match filter', async () => {
      const res = await request(app).get('/api/bugs?status=resolved');

      expect(res.status).toBe(200);
      expect(res.body.data).toHaveLength(0);
    });
  });

  describe('GET /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Test Bug',
        description: 'Test bug description',
        priority: 'high',
        severity: 'major',
        createdBy: 'TestUser',
      });
      bugId = bug._id.toString();
    });

    it('should return a bug by ID', async () => {
      const res = await request(app).get(`/api/bugs/${bugId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data._id).toBe(bugId);
      expect(res.body.data.title).toBe('Test Bug');
    });

    it('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).get(`/api/bugs/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid bug ID format', async () => {
      const res = await request(app).get('/api/bugs/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PUT /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Original Title',
        description: 'Original description',
        priority: 'low',
        severity: 'minor',
        status: 'open',
        createdBy: 'OriginalUser',
      });
      bugId = bug._id.toString();
    });

    it('should update all fields of a bug', async () => {
      const updates = {
        title: 'Updated Title',
        description: 'Updated description with enough characters',
        priority: 'high',
        severity: 'critical',
        status: 'in-progress',
        createdBy: 'UpdatedUser',
      };

      const res = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.title).toBe(updates.title);
      expect(res.body.data.description).toBe(updates.description);
      expect(res.body.data.priority).toBe(updates.priority);
      expect(res.body.data.severity).toBe(updates.severity);
      expect(res.body.data.status).toBe(updates.status);
    });

    it('should update partial fields of a bug', async () => {
      const updates = {
        title: 'Partially Updated Title',
      };

      const res = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(updates);

      expect(res.status).toBe(200);
      expect(res.body.data.title).toBe(updates.title);
      expect(res.body.data.description).toBe('Original description');
    });

    it('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const updates = { title: 'Updated Title' };

      const res = await request(app)
        .put(`/api/bugs/${nonExistentId}`)
        .send(updates);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid update data', async () => {
      const invalidUpdates = {
        title: 'AB', // Too short
      };

      const res = await request(app)
        .put(`/api/bugs/${bugId}`)
        .send(invalidUpdates);

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid bug ID format', async () => {
      const res = await request(app)
        .put('/api/bugs/invalid-id')
        .send({ title: 'Updated Title' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('PATCH /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Test Bug',
        description: 'Test description',
        priority: 'medium',
        severity: 'major',
        status: 'open',
        createdBy: 'TestUser',
      });
      bugId = bug._id.toString();
    });

    it('should update bug status', async () => {
      const res = await request(app)
        .patch(`/api/bugs/${bugId}`)
        .send({ status: 'resolved' });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.status).toBe('resolved');
    });

    it('should return 400 for missing status', async () => {
      const res = await request(app)
        .patch(`/api/bugs/${bugId}`)
        .send({});

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid status', async () => {
      const res = await request(app)
        .patch(`/api/bugs/${bugId}`)
        .send({ status: 'invalid-status' });

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });

    it('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app)
        .patch(`/api/bugs/${nonExistentId}`)
        .send({ status: 'closed' });

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });
  });

  describe('DELETE /api/bugs/:id', () => {
    let bugId;

    beforeEach(async () => {
      const bug = await Bug.create({
        title: 'Bug to Delete',
        description: 'This bug will be deleted',
        priority: 'low',
        severity: 'minor',
        createdBy: 'TestUser',
      });
      bugId = bug._id.toString();
    });

    it('should delete a bug', async () => {
      const res = await request(app).delete(`/api/bugs/${bugId}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);

      // Verify bug is deleted
      const deletedBug = await Bug.findById(bugId);
      expect(deletedBug).toBeNull();
    });

    it('should return 404 for non-existent bug', async () => {
      const nonExistentId = new mongoose.Types.ObjectId();
      const res = await request(app).delete(`/api/bugs/${nonExistentId}`);

      expect(res.status).toBe(404);
      expect(res.body.success).toBe(false);
    });

    it('should return 400 for invalid bug ID format', async () => {
      const res = await request(app).delete('/api/bugs/invalid-id');

      expect(res.status).toBe(400);
      expect(res.body.success).toBe(false);
    });
  });

  describe('GET /api/bugs/stats', () => {
    beforeEach(async () => {
      await Bug.create([
        {
          title: 'Bug 1',
          description: 'Description 1',
          priority: 'high',
          severity: 'major',
          status: 'open',
          createdBy: 'User1',
        },
        {
          title: 'Bug 2',
          description: 'Description 2',
          priority: 'high',
          severity: 'critical',
          status: 'open',
          createdBy: 'User2',
        },
        {
          title: 'Bug 3',
          description: 'Description 3',
          priority: 'low',
          severity: 'minor',
          status: 'closed',
          createdBy: 'User3',
        },
        {
          title: 'Bug 4',
          description: 'Description 4',
          priority: 'critical',
          severity: 'critical',
          status: 'in-progress',
          createdBy: 'User4',
        },
      ]);
    });

    it('should return bug statistics', async () => {
      const res = await request(app).get('/api/bugs/stats');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty('total');
      expect(res.body.data).toHaveProperty('byStatus');
      expect(res.body.data).toHaveProperty('byPriority');
      expect(res.body.data).toHaveProperty('bySeverity');
    });

    it('should have correct total count', async () => {
      const res = await request(app).get('/api/bugs/stats');

      expect(res.body.data.total).toBe(4);
    });

    it('should have correct status counts', async () => {
      const res = await request(app).get('/api/bugs/stats');

      expect(res.body.data.byStatus.open).toBe(2);
      expect(res.body.data.byStatus.closed).toBe(1);
      expect(res.body.data.byStatus['in-progress']).toBe(1);
    });

    it('should have correct priority counts', async () => {
      const res = await request(app).get('/api/bugs/stats');

      expect(res.body.data.byPriority.high).toBe(2);
      expect(res.body.data.byPriority.low).toBe(1);
      expect(res.body.data.byPriority.critical).toBe(1);
    });

    it('should have correct severity counts', async () => {
      const res = await request(app).get('/api/bugs/stats');

      expect(res.body.data.bySeverity.major).toBe(1);
      expect(res.body.data.bySeverity.minor).toBe(1);
      expect(res.body.data.bySeverity.critical).toBe(2);
    });

    it('should return empty stats when no bugs exist', async () => {
      await Bug.deleteMany({});
      const res = await request(app).get('/api/bugs/stats');

      expect(res.status).toBe(200);
      expect(res.body.data.total).toBe(0);
      expect(Object.keys(res.body.data.byStatus)).toHaveLength(0);
    });
  });

  describe('Health Check', () => {
    it('should return healthy status', async () => {
      const res = await request(app).get('/health');

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.message).toBe('Server is running');
    });
  });
});
