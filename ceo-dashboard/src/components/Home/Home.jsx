import React from "react";
import "./Home.css";

import {
  FiCalendar,
  FiUsers,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiAlertCircle
} from "react-icons/fi";

const Home = () => {

  const today = new Date();
  const date = today.toLocaleDateString("en-IN", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric"
  });

  return (
    <div className="home">

      {/* Welcome Section */}

      <div className="welcome-section">
        <h2>Welcome, CEO</h2>
        <p>{date}</p>
      </div>


      {/* Stats Cards */}

      <div className="stats-grid">

        <div className="stat-card">
          <FiUsers className="stat-icon"/>
          <div>
            <p>Active Clients</p>
            <h3>72</h3>
          </div>
        </div>

        <div className="stat-card">
          <FiDollarSign className="stat-icon"/>
          <div>
            <p>Monthly Revenue</p>
            <h3>₹12L</h3>
          </div>
        </div>

        <div className="stat-card">
          <FiCheckCircle className="stat-icon"/>
          <div>
            <p>Completed Projects</p>
            <h3>10</h3>
          </div>
        </div>

        <div className="stat-card">
          <FiCalendar className="stat-icon"/>
          <div>
            <p>Meetings Today</p>
            <h3>4</h3>
          </div>
        </div>

      </div>


      {/* Main Grid */}

      <div className="dashboard-grid">


        {/* Schedule */}

        <div className="schedule-card">
          <h3><FiClock /> Today's Schedule</h3>

          <div className="meeting">
            <span>10:30 AM</span>
            <div>
              <h4>Client Meeting</h4>
              <p>Medical Tourism Platform</p>
            </div>
          </div>

          <div className="meeting">
            <span>12:00 PM</span>
            <div>
              <h4>Team Standup</h4>
              <p>Development Team</p>
            </div>
          </div>

          <div className="meeting">
            <span>03:00 PM</span>
            <div>
              <h4>Investor Call</h4>
              <p>Quarterly Review</p>
            </div>
          </div>

        </div>


        {/* Alerts */}

        <div className="alerts-card">
          <h3><FiAlertCircle /> Important Alerts</h3>

          <p>⚠ Delayed Project: CRM System</p>
          <p>💰 Payment Pending: ₹1.5L</p>
          <p>🐞 5 Critical Bugs Reported</p>
        </div>

      </div>

    </div>
  );
};

export default Home;