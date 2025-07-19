import React from 'react'

const Footer = () => {
  return (
     <footer className="bg-slate-900 text-gray-200 py-10 px-5 text-center">
      <div>
        <h3 className="text-2xl mb-2.5">DESOC</h3>
        <p>Design + Engineering Society of Code</p>
        
        <p>Empowering tech through creativity and code.</p>
      </div>

      <div className="flex justify-center gap-20 flex-wrap mt-8">
        <div>
          <h4 className="mb-2.5 text-lg text-red-500">Quick Links</h4>
          <ul className="list-none p-0">
            <li className="my-1.5"><a href="#events" className="text-gray-300 no-underline hover:text-white hover:underline">Events</a></li>
            <li className="my-1.5"><a href="#projects" className="text-gray-300 no-underline hover:text-white hover:underline">Projects</a></li>
            <li className="my-1.5"><a href="#team" className="text-gray-300 no-underline hover:text-white hover:underline">Committee</a></li>
            <li className="my-1.5"><a href="#contact" className="text-gray-300 no-underline hover:text-white hover:underline">Contact</a></li>
          </ul>
        </div>

        <div>
          <h4 className="mb-2.5 text-lg text-red-500">Connect with Us</h4>
          <ul className="list-none p-0">
            <li className="my-1.5"><a href="https://instagram.com/desoc_kkw" target="_blank" rel="noreferrer" className="text-gray-300 no-underline hover:text-white hover:underline">Instagram</a></li>
            <li className="my-1.5"><a href="mailto:desoc.kkw@gmail.com" className="text-gray-300 no-underline hover:text-white hover:underline">Email</a></li>
            <li className="my-1.5"><a href="#" className="text-gray-300 no-underline hover:text-white hover:underline">GitHub</a></li>
          </ul>
        </div>
      </div>

      <div className="mt-10 text-sm text-gray-500">
        <p>&copy; {new Date().getFullYear()} DESOC | KKWIEER</p>
        <p>Made with 💻 by Team DESOC</p>
      </div>
    </footer>
  )
}

export default Footer