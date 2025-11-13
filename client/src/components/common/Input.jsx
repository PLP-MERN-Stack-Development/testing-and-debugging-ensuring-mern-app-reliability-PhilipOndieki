/**
 * Input Component
 * Reusable text input with label and error handling
 */

import React, { forwardRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '../../utils/helpers';

const Input = forwardRef(({
  label,
  error,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={props.id || props.name}
          className="block text-sm font-medium text-text-primary mb-1.5"
        >
          {label}
          {props.required && <span className="text-accent-danger ml-1">*</span>}
        </label>
      )}
      <input
        ref={ref}
        className={cn(
          'w-full px-3 py-2 bg-secondary border border-border rounded-lg',
          'text-text-primary placeholder-text-tertiary',
          'focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-colors duration-200',
          error && 'border-accent-danger focus:ring-accent-danger',
          className
        )}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-accent-danger">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
  className: PropTypes.string,
  id: PropTypes.string,
  name: PropTypes.string,
  required: PropTypes.bool,
};

export default Input;
