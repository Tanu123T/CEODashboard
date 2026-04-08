import React from 'react';
import { Briefcase, GitFork, Layers, ListTodo, Scale, Users } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';
import PeopleHealthKpiCard from '../components/PeopleHealthKpiCard';
import PeopleHealthPanelCard from '../components/PeopleHealthPanelCard';

const ProjectAllocationTab = ({ summary, projects, assignments, employees, alerts }) => {
  const insufficientProjects = projects.filter((item) => item.assigned < item.required);
  const multiProject = assignments.filter((item) => item.projects.length > 1);

  const kpis = [
    { title: 'Total Assigned Employees', value: summary.totalAssignedEmployees, subtitle: 'On active projects', icon: Users, tone: 'info' },
    { title: 'Multi Project Employees', value: multiProject.length, subtitle: 'Shared resources', icon: Layers, tone: 'warning' },
    { title: 'Understaffed Projects', value: insufficientProjects.length, subtitle: 'Required headcount not met', icon: Briefcase, tone: 'danger' },
    { title: 'Average Project Load', value: `${summary.avgLoad}%`, subtitle: 'Allocation intensity', icon: ListTodo, tone: 'warning' },
    { title: 'Allocation Balance', value: `${summary.projectLoadBalance}%`, subtitle: 'Distribution fairness', icon: Scale, tone: 'success' },
    { title: 'Shared Resource Count', value: multiProject.length, subtitle: 'Cross project overlap', icon: GitFork, tone: 'info' },
  ];

  const projectChartData = projects.map((item) => ({ name: item.name.slice(0, 12), assigned: item.assigned, required: item.required }));

  const overlapList = multiProject.map((item) => {
    const person = employees.find((employee) => employee.id === item.employeeId);
    return { name: person?.name || item.employeeId, projects: item.projects.length };
  });

  return (
    <div className="ph-tab-layout">
      <section className="ph-kpi-grid">{kpis.map((item) => <PeopleHealthKpiCard key={item.title} {...item} />)}</section>

      <section className="ph-grid two-col">
        <PeopleHealthPanelCard title="Project Allocation Chart" subtitle="Assigned vs required headcount">
          <div className="ph-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectChartData} margin={{ top: 8, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5edf7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="required" fill="#a8bed7" radius={[8, 8, 0, 0]} />
                <Bar dataKey="assigned" fill="#2db18c" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PeopleHealthPanelCard>

        <PeopleHealthPanelCard title="Employee Load by Project" subtitle="Open tasks and assigned workforce">
          <ul className="ph-simple-list">
            {projects.map((item) => (
              <li key={item.id}><div><strong>{item.name}</strong><small>{item.assigned}/{item.required} people</small></div><span>{item.openTasks} tasks</span></li>
            ))}
          </ul>
        </PeopleHealthPanelCard>
      </section>

      <section className="ph-grid three-col">
        <PeopleHealthPanelCard title="Insufficiently Staffed Projects" subtitle="Headcount shortfall">
          <ul className="ph-simple-list">
            {insufficientProjects.map((item) => (
              <li key={item.id}><div><strong>{item.name}</strong><small>{item.department}</small></div><span>{item.required - item.assigned} short</span></li>
            ))}
          </ul>
        </PeopleHealthPanelCard>

        <PeopleHealthPanelCard title="Assignment Overlap" subtitle="Shared employee allocation">
          <ul className="ph-simple-list">
            {overlapList.map((item) => (
              <li key={item.name}><div><strong>{item.name}</strong><small>Shared resource</small></div><span>{item.projects} projects</span></li>
            ))}
          </ul>
        </PeopleHealthPanelCard>

        <PeopleHealthPanelCard title="Allocation Signals and Alerts" subtitle="Allocation quality insights">
          <ul className="ph-alert-list">
            {alerts.filter((item) => item.type === 'allocation-balance' || item.type === 'staffing-gap').map((item) => (
              <li key={item.id} className={item.severity}><span>{item.message}</span><small>{item.department}</small></li>
            ))}
          </ul>
        </PeopleHealthPanelCard>
      </section>
    </div>
  );
};

export default ProjectAllocationTab;
