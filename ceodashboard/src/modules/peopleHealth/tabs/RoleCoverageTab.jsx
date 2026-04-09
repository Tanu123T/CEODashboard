import React, { useEffect, useMemo, useState } from 'react';
import { BriefcaseBusiness, CheckCircle2, ChevronDown, ChevronUp, Mail, MapPin, Phone, X } from 'lucide-react';
import PeopleHealthPanelCard from '../components/PeopleHealthPanelCard';

const RoleCoverageTab = ({ members }) => {
  const [showAllMembers, setShowAllMembers] = useState(false);
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [showProjectDetails, setShowProjectDetails] = useState(false);
  const visibleMembers = showAllMembers ? members : members.slice(0, 6);

  useEffect(() => {
    if (!members.length) {
      setSelectedMemberId(null);
      setShowProjectDetails(false);
      return;
    }

    if (!selectedMemberId) {
      return;
    }

    const exists = members.some((item) => item.id === selectedMemberId);
    if (!exists) {
      setSelectedMemberId(null);
      setShowProjectDetails(false);
    }
  }, [members, selectedMemberId]);

  useEffect(() => {
    setShowProjectDetails(false);
  }, [selectedMemberId]);

  const selectedMember = useMemo(() => {
    if (!selectedMemberId) return null;
    return members.find((item) => item.id === selectedMemberId) || null;
  }, [members, selectedMemberId]);

  const selectedMemberInsights = useMemo(() => {
    if (!selectedMember) return null;

    const personId = Number(selectedMember.id.split('-')[1] || '1');
    const hiringChannels = ['Referral', 'Agency', 'Campus', 'Direct Application', 'Internal Transfer'];
    const priorEmployers = ['Globex Systems', 'Apex Retail', 'BlueOrbit Labs', 'Nimbus Health', 'Crestline Media', 'Vertex Finance'];
    const managerNotes = [
      'Strong ownership in delivery-critical weeks.',
      'Needs workload balancing in month-end cycles.',
      'High performer with stable execution quality.',
      'Good collaboration; retention conversation advised.',
      'Potential successor for next-level responsibility.',
    ];

    const joinDate = new Date(2018 + (personId % 7), (personId * 2) % 12, ((personId * 3) % 26) + 1);
    const promotionDate = new Date(joinDate.getFullYear() + 1 + (personId % 3), ((personId * 5) % 12), ((personId * 4) % 26) + 1);
    const now = new Date();
    const tenureMonths = Math.max(
      1,
      (now.getFullYear() - joinDate.getFullYear()) * 12 + (now.getMonth() - joinDate.getMonth())
    );
    const tenureYears = `${(tenureMonths / 12).toFixed(1)} yrs`;

    const attritionScore = Math.max(
      8,
      Math.min(94, Math.round(100 - selectedMember.stabilityIndex + (selectedMember.status === 'leave' ? 16 : 5) + (personId % 10)))
    );

    const attritionRisk = attritionScore >= 66 ? 'High' : attritionScore >= 40 ? 'Moderate' : 'Low';
    const resignationSignal = attritionRisk === 'High'
      ? 'Escalate retention review this month'
      : attritionRisk === 'Moderate'
        ? 'Monitor engagement and manager touchpoints'
        : 'No immediate resignation signal';

    const hiringChannel = hiringChannels[personId % hiringChannels.length];
    const hiredFrom = hiringChannel === 'Internal Transfer'
      ? 'NorthStar Internal Mobility'
      : priorEmployers[personId % priorEmployers.length];

    const isNewHire = tenureMonths <= 12;
    const employmentStage = isNewHire ? 'Newly Hired (<12 months)' : 'Established Employee';
    const successionReadiness = selectedMember.stabilityIndex >= 90
      ? 'Ready Now'
      : selectedMember.stabilityIndex >= 82
        ? 'Ready in 1-2 Quarters'
        : 'Needs Development';

    const taskLoad = Math.max(52, Math.min(94, selectedMember.stabilityIndex + 4 + (personId % 7)));
    const tasksAllocated = Math.round(taskLoad / 2.2);
    const completed = Math.max(8, Math.round(tasksAllocated * Math.min(0.88, selectedMember.stabilityIndex / 118)));
    const leaves = selectedMember.status === 'leave' ? 1 : 0;
    const delayed = Math.max(0, tasksAllocated - completed - leaves);
    const overallProgress = Math.max(36, Math.min(91, Math.round((completed / Math.max(tasksAllocated, 1)) * 100)));
    const checkInHour = 8 + (personId % 3);
    const checkInMinute = (personId * 7) % 60;

    const projectCatalog = ['Platform v3.0 Rebuild', 'ML Recommendation Engine', 'Identity Security Upgrade', 'Revenue Insights Hub', 'Client Success Portal'];
    const projectSeed = personId % projectCatalog.length;
    const currentProject = projectCatalog[projectSeed];
    const projectsWorked = [
      projectCatalog[projectSeed],
      projectCatalog[(projectSeed + 1) % projectCatalog.length],
      projectCatalog[(projectSeed + 2) % projectCatalog.length],
    ].map((name, index) => ({
      name,
      progress: Math.max(38, Math.min(89, overallProgress + 8 - (index * 11) + (personId % 6))),
    }));

    const roleCatalog = ['Project Lead', 'Technical Architect', 'Core Engineer', 'QA Lead', 'Data Engineer'];
    const sprintCatalog = ['Sprint 12', 'Sprint 13', 'Sprint 14', 'Sprint 15'];
    const durationWeeks = 8 + (personId % 7);
    const totalTasks = tasksAllocated + 10 + (personId % 8);
    const closedTasks = Math.min(totalTasks, completed + 8);
    const inProgressTasks = Math.max(0, totalTasks - closedTasks - delayed);

    return {
      employee: selectedMember.name,
      employeeCode: selectedMember.id.replace('-', ''),
      department: selectedMember.department,
      role: selectedMember.role,
      joinedOn: joinDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      hiredFrom,
      hiringChannel,
      employmentStage,
      tenure: tenureYears,
      attritionRisk,
      attritionScore: `${attritionScore}%`,
      resignationSignal,
      lastPromotion: promotionDate.toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      compensationBand: `Band ${String.fromCharCode(65 + (personId % 5))}-${(personId % 3) + 1}`,
      salary: `$${Math.round(132 + selectedMember.stabilityIndex * 0.7)}K`,
      successionReadiness,
      managerNote: managerNotes[personId % managerNotes.length],
      checkInTime: `${String(checkInHour).padStart(2, '0')}:${String(checkInMinute).padStart(2, '0')}`,
      presentLabel: selectedMember.status === 'leave' ? 'On Leave' : 'Present',
      taskLoad,
      tasksAllocated,
      completed,
      leaves,
      delayed,
      overallProgress,
      currentProject,
      tasksDone: completed,
      openTasks: Math.max(2, delayed + 3 + (personId % 5)),
      projectsWorked,
      projectRole: roleCatalog[personId % roleCatalog.length],
      projectDuration: `${durationWeeks} weeks`,
      projectSprint: sprintCatalog[personId % sprintCatalog.length],
      totalTasks,
      closedTasks,
      inProgressTasks,
      projectStartDate: new Date(now.getFullYear(), now.getMonth() - 2, 5 + (personId % 10)).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      projectEta: new Date(now.getFullYear(), now.getMonth() + 1, 12 + (personId % 10)).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      email: `${selectedMember.name.toLowerCase().replace(/[^a-z\s]/g, '').trim().replace(/\s+/g, '.')}@northstar.com`,
      phone: `+1 415 555 ${String(1000 + personId).slice(-4)}`,
      location: selectedMember.location,
    };
  }, [selectedMember]);

  useEffect(() => {
    if (!selectedMemberInsights) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedMemberId(null);
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedMemberInsights]);

  return (
    <div className="ph-tab-layout">
      <section className="ph-full-card">
        <PeopleHealthPanelCard
          title="All Members"
          subtitle={`Complete member directory - ${visibleMembers.length} of ${members.length} shown`}
          action={(
            <button
              type="button"
              className="ph-btn ghost ph-members-toggle"
              onClick={() => setShowAllMembers((value) => !value)}
            >
              {showAllMembers ? 'Show Less' : 'View All'}
            </button>
          )}
        >
          <div className="ph-member-grid">
            {visibleMembers.map((item) => {
              const statusLabel = item.status === 'leave' ? 'On Leave' : 'Active';
              const initials = item.name
                .split(' ')
                .filter(Boolean)
                .slice(0, 2)
                .map((part) => part[0])
                .join('');

              return (
                <article
                  key={item.id}
                  className="ph-member-card ph-member-card-selectable"
                  role="button"
                  tabIndex={0}
                  onClick={() => setSelectedMemberId(item.id)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      setSelectedMemberId(item.id);
                    }
                  }}
                >
                  <div className="ph-member-card-head">
                    <div className="ph-member-avatar" aria-hidden="true">
                      {initials}
                    </div>
                    <div className="ph-member-title">
                      <strong>{item.name}</strong>
                      <p>{item.role}</p>
                    </div>
                    <span className={`ph-member-badge ${item.status === 'leave' ? 'leave' : 'active'}`}>{statusLabel}</span>
                  </div>

                  <div className="ph-member-details">
                    <span>{item.department}</span>
                    <span>{item.location}</span>
                  </div>

                  <div className="ph-member-meter">
                    <div className="ph-member-meter-row">
                      <small>Stability</small>
                      <strong>{item.stabilityIndex}%</strong>
                    </div>
                    <div className="ph-member-meter-track">
                      <span style={{ width: `${item.stabilityIndex}%` }} />
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </PeopleHealthPanelCard>
      </section>

      {selectedMemberInsights ? (
        <div className="ph-member-modal-overlay" onClick={() => setSelectedMemberId(null)}>
          <section className="ph-member-modal ph-member-modal-card" onClick={(event) => event.stopPropagation()}>
            <button
              type="button"
              className="ph-member-modal-close"
              onClick={() => setSelectedMemberId(null)}
              aria-label="Close employee details"
            >
              <X size={16} />
            </button>

            <header className="ph-member-modal-headline">
              <div className="ph-member-modal-identity">
                <span className="ph-member-modal-avatar" aria-hidden="true">
                  {selectedMemberInsights.employee
                    .split(' ')
                    .filter(Boolean)
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join('')}
                </span>
                <div>
                  <h4>{selectedMemberInsights.employee}</h4>
                  <p>{selectedMemberInsights.role}</p>
                </div>
              </div>
            </header>

            <section className="ph-member-id-salary">
              <span>{selectedMemberInsights.employeeCode}</span>
              <strong>{selectedMemberInsights.salary}</strong>
            </section>

            <section className="ph-member-top-panels">
              <article className="ph-member-info-card">
                <h5>TODAY'S STATUS</h5>
                <div className="ph-member-highlight-line">
                  <CheckCircle2 size={16} />
                  <strong>{selectedMemberInsights.presentLabel}</strong>
                </div>
                <p>Checked in at {selectedMemberInsights.checkInTime}</p>
              </article>

              <article className="ph-member-info-card project">
                <h5>CURRENT PROJECT</h5>
                <button
                  type="button"
                  className="ph-member-project-trigger"
                  onClick={() => setShowProjectDetails((value) => !value)}
                >
                  <span className="ph-member-highlight-line">
                    <BriefcaseBusiness size={16} />
                    <strong>{selectedMemberInsights.currentProject}</strong>
                  </span>
                  <span className="ph-member-project-trigger-icon" aria-hidden="true">
                    {showProjectDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </span>
                </button>
                <p>{selectedMemberInsights.tasksDone} tasks done • {selectedMemberInsights.openTasks} open</p>
              </article>
            </section>

            {showProjectDetails ? (
              <section className="ph-member-info-card ph-member-project-expanded">
                <h5>PROJECT EXECUTION DETAILS</h5>
                <div className="ph-member-project-detail-panel">
                  <div><small>Assigned Role</small><strong>{selectedMemberInsights.projectRole}</strong></div>
                  <div><small>Total Tasks</small><strong>{selectedMemberInsights.totalTasks}</strong></div>
                  <div><small>Closed Tasks</small><strong>{selectedMemberInsights.closedTasks}</strong></div>
                  <div><small>In Progress</small><strong>{selectedMemberInsights.inProgressTasks}</strong></div>
                  <div><small>Duration</small><strong>{selectedMemberInsights.projectDuration}</strong></div>
                  <div><small>Current Sprint</small><strong>{selectedMemberInsights.projectSprint}</strong></div>
                  <div><small>Start Date</small><strong>{selectedMemberInsights.projectStartDate}</strong></div>
                  <div><small>Expected Completion</small><strong>{selectedMemberInsights.projectEta}</strong></div>
                </div>
              </section>
            ) : null}

            <section className="ph-member-info-card snapshot">
              <h5>WORK DELIVERY SNAPSHOT</h5>
              <div className="ph-member-snapshot-grid">
                <article className="ph-member-snapshot-metric">
                  <small>Tasks Allocated</small>
                  <strong>{selectedMemberInsights.tasksAllocated}</strong>
                </article>
                <article className="ph-member-snapshot-metric">
                  <small>Completed</small>
                  <strong>{selectedMemberInsights.completed}</strong>
                </article>
                <article className="ph-member-snapshot-metric">
                  <small>Leaves</small>
                  <strong>{selectedMemberInsights.leaves}</strong>
                </article>
                <article className="ph-member-snapshot-metric">
                  <small>Delayed Submissions</small>
                  <strong>{selectedMemberInsights.delayed}</strong>
                </article>
              </div>

              <div className="ph-member-progress-wrap">
                <div className="ph-member-progress-head">
                  <span>Overall Progress</span>
                  <strong>{selectedMemberInsights.overallProgress}%</strong>
                </div>
                <div className="ph-member-progress-track">
                  <span style={{ width: `${selectedMemberInsights.overallProgress}%` }} />
                </div>
              </div>

              <div className="ph-member-projects-worked">
                <h6>PROJECTS WORKED</h6>
                <ul>
                  {selectedMemberInsights.projectsWorked.map((item) => (
                    <li key={item.name}>
                      <span>{item.name}</span>
                      <strong>{item.progress}%</strong>
                    </li>
                  ))}
                </ul>
              </div>
            </section>

            <footer className="ph-member-contact-list">
              <div><Mail size={15} /><span>{selectedMemberInsights.email}</span></div>
              <div><Phone size={15} /><span>{selectedMemberInsights.phone}</span></div>
              <div><MapPin size={15} /><span>{selectedMemberInsights.location}</span></div>
            </footer>

          </section>
        </div>
      ) : null}
    </div>
  );
};

export default RoleCoverageTab;
