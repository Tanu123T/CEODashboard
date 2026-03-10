import React from 'react';
import './project.css';

const Project = () => {
  return (
    <div className="project-container">
      <h1>My Projects</h1>
      <div className="projects-grid">
        <div className="project-card">
          <h3>Project 1</h3>
          <p>Description of project 1</p>
        </div>
        <div className="project-card">
          <h3>Project 2</h3>
          <p>Description of project 2</p>
        </div>
        <div className="project-card">
          <h3>Project 3</h3>
          <p>Description of project 3</p>
        </div>
      </div>
    </div>
  );
};

export default Project;
