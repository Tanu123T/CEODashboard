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

  const initialProjectId = useMemo(() => {
    const fromState = location.state?.projectId;
    if (fromState) return fromState;

    const path = String(location.state?.from || '');
    const matched = path.match(/^\/sprints\/([^/]+)/);
    if (matched?.[1]) return decodeURIComponent(matched[1]);

    return memberData.rows[0]?.projectId || '';
  }, [location.state, memberData.rows]);

  const [selectedProjectId, setSelectedProjectId] = useState(initialProjectId);

  useEffect(() => {
    setSelectedProjectId(initialProjectId);
  }, [initialProjectId]);

  const selectedProjectData = useMemo(() => {
    const picked = memberData.rows.find((row) => row.projectId === selectedProjectId);
    return picked || memberData.rows[0] || null;
  }, [memberData.rows, selectedProjectId]);

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
          <label htmlFor="member-project-select">Project</label>
          <select
            id="member-project-select"
            className="sprint-member-select"
            value={selectedProjectData.projectId}
            onChange={(event) => setSelectedProjectId(event.target.value)}
          >
            {memberData.rows.map((row) => (
              <option key={row.projectId} value={row.projectId}>
                {row.projectName}
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
                  <strong>{selectedProjectData.sprint}</strong>
                  <p>{selectedProjectData.projectName}</p>
                </div>
                <span className="sprint-member-sprint-badge">{selectedProjectData.assigned} tasks</span>
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
                {selectedProjectData.sprintHistory.map((item) => (
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
