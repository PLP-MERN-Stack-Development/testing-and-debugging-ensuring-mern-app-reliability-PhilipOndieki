/**
 * BugColumn Component
 * Kanban column with droppable zone
 */

import PropTypes from 'prop-types';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import BugCard from './BugCard';
import { BUG_STATUS } from '../../utils/constants';

const STATUS_CONFIG = {
  [BUG_STATUS.OPEN]: {
    title: 'Open',
    bgColor: 'bg-accent-info/10',
    borderColor: 'border-accent-info',
    textColor: 'text-accent-info',
  },
  [BUG_STATUS.IN_PROGRESS]: {
    title: 'In Progress',
    bgColor: 'bg-accent-warning/10',
    borderColor: 'border-accent-warning',
    textColor: 'text-accent-warning',
  },
  [BUG_STATUS.RESOLVED]: {
    title: 'Resolved',
    bgColor: 'bg-accent-success/10',
    borderColor: 'border-accent-success',
    textColor: 'text-accent-success',
  },
  [BUG_STATUS.CLOSED]: {
    title: 'Closed',
    bgColor: 'bg-text-tertiary/10',
    borderColor: 'border-text-tertiary',
    textColor: 'text-text-tertiary',
  },
};

const BugColumn = ({ status, bugs, onEdit, onDelete, onClick, loading, isOver }) => {
  const config = STATUS_CONFIG[status];
  const bugIds = bugs.map((bug) => bug._id || bug.id);

  // Make column droppable
  const { setNodeRef } = useDroppable({
    id: status,
  });

  return (
    <div className="flex flex-col h-full">
      {/* Column Header */}
      <div
        className={`
          px-4 py-3 rounded-t-lg border-b-2
          ${config.bgColor} ${config.borderColor}
        `}
      >
        <div className="flex items-center justify-between">
          <h2 className={`text-sm font-semibold uppercase tracking-wide ${config.textColor}`}>
            {config.title}
          </h2>
          <span
            className={`
              text-xs font-bold px-2 py-1 rounded-full
              ${config.bgColor} ${config.textColor}
            `}
          >
            {bugs.length}
          </span>
        </div>
      </div>

      {/* Column Body - Droppable Area */}
      <div
        ref={setNodeRef}
        className={`
          flex-1 p-3 space-y-3 bg-tertiary rounded-b-lg min-h-[200px]
          transition-colors
          ${isOver ? 'bg-primary/5 ring-2 ring-primary' : ''}
        `}
      >
        <SortableContext items={bugIds} strategy={verticalListSortingStrategy}>
          {loading && bugs.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : bugs.length === 0 ? (
            <div className="flex items-center justify-center h-32">
              <p className="text-text-tertiary text-sm">No bugs</p>
            </div>
          ) : (
            bugs.map((bug) => (
              <BugCard
                key={bug._id || bug.id}
                bug={bug}
                onEdit={onEdit}
                onDelete={onDelete}
                onClick={onClick}
              />
            ))
          )}
        </SortableContext>
      </div>
    </div>
  );
};

BugColumn.propTypes = {
  status: PropTypes.string.isRequired,
  bugs: PropTypes.arrayOf(
    PropTypes.shape({
      _id: PropTypes.string,
      id: PropTypes.string,
    })
  ).isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
  isOver: PropTypes.bool,
};

BugColumn.defaultProps = {
  loading: false,
  isOver: false,
};

export default BugColumn;