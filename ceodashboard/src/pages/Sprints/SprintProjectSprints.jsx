import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Sprints.css';
import {
  ArrowLeft,
  CalendarClock,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
//

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
} from 'recharts';
import { sprintProjects, sprintDetails, sprintDashboardData } from './sprintData';
import SprintSummaryCards from '../../components/SprintSummaryCards';

const statusTone = (status) => {
  if (status === 'completed') return 'sprint-status-completed';
  if (status === 'active') return 'sprint-status-active';
  return 'sprint-status-upcoming';
};

const SprintProjectSprints = () => {
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

  const progressData = details?.burndown || [];

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
      <section className="sprint-project-main-grid">
        <article className="sprint-panel sprint-progress-large-card">
          <div className="sprint-panel-heading sprint-progress-panel-heading">
            <div>
              <h2>Sprint Progress</h2>
              <p>All sprints combined</p>
            </div>
            <button type="button" className="sprint-panel-select">All Sprints</button>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={progressData} margin={{ top: 24, right: 20, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="progressGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9eef4" vertical={false} />
              <XAxis dataKey="sprintLabel" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 'dataMax + 10']} />
              <Tooltip
                contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }}
                formatter={(value) => [`${value}%`, 'Progress']}
              />
              <Area type="monotone" dataKey="progress" stroke="#3b82f6" strokeWidth={3} fill="url(#progressGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </article>

      </section>
    </div>
  );
};

export default SprintProjectSprints;
