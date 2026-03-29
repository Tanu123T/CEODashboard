import React from 'react';
import { Calendar } from 'lucide-react';

const TopBar = ({ title, subtitle, eyebrow = 'Executive overview', pill }) => {
  return (
    <header className="tm-header tm-header-welcome">
      <div className="tm-header-copy">
        <p className="tm-header-eyebrow">{eyebrow}</p>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="tm-header-actions">
        {pill ? (
          <div className="tm-header-pill">
            <Calendar size={16} />
            <span>{pill}</span>
          </div>
        ) : null}
      </div>
    </header>
  );
};

export default TopBar;
