import React, { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, CalendarCheck2, CalendarDays, Clock3, Coffee, Download, UserCheck, UserMinus } from 'lucide-react';
import { ResponsiveContainer, Tooltip, AreaChart, Area, Line, CartesianGrid, XAxis, YAxis } from 'recharts';
import PeopleHealthKpiCard from '../components/PeopleHealthKpiCard';
import PeopleHealthPanelCard from '../components/PeopleHealthPanelCard';

const AvailabilityTab = ({ summary, attendanceSnapshot, departments, lateWatchlist, members }) => {
  const navigate = useNavigate();
  const todayDateKey = useMemo(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
  }, []);
  const [selectedAttendanceDate, setSelectedAttendanceDate] = useState(todayDateKey);
  const attendanceDateInputRef = useRef(null);

  const selectedAttendanceDateObj = useMemo(() => {
    return new Date(`${selectedAttendanceDate}T00:00:00`);
  }, [selectedAttendanceDate]);

  const selectedAttendanceDateLabel = useMemo(() => {
    return selectedAttendanceDateObj.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }, [selectedAttendanceDateObj]);

  const totalHeadcount = departments.reduce((sum, item) => sum + item.headcount, 0);
  const headcountGrowthTrend = [
    { month: 'Jan', actual: Math.max(0, totalHeadcount - 28), target: Math.max(0, totalHeadcount - 24) },
    { month: 'Feb', actual: Math.max(0, totalHeadcount - 22), target: Math.max(0, totalHeadcount - 18) },
    { month: 'Mar', actual: Math.max(0, totalHeadcount - 16), target: Math.max(0, totalHeadcount - 14) },
    { month: 'Apr', actual: Math.max(0, totalHeadcount - 10), target: Math.max(0, totalHeadcount - 9) },
    { month: 'May', actual: Math.max(0, totalHeadcount - 4), target: Math.max(0, totalHeadcount - 4) },
    { month: 'Jun', actual: totalHeadcount, target: Math.max(0, totalHeadcount + 3) },
  ];

  const formatTime = (totalMinutes) => {
    const safeMinutes = Math.max(0, Math.min(23 * 60 + 59, Math.round(totalMinutes)));
    const hours = Math.floor(safeMinutes / 60);
    const minutes = safeMinutes % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  };

  const openAttendanceDatePicker = () => {
    const input = attendanceDateInputRef.current;
    if (!input) {
      return;
    }

    if (typeof input.showPicker === 'function') {
      input.showPicker();
      return;
    }

    input.click();
  };

  const attendanceLogs = useMemo(() => {
    const year = selectedAttendanceDateObj.getFullYear();
    const month = selectedAttendanceDateObj.getMonth() + 1;
    const day = selectedAttendanceDateObj.getDate();
    const dateSeed = (year * 10000) + (month * 100) + day;
    const isSelectedDateToday = selectedAttendanceDate === todayDateKey;

    return members.map((item, index) => {
      const leaveRule = (dateSeed + index) % 11 === 0;
      const checkInMinutes = 8 * 60 + 20 + ((dateSeed + (index * 17)) % 125);
      const workDurationMinutes = 8 * 60 + 10 + ((dateSeed + (index * 13)) % 85);
      const checkOutMinutes = checkInMinutes + workDurationMinutes;

      const derivedStatus = leaveRule
        ? 'leave'
        : checkInMinutes > (9 * 60 + 20)
          ? 'late'
          : 'present';

      const hoursValue = (workDurationMinutes / 60).toFixed(2).replace(/\.00$/, '').replace(/(\.[1-9])0$/, '$1');

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
        checkIn: derivedStatus === 'leave' ? '--' : formatTime(checkInMinutes),
        checkOut: derivedStatus === 'leave' || isSelectedDateToday ? '' : formatTime(checkOutMinutes),
        hours: derivedStatus === 'leave' || isSelectedDateToday ? '' : `${hoursValue}h`,
        status: derivedStatus,
      };
    });
  }, [members, selectedAttendanceDateObj, selectedAttendanceDate, todayDateKey]);

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
          title="Attendance Log"
          subtitle="Real-time employee check-in/out records"
          action={(
            <div className="ph-attendance-toolbar">
              <span className="ph-date-pill">{selectedAttendanceDateLabel}</span>
              <button type="button" className="ph-date-icon-btn" onClick={openAttendanceDatePicker} aria-label="Pick attendance date">
                <CalendarDays size={18} />
              </button>
              <input
                ref={attendanceDateInputRef}
                type="date"
                className="ph-date-input-hidden"
                value={selectedAttendanceDate}
                onChange={(event) => setSelectedAttendanceDate(event.target.value)}
                aria-label="Attendance date"
              />
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
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {attendanceLogs.map((item) => (
                  <tr key={item.id}>
                    <td>
                      <div 
                        className="ph-attendance-employee" 
                        onClick={() => navigate(`/employees/${item.id}`)}
                        style={{ cursor: 'pointer' }}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            navigate(`/employees/${item.id}`);
                          }
                        }}
                      >
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

      <section className="ph-full-card">
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
