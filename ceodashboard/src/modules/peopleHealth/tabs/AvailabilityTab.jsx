import React, { useMemo, useState } from 'react';
import { Building2, CalendarCheck2, Clock3, Coffee, Download, UserCheck, UserMinus } from 'lucide-react';
import { ResponsiveContainer, Tooltip, AreaChart, Area, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import PeopleHealthKpiCard from '../components/PeopleHealthKpiCard';
import PeopleHealthPanelCard from '../components/PeopleHealthPanelCard';

const AvailabilityTab = ({ summary, attendanceSnapshot, departments, lateWatchlist, members }) => {
  const [attendanceFilter, setAttendanceFilter] = useState('all');
  const totalHeadcount = departments.reduce((sum, item) => sum + item.headcount, 0);
  const headcountGrowthTrend = [
    { month: 'Jan', actual: Math.max(0, totalHeadcount - 28), target: Math.max(0, totalHeadcount - 24) },
    { month: 'Feb', actual: Math.max(0, totalHeadcount - 22), target: Math.max(0, totalHeadcount - 18) },
    { month: 'Mar', actual: Math.max(0, totalHeadcount - 16), target: Math.max(0, totalHeadcount - 14) },
    { month: 'Apr', actual: Math.max(0, totalHeadcount - 10), target: Math.max(0, totalHeadcount - 9) },
    { month: 'May', actual: Math.max(0, totalHeadcount - 4), target: Math.max(0, totalHeadcount - 4) },
    { month: 'Jun', actual: totalHeadcount, target: Math.max(0, totalHeadcount + 3) },
  ];

  const checkIn = ['08:52', '09:41', '08:30', '09:00', '10:05', '08:45', '09:00', '08:30', '10:15', '08:55', '09:05', '08:40'];
  const checkOut = ['18:10', '19:05', '17:45', '18:30', '18:45', '--', '--', '--', '18:05', '--', '17:55', '18:20'];
  const hoursWorked = ['9.3h', '9.4h', '9.25h', '9.5h', '8.67h', '--', '--', '--', '7.83h', '--', '8.83h', '9.67h'];
  const devicePool = ['CAM-SF-01', 'FP-NY-02', 'CAM-SF-01', 'FP-AU-01', 'CAM-REMOTE-03', '--', '--', '--'];

  const attendanceLogs = useMemo(() => {
    return members.map((item, index) => {
      const derivedStatus = item.status === 'leave'
        ? 'leave'
        : index % 7 === 1
          ? 'late'
          : 'present';

      return {
        id: item.id,
        name: item.name,
        initials: item.name
          .split(' ')
          .filter(Boolean)
          .slice(0, 2)
          .map((part) => part[0])
          .join(''),
        employeeCode: item.id.replace('-', ''),
        department: item.department,
        checkIn: derivedStatus === 'leave' ? '--' : checkIn[index % checkIn.length],
        checkOut: derivedStatus === 'leave' ? '--' : checkOut[index % checkOut.length],
        hours: derivedStatus === 'leave' ? '--' : hoursWorked[index % hoursWorked.length],
        device: derivedStatus === 'leave' ? '--' : devicePool[index % devicePool.length],
        status: derivedStatus,
      };
    });
  }, [members]);

  const visibleAttendanceLogs = attendanceLogs.filter((item) => {
    return attendanceFilter === 'all' ? true : item.status === attendanceFilter;
  });

  const kpis = [
    { title: 'Present Today', value: attendanceSnapshot.present, subtitle: 'Checked in and active', icon: UserCheck, tone: 'success' },
    { title: 'On Break', value: attendanceSnapshot.onBreak || 0, subtitle: 'Temporarily unavailable', icon: Coffee, tone: 'info' },
    { title: 'On Leave', value: attendanceSnapshot.leave, subtitle: 'Planned leaves in effect', icon: CalendarCheck2, tone: 'warning' },
    { title: 'Late Arrivals', value: attendanceSnapshot.late, subtitle: 'Past shift start threshold', icon: Clock3, tone: 'warning' },
    { title: 'Present in Office', value: Math.max(0, attendanceSnapshot.present - attendanceSnapshot.remoteActive), subtitle: 'On-site and active', icon: Building2, tone: 'success' },
    { title: 'Attendance Consistency', value: `${summary.attendanceConsistency}%`, subtitle: 'Last 7 operational days', icon: UserMinus, tone: 'success' },
  ];

  return (
    <div className="ph-tab-layout">
      <section className="ph-kpi-grid">
        {kpis.map((item) => <PeopleHealthKpiCard key={item.title} {...item} />)}
      </section>

      <section className="ph-grid">
        <PeopleHealthPanelCard title="Headcount Growth Trend" subtitle="Monthly movement versus hiring target">
          <div className="ph-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={headcountGrowthTrend} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                <defs>
                  <linearGradient id="headcountFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3f89de" stopOpacity={0.26} />
                    <stop offset="95%" stopColor="#3f89de" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5edf7" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 12 }} />
                <Tooltip formatter={(value) => [`${value} employees`, '']} />
                <Area type="monotone" dataKey="actual" stroke="#3f89de" fill="url(#headcountFill)" strokeWidth={2.8} />
                <Line type="monotone" dataKey="target" stroke="#2db18c" strokeWidth={2.2} strokeDasharray="6 4" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PeopleHealthPanelCard>
      </section>

      <section className="ph-full-card">
        <PeopleHealthPanelCard
          title="Today's Attendance Log"
          subtitle="Real-time employee check-in/out records"
          action={(
            <div className="ph-attendance-toolbar">
              <select
                className="ph-mini-select"
                value={attendanceFilter}
                onChange={(event) => setAttendanceFilter(event.target.value)}
              >
                <option value="all">All</option>
                <option value="present">Present</option>
                <option value="late">Late</option>
                <option value="leave">On Leave</option>
              </select>
              <button type="button" className="ph-btn ghost">
                <Download size={14} />
                Export
              </button>
            </div>
          )}
        >
          <div className="ph-attendance-table-wrap">
            <table className="ph-attendance-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Check-In</th>
                  <th>Check-Out</th>
                  <th>Hours</th>
                  <th>Device</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {visibleAttendanceLogs.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div className="ph-attendance-employee">
                        <span className="ph-attendance-avatar" aria-hidden="true">{item.initials}</span>
                        <div>
                          <strong>{item.name}</strong>
                          <small>{item.employeeCode}</small>
                        </div>
                      </div>
                    </td>
                    <td>{item.department}</td>
                    <td>{item.checkIn}</td>
                    <td>{item.checkOut}</td>
                    <td>{item.hours}</td>
                    <td>{item.device}</td>
                    <td>
                      <span className={`ph-attendance-status ${item.status}`}>
                        {item.status === 'present' ? 'Present' : item.status === 'late' ? 'Late' : 'On Leave'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </PeopleHealthPanelCard>
      </section>

      <section className="ph-grid two-col">
        <PeopleHealthPanelCard title="Department Availability Comparison" subtitle="Active ratio by department">
          <ul className="ph-progress-list">
            {departments.map((item) => {
              const ratio = Math.round((item.active / item.headcount) * 100);
              return (
                <li key={item.name}>
                  <div>
                    <span>{item.name}</span>
                    <strong>{ratio}%</strong>
                  </div>
                  <div className="ph-progress-track"><span style={{ width: `${ratio}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </PeopleHealthPanelCard>

        <PeopleHealthPanelCard title="Repeated Late and Absence Watchlist" subtitle="Requires manager action">
          <ul className="ph-alert-list">
            {lateWatchlist.map((item) => (
              <li key={item.name} className="medium">
                <span>{item.name} - {item.issue}</span>
                <small>{item.department}</small>
              </li>
            ))}
          </ul>
        </PeopleHealthPanelCard>
      </section>

    </div>
  );
};

export default AvailabilityTab;
