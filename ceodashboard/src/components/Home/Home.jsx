import React from "react";
import "./Home.css";

import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

import {
  Calendar,
  Users,
  DollarSign,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  LayoutDashboard
} from "lucide-react";

const revenueData = [
  { month: 'Jan', value: 120 },
  { month: 'Feb', value: 180 },
  { month: 'Mar', value: 160 },
  { month: 'Apr', value: 240 },
  { month: 'May', value: 210 },
  { month: 'Jun', value: 340 },
];

const projectStatus = [
  { name: 'Completed', value: 45, color: '#27ae60' },
  { name: 'Active', value: 35, color: '#3498db' },
  { name: 'Delayed', value: 20, color: '#e74c3c' },
];

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
          <DollarSign className="stat-icon"/>
          <div>
            <p>Total Revenue</p>
            <h3>₹3.4Cr</h3>
          </div>
        </div>

        <div className="stat-card">
          <Users className="stat-icon"/>
          <div>
            <p>Total Employees</p>
            <h3>148</h3>
          </div>
        </div>

        <div className="stat-card">
          <LayoutDashboard className="stat-icon"/>
          <div>
            <p>Active Projects</p>
            <h3>12</h3>
          </div>
        </div>

        <div className="stat-card">
          <TrendingUp className="stat-icon"/>
          <div>
            <p>Growth %</p>
            <h3>+24%</h3>
          </div>
        </div>

      </div>

      {/* Charts Section */}
      <div className="home-charts-grid">
        <div className="chart-card">
          <h3>Revenue Growth</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#1fa37a" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#1fa37a" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              <Area type="monotone" dataKey="value" stroke="#1fa37a" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h3>Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={projectStatus} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" stroke="none">
                {projectStatus.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>


      {/* Main Grid */}

      <div className="dashboard-grid">


        {/* Schedule */}

        <div className="schedule-card">
          <h3><Clock /> Today's Schedule</h3>

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
          <h3><AlertCircle /> Important Alerts</h3>

          <p>⚠ Delayed Project: CRM System</p>
          <p>💰 Payment Pending: ₹1.5L</p>
          <p>🐞 5 Critical Bugs Reported</p>
        </div>

      </div>

    </div>
  );
};

export default Home;