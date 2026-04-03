import React, { useMemo, useState } from 'react';
import './Clients.css';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  CalendarDays,
  Circle,
  FileText,
  Handshake,
  IndianRupee,
  Mail,
  MapPin,
  Phone,
  User,
} from 'lucide-react';
import PageLoader from '../../components/common/PageLoader';
import useSimulatedLoading from '../../hooks/useSimulatedLoading';
import { clients } from '../../data/clientsData';

const formatCurrency = (value) => {
  if (!value) return '-';
  return `₹${value.toLocaleString('en-IN')}`;
};

const ringColor = (tone) => {
  if (tone === 'good') return '#29c16f';
  if (tone === 'warning') return '#f2b12b';
  if (tone === 'risk') return '#ef5c5c';
  return '#4b8ef7';
};

const BriefcaseIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M3.5 8.5A2.5 2.5 0 0 1 6 6h12a2.5 2.5 0 0 1 2.5 2.5v8A2.5 2.5 0 0 1 18 19H6a2.5 2.5 0 0 1-2.5-2.5v-8Z" stroke="currentColor" strokeWidth="1.6" />
    <path d="M8.5 6V5a1.5 1.5 0 0 1 1.5-1.5h4A1.5 1.5 0 0 1 15.5 5v1" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const Clients = () => {
  const isLoading = useSimulatedLoading(650);
  const [selectedClientId, setSelectedClientId] = useState(null);

  const totalMrr = useMemo(() => clients.reduce((sum, client) => sum + (client.mrr || 0), 0), []);
  const activeClients = useMemo(() => clients.filter((client) => client.isActive).length, []);

  const selectedClient = useMemo(
    () => clients.find((client) => client.id === selectedClientId) || null,
    [selectedClientId]
  );

  if (isLoading) {
    return <PageLoader title="Loading Client Overview..." />;
  }

  if (selectedClient) {
    const radius = 72;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(100, selectedClient.engagement));
    const dashOffset = circumference - (progress / 100) * circumference;

    return (
      <div className="clients-page clients-detail-page">
        <button
          type="button"
          className="clients-back"
          onClick={() => setSelectedClientId(null)}
        >
          <ArrowLeft size={18} />
          <span>Back to Clients</span>
        </button>

        <section className="client-hero">
          <div className="client-hero-top-bar" />
          <div className="client-hero-content">
            <div>
              <h1>{selectedClient.name}</h1>
              <p>{selectedClient.industry}</p>
            </div>
            <span className={`client-status-pill ${selectedClient.statusTone}`}>
              <Circle size={9} fill="currentColor" />
              {selectedClient.statusLabel}
            </span>
          </div>

          <div className="client-stats-grid">
            <article className="client-stat-card">
              <p>MRR</p>
              <h3>{formatCurrency(selectedClient.mrr)}</h3>
            </article>
            <article className="client-stat-card">
              <p>PROJECTS</p>
              <h3>{selectedClient.projects}</h3>
            </article>
            <article className="client-stat-card">
              <p>STATUS</p>
              <h3>{selectedClient.accountStatus}</h3>
            </article>
            <article className="client-stat-card">
              <p>ACCOUNT MANAGER</p>
              <h3>{selectedClient.accountManager}</h3>
            </article>
          </div>
        </section>

        <section className="client-detail-grid top">
          <article className="client-panel client-engagement-panel">
            <div className="engagement-ring-wrap">
              <svg viewBox="0 0 200 200" className="engagement-ring" aria-label="Engagement score">
                <circle cx="100" cy="100" r={radius} className="engagement-ring-track" />
                <circle
                  cx="100"
                  cy="100"
                  r={radius}
                  className="engagement-ring-progress"
                  style={{
                    stroke: ringColor(selectedClient.statusTone),
                    strokeDasharray: circumference,
                    strokeDashoffset: dashOffset,
                  }}
                />
              </svg>
              <div className="engagement-copy">
                <strong>{selectedClient.engagement}%</strong>
                <span>Engagement</span>
              </div>
            </div>
          </article>

          <article className="client-panel">
            <h3>ABOUT</h3>
            <p className="client-about-text">{selectedClient.about}</p>

            <h3 className="client-contact-title">CONTACT DETAILS</h3>
            <div className="client-contact-grid">
              <div><User size={18} /> Contact</div>
              <strong>{selectedClient.contact.name}</strong>

              <div><Mail size={18} /> Email</div>
              <strong>{selectedClient.contact.email}</strong>

              <div><Phone size={18} /> Phone</div>
              <strong>{selectedClient.contact.phone}</strong>

              <div><MapPin size={18} /> Location</div>
              <strong>{selectedClient.contact.location}</strong>

              <div><CalendarDays size={18} /> Since</div>
              <strong>{selectedClient.contact.since}</strong>
            </div>
          </article>
        </section>

        <section className="client-detail-grid bottom">
          <article className="client-panel">
            <h3>PROJECTS</h3>
            <div className="client-project-list">
              {selectedClient.projectList.map((project) => (
                <div key={project} className="client-project-item">
                  <BriefcaseIcon />
                  <span>{project}</span>
                </div>
              ))}
            </div>
          </article>

          <article className="client-panel">
            <h3>BILLING HISTORY</h3>
            <table className="billing-table">
              <thead>
                <tr>
                  <th>Month</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {selectedClient.billingHistory.map((item) => (
                  <tr key={item.month}>
                    <td>{item.month}</td>
                    <td>{item.amount ? formatCurrency(item.amount) : '-'}</td>
                    <td>
                      <span className={`billing-status ${item.status.toLowerCase()}`}>{item.status}</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </article>
        </section>

        <section className="client-note-box">
          <p>
            <FileText size={18} />
            <strong>NOTES</strong>
          </p>
          <span>{selectedClient.note}</span>
        </section>
      </div>
    );
  }

  return (
    <div className="clients-page">
      <header className="clients-header">
        <div>
          <h1>Clients</h1>
          <p>Client relationships and engagement health</p>
        </div>
      </header>

      <section className="clients-kpi-grid">
        <article className="clients-kpi-card">
          <span className="clients-kpi-icon blue"><Handshake size={20} /></span>
          <div>
            <p>Total Clients</p>
            <h3>{clients.length}</h3>
          </div>
        </article>
        <article className="clients-kpi-card">
          <span className="clients-kpi-icon green"><Building2 size={20} /></span>
          <div>
            <p>Active Clients</p>
            <h3>{activeClients}</h3>
          </div>
        </article>
        <article className="clients-kpi-card">
          <span className="clients-kpi-icon teal"><IndianRupee size={20} /></span>
          <div>
            <p>Total MRR</p>
            <h3>{formatCurrency(totalMrr)}</h3>
          </div>
        </article>
      </section>

      <section className="clients-list-wrap">
        {clients.map((client) => (
          <button
            key={client.id}
            type="button"
            className="client-row"
            onClick={() => setSelectedClientId(client.id)}
          >
            <div className="client-left">
              <span className={`client-logo ${client.iconTone}`}><Handshake size={18} /></span>
              <div>
                <h3>
                  {client.name}
                  <span className={`client-status-pill ${client.statusTone}`}>
                    <Circle size={8} fill="currentColor" />
                    {client.statusLabel}
                  </span>
                </h3>
                <p>{client.industry} - Since {client.since}</p>
              </div>
            </div>

            <div className="client-right">
              <div>
                <small>Engagement</small>
                <div className="engagement-inline">
                  <div className="engagement-track">
                    <span
                      className={`engagement-fill ${client.statusTone}`}
                      style={{ width: `${client.engagement}%` }}
                    />
                  </div>
                  <strong className={client.statusTone}>{client.engagement}%</strong>
                </div>
              </div>
              <div className="client-mrr-wrap">
                <strong>{formatCurrency(client.mrr)}</strong>
                <span>{client.projects} projects</span>
              </div>
              <ArrowRight size={18} />
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

export default Clients;
