import React, { useEffect, useMemo, useState } from 'react';
import {
  Briefcase,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Clock3,
  Gift,
  Mail,
  MapPin,
  Phone,
  Search,
  Star,
} from 'lucide-react';
import { members, statusChipTone, statusTone } from '../teamData';

const departmentProjectHistory = {
  Engineering: ['Platform v3.0 Rebuild', 'ML Recommendation Engine', 'Identity Security Upgrade'],
  Sales: ['Q1 Enterprise Sales Drive', 'Global Expansion Pipeline', 'Enterprise Reporting Suite'],
  Product: ['2026 Product Roadmap', 'Hospital CRM Rollout', 'Mobile App Discovery'],
  Marketing: ['Spring Marketing Campaign', 'Demand Gen Revamp', 'Brand Awareness Sprint'],
  Design: ['Brand Identity Refresh', 'Design System 2.0', 'UX Audit Program'],
  HR: ['Q1 Hiring Drive', 'Leadership Upskilling', 'People Policy Refresh'],
  Finance: ['Budget Forecast 2026', 'Cashflow Optimizer', 'Vendor Cost Program'],
};

const buildMemberDeliverySnapshot = (member) => {
  if (!member) return null;

  const departmentProjects = departmentProjectHistory[member.department] || [];
  const projectsWorked = [member.project, ...departmentProjects.filter((item) => item !== member.project)].slice(0, 3);
  const taskAllocated = member.done + member.open + 8;
  const taskCompleted = Math.min(member.done, taskAllocated);
  const progress = Math.round((taskCompleted / Math.max(taskAllocated, 1)) * 100);

  const leavesTaken =
    member.status === 'On Leave'
      ? 8
      : member.attendanceStatus === 'Absent'
        ? 4
        : member.attendanceStatus === 'Late'
          ? 2
          : 1;

  const delayedSubmissions = Math.max(member.open - 1, 0) + (member.attendanceStatus === 'Late' ? 1 : 0);

  const projectHistory = projectsWorked.map((projectName, index) => {
    const projectProgress = Math.min(98, Math.max(36, progress - index * 11 + (member.id % 4) * 3));
    return {
      name: projectName,
      progress: projectProgress,
    };
  });

  return {
    projectsWorked,
    progress,
    taskAllocated,
    taskCompleted,
    leavesTaken,
    delayedSubmissions,
    projectHistory,
  };
};

const projectCatalog = {
  'Platform v3.0 Rebuild': {
    owner: 'Sarah Chen',
    teamSize: '18 people',
    budget: '$420K',
    status: 'On Track',
  },
  'Q1 Enterprise Sales Drive': {
    owner: 'James Wilson',
    teamSize: '8 people',
    budget: '$300K',
    status: 'Ahead',
  },
  'Spring Marketing Campaign': {
    owner: 'Marcus Lee',
    teamSize: '6 people',
    budget: '$110K',
    status: 'At Risk',
  },
  '2026 Product Roadmap': {
    owner: 'Priya Patel',
    teamSize: '5 people',
    budget: '$62K',
    status: 'Ahead',
  },
  'Brand Identity Refresh': {
    owner: 'Elena Torres',
    teamSize: '4 people',
    budget: '$130K',
    status: 'On Track',
  },
  'ML Recommendation Engine': {
    owner: 'Li Wei',
    teamSize: '7 people',
    budget: '$220K',
    status: 'On Track',
  },
  'Q1 Hiring Drive': {
    owner: 'Anna Kowalski',
    teamSize: '5 people',
    budget: '$85K',
    status: 'On Track',
  },
  'Budget Forecast 2026': {
    owner: 'David Brown',
    teamSize: '4 people',
    budget: '$95K',
    status: 'On Track',
  },
};

