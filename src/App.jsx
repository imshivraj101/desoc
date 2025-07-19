import Hero from "./components/Hero"
import Footer from "./components/Footer"
import Navbar from "./components/Navbar"
import Contact from "./components/Contact"
import Register from "./components/Register"
import AdminLogin from "./components/admin/AdminLogin"
import AdminDashboard from "./components/admin/AdminDashboard"

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import "./index.css"

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/register" element={<Register />} />
        <Route path="/admin" element={<AdminLogin />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
      </Routes>
      <Footer />
    </Router>
  )
}

export default App
