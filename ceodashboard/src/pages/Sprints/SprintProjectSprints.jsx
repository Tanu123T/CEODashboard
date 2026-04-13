import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './Sprints.css';
import {
  ArrowLeft,
  CalendarClock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { sprintProjects, sprintDetails, sprintDashboardData, memberRegistry } from './sprintData';
import SprintSummaryCards from '../../components/SprintSummaryCards';

const statusTone = (status) => {
  if (status === 'completed') return 'sprint-status-completed';
  if (status === 'active') return 'sprint-status-active';
  return 'sprint-status-upcoming';
};

const SprintProjectSprints = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { projectId } = useParams();
  const defaultProjectId = sprintProjects[0]?.id;
  const initialProjectId = sprintProjects.some((item) => item.id === projectId) ? projectId : defaultProjectId;
  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);
  const [selectedTab, setSelectedTab] = useState('all');
  const dropdownRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    if (projectId && sprintProjects.some((item) => item.id === projectId) && projectId !== selectedProjectId) {
      setSelectedProjectId(projectId);
    }
  }, [projectId, selectedProjectId]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const project = sprintProjects.find((item) => item.id === selectedProjectId);
  const details = project ? sprintDetails[project.id] : null;

  const sprintList = useMemo(() => {
    if (!details || !project) return [];
    let filtered = (details.sprints || []).filter((item) => item.subtitle === project.name);

    if (selectedTab !== 'all') {
      filtered = filtered.filter((item) => item.status === selectedTab);
    }

    return filtered;
  }, [details, project, selectedTab]);

  const teamMembers = useMemo(() => {
    if (!details?.board) {
      return [];
    }

    return [...new Set(details.board.map((item) => item.owner))];
  }, [details]);

  if (!project || !details) {
    return (
      <div className="dashboard-wrapper sprint-page">
        <header className="main-header">
          <div>
            <h1>Project Not Found</h1>
            <p>The requested project sprint collection was not found.</p>
          </div>
        </header>
        <button type="button" className="action-btn primary-btn" onClick={() => navigate('/sprints')}>
          <ArrowLeft size={16} /> Back To Sprint Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper sprint-project-page">
      <header className="sprint-project-header">
        <div>
          <p className="sprint-dashboard-eyebrow">Sprint Dashboard</p>
          <h1>{project.name}</h1>
          <p className="sprint-project-subtitle">Viewing: {project.name}</p>
        </div>
        <div className="sprint-dashboard-filter">
          <div className="sprint-project-dropdown" ref={dropdownRef}>
            <button
              className="sprint-project-select-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{project?.name || 'Select Project'}</span>
              <ChevronDown size={20} />
            </button>

            {isDropdownOpen && (
              <div className="sprint-project-dropdown-menu">
                {sprintProjects.map((item) => (
                  <button
                    key={item.id}
                    className={`sprint-project-dropdown-item ${selectedProjectId === item.id ? 'active' : ''}`}
                    onClick={() => {
                      setSelectedProjectId(item.id);
                      setIsDropdownOpen(false);
                      navigate(`/sprints/${item.id}`);
                    }}
                  >
                    <span className="sprint-project-dot" style={{ backgroundColor: '#6b7280' }} />
                    <span>{item.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <SprintSummaryCards metrics={sprintDashboardData.metrics} />

      <section className="sprint-detail-team-row">
        <p className="sprint-summary-label">Team</p>
        <div className="sprint-detail-team-chips">
          {teamMembers.map((owner) => {
            const memberInfo = memberRegistry[owner] || { fullName: owner, role: 'Team Member' };
            return (
              <button
                key={owner}
                type="button"
                className="sprint-team-chip"
                onClick={() =>
                  navigate(`/sprints/member/${encodeURIComponent(owner)}`, {
                    state: { from: location.pathname, projectId: project.id, sprintId: project.sprint },
                  })
                }
              >
                <span>{owner.split(' ').map((part) => part[0]).join('')}</span>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', textAlign: 'left' }}>
                  <strong>{memberInfo.fullName}</strong>
                  <small style={{ fontSize: '11px', color: '#666' }}>{memberInfo.role}</small>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      <div className="sprint-tabs-container">
        <div className="sprint-tabs">
          {[
            { key: 'all', label: 'All Sprints' },
            { key: 'active', label: 'Active' },
            { key: 'completed', label: 'Completed' },
          ].map((tab) => (
            <button
              key={tab.key}
              className={`sprint-tab ${selectedTab === tab.key ? 'active' : ''}`}
              onClick={() => setSelectedTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <article className="sprint-panel sprint-sprints-panel">
        <div className="sprint-section-header">
          <h2>Sprints ({sprintList.length})</h2>
        </div>
        <div className="sprint-card-grid">
          {sprintList.map((item) => (
            <button
              key={item.id}
              type="button"
              className="sprint-card"
              onClick={() => navigate(`/sprints/${selectedProjectId}/${item.id}`)}
            >
              <div className="sprint-card-header">
                <div>
                  <strong>{item.id} — {item.title}</strong>
                  <p>{item.subtitle}</p>
                </div>
                <span className={`sprint-pill ${statusTone(item.status)}`}>{item.status}</span>
              </div>
              <div className="sprint-card-progress-row">
                <span>Progress</span>
                <span>{item.progress}%</span>
              </div>
              <div className="sprint-progress-bar">
                <div className="sprint-progress-fill" style={{ width: `${item.progress}%` }} />
              </div>
              <div className="sprint-card-footer">
                <span><CalendarClock size={14} /> {project.startDate} – {project.endDate}</span>
                <span className="sprint-card-link">{item.tasks} • <ChevronRight size={16} /></span>
              </div>
            </button>
          ))}
        </div>
      </article>
    </div>
  );
};

export default SprintProjectSprints;
