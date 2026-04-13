import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CalendarClock } from 'lucide-react';
import PeopleHealthFilters from './components/PeopleHealthFilters';
import PeopleHealthTabNav from './components/PeopleHealthTabNav';
import AvailabilityTab from './tabs/AvailabilityTab';
import WorkCalendarTab from './tabs/WorkCalendarTab';
import RoleCoverageTab from './tabs/RoleCoverageTab';
// import HiringRecruitmentTab from './tabs/HiringRecruitmentTab';
import { employees } from './data/employees';
import { attendanceSnapshot, attendanceTrend, repeatedLateOrAbsent, workforceTrendByMonth } from './data/attendance';
import { departments } from './data/departments';
import { projects } from './data/projects';
import { projectAssignments } from './data/assignments';
import { peopleHealthAlerts } from './data/alerts';
import { peopleHealthBenchmarks, roleGapWatchlist } from './data/metrics';
import {
  attendanceConsistency,
  availabilityPercentage,
  departmentHealthScore,
  getUniqueValues,
  highWorkloadEmployees,
  lowAvailabilityRisk,
  mostPressuredTeams,
  projectLoadBalance,
  roleCoverageScore,
  workforceHealthScore,
} from './utils/calculations';
import { buildTabScopedData } from './utils/tabData';
import './PeopleHealth.css';

const tabItems = [
  { id: 'availability', label: 'WorkForce Health' },
  { id: 'role-coverage', label: 'Employee Hub' },
  { id: 'holiday-calendar', label: 'Work Calender' },
  // { id: 'hiring-recruitment', label: 'Org Hierarchy' },
];

const PeopleHealthPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const validTabs = useMemo(() => tabItems.map((item) => item.id), []);
  const lastUpdated = useMemo(() => new Date().toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }), []);

  const activeTab = useMemo(() => {
    const tabFromPath = location.pathname.split('/')[2];
    return validTabs.includes(tabFromPath) ? tabFromPath : 'availability';
  }, [location.pathname, validTabs]);

  useEffect(() => {
    const tabFromPath = location.pathname.split('/')[2];
    if (!validTabs.includes(tabFromPath)) {
      navigate('/employees/availability', { replace: true });
    }
  }, [location.pathname, navigate, validTabs]);

  const [filters, setFilters] = useState({
    search: '',
    department: 'All',
    project: 'All',
    timeRange: 'Last 30 days',
  });

  const filteredEmployees = useMemo(() => {
    return employees.filter((item) => {
      const query = filters.search.toLowerCase();
      const searchMatch = !query
        || item.name.toLowerCase().includes(query)
        || item.role.toLowerCase().includes(query)
        || item.department.toLowerCase().includes(query);

      const deptMatch = filters.department === 'All' || item.department === filters.department;

      return searchMatch && deptMatch;
    });
  }, [filters]);

  const filteredProjects = useMemo(() => {
    return projects.filter((item) => {
      const projectMatch = filters.project === 'All' || item.name === filters.project;
      const deptMatch = filters.department === 'All' || item.department === filters.department;
      return projectMatch && deptMatch;
    });
  }, [filters]);

  const filteredDepartments = useMemo(() => {
    return departments
      .filter((item) => filters.department === 'All' || item.name === filters.department)
      .map((item) => ({ ...item, healthScore: departmentHealthScore(item) }));
  }, [filters.department]);

  const filteredAssignments = useMemo(() => {
    const employeeIds = new Set(filteredEmployees.map((item) => item.id));
    return projectAssignments.filter((item) => employeeIds.has(item.employeeId));
  }, [filteredEmployees]);

  const filteredAlerts = useMemo(() => {
    return peopleHealthAlerts.filter((item) => filters.department === 'All' || item.department === filters.department);
  }, [filters.department]);

  const summary = useMemo(() => {
    const workforceScore = workforceHealthScore({
      departments: filteredDepartments,
      assignments: filteredAssignments,
      attendanceSnapshot,
    });

    const availability = availabilityPercentage(attendanceSnapshot);
    const highWorkloadList = highWorkloadEmployees({ assignments: filteredAssignments, threshold: peopleHealthBenchmarks.highLoadThreshold });
    const lowRisk = lowAvailabilityRisk({ attendanceSnapshot, employees: filteredEmployees });
    const coverage = roleCoverageScore(filteredDepartments);
    const loadBalance = projectLoadBalance(filteredProjects);
    const pressureTeams = mostPressuredTeams({ departments: filteredDepartments });
    const consistency = attendanceConsistency(attendanceTrend);

    const avgLoad = filteredAssignments.length
      ? Math.round(filteredAssignments.reduce((sum, item) => sum + item.taskLoad, 0) / filteredAssignments.length)
      : 0;

    const multiProjectEmployees = filteredAssignments.filter((item) => item.projects.length > 1).length;

    return {
      workforceScore,
      availability,
      highWorkloadCount: highWorkloadList.length,
      lowAvailabilityRisk: lowRisk,
      roleCoverage: coverage,
      projectLoadBalance: loadBalance,
      pressuredTeams: pressureTeams,
      attendanceConsistency: consistency,
      totalOpenTasks: filteredProjects.reduce((sum, item) => sum + item.openTasks, 0),
      overloadedTeams: filteredDepartments.filter((item) => item.workload >= 80).length,
      avgLoad,
      workloadStability: Math.max(0, 100 - Math.max(0, avgLoad - 70)),
      understaffedDepartments: filteredDepartments.filter((item) => item.coverage < peopleHealthBenchmarks.minimumCoverageThreshold).length,
      backupCoverage: Math.round(Math.min(98, coverage + 7)),
      teamCapacity: Math.round(filteredDepartments.reduce((sum, item) => sum + (item.active / item.headcount) * 100, 0) / Math.max(filteredDepartments.length, 1)),
      leaveConcentration: Math.round(((attendanceSnapshot.leave + attendanceSnapshot.absent) / Math.max(filteredEmployees.length, 1)) * 100),
      assignmentStability: Math.max(0, 100 - Math.max(0, avgLoad - 72)),
      teamRiskScore: Math.round((100 - coverage + lowRisk + Math.max(0, avgLoad - 70)) / 3),
      totalAssignedEmployees: filteredAssignments.length,
      multiProjectEmployees,
      readyNow: attendanceSnapshot.present + attendanceSnapshot.remoteActive,
      criticalGaps: roleGapWatchlist.filter((item) => item.impact === 'High').length,
      highAlerts: filteredAlerts.filter((item) => item.severity === 'high' && item.status === 'open').length,
      staffingVariance: Math.round(100 - loadBalance),
      overloadedTeamsCount: filteredDepartments.filter((item) => item.workload >= peopleHealthBenchmarks.highLoadThreshold).length,
      roleWatchlist: roleGapWatchlist,
    };
  }, [filteredDepartments, filteredAssignments, filteredProjects, filteredEmployees, filteredAlerts]);

  const tabData = useMemo(() => {
    return buildTabScopedData({
      alerts: filteredAlerts,
      projects: filteredProjects,
      assignments: filteredAssignments,
      employees: filteredEmployees,
      departments: filteredDepartments,
      roleWatchlist: roleGapWatchlist,
      highLoadThreshold: peopleHealthBenchmarks.highLoadThreshold,
    });
  }, [filteredAlerts, filteredProjects, filteredAssignments, filteredEmployees, filteredDepartments]);

  const tabContent = {
    availability: (
      <AvailabilityTab
        summary={summary}
        attendanceSnapshot={attendanceSnapshot}
        departments={filteredDepartments}
        lateWatchlist={repeatedLateOrAbsent}
        members={filteredEmployees}
      />
    ),
    'holiday-calendar': (
      <WorkCalendarTab />
    ),
    'role-coverage': (
      <RoleCoverageTab members={filteredEmployees} />
    ),
    // 'hiring-recruitment': (
    //   <HiringRecruitmentTab members={filteredEmployees} />
    // ),
  };

  return (
    <div className="ph-page-root">
      <section className="ph-header-card">
        <div>
          <h2>People Health</h2>
          <p>Workforce readiness, attendance trends, and talent continuity insights.</p>
        </div>

        <div className="ph-header-actions">
          <span className="ph-updated-pill">
            <CalendarClock size={14} />
            Last updated: {lastUpdated}
          </span>
        </div>
      </section>

      {activeTab !== 'holiday-calendar' ? (
        <PeopleHealthFilters
          activeTab={activeTab}
          filters={filters}
          setFilters={setFilters}
          departments={getUniqueValues(employees, 'department')}
          projects={['All', ...projects.map((item) => item.name)]}
          ranges={['Last 7 days', 'Last 30 days', 'Last Quarter', 'YTD']}
        />
      ) : null}

      <PeopleHealthTabNav
        tabs={tabItems}
        activeTab={activeTab}
        onChange={(tabId) => navigate(`/employees/${tabId}`)}
      />

      {tabContent[activeTab]}
    </div>
  );
};

export default PeopleHealthPage;
