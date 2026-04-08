import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Home.css";

import {
  ResponsiveContainer,
  LineChart,
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
  UserCheck,
  Zap,
  ArrowRight,
  Calendar,
  Cake,
  LayoutDashboard,
  Building2,
  FolderKanban,
  Timer,
} from "lucide-react";

import { departmentDistribution, trendLabels, trendValues } from "../team/teamData";

const kpiCards = [
  {
    icon: Briefcase,
    title: "ACTIVE PROJECTS",
    value: "6",
    meta: "2 on track",
    color: "blue",
    to: "/projects",
  },
  {
    icon: Users,
    title: "TOTAL WORKFORCE",
    value: "8",
    meta: "All squads",
    color: "green",
    to: "/employees",
  },
  {
    icon: Zap,
    title: "ACTIVE SPRINTS",
    value: "2",
    meta: "2 in progress",
    color: "teal",
    to: "/sprints",
  },
  {
    icon: UserCheck,
    title: "EMPLOYEES PRESENT TODAY",
    value: "231",
    meta: "93.5% attendance",
    color: "green",
    to: "/employees",
  },
];

const projectProgressData = [
  { name: "Enterprise", value: 68, color: "#39c89b", deadline: "May 15", owner: "TechNova" },
  { name: "AI", value: 38, color: "#f4bd1f", deadline: "Apr 30", owner: "Orbit" },
  { name: "Multi-Tenant", value: 86, color: "#39c89b", deadline: "Apr 10", owner: "CloudStack" },
  { name: "Mobile", value: 24, color: "#f26d6d", deadline: "Apr 20", owner: "RetailPro" },
  { name: "Patient", value: 60, color: "#39c89b", deadline: "May 5", owner: "MediSync" },
  { name: "Trade", value: 50, color: "#f4bd1f", deadline: "May 30", owner: "FinEdge" },
];

const projectsOverview = [
  { title: "Enterprise CRM Overhaul", meta: "TechNova Solutions", deadline: "May 15, 2026", tone: "green" },
  { title: "AI Analytics Dashboard", meta: "Orbit Dynamics", deadline: "Apr 30, 2026", tone: "amber" },
  { title: "Multi-Tenant Auth System", meta: "CloudStack Inc.", deadline: "Apr 10, 2026", tone: "green" },
  { title: "Mobile Commerce App", meta: "RetailPro Group", deadline: "Apr 20, 2026", tone: "red" },
];

const workforceTrendData = trendLabels.map((label, index) => ({
  month: label,
  total: trendValues[index],
}));

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
    icon: Briefcase,
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
  { title: "Sprint 24", meta: "TechNova CRM • 3 days left", stats: "32/40 story points", progress: 72, tone: "green" },
  { title: "Sprint 11", meta: "Orbit Analytics • 8 days left", stats: "18/48 story points", progress: 38, tone: "amber" },
  { title: "Sprint 7", meta: "RetailPro Mobile • Delayed", stats: "9/36 story points", progress: 24, tone: "red" },
];

const holidaysData = [
  { date: "April 14, 2026", name: "Ambedkar Jayanti", type: "National Holiday" },
  { date: "April 17, 2026", name: "Ram Navami", type: "Religious Festival" },
  { date: "April 19, 2026", name: "Easter Sunday", type: "Religious Festival" },
  { date: "May 1, 2026", name: "Labour Day", type: "National Holiday" },
];

