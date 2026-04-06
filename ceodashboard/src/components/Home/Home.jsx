import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";
import { projectRecords } from "../../data/projectsData";
import { riskAlerts } from "../../data/risksData";
import { teamMembers } from "../../data/teamPerformanceData";
import { sprintProjects } from "../../pages/Sprints/sprintData";

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
  PieChart,
  Pie,
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
} from "lucide-react";

const kpiCards = [
  {
    icon: Briefcase,
    title: "ACTIVE PROJECTS",
    value: "6",
    meta: "2 on track",
    color: "blue",
    action: "projects",
  },
  {
    icon: Users,
    title: "TEAM MEMBERS",
    value: "8",
    meta: "All squads",
    color: "green",
    action: "members",
  },
  {
    icon: Zap,
    title: "ACTIVE SPRINTS",
    value: "2",
    meta: "2 in progress",
    color: "teal",
    action: "sprints",
  },
  {
    icon: TriangleAlert,
    title: "OPEN BLOCKERS",
    value: "4",
    meta: "Needs action",
    color: "red",
    action: "blockers",
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

const severityWeight = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
};

const formatCurrencyCompact = (value) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(2)}M`;
  }

  if (value >= 1000) {
    return `$${Math.round(value / 1000)}K`;
  }

  return `$${Math.round(value)}`;
};

const getCompletion = (done, total) => {
  if (!total) {
    return 0;
  }

  return Math.round((done / total) * 100);
};

const Home = () => {
  const navigate = useNavigate();

  const topOpenBlocker = useMemo(() => {
    const severityRank = {
      critical: 4,
      high: 3,
      medium: 2,
      low: 1,
    };

    const candidateRisks = riskAlerts.filter(
      (risk) => ["open", "escalated"].includes(risk.status.toLowerCase()),
    );

    if (!candidateRisks.length) {
      return null;
    }

    return [...candidateRisks].sort((a, b) => {
      const severityDelta =
        (severityRank[b.severity.toLowerCase()] || 0) - (severityRank[a.severity.toLowerCase()] || 0);
      if (severityDelta !== 0) {
        return severityDelta;
      }

      return b.ageDays - a.ageDays;
    })[0];
  }, []);

  const executiveAnalytics = useMemo(() => {
    const riskyProjects = projectRecords.filter(
      (project) => project.statusLabel === "At Risk" || project.statusLabel === "Needs Attention",
    );
    const revenueAtRisk = riskyProjects.reduce((total, project) => total + project.budgetTotal, 0);

    const totalBudget = projectRecords.reduce((total, project) => total + project.budgetTotal, 0);
    const totalSpent = projectRecords.reduce((total, project) => total + project.budgetSpent, 0);
    const burnRate = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

    const avgUtilization =
      teamMembers.length > 0
        ? teamMembers.reduce((total, member) => total + member.utilization, 0) / teamMembers.length
        : 0;

    const openCriticalHighRisks = riskAlerts.filter(
      (risk) => ["critical", "high"].includes(risk.severity.toLowerCase()) && risk.status.toLowerCase() !== "mitigating",
    ).length;

    return [
      {
        metric: "Revenue at Risk",
        value: formatCurrencyCompact(revenueAtRisk),
        trend: `${riskyProjects.length} projects flagged`,
        tone: riskyProjects.length <= 1 ? "positive" : "negative",
        note: `${openCriticalHighRisks} critical/high alerts are still open or escalated.`,
      },
      {
        metric: "Budget Burn Rate",
        value: `${Math.round(burnRate)}%`,
        trend: `${formatCurrencyCompact(totalSpent)} spent of ${formatCurrencyCompact(totalBudget)}`,
        tone: burnRate > 70 ? "negative" : "neutral",
        note: "Monitors delivery cost pressure across the active portfolio.",
      },
      {
        metric: "Team Utilization",
        value: `${Math.round(avgUtilization)}%`,
        trend: `${teamMembers.length} members tracked`,
        tone: avgUtilization >= 80 ? "positive" : "neutral",
        note: "Healthy utilization supports predictable throughput.",
      },
    ];
  }, []);

  const executiveWatchlist = useMemo(() => {
    const highestRisks = [...riskAlerts]
      .sort((a, b) => {
        const severityDelta =
          (severityWeight[b.severity.toLowerCase()] || 0) - (severityWeight[a.severity.toLowerCase()] || 0);

        if (severityDelta !== 0) {
          return severityDelta;
        }

        return b.ageDays - a.ageDays;
      })
      .slice(0, 4)
      .map((risk) => ({
        title: `${risk.category} - ${risk.project}`,
        description: risk.description,
        severity: risk.severity.toLowerCase(),
        owner: risk.owner,
      }));

    return highestRisks;
  }, []);

  const ongoingSprints = useMemo(
    () => sprintProjects.filter((item) => item.donePoints < item.totalPoints),
    [],
  );

  const sprintHealthData = useMemo(() => {
    const buckets = {
      "On Track": 0,
      "Needs Attention": 0,
      "At Risk": 0,
    };

    ongoingSprints.forEach((item) => {
      buckets[item.health] = (buckets[item.health] || 0) + 1;
    });

    return [
      { name: "On Track", value: buckets["On Track"], color: "#39c89b" },
      { name: "Needs Attention", value: buckets["Needs Attention"], color: "#f4bd1f" },
      { name: "At Risk", value: buckets["At Risk"], color: "#f26d6d" },
    ].filter((item) => item.value > 0);
  }, [ongoingSprints]);

  const ongoingProjectProgressData = useMemo(
    () =>
      ongoingSprints.map((item) => ({
        name: item.name,
        value: getCompletion(item.donePoints, item.totalPoints),
      })),
    [ongoingSprints],
  );

  const portfolioMixData = useMemo(() => {
    const totals = projectRecords.reduce((acc, item) => {
      const key = item.statusLabel;
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return [
      { name: "On Track", value: totals["On Track"] || 0, color: "#39c89b" },
      { name: "Needs Attention", value: totals["Needs Attention"] || 0, color: "#f4bd1f" },
      { name: "At Risk", value: totals["At Risk"] || 0, color: "#f26d6d" },
    ].filter((item) => item.value > 0);
  }, []);

  const budgetUtilization = useMemo(() => {
    return projectRecords
      .map((project) => {
        const used = project.budgetTotal ? Math.round((project.budgetSpent / project.budgetTotal) * 100) : 0;
        return {
          name: project.name,
          used,
          spent: formatCurrencyCompact(project.budgetSpent),
          total: formatCurrencyCompact(project.budgetTotal),
          tone: used >= 80 ? "risk" : used >= 60 ? "warning" : "healthy",
        };
      })
      .sort((a, b) => b.used - a.used)
      .slice(0, 5);
  }, []);

  const upcomingMilestones = useMemo(() => {
    const now = new Date();

    return projectRecords
      .flatMap((project) =>
        project.milestones
          .filter((milestone) => !milestone.done)
          .map((milestone) => ({
            project: project.name,
            title: milestone.title,
            date: milestone.date,
            timestamp: new Date(milestone.date).getTime(),
          })),
      )
      .filter((milestone) => Number.isFinite(milestone.timestamp) && milestone.timestamp >= now.getTime())
      .sort((a, b) => a.timestamp - b.timestamp)
      .slice(0, 6);
  }, []);

  const openKpiAction = (action) => {
    if (action === "projects") {
      navigate("/projects");
      return;
    }

    if (action === "members") {
      navigate("/employees", {
        state: {
          tab: "members",
          token: Date.now(),
        },
      });
      return;
    }

    if (action === "sprints") {
      navigate("/sprints");
      return;
    }

    if (action === "blockers") {
      navigate("/risks", {
        state: {
          selectedRiskId: topOpenBlocker?.id || null,
          category: topOpenBlocker?.category || "All",
          token: Date.now(),
        },
      });
    }
  };

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
            <button
              type="button"
              className="kpi-card kpi-card-btn"
              key={card.title}
              onClick={() => openKpiAction(card.action)}
            >
              <div className={`kpi-icon ${card.color}`}>
                <Icon size={20} />
              </div>
              <div>
                <p className="kpi-title">{card.title}</p>
                <h3 className="kpi-value">{card.value}</h3>
                <p className="kpi-meta">{card.meta}</p>
              </div>
            </button>
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
          <header className="panel-head">
            <div>
              <h2>Executive Analytics</h2>
              <p>Critical business indicators for immediate steering</p>
            </div>
          </header>

          <div className="insights-list">
            {executiveAnalytics.map((item) => (
              <article className="insight-item" key={item.metric}>
                <div className="insight-head">
                  <p className="insight-metric">{item.metric}</p>
                  <strong className="insight-value">{item.value}</strong>
                </div>
                <div className="insight-meta-row">
                  <span className={`insight-trend ${item.tone}`}>{item.trend}</span>
                  <span className="insight-divider" />
                  <span className="insight-note">{item.note}</span>
                </div>
              </article>
            ))}
          </div>
        </article>

        <article className="panel compact-panel">
          <header className="panel-head">
            <div>
              <h2>Executive Watchlist</h2>
              <p>Priority signals requiring monitoring or escalation</p>
            </div>
          </header>

          <div className="watchlist-grid">
            {executiveWatchlist.map((item) => (
              <article className="watch-item" key={item.title}>
                <span className={`watch-severity ${item.severity}`}>{item.severity}</span>
                <h4>{item.title}</h4>
                <p>{item.description}</p>
                <div className="watch-owner">Owner: {item.owner}</div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="charts-grid sprint-extra-grid">
        <article className="panel">
          <header className="panel-head">
            <div>
              <h2>Ongoing Sprint Health</h2>
              <p>Pie chart of ongoing sprint status mix</p>
            </div>
          </header>

          <div className="chart-wrap chart-wrap-tall sprint-extra-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={sprintHealthData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={56}
                  outerRadius={90}
                  paddingAngle={3}
                >
                  {sprintHealthData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} sprint(s)`, name]}
                  contentStyle={{
                    border: "1px solid #d8e1ef",
                    borderRadius: "10px",
                    boxShadow: "0 10px 20px rgba(29, 45, 70, 0.08)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <header className="panel-head">
            <div>
              <h2>Ongoing Project Completion</h2>
              <p>Bar graph of progress for sprint projects in execution</p>
            </div>
          </header>

          <div className="chart-wrap chart-wrap-tall sprint-extra-chart">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={ongoingProjectProgressData} margin={{ top: 8, right: 10, left: -16, bottom: 0 }}>
                <CartesianGrid vertical={false} stroke="#e8eef7" strokeDasharray="4 4" />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  interval={0}
                  height={42}
                  tick={{ fill: "#8ca0b8", fontSize: 11 }}
                />
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
                <Bar dataKey="value" fill="#2f71c7" radius={[6, 6, 0, 0]} barSize={30} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </article>
      </section>

      <section className="charts-grid">
        <article className="panel">
          <header className="panel-head">
            <div>
              <h2>Portfolio Mix</h2>
              <p>Current project status distribution</p>
            </div>
          </header>

          <div className="chart-wrap chart-wrap-tall sprint-extra-chart">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={portfolioMixData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={52}
                  outerRadius={86}
                  paddingAngle={2}
                >
                  {portfolioMixData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} project(s)`, name]}
                  contentStyle={{
                    border: "1px solid #d8e1ef",
                    borderRadius: "10px",
                    boxShadow: "0 10px 20px rgba(29, 45, 70, 0.08)",
                    fontSize: "12px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </article>

        <article className="panel">
          <header className="panel-head">
            <div>
              <h2>Budget Utilization</h2>
              <p>Top projects by budget burn</p>
            </div>
          </header>

          <div className="budget-list">
            {budgetUtilization.map((item) => (
              <article className="budget-item" key={item.name}>
                <div className="budget-item-top">
                  <h4>{item.name}</h4>
                  <strong>{item.used}%</strong>
                </div>
                <p>{item.spent} of {item.total}</p>
                <div className="budget-track">
                  <span className={item.tone} style={{ width: `${item.used}%` }} />
                </div>
              </article>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <header className="panel-head">
          <div>
            <h2>Upcoming Milestones</h2>
            <p>Nearest delivery checkpoints across active projects</p>
          </div>
        </header>

        <div className="milestone-grid">
          {upcomingMilestones.map((item) => (
            <article key={`${item.project}-${item.title}`} className="milestone-item">
              <span className="milestone-date">{item.date}</span>
              <div className="milestone-copy">
                <h4>{item.title}</h4>
                <p>{item.project}</p>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
