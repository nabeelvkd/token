import { useState, useRef } from 'react';
import axios from 'axios';
import {
    User,
    Phone,
    MapPin,
    Camera,
    Upload,
    X,
    Save,
    Eye,
    EyeOff,
    Building2,
    Mail,
    Globe,
    Plus,
    Trash2,
    Lock,
    ImageIcon,
} from 'lucide-react';
import { jwtDecode } from 'jwt-decode';

export default function EditProfile() {
    const [formData, setFormData] = useState({
        name: "Tony & Guy",
        phone: "9496085317",
        email: "",
        address: "Near SBI, Koyilandi Road, Omassery",
        description: "",
        website: "",
        location: {
            latitude: 9.9592,
            longitude: 76.3243,
        },
    });

    const jwtToken=localStorage.getItem('businessToken')
    const decoded=jwtDecode(jwtToken)

    const [passwordData, setPasswordData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const [profilePicture, setProfilePicture] = useState(`https://res.cloudinary.com/delxsxtn6/image/upload/profile/${decoded.id}_profile.jpg`);
    const [galleryImages, setGalleryImages] = useState([]);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoadingProfile, setIsLoadingProfile] = useState(false);
    const [isLoadingImages, setIsLoadingImages] = useState(false);
    const [isLoadingPassword, setIsLoadingPassword] = useState(false);
    const [error, setError] = useState(null);

    const profilePictureRef = useRef(null);
    const galleryRef = useRef(null);
    const profilePictureFileRef = useRef(null);
    const galleryFilesRef = useRef([]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleProfilePictureUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            profilePictureFileRef.current = file;
            const reader = new FileReader();
            reader.onload = (e) => {
                setProfilePicture(e.target.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleGalleryUpload = (e) => {
        const files = Array.from(e.target.files);
        galleryFilesRef.current = [...galleryFilesRef.current, ...files];
        files.forEach(file => {
            const reader = new FileReader();
            reader.onload = (e) => {
                setGalleryImages(prev => [...prev, {
                    id: Date.now() + Math.random(),
                    url: e.target.result,
                    name: file.name
                }]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeGalleryImage = (id) => {
        setGalleryImages(prev => prev.filter(img => img.id !== id));
        galleryFilesRef.current = galleryFilesRef.current.filter((_, index) =>
            galleryImages[index]?.id !== id
        );
    };

    const handleSaveProfilePicture = async () => {
        if (!profilePictureFileRef.current) {
            setError('No profile picture selected');
            return;
        }
        setIsLoadingImages(true);
        setError(null);
        try {
            const uploadFormData = new FormData();
            uploadFormData.append('image', profilePictureFileRef.current);
            const res = await axios.post('http://localhost:5000/business/uploadprofile', uploadFormData, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`,
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.status === 200) {
                alert('Profile picture updated successfully!');
                profilePictureFileRef.current = null;
            }
        } catch (error) {
            console.error('Profile picture upload error:', error);
            setError('Failed to upload profile picture. Please try again.');
        } finally {
            setIsLoadingImages(false);
        }
    };

    const handleSaveGalleryImages = async () => {
        if (galleryFilesRef.current.length === 0) {
            setError('No gallery images selected');
            return;
        }
        setIsLoadingImages(true);
        setError(null);
        try {
            const uploadFormData = new FormData();
            galleryFilesRef.current.forEach(file => {
                uploadFormData.append('images', file);
            });
            const res = await axios.post('http://localhost:5000/business/uploadgallery', uploadFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            if (res.status === 200) {
                alert('Gallery images updated successfully!');
                galleryFilesRef.current = [];
                setGalleryImages([]);
            }
        } catch (error) {
            console.error('Gallery images upload error:', error);
            setError('Failed to upload gallery images. Please try again.');
        } finally {
            setIsLoadingImages(false);
        }
    };

    const handleSaveProfile = async () => {
        setIsLoadingProfile(true);
        setError(null);
        try {
            await axios.post('http://localhost:5000/business/updateprofile', formData);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Profile update error:', error);
            setError('Failed to update profile. Please try again.');
        } finally {
            setIsLoadingProfile(false);
        }
    };

    const handleChangePassword = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match!');
            return;
        }
        setIsLoadingPassword(true);
        setError(null);
        try {
            await new Promise(resolve => setTimeout(resolve, 2000));
            setPasswordData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            alert('Password changed successfully!');
        } catch (error) {
            console.error('Password change error:', error);
            setError('Failed to change password. Please try again.');
        } finally {
            setIsLoadingPassword(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 md:ml-64 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto space-y-6">
                {/* Header */}
                <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                    <div className="px-6 py-8">
                        <h1 className="text-3xl font-bold text-blue-800 flex items-center">
                            <Building2 className="w-8 h-8 mr-3" />
                            Business Profile
                        </h1>
                        <p className="mt-2 text-gray-600">Manage your business information and settings</p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Photos & Media */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center mb-6">
                            <Camera className="w-6 h-6 text-blue-800 mr-3" />
                            <h2 className="text-xl font-bold text-gray-900">Photos & Media</h2>
                        </div>

                        {/* Profile Picture */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Profile Picture</h3>
                            <div className="flex items-start space-x-6">
                                <div className="relative flex-shrink-0">
                                    <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl flex items-center justify-center overflow-hidden border-2 border-white shadow-md">
                                        {profilePicture ? (
                                            <img
                                                src={profilePicture}
                                                alt="Profile"
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <Camera className="w-10 h-10 text-blue-400" />
                                        )}
                                    </div>
                                    {profilePicture && (
                                        <button
                                            onClick={() => {
                                                setProfilePicture(null);
                                                profilePictureFileRef.current = null;
                                            }}
                                            className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
                                        >
                                            <X className="w-3 h-3" />
                                        </button>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <input
                                        type="file"
                                        ref={profilePictureRef}
                                        onChange={handleProfilePictureUpload}
                                        accept="image/*"
                                        className="hidden"
                                    />
                                    <div className="flex items-center space-x-4">
                                        <button
                                            onClick={() => profilePictureRef.current?.click()}
                                            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center space-x-2 text-sm"
                                        >
                                            <Upload className="w-4 h-4" />
                                            <span>Upload Picture</span>
                                        </button>
                                        <button
                                            onClick={handleSaveProfilePicture}
                                            disabled={isLoadingImages || !profilePictureFileRef.current}
                                            className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                                        >
                                            {isLoadingImages ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                                    <span>Saving...</span>
                                                </>
                                            ) : (
                                                <>
                                                    <Save className="w-4 h-4" />
                                                    <span>Save Picture</span>
                                                </>
                                            )}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-2">
                                        JPG, PNG or GIF (max 5MB)<br />
                                        Recommended: 400x400px
                                    </p>
                                    {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Gallery */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                <ImageIcon className="w-5 h-5 mr-2" />
                                Gallery Images
                            </h3>
                            <div className="grid grid-cols-3 gap-3 mb-6">
                                {galleryImages.map((image) => (
                                    <div key={image.id} className="relative group">
                                        <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                                            <img
                                                src={image.url}
                                                alt={image.name}
                                                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                            />
                                        </div>
                                        <button
                                            onClick={() => removeGalleryImage(image.id)}
                                            className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-red-600 shadow-sm"
                                        >
                                            <Trash2 className="w-3 h-3" />
                                        </button>
                                    </div>
                                ))}
                                <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 cursor-pointer group">
                                    <input
                                        type="file"
                                        ref={galleryRef}
                                        onChange={handleGalleryUpload}
                                        accept="image/*"
                                        multiple
                                        className="hidden"
                                    />
                                    <button
                                        onClick={() => galleryRef.current?.click()}
                                        className="flex flex-col items-center space-y-1 text-gray-500 group-hover:text-blue-500 transition-colors"
                                    >
                                        <Plus className="w-6 h-6" />
                                        <span className="text-xs font-medium">Add</span>
                                    </button>
                                </div>
                            </div>
                            <button
                                onClick={handleSaveGalleryImages}
                                disabled={isLoadingImages || galleryFilesRef.current.length === 0}
                                className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoadingImages ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Gallery</span>
                                    </>
                                )}
                            </button>
                            <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mt-4">
                                💡 <strong>Tip:</strong> Upload high-quality images that showcase your business, services, or work samples.
                            </p>
                        </div>
                    </div>

                    {/* Basic Information */}
                    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm p-6">
                        <div className="flex items-center mb-6">
                            <User className="w-6 h-6 text-blue-800 mr-3" />
                            <h2 className="text-xl font-bold text-gray-900">Basic Information</h2>
                        </div>

                        <div className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Business Name *
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Mail className="w-4 h-4 inline mr-1" />
                                        Email Address
                                    </label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="your-email@example.com"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Phone className="w-4 h-4 inline mr-1" />
                                        Phone Number *
                                    </label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        <Globe className="w-4 h-4 inline mr-1" />
                                        Website
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                        placeholder="https://your-website.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    Business Description
                                </label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleInputChange}
                                    rows="4"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="Tell customers about your business, services, and what makes you special..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">
                                    <MapPin className="w-4 h-4 inline mr-1" />
                                    Business Address *
                                </label>
                                <textarea
                                    name="address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    rows="3"
                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="location.latitude"
                                        value={formData.location.latitude}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        step="any"
                                        name="location.longitude"
                                        value={formData.location.longitude}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end mt-6">
                            <button
                                onClick={handleSaveProfile}
                                disabled={isLoadingProfile}
                                className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoadingProfile ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                        <span>Saving...</span>
                                    </>
                                ) : (
                                    <>
                                        <Save className="w-4 h-4" />
                                        <span>Save Profile</span>
                                    </>
                                )}
                            </button>
                        </div>
                        {error && <p className="text-xs text-red-500 mt-2 text-right">{error}</p>}
                    </div>
                </div>

                {/* Change Password */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                    <div className="flex items-center mb-6">
                        <Lock className="w-6 h-6 text-blue-800 mr-3" />
                        <h2 className="text-xl font-bold text-gray-900">Change Password</h2>
                    </div>

                    <div className="max-w-md space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Current Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showCurrentPassword ? "text" : "password"}
                                    name="currentPassword"
                                    value={passwordData.currentPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="Enter current password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                                >
                                    {showCurrentPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showNewPassword ? "text" : "password"}
                                    name="newPassword"
                                    value={passwordData.newPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="Enter new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowNewPassword(!showNewPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                                >
                                    {showNewPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Confirm New Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    name="confirmPassword"
                                    value={passwordData.confirmPassword}
                                    onChange={handlePasswordChange}
                                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                                    placeholder="Confirm new password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center hover:text-blue-600 transition-colors"
                                >
                                    {showConfirmPassword ? <EyeOff className="w-4 h-4 text-gray-400" /> : <Eye className="w-4 h-4 text-gray-400" />}
                                </button>
                            </div>
                        </div>

                        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 text-sm text-yellow-800">
                            <strong>Password Requirements:</strong>
                            <ul className="list-disc pl-4 mt-1 space-y-1">
                                <li>At least 8 characters long</li>
                                <li>Include uppercase and lowercase letters</li>
                                <li>Include at least one number or special character</li>
                            </ul>
                        </div>
                        {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                    </div>

                    <div className="flex justify-end mt-6">
                        <button
                            onClick={handleChangePassword}
                            disabled={isLoadingPassword || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
                            className="bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition-colors flex items-center space-x-2 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoadingPassword ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                                    <span>Updating...</span>
                                </>
                            ) : (
                                <>
                                    <Lock className="w-4 h-4" />
                                    <span>Update Password</span>
                                </>
                            )}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}