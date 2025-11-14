/**
 * MobileStatusSelector Component
 * Modal for changing bug status on mobile devices
 */

import PropTypes from 'prop-types';
import { X } from 'lucide-react';
import { BUG_STATUS } from '../../utils/constants';
import Button from '../common/Button';

const STATUS_OPTIONS = [
  {
    value: BUG_STATUS.OPEN,
    label: 'Open',
    color: 'bg-accent-info',
    description: 'Bug is reported and awaiting action',
  },
  {
    value: BUG_STATUS.IN_PROGRESS,
    label: 'In Progress',
    color: 'bg-accent-warning',
    description: 'Bug is being worked on',
  },
  {
    value: BUG_STATUS.RESOLVED,
    label: 'Resolved',
    color: 'bg-accent-success',
    description: 'Bug has been fixed',
  },
  {
    value: BUG_STATUS.CLOSED,
    label: 'Closed',
    color: 'bg-text-tertiary',
    description: 'Bug is closed and verified',
  },
];

const MobileStatusSelector = ({ isOpen, onClose, currentStatus, onStatusChange }) => {
  if (!isOpen) return null;

  const handleStatusClick = (status) => {
    if (status !== currentStatus) {
      onStatusChange(status);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 md:hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-surface rounded-t-2xl p-6 animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-text-primary">Change Status</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-border rounded-lg transition-colors"
            aria-label="Close"
          >
            <X size={20} className="text-text-secondary" />
          </button>
        </div>

        {/* Status Options */}
        <div className="space-y-3 mb-6">
          {STATUS_OPTIONS.map((option) => {
            const isSelected = option.value === currentStatus;

            return (
              <button
                key={option.value}
                onClick={() => handleStatusClick(option.value)}
                className={`
                  w-full text-left p-4 rounded-lg border-2 transition-all
                  ${
                    isSelected
                      ? 'border-primary bg-primary/10'
                      : 'border-border hover:border-primary/50 hover:bg-tertiary'
                  }
                `}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${option.color}`} />
                    <span className="font-semibold text-text-primary">
                      {option.label}
                    </span>
                  </div>
                  {isSelected && (
                    <span className="text-xs text-primary font-medium">
                      Current
                    </span>
                  )}
                </div>
                <p className="text-sm text-text-secondary pl-6">
                  {option.description}
                </p>
              </button>
            );
          })}
        </div>

        {/* Cancel Button */}
        <Button variant="secondary" fullWidth onClick={onClose}>
          Cancel
        </Button>
      </div>
    </div>
  );
};

MobileStatusSelector.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  currentStatus: PropTypes.string,
  onStatusChange: PropTypes.func.isRequired,
};

export default MobileStatusSelector;