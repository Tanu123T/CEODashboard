import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import Navbar from './components/navbar/navbar'
import Header from './components/Header/Header'
import Home from './components/Home/Home'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="app-container">
      <Header />
      <div className="body-wrapper">
        <Navbar />
        <div className="main-content">
          <Home />
        </div>
      </div>
    </div>
  )
}

export default App
