import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import MainWebsite from './components/MainWebsite.jsx'
import AdminLogin from './components/AdminLogin.jsx'
import AdminDashboard from './components/AdminDashboard.jsx'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainWebsite />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
    </Router>
  )
}

export default App
