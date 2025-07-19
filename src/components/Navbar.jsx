import React from 'react';
import './Navbar.css';
import desoc from '../assets/desoc.png';

const Navbar = () => {
  return (
    <div>
      <div className="NavContainer">
        <div className="NavLogo">
          <img src={desoc} alt="Logo" />
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
  );
};

export default Navbar;
