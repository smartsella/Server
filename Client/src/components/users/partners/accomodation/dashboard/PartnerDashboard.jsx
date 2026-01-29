import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePartner } from '../../../../../context/partnerContext'
import { FaBuilding, FaUser, FaRupeeSign, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'

// ==========================================
// GUEST VIEW COMPONENT (Not Logged In)
// ==========================================
const GuestDashboard = ({ login, serviceType }) => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { question: 'Who are Jeevigo guests?', answer: 'Our guests range from students looking for long-term PGs to professionals moving to new cities for work.' },
    { question: 'Can I choose who stays in my property?', answer: 'Yes, you have full control. You can set preferences, review potential tenants, and chat with them before confirming.' },
    { question: 'How can I protect my property from potential damage?', answer: 'We offer property protection plans and security deposit management.' },
    { question: 'How do I become a Jeevigo partner?', answer: 'Sign up, list your property details, upload photos, and complete our verification process.' }
  ]

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  const handleGetStarted = () => {
    navigate('/partner-signup')
  }

  const handleUpdateProfile = () => {
    // Simulate Login and navigate to profile
    login({
      id: Date.now(),
      basicDetails: {
        ownerName: 'Guest Partner',
        propertyName: 'New Property'
      }
    })
    // Navigate to profile page with serviceType
    const currentServiceType = serviceType || 'pg-hostel'
    navigate(`/partner/accommodation/${currentServiceType}/profile`)
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fadeIn">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Rent your property <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">confidently</span>
            <br /> with Jeevigo
          </h1>
          <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
            Trusted by thousands of owners. We help hosts like you make extra income and welcome reliable guests.
            Start your listing today.
          </p>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <FaCheckCircle className="text-green-400" /> <span>Verified Guests</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <FaCheckCircle className="text-green-400" /> <span>Secure Payments</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md text-gray-900 rounded-3xl shadow-2xl p-8 max-w-md ml-auto border border-white/50 animate-fadeIn my-auto">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">Welcome Partner!</h2>
            <p className="text-gray-600 font-medium">Join our community and start earning.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGetStarted}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold text-xl rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all shadow-blue-500/30"
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Bring the right guests within reach</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">Connect with travellers who fit your property and start earning more with our partner network.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { icon: FaBuilding, title: "Access Travellers", desc: "Bring travellers to your door from around the region with our wide reach." },
              { icon: FaUser, title: "Attract Guests", desc: "Set preferences and attract guests who value what you offer." },
              { icon: FaRupeeSign, title: "Grow Earnings", desc: "Make data-driven decisions to increase visibility and bookings consistently." }
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
const PartnerDashboard = () => {
  const { login } = usePartner()
  const navigate = useNavigate()
  const serviceType = 'pg-hostel' // Default service type

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative min-h-screen bg-gray-900 text-white overflow-y-auto">
        <div className="fixed inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Hotel" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent"></div>
        </div>

        <GuestDashboard login={login} serviceType={serviceType} />
      </div>
    </div>
  )
}

export default PartnerDashboard