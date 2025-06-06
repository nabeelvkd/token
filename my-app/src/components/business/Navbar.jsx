
import React, { useEffect, useState } from "react";
import {
    Menu, X, User, Briefcase, Clock, Hash, Calendar,
    Home as HomeIcon, Star, LogOut, Users
} from 'lucide-react';
import { NavLink } from 'react-router-dom';

function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [companyName,setCompanyName]=useState('')

    const menuItems = [
        { name: "Home", icon: HomeIcon, path: "/business/home" },
        { name: "Profile", icon: User, path: "/business/profile" },
        { name: "Members", icon: Users, path: "/business/members" },
        { name: "Services", icon: Briefcase, path: "/business/services" },
        { name: "Working Hours", icon: Clock, path: "/business/working-hours" },
        { name: "Tokens", icon: Hash, path: "/business/tokens" },
        { name: "Appointments", icon: Calendar, path: "/business/appointments" },
        { name: "Rating", icon: Star, path: "/business/rating" }
    ];

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        console.log("Logging out...");
    };

    const navLinkStyle = ({ isActive }) =>
        `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${isActive ? "bg-blue-100 text-blue-800" : "text-gray-600 hover:bg-indigo-50 hover:text-blue-800"
        }`;

    useEffect(() => {
        const token = localStorage.getItem("businessToken");

        if (token) {
            // Decode the JWT to get payload (requires base64 decoding)
            const payload = JSON.parse(atob(token.split('.')[1]));
            setCompanyName(payload.name)
        }else{
            navigate('business/login')
        }
    }, [])
    return (
        <div className="relative">
            {/* Mobile Top Bar */}
            <div className="md:hidden fixed top-0 left-0 right-0 bg-indigo-50 z-50 flex items-center justify-between px-4 py-3">
                <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                        {companyName.charAt(0).toUpperCase()}
                    </div>
                    <h2 className="text-lg font-semibold text-black truncate">{companyName}</h2>
                </div>
                <button
                    className="p-2 text-gray-600 hover:text-blue-800"
                    onClick={toggleMenu}
                >
                    {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden md:block fixed inset-y-0 left-0 w-64 bg-indigo-50">
                <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-2 p-4">
                        <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            {companyName.charAt(0).toUpperCase()}
                        </div>
                        <h2 className="text-lg font-semibold text-black truncate">{companyName}</h2>
                    </div>
                    <nav className="flex flex-col flex-1 space-y-2 p-4">
                        {menuItems.map(({ name, icon: Icon, path }) => (
                            <NavLink
                                key={name}
                                to={path}
                                className={navLinkStyle}
                                onClick={() => setPath(name)}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{name}</span>
                            </NavLink>
                        ))}
                    </nav>
                    <div className="p-4">
                        <button
                            className="flex items-center space-x-3 px-4 py-2 w-full rounded-lg text-red-600 hover:bg-red-50"
                            onClick={handleLogout}
                        >
                            <LogOut className="w-5 h-5" />
                            <span className="text-sm font-medium">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Sidebar Menu */}
            <div
                className={`md:hidden fixed inset-y-0 left-0 w-64 bg-indigo-50 z-50 transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'} pt-16`}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center space-x-2 p-4">
                        <div className="w-8 h-8 bg-blue-800 rounded-full flex items-center justify-center text-white font-bold text-lg">
                            E
                        </div>
                        <h2 className="text-lg font-semibold text-black truncate">{companyName}</h2>
                    </div>
                    <nav className="flex flex-col flex-1 space-y-2 p-4">
                        {menuItems.map(({ name, icon: Icon, path: subPath }) => (
                            <NavLink
                                key={name}
                                to={subPath}
                                className={navLinkStyle}
                                onClick={() => {
                                    setIsMenuOpen(false);
                                    setPath(name);
                                }}
                            >
                                <Icon className="w-5 h-5" />
                                <span className="text-sm font-medium">{name}</span>
                            </NavLink>
                        ))}
                    </nav>
                    <div className="p-4">
                        <button
                            className="flex items-center space-x-3 px-4 py-2 w-full rounded-lg text-red-600 hover:bg-red-50"
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

            {/* Mobile Menu Overlay */}
            {isMenuOpen && (
                <div
                    className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
                    onClick={toggleMenu}
                />
            )}
        </div>
    );
}

export default Navbar;