import React, { useMemo, useState } from 'react';
import './Project.css';
import {
  BriefcaseBusiness,
  CheckCircle2,
  Search,
  Users2,
  Building2,
  CalendarDays,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
  ArrowUpDown,
  FolderSearch,
} from 'lucide-react';
import '../Employees/Employees.css';
import EmptyState from '../../components/common/EmptyState';
import PageLoader from '../../components/common/PageLoader';
import useSortableData from '../../hooks/useSortableData';
import useSimulatedLoading from '../../hooks/useSimulatedLoading';
import { projectRecords } from '../../data/projectsData';

const STATUS_OPTIONS = ['All', 'Active', 'Ongoing', 'Completed'];

const formatDate = (isoDate) => {
  return new Date(isoDate).toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
};

const Projects = () => {
  const isLoading = useSimulatedLoading(650);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedProjectId, setExpandedProjectId] = useState(null);

  const filteredProjects = useMemo(() => {
    return projectRecords.filter((project) => {
      const matchesSearch =
        project.name.toLowerCase().includes(search.toLowerCase()) ||
        project.client.toLowerCase().includes(search.toLowerCase()) ||
        project.manager.toLowerCase().includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === 'All' || project.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const { sortedItems: sortedProjects, sortConfig, requestSort } = useSortableData(filteredProjects, {
    key: 'deadline',
    direction: 'asc',
  });

  const sortLabel = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={13} />;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return <PageLoader title="Loading Project Overview..." />;
  }

  return (
    <div className="dashboard-wrapper">
      <header className="main-header">
        <div>
          <h1>Project Overview</h1>
          <p>Manage projects, owners, timelines, and delivery risk from one register.</p>
        </div>
        <div className="header-status">
          <CheckCircle2 className="sync-icon" size={16} /> Live overview refreshed now
        </div>
      </header>

      <section className="table-container">
        <div className="table-header-row project-toolbar-row">
          <h2 className="section-title" style={{ margin: 0 }}>Project Register</h2>
          <div className="project-toolbar-controls">
            <div className="project-search-inline">
              <Search size={15} />
              <input
                type="text"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search by project, client, or manager"
              />
            </div>
            <div className="project-filter-chips">
              {STATUS_OPTIONS.map((option) => (
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
                <th onClick={() => requestSort('name')} className="sortable-head">Project {sortLabel('name')}</th>
                <th onClick={() => requestSort('client')} className="sortable-head">Client {sortLabel('client')}</th>
                <th onClick={() => requestSort('manager')} className="sortable-head">Manager {sortLabel('manager')}</th>
                <th>Team</th>
                <th onClick={() => requestSort('status')} className="sortable-head">Status {sortLabel('status')}</th>
                <th onClick={() => requestSort('startDate')} className="sortable-head">Start Date {sortLabel('startDate')}</th>
                <th onClick={() => requestSort('deadline')} className="sortable-head">Deadline {sortLabel('deadline')}</th>
                <th onClick={() => requestSort('progress')} className="sortable-head">Progress {sortLabel('progress')}</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedProjects.map((project) => (
                <React.Fragment key={project.id}>
                  <tr>
                    <td className="font-bold">{project.name}</td>
                    <td className="client-cell"><Building2 className="row-icon" size={15} />{project.client}</td>
                    <td>{project.manager}</td>
                    <td className="team-lead-cell"><Users2 className="row-icon" size={15} />{project.teamMembers.length} members</td>
                    <td>
                      <span className={`status-badge status-${project.status.toLowerCase()}`}>
                        {project.status}
                      </span>
                    </td>
                    <td className="date-cell"><CalendarDays className="row-icon" size={14} />{formatDate(project.startDate)}</td>
                    <td className="date-cell">{formatDate(project.deadline)}</td>
                    <td>
                      <div className="prog-bar-bg">
                        <div className="prog-bar-fill" style={{ width: `${project.progress}%`, background: 'linear-gradient(95deg, #38bdf8 0%, #22c55e 100%)' }} />
                      </div>
                      <small>{project.progress}%</small>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn details-btn"
                        onClick={() => setExpandedProjectId(expandedProjectId === project.id ? null : project.id)}
                        style={{ opacity: 1, transform: 'scale(1)' }}
                      >
                        {expandedProjectId === project.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>
                  {expandedProjectId === project.id ? (
                    <tr className="project-detail-row">
                      <td colSpan="9">
                        <div className="project-detail-card">
                          <p><strong>Milestone:</strong> {project.milestone}</p>
                          <p><strong>Risk Level:</strong> {project.riskLevel}</p>
                          <p><strong>Budget:</strong> INR {project.budget}Cr | <strong>Spent:</strong> INR {project.spent}Cr</p>
                          <p><strong>Team Members:</strong> {project.teamMembers.join(', ')}</p>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {sortedProjects.length === 0 ? (
          <EmptyState
            title="No projects match your filter"
            description="Try changing the status filter or search term to view project data."
          />
        ) : null}
      </section>

      <section className="main-content-grid">
        <article className="info-card">
          <h3><CalendarDays size={17} /> Upcoming Deadlines</h3>
          <ul className="icon-list">
            {projectRecords
              .slice()
              .sort((a, b) => Date.parse(a.deadline) - Date.parse(b.deadline))
              .slice(0, 4)
              .map((item) => (
                <li key={item.id}>
                  <div className="list-main">
                    <BriefcaseBusiness className="list-icon" size={16} />
                    <div>
                      <p className="list-title">{item.name}</p>
                      <p className="list-subtitle">{item.status} | {item.client}</p>
                    </div>
                  </div>
                  <strong>{formatDate(item.deadline)}</strong>
                </li>
              ))}
          </ul>
        </article>

        <article className="info-card attention">
          <h3><AlertTriangle size={17} className="critical-icon" /> Immediate Attention</h3>
          <ul className="icon-list">
            {projectRecords
              .filter((item) => item.riskLevel === 'High')
              .map((item) => (
                <li key={item.id}>
                  <div className="list-main">
                    <FolderSearch className="list-icon" size={16} />
                    <div>
                      <p className="list-title">{item.name}</p>
                      <p className="list-subtitle">Manager: {item.manager}</p>
                    </div>
                  </div>
                  <strong>{item.riskLevel}</strong>
                </li>
              ))}
          </ul>
        </article>
      </section>
    </div>
  );
};

export default Projects;