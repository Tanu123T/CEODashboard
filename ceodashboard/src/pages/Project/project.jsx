import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './Project.css';
import {
  ArrowLeft,
  ArrowRight,
  BriefcaseBusiness,
  CalendarDays,
  Circle,
  UserRound,
  Zap,
} from 'lucide-react';
import PageLoader from '../../components/common/PageLoader';
import useSimulatedLoading from '../../hooks/useSimulatedLoading';
import { projectRecords } from '../../data/projectsData';

const formatCurrency = (value) => `₹${value.toLocaleString('en-IN')}`;

const sprintRouteByProjectId = {
  1: 'hospital-crm',
  2: 'ai-chatbot',
  3: 'banking-portal',
  4: 'travel-app',
  5: 'hospital-crm',
  6: 'banking-portal',
};

const Projects = () => {
  const isLoading = useSimulatedLoading(650);
  const navigate = useNavigate();
  const { projectId } = useParams();

  const totals = useMemo(() => {
    const complete = projectRecords.filter((item) => item.statusTone === 'complete').length;
    const inProgress = projectRecords.filter((item) => item.statusTone === 'in-progress').length;
    const delayed = projectRecords.filter((item) => item.statusTone === 'delayed').length;

    return {
      total: projectRecords.length,
      complete,
      inProgress,
      delayed,
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
    const sprintRouteId = sprintRouteByProjectId[selectedProject.id];

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
            <button
              type="button"
              className="meta-card-action"
              onClick={() => navigate(sprintRouteId ? `/sprints/${sprintRouteId}` : '/sprints')}
            >
              <p><Zap size={14} /> SPRINTS</p>
              <h3>{selectedProject.sprints}</h3>
            </button>
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
                <defs>
                  <linearGradient id="gradientStroke" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#18b7a6" />
                  </linearGradient>
                </defs>
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
            <span
              className={`project-progress-fill ${selectedProject.statusTone}`}
              style={{ width: `${selectedProject.progress}%` }}
            />
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

        <section className="project-detail-grid bottom">
          <div className="project-detail-side">
            <section className="project-detail-panel sprint-insight-panel">
              <div className="sprint-insight-header">
                <h3>SPRINT INSIGHT</h3>
                <button
                  type="button"
                  className="view-sprint-btn"
                  onClick={() => navigate(sprintRouteId ? `/sprints/${sprintRouteId}` : '/sprints')}
                >
                  <span>View Sprint</span>
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="sprint-insight-content">
                <article className="sprint-stat">
                  <p>Total Sprints</p>
                  <h4>{selectedProject.sprints}</h4>
                </article>
                <article className="sprint-stat">
                  <p>Progress</p>
                  <h4>{selectedProject.progress}%</h4>
                </article>
              </div>
            </section>
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
          <p>Complete</p>
          <h3 className="kpi-green">{totals.complete}</h3>
        </article>
        <article className="projects-kpi-card">
          <p>In Progress</p>
          <h3 className="kpi-amber">{totals.inProgress}</h3>
        </article>
        <article className="projects-kpi-card">
          <p>Delayed</p>
          <h3 className="kpi-red">{totals.delayed}</h3>
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
                <div className="project-head-copy">
                  <div className="project-title-row">
                    <h3 className="project-name">{project.name}</h3>
                    <span className={`project-status-pill ${project.statusTone}`}>
                      <Circle size={8} fill="currentColor" />
                      {project.statusLabel}
                    </span>
                  </div>
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
              <article className="meta-chip">
                <p>Lead</p>
                <strong>{project.lead}</strong>
              </article>
              <article className="meta-chip">
                <p>Due Date</p>
                <strong>{project.dueDate}</strong>
              </article>
            </div>
          </button>
        ))}
      </section>
    </div>
  );
};

export default Projects;
