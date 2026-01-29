
import React, { useState, useEffect } from 'react'
import { NavLink, useLocation, useNavigate } from 'react-router-dom'
import { FaBars, FaTimes } from 'react-icons/fa'
import { useUser } from '../context/userContext'

const Navbar = () => {
  const { user, logout } = useUser()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [profileMenuOpen, setProfileMenuOpen] = useState(false)
  const [imageError, setImageError] = useState(false)

  const location = useLocation()
  const nav = useNavigate()

  const shouldHideGetStarted = location.pathname.startsWith('/partner') || location.pathname === '/user'

  const handleLogout = () => {
    logout()
    setProfileMenuOpen(false)
    nav('/')
  }

  // Get user initial for fallback avatar
  const getUserInitial = () => {
    if (user && user.name) {
      return user.name.charAt(0).toUpperCase()
    }
    if (user && user.email) {
      return user.email.charAt(0).toUpperCase()
    }
    return 'U'
  }

  // Get dynamic background color based on name
  const getUserColor = (name) => {
    if (!name) return 'bg-purple-100 text-purple-600'
    const colors = [
      'bg-red-100 text-red-600', 'bg-orange-100 text-orange-600', 'bg-amber-100 text-amber-600',
      'bg-green-100 text-green-600', 'bg-emerald-100 text-emerald-600', 'bg-teal-100 text-teal-600',
      'bg-cyan-100 text-cyan-600', 'bg-blue-100 text-blue-600', 'bg-indigo-100 text-indigo-600',
      'bg-violet-100 text-violet-600', 'bg-purple-100 text-purple-600', 'bg-fuchsia-100 text-fuchsia-600',
      'bg-pink-100 text-pink-600', 'bg-rose-100 text-rose-600'
    ]
    let hash = 0
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash)
    }
    const index = Math.abs(hash) % colors.length
    return colors[index]
  }

  return (
    <nav className="bg-white/90 backdrop-blur-md shadow-lg border-b border-purple-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex items-center">
            <NavLink to="/" className="flex items-center gap-3 group">
              <img src="/Jeevigo.svg" alt="Jeevigo Logo" className="h-12 w-12 object-contain group-hover:scale-110 group-hover:rotate-6 transition-all duration-300" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent hidden lg:block">Jeevigo</span>
            </NavLink>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            <NavLink
              to="/"
              className={({ isActive }) => `px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 ${isActive ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              className={({ isActive }) => `px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 ${isActive ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              Services
            </NavLink>
            <NavLink
              to="/pricing"
              className={({ isActive }) => `px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 ${isActive ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              Pricing
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) => `px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 ${isActive ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) => `px-4 py-2 rounded-full text-base font-semibold transition-all duration-300 ${isActive ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              Contact
            </NavLink>
            {!shouldHideGetStarted && !user && (
              <NavLink
                to="/signin"
                className="ml-4 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
              >
                Get Started
              </NavLink>
            )}
            {user && (
              <div className="relative ml-4">
                <button
                  onClick={() => setProfileMenuOpen(!profileMenuOpen)}
                  className="focus:outline-none"
                >
                  {user.picture && !imageError ? (
                    <img
                      src={user.picture}
                      alt="profile"
                      onError={() => setImageError(true)}
                      className="w-10 h-10 rounded-full object-cover border-2 border-purple-100 shadow-md hover:border-blue-400 transition-all"
                    />
                  ) : (
                    <div className={`w-10 h-10 rounded-full ${getUserColor(user?.name)} flex items-center justify-center font-bold text-lg border-2 border-purple-100 shadow-md hover:border-blue-400 transition-all`}>
                      {getUserInitial()}
                    </div>
                  )}
                </button>

                {profileMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl py-2 border border-gray-100 animate-fade-in z-50">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800 truncate">{user.name}</p>
                      <p className="text-xs text-gray-500 truncate">{user.email}</p>
                    </div>
                    <NavLink
                      to="/user/dashboard"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-semibold"
                    >
                      Dashboard
                    </NavLink>
                    <NavLink
                      to="/user/profile"
                      onClick={() => setProfileMenuOpen(false)}
                      className="block px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 hover:text-blue-600 font-semibold"
                    >
                      Profile Setting
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 font-semibold"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-gray-700 hover:text-blue-600 transition-colors text-2xl"
          >
            {mobileMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden py-4 space-y-2 animate-fade-in">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-semibold transition-all ${isActive ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              Home
            </NavLink>
            <NavLink
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-semibold transition-all ${isActive ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              Services
            </NavLink>
            <NavLink
              to="/pricing"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-semibold transition-all ${isActive ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              Pricing
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-semibold transition-all ${isActive ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className={({ isActive }) => `block px-4 py-3 rounded-lg text-base font-semibold transition-all ${isActive ? 'text-blue-600 bg-gradient-to-r from-blue-50 to-purple-50' : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'}`}
            >
              Contact
            </NavLink>
            {!shouldHideGetStarted && !user && (
              <NavLink
                to="/signin"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg text-base font-semibold text-center hover:shadow-lg transition-all"
              >
                Get Started
              </NavLink>
            )}
            {user && (
              <div className="border-t border-gray-100 pt-2 mt-2">
                <div className="flex items-center px-4 py-3 mb-2">
                  {user.picture && !imageError ? (
                    <img src={user.picture} alt="profile" onError={() => setImageError(true)} className="w-10 h-10 rounded-full mr-3" />
                  ) : (
                    <div className={`w-10 h-10 rounded-full ${getUserColor(user?.name)} flex items-center justify-center font-bold text-lg mr-3`}>
                      {getUserInitial()}
                    </div>
                  )}
                  <div>
                    <p className="font-semibold text-gray-800">{user.name}</p>
                    <p className="text-xs text-gray-500">{user.email}</p>
                  </div>
                </div>
                <NavLink
                  to="/user/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Dashboard
                </NavLink>
                <NavLink
                  to="/user/profile"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-3 text-gray-700 hover:bg-gray-50 font-medium"
                >
                  Profile Setting
                </NavLink>
                <button
                  onClick={() => {
                    handleLogout()
                    setMobileMenuOpen(false)
                  }}
                  className="block w-full text-left px-4 py-3 text-red-600 hover:bg-red-50 font-medium"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar