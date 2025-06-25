import { useState ,useEffect} from 'react';
import axios from 'axios';
import {
    Calendar,
    Archive,
    User,
    LogOut,
    Briefcase,
} from 'lucide-react';
import useMemberAuth from "../../authentication/useMemberAuth"
import { useNavigate } from 'react-router-dom';
import TokenStatus from '../../components/business/TokenStatus'
import { jwtDecode } from 'jwt-decode';

export default function MemberDashboard() {
    useMemberAuth()
    let decoded=null
    const navigate = useNavigate()
    const [activeTab, setActiveTab] = useState('tokens');

    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showAppointmentHistory, setShowAppointmentHistory] = useState(false);
    const token = localStorage.getItem("MemberToken");
    if(token){
        decoded=jwtDecode(token)
    }

    const allAppointments = [
        { id: 1, customer: "Alice Brown", service: "Haircutting", time: "2:00 PM", status: "confirmed" },
        { id: 2, customer: "Robert Chen", service: "Keratin Treatment", time: "3:30 PM", status: "pending" },
        { id: 3, customer: "Lisa Garcia", service: "Haircutting", time: "4:00 PM", status: "confirmed" },
        { id: 4, customer: "Mark Johnson", service: "Keratin Treatment", time: "5:00 PM", status: "pending" },
        { id: 5, customer: "Anna Davis", service: "Haircutting", time: "5:30 PM", status: "confirmed" },
    ];

    const pastAppointments = [
        { id: 1, customer: "James Wilson", service: "Haircutting", time: "Yesterday, 10:00 AM", status: "completed" },
        { id: 2, customer: "Sophie Turner", service: "Keratin Treatment", time: "Yesterday, 11:30 AM", status: "completed" },
        { id: 3, customer: "Chris Evans", service: "Haircutting", time: "Yesterday, 2:30 PM", status: "completed" },
    ];




    const handleLogout = () => {
        const confirm = window.confirm("Would you like to proceed with logging out?")
        if (!confirm) return
        localStorage.removeItem('MemberToken')
        navigate('/business/login')
    };

    return (
        <div className="min-h-screen bg-white">
            <main className="container mx-auto px-4 md:px-8 py-6 relative">
                {/* Profile Icon */}
                <div className="absolute top-6 right-4">
                    <button
                        onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                        className="flex items-center space-x-2 p-2 rounded-full hover:bg-gray-100"
                    >
                        <User className="w-6 h-6 text-blue-800" />
                    </button>
                    {showProfileDropdown && (
                        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                            <div className="p-4 border-b border-gray-200">
                                <div className="flex items-center space-x-3">
                                    <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-semibold text-lg">
                                        {decoded.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-black">{decoded.name}</h4>
                                        <p className="text-xs text-gray-600 flex items-center">
                                            <Briefcase className="w-3 h-3 mr-1" />
                                            {decoded.business}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <button
                                onClick={handleLogout}
                                className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                            >
                                <LogOut className="w-4 h-4 mr-2" />
                                Logout
                            </button>
                        </div>
                    )}
                </div>

                {/* Tabs */}
                <div className="flex border-b border-gray-200 mb-6">
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'tokens' ? 'border-b-2 border-blue-800 text-blue-800' : 'text-gray-600 hover:text-blue-800'}`}
                        onClick={() => setActiveTab('tokens')}
                    >
                        Tokens
                    </button>
                    <button
                        className={`px-4 py-2 text-sm font-medium ${activeTab === 'appointments' ? 'border-b-2 border-blue-800 text-blue-800' : 'text-gray-600 hover:text-blue-800'}`}
                        onClick={() => setActiveTab('appointments')}
                    >
                        Appointments
                    </button>
                </div>

                {activeTab === 'tokens' && (
                    <TokenStatus admin={false}/>
                )}

                {activeTab === 'appointments' && (
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                        <div className="flex items-center mb-4">
                            <h3 className="text-base sm:text-lg font-semibold text-black flex items-center">
                                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-800" />
                                All Appointments
                            </h3>
                        </div>
                        <div className="space-y-3">
                            <h4 className="text-sm font-semibold text-gray-700">Current Appointments</h4>
                            {allAppointments.map((appointment) => (
                                <div key={appointment.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center space-x-4">
                                        <div className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                            {appointment.customer.charAt(0)}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <h4 className="font-medium text-black text-base truncate">{appointment.customer}</h4>
                                            <p className="text-sm text-gray-600 truncate">{appointment.service}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-4">
                                        <span className="text-sm text-gray-600">{appointment.time}</span>
                                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${appointment.status === 'confirmed' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-700'}`}>
                                            {appointment.status}
                                        </span>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={() => setShowAppointmentHistory(!showAppointmentHistory)}
                                className="w-full text-center py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center text-sm"
                            >
                                <Archive className="w-4 h-4 mr-2" />
                                {showAppointmentHistory ? 'Hide History' : 'Show History'}
                            </button>

                            {showAppointmentHistory && (
                                <div className="space-y-3">
                                    <h4 className="text-sm font-semibold text-gray-700">Past Appointments</h4>
                                    {pastAppointments.map(appointment => (
                                        <div key={appointment.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                                            <div className="flex items-center space-x-4">
                                                <div className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                    {appointment.customer.charAt(0)}
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-black text-base truncate">{appointment.customer}</h4>
                                                    <p className="text-sm text-gray-600 truncate">{appointment.service}</p>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-sm text-gray-600">{appointment.time}</span>
                                                    <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                        {appointment.status}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}