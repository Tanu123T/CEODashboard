import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

import {
  LayoutDashboard,
  Users,
  DollarSign,
  Settings,
  LogOut,
  CheckSquare,
  BarChart2
} from "lucide-react";

const Navbar = ({ isOpen, onCloseSidebar }) => {
  const location = useLocation();
  const navigate = useNavigate();

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

        <Link to="/tasks" className={`nav-item ${location.pathname === '/tasks' ? 'active' : ''}`} onClick={handleNavClick}>
          <CheckSquare className="icon"/>
          <span>Tasks</span>
        </Link>

        <Link to="/employees" className={`nav-item ${location.pathname === '/employees' ? 'active' : ''}`} onClick={handleNavClick}>
          <Users className="icon"/>
          <span>Employees</span>
        </Link>

        <Link to="/projects" className={`nav-item ${location.pathname === '/projects' ? 'active' : ''}`} onClick={handleNavClick}>
          <DollarSign className="icon"/>
          <span>Projects</span>
        </Link>

        <Link to="/analytics" className={`nav-item ${location.pathname === '/analytics' ? 'active' : ''}`} onClick={handleNavClick}>
          <BarChart2 className="icon"/>
          <span>Analytics</span>
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