import React, { useState } from 'react';
import './Project.css';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, 
  ResponsiveContainer, PieChart, Pie, Cell 
} from 'recharts';
import { AnimatePresence } from 'framer-motion';
import { 
  Building, User, CheckCircle, Clock, AlertTriangle, 
  ArrowUp, Edit2, Trash2, Plus, Flame, Hourglass, Briefcase, FolderX 
} from 'lucide-react';
import '../Employees/Employees.css'; // Reusing form button CSS

const THEME = {
  primary: '#0b6d9d',
  secondary: '#18b7a6',
  textMain: '#333333',
  bgBody: '#f8fafc',
  status: {
    green: '#22c55e',
    yellow: '#f1c40f',
    red: '#e74c3c',
    blue: '#38bdf8'
  }
};

const statsData = [
  { id: 1, title: 'Total Projects', value: 24, icon: <Briefcase />, change: '+3 this month', trend: true },
  { id: 2, title: 'Active Projects', value: 12, icon: <Clock />, change: '75% utilization', trend: false },
  { id: 3, title: 'Completed', value: 8, icon: <CheckCircle />, change: 'Avg. 45 days', trend: false },
  { id: 4, title: 'Delayed', value: 4, icon: <AlertTriangle />, change: 'Action required', trend: false },
];

const timelineData = [
  { name: 'Hospital CRM', deadline: '15 Mar', status: 'On Track' },
  { name: 'Banking Portal', deadline: '18 Mar', status: 'At Risk' },
  { name: 'Travel App', deadline: '22 Mar', status: 'Completed' },
  { name: 'Supply Chain', deadline: '29 Mar', status: 'On Track' },
];

const riskData = [
  { name: 'AI Chatbot', risk: 'Critical', issue: 'API failures', icon: <AlertTriangle /> },
  { name: 'ERP System', risk: 'Medium', issue: 'Understaffed', icon: <Hourglass /> },
];

const performanceData = [
  { month: 'Jan', value: 30 },
  { month: 'Feb', value: 45 },
  { month: 'Mar', value: 38 },
  { month: 'Apr', value: 65 },
  { month: 'May', value: 58 },
  { month: 'Jun', value: 82 },
];

