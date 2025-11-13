/**
 * ErrorFallback Component
 * UI displayed when an error occurs
 */

import PropTypes from 'prop-types';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';
import Button from '../common/Button';

const ErrorFallback = ({ error, errorInfo, resetError }) => {
  const isDevelopment = import.meta.env.DEV;

  return (
    <div className="min-h-screen bg-primary flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-secondary rounded-lg p-8 text-center border border-border">
        <AlertTriangle className="w-16 h-16 text-accent-danger mx-auto mb-4" />

        <h1 className="text-2xl font-bold text-text-primary mb-2">
          Oops! Something went wrong
        </h1>

        <p className="text-text-secondary mb-6">
          We&apos;re sorry for the inconvenience. The application encountered an unexpected error.
        </p>

        {isDevelopment && error && (
          <details className="mb-6 text-left">
            <summary className="cursor-pointer text-sm text-text-tertiary hover:text-text-secondary mb-2">
              Error Details (Development Only)
            </summary>
            <div className="mt-2 p-3 bg-tertiary rounded text-xs overflow-auto max-h-48">
              <p className="text-accent-danger font-semibold mb-2">{error.toString()}</p>
              {errorInfo && (
                <pre className="text-text-tertiary whitespace-pre-wrap">
                  {errorInfo.componentStack}
                </pre>
              )}
            </div>
          </details>
        )}

        <div className="flex gap-3 justify-center">
          <Button onClick={resetError} variant="primary">
            <RefreshCw size={16} className="mr-2" />
            Try Again
          </Button>
          <Button
            onClick={() => window.location.href = '/'}
            variant="secondary"
          >
            <Home size={16} className="mr-2" />
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
};

ErrorFallback.propTypes = {
  error: PropTypes.object,
  errorInfo: PropTypes.object,
  resetError: PropTypes.func.isRequired,
};

export default ErrorFallback;