const shiftDateByDays = (dateLabel, days) => {
  const baseDate = new Date(dateLabel);
  if (Number.isNaN(baseDate.getTime())) return dateLabel;
  baseDate.setDate(baseDate.getDate() + days);
  return baseDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

const buildCurrentProjectDetail = (member, deliverySnapshot) => {
  if (!member || !deliverySnapshot) return null;

  const allocatedOn = shiftDateByDays(member.since, 14 + member.id * 2);
  const deadline = shiftDateByDays(allocatedOn, 90 + member.id * 4);
  const projectMeta = projectCatalog[member.project] || {
    owner: member.name,
    teamSize: `${Math.max(3, Math.ceil((member.done + member.open) / 3))} people`,
    budget: '$120K',
    status: 'On Track',
  };

  return {
    allocatedOn,
    deadline,
    role: member.role,
    tasksAllocated: deliverySnapshot.taskAllocated,
    tasksCompleted: deliverySnapshot.taskCompleted,
    tasksOpen: member.open,
    progress: deliverySnapshot.progress,
    delayedSubmissions: deliverySnapshot.delayedSubmissions,
    leavesTaken: deliverySnapshot.leavesTaken,
    owner: projectMeta.owner,
    teamSize: projectMeta.teamSize,
    budget: projectMeta.budget,
    status: projectMeta.status,
  };
};

const MembersTab = () => {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [roleFilter, setRoleFilter] = useState('All');
  const [workModeFilter, setWorkModeFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMemberId, setSelectedMemberId] = useState(null);
  const [showProjectDetail, setShowProjectDetail] = useState(false);

  const departments = useMemo(() => ['All', ...new Set(members.map((member) => member.department))], []);
  const statuses = ['All', 'Active', 'Remote', 'On Leave'];
  const roles = useMemo(() => ['All', ...new Set(members.map((member) => member.role))], []);
  const workModes = useMemo(() => ['All', ...new Set(members.map((member) => member.workStatus))], []);

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const query = search.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.project.toLowerCase().includes(query);

      const matchesDepartment = departmentFilter === 'All' || member.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || member.status === statusFilter;
      const matchesRole = roleFilter === 'All' || member.role === roleFilter;
      const matchesWorkMode = workModeFilter === 'All' || member.workStatus === workModeFilter;

      return matchesSearch && matchesDepartment && matchesStatus && matchesRole && matchesWorkMode;
    });
  }, [search, departmentFilter, statusFilter, roleFilter, workModeFilter]);

  const selectedMember = useMemo(() => {
    return filteredMembers.find((member) => member.id === selectedMemberId) || null;
  }, [filteredMembers, selectedMemberId]);

  const deliverySnapshot = useMemo(() => buildMemberDeliverySnapshot(selectedMember), [selectedMember]);
  const currentProjectDetail = useMemo(
    () => buildCurrentProjectDetail(selectedMember, deliverySnapshot),
    [selectedMember, deliverySnapshot]
  );

  useEffect(() => {
    setShowProjectDetail(false);
  }, [selectedMemberId]);

  useEffect(() => {
    if (!selectedMember) return undefined;

    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedMemberId(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMember]);

  return (
    <>
      <section className="tm-member-toolbar tm-member-anim-toolbar">
        <div className="tm-search-box">
          <Search size={17} />
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by name, role, or project..."
          />
        </div>

        <select value={departmentFilter} onChange={(event) => setDepartmentFilter(event.target.value)}>
          {departments.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
          {statuses.map((item) => (
            <option key={item} value={item}>{item}</option>
          ))}
        </select>

        <select value={roleFilter} onChange={(event) => setRoleFilter(event.target.value)}>
          {roles.map((item) => (
            <option key={item} value={item}>{item === 'All' ? 'All Roles' : item}</option>
          ))}
        </select>

        <select value={workModeFilter} onChange={(event) => setWorkModeFilter(event.target.value)}>
          {workModes.map((item) => (
            <option key={item} value={item}>{item === 'All' ? 'All Work Modes' : item}</option>
          ))}
        </select>

        <div className="tm-view-toggle">
          <button type="button" className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>Grid</button>
          <button type="button" className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>List</button>
        </div>
      </section>

      <section className="tm-members-layout">
        <div className={`tm-member-grid ${viewMode}`}>
          {filteredMembers.map((member, index) => (
            <article
              key={member.id}
              className={`tm-member-card tm-member-anim-card ${selectedMember?.id === member.id ? 'selected' : ''}`}
              style={{ '--member-index': index }}
              onClick={() => setSelectedMemberId(member.id)}
              role="button"
              tabIndex={0}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setSelectedMemberId(member.id);
                }
              }}
            >
              <div className="tm-member-top">
                <div className={`tm-avatar ${member.badgeTone}`}>{member.initials}</div>
                <div className="tm-member-headline">
                  <h3>{member.name}</h3>
                  <p>{member.role}</p>
                </div>
                <span className={`tm-status-pill ${statusChipTone[member.status] || 'active'}`}>{member.status}</span>
              </div>

              <div className={`tm-attendance-row ${statusTone[member.attendanceStatus] || 'present'}`}>
                <span className="tm-attendance-label"><CheckCircle2 size={15} /> {member.attendanceStatus}</span>
                <span className="tm-checkin">In: {member.checkIn}</span>
              </div>

              <div className="tm-project-row">
                <Briefcase size={15} />
                <span>{member.project}</span>
              </div>

              <div className="tm-metrics-row">
                <span><CheckCircle2 size={14} /> {member.done} done</span>
                <span><Clock3 size={14} /> {member.open} open</span>
                <span className="tm-rating"><Star size={14} /> {member.rating}</span>
              </div>

              <div className="tm-footer-row">
                <div className="tm-tag-group">
                  {member.biometric.map((item) => (
                    <span key={`${member.id}-${item}`} className="tm-small-tag">{item}</span>
                  ))}
                </div>
                <span className="tm-location"><MapPin size={14} /> {member.location}</span>
              </div>
            </article>
          ))}

          {!filteredMembers.length ? <p className="tm-empty">No members match your filters.</p> : null}
        </div>

        {selectedMember ? (
          <div
            className="tm-member-modal-overlay"
            onClick={() => setSelectedMemberId(null)}
            role="presentation"
          >
          <aside
            className="tm-member-detail tm-member-modal-detail tm-member-anim-detail"
            role="dialog"
            aria-modal="true"
            aria-label={`${selectedMember.name} details`}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="tm-member-modal-close"
              onClick={() => setSelectedMemberId(null)}
              aria-label="Close employee details"
            >
              <span className="tm-close-glyph" aria-hidden="true">&times;</span>
            </button>
            <header>
              <div className={`tm-avatar ${selectedMember.badgeTone}`}>{selectedMember.initials}</div>
              <div>
                <h3>{selectedMember.name}</h3>
                <p>{selectedMember.role}</p>
              </div>
            </header>

            <div className="tm-detail-ribbon">
              <span>{selectedMember.employeeCode}</span>
              <strong>{selectedMember.salary}</strong>
            </div>

            <div className="tm-detail-card status">
              <h4>TODAY'S STATUS</h4>
              <p><CheckCircle2 size={16} /> {selectedMember.attendanceStatus}</p>
              <small>Checked in at {selectedMember.checkIn}</small>
            </div>

            <div
              className="tm-detail-card project tm-current-project-card"
              role="button"
              tabIndex={0}
              onClick={() => setShowProjectDetail((value) => !value)}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  setShowProjectDetail((value) => !value);
                }
              }}
            >
              <h4>CURRENT PROJECT</h4>
              <p><Gift size={16} /> {selectedMember.project}</p>
              <small>
                {selectedMember.done} tasks done • {selectedMember.open} open
                <span className="tm-project-detail-toggle-copy">
                  {showProjectDetail ? 'Hide full project details' : 'Click to view full project details'}
                  {showProjectDetail ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </span>
              </small>
            </div>

            {showProjectDetail && currentProjectDetail ? (
              <div className="tm-detail-card tm-project-detail-card">
                <h4>PROJECT DETAIL</h4>
                <div className="tm-project-detail-grid">
                  <article><span>Allocated On</span><strong>{currentProjectDetail.allocatedOn}</strong></article>
                  <article><span>Deadline</span><strong>{currentProjectDetail.deadline}</strong></article>
                  <article><span>Role</span><strong>{currentProjectDetail.role}</strong></article>
                  <article><span>Status</span><strong>{currentProjectDetail.status}</strong></article>
                  <article><span>Tasks Allocated</span><strong>{currentProjectDetail.tasksAllocated}</strong></article>
                  <article><span>Completed Tasks</span><strong>{currentProjectDetail.tasksCompleted}</strong></article>
                  <article><span>Open Tasks</span><strong>{currentProjectDetail.tasksOpen}</strong></article>
                  <article><span>Progress</span><strong>{currentProjectDetail.progress}%</strong></article>
                  <article><span>Delayed Submissions</span><strong>{currentProjectDetail.delayedSubmissions}</strong></article>
                  <article><span>Leaves</span><strong>{currentProjectDetail.leavesTaken}</strong></article>
                  <article><span>Project Owner</span><strong>{currentProjectDetail.owner}</strong></article>
                  <article><span>Team Size</span><strong>{currentProjectDetail.teamSize}</strong></article>
                  <article><span>Budget</span><strong>{currentProjectDetail.budget}</strong></article>
                </div>
              </div>
            ) : null}

            {deliverySnapshot ? (
              <div className="tm-detail-card tm-detail-card-work">
                <h4>WORK DELIVERY SNAPSHOT</h4>

                <div className="tm-work-metric-grid">
                  <article>
                    <span>Tasks Allocated</span>
                    <strong>{deliverySnapshot.taskAllocated}</strong>
                  </article>
                  <article>
                    <span>Completed</span>
                    <strong>{deliverySnapshot.taskCompleted}</strong>
                  </article>
                  <article>
                    <span>Leaves</span>
                    <strong>{deliverySnapshot.leavesTaken}</strong>
                  </article>
                  <article>
                    <span>Delayed Submissions</span>
                    <strong>{deliverySnapshot.delayedSubmissions}</strong>
                  </article>
                </div>

                <div className="tm-work-progress-head">
                  <span>Overall Progress</span>
                  <strong>{deliverySnapshot.progress}%</strong>
                </div>
                <div className="tm-work-progress-track">
                  <span style={{ width: `${deliverySnapshot.progress}%` }} />
                </div>

                <div className="tm-work-projects">
                  <p>PROJECTS WORKED</p>
                  <ul>
                    {deliverySnapshot.projectHistory.map((item) => (
                      <li key={`${selectedMember.id}-${item.name}`}>
                        <div>
                          <strong>{item.name}</strong>
                        </div>
                        <span>{item.progress}%</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ) : null}

            <ul className="tm-contact-list">
              <li><Mail size={16} /> {selectedMember.email}</li>
              <li><Phone size={16} /> {selectedMember.phone}</li>
              <li><MapPin size={16} /> {selectedMember.location}</li>
            </ul>

            <div className="tm-info-grid">
              <div>
                <small>DEPARTMENT</small>
                <p>{selectedMember.department}</p>
              </div>
              <div>
                <small>PERFORMANCE</small>
                <p><Star size={14} /> {selectedMember.performance}</p>
              </div>
              <div>
                <small>SINCE</small>
                <p>{selectedMember.since}</p>
              </div>
              <div>
                <small>WORK STATUS</small>
                <p>{selectedMember.workStatus}</p>
              </div>
            </div>

            <div className="tm-detail-section">
              <h4>SKILLS</h4>
              <div className="tm-skill-list">
                {selectedMember.skills.map((skill) => (
                  <span key={skill}>{skill}</span>
                ))}
              </div>
            </div>

            <div className="tm-detail-actions">
              <button type="button" className="danger" onClick={() => setSelectedMemberId(null)}>Close</button>
            </div>
          </aside>
          </div>
        ) : null}
      </section>

      <p className="tm-showing">Showing {filteredMembers.length} of {members.length} members</p>
    </>
  );
};

export default MembersTab;
