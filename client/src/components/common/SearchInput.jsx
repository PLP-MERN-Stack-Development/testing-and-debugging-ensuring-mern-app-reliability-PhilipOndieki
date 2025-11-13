/**
 * SearchInput Component
 * Debounced search input with icon
 */

import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Search, X } from 'lucide-react';
import { useDebounce } from '../../hooks/useDebounce';
import { cn } from '../../utils/helpers';

const SearchInput = ({
  placeholder = 'Search...',
  onSearch,
  delay = 300,
  className = '',
}) => {
  const [value, setValue] = useState('');
  const debouncedValue = useDebounce(value, delay);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    setValue('');
    onSearch('');
  };

  return (
    <div className={cn('relative', className)}>
      <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
        <Search size={18} className="text-text-tertiary" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="w-full pl-10 pr-10 py-2 bg-secondary border border-border rounded-lg text-text-primary placeholder-text-tertiary focus:outline-none focus:ring-2 focus:ring-accent-primary focus:border-transparent transition-colors duration-200"
      />
      {value && (
        <button
          onClick={handleClear}
          className="absolute inset-y-0 right-0 flex items-center pr-3 hover:bg-tertiary rounded-r-lg transition-colors"
          aria-label="Clear search"
        >
          <X size={18} className="text-text-tertiary" />
        </button>
      )}
    </div>
  );
};

SearchInput.propTypes = {
  placeholder: PropTypes.string,
  onSearch: PropTypes.func.isRequired,
  delay: PropTypes.number,
  className: PropTypes.string,
};

export default SearchInput;
