import React, { useState } from 'react';
import { User, LogOut, Briefcase, Search } from 'lucide-react';

export default function UserNavbar() {
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const profileData = {
        name: "John Doe",
        business: "Elegant Salon",
    };

    const handleLogout = () => {
        console.log("Logout clicked");
        setShowProfileDropdown(false);
    };

    const handleSearch = (e) => {
        setSearchQuery(e.target.value);
        console.log("Search query:", e.target.value);
    };

    return (
        <div className="bg-gradient-to-r from-indigo-800 to-indigo-600 shadow-lg">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between py-4">
                    {/* Logo */}
                    <div className="text-white font-extrabold text-2xl tracking-tight transition-transform duration-300 hover:scale-105 md:text-3xl">
                        Tokenly
                    </div>

                    {/* Search and Profile */}
                    <div className="flex items-center space-x-3 md:space-x-6">
                        {/* Search Bar */}
                        <div className="relative w-40 md:w-64">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={handleSearch}
                                placeholder="Search business..."
                                className="placeholder-white w-full pl-10 pr-4 py-2 text-sm text-gray-800 bg-white/20 backdrop-blur-md border border-white/30 rounded-full focus:outline-none focus:ring-2 focus:ring-white/50 transition-all duration-300 placeholder-gray-500"
                            />
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-white/70" />
                        </div>

                        {/* Profile Section */}
                        <div className="relative">
                            <button
                                onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                                className="flex items-center justify-center w-10 h-10 rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-all duration-300"
                            >
                                <User className="w-5 h-5 text-white" />
                            </button>
                            {showProfileDropdown && (
                                <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-100 z-20 overflow-hidden">
                                    <div className="p-4 bg-gradient-to-b from-gray-50 to-white">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-12 h-12 bg-indigo-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                                {profileData.name.charAt(0)}
                                            </div>
                                            <div>
                                                <h4 className="text-sm font-semibold text-gray-800">{profileData.name}</h4>
                                                <p className="text-xs text-gray-500 flex items-center">
                                                    <Briefcase className="w-3 h-3 mr-1" />
                                                    {profileData.business}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleLogout}
                                        className="w-full flex items-center px-4 py-3 text-sm text-red-600 hover:bg-gray-100 transition-colors duration-200"
                                    >
                                        <LogOut className="w-4 h-4 mr-2" />
                                        Logout
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}