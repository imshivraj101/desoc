"use client"

import { useState, useEffect } from "react"
import { useNavigate, Link, useLocation } from "react-router-dom"
import desoc from "../assets/desoc.png"

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen)
  const closeMobileMenu = () => setIsMobileMenuOpen(false)

  // ✅ Scroll to top when changing route
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }, [location.pathname])

  const handleSectionNavigate = (sectionId) => {
    closeMobileMenu()
    if (location.pathname !== "/") {
      navigate("/", { state: { scrollTo: sectionId } })
    } else {
      document.getElementById(sectionId)?.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center px-4 md:px-8 py-2 bg-slate-900 text-white z-50 w-full fixed">
        <Link to="/">
          <img src={desoc} alt="Logo" className="h-12 md:h-16 z-10" />
        </Link>

        <ul className="hidden md:flex gap-8 md:gap-14 list-none text-sm md:text-lg pr-3">
          <li><Link to="/" className="hover:text-sky-400">Home</Link></li>
          <li><button onClick={() => handleSectionNavigate("events")} className="hover:text-sky-400">Events</button></li>
          <li><button onClick={() => handleSectionNavigate("committee")} className="hover:text-sky-400">Committee</button></li>
          <li><Link to="/register" className="hover:text-sky-400">Register</Link></li>
          <li><Link to="/contact" className="hover:text-sky-400">Contact</Link></li>
        </ul>

        <div className="md:hidden">
          <button onClick={toggleMobileMenu} className="text-white focus:outline-none">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {isMobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* ✅ Mobile Sidebar */}
      <div className={`fixed inset-0 z-40 md:hidden ${isMobileMenuOpen ? "block" : "hidden"}`}>
        <div className="fixed inset-0 bg-black opacity-40" onClick={closeMobileMenu}></div>

        <div className="fixed top-[3.5rem] right-0 h-[calc(100%-3.5rem)] w-64 bg-slate-900 transform transition-transform duration-300 ease-in-out text-white">
          <div className="flex flex-col h-full">
           

            <nav className="flex-1 px-6 py-4 text-white">
              <ul className="space-y-5 text-base">
                <li><Link to="/" onClick={closeMobileMenu}>Home</Link></li>
                <li><button onClick={() => handleSectionNavigate("events")}>Events</button></li>
                <li><button onClick={() => handleSectionNavigate("committee")}>Committee</button></li>
                <li><Link to="/register" onClick={closeMobileMenu}>Register</Link></li>
                <li><Link to="/contact" onClick={closeMobileMenu}>Contact</Link></li>
              </ul>
            </nav>

            <div className="p-6 border-t border-gray-700 text-white">
              <p className="text-sm">DESOC</p>
              <p className="text-xs text-gray-400 mt-1">Design + Engineering Society</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
