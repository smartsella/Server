import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaExclamationTriangle } from 'react-icons/fa'

const Error = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="text-center relative z-10 max-w-xl mx-auto">
        {/* 404 Text in 3D Style */}
        <div className="mb-6 animate-fade-in-up">
          <h1 className="text-[120px] md:text-[140px] font-black text-white relative inline-block leading-none" style={{
            textShadow: `
              4px 4px 0px rgba(52, 211, 153, 0.9),
              8px 8px 0px rgba(52, 211, 153, 0.7),
              12px 12px 0px rgba(52, 211, 153, 0.5),
              3px 3px 6px rgba(0, 0, 0, 0.2)
            `
          }}>
            404
          </h1>
        </div>

        {/* Error Message Box */}
        <div className="bg-white/90 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border-4 border-teal-400 animate-fade-in-up animation-delay-200">
          <div className="mb-5">
            <FaExclamationTriangle className="text-4xl text-orange-500 mx-auto mb-3" />
            <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
              Oops! Page Not Found
            </h2>
            <p className="text-sm text-gray-600 mb-1">
              The page you're looking for seems to have wandered off.
            </p>
            <p className="text-sm text-gray-500">
              It might have been moved, deleted, or perhaps it never existed.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap justify-center gap-3 mt-6">
            <Link 
              to="/" 
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              <FaHome />
              Go to Homepage
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="px-6 py-2.5 bg-white text-blue-600 rounded-full text-base font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 border-2 border-blue-600"
            >
              Go Back
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-3">You might want to check out:</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <Link to="/services" className="text-blue-600 hover:text-purple-600 font-semibold transition-colors hover:underline">
                Services
              </Link>
              <Link to="/about" className="text-blue-600 hover:text-purple-600 font-semibold transition-colors hover:underline">
                About Us
              </Link>
              <Link to="/contact" className="text-blue-600 hover:text-purple-600 font-semibold transition-colors hover:underline">
                Contact
              </Link>
              <Link to="/partner" className="text-blue-600 hover:text-purple-600 font-semibold transition-colors hover:underline">
                Become a Partner
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Error
