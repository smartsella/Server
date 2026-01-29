import React from 'react'
import { Link } from 'react-router-dom'
import { FaUser, FaTachometerAlt, FaHome, FaGraduationCap, FaUtensils, FaCar, FaBook, FaShieldAlt } from 'react-icons/fa'

const User = () => {
  const features = [
    { icon: <FaHome />, title: 'Find Accommodation', description: 'Browse verified PGs, hostels, and flats near your college or workplace' },
    { icon: <FaUtensils />, title: 'Food & Services', description: 'Order food, laundry, water delivery, and daily essentials with ease' },
    { icon: <FaGraduationCap />, title: 'Education Support', description: 'Access tutors, career coaching, internships, and skill development courses' },
    { icon: <FaCar />, title: 'Vehicle Rentals', description: 'Rent bikes, scooters, and cars for your daily commute or weekend trips' }
  ]

  const benefits = [
    { icon: <FaShieldAlt />, title: 'Verified Services', description: 'All service providers are verified for your safety and peace of mind' },
    { icon: <FaTachometerAlt />, title: 'Easy Management', description: 'Manage all your bookings, payments, and services from one dashboard' },
    { icon: <FaBook />, title: 'Smart Budget Tools', description: 'Track expenses and get AI-powered budget recommendations' },
    { icon: <FaUser />, title: 'Personalized Experience', description: 'Get recommendations based on your preferences and needs' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-12 px-4 sm:px-6 lg:px-8 z-10">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex justify-center mb-4">
            <FaUser className="text-5xl text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Jeevigo</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            Your one-stop solution for accommodation, food, education, and daily services. Make your life easier with Jeevigo.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/user/dashboard" className="px-7 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
              <FaTachometerAlt />
              Go to Dashboard
            </Link>
            <Link to="/services" className="px-7 py-3 bg-white text-blue-600 rounded-full text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-blue-600">
              Explore Services
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative py-12 bg-white/50 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">What We Offer</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-blue-500">
                <div className="text-3xl text-blue-600 mb-3">{feature.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why Choose Jeevigo?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-purple-600 hover:scale-105">
                <div className="text-3xl text-purple-600 mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Access Section */}
      <section className="relative py-12 bg-white/50 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Quick Access</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              { title: 'My Bookings', link: '/dashboard', color: 'blue' },
              { title: 'Find Accommodation', link: '/services', color: 'purple' },
              { title: 'Order Food', link: '/services', color: 'indigo' },
              { title: 'Book Tutor', link: '/services', color: 'cyan' },
              { title: 'Rent Vehicle', link: '/services', color: 'pink' },
              { title: 'AI Budget Planner', link: '/dashboard', color: 'violet' }
            ].map((item, index) => (
              <Link
                key={index}
                to={item.link}
                className={`bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-${item.color}-600 hover:scale-105 block`}
              >
                <h3 className="text-base font-bold text-gray-900">{item.title}</h3>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white z-10 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">Ready to Simplify Your Life?</h2>
          <p className="text-lg mb-6 opacity-90">
            Access your personalized dashboard and start managing everything in one place
          </p>
          <Link to="/user/dashboard" className="px-7 py-3 bg-white text-blue-600 rounded-full text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-flex items-center gap-2">
            <FaTachometerAlt />
            Access Dashboard
          </Link>
        </div>
      </section>
    </div>
  )
}

export default User