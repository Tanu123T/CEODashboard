import React from 'react';
import { Award, Star, Target, TrendingDown, TrendingUp } from 'lucide-react';

const performanceKpis = [
  { title: 'Avg Performance Score', value: '4.65', subtitle: 'Out of 5.0', tone: 'amber', icon: Star },
  { title: 'Goals Achieved', value: '92%', subtitle: 'Avg across team', tone: 'mint', icon: Target },
  { title: 'Top Performers', value: '5', subtitle: 'Score \\u2265 4.7', tone: 'lavender', icon: Award },
  { title: 'Needs Attention', value: '2', subtitle: 'Below target', tone: 'rose', icon: TrendingDown },
];

const performanceRows = [
  {
    name: 'Sarah Chen',
    department: 'Engineering',
    initials: 'SC',
    tone: 'violet',
    q1: 4.8,
    q2: 4.9,
    q3: 4.9,
    q4: 4.9,
    goals: 98,
    goalsTone: 'blue',
    review: 'Outstanding',
    reviewTone: 'outstanding',
    trend: 'up',
  },
  {
    name: 'James Wilson',
    department: 'Sales',
    initials: 'JW',
    tone: 'indigo',
    q1: 4.5,
    q2: 4.6,
    q3: 4.8,
    q4: 4.8,
    goals: 122,
    goalsTone: 'green',
    review: 'Exceeds',
    reviewTone: 'exceeds',
    trend: 'up',
  },
  {
    name: 'Priya Patel',
    department: 'Product',
    initials: 'PP',
    tone: 'emerald',
    q1: 4.7,
    q2: 4.7,
    q3: 4.8,
    q4: 4.8,
    goals: 94,
    goalsTone: 'blue',
    review: 'Exceeds',
    reviewTone: 'exceeds',
    trend: 'up',
  },
  {
    name: 'Marcus Lee',
    department: 'Marketing',
    initials: 'ML',
    tone: 'amber',
    q1: 4.5,
    q2: 4.6,
    q3: 4.7,
    q4: 4.7,
    goals: 88,
    goalsTone: 'blue',
    review: 'Meets',
    reviewTone: 'meets',
    trend: 'up',
  },
  {
    name: 'Elena Torres',
    department: 'Design',
    initials: 'ET',
    tone: 'pink',
    q1: 4.6,
    q2: 4.7,
    q3: 4.7,
    q4: 4.7,
    goals: 91,
    goalsTone: 'blue',
    review: 'Exceeds',
    reviewTone: 'exceeds',
    trend: null,
  },
  {
    name: 'David Brown',
    department: 'Finance',
    initials: 'DB',
    tone: 'slate',
    q1: 4.4,
    q2: 4.5,
    q3: 4.6,
    q4: 4.6,
    goals: 97,
    goalsTone: 'blue',
    review: 'Meets',
    reviewTone: 'meets',
    trend: 'up',
  },
  {
    name: 'Alex Kim',
    department: 'Engineering',
    initials: 'AK',
    tone: 'blue',
    q1: 4.3,
    q2: 4.4,
    q3: 4.5,
    q4: 4.5,
    goals: 85,
    goalsTone: 'blue',
    review: 'Meets',
    reviewTone: 'meets',
    trend: 'up',
  },
  {
    name: 'Li Wei',
    department: 'Engineering',
    initials: 'LW',
    tone: 'teal',
    q1: 4.5,
    q2: 4.5,
    q3: 4.6,
    q4: 4.6,
    goals: 90,
    goalsTone: 'blue',
    review: 'Exceeds',
    reviewTone: 'exceeds',
    trend: 'up',
  },
];

const radarSeries = [4.8, 4.6, 4.5, 4.6, 4.7, 4.8];
const radarLabels = ['Productivity', 'Collabo', 'Innovat', 'Leadership', 'Communication', 'Delivery'];

const departmentBars = [
  { name: 'Engineering', value: 4.7 },
  { name: 'Product', value: 4.8 },
  { name: 'Sales', value: 4.6 },
  { name: 'Design', value: 4.7 },
  { name: 'Marketing', value: 4.5 },
  { name: 'Finance', value: 4.6 },
  { name: 'HR', value: 4.4 },
  { name: 'Operations', value: 4.3 },
];

const radarPoint = (index, score, radius = 95, cx = 170, cy = 132) => {
  const angle = (-Math.PI / 2) + (index * (Math.PI * 2) / 6);
  const normalized = (score - 4) / 1;
  const r = 28 + normalized * (radius - 28);
  return {
    x: cx + r * Math.cos(angle),
    y: cy + r * Math.sin(angle),
  };
};

const buildRadarPolygon = () => radarSeries
  .map((score, index) => {
    const point = radarPoint(index, score);
    return `${point.x},${point.y}`;
  })
  .join(' ');

const gridPolygon = (level) => {
  const sizeByLevel = [28, 44, 60, 76, 95][level];
  const points = Array.from({ length: 6 }, (_, index) => {
    const angle = (-Math.PI / 2) + (index * (Math.PI * 2) / 6);
    return `${170 + sizeByLevel * Math.cos(angle)},${132 + sizeByLevel * Math.sin(angle)}`;
  });
  return points.join(' ');
};

const barTone = (value) => {
  if (value >= 4.7) return 'green';
  if (value >= 4.5) return 'blue';
  return 'amber';
};

