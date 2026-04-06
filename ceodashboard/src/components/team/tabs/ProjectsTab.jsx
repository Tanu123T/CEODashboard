import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  AlertTriangle,
  BriefcaseBusiness,
  CalendarDays,
  CheckCircle2,
  Clock3,
  Search,
  TrendingUp,
  Users2,
} from 'lucide-react';
import { sprintDetails, sprintProjects } from '../../../pages/Sprints/sprintData';

const projectBudgetData = [
  { code: 'PRJ-001', budget: 420, spent: 302, color: '#18b7a6' },
  { code: 'PRJ-002', budget: 180, spent: 145, color: '#2f71c7' },
  { code: 'PRJ-003', budget: 100, spent: 61, color: '#f0a84b' },
  { code: 'PRJ-004', budget: 62, spent: 61, color: '#22c55e' },
  { code: 'PRJ-005', budget: 78, spent: 24, color: '#38bdf8' },
  { code: 'PRJ-006', budget: 220, spent: 61, color: '#0ca8c7' },
];

const boardProjects = [
  {
    id: 'PRJ-001',
    title: 'Platform v3.0 Rebuild',
    summary: 'Full rebuild of core platform infrastructure with microservices architecture and 3x performance...',
    owner: 'Sarah',
    ownerFull: 'Sarah Chen',
    ownerInitials: 'SC',
    members: 18,
    due: 'Apr 15',
    progress: 72,
    done: 89,
    total: 124,
    budget: '$420K',
    spent: '$302K (72%)',
    teamSize: '18 people',
    deadline: 'Apr 15',
    department: 'Engineering',
    status: 'On Track',
    health: 'Critical',
    healthTone: 'critical',
    pace: 'On Track',
    paceTone: 'ontrack',
    progressColor: '#18b7a6',
  },
  {
    id: 'PRJ-002',
    title: 'Q1 Enterprise Sales Drive',
    summary: 'Targeted enterprise outreach campaign to close 15 new accounts in Q1. Pipeline currently at 122% of...',
    owner: 'James',
    ownerFull: 'James Wilson',
    ownerInitials: 'JW',
    members: 8,
    due: 'Mar 31',
    progress: 88,
    done: 40,
    total: 45,
    budget: '$300K',
    spent: '$264K (88%)',
    teamSize: '8 people',
    deadline: 'Mar 31',
    department: 'Sales',
    status: 'Ahead',
    health: 'High',
    healthTone: 'high',
    pace: 'Ahead',
    paceTone: 'ahead',
    progressColor: '#2f71c7',
  },
  {
    id: 'PRJ-003',
    title: 'Spring Marketing Campaign',
    summary: 'Multi-channel spring campaign across social, email, and paid. Currently behind due to creative delays.',
    owner: 'Marcus',
    ownerFull: 'Marcus Lee',
    ownerInitials: 'ML',
    members: 6,
    due: 'Apr 1',
    progress: 55,
    done: 21,
    total: 38,
    budget: '$110K',
    spent: '$61K (55%)',
    teamSize: '6 people',
    deadline: 'Apr 1',
    department: 'Marketing',
    status: 'At Risk',
    health: 'High',
    healthTone: 'high',
    pace: 'At Risk',
    paceTone: 'risk',
    progressColor: '#f0a84b',
  },
  {
    id: 'PRJ-004',
    title: '2026 Product Roadmap',
    summary: 'Defining and aligning the company-wide product strategy for 2026 with all department heads.',
    owner: 'Priya',
    ownerFull: 'Priya Patel',
    ownerInitials: 'PP',
    members: 5,
    due: 'Mar 20',
    progress: 95,
    done: 21,
    total: 22,
    budget: '$62K',
    spent: '$59K (95%)',
    teamSize: '5 people',
    deadline: 'Mar 20',
    department: 'Product',
    status: 'Ahead',
    health: 'Critical',
    healthTone: 'critical',
    pace: 'Ahead',
    paceTone: 'ahead',
    progressColor: '#22c55e',
  },
  {
    id: 'PRJ-005',
    title: 'Brand Identity Refresh',
    summary: 'Complete visual identity refresh including logo variants, color palette, typography, and brand...',
    owner: 'Elena',
    ownerFull: 'Elena Torres',
    ownerInitials: 'ET',
    members: 4,
    due: 'Apr 30',
    progress: 40,
    done: 14,
    total: 35,
    budget: '$130K',
    spent: '$52K (40%)',
    teamSize: '4 people',
    deadline: 'Apr 30',
    department: 'Design',
    status: 'On Track',
    health: 'Medium',
    healthTone: 'medium',
    pace: 'On Track',
    paceTone: 'ontrack',
    progressColor: '#38bdf8',
  },
  {
    id: 'PRJ-006',
    title: 'ML Recommendation Engine',
    summary: 'Building AI-powered product recommendation system to improve GMV by an estimated 8-12%.',
    owner: 'Li',
    ownerFull: 'Li Wei',
    ownerInitials: 'LW',
    members: 7,
    due: 'May 12',
    progress: 30,
    done: 12,
    total: 40,
    budget: '$220K',
    spent: '$66K (30%)',
    teamSize: '7 people',
    deadline: 'May 12',
    department: 'Engineering',
    status: 'On Track',
    health: 'High',
    healthTone: 'high',
    pace: 'On Track',
    paceTone: 'ontrack',
    progressColor: '#0ca8c7',
  },
];

