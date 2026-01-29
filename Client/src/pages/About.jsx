import React from 'react'
import { Link } from 'react-router-dom'
import {
  FaHome, FaMoneyBillWave, FaMobileAlt, FaQuestionCircle, FaBook, FaUsers,
  FaBullseye, FaRocket, FaBrain, FaCheckCircle, FaHandshake, FaLightbulb,
  FaHeart, FaDollarSign, FaSeedling, FaUserCircle
} from 'react-icons/fa'

const About = () => {
  const problems = [
    {
      icon: <FaHome />,
      title: 'Accommodation Chaos',
      description: 'Finding reliable PG accommodations while dealing with high broker fees, lack of trust, no proper rating systems, and constant uncertainty about safety and quality.'
    },
    {
      icon: <FaMoneyBillWave />,
      title: 'Hidden Costs',
      description: 'Brokerage fees, middleman charges, and unexpected costs drain thousands of rupees that could be saved. Transparency is rare, and budgeting becomes nearly impossible.'
    },
    {
      icon: <FaMobileAlt />,
      title: 'App Overload',
      description: 'Managing life requires juggling 10+ different apps - one for accommodation, one for food, another for services. This fragmentation wastes time and mental energy.'
    },
    {
      icon: <FaQuestionCircle />,
      title: 'Trust Issues',
      description: 'How do you verify if a service provider is genuine? Fake reviews, unverified listings, and quality inconsistency make every decision stressful and risky.'
    },
    {
      icon: <FaBook />,
      title: 'Educational Expenses',
      description: 'Expensive textbooks, costly tutoring, and lack of access to quality learning resources add financial burden. Finding affordable skill development is even harder.'
    },
    {
      icon: <FaUsers />,
      title: 'Isolation & Loneliness',
      description: 'Moving to a new city often means feeling lost without community support, guidance, or connections. There\'s no single platform that helps build genuine relationships.'
    }
  ]

  const differentiators = [
    {
      number: '1',
      title: 'Complete Integration',
      description: 'Unlike platforms that focus on just one aspect of life, Jeevigo brings together accommodation, daily services, education, career growth, and lifestyle in one unified experience. No more app-hopping or account juggling - everything you need in one place.'
    },
    {
      number: '2',
      title: 'AI-Powered Intelligence',
      description: 'Our platform learns from your preferences and behavior to provide increasingly personalized recommendations. From finding the perfect PG to suggesting the right courses for your career goals, our AI works for you 24/7, constantly improving to serve you better.'
    },
    {
      number: '3',
      title: 'Verified & Trusted Network',
      description: 'Every service provider on our platform is thoroughly verified. We personally visit properties, check credentials, verify licenses, and maintain ongoing quality monitoring to ensure your safety and satisfaction. Your trust is our top priority.'
    },
    {
      number: '4',
      title: 'Community-First Approach',
      description: 'We\'re not just connecting you to services - we\'re building a supportive community. Meet fellow students and professionals, discover city events, share experiences, and build meaningful connections. You\'re never alone with Jeevigo.'
    },
    {
      number: '5',
      title: 'Genuine Savings',
      description: 'With zero brokerage fees, exclusive discounts, smart bundling, and our PRIME membership benefits, users save an average of ₹24,000 to ₹84,000 annually. That\'s real money back in your pocket for what truly matters - your dreams and goals.'
    }
  ]

  const values = [
    {
      icon: <FaUserCircle />,
      title: 'User-First Always',
      description: 'Every feature, every decision, every innovation starts with one question - how can we make life easier for our users?'
    },
    {
      icon: <FaCheckCircle />,
      title: 'Trust & Transparency',
      description: 'No hidden fees. No fake reviews. No compromises. We believe in complete honesty and building long-term trust.'
    },
    {
      icon: <FaLightbulb />,
      title: 'Innovation & Excellence',
      description: 'We constantly push boundaries, embrace new technologies, and never settle. We\'re committed to being the best we can be.'
    },
    {
      icon: <FaHeart />,
      title: 'Community Building',
      description: 'We believe in the power of connection. Together, we\'re stronger, smarter, and more successful.'
    },
    {
      icon: <FaDollarSign />,
      title: 'Affordability Focus',
      description: 'Quality services shouldn\'t be a luxury. We work hard to keep prices fair, transparent, and accessible to everyone.'
    },
    {
      icon: <FaSeedling />,
      title: 'Continuous Growth',
      description: 'We\'re committed to helping you grow - through learning opportunities, career support, and personal development.'
    }
  ]

  const team = [
    {
      name: 'Rahul Sharma',
      role: 'Founder & CEO',
      description: 'Former IIT Delhi graduate with a vision to transform how students experience city life. 5 years building startups.'
    },
    {
      name: 'Priya Patel',
      role: 'Chief Technology Officer',
      description: 'A self-certified learning expert from Stanford. Leads our tech innovation and AI platform development.'
    },
    {
      name: 'Arjun Verma',
      role: 'Head of Operations',
      description: '10+ years in operations and logistics. Ensuring every service provider meets our quality standards.'
    },
    {
      name: 'Sneha Reddy',
      role: 'Head of Customer Success',
      description: 'Passionate about user experience. Leading our support team to ensure every user feels heard and helped.'
    }
  ]

  const impact = [
    { value: '35 Cr+', label: 'Students Who Can Benefit' },
    { value: '₹84K', label: 'Average Annual Savings' },
    { value: '100%', label: 'Verified Providers' },
    { value: '50+', label: 'Services Available' },
    { value: '24/7', label: 'AI-Powered Support' },
    { value: 'Zero', label: 'Brokerage Fees' }
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
      <section className="relative py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold mb-8 animate-fade-in-up">About Jeevigo</h1>
          <p className="text-xl lg:text-2xl opacity-90 max-w-4xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            We're building India's first complete life ecosystem that empowers students<br />
            and professionals to thrive in new cities through technology, AI, and seamless<br />
            access to essential services.
          </p>
        </div>
      </section>

      {/* Our Story Section */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Our Story</h2>
            <p className="text-xl text-gray-600">How we're transforming the way people experience life in new cities</p>
          </div>

          {/* The Beginning */}
          <div className="grid lg:grid-cols-2 gap-12 items-center mb-20">
            <div>
              <h3 className="text-3xl font-bold text-blue-600 mb-6">The Beginning</h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-justify">
                Every year, millions of students and working professionals move to new cities, chasing dreams of education and career growth. The excitement of new opportunities quickly gives way to the stress of finding accommodation, managing daily needs, and navigating an unfamiliar environment.
              </p>
              <p className="text-gray-600 leading-relaxed text-justify">
                We saw friends struggle with unreliable PG owners, expensive food delivery, difficult access to basic services, and the overwhelming challenge of managing it all. That's when we realized - people don't need more apps, they need one complete ecosystem that truly understands and solves their daily challenges.
              </p>
            </div>
            <div className="rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&h=600&fit=crop"
                alt="Team collaboration"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* The Solution */}
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="order-2 lg:order-1 rounded-3xl overflow-hidden shadow-2xl hover:scale-105 transition-all duration-300">
              <img
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=800&h=600&fit=crop"
                alt="Modern office"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="order-1 lg:order-2">
              <h3 className="text-3xl font-bold text-blue-600 mb-6">The Solution</h3>
              <p className="text-gray-600 mb-4 leading-relaxed text-justify">
                Jeevigo was born from this insight. We're not just another booking platform or service marketplace. We're building a comprehensive life management ecosystem that brings together everything you need to thrive in a new city - from finding the perfect accommodation to advancing your career.
              </p>
              <p className="text-gray-600 leading-relaxed text-justify">
                Powered by intelligent AI that learns and adapts to your needs, we're creating a platform where life genuinely becomes easier. No more juggling multiple apps, no more hidden fees, no more stress - just a seamless, trustworthy ecosystem designed for you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problems We're Solving */}
      <section className="relative py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">The Problem We're Solving</h2>
            <p className="text-xl text-gray-600">Today's students and professionals face fragmented solutions that create stress instead of solving it</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {problems.map((problem, index) => {
              const borderColors = [
                'border-4 border-blue-500',
                'border-4 border-purple-500',
                'border-4 border-pink-500',
                'border-4 border-cyan-500',
                'border-4 border-indigo-500',
                'border-4 border-violet-500'
              ];
              return (
                <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${borderColors[index % borderColors.length]}`}>
                  <div className="text-5xl text-blue-600 mb-4">{problem.icon}</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{problem.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{problem.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Our Vision & Mission</h2>
            <p className="text-xl text-blue-600">Guiding principles that drive everything we do</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center border-4 border-blue-500">
              <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaBullseye className="text-white text-3xl" />
              </div>
              <h3 className="text-3xl font-bold text-blue-600 mb-6">Our Vision</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                To build India's first complete life ecosystem that empowers students and professionals by simplifying daily living, promoting growth, and creating a trustworthy digital environment where everyone can thrive.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We envision a future where moving to a new city is exciting rather than stressful, where finding quality services is simple rather than frustrating, and where everyone has the support they need to achieve their dreams.
              </p>
            </div>

            <div className="bg-white rounded-3xl p-10 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center border-4 border-purple-500">
              <div className="w-20 h-20 bg-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                <FaRocket className="text-white text-3xl" />
              </div>
              <h3 className="text-3xl font-bold text-purple-600 mb-6">Our Mission</h3>
              <p className="text-gray-700 mb-4 leading-relaxed">
                To make life easier through technology, AI, and seamless access to essential services - anytime, anywhere. We're committed to reducing stress, lowering costs, and building a supportive community.
              </p>
              <p className="text-gray-700 leading-relaxed">
                We measure our success not in downloads or transactions, but in the stress we eliminate, the money we help you save, and the opportunities we help you discover.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes Us Different */}
      <section className="relative py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">What Makes Us Different</h2>
            <p className="text-xl text-blue-600">Five key differentiators that set Jeevigo apart from traditional solutions</p>
          </div>

          <div className="space-y-6">
            {differentiators.map((item, index) => {
              const borderColors = [
                'border-l-4 border-blue-500',
                'border-l-4 border-purple-500',
                'border-l-4 border-pink-500',
                'border-l-4 border-cyan-500',
                'border-l-4 border-indigo-500'
              ];
              return (
                <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-[1.02] ${borderColors[index % borderColors.length]}`}>
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                      {item.number}
                    </div>
                    <div className="flex-grow">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">{item.title}</h3>
                      <p className="text-gray-600 leading-relaxed">{item.description}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Our Core Values</h2>
            <p className="text-xl text-blue-600">The principles that guide our decisions and define who we are</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {values.map((value, index) => {
              const borderColors = [
                'border-4 border-blue-500',
                'border-4 border-purple-500',
                'border-4 border-pink-500',
                'border-4 border-cyan-500',
                'border-4 border-indigo-500',
                'border-4 border-violet-500'
              ];
              return (
                <div key={index} className={`bg-white rounded-2xl p-8 text-center shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${borderColors[index % borderColors.length]}`}>
                  <div className="w-20 h-20 bg-blue-600 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-white text-3xl">{value.icon}</span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">{value.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Growing Impact */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold mb-4">Our Growing Impact</h2>
            <p className="text-xl opacity-90">Making a real difference in people's lives across India</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {impact.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-md rounded-2xl p-6 text-center hover:bg-white/20 transition-all duration-300 hover:scale-105">
                <div className="text-4xl font-bold mb-2">{stat.value}</div>
                <div className="text-sm opacity-90">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">Meet Our Team</h2>
            <p className="text-xl text-gray-600">Passionate people building the future of life management</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => {
              const borderColors = [
                'border-4 border-blue-500',
                'border-4 border-purple-500',
                'border-4 border-pink-500',
                'border-4 border-cyan-500'
              ];
              return (
                <div key={index} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 text-center ${borderColors[index % borderColors.length]}`}>
                  <div className="w-32 h-32 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                    <span className="text-5xl text-white"><FaUserCircle /></span>
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl lg:text-5xl font-bold mb-6">Join Our Journey</h2>
          <p className="text-xl mb-8 opacity-90">
            Whether you're a student, professional, or service provider - there's a place for you<br />
            in our ecosystem
          </p>
          <Link
            to="/signup"
            className="inline-block px-10 py-4 bg-white text-blue-600 rounded-full text-lg font-semibold hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            Get Started Today
          </Link>
        </div>
      </section>
    </div>
  )
}

export default About