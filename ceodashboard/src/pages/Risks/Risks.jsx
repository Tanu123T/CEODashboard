import React, { useEffect, useMemo, useState } from 'react';
import './Risks.css';
import '../Project/Project.css';
import '../Employees/Employees.css';
import {
  Search,
  ArrowUpDown,
  ChevronDown,
  ChevronUp,
  Activity,
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PageLoader from '../../components/common/PageLoader';
import useSortableData from '../../hooks/useSortableData';
import useSimulatedLoading from '../../hooks/useSimulatedLoading';
import { riskAlerts } from '../../data/risksData';

const categoryOptions = [
  'All',
  'Delayed Projects',
  'Missed Deadlines',
  'Resource Shortages',
  'Overdue Payments',
  'Critical Bugs',
];

const Risks = () => {
  const isLoading = useSimulatedLoading(700);
  const [alerts, setAlerts] = useState(riskAlerts);
  const [query, setQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setAlerts((prev) => {
        if (!prev.length) return prev;
        const index = Math.floor(Math.random() * prev.length);
        const next = [...prev];
        const selected = next[index];

        next[index] = {
          ...selected,
          ageDays: selected.ageDays + 1,
          status: selected.status === 'Open' ? 'Mitigating' : selected.status,
        };

        return next;
      });
      setLastUpdated(new Date());
    }, 12000);

    return () => clearInterval(timer);
  }, []);

  const filteredAlerts = useMemo(() => {
    return alerts.filter((alert) => {
      const matchesSearch =
        alert.project.toLowerCase().includes(query.toLowerCase()) ||
        alert.category.toLowerCase().includes(query.toLowerCase()) ||
        alert.owner.toLowerCase().includes(query.toLowerCase());

      const matchesCategory = categoryFilter === 'All' || alert.category === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [alerts, query, categoryFilter]);

  const { sortedItems: sortedAlerts, sortConfig, requestSort } = useSortableData(filteredAlerts, {
    key: 'ageDays',
    direction: 'desc',
  });

  const sortLabel = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={13} />;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return <PageLoader title="Loading Risk & Alert Monitoring..." />;
  }

  return (
    <div className="dashboard-wrapper">
      <header className="main-header">
        <div>
          <h1>Risk & Alert Monitoring</h1>
          <p>Track active risks, ownership, and mitigation status across projects.</p>
        </div>
        <div className="header-status">
          <Activity className="sync-icon" size={16} /> Real-time simulation | {lastUpdated.toLocaleTimeString('en-IN')}
        </div>
      </header>

      <section className="table-container">
        <div className="table-header-row project-toolbar-row">
          <h2 className="section-title" style={{ margin: 0 }}>Risk Register</h2>
          <div className="project-toolbar-controls">
            <div className="project-search-inline">
              <Search size={15} />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by project, owner, or category"
              />
            </div>
            <div className="project-filter-chips">
              {categoryOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`filter-chip ${categoryFilter === option ? 'active' : ''}`}
                  onClick={() => setCategoryFilter(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="table-scroll">
          <table className="projects-table">
            <thead>
              <tr>
                <th onClick={() => requestSort('id')} className="sortable-head">ID {sortLabel('id')}</th>
                <th onClick={() => requestSort('category')} className="sortable-head">Category {sortLabel('category')}</th>
                <th onClick={() => requestSort('project')} className="sortable-head">Project {sortLabel('project')}</th>
                <th onClick={() => requestSort('severity')} className="sortable-head">Severity {sortLabel('severity')}</th>
                <th onClick={() => requestSort('owner')} className="sortable-head">Owner {sortLabel('owner')}</th>
                <th onClick={() => requestSort('ageDays')} className="sortable-head">Age (days) {sortLabel('ageDays')}</th>
                <th onClick={() => requestSort('status')} className="sortable-head">Status {sortLabel('status')}</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedAlerts.map((alert) => (
                <React.Fragment key={alert.id}>
                  <tr>
                    <td className="font-bold">{alert.id}</td>
                    <td>{alert.category}</td>
                    <td>{alert.project}</td>
                    <td>
                      <span className={`risk-severity-badge severity-${alert.severity.toLowerCase()}`}>
                        {alert.severity}
                      </span>
                    </td>
                    <td>{alert.owner}</td>
                    <td>{alert.ageDays}</td>
                    <td>
                      <span className={`risk-status-badge risk-status-${alert.status.toLowerCase()}`}>
                        {alert.status}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn details-btn"
                        style={{ opacity: 1, transform: 'scale(1)' }}
                        onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
                      >
                        {expandedId === alert.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>
                  {expandedId === alert.id ? (
                    <tr className="project-detail-row">
                      <td colSpan="8">
                        <div className="project-detail-card">
                          <p><strong>Description:</strong> {alert.description}</p>
                          <p><strong>Owner Team:</strong> {alert.owner}</p>
                          <p><strong>Monitoring Note:</strong> Alert state updates automatically every 12 seconds for UI simulation.</p>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {sortedAlerts.length === 0 ? (
          <EmptyState
            title="No risk alerts found"
            description="Adjust search or category filters to inspect risk records."
          />
        ) : null}
      </section>
    </div>
  );
};

export default Risks;
