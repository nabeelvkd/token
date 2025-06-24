import { useState, useEffect } from 'react';
import ManageToken from '../../components/business/TokenStatus';
import {
    Calendar,
    Clock,
    Hash,
    CheckCircle,
    Eye,
} from 'lucide-react';
import Navbar from '../../components/business/Navbar';
import CalendarComponent from '../../components/business/Calendar';
import useBusinessAuth from '../../authentication/authBusiness';


export default function BusinessHome() {
    useBusinessAuth()
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);


    const [showAllAppointments, setShowAllAppointments] = useState(false);


    // Token management data

    const allAppointments = [
        { id: 1, customer: "Alice Brown", service: "Business Planning", time: "2:00 PM", status: "confirmed" },
        { id: 2, customer: "Robert Chen", service: "Investment Review", time: "3:30 PM", status: "pending" },
        { id: 3, customer: "Lisa Garcia", service: "Legal Consultation", time: "4:00 PM", status: "confirmed" },
        { id: 4, customer: "Mark Johnson", service: "Financial Planning", time: "5:00 PM", status: "pending" },
        { id: 5, customer: "Anna Davis", service: "Tax Consultation", time: "5:30 PM", status: "confirmed" },
    ];

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 10);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }
    const stats = [
        { label: "Today's Revenue", value: "$1,245", color: "text-blue-800" },
        { label: "Total Customers", value: "1,247", color: "text-gray-700" },
    ];

    return (
        <div className="min-h-screen bg-white md:ml-64 md:mt-0">
            <main className="container mx-auto px-4 md:px-8 py-6 md:mt-0 mt-5">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 mt-10">
                                {stats.map((stat, index) => (
                                    <div key={index} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
                                        <h3 className="text-sm sm:text-lg font-bold text-black">{stat.value}</h3>
                                        <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                                    </div>
                                ))}
                            </div>
                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Token Management */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Token Queue */}
                        <ManageToken/>

                        {/* Appointments */}
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                                <h3 className="text-base sm:text-lg font-semibold text-black flex items-center">
                                    <Calendar className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-800" />
                                    Today's Appointments
                                </h3>
                                <button className="bg-blue-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-900 transition-colors">
                                    + Book
                                </button>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                {(showAllAppointments ? allAppointments : allAppointments.slice(0, 2)).map((appointment) => (
                                    <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-white transition-colors space-y-2 sm:space-y-0">
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-800 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                                                {appointment.customer.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-black text-sm sm:text-base truncate">{appointment.customer}</h4>
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">{appointment.service}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                                            <span className="text-xs sm:text-sm text-gray-600">{appointment.time}</span>
                                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${appointment.status === 'confirmed'
                                                ? 'bg-blue-100 text-blue-800'
                                                : 'bg-gray-100 text-gray-700'
                                                }`}>
                                                {appointment.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}

                                {allAppointments.length > 2 && (
                                    <button
                                        onClick={() => setShowAllAppointments(!showAllAppointments)}
                                        className="w-full text-center py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center text-sm"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        {showAllAppointments ? 'Show Less' : `Show All (${allAppointments.length})`}
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Calendar */}
                    <CalendarComponent />
                </div>
            </main>
        </div>
    );
}