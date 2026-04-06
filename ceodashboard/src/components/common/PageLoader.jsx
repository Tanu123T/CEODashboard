import React from 'react';

const PageLoader = ({ title = 'Loading dashboard...' }) => {
  return (
    <div className="page-loader-shell" role="status" aria-live="polite" aria-label={title}>
      <div className="page-loader-wrap">
        <div className="page-loader-brand">
          <span className="page-loader-ring" aria-hidden="true" />
          <span className="page-loader-pulse" aria-hidden="true" />
        </div>

        <p className="page-loader-title">{title}</p>
        <p className="page-loader-subtitle">Preparing charts, cards, and insights...</p>

        <div className="page-loader-dots" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <div className="page-loader-grid" aria-hidden="true">
          <div className="page-loader-skeleton large" />
          <div className="page-loader-skeleton" />
          <div className="page-loader-skeleton" />
          <div className="page-loader-skeleton" />
        </div>
      </div>
    </div>
  );
};

export default PageLoader;
