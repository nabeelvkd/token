import { useState } from 'react';
import {
    Phone,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    Shield,
    Clock,
    Building2,
    User,
    UserCog
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function BusinessLogin() {
    const [loginMethod, setLoginMethod] = useState('password'); // 'password' or 'otp'
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [otpSent, setOtpSent] = useState(false);
    const [countdown, setCountdown] = useState(0);
    const [isAdminLogin, setIsAdminLogin] = useState(false); // State for admin/member login

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        business: '',
        phoneNumber: '',
        password: '',
        otp: ''
    });

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const handleSendOtp = async () => {
        if (!formData.phoneNumber) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setOtpSent(true);
            setCountdown(30);
            setIsLoading(false);

            // Countdown timer
            const timer = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }, 1500);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const loginUrl = isAdminLogin
                ? "http://localhost:5000/business/login"
                : "http://localhost:5000/business/member/login";

            const response = await axios.post(loginUrl, formData);

            setIsLoading(false);

            const { token, message } = response.data;
            console.log("Login response:", response.data);

            if (token && isAdminLogin) {
                localStorage.setItem("businessToken", token);
                navigate('/business/home');
            } else if (token) {
                localStorage.setItem("MemberToken", token);
                navigate('/business/member');
            } else {
                alert(message || "Login failed.");
            }
        } catch (error) {
            setIsLoading(false);

            console.error("Login error:", error);

            const errorMessage = error.response?.data?.message || "Something went wrong during login.";
            alert(errorMessage);
        }
    };


    const formatPhoneNumber = (value) => {
        return value;
    };

    const handlePhoneChange = (e) => {
        const formatted = formatPhoneNumber(e.target.value);
        setFormData({
            ...formData,
            phoneNumber: formatted
        });
    };

    return (
        <div className="min-h-screen bg-white flex items-center justify-center px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-blue-800 rounded-full flex items-center justify-center mb-4">
                        <Building2 className="h-8 w-8 text-white" />
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-900">
                        Welcome Back
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Sign in to your business account
                    </p>
                </div>

                {/* Admin/Member Login Type Toggle */}
                <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                    <div className="grid grid-cols-2 gap-1">
                        <button
                            onClick={() => setIsAdminLogin(false)}
                            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${!isAdminLogin
                                ? 'bg-blue-800 text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <User className="w-4 h-4 inline mr-2" />
                            Member Login
                        </button>
                        <button
                            onClick={() => setIsAdminLogin(true)}
                            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${isAdminLogin
                                ? 'bg-blue-800 text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <UserCog className="w-4 h-4 inline mr-2" />
                            Admin Login
                        </button>
                    </div>
                </div>

                {/* Login Method Toggle */}
                <div className="bg-white rounded-lg p-1 shadow-sm border border-gray-200">
                    <div className="grid grid-cols-2 gap-1">
                        <button
                            onClick={() => {
                                setLoginMethod('password');
                                setOtpSent(false);
                                setCountdown(0);
                            }}
                            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${loginMethod === 'password'
                                ? 'bg-blue-800 text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Lock className="w-4 h-4 inline mr-2" />
                            Password
                        </button>
                        <button
                            onClick={() => {
                                setLoginMethod('otp');
                                setOtpSent(false);
                                setCountdown(0);
                            }}
                            className={`py-2 px-4 rounded-md text-sm font-medium transition-colors ${loginMethod === 'otp'
                                ? 'bg-blue-800 text-white'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Shield className="w-4 h-4 inline mr-2" />
                            OTP
                        </button>
                    </div>
                </div>

                {/* Login Form */}
                <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
                    <div className="space-y-6">
                        {/* Phone Number */}
                        <div className={`${isAdminLogin ? 'hidden' : ''}`}>
                            <label htmlFor="business" className="block text-sm font-medium text-gray-700 mb-2">
                                Business Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="business"
                                    name="business"
                                    type="tel"
                                    required
                                    value={formData.business}
                                    onChange={(e) => handleInputChange('business', e.target.value)}
                                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 focus:z-10"
                                    placeholder="123-456-7890"
                                    maxLength="12"
                                />
                            </div>
                        </div>
                        <div>
                            <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700 mb-2">
                                Phone Number
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Phone className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    id="phoneNumber"
                                    name="phoneNumber"
                                    type="tel"
                                    required
                                    value={formData.phoneNumber}
                                    onChange={handlePhoneChange}
                                    className="appearance-none relative block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 focus:z-10"
                                    placeholder="123-456-7890"
                                    maxLength="12"
                                />
                            </div>
                        </div>

                        {/* Password Login */}
                        {loginMethod === 'password' && (
                            <div>
                                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                                    Password
                                </label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Lock className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        required
                                        value={formData.password}
                                        onChange={(e) => handleInputChange('password', e.target.value)}
                                        className="appearance-none relative block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 focus:z-10"
                                        placeholder="Enter your password"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        )}

                        {/* OTP Login */}
                        {loginMethod === 'otp' && (
                            <div className="space-y-4">
                                {!otpSent ? (
                                    <button
                                        type="button"
                                        onClick={handleSendOtp}
                                        disabled={!formData.phoneNumber || isLoading}
                                        className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                Sending OTP...
                                            </>
                                        ) : (
                                            <>
                                                <Shield className="w-4 h-4 mr-2" />
                                                Send OTP
                                            </>
                                        )}
                                    </button>
                                ) : (
                                    <div>
                                        <div className="flex items-center justify-between mb-2">
                                            <label htmlFor="otp" className="block text-sm font-medium text-gray-700">
                                                Enter OTP
                                            </label>
                                            {countdown > 0 && (
                                                <div className="flex items-center text-sm text-gray-500">
                                                    <Clock className="w-4 h-4 mr-1" />
                                                    {countdown}s
                                                </div>
                                            )}
                                        </div>
                                        <input
                                            id="otp"
                                            name="otp"
                                            type="text"
                                            required
                                            value={formData.otp}
                                            onChange={handleInputChange}
                                            className="appearance-none relative block w-full px-3 py-3 border border-gray-300 rounded-lg placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-800 focus:border-blue-800 text-center text-lg tracking-widest"
                                            placeholder="Enter 6-digit OTP"
                                            maxLength="6"
                                        />
                                        {countdown === 0 && (
                                            <button
                                                type="button"
                                                onClick={handleSendOtp}
                                                disabled={isLoading}
                                                className="mt-2 w-full text-center text-sm text-blue-800 hover:text-blue-900 font-medium"
                                            >
                                                Resend OTP
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Submit Button */}
                        {(loginMethod === 'password' || (loginMethod === 'otp' && otpSent)) && (
                            <button
                                onClick={handleSubmit}
                                disabled={isLoading}
                                className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-800 hover:bg-blue-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                {isLoading ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign in
                                        <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                    </>
                                )}
                            </button>
                        )}

                        {/* Forgot Password */}
                        {loginMethod === 'password' && (
                            <div className="text-center">
                                <button
                                    onClick={() => console.log('Forgot password clicked')}
                                    className="text-sm text-blue-800 hover:text-blue-900 font-medium"
                                >
                                    Forgot your password?
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Register Business Link */}
                <div className={`${!isAdminLogin ? 'hidden' : ''} bg-white rounded-lg shadow-sm p-4 border border-gray-200 text-center`}>
                    <p className="text-sm text-gray-600 mb-3">
                        Don't have a business account?
                    </p>
                    <button
                        className="w-full bg-gray-700 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors flex items-center justify-center"
                        onClick={() => navigate('/business/register')}
                    >
                        <Building2 className="w-4 h-4 mr-2" />
                        Register Your Business
                    </button>
                </div>

                {/* Footer */}
                <div className="text-center text-xs text-gray-500">
                    <p>© 2025 Business Dashboard. All rights reserved.</p>
                    <div className="mt-1 space-x-4">
                        <button className="hover:text-gray-700">Privacy Policy</button>
                        <button className="hover:text-gray-700">Terms of Service</button>
                    </div>
                </div>
            </div>
        </div>
    );
}