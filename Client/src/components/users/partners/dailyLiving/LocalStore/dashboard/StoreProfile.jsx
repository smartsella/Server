import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePartner } from '../../../../../../context/partnerContext'
import { FaUser, FaPhone, FaEnvelope, FaStore, FaCamera, FaTimes, FaShoppingBasket, FaPills, FaBox, FaMapMarkerAlt, FaArrowLeft } from 'react-icons/fa'

const StoreProfile = () => {
  // Add Offer and save to backend
  const handleAddOffer = async () => {
    if (dashboardData.offers.newOffer.trim()) {
      const updatedOffers = [...dashboardData.offers.items, dashboardData.offers.newOffer];
      setDashboardData((prev) => ({
        ...prev,
        offers: { items: updatedOffers, newOffer: '' }
      }));

      // Save to database immediately (like LaundryProfile)
      try {
        const partnerEmail = partner?.email || partner?.basicDetails?.email ||
          JSON.parse(sessionStorage.getItem('partner_session') || '{}')?.email ||
          JSON.parse(localStorage.getItem('user') || '{}')?.email;

        if (!partnerEmail) {
          alert('Unable to save: Email not found.');
          return;
        }

        const offersData = {
          store: updatedOffers
        };
        const serviceCatalog = {
          storeType: dashboardData.storeType || 'General Store',
          inventory: (dashboardData.inventory || []).map(item => ({
            name: item.name,
            price: item.price,
            category: item.category,
            stock: item.stock
          }))
        };

        await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`, {
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
  const { partner, logout } = usePartner()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('details')
  const [showAddItemForm, setShowAddItemForm] = useState(false)
  const [newItem, setNewItem] = useState({ name: '', price: '', category: 'Grocery', stock: 'In Stock' })
  const [editingItemIndex, setEditingItemIndex] = useState(null)
  const [editItemData, setEditItemData] = useState({ name: '', price: '', category: '', stock: '' })
  const [loading, setLoading] = useState(true)

  const [dashboardData, setDashboardData] = useState({
    id: '',
    ownerName: '',
    phoneNumber: '',
    email: '',
    businessName: '',
    locationArea: '',
    storeType: 'General Store',
    photos: { storefront: null, shelves: null, counter: null },
    offers: { items: [], newOffer: '' },
    inventory: []
  })

  useEffect(() => {
    const fetchStoreDetails = async () => {
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
              storeType: partner.basicDetails.storeType || prev.storeType,
              photos: partner.basicDetails.photos || prev.photos,
              offers: partner.basicDetails.offers || prev.offers,
              inventory: partner.basicDetails.inventory || []
            }))
          }
          setLoading(false)
          return
        }

        console.log('Fetching store details for email:', partnerEmail)

        // Fetch store details from backend
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`)

        if (!response.ok) {
          throw new Error('Failed to fetch store details')
        }

        const result = await response.json()
        console.log('Backend response:', result)

        if (result.success && result.data) {
          const store = result.data
          console.log('Store data received:', store)

          // Parse service_metadata and service_catalog
          const metadata = store.service_pricing || {}
          const catalog = store.service_catalog || {}

          setDashboardData(prev => ({
            ...prev,
            id: store.id || prev.id,
            ownerName: store.owner_name || prev.ownerName,
            phoneNumber: store.phone_number || prev.phoneNumber,
            email: store.email_id || prev.email,
            businessName: store.business_name || prev.businessName,
            locationArea: store.location || prev.locationArea,
            storeType: metadata.storeType || prev.storeType,
            photos: prev.photos, // Keep photos in local state only
            offers: {
              items: Array.isArray(store.offers?.store) ? store.offers.store : (store.offers?.store ? store.offers.store.split(', ').filter(item => item.trim()) : []),
              newOffer: ''
            },
            inventory: catalog.inventory || []
          }))
        } else if (partner?.basicDetails) {
          // Fallback to context data if API returns no stores
          setDashboardData(prev => ({
            ...prev,
            ownerName: partner.basicDetails.ownerName || '',
            phoneNumber: partner.basicDetails.phoneNumber || partner.basicDetails.phone || '',
            email: partner.basicDetails.email || '',
            businessName: partner.basicDetails.businessName || '',
            locationArea: partner.basicDetails.locationArea || partner.basicDetails.location || '',
            storeType: partner.basicDetails.storeType || prev.storeType,
            photos: partner.basicDetails.photos || prev.photos,
            offers: partner.basicDetails.offers || prev.offers,
            inventory: partner.basicDetails.inventory || []
          }))
        }
      } catch (error) {
        console.error('Error fetching store details:', error)
        // Fallback to context data on error
        if (partner?.basicDetails) {
          setDashboardData(prev => ({
            ...prev,
            ownerName: partner.basicDetails.ownerName || '',
            phoneNumber: partner.basicDetails.phoneNumber || partner.basicDetails.phone || '',
            email: partner.basicDetails.email || '',
            businessName: partner.basicDetails.businessName || '',
            locationArea: partner.basicDetails.locationArea || partner.basicDetails.location || '',
            storeType: partner.basicDetails.storeType || prev.storeType,
            photos: partner.basicDetails.photos || prev.photos,
            offers: partner.basicDetails.offers || prev.offers,
            inventory: partner.basicDetails.inventory || []
          }))
        }
      } finally {
        setLoading(false)
      }
    }

    fetchStoreDetails()
  }, [partner])

  const handleDashboardChange = (e) => {
    const { name, value } = e.target
    setDashboardData((prev) => ({ ...prev, [name]: value }))
  }

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setDashboardData((prev) => ({ ...prev, photos: { ...prev.photos, [type]: reader.result } }))
      }
      reader.readAsDataURL(file)
    }
  }

  // Add inventory item and save to backend
  const handleAddItem = async () => {
    if (newItem.name && newItem.price) {
      const updatedInventory = [...dashboardData.inventory, { ...newItem, price: parseFloat(newItem.price) }];
      setDashboardData((prev) => ({
        ...prev,
        inventory: updatedInventory
      }));
      setNewItem({ name: '', price: '', category: 'Grocery', stock: 'In Stock' });
      setShowAddItemForm(false);

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
          store: dashboardData.offers?.items || []
        };
        const serviceCatalog = {
          storeType: dashboardData.storeType || 'General Store',
          inventory: updatedInventory.map(item => ({
            name: item.name,
            price: item.price,
            category: item.category,
            stock: item.stock
          }))
        };
        await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceCatalog,
            offers: offersData
          })
        });
      } catch (error) {
        console.error('Error adding inventory item:', error);
        alert('Failed to save item. Please try again.');
      }
    }
  }

  const startEditingItem = (index) => {
    setEditingItemIndex(index)
    setEditItemData(dashboardData.inventory[index])
  }

  const cancelEditingItem = () => {
    setEditingItemIndex(null)
    setEditItemData({ name: '', price: '', category: '', stock: '' })
  }

  // Edit inventory item and save to backend
  const saveEditedItem = async () => {
    const updatedInventory = [...dashboardData.inventory];
    updatedInventory[editingItemIndex] = editItemData;
    setDashboardData((prev) => ({
      ...prev,
      inventory: updatedInventory
    }));
    setEditingItemIndex(null);

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
        store: dashboardData.offers?.items || []
      };
      const serviceCatalog = {
        storeType: dashboardData.storeType || 'General Store',
        inventory: updatedInventory.map(item => ({
          name: item.name,
          price: item.price,
          category: item.category,
          stock: item.stock
        }))
      };
      await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serviceCatalog,
          offers: offersData
        })
      });
    } catch (error) {
      console.error('Error editing inventory item:', error);
      alert('Failed to save item. Please try again.');
    }
  }

  const handleDeleteItem = async (index) => {
    const confirmed = window.confirm('Are you sure you want to delete this item?')
    if (confirmed) {
      const updatedInventory = dashboardData.inventory.filter((_, i) => i !== index);

      setDashboardData((prev) => ({
        ...prev,
        inventory: updatedInventory
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
          store: dashboardData.offers?.items || []
        };
        const serviceCatalog = {
          storeType: dashboardData.storeType || 'General Store',
          inventory: updatedInventory.map(item => ({
            name: item.name,
            price: item.price,
            category: item.category,
            stock: item.stock
          }))
        };

        await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            serviceCatalog,
            offers: offersData
          })
        });
      } catch (error) {
        console.error('Error deleting item:', error);
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

      // Prepare service catalog with storeType, offers and inventory
      const serviceCatalog = {
        storeType: dashboardData.storeType || 'General Store',
        offers: dashboardData.offers?.items || [],
        inventory: (dashboardData.inventory || []).map(item => ({
          name: item.name,
          price: item.price,
          category: item.category, // Grocery, Medical, Personal Care, Snacks
          stock: item.stock // In Stock, Out of Stock, Low Stock
        }))
      };

      // Prepare update payload with all data
      const updatePayload = {
        ownerName: dashboardData.ownerName,
        phoneNumber: dashboardData.phoneNumber,
        businessName: dashboardData.businessName,
        location: dashboardData.locationArea,
        serviceCatalog
      };

      // Send update request to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatePayload)
        }
      );

      const result = await response.json();

      if (response.ok && result.success) {
        alert('Store profile updated successfully!');
      } else {
        throw new Error(result.message || 'Failed to save changes');
      }
    } catch (error) {
      console.error('Error saving changes:', error);
      alert(`Failed to save changes: ${error.message}`);
    }
  }

  const handleDeleteOffer = async (index) => {
    const confirmed = window.confirm('Are you sure you want to delete this offer?')
    if (confirmed) {
      const updatedOffers = dashboardData.offers.items.filter((_, i) => i !== index);

      setDashboardData((prev) => ({
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
          store: updatedOffers
        };
        const serviceCatalog = {
          storeType: dashboardData.storeType || 'General Store',
          inventory: (dashboardData.inventory || []).map(item => ({
            name: item.name,
            price: item.price,
            category: item.category,
            stock: item.stock
          }))
        };

        await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/stores?email=${encodeURIComponent(partnerEmail)}`, {
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
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading store details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative min-h-screen bg-gray-900 text-white overflow-y-auto">
        <div className="fixed inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1578916171728-46686eac8d58?q=80&w=2000&auto=format&fit=crop"
            alt="Local Store"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden text-gray-900 border border-white/50 animate-fadeIn">
            <div className="grid md:grid-cols-12 min-h-[600px]">
              <div className="md:col-span-3 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
                <div className="mb-8 px-2">
                  <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-emerald-600">Store Dash</h2>
                  <p className="text-sm text-gray-500 font-medium truncate">Welcome, Partner</p>
                </div>

                <button
                  onClick={() => setActiveTab('details')}
                  className={`text-left px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${activeTab === 'details' ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' : 'text-gray-600 hover:bg-gray-100 hover:text-green-600'}`}
                >
                  Details
                </button>

                {['photos', 'offers', 'inventory'].map(tab => (
                  <button
                    key={tab}
                    onClick={() => setActiveTab(tab)}
                    className={`text-left px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${activeTab === tab ? 'bg-green-600 text-white shadow-lg shadow-green-500/30' : 'text-gray-600 hover:bg-gray-100 hover:text-green-600'}`}
                  >
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </button>
                ))}

                <div className="mt-8 pt-6 border-t border-gray-200">
                  <button
                    onClick={() => navigate('/partner/dailyLiving/local-store-directory/dashboard')}
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
                          <FaUser className="text-green-600" /> Edit Business Details
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
                            value={dashboardData.ownerName}
                            onChange={handleDashboardChange}
                            className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all"
                            placeholder="Enter your name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Business Name</label>
                          <input
                            type="text"
                            name="businessName"
                            value={dashboardData.businessName}
                            onChange={handleDashboardChange}
                            className="w-full p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all"
                            placeholder="Enter shop/business name"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Phone Contact</label>
                          <div className="relative">
                            <FaPhone className="absolute top-4 left-3 text-gray-400" />
                            <input
                              type="tel"
                              name="phoneNumber"
                              value={dashboardData.phoneNumber}
                              onChange={handleDashboardChange}
                              className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all"
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
                              value={dashboardData.email}
                              onChange={handleDashboardChange}
                              className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all"
                              placeholder="Email address"
                            />
                          </div>
                        </div>

                        <div className="md:col-span-2 space-y-2">
                          <label className="text-sm font-bold text-gray-700">Location/Address</label>
                          <div className="relative">
                            <FaMapMarkerAlt className="absolute top-4 left-3 text-gray-400" />
                            <input
                              type="text"
                              name="locationArea"
                              value={dashboardData.locationArea}
                              onChange={handleDashboardChange}
                              className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all"
                              placeholder="Shop Location"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-end pt-6 border-t">
                        <button
                          onClick={handleSaveChanges}
                          className="px-8 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transform hover:scale-105 transition-all shadow-lg"
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
                          <FaCamera className="text-green-600" /> Store Gallery
                        </h3>
                      </div>

                      <div className="grid md:grid-cols-3 gap-6 pt-2">
                        {[
                          { type: 'storefront', label: 'Store Front View' },
                          { type: 'shelves', label: 'Shelves View' },
                          { type: 'counter', label: 'Counter View' }
                        ].map((photo) => (
                          <div key={photo.type} className="space-y-3">
                            <h4 className="text-sm font-bold text-gray-700">{photo.label}</h4>
                            <div className="relative border-2 border-dashed border-gray-200 rounded-xl p-6 hover:border-green-400 transition-all bg-white">
                              {dashboardData.photos[photo.type] ? (
                                <div className="space-y-3">
                                  <img
                                    src={dashboardData.photos[photo.type]}
                                    alt={photo.label}
                                    className="w-full h-40 object-cover rounded-lg"
                                  />
                                  <label className="cursor-pointer flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium hover:bg-green-700 transition-all">
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

                      <div className="mt-6 p-4 bg-green-50 rounded-xl border border-green-100 flex items-start gap-3">
                        <div className="text-green-600 text-xl">💡</div>
                        <p className="text-sm text-green-700">
                          <strong>Tip:</strong> High-quality photos increase customer interest by 40%. Ensure good lighting and wide angles.
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Offers Tab */}
                  {activeTab === 'offers' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <FaShoppingBasket className="text-green-600" /> Offers & Discounts
                        </h3>
                      </div>

                      <div className="space-y-4 pt-2">
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={dashboardData.offers.newOffer}
                            onChange={(e) => setDashboardData((prev) => ({ ...prev, offers: { ...prev.offers, newOffer: e.target.value } }))}
                            placeholder="e.g., 10% off on groceries above ₹500"
                            className="flex-1 p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all"
                          />
                          <button
                            onClick={handleAddOffer}
                            className="px-6 py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transform hover:scale-105 transition-all shadow-lg"
                          >
                            Add Offer
                          </button>
                        </div>

                        <div className="space-y-3">
                          <h4 className="text-sm font-bold text-gray-700 mt-6">Active Offers</h4>
                          {dashboardData.offers.items.map((offer, index) => (
                            <div key={index} className="flex items-center justify-between p-4 bg-white rounded-xl border-2 border-gray-100 hover:border-green-200 transition-all">
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
                              <FaShoppingBasket className="text-5xl mx-auto mb-3 opacity-50" />
                              <p className="text-sm">No offers added yet. Add your first offer above!</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Inventory Tab */}
                  {activeTab === 'inventory' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b pb-4">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <FaBox className="text-green-600" /> Inventory Management
                        </h3>
                        <button
                          onClick={() => setShowAddItemForm(!showAddItemForm)}
                          className="px-5 py-2 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transform hover:scale-105 transition-all shadow-lg text-sm"
                        >
                          {showAddItemForm ? 'Cancel' : '+ Add Item'}
                        </button>
                      </div>

                      {showAddItemForm && (
                        <div className="bg-green-50 p-5 rounded-xl border-2 border-green-100 space-y-4">
                          <div className="grid md:grid-cols-2 gap-4">
                            <input
                              type="text"
                              placeholder="Item Name"
                              value={newItem.name}
                              onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                              className="p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all"
                            />
                            <input
                              type="number"
                              placeholder="Price (₹)"
                              value={newItem.price}
                              onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                              className="p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all"
                            />
                            <select
                              value={newItem.category}
                              onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                              className="p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all"
                            >
                              <option>Grocery</option>
                              <option>Medical</option>
                              <option>Personal Care</option>
                              <option>Household</option>
                              <option>Snacks</option>
                            </select>
                            <select
                              value={newItem.stock}
                              onChange={(e) => setNewItem({ ...newItem, stock: e.target.value })}
                              className="p-3 bg-white border-2 border-gray-100 rounded-xl focus:border-green-500 focus:ring-0 outline-none transition-all"
                            >
                              <option>In Stock</option>
                              <option>Out of Stock</option>
                              <option>Low Stock</option>
                            </select>
                          </div>
                          <button
                            onClick={handleAddItem}
                            className="w-full py-3 bg-green-600 text-white rounded-xl font-semibold hover:bg-green-700 transform hover:scale-105 transition-all shadow-lg"
                          >
                            Add Item to Inventory
                          </button>
                        </div>
                      )}

                      <div className="bg-white rounded-xl border-2 border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50 border-b-2 border-gray-100">
                              <tr>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Item Name</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Price</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Category</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Stock</th>
                                <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase">Actions</th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                              {dashboardData.inventory.map((item, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-4 py-3">
                                    {editingItemIndex === index ? (
                                      <input
                                        type="text"
                                        value={editItemData.name}
                                        onChange={(e) => setEditItemData({ ...editItemData, name: e.target.value })}
                                        className="p-2 border-2 border-gray-100 rounded-lg w-full text-sm focus:border-green-500 outline-none"
                                      />
                                    ) : (
                                      <span className="font-medium text-gray-800">{item.name}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {editingItemIndex === index ? (
                                      <input
                                        type="number"
                                        value={editItemData.price}
                                        onChange={(e) => setEditItemData({ ...editItemData, price: e.target.value })}
                                        className="p-2 border-2 border-gray-100 rounded-lg w-full text-sm focus:border-green-500 outline-none"
                                      />
                                    ) : (
                                      <span className="text-gray-700 font-medium">₹{item.price}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {editingItemIndex === index ? (
                                      <select
                                        value={editItemData.category}
                                        onChange={(e) => setEditItemData({ ...editItemData, category: e.target.value })}
                                        className="p-2 border-2 border-gray-100 rounded-lg w-full text-sm focus:border-green-500 outline-none"
                                      >
                                        <option>Grocery</option>
                                        <option>Medical</option>
                                        <option>Personal Care</option>
                                        <option>Household</option>
                                        <option>Snacks</option>
                                      </select>
                                    ) : (
                                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded-lg text-xs font-semibold">{item.category}</span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    {editingItemIndex === index ? (
                                      <select
                                        value={editItemData.stock}
                                        onChange={(e) => setEditItemData({ ...editItemData, stock: e.target.value })}
                                        className="p-2 border-2 border-gray-100 rounded-lg w-full text-sm focus:border-green-500 outline-none"
                                      >
                                        <option>In Stock</option>
                                        <option>Out of Stock</option>
                                        <option>Low Stock</option>
                                      </select>
                                    ) : (
                                      <span
                                        className={`px-2 py-1 rounded-lg text-xs font-semibold ${item.stock === 'In Stock'
                                          ? 'bg-green-100 text-green-700'
                                          : item.stock === 'Low Stock'
                                            ? 'bg-yellow-100 text-yellow-700'
                                            : 'bg-red-100 text-red-700'
                                          }`}
                                      >
                                        {item.stock}
                                      </span>
                                    )}
                                  </td>
                                  <td className="px-4 py-3">
                                    <div className="flex gap-2">
                                      {editingItemIndex === index ? (
                                        <>
                                          <button
                                            onClick={saveEditedItem}
                                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 font-semibold transition-all"
                                          >
                                            Save
                                          </button>
                                          <button
                                            onClick={cancelEditingItem}
                                            className="px-3 py-1 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 font-semibold transition-all"
                                          >
                                            Cancel
                                          </button>
                                        </>
                                      ) : (
                                        <>
                                          <button
                                            onClick={() => startEditingItem(index)}
                                            className="px-3 py-1 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 font-semibold transition-all"
                                          >
                                            Edit
                                          </button>
                                          <button
                                            onClick={() => handleDeleteItem(index)}
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
                        {dashboardData.inventory.length === 0 && (
                          <div className="text-center py-12 text-gray-400">
                            <FaBox className="text-5xl mx-auto mb-3 opacity-50" />
                            <p className="text-sm">No items in inventory. Add your first item!</p>
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

export default StoreProfile