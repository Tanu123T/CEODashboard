import React, { useEffect, useMemo, useState } from 'react';
import './Risks.css';
import { Activity, ChevronDown, ChevronUp, Search, TriangleAlert } from 'lucide-react';
import PageLoader from '../../components/common/PageLoader';
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

  const stats = useMemo(() => {
    const criticalOrHigh = filteredAlerts.filter(
      (item) => item.severity === 'Critical' || item.severity === 'High'
    ).length;
    const open = filteredAlerts.filter((item) => item.status === 'Open').length;

    return {
      total: filteredAlerts.length,
      criticalOrHigh,
      open,
    };
  }, [filteredAlerts]);

  if (isLoading) {
    return <PageLoader title="Loading Risk & Alert Monitoring..." />;
  }

  return (
    <div className="risks-page">
      <header className="risks-header">
        <div>
          <h1>Risks & Alerts</h1>
          <p>Track active risks, ownership, and mitigation status across projects.</p>
        </div>
        <div className="risks-live-pill">
          <Activity size={16} />
          <span>Live update {lastUpdated.toLocaleTimeString('en-IN')}</span>
        </div>
      </header>

      <section className="risks-kpi-grid">
        <article className="risk-kpi-card">
          <p>Total Alerts</p>
          <h3>{stats.total}</h3>
        </article>
        <article className="risk-kpi-card warning">
          <p>Critical / High</p>
          <h3>{stats.criticalOrHigh}</h3>
        </article>
        <article className="risk-kpi-card danger">
          <p>Open Alerts</p>
          <h3>{stats.open}</h3>
        </article>
      </section>

      <section className="risk-toolbar">
        <div className="risk-search-inline">
          <Search size={15} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by project, owner, or category"
          />
        </div>
        <div className="risk-filter-chips">
          {categoryOptions.map((option) => (
            <button
              key={option}
              type="button"
              className={`risk-chip ${categoryFilter === option ? 'active' : ''}`}
              onClick={() => setCategoryFilter(option)}
            >
              {option}
            </button>
          ))}
        </div>
      </section>

      <section className="risk-list">
        {filteredAlerts.map((alert) => (
          <article key={alert.id} className="risk-row-card">
            <div className="risk-row-main">
              <div className="risk-main-left">
                <p className="risk-id">{alert.id}</p>
                <div>
                  <h3>{alert.project}</h3>
                  <p>{alert.category} - Owner: {alert.owner}</p>
                </div>
              </div>

              <div className="risk-main-right">
                <span className={`risk-badge severity-${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                <span className={`risk-badge status-${alert.status.toLowerCase()}`}>{alert.status}</span>
                <span className="risk-age">{alert.ageDays}d</span>
                <button
                  type="button"
                  className="risk-toggle-btn"
                  onClick={() => setExpandedId(expandedId === alert.id ? null : alert.id)}
                >
                  {expandedId === alert.id ? <ChevronUp size={15} /> : <ChevronDown size={15} />}
                </button>
              </div>
            </div>

            {expandedId === alert.id ? (
              <div className="risk-expanded">
                <p>
                  <TriangleAlert size={15} />
                  <span>{alert.description}</span>
                </p>
              </div>
            ) : null}
          </article>
        ))}

        {filteredAlerts.length === 0 ? (
          <article className="risk-empty">
            <h4>No risk alerts found</h4>
            <p>Adjust search or category filters to inspect risk records.</p>
          </article>
        ) : null}
      </section>
    </div>
  );
};

export default Risks;
