import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePartner } from '../../../../../../context/partnerContext'
import {
  FaUtensils, FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCheckCircle,
  FaTrash, FaCamera, FaPlus, FaLeaf, FaRupeeSign, FaList
} from 'react-icons/fa'

const FoodProfile = () => {
  const navigate = useNavigate()
  const { partner } = usePartner()
  const { serviceType } = useParams()
  const [activeTab, setActiveTab] = useState('details')
  const [step, setStep] = useState(1)
  const [showAddCuisineForm, setShowAddCuisineForm] = useState(false)
  const [newCuisineName, setNewCuisineName] = useState('')
  const [selectedCuisine, setSelectedCuisine] = useState(null)
  const [loading, setLoading] = useState(true)

  const [dashboardData, setDashboardData] = useState({
    id: '',
    ownerName: '',
    phoneNumber: '',
    email: '',
    businessName: '',
    locationArea: '',
    cuisineType: '',
    // New Service Pricing Field
    servicePricing: [], // Array of { type: '', price: '' }
    dailySpecials: { items: [], newSpecial: '' },
    photos: { kitchen: null, dish1: null, menu: null },
    cuisines: [
      { name: 'North Indian', vegMenu: null, nonVegMenu: null },
      { name: 'South Indian', vegMenu: null, nonVegMenu: null }
    ]
  })

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        setLoading(true)

        // Get partner email from context or storage - check multiple possible locations
        let partnerEmail = partner?.email || partner?.basicDetails?.email

        if (!partnerEmail) {
          const storedPartner = sessionStorage.getItem('partner_session')
          if (storedPartner) {
            try {
              const parsed = JSON.parse(storedPartner)
              partnerEmail = parsed?.email || parsed?.basicDetails?.email
            } catch (e) {
              console.error('Error parsing stored partner:', e)
            }
          }
        }

        if (!partnerEmail) {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser)
              partnerEmail = parsed?.email || parsed?.basicDetails?.email
            } catch (e) {
              console.error('Error parsing stored user:', e)
            }
          }
        }


        console.log('📧 Resolved partner email:', partnerEmail)
        console.log('📦 Partner basicDetails:', partner?.basicDetails)

        // If we have basicDetails from login, use it immediately
        if (partner?.basicDetails) {
          console.log('✅ Setting initial data from partner.basicDetails')
          setDashboardData(prev => ({
            ...prev,
            id: partner.basicDetails.id || prev.id,
            ownerName: partner.basicDetails.ownerName || prev.ownerName,
            phoneNumber: partner.basicDetails.phoneNumber || prev.phoneNumber,
            email: partner.basicDetails.email || prev.email,
            businessName: partner.basicDetails.businessName || prev.businessName,
            locationArea: partner.basicDetails.locationArea || prev.locationArea,
            serviceCategory: partner.basicDetails.serviceCategory || prev.serviceCategory,
            dailySpecials: {
              items: Array.isArray(partner.basicDetails.dailySpecials) ? partner.basicDetails.dailySpecials : [],
              newSpecial: ''
            }
          }))
        }

        if (!partnerEmail) {
          console.warn('⚠️  No partner email found')

          setLoading(false)
          return
        }

        // Fetch partner service details from backend
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`)

        const result = await response.json()

        console.log('API Response:', result)

        if (result.success && result.data) {
          // result.data is a single object, not an array
          const service = result.data

          console.log('✅ Service data from API:', service)

          // Parse service_catalog only (no service_pricing)
          const catalog = service.service_catalog || {}
          setDashboardData(prev => ({
            ...prev,
            id: service.id || prev.id,
            ownerName: service.owner_name || prev.ownerName,
            phoneNumber: service.phone_number || prev.phoneNumber,
            email: service.email_id || prev.email,
            businessName: service.business_name || service.property_name || prev.businessName,
            locationArea: service.location || prev.locationArea,
            cuisineType: catalog.cuisineType || prev.cuisineType,
            dailySpecials: {
              items: Array.isArray(service.offers?.food) ? service.offers.food : [],
              newSpecial: ''
            },
            photos: prev.photos, // Keep photos in local state only
            cuisines: catalog.cuisines || prev.cuisines
          }))

          console.log('✅ Dashboard data updated from API')
        } else {
          console.warn('⚠️  No service data from API, keeping existing data from basicDetails')
        }
      } catch (error) {
        console.error('Error fetching partner details:', error)
        if (partner?.basicDetails) updateDashboardData(partner.basicDetails)
      } finally {
        setLoading(false)
      }
    }

    fetchPartnerDetails()
  }, [partner])



  const handleDashboardChange = (e) => {
    const { name, value } = e.target
    setDashboardData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      setDashboardData(prev => ({
        ...prev,
        photos: { ...prev.photos, [type]: URL.createObjectURL(file) }
      }))
    }
  }

  // --- Pricing Logic ---
  const handleAddPricingOption = () => {
    setDashboardData(prev => ({
      ...prev,
      servicePricing: [...prev.servicePricing, { type: '', price: '' }]
    }))
  }

  const handlePricingChange = (index, field, value) => {
    const updatedPricing = [...dashboardData.servicePricing]
    updatedPricing[index][field] = value
    setDashboardData(prev => ({ ...prev, servicePricing: updatedPricing }))
  }

  const handleRemovePricingOption = (index) => {
    setDashboardData(prev => ({
      ...prev,
      servicePricing: prev.servicePricing.filter((_, i) => i !== index)
    }))
  }
  // ---------------------

  // --- Cuisine Logic ---
  const handleAddCuisine = async () => {
    if (newCuisineName.trim()) {
      const updatedCuisines = [...dashboardData.cuisines, { name: newCuisineName, vegMenu: null, nonVegMenu: null }];
      setDashboardData(prev => ({
        ...prev,
        cuisines: updatedCuisines
      }));

      // Save to database immediately
      try {
        const partnerEmail = partner?.email || partner?.basicDetails?.email ||
          JSON.parse(sessionStorage.getItem('partner_session') || '{}')?.email ||
          JSON.parse(localStorage.getItem('user') || '{}')?.email;

        if (!partnerEmail) {
          alert('Unable to save: Email not found.');
          return;
        }

        const offersData = {
          food: Array.isArray(dashboardData.dailySpecials?.items) ? dashboardData.dailySpecials.items : []
        };
        const serviceCatalog = {
          cuisineType: dashboardData.cuisineType || '',
          cuisines: updatedCuisines.map(cuisine => ({
            name: cuisine.name,
            vegMenu: cuisine.vegMenu || null,
            nonVegMenu: cuisine.nonVegMenu || null
          }))
        };

        await fetch(`http://localhost:5000/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceCatalog,
            offers: offersData
          })
        });

        setNewCuisineName('');
        setShowAddCuisineForm(false);
      } catch (error) {
        console.error('Error adding cuisine:', error);
        alert('Failed to save cuisine. Please try again.');
      }
    }
  }

  const handleMenuUpload = (e, cuisineIndex, type) => {
    const file = e.target.files[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setDashboardData(prev => {
        const updatedCuisines = [...prev.cuisines]
        updatedCuisines[cuisineIndex][type] = url
        return { ...prev, cuisines: updatedCuisines }
      })
    }
  }

  const handleDeleteCuisine = async (index) => {
    if (window.confirm('Are you sure you want to delete this cuisine?')) {
      const updatedCuisines = dashboardData.cuisines.filter((_, i) => i !== index);

      setDashboardData(prev => ({
        ...prev,
        cuisines: updatedCuisines
      }));

      // Save to database
      try {
        const partnerEmail = partner?.email || partner?.basicDetails?.email ||
          JSON.parse(sessionStorage.getItem('partner_session') || '{}')?.email ||
          JSON.parse(localStorage.getItem('user') || '{}')?.email;

        if (!partnerEmail) {
          alert('Unable to save: Email not found.');
          return;
        }

        const offersData = {
          food: Array.isArray(dashboardData.dailySpecials?.items) ? dashboardData.dailySpecials.items : []
        };
        const serviceCatalog = {
          cuisineType: dashboardData.cuisineType || '',
          cuisines: updatedCuisines.map(cuisine => ({
            name: cuisine.name,
            vegMenu: cuisine.vegMenu || null,
            nonVegMenu: cuisine.nonVegMenu || null
          }))
        };

        await fetch(`http://localhost:5000/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceCatalog,
            offers: offersData
          })
        });
      } catch (error) {
        console.error('Error deleting cuisine:', error);
      }
    }
  }
  // -------------------

  // --- Step Logic ---
  const nextStep = () => {
    // Basic validation if needed
    if (step === 1) {
      if (!dashboardData.ownerName || !dashboardData.businessName || !dashboardData.phoneNumber) {
        alert('Please fill in valid Basic Information');
        return;
      }
    }
    setStep(prev => prev + 1);
  }

  const prevStep = () => {
    setStep(prev => prev - 1);
  }

  const handleSaveChanges = async () => {
    try {
      // Prepare data
      let dataToSave = { ...dashboardData };

      // Handle Specials Tab Special case
      if (activeTab === 'daily-specials' && dashboardData.dailySpecials?.newSpecial?.trim()) {
        dataToSave.dailySpecials.items.push(dashboardData.dailySpecials.newSpecial.trim());
        dataToSave.dailySpecials.newSpecial = '';
        setDashboardData(dataToSave);
      }

      let partnerEmail = partner?.email || partner?.basicDetails?.email;
      if (!partnerEmail) {
        const stored = JSON.parse(localStorage.getItem('user') || sessionStorage.getItem('partner_session') || '{}');
        partnerEmail = stored.email || stored.basicDetails?.email;
      }

      if (!partnerEmail) {
        alert('Unable to save: Email not found. Please log in again.');
        return;
      }

      // Prepare offers data as array
      const offersData = {
        food: Array.isArray(dataToSave.dailySpecials?.items) ? dataToSave.dailySpecials.items : []
      };

      // Prepare service catalog with cuisineType and cuisines
      const serviceCatalog = {
        cuisineType: dataToSave.cuisineType || '',
        cuisines: (dataToSave.cuisines || []).map(cuisine => ({
          name: cuisine.name,
          vegMenu: cuisine.vegMenu || null,
          nonVegMenu: cuisine.nonVegMenu || null
        }))
      };

      // Prepare update payload with all data
      const updatePayload = {
        ownerName: dataToSave.ownerName,
        phoneNumber: dataToSave.phoneNumber,
        businessName: dataToSave.businessName,
        location: dataToSave.locationArea,
        servicePricing: dataToSave.servicePricing, // Send pricing data
        serviceCatalog,
        offers: offersData,
        photos: dataToSave.photos
      };

      const response = await fetch(
        `http://localhost:5000/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updatePayload)
        }
      );

      const result = await response.json();
      if (response.ok && result.success) {
        alert('Changes saved successfully!');
      } else {
        throw new Error(result.message || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert(`Failed to save changes: ${error.message}`);
    }
  }

  const handleDeleteSpecial = async (index) => {
    const updatedSpecials = dashboardData.dailySpecials.items.filter((_, i) => i !== index);

    setDashboardData(prev => ({
      ...prev,
      dailySpecials: {
        ...prev.dailySpecials,
        items: updatedSpecials
      }
    }));

    // Save to database
    try {
      const partnerEmail = partner?.email || partner?.basicDetails?.email ||
        JSON.parse(sessionStorage.getItem('partner_session') || '{}')?.email ||
        JSON.parse(localStorage.getItem('user') || '{}')?.email;

      if (!partnerEmail) return;

      const offersData = {
        food: Array.isArray(updatedSpecials) ? updatedSpecials : []
      };
      const serviceCatalog = {
        cuisineType: dashboardData.cuisineType || '',
        cuisines: (dashboardData.cuisines || []).map(cuisine => ({
          name: cuisine.name,
          vegMenu: cuisine.vegMenu || null,
          nonVegMenu: cuisine.nonVegMenu || null
        }))
      };

      await fetch(`http://localhost:5000/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceCatalog,
          offers: offersData
        })
      });
    } catch (error) {
      console.error('Error deleting special:', error);
    }
  }

  const handleGoBack = () => {
    const serviceRoute = serviceType || 'food-tiffin-service'
    navigate(`/partner/dailyLiving/${serviceRoute}/dashboard`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading service details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative min-h-screen text-white overflow-y-auto">
        <div className="fixed inset-0 z-0 bg-gray-900">
          <img
            src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Food Background"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden text-gray-900 border border-white/50 animate-fadeIn">
            <div className="grid md:grid-cols-12 h-[80vh] min-h-[600px]">

              {/* SIDEBAR */}
              <div className="md:col-span-3 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2 overflow-y-auto">
                <div className="mb-8 px-2 shrink-0">
                  <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-orange-600 to-red-600">Kitchen Dash</h2>
                  <p className="text-sm text-gray-500 font-medium truncate">Welcome, {dashboardData.ownerName || 'Chef'}</p>
                </div>

                <div className="space-y-2 shrink-0">
                  {['details', 'photos', 'daily-specials', 'cuisines'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${activeTab === tab ? 'bg-orange-600 text-white shadow-lg shadow-orange-500/30' : 'text-gray-600 hover:bg-gray-100 hover:text-orange-600'}`}
                    >
                      {tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </button>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200 shrink-0">
                  <button onClick={handleGoBack} className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all flex items-center gap-2 group">
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Go Back
                  </button>
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="md:col-span-9 flex flex-col h-full bg-white/50 overflow-hidden">

                {/* FIXED HEADER */}
                <div className="p-6 pb-4 border-b bg-white/90 backdrop-blur-md z-10 shrink-0">
                  <div className="max-w-4xl mx-auto">
                    {activeTab === 'details' && (
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <FaUser className="text-orange-600" /> Edit Kitchen Details
                        </h3>
                        {/* Step Indicator */}
                        <div className="flex items-center space-x-2">
                          {[1, 2].map(s => (
                            <div key={s} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${step >= s ? 'bg-orange-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {s}
                              </div>
                              {s < 2 && <div className={`w-8 h-1 transition-colors duration-300 ${step > s ? 'bg-orange-600' : 'bg-gray-200'}`} />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'photos' && (
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCamera className="text-orange-600" /> Kitchen & Food Gallery</h3>
                      </div>
                    )}
                    {activeTab === 'daily-specials' && (
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaLeaf className="text-orange-600" /> Daily Specials & Offers</h3>
                      </div>
                    )}
                    {activeTab === 'cuisines' && (
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaUtensils className="text-orange-600" /> Cuisines & Menu Categories</h3>
                      </div>
                    )}
                  </div>
                </div>

                {/* SCROLLABLE BODY */}
                <div className="flex-1 overflow-y-auto p-8 pt-6 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-gray-300 hover:scrollbar-thumb-gray-400">
                  <div className="max-w-4xl mx-auto">

                    {activeTab === 'details' && (
                      <div className="space-y-6 animate-fadeIn">

                        {/* Step 1: Basic Details */}
                        {step === 1 && (
                          <div className="space-y-6">
                            <h4 className="text-lg font-bold text-gray-700">Basic Information</h4>
                            <div className="grid md:grid-cols-2 gap-6">
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Owner Name</label>
                                <input name="ownerName" value={dashboardData.ownerName || ''} onChange={handleDashboardChange} className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-orange-500 outline-none" placeholder="Enter your name" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Business Name</label>
                                <input name="businessName" value={dashboardData.businessName || ''} onChange={handleDashboardChange} className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-orange-500 outline-none" placeholder="Enter kitchen/business name" />
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Phone Contact</label>
                                <div className="relative">
                                  <FaPhone className="absolute top-4 left-3 text-gray-400" />
                                  <input name="phoneNumber" value={dashboardData.phoneNumber || ''} onChange={handleDashboardChange} className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-orange-500 outline-none" placeholder="Contact number" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Email Address</label>
                                <div className="relative">
                                  <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
                                  <input name="email" value={dashboardData.email || ''} onChange={handleDashboardChange} className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-orange-500 outline-none" placeholder="Email address" />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Location</label>
                                <div className="relative">
                                  <FaMapMarkerAlt className="absolute top-4 left-3 text-gray-400" />
                                  <input name="locationArea" value={dashboardData.locationArea || ''} onChange={handleDashboardChange} className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-orange-500 outline-none" placeholder="Kitchen Location" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 2: Service Pricing */}
                        {step === 2 && (
                          <div className="space-y-6">
                            <div className="flex justify-between items-center">
                              <h4 className="text-lg font-bold text-gray-700">Service Details & Pricing</h4>
                              <button onClick={handleAddPricingOption} className="text-sm text-orange-600 font-bold hover:underline">+ Add Pricing Option</button>
                            </div>

                            <div className="space-y-4">
                              <p className="text-sm text-gray-500">Add at least one service type with pricing (e.g., Tiffin Service - Monthly: 3000)</p>

                              {dashboardData.servicePricing.length === 0 && (
                                <div className="p-8 border-2 border-dashed border-gray-200 rounded-xl text-center">
                                  <p className="text-gray-400 mb-2">No pricing options added</p>
                                  <button onClick={handleAddPricingOption} className="px-4 py-2 bg-orange-50 text-orange-600 rounded-lg font-semibold hover:bg-orange-100">Add First Option</button>
                                </div>
                              )}

                              {dashboardData.servicePricing.map((item, idx) => (
                                <div key={idx} className="flex gap-4 items-start">
                                  <div className="flex-1 space-y-1">
                                    <input
                                      placeholder="Service Type (e.g., Basic Plan)"
                                      value={item.type}
                                      onChange={(e) => handlePricingChange(idx, 'type', e.target.value)}
                                      className="w-full p-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                                    />
                                  </div>
                                  <div className="w-1/3 space-y-1">
                                    <input
                                      placeholder="Price (₹)"
                                      type="number"
                                      value={item.price}
                                      onChange={(e) => handlePricingChange(idx, 'price', e.target.value)}
                                      className="w-full p-3 border border-gray-200 rounded-xl focus:border-orange-500 outline-none"
                                    />
                                  </div>
                                  <button onClick={() => handleRemovePricingOption(idx)} className="mt-3 text-red-400 hover:text-red-600">
                                    Remove
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex justify-between pt-6 border-t mt-6">
                          <button
                            onClick={prevStep}
                            disabled={step === 1}
                            className={`px-6 py-2 rounded-xl font-bold transition-all ${step === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
                          >
                            Back
                          </button>

                          {step < 2 ? (
                            <button
                              onClick={nextStep}
                              className="px-6 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-lg shadow-orange-600/20"
                            >
                              Next
                            </button>
                          ) : (
                            <button
                              onClick={handleSaveChanges}
                              className="px-8 py-2 bg-orange-600 text-white rounded-xl font-bold hover:bg-orange-700 shadow-xl transition-all"
                            >
                              Save Changes
                            </button>
                          )}
                        </div>

                      </div>
                    )}

                    {activeTab === 'photos' && (
                      <div className="space-y-8 animate-fadeIn">
                        <div className="grid md:grid-cols-3 gap-6">
                          {['kitchen', 'dish1', 'menu'].map((type) => (
                            <div key={type} className="space-y-3">
                              <label className="block text-sm font-bold text-gray-700 capitalize">{type} Photo</label>
                              <div className="relative group w-full aspect-[4/3] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden hover:border-orange-500 hover:bg-orange-50 transition-all cursor-pointer">
                                {dashboardData.photos[type] ? (
                                  <>
                                    <img src={dashboardData.photos[type]} alt={type} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                      <span className="text-white font-semibold">Change Photo</span>
                                    </div>
                                  </>
                                ) : (
                                  <div className="text-center p-4 text-gray-400 group-hover:text-orange-500 transition-colors">
                                    <FaCamera className="text-3xl mx-auto mb-2" />
                                    <span className="text-xs font-semibold uppercase tracking-wider">Upload {type}</span>
                                  </div>
                                )}
                                <input type="file" onChange={(e) => handlePhotoUpload(e, type)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 flex gap-3 text-sm text-orange-800">
                          <FaCheckCircle className="shrink-0 mt-0.5" />
                          <p>Tip: High-quality food photos trigger appetite! Ensure good lighting and attractive plating.</p>
                        </div>
                      </div>
                    )}

                    {activeTab === 'daily-specials' && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl space-y-4 shadow-sm">
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-green-100 rounded-lg text-green-600"><FaUtensils /></div>
                            <h4 className="text-lg font-bold text-gray-800">Add Today's Special</h4>
                          </div>
                          <div className="flex gap-4">
                            <input
                              type="text"
                              value={dashboardData.dailySpecials?.newSpecial || ''}
                              onChange={(e) => setDashboardData(prev => ({ ...prev, dailySpecials: { ...prev.dailySpecials, newSpecial: e.target.value } }))}
                              className="flex-1 p-3 border-2 border-green-100 bg-white rounded-xl focus:border-green-400 outline-none transition-all"
                              placeholder="Type special item name (e.g., 'Hyderabadi Biryani - ₹250')"
                            />
                            <button onClick={handleSaveChanges} className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg">Add</button>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <h4 className="text-lg font-bold text-gray-800">Active Specials</h4>
                          {dashboardData.dailySpecials?.items && dashboardData.dailySpecials.items.length > 0 ? (
                            <div className="space-y-3">
                              {dashboardData.dailySpecials.items.map((item, idx) => (
                                <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-orange-300 transition-all">
                                  <div className="flex gap-3 items-center">
                                    <div className="shrink-0 w-8 h-8 rounded-full bg-orange-100 text-orange-600 flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                                    <p className="text-gray-700 font-bold">{item}</p>
                                  </div>
                                  <button onClick={() => handleDeleteSpecial(idx)} className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50" title="Remove item">
                                    <FaTrash />
                                  </button>
                                </div>
                              ))}
                            </div>
                          ) : (
                            <p className="text-gray-400 italic text-center py-8">No specials added for today yet.</p>
                          )}
                        </div>
                      </div>
                    )}

                    {activeTab === 'cuisines' && (
                      <div className="space-y-6 animate-fadeIn">
                        {!selectedCuisine ? (
                          <>
                            <div className="grid gap-4">
                              {dashboardData.cuisines.map((cuisine, index) => (
                                <div key={index} className="bg-white border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                                  <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center text-orange-400 group-hover:bg-orange-100 group-hover:text-orange-600 transition-colors">
                                      <FaUtensils className="text-2xl" />
                                    </div>
                                    <div>
                                      <h4 className="font-bold text-lg text-gray-900">{cuisine.name}</h4>
                                      <p className="text-sm text-gray-500">{cuisine.vegMenu ? 'Veg Menu Added' : 'No Veg Menu'} • {cuisine.nonVegMenu ? 'Non-Veg Menu Added' : 'No Non-Veg Menu'}</p>
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-3 mt-4 md:mt-0">
                                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">Available</span>
                                    <button onClick={() => setSelectedCuisine({ ...cuisine, index })} className="px-4 py-2 text-gray-600 font-semibold hover:text-orange-600">Edit / Upload Menu</button>
                                    <button onClick={() => handleDeleteCuisine(index)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors" title="Delete Cuisine"><FaTrash /></button>
                                  </div>
                                </div>
                              ))}
                            </div>

                            {!showAddCuisineForm ? (
                              <button onClick={() => setShowAddCuisineForm(true)} className="w-full py-8 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-semibold hover:border-orange-500 hover:text-orange-500 hover:bg-orange-50 transition-all flex flex-col items-center justify-center gap-2 group">
                                <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-orange-100 transition-colors"><FaPlus className="text-xl" /></div>
                                <span>Add New Cuisine</span>
                                <span className="text-xs font-normal opacity-70">Expand your menu offerings</span>
                              </button>
                            ) : (
                              <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 animate-fadeIn">
                                <h4 className="font-bold text-gray-800 mb-4">Add New Cuisine Category</h4>
                                <div className="flex gap-4">
                                  <input type="text" value={newCuisineName} onChange={(e) => setNewCuisineName(e.target.value)} placeholder="E.g., Chinese, Continental, Tandoori..." className="flex-1 p-3 border border-gray-300 rounded-xl focus:border-orange-500 outline-none" />
                                  <button onClick={handleAddCuisine} className="px-6 py-3 bg-orange-600 text-white font-bold rounded-xl hover:bg-orange-700 shadow-md">Add</button>
                                  <button onClick={() => { setShowAddCuisineForm(false); setNewCuisineName(''); }} className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50">Cancel</button>
                                </div>
                              </div>
                            )}
                          </>
                        ) : (
                          <div className="animate-fadeIn">
                            <button onClick={() => setSelectedCuisine(null)} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-orange-600 font-medium transition-colors">← Back to Cuisines</button>
                            <div className="flex items-center justify-between border-b pb-4 mb-6"><h3 className="text-2xl font-bold text-gray-900">{selectedCuisine.name} Menu</h3></div>
                            <div className="grid md:grid-cols-2 gap-8">
                              <div className="space-y-4">
                                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-green-500 border border-green-600"></div><h4 className="text-xl font-bold text-green-700">Vegetarian Menu</h4></div>
                                <div className="relative group w-full aspect-[3/4] bg-green-50 rounded-2xl border-2 border-dashed border-green-200 flex flex-col items-center justify-center overflow-hidden hover:border-green-500 hover:bg-green-100 transition-all cursor-pointer">
                                  {dashboardData.cuisines[selectedCuisine.index].vegMenu ? (
                                    <>
                                      <img src={dashboardData.cuisines[selectedCuisine.index].vegMenu} alt="Veg Menu" className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="text-white font-semibold">Change Menu</span></div>
                                    </>
                                  ) : (
                                    <div className="text-center p-4 text-green-400 group-hover:text-green-600 transition-colors"><FaLeaf className="text-4xl mx-auto mb-2" /><span className="font-bold block">Upload Veg Menu</span><span className="text-xs opacity-70">JPG, PNG supported</span></div>
                                  )}
                                  <input type="file" onChange={(e) => handleMenuUpload(e, selectedCuisine.index, 'vegMenu')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                </div>
                              </div>
                              <div className="space-y-4">
                                <div className="flex items-center gap-3"><div className="w-3 h-3 rounded-full bg-red-500 border border-red-600"></div><h4 className="text-xl font-bold text-red-700">Non-Vegetarian Menu</h4></div>
                                <div className="relative group w-full aspect-[3/4] bg-red-50 rounded-2xl border-2 border-dashed border-red-200 flex flex-col items-center justify-center overflow-hidden hover:border-red-500 hover:bg-red-100 transition-all cursor-pointer">
                                  {dashboardData.cuisines[selectedCuisine.index].nonVegMenu ? (
                                    <>
                                      <img src={dashboardData.cuisines[selectedCuisine.index].nonVegMenu} alt="Non-Veg Menu" className="w-full h-full object-cover" />
                                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"><span className="text-white font-semibold">Change Menu</span></div>
                                    </>
                                  ) : (
                                    <div className="text-center p-4 text-red-400 group-hover:text-red-600 transition-colors"><FaUtensils className="text-4xl mx-auto mb-2" /><span className="font-bold block">Upload Non-Veg Menu</span><span className="text-xs opacity-70">JPG, PNG supported</span></div>
                                  )}
                                  <input type="file" onChange={(e) => handleMenuUpload(e, selectedCuisine.index, 'nonVegMenu')} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FoodProfile;