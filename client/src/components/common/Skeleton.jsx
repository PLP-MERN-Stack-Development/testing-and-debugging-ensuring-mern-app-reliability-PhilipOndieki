/**
 * Skeleton Component
 * Loading placeholder for content
 */

import PropTypes from 'prop-types';
import { cn } from '../../utils/helpers';

const Skeleton = ({ className = '', variant = 'rectangular', ...props }) => {
  const baseStyles = 'animate-shimmer bg-secondary rounded';

  const variants = {
    rectangular: 'w-full h-24',
    text: 'w-full h-4',
    circular: 'rounded-full h-12 w-12',
  };

  return (
    <div
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    />
  );
};

Skeleton.propTypes = {
  className: PropTypes.string,
  variant: PropTypes.oneOf(['rectangular', 'text', 'circular']),
};

export default Skeleton;
