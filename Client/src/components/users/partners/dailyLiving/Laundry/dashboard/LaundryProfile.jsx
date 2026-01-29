import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePartner } from '../../../../../../context/partnerContext'
import {
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt,
  FaCamera, FaTag, FaTrash, FaCheckCircle,
  FaClipboardList, FaPlus, FaTshirt, FaTruck, FaRupeeSign
} from 'react-icons/fa'

const LaundryProfile = () => {
  const { partner, logout } = usePartner()
  const navigate = useNavigate()
  const { serviceType } = useParams()
  const [activeTab, setActiveTab] = useState('details')
  const [showAddServiceForm, setShowAddServiceForm] = useState(false)
  const [newServiceName, setNewServiceName] = useState('')
  const [selectedService, setSelectedService] = useState(null)
  const [loading, setLoading] = useState(true)

  const [dashboardData, setDashboardData] = useState({
    id: '',
    ownerName: '',
    phoneNumber: '',
    email: '',
    businessName: '',
    locationArea: '',
    serviceType: '', // e.g., Laundry, Dry Cleaning
    offers: { items: [], newOffer: '' },
    photos: { shop: null, equipment: null, team: null },
    services: [
      { name: '', rateCard: null },
      { name: '', rateCard: null }
    ]
  })

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        setLoading(true)
        
        console.log('Partner context data:', partner)
        
        // Get partner email from context or storage - check multiple possible locations
        let partnerEmail = partner?.email || partner?.basicDetails?.email
        
        // Also check sessionStorage if not in partner context
        if (!partnerEmail) {
          const storedPartner = sessionStorage.getItem('partner_session')
          if (storedPartner) {
            try {
              const parsed = JSON.parse(storedPartner)
              console.log('SessionStorage partner:', parsed)
              partnerEmail = parsed?.email || parsed?.basicDetails?.email
            } catch (e) {
              console.error('Error parsing stored partner:', e)
            }
          }
        }
        
        // Also check localStorage (Signin.jsx saves to localStorage as 'user')
        if (!partnerEmail) {
          const storedUser = localStorage.getItem('user')
          if (storedUser) {
            try {
              const parsed = JSON.parse(storedUser)
              console.log('LocalStorage user:', parsed)
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
            serviceType: partner.basicDetails.serviceCategory || prev.serviceType,
            offers: {
              items: partner.basicDetails.offers || prev.offers.items,
              newOffer: ''
            }
          }))
        }
        
        if (!partnerEmail) {
          console.warn('⚠️  No partner email found')
          setLoading(false)
          return
        }
        
        console.log('Fetching service partner details for email:', partnerEmail)

        // Fetch partner service details from backend
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`)
        
        if (!response.ok) {
          throw new Error('Failed to fetch partner details')
        }

        const result = await response.json()
        
        console.log('API Response:', result)
        
        if (result.success && result.data) {
          // result.data is a single object, not an array
          const service = result.data
          
          console.log('✅ Service data from API:', service)
          
          // Parse service_pricing and service_catalog
          const metadata = service.service_pricing || {}
          const catalog = service.service_catalog || {}
          const offersData = service.offers || {}
          
          setDashboardData(prev => ({
            ...prev,
            id: service.id || prev.id,
            ownerName: service.owner_name || prev.ownerName,
            phoneNumber: service.phone_number || prev.phoneNumber,
            email: service.email_id || prev.email,
            businessName: service.business_name || service.property_name || prev.businessName,
            locationArea: service.location || prev.locationArea,
            serviceType: metadata.serviceType || service.service_category || prev.serviceType,
            offers: {
              items: Array.isArray(offersData.laundry) ? offersData.laundry : [],
              newOffer: ''
            },
            photos: prev.photos, // Keep photos in local state only
            services: catalog.services || prev.services
          }))
          
          console.log('✅ Dashboard data updated from API')
        } else {
          console.warn('⚠️  No service data from API, keeping existing data from basicDetails')
        }
      } catch (error) {
        console.error('❌ Error fetching partner details:', error)
        // Data from basicDetails is already set before API call, so no need to set again
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

  const handleAddService = async () => {
    if (newServiceName.trim()) {
      const updatedServices = [...dashboardData.services, { name: newServiceName, rateCard: null }];
      
      setDashboardData(prev => ({
        ...prev,
        services: updatedServices
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

        const offersData = dashboardData.offers?.items && dashboardData.offers.items.length > 0
          ? { laundry: dashboardData.offers.items }
          : {};

        const serviceCatalog = {
          serviceType: dashboardData.serviceType || '',
          services: updatedServices.map(service => ({
            name: service.name,
            rateCard: service.rateCard || null
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

        setNewServiceName('');
        setShowAddServiceForm(false);
      } catch (error) {
        console.error('Error adding service:', error);
        alert('Failed to save service. Please try again.');
      }
    }
  }

  const handleRateCardUpload = (e, serviceIndex) => {
    const file = e.target.files[0]
    if (file) {
      const updatedServices = [...dashboardData.services]
      updatedServices[serviceIndex].rateCard = URL.createObjectURL(file)
      setDashboardData(prev => ({
        ...prev,
        services: updatedServices
      }))
    }
  }

  const handleDeleteService = async (index) => {
    if (window.confirm('Are you sure you want to delete this service category?')) {
      const updatedServices = dashboardData.services.filter((_, i) => i !== index);
      
      setDashboardData(prev => ({
        ...prev,
        services: updatedServices
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

        const serviceCatalog = {
          serviceType: dashboardData.serviceType || '',
          services: updatedServices.map(service => ({
            name: service.name,
            rateCard: service.rateCard || null
          }))
        };
        const offersData = dashboardData.offers?.items && dashboardData.offers.items.length > 0
          ? { laundry: dashboardData.offers.items }
          : {};

        await fetch(`http://localhost:5000/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceCatalog,
            offers: offersData
          })
        });
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  }

  const handleSaveChanges = async () => {
    try {
      // Get partner email from multiple sources
      let partnerEmail = partner?.email || partner?.basicDetails?.email;
      
      if (!partnerEmail) {
        const storedPartner = sessionStorage.getItem('partner_session');
        if (storedPartner) {
          const parsed = JSON.parse(storedPartner);
          partnerEmail = parsed?.email || parsed?.basicDetails?.email;
        }
      }
      
      if (!partnerEmail) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          const parsed = JSON.parse(storedUser);
          partnerEmail = parsed?.email || parsed?.basicDetails?.email;
        }
      }

      if (!partnerEmail) {
        alert('Unable to save: Email not found. Please log in again.');
        return;
      }

      console.log('📧 Partner Email:', partnerEmail);
      console.log('📦 Dashboard Data:', dashboardData);

      // Prepare service catalog with serviceType and services
      const serviceCatalog = {
        serviceType: dashboardData.serviceType || '',
        services: (dashboardData.services || []).map(service => ({
          name: service.name,
          rateCard: service.rateCard || null
        }))
      };

      console.log('📋 Service Catalog:', serviceCatalog);

      // Prepare offers in the format {laundry: ["offer1", "offer2", "offer3"]}
      const offersData = dashboardData.offers?.items && dashboardData.offers.items.length > 0
        ? { laundry: dashboardData.offers.items }
        : {};

      console.log('🎁 Offers Data:', offersData);

      // Prepare update payload with all data
      const updatePayload = {
        ownerName: dashboardData.ownerName,
        phoneNumber: dashboardData.phoneNumber,
        businessName: dashboardData.businessName,
        location: dashboardData.locationArea,
        serviceCatalog,
        offers: offersData
      };

      console.log('📤 Sending Update Payload:', updatePayload);

      // Send update request to backend
      const response = await fetch(
        `http://localhost:5000/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatePayload)
        }
      );

      const result = await response.json();

      console.log('📥 Server Response:', result);

      if (response.ok && result.success) {
        alert('Changes saved successfully!');
      } else {
        throw new Error(result.message || 'Failed to save changes');
      }
    } catch (error) {
      console.error('❌ Error saving changes:', error);
      alert(`Failed to save changes: ${error.message}`);
    }
  }

  const handleAddOffer = async () => {
    if (dashboardData.offers?.newOffer && dashboardData.offers.newOffer.trim()) {
      const updatedOffers = [...(dashboardData.offers.items || []), dashboardData.offers.newOffer.trim()];
      
      setDashboardData(prev => ({
        ...prev,
        offers: {
          items: updatedOffers,
          newOffer: ''
        }
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

        const offersData = { laundry: updatedOffers };
        const serviceCatalog = {
          serviceType: dashboardData.serviceType || '',
          services: (dashboardData.services || []).map(service => ({
            name: service.name,
            rateCard: service.rateCard || null
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
        console.error('Error adding offer:', error);
        alert('Failed to save offer. Please try again.');
      }
    }
  };

  const handleDeleteOffer = async (index) => {
    const updatedOffers = dashboardData.offers.items.filter((_, i) => i !== index);
    
    setDashboardData(prev => ({
      ...prev,
      offers: {
        ...prev.offers,
        items: updatedOffers
      }
    }));

    // Save to database
    try {
      const partnerEmail = partner?.email || partner?.basicDetails?.email || 
        JSON.parse(sessionStorage.getItem('partner_session') || '{}')?.email ||
        JSON.parse(localStorage.getItem('user') || '{}')?.email;

if (!partnerEmail) return;

const serviceCatalog = {
  serviceType: dashboardData.serviceType || '',
  services: (dashboardData.services || []).map(service => ({
    name: service.name,
    rateCard: service.rateCard || null
  }))
};
const offersData = updatedOffers.length > 0
  ? { laundry: updatedOffers }
  : {};

await fetch(`http://localhost:5000/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`, {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    serviceCatalog,
    offers: offersData
  })
});
    } catch (error) {
      console.error('Error deleting offer:', error);
    }
  }

  const handleGoBack = () => {
    const serviceRoute = serviceType || 'laundry-cleaning'
    navigate(`/partner/dailyLiving/${serviceRoute}/dashboard`)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
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
            src="https://images.unsplash.com/photo-1545173168-9f1947eebb8f?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Laundry Background"
            className="w-full h-full object-cover opacity-50"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden text-gray-900 border border-white/50 animate-fadeIn">
            <div className="grid md:grid-cols-12 min-h-[600px]">
              {/* SIDEBAR */}
              <div className="md:col-span-3 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
                <div className="mb-8 px-2">
                  <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Laundry Dash</h2>
                  <p className="text-sm text-gray-500 font-medium truncate">Welcome, {partner?.basicDetails?.ownerName || 'Partner'}</p>
                </div>

                {['details', 'photos', 'offers', 'services'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-left px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
                  >
                    {tab === 'offers' ? 'Offers & Discounts' : tab === 'services' ? 'Services & Rates' : tab.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                  </button>
                ))}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={handleGoBack}
                    className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all flex items-center gap-2 group"
                  >
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Go Back
                  </button>
                </div>
              </div>

              {/* MAIN CONTENT AREA */}
              <div className="md:col-span-9 p-8 bg-white/50 overflow-y-auto">
                <div className="max-w-4xl mx-auto">

                  {activeTab === 'details' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaUser className="text-blue-600" /> Edit Business Details</h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: {dashboardData.id || 'N/A'}</span>
                      </div>
                      <div className="grid md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Owner Name</label>
                          <input
                            name="ownerName"
                            value={dashboardData.ownerName || ''}
                            onChange={handleDashboardChange}
                            className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                            placeholder="Enter your name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Business Name</label>
                          <input
                            name="businessName"
                            value={dashboardData.businessName || ''}
                            onChange={handleDashboardChange}
                            className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                            placeholder="Enter shop/business name"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Phone Contact</label>
                          <div className="relative">
                            <FaPhone className="absolute top-4 left-3 text-gray-400" />
                            <input
                              name="phoneNumber"
                              value={dashboardData.phoneNumber || ''}
                              onChange={handleDashboardChange}
                              className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                              placeholder="Contact number"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Email Address</label>
                          <div className="relative">
                            <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
                            <input
                              name="email"
                              value={dashboardData.email || ''}
                              onChange={handleDashboardChange}
                              className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                              placeholder="Email address"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Location/Address</label>
                          <div className="relative">
                            <FaMapMarkerAlt className="absolute top-4 left-3 text-gray-400" />
                            <input
                              name="locationArea"
                              value={dashboardData.locationArea || ''}
                              onChange={handleDashboardChange}
                              className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                              placeholder="Shop Location"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="pt-6 flex justify-end">
                        <button onClick={handleSaveChanges} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/20 transform hover:-translate-y-1 transition-all">Save Changes</button>
                      </div>
                    </div>
                  )}

                  {activeTab === 'photos' && (
                    <div className="space-y-8 animate-fadeIn">
                      <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCamera className="text-blue-600" /> Shop & Work Gallery</h3>
                      </div>
                      <div className="grid md:grid-cols-3 gap-6">
                        {['shop', 'equipment', 'team'].map((type) => (
                          <div key={type} className="space-y-3">
                            <label className="block text-sm font-bold text-gray-700 capitalize">{type} Photo</label>
                            <div className="relative group w-full aspect-[4/3] bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                              {dashboardData.photos[type] ? (
                                <>
                                  <img src={dashboardData.photos[type]} alt={type} className="w-full h-full object-cover transition-transform group-hover:scale-105" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white font-semibold">Change Photo</span>
                                  </div>
                                </>
                              ) : (
                                <div className="text-center p-4 text-gray-400 group-hover:text-blue-500 transition-colors">
                                  <FaCamera className="text-3xl mx-auto mb-2" />
                                  <span className="text-xs font-semibold uppercase tracking-wider">Upload {type}</span>
                                </div>
                              )}
                              <input type="file" onChange={(e) => handlePhotoUpload(e, type)} className="absolute inset-0 opacity-0 cursor-pointer" accept="image/*" />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex gap-3 text-sm text-blue-800">
                        <FaCheckCircle className="shrink-0 mt-0.5" />
                        <p>Tip: Clear photos of your workspace and equipment build trust with new customers!</p>
                      </div>
                    </div>
                  )}

                  {activeTab === 'offers' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaTag className="text-blue-600" /> Services Offers & Discounts</h3>
                      </div>

                      <div className="p-6 bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl space-y-4 shadow-sm">
                        <div className="flex items-center gap-3 mb-4">
                          <div className="p-2 bg-green-100 rounded-lg text-green-600"><FaTag /></div>
                          <h4 className="text-lg font-bold text-gray-800">Add New Offer</h4>
                        </div>
                        <div className="flex gap-4">
                          <input
                            type="text"
                            value={dashboardData.offers?.newOffer || ''}
                            onChange={(e) => setDashboardData(prev => ({ ...prev, offers: { ...prev.offers, newOffer: e.target.value } }))}
                            className="flex-1 p-3 border-2 border-green-100 bg-white rounded-xl focus:border-green-400 outline-none transition-all"
                            placeholder="E.g., '20% Off on Dry Cleaning worth ₹500+'"
                          />
                          <button onClick={handleAddOffer} className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg">Add</button>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <h4 className="text-lg font-bold text-gray-800">Active Offers</h4>
                        {dashboardData.offers?.items && dashboardData.offers.items.length > 0 ? (
                          <div className="space-y-3">
                            {dashboardData.offers.items.map((item, idx) => (
                              <div key={idx} className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-all">
                                <div className="flex gap-3 items-center">
                                  <div className="shrink-0 w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold text-sm">{idx + 1}</div>
                                  <p className="text-gray-700 font-bold">{item}</p>
                                </div>
                                <button
                                  onClick={() => handleDeleteOffer(idx)}
                                  className="text-gray-400 hover:text-red-500 transition-colors p-2 rounded-full hover:bg-red-50"
                                  title="Remove item"
                                >
                                  <FaTrash />
                                </button>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-400 italic text-center py-8">No active offers running currently.</p>
                        )}
                      </div>
                    </div>
                  )}

                  {activeTab === 'services' && (
                    <div className="space-y-6 animate-fadeIn">
                      {!selectedService ? (
                        <>
                          <div className="flex items-center justify-between border-b pb-4">
                            <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaClipboardList className="text-blue-600" /> Service Categories & Rate Cards</h3>
                          </div>

                          <div className="grid gap-4">
                            {dashboardData.services.map((service, index) => (
                              <div key={index} className="bg-white border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                                <div className="flex items-center gap-4">
                                  <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-blue-400 group-hover:bg-blue-100 group-hover:text-blue-600 transition-colors">
                                    <FaTshirt className="text-2xl" />
                                  </div>
                                  <div>
                                    <h4 className="font-bold text-lg text-gray-900">{service.name}</h4>
                                    <p className="text-sm text-gray-500">{service.rateCard ? 'Rate Card Uploaded' : 'No Rate Card'}</p>
                                  </div>
                                </div>
                                <div className="flex items-center gap-3 mt-4 md:mt-0">
                                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">Active</span>
                                  <button
                                    onClick={() => setSelectedService({ ...service, index })}
                                    className="px-4 py-2 text-gray-600 font-semibold hover:text-blue-600"
                                  >
                                    Manage Rate Card
                                  </button>
                                  <button
                                    onClick={() => handleDeleteService(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete Service Category"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            ))}
                          </div>

                          {!showAddServiceForm ? (
                            <button
                              onClick={() => setShowAddServiceForm(true)}
                              className="w-full py-8 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-semibold hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group"
                            >
                              <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                                <FaPlus className="text-xl" />
                              </div>
                              <span>Add New Service Category</span>
                              <span className="text-xs font-normal opacity-70">e.g., Sofa Cleaning, Curtain Wash...</span>
                            </button>
                          ) : (
                            <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 animate-fadeIn">
                              <h4 className="font-bold text-gray-800 mb-4">Add New Service Category</h4>
                              <div className="flex gap-4">
                                <input
                                  type="text"
                                  value={newServiceName}
                                  onChange={(e) => setNewServiceName(e.target.value)}
                                  placeholder="E.g., Steam Ironing, Carpet Cleaning..."
                                  className="flex-1 p-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                                />
                                <button
                                  onClick={handleAddService}
                                  className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md"
                                >
                                  Add
                                </button>
                                <button
                                  onClick={() => { setShowAddServiceForm(false); setNewServiceName(''); }}
                                  className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50"
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="animate-fadeIn">
                          <button
                            onClick={() => setSelectedService(null)}
                            className="mb-6 flex items-center gap-2 text-gray-500 hover:text-blue-600 font-medium transition-colors"
                          >
                            ← Back to Services
                          </button>

                          <div className="flex items-center justify-between border-b pb-4 mb-6">
                            <h3 className="text-2xl font-bold text-gray-900">{selectedService.name} Rate Card</h3>
                          </div>

                          <div className="space-y-4">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-blue-500 border border-blue-600"></div>
                              <h4 className="text-xl font-bold text-blue-700">Price List / Rate Card</h4>
                            </div>

                            <div className="relative group w-full aspect-[3/2] bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 flex flex-col items-center justify-center overflow-hidden hover:border-blue-500 hover:bg-blue-100 transition-all cursor-pointer">
                              {dashboardData.services[selectedService.index].rateCard ? (
                                <>
                                  <img src={dashboardData.services[selectedService.index].rateCard} alt="Rate Card" className="w-full h-full object-contain" />
                                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                                    <span className="text-white font-semibold">Update Rate Card</span>
                                  </div>
                                </>
                              ) : (
                                <div className="text-center p-4 text-blue-400 group-hover:text-blue-600 transition-colors">
                                  <FaClipboardList className="text-4xl mx-auto mb-2" />
                                  <span className="font-bold block">Upload Rate Card Image</span>
                                  <span className="text-xs opacity-70">JPG, PNG supported</span>
                                </div>
                              )}
                              <input
                                type="file"
                                onChange={(e) => handleRateCardUpload(e, selectedService.index)}
                                className="absolute inset-0 opacity-0 cursor-pointer"
                                accept="image/*"
                              />
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
  )
}

export default LaundryProfile