import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Sprints.css';
import {
  Search,
  ArrowRight,
  CalendarClock,
  Users,
  FolderKanban,
  Target,
  AlertTriangle,
  CheckCircle2,
} from 'lucide-react';
import { sprintProjects } from './sprintData';
import EmptyState from '../../components/common/EmptyState';
import PageLoader from '../../components/common/PageLoader';
import useSimulatedLoading from '../../hooks/useSimulatedLoading';

const healthClass = (health) => {
  if (health === 'On Track') return 'sprint-health-good';
  if (health === 'Needs Attention') return 'sprint-health-warning';
  return 'sprint-health-risk';
};

const progress = (done, total) => {
  if (!total) return 0;
  return Math.round((done / total) * 100);
};

const Sprints = () => {
  const isLoading = useSimulatedLoading(600);
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [healthFilter, setHealthFilter] = useState('All');

  const filteredProjects = useMemo(() => {
    return sprintProjects.filter((project) => {
      const matchesQuery =
        project.name.toLowerCase().includes(query.toLowerCase()) ||
        project.client.toLowerCase().includes(query.toLowerCase()) ||
        project.squad.toLowerCase().includes(query.toLowerCase());

      const matchesHealth = healthFilter === 'All' || project.health === healthFilter;

      return matchesQuery && matchesHealth;
    });
  }, [query, healthFilter]);

  if (isLoading) {
    return <PageLoader title="Loading Sprint Explorer..." />;
  }

  return (
    <div className="dashboard-wrapper sprint-selector-page">
      <header className="main-header">
        <div>
          <h1>Sprint Explorer</h1>
          <p>Select a project to open its full detailed sprint command center.</p>
        </div>
      </header>

      <section className="sprint-selector-controls table-container">
        <div className="sprint-search-wrap">
          <Search size={16} />
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by project, client, or squad"
          />
        </div>

        <div className="sprint-filter-row">
          {['All', 'On Track', 'Needs Attention', 'At Risk'].map((item) => (
            <button
              key={item}
              type="button"
              className={`sprint-filter-chip ${healthFilter === item ? 'active' : ''}`}
              onClick={() => setHealthFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </section>

      <section className="sprint-project-grid">
        {filteredProjects.map((project) => {
          const completion = progress(project.donePoints, project.totalPoints);

          return (
            <button
              key={project.id}
              type="button"
              className="sprint-project-card"
              onClick={() => navigate(`/sprints/${project.id}`)}
            >
              <div className="sprint-project-head">
                <div>
                  <p className="sprint-project-client">{project.client}</p>
                  <h3>{project.name}</h3>
                </div>
                <span className={`sprint-health-pill ${healthClass(project.health)}`}>{project.health}</span>
              </div>

              <p className="sprint-project-meta-line">
                <FolderKanban size={14} /> {project.sprint} | {project.squad}
              </p>
              <p className="sprint-project-meta-line">
                <CalendarClock size={14} /> {project.startDate} to {project.endDate}
              </p>

              <div className="sprint-project-stats">
                <div>
                  <p>Progress</p>
                  <strong>{project.donePoints}/{project.totalPoints} pts ({completion}%)</strong>
                </div>
                <div>
                  <p>Blockers</p>
                  <strong>{project.blockers}</strong>
                </div>
                <div>
                  <p>Contributors</p>
                  <strong>{project.contributors}</strong>
                </div>
              </div>

              <div className="sprint-project-progress-bar">
                <div style={{ width: `${completion}%` }} />
              </div>

              <div className="sprint-project-actions">
                <span className="sprint-project-link">
                  Open sprint details <ArrowRight size={15} />
                </span>
              </div>
            </button>
          );
        })}
      </section>

      {filteredProjects.length === 0 ? (
        <EmptyState
          title="No sprint projects found"
          description="Adjust search keywords or health filter to view sprint project options."
        />
      ) : null}

      <section className="sprint-summary-row">
        <article className="info-card">
          <h3><Target size={17} /> Portfolio Snapshot</h3>
          <p className="sprint-summary-copy">
            Choose any project above to open a detailed sprint page with burndown, velocity trend,
            blockers, sprint board, capacity, and scope-change visibility.
          </p>
          <div className="sprint-summary-metrics">
            <span><CheckCircle2 size={14} /> {sprintProjects.filter((p) => p.health === 'On Track').length} on-track</span>
            <span><AlertTriangle size={14} /> {sprintProjects.reduce((acc, p) => acc + p.blockers, 0)} total blockers</span>
            <span><Users size={14} /> {sprintProjects.reduce((acc, p) => acc + p.contributors, 0)} total contributors</span>
          </div>
        </article>
      </section>
    </div>
  );
};

export default Sprints;
