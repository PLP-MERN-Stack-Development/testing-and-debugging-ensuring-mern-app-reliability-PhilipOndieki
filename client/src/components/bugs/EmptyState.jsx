/**
 * EmptyState Component
 * Displays empty state for bug columns
 */

import PropTypes from 'prop-types';
import { Bug } from 'lucide-react';

const EmptyState = ({ message = 'No bugs in this category' }) => {
  return (
    <div className="flex flex-col items-center justify-center py-8 px-4 text-center">
      <Bug size={48} className="text-text-tertiary mb-3 opacity-50" />
      <p className="text-sm text-text-tertiary">{message}</p>
    </div>
  );
};

EmptyState.propTypes = {
  message: PropTypes.string,
};

export default EmptyState;
