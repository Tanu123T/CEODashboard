import React from 'react';

const PeopleHealthPanelCard = ({ title, subtitle, action, children, className = '' }) => {
  return (
    <article className={`ph-panel-card ${className}`.trim()}>
      <header className="ph-panel-head">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </header>
      <div className="ph-panel-content">{children}</div>
    </article>
  );
};

export default PeopleHealthPanelCard;
