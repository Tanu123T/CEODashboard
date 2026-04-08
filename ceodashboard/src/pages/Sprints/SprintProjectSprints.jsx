import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Sprints.css';
import {
  ArrowLeft,
  ArrowUpRight,
  BarChart3,
  CalendarClock,
  ChevronRight,
  Circle,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';
import { sprintProjects, sprintDetails } from './sprintData';

const statusTone = (status) => {
  if (status === 'completed') return 'sprint-status-completed';
  if (status === 'active') return 'sprint-status-active';
  if (status === 'delayed') return 'sprint-status-delayed';
  return 'sprint-status-upcoming';
};

const SprintProjectSprints = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const project = sprintProjects.find((item) => item.id === projectId);
  const details = project ? sprintDetails[project.id] : null;

  const sprintList = useMemo(() => {
    if (!details) return [];
    return (details.sprints || []).filter((item) => item.subtitle === project.name);
  }, [details, project]);

  const summaryCards = useMemo(() => {
    if (!details) return [];
    return [
      { label: 'Total Tasks', value: '13', icon: <Circle size={20} />, tone: 'blue' },
      { label: 'Completed', value: '4', icon: <Circle size={20} />, tone: 'green' },
      { label: 'In Progress', value: '3', icon: <Circle size={20} />, tone: 'orange' },
      { label: 'Pending', value: '6', icon: <Circle size={20} />, tone: 'purple' },
      { label: 'Avg Duration', value: '14d', icon: <BarChart3 size={20} />, tone: 'indigo' },
      { label: 'Team Utilization', value: '33%', icon: <ArrowUpRight size={20} />, tone: 'red' },
    ];
  }, [details]);

  const progressData = details?.burndown || [];
  const completionTrend = details?.velocity?.map((item) => ({ sprint: item.sprint, completed: item.completed })) || [];
  const taskSplit = details?.workSplit || [];
  const teamWorkload = details?.capacity || [];

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
        <button type="button" className="sprint-project-action" onClick={() => navigate('/sprints')}>
          <span className="sprint-project-dot sprint-project-dot-filled" />
          {project.name}
          <ChevronRight size={16} />
        </button>
      </header>

      <section className="sprint-kpi-grid">
        {summaryCards.map((card) => (
          <article key={card.label} className="sprint-kpi-card">
            <div>
              <p>{card.label}</p>
              <h2>{card.value}</h2>
            </div>
            <div className={`sprint-kpi-icon sprint-kpi-${card.tone}`}>{card.icon}</div>
          </article>
        ))}
      </section>

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
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} domain={[0, 'dataMax + 10']} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
              <Area type="monotone" dataKey="actual" stroke="#3b82f6" strokeWidth={3} fill="url(#progressGradient)" />
            </AreaChart>
          </ResponsiveContainer>
        </article>

        <article className="sprint-panel sprint-workload-card">
          <div className="sprint-panel-heading">
            <h2>Team Workload</h2>
          </div>
          <div className="team-workload-list">
            {teamWorkload.map((member) => {
              const used = parseInt(member.utilization, 10);
              return (
                <div key={member.team} className="team-workload-row">
                  <div>
                    <p className="team-workload-name">{member.team}</p>
                    <span>{member.members} / {member.capacity}</span>
                  </div>
                  <div className="team-workload-progress">
                    <div className="team-workload-bar">
                      <div className="team-workload-fill" style={{ width: `${used}%` }} />
                    </div>
                    <span>{member.utilization}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </article>
      </section>

      <section className="sprint-project-bottom-grid">
        <article className="sprint-panel sprint-completion-trend-card">
          <div className="sprint-panel-heading">
            <h2>Sprint Completion Trend</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={completionTrend} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e9eef4" vertical={false} />
              <XAxis dataKey="sprint" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 12 }} />
              <Tooltip contentStyle={{ borderRadius: 10, border: '1px solid #e2e8f0' }} />
              <Bar dataKey="completed" fill="#ef4444" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </article>

        <article className="sprint-panel sprint-distribution-card">
          <div className="sprint-panel-heading">
            <h2>Task Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={taskSplit} dataKey="value" nameKey="name" innerRadius={70} outerRadius={100} paddingAngle={5} label={false}>
                {taskSplit.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
              <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ paddingTop: 8 }} />
            </PieChart>
          </ResponsiveContainer>
        </article>
      </section>

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
              onClick={() => navigate(`/sprints/${project.id}/${item.id}`)}
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
