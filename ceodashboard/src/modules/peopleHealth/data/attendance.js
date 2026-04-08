export const attendanceSnapshot = {
  present: 228,
  absent: 9,
  leave: 7,
  late: 14,
  onBreak: 11,
  remoteActive: 62,
};

export const attendanceTrend = [
  { day: 'Mon', present: 226, absent: 11, leave: 6, late: 12 },
  { day: 'Tue', present: 229, absent: 8, leave: 7, late: 15 },
  { day: 'Wed', present: 224, absent: 10, leave: 8, late: 16 },
  { day: 'Thu', present: 232, absent: 7, leave: 7, late: 13 },
  { day: 'Fri', present: 228, absent: 9, leave: 7, late: 14 },
  { day: 'Sat', present: 214, absent: 16, leave: 8, late: 12 },
  { day: 'Sun', present: 0, absent: 0, leave: 0, late: 0 },
];

export const workforceTrendByMonth = {
  'Apr 2026': [
    { period: 'W1', present: 226, absent: 11, leave: 6, late: 12 },
    { period: 'W2', present: 229, absent: 8, leave: 7, late: 15 },
    { period: 'W3', present: 224, absent: 10, leave: 8, late: 16 },
    { period: 'W4', present: 232, absent: 7, leave: 7, late: 13 },
  ],
  'Mar 2026': [
    { period: 'W1', present: 222, absent: 12, leave: 7, late: 14 },
    { period: 'W2', present: 225, absent: 10, leave: 7, late: 15 },
    { period: 'W3', present: 221, absent: 11, leave: 9, late: 17 },
    { period: 'W4', present: 227, absent: 9, leave: 8, late: 14 },
  ],
  'Feb 2026': [
    { period: 'W1', present: 218, absent: 13, leave: 8, late: 16 },
    { period: 'W2', present: 220, absent: 12, leave: 8, late: 15 },
    { period: 'W3', present: 219, absent: 11, leave: 9, late: 14 },
    { period: 'W4', present: 223, absent: 10, leave: 8, late: 13 },
  ],
};

export const repeatedLateOrAbsent = [
  { name: 'Ryan O Brien', department: 'Sales', issue: '3 late check-ins this week' },
  { name: 'Maya Singh', department: 'Design', issue: '2 absences in 10 days' },
  { name: 'Sofia Garcia', department: 'Marketing', issue: 'Extended leave overlap with campaign sprint' },
];
