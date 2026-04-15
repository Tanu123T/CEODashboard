import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Navbar.css";

import {
  ChevronDown,
  ChevronRight,
  LayoutDashboard,
  BriefcaseBusiness,
  Users,
  Settings,
  LogOut,
} from "lucide-react";

const Navbar = ({ isOpen }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const isOverviewRoute = location.pathname === '/' || location.pathname.startsWith('/overview');
  const isExecutionRoute = location.pathname.startsWith('/projects') || location.pathname.startsWith('/sprints');
  const isPeopleHealthRoute = location.pathname.startsWith('/employees');
  const [overviewMenuOpen, setOverviewMenuOpen] = useState(true);
  const [executionMenuOpen, setExecutionMenuOpen] = useState(true);
  const [peopleHealthMenuOpen, setPeopleHealthMenuOpen] = useState(true);

  const overviewSubMenus = [
    { label: 'Dashboard', to: '/' },
  ];

  const executionSubMenus = [
    { label: 'Projects', to: '/projects' },
    { label: 'Sprints', to: '/sprints' },
  ];

  const peopleHealthSubMenus = [
    { label: 'WorkForce Health', to: '/employees/availability' },
    { label: 'Employee Hub', to: '/employees/role-coverage' },
    { label: 'Work Calender', to: '/employees/holiday-calendar' },
    // { label: 'Org Hierarchy', to: '/employees/hiring-recruitment' },
  ];

  const handleLogout = () => {
    alert("Successfully logged out!");
    navigate("/");
  };

  return (
    <div className={`navbar ${isOpen ? "open" : ""}`}>
      <div className="nav-menu">

        <div className={`nav-group ${overviewMenuOpen ? 'open' : ''}`}>
          <Link to="/" className={`nav-item ${isOverviewRoute ? 'active' : ''}`}>
            <LayoutDashboard className="icon"/>
            <span>Overview</span>
            <button
              type="button"
              className="nav-expand-btn"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setOverviewMenuOpen((value) => !value);
              }}
              aria-label="Toggle Overview sub menu"
              aria-expanded={overviewMenuOpen}
            >
              {overviewMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </Link>

          {overviewMenuOpen ? (
            <div className="nav-submenu">
              {overviewSubMenus.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-subitem ${location.pathname === item.to ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className={`nav-group ${executionMenuOpen ? 'open' : ''}`}>
          <Link to="/projects" className={`nav-item ${isExecutionRoute ? 'active' : ''}`}>
            <BriefcaseBusiness className="icon"/>
            <span>Execution</span>
            <button
              type="button"
              className="nav-expand-btn"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setExecutionMenuOpen((value) => !value);
              }}
              aria-label="Toggle Execution sub menu"
              aria-expanded={executionMenuOpen}
            >
              {executionMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </Link>

          {executionMenuOpen ? (
            <div className="nav-submenu">
              {executionSubMenus.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-subitem ${location.pathname.startsWith(item.to) ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

        <div className={`nav-group ${peopleHealthMenuOpen ? 'open' : ''}`}>
          <Link to="/employees/availability" className={`nav-item ${isPeopleHealthRoute ? 'active' : ''}`}>
            <Users className="icon"/>
            <span>People Health</span>
            <button
              type="button"
              className="nav-expand-btn"
              onClick={(event) => {
                event.preventDefault();
                event.stopPropagation();
                setPeopleHealthMenuOpen((value) => !value);
              }}
              aria-label="Toggle People Health sub menu"
              aria-expanded={peopleHealthMenuOpen}
            >
              {peopleHealthMenuOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
            </button>
          </Link>

          {peopleHealthMenuOpen ? (
            <div className="nav-submenu">
              {peopleHealthSubMenus.map((item) => (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`nav-subitem ${location.pathname === item.to ? 'active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          ) : null}
        </div>

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