const parseHolidayDate = (dateLabel) => {
  const parsedDate = new Date(dateLabel);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const birthdaysAnniversariesData = [
  { date: "April 10", name: "Priya Sharma", type: "Birthday", tone: "blue" },
  { date: "April 12", name: "Arjun Kumar", type: "Work Anniversary (3 years)", tone: "purple" },
  { date: "April 15", name: "Sneha Patel", type: "Birthday", tone: "blue" },
  { date: "April 18", name: "Rohan Verma", type: "Work Anniversary (2 years)", tone: "purple" },
  { date: "April 22", name: "Kavya Singh", type: "Birthday", tone: "blue" },
];

const Home = () => {
  const navigate = useNavigate();
  const [activeProjectIndex, setActiveProjectIndex] = useState(null);

  const currentMonth = useMemo(() => {
    const now = new Date();
    return { year: now.getFullYear(), month: now.getMonth() };
  }, []);

  const monthLabel = useMemo(() => new Date(currentMonth.year, currentMonth.month, 1).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  }), [currentMonth.month, currentMonth.year]);

  const monthlyHolidays = useMemo(() => {
    return holidaysData
      .map((holiday) => {
        const parsedDate = parseHolidayDate(holiday.date);
        return parsedDate ? { ...holiday, parsedDate } : null;
      })
      .filter((holiday) => holiday && holiday.parsedDate.getFullYear() === currentMonth.year && holiday.parsedDate.getMonth() === currentMonth.month)
      .sort((a, b) => a.parsedDate - b.parsedDate);
  }, [currentMonth.month, currentMonth.year]);

  const priorityBirthdays = birthdaysAnniversariesData
    .filter((entry) => entry.type === "Birthday")
    .slice(0, 3);

  const priorityAnniversaries = birthdaysAnniversariesData
    .filter((entry) => entry.type.includes("Anniversary"))
    .slice(0, 3);

  const maxDeptCount = Math.max(...departmentDistribution.map((item) => item.count));

  return (
    <div className="home">
      <section className="hero">
        <h1>Good morning, CEO</h1>
        <p>Live performance, progress, and priorities at a glance.</p>
      </section>

      <section className="dashboard-section dashboard-section-projects">
        <header className="section-head">
          <div className="section-title">
            <LayoutDashboard size={16} />
            <h2>Overview</h2>
          </div>
        </header>
        <section className="kpi-grid">
          {kpiCards.map((card) => {
            const Icon = card.icon;

            return (
              <Link to={card.to} className="kpi-card kpi-card-link" key={card.title}>
                <div className={`kpi-icon ${card.color}`}>
                  <Icon size={20} />
                </div>
                <div>
                  <p className="kpi-title">{card.title}</p>
                  <h3 className="kpi-value">{card.value}</h3>
                  <p className="kpi-meta">{card.meta}</p>
                </div>
              </Link>
            );
          })}
        </section>
      </section>

      <section className="dashboard-section">
        <header className="section-head">
          <div className="section-title">
            <FolderKanban size={16} />
            <h2>Projects</h2>
          </div>
        </header>

        <section className="project-section-grid">
          <article className="panel project-visual-panel">
            <header className="panel-head">
              <h2>All Projects Progress</h2>
            </header>

            <div className="chart-wrap chart-wrap-tall project-chart-wrap project-chart-only">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={projectProgressData}
                  margin={{ top: 8, right: 10, left: -16, bottom: 0 }}
                  onMouseMove={(state) => {
                    if (typeof state?.activeTooltipIndex === 'number') {
                      setActiveProjectIndex(state.activeTooltipIndex);
                    }
                  }}
                  onMouseLeave={() => setActiveProjectIndex(null)}
                >
                  <defs>
                    <linearGradient id="projectBarFill" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#5fa2ff" stopOpacity="0.95" />
                      <stop offset="100%" stopColor="#2fd0ae" stopOpacity="0.95" />
                    </linearGradient>
                    <linearGradient id="projectBarHot" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ff7b7b" stopOpacity="0.98" />
                      <stop offset="100%" stopColor="#f26d6d" stopOpacity="0.98" />
                    </linearGradient>
                  </defs>
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
                    formatter={(value, name, props) => [
                      `${value}%`,
                      `${props.payload.owner} • deadline ${props.payload.deadline}`,
                    ]}
                    labelFormatter={(label) => `Project: ${label}`}
                    cursor={{ fill: 'rgba(95, 162, 255, 0.06)' }}
                    contentStyle={{
                      border: "1px solid #d8e1ef",
                      borderRadius: "12px",
                      boxShadow: "0 12px 26px rgba(29, 45, 70, 0.10)",
                      fontSize: "12px",
                    }}
                  />
                  <Bar dataKey="value" radius={[10, 10, 0, 0]} barSize={42}>
                    {projectProgressData.map((entry, index) => {
                      const isActive = index === activeProjectIndex;
                      return (
                        <Cell
                          key={entry.name}
                          fill={entry.color === '#f26d6d' ? 'url(#projectBarHot)' : 'url(#projectBarFill)'}
                          opacity={activeProjectIndex === null || isActive ? 1 : 0.45}
                          stroke={isActive ? '#0f1f3d' : 'transparent'}
                          strokeWidth={isActive ? 1.5 : 0}
                        />
                      );
                    })}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel project-overview-panel">
            <header className="panel-head panel-head-link">
              <h2>Project Overview</h2>
              <button className="link-button" type="button" onClick={() => navigate('/projects')}>
                <span>View all</span>
                <ArrowRight size={14} />
              </button>
            </header>

            <div className="project-overview-grid">
              {projectsOverview.map((item) => (
                <article className={`project-overview-card ${item.tone}`} key={item.title}>
                  <div className="project-overview-card-top">
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.meta}</p>
                    </div>
                    <span className="project-deadline-pill">{item.deadline}</span>
                  </div>
                  <div className="project-overview-card-bottom">
                    <span className={`project-tone-dot ${item.tone}`} />
                    <span>Completion status</span>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>
      </section>

      <section className="dashboard-section">
        <header className="section-head">
          <div className="section-title">
            <Building2 size={16} />
            <h2>Organization</h2>
          </div>
        </header>

        <section className="workforce-insights-grid">
          <article className="panel workforce-insight-panel">
            <header className="panel-head workforce-insight-head">
              <div>
                <h2>Headcount Growth Trend</h2>
                <p>Monthly employee count across all departments</p>
              </div>
              <div className="workforce-insight-meta">
                <span><i /> Total</span>
                <button type="button">6 Months</button>
              </div>
            </header>

            <div className="chart-wrap workforce-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={workforceTrendData} margin={{ top: 12, right: 24, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="workforceArea" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.24} />
                      <stop offset="95%" stopColor="#22c55e" stopOpacity={0.03} />
                    </linearGradient>
                    <linearGradient id="workforceStroke" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#38bdf8" />
                      <stop offset="100%" stopColor="#22c55e" />
                    </linearGradient>
                  </defs>
                  <CartesianGrid vertical={false} stroke="#e8eef7" strokeDasharray="4 4" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: "#8ca0b8", fontSize: 12 }} />
                  <YAxis
                    domain={[200, 260]}
                    ticks={[200, 215, 230, 245, 260]}
                    axisLine={false}
                    tickLine={false}
                    tick={{ fill: "#8ca0b8", fontSize: 12 }}
                  />
                  <Tooltip
                    formatter={(value) => [`${value}`, "Headcount"]}
                    contentStyle={{
                      border: "1px solid #d8e1ef",
                      borderRadius: "10px",
                      boxShadow: "0 10px 20px rgba(29, 45, 70, 0.08)",
                      fontSize: "12px",
                    }}
                  />
                  <Area type="monotone" dataKey="total" stroke="none" fill="url(#workforceArea)" />
                  <Line type="monotone" dataKey="total" stroke="url(#workforceStroke)" strokeWidth={3} dot={{ r: 4, strokeWidth: 2 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel workforce-insight-panel">
            <header className="panel-head workforce-insight-head stacked">
              <div>
                <h2>Role-wise Distribution</h2>
                <p>247 total across 8 teams</p>
              </div>
            </header>

            <ul className="workforce-dept-list">
              {departmentDistribution.map((dept) => (
                <li key={dept.name} className="workforce-dept-item">
                  <span>{dept.name}</span>
                  <div className="workforce-bar-track">
                    <div
                      className="workforce-bar-fill"
                      style={{
                        width: `${(dept.count / maxDeptCount) * 100}%`,
                        background: `linear-gradient(90deg, ${dept.color}B3 0%, ${dept.color} 100%)`,
                      }}
                    />
                  </div>
                  <strong>{dept.count}</strong>
                </li>
              ))}
            </ul>
          </article>
        </section>

        <section className="info-grid">
          <article className="panel compact-panel compact-panel-small">
            <header className="panel-head">
              <div className="header-with-icon">
                <Calendar size={20} style={{ color: "#5fa2ff" }} />
                <h2>Holidays in {monthLabel}</h2>
              </div>
            </header>
            <div className="info-list info-list-compact">
              {monthlyHolidays.length > 0 ? (
                monthlyHolidays.slice(0, 3).map((holiday) => (
                  <article className="info-item info-item-small" key={`${holiday.date}-${holiday.name}`}>
                    <div className="info-dot green" />
                    <div className="info-copy">
                      <h4>{holiday.name}</h4>
                      <p>{holiday.date}</p>
                    </div>
                    <span className="info-tag">{holiday.type}</span>
                  </article>
                ))
              ) : (
                <article className="info-item info-item-small">
                  <div className="info-dot green" />
                  <div className="info-copy">
                    <h4>No holidays this month</h4>
                    <p>Calendar updated</p>
                  </div>
                  <span className="info-tag">Info</span>
                </article>
              )}
            </div>
          </article>

          <article className="panel compact-panel compact-panel-small">
            <header className="panel-head">
              <div className="header-with-icon">
                <Cake size={20} style={{ color: "#f4bd1f" }} />
                <h2>Birthdays</h2>
              </div>
            </header>
            <div className="info-list info-list-compact">
              {priorityBirthdays.map((entry) => (
                <article className="info-item info-item-small" key={`${entry.date}-${entry.name}`}>
                  <div className={`info-dot ${entry.tone}`} />
                  <div className="info-copy">
                    <h4>{entry.name}</h4>
                    <p>{entry.date}</p>
                    <span className={`info-tag ${entry.tone}`}>{entry.type}</span>
                  </div>
                </article>
              ))}
            </div>
          </article>

          <article className="panel compact-panel compact-panel-small">
            <header className="panel-head">
              <div className="header-with-icon">
                <Calendar size={20} style={{ color: "#9d86ff" }} />
                <h2>Anniversaries</h2>
              </div>
            </header>
            <div className="info-list info-list-compact">
              {priorityAnniversaries.map((entry) => (
                <article className="info-item info-item-small" key={`${entry.date}-${entry.name}`}>
                  <div className={`info-dot ${entry.tone}`} />
                  <div className="info-copy">
                    <h4>{entry.name}</h4>
                    <p>{entry.date}</p>
                    <span className={`info-tag ${entry.tone}`}>{entry.type}</span>
                  </div>
                </article>
              ))}
            </div>
          </article>
        </section>
      </section>

      <section className="dashboard-section">
        <header className="section-head">
          <div className="section-title">
            <Timer size={16} />
            <h2>Sprint</h2>
          </div>
        </header>

        <section className="sprint-section-grid">
          <article className="panel compact-panel">
            <header className="panel-head panel-head-link">
              <h2>Sprint Overview</h2>
              <button className="link-button" type="button" onClick={() => navigate('/sprints')}>
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
                    <p className="progress-submeta">{item.stats}</p>
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
      </section>
    </div>
  );
};

export default Home;