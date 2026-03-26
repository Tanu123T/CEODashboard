import React from 'react';
import { Bell, TrendingUp } from 'lucide-react';

const TopBar = ({ title, subtitle }) => {
  return (
    <header className="tm-header">
      <div>
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>

      <div className="tm-header-actions">
        <button type="button" className="tm-header-icon" aria-label="Insights">
          <TrendingUp size={18} />
        </button>
        <button type="button" className="tm-header-icon" aria-label="Notifications">
          <Bell size={18} />
        </button>
        <div className="tm-profile">
          <span className="tm-profile-avatar">JR</span>
          <div>
            <strong>Jahangir</strong>
            <p>CEO</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
