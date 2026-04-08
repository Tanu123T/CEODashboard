export const peopleHealthBenchmarks = {
  healthyLoadThreshold: 80,
  highLoadThreshold: 85,
  minimumCoverageThreshold: 75,
  stabilityTarget: 82,
};

export const roleGapWatchlist = [
  { role: 'Senior Backend Engineer', department: 'Engineering', openNeed: 3, impact: 'High' },
  { role: 'Campaign Analyst', department: 'Marketing', openNeed: 2, impact: 'Medium' },
  { role: 'UX Researcher', department: 'Design', openNeed: 1, impact: 'Medium' },
  { role: 'Enterprise AE', department: 'Sales', openNeed: 2, impact: 'High' },
];

export const executiveSignals = [
  { title: 'Workload pressure crossing threshold in 3 teams', tone: 'high' },
  { title: 'Members below baseline in Marketing and Design', tone: 'medium' },
  { title: 'Attendance consistency stable in HR and Finance', tone: 'positive' },
  { title: 'Project allocation improved by 6% vs last month', tone: 'positive' },
];
