import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Project.css';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle,
  Circle,
  Clock3,
  TriangleAlert,
  UserRound,
  Zap,
} from 'lucide-react';
import PageLoader from '../../components/common/PageLoader';
import useSimulatedLoading from '../../hooks/useSimulatedLoading';
import { projectRecords } from '../../data/projectsData';

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

const Projects = () => {
  const isLoading = useSimulatedLoading(650);
  const navigate = useNavigate();
  const { projectId } = useParams();

  const totals = useMemo(() => {
    const onTrack = projectRecords.filter((item) => item.statusTone === 'on-track').length;
    const needsAttention = projectRecords.filter((item) => item.statusTone !== 'on-track').length;

    return {
      total: projectRecords.length,
      onTrack,
      needsAttention,
    };
  }, []);

  const selectedProject = useMemo(
    () => projectRecords.find((item) => String(item.id) === projectId) || null,
    [projectId]
  );

  if (isLoading) {
    return <PageLoader title="Loading Project Overview..." />;
  }

  if (projectId && !selectedProject) {
    return (
      <div className="projects-page project-detail-page">
        <button type="button" className="project-back" onClick={() => navigate('/projects')}>
          <ArrowLeft size={17} />
          <span>Back to Projects</span>
        </button>

        <section className="project-detail-panel">
          <h3>Project not found</h3>
          <p className="project-about-text">The requested project could not be located.</p>
        </section>
      </div>
    );
  }

  if (selectedProject) {
    const radius = 66;
    const circumference = 2 * Math.PI * radius;
    const progress = Math.max(0, Math.min(100, selectedProject.progress));
    const dashOffset = circumference - (progress / 100) * circumference;
    const remaining = Math.max(selectedProject.budgetTotal - selectedProject.budgetSpent, 0);

    return (
      <div className="projects-page project-detail-page">
        <button type="button" className="project-back" onClick={() => navigate('/projects')}>
          <ArrowLeft size={17} />
          <span>Back to Projects</span>
        </button>

        <section className="project-detail-hero">
          <div className="project-detail-hero-top" />
          <div className="project-detail-hero-content">
            <div>
              <h1>{selectedProject.name}</h1>
              <p>{selectedProject.client}</p>
            </div>
            <span className={`project-status-pill ${selectedProject.statusTone}`}>
              <Circle size={8} fill="currentColor" />
              {selectedProject.statusLabel}
            </span>
          </div>

          <div className="project-detail-meta-cards">
            <article>
              <p><CalendarDays size={14} /> START DATE</p>
              <h3>{selectedProject.startDate}</h3>
            </article>
            <article>
              <p><CalendarDays size={14} /> DEADLINE</p>
              <h3>{selectedProject.dueDate}</h3>
            </article>
            <article>
              <p><UserRound size={14} /> LEAD</p>
              <h3>{selectedProject.lead}</h3>
            </article>
            <article>
              <p><Zap size={14} /> SPRINTS</p>
              <h3>{selectedProject.sprints}</h3>
            </article>
          </div>
        </section>

        <section className="project-detail-grid top">
          <article className="project-detail-panel">
            <h3>ABOUT</h3>
            <p className="project-about-text">{selectedProject.about}</p>

            <h3 className="detail-subtitle">TECH STACK</h3>
            <div className="chip-row muted">
              {selectedProject.techStack.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>

            <h3 className="detail-subtitle">TEAM</h3>
            <div className="chip-row green">
              {selectedProject.team.map((member) => (
                <span key={member}>{member}</span>
              ))}
            </div>
          </article>

          <article className="project-detail-panel project-completion-panel">
            <div className="progress-ring-wrap">
              <svg viewBox="0 0 180 180" className="progress-ring" aria-label="Project completion">
                <circle cx="90" cy="90" r={radius} className="progress-ring-track" />
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  className="progress-ring-fill"
                  style={{
                    strokeDasharray: circumference,
                    strokeDashoffset: dashOffset,
                  }}
                />
              </svg>
              <div className="progress-ring-copy">
                <strong>{selectedProject.progress}%</strong>
                <span>Complete</span>
              </div>
            </div>
            <p>{selectedProject.milestonesDone} of {selectedProject.milestones.length} milestones done</p>
          </article>
        </section>

        <section className="project-detail-panel">
          <h3>BUDGET</h3>
          <div className="budget-head-row">
            <strong>{formatCurrency(selectedProject.budgetSpent)}</strong>
            <span>of {formatCurrency(selectedProject.budgetTotal)}</span>
            <em>{selectedProject.progress}% utilized</em>
          </div>
          <div className="project-progress-track detail-budget-track">
            <span className="project-progress-fill on-track" style={{ width: `${selectedProject.progress}%` }} />
          </div>

          <div className="budget-stat-grid">
            <article>
              <p>BUDGET</p>
              <h4>{formatCurrency(selectedProject.budgetTotal)}</h4>
            </article>
            <article>
              <p>SPENT</p>
              <h4 className="green-text">{formatCurrency(selectedProject.budgetSpent)}</h4>
            </article>
            <article>
              <p>REMAINING</p>
              <h4 className="green-text">{formatCurrency(remaining)}</h4>
            </article>
          </div>
        </section>

        <section className="project-detail-panel">
          <h3>MILESTONES</h3>
          <div className="milestone-list">
            {selectedProject.milestones.map((item) => (
              <article key={item.title} className="milestone-item">
                <div className={`milestone-name ${item.done ? 'done' : ''}`}>
                  {item.done ? <CheckCircle size={20} /> : <Circle size={20} />}
                  <span>{item.title}</span>
                </div>
                <strong>{item.date}</strong>
              </article>
            ))}
          </div>
        </section>

        <section className="project-detail-panel">
          <h3>RISKS</h3>
          <div className="risk-list">
            {selectedProject.risks.length > 0 ? (
              selectedProject.risks.map((risk) => (
                <div key={risk} className="risk-item">
                  <TriangleAlert size={18} />
                  <span>{risk}</span>
                </div>
              ))
            ) : (
              <div className="risk-item neutral">
                <CheckCircle size={18} />
                <span>No active risks logged.</span>
              </div>
            )}
          </div>
        </section>

        <section className="project-detail-panel">
          <h3>RECENT ACTIVITY</h3>
          <div className="activity-list">
            {selectedProject.activity.map((item) => (
              <article key={`${item.actor}-${item.time}`} className="activity-item">
                <Clock3 size={16} />
                <div>
                  <p><strong>{item.actor}</strong> {item.action}</p>
                  <span>{item.time}</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="projects-page">
      <header className="projects-header">
        <h1>Projects</h1>
        <p>All active and in-progress projects</p>
      </header>

      <section className="projects-kpi-grid">
        <article className="projects-kpi-card">
          <p>Total Projects</p>
          <h3 className="kpi-blue">{totals.total}</h3>
        </article>
        <article className="projects-kpi-card">
          <p>On Track</p>
          <h3 className="kpi-green">{totals.onTrack}</h3>
        </article>
        <article className="projects-kpi-card">
          <p>Needs Attention / At Risk</p>
          <h3 className="kpi-red">{totals.needsAttention}</h3>
        </article>
      </section>

      <section className="projects-grid">
        {projectRecords.map((project) => (
          <button
            key={project.id}
            type="button"
            className="project-card"
            onClick={() => navigate(`/projects/${project.id}`)}
          >
            <div className="project-row-top">
              <div className="project-head-left">
                <span className={`project-icon ${project.iconTone}`}>
                  <BriefcaseBusiness size={17} />
                </span>
                <div>
                  <h3>
                    {project.name}
                    <span className={`project-status-pill ${project.statusTone}`}>
                      <Circle size={8} fill="currentColor" />
                      {project.statusLabel}
                    </span>
                  </h3>
                  <p>{project.client}</p>
                </div>
              </div>
              <ArrowRight size={18} className="project-arrow" />
            </div>

            <div className="project-progress-block">
              <div className="project-progress-head">
                <span>Progress</span>
                <strong>{project.progress}%</strong>
              </div>
              <div className="project-progress-track">
                <span
                  className={`project-progress-fill ${project.statusTone}`}
                  style={{ width: `${project.progress}%` }}
                />
              </div>
            </div>

            <div className="project-meta-row">
              <span>
                Lead: <strong>{project.lead}</strong>
              </span>
              <span>
                Due: <strong>{project.dueDate}</strong>
              </span>
              {project.riskCount > 0 ? (
                <span className="risk-meta">
                  <TriangleAlert size={14} />
                  {project.riskCount} {project.riskCount === 1 ? 'risk' : 'risks'}
                </span>
              ) : null}
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

export default Projects;
