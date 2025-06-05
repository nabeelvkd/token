import React, { useState } from "react";
import {
    Menu,
    X,
    User,
    Briefcase,
    Clock,
    Hash,
    Calendar,
    Home,
    Star,
    LogOut
} from 'lucide-react';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const companyName = "Elite Business Solutions";

    const menuItems = [
        { name: "Home", icon: Home },
        { name: "Profile", icon: User },
        { name: "Services", icon: Briefcase },
        { name: "Working Hours", icon: Clock },
        { name: "Tokens", icon: Hash },
        { name: "Appointments", icon: Calendar },
        { name: "Rating", icon: Star }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        // Placeholder for logout logic (e.g., clear auth token, redirect to login)
        console.log("Logging out...");
    };

    return (
        <div className="relative">
            {/* Mobile Top Bar with Logo, Company Name, and Hamburger Menu */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-white z-50 flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        E
                    </div>
                    <h2 className="text-lg font-semibold text-black truncate">{companyName}</h2>
                </div>
                <button
                    className="p-2 text-gray-600 hover:text-blue-800 transition-colors"
                    onClick={toggleMenu}
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    aria-expanded={isMenuOpen}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-white">
                <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-2 p-4">
                        <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            E
                        </div>
                        <h2 className="text-lg font-semibold text-black truncate">{companyName}</h2>
                    </div>
                    <nav className="flex flex-col flex-1 space-y-2 p-4">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${item.name === "Home"
                                        ? "bg-blue-100 text-blue-800"
                                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-800"
                                    }`}
                                onClick={() => {
                                    // Add navigation logic here (e.g., router.push(`/${item.name.toLowerCase().replace(' ', '-')}`))
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.name}</span>
                            </button>
                        ))}
                    </nav>
                    {/* Logout Button */}
                    <div className="p-4">
                        <button
                            className="flex items-center space-x-3 px-4 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Hamburger Menu */}
            <div
                className={`md:hidden fixed inset-y-0 left-0 w-64 bg-white transform transition-transform duration-300 ease-in-out z-50 ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="flex flex-col h-full pt-16">
                    <nav className="flex flex-col flex-1 space-y-2 p-4">
                        {menuItems.map((item, index) => (
                            <button
                                key={index}
                                className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${item.name === "Home"
                                        ? "bg-blue-100 text-blue-800"
                                        : "text-gray-600 hover:bg-blue-50 hover:text-blue-800"
                                    }`}
                                onClick={() => {
                                    // Add navigation logic here (e.g., router.push(`/${item.name.toLowerCase().replace(' ', '-')}`))
                                    setIsMenuOpen(false);
                                }}
                            >
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{item.name}</span>
                            </button>
                        ))}
                    </nav>
                    {/* Logout Button */}
                    <div className="p-4">
                        <button
                            className="flex items-center space-x-3 px-4 py-2 w-full rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => {
                                handleLogout();
                                setIsMenuOpen(false);
                            }}
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Overlay for Mobile Menu */}
            {isMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleMenu}
                ></div>
            )}
        </div>
    );
}

export default Navbar;