import React from 'react';

const PeopleHealthTabNav = ({ tabs, activeTab, onChange }) => {
  return (
    <nav className="ph-tab-nav" aria-label="People Health Sub Sections">
      {tabs.map((item) => (
        <button
          key={item.id}
          type="button"
          className={`ph-tab-chip ${activeTab === item.id ? 'active' : ''}`}
          onClick={() => onChange(item.id)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );
};

export default PeopleHealthTabNav;
