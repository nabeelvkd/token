import { useState } from 'react';
import {
    Calendar,
    Clock,
    Hash,
    CheckCircle,
    Archive,
    User,
    LogOut,
    Briefcase,
} from 'lucide-react';

export default function MemberDashboard() {
    const [activeTab, setActiveTab] = useState('tokens');
    const [selectedTokenType, setSelectedTokenType] = useState('haircutting');
    const [selectedToken, setSelectedToken] = useState(null);
    const [tokenNumbers, setTokenNumbers] = useState({
        haircutting: 15,
        keratin: 10,
    });
    const [showProfileDropdown, setShowProfileDropdown] = useState(false);
    const [showTokenHistory, setShowTokenHistory] = useState(false);
    const [showAppointmentHistory, setShowAppointmentHistory] = useState(false);
    const [tokenData, setTokenData] = useState({
        haircutting: [
            { id: 1, tokenNumber: 15, customer: "John Smith", service: "Haircutting", status: "current", time: "10:30 AM" },
            { id: 2, tokenNumber: 16, customer: "Sarah Johnson", service: "Haircutting", status: "waiting", time: "10:45 AM" },
            { id: 3, tokenNumber: 17, customer: "Mike Davis", service: "Haircutting", status: "waiting", time: "11:00 AM" },
            { id: 4, tokenNumber: 18, customer: "Emma Wilson", service: "Haircutting", status: "waiting", time: "11:15 AM" },
        ],
        keratin: [
            { id: 1, tokenNumber: 10, customer: "Lisa White", service: "Keratin Treatment", status: "current", time: "11:00 AM" },
            { id: 2, tokenNumber: 11, customer: "David Brown", service: "Keratin Treatment", status: "waiting", time: "11:30 AM" },
            { id: 3, tokenNumber: 12, customer: "Anna Davis", service: "Keratin Treatment", status: "waiting", time: "12:00 PM" },
        ],
    });
    const [pastTokenData, setPastTokenData] = useState({
        haircutting: [
            { id: 1, tokenNumber: 13, customer: "Tom Harris", service: "Haircutting", status: "completed", time: "Yesterday, 2:00 PM" },
            { id: 2, tokenNumber: 14, customer: "Jane Lee", service: "Haircutting", status: "completed", time: "Yesterday, 3:30 PM" },
        ],
        keratin: [
            { id: 1, tokenNumber: 8, customer: "Emily Clark", service: "Keratin Treatment", status: "completed", time: "Yesterday, 1:00 PM" },
            { id: 2, tokenNumber: 9, customer: "Michael Adams", service: "Keratin Treatment", status: "completed", time: "Yesterday, 4:00 PM" },
        ],
    });

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

    const profileData = {
        name: "John Doe",
        business: "Elegant Salon",
    };

    const handleNextToken = () => {
        if (selectedTokenType && tokenData[selectedTokenType].length > 0) {
            setTokenData(prev => {
                const currentTokens = [...prev[selectedTokenType]];
                const currentToken = currentTokens.find(t => t.status === "current");
                let updatedTokens = currentTokens;

                // Mark current token as completed and move to history
                if (currentToken) {
                    const completedToken = {
                        ...currentToken,
                        status: "completed",
                        time: new Date().toLocaleString('en-US', {
                            weekday: 'long',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true
                        })
                    };
                    setPastTokenData(prevPast => ({
                        ...prevPast,
                        [selectedTokenType]: [...prevPast[selectedTokenType], completedToken],
                    }));
                    updatedTokens = currentTokens.filter(t => t.id !== currentToken.id);
                }

                // Set next token as current
                const nextToken = updatedTokens.find(t => t.tokenNumber === tokenNumbers[selectedTokenType] + 1);
                if (nextToken) {
                    updatedTokens = updatedTokens.map(t =>
                        t.id === nextToken.id ? { ...t, status: "current" } : t
                    );
                    setSelectedToken({ ...nextToken, status: "current" });
                } else {
                    setSelectedToken(null);
                }

                return {
                    ...prev,
                    [selectedTokenType]: updatedTokens,
                };
            });

            setTokenNumbers(prev => ({
                ...prev,
                [selectedTokenType]: prev[selectedTokenType] + 1,
            }));
        }
    };

    const handleLogout = () => {
        console.log("Logout clicked");
        setShowProfileDropdown(false);
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
                                        {profileData.name.charAt(0)}
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-semibold text-black">{profileData.name}</h4>
                                        <p className="text-xs text-gray-600 flex items-center">
                                            <Briefcase className="w-3 h-3 mr-1" />
                                            {profileData.business}
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
                    <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                            <h3 className="text-base sm:text-lg font-semibold text-black flex items-center">
                                <Hash className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-800" />
                                Token Selection
                            </h3>
                            <div className="flex space-x-2">
                                <select
                                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-800"
                                    value={selectedTokenType}
                                    onChange={(e) => {
                                        setSelectedTokenType(e.target.value);
                                        setSelectedToken(null);
                                        setShowTokenHistory(false);
                                    }}
                                >
                                    <option value="haircutting">Haircutting</option>
                                    <option value="keratin">Keratin Treatment</option>
                                </select>
                                <button
                                    onClick={handleNextToken}
                                    className="bg-blue-800 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-900 transition-colors"
                                    disabled={tokenData[selectedTokenType].length === 0}
                                >
                                    Next Token
                                </button>
                            </div>
                        </div>

                        {selectedTokenType && (
                            <div className="space-y-3">
                                <h4 className="text-sm font-semibold text-gray-700">Current Tokens</h4>
                                {tokenData[selectedTokenType].length === 0 ? (
                                    <p className="text-sm text-gray-600">No active tokens available.</p>
                                ) : (
                                    tokenData[selectedTokenType].map(token => (
                                        <div
                                            key={token.id}
                                            className={`p-4 rounded-lg border-2 cursor-pointer ${selectedToken?.id === token.id ? 'border-blue-800 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
                                            onClick={() => setSelectedToken(token)}
                                        >
                                            <div className="flex items-center space-x-4">
                                                <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base ${token.status === 'current' ? 'bg-blue-800' : 'bg-gray-200'}`}>
                                                    {token.tokenNumber}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="font-medium text-black text-base">{token.customer}</h4>
                                                    <p className="text-sm text-gray-600">{token.service}</p>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className="text-sm text-gray-600">{token.time}</span>
                                                    {token.status === 'current' ? (
                                                        <CheckCircle className="w-5 h-5 text-blue-800" />
                                                    ) : (
                                                        <Clock className="w-5 h-5 text-gray-500" />
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    ))
                                )}

                                <button
                                    onClick={() => setShowTokenHistory(!showTokenHistory)}
                                    className="w-full text-center py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center text-sm"
                                >
                                    <Archive className="w-4 h-4 mr-2" />
                                    {showTokenHistory ? 'Hide History' : 'Show History'}
                                </button>

                                {showTokenHistory && (
                                    <div className="space-y-3">
                                        <h4 className="text-sm font-semibold text-gray-700">Past Tokens</h4>
                                        {pastTokenData[selectedTokenType].length === 0 ? (
                                            <p className="text-sm text-gray-600">No past tokens available.</p>
                                        ) : (
                                            pastTokenData[selectedTokenType].map(token => (
                                                <div key={token.id} className="p-4 rounded-lg border border-gray-200 hover:bg-gray-50">
                                                    <div className="flex items-center space-x-4">
                                                        <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-base bg-gray-500">
                                                            {token.tokenNumber}
                                                        </div>
                                                        <div className="flex-1">
                                                            <h4 className="font-medium text-black text-base">{token.customer}</h4>
                                                            <p className="text-sm text-gray-600">{token.service}</p>
                                                        </div>
                                                        <div className="flex items-center space-x-4">
                                                            <span className="text-sm text-gray-600">{token.time}</span>
                                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                                                {token.status}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
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