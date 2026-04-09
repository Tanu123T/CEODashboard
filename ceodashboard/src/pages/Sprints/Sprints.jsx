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
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  ComposedChart,
  Line,
  Area,
  AreaChart,
} from 'recharts';
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

  const filteredSprintProgress = useMemo(() => {
    if (projectFilter === 'all') {
      // Show all sprints across all projects
      const allSprints = [];
      for (const projectKey in sprintDetails) {
        const projectSprints = sprintDetails[projectKey].sprints || [];
        allSprints.push(...projectSprints.map(sprint => ({
          ...sprint,
          name: `${sprint.id} — ${sprint.title}`,
          completed: sprint.progress,
          target: 100,
        })));
      }
      return allSprints;
    } else {
      // Show sprints for selected project
      const projectSprints = sprintDetails[projectFilter]?.sprints || [];
      return projectSprints.map(sprint => ({
        ...sprint,
        name: `${sprint.id} — ${sprint.title}`,
        completed: sprint.progress,
        target: 100,
      }));
    }
  }, [projectFilter]);

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
        <article className="sprint-panel sprint-progress-card">
          <div className="sprint-panel-heading">
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <TrendingUp size={24} style={{ color: '#3b82f6' }} />
                <div>
                  <h2>Sprint Progress</h2>
                  <p className="sprint-panel-copy">Completion progress for {projectFilter === 'all' ? 'all sprints' : 'all sprints of this project'}</p>
                </div>
              </div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={340}>
            <ComposedChart
              layout="vertical"
              data={filteredSprintProgress}
              margin={{ top: 20, right: 80, bottom: 20, left: 240 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis 
                dataKey="name" 
                type="category" 
                tick={{ fontSize: 12, fill: '#1f2937', fontWeight: 500 }}
                width={230}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#ffffff',
                  border: '2px solid #cbd5e1',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
                }}
                formatter={(value) => `${value}%`}
                labelFormatter={(label) => label}
              />
              <Bar dataKey="target" fill="#f3f4f6" radius={[0, 6, 6, 0]} name="Target (100%)" />
              <Bar 
                dataKey="completed" 
                radius={[0, 6, 6, 0]}
                name="Completed"
              >
                {filteredSprintProgress.map((entry, index) => {
                  const colors = ['#38bdf8', '#18b7a6', '#22c55e', '#0ea5e9', '#06b6d4', '#f59e0b', '#ef4444', '#8b5cf6'];
                  return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />;
                })}
              </Bar>
              <Legend wrapperStyle={{ paddingTop: '12px' }} />
            </ComposedChart>
          </ResponsiveContainer>
          <div style={{ marginTop: '16px', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
            <div style={{ padding: '12px', backgroundColor: '#cffafe', borderRadius: '12px', border: '1px solid #a5f3fc' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#0369a1', fontWeight: 700 }}>TOTAL PLANNED SPRINTS</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#164e63', fontWeight: 600 }}>{filteredSprintProgress.length}</p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>This {projectFilter === 'all' ? 'dashboard' : 'project'}</p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#ccfbf1', borderRadius: '12px', border: '1px solid #99f6e4' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#0d9488', fontWeight: 700 }}>AVG PROGRESS</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#134e4a', fontWeight: 600 }}>{filteredSprintProgress.length > 0 ? Math.round(filteredSprintProgress.reduce((sum, s) => sum + s.completed, 0) / filteredSprintProgress.length) : 0}%</p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>Average completion</p>
            </div>
            <div style={{ padding: '12px', backgroundColor: '#dcfce7', borderRadius: '12px', border: '1px solid #bbf7d0' }}>
              <p style={{ margin: '0 0 6px 0', fontSize: '12px', color: '#15803d', fontWeight: 700 }}>COMPLETED</p>
              <p style={{ margin: 0, fontSize: '14px', color: '#166534', fontWeight: 600 }}>{filteredSprintProgress.filter(s => s.completed === 100).length}</p>
              <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#64748b' }}>100% complete</p>
            </div>
          </div>
        </article>

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
