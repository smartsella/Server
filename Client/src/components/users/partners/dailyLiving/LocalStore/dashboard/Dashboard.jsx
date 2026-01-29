import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePartner } from '../../../../../../context/partnerContext'
import { FaUser, FaShoppingBasket, FaPills, FaStore, FaCheckCircle, FaChevronDown, FaChevronUp } from 'react-icons/fa'

// ==========================================
// GUEST VIEW COMPONENT (Not Logged In)
// ==========================================
const GuestDashboard = ({ login }) => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { question: 'What kind of stores can register?', answer: 'Departmental stores, medical shops (pharmacies), supermarkets, and kirana stores.' },
    { question: 'How do I manage my inventory?', answer: 'You can easily add, edit, and track your products through our simple inventory dashboard.' },
    { question: 'Do you provide delivery support?', answer: 'Yes, we have a network of delivery partners to help deliver orders to your customers.' },
    { question: 'Is there a listing fee?', answer: 'Basic listing is free. We charge a small commission only on successful orders.' }
  ]

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  const handleGetStarted = () => {
    // Simulate Login
    navigate('/partner-signup')
  }

  const handleUpdateProfile = () => {
    navigate('/partner/dailyLiving/local-store-directory/profile')
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fadeIn">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Bring your <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-emerald-600">local store</span>
            <br /> online today
          </h1>
          <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
            Connect with neighborhood customers. Whether you run a medical shop, grocery store, or supermarket, we help you grow digitally.
          </p>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <FaCheckCircle className="text-emerald-400" /> <span>More Customers</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <FaCheckCircle className="text-emerald-400" /> <span>Easy Management</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md text-gray-900 rounded-3xl shadow-2xl p-8 max-w-md ml-auto border border-white/50 animate-fadeIn my-auto">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">Welcome Retailer!</h2>
            <p className="text-gray-600 font-medium">Start selling to your locality.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGetStarted}
              className="w-full py-4 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-bold text-xl rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all shadow-green-500/30"
            >
              Get Started
            </button>

            <button
              onClick={handleUpdateProfile}
              className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold text-xl rounded-xl hover:border-green-500 hover:text-green-600 transition-all flex items-center justify-center gap-2"
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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">One Platform, Many Stores</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">We support all types of local businesses. Digitize your inventory and start delivering.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { icon: FaShoppingBasket, title: "Groceries & Daily Needs", desc: "List vegetables, packaged foods, and household essentials." },
              { icon: FaPills, title: "Medical & Pharmacy", desc: "Enable customers to order medicines and healthcare products." },
              { icon: FaStore, title: "General Stores", desc: "Stationery, gifts, and other departmental store items." }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 group p-6 rounded-2xl hover:bg-white/60 transition-colors">
                <div className="w-20 h-20 mx-auto bg-green-50 text-green-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <feature.icon className="text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-green-900">{feature.title}</h3>
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
                    <span className="font-bold text-gray-900 text-lg group-hover:text-green-700 transition-colors">{f.question}</span>
                    {openFaq === idx ? <FaChevronUp className="text-green-600" /> : <FaChevronDown className="text-gray-400 group-hover:text-green-500" />}
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
    <div className="min-h-screen bg-gradient-to-br from-green-900 via-emerald-800 to-teal-900 text-white relative overflow-hidden">
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2000&auto=format&fit=crop"
          alt="Local Store"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-green-900/80 via-emerald-900/70 to-teal-900/80"></div>
      </div>
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-20"></div>
      <GuestDashboard login={login} />
    </div>
  )
}

export default Dashboard