const healthMix = [
  { name: 'On Track', value: 60, color: THEME.status.green },
  { name: 'At Risk', value: 25, color: THEME.status.yellow },
  { name: 'Delayed', value: 15, color: THEME.status.red },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: { y: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
};

const Projects = () => {
  const [projects, setProjects] = useState([
    { id: 1, name: 'Hospital CRM', client: 'HealthPlus', lead: 'Sarah J.', status: 'On Track', progress: 75, deadline: '15 Mar' },
    { id: 2, name: 'Banking Portal', client: 'Global Bank', lead: 'Mike R.', status: 'At Risk', progress: 40, deadline: '18 Mar' },
    { id: 3, name: 'Travel App', client: 'Voyage Co.', lead: 'Elena W.', status: 'Completed', progress: 100, deadline: '22 Mar' },
    { id: 4, name: 'AI Chatbot', client: 'Tech Corp', lead: 'David K.', status: 'Delayed', progress: 25, deadline: '05 Apr' },
  ]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', client: '', lead: '', status: 'On Track', progress: 0, deadline: '' });

  const handleAddClick = () => {
    setFormData({ id: null, name: '', client: '', lead: '', status: 'On Track', progress: 0, deadline: '' });
    setShowForm(true);
  };

  const handleEditClick = (project) => {
    setFormData(project);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setProjects(projects.filter(p => p.id !== id));
  };

  const handleSave = () => {
    if (!formData.name || !formData.client || !formData.lead) return;

    if (formData.id) {
      setProjects(projects.map(p => p.id === formData.id ? formData : p));
    } else {
      const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
      setProjects([...projects, { ...formData, id: newId }]);
    }
    setShowForm(false);
  };

  return (
    <motion.div 
      className="dashboard-wrapper"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <header className="main-header">
        <div>
          <h1>CEO Portfolio Dashboard</h1>
          <p>Strategic Overview | Health & Resource Delivery</p>
        </div>
        <div className="header-status">
          <CheckCircle className="sync-icon" /> Systems Synced: Just now
        </div>
      </header>

      {/* --- 1. MODERNIZED STATS GRID --- */}
      <motion.div className="stats-grid" variants={containerVariants}>
        {statsData.map(stat => (
          <motion.div 
            key={stat.id} 
            className="stat-card" 
            variants={itemVariants}
            whileHover={{ y: -10, boxShadow: "0 15px 35px rgba(0,0,0,0.1)" }}
          >
            <div className="stat-main">
              <div className="stat-info">
                <h3>{stat.title}</h3>
                <p>{stat.value}</p>
              </div>
              <div className="stat-icon-wrap">
                {stat.icon}
              </div>
            </div>
            <div className="stat-footer">
              {stat.trend && <ArrowUp className="footer-trend" style={{width: 14}}/>}
              <span>{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* --- 2. CHART SECTION --- */}
      <motion.div className="content-grid-secondary" variants={containerVariants}>
        <motion.div className="chart-container" variants={itemVariants}>
          <h3>Project Completion Velocity</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={performanceData}>
              <defs>
                <linearGradient id="colorPrimary" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="value" stroke={THEME.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorPrimary)" />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div className="breakdown-card" variants={itemVariants}>
          <h3>Active Project Health</h3>
          <ResponsiveContainer width="100%" height={160}>
            <PieChart>
              <Pie data={healthMix} innerRadius={55} outerRadius={75} paddingAngle={8} dataKey="value" stroke="none">
                {healthMix.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="modern-legend">
             {healthMix.map(item => (
               <div key={item.name} className="legend-item">
                 <span className="dot" style={{background: item.color}}></span>
                 <span>{item.name}</span>
               </div>
             ))}
          </div>
        </motion.div>
      </motion.div>

      {/* --- 3. TABLE & SIDEBAR --- */}
      <motion.div className="main-content-grid" variants={containerVariants}>
        <motion.div className="table-container" variants={itemVariants}>
          <div className="table-header-row">
            <h2 className="section-title" style={{ margin: 0 }}>Delivery Pipeline</h2>
            <button className="action-btn primary-btn" onClick={handleAddClick}>
              <Plus size={16} /> Add Project
            </button>
          </div>

          <AnimatePresence>
          {showForm && (
            <motion.div 
              className="form-card" style={{ marginBottom: '20px' }}
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
            >
              <h3>{formData.id ? 'Edit Project' : 'Add Project'}</h3>
              <div className="form-grid">
                <input type="text" placeholder="Project Name" className="form-input" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
                <input type="text" placeholder="Client" className="form-input" value={formData.client} onChange={e => setFormData({...formData, client: e.target.value})} />
                <input type="text" placeholder="Team Lead" className="form-input" value={formData.lead} onChange={e => setFormData({...formData, lead: e.target.value})} />
                <input type="text" placeholder="Deadline (e.g. 15 Mar)" className="form-input" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} />
                <input type="number" placeholder="Progress %" className="form-input" value={formData.progress} onChange={e => setFormData({...formData, progress: Number(e.target.value)})} />
                <select className="form-input" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})}>
                  <option value="On Track">On Track</option>
                  <option value="At Risk">At Risk</option>
                  <option value="Delayed">Delayed</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>
              <div className="form-actions">
                <button className="action-btn success-btn" onClick={handleSave}>Save</button>
                <button className="action-btn cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
              </div>
            </motion.div>
          )}
          </AnimatePresence>

          <div className="table-scroll">
            <table className="projects-table">
              <thead>
                <tr>
                  <th>Project Name</th>
                  <th>Client</th>
                  <th>Team Lead</th>
                  <th>Status</th>
                  <th>Progress</th>
                  <th>Deadline</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {projects.map((project) => (
                  <tr key={project.id}>
                    <td className="font-bold">{project.name}</td>
                    <td className="client-cell"><Building className="row-icon" size={16} />{project.client}</td>
                    <td className="team-lead-cell"><User className="row-icon" size={16} />{project.lead}</td>
                    <td>
                      <span className={`status-badge status-${project.status.toLowerCase().replace(" ", "-")}`}>
                        {project.status}
                      </span>
                    </td>
                    <td>
                      <div className="prog-bar-bg">
                        <motion.div 
                          className="prog-bar-fill" 
                          initial={{ width: 0 }} 
                          animate={{ width: `${project.progress}%` }} 
                          style={{ background: 'linear-gradient(95deg, #38bdf8 0%, #22c55e 100%)' }}
                        />
                      </div>
                    </td>
                    <td className="date-cell">{project.deadline}</td>
                    <td>
                      <button className="icon-btn edit-btn" onClick={() => handleEditClick(project)}>
                        <Edit2 size={16} />
                      </button>
                      <button className="icon-btn delete-btn" onClick={() => handleDelete(project.id)}>
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
                {projects.length === 0 && (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                      <FolderX size={48} style={{ color: '#ccc', marginBottom: '10px' }} />
                      <p style={{ margin: 0, fontWeight: 500, color: '#555' }}>No projects found</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>

        <div className="sidebar-info">
          <motion.div className="info-card timeline-card" variants={itemVariants}>
            <h3><Clock size={18} /> Upcoming Deadlines</h3>
            <ul className="icon-list">
              {timelineData.map((item, idx) => (
                <li key={idx}>
                  <div className="list-main">
                    <Briefcase className="list-icon" size={16} />
                    <div>
                      <p className="list-title">{item.name}</p>
                      <p className="list-subtitle">{item.status}</p>
                    </div>
                  </div>
                  <strong className="list-value">{item.deadline}</strong>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div className="info-card risk-card attention" variants={itemVariants}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><Flame className="critical-icon" size={18} /> Needs Attention</h3>
            <ul className="icon-list">
              {riskData.map((item, idx) => (
                <li key={idx}>
                  <div className="list-main">
                    <div className="risk-icon-wrap" style={{ color: item.risk === 'Critical' ? THEME.status.red : THEME.status.yellow }}>
                      {item.icon}
                    </div>
                    <div>
                      <p className="list-title">{item.name} – {item.risk} Risk</p>
                      <p className="list-subtitle">Issue: {item.issue}</p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Projects;