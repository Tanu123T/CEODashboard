import React from "react";
import "./Home.css";

import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  BarChart,
  Bar,
  Cell,
  CartesianGrid,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  Briefcase,
  Users,
  Zap,
  TriangleAlert,
  TrendingUp,
  Clock3,
  UserRound,
  FileText,
  ArrowRight,
} from "lucide-react";

const kpiCards = [
  {
    icon: Briefcase,
    title: "ACTIVE PROJECTS",
    value: "6",
    meta: "2 on track",
    color: "blue",
  },
  {
    icon: Users,
    title: "TEAM MEMBERS",
    value: "8",
    meta: "All squads",
    color: "green",
  },
  {
    icon: Zap,
    title: "ACTIVE SPRINTS",
    value: "2",
    meta: "2 in progress",
    color: "teal",
  },
  {
    icon: TriangleAlert,
    title: "OPEN BLOCKERS",
    value: "4",
    meta: "Needs action",
    color: "red",
  },
];

const velocityData = [
  { week: "W1", planned: 40, actual: 38 },
  { week: "W2", planned: 45, actual: 42 },
  { week: "W3", planned: 50, actual: 44 },
  { week: "W4", planned: 49, actual: 53 },
  { week: "W5", planned: 55, actual: 50 },
  { week: "W6", planned: 60, actual: 58 },
];

const projectProgressData = [
  { name: "Enterprise", value: 68, color: "#39c89b" },
  { name: "AI", value: 38, color: "#f4bd1f" },
  { name: "Multi-Tenant", value: 86, color: "#39c89b" },
  { name: "Mobile", value: 24, color: "#f26d6d" },
  { name: "Patient", value: 60, color: "#39c89b" },
  { name: "Trade", value: 50, color: "#f4bd1f" },
];

const scheduleItems = [
  {
    time: "09:00 AM",
    title: "Daily Standup - Platform Squad",
    meta: "15 min - Arjun, Priya, Ravi, Sneha",
    icon: Users,
    tone: "blue",
    tag: "Standup",
  },
  {
    time: "02:00 PM",
    title: "Risk Review - Orbit Dynamics",
    meta: "45 min - Kavya, Rohan, Nisha K.",
    icon: TriangleAlert,
    tone: "red",
    tag: "Risk Review",
  },
  {
    time: "03:30 PM",
    title: "1:1 with Sneha Patel",
    meta: "30 min - Sneha",
    icon: UserRound,
    tone: "teal",
    tag: "1:1",
  },
  {
    time: "04:30 PM",
    title: "Q1 Board Report - Prep",
    meta: "1 hr",
    icon: FileText,
    tone: "purple",
    tag: "Deep Work",
  },
  {
    time: "06:00 PM",
    title: "Proposal Review - FinEdge Capital",
    meta: "30 min - Rohan, Amit S.",
    icon: Briefcase,
    tone: "orange",
    tag: "Client",
  },
];

const sprintOverview = [
  { title: "Enterprise CRM Overhaul", meta: "Sprint 24 - TechNova Solutions", progress: 72, tone: "green" },
  { title: "AI Analytics Dashboard", meta: "Sprint 11 - Orbit Dynamics", progress: 38, tone: "amber" },
];

const projectsOverview = [
  { title: "Enterprise CRM Overhaul", meta: "TechNova Solutions", progress: 68, tone: "green" },
  { title: "AI Analytics Dashboard", meta: "Orbit Dynamics", progress: 38, tone: "amber" },
  { title: "Multi-Tenant Auth System", meta: "CloudStack Inc.", progress: 85, tone: "green" },
  { title: "Mobile Commerce App", meta: "RetailPro Group", progress: 24, tone: "red" },
];

