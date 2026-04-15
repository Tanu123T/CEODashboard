import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { employees } from '../../modules/peopleHealth/data/employees';
import { getEmployeeDetailData } from '../../pages/Employees/employeeDetailData';
import './EmployeeDetail.css';

// Icons Components
const StarIcon = ({ filled = false }) => (
  <span className={`star-icon ${filled ? 'filled' : ''}`}>★</span>
);

const CheckIcon = () => <span className="check-icon">✓</span>;
const DownloadIcon = () => <span className="download-icon">⬇</span>;
const LinkIcon = () => <span className="link-icon">🔗</span>;
const TrophyIcon = () => <span className="trophy-icon">🏆</span>;
const PageIcon = () => <span className="page-icon">📄</span>;
const StarBadgeIcon = () => <span className="star-badge-icon">⭐</span>;

const EmployeeDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [employee, setEmployee] = useState(null);
  const [detailData, setDetailData] = useState(null);

  useEffect(() => {
    // Extract employeeId from the URL path (e.g., /employees/E-001)
    const pathSegments = location.pathname.split('/');
    const employeeId = pathSegments[2]; // Get the second segment after '/employees/'
    
    // Find employee by ID from the employees list
    const emp = employees.find(e => e.id === employeeId) || employees[0];
    setEmployee(emp);
    setDetailData(getEmployeeDetailData(emp));
  }, [location.pathname]);

  if (!employee || !detailData) {
    return <div className="employee-detail">Loading...</div>;
  }

  const currentProject = detailData.projects.find(project => project.status === 'In Progress') || detailData.projects[0];
  const projectHistory = detailData.projects.filter(project => project !== currentProject);
  const activeProjectsCount = detailData.projects.filter(project => project.status === 'In Progress').length;
  const completedProjectsCount = detailData.projects.filter(project => project.status === 'Completed').length;

  return (
    <div className="employee-detail">
      {/* Back Button */}
      <div className="ed-back-button-container">
        <button className="ed-back-button" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      {/* Employee Header */}
      <div className="ed-employee-header">
        <div className="ed-header-left">
          <h2 className="ed-name">{employee.name}</h2>
          <p className="ed-role-dept">{employee.role} | {employee.department}</p>
        </div>
      </div>

      {/* Main Content Grid - 2 Column Layout */}
      <div className="ed-container">
        {/* LEFT SIDEBAR */}
        <aside className="ed-sidebar ed-sidebar-visible">
          {/* Profile Card */}
          <div className="ed-profile-card">
            <img 
              src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop" 
              alt={employee.name}
              className="ed-profile-photo-large"
            />
            
            {/* Personal Information in Sidebar */}
            <div className="ed-sidebar-section">
              <h4 className="ed-sidebar-section-title">Personal Information</h4>
              <div className="ed-sidebar-info">
                <div className="ed-sidebar-info-item">
                  <span className="ed-sidebar-icon">✉</span>
                  <span className="ed-sidebar-info-text">{detailData.email}</span>
                </div>
                <div className="ed-sidebar-info-item">
                  <span className="ed-sidebar-icon">📞</span>
                  <span className="ed-sidebar-info-text">{detailData.phone}</span>
                </div>
                <div className="ed-sidebar-info-item">
                  <span className="ed-sidebar-icon">📍</span>
                  <span className="ed-sidebar-info-text">{detailData.location}</span>
                </div>
                <div className="ed-sidebar-info-item">
                  <span className="ed-sidebar-icon">📅</span>
                  <span className="ed-sidebar-info-text">{detailData.experience}</span>
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="ed-sidebar-section">
              <h4 className="ed-sidebar-section-title">Skills</h4>
              <div className="ed-skills-sidebar">
                {detailData.skills.map((skill, idx) => (
                  <span key={idx} className="ed-skill-badge">{skill}</span>
                ))}
              </div>
            </div>

            {/* Projects in Sidebar */}
            <div className="ed-sidebar-section">
              <h4 className="ed-sidebar-section-title">Projects</h4>
              <div className="ed-sidebar-projects">
                {detailData.projects
                  .filter(p => p.status === 'In Progress')
                  .slice(0, 2)
                  .map((project, idx) => (
                    <div key={idx} className="ed-sidebar-project-item">
                      <span className="ed-project-icon">📁</span>
                      <span className="ed-sidebar-project-name">{project.name}</span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="ed-content">
          {/* Metrics Grid - Top Row */}
          <section className="ed-metrics-grid">
            {/* Performance Trends Chart */}
            <div className="ed-card ed-card-performance">
              <h3 className="ed-card-title">Performance Trends</h3>
              <svg className="ed-chart-performance ed-chart-interactive" viewBox="0 0 500 240" preserveAspectRatio="xMidYMid meet">
                <defs>
                  <linearGradient id="trendGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="rgba(59, 130, 246, 0.1)" />
                  </linearGradient>
                  <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#1e40af" />
                  </linearGradient>
                  <filter id="shadowGlow">
                    <feGaussianBlur in="SourceGraphic" stdDeviation="2"/>
                  </filter>
                </defs>

                {/* Grid Lines */}
                <line x1="40" y1="30" x2="40" y2="180" stroke="#e2e8f0" strokeWidth="1"/>
                <line x1="40" y1="180" x2="480" y2="180" stroke="#e2e8f0" strokeWidth="1"/>

                {/* Y-axis labels */}
                <text x="25" y="35" fontSize="10" fill="#64748b" textAnchor="end">100</text>
                <text x="25" y="85" fontSize="10" fill="#64748b" textAnchor="end">75</text>
                <text x="25" y="135" fontSize="10" fill="#64748b" textAnchor="end">50</text>
                <text x="25" y="185" fontSize="10" fill="#64748b" textAnchor="end">25</text>

                {/* Grid horizontal lines */}
                <line x1="40" y1="60" x2="480" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
                <line x1="40" y1="90" x2="480" y2="90" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
                <line x1="40" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>
                <line x1="40" y1="150" x2="480" y2="150" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="2,2" opacity="0.5"/>

                {/* Area fill under the curve */}
                <path className="ed-chart-area" d="M 50,125 Q 90,110 130,85 T 210,45 T 290,35 T 370,32 T 450,28 L 450,180 L 50,180 Z" 
                      fill="url(#trendGradient)" opacity="0.6"/>

                {/* Main line chart */}
                <polyline className="ed-chart-line" points="50,125 90,110 130,85 170,65 210,45 250,40 290,35 330,32 370,32 410,30 450,28" 
                          fill="none" stroke="url(#lineGradient)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>

                {/* Interactive Data Points with Tooltips */}
                <g className="ed-data-points">
                  {/* Jan - 40% */}
                  <g className="ed-data-point-group ed-data-point-group-1">
                    <circle cx="50" cy="125" r="10" fill="transparent" style={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                    <circle cx="50" cy="125" r="3.5" className="ed-data-point" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                    <circle cx="50" cy="125" r="6" className="ed-data-point-ring" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0"/>
                    <text x="50" y="105" className="ed-data-tooltip" fontSize="12" fontWeight="700" fill="#1e40af" textAnchor="middle" opacity="0">40%</text>
                  </g>
                  
                  {/* Feb - 48% */}
                  <g className="ed-data-point-group ed-data-point-group-2">
                    <circle cx="90" cy="110" r="10" fill="transparent" style={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                    <circle cx="90" cy="110" r="3.5" className="ed-data-point" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                    <circle cx="90" cy="110" r="6" className="ed-data-point-ring" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0"/>
                    <text x="90" y="90" className="ed-data-tooltip" fontSize="12" fontWeight="700" fill="#1e40af" textAnchor="middle" opacity="0">48%</text>
                  </g>
                  
                  {/* Mar - 62% */}
                  <g className="ed-data-point-group ed-data-point-group-3">
                    <circle cx="130" cy="85" r="10" fill="transparent" style={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                    <circle cx="130" cy="85" r="3.5" className="ed-data-point" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                    <circle cx="130" cy="85" r="6" className="ed-data-point-ring" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0"/>
                    <text x="130" y="65" className="ed-data-tooltip" fontSize="12" fontWeight="700" fill="#1e40af" textAnchor="middle" opacity="0">62%</text>
                  </g>
                  
                  {/* Apr - 74% */}
                  <g className="ed-data-point-group ed-data-point-group-4">
                    <circle cx="170" cy="65" r="10" fill="transparent" style={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                    <circle cx="170" cy="65" r="3.5" className="ed-data-point" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                    <circle cx="170" cy="65" r="6" className="ed-data-point-ring" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0"/>
                    <text x="170" y="45" className="ed-data-tooltip" fontSize="12" fontWeight="700" fill="#1e40af" textAnchor="middle" opacity="0">74%</text>
                  </g>
                  
                  {/* May - 83% */}
                  <g className="ed-data-point-group ed-data-point-group-5">
                    <circle cx="210" cy="45" r="10" fill="transparent" style={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                    <circle cx="210" cy="45" r="3.5" className="ed-data-point" fill="#3b82f6" stroke="white" strokeWidth="2"/>
                    <circle cx="210" cy="45" r="6" className="ed-data-point-ring" fill="none" stroke="#3b82f6" strokeWidth="1.5" opacity="0"/>
                    <text x="210" y="25" className="ed-data-tooltip" fontSize="12" fontWeight="700" fill="#1e40af" textAnchor="middle" opacity="0">83%</text>
                  </g>
                  
                  {/* Jun - 88% */}
                  <g className="ed-data-point-group ed-data-point-group-6">
                    <circle cx="250" cy="40" r="10" fill="transparent" style={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                    <circle cx="250" cy="40" r="3.5" className="ed-data-point" fill="#1e40af" stroke="white" strokeWidth="2"/>
                    <circle cx="250" cy="40" r="6" className="ed-data-point-ring" fill="none" stroke="#1e40af" strokeWidth="1.5" opacity="0"/>
                    <text x="250" y="20" className="ed-data-tooltip" fontSize="12" fontWeight="700" fill="#1e40af" textAnchor="middle" opacity="0">88%</text>
                  </g>
                  
                  {/* Jul - 92% */}
                  <g className="ed-data-point-group ed-data-point-group-7">
                    <circle cx="290" cy="35" r="10" fill="transparent" style={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                    <circle cx="290" cy="35" r="3.5" className="ed-data-point" fill="#1e40af" stroke="white" strokeWidth="2"/>
                    <circle cx="290" cy="35" r="6" className="ed-data-point-ring" fill="none" stroke="#1e40af" strokeWidth="1.5" opacity="0"/>
                    <text x="290" y="15" className="ed-data-tooltip" fontSize="12" fontWeight="700" fill="#1e40af" textAnchor="middle" opacity="0">92%</text>
                  </g>
                  
                  {/* Aug - 94% */}
                  <g className="ed-data-point-group ed-data-point-group-8">
                    <circle cx="330" cy="32" r="10" fill="transparent" style={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                    <circle cx="330" cy="32" r="3.5" className="ed-data-point" fill="#1e40af" stroke="white" strokeWidth="2"/>
                    <circle cx="330" cy="32" r="6" className="ed-data-point-ring" fill="none" stroke="#1e40af" strokeWidth="1.5" opacity="0"/>
                    <text x="330" y="12" className="ed-data-tooltip" fontSize="12" fontWeight="700" fill="#1e40af" textAnchor="middle" opacity="0">94%</text>
                  </g>
                  
                  {/* Sep - 94% */}
                  <g className="ed-data-point-group ed-data-point-group-9">
                    <circle cx="370" cy="32" r="10" fill="transparent" style={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                    <circle cx="370" cy="32" r="3.5" className="ed-data-point" fill="#1e40af" stroke="white" strokeWidth="2"/>
                    <circle cx="370" cy="32" r="6" className="ed-data-point-ring" fill="none" stroke="#1e40af" strokeWidth="1.5" opacity="0"/>
                    <text x="370" y="12" className="ed-data-tooltip" fontSize="12" fontWeight="700" fill="#1e40af" textAnchor="middle" opacity="0">94%</text>
                  </g>
                  
                  {/* Oct - 95% */}
                  <g className="ed-data-point-group ed-data-point-group-10">
                    <circle cx="410" cy="30" r="10" fill="transparent" style={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                    <circle cx="410" cy="30" r="3.5" className="ed-data-point" fill="#1e40af" stroke="white" strokeWidth="2"/>
                    <circle cx="410" cy="30" r="6" className="ed-data-point-ring" fill="none" stroke="#1e40af" strokeWidth="1.5" opacity="0"/>
                    <text x="410" y="10" className="ed-data-tooltip" fontSize="12" fontWeight="700" fill="#1e40af" textAnchor="middle" opacity="0">95%</text>
                  </g>
                  
                  {/* Nov - 97% */}
                  <g className="ed-data-point-group ed-data-point-group-11">
                    <circle cx="450" cy="28" r="10" fill="transparent" style={{pointerEvents: 'auto', cursor: 'pointer'}}/>
                    <circle cx="450" cy="28" r="3.5" className="ed-data-point" fill="#1e40af" stroke="white" strokeWidth="2"/>
                    <circle cx="450" cy="28" r="6" className="ed-data-point-ring" fill="none" stroke="#1e40af" strokeWidth="1.5" opacity="0"/>
                    <text x="450" y="8" className="ed-data-tooltip" fontSize="12" fontWeight="700" fill="#1e40af" textAnchor="middle" opacity="0">97%</text>
                  </g>

                  {/* Vertical guide lines - appear on hover */}
                  <line x1="50" y1="125" x2="50" y2="180" className="ed-data-line-vertical ed-data-line-1" stroke="#3b82f6" strokeWidth="2" opacity="0" strokeDasharray="4,4"/>
                  <line x1="90" y1="110" x2="90" y2="180" className="ed-data-line-vertical ed-data-line-2" stroke="#3b82f6" strokeWidth="2" opacity="0" strokeDasharray="4,4"/>
                  <line x1="130" y1="85" x2="130" y2="180" className="ed-data-line-vertical ed-data-line-3" stroke="#3b82f6" strokeWidth="2" opacity="0" strokeDasharray="4,4"/>
                  <line x1="170" y1="65" x2="170" y2="180" className="ed-data-line-vertical ed-data-line-4" stroke="#3b82f6" strokeWidth="2" opacity="0" strokeDasharray="4,4"/>
                  <line x1="210" y1="45" x2="210" y2="180" className="ed-data-line-vertical ed-data-line-5" stroke="#3b82f6" strokeWidth="2" opacity="0" strokeDasharray="4,4"/>
                  <line x1="250" y1="40" x2="250" y2="180" className="ed-data-line-vertical ed-data-line-6" stroke="#1e40af" strokeWidth="2" opacity="0" strokeDasharray="4,4"/>
                  <line x1="290" y1="35" x2="290" y2="180" className="ed-data-line-vertical ed-data-line-7" stroke="#1e40af" strokeWidth="2" opacity="0" strokeDasharray="4,4"/>
                  <line x1="330" y1="32" x2="330" y2="180" className="ed-data-line-vertical ed-data-line-8" stroke="#1e40af" strokeWidth="2" opacity="0" strokeDasharray="4,4"/>
                  <line x1="370" y1="32" x2="370" y2="180" className="ed-data-line-vertical ed-data-line-9" stroke="#1e40af" strokeWidth="2" opacity="0" strokeDasharray="4,4"/>
                  <line x1="410" y1="30" x2="410" y2="180" className="ed-data-line-vertical ed-data-line-10" stroke="#1e40af" strokeWidth="2" opacity="0" strokeDasharray="4,4"/>
                  <line x1="450" y1="28" x2="450" y2="180" className="ed-data-line-vertical ed-data-line-11" stroke="#1e40af" strokeWidth="2" opacity="0" strokeDasharray="4,4"/>
                </g>

                {/* X-axis Month labels */}
                <text x="50" y="200" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="500">Jan</text>
                <text x="90" y="200" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="500">Feb</text>
                <text x="130" y="200" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="500">Mar</text>
                <text x="170" y="200" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="500">Apr</text>
                <text x="210" y="200" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="500">May</text>
                <text x="250" y="200" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="500">Jun</text>
                <text x="290" y="200" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="500">Jul</text>
                <text x="330" y="200" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="500">Aug</text>
                <text x="370" y="200" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="500">Sep</text>
                <text x="410" y="200" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="500">Oct</text>
                <text x="450" y="200" fontSize="11" fill="#64748b" textAnchor="middle" fontWeight="500">Nov</text>
              </svg>
            </div>

            {/* Attendance Rate */}
            <div className="ed-card ed-card-metrics">
              <h3 className="ed-card-title ed-card-title-sm">Attendance Rate</h3>
              <div className="ed-metrics-chart">
                <svg className="ed-metrics-viz" viewBox="0 0 240 220" preserveAspectRatio="xMidYMid meet">
                  <defs>
                    <linearGradient id="attendanceGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#1e40af" />
                    </linearGradient>
                    <filter id="glow">
                      <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                      <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                      </feMerge>
                    </filter>
                  </defs>
                  <g>
                    <circle cx="120" cy="85" r="65" fill="none" stroke="#dbeafe" strokeWidth="8"/>
                    <circle cx="120" cy="85" r="65" fill="none" stroke="url(#attendanceGrad)" strokeWidth="8" 
                            strokeDasharray="396.16 408.41" strokeLinecap="round" filter="url(#glow)" transform="rotate(-90 120 85)"/>
                    <text x="120" y="95" fontSize="42" fontWeight="900" fill="#1e40af" textAnchor="middle">97%</text>
                  </g>
                </svg>
              </div>
            </div>
          </section>

          {/* Projects Section */}
          <section className="ed-card ed-projects-section">
            <div className="ed-projects-section-header">
              <div>
                <h3 className="ed-card-title">Projects</h3>
                <p className="ed-projects-section-meta">{detailData.projects.length} total • {detailData.projects.filter(p => p.status === 'In Progress').length} active</p>
              </div>
            </div>

            <div className="ed-projects-grid-enhanced">
              {detailData.projects.slice(0, 3).map((project, idx) => {
                // First project should be active, others completed
                const effectiveStatus = idx === 0 ? 'In Progress' : 'Completed';
                const isCompleted = effectiveStatus === 'Completed';
                const isInProgress = effectiveStatus === 'In Progress';
                
                return (
                  <article key={idx} className={`ed-project-card-enhanced ${isCompleted ? 'completed' : 'active'}`}>
                    <div className="ed-project-card-header-enhanced">
                      <div className="ed-project-card-title-section">
                        <h4 className="ed-project-card-name">{project.name}</h4>
                        <span className={`ed-project-status-badge ${isCompleted ? 'completed' : 'in-progress'}`}>
                          {isCompleted ? '✓ Completed' : '🔄 In Progress'}
                        </span>
                      </div>
                    </div>

                    <div className="ed-project-card-body">
                      <div className="ed-project-tech-section">
                        <span className="ed-project-tech-label">Tech Stack</span>
                        <div className="ed-project-tech-pills">
                          {project.techStack.map((tech, techIdx) => (
                            <span key={techIdx} className="ed-project-tech-pill">{tech}</span>
                          ))}
                        </div>
                      </div>

                      <div className="ed-project-links-section">
                        {project.links?.demo && (
                          <a href="#" className="ed-project-link-btn demo" title="Demo">
                            <span>Demo</span>
                          </a>
                        )}
                        {!project.links?.github && !project.links?.demo && (
                          <span className="ed-project-no-links">No links available</span>
                        )}
                      </div>
                    </div>

                    <div className={`ed-project-card-footer ${isCompleted ? 'completed' : ''}`}>
                      <div className="ed-project-progress-bar">
                        <div className="ed-project-progress-fill" style={{ width: isCompleted ? '100%' : '65%' }}></div>
                      </div>
                      <span className="ed-project-progress-text">{isCompleted ? '100% Complete' : '65% Complete'}</span>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Work Experience Section */}
          <section className="ed-card ed-projects-section">
            <div className="ed-projects-section-header">
              <div>
                <h3 className="ed-card-title">Work Experience</h3>
                <p className="ed-projects-section-meta">{detailData.workExperience.length} positions • {detailData.workExperience.filter(w => w.status === 'Current').length} current</p>
              </div>
            </div>

            <div className="ed-projects-grid-enhanced">
              {detailData.workExperience.slice(0, 3).map((experience, idx) => {
                const isCurrent = experience.status === 'Current';
                const isCompleted = experience.status === 'Completed';
                
                return (
                  <article key={idx} className={`ed-project-card-enhanced ${isCompleted ? 'completed' : 'active'}`}>
                    <div className="ed-project-card-header-enhanced">
                      <div className="ed-project-card-title-section">
                        <h4 className="ed-project-card-name">{experience.title}</h4>
                        <span className={`ed-project-status-badge ${isCompleted ? 'completed' : 'in-progress'}`}>
                          {isCurrent ? '💼 Current' : '✓ Past'}
                        </span>
                      </div>
                    </div>

                    <div className="ed-project-card-body">
                      <div className="ed-project-tech-section">
                        <span className="ed-project-tech-label">Company</span>
                        <p className="ed-experience-company">{experience.company}</p>
                      </div>

                      <div className="ed-project-tech-section">
                        <span className="ed-project-tech-label">Duration</span>
                        <p className="ed-experience-duration">{experience.duration}</p>
                      </div>

                      <div className="ed-project-tech-section">
                        <span className="ed-project-tech-label">Description</span>
                        <p className="ed-experience-description">{experience.description}</p>
                      </div>
                    </div>

                    <div className={`ed-project-card-footer ${isCompleted ? 'completed' : ''}`}>
                      <div className="ed-experience-progress">
                        <span className="ed-experience-progress-text">{isCurrent ? 'Active Position' : 'Past Experience'}</span>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </section>

          {/* Education Section */}
          <section className="ed-card">
            <h3 className="ed-card-title">Education</h3>
            <div className="ed-education-list">
              {detailData.education.map((edu, idx) => (
                <div key={idx} className="ed-education-item">
                  <div className="ed-edu-icon">🎓</div>
                  <div className="ed-edu-content">
                    <h4 className="ed-edu-degree">{edu.degree}</h4>
                    <p className="ed-edu-institution">{edu.institution}</p>
                    <p className="ed-edu-meta"><span className="ed-year">{edu.year}</span></p>
                    {edu.gpa && <p className="ed-gpa">GPA: {edu.gpa}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Achievements Section */}
          <section className="ed-card">
            <h3 className="ed-card-title">Achievements</h3>
            <div className="ed-achievements-list">
              {detailData.achievements.map((achievement, idx) => (
                <div key={idx} className="ed-achievement-item">
                  <span className="ed-achievement-icon">🏆</span>
                  <div className="ed-achievement-content">
                    <h4 className="ed-achievement-title">{achievement.title}</h4>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default EmployeeDetail;
