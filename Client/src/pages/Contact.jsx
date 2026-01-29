import React, { useState } from 'react'
import {
  FaEnvelope, FaPhone, FaComments, FaMapMarkerAlt, FaFacebook,
  FaTwitter, FaInstagram, FaLinkedin, FaYoutube
} from 'react-icons/fa'

const Contact = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    // Handle form submission
    console.log('Form submitted:', formData)
  }

  const contactInfo = [
    {
      icon: <FaEnvelope />,
      title: 'Email Us',
      subtitle: 'General Inquiries',
      details: [
        'hello@jeevigo.com',
        'Support: support@jeevigo.com',
        'Business: business@jeevigo.com'
      ]
    },
    {
      icon: <FaPhone />,
      title: 'Call Us',
      subtitle: 'Customer Support',
      details: [
        '+91 80456 12345',
        '+91 80456 12346',
        'Mon-Fri: 9:00 AM - 6:00 PM IST',
        'Sat-Sun: 10:00 AM - 4:00 PM IST'
      ]
    },
    {
      icon: <FaComments />,
      title: 'Live Chat',
      subtitle: '24/7 AI-powered support available on our website',
      details: [
        'Get instant answers to your questions anytime'
      ]
    },
    {
      icon: <FaMapMarkerAlt />,
      title: 'Visit Us',
      subtitle: 'Jeevigo Technologies Pvt. Ltd.',
      details: [
        'Koramangala, Bangalore - 560034',
        'Karnataka, India'
      ]
    }
  ]

  const socialMedia = [
    { icon: <FaFacebook />, name: 'Facebook', color: 'hover:bg-blue-600' },
    { icon: <FaTwitter />, name: 'Twitter', color: 'hover:bg-blue-400' },
    { icon: <FaInstagram />, name: 'Instagram', color: 'hover:bg-pink-600' },
    { icon: <FaLinkedin />, name: 'LinkedIn', color: 'hover:bg-blue-700' },
    { icon: <FaYoutube />, name: 'YouTube', color: 'hover:bg-red-600' }
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
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">Get in Touch</h1>
          <p className="text-xl lg:text-2xl opacity-90 max-w-3xl mx-auto leading-relaxed animate-fade-in-up animation-delay-200">
            We're here to help you make life easy. Reach out for support, partnerships, or<br />
            any queries.
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div className="space-y-8">
              <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-blue-500">
                <h2 className="text-3xl font-bold text-gray-900 mb-8">Contact Information</h2>

                <div className="space-y-8">
                  {contactInfo.map((info, index) => (
                    <div key={index} className="flex items-start gap-4">
                      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl">
                        {info.icon}
                      </div>
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">{info.title}</h3>
                        <p className="text-sm text-gray-600 mb-2">{info.subtitle}</p>
                        {info.details.map((detail, idx) => (
                          <p key={idx} className="text-gray-700 text-sm">{detail}</p>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Social Media */}
                <div className="mt-8 pt-8 border-t border-gray-200">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">Follow Us on Social Media</h3>
                  <div className="flex gap-4">
                    {socialMedia.map((social, index) => (
                      <button
                        key={index}
                        className={`w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center text-white text-xl hover:scale-110 transition-all duration-300 ${social.color}`}
                        aria-label={social.name}
                      >
                        {social.icon}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-3xl p-8 shadow-lg border-4 border-purple-500">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Send Us a Message</h2>
              <p className="text-gray-600 mb-8">Fill out the form below and we'll get back to you within 24 hours</p>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      placeholder="John"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="lastName" className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      placeholder="Doe"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john.doe@example.com"
                      required
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-2">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all bg-white"
                  >
                    <option value="">Select a subject</option>
                    <option value="general">General Inquiry</option>
                    <option value="support">Technical Support</option>
                    <option value="partnership">Partnership Opportunity</option>
                    <option value="feedback">Feedback & Suggestions</option>
                    <option value="complaint">Complaint</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us how we can help you..."
                    required
                    rows="6"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg font-semibold text-lg hover:from-blue-700 hover:to-purple-700 hover:shadow-xl hover:scale-[1.02] transition-all duration-300"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Optional - can be added later) */}
      <section className="relative py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Visit Our Office</h2>
          <p className="text-xl text-gray-600 mb-8">Come say hello at our Bangalore office</p>

          <div className="bg-white rounded-3xl p-4 shadow-lg border-4 border-indigo-500 overflow-hidden">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-purple-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <FaMapMarkerAlt className="text-6xl text-blue-600 mx-auto mb-4" />
                <p className="text-2xl font-bold text-gray-900">Ramapuram, Chennai</p>
                <p className="text-gray-600">Chennai, India - 600089</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Contact