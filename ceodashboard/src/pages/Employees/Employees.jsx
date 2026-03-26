import React, { useState } from 'react';
import './Employees.css';
import TopBar from '../../components/layout/TopBar';
import OverviewTab from '../../components/team/tabs/OverviewTab';
import MembersTab from '../../components/team/tabs/MembersTab';
import AttendanceTab from '../../components/team/tabs/AttendanceTab';
import PerformanceTab from '../../components/team/tabs/PerformanceTab';
import ProjectsTab from '../../components/team/tabs/ProjectsTab';
import { Building2, Briefcase, Clock3, TrendingUp, Users } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Overview', icon: Building2 },
  { id: 'members', label: 'Members', icon: Users, badge: '247' },
  { id: 'attendance', label: 'Attendance', icon: Clock3, live: true },
  { id: 'projects', label: 'Projects', icon: Briefcase, badge: '18' },
  { id: 'performance', label: 'Performance', icon: TrendingUp },
];

const Employees = () => {
  const [tab, setTab] = useState('overview');

  const now = new Date();
  const formatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="tm-page">
      <TopBar title="Team Management" subtitle={`Last updated: ${formatted} • ${time}`} />

      <div className="tm-tabs">
        {TABS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              className={`tm-tab ${tab === item.id ? 'active' : ''}`}
              onClick={() => setTab(item.id)}
            >
              <Icon size={18} />
              <span>{item.label}</span>
              {item.live ? <em>LIVE</em> : null}
              {item.badge ? <small>{item.badge}</small> : null}
            </button>
          );
        })}
      </div>

      {tab === 'overview' ? <OverviewTab /> : null}
      {tab === 'members' ? <MembersTab /> : null}
      {tab === 'attendance' ? <AttendanceTab /> : null}
      {tab === 'projects' ? <ProjectsTab /> : null}
      {tab === 'performance' ? <PerformanceTab /> : null}
    </div>
  );
};

export default Employees;
