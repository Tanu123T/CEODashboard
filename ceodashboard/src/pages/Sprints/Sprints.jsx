import React, { useMemo, useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sprints.css';
import {
  ArrowRight,
  Activity,
  AlertTriangle,
  CheckCircle2,
  Clock3,
  TrendingUp,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { sprintDashboardData } from './sprintData';
import PageLoader from '../../components/common/PageLoader';
import useSimulatedLoading from '../../hooks/useSimulatedLoading';

const metricIcons = {
  'Total Planned Sprints': <Activity size={22} />,
  'Active': <Clock3 size={22} />,
  'Completed': <CheckCircle2 size={22} />,
  'Avg. Completion': <TrendingUp size={22} />,
};

const statusClass = {
  active: 'sprint-status-active',
  completed: 'sprint-status-completed',
  upcoming: 'sprint-status-upcoming',
};

const statusColors = {
  active: '#06b6d4',
  completed: '#4f46e5',
  upcoming: '#f59e0b',
};

const getProgressTone = (progress) => {
  if (progress >= 67) return 'progress-high';
  if (progress >= 34) return 'progress-medium';
  return 'progress-low';
};

const Sprints = () => {
  const isLoading = useSimulatedLoading(600);
  const navigate = useNavigate();
  const [projectFilter, setProjectFilter] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [sprintTab, setSprintTab] = useState('all');

  const getProjectColor = (projectId) => {
    const colors = {
      'all': '#6b7280',
      'data-analytics-engine': '#f59e0b',
      'platform-api-v3': '#06b6d4',
      'mobile-app-redesign': '#3b82f6',
    };
    return colors[projectId] || '#6b7280';
  };

  const getProjectLabel = (projectId) => {
    const project = sprintDashboardData.projects.find((p) => p.id === projectId);
    return project ? project.label : 'All Projects';
  };

  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const filteredDeadlines = useMemo(() => {
    if (projectFilter === 'all') return sprintDashboardData.upcomingDeadlines;
    return sprintDashboardData.upcomingDeadlines.filter((item) => item.projectId === projectFilter);
  }, [projectFilter]);

  const filteredActivity = useMemo(() => {
    if (projectFilter === 'all') return sprintDashboardData.activity;
    return sprintDashboardData.activity.filter((item) => item.projectId === projectFilter);
  }, [projectFilter]);

  const filteredActivityByTab = useMemo(() => {
    if (sprintTab === 'all') return filteredActivity;
    return filteredActivity.filter((item) => item.status === sprintTab);
  }, [filteredActivity, sprintTab]);

  if (isLoading) {
    return <PageLoader title="Loading Sprint Dashboard..." />;
  }

  return (
    <div className="dashboard-wrapper sprint-dashboard-page">
      <header className="main-header sprint-dashboard-header">
        <div>
          <p className="sprint-dashboard-eyebrow">Sprint Dashboard</p>
          <h1>Executive overview across all projects</h1>
        </div>
        <div className="sprint-dashboard-filter">
          <div className="sprint-project-dropdown" ref={dropdownRef}>
            <button
              className="sprint-project-select-button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span>{getProjectLabel(projectFilter)}</span>
              <ChevronDown size={20} />
            </button>

            {isDropdownOpen && (
              <div className="sprint-project-dropdown-menu">
                {sprintDashboardData.projects.map((project) => (
                  <button
                    key={project.id}
                    className={`sprint-project-dropdown-item ${projectFilter === project.id ? 'active' : ''}`}
                    onClick={() => {
                      setProjectFilter(project.id);
                      setIsDropdownOpen(false);
                      navigate(project.id === 'all' ? '/sprints' : `/sprints/${project.id}`);
                    }}
                  >
                    <span
                      className="sprint-project-dot"
                      style={{ backgroundColor: getProjectColor(project.id) }}
                    />
                    <span>{project.label}</span>
                    {projectFilter === project.id && <CheckCircle2 size={18} />}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      <section className="sprint-metrics-grid">
        {sprintDashboardData.metrics.map((item) => (
          <article key={item.label} className="sprint-stat-card">
            <div className="sprint-stat-card-body">
              <div className="sprint-stat-card-content">
                <p>{item.label}</p>
                <h2>{item.value}</h2>
              </div>
              <span className="sprint-stat-icon">{metricIcons[item.label]}</span>
            </div>
          </article>
        ))}
      </section>

      <section className="sprint-dashboard-main-grid">
        <article className="sprint-panel sprint-upcoming-card">
          <div className="sprint-panel-heading">
            <div className="sprint-panel-heading-top">
              <Calendar size={18} />
              <h2>Upcoming Deadlines</h2>
            </div>
          </div>
          <div className="sprint-upcoming-list">
            {filteredDeadlines.map((item) => (
              <div key={item.id} className="sprint-upcoming-item">
                <div className="sprint-upcoming-item-content">
                  <div className="sprint-upcoming-item-border" style={{ borderLeftColor: statusColors[item.status] }} />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.subtitle}</p>
                  </div>
                </div>
                <span className={`sprint-upcoming-badge ${statusClass[item.status]}`}>{item.due}</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <article className="sprint-panel sprint-activity-panel">
        <div className="sprint-panel-heading sprint-activity-heading">
          <h2>Sprints</h2>
          <span>({filteredActivityByTab.length})</span>
        </div>

        <div className="sprint-tabs-container">
          <button 
            className={`sprint-tab ${sprintTab === 'all' ? 'active' : ''}`}
            onClick={() => setSprintTab('all')}
          >
            All Sprints
          </button>
          <button 
            className={`sprint-tab ${sprintTab === 'active' ? 'active' : ''}`}
            onClick={() => setSprintTab('active')}
          >
            Active
          </button>
          <button 
            className={`sprint-tab ${sprintTab === 'completed' ? 'active' : ''}`}
            onClick={() => setSprintTab('completed')}
          >
            Completed
          </button>
        </div>

        <div className="sprint-activity-list">
          {filteredActivityByTab.map((item) => (
            <button
              key={item.id}
              type="button"
              className="sprint-activity-row sprint-activity-button"
              onClick={() => {
                const sprintId = item.title.split(' — ')[0];
                navigate(`/sprints/${item.projectId}/${sprintId}`);
              }}
            >
              <div className="sprint-activity-left">
                <span className={`sprint-activity-dot ${statusClass[item.status]}`} />
                <div className="sprint-activity-content">
                  <strong>{item.title}</strong>
                  <p>{item.subtitle}</p>
                </div>
              </div>

              <span className={`sprint-activity-pill ${statusClass[item.status]}`}>{item.status}</span>

              <div className="sprint-activity-progress-section">
                <span className="sprint-progress-label">Progress</span>
                <div className="sprint-activity-progress-bar">
                  <div className={`sprint-activity-progress-fill ${getProgressTone(item.progress)}`} style={{ width: `${item.progress}%` }} />
                </div>
              </div>

              <span className="sprint-activity-percentage">{item.progress}%</span>

              <div className="sprint-activity-tasks-section">
                <span className="sprint-activity-tasks">{item.tasks} tasks done</span>
                <ArrowRight size={16} className="sprint-activity-arrow" />
              </div>
            </button>
          ))}
        </div>
      </article>
    </div>
  );
};

export default Sprints;
