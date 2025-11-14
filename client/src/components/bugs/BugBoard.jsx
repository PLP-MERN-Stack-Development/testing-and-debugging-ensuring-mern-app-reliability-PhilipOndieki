/**
 * BugBoard Component
 * Main Kanban board container with drag-and-drop
 */

import { useState, useEffect, useMemo, useCallback } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import { sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { useBugs } from '../../hooks/useBugs';
import BugColumn from './BugColumn';
import BugCard from './BugCard';
import BugModal from './BugModal';
import BugFilters from './BugFilters';
import DeleteConfirm from './DeleteConfirm';
import Header from '../layout/Header';
import MobileStatusSelector from './MobileStatusSelector';
import { BUG_STATUS } from '../../utils/constants';
import { groupBugsByStatus, filterBugs } from '../../utils/helpers';
import toast from 'react-hot-toast';

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
  const [isMobileStatusOpen, setIsMobileStatusOpen] = useState(false);
  const [selectedBug, setSelectedBug] = useState(null);
  const [bugToDelete, setBugToDelete] = useState(null);
  const [bugForStatusChange, setBugForStatusChange] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);

  // Drag-and-drop states
  const [activeId, setActiveId] = useState(null);
  const [overId, setOverId] = useState(null);

  // Configure sensors for drag-and-drop
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px movement required before drag starts
      },
    }),
    useSensor(TouchSensor, {
      activationConstraint: {
        delay: 250, // 250ms hold required for touch
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  // Check if mobile
  const isMobile = useMemo(() => {
    return window.innerWidth < 768;
  }, []);

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

  // Get active bug being dragged
  const activeBug = useMemo(() => {
    if (!activeId) return null;
    return bugs.find((bug) => (bug._id || bug.id) === activeId);
  }, [activeId, bugs]);

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
    const bug = bugs.find((b) => (b._id || b.id) === bugId);
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

  const handleBugSubmit = useCallback(
    async (data) => {
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
    },
    [selectedBug, createBug, updateBug]
  );

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
    },
    [setFilters]
  );

  const handleClearFilters = useCallback(() => {
    clearFilters();
  }, [clearFilters]);

  // Mobile: Click to change status
  const handleBugClick = useCallback((bug) => {
    if (isMobile) {
      setBugForStatusChange(bug);
      setIsMobileStatusOpen(true);
    }
  }, [isMobile]);

  const handleMobileStatusChange = useCallback(
    async (newStatus) => {
      if (!bugForStatusChange) return;

      const bugId = bugForStatusChange._id || bugForStatusChange.id;
      const oldStatus = bugForStatusChange.status;

      // Optimistic update
      try {
        await updateBug(bugId, { status: newStatus });
        toast.success(`Bug moved to ${newStatus.replace('-', ' ')}`);
        setIsMobileStatusOpen(false);
        setBugForStatusChange(null);
      } catch (error) {
        console.error('Status update error:', error);
        toast.error('Failed to update bug status');
        // The useBugs hook should handle reverting the optimistic update
      }
    },
    [bugForStatusChange, updateBug]
  );

  // Drag-and-drop handlers
  const handleDragStart = useCallback((event) => {
    setActiveId(event.active.id);
  }, []);

  const handleDragOver = useCallback((event) => {
    const { over } = event;
    setOverId(over ? over.id : null);
  }, []);

  const handleDragEnd = useCallback(
    async (event) => {
      const { active, over } = event;

      setActiveId(null);
      setOverId(null);

      if (!over) return;

      const bugId = active.id;
      const newStatus = over.id;

      // Find the bug
      const bug = bugs.find((b) => (b._id || b.id) === bugId);
      if (!bug) return;

      const oldStatus = bug.status;

      // If status hasn't changed, do nothing
      if (oldStatus === newStatus) return;

      // Optimistic update
      try {
        await updateBug(bugId, { status: newStatus });
        toast.success(`Bug moved to ${newStatus.replace('-', ' ')}`);
      } catch (error) {
        console.error('Status update error:', error);
        toast.error('Failed to update bug status');
        // The useBugs hook should handle reverting the optimistic update
      }
    },
    [bugs, updateBug]
  );

  const handleDragCancel = useCallback(() => {
    setActiveId(null);
    setOverId(null);
  }, []);

  const columns = [
    { status: BUG_STATUS.OPEN, bugs: groupedBugs[BUG_STATUS.OPEN] || [] },
    {
      status: BUG_STATUS.IN_PROGRESS,
      bugs: groupedBugs[BUG_STATUS.IN_PROGRESS] || [],
    },
    {
      status: BUG_STATUS.RESOLVED,
      bugs: groupedBugs[BUG_STATUS.RESOLVED] || [],
    },
    { status: BUG_STATUS.CLOSED, bugs: groupedBugs[BUG_STATUS.CLOSED] || [] },
  ];

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
      onDragCancel={handleDragCancel}
    >
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
                onClick={handleBugClick}
                loading={loading}
                isOver={overId === column.status}
              />
            ))}
          </div>
        </div>

        {/* Drag Overlay - Shows bug being dragged */}
        <DragOverlay>
          {activeBug ? (
            <div className="opacity-50 rotate-3 scale-105">
              <BugCard
                bug={activeBug}
                onEdit={() => {}}
                onDelete={() => {}}
                isDragging
              />
            </div>
          ) : null}
        </DragOverlay>
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

      <MobileStatusSelector
        isOpen={isMobileStatusOpen}
        onClose={() => {
          setIsMobileStatusOpen(false);
          setBugForStatusChange(null);
        }}
        currentStatus={bugForStatusChange?.status}
        onStatusChange={handleMobileStatusChange}
      />
    </DndContext>
  );
};

BugBoard.propTypes = {
  toggleMobileMenu: function () {},
};

export default BugBoard;