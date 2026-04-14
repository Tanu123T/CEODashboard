import React, { useEffect, useMemo, useState } from "react";
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
  UserRound,
  FileText,
  Sparkles,
  RefreshCcw,
} from "lucide-react";

import { sprintProjects, sprintDetails } from "../../pages/Sprints/sprintData";
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
];


const parseDateValue = (value) => {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : parsed;
};

const getSprintTone = (health) => {
  const normalized = (health || "").toLowerCase();
  if (normalized.includes("risk") || normalized.includes("attention")) return "amber";
  if (normalized.includes("track") || normalized.includes("active")) return "green";
  return "red";
};

const today = new Date();
if (!Number.isNaN(today.getTime())) {
  today.setHours(0, 0, 0, 0);
}

const projectMetaById = sprintProjects.reduce((acc, project) => {
  acc[project.id] = project;
  return acc;
}, {});

const activeSprintCards = Object.entries(sprintDetails)
  .map(([projectId, details]) => {
    const activeSprint = Array.isArray(details.sprints)
      ? details.sprints.find((sprint) => sprint.status?.toLowerCase() === "active")
      : null;

    if (!activeSprint) return null;

    const projectMeta = projectMetaById[projectId] || {};
    const projectEndDate = parseDateValue(projectMeta.endDate);
    const daysLeft = projectEndDate
      ? Math.max(0, Math.ceil((projectEndDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)))
      : null;

    return {
      projectId,
      project: projectMeta.name || details.about || "Unknown Project",
      sprint: activeSprint.id,
      title: activeSprint.title,
      status: "On Track",
      meta:
        daysLeft != null
          ? `${daysLeft} day${daysLeft === 1 ? "" : "s"} left · ${activeSprint.tasks}`
          : `${activeSprint.tasks}`,
      progress: activeSprint.progress || 0,
      tone: "green",
      sortDate: projectEndDate ? projectEndDate.getTime() : Number.MAX_SAFE_INTEGER,
    };
  })
  .filter((item) => item && item.projectId === 'data-analytics-engine' && item.sprint === 'Sprint 7')
  .sort((a, b) => a.sortDate - b.sortDate);

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
  { date: "April 22", name: "Anika Desai", type: "Birthday", tone: "blue" },
  { date: "April 24", name: "Kabir Shah", type: "Work Anniversary (4 years)", tone: "purple" },

];

const dailyBusinessQuotes = [
  {
    text: "Great leaders turn clarity into momentum by aligning every team around one measurable priority at a time.",
    author: "John C. Maxwell",
    source: "Leadership Principles",
  },
  {
    text: "Execution compounds faster than ideas when strategy is translated into weekly decisions that teams can act on immediately.",
    author: "Larry Bossidy",
    source: "Execution",
  },
  {
    text: "What gets measured gets managed, and what gets reviewed consistently becomes a repeatable competitive advantage.",
    author: "Peter Drucker",
    source: "Management Practice",
  },
  {
    text: "Focus creates speed, and speed creates advantage when teams are empowered to ship value without unnecessary friction.",
    author: "Eric Ries",
    source: "Lean Startup",
  },
  {
    text: "Small strategic wins, repeated with discipline, build the kind of enduring enterprise that can weather any market cycle.",
    author: "Jim Collins",
    source: "Built to Last",
  },
  {
    text: "The best time to improve a system is before it breaks, while momentum is high and change is still inexpensive.",
    author: "W. Edwards Deming",
    source: "Quality Thinking",
  },
  {
    text: "High standards are not a burden, they are the operating system that turns talent into reliable long-term performance.",
    author: "Angela Duckworth",
    source: "Grit",
  },
  {
    text: "Teams move faster when priorities are unmistakable, outcomes are visible, and ownership is clear at every level.",
    author: "Stephen R. Covey",
    source: "Execution Discipline",
  },
  {
    text: "Consistency is the strongest form of innovation because it converts good ideas into habits, and habits into results.",
    author: "James Clear",
    source: "Atomic Habits",
  },
  {
    text: "Strong culture is a competitive moat that protects execution quality when pressure rises and timelines tighten.",
    author: "Satya Nadella",
    source: "Cultural Transformation",
  },
];

const getDayOfYear = (date) => {
  const start = new Date(date.getFullYear(), 0, 0);
  const diff = date - start;
  const oneDay = 1000 * 60 * 60 * 24;
  return Math.floor(diff / oneDay);
};

