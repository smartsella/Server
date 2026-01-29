import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePartner } from '../../../../../../context/partnerContext'
import { FaUtensils, FaUser, FaRupeeSign, FaCheckCircle, FaChevronDown, FaChevronUp, FaMotorcycle } from 'react-icons/fa'

// ==========================================
// GUEST VIEW COMPONENT (Not Logged In)
// ==========================================
const GuestDashboard = ({ login }) => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { question: 'Who can become a Food Partner?', answer: 'Home chefs, tiffin services, and restaurants looking to expand their reach.' },
    { question: 'Do I need a large kitchen?', answer: 'No, as long as you maintain hygiene standards and quality, you can start from your home kitchen.' },
    { question: 'How are payments handled?', answer: 'Payments are processed weekly directly to your bank account with detailed transaction reports.' },
    { question: 'Can I set my own menu and prices?', answer: 'Absolutely! You have full control over your menu, daily specials, and pricing.' }
  ]

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  const handleGetStarted = () => {
    // Simulate Login
    navigate('/partner-signup')
  }

  const handleUpdateProfile = () => {
    navigate('/partner/dailyLiving/food-tiffin-service/profile')
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fadeIn">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Serve your delicious <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-500">food</span>
            <br /> with Jeevigo
          </h1>
          <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
            Reach thousands of hungry customers. We help chefs and restaurants grow their business and serve happy customers.
            Start your kitchen today.
          </p>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <FaCheckCircle className="text-green-400" /> <span>Verified Orders</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <FaCheckCircle className="text-green-400" /> <span>On-Time Payments</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md text-gray-900 rounded-3xl shadow-2xl p-8 max-w-md ml-auto border border-white/50 animate-fadeIn my-auto">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">Welcome Chef!</h2>
            <p className="text-gray-600 font-medium">Join our community and start serving.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGetStarted}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-red-600 text-white font-bold text-xl rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all shadow-orange-500/30"
            >
              Get Started
            </button>

            <button
              onClick={handleUpdateProfile}
              className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold text-xl rounded-xl hover:border-orange-500 hover:text-orange-600 transition-all flex items-center justify-center gap-2"
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Expand your kitchen's reach</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">Connect with food lovers who crave your cuisine and boost your daily orders.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { icon: FaMotorcycle, title: "Reach Customers", desc: "Deliver your food to doorsteps across the city with our delivery network." },
              { icon: FaUtensils, title: "Showcase Menu", desc: "Create attractive menus and highlight your best dishes to attract orders." },
              { icon: FaRupeeSign, title: "Grow Revenue", desc: "Increase your daily earnings with a steady stream of online orders." }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 group p-6 rounded-2xl hover:bg-white/60 transition-colors">
                <div className="w-20 h-20 mx-auto bg-orange-50 text-orange-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <feature.icon className="text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-orange-900">{feature.title}</h3>
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
                    <span className="font-bold text-gray-900 text-lg group-hover:text-orange-700 transition-colors">{f.question}</span>
                    {openFaq === idx ? <FaChevronUp className="text-orange-600" /> : <FaChevronDown className="text-gray-400 group-hover:text-orange-500" />}
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
  const { login } = usePartner()

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative min-h-screen bg-gray-900 text-white overflow-y-auto">
        <div className="fixed inset-0 z-0">
          <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80" alt="Food Background" className="w-full h-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent"></div>
        </div>

        <GuestDashboard login={login} />
      </div>
    </div>
  )
}

export default Dashboard