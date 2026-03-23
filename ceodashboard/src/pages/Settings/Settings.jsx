import React, { useState } from 'react';
import './Settings.css';
import '../Project/Project.css';
import '../Employees/Employees.css';
import { UserCog, Lock, Bell, Save } from 'lucide-react';
import { motion } from 'framer-motion';

const Settings = () => {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'ceo@company.com',
    role: 'Chief Executive Officer',
    notifications: true
  });

  const [isEditing, setIsEditing] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  const handleSave = () => {
    setIsEditing(false);
    setSuccessMsg('Profile updated successfully!');
    setTimeout(() => setSuccessMsg(''), 3000);
  };

  return (
    <div className="dashboard-wrapper">
      <header className="main-header">
        <div>
          <h1>Settings</h1>
          <p>Account Preferences & Profile</p>
        </div>
      </header>

      <div className="main-content-grid" style={{ gridTemplateColumns: '2fr 1fr', gap: '25px', marginTop: '20px', alignItems: 'start' }}>
        
        {/* Profile Form */}
        <motion.div 
          className="form-card" style={{ margin: 0 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' }}>
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', margin: 0 }}><UserCog size={20} /> Profile Information</h3>
            {!isEditing && (
              <button className="action-btn" onClick={() => setIsEditing(true)} style={{ background: '#f1f5f9', color: '#333' }}>
                Edit Profile
              </button>
            )}
          </div>
          
          <div className="form-grid">
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '8px', color: '#555', fontSize: '14px', fontWeight: 'bold' }}>First Name</label>
              <input type="text" className="form-input" value={profile.firstName} disabled={!isEditing}
                     onChange={(e) => setProfile({...profile, firstName: e.target.value})} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '8px', color: '#555', fontSize: '14px', fontWeight: 'bold' }}>Last Name</label>
              <input type="text" className="form-input" value={profile.lastName} disabled={!isEditing}
                     onChange={(e) => setProfile({...profile, lastName: e.target.value})} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '8px', color: '#555', fontSize: '14px', fontWeight: 'bold' }}>Email Address</label>
              <input type="email" className="form-input" value={profile.email} disabled={!isEditing}
                     onChange={(e) => setProfile({...profile, email: e.target.value})} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <label style={{ marginBottom: '8px', color: '#555', fontSize: '14px', fontWeight: 'bold' }}>Role</label>
              <input type="text" className="form-input" value={profile.role} disabled={true} style={{ background: '#f8fafc' }} />
            </div>
          </div>

          {isEditing && (
             <div className="form-actions" style={{ marginTop: '25px' }}>
                <button className="action-btn success-btn" onClick={handleSave}><Save size={16} /> Save Changes</button>
                <button className="action-btn cancel-btn" onClick={() => {
                  setIsEditing(false);
                  setSuccessMsg('');
                }}>Cancel</button>
             </div>
          )}

          {successMsg && <p style={{ color: '#22c55e', marginTop: '15px', fontWeight: 'bold' }}>{successMsg}</p>}
        </motion.div>

        {/* Other Settings */}
        <motion.div 
          style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <div className="info-card timeline-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}><Lock style={{ color: '#e74c3c' }} size={20} /> Security</h3>
            <p style={{ color: '#555', fontSize: '14px', margin: '15px 0' }}>Last login: Today at 09:41 AM</p>
            <button className="action-btn cancel-btn" style={{ width: '100%', justifyContent: 'center' }}>Change Password</button>
          </div>

          <div className="info-card timeline-card">
            <h3 style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#333' }}><Bell style={{ color: '#3498db' }} size={20} /> Notifications</h3>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '15px 0' }}>
              <span style={{ fontSize: '14px', color: '#333', fontWeight: 'bold' }}>Email Alerts</span>
              <input type="checkbox" checked={profile.notifications} onChange={(e) => setProfile({...profile, notifications: e.target.checked})} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};

export default Settings;
