import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import './Employees.css';
import TopBar from '../../components/layout/TopBar';
import OverviewTab from '../../components/team/tabs/OverviewTab';
import MembersTab from '../../components/team/tabs/MembersTab';
import AttendanceTab from '../../components/team/tabs/AttendanceTab';
import PerformanceTab from '../../components/team/tabs/PerformanceTab';
import { BarChart3, Building2, Clock3, Users } from 'lucide-react';

const TABS = [
  { id: 'overview', label: 'Executive Overview', icon: Building2 },
  { id: 'members', label: 'Workforce', icon: Users, badge: '247' },
  { id: 'performance', label: 'Performance', icon: BarChart3, badge: 'Q1' },
  { id: 'attendance', label: 'Attendance', icon: Clock3, live: true },
];

const Employees = () => {
  const [tab, setTab] = useState('overview');
  const location = useLocation();
  const navToken = location.state?.token ?? null;

  useEffect(() => {
    const navState = location.state;
    if (!navState || !navToken) return;

    if (navState.tab) {
      setTab(navState.tab === 'projects' ? 'overview' : navState.tab);
    }
  }, [location.state, navToken]);

  const now = new Date();
  const formatted = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

  const tabPanels = {
    overview: (
      <OverviewTab
        onNavigateTab={(nextTab) => {
          setTab(nextTab === 'projects' ? 'overview' : nextTab);
        }}
      />
    ),
    members: <MembersTab />,
    performance: <PerformanceTab />,
    attendance: <AttendanceTab />,
  };

  return (
    <div className="tm-page">
      <TopBar
        title="Welcome, CEO"
        subtitle="Team Management"
        pill={`Last updated: ${formatted} • ${time}`}
      />

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

      {tabPanels[tab]}
    </div>
  );
};

export default Employees;
