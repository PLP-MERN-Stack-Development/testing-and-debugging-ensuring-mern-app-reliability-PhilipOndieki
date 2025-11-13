/**
 * useBugs Hook
 * Custom hook for bug CRUD operations
 */

import { useCallback } from 'react';
import { toast } from 'react-hot-toast';
import { useBugContext } from '../context/BugContext';
import { bugService } from '../services/bugService';
import { ACTIONS } from '../context/bugReducer';

export const useBugs = () => {
  const { state, dispatch } = useBugContext();

  /**
   * Fetch all bugs
   */
  const fetchBugs = useCallback(async (params = {}) => {
    try {
      dispatch({ type: ACTIONS.SET_LOADING, payload: true });
      const response = await bugService.getAllBugs(params);
      dispatch({ type: ACTIONS.SET_BUGS, payload: response.data.data });
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to load bugs';
      dispatch({ type: ACTIONS.SET_ERROR, payload: errorMessage });
      toast.error(errorMessage);
    }
  }, [dispatch]);

  /**
   * Create a new bug
   */
  const createBug = useCallback(async (bugData) => {
    try {
      const response = await bugService.createBug(bugData);
      dispatch({ type: ACTIONS.ADD_BUG, payload: response.data.data });
      toast.success('Bug created successfully');
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to create bug';
      toast.error(errorMessage);
      throw error;
    }
  }, [dispatch]);

  /**
   * Update an existing bug
   */
  const updateBug = useCallback(async (id, bugData) => {
    try {
      const response = await bugService.updateBug(id, bugData);
      dispatch({ type: ACTIONS.UPDATE_BUG, payload: response.data.data });
      toast.success('Bug updated successfully');
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update bug';
      toast.error(errorMessage);
      throw error;
    }
  }, [dispatch]);

  /**
   * Partial update (e.g., status change)
   */
  const patchBug = useCallback(async (id, bugData) => {
    try {
      const response = await bugService.patchBug(id, bugData);
      dispatch({ type: ACTIONS.UPDATE_BUG, payload: response.data.data });
      toast.success('Bug updated successfully');
      return response.data.data;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to update bug';
      toast.error(errorMessage);
      throw error;
    }
  }, [dispatch]);

  /**
   * Delete a bug
   */
  const deleteBug = useCallback(async (id) => {
    try {
      await bugService.deleteBug(id);
      dispatch({ type: ACTIONS.DELETE_BUG, payload: id });
      toast.success('Bug deleted successfully');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to delete bug';
      toast.error(errorMessage);
      throw error;
    }
  }, [dispatch]);

  /**
   * Set filters
   */
  const setFilters = useCallback((filters) => {
    dispatch({ type: ACTIONS.SET_FILTERS, payload: filters });
  }, [dispatch]);

  /**
   * Clear all filters
   */
  const clearFilters = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_FILTERS });
  }, [dispatch]);

  return {
    bugs: state.bugs,
    loading: state.loading,
    error: state.error,
    filters: state.filters,
    fetchBugs,
    createBug,
    updateBug,
    patchBug,
    deleteBug,
    setFilters,
    clearFilters,
  };
};
