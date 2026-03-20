import { BrowserRouter as Router } from 'react-router-dom'
import './App.css'
import Navbar from './components/Navbar/Navbar'
import Header from './components/Header/Header'
import AnimatedRoutes from './components/AnimatedRoutes'

function App() {
  return (
    <Router>
      <div className="app-container">
        <Header />
        <div className="body-wrapper">
          <Navbar />
          <div className="main-content">
            <AnimatedRoutes />
          </div>
        </div>
      </div>
    </Router>
  )
}

export default App
