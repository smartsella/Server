import React from 'react'
import { Link } from 'react-router-dom'
import { FaHome, FaGraduationCap, FaMoneyBillWave, FaCheckCircle, FaLock, FaBolt, FaTag, FaBriefcase, FaRobot, FaBicycle, FaUtensils, FaBook } from 'react-icons/fa'

const Home = () => {
  const stats = [
    { value: '₹84K', label: 'Avg. Yearly Savings' },
    { value: '100%', label: 'Verified Services' },
    { value: '24/7', label: 'AI Support' }
  ]

  const mainFeatures = [
    { icon: <FaHome />, title: 'Find Your Perfect PG', description: 'Verified listings with zero brokerage fees and transparent pricing' },
    { icon: <FaGraduationCap />, title: 'Grow Your Career', description: 'Access internships, jobs, skill courses, and mentorship' },
    { icon: <FaMoneyBillWave />, title: 'Save Big Money', description: 'Save up to ₹84,000 annually with smart bundling and discounts' }
  ]

  const trustIndicators = [
    { icon: <FaCheckCircle />, title: '100% Verified', description: 'All providers thoroughly checked and certified' },
    { icon: <FaLock />, title: 'Secure Payments', description: 'Bank-grade security for all transactions' },
    { icon: <FaBolt />, title: 'Instant Support', description: '24/7 AI-powered assistance always ready' },
    { icon: <FaTag />, title: 'Best Prices', description: 'Save up to 40% with exclusive deals' }
  ]

  const bigStats = [
    { value: '35', unit: 'Cr+', label: 'Students in India' },
    { value: '₹84,000', label: 'Average Yearly Savings' },
    { value: '1.2', unit: 'Cr+', label: 'Move to New Cities Yearly' },
    { value: '₹80K', unit: 'Cr', label: 'PG Market Opportunity' }
  ]

  const services = [
    { icon: <FaHome />, title: 'PG/Hostel Finder', description: 'Find your perfect accommodation with verified listings, genuine reviews, transparent pricing, and zero brokerage fees. Our AI intelligently matches you with options based on your location, budget, lifestyle preferences, and safety requirements.' },
    { icon: <FaUtensils />, title: 'Daily Living Services', description: 'Access trusted partners for all your daily needs - nutritious food delivery, tiffin services, clean water supply, professional laundry and cleaning services, and reliable repair services for mobile, laptop, cycle, electrical, and plumbing needs.' },
    { icon: <FaBook />, title: 'Learning & Growth', description: 'Exchange, rent, or buy books at unbeatable prices. Connect with expert tutors for doubt-solving, enroll in affordable skill development courses, and get personalized career coaching to accelerate your professional journey and achieve your goals.' },
    { icon: <FaBriefcase />, title: 'Internships & Jobs', description: 'Discover verified internship and job opportunities perfectly tailored to your profile and aspirations. Connect directly with top recruiters, track your applications, prepare for interviews, and build a successful career with expert guidance and support.' },
    { icon: <FaRobot />, title: 'AI-Powered Intelligence', description: 'Experience the future with our 24/7 AI chatbot that learns your preferences, provides personalized recommendations for everything from PGs to courses, helps you plan and optimize your budget smartly, and keeps you safe with intelligent safety alerts.' },
    { icon: <FaBicycle />, title: 'Lifestyle & Community', description: 'Rent vehicles including cycles, bikes, and e-scooters for convenient city travel. Discover exciting city events and student meetups, connect with like-minded people, enjoy exclusive vouchers and partnerships, and build a supportive community around you.' }
  ]

  const whyChoose = [
    'All-in-one platform combining accommodation, services, education, and lifestyle',
    '100% verified service providers with strict quality checks and safety standards',
    'AI-powered personalization that learns and adapts to your unique needs',
    'Zero brokerage fees and transparent pricing that saves you thousands',
    'Strong community of students and professionals supporting each other',
    '24/7 support ensuring you\'re never alone in a new city'
  ]

  const benefits = [
    { title: '₹24K - ₹84K', description: 'Average yearly savings for students through our platform' },
    { title: 'Zero Fees', description: 'No brokerage charges on PG bookings - complete transparency' },
    { title: 'AI Smart', description: 'Intelligent recommendations that improve with every interaction' },
    { title: 'Community', description: 'Connect with thousands of students and professionals' }
  ]

  const testimonials = [
    { name: 'Priya Sharma', role: 'Engineering Student, Bangalore', rating: 5, text: 'Jeevigo made my move to Bangalore so much easier! Found a great PG without any brokerage fee, and their food delivery partners are amazing. Saved over ₹50,000 in my first year!' },
    { name: 'Rahul Mehta', role: 'MBA Student, Mumbai', rating: 5, text: 'The AI recommendations are incredible - helped me find the perfect accommodation and even suggested skill courses that got me my first internship. Jeevigo PRIME is worth every rupee!' },
    { name: 'Ananya Verma', role: 'Software Engineer, Pune', rating: 5, text: 'As a working professional new to the city, this platform has been a lifesaver. From laundry services to vehicle rentals, everything I need is just a click away. Highly recommended!' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-indigo-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-6000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 z-10">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight animate-fade-in-up">
                Your Complete Life <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Ecosystem</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-600 animate-fade-in-up animation-delay-200">
                Everything students and professionals need to thrive in a new city - from verified accommodation to career growth, all powered by AI.
              </p>

              <div className="grid grid-cols-3 gap-6 animate-fade-in-up animation-delay-400">
                {stats.map((stat, index) => (
                  <div key={index} className="text-center">
                    <div className="text-3xl lg:text-4xl font-bold text-gray-900">{stat.value}</div>
                    <div className="text-sm text-gray-600 mt-1">{stat.label}</div>
                  </div>
                ))}
              </div>

              <div className="flex flex-wrap gap-4 animate-fade-in-up animation-delay-600">
                <Link to="/services" className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300 border-2 border-blue-600">
                  Explore Services
                </Link>
                <Link to="/pricing" className="px-8 py-4 bg-blue-600 text-white rounded-full text-lg font-semibold hover:bg-blue-700 hover:shadow-xl hover:scale-105 transition-all duration-300">
                  View Pricing
                </Link>
              </div>
            </div>

            <div className="space-y-4 z-10 animate-fade-in-left">
              {mainFeatures.map((feature, index) => (
                <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300 border border-purple-100">
                  <div className="flex items-start gap-4">
                    <div className="text-4xl text-blue-600">{feature.icon}</div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{feature.title}</h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="relative py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustIndicators.map((item, index) => (
              <div key={index} className="text-center group hover:scale-105 transition-all duration-300">
                <div className="text-5xl text-blue-600 mb-4 inline-block group-hover:animate-bounce">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Big Stats Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-4 animate-fade-in-up">Making Life Easier for Millions</h2>
          <p className="text-xl mb-12 opacity-90">Join India's fastest-growing life ecosystem</p>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {bigStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-5xl font-bold mb-2">
                  {stat.value} {stat.unit && <span className="text-3xl">{stat.unit}</span>}
                </div>
                <div className="text-lg opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
              Everything You Need in <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">One Platform</span>
            </h2>
            <p className="text-xl text-gray-600">A complete ecosystem designed to simplify your life and accelerate your growth</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const borderStyles = [
                'border-2 border-blue-500',
                'border-2 border-purple-500',
                'border-2 border-indigo-500',
                'border-2 border-pink-500',
                'border-2 border-cyan-500',
                'border-2 border-violet-500'
              ];
              return (
                <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${borderStyles[index]}`}>
                  <div className="text-4xl text-blue-600 mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">{service.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{service.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="relative py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6">
                Why Choose <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Jeevigo?</span>
              </h2>
              <p className="text-lg text-gray-600 mb-8">
                We're not just another app - we're a complete life ecosystem built specifically for students and professionals navigating life in a new city. Here's what makes us different:
              </p>
              <div className="space-y-4">
                {whyChoose.map((item, index) => (
                  <div key={index} className="flex items-start gap-3 group">
                    <div className="text-green-500 mt-1 text-2xl group-hover:scale-125 transition-transform">✓</div>
                    <p className="text-gray-700">{item}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-2xl p-6 hover:shadow-lg transition-all duration-300 hover:scale-105">
                  <h3 className="text-2xl font-bold text-blue-600 mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">What Our Users Say</h2>
            <p className="text-xl text-gray-600">Real experiences from students and professionals using Jeevigo</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105">
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400 text-xl">★</span>
                  ))}
                </div>
                <p className="text-gray-600 italic mb-6">"{testimonial.text}"</p>
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {testimonial.name.charAt(0)}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-900">{testimonial.name}</h4>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Ready to Make Life Easy?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of students and professionals who are already living smarter, saving more, and thriving in their new cities
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/signup" className="px-8 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300">
              Get Started Free
            </Link>
            <Link to="/pricing" className="px-8 py-4 bg-transparent text-white border-2 border-white rounded-full text-lg font-semibold hover:bg-white hover:text-blue-600 hover:shadow-xl hover:scale-105 transition-all duration-300">
              Explore PRIME Benefits
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Home