const Home = () => {
  const navigate = useNavigate();
  const [activeProjectIndex, setActiveProjectIndex] = useState(null);
  const [now, setNow] = useState(new Date());
  const [quoteOffset, setQuoteOffset] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  const dateLabel = useMemo(() => now.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }), [now]);

  const timeLabel = useMemo(() => now.toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }), [now]);

  const quoteIndex = useMemo(() => {
    const dailySeed = getDayOfYear(now) % dailyBusinessQuotes.length;
    return (dailySeed + quoteOffset) % dailyBusinessQuotes.length;
  }, [now, quoteOffset]);

  const dailyQuote = dailyBusinessQuotes[quoteIndex];

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
      <section className="dashboard-top-grid">
        <section className="hero">
          <div className="hero-copy">
            <h1>Good morning, CEO</h1>
            <p>Live performance, progress, and priorities at a glance.</p>
            <div className="hero-live-row" aria-live="polite">
              <span className="hero-live-badge">LIVE</span>
              <span>{dateLabel}</span>
              <span className="hero-live-dot" />
              <span>{timeLabel}</span>
            </div>

            <article className="hero-quote-card" aria-live="polite">
              <header>
                <span>
                  <Sparkles size={14} />
                  Daily CEO Quote
                </span>
                <button
                  type="button"
                  className="hero-quote-refresh"
                  onClick={() => setQuoteOffset((prev) => (prev + 1) % dailyBusinessQuotes.length)}
                  aria-label="Show another quote"
                >
                  <RefreshCcw size={14} />
                  Refresh
                </button>
              </header>
              <div className="hero-quote-body">
                <p className="hero-quote-text">"{dailyQuote.text}"</p>
                <p className="hero-quote-author">
                  <span>{dailyQuote.author}</span>
                  <small>{dailyQuote.source}</small>
                </p>
              </div>
            </article>
          </div>
        </section>

        <section className="dashboard-section top-schedule-section">
          <header className="section-head">
            <div className="section-title">
              <Calendar size={16} />
              <h2>Today's Schedule</h2>
            </div>
            <button
              type="button"
              className="schedule-add-btn"
              onClick={() => navigate('/employees/holiday-calendar')}
            >
              Add Schedule
              <ArrowRight size={14} />
            </button>
          </header>

          <article className="panel schedule-panel top-schedule-panel">
            <div className="schedule-list">
              {scheduleItems.map((item) => {
                const Icon = item.icon;
                return (
                  <article className="schedule-item" key={`${item.time}-${item.title}`}>
                    <span className="schedule-time">{item.time}</span>
                    <div className={`schedule-icon ${item.tone}`}>
                      <Icon size={16} />
                    </div>
                    <div className="schedule-copy">
                      <h4>{item.title}</h4>
                      <p>{item.meta}</p>
                    </div>
                    <span className={`schedule-tag ${item.tone}`}>{item.tag}</span>
                  </article>
                );
              })}
            </div>
          </article>
        </section>
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
                    <div className="info-copy-title-row">
                      <h4>{entry.name}</h4>
                      <span className={`info-tag ${entry.tone}`}>{entry.type}</span>
                    </div>
                    <p>{entry.date}</p>
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
                    <div className="info-copy-title-row">
                      <h4>{entry.name}</h4>
                      <span className={`info-tag ${entry.tone}`}>{entry.type}</span>
                    </div>
                    <p>{entry.date}</p>
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
              <h2>Current Active Sprints</h2>
              <button className="link-button" type="button" onClick={() => navigate('/sprints')}>
                <span>View all</span>
                <ArrowRight size={14} />
              </button>
            </header>

            <div className="active-sprint-list">
              {activeSprintCards.map((item) => (
                <article className="active-sprint-row" key={`${item.project}-${item.sprint}`}>
                  <div className="active-sprint-row-top">
                    <div className="active-sprint-row-title">
                      <p className="project-label">{item.project}</p>
                      <h4>{item.sprint}</h4>
                      {item.title ? <p className="active-sprint-title">{item.title}</p> : null}
                    </div>
                    <span className={`status-pill ${item.tone}`}>{item.status}</span>
                  </div>

                  <div className="active-sprint-row-body">
                    <p className="active-sprint-meta">{item.meta}</p>
                    <div className="active-sprint-progress">
                      <div className="active-sprint-progress-info">
                        <strong>{item.progress}%</strong>
                        <span>Complete</span>
                      </div>
                      <div className="active-sprint-progress-bar">
                        <span className={`progress-fill ${item.tone}`} style={{ width: `${item.progress}%` }} />
                      </div>
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