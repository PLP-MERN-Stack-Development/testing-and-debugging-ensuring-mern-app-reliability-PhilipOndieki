/**
 * BugColumn Component
 * Status column in Kanban board
 */

import { memo } from 'react';
import PropTypes from 'prop-types';
import BugCard from './BugCard';
import EmptyState from './EmptyState';
import Skeleton from '../common/Skeleton';
import { cn } from '../../utils/helpers';
import { STATUS_LABELS } from '../../utils/constants';

const BugColumn = ({ status, bugs, onEdit, onDelete, onClick, loading }) => {
  const statusColors = {
    open: 'text-status-open',
    'in-progress': 'text-status-progress',
    resolved: 'text-status-resolved',
    closed: 'text-status-closed',
  };

  return (
    <div className="flex flex-col min-w-[300px] md:min-w-0">
      {/* Column Header */}
      <div className="bg-secondary border border-border rounded-t-lg p-4 sticky top-0 z-10">
        <div className="flex items-center justify-between">
          <h3 className={cn('text-lg font-semibold', statusColors[status])}>
            {STATUS_LABELS[status]}
          </h3>
          <span className="px-2.5 py-1 bg-tertiary rounded-full text-sm font-medium text-text-secondary">
            {bugs.length}
          </span>
        </div>
      </div>

      {/* Column Content */}
      <div className="flex-1 bg-secondary/50 border-x border-b border-border rounded-b-lg p-4 space-y-3 min-h-[400px] max-h-[calc(100vh-250px)] overflow-y-auto scrollbar-thin">
        {loading ? (
          // Loading skeletons
          <>
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
            <Skeleton className="h-40" />
          </>
        ) : bugs.length === 0 ? (
          // Empty state
          <EmptyState message={`No ${STATUS_LABELS[status].toLowerCase()} bugs`} />
        ) : (
          // Bug cards
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
      </div>
    </div>
  );
};

BugColumn.propTypes = {
  status: PropTypes.string.isRequired,
  bugs: PropTypes.array.isRequired,
  onEdit: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  onClick: PropTypes.func,
  loading: PropTypes.bool,
};

export default memo(BugColumn);
