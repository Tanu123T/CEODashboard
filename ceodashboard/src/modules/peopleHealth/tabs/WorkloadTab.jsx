import React from 'react';
import { Gauge, Layers3, ListChecks, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import PeopleHealthKpiCard from '../components/PeopleHealthKpiCard';
import PeopleHealthPanelCard from '../components/PeopleHealthPanelCard';

const WorkloadTab = ({ summary, departments, projects, overloadedEmployees }) => {

  const kpis = [
    { title: 'High Workload Employees', value: overloadedEmployees.length, subtitle: 'Above threshold task load', icon: Users, tone: 'danger' },
    { title: 'Open Tasks', value: summary.totalOpenTasks, subtitle: 'Across active projects', icon: ListChecks, tone: 'warning' },
    { title: 'Overloaded Teams', value: summary.overloadedTeams, subtitle: 'Departments >80 load index', icon: Gauge, tone: 'danger' },
    { title: 'Multi Project Employees', value: summary.multiProjectEmployees, subtitle: 'Assigned to multiple projects', icon: Layers3, tone: 'warning' },
  ];

  return (
    <div className="ph-tab-layout">
      <section className="ph-kpi-grid ph-kpi-grid-workload">{kpis.map((item) => <PeopleHealthKpiCard key={item.title} {...item} />)}</section>

      <section className="ph-grid">
        <PeopleHealthPanelCard title="Workload by Department" subtitle="Department load index">
          <div className="ph-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departments} margin={{ top: 8, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5edf7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="workload" fill="#3f89de" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PeopleHealthPanelCard>
      </section>

      <section className="ph-grid two-col">
        <PeopleHealthPanelCard title="Top Overloaded Employees" subtitle="Immediate balancing needed">
          <ul className="ph-simple-list">
            {overloadedEmployees.slice(0, 6).map((item) => (
              <li key={item.name}><div><strong>{item.name}</strong><small>{item.department}</small></div><span>{item.load}%</span></li>
            ))}
          </ul>
        </PeopleHealthPanelCard>

        <PeopleHealthPanelCard title="Project Pressure Watchlist" subtitle="High load projects">
          <ul className="ph-simple-list">
            {projects.filter((item) => item.pressure === 'high').map((item) => (
              <li key={item.id}><div><strong>{item.name}</strong><small>{item.department}</small></div><span>{item.openTasks} tasks</span></li>
            ))}
          </ul>
        </PeopleHealthPanelCard>
      </section>
    </div>
  );
};

export default WorkloadTab;
