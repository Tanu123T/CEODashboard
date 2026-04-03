import React, { useState } from 'react';
import './Settings.css';
import {
  UserCog,
  Lock,
  Bell,
  ShieldCheck,
  Save,
  Smartphone,
  Monitor,
  Link2,
  Trash2,
} from 'lucide-react';

const sessions = [
  { id: 1, device: 'Windows Laptop', location: 'Pune, IN', time: 'Active now', icon: Monitor },
  { id: 2, device: 'iPhone 15', location: 'Mumbai, IN', time: 'Today, 10:14 AM', icon: Smartphone },
  { id: 3, device: 'MacBook Air', location: 'Bengaluru, IN', time: 'Yesterday, 06:49 PM', icon: Monitor },
];

const initialApps = [
  { id: 1, name: 'Slack Workspace', permission: 'Notifications + profile', connected: true },
  { id: 2, name: 'Google Calendar', permission: 'Meeting sync', connected: true },
  { id: 3, name: 'Jira Cloud', permission: 'Task updates', connected: false },
];

const Settings = () => {
  const [profile, setProfile] = useState({
    firstName: 'John',
    lastName: 'Doe',
    email: 'ceo@company.com',
    phone: '+91 98765 43210',
    timezone: 'Asia/Kolkata',
    role: 'Chief Executive Officer',
  });

  const [preferences, setPreferences] = useState({
    emailAlerts: true,
    pushAlerts: true,
    weeklyDigest: false,
    twoFactor: true,
    loginAlerts: true,
  });

  const [apps, setApps] = useState(initialApps);
  const [isEditing, setIsEditing] = useState(false);
  const [passwordFormOpen, setPasswordFormOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  const [successMsg, setSuccessMsg] = useState('');

  const handleProfileSave = () => {
    setIsEditing(false);
    setSuccessMsg('Profile settings updated successfully.');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const handlePasswordSave = () => {
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) return;
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSuccessMsg('New password and confirm password must match.');
      setTimeout(() => setSuccessMsg(''), 2500);
      return;
    }

    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setPasswordFormOpen(false);
    setSuccessMsg('Password updated successfully.');
    setTimeout(() => setSuccessMsg(''), 2500);
  };

  const togglePreference = (key) => {
    setPreferences((current) => ({
      ...current,
      [key]: !current[key],
    }));
  };

  const toggleAppConnection = (id) => {
    setApps((current) => current.map((app) => {
      if (app.id !== id) return app;
      return { ...app, connected: !app.connected };
    }));
  };

  return (
    <div className="dashboard-wrapper settings-page">
      <header className="main-header">
        <div>
          <h1>Settings</h1>
          <p>Manage your account, security, notifications, and connected tools.</p>
        </div>
      </header>

      {successMsg ? <p className="settings-success-msg">{successMsg}</p> : null}

      <section className="settings-layout">
        <article className="settings-card">
          <div className="settings-card-head">
            <h3><UserCog size={18} /> Profile</h3>
            {!isEditing ? (
              <button type="button" className="settings-ghost-btn" onClick={() => setIsEditing(true)}>Edit</button>
            ) : null}
          </div>

          <div className="profile-chip">
            <div className="profile-avatar">JD</div>
            <div>
              <p className="profile-name">{profile.firstName} {profile.lastName}</p>
              <p className="profile-role">{profile.role}</p>
            </div>
          </div>

          <div className="settings-form-grid">
            <label>
              <span>First Name</span>
              <input
                value={profile.firstName}
                disabled={!isEditing}
                onChange={(event) => setProfile({ ...profile, firstName: event.target.value })}
              />
            </label>
            <label>
              <span>Last Name</span>
              <input
                value={profile.lastName}
                disabled={!isEditing}
                onChange={(event) => setProfile({ ...profile, lastName: event.target.value })}
              />
            </label>
            <label>
              <span>Email</span>
              <input
                value={profile.email}
                disabled={!isEditing}
                onChange={(event) => setProfile({ ...profile, email: event.target.value })}
              />
            </label>
            <label>
              <span>Phone</span>
              <input
                value={profile.phone}
                disabled={!isEditing}
                onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
              />
            </label>
            <label>
              <span>Timezone</span>
              <input
                value={profile.timezone}
                disabled={!isEditing}
                onChange={(event) => setProfile({ ...profile, timezone: event.target.value })}
              />
            </label>
            <label>
              <span>Role</span>
              <input value={profile.role} disabled />
            </label>
          </div>

          {isEditing ? (
            <div className="settings-actions">
              <button type="button" className="settings-primary-btn" onClick={handleProfileSave}><Save size={15} /> Save Profile</button>
              <button
                type="button"
                className="settings-ghost-btn"
                onClick={() => {
                  setIsEditing(false);
                }}
              >
                Cancel
              </button>
            </div>
          ) : null}
        </article>

        <article className="settings-card">
          <div className="settings-card-head">
            <h3><Bell size={18} /> Preferences</h3>
          </div>
          <ul className="setting-switch-list">
            <li>
              <div>
                <p>Email Alerts</p>
                <span>Receive important account and delivery updates.</span>
              </div>
              <button type="button" className={`switch-btn ${preferences.emailAlerts ? 'on' : ''}`} onClick={() => togglePreference('emailAlerts')}>
                <span />
              </button>
            </li>
            <li>
              <div>
                <p>Push Notifications</p>
                <span>Show browser notifications for urgent events.</span>
              </div>
              <button type="button" className={`switch-btn ${preferences.pushAlerts ? 'on' : ''}`} onClick={() => togglePreference('pushAlerts')}>
                <span />
              </button>
            </li>
            <li>
              <div>
                <p>Weekly Digest</p>
                <span>Get one consolidated summary every Monday morning.</span>
              </div>
              <button type="button" className={`switch-btn ${preferences.weeklyDigest ? 'on' : ''}`} onClick={() => togglePreference('weeklyDigest')}>
                <span />
              </button>
            </li>
          </ul>
        </article>

        <article className="settings-card">
          <div className="settings-card-head">
            <h3><ShieldCheck size={18} /> Security</h3>
            <button type="button" className="settings-ghost-btn" onClick={() => setPasswordFormOpen((current) => !current)}>
              {passwordFormOpen ? 'Close' : 'Change Password'}
            </button>
          </div>

          <ul className="setting-switch-list compact">
            <li>
              <div>
                <p>Two-factor authentication</p>
                <span>Protect your account with OTP verification.</span>
              </div>
              <button type="button" className={`switch-btn ${preferences.twoFactor ? 'on' : ''}`} onClick={() => togglePreference('twoFactor')}>
                <span />
              </button>
            </li>
            <li>
              <div>
                <p>Login alerts</p>
                <span>Notify me whenever a new sign-in is detected.</span>
              </div>
              <button type="button" className={`switch-btn ${preferences.loginAlerts ? 'on' : ''}`} onClick={() => togglePreference('loginAlerts')}>
                <span />
              </button>
            </li>
          </ul>

          {passwordFormOpen ? (
            <div className="password-box">
              <label>
                <span>Current Password</span>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(event) => setPasswordForm({ ...passwordForm, currentPassword: event.target.value })}
                />
              </label>
              <label>
                <span>New Password</span>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(event) => setPasswordForm({ ...passwordForm, newPassword: event.target.value })}
                />
              </label>
              <label>
                <span>Confirm Password</span>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(event) => setPasswordForm({ ...passwordForm, confirmPassword: event.target.value })}
                />
              </label>

              <div className="settings-actions">
                <button type="button" className="settings-primary-btn" onClick={handlePasswordSave}><Lock size={15} /> Update Password</button>
              </div>
            </div>
          ) : null}
        </article>

        <article className="settings-card">
          <div className="settings-card-head">
            <h3><Monitor size={18} /> Active Sessions</h3>
          </div>
          <ul className="session-list">
            {sessions.map((session) => {
              const Icon = session.icon;
              return (
                <li key={session.id}>
                  <div className="session-main">
                    <Icon size={16} />
                    <div>
                      <p>{session.device}</p>
                      <span>{session.location}</span>
                    </div>
                  </div>
                  <strong>{session.time}</strong>
                </li>
              );
            })}
          </ul>
        </article>

        <article className="settings-card">
          <div className="settings-card-head">
            <h3><Link2 size={18} /> Connected Apps</h3>
          </div>
          <ul className="app-list">
            {apps.map((app) => (
              <li key={app.id}>
                <div>
                  <p>{app.name}</p>
                  <span>{app.permission}</span>
                </div>
                <button
                  type="button"
                  className={app.connected ? 'disconnect-btn' : 'connect-btn'}
                  onClick={() => toggleAppConnection(app.id)}
                >
                  {app.connected ? 'Disconnect' : 'Connect'}
                </button>
              </li>
            ))}
          </ul>
        </article>

        <article className="settings-card danger-zone">
          <div className="settings-card-head">
            <h3><Trash2 size={18} /> Danger Zone</h3>
          </div>
          <p>Deactivate your account and revoke all active sessions. This action can be reversed by an admin within 7 days.</p>
          <button type="button" className="danger-btn">Deactivate Account</button>
        </article>
      </section>
    </div>
  );
};

export default Settings;
