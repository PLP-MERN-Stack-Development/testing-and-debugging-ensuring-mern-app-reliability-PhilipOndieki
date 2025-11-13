/**
 * useDebounce Hook
 * Debounces a value to prevent excessive updates
 */

import { useState, useEffect } from 'react';
import { DEBOUNCE_DELAY } from '../utils/constants';

export const useDebounce = (value, delay = DEBOUNCE_DELAY) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};
