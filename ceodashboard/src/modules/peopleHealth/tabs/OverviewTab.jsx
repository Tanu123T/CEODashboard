import React, { useMemo, useState } from 'react';
import { AlertTriangle, ShieldCheck, UserCheck, UsersRound } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import PeopleHealthKpiCard from '../components/PeopleHealthKpiCard';
import PeopleHealthPanelCard from '../components/PeopleHealthPanelCard';

const OverviewTab = ({ summary, trendData, trendByMonth, departments }) => {
  const monthOptions = useMemo(() => {
    const months = Object.keys(trendByMonth || {});
    return months.sort((a, b) => {
      const aDate = new Date(`1 ${a}`);
      const bDate = new Date(`1 ${b}`);
      if (Number.isNaN(aDate.getTime()) || Number.isNaN(bDate.getTime())) {
        return 0;
      }
      return bDate - aDate;
    });
  }, [trendByMonth]);

  const [selectedMonth, setSelectedMonth] = useState('recent');

  const chartData = useMemo(() => {
    const latestMonth = monthOptions[0];
    const latestMonthData = latestMonth ? trendByMonth?.[latestMonth] : null;

    if (selectedMonth === 'recent') {
      return latestMonthData || trendData;
    }

    if (trendByMonth?.[selectedMonth]) {
      return trendByMonth[selectedMonth];
    }

    return latestMonthData || trendData;
  }, [selectedMonth, trendByMonth, trendData, monthOptions]);

  const kpis = [
    { title: 'Workforce Health Score', value: `${summary.workforceScore}%`, subtitle: 'Composite operational score', icon: ShieldCheck, tone: 'success', trend: { type: 'up', label: '+3.2%' } },
    { title: 'Available Workforce', value: `${summary.availability}%`, subtitle: 'Employees ready for allocation', icon: UserCheck, tone: 'info', trend: { type: 'up', label: '+1.4%' } },
    { title: 'High Workload Employees', value: summary.highWorkloadCount, subtitle: 'Above healthy task threshold', icon: AlertTriangle, tone: 'warning', trend: { type: 'down', label: '-2' } },
    { title: 'Members Health', value: `${summary.roleCoverage}%`, subtitle: 'Critical role fulfillment', icon: UsersRound, tone: 'success' },
  ];

  const deptDistribution = departments.map((item) => ({
    name: item.name,
    score: item.healthScore,
    active: item.active,
    headcount: item.headcount,
  }));

  return (
    <div className="ph-tab-layout">
      <section className="ph-kpi-grid ph-kpi-grid-overview">
        {kpis.map((item) => (
          <PeopleHealthKpiCard key={item.title} {...item} />
        ))}
      </section>

      <section className="ph-grid two-col">
        <PeopleHealthPanelCard
          title="Workforce Availability Trend"
          subtitle="Present, leave and absence movement"
          action={(
            <select className="ph-mini-select" value={selectedMonth} onChange={(event) => setSelectedMonth(event.target.value)}>
              <option value="recent">Recent</option>
              {monthOptions.map((month) => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          )}
        >
          <div className="ph-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="presentFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#27b38f" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="#27b38f" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5edf7" />
                <XAxis dataKey={chartData?.[0]?.period ? 'period' : 'day'} axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 12 }} />
                <Tooltip />
                <Area type="monotone" dataKey="present" stroke="#27b38f" fill="url(#presentFill)" strokeWidth={2.6} />
                <Area type="monotone" dataKey="absent" stroke="#e66a6a" fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="leave" stroke="#f3ac38" fill="transparent" strokeWidth={2} />
                <Area type="monotone" dataKey="late" stroke="#5a8fdc" fill="transparent" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </PeopleHealthPanelCard>

        <PeopleHealthPanelCard title="Department Health Distribution" subtitle="Operational health by team">
          <ul className="ph-progress-list">
            {deptDistribution.map((item) => (
              <li key={item.name}>
                <div>
                  <span>{item.name}</span>
                  <strong>{item.score}% ({item.active}/{item.headcount})</strong>
                </div>
                <div className="ph-progress-track"><span style={{ width: `${item.score}%` }} /></div>
              </li>
            ))}
          </ul>
        </PeopleHealthPanelCard>
      </section>

      <section className="ph-full-card">
        <PeopleHealthPanelCard title="Today People Health at a Glance" subtitle="Live operational summary">
          <div className="ph-glance-grid">
            <article><p>Ready for Assignment</p><h4>{summary.readyNow}</h4></article>
            <article><p>Critical Coverage Gaps</p><h4>{summary.criticalGaps}</h4></article>
            <article><p>Active High Severity Alerts</p><h4>{summary.highAlerts}</h4></article>
            <article><p>Project Staffing Variance</p><h4>{summary.staffingVariance}%</h4></article>
            <article><p>Teams Above Load Threshold</p><h4>{summary.overloadedTeams}</h4></article>
            <article><p>Attendance Consistency</p><h4>{summary.attendanceConsistency}%</h4></article>
          </div>
        </PeopleHealthPanelCard>
      </section>

      <section className="ph-grid">
        <PeopleHealthPanelCard title="Resource Pressure Breakdown" subtitle="Pressure share by department">
          <div className="ph-chart-wrap short">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments} margin={{ top: 8, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5edf7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="workload" radius={[8, 8, 0, 0]}>
                  {departments.map((item) => (
                    <Cell key={item.name} fill={item.workload > 82 ? '#eb6f6f' : '#3f89de'} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PeopleHealthPanelCard>
      </section>
    </div>
  );
};

export default OverviewTab;
