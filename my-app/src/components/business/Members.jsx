import { useState } from 'react';
import {
    Users,
    Plus,
    Eye,
    EyeOff,
    UserPlus,
    Trash2,
    CheckCircle
} from 'lucide-react';
import axios from 'axios';
import { useEffect } from 'react';

export default function MemberManagement() {
    const [showPassword, setShowPassword] = useState(false);
    const [showAllMembers, setShowAllMembers] = useState(false);
    const [formData, setFormData] = useState({
        memberId: '',
        name: '',
        designation: '',
        password: ''
    });
    const [members, setMembers] = useState([])

    const stats = [
        { label: "Total Members", value: members.length.toString(), color: "text-blue-800" },
        { label: "Active Members", value: members.filter(m => m.status === 'active').length.toString(), color: "text-green-600" },
        { label: "Inactive Members", value: members.filter(m => m.status === 'inactive').length.toString(), color: "text-red-600" },
    ];

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    useEffect(() => {
        var token = localStorage.getItem("businessToken");
        axios.get("http://localhost:5000/business/members", {
            headers: {
                Authorization: `Bearer ${token}` // optional if protected
            }
        }).then((response)=>{
            setMembers(response.data.members)
        })
    }, [])

    const handleSubmit = () => {
        if (formData.memberId && formData.designation && formData.password && formData.name) {
            const newMember = {
                name: formData.name,
                memberId: formData.memberId,
                designation: formData.designation,
                password: formData.password,
                status: true, // Changed from true to "active" for consistency
            };
            setMembers(prev=>[...prev,newMember])
            var token = localStorage.getItem("businessToken");
            axios.post("http://localhost:5000/business/addmember", newMember, {
                headers: {
                    Authorization: `Bearer ${token}` // optional if protected
                }
            }).then(response => {
                // Use the response data to update the state
                const addedMember = {
                    ...response.data,
                    id: members.length + 1, // Fallback ID if not provided by API
                };
                setFormData({ memberId: '', name: '', designation: '', password: '' });
            }).catch(error => {
                console.error("Error adding member:", error.response?.data || error.message);
            });
        }
    };

    const toggleMemberStatus = (id) => {
        setMembers(prev => prev.map(member =>
            member.id === id
                ? { ...member, status: member.status === 'active' ? 'inactive' : 'active' }
                : member
        ));
    };

    const deleteMember = (id) => {
        setMembers(prev => prev.filter(member => member.id !== id));
    };

    return (
        <div className="min-h-screen bg-white md:ml-64 pt-14">
            <main className="container mx-auto px-4 md:px-8 py-6">
                {/* Header */}
                <div className="mb-6">
                    <h1 className="text-xl sm:text-2xl font-bold text-black flex items-center">
                        <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-3 text-blue-800" />
                        Member Management
                    </h1>
                    <p className="text-sm sm:text-base text-gray-600 mt-1">Add and manage team members</p>
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
                    {/* Add Member Form - Left Side */}
                    <div className="xl:col-span-1">
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                            <h3 className="text-base sm:text-lg font-semibold text-black flex items-center mb-4">
                                <UserPlus className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-800" />
                                Add New Member
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Member ID
                                    </label>
                                    <input
                                        type="text"
                                        name="memberId"
                                        value={formData.memberId}
                                        onChange={handleInputChange}
                                        placeholder="Enter member ID (e.g., EMP001)"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Name
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        placeholder="Enter name"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Designation
                                    </label>
                                    <input
                                        type="text"
                                        name="designation"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                        placeholder="Enter Designation"
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-sm"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            name="password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            placeholder="Enter password"
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-transparent text-sm pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={handleSubmit}
                                    className="w-full bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center justify-center text-sm font-medium"
                                >
                                    <Plus className="w-4 h-4 mr-2" />
                                    Add Member
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Members List - Right Side */}
                    <div className="xl:col-span-2">
                        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                                <h3 className="text-base sm:text-lg font-semibold text-black flex items-center">
                                    <Users className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-800" />
                                    Team Members ({members.length})
                                </h3>
                            </div>

                            <div className="space-y-2 sm:space-y-3">
                                {(showAllMembers ? members : members.slice(0, 4)).map((member) => (
                                    <div key={member.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors space-y-2 sm:space-y-0">
                                        <div className="flex items-center space-x-3 sm:space-x-4">
                                            <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs sm:text-sm ${member.status === 'active' ? 'bg-blue-800' : 'bg-gray-500'}`}>
                                                {member.name.charAt(0)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-2">
                                                    <h4 className="font-medium text-black text-sm sm:text-base">{member.name}</h4>
                                                    {member.status === 'active' && (
                                                        <CheckCircle className="w-3 h-3 text-green-600" />
                                                    )}
                                                </div>
                                                <p className="text-xs sm:text-sm text-gray-600">{member.designation} ({member.memberId})</p>
                                                <p className="text-xs text-gray-500">Added: {member.dateAdded}</p>
                                            </div>
                                        </div>

                                        <div className="flex items-center justify-between sm:justify-end space-x-2 sm:space-x-3">
                                            <span className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${member.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-700'}`}>
                                                {member.status}
                                            </span>

                                            <div className="flex space-x-1">
                                                <button
                                                    onClick={() => deleteMember(member.id)}
                                                    className="p-1.5 rounded-lg text-red-100 hover:bg-red-50 hover:text-red-600 transition-colors"
                                                    title="Delete member"
                                                >
                                                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))}

                                {members.length > 4 && (
                                    <button
                                        onClick={() => setShowAllMembers(!showAllMembers)}
                                        className="w-full text-center py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center text-sm"
                                    >
                                        <Eye className="w-4 h-4 mr-2" />
                                        {showAllMembers ? 'Show Less' : `Show All (${members.length})`}
                                    </button>
                                )}

                                {members.length === 0 && (
                                    <div className="text-center py-8 text-gray-500">
                                        <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                                        <p className="text-sm">No members added yet</p>
                                        <p className="text-xs">Use the form on the left to add your first member</p>
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