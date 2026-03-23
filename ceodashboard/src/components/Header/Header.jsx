import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Header.css";

import { Bell, Settings, LogOut, ChevronDown, Menu } from "lucide-react";

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

      {/* LEFT SIDE */}
      <div className="header-left">
        <button
          type="button"
          className="menu-toggle"
          onClick={onToggleSidebar}
          aria-label="Toggle navigation"
        >
          <Menu size={20} />
        </button>
        <div className="logo-box">VG</div>
        <h2 className="title">
          Vishwaguru Infotech Pvt Ltd <span>CEO Dashboard</span>
        </h2>
      </div>

      {/* RIGHT SIDE */}
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
          <img
            src="https://i.pravatar.cc/40"
            alt="profile"
          />
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
