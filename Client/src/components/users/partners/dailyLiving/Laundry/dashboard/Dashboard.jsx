import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePartner } from '../../../../../../context/partnerContext'
import { FaCheckCircle, FaChevronDown, FaChevronUp, FaTruck, FaClipboardList, FaRupeeSign, FaUser } from 'react-icons/fa'

// ==========================================
// GUEST VIEW COMPONENT (Not Logged In)
// ==========================================
const GuestDashboard = ({ login }) => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { question: 'Who can become a Laundry Partner?', answer: 'Laundromats, dry cleaners, and ironing services looking to digitize their business.' },
    { question: 'Do I need delivery staff?', answer: 'Not necessarily. You can use our delivery partners or manage your own pickups and drops.' },
    { question: 'How are payments handled?', answer: 'Payments are settled weekly directly to your registered bank account.' },
    { question: 'Can I set my own prices?', answer: 'Yes! You have full control over your service rates and special offers.' }
  ]

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  const handleGetStarted = () => {
    // Simulate Login
    navigate('/partner-signup')
  }

  const handleUpdateProfile = () => {
    navigate('/partner/dailyLiving/laundry-cleaning/profile')
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fadeIn">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Grow your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-500">laundry</span>
            <br /> business with us
          </h1>
          <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
            Connect with customers looking for quality fabric care. We help laundromats and dry cleaners streamline operations.
          </p>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <FaCheckCircle className="text-cyan-400" /> <span>Verified Customers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <FaCheckCircle className="text-cyan-400" /> <span>Fast Payments</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md text-gray-900 rounded-3xl shadow-2xl p-8 max-w-md ml-auto border border-white/50 animate-fadeIn my-auto">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">Welcome Partner!</h2>
            <p className="text-gray-600 font-medium">Join our network and start cleaning.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGetStarted}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold text-xl rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all shadow-blue-500/30"
            >
              Get Started
            </button>

            <button
              onClick={handleUpdateProfile}
              className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold text-xl rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
            >
              <FaUser className="text-lg" /> Update Profile
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">By continuing, you agree to our Terms & Conditions.</p>
        </div>
      </div>

      <div className="mt-20 space-y-16">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 animate-fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Expand your service reach</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">Digitize your laundry shop and get orders from across the city.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { icon: FaTruck, title: "Easy Pickups", desc: "Schedule pickups and deliveries seamlessly through our platform." },
              { icon: FaClipboardList, title: "Manage Services", desc: "List your services like Dry Cleaning, Ironing, and Wash & Fold easily." },
              { icon: FaRupeeSign, title: "Grow Earnings", desc: "Attract more customers and increase your monthly revenue." }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 group p-6 rounded-2xl hover:bg-white/60 transition-colors">
                <div className="w-20 h-20 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <feature.icon className="text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-blue-900">{feature.title}</h3>
                <p className="text-gray-800 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 animate-fadeIn">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((f, idx) => (
                <div key={idx} className="bg-white/80 rounded-xl shadow-sm overflow-hidden border border-white/60 hover:shadow-md transition-shadow">
                  <button onClick={() => toggleFaq(idx)} className="w-full px-8 py-6 text-left flex items-center justify-between group">
                    <span className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">{f.question}</span>
                    {openFaq === idx ? <FaChevronUp className="text-blue-600" /> : <FaChevronDown className="text-gray-400 group-hover:text-blue-500" />}
                  </button>
                  <div className={`px-8 bg-white/40 text-gray-800 font-medium leading-relaxed ${openFaq === idx ? 'pb-6 block' : 'hidden'}`}>
                    {f.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
const Dashboard = () => {
  const { partner, login } = usePartner()

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative min-h-screen text-white overflow-y-auto">
        <div className="fixed inset-0 z-0 bg-gray-900">
          <img
            src="https://images.unsplash.com/photo-1545173168-9f1947eebb8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Laundry Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-black/50 to-transparent"></div>
        </div>

        {/* Render Welcome/Landing Page */}
        <GuestDashboard login={login} />
      </div>
    </div>
  )
}

export default Dashboard