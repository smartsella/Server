import React, { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { usePartner } from '../../../../../context/partnerContext'
import {
  FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaBed, FaArrowLeft, FaCamera, FaCheckCircle,
  FaTrash, FaHotel, FaPlus, FaBuilding, FaHome, FaUtensils, FaTint, FaTshirt, FaTools,
  FaStore, FaBook, FaGraduationCap, FaChalkboardTeacher, FaBriefcase, FaUserTie,
  FaCar, FaCalendarAlt, FaTicketAlt
} from 'react-icons/fa'
import { MdApartment } from 'react-icons/md'

const AccProfile = () => {
  const navigate = useNavigate()
  const { serviceType } = useParams()
  const { partner } = usePartner()
  const [activeTab, setActiveTab] = useState('details')
  const [loading, setLoading] = useState(true)
  const [step, setStep] = useState(1)
  const [errors, setErrors] = useState({})

  const [dashboardData, setDashboardData] = useState({
    id: '',
    ownerName: '',
    phoneNumber: '',
    email: '',
    propertyName: '',
    locationArea: '',
    roomsAvailable: '',
    // New fields
    gender: '',
    noticePeriod: '',
    roomTypes: [],
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
    rules: { noOutsiders: true, fineAmount: 500, additionalRules: '', savedRules: [] },
    photos: { room: null, bathroom: null, exterior: null },
    photoPublicIds: { room: null, bathroom: null, exterior: null }
  })

  // Store pending files before upload
  const [pendingPhotos, setPendingPhotos] = useState({
    room: null,
    bathroom: null,
    exterior: null
  })

  // Cloudinary helpers
  const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || ''
  const buildCloudinaryUrl = (publicId, format = 'jpg') => {
    if (!publicId) return null
    // If publicId already looks like a full URL, return it
    if (publicId.startsWith('http')) return publicId
    // Make sure there is no leading slash
    const cleaned = publicId.replace(/^\/+/, '')
    // If publicId already includes an extension, don't append
    const hasExt = /\.[a-zA-Z0-9]{2,5}$/.test(cleaned)
    return `https://res.cloudinary.com/${CLOUDINARY_CLOUD_NAME}/image/upload/${cleaned}${hasExt ? '' : '.' + format}`
  }

  // Use a small local inline SVG as a fallback so we don't depend on external placeholder DNS
  const LOCAL_PLACEHOLDER_SVG = `data:image/svg+xml;utf8,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600"><rect fill="%23f5f7fa" width="100%" height="100%"/><text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="%23888" font-family="Arial, Helvetica, sans-serif" font-size="28">No Image</text></svg>')}`

  // When an <img> fails to load, try the publicId-based URL or a placeholder
  const handleImageError = (e, type) => {
    e.target.onerror = null
    const publicId = dashboardData.photoPublicIds?.[type]
    if (publicId) {
      const fallback = buildCloudinaryUrl(publicId)
      if (fallback && e.target.src !== fallback) {
        e.target.src = fallback
        return
      }
    }
    // final fallback (local inline SVG placeholder) to avoid external DNS failures
    console.warn('Image missing, used fallback for', type, 'original src:', e.target.src)
    e.target.src = LOCAL_PLACEHOLDER_SVG
  }

  // Normalize room type keys to display labels used by UI
  const normalizeRoomTypeName = (raw) => {
    if (!raw) return raw
    const s = String(raw).trim().toLowerCase()
    if (s.includes('single')) return 'Single Sharing'
    if (s.includes('double')) return 'Double Sharing'
    if (s.includes('triple')) return 'Triple Sharing'
    // common abbreviations
    if (s === '1' || s === 'single-sharing' || s === 'single_sharing') return 'Single Sharing'
    if (s === '2' || s === 'double-sharing' || s === 'double_sharing') return 'Double Sharing'
    if (s === '3' || s === 'triple-sharing' || s === 'triple_sharing') return 'Triple Sharing'
    // fallback: title case
    return raw.split(/[_\- ]+/).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
  }

  // Normalize gender values to UI options
  const normalizeGender = (raw) => {
    if (!raw) return raw
    const s = String(raw).trim().toLowerCase()
    if (s.startsWith('m')) return 'Male'
    if (s.startsWith('f')) return 'Female'
    if (s.includes('co') || s.includes('coliv') || s.includes('co-living') || s.includes('co living')) return 'Co-living'
    return raw
  }

  const amenitiesOptions = {
    furniture: [
      "Furnished", "Semi-furnished", "Bed with mattress", "Pillow, bedsheet, blanket",
      "Cupboard/Wardrobe", "Study table & chair", "Curtains", "Fan", "Light", "Air conditioner/Heater"
    ],
    bathroom: [
      "Attached bathroom", "Common bathroom", "24×7 water supply (hot & cold)",
      "Geyser", "Western toilet", "Indian toilet", "Mirror", "Bucket & mug", "Regular cleaning"
    ],
    foodKitchen: [
      "Breakfast included", "Lunch included", "Dinner included", "RO drinking water",
      "Common dining area", "Refrigerator", "Microwave"
    ],
    utilities: [
      "High-speed Wi-Fi", "Electricity included", "Power backup/Inverter", "Water purifier (RO)"
    ],
    laundry: ["Washing machine", "Drying area", "Iron available"],
    cleaning: [
      "Daily room cleaning", "Alternate day cleaning", "Washroom cleaning", "Garbage disposal", "Pest control"
    ],
    security: [
      "CCTV cameras", "Secure entry/Biometric", "Key access", "Warden/Caretaker", "Fire safety equipment", "First-aid kit"
    ],
    rulesConvenience: [
      "Flexible entry/exit timing", "Visitor policy", "Quiet hours enforced",
      "Two-wheeler parking", "Four-wheeler parking", "Lift available"
    ],
    location: [
      "Near college/office", "Public transport access", "Nearby shops/pharmacy", "Hospital nearby"
    ],
  };

  useEffect(() => {
    const fetchPartnerDetails = async () => {
      try {
        setLoading(true)

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

        if (!partnerEmail) {
          if (partner?.basicDetails) {
            updateDashboardData({ ...partner.basicDetails })
          }
          setLoading(false)
          return
        }

        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/properties?email=${encodeURIComponent(partnerEmail)}`)

        if (!response.ok) {
          throw new Error('Failed to fetch partner details')
        }

        const result = await response.json()

        if (result.success && result.data?.length > 0) {
          const property = result.data[0]
          // Parse property_images if it exists (may be stored as JSON string)
          let propertyImages = property.property_images || {}
          if (typeof propertyImages === 'string') {
            try { propertyImages = JSON.parse(propertyImages) } catch (e) { propertyImages = {} }
          }
          const imagesArray = propertyImages.images || []
          const photoPublicIds = propertyImages.photoPublicIds || {}
          
          // Convert images array to photos object
          const photos = {
            room: imagesArray[0] || null,
            bathroom: imagesArray[1] || null,
            exterior: imagesArray[2] || null
          }

          // Resolve photos: prefer explicit URL from images array, else build from publicId
          const resolvedPhotos = ['room', 'bathroom', 'exterior'].reduce((acc, t) => {
            const img = photos[t]
            if (img) {
              acc[t] = img.startsWith('http') ? img : buildCloudinaryUrl(img)
            } else if (photoPublicIds[t]) {
              acc[t] = buildCloudinaryUrl(photoPublicIds[t])
            } else {
              acc[t] = null
            }
            return acc
          }, {})

          // Parse and transform amenities (may be JSON string or object of flags)
          let amenitiesObj = property.amenities || {}
          if (typeof amenitiesObj === 'string') {
            try { amenitiesObj = JSON.parse(amenitiesObj) } catch (e) { amenitiesObj = {} }
          }

          const transformedAmenities = Object.keys(amenitiesOptions).reduce((acc, key) => {
            const val = amenitiesObj[key]
            if (Array.isArray(val)) {
              acc[key] = val
            } else if (val && typeof val === 'object') {
              acc[key] = Object.entries(val).filter(([k, v]) => v === true).map(([k]) => k)
            } else {
              acc[key] = []
            }
            return acc
          }, {})

          console.log('Parsed amenities:', transformedAmenities)

          // Parse room_pricing (backend) into roomTypes expected by UI
          const rawRoomPricing = property.room_pricing || property.roomPricing || property.room_types || property.roomTypes
          let parsedRoomTypes = []
          if (rawRoomPricing) {
            let rp = rawRoomPricing
            if (typeof rawRoomPricing === 'string') {
              try { rp = JSON.parse(rawRoomPricing) } catch (e) { rp = null }
            }

            if (Array.isArray(rp)) {
              // ensure type names normalize
              parsedRoomTypes = rp.map(item => {
                if (item && typeof item === 'object') {
                  const t = normalizeRoomTypeName(item.type || item.name || '')
                  return { type: t, rent: item.rent ?? item.price ?? item.amount ?? '', deposit: item.deposit ?? item.security ?? '' }
                }
                // item might be primitive like { "Single Sharing": { rent:.. }} handled below
                return item
              })
            } else if (rp && typeof rp === 'object') {
              parsedRoomTypes = Object.entries(rp).map(([k, v]) => {
                const t = normalizeRoomTypeName(k)
                if (v && typeof v === 'object') {
                  return { type: t, rent: v.rent ?? v.price ?? v.amount ?? '', deposit: v.deposit ?? v.security ?? '' }
                }
                return { type: t, rent: v ?? '', deposit: '' }
              })
            }
          }

          // Attempt to detect room pricing inside nested objects if not found directly
          if (parsedRoomTypes.length === 0) {
            const findCandidate = (obj, path = []) => {
              if (!obj || typeof obj !== 'object') return null
              for (const [k, v] of Object.entries(obj)) {
                // Look for keys explicitly related to pricing/rates to avoid matching generic keys like "rooms_available"
                if (/(room_pricing|room_types|roomPricing|roomTypes|pricing|price|rates|rent)/i.test(k)) return { key: k, value: v, path: path.concat(k) }
                if (typeof v === 'object' && v !== null) {
                  const nested = findCandidate(v, path.concat(k))
                  if (nested) return nested
                }
              }
              return null
            }

            const candidate = findCandidate(property)
            console.log('Room pricing candidate search result:', candidate)

            // Ignore numeric/boolean candidates (e.g., rooms_available = 3) as they are not pricing objects
            if (candidate && typeof candidate.value !== 'number' && typeof candidate.value !== 'boolean') {
              let cand = candidate.value
              if (typeof cand === 'string') {
                try { cand = JSON.parse(cand) } catch { }
              }
              if (Array.isArray(cand)) {
                parsedRoomTypes = cand.map(item => ({ type: normalizeRoomTypeName(item.type || item.name || ''), rent: item.rent ?? item.price ?? item.amount ?? '', deposit: item.deposit ?? item.security ?? '' }))
              } else if (cand && typeof cand === 'object') {
                parsedRoomTypes = Object.entries(cand).map(([k, v]) => ({ type: normalizeRoomTypeName(k), rent: v?.rent ?? v?.price ?? v ?? '', deposit: v?.deposit ?? v?.security ?? '' }))
              }
            } else {
              if (candidate) console.log('Ignored candidate (not pricing):', candidate)
            }
          }

          console.log('Fetched property => gender_type:', property.gender_type, 'notice_period:', property.notice_period)
          console.log('Parsed roomTypes:', parsedRoomTypes)
          setDashboardData(prev => ({
            ...prev,
            id: property.id || prev.id,
            ownerName: property.owner_name || prev.ownerName,
            phoneNumber: property.phone_number || prev.phoneNumber,
            email: property.email_id || prev.email,
            propertyName: property.property_name || prev.propertyName,
            locationArea: property.location || prev.locationArea,
            roomsAvailable: property.rooms_available ?? prev.roomsAvailable,
            gender: normalizeGender(property.gender_type || property.gender || prev.gender),
            noticePeriod: property.notice_period ?? property.noticePeriod ?? prev.noticePeriod,
            roomTypes: parsedRoomTypes.length > 0 ? parsedRoomTypes : (property.roomTypes || prev.roomTypes || []),
            // Set parsed/normalized amenities so checkboxes reflect DB flags
            amenities: transformedAmenities || prev.amenities,
            rules: {
              noOutsiders: property.rules?.noOutsiders ?? prev.rules.noOutsiders,
              fineAmount: property.rules?.fineAmount || prev.rules.fineAmount,
              additionalRules: property.rules?.additionalRules || prev.rules.additionalRules,
              savedRules: property.rules?.savedRules || prev.rules.savedRules || []
            },
            photos: resolvedPhotos,
            photoPublicIds: photoPublicIds
          }))
        } else if (partner?.basicDetails) {
          updateDashboardData({ ...partner.basicDetails })
        }
      } catch (error) {
        console.error('Error fetching partner details:', error)
        if (partner?.basicDetails) {
          updateDashboardData({ ...partner.basicDetails })
        }
      } finally {
        setLoading(false)
      }
    }

    fetchPartnerDetails()
  }, [partner])

  const updateDashboardData = (data) => {
    const defaultAmenities = {
      furniture: [], bathroom: [], foodKitchen: [], utilities: [],
      laundry: [], cleaning: [], security: [], rulesConvenience: [], location: []
    }

    // Accept amenities as object/JSON-string or as arrays and normalize to arrays per category
    let incomingAmenities = data.amenities || {}
    if (typeof incomingAmenities === 'string') {
      try { incomingAmenities = JSON.parse(incomingAmenities) } catch (e) { incomingAmenities = {} }
    }

    const mergedAmenities = { ...defaultAmenities }
    Object.keys(defaultAmenities).forEach(key => {
      const val = incomingAmenities[key]
      if (Array.isArray(val)) {
        mergedAmenities[key] = val
      } else if (val && typeof val === 'object') {
        mergedAmenities[key] = Object.entries(val).filter(([k, v]) => v === true).map(([k]) => k)
      }
    })

    console.log('Normalized amenities in updateDashboardData:', mergedAmenities)

    // Parse room_pricing from various possible keys
    const rawRoomPricing = data.room_pricing || data.roomPricing || data.room_types || data.roomTypes
    let parsedRoomTypes = []
    if (rawRoomPricing) {
      let rp = rawRoomPricing
      if (typeof rawRoomPricing === 'string') {
        try { rp = JSON.parse(rawRoomPricing) } catch (e) { rp = null }
      }
      if (Array.isArray(rp)) {
        parsedRoomTypes = rp.map(item => {
          if (item && typeof item === 'object') {
            const t = normalizeRoomTypeName(item.type || item.name || '')
            return { type: t, rent: item.rent ?? item.price ?? item.amount ?? '', deposit: item.deposit ?? item.security ?? '' }
          }
          return item
        })
      } else if (rp && typeof rp === 'object') {
        parsedRoomTypes = Object.entries(rp).map(([k, v]) => {
          const t = normalizeRoomTypeName(k)
          if (v && typeof v === 'object') return { type: t, rent: v.rent ?? v.price ?? v.amount ?? '', deposit: v.deposit ?? v.security ?? '' }
          return { type: t, rent: v ?? '', deposit: '' }
        })
      }
    }

    // If still empty, try to detect nested candidate in the provided data
    if (parsedRoomTypes.length === 0) {
      const findCandidate = (obj, path = []) => {
        if (!obj || typeof obj !== 'object') return null
        for (const [k, v] of Object.entries(obj)) {
          // target explicit pricing-like keys to avoid false positives like "rooms_available"
          if (/(room_pricing|room_types|roomPricing|roomTypes|pricing|price|rates|rent)/i.test(k)) return { key: k, value: v, path: path.concat(k) }
          if (typeof v === 'object' && v !== null) {
            const nested = findCandidate(v, path.concat(k))
            if (nested) return nested
          }
        }
        return null
      }
      const candidate = findCandidate(data)
      console.log('Room pricing candidate in updateDashboardData:', candidate)
      // Ignore numeric/boolean candidates
      if (candidate && typeof candidate.value !== 'number' && typeof candidate.value !== 'boolean') {
        let cand = candidate.value
        if (typeof cand === 'string') {
          try { cand = JSON.parse(cand) } catch { }
        }
        if (Array.isArray(cand)) {
          parsedRoomTypes = cand.map(item => ({ type: normalizeRoomTypeName(item.type || item.name || ''), rent: item.rent ?? item.price ?? item.amount ?? '', deposit: item.deposit ?? item.security ?? '' }))
        } else if (cand && typeof cand === 'object') {
          parsedRoomTypes = Object.entries(cand).map(([k, v]) => ({ type: normalizeRoomTypeName(k), rent: v?.rent ?? v?.price ?? v ?? '', deposit: v?.deposit ?? v?.security ?? '' }))
        }
      }
    }

    // Also accept/parse property_images here
    let propertyImages = data.property_images || data.propertyImages || {}
    if (typeof propertyImages === 'string') {
      try { propertyImages = JSON.parse(propertyImages) } catch (e) { propertyImages = {} }
    }
    const imagesArray = propertyImages.images || []
    const photoPublicIds = propertyImages.photoPublicIds || {}
    const photosFromImages = {
      room: imagesArray[0] || null,
      bathroom: imagesArray[1] || null,
      exterior: imagesArray[2] || null
    }
    const resolvedPhotos = ['room', 'bathroom', 'exterior'].reduce((acc, t) => {
      const img = photosFromImages[t]
      if (img) {
        acc[t] = img.startsWith('http') ? img : buildCloudinaryUrl(img)
      } else if (photoPublicIds[t]) {
        acc[t] = buildCloudinaryUrl(photoPublicIds[t])
      } else {
        acc[t] = null
      }
      return acc
    }, {})

    setDashboardData(prev => ({
      ...prev,
      id: data.id || prev.id,
      ownerName: data.ownerName || data.owner_name || prev.ownerName,
      phoneNumber: data.phoneNumber || data.phone_number || prev.phoneNumber,
      email: data.email || data.email_id || prev.email,
      propertyName: data.propertyName || data.property_name || prev.propertyName,
      locationArea: data.locationArea || data.location || prev.locationArea,
      roomsAvailable: data.roomsAvailable ?? data.rooms_available ?? prev.roomsAvailable,
      gender: normalizeGender(data.gender || data.gender_type || prev.gender),
      noticePeriod: data.noticePeriod ?? data.notice_period ?? prev.noticePeriod,
      roomTypes: parsedRoomTypes.length > 0 ? parsedRoomTypes : (data.roomTypes || data.room_types || prev.roomTypes || []),
      amenities: mergedAmenities,
      rules: {
        noOutsiders: data.rules?.noOutsiders ?? prev.rules.noOutsiders,
        fineAmount: data.rules?.fineAmount || prev.rules.fineAmount,
        additionalRules: data.rules?.additionalRules || prev.rules.additionalRules,
        savedRules: data.rules?.savedRules || prev.rules.savedRules || []
      },
      photos: Object.values(resolvedPhotos).some(Boolean) ? resolvedPhotos : (data.photos || prev.photos)
    }))
  }

  const handleDashboardChange = (e) => {
    const { name, value, type, checked } = e.target
    if (name in dashboardData.rules) {
      setDashboardData(prev => ({
        ...prev,
        rules: { ...prev.rules, [name]: type === 'checkbox' ? checked : value }
      }))
    } else {
      setDashboardData(prev => ({ ...prev, [name]: value }))
    }
  }

  const handleRoomTypeChange = (type, field, value) => {
    const updatedRoomTypes = [...dashboardData.roomTypes];
    const existingIndex = updatedRoomTypes.findIndex((rt) => rt.type === type);

    if (existingIndex >= 0) {
      updatedRoomTypes[existingIndex][field] = value;
    } else {
      updatedRoomTypes.push({ type, [field]: value });
    }

    setDashboardData({ ...dashboardData, roomTypes: updatedRoomTypes });
  };

  const handleAmenityToggle = (category, amenity) => {
    const currentCategoryVal = dashboardData.amenities[category];
    const currentAmenities = Array.isArray(currentCategoryVal) ? currentCategoryVal : [];

    const updatedAmenities = currentAmenities.includes(amenity)
      ? currentAmenities.filter((a) => a !== amenity)
      : [...currentAmenities, amenity];

    setDashboardData({
      ...dashboardData,
      amenities: {
        ...dashboardData.amenities,
        [category]: updatedAmenities,
      },
    });
  };

  const handleDeleteRule = async (index) => {
    try {
      // Update local state first
      const updatedRules = dashboardData.rules.savedRules.filter((_, i) => i !== index);
      
      setDashboardData(prev => ({
        ...prev,
        rules: {
          ...prev.rules,
          savedRules: updatedRules
        }
      }));

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
        console.error('Unable to delete from database: Email not found');
        return;
      }

      // Prepare update payload with updated rules
      const updatePayload = {
        rules: {
          ...dashboardData.rules,
          savedRules: updatedRules
        }
      };

      // Send update request to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/properties/rules?email=${encodeURIComponent(partnerEmail)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatePayload)
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Failed to delete rule from database');
      }

      console.log('Rule deleted successfully from database');
    } catch (error) {
      console.error('Error deleting rule:', error);
      alert(`Failed to delete rule: ${error.message}`);
    }
  }

  const handlePhotoUpload = (e, type) => {
    const file = e.target.files[0]
    if (!file) return

    // Store the file for later upload
    setPendingPhotos(prev => ({
      ...prev,
      [type]: file
    }))

    // Show local preview
    const localPreview = URL.createObjectURL(file)
    setDashboardData(prev => ({
      ...prev,
      photos: { ...prev.photos, [type]: localPreview }
    }))
  }

  const handleSavePhotos = async () => {
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

      // Upload pending photos to Cloudinary
      const newPhotos = { ...dashboardData.photos };
      const newPhotoPublicIds = { ...dashboardData.photoPublicIds };

      for (const type of ['room', 'bathroom', 'exterior']) {
        if (pendingPhotos[type]) {
          // Get old publicId if exists
          const oldPublicId = dashboardData.photoPublicIds?.[type] || null;

          // Prepare form data
          const formData = new FormData();
          formData.append('image', pendingPhotos[type]);
          formData.append('email', partnerEmail);
          formData.append('photoType', type);
          formData.append('serviceType', serviceType || 'PG');
          if (oldPublicId) {
            formData.append('oldPublicId', oldPublicId);
          }

          // Upload to backend
          const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/upload-image`, {
            method: 'POST',
            body: formData
          });

          const result = await response.json();
          console.log('Backend response:', result);
          console.log('Uploaded file name:', result.data?.fileName);

          if (response.ok && result.success) {
            console.log('Image uploaded successfully to:', result.data.url);
            console.log('File name:', result.data.fileName);
            if (oldPublicId) {
              console.log('Old photo deleted from Cloudinary:', oldPublicId);
            }
            // Update with the Cloudinary URL and publicId
            newPhotos[type] = result.data.url;
            newPhotoPublicIds[type] = result.data.publicId;
          } else {
            throw new Error(result.message || `Failed to upload ${type} image`);
          }
        }
      }

      // Update state with new photo URLs
      setDashboardData(prev => ({
        ...prev,
        photos: newPhotos,
        photoPublicIds: newPhotoPublicIds
      }));

      // Clear pending photos
      setPendingPhotos({
        room: null,
        bathroom: null,
        exterior: null
      });

      // Prepare update payload with photos and photoPublicIds
      const updatePayload = {
        photos: newPhotos,
        photoPublicIds: newPhotoPublicIds
      };

      // Send update request to backend to save to database
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/properties/photos?email=${encodeURIComponent(partnerEmail)}`,
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
        alert('Photos saved successfully!');
      } else {
        throw new Error(result.message || 'Failed to save photos');
      }
    } catch (error) {
      console.error('Error saving photos:', error);
      alert(`Failed to save photos: ${error.message}`);
    }
  }

  const handleSaveRules = async () => {
    try {
      // If there's an additional rule, add it to savedRules first
      let dataToSave = { ...dashboardData };
      
      if (dashboardData.rules.additionalRules.trim()) {
        const newRule = dashboardData.rules.additionalRules.trim();
        dataToSave = {
          ...dashboardData,
          rules: {
            ...dashboardData.rules,
            savedRules: [...(dashboardData.rules.savedRules || []), newRule],
            additionalRules: ''
          }
        };
        
        // Update local state
        setDashboardData(dataToSave);
      }

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

      // Prepare update payload with rules
      const updatePayload = {
        rules: dataToSave.rules
      };

      // Send update request to backend
      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/properties/rules?email=${encodeURIComponent(partnerEmail)}`,
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
        alert('Rules saved successfully!');
      } else {
        throw new Error(result.message || 'Failed to save rules');
      }
    } catch (error) {
      console.error('Error saving rules:', error);
      alert(`Failed to save rules: ${error.message}`);
    }
  }

  const validateStep1 = () => {
    const newErrors = {}
    if (!dashboardData.ownerName?.trim()) newErrors.ownerName = 'Owner name is required'
    if (!dashboardData.propertyName?.trim()) newErrors.propertyName = 'Property name is required'
    if (!dashboardData.phoneNumber) newErrors.phoneNumber = 'Phone number is required'
    if (!dashboardData.roomsAvailable) newErrors.roomsAvailable = 'Number of rooms is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateStep2 = () => {
    const newErrors = {}
    if (!dashboardData.gender) newErrors.gender = 'Please select a gender type'

    // Check if at least one room type has valid rent and deposit
    const validRoomTypes = dashboardData.roomTypes.filter(rt => rt.rent && rt.deposit)
    // if (validRoomTypes.length === 0) {
    //   newErrors.roomTypes = 'Please add at least one room type with rent and deposit'
    // }

    // if (!dashboardData.noticePeriod) newErrors.noticePeriod = 'Notice period is required'

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const nextStep = () => {
    if (step === 1 && !validateStep1()) return
    if (step === 2 && !validateStep2()) return
    if (step < 4) setStep(step + 1)
  }

  const prevStep = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSaveChanges = async () => {
    try {
      let dataToSave = { ...dashboardData };

      if (activeTab === 'rules' && dashboardData.rules.additionalRules.trim()) {
        const newRule = dashboardData.rules.additionalRules.trim();
        dataToSave = {
          ...dashboardData,
          rules: {
            ...dashboardData.rules,
            savedRules: [...(dashboardData.rules.savedRules || []), newRule],
            additionalRules: ''
          }
        };
        setDashboardData(dataToSave);
      }

      let partnerEmail = partner?.email || partner?.basicDetails?.email;
      if (!partnerEmail) {
        const storedPartner = sessionStorage.getItem('partner_session');
        if (storedPartner) partnerEmail = JSON.parse(storedPartner)?.email;
      }
      if (!partnerEmail) {
        const storedUser = localStorage.getItem('user');
        if (storedUser) partnerEmail = JSON.parse(storedUser)?.email;
      }

      if (!partnerEmail) {
        alert('Unable to save: Email not found. Please log in again.');
        return;
      }

      const response = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ''}/api/partners/properties?email=${encodeURIComponent(partnerEmail)}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(dataToSave)
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

  const handleGoBack = () => {
    navigate(`/partner/accommodation/${serviceType}/dashboard`)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 font-sans flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600 font-medium">Loading partner details...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative min-h-screen bg-gray-900 text-white overflow-y-auto">
        <div className="fixed inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1564013799919-ab600027ffc6?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
            alt="Hotel"
            className="w-full h-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-linear-to-br from-black/80 via-black/50 to-transparent"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20">
          <div className="bg-white/90 backdrop-blur-xl rounded-3xl shadow-2xl overflow-hidden text-gray-900 border border-white/50 animate-fadeIn">
            <div className="grid md:grid-cols-12 h-[80vh] min-h-150">
              {/* Sidebar */}
              <div className="md:col-span-3 bg-gray-50/50 border-r border-gray-100 p-6 flex flex-col gap-2 overflow-y-auto">
                <div className="mb-8 px-2 shrink-0">
                  <h2 className="text-2xl font-extrabold bg-clip-text text-transparent bg-linear-to-r from-blue-600 to-indigo-600">Partner Dash</h2>
                  <p className="text-sm text-gray-500 font-medium truncate">Welcome, {dashboardData.ownerName || 'Partner'}</p>
                </div>

                <div className="space-y-2 shrink-0">
                  <button
                    onClick={() => setActiveTab('details')}
                    className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${activeTab === 'details' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
                  >
                    Edit Details
                  </button>

                  {['photos', 'rules', 'properties'].map(tab => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`w-full text-left px-4 py-3 rounded-xl font-medium transition-all transform hover:scale-105 ${activeTab === tab ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-gray-600 hover:bg-gray-100 hover:text-blue-600'}`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>

                <div className="mt-auto pt-6 border-t border-gray-200 shrink-0">
                  <button
                    onClick={handleGoBack}
                    className="w-full text-left px-4 py-3 rounded-xl font-medium text-red-600 hover:bg-red-50 hover:text-red-700 transition-all flex items-center gap-2 group"
                  >
                    <span className="transform group-hover:-translate-x-1 transition-transform">←</span> Go Back
                  </button>
                </div>
              </div>

              {/* Main Content Area */}
              <div className="md:col-span-9 flex flex-col h-full bg-white/50 overflow-hidden">

                {/* Fixed Header Section */}
                <div className="p-6 pb-4 border-b bg-white/90 backdrop-blur-md z-10 shrink-0">
                  <div className="max-w-4xl mx-auto">
                    {activeTab === 'details' && (
                      <div className="flex items-center justify-between">
                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
                          <FaUser className="text-blue-600" /> Property Details
                        </h3>
                        <div className="flex items-center space-x-2">
                          {[1, 2, 3, 4].map(s => (
                            <div key={s} className="flex items-center">
                              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors duration-300 ${step >= s ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                                {s}
                              </div>
                              {s < 4 && <div className={`w-8 h-1 transition-colors duration-300 ${step > s ? 'bg-blue-600' : 'bg-gray-200'}`} />}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {activeTab === 'photos' && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCamera className="text-blue-600" /> Property Gallery</h3>
                        </div>
                        <div className="grid md:grid-cols-3 gap-6">
                          {['room', 'bathroom', 'exterior'].map((type) => (
                            <div key={type} className="space-y-3">
                              <label className="block text-sm font-bold text-gray-700 capitalize">{type} View</label>
                              <div className="relative group w-full aspect-4/3 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-300 flex flex-col items-center justify-center overflow-hidden hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer">
                                {(dashboardData.photos[type] || dashboardData.photoPublicIds?.[type]) ? (
                                  <>
                                    <img
                                      src={dashboardData.photos[type] || buildCloudinaryUrl(dashboardData.photoPublicIds?.[type])}
                                      alt={type}
                                      onError={(e) => handleImageError(e, type)}
                                      className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    />
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
                          <p>Tip: High-quality photos increase booking chances by 40%. Ensure good lighting and wide angles.</p>
                        </div>
                        <div className="pt-4 flex justify-end">
                          <button onClick={handleSavePhotos} className="px-8 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-xl shadow-blue-600/20 transform hover:-translate-y-1 transition-all">Save Photos</button>
                        </div>
                      </div>
                    )}

                    {activeTab === 'rules' && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center justify-between">
                          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaCheckCircle className="text-blue-600" /> House Rules & Policies</h3>
                        </div>

                        <div className="p-6 bg-linear-to-br from-red-50 to-pink-50 border border-red-100 rounded-2xl space-y-4 shadow-sm">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <div className="p-2 bg-red-100 rounded-lg text-red-600"><FaUser /></div>
                              <label className="text-lg font-bold text-gray-800">Strict Warning: No Outsiders</label>
                            </div>
                            <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                              <input type="checkbox" name="toggle" id="toggle" checked={dashboardData.rules?.noOutsiders} onChange={(e) => setDashboardData(prev => ({ ...prev, rules: { ...prev.rules, noOutsiders: e.target.checked } }))} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer checked:right-0 right-6 checked:border-red-500 border-gray-300" />
                              <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${dashboardData.rules?.noOutsiders ? 'bg-red-500' : 'bg-gray-300'}`}></label>
                            </div>
                          </div>

                          {dashboardData.rules?.noOutsiders && (
                            <div className="flex items-center gap-4 mt-4 pt-4 border-t border-red-100">
                              <span className="font-semibold text-gray-700">Penalty / Fine Amount (₹):</span>
                              <input
                                type="number"
                                name="fineAmount"
                                value={dashboardData.rules?.fineAmount || ''}
                                onChange={(e) => setDashboardData(prev => ({ ...prev, rules: { ...prev.rules, fineAmount: e.target.value } }))}
                                className="p-2 border-2 border-red-100 bg-white rounded-lg w-32 focus:border-red-400 outline-none text-red-600 font-bold"
                                placeholder="500"
                              />
                            </div>
                          )}
                        </div>

                        {dashboardData.rules?.savedRules && dashboardData.rules.savedRules.length > 0 && (
                          <div className="space-y-4">
                            <h4 className="text-lg font-bold text-gray-800">Your Added Rules</h4>
                            <div className="space-y-3">
                              {dashboardData.rules.savedRules.map((rule, idx) => (
                                <div key={idx} className="flex items-start justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-blue-300 transition-all">
                                  <div className="flex gap-3">
                                    <div className="shrink-0 mt-1 w-2 h-2 rounded-full bg-blue-500"></div>
                                    <p className="text-gray-700 font-medium whitespace-pre-wrap">{rule}</p>
                                  </div>
                                  <button
                                    onClick={() => handleDeleteRule(idx)}
                                    className="text-gray-400 hover:text-red-500 transition-colors p-1"
                                    title="Remove rule"
                                  >
                                    <FaTrash size={14} />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="space-y-2">
                          <label className="text-sm font-bold text-gray-700">Additional Rules / Terms</label>
                          <textarea
                            name="additionalRules"
                            value={dashboardData.rules?.additionalRules || ''}
                            onChange={(e) => setDashboardData(prev => ({ ...prev, rules: { ...prev.rules, additionalRules: e.target.value } }))}
                            className="w-full p-4 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none h-40 resize-none transition-all"
                            placeholder="Type a new rule here and click Update Policies to add it..."
                          />
                        </div>

                        <div className="pt-4 flex justify-end">
                          <button onClick={handleSaveRules} className="px-8 py-3 bg-gray-900 text-white rounded-xl font-bold hover:bg-gray-800 shadow-xl transition-all">Save Rules</button>
                        </div>
                      </div>
                    )}

                  {activeTab === 'properties' && (
                    <div className="space-y-6 animate-fadeIn">
                      <div className="flex items-center justify-between border-b pb-4">

                        <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2"><FaHotel className="text-blue-600" /> My Property Portfolio</h3>
                        <button
                          onClick={() => navigate('/partner-signup')}
                          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-bold hover:bg-blue-700 transition-all"
                        >
                          <FaPlus /> Add New
                        </button>
                      </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Scrollable Content Body */}
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
                                <label className="text-sm font-bold text-gray-700">Owner Name *</label>
                                <input
                                  name="ownerName"
                                  value={dashboardData.ownerName || ''}
                                  onChange={handleDashboardChange}
                                  className={`w-full p-3 bg-white border-2 rounded-xl focus:border-blue-500 outline-none transition-all ${errors.ownerName ? 'border-red-500' : 'border-gray-100'}`}
                                  placeholder="Owner Full Name"
                                />
                                {errors.ownerName && <p className="text-red-500 text-xs">{errors.ownerName}</p>}
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Property Name *</label>
                                <input
                                  name="propertyName"
                                  value={dashboardData.propertyName || ''}
                                  onChange={handleDashboardChange}
                                  className={`w-full p-3 bg-white border-2 rounded-xl focus:border-blue-500 outline-none transition-all ${errors.propertyName ? 'border-red-500' : 'border-gray-100'}`}
                                  placeholder="Name of your PG/Hostel"
                                />
                                {errors.propertyName && <p className="text-red-500 text-xs">{errors.propertyName}</p>}
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Phone Number *</label>
                                <div className="relative">
                                  <FaPhone className="absolute top-4 left-3 text-gray-400" />
                                  <input
                                    name="phoneNumber"
                                    value={dashboardData.phoneNumber || ''}
                                    onChange={handleDashboardChange}
                                    className={`w-full p-3 pl-10 bg-white border-2 rounded-xl focus:border-blue-500 outline-none transition-all ${errors.phoneNumber ? 'border-red-500' : 'border-gray-100'}`}
                                    placeholder="Contact Number"
                                  />
                                </div>
                                {errors.phoneNumber && <p className="text-red-500 text-xs">{errors.phoneNumber}</p>}
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Location Area *</label>
                                <div className="relative">
                                  <FaMapMarkerAlt className="absolute top-4 left-3 text-gray-400" />
                                  <input
                                    name="locationArea"
                                    value={dashboardData.locationArea || ''}
                                    onChange={handleDashboardChange}
                                    className="w-full p-3 pl-10 bg-white border-2 border-gray-100 rounded-xl focus:border-blue-500 outline-none transition-all"
                                    placeholder="e.g. Koramangala, Bangalore"
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Rooms Available *</label>
                                <div className="relative">
                                  <FaBed className="absolute top-4 left-3 text-gray-400" />
                                  <input
                                    type="number"
                                    name="roomsAvailable"
                                    value={dashboardData.roomsAvailable || ''}
                                    onChange={handleDashboardChange}
                                    className={`w-full p-3 pl-10 bg-white border-2 rounded-xl focus:border-blue-500 outline-none transition-all ${errors.roomsAvailable ? 'border-red-500' : 'border-gray-100'}`}
                                    placeholder="Total Capacity"
                                  />
                                </div>
                                {errors.roomsAvailable && <p className="text-red-500 text-xs">{errors.roomsAvailable}</p>}
                              </div>
                              <div className="space-y-2">
                                <label className="text-sm font-bold text-gray-700">Email Address</label>
                                <div className="relative">
                                  <FaEnvelope className="absolute top-4 left-3 text-gray-400" />
                                  <input
                                    name="email"
                                    value={dashboardData.email || ''}
                                    readOnly
                                    className="w-full p-3 pl-10 bg-gray-50 border-2 border-gray-100 rounded-xl text-gray-500 cursor-not-allowed"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Step 2: Pricing & Types */}
                        {step === 2 && (
                          <div className="space-y-6">
                            <h4 className="text-lg font-bold text-gray-700">Property Type & Pricing</h4>

                            <div className="space-y-3">
                              <label className="block text-sm font-semibold text-gray-700">Gender Type *</label>
                              <div className="flex gap-6">
                                {['Male', 'Female', 'Co-living'].map((g) => (
                                  <label key={g} className="flex items-center space-x-2 cursor-pointer">
                                    <input
                                      type="radio"
                                      name="gender"
                                      value={g}
                                      checked={dashboardData.gender === g}
                                      onChange={(e) => setDashboardData({ ...dashboardData, gender: e.target.value })}
                                      className="w-5 h-5 text-blue-600 focus:ring-blue-500 border-gray-300"
                                    />
                                    <span className="text-gray-700">{g}</span>
                                  </label>
                                ))}
                              </div>
                              {errors.gender && <p className="text-red-500 text-xs">{errors.gender}</p>}
                            </div>

                            <div className="space-y-4">
                              <label className="block text-sm font-semibold text-gray-700">PG Room Types & Pricing *</label>
                              {['Single Sharing', 'Double Sharing', 'Triple Sharing'].map((type) => {
                                const roomData = dashboardData.roomTypes.find((rt) => rt.type === type) || {};
                                return (
                                  <div key={type} className="p-4 border border-gray-200 rounded-xl bg-gray-50/50 hover:bg-white transition-colors">
                                    <h5 className="font-bold text-gray-800 mb-3">{type}</h5>
                                    <div className="grid md:grid-cols-2 gap-4">
                                      <input
                                        type="number"
                                        placeholder="Monthly Rent (₹)"
                                        value={roomData.rent || ''}
                                        onChange={(e) => handleRoomTypeChange(type, 'rent', e.target.value)}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                      />
                                      <input
                                        type="number"
                                        placeholder="Security Deposit (₹)"
                                        value={roomData.deposit || ''}
                                        onChange={(e) => handleRoomTypeChange(type, 'deposit', e.target.value)}
                                        className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                      />
                                    </div>
                                  </div>
                                )
                              })}
                              {errors.roomTypes && <p className="text-red-500 text-xs">{errors.roomTypes}</p>}
                            </div>

                            <div className="space-y-2">
                              <label className="block text-sm font-semibold text-gray-700">Notice Period (days) *</label>
                              <input
                                type="number"
                                name="noticePeriod"
                                value={dashboardData.noticePeriod || ''}
                                onChange={handleDashboardChange}
                                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 outline-none ${errors.noticePeriod ? 'border-red-500' : 'border-gray-200'}`}
                                placeholder="e.g. 30"
                              />
                              {errors.noticePeriod && <p className="text-red-500 text-xs">{errors.noticePeriod}</p>}
                            </div>
                          </div>
                        )}

                        {/* Step 3: Amenities Part 1 */}
                        {step === 3 && (
                          <div className="space-y-8">
                            <h4 className="text-lg font-bold text-gray-700">Amenities & Facilities (Part 1)</h4>

                            {['furniture', 'bathroom', 'foodKitchen', 'utilities'].map((category) => (
                              <div key={category} className="space-y-3">
                                <h5 className="font-bold text-gray-800 capitalize border-b pb-2">
                                  {category === 'foodKitchen' ? 'Food & Kitchen' : category}
                                </h5>
                                <div className="grid md:grid-cols-2 gap-3">
                                  {amenitiesOptions[category].map((option) => (
                                    <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                                      <div className="relative flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={(dashboardData.amenities[category] || []).includes(option)}
                                          onChange={() => handleAmenityToggle(category, option)}
                                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                      </div>
                                      <span className="text-gray-600 group-hover:text-blue-600 transition-colors">{option}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Step 4: Amenities Part 2 */}
                        {step === 4 && (
                          <div className="space-y-8">
                            <h4 className="text-lg font-bold text-gray-700">Amenities & Facilities (Part 2)</h4>

                            {['laundry', 'cleaning', 'security', 'rulesConvenience', 'location'].map((category) => (
                              <div key={category} className="space-y-3">
                                <h5 className="font-bold text-gray-800 capitalize border-b pb-2">
                                  {category === 'rulesConvenience' ? 'Rules & Convenience' : category}
                                </h5>
                                <div className="grid md:grid-cols-2 gap-3">
                                  {amenitiesOptions[category].map((option) => (
                                    <label key={option} className="flex items-center space-x-3 cursor-pointer group">
                                      <div className="relative flex items-center">
                                        <input
                                          type="checkbox"
                                          checked={(dashboardData.amenities[category] || []).includes(option)}
                                          onChange={() => handleAmenityToggle(category, option)}
                                          className="w-5 h-5 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                                        />
                                      </div>
                                      <span className="text-gray-600 group-hover:text-blue-600 transition-colors">{option}</span>
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
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

                          {step < 4 ? (
                            <button
                              onClick={nextStep}
                              className="px-6 py-2 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-600/20"
                            >
                              Next
                            </button>
                          ) : (
                            <button
                              onClick={handleSaveChanges}
                              className="px-8 py-2 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all"
                            >
                              Save Changes
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {activeTab === 'properties' && (
                      <div className="space-y-6 animate-fadeIn">
                        <div className="grid gap-4">
                          {(partner?.properties && partner.properties.length > 0 ? partner.properties : (partner?.basicDetails ? [{ basicDetails: partner.basicDetails }] : [])).map((prop, index) => (
                            <div key={index} className="bg-white border rounded-2xl p-5 flex flex-col md:flex-row md:items-center justify-between shadow-sm hover:shadow-md transition-shadow group">
                              <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-gray-400 group-hover:bg-blue-50 group-hover:text-blue-500 transition-colors">
                                  <FaBuilding className="text-2xl" />
                                </div>
                                <div>
                                  <h4 className="font-bold text-lg text-gray-900">{prop.basicDetails?.propertyName || 'Property Name'}</h4>
                                  <p className="text-sm text-gray-500 flex items-center gap-1"><FaMapMarkerAlt className="text-xs" /> {prop.basicDetails?.locationArea || prop.basicDetails?.location || 'Location Pending'}</p>
                                  <span className="text-xs text-gray-400 ml-1">Type: {prop.partnerType || 'N/A'}</span>
                                </div>
                              </div>
                              <div className="flex items-center gap-3 mt-4 md:mt-0">
                                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase tracking-wide">Active</span>
                                <button className="px-4 py-2 text-gray-600 font-semibold hover:text-blue-600">Manage</button>
                              </div>
                            </div>
                          ))}
                        </div>

                        <button
                          onClick={() => navigate('/partner-signup')}
                          className="w-full py-8 border-2 border-dashed border-gray-300 rounded-2xl text-gray-400 font-semibold hover:border-blue-500 hover:text-blue-500 hover:bg-blue-50 transition-all flex flex-col items-center justify-center gap-2 group"
                        >
                          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                            <FaPlus className="text-xl" />
                          </div>
                          <span>Add Another PG / Hostel</span>
                          <span className="text-xs font-normal opacity-70">Expand your business with us</span>
                        </button>
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

export default AccProfile