const Home = () => {
  return (
    <div className="home">
      <section className="hero">
        <h1>Good morning, CEO</h1>
        <p>Here&apos;s your business snapshot for March 24, 2026.</p>
      </section>

      <section className="kpi-grid">
        {kpiCards.map((card) => {
          const Icon = card.icon;

          return (
            <article className="kpi-card" key={card.title}>
              <div className={`kpi-icon ${card.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="kpi-title">{card.title}</p>
                <h3 className="kpi-value">{card.value}</h3>
                <p className="kpi-meta">{card.meta}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="charts-grid">
        <article className="panel">
          <header className="panel-head">
            <div>
              <h2>Sprint Velocity Trend</h2>
              <p>Planned vs actual story points</p>
            </div>
            <TrendingUp className="trend-icon" size={20} />
          </header>

          <div className="chart-wrap chart-wrap-tall">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={velocityData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="actualFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3bc89b" stopOpacity={0.24} />
                    <stop offset="95%" stopColor="#3bc89b" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} stroke="#e8eef7" strokeDasharray="4 4" />
                <XAxis dataKey="week" axisLine={false} tickLine={false} tick={{ fill: "#8ca0b8", fontSize: 12 }} />
                <YAxis
                  domain={[0, 60]}
                  ticks={[0, 15, 30, 45, 60]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8ca0b8", fontSize: 12 }}
                />
                <Tooltip
                  contentStyle={{
                    border: "1px solid #d8e1ef",
                    borderRadius: "10px",
                    boxShadow: "0 10px 20px rgba(29, 45, 70, 0.08)",
                    fontSize: "12px",
                  }}
                />
                <Area type="monotone" dataKey="actual" fill="url(#actualFill)" stroke="none" />
                <Line type="monotone" dataKey="planned" stroke="#5fa2ff" strokeWidth={2.5} strokeDasharray="6 5" dot={false} />
                <Line type="monotone" dataKey="actual" stroke="#3bc89b" strokeWidth={3} dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <header className="panel-head">
            <div>
              <h2>Project Progress</h2>
              <p>Completion % per project</p>
            </div>
          </header>

          <div className="chart-wrap chart-wrap-tall">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgressData} margin={{ top: 8, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e8eef7" strokeDasharray="4 4" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: "#8ca0b8", fontSize: 12 }} />
                <YAxis
                  domain={[0, 100]}
                  ticks={[0, 25, 50, 75, 100]}
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#8ca0b8", fontSize: 12 }}
                />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  contentStyle={{
                    border: "1px solid #d8e1ef",
                    borderRadius: "10px",
                    boxShadow: "0 10px 20px rgba(29, 45, 70, 0.08)",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={42}>
                  {projectProgressData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="panel schedule-panel">
        <header className="panel-head">
          <div>
            <h2>Today&apos;s Schedule</h2>
            <p>Monday, March 30, 2026</p>
          </div>
          <Clock3 className="schedule-clock" size={20} />
        </header>

        <div className="schedule-list">
          {scheduleItems.map((item) => {
            const Icon = item.icon;

            return (
              <article className="schedule-item" key={`${item.time}-${item.title}`}>
                <span className="schedule-time">{item.time}</span>
                <span className={`schedule-icon ${item.tone}`}>
                  <Icon size={16} />
                </span>
                <div className="schedule-copy">
                  <h4>{item.title}</h4>
                  <p>{item.meta}</p>
                </div>
                <span className={`schedule-tag ${item.tone}`}>{item.tag}</span>
              </article>
            );
          })}
        </div>
      </section>

      <section className="bottom-grid">
        <article className="panel compact-panel">
          <header className="panel-head panel-head-link">
            <h2>Active Sprints</h2>
            <button className="link-button" type="button">
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </header>

          <div className="progress-list">
            {sprintOverview.map((item) => (
              <article className="progress-item" key={item.title}>
                <div className={`progress-dot ${item.tone}`} />
                <div className="progress-copy">
                  <h4>{item.title}</h4>
                  <p>{item.meta}</p>
                </div>
                <div className="progress-value-wrap">
                  <strong>{item.progress}%</strong>
                  <div className="progress-track">
                    <span className={`progress-fill ${item.tone}`} style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="panel compact-panel">
          <header className="panel-head panel-head-link">
            <h2>Projects Overview</h2>
            <button className="link-button" type="button">
              <span>View all</span>
              <ArrowRight size={14} />
            </button>
          </header>

          <div className="progress-list">
            {projectsOverview.map((item) => (
              <article className="progress-item" key={item.title}>
                <div className={`progress-dot ${item.tone}`} />
                <div className="progress-copy">
                  <h4>{item.title}</h4>
                  <p>{item.meta}</p>
                </div>
                <div className="progress-value-wrap">
                  <strong>{item.progress}%</strong>
                  <div className="progress-track">
                    <span className={`progress-fill ${item.tone}`} style={{ width: `${item.progress}%` }} />
                  </div>
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
};

export default Home;