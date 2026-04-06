import React, { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import {
  activeProjects,
  alerts,
  departmentDistribution,
  members,
  topPerformers,
  headcountTrendsByYear,
} from '../teamData';

const OverviewTab = ({ onNavigateTab }) => {
  const [hoveredTrendIndex, setHoveredTrendIndex] = useState(null);
  const navigate = useNavigate();

  const currentTrend = headcountTrendsByYear[2026];
  const trendValues = currentTrend?.values || [];
  const trendLabels = currentTrend?.labels || [];
  const departmentTotal = members.length;

  const yScale = useMemo(() => {
    const minValue = 200;
    const maxValue = 260;
    const range = maxValue - minValue || 1;
    return (value) => 220 - ((value - minValue) / range) * 168;
  }, []);

  const yTicks = [200, 215, 230, 245, 260];

  const xStep = trendValues.length > 1 ? 460 / (trendValues.length - 1) : 0;

  const trendGrowth = useMemo(
    () => trendValues.map((value, index) => (index === 0 ? 0 : value - trendValues[index - 1])),
    [trendValues]
  );

  const chartPoints = trendValues
    .map((value, index) => {
      const x = 32 + index * xStep;
      const y = yScale(value);
      return `${x},${y}`;
    })
    .join(' ');

  const areaPoints = `32,220 ${chartPoints} 492,220`;

  const topPerformerList = topPerformers.slice(0, 5);
  const activeProjectList = activeProjects.slice(0, 3);
  const alertsList = alerts.slice(0, 5);

  return (
    <div className="tm-overview-root tm-executive-overview-grid">
      <section className="tm-overview-grid tm-executive-top-grid">
        <article className="tm-panel tm-trend-panel tm-anim-panel tm-exec-panel-large">
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
            {yTicks.map((tick) => {
              const y = yScale(tick);
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
                x1={32 + hoveredTrendIndex * xStep}
                y1="52"
                x2={32 + hoveredTrendIndex * xStep}
                y2="220"
              />
            ) : null}
            {trendValues.map((value, index) => {
              const x = 32 + index * xStep;
              const y = yScale(value);
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

        <article className="tm-panel tm-anim-panel tm-exec-panel-small">
          <div className="tm-panel-head">
            <div>
              <h3>Department Distribution</h3>
              <p>{departmentTotal} total across 8 teams</p>
            </div>
          </div>

          <ul className="tm-dept-list">
            {departmentDistribution.map((item) => (
              <li key={item.name}>
                <span>{item.name}</span>
                <div className="tm-bar-wrap">
                  <div
                    className="tm-bar"
                    style={{ width: `${(item.count / departmentTotal) * 100}%`, background: item.color }}
                  />
                </div>
                <strong>{item.count}</strong>
              </li>
            ))}
          </ul>
        </article>
      </section>

      <section className="tm-overview-grid tm-executive-lower-grid">
        <article className="tm-panel tm-anim-panel tm-exec-panel-box">
          <div className="tm-panel-title-row">
            <div>
              <h3>Team Signals &amp; Alerts</h3>
              <p className="tm-section-purpose">Requires executive attention</p>
            </div>
            <ChevronRight size={18} />
          </div>

          <ul className="tm-alert-list">
            {alertsList.map((item) => (
              <li key={item.text}>
                <i className={item.color} />
                <span>{item.text}</span>
                <em className={item.color}>{item.tag}</em>
                <ChevronRight size={16} />
              </li>
            ))}
          </ul>
        </article>

        <article className="tm-panel tm-anim-panel tm-exec-panel-box">
          <div className="tm-panel-title-row">
            <div>
              <h3>Active Projects</h3>
              <p className="tm-section-purpose">Current team workload overview</p>
            </div>
            <ChevronRight size={18} />
          </div>

          <ul className="tm-project-list">
            {activeProjectList.map((project) => (
              <li key={project.id}>
                <button
                  type="button"
                  className="tm-project-card-btn"
                  onClick={() => navigate('/projects')}
                >
                  <div className="tm-project-head">
                    <span>{project.name}</span>
                    <em className={project.status.toLowerCase().replace(/\s+/g, '-')}>{project.status}</em>
                  </div>
                  <div className="tm-progress-track">
                    <div style={{ width: `${project.progress}%`, background: project.color }} />
                  </div>
                  <div className="tm-project-meta">
                    <span>{project.team}</span>
                    <strong>{project.members} members</strong>
                    <span>Due {project.due}</span>
                    <strong>{project.progress}%</strong>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="tm-panel tm-anim-panel tm-exec-panel-box">
          <div className="tm-panel-title-row">
            <div>
              <h3>Top Performers</h3>
              <p className="tm-section-purpose">Highest rated this quarter</p>
            </div>
            <ChevronRight size={18} />
          </div>

          <ul className="tm-top-list">
            {topPerformerList.map((person) => (
              <li key={person.name}>
                <div className={`tm-avatar ${person.tone}`}>{person.initials}</div>
                <div>
                  <strong>{person.name}</strong>
                  <p>{person.project}</p>
                </div>
                <span>☆ {person.rating}</span>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
};

export default OverviewTab;
