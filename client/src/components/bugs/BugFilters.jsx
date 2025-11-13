/**
 * BugFilters Component
 * Search and filter controls
 */

import PropTypes from 'prop-types';
import { Filter, X } from 'lucide-react';
import SearchInput from '../common/SearchInput';
import Select from '../common/Select';
import Button from '../common/Button';
import { PRIORITY_OPTIONS, SEVERITY_OPTIONS, STATUS_OPTIONS } from '../../utils/constants';

const BugFilters = ({ filters, onFilterChange, onClearFilters }) => {
  const handleSearchChange = (search) => {
    onFilterChange({ search });
  };

  const hasActiveFilters = filters.search || filters.priority.length > 0 ||
    filters.severity.length > 0 || filters.status.length > 0;

  return (
    <div className="bg-secondary border border-border rounded-lg p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Filter size={20} className="text-text-secondary" />
          <h3 className="text-lg font-semibold text-text-primary">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button
            onClick={onClearFilters}
            variant="ghost"
            size="sm"
            className="flex items-center gap-1"
          >
            <X size={16} />
            Clear
          </Button>
        )}
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Search */}
        <div className="md:col-span-2 lg:col-span-4">
          <SearchInput
            placeholder="Search bugs by title, description, or author..."
            onSearch={handleSearchChange}
          />
        </div>

        {/* Priority Filter */}
        <Select
          label="Priority"
          value={filters.priority[0] || ''}
          onChange={(e) => onFilterChange({ priority: e.target.value ? [e.target.value] : [] })}
          options={PRIORITY_OPTIONS}
          placeholder="All priorities"
        />

        {/* Severity Filter */}
        <Select
          label="Severity"
          value={filters.severity[0] || ''}
          onChange={(e) => onFilterChange({ severity: e.target.value ? [e.target.value] : [] })}
          options={SEVERITY_OPTIONS}
          placeholder="All severities"
        />

        {/* Status Filter */}
        <Select
          label="Status"
          value={filters.status[0] || ''}
          onChange={(e) => onFilterChange({ status: e.target.value ? [e.target.value] : [] })}
          options={STATUS_OPTIONS}
          placeholder="All statuses"
        />
      </div>
    </div>
  );
};

BugFilters.propTypes = {
  filters: PropTypes.shape({
    search: PropTypes.string,
    priority: PropTypes.array,
    severity: PropTypes.array,
    status: PropTypes.array,
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onClearFilters: PropTypes.func.isRequired,
};

export default BugFilters;
