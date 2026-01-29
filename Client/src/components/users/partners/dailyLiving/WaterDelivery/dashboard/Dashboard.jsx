import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { usePartner } from '../../../../../../context/partnerContext'
import { FaUser, FaCheckCircle, FaChevronDown, FaChevronUp, FaTruck, FaClipboardList, FaRupeeSign } from 'react-icons/fa'

// ==========================================
// GUEST VIEW COMPONENT (Not Logged In)
// ==========================================
const GuestDashboard = ({ login }) => {
  const navigate = useNavigate()
  const [openFaq, setOpenFaq] = useState(null)

  const faqs = [
    { question: 'Who can become a Water Delivery Partner?', answer: 'RO plant owners, water distributors, and suppliers of packaged drinking water.' },
    { question: 'What items can I list?', answer: 'You can list 20L jars, 1L bottle crates, 5L cans, and even tanker services.' },
    { question: 'How do I manage jar deposits?', answer: 'You can set a security deposit amount in your product settings which is refundable.' },
    { question: 'Can I set delivery charges?', answer: 'Yes! You can define delivery charges based on distance or order value.' }
  ]

  const toggleFaq = (i) => setOpenFaq(openFaq === i ? null : i)

  const handleGetStarted = () => {
navigate('/partner-signup')
  }

  const handleUpdateProfile = () => {

    navigate('/partner/dailyLiving/water-delivery/profile')
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="grid lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-8 animate-fadeIn">
          <h1 className="text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight">
            Deliver <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">pure water</span>
            <br /> to every doorstep
          </h1>
          <p className="text-xl text-gray-300 max-w-lg leading-relaxed">
            Join the largest network of water suppliers. Manage orders, track deliveries, and grow your customer base efficiently.
          </p>

          <div className="flex gap-4">
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <FaCheckCircle className="text-cyan-400" /> <span>High Demand</span>
            </div>
            <div className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-lg border border-white/20">
              <FaCheckCircle className="text-cyan-400" /> <span>Daily Orders</span>
            </div>
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md text-gray-900 rounded-3xl shadow-2xl p-8 max-w-md ml-auto border border-white/50 animate-fadeIn my-auto">
          <div className="text-center space-y-4 mb-8">
            <h2 className="text-4xl font-extrabold text-gray-900">Welcome Partner!</h2>
            <p className="text-gray-600 font-medium">Start your digital water delivery journey.</p>
          </div>

          <div className="space-y-4">
            <button
              onClick={handleGetStarted}
              className="w-full py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold text-xl rounded-xl hover:shadow-xl hover:scale-[1.02] transition-all shadow-blue-500/30"
            >
              Get Started
            </button>

            <button
              onClick={handleUpdateProfile}
              className="w-full py-4 bg-white border-2 border-gray-200 text-gray-700 font-bold text-xl rounded-xl hover:border-blue-500 hover:text-blue-600 transition-all flex items-center justify-center gap-2"
            >
              <FaUser className="text-lg" /> Update Profile
            </button>
          </div>

          <p className="text-center text-xs text-gray-500 mt-6">By continuing, you agree to our Terms & Conditions.</p>
        </div>
      </div>

      <div className="mt-20 space-y-16">
        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 animate-fadeIn">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4 tracking-tight">Streamline your supply chain</h2>
            <p className="text-xl text-gray-700 max-w-3xl mx-auto">From households to corporate offices, manage all your water delivery clients in one place.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 text-center">
            {[
              { icon: FaTruck, title: "Smart Routing", desc: "Optimize your delivery routes to save time and fuel." },
              { icon: FaClipboardList, title: "Subscription Mgmt", desc: "Easily handle monthly subscriptions and recurring orders." },
              { icon: FaRupeeSign, title: "Digital Payments", desc: "Accept UPI, Cards, and Wallet payments directly to your account." }
            ].map((feature, i) => (
              <div key={i} className="space-y-4 group p-6 rounded-2xl hover:bg-white/60 transition-colors">
                <div className="w-20 h-20 mx-auto bg-blue-50 text-blue-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-sm">
                  <feature.icon className="text-4xl" />
                </div>
                <h3 className="text-xl font-bold text-blue-900">{feature.title}</h3>
                <p className="text-gray-800 font-medium leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white/90 backdrop-blur-md rounded-3xl p-8 lg:p-12 shadow-2xl border border-white/50 animate-fadeIn">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">Frequently Asked Questions</h2>
            <div className="space-y-4">
              {faqs.map((f, idx) => (
                <div key={idx} className="bg-white/80 rounded-xl shadow-sm overflow-hidden border border-white/60 hover:shadow-md transition-shadow">
                  <button onClick={() => toggleFaq(idx)} className="w-full px-8 py-6 text-left flex items-center justify-between group">
                    <span className="font-bold text-gray-900 text-lg group-hover:text-blue-700 transition-colors">{f.question}</span>
                    {openFaq === idx ? <FaChevronUp className="text-blue-600" /> : <FaChevronDown className="text-gray-400 group-hover:text-blue-500" />}
                  </button>
                  <div className={`px-8 bg-white/40 text-gray-800 font-medium leading-relaxed ${openFaq === idx ? 'pb-6 block' : 'hidden'}`}>
                    {f.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// PARTNER VIEW COMPONENT (Logged In)
// ==========================================
const PartnerContent = ({ partner, logout }) => {
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState('details')
  const [showAddProductForm, setShowAddProductForm] = useState(false)
  const [newProduct, setNewProduct] = useState({ name: '', price: '', capacity: '' })
  const [editingProductIndex, setEditingProductIndex] = useState(null)
  const [editProductData, setEditProductData] = useState({ name: '', price: '', capacity: '' })

  const [dashboardData, setDashboardData] = useState({
    ownerName: '',
    phoneNumber: '',
    email: '',
    businessName: '',
    locationArea: '',
    deliveryCharge: 0,
    photos: { plant: null, vehicle: null, jars: null },
    offers: { items: [], newOffer: '' },
    products: [
      { name: '20L Water Jar', price: 40, capacity: '20L' },
      { name: '1L Water Bottle (Box)', price: 150, capacity: '12L' },
      { name: '5L Water Can', price: 60, capacity: '5L' },
      { name: '25L Water Can', price: 50, capacity: '25L' }
    ]
  })

  useEffect(() => {
    if (partner?.basicDetails) {
      setDashboardData(prev => ({
        ...prev,
        ...partner.basicDetails,
        locationArea: partner.basicDetails.locationArea || partner.basicDetails.location || prev.locationArea,
        phoneNumber: partner.basicDetails.phoneNumber || partner.basicDetails.phone || prev.phoneNumber,
        deliveryCharge: partner.basicDetails.deliveryCharge || prev.deliveryCharge,
        products: partner.basicDetails.products || prev.products,
        offers: {
          items: partner.basicDetails.offers || [],
          newOffer: ''
        }
      }))
    }
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

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.price) {
      setDashboardData(prev => ({
        ...prev,
        products: [...prev.products, { ...newProduct, id: Date.now() }]
      }))
      setNewProduct({ name: '', price: '', capacity: '' })
      setShowAddProductForm(false)
    }
  }

  const startEditingProduct = (index) => {
    setEditingProductIndex(index)
    setEditProductData({ ...dashboardData.products[index] })
  }

  const cancelEditingProduct = () => {
    setEditingProductIndex(null)
    setEditProductData({ name: '', price: '', capacity: '' })
  }

  const saveEditedProduct = () => {
    setDashboardData(prev => {
      const updatedProducts = [...prev.products]
      updatedProducts[editingProductIndex] = { ...editProductData }
      return { ...prev, products: updatedProducts }
    })
    setEditingProductIndex(null)
  }

  const handleDeleteProduct = (index) => {
    if (window.confirm('Are you sure you want to remove this product?')) {
      setDashboardData(prev => ({
        ...prev,
        products: prev.products.filter((_, i) => i !== index)
      }))
    }
  }

  const handleSaveChanges = () => {
    if (activeTab === 'offers' && dashboardData.offers && dashboardData.offers.newOffer && dashboardData.offers.newOffer.trim()) {
      const item = dashboardData.offers.newOffer.trim();
      setDashboardData(prev => ({
        ...prev,
        offers: {
          ...prev.offers,
          items: [...prev.offers.items, item],
          newOffer: ''
        }
      }))
    }
    alert("Changes saved successfully!")
  }

  const handleDeleteOffer = (index) => {
    setDashboardData(prev => ({
      ...prev,
      offers: {
        ...prev.offers,
        items: prev.offers.items.filter((_, i) => i !== index)
      }
    }))
  }

  return (
    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
      <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden text-gray-900 border border-white/50 animate-fadeIn">
        <div className="grid md:grid-cols-12 min-h-[600px]">
          {/* SIDEBAR */}
          <div className="md:col-span-3 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2">
            <div className="mb-8 px-2">
              <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-cyan-500">Water Dash</h2>
              <p className="text-sm text-gray-500 font-medium truncate">Welcome, {partner?.basicDetails?.ownerName || 'Partner'}</p>
            </div>

            {['details', 'products', 'photos', 'offers'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`text-left px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
              >
                {tab === 'details' ? 'Business Details' : tab === 'products' ? 'Products & Pricing' : tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}

            <div className="mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={logout}
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
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaUser className="text-blue-600" /> Business Profile</h3>
                    <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded">ID: {partner?.id || 'N/A'}</span>
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
                        placeholder="e.g. Aqua Fresh Services"
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
                      <label className="text-sm font-bold text-gray-700">Service Location/Area</label>
                      <div className="relative">
                        <FaMapMarkerAlt className="absolute top-4 left-3 text-gray-400" />
                        <input
                          name="locationArea"
                          value={dashboardData.locationArea || ''}
                          onChange={handleDashboardChange}
                          className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 focus:ring-0 outline-none transition-all"
                          placeholder="e.g. Indiranagar, Chennai"
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
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCamera className="text-blue-600" /> Business Gallery</h3>
                  </div>
                  <div className="grid md:grid-cols-3 gap-6">
                    {['plant', 'vehicle', 'jars'].map((type) => (
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
                    <p>Tip: Uploading clear photos of your RO plant or delivery vehicle builds trust!</p>
                  </div>
                </div>
              )}

              {activeTab === 'products' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaBox className="text-blue-600" /> Water Products & Pricing</h3>
                  </div>

                  {/* Delivery Charge Section */}
                  <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-gray-800 flex items-center gap-2"><FaTruck /> Delivery Charge</h4>
                      <p className="text-sm text-gray-600">Fixed delivery charge per order (if applicable)</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-gray-600">₹</span>
                      <input
                        type="number"
                        name="deliveryCharge"
                        value={dashboardData.deliveryCharge}
                        onChange={handleDashboardChange}
                        className="w-24 p-2 border border-gray-300 rounded-lg text-center font-bold"
                      />
                    </div>
                  </div>

                  {!showAddProductForm ? (
                    <div className="space-y-4">
                      {dashboardData.products.map((product, index) => (
                        <div key={index} className="bg-white border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                          {editingProductIndex === index ? (
                            <div className="w-full flex flex-col md:flex-row gap-4 items-center">
                              <div className="flex-1 space-y-2 w-full">
                                <label className="text-xs font-bold text-gray-500">Product Name</label>
                                <input
                                  type="text"
                                  value={editProductData.name}
                                  onChange={(e) => setEditProductData(prev => ({ ...prev, name: e.target.value }))}
                                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                                />
                              </div>
                              <div className="w-full md:w-32 space-y-2">
                                <label className="text-xs font-bold text-gray-500">Capacity</label>
                                <input
                                  type="text"
                                  value={editProductData.capacity}
                                  onChange={(e) => setEditProductData(prev => ({ ...prev, capacity: e.target.value }))}
                                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"
                                />
                              </div>
                              <div className="w-full md:w-32 space-y-2">
                                <label className="text-xs font-bold text-gray-500">Price (₹)</label>
                                <input
                                  type="number"
                                  value={editProductData.price}
                                  onChange={(e) => setEditProductData(prev => ({ ...prev, price: e.target.value }))}
                                  className="w-full p-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none font-bold"
                                />
                              </div>
                              <div className="flex items-center gap-2 mt-4 md:mt-0">
                                <button onClick={saveEditedProduct} className="p-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors text-sm font-bold px-4">Save</button>
                                <button onClick={cancelEditingProduct} className="p-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors text-sm font-bold px-4">Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-cyan-50 rounded-xl flex items-center justify-center text-cyan-500 group-hover:bg-cyan-100 transition-colors">
                                  <FaTint className="text-xl" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg text-gray-900">{product.name}</h4>
                                  <p className="text-sm text-gray-500">Capacity: {product.capacity} | Price: ₹{product.price}</p>
                                </div>
                              </div>
                              <div className="flex items-center gap-4 mt-4 md:mt-0">
                                <span className="text-xl font-bold text-green-600">₹{product.price}</span>
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => startEditingProduct(index)}
                                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-colors"
                                    title="Edit Product"
                                  >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-pencil-fill" viewBox="0 0 16 16">
                                      <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708l-3-3zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207l6.5-6.5zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.499.499 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11l.178-.178z" />
                                    </svg>
                                  </button>
                                  <button
                                    onClick={() => handleDeleteProduct(index)}
                                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors"
                                    title="Delete Product"
                                  >
                                    <FaTrash />
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      ))}

                      <button
                        onClick={() => setShowAddProductForm(true)}
                        className="w-full py-4 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-semibold hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
                      >
                        <FaPlus /> Add New Product
                      </button>
                    </div>
                  ) : (
                    <div className="bg-gray-50 p-6 rounded-2xl border border-gray-200 animate-fadeIn">
                      <h4 className="font-bold text-gray-800 mb-4">Add New Water Product</h4>
                      <div className="grid md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Product Name</label>
                          <input
                            type="text"
                            value={newProduct.name}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                            placeholder="e.g. 10L Can"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Capacity</label>
                          <input
                            type="text"
                            value={newProduct.capacity}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, capacity: e.target.value }))}
                            placeholder="e.g. 10 Liters"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Price (₹)</label>
                          <input
                            type="number"
                            value={newProduct.price}
                            onChange={(e) => setNewProduct(prev => ({ ...prev, price: e.target.value }))}
                            placeholder="0"
                            className="w-full p-3 border border-gray-300 rounded-xl focus:border-blue-500 outline-none"
                          />
                        </div>
                      </div>
                      <div className="flex gap-4 mt-6">
                        <button
                          onClick={handleAddProduct}
                          className="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-md flex-1"
                        >
                          Add Product
                        </button>
                        <button
                          onClick={() => setShowAddProductForm(false)}
                          className="px-6 py-3 bg-white border border-gray-300 text-gray-700 font-bold rounded-xl hover:bg-gray-50 flex-1"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="pt-4 flex justify-end">
                    <button onClick={handleSaveChanges} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/20 transform hover:-translate-y-1 transition-all">Save Changes</button>
                  </div>
                </div>
              )}

              {activeTab === 'offers' && (
                <div className="space-y-6 animate-fadeIn">
                  <div className="flex items-center justify-between border-b pb-4">
                    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaTag className="text-blue-600" /> Offers & Discounts</h3>
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
                        placeholder="E.g., 'First Order FREE Delivery'"
                      />
                      <button onClick={handleSaveChanges} className="px-6 py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 shadow-lg">Add</button>
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

            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ==========================================
// MAIN DASHBOARD COMPONENT
// ==========================================
const Dashboard = () => {
  const { partner, login } = usePartner()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-cyan-800 to-teal-900 relative overflow-hidden">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1548839140-29a749e1cf4d?q=80&w=2000&auto=format&fit=crop"
          alt="Water Delivery"
          className="w-full h-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/80 via-cyan-900/70 to-teal-900/80"></div>
      </div>

      {/* Pattern Overlay */}
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0zNiAxOGMzLjMxNCAwIDYgMi42ODYgNiA2cy0yLjY4NiA2LTYgNi02LTIuNjg2LTYtNiAyLjY4Ni02IDYtNnoiIHN0cm9rZT0iI2ZmZiIgc3Ryb2tlLW9wYWNpdHk9Ii4xIiBzdHJva2Utd2lkdGg9IjIiLz48L2c+PC9zdmc+')] opacity-20"></div>

      <GuestDashboard login={login} />
    </div>
  )
}

export default Dashboard