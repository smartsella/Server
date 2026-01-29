import { useGoogleLogin } from '@react-oauth/google';
  // Google Signup Handler
  const googleSignup = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        // Send the id_token to backend for verification
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/google-auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: tokenResponse.id_token })
        });
        const result = await response.json();
        if (result.success && result.user) {
          login(result.user);
          localStorage.setItem('user', JSON.stringify(result.user));
          navigate('/user/dashboard');
        } else {
          alert(result.message || 'Google authentication failed');
        }
      } catch (error) {
        console.error('Failed to authenticate with Google:', error);
        alert('Error during Google authentication');
      }
    },
    onError: () => console.log('Google Signup Failed'),
  });
      {/* Google Signup Button */}
      <div className="mt-6 flex justify-center">
        <button
          type="button"
          onClick={() => googleSignup()}
          className="flex items-center gap-2 py-3 px-6 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105 bg-white shadow"
        >
          <img src="https://upload.wikimedia.org/wikipedia/commons/4/4a/Logo_2013_Google.png" alt="Google" className="w-6 h-6" />
          <span className="font-medium text-gray-700">Sign up with Google</span>
        </button>
      </div>
import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaUser, FaEnvelope, FaLock, FaPhone, FaIdCard, FaUniversity, FaBuilding, FaUsers, FaMapMarkerAlt, FaGoogle, FaFacebook, FaGraduationCap, FaBriefcase, FaHome } from 'react-icons/fa'
import { useUser } from '../../../../context/userContext'

const SignUp = () => {
  const { login } = useUser();
  const navigate = useNavigate();
  const [userType, setUserType] = useState('Student')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    studentId: '',
    university: '',
    company: '',
    employeeId: '',
    familyMembers: '',
    address: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!')
      return
    }
    
    // Validate phone number
    const phoneRegex = /^[0-9]{10}$/
    if (!phoneRegex.test(formData.phone)) {
      alert('Please enter a valid 10-digit phone number')
      return
    }
    
    const signupData = { userType, ...formData }
    console.log('Form submitted:', signupData)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(signupData)
      })
      
      const result = await response.json()
      
      if (result.success) {
        alert('Account created successfully!')
        console.log('Server response:', result)
        navigate('/signin')
      } else {
        alert('Signup failed. Please try again.')
      }
    } catch (error) {
      console.error('Error during signup:', error)
      alert('Error connecting to server')
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-2xl mx-auto relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Create Your Account
          </h2>
          <p className="text-gray-600">Join thousands already making life easier</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-100 animate-fade-in-up animation-delay-200">
          {/* User Type Toggle */}
          <div className="bg-gradient-to-r from-gray-100 to-gray-50 p-1.5 rounded-full flex mb-8 relative shadow-inner">
            <button
              onClick={() => setUserType('Student')}
              className={`flex-1 py-3 px-4 rounded-full font-semibold transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${userType === 'Student'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <FaGraduationCap /> Student
            </button>
            <button
              onClick={() => setUserType('Professional')}
              className={`flex-1 py-3 px-4 rounded-full font-semibold transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${userType === 'Professional'
                ? 'text-white'
                : 'text-gray-600 hover:text-gray-800'
                }`}
            >
              <FaBriefcase /> Professional
            </button>
            {/* <button
              onClick={() => setUserType('Family')}
              className={`flex-1 py-3 px-4 rounded-full font-semibold transition-all duration-300 relative z-10 flex items-center justify-center gap-2 ${
                userType === 'Family'
                  ? 'text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              <FaHome /> Family
            </button> */}
            {/* Sliding Background */}
            <div
              className={`absolute top-1.5 bottom-1.5 w-1/2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full transition-all duration-300 ease-in-out shadow-lg ${userType === 'Student' ? 'left-1.5' :
                'left-1/2'
                }`}
              style={{
                width: 'calc(50% - 0.375rem)'
              }}
            />
          </div>

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Common Fields */}
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FaUser />
                  </div>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2">
                  Email Address
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FaEnvelope />
                  </div>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                    placeholder="you@example.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="phone" className="block text-sm font-semibold text-gray-700 mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FaPhone />
                  </div>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                    pattern="[0-9]{10}"
                    minLength="10"
                    maxLength="10"
                    title="Please enter exactly 10 digits"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                    placeholder="9876543210"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="address" className="block text-sm font-semibold text-gray-700 mb-2">
                  City
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FaMapMarkerAlt />
                  </div>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                    placeholder="Bangalore"
                  />
                </div>
              </div>
            </div>

            {/* Conditional Fields Based on User Type */}
            {userType === 'Student' && (
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="studentId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Student ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <FaIdCard />
                    </div>
                    <input
                      type="text"
                      id="studentId"
                      name="studentId"
                      value={formData.studentId}
                      onChange={handleInputChange}
                      required
                      minLength="3"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                      placeholder="STU123456"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="university" className="block text-sm font-semibold text-gray-700 mb-2">
                    University/College
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <FaUniversity />
                    </div>
                    <input
                      type="text"
                      id="university"
                      name="university"
                      value={formData.university}
                      onChange={handleInputChange}
                      required
                      minLength="3"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                      placeholder="Your University"
                    />
                  </div>
                </div>
              </div>
            )}

            {userType === 'Professional' && (
              <div className="grid md:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="company" className="block text-sm font-semibold text-gray-700 mb-2">
                    Company Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <FaBuilding />
                    </div>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleInputChange}
                      required
                      minLength="3"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                      placeholder="Your Company"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="employeeId" className="block text-sm font-semibold text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <FaIdCard />
                    </div>
                    <input
                      type="text"
                      id="employeeId"
                      name="employeeId"
                      value={formData.employeeId}
                      onChange={handleInputChange}
                      required
                      minLength="3"
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                      placeholder="EMP123456"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* {userType === 'Family' && (
              <div>
                <label htmlFor="familyMembers" className="block text-sm font-semibold text-gray-700 mb-2">
                  Number of Family Members
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FaUsers />
                  </div>
                  <input
                    type="number"
                    id="familyMembers"
                    name="familyMembers"
                    value={formData.familyMembers}
                    onChange={handleInputChange}
                    min="1"
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                    placeholder="4"
                  />
                </div>
              </div>
            )} */}

            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label htmlFor="password" className="block text-sm font-semibold text-gray-700 mb-2">
                  Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    id="password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-semibold text-gray-700 mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                    <FaLock />
                  </div>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 mt-6"
            >
              Create Account
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <NavLink
                to="/signin"
                className="text-blue-600 hover:text-purple-600 font-semibold transition-colors"
              >
                Sign In
              </NavLink>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="mt-6 text-center text-sm text-gray-600 animate-fade-in-up animation-delay-400">
          By creating an account, you agree to our{' '}
          <NavLink to="/term-and-condition" className="text-blue-600 hover:underline">
            Terms
          </NavLink>{' '}
          and{' '}
          <NavLink to="/privacy-policy" className="text-blue-600 hover:underline">
            Privacy Policy
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default SignUp
