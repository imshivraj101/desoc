<<<<<<< HEAD
import Hero from './components/Hero'
import Footer from './components/Footer'
import Navbar from './components/Navbar'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
// import { AuthProvider } from "./context/AuthContext"
import './index.css' 

function App() {
  return (
    <Router>
        <Navbar />
        <Routes>
            <Route path="/" element={<Hero />} />
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
=======
import React from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Footer from './components/Footer'

const App = () => {
  return (
    <div>



      <Navbar/>
      <Hero/>
      <Footer/>


    </div>
>>>>>>> 00ffaf7f7e6fd6e1db14eab10b430e26a11e2658
  )
}

export default App