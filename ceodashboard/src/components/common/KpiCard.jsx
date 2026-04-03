import React from 'react';
import { TrendingUp } from 'lucide-react';

const KpiCard = ({ title, value, meta, icon: Icon, tone = 'default' }) => {
  const ToneIcon = Icon || TrendingUp;

  return (
    <article className={`stat-card kpi-card-compact ${tone !== 'default' ? `kpi-tone-${tone}` : ''}`}>
      <div className="stat-main">
        <div className="stat-info">
          <h3>{title}</h3>
          <p className="kpi-value">{value}</p>
        </div>
        <div className="stat-icon-wrap">
          <ToneIcon size={20} />
        </div>
      </div>
      {meta ? <p className="stat-footer kpi-meta">{meta}</p> : null}
    </article>
  );
};

export default KpiCard;
