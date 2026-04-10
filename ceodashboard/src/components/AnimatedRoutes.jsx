import React, { Suspense, lazy } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import PageTransition from './PageTransition';
import PageLoader from './common/PageLoader';
import { sprintProjects } from '../pages/Sprints/sprintData';

const Home = lazy(() => import('./Home/Home'));
const Project = lazy(() => import('../pages/Project/project'));
const Employees = lazy(() => import('../pages/Employees/Employees'));
const Sprints = lazy(() => import('../pages/Sprints/Sprints'));
const SprintProjectSprints = lazy(() => import('../pages/Sprints/SprintProjectSprints'));
const SprintProjectDetail = lazy(() => import('../pages/Sprints/SprintProjectDetail'));
const SprintMemberDetail = lazy(() => import('../pages/Sprints/SprintMemberDetail'));
const Settings = lazy(() => import('../pages/Settings/Settings'));
const defaultSprintProjectId = sprintProjects[0]?.id || 'data-analytics-engine';

const wrappedPage = (Component, title) => (
  <PageTransition>
    <Suspense fallback={<PageLoader title={`Loading ${title}...`} />}>
      <Component />
    </Suspense>
  </PageTransition>
);

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={wrappedPage(Home, 'Dashboard')} />
        <Route path="/overview/dashboard" element={wrappedPage(Home, 'Dashboard')} />
        <Route path="/projects" element={wrappedPage(Project, 'Project Overview')} />
        <Route path="/projects/:projectId" element={wrappedPage(Project, 'Project Detail')} />
        <Route path="/sprints" element={<Navigate to={`/sprints/${defaultSprintProjectId}`} replace />} />
        <Route path="/sprints/dashboard" element={wrappedPage(Sprints, 'Sprint Explorer')} />
        <Route path="/sprints/member/:memberName" element={wrappedPage(SprintMemberDetail, 'Member Progress')} />
        <Route path="/sprints/:projectId" element={wrappedPage(SprintProjectSprints, 'Project Sprint List')} />
        <Route path="/sprints/:projectId/:sprintId" element={wrappedPage(SprintProjectDetail, 'Sprint Detail')} />
        <Route path="/employees/*" element={wrappedPage(Employees, 'People Health')} />
        <Route path="/settings" element={wrappedPage(Settings, 'Settings')} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
