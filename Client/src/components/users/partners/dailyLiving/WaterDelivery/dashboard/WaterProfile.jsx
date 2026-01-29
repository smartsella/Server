import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePartner } from '../../../../../../context/partnerContext'
import { FaUser, FaPhone, FaEnvelope, FaTint, FaCamera, FaTimes, FaTruck, FaBox, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa'

const WaterProfile = () => {
  const { partner, logout } = usePartner()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('details')
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', capacity: '' })
  const [editingProductIndex, setEditingProductIndex] = useState(null)
  const [editProductData, setEditProductData] = useState({ name: '', price: '', capacity: '' })
  const [loading, setLoading] = useState(true)

  const [dashboardData, setDashboardData] = useState({
    id: '',
    ownerName: '',
    phoneNumber: '',
    email: '',
    businessName: '',
    locationArea: '',
    deliveryCharge: 0,
    photos: { plant: null, vehicle: null, jars: null },
    offers: { items: [], newOffer: '' },
    products: []
  })

  useEffect(() => {
    const fetchWaterDetails = async () => {
      try {
        setLoading(true)

        console.log('Partner context data:', partner)

        // Get partner email from context or storage
        let partnerEmail = partner?.email || partner?.basicDetails?.email

        // Check sessionStorage if not in partner context
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

        // Check localStorage
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

        if (!partnerEmail) {
          console.warn('No partner email found, using context data only')
          console.log('Available partner data:', partner)
          if (partner?.basicDetails) {
            setDashboardData(prev => ({
              ...prev,
              ownerName: partner.basicDetails.ownerName || '',
              phoneNumber: partner.basicDetails.phoneNumber || partner.basicDetails.phone || '',
              email: partner.basicDetails.email || '',
              businessName: partner.basicDetails.businessName || '',
              locationArea: partner.basicDetails.locationArea || partner.basicDetails.location || '',
              deliveryCharge: partner.basicDetails.deliveryCharge || prev.deliveryCharge,
              photos: partner.basicDetails.photos || prev.photos,
              offers: partner.basicDetails.offers || prev.offers,
              products: partner.basicDetails.products || []
            }))
          }
          setLoading(false)
          return
        }

        console.log('Fetching water delivery details for email:', partnerEmail)

        // Fetch water delivery details from backend
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`)

        if (!response.ok) {
          throw new Error('Failed to fetch water delivery details')
        }

        const result = await response.json()
        console.log('Backend response:', result)

        if (result.success && result.data) {
          const water = result.data
          console.log('Water delivery data received:', water)

          // Parse service_metadata and service_catalog
          const metadata = water.service_pricing || {}
          const catalog = water.service_catalog || {}

          setDashboardData(prev => ({
            ...prev,
            id: water.id || prev.id,
            ownerName: water.owner_name || prev.ownerName,
            phoneNumber: water.phone_number || prev.phoneNumber,
            email: water.email_id || prev.email,
            businessName: water.business_name || prev.businessName,
            locationArea: water.location || prev.locationArea,
            deliveryCharge: metadata.deliveryCharge || prev.deliveryCharge,
            photos: prev.photos, // Keep photos in local state only
            offers: {
              items: Array.isArray(water.offers?.water) ? water.offers.water : (water.offers?.water ? water.offers.water.split(', ').filter(item => item.trim()) : []),
              newOffer: ''
            },
            products: catalog.products || []
          }))
        } else {
          // No data in database yet - populate with available partner context data
          console.log('No database record found, using partner context for initial values')
          setDashboardData(prev => ({
            ...prev,
            email: partner?.email || partner?.basicDetails?.email || prev.email,
            phoneNumber: partner?.phone || partner?.basicDetails?.phone || partner?.basicDetails?.phoneNumber || prev.phoneNumber,
            ownerName: partner?.full_name || partner?.basicDetails?.ownerName || prev.ownerName,
            businessName: partner?.basicDetails?.businessName || prev.businessName,
            locationArea: partner?.basicDetails?.location || partner?.basicDetails?.locationArea || prev.locationArea
          }))
        }
      } catch (error) {
        console.error('Error fetching water delivery details:', error)
        // Fallback to context data on error
        if (partner?.basicDetails) {
          setDashboardData(prev => ({
            ...prev,
            ownerName: partner.basicDetails.ownerName || '',
            phoneNumber: partner.basicDetails.phoneNumber || partner.basicDetails.phone || '',
            email: partner.basicDetails.email || '',
            businessName: partner.basicDetails.businessName || '',
            locationArea: partner.basicDetails.locationArea || partner.basicDetails.location || '',
            deliveryCharge: partner.basicDetails.deliveryCharge || prev.deliveryCharge,
            photos: partner.basicDetails.photos || prev.photos,
            offers: partner.basicDetails.offers || prev.offers,
            products: partner.basicDetails.products || []
          }))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchWaterDetails()
  }, [partner])

  const handleDashboardChange = (e) => {
    const { name, value } = e.target
    setDashboardData(prev => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDashboardData(prev => ({ ...prev, photos: { ...prev.photos, [type]: reader.result } }))
      }
      reader.readAsDataURL(file)
    }
  }

  const handleAddProduct = async () => {
    if (newProduct.name && newProduct.price) {
      const updatedProducts = [...dashboardData.products, { ...newProduct, price: parseFloat(newProduct.price) }];

      setDashboardData(prev => ({
        ...prev,
        products: updatedProducts
      }))
      setNewProduct({ name: '', price: '', capacity: '' })
      setShowAddProductForm(false)

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
          water: dashboardData.offers?.items || []
        };

        const serviceCatalog = {
          deliveryCharge: dashboardData.deliveryCharge || 0,
          products: updatedProducts.map(product => ({
            name: product.name,
            price: product.price,
            capacity: product.capacity
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
        console.error('Error adding product:', error);
        alert('Failed to save product. Please try again.');
      }
    }
  }

  const startEditingProduct = (index) => {
    setEditingProductIndex(index)
    setEditProductData(dashboardData.products[index])
  }

  const cancelEditingProduct = () => {
    setEditingProductIndex(null)
    setEditProductData({ name: '', price: '', capacity: '' })
  }

  const saveEditedProduct = async () => {
    const updatedProducts = [...dashboardData.products];
    updatedProducts[editingProductIndex] = editProductData;

    setDashboardData(prev => ({
      ...prev,
      products: updatedProducts
    }))
    setEditingProductIndex(null)

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
        water: dashboardData.offers?.items || []
      };

      const serviceCatalog = {
        deliveryCharge: dashboardData.deliveryCharge || 0,
        products: updatedProducts.map(product => ({
          name: product.name,
          price: product.price,
          capacity: product.capacity
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
      console.error('Error updating product:', error);
      alert('Failed to save changes. Please try again.');
    }
  }

  const handleAddOffer = async () => {
    if (dashboardData.offers.newOffer.trim()) {
      const updatedOffers = [...dashboardData.offers.items, dashboardData.offers.newOffer];

      setDashboardData((prev) => ({
        ...prev,
        offers: { items: updatedOffers, newOffer: '' }
      }))

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
          water: updatedOffers
        };

        const serviceCatalog = {
          deliveryCharge: dashboardData.deliveryCharge || 0,
          products: (dashboardData.products || []).map(product => ({
            name: product.name,
            price: product.price,
            capacity: product.capacity
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
  }

  const handleDeleteProduct = async (index) => {
    const confirmed = window.confirm('Are you sure you want to delete this product?')
    if (confirmed) {
      const updatedProducts = dashboardData.products.filter((_, i) => i !== index);

      setDashboardData(prev => ({
        ...prev,
        products: updatedProducts
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
          water: dashboardData.offers?.items || []
        };
        const serviceCatalog = {
          deliveryCharge: dashboardData.deliveryCharge || 0,
          products: updatedProducts.map(product => ({
            name: product.name,
            price: product.price,
            capacity: product.capacity
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
        console.error('Error deleting product:', error);
      }
    }
  }

  const handleSaveChanges = async () => {
    try {
      // Get partner email
      let partnerEmail = partner?.email || partner?.basicDetails?.email

      if (!partnerEmail) {
        const storedPartner = sessionStorage.getItem('partner_session')
        if (storedPartner) {
          const parsed = JSON.parse(storedPartner)
          partnerEmail = parsed?.email || parsed?.basicDetails?.email
        }
      }

      if (!partnerEmail) {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
          const parsed = JSON.parse(storedUser)
          partnerEmail = parsed?.email || parsed?.basicDetails?.email
        }
      }

      if (!partnerEmail) {
        alert('Unable to identify partner email. Please log in again.')
        return
      }

      console.log('Updating water delivery profile for:', partnerEmail)

      // Prepare offers and service_catalog for backend
      const offersData = {
        water: dashboardData.offers?.items || []
      };
      const serviceCatalog = {
        deliveryCharge: dashboardData.deliveryCharge || 0,
        products: (dashboardData.products || []).map(product => ({
          name: product.name,
          price: product.price,
          capacity: product.capacity
        }))
      };

      const response = await fetch(`http://localhost:5000/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ownerName: dashboardData.ownerName,
          phoneNumber: dashboardData.phoneNumber,
          businessName: dashboardData.businessName,
          location: dashboardData.locationArea,
          offers: offersData,
          serviceCatalog
        }),
      })

      const result = await response.json()

      if (result.success) {
        alert('Profile updated successfully!')
        console.log('Update response:', result)
      } else {
        alert('Failed to update profile: ' + (result.message || 'Unknown error'))
      }
    } catch (error) {
      console.error('Error updating water delivery profile:', error)
      alert('Error updating profile. Please try again.')
    }
  }

  const handleDeleteOffer = async (index) => {
    const confirmed = window.confirm('Are you sure you want to delete this offer?')
    if (confirmed) {
      const updatedOffers = dashboardData.offers.items.filter((_, i) => i !== index);

      setDashboardData(prev => ({
        ...prev,
        offers: { ...prev.offers, items: updatedOffers }
      }));

      // Save to database
      try {
        const partnerEmail = partner?.email || partner?.basicDetails?.email ||
          JSON.parse(sessionStorage.getItem('partner_session') || '{}')?.email ||
          JSON.parse(localStorage.getItem('user') || '{}')?.email;

        if (!partnerEmail) return;

        const offersData = {
          water: updatedOffers
        };
        const serviceCatalog = {
          deliveryCharge: dashboardData.deliveryCharge || 0,
          products: (dashboardData.products || []).map(product => ({
            name: product.name,
            price: product.price,
            capacity: product.capacity
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
        console.error('Error deleting offer:', error);
      }
    }
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading water delivery details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative min-h-screen bg-gray-900 text-white overflow-y-auto">
        <div className="fixed inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=2000&auto=format&fit=crop"
            alt="Water Delivery"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-cyan-900/70 to-teal-900/80"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden text-gray-900 border border-white/50 animate-fadeIn">
            <div className="grid md:grid-cols-12 min-h-[600px]">
              <div className="md:col-span-3 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
                <div className="mb-8 px-2">
                  <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-600">Water Dash</h2>
                  <p className="text-sm text-gray-500 font-medium truncate">Welcome, Partner</p>
                </div>

                <button
                  onClick={() => setActiveTab('details')}
                  className={`text-left px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${activeTab === 'details' ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
                >
                  Details
                </button>

                {['photos', 'offers', 'products'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-left px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${activeTab === tab ? 'bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/partner/dailyLiving/water-delivery/dashboard')}
                    className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all flex items-center gap-2 group"
                  >
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Go Back
                  </button>
                </div>
              </div>

              <div className="md:col-span-9 p-8 bg-white/50 overflow-y-auto">
                <div className="max-w-4xl mx-auto">

                  {/* Details Tab */}
                  {activeTab === 'details' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <FaUser className="text-blue-600" /> Edit Business Details
                        </h3>
                        <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">
                          ID: {dashboardData.id || 'N/A'}
                        </span>
                      </div>

                      <div className="grid md:grid-cols-2 gap-6 pt-2">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Owner Name</label>
                          <input
                            type="text"
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
                            type="text"
                            name="businessName"
                            value={dashboardData.businessName || ''}
                            onChange={handleDashboardChange}
                            className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                            placeholder="Enter business name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Phone Contact</label>
                          <div className="relative">
                            <FaPhone className="absolute top-4 left-3 text-gray-400" />
                            <input
                              type="tel"
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
                              type="email"
                              name="email"
                              value={dashboardData.email || ''}
                              onChange={handleDashboardChange}
                              className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                              placeholder="Email address"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Delivery Area</label>
                          <div className="relative">
                            <FaMapMarkerAlt className="absolute top-4 left-3 text-gray-400" />
                            <input
                              type="text"
                              name="locationArea"
                              value={dashboardData.locationArea || ''}
                              onChange={handleDashboardChange}
                              className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                              placeholder="Delivery Area"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Delivery Charge (₹)</label>
                          <input
                            type="number"
                            name="deliveryCharge"
                            value={dashboardData.deliveryCharge || 0}
                            onChange={handleDashboardChange}
                            className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                            placeholder="Delivery charge"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 border-t">
                        <button
                          onClick={handleSaveChanges}
                          className="px-8 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all shadow-lg"
                        >
                          Save Changes
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Photos Tab */}
                  {activeTab === 'photos' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <FaCamera className="text-blue-600" /> Business Photos
                        </h3>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 pt-2">
                        {[
                          { type: 'plant', label: 'RO Plant/Facility' },
                          { type: 'vehicle', label: 'Delivery Vehicle' },
                          { type: 'jars', label: 'Water Products' }
                        ].map((photo) => (
                          <div key={photo.type} className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-700">{photo.label}</h4>
                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-blue-400 transition-all bg-white">
                              {dashboardData.photos[photo.type] ? (
                                <div className="space-y-3">
                                  <img
                                    src={dashboardData.photos[photo.type]}
                                    alt={photo.label}
                                    className="w-full h-40 object-cover rounded-lg"
                                  />
                                  <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-lg text-sm font-medium hover:shadow-lg transition-all">
                                    <FaCamera /> Change
                                    <input
                                      type="file"
                                      accept="image/*"
                                      onChange={(e) => handlePhotoUpload(e, photo.type)}
                                      className="hidden"
                                    />
                                  </label>
                                </div>
                              ) : (
                                <label className="cursor-pointer flex flex-col items-center justify-center h-40">
                                  <FaCamera className="text-gray-300 text-5xl mb-3" />
                                  <span className="text-sm text-gray-500 font-medium">Upload {photo.label}</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handlePhotoUpload(e, photo.type)}
                                    className="hidden"
                                  />
                                </label>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="mt-6 p-4 bg-blue-50 rounded-xl border border-blue-100 flex items-start gap-3">
                        <div className="text-blue-600 text-xl">💡</div>
                        <p className="text-sm text-blue-700">
                          <strong>Tip:</strong> Clear images of your facility, delivery vehicles, and products help build customer trust.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Offers Tab */}
                  {activeTab === 'offers' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <FaTruck className="text-blue-600" /> Offers & Discounts
                        </h3>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={dashboardData.offers.newOffer}
                            onChange={(e) => setDashboardData((prev) => ({ ...prev, offers: { ...prev.offers, newOffer: e.target.value } }))}
                            placeholder="e.g., Free delivery on orders above ₹500"
                            className="flex-1 p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                          />
                          <button
                            onClick={handleAddOffer}
                            className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all shadow-lg"
                          >
                            Add Offer
                          </button>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gray-700 mt-6">Active Offers</h4>
                          {dashboardData.offers.items.map((offer, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-blue-200 transition-all">
                              <span className="text-gray-800 font-medium">🎉 {offer}</span>
                              <button
                                onClick={() => handleDeleteOffer(index)}
                                className="text-red-500 hover:text-red-700 hover:scale-110 transition-all"
                              >
                                <FaTimes className="text-lg" />
                              </button>
                            </div>
                          ))}
                          {dashboardData.offers.items.length === 0 && (
                            <div className="text-center py-12 text-gray-400">
                              <FaTruck className="text-5xl mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No offers added yet. Add your first offer above!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Products Tab */}
                  {activeTab === 'products' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <FaBox className="text-blue-600" /> Products & Pricing
                        </h3>
                        <button
                          onClick={() => setShowAddProductForm(!showAddProductForm)}
                          className="px-5 py-2 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all shadow-lg text-sm"
                        >
                          {showAddProductForm ? 'Cancel' : '+ Add Product'}
                        </button>
                      </div>

                      {showAddProductForm && (
                        <div className="bg-blue-50 p-5 rounded-xl border-2 border-blue-100 space-y-4">
                          <div className="grid md:grid-cols-3 gap-4">
                            <input
                              type="text"
                              placeholder="Product Name"
                              value={newProduct.name}
                              onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                              className="p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                            />
                            <input
                              type="number"
                              placeholder="Price (₹)"
                              value={newProduct.price}
                              onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                              className="p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                            />
                            <input
                              type="text"
                              placeholder="Capacity (e.g., 20L)"
                              value={newProduct.capacity}
                              onChange={(e) => setNewProduct({ ...newProduct, capacity: e.target.value })}
                              className="p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                            />
                          </div>
                          <button
                            onClick={handleAddProduct}
                            className="w-full py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-xl font-semibold hover:shadow-xl transform hover:scale-105 transition-all shadow-lg"
                          >
                            Add Product to List
                          </button>
                        </div>
                      )}

                      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Product Name</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Price (₹)</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Capacity</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {dashboardData.products.map((product, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3">
                                    {editingProductIndex === index ? (
                                      <input
                                        type="text"
                                        value={editProductData.name}
                                        onChange={(e) => setEditProductData({ ...editProductData, name: e.target.value })}
                                        className="p-2 border-2 border-gray-100 rounded-lg w-full text-sm focus:border-blue-500 outline-none"
                                      />
                                    ) : (
                                      <span className="font-medium text-gray-800">{product.name}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {editingProductIndex === index ? (
                                      <input
                                        type="number"
                                        value={editProductData.price}
                                        onChange={(e) => setEditProductData({ ...editProductData, price: e.target.value })}
                                        className="p-2 border-2 border-gray-100 rounded-lg w-full text-sm focus:border-blue-500 outline-none"
                                      />
                                    ) : (
                                      <span className="text-gray-700 font-medium">₹{product.price}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {editingProductIndex === index ? (
                                      <input
                                        type="text"
                                        value={editProductData.capacity}
                                        onChange={(e) => setEditProductData({ ...editProductData, capacity: e.target.value })}
                                        className="p-2 border-2 border-gray-100 rounded-lg w-full text-sm focus:border-blue-500 outline-none"
                                      />
                                    ) : (
                                      <span className="px-2 py-1 bg-cyan-100 text-cyan-700 rounded-lg text-xs font-semibold">{product.capacity}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                      {editingProductIndex === index ? (
                                        <>
                                          <button
                                            onClick={saveEditedProduct}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 font-semibold transition-all"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={cancelEditingProduct}
                                            className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 font-semibold transition-all"
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => startEditingProduct(index)}
                                            className="px-3 py-1 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 font-semibold transition-all"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => handleDeleteProduct(index)}
                                            className="px-3 py-1 bg-red-500 text-white rounded-lg text-xs hover:bg-red-600 font-semibold transition-all"
                                          >
                                            Delete
                                          </button>
                                        </>
                                      )}
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                        {dashboardData.products.length === 0 && (
                          <div className="text-center py-12 text-gray-400">
                            <FaBox className="text-5xl mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No products added yet. Add your first product!</p>
                          </div>
                        )}
                      </div>
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

export default WaterProfile