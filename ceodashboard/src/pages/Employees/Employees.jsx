import React, { useMemo, useState } from 'react';
import './Employees.css';
import '../Project/Project.css';
import {
  Users,
  Search,
  ArrowUpDown,
  CheckCircle2,
  Gauge,
  ChevronDown,
  ChevronUp,
  Trophy,
  Inbox,
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PageLoader from '../../components/common/PageLoader';
import useSortableData from '../../hooks/useSortableData';
import useSimulatedLoading from '../../hooks/useSimulatedLoading';
import { teamMembers } from '../../data/teamPerformanceData';

const Employees = () => {
  const isLoading = useSimulatedLoading(600);
  const [search, setSearch] = useState('');
  const [squadFilter, setSquadFilter] = useState('All');
  const [expandedId, setExpandedId] = useState(null);

  const squadOptions = useMemo(() => {
    return ['All', ...new Set(teamMembers.map((member) => member.squad))];
  }, []);

  const filteredTeam = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesSearch =
        member.name.toLowerCase().includes(search.toLowerCase()) ||
        member.role.toLowerCase().includes(search.toLowerCase()) ||
        member.squad.toLowerCase().includes(search.toLowerCase());

      const matchesSquad = squadFilter === 'All' || member.squad === squadFilter;
      return matchesSearch && matchesSquad;
    });
  }, [search, squadFilter]);

  const { sortedItems: sortedTeam, sortConfig, requestSort } = useSortableData(filteredTeam, {
    key: 'taskCompletionRate',
    direction: 'desc',
  });

  const averageCompletion = Math.round(teamMembers.reduce((sum, item) => sum + item.taskCompletionRate, 0) / teamMembers.length);
  const averageUtilization = Math.round(teamMembers.reduce((sum, item) => sum + item.utilization, 0) / teamMembers.length);
  const topPerformers = teamMembers.filter((item) => item.attendance >= 95 && item.taskCompletionRate >= 90);

  const sortLabel = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={13} />;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return <PageLoader title="Loading Team Performance..." />;
  }

  return (
    <div className="dashboard-wrapper">
      <header className="main-header">
        <div>
          <h1>Team Performance</h1>
          <p>Track team members, workload, and delivery quality in one place.</p>
        </div>
      </header>

      <section className="main-content-grid">
        <article className="table-container">
          <div className="table-header-row project-toolbar-row">
            <h2 className="section-title" style={{ margin: 0 }}>Team Performance Matrix</h2>
            <div className="project-toolbar-controls">
              <div className="project-search-inline">
                <Search size={15} />
                <input
                  type="text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by member, role, or squad"
                />
              </div>
              <div className="project-filter-chips">
                {squadOptions.map((option) => (
                  <button
                    key={option}
                    type="button"
                    className={`filter-chip ${squadFilter === option ? 'active' : ''}`}
                    onClick={() => setSquadFilter(option)}
                  >
                    {option}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="table-scroll">
            <table className="projects-table">
              <thead>
                <tr>
                  <th onClick={() => requestSort('name')} className="sortable-head">Member {sortLabel('name')}</th>
                  <th onClick={() => requestSort('role')} className="sortable-head">Role {sortLabel('role')}</th>
                  <th onClick={() => requestSort('attendance')} className="sortable-head">Attendance {sortLabel('attendance')}</th>
                  <th onClick={() => requestSort('taskCompletionRate')} className="sortable-head">Completion {sortLabel('taskCompletionRate')}</th>
                  <th onClick={() => requestSort('utilization')} className="sortable-head">Utilization {sortLabel('utilization')}</th>
                  <th>Tasks</th>
                  <th>Details</th>
                </tr>
              </thead>
              <tbody>
                {sortedTeam.map((member) => (
                  <React.Fragment key={member.id}>
                    <tr>
                      <td className="font-bold">{member.name}</td>
                      <td>{member.role}</td>
                      <td>{member.attendance}%</td>
                      <td>{member.taskCompletionRate}%</td>
                      <td>{member.utilization}%</td>
                      <td>{member.completedTasks}/{member.assignedTasks}</td>
                      <td>
                        <button
                          type="button"
                          className="icon-btn details-btn"
                          style={{ opacity: 1, transform: 'scale(1)' }}
                          onClick={() => setExpandedId(expandedId === member.id ? null : member.id)}
                        >
                          {expandedId === member.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>
                      </td>
                    </tr>
                    {expandedId === member.id ? (
                      <tr className="project-detail-row">
                        <td colSpan="7">
                          <div className="project-detail-card">
                            <p><strong>Squad:</strong> {member.squad}</p>
                            <p><strong>Sprint Velocity:</strong> {member.velocity} points</p>
                            <p><strong>Quality Score:</strong> {member.qualityScore}%</p>
                            <p><strong>Load Balance:</strong> {member.assignedTasks - member.completedTasks} open tasks remaining</p>
                          </div>
                        </td>
                      </tr>
                    ) : null}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {sortedTeam.length === 0 ? (
            <EmptyState
              title="No team members match current filters"
              description="Adjust search or squad filter to view performance insights."
            />
          ) : null}
        </article>

        <aside className="sidebar-info">
          <article className="info-card">
            <h3><Trophy size={17} /> Top Performers</h3>
            <ul className="icon-list">
              {topPerformers.map((member) => (
                <li key={member.id}>
                  <div className="list-main">
                    <Users className="list-icon" size={16} />
                    <div>
                      <p className="list-title">{member.name}</p>
                      <p className="list-subtitle">{member.role}</p>
                    </div>
                  </div>
                  <strong>{member.taskCompletionRate}%</strong>
                </li>
              ))}
            </ul>
          </article>

          <article className="info-card">
            <h3><Inbox size={17} /> Capacity Notes</h3>
            <ul className="icon-list">
              <li>
                <div className="list-main">
                  <Gauge className="list-icon" size={16} />
                  <div>
                    <p className="list-title">Utilization Threshold</p>
                    <p className="list-subtitle">Maintain between 75% and 85%</p>
                  </div>
                </div>
                <strong>{averageUtilization}%</strong>
              </li>
              <li>
                <div className="list-main">
                  <CheckCircle2 className="list-icon" size={16} />
                  <div>
                    <p className="list-title">Completion Discipline</p>
                    <p className="list-subtitle">Target above 88% this quarter</p>
                  </div>
                </div>
                <strong>{averageCompletion}%</strong>
              </li>
            </ul>
          </article>
        </aside>
      </section>
    </div>
  );
};

export default Employees;
