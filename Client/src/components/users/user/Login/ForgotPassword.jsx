import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { FaEnvelope, FaArrowLeft, FaKey, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState("");
  const [step, setStep] = useState("EMAIL"); // EMAIL | OTP | RESET_PASSWORD
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, userType: "user" }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to send OTP");
      }

      // Show OTP in development (fetched from backend)
      if (data.otp) {
        alert(`OTP for testing: ${data.otp}`);
      }

      setStep("OTP");
    } catch (err) {
      setError(err.message || "Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier, otp, userType: "user" }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Invalid OTP");
      }

      // Store reset token and move to password reset step
      if (data.resetToken) {
        setResetToken(data.resetToken);
        setStep("RESET_PASSWORD");
      } else {
        throw new Error("Reset token not received");
      }
    } catch (err) {
      setError(err.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError("");

    // Validate passwords
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          resetToken, 
          newPassword, 
          userType: "user" 
        }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Failed to reset password");
      }

      // Success - redirect to login
      alert("Password reset successfully! Please login with your new password.");
      navigate("/signin");
    } catch (err) {
      setError(err.message || "Failed to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
            Forgot Password?
          </h2>
          <p className="text-gray-600">
            {step === "EMAIL" 
              ? "Enter your email or phone number to reset your password"
              : step === "OTP"
              ? "Enter the OTP sent to your email/phone"
              : "Create a new password for your account"
            }
          </p>
        </div>

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-purple-100 animate-fade-in-up animation-delay-200">
          {step === "EMAIL" ? (
            <>
              {/* Reset Form */}
              <form onSubmit={sendOtp} className="space-y-6">
                <div>
                  <label htmlFor="identifier" className="block text-sm font-semibold text-gray-700 mb-2">
                    Email
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
                      <FaEnvelope />
                    </div>
                    <input
                      type="text"
                      id="identifier"
                      name="identifier"
                      value={identifier}
                      onChange={(e) => setIdentifier(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all hover:border-blue-400"
                      placeholder="you@example.com or +91 9876543210"
                    />
                  </div>
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>

                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
              </form>

              {/* Back to Sign In */}
              <div className="mt-6 text-center">
                <NavLink 
                  to="/signin" 
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-purple-600 font-semibold transition-colors"
                >
                  <FaArrowLeft />
                  Back to Sign In
                </NavLink>
              </div>
            </>
          ) : step === "OTP" ? (
            <>
              {/* OTP Form */}
              <form onSubmit={verifyOtp} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Enter OTP
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <FaKey />
                    </div>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-green-500 outline-none"
                      placeholder="6-digit OTP"
                    />
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-green-600 to-blue-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setStep("EMAIL");
                    setOtp("");
                    setError("");
                  }}
                  className="w-full text-sm text-blue-600 font-semibold hover:text-purple-600 transition"
                >
                  Change email / phone
                </button>

                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
              </form>

              {/* Back to Sign In */}
              <div className="mt-6 text-center">
                <NavLink 
                  to="/signin" 
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-purple-600 font-semibold transition-colors"
                >
                  <FaArrowLeft />
                  Back to Sign In
                </NavLink>
              </div>
            </>
          ) : (
            <>
              {/* Reset Password Form */}
              <form onSubmit={resetPassword} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Enter new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center text-gray-400">
                      <FaLock />
                    </div>
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
                      placeholder="Confirm new password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                  </div>
                </div>

                <button 
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:scale-105 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Resetting..." : "Reset Password"}
                </button>

                {error && <p className="text-red-500 text-sm text-center mt-2">{error}</p>}
              </form>

              {/* Back to Sign In */}
              <div className="mt-6 text-center">
                <NavLink 
                  to="/signin" 
                  className="inline-flex items-center gap-2 text-blue-600 hover:text-purple-600 font-semibold transition-colors"
                >
                  <FaArrowLeft />
                  Back to Sign In
                </NavLink>
              </div>
            </>
          )}
        </div>

        {/* Additional Info */}
        <p className="mt-6 text-center text-sm text-gray-600 animate-fade-in-up animation-delay-400">
          Need help?{' '}
          <NavLink to="/contact" className="text-blue-600 hover:underline">
            Contact Support
          </NavLink>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword
