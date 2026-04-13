import React, { useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  BriefcaseBusiness,
  UserRound,
  Timer,
  CalendarDays,
  X,
} from 'lucide-react';
import PeopleHealthPanelCard from '../components/PeopleHealthPanelCard';

const RoleCoverageTab = ({ members }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showAllMembers, setShowAllMembers] = useState(false);
  const visibleMembers = showAllMembers ? members : members.slice(0, 6);
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const selectedMemberId = pathSegments[1] === 'role-coverage' && pathSegments[2] === 'member'
    ? pathSegments[3]
    : null;

  useEffect(() => {
    if (!members.length) {
      if (selectedMemberId) {
        navigate('/employees/role-coverage');
      }
      return;
    }

    if (!selectedMemberId) {
      return;
    }

    const exists = members.some((item) => item.id === selectedMemberId);
    if (!exists) {
      navigate('/employees/role-coverage');
    }
  }, [members, selectedMemberId, navigate]);

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
    const roleCatalog = ['Project Lead', 'Technical Architect', 'Core Engineer', 'QA Lead', 'Data Engineer'];
    const sprintCatalog = ['Sprint 12', 'Sprint 13', 'Sprint 14', 'Sprint 15'];
    
    const projectSeed = personId % projectCatalog.length;
    const currentProject = projectCatalog[projectSeed];
    const projectsWorked = [
      projectCatalog[projectSeed],
      projectCatalog[(projectSeed + 1) % projectCatalog.length],
      projectCatalog[(projectSeed + 2) % projectCatalog.length],
    ].map((name, index) => ({
      name,
      role: roleCatalog[(personId + index) % roleCatalog.length],
      performance: Math.max(38, Math.min(89, overallProgress + 8 - (index * 11) + (personId % 6))),
    }));

    const durationWeeks = 8 + (personId % 7);
    const totalTasks = tasksAllocated + 10 + (personId % 8);
    const closedTasks = Math.min(totalTasks, completed + 8);
    const inProgressTasks = Math.max(0, totalTasks - closedTasks - delayed);
    const attendanceDays = 22;
    const presentDays = Math.max(12, Math.min(attendanceDays, Math.round((selectedMember.stabilityIndex / 100) * attendanceDays)));
    const absentDays = Math.max(0, attendanceDays - presentDays - leaves);
    const attendancePercent = Math.round((presentDays / Math.max(attendanceDays, 1)) * 100);

    const sprintProgress = [
      {
        sprint: sprintCatalog[personId % sprintCatalog.length],
        project: projectCatalog[personId % projectCatalog.length],
        allocated: Math.max(10, Math.round(tasksAllocated * 0.45)),
        done: Math.max(6, Math.round(completed * 0.4)),
      },
      {
        sprint: sprintCatalog[(personId + 1) % sprintCatalog.length],
        project: projectCatalog[(personId + 1) % projectCatalog.length],
        allocated: Math.max(10, Math.round(tasksAllocated * 0.42)),
        done: Math.max(5, Math.round(completed * 0.35)),
      },
      {
        sprint: sprintCatalog[(personId + 2) % sprintCatalog.length],
        project: projectCatalog[(personId + 2) % projectCatalog.length],
        allocated: Math.max(9, Math.round(tasksAllocated * 0.38)),
        done: Math.max(4, Math.round(completed * 0.3)),
      },
    ];

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
      successionReadiness,
      managerNote: managerNotes[personId % managerNotes.length],
      checkInTime: `${String(checkInHour).padStart(2, '0')}:${String(checkInMinute).padStart(2, '0')}`,
      presentLabel: selectedMember.status === 'leave' ? 'On Leave' : 'Present',
      attendanceDays,
      presentDays,
      absentDays,
      attendancePercent,
      sprintProgress,
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
        navigate('/employees/role-coverage');
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [selectedMemberInsights]);

  const isMemberDetailPage = selectedMemberInsights && location.pathname.includes('/member/');

  if (isMemberDetailPage) {
    return (
      <div className="ph-member-detail-page-only">
        <div className="ph-member-detail-header">
          <button
            type="button"
            className="ph-btn ghost"
            onClick={() => navigate('/employees/role-coverage')}
          >
            Back to members
          </button>
        </div>

        <section className="ph-member-detail-shell">
          <button
            type="button"
            className="ph-member-modal-close ph-member-detail-close"
            onClick={() => navigate('/employees/role-coverage')}
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

          <div className="ph-member-dashboard-grid">
          <section className="ph-member-info-card ph-member-dashboard-card">
            <h5 className="ph-member-section-head"><UserRound size={15} /> Personal Information</h5>
            <div className="ph-member-project-detail-panel">
              <div><small>Employee Code</small><strong>{selectedMemberInsights.employeeCode}</strong></div>
              <div><small>Department</small><strong>{selectedMemberInsights.department}</strong></div>
              <div><small>Role</small><strong>{selectedMemberInsights.role}</strong></div>
              <div><small>Location</small><strong>{selectedMemberInsights.location}</strong></div>
              <div><small>Joined On</small><strong>{selectedMemberInsights.joinedOn}</strong></div>
              <div><small>Tenure</small><strong>{selectedMemberInsights.tenure}</strong></div>
              <div><small>Email</small><strong>{selectedMemberInsights.email}</strong></div>
              <div><small>Phone</small><strong>{selectedMemberInsights.phone}</strong></div>
            </div>
          </section>

          <section className="ph-member-info-card ph-member-dashboard-card">
            <h5 className="ph-member-section-head"><Timer size={15} /> Sprint Progress</h5>
            <div className="ph-member-projects-worked">
              <ul>
                {selectedMemberInsights.sprintProgress.map((item) => (
                  <li key={item.sprint}>
                    <div>
                      <strong>{item.project}</strong>
                      <span style={{ fontSize: '12px', color: '#5f87c9', marginLeft: '4px' }}>{item.sprint}</span>
                    </div>
                    <span style={{ fontSize: '13px', color: '#666' }}>Allocated: {item.allocated} • Done: {item.done}</span>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="ph-member-info-card project ph-member-dashboard-card">
              <h5 className="ph-member-section-head"><BriefcaseBusiness size={15} /> Project Section</h5>
              <div className="ph-member-projects-worked">
                <h6>PROJECTS WORKED ON</h6>
                <ul>
                  {selectedMemberInsights.projectsWorked.map((item) => (
                    <li key={`project-${item.name}`}>
                      <div>
                        <strong>{item.name}</strong>
                        <span style={{ fontSize: '12px', color: '#5f87c9', marginLeft: '8px' }}>{item.role}</span>
                      </div>
                      <strong>{item.performance}%</strong>
                    </li>
                  ))}
                </ul>
              </div>
          </section>

          <section className="ph-member-info-card ph-member-dashboard-card">
            <h5 className="ph-member-section-head"><CalendarDays size={15} /> Attendance Section</h5>
            <div className="ph-member-project-detail-panel">
              <div><small>Total Working Days</small><strong>{selectedMemberInsights.attendanceDays}</strong></div>
              <div><small>Present</small><strong>{selectedMemberInsights.presentDays}</strong></div>
              <div><small>Absent</small><strong>{selectedMemberInsights.absentDays}</strong></div>
              <div><small>Leaves</small><strong>{selectedMemberInsights.leaves}</strong></div>
              <div><small>Attendance Rate</small><strong>{selectedMemberInsights.attendancePercent}%</strong></div>
              <div><small>Check-in Time</small><strong>{selectedMemberInsights.checkInTime}</strong></div>
              <div><small>Current Status</small><strong>{selectedMemberInsights.presentLabel}</strong></div>
              <div><small>Stability</small><strong>{selectedMemberInsights.attritionScore}</strong></div>
            </div>
          </section>
          </div>
        </section>
      </div>
    );
  }

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
                  onClick={() => navigate(`/employees/role-coverage/member/${item.id}`)}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      navigate(`/employees/role-coverage/member/${item.id}`);
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
    </div>
  );
};

export default RoleCoverageTab;
