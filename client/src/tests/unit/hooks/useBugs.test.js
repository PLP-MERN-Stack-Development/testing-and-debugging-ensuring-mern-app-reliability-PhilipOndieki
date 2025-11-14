/**
 * Unit Tests for useBugs Hook
 */

import { renderHook, act, waitFor } from '@testing-library/react';
import { toast } from 'react-hot-toast';
import { useBugs } from '../../../hooks/useBugs';
import { BugProvider } from '../../../context/BugContext';
import { bugService } from '../../../services/bugService';

// Mock dependencies
jest.mock('react-hot-toast');
jest.mock('../../../services/bugService');

const wrapper = ({ children }) => <BugProvider>{children}</BugProvider>;

describe('useBugs Hook - Unit Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    toast.success = jest.fn();
    toast.error = jest.fn();
  });

  describe('fetchBugs', () => {
    it('should fetch bugs successfully', async () => {
      const mockBugs = [
        { _id: '1', title: 'Bug 1', status: 'open' },
        { _id: '2', title: 'Bug 2', status: 'closed' },
      ];

      bugService.getAllBugs.mockResolvedValue({
        data: { data: mockBugs },
      });

      const { result } = renderHook(() => useBugs(), { wrapper });

      await act(async () => {
        await result.current.fetchBugs();
      });

      await waitFor(() => {
        expect(result.current.bugs).toEqual(mockBugs);
        expect(result.current.loading).toBe(false);
      });
    });

    it('should handle fetch errors', async () => {
      const errorMessage = 'Failed to load bugs';
      bugService.getAllBugs.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useBugs(), { wrapper });

      await act(async () => {
        await result.current.fetchBugs();
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
        expect(result.current.error).toBe(errorMessage);
      });
    });

    it('should set loading state during fetch', async () => {
      bugService.getAllBugs.mockImplementation(
        () => new Promise(resolve => setTimeout(() => resolve({ data: { data: [] } }), 100))
      );

      const { result } = renderHook(() => useBugs(), { wrapper });

      act(() => {
        result.current.fetchBugs();
      });

      expect(result.current.loading).toBe(true);

      await waitFor(() => {
        expect(result.current.loading).toBe(false);
      });
    });
  });

  describe('createBug', () => {
    it('should create a bug successfully', async () => {
      const newBug = {
        title: 'New Bug',
        description: 'New bug description',
        priority: 'high',
        severity: 'major',
      };

      const createdBug = { _id: '3', ...newBug, status: 'open' };

      bugService.createBug.mockResolvedValue({
        data: { data: createdBug },
      });

      const { result } = renderHook(() => useBugs(), { wrapper });

      let returnedBug;
      await act(async () => {
        returnedBug = await result.current.createBug(newBug);
      });

      await waitFor(() => {
        expect(result.current.bugs).toContainEqual(createdBug);
        expect(toast.success).toHaveBeenCalledWith('Bug created successfully');
        expect(returnedBug).toEqual(createdBug);
      });
    });

    it('should handle create errors', async () => {
      const errorMessage = 'Failed to create bug';
      bugService.createBug.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useBugs(), { wrapper });

      await expect(
        act(async () => {
          await result.current.createBug({});
        })
      ).rejects.toBeDefined();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });
  });

  describe('updateBug', () => {
    it('should update a bug successfully', async () => {
      const initialBugs = [
        { _id: '1', title: 'Bug 1', status: 'open' },
        { _id: '2', title: 'Bug 2', status: 'open' },
      ];

      bugService.getAllBugs.mockResolvedValue({
        data: { data: initialBugs },
      });

      const { result } = renderHook(() => useBugs(), { wrapper });

      await act(async () => {
        await result.current.fetchBugs();
      });

      const updatedBug = { _id: '1', title: 'Updated Bug', status: 'closed' };
      bugService.updateBug.mockResolvedValue({
        data: { data: updatedBug },
      });

      await act(async () => {
        await result.current.updateBug('1', { title: 'Updated Bug', status: 'closed' });
      });

      await waitFor(() => {
        expect(result.current.bugs.find(b => b._id === '1')).toEqual(updatedBug);
        expect(toast.success).toHaveBeenCalledWith('Bug updated successfully');
      });
    });

    it('should handle update errors', async () => {
      const errorMessage = 'Failed to update bug';
      bugService.updateBug.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useBugs(), { wrapper });

      await expect(
        act(async () => {
          await result.current.updateBug('1', {});
        })
      ).rejects.toBeDefined();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });
  });

  describe('patchBug', () => {
    it('should patch a bug status successfully', async () => {
      const initialBugs = [
        { _id: '1', title: 'Bug 1', status: 'open' },
      ];

      bugService.getAllBugs.mockResolvedValue({
        data: { data: initialBugs },
      });

      const { result } = renderHook(() => useBugs(), { wrapper });

      await act(async () => {
        await result.current.fetchBugs();
      });

      const patchedBug = { _id: '1', title: 'Bug 1', status: 'resolved' };
      bugService.patchBug.mockResolvedValue({
        data: { data: patchedBug },
      });

      await act(async () => {
        await result.current.patchBug('1', { status: 'resolved' });
      });

      await waitFor(() => {
        expect(result.current.bugs.find(b => b._id === '1').status).toBe('resolved');
        expect(toast.success).toHaveBeenCalledWith('Bug updated successfully');
      });
    });

    it('should handle patch errors', async () => {
      const errorMessage = 'Failed to update bug';
      bugService.patchBug.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useBugs(), { wrapper });

      await expect(
        act(async () => {
          await result.current.patchBug('1', { status: 'resolved' });
        })
      ).rejects.toBeDefined();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });
  });

  describe('deleteBug', () => {
    it('should delete a bug successfully', async () => {
      const initialBugs = [
        { _id: '1', title: 'Bug 1', status: 'open' },
        { _id: '2', title: 'Bug 2', status: 'open' },
      ];

      bugService.getAllBugs.mockResolvedValue({
        data: { data: initialBugs },
      });

      const { result } = renderHook(() => useBugs(), { wrapper });

      await act(async () => {
        await result.current.fetchBugs();
      });

      bugService.deleteBug.mockResolvedValue({});

      await act(async () => {
        await result.current.deleteBug('1');
      });

      await waitFor(() => {
        expect(result.current.bugs.find(b => b._id === '1')).toBeUndefined();
        expect(toast.success).toHaveBeenCalledWith('Bug deleted successfully');
      });
    });

    it('should handle delete errors', async () => {
      const errorMessage = 'Failed to delete bug';
      bugService.deleteBug.mockRejectedValue({
        response: { data: { message: errorMessage } },
      });

      const { result } = renderHook(() => useBugs(), { wrapper });

      await expect(
        act(async () => {
          await result.current.deleteBug('1');
        })
      ).rejects.toBeDefined();

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(errorMessage);
      });
    });
  });

  describe('Filters', () => {
    it('should set filters', () => {
      const { result } = renderHook(() => useBugs(), { wrapper });

      const newFilters = { status: 'open', priority: 'high' };

      act(() => {
        result.current.setFilters(newFilters);
      });

      expect(result.current.filters).toEqual(newFilters);
    });

    it('should clear filters', () => {
      const { result } = renderHook(() => useBugs(), { wrapper });

      act(() => {
        result.current.setFilters({ status: 'open', priority: 'high' });
      });

      expect(result.current.filters).toEqual({ status: 'open', priority: 'high' });

      act(() => {
        result.current.clearFilters();
      });

      expect(result.current.filters).toEqual({});
    });
  });
});
