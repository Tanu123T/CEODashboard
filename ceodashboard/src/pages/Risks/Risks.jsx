import React, { useEffect, useMemo, useState } from 'react';
import './Risks.css';
import { Activity, ChevronRight, CircleCheck, Search, ShieldAlert, ShieldCheck, ShieldQuestion, TriangleAlert, X } from 'lucide-react';
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
  const [selectedId, setSelectedId] = useState(null);
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

  const selectedAlert = useMemo(() => {
    return filteredAlerts.find((item) => item.id === selectedId) || null;
  }, [filteredAlerts, selectedId]);

  useEffect(() => {
    if (selectedId && !filteredAlerts.some((item) => item.id === selectedId)) {
      setSelectedId(filteredAlerts[0]?.id ?? null);
    }
  }, [filteredAlerts, selectedId]);

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

      <section className="risks-layout">
        <div className="risk-list-column">
          <div className="risk-list">
            {filteredAlerts.map((alert) => {
              const isSelected = selectedAlert?.id === alert.id;

              return (
                <button
                  key={alert.id}
                  type="button"
                  className={`risk-row-card ${isSelected ? 'active' : ''}`}
                  onClick={() => setSelectedId(alert.id)}
                >
                  <div className="risk-row-main">
                    <div className="risk-main-left">
                      <div className={`risk-icon ${alert.severity.toLowerCase()}`}>
                        <TriangleAlert size={18} />
                      </div>
                      <div className="risk-copy">
                        <h3>{alert.project}</h3>
                        <div className="risk-subline">
                          <span className={`risk-badge severity-${alert.severity.toLowerCase()}`}>{alert.severity}</span>
                          <span className={`risk-badge status-${alert.status.toLowerCase()}`}>{alert.status}</span>
                          <span className="risk-meta-text">{alert.category}</span>
                        </div>
                      </div>
                    </div>

                    <div className="risk-main-right">
                      <div className="risk-owner-block">
                        <span>{alert.owner}</span>
                        <strong>{alert.raisedOn}</strong>
                      </div>
                      <ChevronRight size={17} className="risk-chevron" />
                    </div>
                  </div>
                </button>
              );
            })}

            {filteredAlerts.length === 0 ? (
              <article className="risk-empty">
                <h4>No risk alerts found</h4>
                <p>Adjust search or category filters to inspect risk records.</p>
              </article>
            ) : null}
          </div>
        </div>

        <aside className="risk-detail-column">
          {selectedAlert ? (
            <article className={`risk-detail-card severity-${selectedAlert.severity.toLowerCase()}`}>
              <div className="risk-detail-top">
                <div className="risk-detail-badges">
                  <span className={`risk-badge severity-${selectedAlert.severity.toLowerCase()}`}>{selectedAlert.severity}</span>
                  <span className={`risk-badge status-${selectedAlert.status.toLowerCase()}`}>{selectedAlert.status}</span>
                </div>
                <button type="button" className="risk-close-btn" onClick={() => setSelectedId(null)}>
                  <X size={16} />
                </button>
              </div>

              <h2>{selectedAlert.project}</h2>
              <p className="risk-detail-subtitle">{selectedAlert.category}</p>

              <div className="risk-detail-grid">
                <article>
                  <span>Probability</span>
                  <strong>{selectedAlert.probability}</strong>
                </article>
                <article>
                  <span>Impact</span>
                  <strong>{selectedAlert.impact}</strong>
                </article>
                <article>
                  <span>Owner</span>
                  <strong>{selectedAlert.owner}</strong>
                </article>
                <article>
                  <span>Raised</span>
                  <strong>{selectedAlert.raisedOn}</strong>
                </article>
              </div>

              <section className="risk-detail-block">
                <h3>Description</h3>
                <p>{selectedAlert.description}</p>
              </section>

              <section className="risk-detail-callout">
                <div className="risk-callout-head">
                  <ShieldAlert size={16} />
                  <span>Mitigation Strategy</span>
                </div>
                <p>{selectedAlert.mitigationStrategy}</p>
              </section>

              <section className="risk-detail-block">
                <h3>Action Items</h3>
                <ul className="risk-action-list">
                  {selectedAlert.actionItems.map((item) => (
                    <li key={item}>
                      <CircleCheck size={16} />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </section>

              <section className="risk-detail-block">
                <h3>Discussion</h3>
                <div className="risk-discussion">
                  {selectedAlert.discussion.map((item) => (
                    <div key={item.author} className="risk-discussion-item">
                      <strong>{item.author}</strong>
                      <span>{item.note}</span>
                    </div>
                  ))}
                </div>
              </section>
            </article>
          ) : (
            <article className="risk-detail-card empty">
              <div className="risk-detail-empty-icon">
                <ShieldQuestion size={28} />
              </div>
              <h2>Select a risk</h2>
              <p>Click any risk in the list to view the detailed mitigation panel.</p>
            </article>
          )}
        </aside>
      </section>
    </div>
  );
};

export default Risks;
