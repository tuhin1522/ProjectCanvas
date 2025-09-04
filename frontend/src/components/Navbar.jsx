import { Link, useLocation } from 'react-router-dom'
import { useState } from 'react'

const Navbar = () => {
  const location = useLocation()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
    { name: 'Blog', path: '/blog' },
    { name: 'Upload', path: '/upload' },
    { name: 'Login', path: '/login' },
    { name: 'Signup', path: '/signup' },
  ]

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  return (
    // Use a solid background color instead of gradient/opacity
    <nav
      className="shadow-md fixed w-full z-50"
      style={{ backgroundColor: '#eef2ff' }} // Tailwind indigo-50
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link
              to="/"
              className="flex items-center space-x-2 text-2xl font-bold text-indigo-700 hover:text-blue-600 transition-colors duration-300"
            >
              <svg 
                className="h-8 w-8" 
                viewBox="0 0 24 24" 
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M4 6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18V6Z" 
                  stroke="currentColor" 
                  strokeWidth="2"
                  strokeLinecap="round" 
                />
                <path 
                  d="M9 2V6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <path 
                  d="M15 2V6" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <path 
                  d="M8 12H16" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
                <path 
                  d="M8 16H12" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round"
                />
              </svg>
              <span>ProjectCanvas</span>
            </Link>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden md:flex md:items-center md:space-x-1">
            {navItems.map((item) => {
              if (item.name === 'Signup') {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="px-3 py-2 mx-1"
                  >
                    <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-md hover:bg-indigo-700 transition-all">
                      {item.name}
                    </span>
                  </Link>
                );
              } else if (item.name === 'Login') {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className="px-3 py-2 mx-1"
                  >
                    <span className="border border-indigo-500 text-indigo-600 px-4 py-1.5 rounded-md hover:bg-indigo-50 transition-all">
                      {item.name}
                    </span>
                  </Link>
                );
              } else if (item.name === 'Upload') {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                      location.pathname === item.path
                        ? 'bg-green-100 text-green-800 shadow-sm'
                        : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              } else {
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`px-3 py-2 mx-1 rounded-md text-sm font-medium transition-all duration-200 ease-in-out ${
                      location.pathname === item.path
                        ? 'bg-indigo-100 text-indigo-800 shadow-sm'
                        : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                    }`}
                  >
                    {item.name}
                  </Link>
                );
              }
            })}
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center">
            <button 
              onClick={toggleMobileMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-indigo-600 hover:bg-indigo-100 focus:outline-none"
              aria-expanded="false"
            >
              <span className="sr-only">Open main menu</span>
              {!isMobileMenuOpen ? (
                <svg 
                  className="block h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                </svg>
              ) : (
                <svg 
                  className="block h-6 w-6" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor" 
                  aria-hidden="true"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div 
        className={`${isMobileMenuOpen ? 'block' : 'hidden'} md:hidden shadow-lg rounded-b-lg`}
        style={{ backgroundColor: '#eef2ff' }}
      >
        <div className="px-2 pt-2 pb-3 space-y-1">
          {navItems.map((item) => {
            if (item.name === 'Signup') {
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={toggleMobileMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium bg-indigo-600 text-white hover:bg-indigo-700 mb-1"
                >
                  {item.name}
                </Link>
              );
            } else if (item.name === 'Login') {
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={toggleMobileMenu}
                  className="block px-3 py-2 rounded-md text-base font-medium border border-indigo-500 text-indigo-600 hover:bg-indigo-50"
                >
                  {item.name}
                </Link>
              );
            } else if (item.name === 'Upload') {
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={toggleMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? 'bg-green-100 text-green-800'
                      : 'text-gray-700 hover:bg-green-50 hover:text-green-700'
                  }`}
                >
                  {item.name}
                </Link>
              );
            } else {
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  onClick={toggleMobileMenu}
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    location.pathname === item.path
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'text-gray-700 hover:bg-indigo-50 hover:text-indigo-700'
                  }`}
                >
                  {item.name}
                </Link>
              );
            }
          })}
        </div>
      </div>
    </nav>
  )
}

export default Navbar