import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, CalendarDays, CheckCircle2, Clock3, ListChecks, Target } from 'lucide-react';
import './Sprints.css';
import { sprintDetails, sprintProjects } from './sprintData';

const normalizeStatus = (status) => {
  const value = String(status || '').toLowerCase().trim();

  if (value === 'done' || value === 'completed') return 'done';
  if (value === 'in progress' || value === 'active') return 'inProgress';
  if (value === 'review' || value === 'qa' || value === 'review/qa') return 'review';
  if (value === 'blocked') return 'blocked';
  if (value === 'to do' || value === 'todo' || value === 'backlog' || value === 'pending') return 'todo';

  return 'todo';
};

const formatStatusLabel = (status) => {
  const key = normalizeStatus(status);

  if (key === 'done') return 'Done';
  if (key === 'inProgress') return 'In Progress';
  if (key === 'review') return 'Review';
  if (key === 'blocked') return 'Blocked';
  return 'To Do';
};

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const SprintMemberDetail = () => {
  const { memberName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const decodedMemberName = decodeURIComponent(memberName || '').trim();

  const memberData = useMemo(() => {
    const rows = [];

    Object.entries(sprintDetails).forEach(([projectId, projectDetails]) => {
      const project = sprintProjects.find((item) => item.id === projectId);
      if (!project || !Array.isArray(projectDetails?.board)) {
        return;
      }

      const memberTasks = projectDetails.board.filter(
        (task) => String(task.owner || '').toLowerCase() === decodedMemberName.toLowerCase(),
      );

      if (memberTasks.length === 0) {
        return;
      }

      const summary = {
        done: 0,
        inProgress: 0,
        review: 0,
        blocked: 0,
        todo: 0,
      };

      let points = 0;
      const prioritySummary = { High: 0, Medium: 0, Low: 0 };
      memberTasks.forEach((task) => {
        const key = normalizeStatus(task.status);
        summary[key] += 1;
        points += Number(task.points || 0);
        if (prioritySummary[task.priority]) {
          prioritySummary[task.priority] += 1;
        }
      });

      const assigned = memberTasks.length;
      const completion = Math.round((summary.done / Math.max(assigned, 1)) * 100);

      rows.push({
        projectId,
        projectName: project.name,
        sprint: project.sprint,
        sprintState: project.health,
        duration: `${project.startDate} - ${project.endDate}`,
        assigned,
        points,
        completion,
        sprintHistory: Array.isArray(projectDetails.sprints) ? projectDetails.sprints : [],
        tasks: memberTasks,
        prioritySummary,
        ...summary,
      });
    });

    rows.sort((a, b) => b.assigned - a.assigned);

    const totals = rows.reduce(
      (acc, row) => {
        acc.assigned += row.assigned;
        acc.done += row.done;
        acc.inProgress += row.inProgress;
        acc.review += row.review;
        acc.blocked += row.blocked;
        acc.todo += row.todo;
        acc.points += row.points;
        return acc;
      },
      { assigned: 0, done: 0, inProgress: 0, review: 0, blocked: 0, todo: 0, points: 0 },
    );

    totals.completion = Math.round((totals.done / Math.max(totals.assigned, 1)) * 100);

    return { rows, totals };
  }, [decodedMemberName]);

  const backTo = location.state?.from || '/sprints';
  const sourceProjectId = location.state?.projectId;
  const sourceSprintId = location.state?.sprintId;

  const initialProjectId = useMemo(() => {
    if (sourceProjectId && memberData.rows.some((row) => row.projectId === sourceProjectId)) {
      return sourceProjectId;
    }

    const path = String(location.state?.from || '');
    const matched = path.match(/^\/sprints\/([^/]+)/);
    if (matched?.[1]) {
      const parsedProjectId = decodeURIComponent(matched[1]);
      if (memberData.rows.some((row) => row.projectId === parsedProjectId)) {
        return parsedProjectId;
      }
    }

    return memberData.rows[0]?.projectId || '';
  }, [location.state, memberData.rows, sourceProjectId]);

  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);

  useEffect(() => {
    setSelectedProjectId(initialProjectId);
  }, [initialProjectId]);

  const selectedProjectData = useMemo(() => {
    const picked = memberData.rows.find((row) => row.projectId === selectedProjectId);
    return picked || memberData.rows[0] || null;
  }, [memberData.rows, selectedProjectId]);

  const sprintOptions = useMemo(() => {
    if (!selectedProjectData) {
      return [];
    }

    if (Array.isArray(selectedProjectData.sprintHistory) && selectedProjectData.sprintHistory.length > 0) {
      return selectedProjectData.sprintHistory;
    }

    return [
      {
        id: selectedProjectData.sprint,
        title: 'Current Sprint',
        subtitle: selectedProjectData.projectName,
        status: selectedProjectData.sprintState,
        progress: selectedProjectData.completion,
        tasks: `${selectedProjectData.assigned} tasks`,
      },
    ];
  }, [selectedProjectData]);

  const [selectedSprintId, setSelectedSprintId] = useState('');

  useEffect(() => {
    if (!sprintOptions.length) {
      setSelectedSprintId('');
      return;
    }

    const preferredSprintId = sourceSprintId || selectedProjectData?.sprint;
    const matchingOption = sprintOptions.find((item) => item.id === preferredSprintId);
    setSelectedSprintId(matchingOption ? matchingOption.id : sprintOptions[0].id);
  }, [sourceSprintId, sprintOptions, selectedProjectData]);

  const selectedSprintData = useMemo(() => {
    if (!sprintOptions.length) {
      return null;
    }

    const selected = sprintOptions.find((item) => item.id === selectedSprintId);
    return selected || sprintOptions[0];
  }, [sprintOptions, selectedSprintId]);

  const selectedSprintHistoryRows = useMemo(() => {
    if (!selectedSprintData || !Array.isArray(selectedProjectData?.sprintHistory)) {
      return [];
    }

    return selectedProjectData.sprintHistory.filter((item) => item.id === selectedSprintData.id);
  }, [selectedProjectData, selectedSprintData]);

  const performanceInsights = useMemo(() => {
    if (!selectedProjectData) {
      return null;
    }

    const total = Math.max(selectedProjectData.assigned, 1);
    const doneRate = Math.round((selectedProjectData.done / total) * 100);
    const inFlightCount = selectedProjectData.inProgress + selectedProjectData.review;
    const inFlightRate = Math.round((inFlightCount / total) * 100);
    const blockedRate = Math.round((selectedProjectData.blocked / total) * 100);
    const highPriorityRate = Math.round((selectedProjectData.prioritySummary.High / total) * 100);
    const avgPointsPerTask = Number((selectedProjectData.points / total).toFixed(1));

    const deliveryScore = clamp(Math.round((doneRate * 0.62) + (inFlightRate * 0.23) + ((100 - blockedRate) * 0.15)));
    const qualityScore = clamp(Math.round((((selectedProjectData.done + selectedProjectData.review) / total) * 100) - (blockedRate * 0.5)));

    let momentumLabel = 'Stable Delivery';
    if (deliveryScore >= 75 && blockedRate <= 10) momentumLabel = 'High Momentum';
    if (deliveryScore < 50 || blockedRate >= 25) momentumLabel = 'Needs Attention';

    const strengths = [];
    if (doneRate >= 40) strengths.push('Strong closure rate on assigned tasks.');
    if (qualityScore >= 70) strengths.push('Healthy quality signal with strong done/review balance.');
    if (avgPointsPerTask >= 5) strengths.push('Handling medium to high-complexity work items.');

    const focusAreas = [];
    if (blockedRate >= 20) focusAreas.push('Reduce blocked tasks by early dependency follow-ups.');
    if (selectedProjectData.todo >= selectedProjectData.done) focusAreas.push('Prioritize top pending items to lift completion pace.');
    if (highPriorityRate >= 40) focusAreas.push('High critical-load ownership; keep sprint planning buffer.');

    if (strengths.length === 0) {
      strengths.push('Consistent participation across active sprint tasks.');
    }

    if (focusAreas.length === 0) {
      focusAreas.push('Maintain current execution rhythm and quality checks.');
    }

    return {
      doneRate,
      inFlightRate,
      blockedRate,
      highPriorityRate,
      avgPointsPerTask,
      deliveryScore,
      qualityScore,
      momentumLabel,
      strengths,
      focusAreas,
    };
  }, [selectedProjectData]);

  if (!decodedMemberName || memberData.rows.length === 0 || !selectedProjectData) {
    return (
      <div className="dashboard-wrapper sprint-page sprint-member-page">
        <header className="main-header">
          <div>
            <h1>Member Not Found</h1>
            <p>No sprint activity found for this team member.</p>
          </div>
        </header>
        <button type="button" className="action-btn primary-btn" onClick={() => navigate(backTo)}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper sprint-page sprint-member-page">
      <header className="sprint-member-header">
        <div>
          <button type="button" className="sprint-back-link" onClick={() => navigate(backTo)}>
            <ArrowLeft size={14} /> Back
          </button>
          <p className="sprint-dashboard-eyebrow">Team Member Progress</p>
          <h1>{decodedMemberName}</h1>
          <p className="sprint-project-subtitle">Detailed project-wise and sprint-wise contribution</p>
        </div>
        <div className="sprint-member-project-switch">
          <label htmlFor="member-sprint-select">Sprint</label>
          <select
            id="member-sprint-select"
            className="sprint-member-select"
            value={selectedSprintData?.id || ''}
            onChange={(event) => setSelectedSprintId(event.target.value)}
          >
            {sprintOptions.map((item) => (
              <option key={item.id} value={item.id}>
                {item.id} - {item.title}
              </option>
            ))}
          </select>
        </div>
      </header>

      <section className="sprint-member-summary-grid">
        <article className="sprint-member-summary-card">
          <div className="sprint-member-summary-icon">
            <Briefcase size={18} />
          </div>
          <div>
            <p>Total Projects</p>
            <h3>{memberData.rows.length}</h3>
          </div>
        </article>
        <article className="sprint-member-summary-card">
          <div className="sprint-member-summary-icon done">
            <CheckCircle2 size={18} />
          </div>
          <div>
            <p>Completed Tasks</p>
            <h3>{selectedProjectData.done}</h3>
          </div>
        </article>
        <article className="sprint-member-summary-card">
          <div className="sprint-member-summary-icon progress">
            <Clock3 size={18} />
          </div>
          <div>
            <p>Overall Completion</p>
            <h3>{selectedProjectData.completion}%</h3>
          </div>
        </article>
        <article className="sprint-member-summary-card">
          <div className="sprint-member-summary-icon">
            <ListChecks size={18} />
          </div>
          <div>
            <p>Total Assigned Tasks</p>
            <h3>{selectedProjectData.assigned}</h3>
          </div>
        </article>
        <article className="sprint-member-summary-card">
          <div className="sprint-member-summary-icon progress">
            <Target size={18} />
          </div>
          <div>
            <p>Story Points</p>
            <h3>{selectedProjectData.points}</h3>
          </div>
        </article>
      </section>

      <section className="sprint-member-performance-band">
        <article className="sprint-member-performance-card sprint-member-performance-score-card">
          <p className="sprint-summary-label">Performance Score</p>
          <div className="sprint-member-performance-score-row">
            <h2>{performanceInsights?.deliveryScore ?? 0}</h2>
            <span className="sprint-member-performance-state">{performanceInsights?.momentumLabel}</span>
          </div>
          <div className="sprint-member-performance-track" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={performanceInsights?.deliveryScore ?? 0}>
            <span style={{ width: `${performanceInsights?.deliveryScore ?? 0}%` }} />
          </div>
          <div className="sprint-member-performance-metrics">
            <div>
              <p>Completion Rate</p>
              <strong>{performanceInsights?.doneRate ?? 0}%</strong>
            </div>
            <div>
              <p>In Flight</p>
              <strong>{performanceInsights?.inFlightRate ?? 0}%</strong>
            </div>
            <div>
              <p>Blocked</p>
              <strong>{performanceInsights?.blockedRate ?? 0}%</strong>
            </div>
            <div>
              <p>Quality Score</p>
              <strong>{performanceInsights?.qualityScore ?? 0}</strong>
            </div>
          </div>
        </article>

        <article className="sprint-member-performance-card">
          <div className="sprint-panel-heading">
            <div>
              <h2>Performance Insights</h2>
              <p className="sprint-panel-copy">
                {selectedProjectData.projectName} contribution profile for {decodedMemberName}
              </p>
            </div>
          </div>

          <div className="sprint-member-performance-pills">
            <span>Critical Load: {performanceInsights?.highPriorityRate ?? 0}%</span>
            <span>Avg Story Points / Task: {performanceInsights?.avgPointsPerTask ?? 0}</span>
            <span>Sprint Signal: {selectedSprintData?.progress ?? selectedProjectData.completion}%</span>
          </div>

          <div className="sprint-member-performance-grid">
            <div>
              <h4>Strengths</h4>
              <ul>
                {(performanceInsights?.strengths || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
            <div>
              <h4>Focus Areas</h4>
              <ul>
                {(performanceInsights?.focusAreas || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </article>
      </section>

      <section className="sprint-member-columns">
        <article className="sprint-panel">
          <div className="sprint-panel-heading">
            <div>
              <h2>Project Wise Progress</h2>
              <p className="sprint-panel-copy">Detailed contribution and task-level metrics by project</p>
            </div>
          </div>
          <div className="sprint-member-project-list">
            <div key={selectedProjectData.projectId} className="sprint-member-project-item">
              <div className="sprint-member-project-title-row">
                <div>
                  <strong>{selectedProjectData.projectName}</strong>
                  <p className="sprint-member-project-subline">Current: {selectedProjectData.sprint} • {selectedProjectData.sprintState}</p>
                </div>
                <span>{selectedProjectData.completion}%</span>
              </div>
              <p>{selectedProjectData.assigned} tasks • {selectedProjectData.points} story points</p>
              <div className="sprint-progress-bar">
                <span className="sprint-progress-segment closed" style={{ width: `${selectedProjectData.completion}%` }} />
                <span className="sprint-progress-segment open" style={{ width: `${Math.max(0, 100 - selectedProjectData.completion)}%` }} />
              </div>

              <div className="sprint-member-status-row">
                <span>Done: {selectedProjectData.done}</span>
                <span>In Progress: {selectedProjectData.inProgress}</span>
                <span>Review: {selectedProjectData.review}</span>
                <span>Blocked: {selectedProjectData.blocked}</span>
                <span>To Do: {selectedProjectData.todo}</span>
              </div>

              <div className="sprint-member-status-row">
                <span>High: {selectedProjectData.prioritySummary.High}</span>
                <span>Medium: {selectedProjectData.prioritySummary.Medium}</span>
                <span>Low: {selectedProjectData.prioritySummary.Low}</span>
              </div>

              <div className="sprint-member-task-grid">
                {selectedProjectData.tasks.map((task) => (
                  <div key={task.id} className="sprint-member-task-item">
                    <div className="sprint-member-task-top">
                      <strong>{task.id}</strong>
                      <span className="sprint-member-sprint-badge">{formatStatusLabel(task.status)}</span>
                    </div>
                    <p>{task.title}</p>
                    <div className="sprint-member-task-meta">
                      <span>Priority: {task.priority}</span>
                      <span>Points: {task.points}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>

        <article className="sprint-panel">
          <div className="sprint-panel-heading">
            <div>
              <h2>Sprint Wise Details</h2>
              <p className="sprint-panel-copy">Sprint timeline and member contribution snapshot</p>
            </div>
          </div>
          <div className="sprint-member-sprint-list">
            <div key={`${selectedProjectData.projectId}-sprint`} className="sprint-member-sprint-item">
              <div className="sprint-member-sprint-heading">
                <div>
                  <strong>{selectedSprintData?.id || selectedProjectData.sprint}</strong>
                  <p>{selectedSprintData?.subtitle || selectedProjectData.projectName}</p>
                </div>
                <span className="sprint-member-sprint-badge">{selectedSprintData?.tasks || `${selectedProjectData.assigned} tasks`}</span>
              </div>
              <div className="sprint-member-sprint-meta">
                <span><CalendarDays size={14} /> {selectedProjectData.duration}</span>
              </div>
              <div className="sprint-member-status-row">
                <span>Done: {selectedProjectData.done}</span>
                <span>In Progress: {selectedProjectData.inProgress}</span>
                <span>Review: {selectedProjectData.review}</span>
                <span>Blocked: {selectedProjectData.blocked}</span>
                <span>To Do: {selectedProjectData.todo}</span>
              </div>

              <div className="sprint-member-history-list">
                {selectedSprintHistoryRows.map((item) => (
                  <div key={`${selectedProjectData.projectId}-${item.id}`} className="sprint-member-history-item">
                    <div>
                      <strong>{item.id} - {item.title}</strong>
                      <p>{item.subtitle}</p>
                    </div>
                    <div className="sprint-member-history-meta">
                      <span>{item.status}</span>
                      <span>{item.progress}%</span>
                      <span>{item.tasks}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
};

export default SprintMemberDetail;
