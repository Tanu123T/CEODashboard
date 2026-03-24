import React, { useMemo, useState } from 'react';
import './Tasks.css';
import '../Project/Project.css';
import {
  Search,
  ArrowUpDown,
  UserCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import EmptyState from '../../components/common/EmptyState';
import PageLoader from '../../components/common/PageLoader';
import useSortableData from '../../hooks/useSortableData';
import useSimulatedLoading from '../../hooks/useSimulatedLoading';

const initialTasks = [
  { id: 1, title: 'Finalize Q3 Budget', assignee: 'Alice Smith', status: 'Pending', priority: 'High', project: 'Hospital CRM', dueDate: '2026-03-28', completion: 20 },
  { id: 2, title: 'Hire Senior Developer', assignee: 'Bob Johnson', status: 'In Progress', priority: 'Medium', project: 'Banking Portal', dueDate: '2026-03-26', completion: 64 },
  { id: 3, title: 'Update Privacy Policy', assignee: 'Charlie Davis', status: 'Completed', priority: 'Low', project: 'Travel App', dueDate: '2026-03-20', completion: 100 },
  { id: 4, title: 'Launch Marketing Campaign', assignee: 'Diana Prince', status: 'In Progress', priority: 'High', project: 'AI Chatbot', dueDate: '2026-03-29', completion: 58 },
  { id: 5, title: 'Client Onboarding Flow', assignee: 'Evan Wright', status: 'Pending', priority: 'Medium', project: 'Supply Chain Suite', dueDate: '2026-04-01', completion: 12 },
  { id: 6, title: 'Security Audit', assignee: 'Alice Smith', status: 'Blocked', priority: 'High', project: 'Banking Portal', dueDate: '2026-03-24', completion: 35 },
  { id: 7, title: 'API Rate Limiting Rules', assignee: 'Anita Rao', status: 'Completed', priority: 'Medium', project: 'Hospital CRM', dueDate: '2026-03-19', completion: 100 },
];

const STATUS_FILTERS = ['All', 'Pending', 'In Progress', 'Blocked', 'Completed'];

const Tasks = () => {
  const isLoading = useSimulatedLoading(500);
  const [tasks] = useState(initialTasks);
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [expandedTaskId, setExpandedTaskId] = useState(null);

  const filteredTasks = useMemo(() => {
    return tasks.filter((task) => {
      const matchesQuery =
        task.title.toLowerCase().includes(query.toLowerCase()) ||
        task.assignee.toLowerCase().includes(query.toLowerCase()) ||
        task.project.toLowerCase().includes(query.toLowerCase());

      const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [tasks, query, statusFilter]);

  const { sortedItems: sortedTasks, sortConfig, requestSort } = useSortableData(filteredTasks, {
    key: 'dueDate',
    direction: 'asc',
  });

  const sortLabel = (key) => {
    if (sortConfig.key !== key) return <ArrowUpDown size={13} />;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  if (isLoading) {
    return <PageLoader title="Loading Task Intelligence..." />;
  }

  return (
    <div className="dashboard-wrapper">
      <header className="main-header">
        <div>
          <h1>Task Intelligence Board</h1>
          <p>Track task ownership, status, and deadlines without extra dashboards.</p>
        </div>
      </header>

      <section className="table-container">
        <div className="table-header-row project-toolbar-row">
          <h2 className="section-title" style={{ margin: 0 }}>Detailed Task Register</h2>
          <div className="project-toolbar-controls">
            <div className="project-search-inline">
              <Search size={15} />
              <input
                type="text"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search by task, assignee, or project"
              />
            </div>
            <div className="project-filter-chips">
              {STATUS_FILTERS.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`filter-chip ${statusFilter === option ? 'active' : ''}`}
                  onClick={() => setStatusFilter(option)}
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
                <th onClick={() => requestSort('title')} className="sortable-head">Task {sortLabel('title')}</th>
                <th onClick={() => requestSort('project')} className="sortable-head">Project {sortLabel('project')}</th>
                <th onClick={() => requestSort('assignee')} className="sortable-head">Assignee {sortLabel('assignee')}</th>
                <th onClick={() => requestSort('priority')} className="sortable-head">Priority {sortLabel('priority')}</th>
                <th onClick={() => requestSort('status')} className="sortable-head">Status {sortLabel('status')}</th>
                <th onClick={() => requestSort('dueDate')} className="sortable-head">Due Date {sortLabel('dueDate')}</th>
                <th onClick={() => requestSort('completion')} className="sortable-head">Progress {sortLabel('completion')}</th>
                <th>Details</th>
              </tr>
            </thead>
            <tbody>
              {sortedTasks.map((task) => (
                <React.Fragment key={task.id}>
                  <tr>
                    <td className="font-bold">{task.title}</td>
                    <td>{task.project}</td>
                    <td className="team-lead-cell"><UserCircle className="row-icon" size={14} />{task.assignee}</td>
                    <td>{task.priority}</td>
                    <td>
                      <span className={`status-badge status-${task.status.toLowerCase().replace(' ', '-')}`}>
                        {task.status}
                      </span>
                    </td>
                    <td>{new Date(task.dueDate).toLocaleDateString('en-IN')}</td>
                    <td>
                      <div className="prog-bar-bg">
                        <div className="prog-bar-fill" style={{ width: `${task.completion}%`, background: 'linear-gradient(95deg, #38bdf8 0%, #22c55e 100%)' }} />
                      </div>
                      <small>{task.completion}%</small>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="icon-btn details-btn"
                        style={{ opacity: 1, transform: 'scale(1)' }}
                        onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                      >
                        {expandedTaskId === task.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </button>
                    </td>
                  </tr>
                  {expandedTaskId === task.id ? (
                    <tr className="project-detail-row">
                      <td colSpan="8">
                        <div className="project-detail-card">
                          <p><strong>Execution Note:</strong> {task.title} is currently in <strong>{task.status}</strong> stage for {task.project}.</p>
                          <p><strong>Owner:</strong> {task.assignee} | <strong>Priority:</strong> {task.priority}</p>
                          <p><strong>Timeline:</strong> Due on {new Date(task.dueDate).toLocaleDateString('en-IN')} with {task.completion}% completion.</p>
                        </div>
                      </td>
                    </tr>
                  ) : null}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {sortedTasks.length === 0 ? (
          <EmptyState
            title="No tasks found"
            description="Adjust status filter or search input to view tasks."
          />
        ) : null}
      </section>
    </div>
  );
};

export default Tasks;
