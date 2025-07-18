import React from 'react'
import './Navbar.css'
import desoc from '../assets/desoc.png'

const Navbar = () => {
  return (
    <div>

      <div className="NavContainer">

<<<<<<< HEAD
        <div className="NavLogo flex items-center fit m-auto ">
          <img src={desoc} alt="Logo" className='' />  
=======
        <div className="NavLogo">
          <img src={desoc} alt="Logo" />  
>>>>>>> 00ffaf7f7e6fd6e1db14eab10b430e26a11e2658
          </div>

        <div className="NavList">
          
          <ul>
            <li><a href="/">Home</a></li> 
            <li><a href="/about">Events</a></li>
            <li><a href="/services">Committee</a></li>
            <li><a href="/contact">Contact</a></li>
        </ul>

          
          </div>  

      </div>


    </div>
  )
}

export default Navbar