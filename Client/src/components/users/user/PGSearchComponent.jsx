import React, { useState, useEffect } from 'react';
import { FaSearch, FaMapMarkerAlt, FaFilter, FaStar, FaChevronDown, FaChevronUp } from 'react-icons/fa';

const PGSearchComponent = () => {
  // Initial dummy data with more variety to test filters
  const initialData = [
    { id: 1, name: "Sunshine PG", location: "Koramangala", price: 8000, category: "Accommodation", type: "PG Partner", rating: 4.5, amenities: ["WiFi", "Food"], image: "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 2, name: "City Comfort Hostel", location: "Indiranagar", price: 12000, category: "Accommodation", type: "Homely Pg Partner", rating: 4.2, amenities: ["WiFi", "Laundry"], image: "https://images.unsplash.com/photo-1596276020587-8044fe049813?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 3, name: "Royal Stay Flats", location: "HSR Layout", price: 25000, category: "Accommodation", type: "Flat Partner", rating: 4.7, amenities: ["WiFi", "AC", "Gym"], image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 4, name: "Mom's Kitchen", location: "Whitefield", price: 3000, category: "Daily Living", type: "Food & Tiffin Service", rating: 4.8, amenities: ["Veg", "Non-Veg"], image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 5, name: "Aqua Pure", location: "Marathahalli", price: 100, category: "Daily Living", type: "Water Delivery", rating: 4.3, amenities: ["Bisleri", "Normal"], image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 6, name: "Quick Fix Repairs", location: "Bellandur", price: 500, category: "Daily Living", type: "Repair Services", rating: 4.0, amenities: ["Electrician", "Plumber"], image: "https://images.unsplash.com/photo-1581244277943-fe4a9c777189?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 7, name: "Fresh Mart", location: "Koramangala", price: 0, category: "Daily Living", type: "Local Store Directory", rating: 4.5, amenities: ["Delivery", "In-store"], image: "https://images.unsplash.com/photo-1542838132-92c53300491e?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
    { id: 8, name: "Sparkle Laundry", location: "HSR Layout", price: 60, category: "Daily Living", type: "Laundry & Cleaning", rating: 4.6, amenities: ["Ironing", "Dry Clean"], image: "https://images.unsplash.com/photo-1517677208171-0bc6799a4c67?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" },
  ];

  // --- Search State ---
  const [searchCategory, setSearchCategory] = useState('Accommodation');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchLocation, setSearchLocation] = useState('');

  // --- Filter State ---
  const [filters, setFilters] = useState({
    partnerTypes: [],
    priceRange: [0, 50000],
    rating: 0,
    amenities: [],
  });

  // Mobile filter toggle
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  const [filteredData, setFilteredData] = useState(initialData);

  // Constants
  const categories = ["Accommodation", "Daily Living"];
  const accommodationTypes = ["PG Partner", "Homely Pg Partner", "Flat Partner"];
  const dailyLivingTypes = ["Food & Tiffin Service", "Water Delivery", "Laundry & Cleaning", "Repair Services", "Local Store Directory"];

  // --- Handlers ---

  const handlePartnerTypeChange = (type) => {
    setFilters(prev => {
      const isSelected = prev.partnerTypes.includes(type);
      if (isSelected) {
        return { ...prev, partnerTypes: prev.partnerTypes.filter(t => t !== type) };
      } else {
        return { ...prev, partnerTypes: [...prev.partnerTypes, type] };
      }
    });
  };

  const clearFilters = () => {
    setFilters({
      partnerTypes: [],
      priceRange: [0, 50000],
      rating: 0,
      amenities: [],
    });
    setSearchQuery('');
    setSearchLocation('');
  };

  // --- Filter Logic ---
  useEffect(() => {
    let result = initialData;

    // 1. Top Bar Search
    if (searchCategory !== 'All') {
      result = result.filter(item => item.category === searchCategory || (searchCategory === 'Accommodation' && accommodationTypes.includes(item.type)) || (searchCategory === 'Daily Living' && dailyLivingTypes.includes(item.type)));
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      result = result.filter(item =>
        item.name.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q) ||
        item.amenities.some(a => a.toLowerCase().includes(q))
      );
    }

    if (searchLocation) {
      result = result.filter(item => item.location.toLowerCase().includes(searchLocation.toLowerCase()));
    }

    // 2. Sidebar Filters
    if (filters.partnerTypes.length > 0) {
      result = result.filter(item => filters.partnerTypes.includes(item.type));
    }

    result = result.filter(item => item.price >= filters.priceRange[0] && item.price <= filters.priceRange[1]);

    if (filters.rating > 0) {
      result = result.filter(item => item.rating >= filters.rating);
    }

    setFilteredData(result);
  }, [searchCategory, searchQuery, searchLocation, filters]);


  // Helper for Sidebar Sections
  const FilterSection = ({ title, children, defaultOpen = true }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    return (
      <div className="border-b border-gray-200 py-4">
        <button
          className="flex items-center justify-between w-full mb-2 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          <h4 className="font-semibold text-gray-800">{title}</h4>
          {isOpen ? <FaChevronUp className="text-gray-500 text-xs" /> : <FaChevronDown className="text-gray-500 text-xs" />}
        </button>
        {isOpen && <div className="mt-2 text-sm">{children}</div>}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* --- Top Hero Search Section --- */}
      <div className="bg-white shadow-sm border-b border-gray-100 py-6 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4">
          {/* Pill Search Bar */}
          <div className="bg-white rounded-full shadow-[0_2px_15px_-3px_rgba(0,0,0,0.1),0_10px_20px_-2px_rgba(0,0,0,0.04)] border border-gray-200 p-1 flex flex-col md:flex-row items-center max-w-5xl mx-auto relative z-30">

            {/* 1. Category Custom Dropdown */}
            <div className="relative w-full md:w-auto md:min-w-[200px] border-b md:border-b-0 md:border-r border-gray-200 px-4 py-3 md:py-2">
              <div
                className="flex items-center justify-between cursor-pointer group"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              >
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-700 select-none text-sm md:text-base">{searchCategory}</span>
                  <span className="hidden md:block text-[10px] text-gray-400 font-medium uppercase tracking-wider mt-0.5 select-none">Select Category</span>
                </div>
                <FaChevronDown className={`ml-3 text-gray-400 text-xs transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''} group-hover:text-blue-500`} />
              </div>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute top-full left-0 mt-4 w-full md:w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 overflow-hidden z-50">
                  {categories.map((cat) => (
                    <div
                      key={cat}
                      className={`px-4 py-3 cursor-pointer hover:bg-blue-50 hover:text-blue-600 transition-colors ${searchCategory === cat ? 'bg-blue-50 text-blue-600 font-medium' : 'text-gray-700'}`}
                      onClick={() => {
                        setSearchCategory(cat);
                        setIsDropdownOpen(false);
                      }}
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 2. Keyword Input */}
            <div className="relative flex-1 w-full md:w-auto border-b md:border-b-0 md:border-r border-gray-200 px-4 py-3 md:py-2">
              <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search for services..."
                className="w-full pl-8 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>

            {/* 3. Location Input */}
            <div className="relative w-full md:w-[250px] px-4 py-3 md:py-2 flex items-center">
              <FaMapMarkerAlt className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Enter location"
                className="w-full pl-8 bg-transparent outline-none text-gray-700 placeholder-gray-400"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
              />
            </div>

            {/* 4. Search Button */}
            <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 font-semibold transition-all shadow-md hover:shadow-lg mt-2 md:mt-0">
              Search
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* --- Left Sidebar Filters --- */}
          <div className={`lg:w-1/4 ${showMobileFilters ? 'block' : 'hidden lg:block'}`}>
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 sticky top-28">
              <div className="flex justify-between items-center mb-6">
                <h3 className="font-bold text-lg text-gray-800">All Filters</h3>
                <button onClick={clearFilters} className="text-sm text-blue-600 hover:underline font-medium">Clear All</button>
              </div>

              {/* Filter: Partner Type */}
              <FilterSection title="Service Type">
                <div className="space-y-3">
                  {searchCategory === 'Accommodation' && accommodationTypes.map(type => (
                    <label key={type} className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:bg-blue-600 checked:border-blue-600 transition-all"
                          checked={filters.partnerTypes.includes(type)}
                          onChange={() => handlePartnerTypeChange(type)}
                        />
                        <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600 group-hover:text-blue-600 transition-colors">{type}</span>
                    </label>
                  ))}
                  {searchCategory === 'Daily Living' && dailyLivingTypes.map(type => (
                    <label key={type} className="flex items-start gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="checkbox"
                          className="peer h-5 w-5 cursor-pointer appearance-none rounded border border-gray-300 shadow-sm checked:bg-blue-600 checked:border-blue-600 transition-all"
                          checked={filters.partnerTypes.includes(type)}
                          onChange={() => handlePartnerTypeChange(type)}
                        />
                        <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600 group-hover:text-blue-600 transition-colors">{type}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Filter: Price Range */}
              <FilterSection title="Price Range">
                <div className="px-2">
                  <div className="flex justify-between text-xs text-gray-500 mb-2">
                    <span>₹{filters.priceRange[0]}</span>
                    <span>₹{filters.priceRange[1]}+</span>
                  </div>
                  <div className="relative h-2 bg-gray-200 rounded-full">
                    <div
                      className="absolute h-full bg-blue-600 rounded-full"
                      style={{
                        left: `${(filters.priceRange[0] / 50000) * 100}%`,
                        right: `${100 - (filters.priceRange[1] / 50000) * 100}%`
                      }}
                    ></div>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <input
                      type="range" min="0" max="50000" step="500"
                      value={filters.priceRange[0]}
                      onChange={(e) => {
                        const val = Math.min(Number(e.target.value), filters.priceRange[1] - 500);
                        setFilters(prev => ({ ...prev, priceRange: [val, prev.priceRange[1]] }))
                      }}
                      className="w-full absolute opacity-0 cursor-pointer pointer-events-none"
                      style={{ pointerEvents: 'auto' }}
                    />
                    <input
                      type="range" min="0" max="50000" step="500"
                      value={filters.priceRange[1]}
                      onChange={(e) => {
                        const val = Math.max(Number(e.target.value), filters.priceRange[0] + 500);
                        setFilters(prev => ({ ...prev, priceRange: [prev.priceRange[0], val] }))
                      }}
                      className="w-full absolute opacity-0 cursor-pointer"
                      style={{ pointerEvents: 'auto' }}
                    />
                  </div>
                </div>
              </FilterSection>

              {/* Filter: Rating */}
              <FilterSection title="Rating">
                <div className="space-y-2">
                  {[4, 3, 2].map(r => (
                    <label key={r} className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative flex items-center">
                        <input
                          type="radio"
                          name="rating"
                          className="peer h-4 w-4 cursor-pointer appearance-none rounded-full border border-gray-300 checked:border-blue-600 checked:bg-blue-600 transition-all"
                          checked={filters.rating === r}
                          onChange={() => setFilters(prev => ({ ...prev, rating: r }))}
                        />
                        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white opacity-0 peer-checked:opacity-100"></div>
                      </div>
                      <div className="flex items-center text-gray-600 group-hover:text-blue-600">
                        <span className="mr-2 text-sm">{r}+ Stars</span>
                        <div className="flex text-yellow-400 text-xs">
                          {[...Array(5)].map((_, i) => (
                            <FaStar key={i} className={i < r ? 'text-yellow-400' : 'text-gray-300'} />
                          ))}
                        </div>
                      </div>
                    </label>
                  ))}
                </div>
              </FilterSection>

              {/* Common Amenities */}
              <FilterSection title="Amenities">
                <div className="space-y-2">
                  {["WiFi", "AC", "Food", "Laundry", "Gym", "Power Backup"].map(amenity => (
                    <label key={amenity} className="flex items-start gap-3 cursor-pointer">
                      <div className="relative flex items-center">
                        <input type="checkbox" className="peer h-4 w-4 cursor-pointer appearance-none rounded border border-gray-300 checked:bg-blue-600 checked:border-blue-600" />
                        <svg className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 text-white opacity-0 peer-checked:opacity-100" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-gray-600 text-sm">{amenity}</span>
                    </label>
                  ))}
                </div>
              </FilterSection>
            </div>
          </div>

          {/* --- Mobile Trigger --- */}
          <div className="lg:hidden w-full mb-4">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="w-full flex items-center justify-center gap-2 bg-white border border-gray-300 py-2.5 rounded-lg shadow-sm font-semibold text-gray-700"
            >
              <FaFilter /> {showMobileFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>

          {/* --- Right Results Grid --- */}
          <div className="flex-1">
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Showing {filteredData.length} Results
                <span className="text-sm font-normal text-gray-500 ml-2">based on your preferences</span>
              </h2>
              <select className="bg-transparent text-sm font-semibold text-gray-600 outline-none cursor-pointer border-none">
                <option>Sort by: Recommended</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
              </select>
            </div>

            {filteredData.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredData.map(item => (
                  <div key={item.id} className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    {/* Image */}
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-blue-600 shadow-sm">
                        {item.type}
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{item.name}</h3>
                        <div className="flex items-center gap-1 bg-green-50 px-2 py-1 rounded-md">
                          <span className="font-bold text-green-700 text-xs">{item.rating}</span>
                          <FaStar className="text-green-500 text-[10px]" />
                        </div>
                      </div>

                      <div className="flex items-center text-gray-500 text-sm mb-4">
                        <FaMapMarkerAlt className="mr-1.5 text-gray-400" />
                        {item.location}
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {item.amenities.slice(0, 3).map((a, i) => (
                          <span key={i} className="text-[10px] uppercase font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                            {a}
                          </span>
                        ))}
                        {item.amenities.length > 3 && (
                          <span className="text-[10px] font-semibold text-gray-400 px-2 py-1">+More</span>
                        )}
                      </div>

                      <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                        <div>
                          <span className="text-xl font-bold text-gray-900">₹{item.price}</span>
                          <span className="text-xs text-gray-500 ml-1">/{item.category === 'Accommodation' ? 'month' : 'order'}</span>
                        </div>
                        <button className="text-blue-600 font-semibold text-sm hover:underline">
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white rounded-xl p-12 text-center border border-gray-200">
                <div className="bg-blue-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <FaSearch className="text-blue-300 text-3xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">No results found</h3>
                <p className="text-gray-500">We couldn't find any matches for your filters. Try adjusting your search criteria.</p>
                <button
                  onClick={clearFilters}
                  className="mt-6 text-blue-600 font-semibold hover:underline"
                >
                  Clear all filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PGSearchComponent;