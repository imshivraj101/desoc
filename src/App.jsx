import Hero from './components/Hero'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import Contact from './components/Contact';

import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { AuthProvider } from "./context/AuthContext"
import './index.css'

function App() {
  return (
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/contact" element={<Contact />} />
            {/* Add more routes as needed */} 
        </Routes>

        {/* </AuthProvider> */}
        {/* 1-2 csd
        1st round maths and array
        2nd round arrays high
        3rd round arrays and strings
        5th week dp */}
      <Footer/>
    </Router>
  )
}

export default App