import React from 'react'
import './Navbar.css'
import desoc from '../assets/desoc.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <div>

      <div className="NavContainer">

        <div className="NavLogo flex items-center fit m-auto ">
          <img src={desoc} alt="Logo" className='' />  
          </div>

        <div className="NavList">
          
          <ul>
            <li><Link to="/">Home</Link></li> 
            <li><Link to="/about">Events</Link></li>
            <li><Link to="/services">Committee</Link></li>
            <li><Link to="/contact">Contact</Link></li>
        </ul>

          
          </div>  

      </div>


    </div>
  )
}

export default Navbar