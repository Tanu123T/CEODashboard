import React, { useMemo, useState } from 'react';
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
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState(null);
  const maxDeptCount = Math.max(...departmentDistribution.map((item) => item.count));

  const trendGrowth = useMemo(
    () => trendValues.map((value, index) => (index === 0 ? 0 : value - trendValues[index - 1])),
    []
  );

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

              <svg
                viewBox="0 0 520 250"
                className="tm-chart"
                aria-label="Headcount growth chart"
                onMouseLeave={() => setHoveredTrendIndex(null)}
              >
            <defs>
              <linearGradient id="tmTrendFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#38bdf8" stopOpacity="0.26" />
                <stop offset="95%" stopColor="#22c55e" stopOpacity="0.02" />
              </linearGradient>
              <linearGradient id="tmTrendStroke" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#38bdf8" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
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
            {hoveredTrendIndex !== null ? (
              <line
                className="tm-trend-hover-line"
                x1={32 + hoveredTrendIndex * 92}
                y1="52"
                x2={32 + hoveredTrendIndex * 92}
                y2="220"
              />
            ) : null}
            {trendValues.map((value, index) => {
              const x = 32 + index * 92;
              const y = 220 - ((value - 200) / 60) * 168;
              const growth = trendGrowth[index];
              const growthPrefix = growth > 0 ? '+' : '';
              const hitX = Math.max(30, x - 42);
              const hitWidth = 84;
              return (
                    <g
                      key={`${value}-${index}`}
                      className={`tm-trend-point ${hoveredTrendIndex === index ? 'active' : ''}`}
                      onMouseEnter={() => setHoveredTrendIndex(index)}
                      onFocus={() => setHoveredTrendIndex(index)}
                      onBlur={() => setHoveredTrendIndex(null)}
                    >
                      <rect
                        className="tm-trend-hit-area"
                        x={hitX}
                        y="48"
                        width={hitWidth}
                        height="172"
                      />
                      <circle
                        className="tm-trend-pulse"
                        cx={x}
                        cy={y}
                        r="11"
                        style={{ '--point-delay': `${index * 110}ms` }}
                      />
                      <circle
                        className="tm-trend-dot"
                        cx={x}
                        cy={y}
                        r="5"
                        style={{ '--point-delay': `${index * 110}ms` }}
                      />
                  <text x={x - 8} y="242">{trendLabels[index]}</text>
                  <g
                    className={`tm-trend-tooltip ${hoveredTrendIndex === index ? 'active' : ''}`}
                    transform={`translate(${x - 48} ${y - 58})`}
                    aria-hidden={hoveredTrendIndex === index ? 'false' : 'true'}
                  >
                    <rect width="96" height="44" rx="10" ry="10" />
                    <text x="10" y="16" className="tm-tooltip-label">{trendLabels[index]}</text>
                    <text x="10" y="31" className="tm-tooltip-value">Headcount {value}</text>
                    <text x="95" y="31" textAnchor="end" className="tm-tooltip-growth">
                      {`${growthPrefix}${growth}`}
                    </text>
                  </g>
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
              <li key={dept.name} className="tm-overview-item">
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
              <li key={item.text} className="tm-overview-item">
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
              <li key={project.name} className="tm-overview-item">
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
              <li key={person.name} className="tm-overview-item">
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
          <li className="tm-overview-item"><span>Present</span><strong>231</strong></li>
          <li className="tm-overview-item"><span>Late</span><strong>8</strong></li>
          <li className="tm-overview-item"><span>Absent</span><strong>6</strong></li>
          <li className="tm-overview-item"><span>On Leave</span><strong>2</strong></li>
          <li className="tm-overview-item"><span>Facial</span><strong>142</strong></li>
          <li className="tm-overview-item"><span>Fingerprint</span><strong>89</strong></li>
        </ul>
      </section>
    </div>
  );
};

export default OverviewTab;
