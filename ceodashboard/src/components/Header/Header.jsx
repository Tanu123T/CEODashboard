import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

import { Bell, Settings, LogOut, ChevronDown, Menu, Search, X } from "lucide-react";

const Header = ({ onToggleSidebar }) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Successfully logged out!");
    navigate("/");
    setShowProfile(false);
  };

  return (
    <div className="header">
      <div className="header-left">
        <button
          type="button"
          className="menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>

        <button type="button" className="close-chip" aria-label="Close panel">
          <X size={16} />
        </button>

        <div className="logo-box">VG</div>

        <div className="title-wrap">
          <h2 className="title">Vishwaguru Infotech Pvt Ltd</h2>
          <p>CEO Dashboard</p>
        </div>
      </div>

      <div className="header-search-wrap" role="search">
        <Search size={17} />
        <input type="text" placeholder="Search by project, client, or squad" aria-label="Search" />
      </div>

      <div className="header-right">
        <div className="icon-box notification" onClick={() => { setShowNotifications(!showNotifications); setShowProfile(false); }}>
          <Bell />
          <span className="badge">3</span>

          {showNotifications && (
            <div className="dropdown-menu notifications-menu">
              <h4>Notifications</h4>
              <ul>
                <li>New client signed up</li>
                <li>Project CRM delayed</li>
                <li>Payment of ₹1.5L received</li>
              </ul>
            </div>
          )}
        </div>

        <div className="profile" onClick={() => { setShowProfile(!showProfile); setShowNotifications(false); }}>
          <span className="avatar-chip">CE</span>
          <ChevronDown />

          {showProfile && (
            <div className="dropdown-menu profile-menu">
              <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); navigate('/settings'); setShowProfile(false); }}>
                <Settings style={{ fontSize: '16px' }} /> Settings
              </div>
              <div className="dropdown-item" onClick={(e) => { e.stopPropagation(); handleLogout(); }}>
                <LogOut style={{ fontSize: '16px' }} /> Logout
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
