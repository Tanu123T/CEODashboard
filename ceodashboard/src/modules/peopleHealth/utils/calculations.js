export const workforceHealthScore = ({ departments = [], assignments = [], attendanceSnapshot = {} }) => {
  if (!departments.length) return 0;

  const deptScore = departments.reduce((sum, item) => {
    const availability = item.headcount ? (item.active / item.headcount) * 100 : 0;
    return sum + ((availability + item.stability + item.coverage) / 3);
  }, 0) / departments.length;

  const avgLoad = assignments.length
    ? assignments.reduce((sum, item) => sum + item.taskLoad, 0) / assignments.length
    : 0;

  const loadPenalty = avgLoad > 80 ? Math.min(12, (avgLoad - 80) * 0.55) : 0;
  const attendancePenalty = attendanceSnapshot.absent ? Math.min(8, attendanceSnapshot.absent * 0.45) : 0;

  return Math.max(0, Math.round(deptScore - loadPenalty - attendancePenalty));
};

export const availabilityPercentage = (attendanceSnapshot = {}) => {
  const present = attendanceSnapshot.present || 0;
  const remote = attendanceSnapshot.remoteActive || 0;
  const absent = attendanceSnapshot.absent || 0;
  const leave = attendanceSnapshot.leave || 0;
  const total = present + absent + leave;
  if (!total) return 0;
  return Math.round(((present + Math.min(remote, present)) / (total + present)) * 100);
};

export const departmentHealthScore = (department) => {
  if (!department) return 0;
  const availability = department.headcount ? (department.active / department.headcount) * 100 : 0;
  return Math.round((availability * 0.35) + (department.stability * 0.35) + (department.coverage * 0.3));
};

export const highWorkloadEmployees = ({ assignments = [], threshold = 85 }) => {
  return assignments.filter((item) => item.taskLoad >= threshold);
};

export const lowAvailabilityRisk = ({ attendanceSnapshot = {}, employees = [] }) => {
  const total = employees.length || 1;
  const unavailable = (attendanceSnapshot.absent || 0) + (attendanceSnapshot.leave || 0);
  return Math.round((unavailable / total) * 100);
};

export const roleCoverageScore = (departments = []) => {
  if (!departments.length) return 0;
  return Math.round(departments.reduce((sum, item) => sum + item.coverage, 0) / departments.length);
};

export const projectLoadBalance = (projects = []) => {
  if (!projects.length) return 0;
  const projectRatios = projects.map((project) => {
    if (!project.required) return 100;
    return Math.min(100, Math.round((project.assigned / project.required) * 100));
  });
  return Math.round(projectRatios.reduce((sum, value) => sum + value, 0) / projectRatios.length);
};

export const mostPressuredTeams = ({ departments = [] }) => {
  return [...departments]
    .sort((a, b) => b.workload - a.workload)
    .slice(0, 3)
    .map((item) => ({
      name: item.name,
      workload: item.workload,
      stability: item.stability,
      coverage: item.coverage,
    }));
};

export const attendanceConsistency = (attendanceTrend = []) => {
  const activeDays = attendanceTrend.filter((item) => item.present > 0);
  if (!activeDays.length) return 0;

  const presentValues = activeDays.map((item) => item.present);
  const avgPresent = presentValues.reduce((sum, value) => sum + value, 0) / presentValues.length;
  const variance = presentValues.reduce((sum, value) => sum + (value - avgPresent) ** 2, 0) / presentValues.length;
  const normalizedVariance = Math.min(20, Math.sqrt(variance));

  return Math.max(0, Math.round(100 - normalizedVariance));
};

export const severityCounts = (alerts = []) => {
  return alerts.reduce(
    (acc, alert) => {
      const severity = alert.severity || 'medium';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    },
    { high: 0, medium: 0, low: 0, positive: 0 }
  );
};

export const getUniqueValues = (items = [], key) => {
  const values = new Set(items.map((item) => item[key]).filter(Boolean));
  return ['All', ...values];
};
