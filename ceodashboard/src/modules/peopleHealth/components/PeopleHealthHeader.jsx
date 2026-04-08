import React from 'react';
import { CalendarClock, Download, RefreshCw } from 'lucide-react';

const PeopleHealthHeader = ({ lastUpdated }) => {
  return (
    <section className="ph-header-card">
      <div>
        <h2>People Health</h2>
        <p>Workforce stability, availability and project load overview</p>
      </div>

      <div className="ph-header-actions">
        <div className="ph-updated-pill">
          <CalendarClock size={15} />
          <span>{lastUpdated}</span>
        </div>
        <button type="button" className="ph-btn ghost"><RefreshCw size={14} /> Refresh</button>
        <button type="button" className="ph-btn primary"><Download size={14} /> Export Brief</button>
      </div>
    </section>
  );
};

export default PeopleHealthHeader;
