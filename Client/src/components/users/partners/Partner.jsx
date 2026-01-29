import React from 'react'
import { Link } from 'react-router-dom'
import { FaUserTie, FaChartLine, FaHandshake, FaRocket, FaShieldAlt } from 'react-icons/fa'

const Partner = () => {
  const benefits = [
    { icon: <FaChartLine />, title: 'Grow Your Business', description: 'Reach thousands of potential customers actively looking for your services' },
    { icon: <FaShieldAlt />, title: 'Verified Platform', description: 'Join a trusted platform with verified users and secure transactions' },
    { icon: <FaHandshake />, title: 'Easy Management', description: 'Simple dashboard to manage bookings, payments, and customer interactions' },
    { icon: <FaRocket />, title: 'Zero Commission Start', description: 'Start with competitive commission rates and grow your revenue' }
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
            <FaUserTie className="text-5xl text-blue-600" />
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-3">
            Partner With <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Jeevigo</span>
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
            Join India's fastest-growing life ecosystem platform. Connect with thousands of students and professionals looking for quality services.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/partner-signup" className="px-7 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
              Become a Partner
            </Link>
            <Link to="/partner-signin" className="px-7 py-3 bg-white text-blue-600 rounded-full text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-blue-600">
              Partner Login
            </Link>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="relative py-12 bg-white/50 backdrop-blur-sm z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Why Partner With Us?</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 border-2 border-blue-500">
                <div className="text-3xl text-blue-600 mb-3">{benefit.icon}</div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">{benefit.title}</h3>
                <p className="text-sm text-gray-600">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Partner Categories */}
      <section className="relative py-12 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">Partner Categories</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[
              'PG/Hostel Owners',
              'Food Delivery Services',
              'Tutors & Educators',
              'Repair Services',
              'Vehicle Rentals',
              'Laundry Services'
            ].map((category, index) => (
              <div key={index} className="bg-white rounded-xl p-5 shadow-md hover:shadow-xl transition-all duration-300 border-l-4 border-blue-600 hover:scale-105">
                <h3 className="text-base font-bold text-gray-900">{category}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-12 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white z-10 mt-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-3">Ready to Grow Your Business?</h2>
          <p className="text-lg mb-6 opacity-90">
            Join thousands of partners already serving millions of customers
          </p>
          <Link to="/partner-signup" className="px-7 py-3 bg-white text-blue-600 rounded-full text-base font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 inline-block">
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default Partner
