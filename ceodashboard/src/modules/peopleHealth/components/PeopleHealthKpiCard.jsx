import React from 'react';
import { TrendingDown, TrendingUp } from 'lucide-react';

const PeopleHealthKpiCard = ({ title, value, subtitle, trend, icon: Icon, tone = 'default' }) => {
  return (
    <article className={`ph-kpi-card ${tone}`}>
      <div className="ph-kpi-head">
        <div>
          <p>{title}</p>
          <h3>{value}</h3>
        </div>
        <span className="ph-kpi-icon">{Icon ? <Icon size={18} /> : null}</span>
      </div>
      <div className="ph-kpi-foot">
        <small>{subtitle}</small>
        {trend ? (
          <span className={`ph-trend ${trend.type}`}>
            {trend.type === 'down' ? <TrendingDown size={13} /> : <TrendingUp size={13} />} {trend.label}
          </span>
        ) : null}
      </div>
    </article>
  );
};

export default PeopleHealthKpiCard;
