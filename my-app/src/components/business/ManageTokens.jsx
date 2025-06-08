import { useState, useEffect } from 'react';
import {
    Clock,
    Plus,
    Eye,
    EyeOff,
    Ticket,
    Trash2,
    CheckCircle,
    Users,
    Settings,
    Calendar,
    Timer
} from 'lucide-react';
import axios from 'axios';

export default function TokenManagement() {
    const [showAllTokens, setShowAllTokens] = useState(false);
    const [formData, setFormData] = useState({
        tokenName: '',
        services: [],
        assignedMembers: [],
        daySessionPairs: [], // Changed from separate days/sections/timeSlots to combined pairs
        maxTokensPerSession: '',
        bookingMinutesBefore: ''
    });

    const [tokens, setTokens] = useState([
        {
            id: 1,
            tokenName: 'General Consultation',
            services: ['Health Checkup', 'Blood Test'],
            assignedMembers: ['Dr. Smith', 'Nurse Jane'],
            daySessionPairs: [
                { day: 'Monday', session: '10-12' },
                { day: 'Monday', session: '1-4' },
                { day: 'Wednesday', session: '1-4' }
            ],
            maxTokensPerSession: 10,
            bookingMinutesBefore: 30,
            status: 'active',
            dateCreated: '2024-01-15',
            tokensBooked: 7
        },
        {
            id: 2,
            tokenName: 'Specialist Visit',
            services: ['Cardiology', 'Neurology'],
            assignedMembers: ['Dr. Johnson'],
            daySessionPairs: [
                { day: 'Tuesday', session: '1-4' },
                { day: 'Thursday', session: '2-4' }
            ],
            maxTokensPerSession: 5,
            bookingMinutesBefore: 60,
            status: 'active',
            dateCreated: '2024-01-10',
            tokensBooked: 3
        }
    ]);

    // Mock data - in real app, fetch from API
    const [availableServices,setServices] = useState([]);

    const [availableMembers,setMembers] = useState([]);

    useEffect(() => {
        const token = localStorage.getItem("businessToken");

        axios.get("http://localhost:5000/business/services", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setServices(response.data.services.map(services=>services.name))
            })
            .catch(error => {
                console.error("Unauthorized:", error.response?.data || error.message);
            });

        axios.get("http://localhost:5000/business/members", {
            headers: {
                Authorization: `Bearer ${token}` // optional if protected
            }
        }).then((response)=>{
            setMembers(response.data.members.map(members=>members.name))
        })
    }, [])

    // Mock working hours with days and sessions
    const [workingSchedule] = useState({
        'Monday': ['10-12', '1-4', '5-7'],
        'Tuesday': ['10-12', '1-4'],
        'Wednesday': ['9-12', '1-4', '5-8'],
        'Thursday': ['10-12', '2-4'],
        'Friday': ['9-12', '1-4', '5-6'],
        'Saturday': ['10-12', '2-4'],
        'Sunday': ['10-12']
    });

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const stats = [
        { label: "Total Tokens", value: tokens.length.toString(), color: "text-blue-800" },
        { label: "Active Tokens", value: tokens.filter(t => t.status === 'active').length.toString(), color: "text-green-600" },
        { label: "Total Bookings", value: tokens.reduce((sum, t) => sum + t.tokensBooked, 0).toString(), color: "text-purple-600" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleServiceSelection = (service) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(service)
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service]
        }));
    };

    const handleMemberSelection = (member) => {
        setFormData(prev => ({
            ...prev,
            assignedMembers: prev.assignedMembers.includes(member)
                ? prev.assignedMembers.filter(m => m !== member)
                : [...prev.assignedMembers, member]
        }));
    };

    const handleDaySessionSelection = (day, session) => {
        const pairKey = `${day}-${session}`;
        const pairExists = formData.daySessionPairs.some(pair =>
            pair.day === day && pair.session === session
        );

        setFormData(prev => ({
            ...prev,
            daySessionPairs: pairExists
                ? prev.daySessionPairs.filter(pair =>
                    !(pair.day === day && pair.session === session)
                )
                : [...prev.daySessionPairs, { day, session }]
        }));
    };

    const isDaySessionSelected = (day, session) => {
        return formData.daySessionPairs.some(pair =>
            pair.day === day && pair.session === session
        );
    };

    const getSelectedDays = () => {
        const uniqueDays = [...new Set(formData.daySessionPairs.map(pair => pair.day))];
        return uniqueDays;
    };

    const getSelectedSessions = () => {
        const uniqueSessions = [...new Set(formData.daySessionPairs.map(pair => pair.session))];
        return uniqueSessions;
    };

    const handleSubmit = () => {
        if (formData.tokenName && formData.services.length > 0 && formData.assignedMembers.length > 0 &&
            formData.daySessionPairs.length > 0 && formData.maxTokensPerSession && formData.bookingMinutesBefore) {

            const newToken = {
                id: tokens.length + 1,
                tokenName: formData.tokenName,
                services: [...formData.services],
                assignedMembers: [...formData.assignedMembers],
                daySessionPairs: [...formData.daySessionPairs],
                maxTokensPerSession: parseInt(formData.maxTokensPerSession),
                bookingMinutesBefore: parseInt(formData.bookingMinutesBefore),
                status: 'active',
                dateCreated: new Date().toISOString().split('T')[0],
                tokensBooked: 0
            };

            setTokens(prev => [...prev, newToken]);
            setFormData({
                tokenName: '',
                services: [],
                assignedMembers: [],
                daySessionPairs: [],
                maxTokensPerSession: '',
                bookingMinutesBefore: ''
            });
        }
    };

    const toggleTokenStatus = (id) => {
        setTokens(prev => prev.map(token =>
            token.id === id
                ? { ...token, status: token.status === 'active' ? 'inactive' : 'active' }
                : token
        ));
    };

    const deleteToken = (id) => {
        setTokens(prev => prev.filter(token => token.id !== id));
    };

    return (
        <div className="min-h-screen bg-white md:ml-64 pt-14">
            <main className="container mx-auto px-4 md:px-8 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-black flex items-center">
                        <Ticket className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-800" />
                        Token Management
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Create and manage service tokens</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
                            <h3 className={`text-sm sm:text-lg font-bold ${stat.color}`}>{stat.value}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
                    {/* Add Token Form - Left Side */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                            <h3 className="text-base sm:text-lg font-semibold text-black flex items-center mb-4">
                                <Plus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-800" />
                                Create New Token
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Token Name
                                    </label>
                                    <input
                                        type="text"
                                        name="tokenName"
                                        value={formData.tokenName}
                                        onChange={handleInputChange}
                                        placeholder="Enter token name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Services ({formData.services.length} selected)
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                                        {availableServices.map((service) => (
                                            <label key={service} className="flex items-center space-x-2 mb-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.services.includes(service)}
                                                    onChange={() => handleServiceSelection(service)}
                                                    className="w-4 h-4 text-blue-800 border-gray-300 rounded focus:ring-blue-800"
                                                />
                                                <span className="text-sm text-gray-700">{service}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Assigned Members ({formData.assignedMembers.length} selected)
                                    </label>
                                    <div className="border border-gray-300 rounded-lg p-3 max-h-32 overflow-y-auto">
                                        {availableMembers.map((member) => (
                                            <label key={member} className="flex items-center space-x-2 mb-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.assignedMembers.includes(member)}
                                                    onChange={() => handleMemberSelection(member)}
                                                    className="w-4 h-4 text-blue-800 border-gray-300 rounded focus:ring-blue-800"
                                                />
                                                <span className="text-sm text-gray-700">{member}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Select Day & Session Combinations
                                    </label>
                                    <p className="text-xs text-gray-500 mb-3">
                                        Choose specific day-session combinations ({formData.daySessionPairs.length} selected)
                                    </p>

                                    <div className="border border-gray-300 rounded-lg p-3 max-h-64 overflow-y-auto">
                                        {daysOfWeek.map((day) => (
                                            <div key={day} className="mb-4 last:mb-0">
                                                <h4 className="text-sm font-medium text-gray-800 mb-2">{day}</h4>
                                                <div className="flex flex-wrap gap-2 ml-4">
                                                    {workingSchedule[day].map((session) => (
                                                        <button
                                                            key={`${day}-${session}`}
                                                            type="button"
                                                            onClick={() => handleDaySessionSelection(day, session)}
                                                            className={`px-3 py-1 rounded-md text-xs font-medium transition-colors ${isDaySessionSelected(day, session)
                                                                    ? 'bg-blue-800 text-white'
                                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                                                }`}
                                                        >
                                                            {session}
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-3">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Max Tokens/Session
                                        </label>
                                        <input
                                            type="number"
                                            name="maxTokensPerSession"
                                            value={formData.maxTokensPerSession}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 10"
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-sm"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Booking Minutes Before
                                        </label>
                                        <input
                                            type="number"
                                            name="bookingMinutesBefore"
                                            value={formData.bookingMinutesBefore}
                                            onChange={handleInputChange}
                                            placeholder="e.g., 30"
                                            min="1"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-sm"
                                        />
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center text-sm font-medium"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Create Token
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Tokens List - Right Side */}
                    <div className="xl:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                                <h3 className="text-base sm:text-lg font-semibold text-black flex items-center">
                                    <Ticket className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-800" />
                                    Active Tokens ({tokens.length})
                                </h3>
                            </div>

                            <div className="space-y-3">
                                {(showAllTokens ? tokens : tokens.slice(0, 4)).map((token) => (
                                    <div key={token.id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                                        <div className="flex flex-col sm:flex-row sm:items-start justify-between space-y-3 sm:space-y-0">
                                            <div className="flex-1">
                                                <div className="flex items-center space-x-2 mb-2">
                                                    <h4 className="font-semibold text-black text-sm sm:text-base">{token.tokenName}</h4>
                                                    {token.status === 'active' && (
                                                        <CheckCircle className="w-4 h-4 text-green-600" />
                                                    )}
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${token.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                                        {token.status}
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs sm:text-sm text-gray-600">
                                                    <div>
                                                        <div className="flex items-center mb-1">
                                                            <Settings className="w-3 h-3 mr-1" />
                                                            <span className="font-medium">Services:</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 ml-4">
                                                            {token.services.map((service, idx) => (
                                                                <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                                                                    {service}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div className="flex items-center mb-1">
                                                            <Users className="w-3 h-3 mr-1" />
                                                            <span className="font-medium">Members:</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 ml-4">
                                                            {token.assignedMembers.map((member, idx) => (
                                                                <span key={idx} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                                    {member}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <div className="flex items-center mb-1">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            <span className="font-medium">Day-Session Schedule:</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1 ml-4">
                                                            {token.daySessionPairs.map((pair, idx) => (
                                                                <span key={idx} className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full text-xs">
                                                                    {pair.day.slice(0, 3)} {pair.session}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <Calendar className="w-3 h-3 mr-1" />
                                                        <span className="font-medium">Booking:</span>
                                                        <span className="ml-1">{token.bookingMinutesBefore} min before</span>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <Ticket className="w-3 h-3 mr-1" />
                                                        <span className="font-medium">Capacity:</span>
                                                        <span className="ml-1">{token.tokensBooked}/{token.maxTokensPerSession}</span>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        <span className="font-medium">Created:</span>
                                                        <span className="ml-1">{token.dateCreated}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => toggleTokenStatus(token.id)}
                                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${token.status === 'active'
                                                            ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                            : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        }`}
                                                >
                                                    {token.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => deleteToken(token.id)}
                                                    className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                                                    title="Delete token"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {tokens.length > 4 && (
                                    <button
                                        onClick={() => setShowAllTokens(!showAllTokens)}
                                        className="w-full text-center py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center text-sm"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        {showAllTokens ? 'Show Less' : `Show All (${tokens.length})`}
                                    </button>
                                )}

                                {tokens.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <Ticket className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-sm">No tokens created yet</p>
                                        <p className="text-xs">Use the form on the left to create your first token</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}