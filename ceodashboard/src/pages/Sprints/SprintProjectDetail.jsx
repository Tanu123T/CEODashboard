import React from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
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
import { ArrowLeft, Layers, CheckCircle2, Play, Clock3, Bug } from 'lucide-react';
import { sprintProjects, sprintDetails } from './sprintData';

const SprintProjectDetail = () => {
  const { sprintId } = useParams();
  const location = useLocation();
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
  const inProgressTasks = details.board.filter((item) => item.status === 'In Progress').length;
  const pendingTasks = details.board.filter((item) => item.status === 'To Do').length;
  const reviewTasks = details.board.filter((item) => item.status === 'Review').length;
  const openTasks = totalTasks - completedTasks;
  const sprintCompletion = Math.round((completedTasks / Math.max(totalTasks, 1)) * 100);
  const sprintStatus = String(selectedSprint.status || '').toLowerCase();
  const fallbackCompletion = Math.round((selectedVelocity.completed / Math.max(project.totalPoints, 1)) * 100);
  const storyPointCompletion = sprintStatus === 'completed'
    ? 100
    : Math.max(0, Math.min(100, Math.round(selectedSprint.progress ?? fallbackCompletion)));

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

  const teamMembers = [...new Set(details.board.map((item) => item.owner))];

  const getMetricProgress = (value) => Math.min(100, Math.max(8, Math.round((value / Math.max(totalTasks, 1)) * 100)));

  const taskProgressItems = [
    {
      key: 'total',
      label: 'Total Tasks',
      value: totalTasks,
      progress: 100,
      icon: <Layers size={18} />,
      iconClass: 'sprint-status-icon-total',
      pillClass: 'sprint-status-total',
    },
    {
      key: 'completed',
      label: 'Completed',
      value: completedTasks,
      progress: getMetricProgress(completedTasks),
      icon: <CheckCircle2 size={18} />,
      iconClass: 'sprint-status-icon-completed',
      pillClass: 'sprint-status-completed-green',
    },
    {
      key: 'in-progress',
      label: 'In Progress',
      value: inProgressTasks,
      progress: getMetricProgress(inProgressTasks),
      icon: <Play size={18} />,
      iconClass: 'sprint-status-icon-progress',
      pillClass: 'sprint-status-progress-pill',
    },
    {
      key: 'todo',
      label: 'To Do',
      value: pendingTasks,
      progress: getMetricProgress(pendingTasks),
      icon: <Clock3 size={18} />,
      iconClass: 'sprint-status-icon-todo',
      pillClass: 'sprint-status-todo',
    },
    {
      key: 'testing',
      label: 'Testing',
      value: reviewTasks,
      progress: getMetricProgress(reviewTasks),
      icon: <Bug size={18} />,
      iconClass: 'sprint-status-icon-testing',
      pillClass: 'sprint-status-testing',
    },
  ];

  const today = new Date();
  const getDaysRemaining = (dateString) => {
    const [day, monthShort, year] = dateString.split(' ');
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = monthNames.indexOf(monthShort);
    const target = new Date(Number(year), month, Number(day));
    const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
    return Math.max(diff, 0);
  };

  return (
    <div className="dashboard-wrapper sprint-page sprint-detail-page">
      <header className="sprint-detail-top">
        <div className="sprint-detail-header-main">
          <button type="button" className="sprint-back-link" onClick={() => navigate('/sprints')}>
            <ArrowLeft size={14} /> All {project.name} Sprints
          </button>
          <div className="sprint-detail-title-row">
            <div>
              <h1>{selectedSprint.id} - {selectedSprint.title}</h1>
              <p className="sprint-detail-goal"><strong>Goal:</strong> {details.goals?.[0]}</p>
              <p className="sprint-detail-description">{details.about}</p>
            </div>
            <span className={`sprint-health-pill ${selectedSprintStatusClass(selectedSprint.status)}`}>
              {sprintStatusLabel}
            </span>
          </div>

          <div className="sprint-detail-metrics-wrapper">
            <article className="sprint-detail-meta-grid">
              <article className="sprint-summary-card">
                <p className="sprint-summary-label">Duration</p>
                <h3>{project.startDate} - {project.endDate}</h3>
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
            </article>
          </div>

          <div className="sprint-detail-team-row">
            <p className="sprint-summary-label">Team</p>
            <div className="sprint-detail-team-chips">
              {teamMembers.map((owner) => (
                <button
                  key={owner}
                  type="button"
                  className="sprint-team-chip"
                  onClick={() =>
                    navigate(`/sprints/member/${encodeURIComponent(owner)}`, {
                      state: { from: location.pathname, projectId: project.id },
                    })
                  }
                >
                  <span>{owner.split(' ').map((part) => part[0]).join('')}</span>
                  {owner}
                </button>
              ))}
            </div>
          </div>
        </div>

        <article className="sprint-story-points-card sprint-story-points-top-card">
          <div className="sprint-completion-card-header sprint-completion-only">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie
                  data={[
                    { name: 'Complete', value: storyPointCompletion },
                    { name: 'Remaining', value: 100 - storyPointCompletion },
                  ]}
                  innerRadius={48}
                  outerRadius={68}
                  startAngle={90}
                  endAngle={-270}
                  dataKey="value"
                  stroke="none"
                  paddingAngle={0}
                >
                  <Cell fill="#2563eb" />
                  <Cell fill="#e2e8f0" />
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="sprint-completion-header-percent">
              <strong>{storyPointCompletion}%</strong>
              <span>Completed</span>
            </div>
          </div>
        </article>
      </header>

      <div className="sprint-detail-content">
        <section className="sprint-detail-columns-layout">
          <div className="sprint-detail-column sprint-detail-column-main">
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

            <article className="sprint-panel sprint-donut-panel sprint-work-distribution-panel">
              <div className="sprint-panel-heading">
                <div>
                  <h2>Work Distribution</h2>
                  <p className="sprint-panel-copy">Task breakdown per employee</p>
                </div>
              </div>
              <div className="sprint-work-distribution-list">
                {Object.values(details.board.reduce((acc, item) => {
                  const owner = item.owner;
                  if (!acc[owner]) {
                    acc[owner] = { owner, done: 0, inProgress: 0, toDo: 0 };
                  }

                  if (item.status === 'Done') acc[owner].done += 1;
                  else if (item.status === 'In Progress' || item.status === 'Review') acc[owner].inProgress += 1;
                  else acc[owner].toDo += 1;

                  return acc;
                }, {})).map((member) => {
                  const total = member.done + member.inProgress + member.toDo;
                  const donePercent = Math.round((member.done / Math.max(total, 1)) * 100);
                  const inProgressPercent = Math.round((member.inProgress / Math.max(total, 1)) * 100);
                  const toDoPercent = 100 - donePercent - inProgressPercent;

                  return (
                    <div key={member.owner} className="sprint-work-distribution-row">
                      <div className="sprint-work-distribution-name">{member.owner}</div>
                      <div className="sprint-work-distribution-bar">
                        <span className="sprint-work-segment done" style={{ width: `${donePercent}%` }} />
                        <span className="sprint-work-segment in-progress" style={{ width: `${inProgressPercent}%` }} />
                        <span className="sprint-work-segment todo" style={{ width: `${toDoPercent}%` }} />
                      </div>
                      <div className="sprint-work-distribution-meta">
                        <span className="sprint-work-tag done">{donePercent}% Done</span>
                        <span className="sprint-work-tag in-progress">{inProgressPercent}% In Progress</span>
                        <span className="sprint-work-tag todo">{toDoPercent}% To Do</span>
                      </div>
                      <div className="sprint-work-total">{total} tasks</div>
                    </div>
                  );
                })}
              </div>
              <div className="sprint-work-distribution-legend">
                <div className="sprint-work-legend-item">
                  <span className="sprint-work-dot done" />
                  <span>Done</span>
                </div>
                <div className="sprint-work-legend-item">
                  <span className="sprint-work-dot in-progress" />
                  <span>In Progress</span>
                </div>
                <div className="sprint-work-legend-item">
                  <span className="sprint-work-dot todo" />
                  <span>To Do</span>
                </div>
              </div>
            </article>
          </div>

          <div className="sprint-detail-column sprint-detail-column-side">
            <article className="sprint-panel sprint-status-panel">
              <div className="sprint-panel-heading">
                <div>
                  <h2>Task Progress</h2>
                  <p className="sprint-panel-copy">All task status metrics in one view</p>
                </div>
              </div>
              <div className="sprint-status-summary">
                {taskProgressItems.map((item) => (
                  <div key={item.key} className="sprint-status-item">
                    <span className={`sprint-status-icon ${item.iconClass}`}>{item.icon}</span>
                    <div>
                      <p>{item.label}</p>
                      <strong>{item.value}</strong>
                    </div>
                    <span className={`sprint-status-pill ${item.pillClass}`}>{item.progress}%</span>
                  </div>
                ))}
              </div>
              <div className="sprint-status-progress">
                <div className="sprint-status-progress-label">
                  <span>Overall task completion</span>
                  <strong>{sprintCompletion}%</strong>
                </div>
                <div className="sprint-progress-bar">
                  <span className="sprint-progress-segment closed" style={{ width: `${sprintCompletion}%` }} />
                  <span className="sprint-progress-segment open" style={{ width: `${Math.max(0, 100 - sprintCompletion)}%` }} />
                </div>
              </div>
              <div className="sprint-status-breakdown">
                <div>
                  <span className="sprint-status-dot closed" /> Closed
                </div>
                <div>
                  <span className="sprint-status-dot open" /> Open
                </div>
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
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={[
                        { name: 'Used', value: details.estimatedHours.used },
                        { name: 'Remaining', value: details.estimatedHours.estimated - details.estimatedHours.used },
                      ]}
                      innerRadius={54}
                      outerRadius={78}
                      paddingAngle={2}
                      dataKey="value"
                      stroke="none"
                    >
                      <Cell fill="#8b5cf6" />
                      <Cell fill="#e5e7eb" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="sprint-time-center">
                  <strong>{Math.round((details.estimatedHours.used / details.estimatedHours.estimated) * 100)}%</strong>
                  <span>USED</span>
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
          </div>
        </section>
      </div>
    </div>
  );
};

export default SprintProjectDetail;
