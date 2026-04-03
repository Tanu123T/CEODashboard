import { BrowserRouter as Router } from 'react-router-dom'
import { useState } from 'react'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header/Header'
import AnimatedRoutes from './components/AnimatedRoutes'

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
      <div className={`app-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
        <Header onToggleSidebar={handleToggleSidebar} />
        <div className="body-wrapper">
          <Navbar isOpen={isSidebarOpen} onCloseSidebar={handleCloseSidebar} />
          <div className="sidebar-overlay" onClick={handleCloseSidebar} />
          <div className="main-content">
            <AnimatedRoutes />
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
