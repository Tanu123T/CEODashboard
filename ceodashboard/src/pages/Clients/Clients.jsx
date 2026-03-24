import React, { useMemo, useState } from 'react';
import './Clients.css';
import '../Project/Project.css';
import '../Employees/Employees.css';
import {
  Search,
  ArrowUpDown,
  Smile,
  CircleDollarSign,
  ChevronDown,
  ChevronUp,
  Building2,
  Inbox,
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PageLoader from '../../components/common/PageLoader';
import useSortableData from '../../hooks/useSortableData';
import useSimulatedLoading from '../../hooks/useSimulatedLoading';
import { clients } from '../../data/clientsData';

const STATUS_FILTERS = ['All', 'Active', 'Converted'];

const Clients = () => {
  const isLoading = useSimulatedLoading(650);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const filteredClients = useMemo(() => {
    return clients.filter((client) => {
      const matchesSearch =
        client.name.toLowerCase().includes(search.toLowerCase()) ||
        client.industry.toLowerCase().includes(search.toLowerCase()) ||
        client.accountManager.toLowerCase().includes(search.toLowerCase());

      const matchesStatus = statusFilter === 'All' || client.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const { sortedItems: sortedClients, sortConfig, requestSort } = useSortableData(filteredClients, {
    key: 'satisfaction',
    direction: 'desc',
  });

  const overduePayments = clients.filter((client) => client.paymentStatus !== 'On Time').length;

  const sortLabel = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={13} />;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return <PageLoader title="Loading Client Overview..." />;
  }

  return (
    <div className="dashboard-wrapper">
      <header className="main-header">
        <div>
          <h1>Client Overview</h1>
          <p>Manage client records, account status, and payment follow-ups.</p>
        </div>
      </header>

      <section className="table-container">
        <div className="table-header-row project-toolbar-row">
          <h2 className="section-title" style={{ margin: 0 }}>Client Portfolio Register</h2>
          <div className="project-toolbar-controls">
            <div className="project-search-inline">
              <Search size={15} />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by client, industry, or account manager"
              />
            </div>
            <div className="project-filter-chips">
              {STATUS_FILTERS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`filter-chip ${statusFilter === option ? 'active' : ''}`}
                  onClick={() => setStatusFilter(option)}
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
                <th onClick={() => requestSort('name')} className="sortable-head">Client {sortLabel('name')}</th>
                <th onClick={() => requestSort('industry')} className="sortable-head">Industry {sortLabel('industry')}</th>
                <th onClick={() => requestSort('accountManager')} className="sortable-head">Manager {sortLabel('accountManager')}</th>
                <th onClick={() => requestSort('status')} className="sortable-head">Status {sortLabel('status')}</th>
                <th onClick={() => requestSort('satisfaction')} className="sortable-head">Satisfaction {sortLabel('satisfaction')}</th>
                <th onClick={() => requestSort('projects')} className="sortable-head">Projects {sortLabel('projects')}</th>
                <th onClick={() => requestSort('mrr')} className="sortable-head">MRR (INR Cr) {sortLabel('mrr')}</th>
                <th onClick={() => requestSort('paymentStatus')} className="sortable-head">Payment {sortLabel('paymentStatus')}</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedClients.map((client) => (
                <React.Fragment key={client.id}>
                  <tr>
                    <td className="font-bold">{client.name}</td>
                    <td>{client.industry}</td>
                    <td>{client.accountManager}</td>
                    <td>
                      <span className={`status-badge status-${client.status.toLowerCase()}`}>
                        {client.status}
                      </span>
                    </td>
                    <td>{client.satisfaction}/5</td>
                    <td>{client.projects}</td>
                    <td>{client.mrr}</td>
                    <td>
                      <span className={`payment-badge payment-${client.paymentStatus.toLowerCase().replace(' ', '-')}`}>
                        {client.paymentStatus}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn details-btn"
                        style={{ opacity: 1, transform: 'scale(1)' }}
                        onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                      >
                        {expandedId === client.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>
                  {expandedId === client.id ? (
                    <tr className="project-detail-row">
                      <td colSpan="9">
                        <div className="project-detail-card">
                          <p><strong>Renewal Date:</strong> {new Date(client.renewalDate).toLocaleDateString('en-IN')}</p>
                          <p><strong>Last Touchpoint:</strong> {new Date(client.lastTouchpoint).toLocaleDateString('en-IN')}</p>
                          <p><strong>Payment Observation:</strong> {client.paymentStatus}</p>
                          <p><strong>Portfolio Summary:</strong> {client.projects} projects under management with {client.satisfaction}/5 satisfaction score.</p>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {sortedClients.length === 0 ? (
          <EmptyState
            title="No clients found"
            description="Adjust your search or status filter to view client portfolio records."
          />
        ) : null}
      </section>

      <section className="info-card">
        <h3><Building2 size={17} /> Client Summary Notes</h3>
        <ul className="icon-list">
          <li>
            <div className="list-main">
              <Smile className="list-icon" size={16} />
              <div>
                <p className="list-title">Satisfaction Stability</p>
                <p className="list-subtitle">Current average remains above 4.4 over the last quarter.</p>
              </div>
            </div>
          </li>
          <li>
            <div className="list-main">
              <Inbox className="list-icon" size={16} />
              <div>
                <p className="list-title">Payment Monitoring</p>
                <p className="list-subtitle">{overduePayments} accounts require payment follow-up this cycle.</p>
              </div>
            </div>
          </li>
        </ul>
      </section>
    </div>
  );
};

export default Clients;
