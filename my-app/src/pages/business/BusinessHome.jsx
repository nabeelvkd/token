import { useState, useEffect } from 'react';
import {
    Calendar,
    Clock,
    Hash,
    CheckCircle,
    Eye,
} from 'lucide-react';
import Navbar from '../../components/business/Navbar';
import CalendarComponent from '../../components/business/Calendar';

export default function BusinessHome() {
    const [activeTab, setActiveTab] = useState('overview');
    const [isLoading, setIsLoading] = useState(true);

    const [showAllTokens, setShowAllTokens] = useState(false);
    const [showAllAppointments, setShowAllAppointments] = useState(false);

    const stats = [
        { label: "Today's Revenue", value: "$1,245", color: "text-blue-800" },
        { label: "Total Customers", value: "1,247", color: "text-gray-700" },
    ];

    // Token management data
    const tokenData = {
        currentToken: 15,
        totalTokens: 45,
        waitingCustomers: 8,
        averageWaitTime: "12 min"
    };

    const allTokens = [
        { id: 1, tokenNumber: 15, customer: "John Smith", service: "Business Consultation", status: "current", time: "10:30 AM" },
        { id: 2, tokenNumber: 16, customer: "Sarah Johnson", service: "Strategy Planning", status: "waiting", time: "10:45 AM" },
        { id: 3, tokenNumber: 17, customer: "Mike Davis", service: "Financial Review", status: "waiting", time: "11:00 AM" },
        { id: 4, tokenNumber: 18, customer: "Emma Wilson", service: "Tax Consultation", status: "waiting", time: "11:15 AM" },
        { id: 5, tokenNumber: 19, customer: "David Brown", service: "Legal Review", status: "waiting", time: "11:30 AM" },
        { id: 6, tokenNumber: 20, customer: "Lisa White", service: "Investment Planning", status: "waiting", time: "11:45 AM" },
    ];

    const allAppointments = [
        { id: 1, customer: "Alice Brown", service: "Business Planning", time: "2:00 PM", status: "confirmed" },
        { id: 2, customer: "Robert Chen", service: "Investment Review", time: "3:30 PM", status: "pending" },
        { id: 3, customer: "Lisa Garcia", service: "Legal Consultation", time: "4:00 PM", status: "confirmed" },
        { id: 4, customer: "Mark Johnson", service: "Financial Planning", time: "5:00 PM", status: "pending" },
        { id: 5, customer: "Anna Davis", service: "Tax Consultation", time: "5:30 PM", status: "confirmed" },
    ];

    useEffect(() => {
        setTimeout(() => setIsLoading(false), 1000);
    }, []);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-blue-800 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading your dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 md:ml-64 md:mt-0">
            {/* Header */}
            <Navbar />

            <main className="container mx-auto px-4 md:px-8 py-6 md:mt-0 mt-5">
                {/* Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 mb-6 mt-10">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
                            <h3 className="text-sm sm:text-lg font-bold text-black">{stat.value}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
                        <h3 className="text-sm sm:text-lg font-bold text-blue-800">{tokenData.currentToken}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Current Token</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
                        <h3 className="text-sm sm:text-lg font-bold text-gray-700">{tokenData.waitingCustomers}</h3>
                        <p className="text-xs sm:text-sm text-gray-600">Waiting</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Token Management */}
                    <div className="xl:col-span-2 space-y-6">
                        {/* Token Queue */}
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                                <h3 className="text-base sm:text-lg font-semibold text-black flex items-center">
                                    <Hash className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-800" />
                                    Token Management
                                </h3>
                                <div className="flex space-x-2">
                                    <button className="bg-blue-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-900 transition-colors">
                                        Next Token
                                    </button>
                                    <button className="bg-gray-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-800 transition-colors">
                                        + New
                                    </button>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                                <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                                    <div className="text-lg sm:text-2xl font-bold text-blue-800">{tokenData.currentToken}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Current</div>
                                </div>
                                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="text-lg sm:text-2xl font-bold text-gray-700">{tokenData.waitingCustomers}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Waiting</div>
                                </div>
                                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className='text-lg sm:text-2xl font-bold text-gray-700'>{tokenData.totalTokens}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Total Today</div>
                                </div>
                                <div className="text-center p-2 sm:p-3 bg-gray-50 rounded-lg border border-gray-200">
                                    <div className="text-lg sm:text-2xl font-bold text-gray-700">{tokenData.averageWaitTime}</div>
                                    <div className="text-xs sm:text-sm text-gray-600">Avg Wait</div>
                                </div>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                {(showAllTokens ? allTokens : allTokens.slice(0, 2)).map((token) => (
                                    <div key={token.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border-2 transition-all space-y-2 sm:space-y-0 ${token.status === 'current'
                                        ? 'border-blue-800 bg-blue-50'
                                        : 'border-gray-200 hover:border-gray-300'
                                        }`}>
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <div className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${token.status === 'current' ? 'bg-blue-800' : 'bg-gray-500'
                                                }`}>
                                                {token.tokenNumber}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-black text-sm sm:text-base truncate">{token.customer}</h4>
                                                <p className="text-xs sm:text-sm text-gray-600 truncate">{token.service}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                                            <span className="text-xs sm:text-sm text-gray-600">{token.time}</span>
                                            {token.status === 'current' ? (
                                                <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-800" />
                                            ) : (
                                                <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                            )}
                                        </div>
                                    </div>
                                ))}

                                {allTokens.length > 2 && (
                                    <button
                                        onClick={() => setShowAllTokens(!showAllTokens)}
                                        className="w-full text-center py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center text-sm"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        {showAllTokens ? 'Show Less' : `Show All (${allTokens.length})`}
                                    </button>
                                )}
                            </div>
                        </div>

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
                                    <div key={appointment.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors space-y-2 sm:space-y-0">
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