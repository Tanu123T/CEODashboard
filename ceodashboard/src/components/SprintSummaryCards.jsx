import React from 'react';
import { Activity, AlertTriangle, CheckCircle2, Clock3, TrendingUp } from 'lucide-react';

const metricIcons = {
  'Total Planned Sprints': { icon: <Activity size={22} />, colorClass: 'blue' },
  Active: { icon: <Clock3 size={22} />, colorClass: 'amber' },
  Completed: { icon: <CheckCircle2 size={22} />, colorClass: 'green' },
  Delayed: { icon: <AlertTriangle size={22} />, colorClass: 'red' },
  'Avg. Completion': { icon: <TrendingUp size={22} />, colorClass: 'teal' },
};

const SprintSummaryCards = ({ metrics }) => (
  <section className="kpi-grid sprint-metrics-grid">
    {metrics.map((item) => {
      const metricInfo = metricIcons[item.label] || { icon: <Activity size={22} />, colorClass: 'blue' };
      return (
        <article key={item.label} className="kpi-card sprint-stat-card">
          <span className={`kpi-icon sprint-stat-icon ${metricInfo.colorClass}`}>
            {metricInfo.icon}
          </span>
          <div className="sprint-stat-card-body">
            <p className="kpi-title">{item.label}</p>
            <h2 className="kpi-value">{item.value}</h2>
          </div>
        </article>
      );
    })}
  </section>
);

export default SprintSummaryCards;
