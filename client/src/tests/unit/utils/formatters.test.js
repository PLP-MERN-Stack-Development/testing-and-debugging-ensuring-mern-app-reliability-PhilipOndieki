/**
 * Tests for formatter utilities
 */

import { formatDate, formatRelativeTime, capitalize, truncateText } from '../../../utils/formatters';

describe('formatters', () => {
  describe('formatDate', () => {
    test('formats valid date string correctly', () => {
      const result = formatDate('2024-01-15T10:00:00Z');
      expect(result).toMatch(/Jan 15, 2024/);
    });

    test('returns empty string for invalid date', () => {
      expect(formatDate('invalid')).toBe('');
    });

    test('returns empty string for null/undefined', () => {
      expect(formatDate(null)).toBe('');
      expect(formatDate(undefined)).toBe('');
    });
  });

  describe('formatRelativeTime', () => {
    test('returns "just now" for recent dates', () => {
      const now = new Date();
      expect(formatRelativeTime(now.toISOString())).toBe('just now');
    });

    test('returns minutes ago', () => {
      const past = new Date(Date.now() - 5 * 60 * 1000);
      expect(formatRelativeTime(past.toISOString())).toBe('5 minutes ago');
    });

    test('returns hours ago', () => {
      const past = new Date(Date.now() - 2 * 60 * 60 * 1000);
      expect(formatRelativeTime(past.toISOString())).toBe('2 hours ago');
    });

    test('returns empty string for invalid date', () => {
      expect(formatRelativeTime('invalid')).toBe('');
    });
  });

  describe('capitalize', () => {
    test('capitalizes first letter', () => {
      expect(capitalize('hello')).toBe('Hello');
    });

    test('handles empty string', () => {
      expect(capitalize('')).toBe('');
    });

    test('handles null/undefined', () => {
      expect(capitalize(null)).toBe('');
      expect(capitalize(undefined)).toBe('');
    });
  });

  describe('truncateText', () => {
    test('truncates long text', () => {
      const longText = 'a'.repeat(150);
      const result = truncateText(longText, 100);
      expect(result.length).toBeLessThanOrEqual(104); // 100 + '...'
      expect(result).toContain('...');
    });

    test('does not truncate short text', () => {
      const shortText = 'short';
      expect(truncateText(shortText, 100)).toBe('short');
    });

    test('handles empty string', () => {
      expect(truncateText('', 100)).toBe('');
    });
  });
});
