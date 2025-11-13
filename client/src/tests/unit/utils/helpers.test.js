/**
 * Tests for helper utilities
 */

import {
  cn,
  getStatusColor,
  getPriorityColor,
  getSeverityColor,
  groupBugsByStatus,
  filterBugs,
} from '../../../utils/helpers';
import { BUG_STATUS, BUG_PRIORITY, BUG_SEVERITY } from '../../../utils/constants';

describe('helpers', () => {
  describe('cn', () => {
    test('combines class names', () => {
      const result = cn('class1', 'class2', 'class3');
      expect(result).toContain('class1');
      expect(result).toContain('class2');
      expect(result).toContain('class3');
    });

    test('handles conditional classes', () => {
      const result = cn('base', true && 'conditional', false && 'excluded');
      expect(result).toContain('base');
      expect(result).toContain('conditional');
      expect(result).not.toContain('excluded');
    });
  });

  describe('getStatusColor', () => {
    test('returns color for each status', () => {
      expect(getStatusColor(BUG_STATUS.OPEN)).toContain('status-open');
      expect(getStatusColor(BUG_STATUS.IN_PROGRESS)).toContain('status-progress');
      expect(getStatusColor(BUG_STATUS.RESOLVED)).toContain('status-resolved');
      expect(getStatusColor(BUG_STATUS.CLOSED)).toContain('status-closed');
    });
  });

  describe('getPriorityColor', () => {
    test('returns color for each priority', () => {
      expect(getPriorityColor(BUG_PRIORITY.LOW)).toContain('priority-low');
      expect(getPriorityColor(BUG_PRIORITY.MEDIUM)).toContain('priority-medium');
      expect(getPriorityColor(BUG_PRIORITY.HIGH)).toContain('priority-high');
      expect(getPriorityColor(BUG_PRIORITY.CRITICAL)).toContain('priority-critical');
    });
  });

  describe('getSeverityColor', () => {
    test('returns color for each severity', () => {
      expect(getSeverityColor(BUG_SEVERITY.MINOR)).toContain('severity-minor');
      expect(getSeverityColor(BUG_SEVERITY.MAJOR)).toContain('severity-major');
      expect(getSeverityColor(BUG_SEVERITY.CRITICAL)).toContain('severity-critical');
    });
  });

  describe('groupBugsByStatus', () => {
    const mockBugs = [
      { id: '1', status: 'open', title: 'Bug 1' },
      { id: '2', status: 'open', title: 'Bug 2' },
      { id: '3', status: 'in-progress', title: 'Bug 3' },
      { id: '4', status: 'resolved', title: 'Bug 4' },
    ];

    test('groups bugs by status', () => {
      const result = groupBugsByStatus(mockBugs);
      expect(result.open).toHaveLength(2);
      expect(result['in-progress']).toHaveLength(1);
      expect(result.resolved).toHaveLength(1);
    });

    test('handles empty array', () => {
      const result = groupBugsByStatus([]);
      expect(result).toEqual({});
    });
  });

  describe('filterBugs', () => {
    const mockBugs = [
      {
        id: '1',
        title: 'Login Bug',
        description: 'Cannot login',
        priority: 'high',
        severity: 'major',
        status: 'open',
        createdBy: 'John',
      },
      {
        id: '2',
        title: 'UI Issue',
        description: 'Button misaligned',
        priority: 'low',
        severity: 'minor',
        status: 'resolved',
        createdBy: 'Jane',
      },
    ];

    test('filters by search term', () => {
      const result = filterBugs(mockBugs, { search: 'login', priority: [], severity: [], status: [] });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Login Bug');
    });

    test('filters by priority', () => {
      const result = filterBugs(mockBugs, { search: '', priority: ['high'], severity: [], status: [] });
      expect(result).toHaveLength(1);
      expect(result[0].priority).toBe('high');
    });

    test('filters by severity', () => {
      const result = filterBugs(mockBugs, { search: '', priority: [], severity: ['minor'], status: [] });
      expect(result).toHaveLength(1);
      expect(result[0].severity).toBe('minor');
    });

    test('filters by status', () => {
      const result = filterBugs(mockBugs, { search: '', priority: [], severity: [], status: ['open'] });
      expect(result).toHaveLength(1);
      expect(result[0].status).toBe('open');
    });

    test('combines multiple filters', () => {
      const result = filterBugs(mockBugs, {
        search: 'bug',
        priority: ['high'],
        severity: [],
        status: [],
      });
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Login Bug');
    });

    test('returns all bugs with empty filters', () => {
      const result = filterBugs(mockBugs, { search: '', priority: [], severity: [], status: [] });
      expect(result).toHaveLength(2);
    });
  });
});
