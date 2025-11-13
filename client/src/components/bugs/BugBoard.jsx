/**
 * BugBoard Component
 * Main Kanban board container
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useBugs } from '../../hooks/useBugs';
import BugColumn from './BugColumn';
import BugModal from './BugModal';
import BugFilters from './BugFilters';
import DeleteConfirm from './DeleteConfirm';
import Header from '../layout/Header';
import { BUG_STATUS } from '../../utils/constants';
import { groupBugsByStatus, filterBugs } from '../../utils/helpers';

const BugBoard = ({ toggleMobileMenu }) => {
  const {
    bugs,
    loading,
    filters,
    fetchBugs,
    createBug,
    updateBug,
    deleteBug,
    setFilters,
    clearFilters,
  } = useBugs();

  // Modal states
  const [isBugModalOpen, setIsBugModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [bugToDelete, setBugToDelete] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Fetch bugs on mount
  useEffect(() => {
    fetchBugs();
  }, [fetchBugs]);

  // Filter and group bugs
  const filteredBugs = useMemo(() => {
    return filterBugs(bugs, filters);
  }, [bugs, filters]);

  const groupedBugs = useMemo(() => {
    return groupBugsByStatus(filteredBugs);
  }, [filteredBugs]);

  // Handlers
  const handleCreateBug = useCallback(() => {
    setSelectedBug(null);
    setIsBugModalOpen(true);
  }, []);

  const handleEditBug = useCallback((bug) => {
    setSelectedBug(bug);
    setIsBugModalOpen(true);
  }, []);

  const handleDeleteClick = useCallback((bugId) => {
    const bug = bugs.find(b => (b._id || b.id) === bugId);
    setBugToDelete(bug);
    setIsDeleteModalOpen(true);
  }, [bugs]);

  const handleConfirmDelete = useCallback(async () => {
    if (!bugToDelete) return;

    try {
      setModalLoading(true);
      await deleteBug(bugToDelete._id || bugToDelete.id);
      setIsDeleteModalOpen(false);
      setBugToDelete(null);
    } catch (error) {
      console.error('Delete error:', error);
    } finally {
      setModalLoading(false);
    }
  }, [bugToDelete, deleteBug]);

  const handleBugSubmit = useCallback(async (data) => {
    try {
      setModalLoading(true);
      if (selectedBug) {
        await updateBug(selectedBug._id || selectedBug.id, data);
      } else {
        await createBug(data);
      }
      setIsBugModalOpen(false);
      setSelectedBug(null);
    } catch (error) {
      console.error('Submit error:', error);
      throw error;
    } finally {
      setModalLoading(false);
    }
  }, [selectedBug, createBug, updateBug]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  const columns = [
    { status: BUG_STATUS.OPEN, bugs: groupedBugs[BUG_STATUS.OPEN] || [] },
    { status: BUG_STATUS.IN_PROGRESS, bugs: groupedBugs[BUG_STATUS.IN_PROGRESS] || [] },
    { status: BUG_STATUS.RESOLVED, bugs: groupedBugs[BUG_STATUS.RESOLVED] || [] },
    { status: BUG_STATUS.CLOSED, bugs: groupedBugs[BUG_STATUS.CLOSED] || [] },
  ];

  return (
    <div className="min-h-screen">
      {/* Header */}
      <Header
        onCreateBug={handleCreateBug}
        onToggleMobileMenu={toggleMobileMenu}
      />

      {/* Content */}
      <div className="p-4 md:p-6 space-y-6">
        {/* Filters */}
        <BugFilters
          filters={filters}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
        />

        {/* Kanban Board */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {columns.map((column) => (
            <BugColumn
              key={column.status}
              status={column.status}
              bugs={column.bugs}
              onEdit={handleEditBug}
              onDelete={handleDeleteClick}
              loading={loading}
            />
          ))}
        </div>
      </div>

      {/* Modals */}
      <BugModal
        isOpen={isBugModalOpen}
        onClose={() => {
          setIsBugModalOpen(false);
          setSelectedBug(null);
        }}
        onSubmit={handleBugSubmit}
        bug={selectedBug}
        loading={modalLoading}
      />

      <DeleteConfirm
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setBugToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        bugTitle={bugToDelete?.title}
        loading={modalLoading}
      />
    </div>
  );
};

BugBoard.propTypes = {
  toggleMobileMenu: function() {},
};

export default BugBoard;
