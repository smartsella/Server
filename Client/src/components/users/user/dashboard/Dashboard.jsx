import React from 'react';
import {
  FaUser,
  FaChevronDown,
  FaHome,
  FaUtensils,
  FaBook,
  FaBicycle,
  FaSignOutAlt,
  FaMap,
  FaSearch,
  FaBell,
  FaInfoCircle
} from 'react-icons/fa';
import { useUser } from '../../../../context/userContext';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icon in react-leaflet
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const Dashboard = () => {
  const { user, loading, logout } = useUser();
  const navigate = useNavigate();
  const [showExplore, setShowExplore] = React.useState(false);
  const [dashboardData, setDashboardData] = React.useState(null);
  const [fetchingData, setFetchingData] = React.useState(true);

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Fetch user dashboard data from backend
  React.useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user?.id) {
        setFetchingData(false);
        return;
      }

      try {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/user/${user.id}`);
        const result = await response.json();

        if (result.success) {
          setDashboardData(result.user);
        } else {
          console.error('Failed to fetch dashboard data:', result.message);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setFetchingData(false);
      }
    };

    fetchDashboardData();
  }, [user?.id]);

  // Click outside listener
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showExplore && !event.target.closest('.explore-container')) {
        setShowExplore(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showExplore]);

  // Use dashboard data from backend, fallback to context user
  const displayUser = dashboardData || user;

  if (loading || fetchingData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-gray-600 font-medium animate-pulse">Loading your ecosystem...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
        <div className="glass max-w-md w-full rounded-2xl p-10 text-center shadow-2xl animate-fade-in-up border border-white/50">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <FaUser size={40} className="text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Access Denied</h2>
          <p className="text-gray-600 mb-8 leading-relaxed">Please sign in to access your personal dashboard.</p>
          <button
            onClick={() => navigate('/signin')}
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-bold hover:shadow-xl hover:scale-105 transition-all duration-300 shadow-lg"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden">
      {/* Premium Background Blobs */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-10 left-10 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-10 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-20 left-1/2 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 py-8 md:py-12 relative z-10">

        {/* Header Section */}
        <header className="mb-8 animate-fade-in-up">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex-1">
              <h1 className="text-3xl md:text-5xl font-bold text-gray-900 leading-tight">
                Welcome back, <span className="gradient-text">{displayUser.name}</span>
              </h1>
              <p className="text-gray-500 mt-1 text-base md:text-lg">Your synchronized local ecosystem.</p>
            </div>
            <div className="flex items-center gap-4">
              <span className="hidden sm:inline-block px-4 py-2 bg-blue-100/50 backdrop-blur-sm text-blue-700 rounded-full text-xs font-bold border border-blue-200">
                {displayUser.userType || 'Student'} Member
              </span>

              {(displayUser.userType || 'Student') === 'Student' && (
                <div className="relative explore-container">
                  <button
                    onClick={() => setShowExplore(!showExplore)}
                    className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all font-bold text-sm"
                  >
                    <FaSearch size={14} />
                    Explore Ecosystem
                    <FaChevronDown size={12} className={`transition-transform duration-300 ${showExplore ? 'rotate-180' : ''}`} />
                  </button>
                  {showExplore && (
                    <div className="absolute right-0 mt-3 w-72 glass rounded-2xl shadow-2xl p-4 z-50 animate-fade-in border border-white/50 space-y-1">
                      <ExploreItem
                        icon={<FaHome />}
                        label="Accommodation"
                        description="Find PGs & Hostels"
                        onClick={() => { navigate('/services?category=accommodation'); setShowExplore(false); }}
                      />
                      <ExploreItem
                        icon={<FaUtensils />}
                        label="Daily Living"
                        description="Food, Water & Laundry"
                        onClick={() => { navigate('/services?category=daily'); setShowExplore(false); }}
                      />
                      <ExploreItem
                        icon={<FaBook />}
                        label="Education & Career"
                        description="Courses & Internships"
                        onClick={() => { navigate('/services?category=education'); setShowExplore(false); }}
                      />
                      <ExploreItem
                        icon={<FaBicycle />}
                        label="Lifestyle"
                        description="Rentals & Community"
                        onClick={() => { navigate('/services?category=lifestyle'); setShowExplore(false); }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* Left Sidebar - Profile Information */}
          <div className="lg:col-span-3 space-y-6 animate-fade-in-up animation-delay-200 lg:sticky lg:top-8">
            <div className="glass rounded-3xl p-8 text-center shadow-xl border border-white/40 bg-white/30 backdrop-blur-md">
              <div className="relative inline-block mb-6">
                <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-1 rounded-full shadow-lg">
                  <div className="bg-white p-5 rounded-full">
                    <FaUser size={45} className="text-blue-600" />
                  </div>
                </div>
                <div className="absolute bottom-1 right-1 bg-green-500 w-4 h-4 rounded-full border-4 border-white shadow-sm"></div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 mb-1">{displayUser.name}</h2>
              <p className="text-gray-500 text-sm font-medium mb-8 truncate">{displayUser.email}</p>

              <div className="space-y-3.5 text-left">
                <div className="bg-blue-50/50 p-4 rounded-2xl flex items-center justify-between border border-blue-100">
                  <span className="text-gray-600 text-[11px] font-bold uppercase tracking-wider">Account</span>
                  <span className="text-green-600 text-xs font-bold">{displayUser.accountStatus || 'Active'}</span>
                </div>
                <div className="bg-purple-50/50 p-4 rounded-2xl flex items-center justify-between border border-purple-100">
                  <span className="text-gray-600 text-[11px] font-bold uppercase tracking-wider">Eco Score</span>
                  <span className="text-purple-600 text-xs font-bold">{displayUser.ecosystemScore || 0}/100</span>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col gap-3">
                <button
                  onClick={() => navigate('/user/profile')}
                  className="w-full py-4 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-black transition-all shadow-lg active:scale-95"
                >
                  Manage Profile
                </button>
                <button
                  onClick={() => navigate('/findpg')}
                  className="w-full py-4 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  <FaSearch size={14} /> Find PG / Hostel
                </button>
              </div>
            </div>
          </div>

          {/* Middle Column - Centered Map & Stats */}
          <div className="lg:col-span-6 space-y-6">
            {/* Map View Section */}
            <div className="glass rounded-3xl p-6 shadow-xl animate-fade-in-up animation-delay-400 border border-white/40">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3">
                  <span className="bg-gradient-to-br from-blue-500 to-purple-600 p-2.5 rounded-xl text-white shadow-lg">
                    <FaMap size={16} />
                  </span>
                  Ecosystem Intelligence
                </h3>
                <div className="flex flex-wrap gap-2 justify-end">
                  <MapBadge color="blue" label="PGs" />
                  <MapBadge color="purple" label="Water" />
                  <MapBadge color="orange" label="Food" />
                  <MapBadge color="cyan" label="Laundry" />
                </div>
              </div>

              <div className="h-[380px] md:h-[430px] w-full rounded-2xl overflow-hidden shadow-2xl border border-gray-100 relative z-0 group">
                <div className="absolute inset-0 bg-gray-100 animate-pulse group-[.leaflet-container]:hidden"></div>
                <MapContainer
                  center={[13.0400, 80.1800]}
                  zoom={14}
                  style={{ height: '100%', width: '100%' }}
                  scrollWheelZoom={false}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />
                  <Marker position={[13.0324, 80.1812]}><Popup><div className="font-bold text-blue-700">SRM University</div></Popup></Marker>
                  <Marker position={[13.0350, 80.1780]}><Popup><div className="font-bold text-blue-600 text-sm">Zolo Scholar</div></Popup></Marker>
                  <Marker position={[13.0290, 80.1850]}><Popup><div className="font-bold text-blue-600 text-sm">Sri Murugan PG</div></Popup></Marker>
                  <Marker position={[13.0420, 80.1750]}><Popup><div className="font-bold text-purple-600 text-sm">Ramapuram Aqua Fill</div></Popup></Marker>
                  <Marker position={[13.0380, 80.1880]}><Popup><div className="font-bold text-orange-600 text-sm">Annapoorna Tiffins</div></Popup></Marker>
                  <Marker position={[13.0250, 80.1800]}><Popup><div className="font-bold text-cyan-600 text-sm">Express Laundry</div></Popup></Marker>
                </MapContainer>
              </div>
            </div>

            {/* Quick Stats below map */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 animate-fade-in-up animation-delay-600">
              <StatCard title="Total Savings" value={displayUser.totalSavings ? `₹${displayUser.totalSavings}` : '₹0'} color="blue" />
              <StatCard title="Active Services" value={displayUser.activeServices || 0} color="purple" />
              <StatCard title="Saved Items" value={displayUser.savedItems || 0} color="pink" />
            </div>
          </div>

          {/* Right Column - Notifications */}
          <div className="lg:col-span-3 space-y-6 animate-fade-in-up animation-delay-500 lg:sticky lg:top-8">
            <div className="glass rounded-3xl shadow-xl border border-white/40 overflow-hidden flex flex-col bg-white/30 backdrop-blur-md">
              <div className="p-8 border-b border-gray-100/50">
                <div className="flex items-center gap-3 mb-8">
                  <span className="bg-blue-100 text-blue-600 p-3 rounded-2xl shadow-sm">
                    <FaBell size={20} />
                  </span>
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 leading-tight">Live Updates</h3>
                    <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">Notifications</p>
                  </div>
                </div>

                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="bg-white/50 p-6 rounded-full mb-6 shadow-inner border border-white">
                    <FaBell className="text-3xl text-slate-300" />
                  </div>
                  <h4 className="text-gray-800 font-bold text-sm mb-1">Stay Tuned</h4>
                  <p className="text-gray-500 text-xs px-4">Exciting updates coming to your local area soon.</p>
                </div>
              </div>

              <div className="p-8 bg-gradient-to-br from-blue-600/[0.03] to-purple-600/[0.03]">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="text-[10px] font-bold text-gray-800 uppercase tracking-widest italic">Activity Radar</h4>
                  <span className="flex h-2.5 w-2.5 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-500"></span>
                  </span>
                </div>
                <div className="space-y-3">
                  <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 animate-pulse w-[40%] rounded-full"></div>
                  </div>
                  <p className="text-[10px] text-gray-400 font-medium">Monitoring local ecosystem...</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

/* ---------- Stat Card Component ---------- */
const StatCard = ({ title, value, color }) => {
  const colors = {
    blue: "from-blue-50 to-blue-100/50 text-blue-600 border-blue-200",
    purple: "from-purple-50 to-purple-100/50 text-purple-600 border-purple-200",
    pink: "from-pink-50 to-pink-100/50 text-pink-600 border-pink-200"
  };

  return (
    <div className={`bg-gradient-to-br ${colors[color]} p-4 md:p-6 rounded-3xl border shadow-sm group hover:shadow-lg hover:scale-105 transition-all duration-300`}>
      <div className="text-2xl md:text-3xl font-black mb-1 leading-none">{value}</div>
      <div className="text-[10px] md:text-sm font-bold opacity-70 group-hover:opacity-100 transition-opacity whitespace-nowrap">{title}</div>
    </div>
  );
};

/* ---------- Map Badge Component ---------- */
const MapBadge = ({ color, label }) => {
  const colors = {
    blue: "text-blue-600 bg-blue-50 border-blue-100",
    purple: "text-purple-600 bg-purple-50 border-purple-100",
    orange: "text-orange-600 bg-orange-50 border-orange-100",
    cyan: "text-cyan-600 bg-cyan-50 border-cyan-100",
    green: "text-green-600 bg-green-50 border-green-100"
  };

  const dots = {
    blue: "bg-blue-600",
    purple: "bg-purple-600",
    orange: "bg-orange-600",
    cyan: "bg-cyan-600",
    green: "bg-green-600"
  };

  return (
    <span className={`flex items-center gap-1.5 text-[10px] font-bold ${colors[color]} px-2.5 py-1.5 rounded-full border`}>
      <div className={`w-1.5 h-1.5 rounded-full ${dots[color]} animate-pulse`}></div>
      {label}
    </span>
  );
};

/* ---------- Explore Item Component ---------- */
const ExploreItem = ({ icon, label, description, onClick }) => (
  <button
    onClick={onClick}
    className="w-full flex items-center gap-4 p-3 rounded-xl hover:bg-blue-50/50 transition-all group text-left"
  >
    <div className="bg-white p-2.5 rounded-xl shadow-sm group-hover:bg-blue-600 group-hover:text-white transition-all text-blue-600 text-lg">
      {icon}
    </div>
    <div>
      <div className="font-bold text-gray-800 text-sm">{label}</div>
      <div className="text-[10px] text-gray-500 font-medium group-hover:text-blue-500 transition-colors uppercase tracking-wider">{description}</div>
    </div>
  </button>
);

export default Dashboard;
