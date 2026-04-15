import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Briefcase, Bug, ChevronLeft, ChevronRight, Clock3, Star, Target, Users } from 'lucide-react';
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

const clamp = (value, min = 0, max = 100) => Math.min(max, Math.max(min, value));

const SprintMemberDetail = () => {
  const { memberName } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const decodedMemberName = decodeURIComponent(memberName || '').trim();
  const deepDiveRef = useRef(null);

  const scrollDeepDive = (direction) => {
    if (!deepDiveRef.current) return;
    deepDiveRef.current.scrollBy({
      left: direction === 'next' ? 520 : -520,
      behavior: 'smooth',
    });
  };

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

  const selectedProjectData = useMemo(() => {
    const picked = memberData.rows.find((row) => row.projectId === initialProjectId);
    return picked || memberData.rows[0] || null;
  }, [memberData.rows, initialProjectId]);

  const sortedSprintHistory = useMemo(() => {
    if (!selectedProjectData || !Array.isArray(selectedProjectData.sprintHistory)) {
      return [];
    }

    return [...selectedProjectData.sprintHistory].reverse();
  }, [selectedProjectData]);

  const sprintOptions = useMemo(() => {
    if (!selectedProjectData) {
      return [];
    }

    if (sortedSprintHistory.length > 0) {
      return sortedSprintHistory;
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

  const deepDiveRows = useMemo(() => {
    if (!selectedProjectData) {
      return [];
    }

    const baseAssigned = Math.max(selectedProjectData.assigned, 1);
    const basePoints = Math.max(selectedProjectData.points, baseAssigned);

    return sortedSprintHistory.map((item, index, list) => {
      const completionRate = clamp(Number(item.progress || 0), 0, 100);
      const sprintLoadFactor = 0.8 + (index * 0.08);
      const total = Math.max(1, Math.round(baseAssigned * sprintLoadFactor));
      const completed = Math.max(0, Math.min(total, Math.round((total * completionRate) / 100)));
      const previous = index > 0 ? list[index - 1] : null;
      const previousProgress = previous ? Number(previous.progress || 0) : completionRate;
      const progressDelta = Math.round(completionRate - previousProgress);
      const storyPoints = Math.max(8, Math.round((basePoints / baseAssigned) * total));
      const bugsFixed = Math.max(0, Math.round(completed * 0.28));
      const hours = Math.max(20, Math.round(storyPoints * 1.9));
      const quality = clamp(Math.round((completionRate / 10) + (item.status === 'completed' ? 1 : 0)), 5, 10);
      const collaboration = clamp(Math.round(7 + (completionRate / 35) + (item.status === 'active' ? 1 : 0)), 6, 10);
      const onTimeDelivery = clamp(completionRate + (item.status === 'completed' ? 2 : -3), 60, 98);
      const qualityRate = clamp((quality * 10) - (item.status === 'active' ? 4 : 0), 58, 96);
      const score = clamp(Math.round((completionRate * 0.5) + (quality * 5) + (collaboration * 2.5)), 45, 98);

      let grade = 'C';
      let gradeLabel = 'Steady';
      if (score >= 90) {
        grade = 'S';
        gradeLabel = 'Exceptional';
      } else if (score >= 80) {
        grade = 'A';
        gradeLabel = 'Excellent';
      } else if (score >= 70) {
        grade = 'B';
        gradeLabel = 'Strong';
      }

      return {
        id: item.id,
        title: item.title,
        status: item.status,
        completionRate,
        onTimeDelivery,
        qualityRate,
        completed,
        total,
        storyPoints,
        bugsFixed,
        hours,
        quality,
        collaboration,
        score,
        grade,
        gradeLabel,
        progressDelta,
      };
    });
  }, [selectedProjectData]);

  const selectedSprintMetrics = useMemo(() => {
    if (!deepDiveRows.length) {
      return null;
    }

    const matched = deepDiveRows.find((row) => row.id === selectedSprintData?.id);
    return matched || deepDiveRows[0];
  }, [deepDiveRows, selectedSprintData]);

  const sprintRating = useMemo(() => {
    if (!selectedSprintMetrics) {
      return 0;
    }

    return Number(clamp(selectedSprintMetrics.score / 20, 1, 5).toFixed(1));
  }, [selectedSprintMetrics]);

  const profileImageUrl = useMemo(() => (
    `https://ui-avatars.com/api/?name=${encodeURIComponent(decodedMemberName)}&background=4b8fe7&color=ffffff&size=256&bold=true`
  ), [decodedMemberName]);

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
    <div className="dashboard-wrapper sprint-page sprint-member-page sprint-member-v2-page">
      <header className="sprint-member-v2-header">
        <div className="sprint-member-v2-headline">
          <button type="button" className="sprint-back-link" onClick={() => navigate(backTo)}>
            <ArrowLeft size={14} /> Back
          </button>
          <p className="sprint-member-v2-eyebrow">Member Performance Profile</p>
          <h1>{decodedMemberName}</h1>
          <p className="sprint-member-v2-subtitle">{selectedProjectData.projectName} · {selectedSprintData?.id || 'Sprint'} Insights</p>
        </div>

        <div className="sprint-member-v2-profile-corner">
          <div className="sprint-member-v2-avatar-ring">
            <div className="sprint-member-v2-avatar">
              <span>{decodedMemberName.slice(0, 2).toUpperCase()}</span>
              <img
                src={profileImageUrl}
                alt={`${decodedMemberName} profile`}
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            </div>
          </div>
          <div>
            <strong>{decodedMemberName}</strong>
            <span>Sprint Contributor</span>
          </div>
        </div>
      </header>

      <section className="sprint-member-v2-badges">
        <article className="sprint-member-v2-badge-item">
          <span className="sprint-member-v2-badge-label"><Target size={14} /> Total Stories</span>
          <strong>{selectedSprintMetrics?.storyPoints ?? 0}</strong>
        </article>
        <article className="sprint-member-v2-badge-item">
          <span className="sprint-member-v2-badge-label"><Bug size={14} /> Bugs Resolved</span>
          <strong>{selectedSprintMetrics?.bugsFixed ?? 0}</strong>
        </article>
        <article className="sprint-member-v2-badge-item">
          <span className="sprint-member-v2-badge-label"><Clock3 size={14} /> Hours Worked</span>
          <strong>{selectedSprintMetrics?.hours ?? 0}h</strong>
        </article>
        <article className="sprint-member-v2-badge-item">
          <span className="sprint-member-v2-badge-label"><Star size={14} /> Sprint Rating</span>
          <strong>{sprintRating}</strong>
        </article>
        <article className="sprint-member-v2-badge-item">
          <span className="sprint-member-v2-badge-label"><Star size={14} /> Quality Score</span>
          <strong>{selectedSprintMetrics?.qualityRate ?? 0}%</strong>
        </article>
        <article className="sprint-member-v2-badge-item">
          <span className="sprint-member-v2-badge-label"><Users size={14} /> Progress</span>
          <strong>{selectedSprintMetrics?.completionRate ?? 0}%</strong>
        </article>
      </section>

      <section className="sprint-panel sprint-member-deep-dive-shell">
        <div className="sprint-panel-heading sprint-member-deep-dive-heading">
          <div>
            <h2>Sprint-wise Deep Dive</h2>
            <p className="sprint-panel-copy">Detailed sprint-level contribution and delivery quality trends</p>
          </div>
          <div className="sprint-member-deep-nav">
            <button
              type="button"
              className="sprint-member-deep-nav-btn"
              onClick={() => scrollDeepDive('prev')}
              aria-label="Previous sprint"
            >
              <ChevronLeft size={16} />
            </button>
            <button
              type="button"
              className="sprint-member-deep-nav-btn"
              onClick={() => scrollDeepDive('next')}
              aria-label="Next sprint"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        <div className="sprint-member-deep-dive-list" ref={deepDiveRef}>
          {deepDiveRows.map((row) => {
            const isActive = row.id === selectedSprintData?.id;

            return (
              <article
                key={row.id}
                className={`sprint-member-deep-card ${isActive ? 'active' : ''}`}
                role="button"
                tabIndex={0}
                onClick={() => navigate(`/sprints/${selectedProjectData.projectId}/${encodeURIComponent(row.id)}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter' || event.key === ' ') {
                    event.preventDefault();
                    navigate(`/sprints/${selectedProjectData.projectId}/${encodeURIComponent(row.id)}`);
                  }
                }}
              >
                <div className="sprint-member-deep-head">
                  <div>
                    <div className="sprint-member-deep-badges">
                      <span className="sprint-member-deep-sprint-id">{row.id.toUpperCase()}</span>
                      <span className={`sprint-member-deep-status ${row.status}`}>{row.status}</span>
                    </div>
                    <h3>{row.id}</h3>
                    <p>{row.title}</p>
                  </div>
                </div>

                <div className="sprint-member-deep-metric-grid">
                  <div className="sprint-member-deep-metric">
                    <Target size={14} />
                    <strong>{row.storyPoints}</strong>
                    <span>Story Pts</span>
                  </div>
                  <div className="sprint-member-deep-metric">
                    <Bug size={14} />
                    <strong>{row.bugsFixed}</strong>
                    <span>Bugs Fixed</span>
                  </div>
                  <div className="sprint-member-deep-metric">
                    <Clock3 size={14} />
                    <strong>{row.hours}h</strong>
                    <span>Hours</span>
                  </div>
                </div>

                <div className="sprint-member-deep-bars">
                  <div className="sprint-member-deep-bar-row">
                    <span>Task Completion</span>
                    <div className="sprint-member-deep-bar-track"><span style={{ width: `${row.completionRate}%` }} /></div>
                    <strong>{row.completionRate}%</strong>
                  </div>
                  <div className="sprint-member-deep-bar-row">
                    <span>On-Time Delivery</span>
                    <div className="sprint-member-deep-bar-track"><span className="delivery" style={{ width: `${row.onTimeDelivery}%` }} /></div>
                    <strong>{row.onTimeDelivery}%</strong>
                  </div>
                  <div className="sprint-member-deep-bar-row">
                    <span>Quality Score</span>
                    <div className="sprint-member-deep-bar-track"><span className="quality" style={{ width: `${row.qualityRate}%` }} /></div>
                    <strong>{row.qualityRate}%</strong>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
};

export default SprintMemberDetail;
