import React, { useMemo, useState } from 'react';
import { BellRing, CheckCircle2, Siren, ShieldAlert, TriangleAlert } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, BarChart, Bar } from 'recharts';
import PeopleHealthKpiCard from '../components/PeopleHealthKpiCard';
import PeopleHealthPanelCard from '../components/PeopleHealthPanelCard';
import { severityCounts } from '../utils/calculations';

const AlertsTab = ({ alerts }) => {
  const [severityFilter, setSeverityFilter] = useState('all');

  const filteredAlerts = useMemo(() => {
    if (severityFilter === 'all') return alerts;
    return alerts.filter((item) => item.severity === severityFilter);
  }, [alerts, severityFilter]);

  const counts = severityCounts(alerts);

  const trendData = [
    { week: 'W1', alerts: 16 },
    { week: 'W2', alerts: 14 },
    { week: 'W3', alerts: 18 },
    { week: 'W4', alerts: 13 },
    { week: 'W5', alerts: 11 },
    { week: 'W6', alerts: 12 },
  ];

  const departmentBreakdown = Object.entries(
    alerts.reduce((acc, item) => {
      acc[item.department] = (acc[item.department] || 0) + 1;
      return acc;
    }, {})
  ).map(([name, count]) => ({ name, count }));

  const kpis = [
    { title: 'Open Alerts', value: alerts.filter((item) => item.status === 'open').length, subtitle: 'Pending attention', icon: BellRing, tone: 'warning' },
    { title: 'High Priority Alerts', value: counts.high, subtitle: 'Critical staffing or risk', icon: Siren, tone: 'danger' },
    { title: 'Resolved Alerts', value: alerts.filter((item) => item.status === 'resolved').length, subtitle: 'Closed this period', icon: CheckCircle2, tone: 'success' },
    { title: 'Workforce Warnings', value: counts.medium + counts.high, subtitle: 'Risk class alerts', icon: TriangleAlert, tone: 'warning' },
    { title: 'Healthy Signals', value: counts.positive, subtitle: 'Positive movement indicators', icon: CheckCircle2, tone: 'success' },
    { title: 'Department Flags', value: departmentBreakdown.length, subtitle: 'Teams with active alerts', icon: ShieldAlert, tone: 'info' },
  ];

  return (
    <div className="ph-tab-layout">
      <section className="ph-kpi-grid">{kpis.map((item) => <PeopleHealthKpiCard key={item.title} {...item} />)}</section>

      <section className="ph-grid two-col">
        <PeopleHealthPanelCard
          title="All Alerts List"
          subtitle="Operational people risk stream"
          action={(
            <select className="ph-mini-select" value={severityFilter} onChange={(event) => setSeverityFilter(event.target.value)}>
              <option value="all">All severities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
              <option value="positive">Positive</option>
            </select>
          )}
        >
          <ul className="ph-alert-list tall">
            {filteredAlerts.map((item) => (
              <li key={item.id} className={item.severity}><span>{item.message}</span><small>{item.department} - {item.severity}</small></li>
            ))}
          </ul>
        </PeopleHealthPanelCard>

        <PeopleHealthPanelCard title="Department Alerts Breakdown" subtitle="Alert count by department">
          <div className="ph-chart-wrap">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={departmentBreakdown} margin={{ top: 8, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5edf7" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 11 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 11 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#3f89de" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </PeopleHealthPanelCard>
      </section>

      <section className="ph-grid two-col">
        <PeopleHealthPanelCard title="Alert Trend" subtitle="6 week trajectory">
          <div className="ph-chart-wrap short">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={trendData} margin={{ top: 8, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid strokeDasharray="4 4" vertical={false} stroke="#e5edf7" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#6f839e', fontSize: 12 }} />
                <Tooltip />
                <Line type="monotone" dataKey="alerts" stroke="#e26f6f" strokeWidth={2.6} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </PeopleHealthPanelCard>

        <PeopleHealthPanelCard title="Positive Signals" subtitle="Healthy operational movements">
          <ul className="ph-simple-list">
            {alerts.filter((item) => item.severity === 'positive').map((item) => (
              <li key={item.id}><div><strong>{item.message}</strong><small>{item.department}</small></div><span>Resolved</span></li>
            ))}
          </ul>
        </PeopleHealthPanelCard>
      </section>
    </div>
  );
};

export default AlertsTab;
