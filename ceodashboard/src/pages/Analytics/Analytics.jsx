import React from 'react';
import './Analytics.css';
import '../Project/Project.css'; // Reusing existing card & chart styles
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar, Legend } from 'recharts';

const THEME = {
  primary: '#0f3d2e',
  secondary: '#145a42',
  status: { green: '#27ae60', yellow: '#f1c40f', red: '#e74c3c', blue: '#3498db' }
};

const revenueData = [
  { month: 'Jan', revenue: 120, expenses: 80 },
  { month: 'Feb', revenue: 180, expenses: 100 },
  { month: 'Mar', revenue: 160, expenses: 110 },
  { month: 'Apr', revenue: 240, expenses: 140 },
  { month: 'May', revenue: 210, expenses: 130 },
  { month: 'Jun', revenue: 340, expenses: 180 },
];

const projectStats = [
  { name: 'Completed', value: 45, color: THEME.status.green },
  { name: 'Active', value: 35, color: THEME.status.blue },
  { name: 'At Risk', value: 15, color: THEME.status.yellow },
  { name: 'Delayed', value: 5, color: THEME.status.red },
];

const teamProductivity = [
  { team: 'Engineering', completed: 25, active: 10 },
  { team: 'Design', completed: 15, active: 5 },
  { team: 'Marketing', completed: 10, active: 15 },
];

const Analytics = () => {
  return (
    <div className="dashboard-wrapper">
      <header className="main-header">
        <div>
          <h1>Analytics Overview</h1>
          <p>Comprehensive Performance & Revenue Metrics</p>
        </div>
      </header>

      <div className="content-grid-secondary" style={{ marginTop: '20px' }}>
        <div className="chart-container">
          <h3>Revenue & Expense Trends</h3>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={THEME.primary} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={THEME.primary} stopOpacity={0}/>
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={THEME.status.red} stopOpacity={0.3}/>
                  <stop offset="95%" stopColor={THEME.status.red} stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#888', fontSize: 12}} />
              <YAxis hide />
              <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              <Legend verticalAlign="top" height={36}/>
              <Area type="monotone" dataKey="revenue" name="Revenue" stroke={THEME.primary} strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke={THEME.status.red} strokeWidth={3} fillOpacity={1} fill="url(#colorExpense)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="breakdown-card">
          <h3>Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={projectStats} innerRadius={60} outerRadius={85} paddingAngle={5} dataKey="value" stroke="none">
                {projectStats.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="modern-legend">
             {projectStats.map(item => (
               <div key={item.name} className="legend-item">
                 <span className="dot" style={{background: item.color}}></span>
                 <span>{item.name} ({item.value}%)</span>
               </div>
             ))}
          </div>
        </div>
      </div>

      <div className="main-content-grid" style={{ marginTop: '20px' }}>
        <div className="table-container">
          <h2 className="section-title">Team Productivity Breakdown</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamProductivity} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="team" axisLine={false} tickLine={false} />
              <YAxis hide />
              <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }} />
              <Legend />
              <Bar dataKey="completed" name="Completed Projects" stackId="a" fill={THEME.status.green} radius={[0, 0, 4, 4]} />
              <Bar dataKey="active" name="Active Projects" stackId="a" fill={THEME.status.blue} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

    </div>
  );
};

export default Analytics;
