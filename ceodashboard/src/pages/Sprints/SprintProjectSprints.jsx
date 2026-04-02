import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Sprints.css';
import {
  ArrowLeft,
  ArrowRight,
  CalendarClock,
  ChevronRight,
  Rocket,
  Target,
  Users,
} from 'lucide-react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from 'recharts';
import { sprintProjects, sprintDetails } from './sprintData';

const sprintHealth = (ratio) => {
  if (ratio >= 90) return { label: 'On Track', tone: 'sprint-health-good' };
  if (ratio >= 75) return { label: 'Needs Attention', tone: 'sprint-health-warning' };
  return { label: 'At Risk', tone: 'sprint-health-risk' };
};

const SprintProjectSprints = () => {
  const navigate = useNavigate();
  const { projectId } = useParams();

  const project = sprintProjects.find((item) => item.id === projectId);
  const details = project ? sprintDetails[project.id] : null;

  const sprintCards = useMemo(() => {
    if (!details) return [];

    return details.velocity.map((item, index) => {
      const completion = Math.round((item.completed / Math.max(item.planned, 1)) * 100);
      const health = sprintHealth(completion);

      return {
        id: item.sprint,
        sprint: item.sprint,
        planned: item.planned,
        completed: item.completed,
        carryOver: Math.max(item.planned - item.completed, 0),
        completion,
        health,
        cycleLabel: `Cycle ${index + 1}`,
      };
    });
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
          <ArrowLeft size={16} /> Back To Sprint Projects
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper sprint-page">
      <header className="main-header sprint-detail-header">
        <div>
          <button type="button" className="sprint-back-link" onClick={() => navigate('/sprints')}>
            <ArrowLeft size={14} /> All Sprint Projects
          </button>
          <h1>{project.name} - All Sprints</h1>
          <p>All sprints related to this project. Click a sprint to open full sprint details.</p>
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

      <section className="sprint-panel">
        <h2 className="sprint-section-title">Sprint Progress Trend</h2>
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={sprintCards} layout="vertical" margin={{ top: 8, right: 16, left: 8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e9eef4" />
            <XAxis type="number" axisLine={false} tickLine={false} />
            <YAxis dataKey="sprint" type="category" axisLine={false} tickLine={false} width={46} />
            <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
            <Bar dataKey="planned" name="Planned" fill="#38bdf8" radius={[0, 6, 6, 0]} />
            <Bar dataKey="completed" name="Completed" fill="#22c55e" radius={[0, 6, 6, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </section>

      <section className="sprint-related-grid">
        {sprintCards.map((sprint) => (
          <button
            key={sprint.id}
            type="button"
            className="sprint-related-card"
            onClick={() => navigate(`/sprints/${project.id}/${sprint.id}`)}
          >
            <div className="sprint-related-head">
              <div>
                <p className="sprint-project-client">{sprint.cycleLabel}</p>
                <h3>{sprint.sprint}</h3>
              </div>
              <span className={`sprint-health-pill ${sprint.health.tone}`}>{sprint.health.label}</span>
            </div>

            <div className="sprint-project-stats">
              <div>
                <p>Planned</p>
                <strong>{sprint.planned} pts</strong>
              </div>
              <div>
                <p>Completed</p>
                <strong>{sprint.completed} pts</strong>
              </div>
              <div>
                <p>Carryover</p>
                <strong>{sprint.carryOver} pts</strong>
              </div>
            </div>

            <div className="sprint-project-progress-bar">
              <div style={{ width: `${Math.min(100, sprint.completion)}%` }} />
            </div>

            <div className="sprint-related-footer">
              <span>{sprint.completion}% completion</span>
              <ChevronRight size={16} />
            </div>
          </button>
        ))}
      </section>

      <section className="sprint-summary-row">
        <article className="info-card">
          <h3><Target size={17} /> Sprint Collection Summary</h3>
          <p className="sprint-summary-copy">
            Select any sprint card to open the detailed sprint workspace with board, blockers, goals,
            capacity and chart analytics.
          </p>
        </article>
      </section>
    </div>
  );
};

export default SprintProjectSprints;
