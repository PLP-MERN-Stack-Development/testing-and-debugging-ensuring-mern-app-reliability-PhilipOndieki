/**
 * Unit Tests for Bug Model
 */

const mongoose = require('mongoose');
const Bug = require('../../src/models/Bug');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

describe('Bug Model - Unit Tests', () => {
  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    const mongoUri = mongoServer.getUri();
    await mongoose.connect(mongoUri);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  afterEach(async () => {
    await Bug.deleteMany({});
  });

  describe('Schema Validation', () => {
    it('should create a valid bug with all required fields', async () => {
      const validBug = {
        title: 'Test Bug',
        description: 'This is a test bug description',
        status: 'open',
        priority: 'high',
        severity: 'major',
        createdBy: 'John Doe',
      };

      const bug = new Bug(validBug);
      const savedBug = await bug.save();

      expect(savedBug._id).toBeDefined();
      expect(savedBug.title).toBe(validBug.title);
      expect(savedBug.description).toBe(validBug.description);
      expect(savedBug.status).toBe(validBug.status);
      expect(savedBug.priority).toBe(validBug.priority);
      expect(savedBug.severity).toBe(validBug.severity);
      expect(savedBug.createdBy).toBe(validBug.createdBy);
      expect(savedBug.createdAt).toBeDefined();
      expect(savedBug.updatedAt).toBeDefined();
    });

    it('should use default status "open" when not provided', async () => {
      const bug = new Bug({
        title: 'Test Bug',
        description: 'This is a test bug description',
        priority: 'medium',
        severity: 'minor',
        createdBy: 'Jane Doe',
      });

      const savedBug = await bug.save();
      expect(savedBug.status).toBe('open');
    });

    it('should fail when title is missing', async () => {
      const bug = new Bug({
        description: 'Description without title',
        priority: 'low',
        severity: 'minor',
        createdBy: 'Test User',
      });

      await expect(bug.save()).rejects.toThrow();
    });

    it('should fail when title is too short', async () => {
      const bug = new Bug({
        title: 'AB',
        description: 'Valid description',
        priority: 'low',
        severity: 'minor',
        createdBy: 'Test User',
      });

      await expect(bug.save()).rejects.toThrow();
    });

    it('should fail when title is too long', async () => {
      const bug = new Bug({
        title: 'A'.repeat(101),
        description: 'Valid description',
        priority: 'low',
        severity: 'minor',
        createdBy: 'Test User',
      });

      await expect(bug.save()).rejects.toThrow();
    });

    it('should fail when description is missing', async () => {
      const bug = new Bug({
        title: 'Valid Title',
        priority: 'low',
        severity: 'minor',
        createdBy: 'Test User',
      });

      await expect(bug.save()).rejects.toThrow();
    });

    it('should fail when description is too short', async () => {
      const bug = new Bug({
        title: 'Valid Title',
        description: 'Short',
        priority: 'low',
        severity: 'minor',
        createdBy: 'Test User',
      });

      await expect(bug.save()).rejects.toThrow();
    });

    it('should fail when priority is missing', async () => {
      const bug = new Bug({
        title: 'Valid Title',
        description: 'Valid description here',
        severity: 'minor',
        createdBy: 'Test User',
      });

      await expect(bug.save()).rejects.toThrow();
    });

    it('should fail when severity is missing', async () => {
      const bug = new Bug({
        title: 'Valid Title',
        description: 'Valid description here',
        priority: 'low',
        createdBy: 'Test User',
      });

      await expect(bug.save()).rejects.toThrow();
    });

    it('should fail when createdBy is missing and no creator', async () => {
      const bug = new Bug({
        title: 'Valid Title',
        description: 'Valid description here',
        priority: 'low',
        severity: 'minor',
      });

      await expect(bug.save()).rejects.toThrow();
    });

    it('should fail when status is invalid', async () => {
      const bug = new Bug({
        title: 'Valid Title',
        description: 'Valid description here',
        status: 'invalid-status',
        priority: 'low',
        severity: 'minor',
        createdBy: 'Test User',
      });

      await expect(bug.save()).rejects.toThrow();
    });

    it('should fail when priority is invalid', async () => {
      const bug = new Bug({
        title: 'Valid Title',
        description: 'Valid description here',
        priority: 'invalid-priority',
        severity: 'minor',
        createdBy: 'Test User',
      });

      await expect(bug.save()).rejects.toThrow();
    });

    it('should fail when severity is invalid', async () => {
      const bug = new Bug({
        title: 'Valid Title',
        description: 'Valid description here',
        priority: 'low',
        severity: 'invalid-severity',
        createdBy: 'Test User',
      });

      await expect(bug.save()).rejects.toThrow();
    });

    it('should trim whitespace from string fields', async () => {
      const bug = new Bug({
        title: '  Title with spaces  ',
        description: '  Description with spaces  ',
        priority: 'low',
        severity: 'minor',
        createdBy: '  John Doe  ',
      });

      const savedBug = await bug.save();
      expect(savedBug.title).toBe('Title with spaces');
      expect(savedBug.description).toBe('Description with spaces');
      expect(savedBug.createdBy).toBe('John Doe');
    });
  });

  describe('Virtual Properties', () => {
    it('should calculate ageInDays correctly', async () => {
      const bug = new Bug({
        title: 'Test Bug',
        description: 'Test description here',
        priority: 'medium',
        severity: 'major',
        createdBy: 'Test User',
      });

      const savedBug = await bug.save();

      // Age should be 0 for newly created bug
      expect(savedBug.ageInDays).toBe(0);
    });

    it('should include ageInDays in JSON output', async () => {
      const bug = new Bug({
        title: 'Test Bug',
        description: 'Test description here',
        priority: 'medium',
        severity: 'major',
        createdBy: 'Test User',
      });

      const savedBug = await bug.save();
      const jsonBug = savedBug.toJSON();

      expect(jsonBug.ageInDays).toBeDefined();
      expect(typeof jsonBug.ageInDays).toBe('number');
    });
  });

  describe('JSON Transformation', () => {
    it('should transform _id to id in JSON output', async () => {
      const bug = new Bug({
        title: 'Test Bug',
        description: 'Test description here',
        priority: 'high',
        severity: 'critical',
        createdBy: 'Test User',
      });

      const savedBug = await bug.save();
      const jsonBug = savedBug.toJSON();

      expect(jsonBug.id).toBeDefined();
      expect(jsonBug._id).toBeUndefined();
      expect(jsonBug.__v).toBeUndefined();
    });
  });

  describe('Indexes', () => {
    it('should have indexes on status field', () => {
      const indexes = Bug.schema.indexes();
      const hasStatusIndex = indexes.some(index =>
        index[0].status !== undefined
      );
      expect(hasStatusIndex).toBe(true);
    });

    it('should have indexes on priority field', () => {
      const indexes = Bug.schema.indexes();
      const hasPriorityIndex = indexes.some(index =>
        index[0].priority !== undefined
      );
      expect(hasPriorityIndex).toBe(true);
    });

    it('should have compound index on status and priority', () => {
      const indexes = Bug.schema.indexes();
      const hasCompoundIndex = indexes.some(index =>
        index[0].status !== undefined && index[0].priority !== undefined
      );
      expect(hasCompoundIndex).toBe(true);
    });
  });

  describe('Enum Values', () => {
    it('should accept all valid status values', async () => {
      const statuses = ['open', 'in-progress', 'resolved', 'closed'];

      for (const status of statuses) {
        const bug = new Bug({
          title: `Bug with ${status} status`,
          description: 'Test description',
          status: status,
          priority: 'low',
          severity: 'minor',
          createdBy: 'Test User',
        });

        const savedBug = await bug.save();
        expect(savedBug.status).toBe(status);
        await Bug.deleteMany({ _id: savedBug._id });
      }
    });

    it('should accept all valid priority values', async () => {
      const priorities = ['low', 'medium', 'high', 'critical'];

      for (const priority of priorities) {
        const bug = new Bug({
          title: `Bug with ${priority} priority`,
          description: 'Test description',
          priority: priority,
          severity: 'minor',
          createdBy: 'Test User',
        });

        const savedBug = await bug.save();
        expect(savedBug.priority).toBe(priority);
        await Bug.deleteMany({ _id: savedBug._id });
      }
    });

    it('should accept all valid severity values', async () => {
      const severities = ['minor', 'major', 'critical'];

      for (const severity of severities) {
        const bug = new Bug({
          title: `Bug with ${severity} severity`,
          description: 'Test description',
          priority: 'low',
          severity: severity,
          createdBy: 'Test User',
        });

        const savedBug = await bug.save();
        expect(savedBug.severity).toBe(severity);
        await Bug.deleteMany({ _id: savedBug._id });
      }
    });
  });

  describe('Update Operations', () => {
    it('should update bug status successfully', async () => {
      const bug = new Bug({
        title: 'Test Bug',
        description: 'Test description',
        priority: 'medium',
        severity: 'major',
        createdBy: 'Test User',
      });

      const savedBug = await bug.save();
      expect(savedBug.status).toBe('open');

      savedBug.status = 'in-progress';
      const updatedBug = await savedBug.save();
      expect(updatedBug.status).toBe('in-progress');
    });

    it('should update timestamps on modification', async () => {
      const bug = new Bug({
        title: 'Test Bug',
        description: 'Test description',
        priority: 'medium',
        severity: 'major',
        createdBy: 'Test User',
      });

      const savedBug = await bug.save();
      const originalUpdatedAt = savedBug.updatedAt;

      // Wait a bit to ensure timestamp difference
      await new Promise(resolve => setTimeout(resolve, 10));

      savedBug.title = 'Updated Title';
      const updatedBug = await savedBug.save();

      expect(updatedBug.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });
});
