import React, { useMemo, useState } from 'react';
import {
  Briefcase,
  CheckCircle2,
  Clock3,
  Gift,
  Mail,
  MapPin,
  Phone,
  ScanFace,
  Search,
  ShieldCheck,
  Star,
  UserPlus,
} from 'lucide-react';
import { members, statusChipTone, statusTone } from '../teamData';

const MembersTab = () => {
  const [search, setSearch] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState('grid');
  const [selectedMemberId, setSelectedMemberId] = useState(null);

  const departments = useMemo(() => ['All', ...new Set(members.map((member) => member.department))], []);
  const statuses = ['All', 'Active', 'Remote', 'On Leave'];

  const filteredMembers = useMemo(() => {
    return members.filter((member) => {
      const query = search.toLowerCase();
      const matchesSearch =
        member.name.toLowerCase().includes(query) ||
        member.role.toLowerCase().includes(query) ||
        member.project.toLowerCase().includes(query);

      const matchesDepartment = departmentFilter === 'All' || member.department === departmentFilter;
      const matchesStatus = statusFilter === 'All' || member.status === statusFilter;

      return matchesSearch && matchesDepartment && matchesStatus;
    });
  }, [search, departmentFilter, statusFilter]);

  const selectedMember = useMemo(() => {
    return filteredMembers.find((member) => member.id === selectedMemberId) || null;
  }, [filteredMembers, selectedMemberId]);

  return (
    <>
      <section className="tm-member-toolbar">
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

        <div className="tm-view-toggle">
          <button type="button" className={viewMode === 'grid' ? 'active' : ''} onClick={() => setViewMode('grid')}>Grid</button>
          <button type="button" className={viewMode === 'list' ? 'active' : ''} onClick={() => setViewMode('list')}>List</button>
        </div>

        <button type="button" className="tm-add-member-btn">
          <UserPlus size={17} /> Add Member
        </button>
      </section>

      <section className={`tm-members-layout ${viewMode === 'grid' && selectedMember ? 'with-detail' : ''}`}>
        <div className={`tm-member-grid ${viewMode}`}>
          {filteredMembers.map((member) => (
            <article
              key={member.id}
              className={`tm-member-card ${selectedMember?.id === member.id ? 'selected' : ''}`}
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

        {viewMode === 'grid' && selectedMember ? (
          <aside className="tm-member-detail">
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

            <div className="tm-detail-card project">
              <h4>CURRENT PROJECT</h4>
              <p><Gift size={16} /> {selectedMember.project}</p>
              <small>{selectedMember.done} tasks done • {selectedMember.open} open</small>
            </div>

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
              <h4>BIOMETRIC AUTH</h4>
              <div className="tm-biometric-list">
                {selectedMember.biometric.map((entry) => (
                  <div key={entry}><ScanFace size={15} /> {entry} <span>ENROLLED</span></div>
                ))}
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
              <button type="button">Edit Profile</button>
              <button type="button" className="danger">Delete</button>
            </div>
          </aside>
        ) : null}
      </section>

      <p className="tm-showing">Showing {filteredMembers.length} of {members.length} members</p>
    </>
  );
};

export default MembersTab;
