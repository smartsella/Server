import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { usePartner } from "../../../../context/partnerContext";
import {
  FaUser, FaEnvelope, FaPhone, FaBuilding, FaMapMarkerAlt, FaBed, FaCheckCircle, FaLock,
  FaHome, FaHotel, FaUtensils, FaTint, FaTshirt, FaTools, FaStore,
  FaBook, FaGraduationCap, FaChalkboardTeacher, FaBriefcase, FaUserTie,
  FaCar, FaCalendarAlt, FaTicketAlt, FaEye, FaEyeSlash
} from 'react-icons/fa'
import { MdApartment } from 'react-icons/md'
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
          body: JSON.stringify({ idToken: tokenResponse.id_token, accessToken: tokenResponse.access_token })
        });
        const result = await response.json();
        if (result.success && result.user) {
          register(result.user);
          localStorage.setItem('user', JSON.stringify(result.user));
          navigate('/partner/dashboard');
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

const Signup = () => {
  const [step, setStep] = useState(1)
  const [partnerType, setPartnerType] = useState('')
  const [serviceCategory, setServiceCategory] = useState('')
  const [errors, setErrors] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    // Basic Details
    ownerName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    propertyName: "",
    location: "",
    roomsAvailable: "",

    // Property Type & Pricing
    gender: "",
    roomTypes: [],
    noticePeriod: "",

    // Amenities
    amenities: {
      furniture: [],
      bathroom: [],
      foodKitchen: [],
      utilities: [],
      laundry: [],
      cleaning: [],
      security: [],
      rulesConvenience: [],
      location: [],
    },
  });

  // Service pricing for non-accommodation
  const [servicePricing, setServicePricing] = useState([
    { service_type: "", price: "" },
  ]);

  // Destructure functions from context
  const { register, addProperty, partner } = usePartner() || {
    register: () => { },
    addProperty: () => { },
    partner: null,
  };
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRoomTypeChange = (type, field, value) => {
    const updatedRoomTypes = [...formData.roomTypes];
    const existingIndex = updatedRoomTypes.findIndex((rt) => rt.type === type);

    if (existingIndex >= 0) {
      updatedRoomTypes[existingIndex][field] = value;
    } else {
      updatedRoomTypes.push({ type, [field]: value });
    }

    setFormData({ ...formData, roomTypes: updatedRoomTypes });
  };

  const handleAmenityToggle = (category, amenity) => {
    const currentAmenities = formData.amenities[category] || [];
    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity];

    setFormData({
      ...formData,
      amenities: {
        ...formData.amenities,
        [category]: updatedAmenities,
      },
    });
  };

  // Handle service pricing change
  const handleServicePricingChange = (idx, field, value) => {
    const updated = [...servicePricing];
    updated[idx][field] = value;
    setServicePricing(updated);
  };

  // Add new pricing row
  const addServicePricingRow = () => {
    setServicePricing([...servicePricing, { service_type: "", price: "" }]);
  };

  // Remove pricing row
  const removeServicePricingRow = (idx) => {
    if (servicePricing.length === 1) return;
    setServicePricing(servicePricing.filter((_, i) => i !== idx));
  };

  const handleSubmit = async (e) => {
    e.preventDefault()

    // Validate step 4 for accommodation partners before submission
    if (serviceCategory === 'Accommodation' && step === 4) {
      if (!validateStep4()) {
        window.scrollTo({ top: 0, behavior: 'smooth' })
        return
      }
    }

    console.log('Partner Signup:', { partnerType, serviceCategory, ...formData })
    console.log('Room Types:', JSON.stringify(formData.roomTypes, null, 2))

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters long");
      return;
    }

    try {
      // Send data to backend
      // Prepare payload
      let payload = {
        partnerType,
        serviceCategory,
        ...formData,
      };
      if (serviceCategory !== "Accommodation") {
        // Filter out empty rows
        const filteredPricing = servicePricing.filter(
          (p) => p.service_type && p.price
        );
        payload.servicePricing =
          filteredPricing.length > 0
            ? filteredPricing
            : [{ service_type: "Basic Plan", price: null }];
      }
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/signup`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      const data = await response.json();
      console.log("Backend Response:", data);

      // Handle both response formats: {success: true, data: {...}} or {data: {...}}
      const isSuccess = data.success === true || (data.data && !data.success);

      if (isSuccess) {
        // Map service types to route format
        const serviceTypeMap = {
          "pg partner": "pg-partner",
          "homely pg partner": "homely-pg-partner",
          "flat partner": "flat-partner",
          "food & tiffin service": "food-tiffin-service",
          "water delivery": "water-delivery",
          "laundry & cleaning": "laundry-cleaning",
          "repair services": "repair-services",
          "local store directory": "local-store-directory",
        };

        const partnerTypeLower = partnerType.toLowerCase();
        const mappedServiceType =
          serviceTypeMap[partnerTypeLower] ||
          partnerTypeLower.replace(/\s+/g, "-");

        // Register partner and navigate to dashboard
        const partnerData = {
          ...formData,
          partnerType,
          serviceCategory,
          businessType: serviceCategory,
          serviceType: mappedServiceType,
        };

        register(partnerData);

        // Navigate to dynamic dashboard route
        const categoryMap = {
          Accommodation: "accommodation",
          "Daily Living": "dailyLiving",
          "Education & Career": "educationCareer",
          "Vehicle & Lifestyle": "vehicleLifestyle",
        };
        const businessType = categoryMap[serviceCategory] || "accommodation";

        navigate(`/partner/${businessType}/${mappedServiceType}/dashboard`);
      } else {
        const errorMessage = data.message || data.error || 'Registration failed. Please try again.';
        console.error('Signup failed:', errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      alert("Error submitting form. Please try again.");
    }
  };

  const validateStep1 = () => {
    const newErrors = {}

    // Personal Information
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Full name is required'
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^[0-9]{10}$/.test(formData.phone.replace(/[\s-]/g, ''))) {
      newErrors.phone = 'Phone number must be exactly 10 digits'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email address is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    // Account Security
    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters long'
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password'
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    // Business Information
    if (!formData.propertyName.trim()) {
      newErrors.propertyName = serviceCategory === 'Accommodation' ? 'Property/Business name is required' : 'Business name is required'
    } else if (formData.propertyName.trim().length < 3) {
      newErrors.propertyName = 'Business name must be at least 3 characters long'
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required'
    }

    if (serviceCategory === 'Accommodation' && !formData.roomsAvailable) {
      newErrors.roomsAvailable = 'Number of rooms is required'
    } else if (serviceCategory === 'Accommodation' && formData.roomsAvailable < 1) {
      newErrors.roomsAvailable = 'At least 1 room is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}

    if (serviceCategory === 'Accommodation') {
      // Gender is required for accommodation
      if (!formData.gender) {
        newErrors.gender = 'Please select a gender type'
      }

      // At least one room type with pricing must be filled
      const validRoomTypes = formData.roomTypes.filter(rt => rt.rent && rt.deposit)
      if (validRoomTypes.length === 0) {
        newErrors.roomTypes = 'Please add at least one room type with rent and deposit'
      }

      // Notice period is required
      if (!formData.noticePeriod) {
        newErrors.noticePeriod = 'Notice period is required'
      } else if (formData.noticePeriod < 0) {
        newErrors.noticePeriod = 'Notice period cannot be negative'
      }
    } else {
      // For non-accommodation, at least one service pricing must be filled
      const validPricing = servicePricing.filter(p => p.service_type.trim() && p.price)
      if (validPricing.length === 0) {
        newErrors.servicePricing = 'Please add at least one service type with pricing'
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep3 = () => {
    const newErrors = {}

    if (serviceCategory === 'Accommodation') {
      // Check each amenity category in Step 3
      const step3Categories = ['furniture', 'bathroom', 'foodKitchen', 'utilities']

      step3Categories.forEach(category => {
        if (formData.amenities[category].length === 0) {
          const categoryNames = {
            furniture: 'Room & Furniture',
            bathroom: 'Bathroom',
            foodKitchen: 'Food & Kitchen',
            utilities: 'Utilities'
          }
          newErrors[category] = `Please select at least one ${categoryNames[category]} amenity`
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep4 = () => {
    const newErrors = {}

    if (serviceCategory === 'Accommodation') {
      // Check each amenity category in Step 4
      const step4Categories = ['laundry', 'cleaning', 'security', 'rulesConvenience', 'location']

      step4Categories.forEach(category => {
        if (formData.amenities[category].length === 0) {
          const categoryNames = {
            laundry: 'Laundry',
            cleaning: 'Cleaning & Maintenance',
            security: 'Safety & Security',
            rulesConvenience: 'Rules & Convenience',
            location: 'Location Benefits'
          }
          newErrors[category] = `Please select at least one ${categoryNames[category]} option`
        }
      })
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    // Clear previous errors
    setErrors({})

    // Validate current step
    if (step === 1 && !validateStep1()) {
      // Scroll to top to show errors
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 2 && !validateStep2()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    if (step === 3 && !validateStep3()) {
      window.scrollTo({ top: 0, behavior: 'smooth' })
      return
    }

    // Proceed to next step if validation passes
    if (step < 4) setStep(step + 1)
  }


  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const serviceOptions = {
    accommodation: [
      {
        type: "PG Partner",
        icon: FaHome,
        description: "Paying Guest accommodations",
      },
      {
        type: "Homely Pg Partner",
        icon: FaHotel,
        description: "Hostel facilities",
      },
      {
        type: "Flat Partner",
        icon: MdApartment,
        description: "Rental flats & apartments",
      },
    ],
    dailyLiving: [
      {
        type: "Food & Tiffin Service",
        icon: FaUtensils,
        description: "Meal delivery services",
      },
      {
        type: "Water Delivery",
        icon: FaTint,
        description: "Water supply services",
      },
      {
        type: "Laundry & Cleaning",
        icon: FaTshirt,
        description: "Laundry and cleaning services",
      },
      {
        type: "Repair Services",
        icon: FaTools,
        description: "Home repair services",
      },
      {
        type: "Local Store Directory",
        icon: FaStore,
        description: "Local shops & stores",
      },
    ],
    educationCareer: [
      {
        type: "Book Exchange",
        icon: FaBook,
        description: "Buy, sell & exchange books",
      },
      {
        type: "Online Tutor",
        icon: FaChalkboardTeacher,
        description: "Online tutoring services",
      },
      {
        type: "Skill Development Courses",
        icon: FaGraduationCap,
        description: "Professional courses",
      },
      {
        type: "Internship Portal",
        icon: FaBriefcase,
        description: "Internship opportunities",
      },
      {
        type: "Job Placement Platform",
        icon: FaUserTie,
        description: "Job placement services",
      },
      {
        type: "Career Coaching",
        icon: FaGraduationCap,
        description: "Career guidance & coaching",
      },
    ],
    vehicleLifestyle: [
      {
        type: "Vehicle Rental",
        icon: FaCar,
        description: "Bike & car rentals",
      },
      {
        type: "City Events & Meetups",
        icon: FaCalendarAlt,
        description: "Local events & networking",
      },
      {
        type: "Exclusive Vouchers",
        icon: FaTicketAlt,
        description: "Deals & discount vouchers",
      },
    ],
  };

  const amenitiesOptions = {
    furniture: [
      "Furnished",
      "Semi-furnished",
      "Bed with mattress",
      "Pillow, bedsheet, blanket",
      "Cupboard/Wardrobe",
      "Study table & chair",
      "Curtains",
      "Fan",
      "Light",
      "Air conditioner/Heater",
    ],
    bathroom: [
      "Attached bathroom",
      "Common bathroom",
      "24×7 water supply (hot & cold)",
      "Geyser",
      "Western toilet",
      "Indian toilet",
      "Mirror",
      "Bucket & mug",
      "Regular cleaning",
    ],
    foodKitchen: [
      "Breakfast included",
      "Lunch included",
      "Dinner included",
      "RO drinking water",
      "Common dining area",
      "Refrigerator",
      "Microwave",
    ],
    utilities: [
      "High-speed Wi-Fi",
      "Electricity included",
      "Power backup/Inverter",
      "Water purifier (RO)",
    ],
    laundry: ["Washing machine", "Drying area", "Iron available"],
    cleaning: [
      "Daily room cleaning",
      "Alternate day cleaning",
      "Washroom cleaning",
      "Garbage disposal",
      "Pest control",
    ],
    security: [
      "CCTV cameras",
      "Secure entry/Biometric",
      "Key access",
      "Warden/Caretaker",
      "Fire safety equipment",
      "First-aid kit",
    ],
    rulesConvenience: [
      "Flexible entry/exit timing",
      "Visitor policy",
      "Quiet hours enforced",
      "Two-wheeler parking",
      "Four-wheeler parking",
      "Lift available",
    ],
    location: [
      "Near college/office",
      "Public transport access",
      "Nearby shops/pharmacy",
      "Hospital nearby",
    ],
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 py-8 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>
      </div>
      <div className="max-w-4xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-6 animate-fade-in-up">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            {partner ? "Add New Property" : "Partner Registration"}
          </h2>
          <p className="text-gray-600">
            {partner
              ? "Expand your portfolio with Jeevigo"
              : "Join Jeevigo as a Partner"}
          </p>
        </div>

        {/* Progress Indicator */}
        {partnerType && (
          <div className="mb-6 flex justify-center items-center space-x-4">
            {(serviceCategory === "Accommodation" ? [1, 2, 3, 4] : [1, 2]).map(
              (s) => (
                <div key={s} className="flex items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${step >= s
                        ? "bg-blue-600 text-white"
                        : "bg-gray-300 text-gray-600"
                      }`}
                  >
                    {s}
                  </div>
                  {s < (serviceCategory === "Accommodation" ? 4 : 2) && (
                    <div
                      className={`w-12 h-1 ${step > s ? "bg-blue-600" : "bg-gray-300"
                        }`}
                    ></div>
                  )}
                </div>
              )
            )}
          </div>
        )}

        <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-2xl p-6 border border-purple-100">
          <form onSubmit={handleSubmit}>
            {/* Step 1: Service Category Selection */}
            {step === 1 && !serviceCategory && (
              <div className="space-y-6 animate-fade-in">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    Choose Your Service Category
                  </h3>
                  <p className="text-gray-600">
                    Select the category that best describes your business
                  </p>
                </div>

                {/* Accommodation */}
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-blue-700 flex items-center gap-2">
                    <FaBuilding className="text-blue-600" />
                    Accommodation Services
                  </h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {serviceOptions.accommodation.map((service) => (
                      <button
                        key={service.type}
                        type="button"
                        onClick={() => {
                          setServiceCategory("Accommodation");
                          setPartnerType(service.type);
                        }}
                        className="p-4 border-2 border-gray-300 rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-300 hover:scale-105 text-left"
                      >
                        <service.icon className="text-3xl text-blue-600 mb-2" />
                        <h5 className="font-bold text-gray-900 mb-1">
                          {service.type}
                        </h5>
                        <p className="text-xs text-gray-600">
                          {service.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Daily Living */}
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-purple-700 flex items-center gap-2">
                    <FaUtensils className="text-purple-600" />
                    Daily Living Services
                  </h4>
                  <div className="grid md:grid-cols-3 lg:grid-cols-5 gap-3">
                    {serviceOptions.dailyLiving.map((service) => (
                      <button
                        key={service.type}
                        type="button"
                        onClick={() => {
                          setServiceCategory("Daily Living");
                          setPartnerType(service.type);
                        }}
                        className="p-4 border-2 border-gray-300 rounded-xl hover:border-purple-500 hover:bg-purple-50 transition-all duration-300 hover:scale-105 text-left"
                      >
                        <service.icon className="text-3xl text-purple-600 mb-2" />
                        <h5 className="font-bold text-gray-900 mb-1 text-sm">
                          {service.type}
                        </h5>
                        <p className="text-xs text-gray-600">
                          {service.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Education & Career */}
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-green-700 flex items-center gap-2">
                    <FaGraduationCap className="text-green-600" />
                    Education & Career Services
                  </h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {serviceOptions.educationCareer.map((service) => (
                      <button
                        key={service.type}
                        type="button"
                        onClick={() => {
                          setServiceCategory("Education & Career");
                          setPartnerType(service.type);
                        }}
                        className="p-4 border-2 border-gray-300 rounded-xl hover:border-green-500 hover:bg-green-50 transition-all duration-300 hover:scale-105 text-left"
                      >
                        <service.icon className="text-3xl text-green-600 mb-2" />
                        <h5 className="font-bold text-gray-900 mb-1 text-sm">
                          {service.type}
                        </h5>
                        <p className="text-xs text-gray-600">
                          {service.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Vehicle & Lifestyle */}
                <div className="space-y-3">
                  <h4 className="text-lg font-bold text-orange-700 flex items-center gap-2">
                    <FaCar className="text-orange-600" />
                    Vehicle & Lifestyle Services
                  </h4>
                  <div className="grid md:grid-cols-3 gap-3">
                    {serviceOptions.vehicleLifestyle.map((service) => (
                      <button
                        key={service.type}
                        type="button"
                        onClick={() => {
                          setServiceCategory("Vehicle & Lifestyle");
                          setPartnerType(service.type);
                        }}
                        className="p-4 border-2 border-gray-300 rounded-xl hover:border-orange-500 hover:bg-orange-50 transition-all duration-300 hover:scale-105 text-left"
                      >
                        <service.icon className="text-3xl text-orange-600 mb-2" />
                        <h5 className="font-bold text-gray-900 mb-1">
                          {service.type}
                        </h5>
                        <p className="text-xs text-gray-600">
                          {service.description}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Step 1: Basic Details */}
            {step === 1 && partnerType && (
              <div className="space-y-4 animate-fade-in">
                <div className="mb-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
                  <p className="text-sm text-gray-600">
                    Selected:{" "}
                    <span className="font-bold text-blue-600">
                      {partnerType}
                    </span>{" "}
                    in {serviceCategory}
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setPartnerType('')
                      setServiceCategory('')
                      setErrors({})
                    }}
                    className="text-xs text-blue-600 hover:text-blue-800 underline mt-1"
                  >
                    Change selection
                  </button>
                </div>
                {Object.keys(errors).length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</p>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {Object.values(errors).map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-4">Basic Details</h3>

                <div className="space-y-4">
                  {/* Personal Information Section */}
                  <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-bold text-blue-900 mb-3">
                      Personal Information
                    </h4>
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Full Name *
                          </label>
                          <div className="relative">
                            <FaUser className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                              type="text"
                              name="ownerName"
                              value={formData.ownerName}
                              onChange={handleInputChange}
                              required
                              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${errors.ownerName ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="Enter your full name"
                            />
                            {errors.ownerName && <p className="text-red-500 text-xs mt-1">{errors.ownerName}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Phone Number *
                          </label>
                          <div className="relative">
                            <FaPhone className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                              type="tel"
                              name="phone"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${errors.phone ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="+91 98765 43210"
                            />
                            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Email Address *
                        </label>
                        <div className="relative">
                          <FaEnvelope className="absolute left-4 top-3.5 text-gray-400" />
                          <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                            className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="your.email@example.com"
                          />
                          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Account Security Section */}
                  <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
                    <h4 className="text-sm font-bold text-purple-900 mb-3">
                      Account Security
                    </h4>
                    <div className="grid md:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Password *
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            required
                            minLength={6}
                            className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Min. 6 characters"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                          </button>
                          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Confirm Password *
                        </label>
                        <div className="relative">
                          <FaLock className="absolute left-4 top-3.5 text-gray-400" />
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            required
                            minLength={6}
                            className={`w-full pl-12 pr-12 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${errors.confirmPassword ? 'border-red-500' : 'border-gray-300'}`}
                            placeholder="Re-enter password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-4 top-3.5 text-gray-400 hover:text-gray-600 transition-colors"
                          >
                            {showConfirmPassword ? <FaEyeSlash size={18} /> : <FaEye size={18} />}
                          </button>
                          {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Password must be at least 6 characters long
                    </p>
                  </div>

                  {/* Business Information Section */}
                  <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
                    <h4 className="text-sm font-bold text-green-900 mb-3">
                      Business Information
                    </h4>
                    <div className="space-y-3">
                      <div className="grid md:grid-cols-2 gap-3">
                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            {serviceCategory === "Accommodation"
                              ? "Property/Business Name *"
                              : "Business Name *"}
                          </label>
                          <div className="relative">
                            <FaBuilding className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                              type="text"
                              name="propertyName"
                              value={formData.propertyName}
                              onChange={handleInputChange}
                              required
                              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${errors.propertyName ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="Your business name"
                            />
                            {errors.propertyName && <p className="text-red-500 text-xs mt-1">{errors.propertyName}</p>}
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Location *
                          </label>
                          <div className="relative">
                            <FaMapMarkerAlt className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                              type="text"
                              name="location"
                              value={formData.location}
                              onChange={handleInputChange}
                              required
                              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${errors.location ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="City, Area"
                            />
                            {errors.location && <p className="text-red-500 text-xs mt-1">{errors.location}</p>}
                          </div>
                        </div>
                      </div>

                      {serviceCategory === "Accommodation" && (
                        <div className="md:w-1/2 md:pr-1.5">
                          <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Rooms Available *
                          </label>
                          <div className="relative">
                            <FaBed className="absolute left-4 top-3.5 text-gray-400" />
                            <input
                              type="number"
                              name="roomsAvailable"
                              value={formData.roomsAvailable}
                              onChange={handleInputChange}
                              required
                              min="1"
                              className={`w-full pl-12 pr-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none bg-white ${errors.roomsAvailable ? 'border-red-500' : 'border-gray-300'}`}
                              placeholder="Number of rooms"
                            />
                            {errors.roomsAvailable && <p className="text-red-500 text-xs mt-1">{errors.roomsAvailable}</p>}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex justify-end mt-6">
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Service Details & Pricing */}
            {step === 2 && (
              <div className="space-y-4 animate-fade-in">
                {Object.keys(errors).length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</p>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {Object.values(errors).map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {serviceCategory === "Accommodation"
                    ? "Property Type & Pricing"
                    : "Service Details & Pricing"}
                </h3>

                {serviceCategory === "Accommodation" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Gender Type *</label>
                    <div className="flex gap-4">
                      {["Male", "Female", "Co-living"].map((gender) => (
                        <label
                          key={gender}
                          className="flex items-center space-x-2 cursor-pointer"
                        >
                          <input
                            type="radio"
                            name="gender"
                            value={gender}
                            checked={formData.gender === gender}
                            onChange={handleInputChange}
                            className="w-4 h-4 text-blue-600"
                          />
                          <span className="text-gray-700">{gender}</span>
                        </label>
                      ))}
                    </div>                    {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}                  </div>
                )}

                {/* Room Types based on Partner Type */}
                {(partnerType === "PG Partner" ||
                  partnerType === "Homely Pg Partner") && (
                    <div className="space-y-3">
                      <label className="block text-sm font-semibold text-gray-700">PG Room Types & Pricing *</label>
                      <p className="text-xs text-gray-600">Add at least one room type with rent and deposit</p>
                      {['Single Sharing', 'Double Sharing', 'Triple Sharing'].map((type) => (
                        <div key={type} className="p-4 border border-gray-300 rounded-xl">
                          <h4 className="font-semibold text-gray-900 mb-2">{type}</h4>
                          <div className="grid md:grid-cols-2 gap-3">
                            <input
                              type="number"
                              placeholder="Monthly Rent (₹)"
                              onChange={(e) => handleRoomTypeChange(type, 'rent', e.target.value)}
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                            <input
                              type="number"
                              placeholder="Security Deposit (₹)"
                              onChange={(e) => handleRoomTypeChange(type, 'deposit', e.target.value)}
                              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                            />
                          </div>
                        </div>
                      ))}
                      {errors.roomTypes && <p className="text-red-500 text-xs mt-1">{errors.roomTypes}</p>}
                    </div>
                  )}

                {partnerType === "Flat Partner" && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Flat Configuration & Pricing *</label>
                    <p className="text-xs text-gray-600">Add at least one flat type with rent and deposit</p>
                    {['1 BHK', '2 BHK', '3 BHK', '4 BHK or More'].map((type) => (
                      <div key={type} className="p-4 border border-gray-300 rounded-xl">
                        <h4 className="font-semibold text-gray-900 mb-2">{type}</h4>
                        <div className="grid md:grid-cols-2 gap-3">
                          <input
                            type="number"
                            placeholder="Monthly Rent (₹)"
                            onChange={(e) => handleRoomTypeChange(type, 'rent', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                          <input
                            type="number"
                            placeholder="Security Deposit (₹)"
                            onChange={(e) => handleRoomTypeChange(type, 'deposit', e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                          />
                        </div>
                      </div>
                    ))}
                    {errors.roomTypes && <p className="text-red-500 text-xs mt-1">{errors.roomTypes}</p>}
                  </div>
                )}

                {/* Service-based pricing for non-accommodation partners */}
                {serviceCategory !== "Accommodation" && (
                  <div className="space-y-3">
                    <label className="block text-sm font-semibold text-gray-700">Service Pricing Details *</label>
                    <p className="text-xs text-gray-600">Add at least one service type with pricing</p>
                    {servicePricing.map((row, idx) => (
                      <div
                        key={idx}
                        className="p-4 border border-gray-300 rounded-xl mb-2 flex flex-col md:flex-row gap-3 items-center"
                      >
                        <input
                          type="text"
                          placeholder="Service Type (e.g., Basic Plan)"
                          value={row.service_type}
                          onChange={(e) =>
                            handleServicePricingChange(
                              idx,
                              "service_type",
                              e.target.value
                            )
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-1/2"
                        />
                        <input
                          type="number"
                          placeholder="Price (₹)"
                          value={row.price}
                          onChange={(e) =>
                            handleServicePricingChange(
                              idx,
                              "price",
                              e.target.value
                            )
                          }
                          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none w-full md:w-1/2"
                        />
                        <button
                          type="button"
                          onClick={() => removeServicePricingRow(idx)}
                          className="text-red-500 text-xs ml-2"
                        >
                          Remove
                        </button>
                      </div>
                    ))}
                    <button type="button" onClick={addServicePricingRow} className="text-blue-600 text-sm underline mt-1">+ Add Pricing Option</button>
                    {errors.servicePricing && <p className="text-red-500 text-xs mt-1">{errors.servicePricing}</p>}
                  </div>
                )}

                {serviceCategory === "Accommodation" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Notice Period (days) *</label>
                    <input
                      type="number"
                      name="noticePeriod"
                      value={formData.noticePeriod}
                      onChange={handleInputChange}
                      required
                      min="0"
                      className={`w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${errors.noticePeriod ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="e.g., 30"
                    />
                    {errors.noticePeriod && <p className="text-red-500 text-xs mt-1">{errors.noticePeriod}</p>}
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                  >
                    Back
                  </button>
                  {serviceCategory === "Accommodation" ? (
                    <button
                      type="button"
                      onClick={nextStep}
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                    >
                      Next
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                    >
                      <FaCheckCircle /> Submit Registration
                    </button>
                  )}
                </div>
              </div>
            )}

            {/* Step 3: Amenities/Features - Part 1 (Accommodation Only) */}
            {step === 3 && serviceCategory === "Accommodation" && (
              <div className="space-y-4 animate-fade-in max-h-[600px] overflow-y-auto">
                {Object.keys(errors).length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</p>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {Object.values(errors).map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {serviceCategory === "Accommodation"
                    ? "Amenities & Facilities (Part 1)"
                    : "Service Features & Details (Part 1)"}
                </h3>

                {/* Room & Furniture */}
                <div className={`p-4 bg-gray-50 rounded-xl ${errors.furniture ? 'border-2 border-red-500' : ''}`}>
                  <h4 className="font-semibold text-gray-900 mb-3">Room & Furniture *</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {amenitiesOptions.furniture.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.furniture.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityToggle("furniture", amenity)
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {errors.furniture && <p className="text-red-500 text-xs mt-2">{errors.furniture}</p>}
                </div>

                {/* Bathroom */}
                <div className={`p-4 bg-gray-50 rounded-xl ${errors.bathroom ? 'border-2 border-red-500' : ''}`}>
                  <h4 className="font-semibold text-gray-900 mb-3">Bathroom *</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {amenitiesOptions.bathroom.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.bathroom.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityToggle("bathroom", amenity)
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {errors.bathroom && <p className="text-red-500 text-xs mt-2">{errors.bathroom}</p>}
                </div>

                {/* Food & Kitchen */}
                <div className={`p-4 bg-gray-50 rounded-xl ${errors.foodKitchen ? 'border-2 border-red-500' : ''}`}>
                  <h4 className="font-semibold text-gray-900 mb-3">Food & Kitchen *</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {amenitiesOptions.foodKitchen.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.foodKitchen.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityToggle("foodKitchen", amenity)
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {errors.foodKitchen && <p className="text-red-500 text-xs mt-2">{errors.foodKitchen}</p>}
                </div>

                {/* Utilities */}
                <div className={`p-4 bg-gray-50 rounded-xl ${errors.utilities ? 'border-2 border-red-500' : ''}`}>
                  <h4 className="font-semibold text-gray-900 mb-3">Utilities *</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {amenitiesOptions.utilities.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.utilities.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityToggle("utilities", amenity)
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {errors.utilities && <p className="text-red-500 text-xs mt-2">{errors.utilities}</p>}
                </div>

                <div className="flex justify-between mt-6 sticky bottom-0 bg-white pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="button"
                    onClick={nextStep}
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Amenities/Features - Part 2 (Accommodation Only) */}
            {step === 4 && serviceCategory === "Accommodation" && (
              <div className="space-y-4 animate-fade-in max-h-[600px] overflow-y-auto">
                {Object.keys(errors).length > 0 && (
                  <div className="p-4 bg-red-50 border border-red-200 rounded-xl">
                    <p className="text-sm font-semibold text-red-800 mb-2">Please fix the following errors:</p>
                    <ul className="list-disc list-inside text-sm text-red-700 space-y-1">
                      {Object.values(errors).map((error, idx) => (
                        <li key={idx}>{error}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  {serviceCategory === "Accommodation"
                    ? "Amenities & Facilities (Part 2)"
                    : "Service Features & Details (Part 2)"}
                </h3>

                {/* Laundry */}
                <div className={`p-4 bg-gray-50 rounded-xl ${errors.laundry ? 'border-2 border-red-500' : ''}`}>
                  <h4 className="font-semibold text-gray-900 mb-3">Laundry *</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {amenitiesOptions.laundry.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.laundry.includes(amenity)}
                          onChange={() =>
                            handleAmenityToggle("laundry", amenity)
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {errors.laundry && <p className="text-red-500 text-xs mt-2">{errors.laundry}</p>}
                </div>

                {/* Cleaning & Maintenance */}
                <div className={`p-4 bg-gray-50 rounded-xl ${errors.cleaning ? 'border-2 border-red-500' : ''}`}>
                  <h4 className="font-semibold text-gray-900 mb-3">Cleaning & Maintenance *</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {amenitiesOptions.cleaning.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.cleaning.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityToggle("cleaning", amenity)
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {errors.cleaning && <p className="text-red-500 text-xs mt-2">{errors.cleaning}</p>}
                </div>

                {/* Safety & Security */}
                <div className={`p-4 bg-gray-50 rounded-xl ${errors.security ? 'border-2 border-red-500' : ''}`}>
                  <h4 className="font-semibold text-gray-900 mb-3">Safety & Security *</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {amenitiesOptions.security.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.security.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityToggle("security", amenity)
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {errors.security && <p className="text-red-500 text-xs mt-2">{errors.security}</p>}
                </div>

                {/* Rules & Convenience */}
                <div className={`p-4 bg-gray-50 rounded-xl ${errors.rulesConvenience ? 'border-2 border-red-500' : ''}`}>
                  <h4 className="font-semibold text-gray-900 mb-3">Rules & Convenience *</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {amenitiesOptions.rulesConvenience.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.rulesConvenience.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityToggle("rulesConvenience", amenity)
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {errors.rulesConvenience && <p className="text-red-500 text-xs mt-2">{errors.rulesConvenience}</p>}
                </div>

                {/* Location Benefits */}
                <div className={`p-4 bg-gray-50 rounded-xl ${errors.location ? 'border-2 border-red-500' : ''}`}>
                  <h4 className="font-semibold text-gray-900 mb-3">Location Benefits *</h4>
                  <div className="grid md:grid-cols-2 gap-2">
                    {amenitiesOptions.location.map((amenity) => (
                      <label
                        key={amenity}
                        className="flex items-center space-x-2 cursor-pointer"
                      >
                        <input
                          type="checkbox"
                          checked={formData.amenities.location.includes(
                            amenity
                          )}
                          onChange={() =>
                            handleAmenityToggle("location", amenity)
                          }
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <span className="text-sm text-gray-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                  {errors.location && <p className="text-red-500 text-xs mt-2">{errors.location}</p>}
                </div>

                <div className="flex justify-between mt-6 sticky bottom-0 bg-white pt-4">
                  <button
                    type="button"
                    onClick={prevStep}
                    className="px-8 py-3 bg-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-400 transition-all"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg hover:scale-105 transition-all flex items-center gap-2"
                  >
                    <FaCheckCircle />{" "}
                    {partner ? "Add Property" : "Submit Registration"}
                  </button>
                </div>
              </div>
            )}
          </form>

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

          {/* Sign In Link - Only show if not logged in */}
          {!partner && (
            <div className="mt-6 pt-6 border-t border-gray-200 text-center">
              <p className="text-gray-600">
                Already have an account?{" "}
                <NavLink
                  to="/partner-signin"
                  className="text-blue-600 hover:text-purple-600 font-semibold transition-colors"
                >
                  Sign In
                </NavLink>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Signup;