const milestoneItems = [
  { text: 'Architecture Design', done: true },
  { text: 'Core API Development', done: true },
  { text: 'Frontend Integration', done: false, current: true },
  { text: 'QA & Testing', done: false },
];

const completedProjectsArchive = [
  {
    id: 'CP-101',
    title: 'Hospital CRM Rollout',
    client: 'HealthPlus Group',
    owner: 'Priya Patel',
    completedOn: 'Mar 14, 2026',
    budget: '$860K',
    spent: '$822K',
    impact: 'Reduced manual ops by 34%',
    quality: '99.1% uptime in first 30 days',
  },
  {
    id: 'CP-102',
    title: 'Identity Security Upgrade',
    client: 'CloudStack Inc.',
    owner: 'Sarah Chen',
    completedOn: 'Feb 27, 2026',
    budget: '$610K',
    spent: '$598K',
    impact: 'Cut auth failure incidents by 41%',
    quality: '0 P1 security findings post-launch',
  },
  {
    id: 'CP-103',
    title: 'Enterprise Reporting Suite',
    client: 'FinEdge Capital',
    owner: 'James Wilson',
    completedOn: 'Jan 31, 2026',
    budget: '$740K',
    spent: '$752K',
    impact: 'Board reporting cycle shortened by 6 days',
    quality: '98.4% report accuracy',
  },
];

const sprintProjectByDashboardProject = {
  'PRJ-001': 'hospital-crm',
  'PRJ-002': 'banking-portal',
  'PRJ-003': 'travel-app',
  'PRJ-004': 'product-roadmap',
  'PRJ-005': 'brand-refresh',
  'PRJ-006': 'ai-chatbot',
};

const dueDateToTime = (dueLabel) => {
  const monthIndex = {
    Jan: 0,
    Feb: 1,
    Mar: 2,
    Apr: 3,
    May: 4,
    Jun: 5,
    Jul: 6,
    Aug: 7,
    Sep: 8,
    Oct: 9,
    Nov: 10,
    Dec: 11,
  };

  const [monthLabel, dayLabel] = dueLabel.split(' ');
  const month = monthIndex[monthLabel];
  const day = Number.parseInt(dayLabel, 10);

  if (Number.isNaN(month) || Number.isNaN(day)) {
    return Number.MAX_SAFE_INTEGER;
  }

  return new Date(new Date().getFullYear(), month, day).getTime();
};

const sprintHealthFromCompletion = (completion) => {
  if (completion >= 90) return { label: 'On Track', tone: 'ontrack' };
  if (completion >= 75) return { label: 'Needs Attention', tone: 'risk' };
  return { label: 'At Risk', tone: 'risk' };
};

