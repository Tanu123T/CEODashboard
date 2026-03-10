import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header/Header'
import Home from './components/Home/Home'
import Project from './pages/project/project'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="body-wrapper">
          <Navbar />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/projects" element={<Project />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
