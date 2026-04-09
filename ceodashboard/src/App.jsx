import { BrowserRouter as Router } from 'react-router-dom'
import { useState } from 'react'
import { useLocation } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header/Header'
import AnimatedRoutes from './components/AnimatedRoutes'
import PageHeader from './components/layout/PageHeader'

const getPageMeta = (pathname) => {
  if (pathname.startsWith('/employees')) {
    const section = pathname.split('/')[2] || 'overview'
    const sectionTitleMap = {
      availability: 'WorkForce Health',
      'holiday-calendar': 'Work Calender',
      'role-coverage': 'Employee Hub',
      'hiring-recruitment': 'Hiring and Recruitment',
    }

    return {
      title: 'People Health',
      subtitle: `HRMS and open project insights - ${sectionTitleMap[section] || 'WorkForce Health'}`,
    }
  }

  if (pathname.startsWith('/overview')) {
    return {
      title: 'Overview',
      subtitle: 'Executive summary across workforce, projects, and operational signals',
    }
  }

  if (pathname.startsWith('/projects')) {
    return { title: 'Projects', subtitle: 'Portfolio status, execution pace, and delivery health' }
  }

  if (pathname.startsWith('/sprints')) {
    return { title: 'Attendance', subtitle: 'Sprint-level planning cadence and execution tracking' }
  }

  if (pathname.startsWith('/settings')) {
    return { title: 'Settings', subtitle: 'Workspace preferences and account controls' }
  }

  return {
    title: 'Overview',
    subtitle: 'Executive summary across workforce, projects, and operational signals',
  }
}

function AppShell({ isSidebarOpen, onToggleSidebar, onCloseSidebar }) {
  const location = useLocation()
  const pageMeta = getPageMeta(location.pathname)
  const now = new Date()
  const lastUpdated = now.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })

  return (
    <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <Header onToggleSidebar={onToggleSidebar} />
      <div className="body-wrapper">
        <Navbar isOpen={isSidebarOpen} onCloseSidebar={onCloseSidebar} />
        <div className="sidebar-overlay" onClick={onCloseSidebar} />
        <main className="main-content">
          <div className="main-content-view">
            <AnimatedRoutes />
          </div>
        </main>
      </div>
    </div>
  )
}

function App() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)

  const handleToggleSidebar = () => {
    setIsSidebarOpen((prev) => !prev)
  }

  const handleCloseSidebar = () => {
    setIsSidebarOpen(false)
  }

  return (
    <Router>
      <AppShell
        isSidebarOpen={isSidebarOpen}
        onToggleSidebar={handleToggleSidebar}
        onCloseSidebar={handleCloseSidebar}
      />
    </Router>
  )
}

export default App
