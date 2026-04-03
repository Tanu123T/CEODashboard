import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

import {
  LayoutDashboard,
  Users,
  DollarSign,
  Handshake,
  ShieldAlert,
  Settings,
  LogOut,
  Flag
} from "lucide-react";

const Navbar = ({ isOpen, onCloseSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isSprintsRoute = location.pathname.startsWith('/sprints');

  const handleLogout = () => {
    alert("Successfully logged out!");
    onCloseSidebar();
    navigate("/");
  };

  const handleNavClick = () => {
    onCloseSidebar();
  };

  return (
    <div className={`navbar ${isOpen ? "open" : ""}`}>
      <div className="nav-menu">

        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`} onClick={handleNavClick}>
          <LayoutDashboard className="icon"/>
          <span>Dashboard</span>
        </Link>

        <Link to="/employees" className={`nav-item ${location.pathname === '/employees' ? 'active' : ''}`} onClick={handleNavClick}>
          <Users className="icon"/>
          <span>Team Performance</span>
        </Link>

        <Link to="/clients" className={`nav-item ${location.pathname === '/clients' ? 'active' : ''}`} onClick={handleNavClick}>
          <Handshake className="icon"/>
          <span>Clients</span>
        </Link>

        <Link to="/risks" className={`nav-item ${location.pathname === '/risks' ? 'active' : ''}`} onClick={handleNavClick}>
          <ShieldAlert className="icon"/>
          <span>Risks & Alerts</span>
        </Link>

        <Link to="/projects" className={`nav-item ${location.pathname === '/projects' ? 'active' : ''}`} onClick={handleNavClick}>
          <DollarSign className="icon"/>
          <span>Projects</span>
        </Link>

        <Link to="/sprints" className={`nav-item ${isSprintsRoute ? 'active' : ''}`} onClick={handleNavClick}>
          <Flag className="icon"/>
          <span>Sprints</span>
        </Link>

      </div>

      <div className="bottom-menu">

        <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`} onClick={handleNavClick}>
          <Settings className="icon"/>
          <span>Settings</span>
        </Link>

        <div className="nav-item" onClick={handleLogout} style={{ cursor: 'pointer' }}>
          <LogOut className="icon"/>
          <span>Log out</span>
        </div>

      </div>

    </div>
  );
};

export default Navbar;