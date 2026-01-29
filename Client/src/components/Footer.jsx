import React from 'react'
import { NavLink } from 'react-router-dom'
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from 'react-icons/fa'


const Footer = () => {
  return (
    <footer className="relative bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white mt-auto overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Jeevigo Section */}
          <div>
            <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent mb-4">Jeevigo</h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              Life made easy, on the go.
            </p>
            <div className="flex gap-4">
              <a href="#" className="text-gray-400 hover:text-blue-400 text-2xl transition-all hover:scale-110"><FaFacebook /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-2xl transition-all hover:scale-110"><FaTwitter /></a>
              <a href="#" className="text-gray-400 hover:text-pink-400 text-2xl transition-all hover:scale-110"><FaInstagram /></a>
              <a href="#" className="text-gray-400 hover:text-blue-400 text-2xl transition-all hover:scale-110"><FaLinkedin /></a>
              <a href="#" className="text-gray-400 hover:text-red-400 text-2xl transition-all hover:scale-110"><FaYoutube /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li>
                <NavLink to="/" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/pricing" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  Pricing
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  About Us
                </NavLink>
              </li>
              <li>
                <NavLink to="/contact" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  Contact
                </NavLink>
              </li>
            </ul>
          </div>

          {/* For Users */}
          <div>
            <h3 className="text-xl font-bold mb-4">For Users</h3>
            <ul className="space-y-3">
              <li>
                <NavLink to="/findpg" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  Find PG/Hostel
                </NavLink>
              </li>
              <li>
                <NavLink to="/services" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  Browse Services
                </NavLink>
              </li>
              <li>
                <NavLink to="/prime" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  Jeevigo PRIME
                </NavLink>
              </li>
              <li>
                <NavLink to="/help-center" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  Help Center
                </NavLink>
              </li>
            </ul>
          </div>

          {/* For Providers */}
          <div>
            <h3 className="text-xl font-bold mb-4">For Providers</h3>
            <ul className="space-y-3">
              <li>
                <NavLink to="/partner-signin" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  Partner Login
                </NavLink>
              </li>
              <li>
                <NavLink to="/partner-signup" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  Become a Partner
                </NavLink>
              </li>
              <li>
                <NavLink to="/partner" className="text-gray-400 hover:text-white transition-colors hover:pl-2 inline-block duration-300">
                  Partner Services
                </NavLink>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter Section */}
        <div className="mt-16 pt-12 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div>
              <h3 className="text-2xl font-bold mb-2">Stay Updated</h3>
              <p className="text-gray-400">Subscribe to our newsletter for latest updates and offers</p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-blue-500 w-full md:w-80"
              />
              <button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Legal Section */}
        <div className="mt-12 pt-8 border-t border-gray-700">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex flex-wrap justify-center gap-6">
              <NavLink to="/privacy-policy" className="text-gray-400 hover:text-white transition-colors">
                Privacy Policy
              </NavLink>
              <NavLink to="/term-and-condition" className="text-gray-400 hover:text-white transition-colors">
                Terms & Conditions
              </NavLink>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center text-gray-500">
          <p>© {new Date().getFullYear()} Jeevigo. All rights reserved. Made with ❤️ for students and professionals.</p>
        </div>
      </div>
    </footer>


  )
}

export default Footer