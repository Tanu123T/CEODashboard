import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock3, TrendingUp } from 'lucide-react';

const metricIcons = {
  'Total Planned Sprints': <Activity size={22} />,
  Active: <Clock3 size={22} />,
  Completed: <CheckCircle2 size={22} />,
  Delayed: <AlertTriangle size={22} />,
  'Avg. Completion': <TrendingUp size={22} />,
};

const SprintSummaryCards = ({ metrics }) => (
  <section className="sprint-metrics-grid">
    {metrics.map((item) => (
      <article key={item.label} className="sprint-stat-card">
        <div className="sprint-stat-card-body">
          <div className="sprint-stat-card-content">
            <p>{item.label}</p>
            <h2>{item.value}</h2>
          </div>
          <span className="sprint-stat-icon">{metricIcons[item.label] || <Activity size={22} />}</span>
        </div>
      </article>
    ))}
  </section>
);

export default SprintSummaryCards;
