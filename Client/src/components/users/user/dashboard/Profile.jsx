import React, { useState, useEffect } from 'react';
import { useUser } from '../../../../context/userContext';
import {
    FaUser,
    FaEnvelope,
    FaPhone,
    FaMapMarkerAlt,
    FaCalendarAlt,
    FaIdCard,
    FaUniversity,
    FaBuilding,
    FaArrowLeft,
    FaEdit,
    FaBell,
    FaSearch
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
    const { user, loading, updateUser } = useUser();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [editFormData, setEditFormData] = useState({});
    const [profileData, setProfileData] = useState(null);
    const [fetchingData, setFetchingData] = useState(true);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    // Fetch user profile data from backend
    useEffect(() => {
        const fetchProfileData = async () => {
            if (!user?.id) {
                setFetchingData(false);
                return;
            }

            try {
                const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/user/${user.id}`);
                const result = await response.json();

                if (result.success) {
                    setProfileData(result.user);
                    setEditFormData(result.user);
                } else {
                    console.error('Failed to fetch profile data:', result.message);
                    // Fallback to context user
                    setProfileData(user);
                    setEditFormData(user);
                }
            } catch (error) {
                console.error('Error fetching profile data:', error);
                // Fallback to context user
                setProfileData(user);
                setEditFormData(user);
            } finally {
                setFetchingData(false);
            }
        };

        fetchProfileData();
    }, [user?.id]);

    if (loading || fetchingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50">
                <div className="flex flex-col items-center">
                    <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-gray-600 font-medium">Loading your profile...</p>
                </div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 p-6">
                <div className="glass max-w-md w-full rounded-2xl p-10 text-center shadow-2xl">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Account Required</h2>
                    <p className="text-gray-600 mb-8">Please sign in to view your profile settings.</p>
                    <button
                        onClick={() => navigate('/signin')}
                        className="w-full bg-blue-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-blue-700 transition-all"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    const handleEditToggle = () => {
        if (isEditing) {
            setEditFormData({ ...profileData });
        }
        setIsEditing(!isEditing);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSave = async () => {
        try {
            const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || ''}/api/auth/user/${user.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(editFormData)
            });

            const result = await response.json();

            if (result.success) {
                // Update local state
                setProfileData(result.user);
                // Update context
                updateUser(result.user);
                setIsEditing(false);
                alert('Profile updated successfully!');
            } else {
                alert('Failed to update profile: ' + result.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            alert('Error updating profile. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative overflow-hidden py-12 md:py-20">
            {/* Background Blobs */}
            <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
                <div className="absolute top-20 right-20 w-80 h-80 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute bottom-20 left-20 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/user/dashboard')}
                    className="group mb-10 flex items-center gap-3 text-gray-600 hover:text-blue-600 font-bold transition-all bg-white/50 backdrop-blur-sm px-6 py-3 rounded-2xl border border-white shadow-sm hover:shadow-md"
                >
                    <FaArrowLeft className="group-hover:-translate-x-1 transition-transform" />
                    <span>Back to Dashboard</span>
                </button>

                {/* Grid Layout for Profile Sections */}
                <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
                    {/* Personal Info Card (Main Section) */}
                    <div className="md:col-span-8 glass rounded-3xl p-6 md:p-10 shadow-xl animate-fade-in-up animation-delay-300 border border-white/40">
                        <div className="flex justify-between items-center mb-10 pb-6 border-b border-gray-100">
                            <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-4">
                                <span className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-2xl text-white shadow-lg">
                                    <FaUser />
                                </span>
                                Personal Information
                            </h3>

                            <div className="flex gap-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            onClick={handleSave}
                                            className="bg-green-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-green-700 transition-all shadow-lg hover:scale-105"
                                        >
                                            Save Changes
                                        </button>
                                        <button
                                            onClick={handleEditToggle}
                                            className="bg-gray-100 text-gray-700 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-200 transition-all border border-gray-200"
                                        >
                                            Cancel
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={handleEditToggle}
                                        className="bg-blue-50 text-blue-600 px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-100 transition-all flex items-center gap-2 border border-blue-200"
                                    >
                                        <FaEdit /> Edit Profile
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-6 gap-y-6">
                            <InfoField
                                label="Full Name"
                                icon={<FaUser />}
                                name="name"
                                value={isEditing ? editFormData.name : profileData?.name}
                                isEditing={isEditing}
                                placeholder="Enter your full name"
                                onChange={handleInputChange}
                            />

                            <InfoField
                                label="Email Address"
                                icon={<FaEnvelope />}
                                name="email"
                                value={isEditing ? editFormData.email : profileData?.email}
                                isEditing={isEditing}
                                placeholder="Enter your email"
                                onChange={handleInputChange}
                            />

                            <InfoField
                                label="Phone Number"
                                icon={<FaPhone />}
                                name="phone"
                                value={isEditing ? editFormData.phone : profileData?.phone}
                                isEditing={isEditing}
                                placeholder="Enter your phone"
                                onChange={handleInputChange}
                            />

                            <InfoField
                                label="Joined Date"
                                icon={<FaCalendarAlt />}
                                value={profileData?.joinDate || 'Not provided'}
                                isEditing={false}
                            />

                            <InfoField
                                label="Living Address"
                                icon={<FaMapMarkerAlt />}
                                name="city"
                                value={isEditing ? editFormData.city : profileData?.city}
                                isEditing={isEditing}
                                placeholder="Enter your city"
                                onChange={handleInputChange}
                                full
                            />

                            {profileData?.studentId && (
                                <InfoField
                                    label="Student ID"
                                    icon={<FaIdCard />}
                                    name="studentId"
                                    value={isEditing ? editFormData.studentId : profileData?.studentId}
                                    isEditing={isEditing}
                                    placeholder="STU-XXXXX"
                                    onChange={handleInputChange}
                                />
                            )}

                            {profileData?.university && (
                                <InfoField
                                    label="University / College"
                                    icon={<FaUniversity />}
                                    name="university"
                                    value={isEditing ? editFormData.university : profileData?.university}
                                    isEditing={isEditing}
                                    placeholder="Enter university name"
                                    onChange={handleInputChange}
                                />
                            )}

                            {profileData?.company && (
                                <InfoField
                                    label="Current Company"
                                    icon={<FaBuilding />}
                                    name="company"
                                    value={isEditing ? editFormData.company : profileData?.company}
                                    isEditing={isEditing}
                                    placeholder="Enter company name"
                                    onChange={handleInputChange}
                                />
                            )}
                        </div>
                    </div>

                    {/* Modern Refined Sidebar */}
                    <div className="md:col-span-4 flex flex-col gap-8 animate-fade-in-up animation-delay-500">
                        <div className="glass rounded-3xl shadow-xl border border-white/40 overflow-hidden flex flex-col h-full">
                            {/* Profile Status Header */}
                            <div className="p-8 bg-gradient-to-br from-blue-600/5 to-purple-600/5 border-b border-gray-100">
                                <div className="flex items-center justify-between mb-4">
                                    <h4 className="text-sm font-bold text-gray-800 uppercase tracking-widest">Profile Strength</h4>
                                    <span className="text-blue-600 font-bold text-sm">85%</span>
                                </div>
                                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-right from-blue-500 to-purple-600 w-[85%] rounded-full"></div>
                                </div>
                                <p className="text-[11px] text-gray-500 mt-3 italic">
                                    Complete your university details to reach 100%!
                                </p>
                            </div>


                            {/* Quick Settings Section */}
                            <div className="p-8">
                                <div className="flex items-center gap-3 mb-6">
                                    <span className="bg-purple-100 text-purple-600 p-2.5 rounded-xl">
                                        <FaEdit />
                                    </span>
                                    <h3 className="text-lg font-bold text-gray-900">Quick Settings</h3>
                                </div>
                                <div className="space-y-4">
                                    <SettingToggle label="Email Notifications" active={true} />
                                    <SettingToggle label="SMS Updates" active={false} />
                                    <SettingToggle label="Public Profile" active={true} />
                                </div>
                            </div>

                            {/* Find PG Button */}
                            <div className="p-8 pt-0">
                                <button
                                    onClick={() => navigate('/findpg')}
                                    className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl text-sm font-bold hover:shadow-lg hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-md"
                                >
                                    <FaSearch /> Find PG / Hostel
                                </button>
                            </div>

                            {/* Decorative Footer */}
                            <div className="mt-auto p-4 bg-gray-50/50 flex items-center justify-center">
                                <div className="w-full overflow-hidden relative h-8 flex items-center">
                                    <div className="absolute whitespace-nowrap animate-marquee text-[9px] font-bold text-gray-400 uppercase tracking-[0.3em]">
                                        • Jeevigo Ecosystem • Connected Services • Secure Data •
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

/* ---------- Reusable Components ---------- */
const InfoField = ({ label, icon, value, name, isEditing, onChange, placeholder, full = false }) => (
    <div className={`group transition-all duration-300 ${full ? 'lg:col-span-2' : ''}`}>
        <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2 ml-1 opacity-70">
            {label}
        </label>
        <div className={`flex items-center gap-4 p-4 rounded-2xl transition-all duration-300 border ${isEditing
            ? 'bg-white border-blue-400 shadow-md ring-4 ring-blue-50'
            : 'bg-white/40 backdrop-blur-sm border-white/60 hover:border-blue-200 group-hover:bg-white/80'
            }`}>
            <span className={`text-xl ${isEditing ? 'text-blue-500' : 'text-gray-400'}`}>
                {icon}
            </span>
            {isEditing && name !== 'email' ? (
                <input
                    type="text"
                    name={name}
                    value={value || ''}
                    onChange={onChange}
                    placeholder={placeholder}
                    className="w-full bg-transparent outline-none border-none text-gray-800 font-semibold placeholder:text-gray-300"
                />
            ) : (
                <span className="text-gray-800 font-semibold truncate">
                    {value || 'Not provided'}
                </span>
            )}
        </div>
    </div>
);

const SettingToggle = ({ label, active }) => (
    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/40 border border-white/60 hover:border-blue-100 transition-all cursor-pointer group">
        <span className="text-sm font-semibold text-gray-700">{label}</span>
        <div className={`w-11 h-6 rounded-full relative transition-colors duration-300 ${active ? 'bg-blue-500' : 'bg-gray-200'}`}>
            <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${active ? 'left-6' : 'left-1'}`}></div>
        </div>
    </div>
);

export default Profile;
