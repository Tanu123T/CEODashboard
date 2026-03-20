import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

import {
  LayoutDashboard,
  TrendingUp,
  Users,
  DollarSign,
  Settings,
  LogOut,
  CheckSquare,
  BarChart2
} from "lucide-react";

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    alert("Successfully logged out!");
    navigate("/");
  };

  return (
    <div className="navbar">
      <div className="nav-menu">

        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <LayoutDashboard className="icon"/>
          <span>Dashboard</span>
        </Link>

        <Link to="/tasks" className={`nav-item ${location.pathname === '/tasks' ? 'active' : ''}`}>
          <CheckSquare className="icon"/>
          <span>Tasks</span>
        </Link>

        <Link to="/employees" className={`nav-item ${location.pathname === '/employees' ? 'active' : ''}`}>
          <Users className="icon"/>
          <span>Employees</span>
        </Link>

        <Link to="/projects" className={`nav-item ${location.pathname === '/projects' ? 'active' : ''}`}>
          <DollarSign className="icon"/>
          <span>Projects</span>
        </Link>

        <Link to="/analytics" className={`nav-item ${location.pathname === '/analytics' ? 'active' : ''}`}>
          <BarChart2 className="icon"/>
          <span>Analytics</span>
        </Link>

      </div>

      <div className="bottom-menu">

        <Link to="/settings" className={`nav-item ${location.pathname === '/settings' ? 'active' : ''}`}>
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