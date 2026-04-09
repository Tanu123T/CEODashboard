const dedupeBy = (items = [], getKey) => {
  const seen = new Set();
  return items.filter((item) => {
    const key = getKey(item);
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
};

export const buildTabScopedData = ({
  alerts = [],
  projects = [],
  assignments = [],
  employees = [],
  departments = [],
  roleWatchlist = [],
  highLoadThreshold = 85,
}) => {
  const employeeById = new Map(employees.map((item) => [item.id, item]));

  const overloadedEmployees = dedupeBy(
    assignments
      .filter((item) => item.taskLoad >= highLoadThreshold)
      .map((item) => {
        const employee = employeeById.get(item.employeeId);
        return {
          id: item.employeeId,
          name: employee?.name || item.employeeId,
          department: employee?.department || 'N/A',
          load: item.taskLoad,
        };
      }),
    (item) => item.id
  );

  const overviewAlerts = dedupeBy(
    alerts.filter((item) => ['staffing-gap', 'availability-risk'].includes(item.type)).slice(0, 5),
    (item) => item.id
  );

  const availabilityAlerts = dedupeBy(
    alerts.filter((item) => item.type === 'availability-risk' || item.type === 'healthy-signal'),
    (item) => item.id
  );

  const workloadAlerts = dedupeBy(
    alerts.filter((item) => item.type === 'workload-pressure'),
    (item) => item.id
  );

  const roleCoverageAlerts = dedupeBy(
    alerts.filter((item) => item.type === 'role-coverage' || item.type === 'staffing-gap'),
    (item) => item.id
  );

  const stabilityAlerts = dedupeBy(
    alerts.filter((item) => item.type === 'availability-risk' || item.type === 'healthy-signal'),
    (item) => item.id
  );

  const overviewProjects = dedupeBy(projects.slice(0, 4), (item) => item.id);
  const pressureProjects = dedupeBy(projects.filter((item) => item.pressure === 'high'), (item) => item.id);

  const stableTeams = dedupeBy(departments.filter((item) => item.stability >= 85), (item) => item.name);
  const unstableTeams = dedupeBy(departments.filter((item) => item.stability < 78), (item) => item.name);

  return {
    overview: {
      alerts: overviewAlerts,
      projects: overviewProjects,
    },
    availability: {
      alerts: availabilityAlerts,
    },
    workload: {
      alerts: workloadAlerts,
      overloadedEmployees,
      pressureProjects,
    },
    roleCoverage: {
      alerts: roleCoverageAlerts,
      staffingGapWatchlist: dedupeBy(roleWatchlist, (item) => `${item.role}-${item.department}`),
      criticalRoleWatchlist: dedupeBy(
        roleWatchlist.filter((item) => item.impact === 'High'),
        (item) => `${item.role}-${item.department}`
      ),
    },
    teamStability: {
      alerts: stabilityAlerts,
      stableTeams,
      unstableTeams,
    },
    alerts: {
      all: dedupeBy(alerts, (item) => item.id),
    },
  };
};
