import React from "react";
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
  return (
    <div className="navbar">
      <div className="nav-menu">

        <div className="nav-item active">
          <FiGrid className="icon"/>
          <span>Dashboard</span>
        </div>

        <div className="nav-item">
          <FiTrendingUp className="icon"/>
          <span>Analytics</span>
        </div>

        <div className="nav-item">
          <FiUsers className="icon"/>
          <span>Customers</span>
        </div>

        <div className="nav-item">
          <FiDollarSign className="icon"/>
          <span>Financials</span>
        </div>

        <div className="nav-item">
          <FiUserCheck className="icon"/>
          <span>Team</span>
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