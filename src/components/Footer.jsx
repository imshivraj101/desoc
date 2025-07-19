import React from 'react'
import './Footer.css';

const Footer = () => {
  return (
     <footer className="footer">
      <div className="footer-top">
        <h3>DESOC</h3>
        <p>Design + Engineering Society of Code</p>
        
        <p>Empowering tech through creativity and code.</p>
      </div>

      <div className="footer-links">
        <div>
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#events">Events</a></li>
            <li><a href="#projects">Projects</a></li>
            <li><a href="#team">Committee</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4>Connect with Us</h4>
          <ul>
            <li><a href="https://instagram.com/desoc_kkw" target="_blank" rel="noreferrer">Instagram</a></li>
            <li><a href="mailto:desoc.kkw@gmail.com">Email</a></li>
            <li><a href="#">GitHub</a></li>
          </ul>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} DESOC | KKWIEER</p>
        <p>Made with 💻 by Team DESOC</p>
      </div>
    </footer>


  )
}

export default Footer