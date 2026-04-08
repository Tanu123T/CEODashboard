import React from 'react';
import { Search } from 'lucide-react';

const FilterSelect = ({ label, value, onChange, options }) => (
  <label className="ph-filter-item">
    <span>{label}</span>
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      {options.map((item) => (
        <option key={item} value={item}>{item}</option>
      ))}
    </select>
  </label>
);

const PeopleHealthFilters = ({
  activeTab,
  filters,
  setFilters,
  departments,
  projects,
  ranges,
}) => {
  const isMembersTab = activeTab === 'role-coverage';
  const showSearch = !isMembersTab;
  const showTimeRange = !isMembersTab;
  const showProjectFilter = false;

  return (
    <section className="ph-filter-card">
      {showSearch ? (
        <label className="ph-search-wrap" aria-label="Search employee, department, or project">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search employee, role, project"
            value={filters.search}
            onChange={(event) => setFilters((prev) => ({ ...prev, search: event.target.value }))}
          />
        </label>
      ) : null}

      <div className="ph-filter-grid">
        <FilterSelect
          label="Department"
          value={filters.department}
          onChange={(value) => setFilters((prev) => ({ ...prev, department: value }))}
          options={departments}
        />

        {showProjectFilter ? (
          <FilterSelect
            label="Project"
            value={filters.project}
            onChange={(value) => setFilters((prev) => ({ ...prev, project: value }))}
            options={projects}
          />
        ) : null}

        {showTimeRange ? (
          <FilterSelect
            label="Time Range"
            value={filters.timeRange}
            onChange={(value) => setFilters((prev) => ({ ...prev, timeRange: value }))}
            options={ranges}
          />
        ) : null}
      </div>
    </section>
  );
};

export default PeopleHealthFilters;
