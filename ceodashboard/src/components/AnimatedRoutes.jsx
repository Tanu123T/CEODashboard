import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

import Home from './Home/Home';
import Project from '../pages/Project/project';
import Employees from '../pages/Employees/Employees';
import Sprints from '../pages/Sprints/Sprints';
import SprintProjectDetail from '../pages/Sprints/SprintProjectDetail';
import Tasks from '../pages/Tasks/Tasks';
import Settings from '../pages/Settings/Settings';
import PageTransition from './PageTransition';

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<PageTransition><Home /></PageTransition>} />
        <Route path="/projects" element={<PageTransition><Project /></PageTransition>} />
        <Route path="/employees" element={<PageTransition><Employees /></PageTransition>} />
        <Route path="/sprints" element={<PageTransition><Sprints /></PageTransition>} />
        <Route path="/sprints/:projectId" element={<PageTransition><SprintProjectDetail /></PageTransition>} />
        <Route path="/tasks" element={<PageTransition><Tasks /></PageTransition>} />
        <Route path="/settings" element={<PageTransition><Settings /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
};

export default AnimatedRoutes;
