import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Sprints.css';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { ArrowLeft } from 'lucide-react';
import { sprintProjects, sprintDetails } from './sprintData';

const priorityClass = (priority) => {
  if (priority === 'High') return 'sprint-priority-high';
  if (priority === 'Medium') return 'sprint-priority-medium';
  return 'sprint-priority-low';
};

const healthClass = (health) => {
  if (health === 'On Track') return 'sprint-health-good';
  if (health === 'Needs Attention') return 'sprint-health-warning';
  return 'sprint-health-risk';
};

const SprintProjectDetail = () => {
  const { sprintId } = useParams();
  const navigate = useNavigate();

  let project = null;
  let details = null;
  let selectedSprint = null;

  for (const projectKey in sprintDetails) {
    const projectData = sprintDetails[projectKey];
    const foundSprint = projectData.sprints?.find((item) => item.id === sprintId);
    if (foundSprint) {
      project = sprintProjects.find((item) => item.id === projectKey);
      details = projectData;
      selectedSprint = foundSprint;
      break;
    }
  }

  if (!project || !details || !selectedSprint) {
    return (
      <div className="dashboard-wrapper sprint-page">
        <header className="main-header">
          <div>
            <h1>Sprint Not Found</h1>
            <p>The requested sprint was not found.</p>
          </div>
        </header>
        <button type="button" className="action-btn primary-btn" onClick={() => navigate('/sprints')}>
          <ArrowLeft size={16} /> Back To Sprint Projects
        </button>
      </div>
    );
  }

  const selectedVelocity = details.velocity.find((item) => item.sprint === sprintId) || details.velocity[details.velocity.length - 1];
  const totalTasks = details.board.length;
  const completedTasks = details.board.filter((item) => item.status === 'Done').length;
  const blockedTasks = details.board.filter((item) => item.status === 'Blocked').length;
  const pendingTasks = details.board.filter((item) => item.status === 'To Do').length;
  const reviewTasks = details.board.filter((item) => item.status === 'Review').length;
  const sprintCompletion = Math.round((completedTasks / Math.max(totalTasks, 1)) * 100);

  const selectedSprintStatusClass = (status) => {
    if (status === 'active' || status === 'completed') return 'sprint-health-good';
    if (status === 'delayed') return 'sprint-health-risk';
    return 'sprint-health-warning';
  };

  const sprintStatusLabel = selectedSprint.status === 'active'
    ? 'Active'
    : selectedSprint.status === 'completed'
      ? 'Completed'
      : selectedSprint.status === 'delayed'
        ? 'Delayed'
        : 'Upcoming';

  const ownerAllocation = useMemo(() => {
    const summary = details.board.reduce((acc, item) => {
      if (!acc[item.owner]) {
        acc[item.owner] = { owner: item.owner, assigned: 0, completed: 0, inProgress: 0, blocked: 0 };
      }

      acc[item.owner].assigned += 1;

      if (item.status === 'Done') acc[item.owner].completed += 1;
      if (item.status === 'In Progress' || item.status === 'Review') acc[item.owner].inProgress += 1;
      if (item.status === 'Blocked') acc[item.owner].blocked += 1;

      return acc;
    }, {});

    return Object.values(summary).map((item) => ({
      ...item,
      completionRate: Math.round((item.completed / Math.max(item.assigned, 1)) * 100),
    }));
  }, [details.board]);

  const countByStatus = (status) => details.board.filter((task) => task.status === status).length;

  const today = new Date();
  const getDaysRemaining = (dateString) => {
    const [day, monthShort, year] = dateString.split(' ');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames.indexOf(monthShort);
    const target = new Date(Number(year), month, Number(day));
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  };

  const boardColumns = [
    { title: 'To Do', status: 'To Do' },
    { title: 'In Progress', status: 'In Progress' },
    { title: 'Review / QA', status: 'Review' },
    { title: 'Done', status: 'Done' },
  ];

  return (
    <div className="dashboard-wrapper sprint-page sprint-detail-page">
      <header className="sprint-detail-top">
        <div>
          <button type="button" className="sprint-back-link" onClick={() => navigate('/sprints')}>
            <ArrowLeft size={14} /> All {project.name} Sprints
          </button>
          <div className="sprint-detail-title-row">
            <div>
              <h1>{selectedSprint.id} — {selectedSprint.title}</h1>
              <p className="sprint-detail-goal"><strong>Goal:</strong> {details.goals?.[0]}</p>
              <p className="sprint-detail-description">{details.about}</p>
            </div>
            <span className={`sprint-health-pill ${selectedSprintStatusClass(selectedSprint.status)}`}>
              {sprintStatusLabel}
            </span>
          </div>

          <div className="sprint-detail-meta-grid">
            <article className="sprint-summary-card">
              <p className="sprint-summary-label">Timeline</p>
              <h3>{project.startDate} — {project.endDate}</h3>
            </article>
            <article className="sprint-summary-card">
              <p className="sprint-summary-label">Days Remaining</p>
              <h3>{getDaysRemaining(project.endDate)} days</h3>
            </article>
            <article className="sprint-summary-card">
              <p className="sprint-summary-label">Scrum Master</p>
              <h3>{project.scrumMaster}</h3>
            </article>
            <article className="sprint-summary-card">
              <p className="sprint-summary-label">Project</p>
              <h3>{project.name}</h3>
            </article>
            <article className="sprint-summary-card sprint-summary-card-small">
              <p className="sprint-summary-label">Story Points</p>
              <h3>{selectedVelocity.completed}/{project.totalPoints}</h3>
            </article>
          </div>

          <div className="sprint-detail-team-row">
            <p className="sprint-summary-label">Team</p>
            <div className="sprint-detail-team-chips">
              {[...new Set(details.board.map((item) => item.owner))].map((owner) => (
                <span key={owner} className="sprint-team-chip">
                  <span>{owner.split(' ').map((part) => part[0]).join('')}</span>
                  {owner}
                </span>
              ))}
            </div>
          </div>
        </div>
      </header>

      <section className="sprint-detail-metrics-grid">
        <article className="sprint-kpi-card sprint-kpi-simple">
          <p>Total Tasks</p>
          <h2>{totalTasks}</h2>
        </article>
        <article className="sprint-kpi-card sprint-kpi-simple">
          <p>Completed</p>
          <h2>{completedTasks}</h2>
        </article>
        <article className="sprint-kpi-card sprint-kpi-simple">
          <p>In Progress</p>
          <h2>{countByStatus('In Progress')}</h2>
        </article>
        <article className="sprint-kpi-card sprint-kpi-simple">
          <p>Pending</p>
          <h2>{pendingTasks}</h2>
        </article>
        <article className="sprint-kpi-card sprint-kpi-simple">
          <p>In Review</p>
          <h2>{reviewTasks}</h2>
        </article>
        <article className="sprint-kpi-card sprint-kpi-simple">
          <p>Completion Rate</p>
          <h2>{sprintCompletion}%</h2>
        </article>
      </section>

      <section className="sprint-detail-main-grid">
        <article className="sprint-panel sprint-chart-panel">
          <div className="sprint-panel-heading">
            <div>
              <h2>Burndown Chart</h2>
              <p className="sprint-panel-copy">Ideal vs Actual remaining story points</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={320}>
            <LineChart data={details.burndown}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eef4" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }} />
              <Line type="monotone" dataKey="ideal" name="Ideal" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#2563eb" strokeWidth={3} dot={false} />
            </LineChart>
          </ResponsiveContainer>
          <div className="sprint-chart-legend">
            <span><span className="sprint-legend-dot" style={{ background: '#94a3b8' }} /> Ideal</span>
            <span><span className="sprint-legend-dot" style={{ background: '#2563eb' }} /> Actual</span>
          </div>
        </article>

        <article className="sprint-panel sprint-donut-panel">
          <div className="sprint-panel-heading">
            <div>
              <h2>Work Distribution</h2>
              <p className="sprint-panel-copy">Task status breakdown</p>
            </div>
          </div>
          <div className="sprint-donut-chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={details.workSplit} innerRadius={62} outerRadius={94} paddingAngle={4} dataKey="value" stroke="none">
                  {details.workSplit.map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="sprint-donut-center">
              <strong>{sprintCompletion}%</strong>
              <span>complete</span>
            </div>
          </div>
          <div className="sprint-legend-column">
            {details.workSplit.map((item) => (
              <div key={item.name} className="sprint-legend-item">
                <span className="sprint-dot" style={{ background: item.color }} />
                <div>
                  <strong>{item.name}</strong>
                  <span>{item.value}%</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="sprint-detail-main-grid sprint-secondary-grid">
        <article className="sprint-panel sprint-capacity-panel">
          <div className="sprint-panel-heading sprint-progress-panel-heading">
            <div>
              <h2>Team Capacity</h2>
              <p className="sprint-panel-copy">Story point utilization</p>
            </div>
            <span className="sprint-summary-value">{project.totalPoints} pts</span>
          </div>
          <div className="capacity-bar-wrap">
            <div className="capacity-bar">
              <div className="capacity-filled" style={{ width: `${Math.min(Math.round((selectedVelocity.completed / project.totalPoints) * 100), 100)}%` }} />
            </div>
            <div className="capacity-meta">
              <span>{selectedVelocity.completed} used</span>
              <span>{project.totalPoints - selectedVelocity.completed} remaining</span>
            </div>
          </div>
          <div className="team-capacity-list">
            {details.capacity.map((item) => (
              <div key={item.team} className="team-capacity-row">
                <div>
                  <strong>{item.team}</strong>
                  <span>{item.members} members</span>
                </div>
                <span>{item.utilization}</span>
              </div>
            ))}
          </div>
        </article>

        <article className="sprint-panel sprint-time-estimation-panel">
          <div className="sprint-panel-heading">
            <div>
              <h2>Estimated Time Usage</h2>
              <p className="sprint-panel-copy">Hours allocated vs hours used</p>
            </div>
          </div>
          <div className="sprint-time-chart-wrap">
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie 
                  data={[
                    { name: 'Used', value: details.estimatedHours.used, color: '#3b82f6' },
                    { name: 'Remaining', value: details.estimatedHours.estimated - details.estimatedHours.used, color: '#e2e8f0' }
                  ]} 
                  innerRadius={62} 
                  outerRadius={94} 
                  paddingAngle={4} 
                  dataKey="value" 
                  stroke="none"
                >
                  {[
                    { name: 'Used', value: details.estimatedHours.used, color: '#3b82f6' },
                    { name: 'Remaining', value: details.estimatedHours.estimated - details.estimatedHours.used, color: '#e2e8f0' }
                  ].map((entry, index) => (
                    <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="sprint-time-center">
              <strong>{Math.round((details.estimatedHours.used / details.estimatedHours.estimated) * 100)}%</strong>
              <span>used</span>
            </div>
          </div>
          <div className="sprint-time-legend">
            <div className="sprint-time-legend-item">
              <span className="sprint-time-dot" style={{ background: '#3b82f6' }} />
              <div>
                <strong>Used</strong>
                <span>{details.estimatedHours.used}h</span>
              </div>
            </div>
            <div className="sprint-time-legend-item">
              <span className="sprint-time-dot" style={{ background: '#e2e8f0' }} />
              <div>
                <strong>Remaining</strong>
                <span>{details.estimatedHours.estimated - details.estimatedHours.used}h</span>
              </div>
            </div>
          </div>
        </article>
      </section>

      <section className="sprint-panel sprint-board-section">
        <div className="sprint-board-title-row">
          <div>
            <h2>Sprint Task Board</h2>
            <p>{totalTasks} total tasks</p>
          </div>
        </div>

        <div className="sprint-team-performance-grid">
          {ownerAllocation.map((member) => (
            <div key={member.owner} className="sprint-team-member-card">
              <div className="sprint-member-avatar">
                <span>{member.owner.split(' ').map((part) => part[0]).join('')}</span>
              </div>
              <div className="sprint-member-info">
                <h3 className="sprint-member-name">{member.owner}</h3>
                <p className="sprint-member-role">Team Member</p>
              </div>
              <div className="sprint-member-metrics">
                <div className="sprint-metric-row">
                  <span className="sprint-metric-label">Tasks Assigned</span>
                  <span className="sprint-metric-value">{member.assigned}</span>
                </div>
                <div className="sprint-metric-row">
                  <span className="sprint-metric-label">Tasks Completed</span>
                  <span className="sprint-metric-value" style={{ color: '#10b981' }}>{member.completed}</span>
                </div>
                <div className="sprint-metric-row">
                  <span className="sprint-metric-label">Completion Rate</span>
                  <span className="sprint-metric-value">{member.completionRate}%</span>
                </div>
              </div>
              <div className="sprint-member-progress">
                <div className="sprint-progress-bar-container">
                  <div className="sprint-progress-bar" style={{ width: `${member.completionRate}%` }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default SprintProjectDetail;
