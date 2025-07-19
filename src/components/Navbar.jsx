import React, { useState } from 'react'
import desoc from '../assets/desoc.png'
import { Link } from 'react-router-dom'

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  return (
    <div>
      <div className="flex justify-between items-center px-4 md:px-8 py-4 bg-slate-900 text-white z-50 w-full fixed">
        <div className="flex items-center">
          <img src={desoc} alt="Logo" className="h-16 md:h-25 -my-8 md:-my-17 z-10" />  
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:block">
          <ul className="flex gap-8 md:gap-24 list-none text-lg md:text-2xl pr-5">
            <li><Link to="/" className="text-white no-underline font-medium transition-colors duration-300 hover:text-sky-400">Home</Link></li> 
            <li><Link to="/about" className="text-white no-underline font-medium transition-colors duration-300 hover:text-sky-400">Events</Link></li>
            <li><Link to="/services" className="text-white no-underline font-medium transition-colors duration-300 hover:text-sky-400">Committee</Link></li>
            <li><Link to="/contact" className="text-white no-underline font-medium transition-colors duration-300 hover:text-sky-400">Contact</Link></li>
          </ul>
        </div>

        {/* Mobile Hamburger Menu */}
        <div className="md:hidden">
          <button
            onClick={toggleMobileMenu}
            className="text-white focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'}`}>
        {/* Backdrop */}
        <div 
          className="fixed inset-0 bg-black bg-opacity-50"
          onClick={closeMobileMenu}
        ></div>
        
        {/* Sidebar */}
        <div className={`fixed right-0 top-0 h-full w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`}>
          <div className="flex flex-col h-full">
            {/* Close button */}
            <div className="flex justify-end p-4">
              <button
                onClick={closeMobileMenu}
                className="text-white focus:outline-none"
                aria-label="Close mobile menu"
              >
                <svg
                  className="w-6 h-6"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex-1 px-6 py-8">
              <ul className="space-y-6">
                <li>
                  <Link 
                    to="/" 
                    className="block text-white text-xl font-medium transition-colors duration-300 hover:text-sky-400 py-2"
                    onClick={closeMobileMenu}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/about" 
                    className="block text-white text-xl font-medium transition-colors duration-300 hover:text-sky-400 py-2"
                    onClick={closeMobileMenu}
                  >
                    Events
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/services" 
                    className="block text-white text-xl font-medium transition-colors duration-300 hover:text-sky-400 py-2"
                    onClick={closeMobileMenu}
                  >
                    Committee
                  </Link>
                </li>
                <li>
                  <Link 
                    to="/contact" 
                    className="block text-white text-xl font-medium transition-colors duration-300 hover:text-sky-400 py-2"
                    onClick={closeMobileMenu}
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </nav>

            {/* Footer in sidebar */}
            <div className="p-6 border-t border-gray-700">
              <p className="text-gray-400 text-sm">DESOC</p>
              <p className="text-gray-500 text-xs mt-1">Design + Engineering Society</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar