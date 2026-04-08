import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  ArrowRight,
  Calendar,
  Cake,
} from "lucide-react";

import { sprintDetails, sprintProjects } from "../../pages/Sprints/sprintData";

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
];

const velocityData = [
  { week: "W1", planned: 40, actual: 38 },
  { week: "W2", planned: 45, actual: 42 },
  { week: "W3", planned: 50, actual: 44 },
  { week: "W4", planned: 49, actual: 53 },
  { week: "W5", planned: 55, actual: 50 },
  { week: "W6", planned: 60, actual: 58 },
];

const sprintFilterOptions = [
  ...sprintProjects.map((project) => ({
    value: project.id,
    label: `${project.name} - ${project.sprint}`,
  })),
];

const projectProgressData = [
  { name: "Enterprise", value: 68, color: "#39c89b" },
  { name: "AI", value: 38, color: "#f4bd1f" },
  { name: "Multi-Tenant", value: 86, color: "#39c89b" },
  { name: "Mobile", value: 24, color: "#f26d6d" },
  { name: "Patient", value: 60, color: "#39c89b" },
  { name: "Trade", value: 50, color: "#f4bd1f" },
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
  const [selectedSprintProject, setSelectedSprintProject] = useState("hospital-crm");

  const selectedProject = sprintProjects.find((project) => project.id === selectedSprintProject);

  const sprintVelocityData = useMemo(() => {
    const projectVelocity = sprintDetails[selectedSprintProject]?.velocity;

    if (!Array.isArray(projectVelocity) || projectVelocity.length === 0) {
      return velocityData;
    }

    return projectVelocity.map((point) => ({
      week: point.sprint,
      planned: point.planned,
      actual: point.completed,
    }));
  }, [selectedSprintProject]);

  const sprintContextLabel = selectedProject
    ? `${selectedProject.name} - ${selectedProject.sprint}`
    : "Current Sprint";

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

  const priorityBirthdays = birthdaysAnniversariesData.slice(0, 3);

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

      <section className="charts-grid">
        <article className="panel">
          <header className="panel-head">
            <div>
              <h2>Sprint Velocity Trend</h2>
              <p>Planned vs actual story points</p>
              <p className="panel-context">Showing {sprintContextLabel}</p>
            </div>
            <div className="panel-head-actions">
              <label className="sprint-filter" htmlFor="sprint-project-filter">
                <select
                  id="sprint-project-filter"
                  value={selectedSprintProject}
                  onChange={(event) => setSelectedSprintProject(event.target.value)}
                  className="sprint-filter-select"
                  aria-label="Sprint project filter"
                >
                  {sprintFilterOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </header>

          <div className="chart-wrap chart-wrap-tall">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={sprintVelocityData} margin={{ top: 8, right: 12, left: -16, bottom: 0 }}>
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

      <section className="bottom-grid">
        <article className="panel compact-panel">
          <header className="panel-head panel-head-link">
            <h2>Active Sprints</h2>
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
            <button className="link-button" type="button" onClick={() => navigate('/projects')}>
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
              <h2>Birthdays & Anniversaries</h2>
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
      </section>
    </div>
  );
};

export default Home;