const ProjectsTab = ({ selectedProjectId: externalSelectedProjectId, projectFocusToken, projectsScrollToken, onProjectSelect }) => {
  const navigate = useNavigate();
  const projectsListRef = useRef(null);
  const [hoveredBarIndex, setHoveredBarIndex] = useState(null);
  const [viewMode, setViewMode] = useState('board');
  const [internalSelectedProjectId, setInternalSelectedProjectId] = useState(null);
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [healthFilter, setHealthFilter] = useState('All');

  const selectedProjectId = externalSelectedProjectId ?? internalSelectedProjectId;

  const yTicks = [0, 150, 300, 450, 600];
  const chartBottom = 190;
  const chartHeight = 150;

  const departments = useMemo(
    () => ['All', ...new Set(boardProjects.map((item) => item.department))],
    []
  );

  const statuses = useMemo(
    () => ['All', ...new Set(boardProjects.map((item) => item.status))],
    []
  );

  const healthLevels = useMemo(
    () => ['All', ...new Set(boardProjects.map((item) => item.health))],
    []
  );

  const filteredProjects = useMemo(() => {
    const query = search.trim().toLowerCase();

    return boardProjects.filter((item) => {
      const matchesSearch =
        !query ||
        item.id.toLowerCase().includes(query) ||
        item.title.toLowerCase().includes(query) ||
        item.ownerFull.toLowerCase().includes(query);
      const matchesDepartment = departmentFilter === 'All' || item.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
      const matchesHealth = healthFilter === 'All' || item.health === healthFilter;

      return matchesSearch && matchesDepartment && matchesStatus && matchesHealth;
    });
  }, [search, departmentFilter, statusFilter, healthFilter]);

  const visibleBudgetData = useMemo(
    () => projectBudgetData.filter((item) => filteredProjects.some((project) => project.id === item.code)),
    [filteredProjects]
  );

  const portfolioHealthSummary = useMemo(
    () => [
      { label: 'Ahead of Schedule', value: filteredProjects.filter((item) => item.status === 'Ahead').length, tone: 'ahead' },
      { label: 'On Track', value: filteredProjects.filter((item) => item.status === 'On Track').length, tone: 'ontrack' },
      { label: 'At Risk', value: filteredProjects.filter((item) => item.status === 'At Risk').length, tone: 'risk' },
      { label: 'Delayed', value: filteredProjects.filter((item) => item.status === 'Delayed').length, tone: 'delayed' },
    ],
    [filteredProjects]
  );

  const upcomingDeadlineItems = useMemo(
    () => filteredProjects.slice().sort((a, b) => dueDateToTime(a.due) - dueDateToTime(b.due)).slice(0, 3).map((item) => ({
      title: item.title,
      due: item.due,
    })),
    [filteredProjects]
  );

  const totalBudget = useMemo(
    () => visibleBudgetData.reduce((sum, item) => sum + item.budget, 0),
    [visibleBudgetData]
  );

  const totalSpent = useMemo(
    () => visibleBudgetData.reduce((sum, item) => sum + item.spent, 0),
    [visibleBudgetData]
  );

  const selectedProject = useMemo(
    () => filteredProjects.find((item) => item.id === selectedProjectId) || null,
    [filteredProjects, selectedProjectId]
  );

  useEffect(() => {
    if (!externalSelectedProjectId) return;

    const selectedItem = boardProjects.find((item) => item.id === externalSelectedProjectId);
    if (!selectedItem) return;

    setSearch(selectedItem.id);
    setDepartmentFilter(selectedItem.department);
    setStatusFilter(selectedItem.status);
    setHealthFilter(selectedItem.health);
    setViewMode('board');
  }, [externalSelectedProjectId, projectFocusToken]);

  useEffect(() => {
    if (!projectsScrollToken) return;

    if (projectsListRef.current) {
      projectsListRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, [projectsScrollToken]);

  const selectedProjectSprints = useMemo(
    () => {
      if (!selectedProject) return [];

      const sprintProjectId = sprintProjectByDashboardProject[selectedProject.id];
      const sprintDetail = sprintDetails[sprintProjectId];
      if (!sprintDetail) return [];

      return sprintDetail.velocity.map((item) => {
        const completion = Math.round((item.completed / Math.max(item.planned, 1)) * 100);
        const health = sprintHealthFromCompletion(completion);

        return {
          sprint: item.sprint,
          commit: item.planned,
          done: item.completed,
          carryOver: Math.max(item.planned - item.completed, 0),
          completion,
          status: health.label,
          tone: health.tone,
        };
      });
    },
    [selectedProject]
  );

  const selectedSprintProject = useMemo(() => {
    if (!selectedProject) return null;
    const sprintProjectId = sprintProjectByDashboardProject[selectedProject.id];
    return sprintProjects.find((item) => item.id === sprintProjectId) || null;
  }, [selectedProject]);

  const processStageIndex = selectedProject
    ? selectedProject.progress >= 96
      ? 3
      : selectedProject.progress >= 75
        ? 2
        : selectedProject.progress >= 40
          ? 1
          : 0
    : 0;

  const processStages = ['Discovery', 'Build', 'Quality', 'Release'];
  const activeFilterSummary = selectedProject
    ? [
        { label: 'Project', value: selectedProject.title },
        { label: 'Department', value: selectedProject.department },
        { label: 'Status', value: selectedProject.status },
        { label: 'Health', value: selectedProject.health },
      ]
    : [];

  return (
    <div className="tm-projects-root">
      <section className="tm-member-toolbar tm-project-filters">
        <div className="tm-search-box">
          <Search size={17} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by project ID, title, or owner..."
          />
        </div>

        <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}>
          {departments.map((department) => (
            <option key={department} value={department}>{department === 'All' ? 'All Departments' : department}</option>
          ))}
        </select>

        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          {statuses.map((status) => (
            <option key={status} value={status}>{status === 'All' ? 'All Statuses' : status}</option>
          ))}
        </select>

        <select value={healthFilter} onChange={(event) => setHealthFilter(event.target.value)}>
          {healthLevels.map((health) => (
            <option key={health} value={health}>{health === 'All' ? 'All Health Levels' : health}</option>
          ))}
        </select>
      </section>

      {selectedProject ? (
        <section className="tm-project-focus-strip tm-project-anim-panel">
          <div>
            <p className="tm-executive-eyebrow">Focused project view</p>
            <h3>{selectedProject.title}</h3>
            <p className="tm-muted">The filters below are auto-applied from the card you clicked.</p>
          </div>
          <div className="tm-project-focus-meta">
            {activeFilterSummary.map((item) => (
              <div key={item.label}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </div>
            ))}
          </div>
        </section>
      ) : null}

      <section className="tm-kpi-grid tm-projects-kpis">
        <article className="tm-kpi-card tm-project-anim-kpi" style={{ '--proj-index': 0 }}>
          <span className="tm-kpi-icon blue"><BriefcaseBusiness size={16} /></span>
          <p>Active Projects</p>
          <h3>{filteredProjects.length}</h3>
          <small>Filtered portfolio</small>
        </article>
        <article className="tm-kpi-card tm-project-anim-kpi" style={{ '--proj-index': 1 }}>
          <span className="tm-kpi-icon mint"><CheckCircle2 size={16} /></span>
          <p>On Track / Ahead</p>
          <h3>{`${filteredProjects.filter((item) => item.status === 'On Track' || item.status === 'Ahead').length}/${filteredProjects.length || 0}`}</h3>
          <small>Portfolio quality</small>
        </article>
        <article className="tm-kpi-card tm-project-anim-kpi" style={{ '--proj-index': 2 }}>
          <span className="tm-kpi-icon amber"><AlertTriangle size={16} /></span>
          <p>At Risk</p>
          <h3>{filteredProjects.filter((item) => item.status === 'At Risk').length}</h3>
          <small>Need attention</small>
        </article>
        <article className="tm-kpi-card tm-project-anim-kpi" style={{ '--proj-index': 3 }}>
          <span className="tm-kpi-icon lavender"><TrendingUp size={16} /></span>
          <p>Total Budget Committed</p>
          <h3>{`$${totalBudget}K`}</h3>
          <small>{`$${totalSpent}K spent (${totalBudget ? Math.round((totalSpent / totalBudget) * 100) : 0}%)`}</small>
        </article>
      </section>

      <section className="tm-overview-grid tm-projects-grid">
        <article className="tm-panel tm-projects-chart-panel tm-project-anim-panel" style={{ '--proj-index': 0 }}>
          <div className="tm-panel-head">
            <div>
              <h3>Project Budget vs Spend</h3>
              <p>Total allocated vs actual spend per project</p>
            </div>
            <div className="tm-project-legend">
              <span><i className="budget" />Budget</span>
              <span><i className="spent" />Spent</span>
            </div>
          </div>

          <svg viewBox="0 0 640 230" className="tm-chart tm-project-chart" aria-label="Project budget and spend chart">
            {yTicks.map((tick) => {
              const y = chartBottom - (tick / 600) * chartHeight;
              return (
                <g key={tick}>
                  <line x1="58" y1={y} x2="615" y2={y} />
                  <text x="22" y={y + 4}>{`$${tick}K`}</text>
                </g>
              );
            })}

            {visibleBudgetData.map((item, index) => {
              const groupX = 98 + index * 88;
              const budgetHeight = (item.budget / 600) * chartHeight;
              const spentHeight = (item.spent / 600) * chartHeight;
              const budgetY = chartBottom - budgetHeight;
              const spentY = chartBottom - spentHeight;
              return (
                <g
                  key={item.code}
                  className="tm-project-bars"
                  onMouseEnter={() => setHoveredBarIndex(index)}
                  onMouseLeave={() => setHoveredBarIndex(null)}
                >
                  <rect x={groupX} y={budgetY} width="22" height={budgetHeight} rx="4" className="tm-budget-bar" />
                  <rect x={groupX + 28} y={spentY} width="22" height={spentHeight} rx="4" style={{ fill: item.color }} />
                  <text x={groupX + 25} y="208" textAnchor="middle">{item.code}</text>

                  <g
                    className={`tm-project-tooltip ${hoveredBarIndex === index ? 'active' : ''}`}
                    transform={`translate(${groupX + 10} ${Math.min(budgetY, spentY) - 74})`}
                  >
                    <rect width="118" height="66" rx="10" ry="10" />
                    <text x="10" y="17" className="tm-tooltip-label">{item.code}</text>
                    <text x="10" y="37" className="tm-tooltip-value">budget : ${item.budget}K</text>
                    <text x="10" y="54" className="tm-tooltip-value">spent : ${item.spent}K</text>
                  </g>
                </g>
              );
            })}
          </svg>
        </article>

        <article className="tm-panel tm-project-health-panel tm-project-anim-panel" style={{ '--proj-index': 1 }}>
          <h3>Portfolio Health</h3>
          <ul className="tm-project-health-list">
            {portfolioHealthSummary.map((item, index) => (
              <li key={item.label} className={`${item.tone} tm-project-health-item`} style={{ '--proj-index': index }}>
                <span>{item.label}</span>
                <strong>{item.value}</strong>
              </li>
            ))}
          </ul>

          <div className="tm-project-deadlines">
            <p>UPCOMING DEADLINES</p>
            <ul>
              {upcomingDeadlineItems.map((item, index) => (
                <li key={item.title} className="tm-project-deadline-item" style={{ '--proj-index': index }}>
                  <span>{item.title}</span>
                  <strong>{item.due}</strong>
                </li>
              ))}
            </ul>
          </div>
        </article>
      </section>

      <section
        ref={projectsListRef}
        className="tm-panel tm-project-board-panel tm-project-anim-panel"
        style={{ '--proj-index': 2 }}
      >
        <div className="tm-project-board-head">
          <h3>All Projects</h3>
          <div className="tm-view-toggle">
            <button
              type="button"
              className={viewMode === 'board' ? 'active' : ''}
              onClick={() => setViewMode('board')}
            >
              Board
            </button>
            <button
              type="button"
              className={viewMode === 'list' ? 'active' : ''}
              onClick={() => setViewMode('list')}
            >
              List
            </button>
          </div>
        </div>

        <div className="tm-project-board-layout">
          {viewMode === 'board' ? (
            <div className="tm-board-grid">
              {filteredProjects.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`tm-board-card tm-project-anim-card ${selectedProjectId === item.id ? 'active' : ''}`}
                  style={{ '--proj-index': index }}
                  onClick={() => {
                    if (onProjectSelect) {
                      onProjectSelect(item.id);
                      return;
                    }
                    setInternalSelectedProjectId(item.id);
                  }}
                >
                  <div className="tm-board-card-top">
                    <span className="tm-board-id">{item.id}</span>
                    <div>
                      <em className={`tm-chip ${item.healthTone}`}>{item.health}</em>
                      <em className={`tm-chip ${item.paceTone}`}>{item.pace}</em>
                    </div>
                  </div>
                  <h4>{item.title}</h4>
                  <p>{item.summary}</p>
                  <div className="tm-board-progress-row">
                    <span>Progress</span>
                    <strong>{item.progress}%</strong>
                  </div>
                  <div className="tm-board-progress-track">
                    <div style={{ width: `${item.progress}%`, background: item.progressColor }} />
                  </div>
                  <div className="tm-board-meta-row">
                    <span className="tm-owner-pill">{item.ownerInitials}</span>
                    <span>{item.owner}</span>
                    <span><Users2 size={14} /> {item.members}</span>
                    <span><CalendarDays size={14} /> {item.due}</span>
                    <span><Clock3 size={14} /> {item.done}/{item.total}</span>
                  </div>
                </button>
              ))}
              {!filteredProjects.length ? <p className="tm-empty">No projects match current filters.</p> : null}
            </div>
          ) : (
            <div className="tm-project-list-mode">
              {filteredProjects.map((item, index) => (
                <button
                  key={item.id}
                  type="button"
                  className={`tm-project-list-row tm-project-anim-row ${selectedProjectId === item.id ? 'active' : ''}`}
                  style={{ '--proj-index': index }}
                  onClick={() => {
                    if (onProjectSelect) {
                      onProjectSelect(item.id);
                      return;
                    }
                    setInternalSelectedProjectId(item.id);
                  }}
                >
                  <strong>{item.id}</strong>
                  <span>{item.title}</span>
                  <em>{item.deadline}</em>
                  <b>{item.progress}%</b>
                </button>
              ))}
              {!filteredProjects.length ? <p className="tm-empty">No projects match current filters.</p> : null}
            </div>
          )}

          <aside className={`tm-project-detail tm-project-anim-detail ${selectedProject ? 'active' : ''}`}>
            {selectedProject ? (
              <>
                <div className="tm-project-hero">
                  <div className="tm-project-hero-top">
                    <small>{selectedProject.id}</small>
                    <em className={selectedProject.healthTone}>{selectedProject.health}</em>
                  </div>
                  <h4>{selectedProject.title}</h4>
                  <p>{selectedProject.department}</p>
                </div>

                <div className="tm-project-overall-progress">
                  <div>
                    <span>Overall Progress</span>
                    <strong>{selectedProject.progress}%</strong>
                  </div>
                  <div className="tm-project-overall-track">
                    <div style={{ width: `${selectedProject.progress}%` }} />
                  </div>
                </div>

                <div className="tm-project-detail-stats">
                  <article><span>TEAM SIZE</span><strong>{selectedProject.teamSize}</strong></article>
                  <article><span>DEADLINE</span><strong>{selectedProject.deadline}</strong></article>
                  <article><span>BUDGET</span><strong>{selectedProject.budget}</strong></article>
                  <article><span>SPENT</span><strong>{selectedProject.spent}</strong></article>
                  <article><span>TASKS DONE</span><strong>{`${selectedProject.done}/${selectedProject.total}`}</strong></article>
                  <article><span>STATUS</span><strong>{selectedProject.status}</strong></article>
                </div>

                <div className="tm-project-milestones tm-project-process">
                  <h5>EXECUTION PROCESS</h5>
                  <ul>
                    {processStages.map((stage, index) => (
                      <li key={stage} className={index < processStageIndex ? 'done' : index === processStageIndex ? 'current' : ''}>
                        <i />
                        <span>{stage}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tm-project-milestones">
                  <h5>MILESTONES</h5>
                  <ul>
                    {milestoneItems.map((item) => (
                      <li key={item.text} className={item.done ? 'done' : item.current ? 'current' : ''}>
                        <i />
                        <span>{item.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="tm-project-milestones tm-project-sprints">
                  <h5>PROJECT SPRINTS</h5>
                  <div className="tm-project-sprint-table-wrap">
                    <table className="tm-project-sprint-table">
                      <thead>
                        <tr>
                          <th>Sprint</th>
                          <th>Planned/Done</th>
                          <th>Carryover</th>
                          <th>Commit/Done</th>
                          <th>Completion</th>
                          <th>Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {selectedProjectSprints.map((sprint) => (
                          <tr key={`${selectedProject.id}-${sprint.sprint}`}>
                            <td>{sprint.sprint}</td>
                            <td>{`${sprint.commit}/${sprint.done}`}</td>
                            <td>{sprint.carryOver}</td>
                            <td>{`${sprint.done}/${sprint.commit}`}</td>
                            <td>{`${sprint.completion}%`}</td>
                            <td><span className={`tm-chip ${sprint.tone}`}>{sprint.status}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="tm-project-tags">
                  <span>Backend</span>
                  <span>Infrastructure</span>
                  <span>API</span>
                </div>

                <div className="tm-project-lead">
                  <div className="tm-owner-pill large">{selectedProject.ownerInitials}</div>
                  <div>
                    <strong>{selectedProject.ownerFull}</strong>
                    <p>Project Lead</p>
                  </div>
                </div>

                <div className="tm-project-report-actions">
                  <button
                    type="button"
                    className="tm-project-report-btn"
                    onClick={() => {
                      if (selectedSprintProject) {
                        navigate(`/sprints/${selectedSprintProject.id}`);
                      }
                    }}
                  >
                    View Project Sprints
                  </button>
                  <button
                    type="button"
                    className="tm-project-report-btn tm-project-report-secondary"
                    onClick={() => {
                      if (selectedSprintProject && selectedProjectSprints.length) {
                        const latestSprint = selectedProjectSprints[selectedProjectSprints.length - 1].sprint;
                        navigate(`/sprints/${selectedSprintProject.id}/${latestSprint}`);
                      }
                    }}
                  >
                    Open Latest Sprint Detail
                  </button>
                </div>
              </>
            ) : (
              <div className="tm-project-detail-empty">
                <h4>Select a project</h4>
                <p>Choose any card from All Projects to view detailed timeline, progress, and milestones.</p>
              </div>
            )}
          </aside>
        </div>
      </section>

      <section className="tm-panel tm-project-board-panel tm-project-anim-panel" style={{ '--proj-index': 3 }}>
        <div className="tm-project-board-head">
          <h3>Completed Projects Archive</h3>
          <p className="tm-muted">Board-level delivery outcomes and closure quality</p>
        </div>

        <div className="tm-completed-grid">
          {completedProjectsArchive.map((project) => (
            <article key={project.id} className="tm-completed-card">
              <div className="tm-board-card-top">
                <span className="tm-board-id">{project.id}</span>
                <em className="tm-chip ontrack">Completed</em>
              </div>
              <h4>{project.title}</h4>
              <p>{project.client}</p>
              <div className="tm-project-detail-stats">
                <article><span>OWNER</span><strong>{project.owner}</strong></article>
                <article><span>COMPLETED</span><strong>{project.completedOn}</strong></article>
                <article><span>BUDGET</span><strong>{project.budget}</strong></article>
                <article><span>SPENT</span><strong>{project.spent}</strong></article>
              </div>
              <div className="tm-project-tags">
                <span>{project.impact}</span>
                <span>{project.quality}</span>
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
};

export default ProjectsTab;
