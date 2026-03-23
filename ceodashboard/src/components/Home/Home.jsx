import React from "react";
import "./Home.css";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import {
  Calendar,
  Users,
  DollarSign,
  Clock,
  AlertCircle,
  TrendingUp,
  LayoutDashboard,
  ArrowUpRight,
  CheckCircle2,
  TriangleAlert,
  CircleDashed,
  Briefcase
} from "lucide-react";

const revenueData = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 180 },
  { month: 'Mar', value: 160 },
  { month: 'Apr', value: 240 },
  { month: 'May', value: 210 },
  { month: 'Jun', value: 340 },
];

const projectStatus = [
  { name: 'Completed', value: 45, color: '#22c55e' },
  { name: 'Active', value: 35, color: '#38bdf8' },
  { name: 'Delayed', value: 20, color: '#e74c3c' },
];

const statsData = [
  {
    label: 'Total Revenue',
    value: '₹3.4Cr',
    meta: '+8.2% vs last month',
    icon: DollarSign,
  },
  {
    label: 'Total Employees',
    value: '148',
    meta: '+6 new hires this month',
    icon: Users,
  },
  {
    label: 'Active Projects',
    value: '12',
    meta: '3 nearing delivery',
    icon: LayoutDashboard,
  },
  {
    label: 'Growth %',
    value: '+24%',
    meta: 'Strong QoQ momentum',
    icon: TrendingUp,
  },
];

const meetings = [
  {
    time: '10:30 AM',
    title: 'Client Meeting',
    details: 'Medical Tourism Platform',
  },
  {
    time: '12:00 PM',
    title: 'Team Standup',
    details: 'Development Team',
  },
  {
    time: '03:00 PM',
    title: 'Investor Call',
    details: 'Quarterly Review',
  },
];

const alerts = [
  {
    tone: 'warning',
    icon: TriangleAlert,
    title: 'Delayed Project',
    details: 'CRM System requires milestone realignment',
  },
  {
    tone: 'success',
    icon: CheckCircle2,
    title: 'Pending Payment Cleared',
    details: '₹1.5L received from enterprise client',
  },
  {
    tone: 'danger',
    icon: CircleDashed,
    title: 'Critical Bugs',
    details: '5 high-priority issues need engineering attention',
  },
];

const Home = () => {

  const today = new Date();
  const date = today.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="home">

      {/* Welcome Section */}

      <div className="welcome-section">
        <div>
          <p className="welcome-eyebrow">Executive overview</p>
          <h2>Welcome, CEO</h2>
          <p className="welcome-date">{date}</p>
        </div>

        <div className="welcome-pill">
          <Calendar size={16} />
          <span>Board review in 2 days</span>
        </div>
      </div>


      {/* Stats Cards */}

      <div className="stats-grid">
        {statsData.map((item) => {
          const Icon = item.icon;

          return (
            <div className="stat-card" key={item.label}>
              <div className="stat-icon-wrap">
                <Icon className="stat-icon" />
              </div>

              <div className="stat-copy">
                <p className="stat-label">{item.label}</p>
                <h3>{item.value}</h3>
                <p className="stat-meta">
                  <ArrowUpRight size={14} />
                  <span>{item.meta}</span>
                </p>
              </div>
            </div>
          );
        })}

      </div>

      {/* Charts Section */}
      <div className="home-charts-grid">
        <div className="chart-card">
          <div className="card-head">
            <h3>Revenue Growth</h3>
            <span className="head-chip">Last 6 months</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.35}/>
                  <stop offset="95%" stopColor="#22c55e" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="value" stroke="#18b7a6" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="card-head">
            <h3>Project Status Distribution</h3>
            <span className="head-chip head-chip-neutral">Live split</span>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={projectStatus} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {projectStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>

          <div className="status-legend">
            {projectStatus.map((item) => (
              <div key={item.name} className="legend-item">
                <span className="legend-dot" style={{ backgroundColor: item.color }} />
                <span>{item.name}</span>
                <strong>{item.value}%</strong>
              </div>
            ))}
          </div>
        </div>
      </div>


      {/* Main Grid */}

      <div className="dashboard-grid">
        <div className="schedule-card">
          <h3><Clock /> Today's Schedule</h3>

          {meetings.map((meeting) => (
            <div className="meeting" key={meeting.time}>
              <span className="meeting-time">{meeting.time}</span>
              <div className="meeting-content">
                <h4>{meeting.title}</h4>
                <p>{meeting.details}</p>
              </div>
            </div>
          ))}
        </div>


        {/* Alerts */}

        <div className="alerts-card">
          <h3><AlertCircle /> Important Alerts</h3>

          {alerts.map((item) => {
            const Icon = item.icon;

            return (
              <div className={`alert-item ${item.tone}`} key={item.title}>
                <div className="alert-icon-wrap">
                  <Icon size={16} />
                </div>
                <div>
                  <h4>{item.title}</h4>
                  <p>{item.details}</p>
                </div>
              </div>
            );
          })}

          <button type="button" className="view-all-btn">
            <Briefcase size={16} />
            View all priority items
          </button>
        </div>

      </div>

    </div>
  );
};

export default Home;