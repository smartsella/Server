import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePartner } from '../../../../../../context/partnerContext'
import { FaUser, FaCheckCircle, FaChevronDown, FaChevronUp, FaBolt, FaTint, FaTools } from 'react-icons/fa'

// ==========================================
// GUEST VIEW COMPONENT (Not Logged In)
// ==========================================
const GuestDashboard = ({ login }) => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { question: 'Who can register as a partner?', answer: 'Electricians, plumbers, carpenters, AC technicians, and other home service professionals.' },
    { question: 'How do I get jobs?', answer: 'Customers in your area will book your services directly through the app. You get instant notifications.' },
    { question: 'Is there a registration fee?', answer: 'No, joining is completely free. We settle payments weekly based on the services you complete.' },
    { question: 'Can I choose my working areas?', answer: 'Yes, you can specify the locations where you want to provide your services.' }
  ]

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  const handleGetStarted = () => {
  navigate('/partner-signup')
  }

  const handleUpdateProfile = () => {
    // Simulate Login and navigate to profile
    
    navigate('/partner/dailyLiving/repair-services/profile')
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fadeIn">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight text-gray-900">
            Grow your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-amber-600">Repair Business</span>
            <br /> with us
          </h1>
          <p className="text-xl text-gray-800 max-w-lg leading-relaxed font-medium">
            Connect with homeowners needing repairs. Whether you are an electrician, plumber, or technician, we bring jobs to you.
          </p>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-orange-200 shadow-sm">
              <FaCheckCircle className="text-orange-600" /> <span>Steady Jobs</span>
            </div>
            <div className="flex items-center gap-2 bg-white/90 backdrop-blur-sm px-4 py-2 rounded-lg border border-orange-200 shadow-sm">
              <FaCheckCircle className="text-orange-600" /> <span>Instant Payments</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md text-gray-900 rounded-3xl shadow-2xl p-8 max-w-md ml-auto border border-white/50 animate-fadeIn my-auto">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">Welcome Pro!</h2>
            <p className="text-gray-600 font-medium">Join thousands of service partners.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGetStarted}
              className="w-full py-4 bg-gradient-to-r from-orange-600 to-amber-600 text-white font-bold text-xl rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all shadow-orange-500/30"
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Services We Support</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">Expand your customer base by listing your professional services.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { icon: FaBolt, title: "Electrical Works", desc: "Wiring, switch installation, and electrical repairs." },
              { icon: FaTint, title: "Plumbing", desc: "Pipe fitting, leakage repair, and bathroom fittings." },
              { icon: FaTools, title: "Appliance Repair", desc: "AC, Fridge, Washing Machine, and other appliance services." }
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
    <div className="min-h-screen bg-gradient-to-br from-orange-900 via-amber-800 to-yellow-900 relative overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=2000&auto=format&fit=crop"
          alt="Repair Services"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-orange-900/80 via-amber-900/70 to-yellow-900/80"></div>
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-20"></div>

      <GuestDashboard login={login} />
    </div>
  )
}

export default Dashboard
