import React from 'react';
import { ChevronRight, CircleUserRound, Star } from 'lucide-react';
import {
  activeProjects,
  alerts,
  departmentDistribution,
  formatPercent,
  kpiCards,
  projectStatusTone,
  topPerformers,
  trendLabels,
  trendValues,
} from '../teamData';

const OverviewTab = () => {
  const maxDeptCount = Math.max(...departmentDistribution.map((item) => item.count));

  const chartPoints = trendValues
    .map((value, index) => {
      const x = 32 + index * 92;
      const y = 220 - ((value - 200) / 60) * 168;
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `32,220 ${chartPoints} 492,220`;

  return (
    <div className="tm-overview-root">
      <section className="tm-kpi-grid">
        {kpiCards.map((card) => (
          <article key={card.title} className="tm-kpi-card tm-anim-card">
            <span className={`tm-kpi-icon ${card.tone}`}>
              <CircleUserRound size={16} />
            </span>
            <p>{card.title}</p>
            <h3>{card.value}</h3>
            <small>{card.delta}</small>
          </article>
        ))}
      </section>

      <section className="tm-overview-grid">
            <article className="tm-panel tm-trend-panel tm-anim-panel">
          <div className="tm-panel-head">
            <div>
              <h3>Headcount Growth Trend</h3>
              <p>Monthly employee count across all departments</p>
            </div>
            <div className="tm-panel-meta">
              <span><i /> Total</span>
              <button type="button">6 Months</button>
            </div>
          </div>

              <svg viewBox="0 0 520 250" className="tm-chart" aria-label="Headcount growth chart">
            {[200, 215, 230, 245, 260].map((tick) => {
              const y = 220 - ((tick - 200) / 60) * 168;
              return (
                <g key={tick}>
                  <line x1="30" y1={y} x2="500" y2={y} />
                  <text x="6" y={y + 4}>{tick}</text>
                </g>
              );
            })}
                <polygon className="tm-trend-area" points={areaPoints} />
                <polyline className="tm-trend-line" points={chartPoints} />
            {trendValues.map((value, index) => {
              const x = 32 + index * 92;
              const y = 220 - ((value - 200) / 60) * 168;
              return (
                    <g key={`${value}-${index}`} className="tm-trend-point">
                      <circle cx={x} cy={y} r="5" style={{ '--point-delay': `${index * 110}ms` }} />
                  <text x={x - 8} y="242">{trendLabels[index]}</text>
                </g>
              );
            })}
          </svg>
        </article>

        <article className="tm-panel tm-anim-panel">
          <h3>Department Distribution</h3>
          <p className="tm-muted">247 total across 8 teams</p>
          <ul className="tm-dept-list">
            {departmentDistribution.map((dept) => (
              <li key={dept.name}>
                <span>{dept.name}</span>
                <div className="tm-bar-wrap">
                  <div
                    className="tm-bar"
                    style={{ '--bar-width': formatPercent((dept.count / maxDeptCount) * 100), backgroundColor: dept.color }}
                  />
                </div>
                <strong>{dept.count}</strong>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="tm-overview-grid tm-overview-lower">
        <article className="tm-panel tm-anim-panel">
          <div className="tm-panel-title-row">
            <h3>Team Signals & Alerts</h3>
            <ChevronRight size={18} />
          </div>
          <p className="tm-muted">Requires executive attention</p>
          <ul className="tm-alert-list">
            {alerts.map((item) => (
              <li key={item.text}>
                <i className={item.color} />
                <span>{item.text}</span>
                <em className={item.color}>{item.tag}</em>
                <ChevronRight size={14} />
              </li>
            ))}
          </ul>
        </article>

        <article className="tm-panel tm-anim-panel">
          <div className="tm-panel-title-row">
            <h3>Active Projects</h3>
            <ChevronRight size={18} />
          </div>
          <p className="tm-muted">Current team workload overview</p>
          <ul className="tm-project-list">
            {activeProjects.map((project) => (
              <li key={project.name}>
                <div className="tm-project-head">
                  <span>{project.name}</span>
                  <em className={projectStatusTone[project.status] || 'on-track'}>{project.status}</em>
                </div>
                <div className="tm-progress-track">
                  <div style={{ '--progress-width': formatPercent(project.progress), backgroundColor: project.color }} />
                </div>
                <div className="tm-project-meta">
                  <span>{project.team}</span>
                  <span>{project.members} members</span>
                  <span>Due {project.due}</span>
                  <strong>{project.progress}%</strong>
                </div>
              </li>
            ))}
          </ul>
        </article>

        <article className="tm-panel tm-anim-panel">
          <div className="tm-panel-title-row">
            <h3>Top Performers</h3>
            <ChevronRight size={18} />
          </div>
          <p className="tm-muted">Highest rated this quarter</p>
          <ul className="tm-top-list">
            {topPerformers.map((person) => (
              <li key={person.name}>
                <div className={`tm-avatar ${person.tone}`}>{person.initials}</div>
                <div>
                  <strong>{person.name}</strong>
                  <p>{person.project}</p>
                </div>
                <span><Star size={14} /> {person.rating}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="tm-workforce-strip tm-anim-panel">
        <div>
          <h3>Today's Workforce at a Glance</h3>
          <p>Mar 10, 2026 • Biometric attendance system active</p>
        </div>
        <ul>
          <li><span>Present</span><strong>231</strong></li>
          <li><span>Late</span><strong>8</strong></li>
          <li><span>Absent</span><strong>6</strong></li>
          <li><span>On Leave</span><strong>2</strong></li>
          <li><span>Facial</span><strong>142</strong></li>
          <li><span>Fingerprint</span><strong>89</strong></li>
        </ul>
      </section>
    </div>
  );
};

export default OverviewTab;
