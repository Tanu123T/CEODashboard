import React, { useState } from 'react';
import './Employees.css';
import '../Project/Project.css'; // Reuse table styles
import { UserPlus, Edit2, Trash2, Search, UserX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const initialEmployees = [
  { id: 1, name: 'Alice Smith', email: 'alice@company.com', role: 'Software Engineer', status: 'Active' },
  { id: 2, name: 'Bob Johnson', email: 'bob@company.com', role: 'Product Manager', status: 'On Leave' },
  { id: 3, name: 'Charlie Davis', email: 'charlie@company.com', role: 'UX Designer', status: 'Inactive' },
  { id: 4, name: 'Diana Prince', email: 'diana@company.com', role: 'Marketing Head', status: 'Active' },
  { id: 5, name: 'Evan Wright', email: 'evan@company.com', role: 'DevOps Engineer', status: 'Active' },
];

const Employees = () => {
  const [employees, setEmployees] = useState(initialEmployees);
  const [search, setSearch] = useState('');
  
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ id: null, name: '', email: '', role: '', status: 'Active' });

  const filteredEmployees = employees.filter(emp => 
    emp.name.toLowerCase().includes(search.toLowerCase()) || 
    emp.role.toLowerCase().includes(search.toLowerCase()) ||
    emp.email.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClick = () => {
    setFormData({ id: null, name: '', email: '', role: '', status: 'Active' });
    setShowForm(true);
  };

  const handleEditClick = (emp) => {
    setFormData(emp);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    setEmployees(employees.filter(e => e.id !== id));
  };

  const handleSave = () => {
    if (!formData.name || !formData.email || !formData.role) return;

    if (formData.id) {
      // Edit
      setEmployees(employees.map(e => e.id === formData.id ? formData : e));
    } else {
      // Add
      const newId = employees.length > 0 ? Math.max(...employees.map(e => e.id)) + 1 : 1;
      setEmployees([...employees, { ...formData, id: newId }]);
    }
    setShowForm(false);
  };

  const getStatusClass = (status) => {
    if (status === 'Active') return 'status-on-track';
    if (status === 'On Leave') return 'status-delayed';
    return 'status-at-risk';
  };

  return (
    <div className="dashboard-wrapper">
      <header className="main-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>Employees</h1>
          <p>Team Management & Directory</p>
        </div>
        <button className="action-btn primary-btn" onClick={handleAddClick}>
          <UserPlus size={16} /> Add Employee
        </button>
      </header>

      <AnimatePresence>
      {showForm && (
        <motion.div 
          className="form-card"
          initial={{ opacity: 0, y: -20, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          <h3>{formData.id ? 'Edit Employee' : 'Add Employee'}</h3>
          <div className="form-grid">
            <input 
              type="text" 
              placeholder="Full Name" 
              className="form-input"
              value={formData.name} 
              onChange={e => setFormData({...formData, name: e.target.value})} 
            />
            <input 
              type="email" 
              placeholder="Email Address" 
              className="form-input"
              value={formData.email} 
              onChange={e => setFormData({...formData, email: e.target.value})} 
            />
            <input 
              type="text" 
              placeholder="Role / Title" 
              className="form-input"
              value={formData.role} 
              onChange={e => setFormData({...formData, role: e.target.value})} 
            />
            <select 
              className="form-input" 
              value={formData.status} 
              onChange={e => setFormData({...formData, status: e.target.value})}
            >
              <option value="Active">Active</option>
              <option value="On Leave">On Leave</option>
              <option value="Inactive">Inactive</option>
            </select>
          </div>
          <div className="form-actions">
            <button className="action-btn success-btn" onClick={handleSave}>Save</button>
            <button className="action-btn cancel-btn" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </motion.div>
      )}
      </AnimatePresence>

      <div className="main-content-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="table-container">
          
          <div className="search-bar">
            <Search className="search-icon" size={18} />
            <input 
              type="text" 
              placeholder="Search by name, email, or role..." 
              value={search} 
              onChange={e => setSearch(e.target.value)} 
            />
          </div>

          <table className="projects-table">
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map(emp => (
                <tr key={emp.id}>
                  <td className="font-bold">{emp.name}</td>
                  <td>{emp.email}</td>
                  <td>{emp.role}</td>
                  <td>
                    <span className={`status-badge ${getStatusClass(emp.status)}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <button className="icon-btn edit-btn" onClick={() => handleEditClick(emp)}>
                      <Edit2 size={16} />
                    </button>
                    <button className="icon-btn delete-btn" onClick={() => handleDelete(emp.id)}>
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {filteredEmployees.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
                    <UserX size={48} style={{ color: '#ccc', marginBottom: '10px' }} />
                    <p style={{ margin: 0, fontWeight: 500, color: '#555' }}>No employees found</p>
                    <p style={{ fontSize: '13px', marginTop: '5px' }}>Try adjusting your search query "{search}".</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Employees;
