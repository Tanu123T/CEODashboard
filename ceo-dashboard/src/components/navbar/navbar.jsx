import React from "react";
import { Link, useLocation } from "react-router-dom";
import "./Navbar.css";

import {
  FiGrid,
  FiTrendingUp,
  FiUsers,
  FiDollarSign,
  FiUserCheck,
  FiSettings,
  FiLogOut
} from "react-icons/fi";

const Navbar = () => {
  const location = useLocation();

  return (
    <div className="navbar">
      <div className="nav-menu">

        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <FiGrid className="icon"/>
          <span>Dashboard</span>
        </Link>

        <div className="nav-item">
          <FiTrendingUp className="icon"/>
          <span>Sprint</span>
        </div>

        <div className="nav-item">
          <FiUsers className="icon"/>
          <span>Team</span>
        </div>

        <Link to="/projects" className={`nav-item ${location.pathname === '/projects' ? 'active' : ''}`}>
          <FiDollarSign className="icon"/>
          <span>Projects</span>
        </Link>

        <div className="nav-item">
          <FiUserCheck className="icon"/>
          <span>Clients</span>
        </div>

      </div>

      <div className="bottom-menu">

        <div className="nav-item">
          <FiSettings className="icon"/>
          <span>Setting</span>
        </div>

        <div className="nav-item">
          <FiLogOut className="icon"/>
          <span>Log out</span>
        </div>

      </div>

    </div>
  );
};

export default Navbar;