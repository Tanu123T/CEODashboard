import React from 'react';

const PageLoader = ({ title = 'Loading dashboard...' }) => {
  return (
    <div className="dashboard-wrapper">
      <div className="table-container page-loader-wrap">
        <p className="page-loader-title">{title}</p>
        <div className="page-loader-grid">
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
