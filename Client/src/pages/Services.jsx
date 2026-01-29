import React, { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import {
  FaHome, FaBed, FaGraduationCap, FaMotorcycle, FaRobot, FaUsers, FaUtensils,
  FaTint, FaTshirt, FaTools, FaStore, FaBook, FaChalkboardTeacher, FaLaptop,
  FaBriefcase, FaBullseye, FaGift, FaComments, FaMoneyBillWave, FaShieldAlt
} from 'react-icons/fa'
import { MdLocalLaundryService, MdWaterDrop } from 'react-icons/md'

const Services = () => {
  const location = useLocation()
  const [activeCategory, setActiveCategory] = useState('accommodation')

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const category = params.get('category')
    if (category) {
      setActiveCategory(category)
    }
  }, [location])

  const categories = [
    { id: 'accommodation', name: 'Accommodation', icon: <FaHome /> },
    { id: 'daily', name: 'Daily Living', icon: <FaBed /> },
    { id: 'education', name: 'Education & Career', icon: <FaGraduationCap /> },
    { id: 'lifestyle', name: 'Lifestyle', icon: <FaMotorcycle /> },
    { id: 'ai', name: 'AI Services', icon: <FaRobot /> }
  ]

  const serviceData = {
    accommodation: {
      title: 'Accommodation Services',
      subtitle: 'Find your perfect home away from home with zero hassle and complete transparency',
      icon: <FaHome />,
      services: [
        {
          icon: <FaHome />,
          title: 'PG Finder',
          description: 'Discover verified PG accommodations that match your lifestyle, budget, and location preferences. Our AI-powered matching ensures you find the perfect place.',
          features: [
            '100% verified listings with real photos',
            'Genuine reviews from current residents',
            'Virtual tours and video walkthroughs',
            'AI-powered smart matching algorithm',
            'Zero brokerage fees - complete transparency',
            'Detailed amenity information',
            'Safety ratings and security features',
            'Flexible payment options available'
          ],
          pricing: 'No Brokerage Fee'
        },
        {
          icon: <FaBed />,
          title: 'Hostel Booking',
          description: 'Book comfortable hostel rooms with complete information about facilities, pricing, and availability. Perfect for students seeking affordable shared living.',
          features: [
            'Single, double, and shared room options',
            'Meal plans included in pricing',
            'Safety-certified properties only',
            'Wi-Fi and study space guaranteed',
            'Flexible monthly/yearly plans',
            'Quick onboarding process',
            'Community events and activities',
            '24/7 warden support'
          ],
          pricing: 'Starting ₹4,000/month'
        },
        {
          icon: <FaUsers />,
          title: 'Roommate Matching',
          description: 'Find compatible roommates based on lifestyle, habits, and preferences. Our smart algorithm ensures better compatibility and harmonious living.',
          features: [
            'Personality and lifestyle matching',
            'Verified user profiles with background checks',
            'Chat and video call before deciding',
            'Preference-based filtering (veg/non-veg, etc.)',
            'Safety screening and verification',
            'Compatibility score system',
            'Dispute resolution support',
            'Privacy protection guaranteed'
          ],
          pricing: 'Free Service'
        }
      ]
    },
    daily: {
      title: 'Daily Living Services',
      subtitle: 'All your daily needs covered by trusted, verified service providers',
      icon: <FaBed />,
      services: [
        {
          icon: <FaUtensils />,
          title: 'Food & Tiffin Services',
          description: 'Enjoy home-cooked, quality meals delivered fresh to your doorstep. Choose from local home chefs and tiffin services.',
          features: [
            'Home-cooked quality assured',
            'Customizable meal plans (veg/non-veg)',
            'Dietary preferences respected (low-oil, etc.)',
            'Monthly/weekly subscription options',
            'Weekly subscription with daily updates',
            'Hygiene-certified kitchens only',
            'Regional cuisine options',
            'Weekend special menus'
          ],
          pricing: 'Starting ₹2,500/month'
        },
        {
          icon: <MdWaterDrop />,
          title: 'Water Delivery',
          description: 'Clean, safe, BIS-certified drinking water delivered on your schedule. Never worry about running out of water.',
          features: [
            '20-gallon water guaranteed',
            'Trustable scheduled delivery',
            'Subscription discounts available',
            'Quality tested and certified',
            'Budget-free payment (Rs. 40)',
            'Emergency supply within 2 hours',
            'Eco-friendly packaging',
            'TDS and pH reports provided'
          ],
          pricing: 'Starting ₹40/can'
        },
        {
          icon: <MdLocalLaundryService />,
          title: 'Laundry & Cleaning',
          description: 'Professional cleaning services for clothes and home spaces. Convenient pick-up and delivery available.',
          features: [
            'Free pickup and delivery',
            'Wash, iron, and fold services',
            'Dry cleaning available',
            'Room and bathroom cleaning',
            'Eco-friendly detergents and products',
            'Express wash in 6 hours',
            'Quality guarantee - re-wash if unsure',
            'Student packages available'
          ],
          pricing: 'Starting ₹5/piece'
        },
        {
          icon: <FaTools />,
          title: 'Repair Services',
          description: 'Expert technicians for all your repair needs - mobile, laptop, cycle, electrical, and plumbing. Quick response with transparent pricing.',
          features: [
            'Mobile phone repairs (screen, battery, etc.)',
            'Laptop repair and upgrades',
            'Cycle maintenance and repairs',
            'Electrical work (switches, fans, lights)',
            'Plumbing services',
            'Super-certified technicians',
            'Transparent pricing - no hidden charges',
            'Quick response within 2 hours',
            'Warranty on all repairs',
            '90-day repair guarantee'
          ],
          pricing: 'Starting ₹150'
        },
        {
          icon: <FaStore />,
          title: 'Local Store Directory',
          description: 'Discover nearby verified stores with exclusive student discounts. From groceries to electronics - everything you need nearby.',
          features: [
            'Verified local vendors',
            'Special student discounts (10-30% off)',
            'Location-based smart search',
            'Genuine ratings and reviews',
            'Direct contact information',
            'Store hours and holiday information',
            'Budget-categorized content',
            'Deal alerts and notifications'
          ],
          pricing: 'Free Access'
        }
      ]
    },
    education: {
      title: 'Education & Career Growth',
      subtitle: 'Accelerate your learning and career with comprehensive educational services',
      icon: <FaGraduationCap />,
      services: [
        {
          icon: <FaBook />,
          title: 'Book Exchange',
          description: 'Buy, sell, or rent textbooks and study material at original prices. Save up to 70% on books.',
          features: [
            'Up to 70% off new book prices',
            'Wide selection - all streams covered',
            'Quality condition guaranteed',
            'Delivery within 3 days',
            'Semester-based rental options',
            'Will buy your used books',
            'Delivery to your doorstep',
            'Rent and save library'
          ],
          pricing: 'Save up to ₹15,000/year'
        },
        {
          icon: <FaChalkboardTeacher />,
          title: 'Online Tutoring',
          description: 'Connect with expert tutors for all subjects and competitive exams. Personalized one-on-one classes available.',
          features: [
            'One-on-one personalized classes',
            'Instant doubt solving support',
            'Flexible timings - book anytime',
            'Recorded classes for revision',
            'All subjects and competitive exams',
            'Free demo class available',
            'Progress tracking and reports',
            'Affordable hourly rates'
          ],
          pricing: 'Starting ₹200/hour'
        },
        {
          icon: <FaLaptop />,
          title: 'Skill Development Courses',
          description: 'Learn from industry-recognized verified courses. Progress your learning with job-oriented certification.',
          features: [
            'Industry-recognized certificates',
            'Hands-on practical projects',
            'Lifetime course access',
            'Expert faculty instructors',
            'Certificate on completion included',
            'Interview preparation sessions',
            'Resume building support',
            'Tech, business, and creative courses'
          ],
          pricing: 'Starting ₹999'
        },
        {
          icon: <FaBriefcase />,
          title: 'Internship Portal',
          description: 'Access verified internship opportunities daily for all skills. Direct application with resume building tools.',
          features: [
            'Verified companies only',
            'Clear stipend information, upfront',
            'Remote and work-from-home options',
            'Application status tracking',
            'Resume building tools',
            'Companies feedback and ratings',
            'Interview tips and resources',
            'Compliance certificate provided'
          ],
          pricing: 'Free for Students'
        },
        {
          icon: <FaBullseye />,
          title: 'Job Placement Platform',
          description: 'Connect with top employers and land your dream job. Direct employer contact with salary insights and negotiation tips.',
          features: [
            'Curated job opportunities',
            'Direct employer contact',
            'Interview guaranteed for eligible candidates',
            'Personalized job recommendations',
            'Salary insights and negotiation tips',
            'Application tracking dashboard',
            'Profile optimization assistance',
            'Student job alerts'
          ],
          pricing: 'Free Registration'
        },
        {
          icon: <FaGraduationCap />,
          title: 'Career Coaching',
          description: 'Get personalized guidance from industry experts and professionals. Plan your career with expert help and tools.',
          features: [
            'Expert mentor assignment',
            'Personalized career goal planning',
            'Communication skills training',
            'Elevator pitch and tools',
            'Regular follow-up sessions',
            'Industry insights and trends',
            'Networking opportunity creation',
            'LinkedIn profile optimization'
          ],
          pricing: 'Starting ₹1,999'
        }
      ]
    },
    lifestyle: {
      title: 'Lifestyle & Transportation',
      subtitle: 'Make your city life convenient, connected, and enjoyable',
      icon: <FaMotorcycle />,
      services: [
        {
          icon: <FaMotorcycle />,
          title: 'Vehicle Rental',
          description: 'Rent cycles, bikes, and e-scooters for convenient city travel. Flexible hourly, daily, or monthly plans.',
          features: [
            'Hourly, daily, and monthly rental options',
            'Well-maintained vehicles guaranteed',
            'Helmet and safety gear included',
            'Comprehensive insurance coverage',
            'Easy booking via app or website',
            'Doorstep delivery available',
            '24/7 breakdown assistance',
            'Student discounts available'
          ],
          pricing: 'Starting ₹50/day'
        },
        {
          icon: <FaUsers />,
          title: 'City Events & Meetups',
          description: 'Discover and join events, meetups, and networking opportunities. Build connections and enjoy your city life.',
          features: [
            'Student-focused meetup events',
            'Professional networking sessions',
            'Cultural events and festivals',
            'Workshops and skill seminars',
            'Group outdoor activities',
            'Community building programs',
            'Exclusive member events',
            'Early bird discounts'
          ],
          pricing: 'Many Free Events'
        },
        {
          icon: <FaGift />,
          title: 'Exclusive Vouchers',
          description: 'Access exclusive discounts and deals from partner businesses. Save on restaurants, entertainment, shopping, and more.',
          features: [
            'Restaurant and cafe discounts',
            'Movie and entertainment deals',
            'Shopping vouchers and cashback',
            'Gym and fitness membership offers',
            'Salon and spa packages',
            'Travel and accommodation deals',
            'New deals added weekly',
            'PRIME members get extra benefits'
          ],
          pricing: 'Save up to 40%'
        }
      ]
    },
    ai: {
      title: 'AI-Powered Features',
      subtitle: 'Experience the future with intelligent, personalized AI assistance',
      icon: <FaRobot />,
      services: [
        {
          icon: <FaComments />,
          title: '24/7 AI Chatbot',
          description: 'Get instant answers to all your questions anytime, anywhere. Our AI understands context and learns from every conversation.',
          features: [
            'Available 24 hours, 365 days',
            'Multi-language support (Hindi, English, etc.)',
            'Context-aware intelligent responses',
            'Service recommendations based on needs',
            'Quick problem-solving assistance',
            'Natural conversation flow',
            'Learn from your preferences',
            'Seamless human handoff when needed'
          ],
          pricing: 'Always Free'
        },
        {
          icon: <FaBullseye />,
          title: 'AI Recommendations',
          description: 'Receive personalized suggestions for PGs, courses, food, and more. Our AI learns your preferences for better matches.',
          features: [
            'Learns your preferences over time',
            'Smart matching algorithms',
            'Cost optimization suggestions',
            'Quality prioritization system',
            'Regular recommendation updates',
            'Preference-based filtering',
            'Collaborative filtering technology',
            'Success rate tracking'
          ],
          pricing: 'Free with Platform'
        },
        {
          icon: <FaMoneyBillWave />,
          title: 'Smart Budget Planner',
          description: 'AI-powered tool to track expenses, set goals, and optimize your spending. Save more with intelligent insights.',
          features: [
            'Automatic expense tracking',
            'Personalized saving goals',
            'Smart spending alerts',
            'Monthly budget reports',
            'Category-wise analysis',
            'Money-saving tips and suggestions',
            'Bill reminders and due dates',
            'Financial health score'
          ],
          pricing: 'PRIME Feature'
        },
        {
          icon: <FaShieldAlt />,
          title: 'Safety Alerts',
          description: 'Intelligent safety features to keep you informed and secure. Real-time alerts based on location and patterns.',
          features: [
            'Location-based safety intelligence',
            'Emergency contacts management',
            'One-tap SOS feature',
            'Area safety insights and ratings',
            'Real-time safety notifications',
            'Check-in and tracking features',
            'Community safety alerts',
            '24/7 emergency support line'
          ],
          pricing: 'Always Free'
        }
      ]
    }
  }

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
          <h1 className="text-5xl lg:text-6xl font-bold mb-6 animate-fade-in-up">Our Services</h1>
          <p className="text-xl mb-12 opacity-90 animate-fade-in-up animation-delay-200">
            Everything you need to live, learn, work, and thrive in your new city -<br />
            all in one powerful ecosystem
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto animate-fade-in-up animation-delay-400">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Services Available</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold mb-2">100%</div>
              <div className="text-lg opacity-90">Verified Providers</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 hover:bg-white/20 transition-all duration-300 hover:scale-105">
              <div className="text-5xl font-bold mb-2">24/7</div>
              <div className="text-lg opacity-90">Support Available</div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Navigation */}
      <section className="relative py-8 bg-white/50 backdrop-blur-sm sticky top-0 z-0 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            {categories.map(category => (
              <button
                key={category.id}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-semibold transition-all duration-300 ${activeCategory === category.id
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                    : 'bg-white text-gray-700 hover:bg-gray-100 hover:scale-105 border-2 border-gray-200'
                  }`}
                onClick={() => setActiveCategory(category.id)}
              >
                <span className="text-xl">{category.icon}</span>
                <span>{category.name}</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Services Content */}
      <section className="relative py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16 z-10 relative">
            <div className="text-6xl mb-6 flex justify-center text-blue-600 animate-fade-in-up">
              {serviceData[activeCategory].icon}
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 animate-fade-in-up animation-delay-200">
              {serviceData[activeCategory].title}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto animate-fade-in-up animation-delay-400">
              {serviceData[activeCategory].subtitle}
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 z-10 relative">
            {serviceData[activeCategory].services.map((service, index) => {
              const borderColors = [
                'border-4 border-blue-500',
                'border-4 border-purple-500',
                'border-4 border-pink-500',
                'border-4 border-cyan-500',
                'border-4 border-indigo-500',
                'border-4 border-violet-500'
              ];
              return (
                <div
                  key={index}
                  className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 hover:scale-105 ${borderColors[index % borderColors.length]} flex flex-col`}
                >
                  <div className="text-5xl text-blue-600 mb-4">{service.icon}</div>
                  <h3 className="text-2xl font-bold text-purple-600 mb-3">{service.title}</h3>
                  <p className="text-gray-600 mb-6 leading-relaxed">{service.description}</p>

                  <ul className="space-y-3 mb-6 flex-grow">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-3">
                        <span className="text-green-500 mt-1 text-lg flex-shrink-0">✓</span>
                        <span className="text-gray-700 text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button className="w-full py-4 px-6 bg-gradient-to-r from-blue-50 to-purple-50 text-purple-700 rounded-xl font-semibold hover:from-blue-600 hover:to-purple-600 hover:text-white transition-all duration-300 hover:shadow-lg">
                    {service.pricing}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  )
}

export default Services