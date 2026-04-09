import React from 'react';
import { Activity, ShieldCheck, ShieldX } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import PeopleHealthKpiCard from '../components/PeopleHealthKpiCard';
import PeopleHealthPanelCard from '../components/PeopleHealthPanelCard';

const TeamStabilityTab = ({ summary, departments, stableTeams, unstableTeams }) => {

  const kpis = [
    { title: 'Stable Teams', value: stableTeams.length, subtitle: 'Above target stability index', icon: ShieldCheck, tone: 'success' },
    { title: 'Teams Under Pressure', value: unstableTeams.length, subtitle: 'Need intervention', icon: ShieldX, tone: 'danger' },
    { title: 'Assignment Stability', value: `${summary.assignmentStability}%`, subtitle: 'Last 30 days', icon: Activity, tone: 'info' },
  ];

  return (
    <div className="ph-tab-layout">
      <section className="ph-kpi-grid ph-kpi-grid-team-stability">{kpis.map((item) => <PeopleHealthKpiCard key={item.title} {...item} />)}</section>

      <section className="ph-grid two-col">
        <PeopleHealthPanelCard title="Team Stability Comparison" subtitle="Stability score by department">
          <div className="ph-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments} margin={{ top: 8, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5edf7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="stability" fill="#3f89de" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PeopleHealthPanelCard>

        <PeopleHealthPanelCard title="Leave Distribution by Department" subtitle="Availability impact">
          <ul className="ph-progress-list">
            {departments.map((item) => {
              const leaveRatio = Math.max(0, 100 - Math.round((item.active / item.headcount) * 100));
              return (
                <li key={item.name}>
                  <div><span>{item.name}</span><strong>{leaveRatio}%</strong></div>
                  <div className="ph-progress-track"><span style={{ width: `${leaveRatio}%` }} /></div>
                </li>
              );
            })}
          </ul>
        </PeopleHealthPanelCard>
      </section>

      <section className="ph-grid two-col">
        <PeopleHealthPanelCard title="Unstable Team Watchlist" subtitle="Immediate leadership focus">
          <ul className="ph-simple-list">
            {unstableTeams.map((item) => (
              <li key={item.name}><div><strong>{item.name}</strong><small>Coverage {item.coverage}%</small></div><span>{item.stability}%</span></li>
            ))}
          </ul>
        </PeopleHealthPanelCard>

        <PeopleHealthPanelCard title="Strongest Teams" subtitle="Operationally resilient units">
          <ul className="ph-simple-list">
            {stableTeams.map((item) => (
              <li key={item.name}><div><strong>{item.name}</strong><small>Workload {item.workload}%</small></div><span>{item.stability}%</span></li>
            ))}
          </ul>
        </PeopleHealthPanelCard>
      </section>
    </div>
  );
};

export default TeamStabilityTab;
