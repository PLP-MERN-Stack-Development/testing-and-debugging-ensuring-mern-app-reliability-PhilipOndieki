/**
 * Badge Component
 * Displays status, priority, or severity badges
 */

import PropTypes from 'prop-types';
import { cn, getStatusColor, getPriorityColor, getSeverityColor } from '../../utils/helpers';
import { capitalize } from '../../utils/formatters';

const Badge = ({ children, variant, type = 'status', size = 'md', className = '' }) => {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-2.5 py-1 text-sm',
    lg: 'px-3 py-1.5 text-base',
  };

  const getColorClass = () => {
    if (type === 'status') return getStatusColor(variant);
    if (type === 'priority') return getPriorityColor(variant);
    if (type === 'severity') return getSeverityColor(variant);
    return 'bg-secondary text-text-primary border-border';
  };

  return (
    <span
      className={cn(
        'inline-flex items-center font-medium rounded-md border',
        getColorClass(),
        sizeStyles[size],
        className
      )}
    >
      {children || capitalize(variant)}
    </span>
  );
};

Badge.propTypes = {
  children: PropTypes.node,
  variant: PropTypes.string,
  type: PropTypes.oneOf(['status', 'priority', 'severity']),
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  className: PropTypes.string,
};

export default Badge;
