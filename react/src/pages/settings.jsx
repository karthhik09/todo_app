import React, { useState, useEffect } from 'react';
import Sidebar from '../components/sidebar';
import Header from '../components/header';
import Footer from '../components/footer';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { authAPI } from '../services/api';

function SettingsPage({ darkMode, setDarkMode, onNavigate, sidebarOpen, setSidebarOpen, currentUser, setCurrentUser }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editName, setEditName] = useState('');
    const [editEmail, setEditEmail] = useState('');
    const [editPassword, setEditPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [saving, setSaving] = useState(false);

    // Load user data when component mounts or currentUser changes
    useEffect(() => {
        if (currentUser) {
            setEditName(currentUser.name || '');
            setEditEmail(currentUser.email || '');
            setEditPassword(currentUser.password || '');
        }
    }, [currentUser]);

    const handleSaveProfile = async () => {
        try {
            setSaving(true);
            // Save to backend
            const updatedUser = await authAPI.updateUser(
                currentUser.userId,
                editName,
                editEmail,
                editPassword
            );
            // Update localStorage with new data
            localStorage.setItem('currentUser', JSON.stringify(updatedUser));
            setCurrentUser(updatedUser);
            setIsEditing(false);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Error saving profile:', error);
            alert(`Failed to save profile: ${error.response?.data?.message || error.message}`);
        } finally {
            setSaving(false);
        }
    };

    const handleCancelProfile = () => {
        setIsEditing(false);
        // Reset to current user data
        if (currentUser) {
            setEditName(currentUser.name || '');
            setEditEmail(currentUser.email || '');
            setEditPassword(currentUser.password || '');
        }
    };

    return (
        <div className={`min-h-screen flex flex-col ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <div className="flex flex-1">
                <Sidebar
                    darkMode={darkMode}
                    sidebarOpen={sidebarOpen}
                    setSidebarOpen={setSidebarOpen}
                    currentPage="settings"
                    currentUser={currentUser}
                    onNavigate={(page) => {
                        // Only close sidebar on mobile
                        if (window.innerWidth < 1024) {
                            setSidebarOpen(false);
                        }
                        onNavigate(page);
                    }}
                />

                <div className={`flex-1 flex flex-col transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : 'lg:ml-0'}`}>
                    <div className={`flex-1 p-4 lg:p-8 transition-all duration-300 ${sidebarOpen ? 'pl-4' : 'pl-24'} lg:pl-8`}>
                        <div className="max-w-5xl mx-auto">
                            <Header
                                darkMode={darkMode}
                                currentUser={currentUser}
                            />

                            <h1
                                className="text-3xl lg:text-4xl font-bold mb-8 lg:mb-12"
                                style={{ color: darkMode ? '#FFFFFF' : '#1F41BB' }}
                            >
                                Settings
                            </h1>

                            <div
                                className={`max-w-2xl mx-auto ${darkMode ? 'bg-gray-800' : 'bg-white'
                                    } rounded-xl p-6 lg:p-8 shadow-lg`}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                                    <div>
                                        <h2
                                            className={`text-xl lg:text-2xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'
                                                }`}
                                        >
                                            Profile info
                                        </h2>
                                        <p
                                            className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'
                                                }`}
                                        >
                                            Your account information
                                        </p>
                                    </div>
                                    <button
                                        onClick={() => setIsEditing(!isEditing)}
                                        className={`px-6 py-2 rounded-lg transition-colors ${darkMode
                                            ? 'bg-gray-700 text-white hover:bg-gray-600'
                                            : 'bg-gray-600 text-white hover:bg-gray-700'
                                            }`}
                                    >
                                        Edit
                                    </button>
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label
                                            className={`block mb-2 text-sm lg:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}
                                        >
                                            Name
                                        </label>
                                        <input
                                            type="text"
                                            value={editName}
                                            onChange={(e) => setEditName(e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-lg transition-all ${darkMode
                                                ? 'bg-gray-700 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                                } ${!isEditing && 'opacity-60 cursor-not-allowed'} ${isEditing && 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                }`}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            className={`block mb-2 text-sm lg:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}
                                        >
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            value={editEmail}
                                            onChange={(e) => setEditEmail(e.target.value)}
                                            disabled={!isEditing}
                                            className={`w-full px-4 py-3 rounded-lg transition-all ${darkMode
                                                ? 'bg-gray-700 text-white'
                                                : 'bg-gray-100 text-gray-900'
                                                } ${!isEditing && 'opacity-60 cursor-not-allowed'} ${isEditing && 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                }`}
                                        />
                                    </div>

                                    <div>
                                        <label
                                            className={`block mb-2 text-sm lg:text-base ${darkMode ? 'text-gray-300' : 'text-gray-700'
                                                }`}
                                        >
                                            Password
                                        </label>
                                        <div className="relative">
                                            <input
                                                type={showPassword ? "text" : "password"}
                                                value={editPassword}
                                                onChange={(e) => setEditPassword(e.target.value)}
                                                disabled={!isEditing}
                                                className={`w-full px-4 py-3 pr-12 rounded-lg transition-all ${darkMode
                                                    ? 'bg-gray-700 text-white'
                                                    : 'bg-gray-100 text-gray-900'
                                                    } ${!isEditing && 'opacity-60 cursor-not-allowed'} ${isEditing && 'focus:outline-none focus:ring-2 focus:ring-blue-500'
                                                    }`}
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className={`absolute right-3 top-1/2 transform -translate-y-1/2 ${darkMode ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-700'} transition-colors`}
                                            >
                                                {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                                            </button>
                                        </div>
                                    </div>

                                    {/* Appearance Section */}
                                    <div className={`pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                                            Appearance
                                        </h3>
                                        <div>
                                            <label className={`block text-sm font-medium mb-2 ${darkMode ? 'text-gray-300' : 'text-gray-700'}`}>
                                                Theme
                                            </label>
                                            <select
                                                value={darkMode ? 'dark' : 'light'}
                                                onChange={(e) => setDarkMode(e.target.value === 'dark')}
                                                className={`px-4 py-3 rounded-lg transition-all max-w-xs ${darkMode
                                                    ? 'bg-gray-700 text-white border-gray-600'
                                                    : 'bg-gray-100 text-gray-900 border-gray-300'
                                                    } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
                                            >
                                                <option value="light"> Light Mode </option>
                                                <option value="dark"> Dark Mode </option>
                                            </select>
                                        </div>
                                    </div>
                                </div>

                                {isEditing && (
                                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                        <button
                                            onClick={handleSaveProfile}
                                            disabled={saving}
                                            className={`px-6 py-2 rounded-lg transition-colors ${darkMode
                                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                : 'bg-gray-600 text-white hover:bg-gray-700'
                                                } disabled:opacity-50 disabled:cursor-not-allowed`}
                                        >
                                            {saving ? 'Saving...' : 'Save'}
                                        </button>
                                        <button
                                            onClick={handleCancelProfile}
                                            disabled={saving}
                                            className={`px-6 py-2 rounded-lg transition-colors ${darkMode
                                                ? 'bg-gray-700 text-white hover:bg-gray-600'
                                                : 'bg-gray-500 text-white hover:bg-gray-600'
                                                } disabled:opacity-50`}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                )}

                                <div className={`mt-8 pt-6 border-t ${darkMode ? 'border-gray-700' : 'border-gray-200'}`}>
                                    <p className={`text-sm text-center ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                                        Joined ToDo on {currentUser?.createdDate ? new Date(currentUser.createdDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : 'N/A'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    <Footer darkMode={darkMode} />
                </div>
            </div>
        </div>
    );
}

export default SettingsPage;