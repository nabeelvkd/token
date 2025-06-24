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
        maxTokensPerSession: '',
        bookingMinutesBefore: ''
    });

    const [tokens, setTokens] = useState([]);
    const [availableServices, setServices] = useState([]);
    const [availableMembers, setMembers] = useState([]);
    const [workingSchedule, setWorking] = useState({
        'Monday': [],
        'Tuesday': [],
        'Wednesday': [],
        'Thursday': [],
        'Friday': [],
        'Saturday': [],
        'Sunday': []
    });

    useEffect(() => {
        const token = localStorage.getItem("businessToken");

        // Fetch services
        axios.get("http://localhost:5000/business/services", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                const serviceNames = response.data.services.map(service => service.name);
                setServices(serviceNames);
            })
            .catch(error => {
                console.error("Error fetching services:", error.response?.data || error.message);
            });

        // Fetch members
        axios.get("http://localhost:5000/business/members", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setMembers(response.data.members);
            })
            .catch(error => {
                console.error("Error fetching members:", error.response?.data || error.message);
            });

        // Fetch tokens (single call)
        axios.get("http://localhost:5000/business/tokens", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {
                setTokens(response.data); // Correctly set tokens from response.data
            })
            .catch(error => {
                console.error("Error fetching tokens:", error.response?.data || error.message);
            });
    }, []);

    const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const stats = [
        { label: "Total Tokens", value: tokens.length, color: "text-blue-800" },
        { label: "Active Tokens", value: tokens.filter(t => t.status === 'active').length, color: "text-green-600" },
        { label: "Total Bookings", value: tokens.reduce((sum, t) => sum + t.tokensBooked, 0), color: "text-purple-600" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
        ...prev,
        [name]: value
        }));
    };

    const handleServiceSelection = (service) => {
        setFormData(prev => {
            const isSelected = prev.services.includes(service);
            const updatedServices = isSelected
                ? prev.services.filter(s => s !== service)
                : [...prev.services, service];
            console.log("Updated Services in FormData:", updatedServices);
            return {
                ...prev,
                services: updatedServices
            };
        });
    };

    const handleMemberSelection = (member) => {
        setFormData(prev => {
            const updatedMembers = prev.assignedMembers.some(m => m._id === member._id)
                ? prev.assignedMembers.filter(m => m._id !== member._id)
                : [...prev.assignedMembers, { _id: member._id, name: member.name }];
            console.log("Updated Members in FormData:", updatedMembers);
            return {
                ...prev,
                assignedMembers: updatedMembers
            };
        });
    };



    const handleSubmit = () => {
        if (formData.tokenName && formData.services.length > 0 && formData.assignedMembers.length > 0 &&
             formData.maxTokensPerSession && formData.bookingMinutesBefore) {

            const newToken = {
                tokenName: formData.tokenName,
                services: formData.services,
                assignedMembers: formData.assignedMembers,
                maxTokensPerSession: parseInt(formData.maxTokensPerSession),
                bookingMinutesBefore: parseInt(formData.bookingMinutesBefore),
                status: false,
                dateCreated: new Date().toISOString().split('T')[0],
                tokensBooked: 0
            };

            const tokenAuth = localStorage.getItem("businessToken");

            axios.post("http://localhost:5000/business/addtoken", newToken, {
                headers: {
                    Authorization: `Bearer ${tokenAuth}`
                }
            })
                .then(response => {
                    const addedToken = {
                        ...newToken,
                        _id: response.data._id,
                    };
                    setTokens(prev => [...prev, addedToken]);
                    setFormData({
                        tokenName: '',
                        services: [],
                        assignedMembers: [],
                        maxTokensPerSession: '',
                        bookingMinutesBefore: ''
                    });
                })
                .catch(error => {
                    console.error("Error creating token:", error.response?.data || error.message);
                });
        } else {
            alert("Please fill in all required fields");
        }
    };

    const toggleTokenStatus = (_id) => {
        setTokens(prev => {
            const updatedTokens = prev.map(token =>
                token._id === _id
                    ? { ...token, status: token.status === 'active' ? 'inactive' : 'active' }
                    : token
            );
            return updatedTokens;
        });

        const token = tokens.find(t => t._id === _id);
        const updatedStatus = token.status === 'active' ? 'inactive' : 'active';
        axios.put(`http://localhost:5000/business/tokens/${_id}`, { status: updatedStatus }, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("businessToken")}`
            }
        })
            .catch(error => {
                console.error("Error updating token status:", error.response?.data || error.message);
            });
    };

    const deleteToken = (_id) => {
        setTokens(prev => prev.filter(token => token._id !== _id));

        axios.delete(`http://localhost:5000/business/tokens/${_id}`, {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("businessToken")}`
            }
        })
            .catch(error => {
                console.error("Error deleting token:", error.response?.data || error.message);
            });
    };

    return (
        <div className="min-h-screen bg-white md:ml-64 pt-14">
            <main className="container mx-auto px-4 md:px-8 py-6">
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-black flex items-center">
                        <Ticket className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-800" />
                        Token Management
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Create and manage service tokens</p>
                </div>

                <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-6">
                    {stats.map((stat, index) => (
                        <div key={index} className="bg-white rounded-lg shadow-sm p-3 sm:p-4 border border-gray-200">
                            <h3 className={`text-sm sm:text-lg font-bold ${stat.color}`}>{stat.value}</h3>
                            <p className="text-xs sm:text-sm text-gray-600">{stat.label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
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
                                            <label key={member._id} className="flex items-center space-x-2 mb-2 cursor-pointer">
                                                <input
                                                    type="checkbox"
                                                    checked={formData.assignedMembers.some(m => m._id === member._id)}
                                                    onChange={() => handleMemberSelection(member)}
                                                    className="w-4 h-4 text-blue-800 border-gray-300 rounded focus:ring-blue-800"
                                                />
                                                <span className="text-sm text-gray-700">{member.name}</span>
                                            </label>
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
                                    <div key={token._id} className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
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
                                                                <span key={member._id} className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs">
                                                                    {member.name}
                                                                </span>
                                                            ))}
                                                        </div>
                                                    </div>

                                                    <div className="md:col-span-2">
                                                        <div className="flex items-center mb-1">
                                                            <Calendar className="w-3 h-3 mr-1" />
                                                            <span className="font-medium">Day-Session Schedule:</span>
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
                                                    onClick={() => toggleTokenStatus(token._id)}
                                                    className={`px-3 py-1 rounded-lg text-xs font-medium transition-colors ${token.status === 'active'
                                                        ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200'
                                                        : 'bg-green-100 text-green-800 hover:bg-green-200'
                                                        }`}
                                                >
                                                    {token.status === 'active' ? 'Deactivate' : 'Activate'}
                                                </button>
                                                <button
                                                    onClick={() => deleteToken(token._id)}
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