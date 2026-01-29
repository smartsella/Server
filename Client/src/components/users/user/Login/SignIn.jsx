import React, { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { FaEnvelope, FaLock, FaGoogle, FaFacebook } from 'react-icons/fa'
import { useGoogleLogin } from '@react-oauth/google'
import { useUser } from '../../../../context/userContext'

const SignIn = () => {
  const { login } = useUser();
  const [formData, setFormData] = useState({
    identifier: '',
    password: ''
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }
  const nav = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('Form submitted:', formData)

    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        // Store user data in localStorage
        localStorage.setItem('user', JSON.stringify(result.user))
        // Update context
        login(result.user)
        console.log('Login successful:', result)
        // Navigate to user dashboard
        nav('/user/dashboard')
      } else {
        alert(result.message || 'Login failed')
      }
    } catch (error) {
      console.error('Error during login:', error)
      alert('Error connecting to server')
    }
  }

  const googleLogin = useGoogleLogin({
    flow: 'implicit',
    onSuccess: async (tokenResponse) => {
      try {
        // Send the id_token to backend for verification
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/google-auth`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ idToken: tokenResponse.id_token, accessToken: tokenResponse.access_token })
        });
        const result = await response.json();
        if (result.success && result.user) {
          login(result.user);
          localStorage.setItem('user', JSON.stringify(result.user));
          nav('/user/dashboard');
        } else {
          alert(result.message || 'Google authentication failed');
        }
      } catch (error) {
        console.error('Failed to authenticate with Google:', error);
        alert('Error during Google authentication');
      }
    },
    onError: () => console.log('Google Login Failed'),
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-12 px-4 sm:px-6 lg:px-8 flex items-center justify-center relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-fade-in-up">
          <h2 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Sign in to continue your journey with Jeevigo</p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-100 animate-fade-in-up animation-delay-200">
          {/* Sign In Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700 mb-2">
                Email / Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                  <FaEnvelope />
                </div>
                <input
                  type="text"
                  id="identifier"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                  placeholder="Enter your email, username or phone"
                />
              </div>
            </div>

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

            {/* Forgot Password Link */}
            <div className="text-right">
              <NavLink to="/forgot-password" className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                Forgot password?
              </NavLink>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
            >
              Sign In
            </button>
          </form>

          {/* Divider */}
          <div className="mt-6 flex items-center">
            <div className="flex-1 border-t border-gray-300"></div>
            <span className="px-4 text-sm text-gray-500">Or continue with</span>
            <div className="flex-1 border-t border-gray-300"></div>
          </div>

          {/* Social Login Buttons */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <button
              onClick={() => googleLogin()}
              className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105"
            >
              <FaGoogle className="text-red-500" />
              <span className="font-medium text-gray-700">Google</span>
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-gray-300 rounded-xl hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 hover:scale-105">
              <FaFacebook className="text-blue-600" />
              <span className="font-medium text-gray-700">Facebook</span>
            </button>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 pt-6 border-t border-gray-200 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <NavLink
                to="/signup"
                className="text-blue-600 hover:text-purple-600 font-semibold transition-colors"
              >
                Sign Up
              </NavLink>
            </p>
          </div>
        </div>

        {/* Additional Info */}
        <p className="mt-6 text-center text-sm text-gray-600 animate-fade-in-up animation-delay-400">
          By signing in, you agree to our{' '}
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

export default SignIn