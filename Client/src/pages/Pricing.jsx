import React, { useState } from 'react'
import { FaCheck, FaTimes, FaStar, FaShieldAlt, FaBolt, FaGift, FaChevronDown, FaChevronUp, FaRocket, FaBuilding } from 'react-icons/fa'

const Pricing = () => {
  const [activeTab, setActiveTab] = useState('users')
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const pricingPlans = {
    users: [
      {
        name: 'Basic',
        icon: <FaRocket />,
        price: 'Free',
        period: '',
        subtitle: 'Perfect for getting started',
        description: 'Forever free, no credit card required',
        borderColor: 'border-purple-400',
        features: [
          'Browse all PG/Hostel listings',
          'Search and filter options',
          'View verified reviews',
          'Access to basic services',
          'Community features',
          'Standard customer support',
          'Limited AI assistance',
          'Email notifications'
        ],
        buttonText: 'Get Started Free',
        buttonStyle: 'bg-gradient-to-r from-purple-50 to-blue-50 text-purple-700 border-2 border-purple-300 hover:from-purple-100 hover:to-blue-100 hover:border-purple-400 hover:shadow-lg'
      },
      {
        name: 'Jeevigo PRIME',
        icon: <FaStar />,
        price: '₹999',
        period: '/year',
        subtitle: 'Most popular · Best value for money',
        description: 'Save ₹11,000+ annually on services',
        borderColor: 'border-blue-400',
        badge: 'MOST POPULAR',
        features: [
          'Everything in Basic plan',
          '15% discount on all services',
          'Free AI mentorship (worth ₹2,000)',
          '1 free cleaning/repair per month',
          'Priority booking for PGs',
          'Exclusive event access',
          '24/7 priority support',
          'Advanced budget planning tools',
          'Early access to new features',
          'Ad-free experience',
          'Premium profile badge',
          'Monthly savings reports'
        ],
        buttonText: 'Start Saving Now',
        buttonStyle: 'border-2 border-purple-600 text-purple-600 hover:bg-purple-50'
      },
      {
        name: 'For Businesses',
        icon: <FaBuilding />,
        price: 'Custom',
        period: '',
        subtitle: 'For PG owners & service providers',
        description: 'Tailored to your business needs',
        borderColor: 'border-indigo-400',
        features: [
          'List your PG/services',
          'Verified business badge',
          'Featured listings',
          'Analytics dashboard',
          'Customer management tools',
          'Payment integration',
          'Marketing support',
          'Dedicated account manager',
          'Priority placement',
          'Monthly performance reports',
          'API access',
          'Custom branding options'
        ],
        buttonText: 'Contact Sales',
        buttonStyle: 'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50'
      }
    ]
  }

  const savingsBreakdown = [
    { amount: '₹2,000', category: 'Accommodation', description: 'Zero brokerage fees when booking PG through our platform' },
    { amount: '₹8,000', category: 'Food & Services', description: '15% discount on tiffin, cleaning, laundry, and repairs' },
    { amount: '₹5,000', category: 'Books & Courses', description: 'Save on textbooks, skill courses, and tutoring services' },
    { amount: '₹3,000', category: 'Lifestyle', description: 'Exclusive vouchers and deals on entertainment, food, and more' }
  ]

  const comparisonFeatures = [
    { feature: 'Browse PG/Hostel listings', basic: true, prime: true, business: true },
    { feature: 'Verified reviews & ratings', basic: true, prime: true, business: true },
    { feature: 'Service discounts', basic: false, prime: '15%', business: 'Custom' },
    { feature: 'Priority booking', basic: false, prime: true, business: true },
    { feature: 'AI mentorship sessions', basic: false, prime: 'Custom', business: 'Custom' },
    { feature: 'Free services per month', basic: false, prime: '1 free', business: 'N/A' },
    { feature: 'Customer support', basic: 'Standard', prime: '24/7 Priority', business: 'Dedicated' },
    { feature: 'Budget planning tools', basic: false, prime: true, business: 'Analytics' },
    { feature: 'Early feature access', basic: false, prime: true, business: true },
    { feature: 'List services/properties', basic: false, prime: false, business: true },
    { feature: 'Marketing support', basic: false, prime: false, business: true },
    { feature: 'API access', basic: false, prime: false, business: true }
  ]

  const faqs = [
    {
      question: 'How does Jeevigo PRIME work?',
      answer: 'Jeevigo PRIME is an annual subscription that gives you 15% discount on all services, free AI mentorship sessions, priority support, and exclusive benefits. You pay just ₹999/year and can save over ₹11,000 annually, giving you an incredible return on investment.'
    },
    {
      question: 'Can I try PRIME before committing?',
      answer: 'Yes! We offer a 30-day money-back guarantee. If you\'re not satisfied with PRIME within the first 30 days, we\'ll refund your full amount, no questions asked. You can also start with our free Basic plan to explore the platform.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major payment methods including credit/debit cards, UPI, net banking, and popular digital wallets like Paytm, PhonePe, and Google Pay. All transactions are secured with bank-grade encryption.'
    },
    {
      question: 'Can I cancel my PRIME subscription?',
      answer: 'Yes, you can cancel anytime. If you cancel, you\'ll continue to enjoy PRIME benefits until the end of your billing period. We also offer a pro-rated refund if you cancel within the first 3 months.'
    },
    {
      question: 'Is there a student discount available?',
      answer: 'Currently, our PRIME plan at ₹999/year is already student-friendly. We also run special promotions during admission seasons. Join our newsletter to stay updated on exclusive student offers and early-bird discounts.'
    },
    {
      question: 'How do I upgrade from Basic to PRIME?',
      answer: 'Simply go to your account settings and click on "Upgrade to PRIME". The upgrade is instant, and you can start enjoying all PRIME benefits immediately after payment confirmation.'
    },
    {
      question: 'What\'s included in the Business plan?',
      answer: 'The Business plan is customized for PG owners and service providers. It includes featured listings, analytics dashboard, customer management tools, payment integration, marketing support, and a dedicated account manager. Contact our sales team for custom pricing.'
    },
    {
      question: 'Do prices include GST?',
      answer: 'No, the displayed prices are exclusive of GST. Applicable GST (18%) will be added at checkout as per Indian tax regulations. Your invoice will show the complete breakdown.'
    }
  ]

  const totalSavings = savingsBreakdown.reduce((acc, item) => {
    return acc + parseInt(item.amount.replace('₹', '').replace(',', ''))
  }, 0)

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
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">
            Simple, Transparent Pricing
          </h1>
          <p className="text-xl mb-12 opacity-90 animate-fade-in-up animation-delay-200">
            Choose the plan that works best for you.<br />
            No hidden fees, no surprises.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto mb-12 animate-fade-in-up animation-delay-400">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold mb-2">₹999</div>
              <div className="text-lg opacity-90">Annual PRIME Plan</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold mb-2">₹18K+</div>
              <div className="text-lg opacity-90">Average Savings</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold mb-2">18X</div>
              <div className="text-lg opacity-90">Return on Investment</div>
            </div>
          </div>

          {/* Tab Toggle */}
          <div className="inline-flex bg-white/20 backdrop-blur-md rounded-full p-1.5 shadow-lg animate-fade-in-up animation-delay-600 relative">
            <button
              onClick={() => setActiveTab('users')}
              className={`px-10 py-3.5 rounded-full font-semibold transition-all duration-300 relative z-10 ${activeTab === 'users'
                  ? 'text-blue-600'
                  : 'text-white/80 hover:text-white'
                }`}
            >
              For Users
            </button>
            <button
              onClick={() => setActiveTab('businesses')}
              className={`px-10 py-3.5 rounded-full font-semibold transition-all duration-300 relative z-10 ${activeTab === 'businesses'
                  ? 'text-blue-600'
                  : 'text-white/80 hover:text-white'
                }`}
            >
              For Businesses
            </button>
            {/* Sliding Background */}
            <div
              className={`absolute top-1.5 bottom-1.5 bg-white rounded-full transition-all duration-300 ease-in-out shadow-lg ${activeTab === 'users' ? 'left-1.5' : 'left-1/2'
                }`}
              style={{
                width: 'calc(50% - 0.375rem)'
              }}
            />
          </div>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {pricingPlans.users.map((plan, index) => {
              const borderColors = [
                'border-4 border-purple-500',
                'border-4 border-blue-500',
                'border-4 border-indigo-500'
              ];
              return (
                <div
                  key={index}
                  className={`relative bg-white rounded-2xl shadow-xl overflow-hidden transform hover:scale-105 hover:shadow-2xl transition-all duration-300 animate-fade-in-up ${borderColors[index]}`}
                  style={{ animationDelay: `${index * 200}ms` }}
                >
                  {plan.badge && (
                    <div className="absolute top-4 right-4 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {plan.badge}
                    </div>
                  )}

                  <div className="p-8">
                    <div className="text-5xl mb-4 text-blue-600 flex justify-center">{plan.icon}</div>
                    <h3 className="text-2xl font-bold text-purple-600 mb-2">{plan.name}</h3>
                    <p className="text-sm text-blue-600 font-semibold mb-4">{plan.subtitle}</p>

                    <div className="mb-6">
                      <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                      {plan.period && <span className="text-xl text-gray-600">{plan.period}</span>}
                    </div>

                    <p className="text-sm text-gray-600 mb-6">{plan.description}</p>

                    <button className={`w-full py-4 rounded-full font-semibold transition-all duration-300 ${plan.buttonStyle}`}>
                      {plan.buttonText}
                    </button>

                    <div className="mt-8 space-y-4">
                      {plan.features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <FaCheck className="text-green-500 mt-1 flex-shrink-0" />
                          <span className="text-gray-700 text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Savings Breakdown */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How Much Can You Save?</h2>
            <p className="text-xl text-gray-600">Jeevigo PRIME members save an average of ₹15,000 - ₹25,000 annually</p>
          </div>

          <div className="grid md:grid-cols-4 gap-6 mb-12">
            {savingsBreakdown.map((item, index) => {
              const borderColors = [
                'border-4 border-purple-500',
                'border-4 border-blue-500',
                'border-4 border-pink-500',
                'border-4 border-cyan-500'
              ];
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${borderColors[index]}`}
                >
                  <div className="text-4xl font-bold text-blue-600 mb-2">{item.amount}</div>
                  <div className="text-lg font-semibold text-gray-900 mb-2">{item.category}</div>
                  <div className="text-sm text-gray-600">{item.description}</div>
                </div>
              );
            })}
          </div>

          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h3 className="text-3xl font-bold mb-4">Total Potential Savings</h3>
            <div className="text-6xl font-bold mb-4">₹{totalSavings.toLocaleString()}+</div>
            <p className="text-lg mb-6">With just a ₹999 investment, get 18X return on your money!</p>
            <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              Upgrade to PRIME Now
            </button>
          </div>
        </div>
      </section>

      {/* Detailed Feature Comparison */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8 bg-white/50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Detailed Feature Comparison</h2>
            <p className="text-xl text-gray-600">See what's included in each plan</p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border-4 border-purple-500">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                    <th className="px-6 py-4 text-center font-semibold">Basic</th>
                    <th className="px-6 py-4 text-center font-semibold">PRIME</th>
                    <th className="px-6 py-4 text-center font-semibold">Business</th>
                  </tr>
                </thead>
                <tbody>
                  {comparisonFeatures.map((item, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                      <td className="px-6 py-4 font-medium text-gray-900">{item.feature}</td>
                      <td className="px-6 py-4 text-center">
                        {typeof item.basic === 'boolean' ? (
                          item.basic ? (
                            <FaCheck className="text-green-500 mx-auto text-xl" />
                          ) : (
                            <FaTimes className="text-gray-300 mx-auto text-xl" />
                          )
                        ) : (
                          <span className="text-gray-700">{item.basic}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof item.prime === 'boolean' ? (
                          item.prime ? (
                            <FaCheck className="text-green-500 mx-auto text-xl" />
                          ) : (
                            <FaTimes className="text-gray-300 mx-auto text-xl" />
                          )
                        ) : (
                          <span className="text-blue-600 font-semibold">{item.prime}</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        {typeof item.business === 'boolean' ? (
                          item.business ? (
                            <FaCheck className="text-green-500 mx-auto text-xl" />
                          ) : (
                            <FaTimes className="text-gray-300 mx-auto text-xl" />
                          )
                        ) : (
                          <span className="text-gray-700">{item.business}</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know about our pricing</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => {
              const borderColors = [
                'border-l-4 border-blue-500',
                'border-l-4 border-purple-500',
                'border-l-4 border-pink-500',
                'border-l-4 border-cyan-500',
                'border-l-4 border-indigo-500',
                'border-l-4 border-violet-500',
                'border-l-4 border-blue-500',
                'border-l-4 border-purple-500'
              ];
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 ${borderColors[index]}`}
                >
                  <button
                    onClick={() => setExpandedFAQ(expandedFAQ === index ? null : index)}
                    className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-gray-50 transition-colors duration-200"
                  >
                    <span className="font-semibold text-gray-900 pr-4">{faq.question}</span>
                    {expandedFAQ === index ? (
                      <FaChevronUp className="text-blue-600 flex-shrink-0" />
                    ) : (
                      <FaChevronDown className="text-gray-400 flex-shrink-0" />
                    )}
                  </button>
                  {expandedFAQ === index && (
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white shadow-2xl">
            <h2 className="text-4xl font-bold mb-4">Ready to Start Saving?</h2>
            <p className="text-xl mb-8">Join thousands who are already saving thousands with Jeevigo PRIME</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition-all duration-300 transform hover:scale-105">
                Get Started Today
              </button>
              <button className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300">
                30-Day Money-Back Guarantee
              </button>
            </div>
            <p className="text-sm mt-6 opacity-90">
              Try risk-free. If you're not satisfied, get a full refund within 30 days.
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Pricing