import React, { useState } from 'react';
import './Tasks.css';
import '../Project/Project.css'; // Reusing styles
import { CheckCircle, Clock, ListTodo, UserCircle, Loader } from 'lucide-react';

const initialTasks = [
  { id: 1, title: 'Finalize Q3 Budget', assignee: 'Alice Smith', status: 'Pending' },
  { id: 2, title: 'Hire Senior Developer', assignee: 'Bob Johnson', status: 'In Progress' },
  { id: 3, title: 'Update Privacy Policy', assignee: 'Charlie Davis', status: 'Completed' },
  { id: 4, title: 'Launch Marketing Campaign', assignee: 'Diana Prince', status: 'In Progress' },
  { id: 5, name: 'Client Onboarding Flow', assignee: 'Evan Wright', status: 'Pending' },
  { id: 6, name: 'Security Audit', assignee: 'Alice Smith', status: 'Pending' },
];

const Tasks = () => {
  const [tasks, setTasks] = useState(initialTasks);

  const moveTask = (id, newStatus) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, status: newStatus } : t));
  };

  const pending = tasks.filter(t => t.status === 'Pending');
  const inProgress = tasks.filter(t => t.status === 'In Progress');
  const completed = tasks.filter(t => t.status === 'Completed');

  const renderTaskItems = (list, nextStatus, nextLabel, icon, color) => (
    <ul className="icon-list">
      {list.length === 0 && <li style={{ color: '#888', fontStyle: 'italic', padding: '10px 0' }}>No tasks here</li>}
      {list.map(task => (
        <li key={task.id} style={{ alignItems: 'flex-start', padding: '15px 0' }}>
          <div className="list-main">
            <div style={{ color: color, fontSize: '20px', marginRight: '15px' }}>
              {icon}
            </div>
            <div>
              <p className="list-title">{task.title || task.name}</p>
              <p className="list-subtitle" style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '5px' }}>
                <UserCircle size={14} /> {task.assignee}
              </p>
            </div>
          </div>
          {nextStatus && (
            <button 
              className="action-btn" 
              style={{ padding: '6px 12px', fontSize: '12px', background: '#f1f5f9', color: '#333', border: '1px solid #e2e8f0', borderRadius: '4px' }}
              onClick={() => moveTask(task.id, nextStatus)}
            >
              Move to {nextLabel}
            </button>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div className="dashboard-wrapper">
      <header className="main-header">
        <div>
          <h1>Task Board</h1>
          <p>Sprint Planning & Execution</p>
        </div>
      </header>

      <div className="main-content-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', gap: '25px', marginTop: '20px', alignItems: 'start' }}>
        
        {/* Pending */}
        <div className="info-card timeline-card" style={{ borderTop: '4px solid #f1c40f' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
            <Clock style={{ color: '#f1c40f' }} size={18} /> Pending ({pending.length})
          </h3>
          {renderTaskItems(pending, 'In Progress', 'In Progress', <ListTodo size={18} />, '#f1c40f')}
        </div>

        {/* In Progress */}
        <div className="info-card timeline-card" style={{ borderTop: '4px solid #3498db' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
            <Loader style={{ color: '#3498db' }} size={18} /> In Progress ({inProgress.length})
          </h3>
          {renderTaskItems(inProgress, 'Completed', 'Completed', <Loader size={18} />, '#3498db')}
        </div>

        {/* Completed */}
        <div className="info-card timeline-card" style={{ borderTop: '4px solid #27ae60' }}>
          <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}>
            <CheckCircle style={{ color: '#27ae60' }} size={18} /> Completed ({completed.length})
          </h3>
          {renderTaskItems(completed, null, null, <CheckCircle size={18} />, '#27ae60')}
        </div>

      </div>
    </div>
  );
};

export default Tasks;
