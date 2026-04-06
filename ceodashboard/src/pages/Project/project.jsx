import React from 'react';
import { useParams } from 'react-router-dom';
import ProjectsTab from '../../components/team/tabs/ProjectsTab';
import '../Employees/Employees.css';

const normalizeProjectId = (projectId) => {
  if (!projectId) return null;

  const normalized = projectId.toUpperCase();
  if (/^PRJ-\d{3}$/.test(normalized)) {
    return normalized;
  }

  const numericId = Number.parseInt(projectId, 10);
  if (Number.isNaN(numericId)) {
    return null;
  }

  return `PRJ-${String(numericId).padStart(3, '0')}`;
};

const Project = () => {
  const { projectId } = useParams();
  const selectedProjectId = normalizeProjectId(projectId);

  return (
    <div className="projects-page">
      <ProjectsTab
        selectedProjectId={selectedProjectId}
        projectFocusToken={selectedProjectId ? 1 : 0}
      />
    </div>
  );
};

export default Project;
