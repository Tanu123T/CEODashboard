import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Sprints.css';
import '../Project/Project.css';
import '../Employees/Employees.css';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  ArrowLeft,
  CalendarClock,
  Users,
  Target,
  AlertTriangle,
  CircleDashed,
  Activity,
  Rocket,
} from 'lucide-react';
import { sprintProjects, sprintDetails } from './sprintData';

const statusClass = (status) => {
  if (status === 'Done') return 'sprint-status-done';
  if (status === 'In Progress') return 'sprint-status-progress';
  if (status === 'Review') return 'sprint-status-review';
  if (status === 'Blocked') return 'sprint-status-blocked';
  return 'sprint-status-backlog';
};

const priorityClass = (priority) => {
  if (priority === 'High') return 'sprint-priority-high';
  if (priority === 'Medium') return 'sprint-priority-medium';
  return 'sprint-priority-low';
};

const toneClass = (tone) => {
  if (tone === 'good') return 'sprint-kpi-good';
  if (tone === 'warning') return 'sprint-kpi-warning';
  return 'sprint-kpi-risk';
};

const healthClass = (health) => {
  if (health === 'On Track') return 'sprint-health-good';
  if (health === 'Needs Attention') return 'sprint-health-warning';
  return 'sprint-health-risk';
};

const SprintProjectDetail = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  const project = sprintProjects.find((item) => item.id === projectId);

  if (!project || !sprintDetails[project.id]) {
    return (
      <div className="dashboard-wrapper sprint-page">
        <header className="main-header">
          <div>
            <h1>Sprint Not Found</h1>
            <p>The requested project sprint was not found.</p>
          </div>
        </header>
        <button type="button" className="action-btn primary-btn" onClick={() => navigate('/sprints')}>
          <ArrowLeft size={16} /> Back To Sprint Projects
        </button>
      </div>
    );
  }

  const details = sprintDetails[project.id];

  return (
    <div className="dashboard-wrapper sprint-page">
      <header className="main-header sprint-detail-header">
        <div>
          <button type="button" className="sprint-back-link" onClick={() => navigate('/sprints')}>
            <ArrowLeft size={14} /> All Sprint Projects
          </button>
          <h1>{project.name} - {project.sprint}</h1>
          <p>{details.about}</p>
        </div>
        <div className={`sprint-health-pill ${healthClass(project.health)}`}>
          <Activity size={15} /> {project.health}
        </div>
      </header>

      <section className="sprint-meta-row">
        <div className="sprint-meta-chip">
          <CalendarClock size={15} /> {project.startDate} to {project.endDate}
        </div>
        <div className="sprint-meta-chip">
          <Users size={15} /> {project.contributors} contributors
        </div>
        <div className="sprint-meta-chip">
          <Rocket size={15} /> Release: {project.releaseWindow}
        </div>
      </section>

      <section className="sprint-kpi-grid">
        {details.kpis.map((kpi) => (
          <article key={kpi.title} className={`sprint-kpi-card ${toneClass(kpi.tone)}`}>
            <p className="sprint-kpi-label">{kpi.title}</p>
            <h3 className="sprint-kpi-value">{kpi.value}</h3>
            <p className="sprint-kpi-detail">{kpi.detail}</p>
          </article>
        ))}
      </section>

      <section className="sprint-chart-grid">
        <article className="chart-container">
          <h3>Burndown Trend</h3>
          <ResponsiveContainer width="100%" height={270}>
            <LineChart data={details.burndown}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eef4" />
              <XAxis dataKey="day" axisLine={false} tickLine={false} />
              <YAxis axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Line type="monotone" dataKey="ideal" name="Ideal" stroke="#38bdf8" strokeDasharray="5 5" strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="actual" name="Actual" stroke="#22c55e" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </article>

        <article className="breakdown-card">
          <h3>Work Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={details.workSplit} innerRadius={56} outerRadius={84} paddingAngle={3} dataKey="value" stroke="none">
                {details.workSplit.map((entry, index) => (
                  <Cell key={`${entry.name}-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="modern-legend sprint-legend">
            {details.workSplit.map((item) => (
              <div key={item.name} className="legend-item">
                <span className="dot" style={{ background: item.color }} />
                <span>{item.name} ({item.value}%)</span>
              </div>
            ))}
          </div>
        </article>
      </section>

      <section className="main-content-grid sprint-main-grid">
        <article className="table-container">
          <h2 className="section-title">Detailed Sprint Board</h2>
          <table className="projects-table sprint-board-table">
            <thead>
              <tr>
                <th>Ticket</th>
                <th>Story</th>
                <th>Owner</th>
                <th>Priority</th>
                <th>Points</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {details.board.map((item) => (
                <tr key={item.id}>
                  <td className="font-bold">{item.id}</td>
                  <td>{item.title}</td>
                  <td className="team-lead-cell"><Users size={14} className="row-icon" />{item.owner}</td>
                  <td>
                    <span className={`sprint-priority-badge ${priorityClass(item.priority)}`}>
                      {item.priority}
                    </span>
                  </td>
                  <td>{item.points}</td>
                  <td>
                    <span className={`sprint-status-badge ${statusClass(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </article>

        <aside className="sidebar-info">
          <article className="info-card">
            <h3><Target size={17} /> Sprint Goals</h3>
            <ul className="sprint-goals-list">
              {details.goals.map((goal) => (
                <li key={goal}>
                  <CircleDashed size={14} />
                  <span>{goal}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="info-card">
            <h3><AlertTriangle size={17} /> Blockers</h3>
            <ul className="sprint-blockers-list">
              {details.blockers.map((item) => (
                <li key={item.id}>
                  <div>
                    <p className="list-title">{item.id} - {item.title}</p>
                    <p className="list-subtitle">{item.impact}</p>
                    <p className="list-subtitle">Owner: {item.owner} | ETA: {item.eta}</p>
                  </div>
                  <span className="sprint-severity-tag">{item.severity}</span>
                </li>
              ))}
            </ul>
          </article>

          <article className="info-card">
            <h3><Users size={17} /> Team Capacity</h3>
            <ul className="sprint-capacity-list">
              {details.capacity.map((item) => (
                <li key={item.team}>
                  <div>
                    <p className="list-title">{item.team}</p>
                    <p className="list-subtitle">{item.members} members</p>
                  </div>
                  <div className="sprint-capacity-metrics">
                    <strong>{item.capacity}</strong>
                    <span>{item.utilization}</span>
                  </div>
                </li>
              ))}
            </ul>
          </article>
        </aside>
      </section>

      <section className="table-container sprint-velocity-block">
        <h2 className="section-title">Sprint Velocity History</h2>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={details.velocity}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eef4" />
            <XAxis dataKey="sprint" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
            <Legend />
            <Bar dataKey="planned" name="Planned" fill="#38bdf8" radius={[6, 6, 0, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="table-container">
        <h2 className="section-title">Scope Change Summary</h2>
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={details.scope}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e9eef4" />
            <XAxis dataKey="metric" axisLine={false} tickLine={false} />
            <YAxis axisLine={false} tickLine={false} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="points" name="Story Points" fill="#18b7a6" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>
    </div>
  );
};

export default SprintProjectDetail;
