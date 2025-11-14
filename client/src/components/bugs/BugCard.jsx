/**
 * BugCard Component
 * Individual bug card in Kanban board - Draggable
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Edit, Trash2, Calendar, GripVertical } from 'lucide-react';
import Badge from '../common/Badge';
import { formatDate } from '../../utils/formatters';

const BugCard = ({ bug, onEdit, onDelete, onClick, isDragging }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({
    id: bug._id || bug.id,
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isSortableDragging ? 0.5 : 1,
  };

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit(bug);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    onDelete(bug._id || bug.id);
  };

  const handleClick = (e) => {
    // Don't trigger onClick if clicking on action buttons
    if (e.target.closest('button')) return;
    if (onClick) onClick(bug);
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={handleClick}
      className={`
        bg-secondary rounded-lg p-4 transition-colors border border-border group
        ${isDragging ? 'shadow-2xl' : 'shadow-sm hover:shadow-md'}
        ${isSortableDragging ? 'cursor-grabbing' : 'cursor-pointer md:cursor-grab'}
        ${onClick ? 'active:scale-95' : ''}
      `}
    >
      {/* Drag Handle - Desktop Only */}
      <div className="hidden md:flex items-center justify-between mb-3">
        <div
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-border rounded cursor-grab active:cursor-grabbing"
        >
          <GripVertical size={16} className="text-text-tertiary" />
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={handleEdit}
            className="p-1.5 hover:bg-border rounded transition-colors"
            aria-label="Edit bug"
          >
            <Edit size={16} className="text-text-secondary" />
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 hover:bg-border rounded transition-colors"
            aria-label="Delete bug"
          >
            <Trash2 size={16} className="text-accent-danger" />
          </button>
        </div>
      </div>

      {/* Mobile - Action Buttons Always Visible */}
      <div className="md:hidden flex justify-end gap-1 mb-3">
        <button
          onClick={handleEdit}
          className="p-1.5 hover:bg-border rounded transition-colors"
          aria-label="Edit bug"
        >
          <Edit size={16} className="text-text-secondary" />
        </button>
        <button
          onClick={handleDelete}
          className="p-1.5 hover:bg-border rounded transition-colors"
          aria-label="Delete bug"
        >
          <Trash2 size={16} className="text-accent-danger" />
        </button>
      </div>

      {/* Card Header */}
      <div className="mb-3">
        <h3 className="text-base font-semibold text-text-primary line-clamp-2">
          {bug.title}
        </h3>
      </div>

      {/* Card Body */}
      <p className="text-sm text-text-secondary line-clamp-3 mb-3">
        {bug.description}
      </p>

      {/* Card Footer - Badges */}
      <div className="flex flex-wrap gap-2 items-center mb-3">
        <Badge variant={bug.priority} type="priority" size="sm">
          {bug.priority}
        </Badge>
        <Badge variant={bug.severity} type="severity" size="sm">
          {bug.severity}
        </Badge>
      </div>

      {/* Card Meta */}
      <div className="pt-3 border-t border-border space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text-tertiary">Created by:</span>
          <span className="text-text-secondary font-medium">
            {bug.createdBy}
          </span>
        </div>
        <div className="flex items-center justify-between text-xs text-text-tertiary">
          <Calendar size={12} className="inline mr-1" />
          <span>{formatDate(bug.createdAt)}</span>
        </div>
      </div>
    </div>
  );
};

BugCard.propTypes = {
  bug: PropTypes.shape({
    _id: PropTypes.string,
    id: PropTypes.string,
    title: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    priority: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    createdBy: PropTypes.string.isRequired,
    createdAt: PropTypes.string.isRequired,
  }).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  isDragging: PropTypes.bool,
};

BugCard.defaultProps = {
  isDragging: false,
};

export default memo(
  BugCard,
  (prevProps, nextProps) =>
    (prevProps.bug._id || prevProps.bug.id) ===
      (nextProps.bug._id || nextProps.bug.id) &&
    prevProps.bug.title === nextProps.bug.title &&
    prevProps.bug.status === nextProps.bug.status &&
    prevProps.isDragging === nextProps.isDragging
);