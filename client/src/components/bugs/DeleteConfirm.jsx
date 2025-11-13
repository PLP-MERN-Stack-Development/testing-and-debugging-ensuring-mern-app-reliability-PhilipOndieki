/**
 * DeleteConfirm Component
 * Confirmation modal for bug deletion
 */

import PropTypes from 'prop-types';
import { AlertTriangle } from 'lucide-react';
import Modal from '../common/Modal';
import Button from '../common/Button';

const DeleteConfirm = ({ isOpen, onClose, onConfirm, bugTitle, loading }) => {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Delete Bug" size="sm">
      <div className="space-y-4">
        {/* Warning Icon */}
        <div className="flex items-center justify-center">
          <div className="w-16 h-16 rounded-full bg-accent-danger/10 flex items-center justify-center">
            <AlertTriangle size={32} className="text-accent-danger" />
          </div>
        </div>

        {/* Message */}
        <div className="text-center">
          <p className="text-text-secondary mb-2">
            Are you sure you want to delete this bug?
          </p>
          {bugTitle && (
            <p className="text-sm text-text-primary font-semibold bg-tertiary px-3 py-2 rounded">
              {bugTitle}
            </p>
          )}
          <p className="text-sm text-text-tertiary mt-3">
            This action cannot be undone.
          </p>
        </div>

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-2">
          <Button
            onClick={onClose}
            variant="secondary"
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            loading={loading}
            disabled={loading}
          >
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
};

DeleteConfirm.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  bugTitle: PropTypes.string,
  loading: PropTypes.bool,
};

export default DeleteConfirm;