const PerformanceTab = () => {
  return (
    <div className="tm-performance-root">
      <section className="tm-kpi-grid">
        {performanceKpis.map((item, index) => {
          const Icon = item.icon;
          return (
            <article
              key={item.title}
              className={`tm-kpi-card tm-perf-kpi-card tm-perf-anim-kpi tone-${item.tone}`}
              style={{ '--perf-index': index }}
            >
              <span className={`tm-kpi-icon ${item.tone}`}><Icon size={16} /></span>
              <p>{item.title}</p>
              <h3>{item.value}</h3>
              <small>{item.subtitle}</small>
            </article>
          );
        })}
      </section>

      <section className="tm-overview-grid tm-perf-main-grid">
        <article className="tm-panel tm-perf-table-panel tm-perf-anim-panel" style={{ '--perf-index': 0 }}>
          <h3>Individual Performance Scores</h3>
          <p className="tm-muted">Quarterly progression and goal attainment</p>

          <div className="tm-perf-table-wrap">
            <table className="tm-perf-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Q1</th>
                  <th>Q2</th>
                  <th>Q3</th>
                  <th>Q4</th>
                  <th>Goals %</th>
                  <th>Review</th>
                  <th />
                </tr>
              </thead>
              <tbody>
                {performanceRows.map((row, index) => (
                  <tr
                    key={row.name}
                    className={`tm-perf-row ${index === 0 ? 'active' : ''}`}
                    style={{ '--perf-index': index }}
                  >
                    <td>
                      <div className="tm-perf-employee-cell">
                        <span className={`tm-perf-avatar ${row.tone}`}>{row.initials}</span>
                        <div>
                          <strong>{row.name}</strong>
                          <small>{row.department}</small>
                        </div>
                      </div>
                    </td>
                    <td>{row.q1}</td>
                    <td>{row.q2}</td>
                    <td>{row.q3}</td>
                    <td>{row.q4}</td>
                    <td>
                      <div className="tm-perf-goal-cell">
                        <span className="tm-perf-goal-track">
                          <i className={row.goalsTone} style={{ width: `${Math.min(row.goals, 130)}%` }} />
                        </span>
                        <strong>{row.goals}%</strong>
                      </div>
                    </td>
                    <td>
                      <em className={`tm-perf-review ${row.reviewTone}`}>{row.review}</em>
                    </td>
                    <td>
                      {row.trend === 'up' ? (
                        <span className="tm-perf-trend-up"><TrendingUp size={15} /></span>
                      ) : (
                        <span className="tm-perf-trend-muted">\u2014</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </article>

        <article className="tm-panel tm-perf-radar-panel tm-perf-anim-panel" style={{ '--perf-index': 1 }}>
          <h3>Team Competency Radar</h3>
          <p className="tm-muted">Average across all dimensions</p>

          <svg viewBox="0 0 340 280" className="tm-perf-radar" aria-label="Team competency radar">
            {[0, 1, 2, 3, 4].map((level) => (
              <polygon key={level} points={gridPolygon(level)} className="tm-perf-radar-grid" />
            ))}
            {Array.from({ length: 6 }, (_, index) => {
              const angle = (-Math.PI / 2) + (index * (Math.PI * 2) / 6);
              const x = 170 + 95 * Math.cos(angle);
              const y = 132 + 95 * Math.sin(angle);
              return <line key={index} x1="170" y1="132" x2={x} y2={y} className="tm-perf-radar-axis" />;
            })}

            <polygon points={buildRadarPolygon()} className="tm-perf-radar-data" />

            {radarSeries.map((score, index) => {
              const point = radarPoint(index, score);
              return <circle key={`${score}-${index}`} cx={point.x} cy={point.y} r="4" className="tm-perf-radar-point" />;
            })}

            {radarLabels.map((label, index) => {
              const angle = (-Math.PI / 2) + (index * (Math.PI * 2) / 6);
              const x = 170 + 118 * Math.cos(angle);
              const y = 132 + 118 * Math.sin(angle);
              return <text key={label} x={x} y={y} textAnchor="middle" className="tm-perf-radar-label">{label}</text>;
            })}
          </svg>
        </article>
      </section>

      <section className="tm-panel tm-perf-dept-panel tm-perf-anim-panel" style={{ '--perf-index': 2 }}>
        <h3>Average Performance by Department</h3>
        <p className="tm-muted">Color coded: green \u22654.7, blue \u22654.5, amber below</p>

        <div className="tm-perf-bars-wrap">
          <svg viewBox="0 0 980 220" className="tm-perf-bars" aria-label="Average performance by department">
            {[4, 4.25, 4.5, 4.75, 5].map((tick, index) => {
              const y = 172 - ((tick - 4) / 1) * 122;
              return (
                <g key={tick}>
                  <line x1="72" y1={y} x2="940" y2={y} className="tm-perf-bars-grid" />
                  <text x="40" y={y + 4} className="tm-perf-bars-tick">{tick}</text>
                </g>
              );
            })}

            {departmentBars.map((item, index) => {
              const x = 104 + index * 108;
              const height = ((item.value - 4) / 1) * 122;
              const y = 172 - height;
              return (
                <g key={item.name} className="tm-perf-bar-group" style={{ '--perf-index': index }}>
                  <rect x={x} y={y} width="42" height={height} rx="6" className={`tm-perf-bar ${barTone(item.value)}`} />
                  <text x={x + 21} y="194" textAnchor="middle" className="tm-perf-bar-label">{item.name}</text>
                </g>
              );
            })}
          </svg>
        </div>
      </section>
    </div>
  );
};

export default PerformanceTab;
