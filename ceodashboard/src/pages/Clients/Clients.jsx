import React, { useMemo, useState } from 'react';
import './Clients.css';
import {
  BadgeDollarSign,
  X,
  CalendarDays,
  Download,
  Mail,
  MapPin,
  Phone,
  Search,
  SlidersHorizontal,
  Star,
  TrendingUp,
  User,
  Users,
} from 'lucide-react';
import PageLoader from '../../components/common/PageLoader';
import useSimulatedLoading from '../../hooks/useSimulatedLoading';
import { clients } from '../../data/clientsData';

const formatCurrency = (value) => {
  if (!value) return '-';
  return `₹${value.toLocaleString('en-IN')}`;
};

const Clients = () => {
  const isLoading = useSimulatedLoading(650);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [selectedClientTab, setSelectedClientTab] = useState('overview');
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const totalMrr = useMemo(() => clients.reduce((sum, client) => sum + (client.mrr || 0), 0), []);
  const activeClients = useMemo(() => clients.filter((client) => client.isActive).length, []);
  const avgEngagement = useMemo(
    () => Math.round(clients.reduce((sum, client) => sum + client.engagement, 0) / Math.max(clients.length, 1)),
    []
  );

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesQuery =
        client.name.toLowerCase().includes(query.toLowerCase())
        || client.industry.toLowerCase().includes(query.toLowerCase())
        || client.contact.email.toLowerCase().includes(query.toLowerCase());
      const matchesStatus = statusFilter === 'all' || client.statusTone === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [query, statusFilter]);

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) || null,
    [selectedClientId]
  );

  const openClient = (clientId) => {
    setSelectedClientId(clientId);
    setSelectedClientTab('overview');
  };

  if (isLoading) {
    return <PageLoader title="Loading Client Overview..." />;
  }

  return (
    <div className="clients-page clients-dashboard">
      <section className="clients-kpi-grid modern">
        <article className="clients-kpi-card modern">
          <span className="clients-kpi-icon blue"><Users size={18} /></span>
          <div>
            <p>Total Clients</p>
            <h3>{clients.length}</h3>
            <small>{activeClients} active clients</small>
          </div>
        </article>
        <article className="clients-kpi-card modern">
          <span className="clients-kpi-icon green"><BadgeDollarSign size={18} /></span>
          <div>
            <p>Total Revenue</p>
            <h3>{formatCurrency(totalMrr)}</h3>
            <small>monthly recurring</small>
          </div>
        </article>
        <article className="clients-kpi-card modern">
          <span className="clients-kpi-icon teal"><TrendingUp size={18} /></span>
          <div>
            <p>Avg Engagement</p>
            <h3>{avgEngagement}%</h3>
            <small>across all accounts</small>
          </div>
        </article>
        <article className="clients-kpi-card modern">
          <span className="clients-kpi-icon amber"><Star size={18} /></span>
          <div>
            <p>Satisfaction</p>
            <h3>{(avgEngagement / 20).toFixed(1)}/5</h3>
            <small>client sentiment</small>
          </div>
        </article>
      </section>

      <section className="clients-toolbar">
        <label className="clients-search-wrap" htmlFor="client-search">
          <Search size={15} />
          <input
            id="client-search"
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search clients by name, industry or email..."
          />
        </label>

        <select
          className="clients-select"
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
          aria-label="Filter clients by status"
        >
          <option value="all">All Status</option>
          <option value="good">Good</option>
          <option value="warning">Needs Attention</option>
          <option value="risk">At Risk</option>
          <option value="new">New</option>
        </select>

        <button type="button" className="toolbar-btn">
          <SlidersHorizontal size={14} />
          <span>More Filters</span>
        </button>
        <button type="button" className="toolbar-btn">
          <Download size={14} />
          <span>Export</span>
        </button>
      </section>

      <section className="clients-card-grid">
        {filteredClients.map((client) => {
          const initials = client.name
            .split(' ')
            .slice(0, 2)
            .map((item) => item[0])
            .join('')
            .toUpperCase();
          const growth = ((client.engagement - 60) / 4).toFixed(1);

          return (
            <button
              key={client.id}
              type="button"
              className="client-modern-card"
              onClick={() => openClient(client.id)}
            >
              <div className="client-card-accent" />
              <div className="client-card-head">
                <span className={`client-avatar ${client.iconTone}`}>{initials}</span>
                <div className="client-head-copy">
                  <h3>{client.name}</h3>
                  <div>
                    <span className={`client-status-pill ${client.statusTone}`}>{client.statusLabel.toLowerCase()}</span>
                    <small>{client.industry}</small>
                  </div>
                </div>
              </div>

              <div className="client-contact-lines">
                <p><Mail size={13} /> {client.contact.email}</p>
                <p><Phone size={13} /> {client.contact.phone}</p>
                <p><MapPin size={13} /> {client.contact.location}</p>
              </div>

              <div className="client-metrics-row">
                <article>
                  <strong>{formatCurrency(client.mrr)}</strong>
                  <span>Revenue</span>
                </article>
                <article>
                  <strong className={Number(growth) >= 0 ? 'good' : 'risk'}>{Number(growth) >= 0 ? '+' : ''}{growth}%</strong>
                  <span>Growth</span>
                </article>
                <article>
                  <strong>{client.projects}</strong>
                  <span>Projects</span>
                </article>
              </div>

              <div className="client-card-footer">
                <span>{client.since}</span>
                <span className="client-rating"><Star size={12} /> {(client.engagement / 20).toFixed(1)}</span>
              </div>
            </button>
          );
        })}
      </section>

      {selectedClient ? (
        <div className="client-modal-overlay" onClick={() => setSelectedClientId(null)}>
          <section className="client-modal" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="client-modal-close"
              onClick={() => {
                setSelectedClientId(null);
                setSelectedClientTab('overview');
              }}
              aria-label="Close client details"
            >
              <X size={16} />
            </button>

            <header className="client-modal-head">
              <div className="client-modal-title">
                <span className={`client-avatar ${selectedClient.iconTone}`}>
                  {selectedClient.name
                    .split(' ')
                    .slice(0, 2)
                    .map((item) => item[0])
                    .join('')
                    .toUpperCase()}
                </span>
                <div>
                  <h3>{selectedClient.name}</h3>
                  <div className="client-modal-meta">
                    <span className={`client-status-pill ${selectedClient.statusTone}`}>{selectedClient.statusLabel.toLowerCase()}</span>
                    <small>{selectedClient.industry}</small>
                    <small>Joined {selectedClient.since}</small>
                  </div>
                </div>
              </div>
            </header>

            <div className="client-modal-tabs">
              <button type="button" className={selectedClientTab === 'overview' ? 'active' : ''} onClick={() => setSelectedClientTab('overview')}>Overview</button>
              <button type="button" className={selectedClientTab === 'analytics' ? 'active' : ''} onClick={() => setSelectedClientTab('analytics')}>Analytics</button>
              <button type="button" className={selectedClientTab === 'projects' ? 'active' : ''} onClick={() => setSelectedClientTab('projects')}>Projects</button>
            </div>

            {selectedClientTab === 'overview' ? (
              <>
                <section className="client-modal-stats">
                  <article>
                    <strong>{formatCurrency(selectedClient.mrr)}</strong>
                    <span>Total Revenue</span>
                  </article>
                  <article>
                    <strong className={selectedClient.engagement >= 60 ? 'good' : 'risk'}>{selectedClient.engagement}%</strong>
                    <span>Engagement</span>
                  </article>
                  <article>
                    <strong>{selectedClient.projects}</strong>
                    <span>Active Projects</span>
                  </article>
                  <article>
                    <strong>{(selectedClient.engagement / 20).toFixed(1)}</strong>
                    <span>Satisfaction</span>
                  </article>
                </section>

                <section className="client-modal-contact">
                  <h4>Contact Information</h4>
                  <div>
                    <p><Mail size={14} /> {selectedClient.contact.email}</p>
                    <p><Phone size={14} /> {selectedClient.contact.phone}</p>
                    <p><MapPin size={14} /> {selectedClient.contact.location}</p>
                    <p><User size={14} /> {selectedClient.contact.name}</p>
                    <p><CalendarDays size={14} /> Since {selectedClient.contact.since}</p>
                    <p>{selectedClient.accountStatus}</p>
                  </div>
                </section>

                <section className="client-modal-note">
                  <strong>Notes</strong>
                  <p>{selectedClient.note}</p>
                </section>
              </>
            ) : null}

            {selectedClientTab === 'analytics' ? (
              <section className="client-modal-analytics">
                <article className="analytics-split-card">
                  <div>
                    <p>Revenue</p>
                    <strong>{formatCurrency(selectedClient.mrr)}</strong>
                  </div>
                  <div>
                    <p>Engagement</p>
                    <strong className={selectedClient.engagement >= 60 ? 'good' : 'risk'}>{selectedClient.engagement}%</strong>
                  </div>
                  <div>
                    <p>Projects</p>
                    <strong>{selectedClient.projects}</strong>
                  </div>
                </article>

                <article className="analytics-list-card">
                  <h4>Billing History</h4>
                  <div className="analytics-list">
                    {selectedClient.billingHistory.map((item) => (
                      <div key={item.month} className="analytics-list-row">
                        <span>{item.month}</span>
                        <strong>{item.amount ? formatCurrency(item.amount) : '-'}</strong>
                        <em className={`billing-status ${item.status.toLowerCase()}`}>{item.status}</em>
                      </div>
                    ))}
                  </div>
                </article>
              </section>
            ) : null}

            {selectedClientTab === 'projects' ? (
              <section className="client-modal-projects">
                <article className="analytics-list-card">
                  <h4>Projects</h4>
                  <div className="client-project-list modal-project-list">
                    {selectedClient.projectList.length > 0 ? selectedClient.projectList.map((project) => (
                      <div key={project} className="client-project-item">
                        <BadgeDollarSign size={14} />
                        <span>{project}</span>
                      </div>
                    )) : <p className="empty-copy">No active projects assigned.</p>}
                  </div>
                </article>

                <article className="analytics-list-card">
                  <h4>Account Summary</h4>
                  <div className="client-modal-summary">
                    <p><strong>Manager:</strong> {selectedClient.accountManager}</p>
                    <p><strong>Status:</strong> {selectedClient.accountStatus}</p>
                    <p><strong>Industry:</strong> {selectedClient.industry}</p>
                  </div>
                </article>
              </section>
            ) : null}
          </section>
        </div>
      ) : null}
    </div>
  );
};

export default Clients;
