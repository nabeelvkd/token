import React, { useState, useEffect } from 'react';
import Navbar from '../../components/user/HomeNavbar';
import axios from 'axios';
import { useLocation, useNavigate } from 'react-router-dom';
import CardListing from '../../components/user/CardListing';
import ErrorState from '../../components/user/ErrorState';
import EmptyState from '../../components/user/EmptyState';
import ListingHeader from '../../components/user/ListingHeader';

function Listings() {
    const location = useLocation();
    const navigate = useNavigate();
    const [businesses, setBusinesses] = useState([]);
    const [filteredBusinesses, setFilteredBusinesses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categoryName, setCategoryName] = useState('');
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [selectedDistance, setSelectedDistance] = useState(null);
    const [sortBy, setSortBy] = useState('name'); // 'name', 'distance', 'rating'

    useEffect(() => {
        const fetchBusinesses = async () => {
            try {
                setLoading(true);
                setError(null);

                const parts = location.pathname.split('/').filter(Boolean);
                const slug = parts[parts.length - 1];

                const response = await axios.get(`http://localhost:5000/listing/${slug}`);

                setBusinesses(response.data.businesses || []);
                setFilteredBusinesses(response.data.businesses || []);
                setCategoryName(response.data.categoryName || slug.replace('-', ' ').toUpperCase());
            } catch (error) {
                setError(error.message || 'Failed to load businesses. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchBusinesses();
    }, [location]);

    // Calculate distance between two coordinates using Haversine formula
    const calculateDistance = (lat1, lon1, lat2, lon2) => {
        const R = 6371; // Radius of the Earth in kilometers
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLon = (lon2 - lon1) * Math.PI / 180;
        const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const d = R * c; // Distance in kilometers
        return d;
    };

    // Sort businesses
    const sortBusinesses = (businessesToSort) => {
        const sorted = [...businessesToSort];

        switch (sortBy) {
            case 'name':
                return sorted.sort((a, b) => a.name.localeCompare(b.name));
            case 'distance':
                if (selectedLocation) {
                    return sorted.sort((a, b) => {
                        const distanceA = a.location ? calculateDistance(
                            selectedLocation.lat, selectedLocation.lng,
                            a.location.latitude, a.location.longitude
                        ) : Infinity;
                        const distanceB = b.location ? calculateDistance(
                            selectedLocation.lat, selectedLocation.lng,
                            b.location.latitude, b.location.longitude
                        ) : Infinity;
                        return distanceA - distanceB;
                    });
                }
                return sorted;
            case 'rating':
                return sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
            default:
                return sorted;
        }
    };

    // Filter businesses based on search query, location, and distance
    const filterBusinesses = () => {
        let filtered = [...businesses];

        // Filter by search query
        if (searchQuery.trim()) {
            filtered = filtered.filter(business =>
                business.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                business.locality.toLowerCase().includes(searchQuery.toLowerCase()) ||
                business.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (business.description && business.description.toLowerCase().includes(searchQuery.toLowerCase()))
            );
        }

        // Filter by location and distance
        if (selectedLocation && selectedDistance) {
            filtered = filtered.filter(business => {
                if (business.location && business.location.latitude && business.location.longitude) {
                    const distance = calculateDistance(
                        selectedLocation.lat,
                        selectedLocation.lng,
                        business.location.latitude,
                        business.location.longitude
                    );
                    return distance <= selectedDistance;
                }
                return false;
            });
        }

        filtered = sortBusinesses(filtered);

        setFilteredBusinesses(filtered);
    };

    useEffect(() => {
        filterBusinesses();
    }, [searchQuery, selectedLocation, selectedDistance, businesses, sortBy]);

    const handleSelect = (business) => {
        navigate(`${business._id}`);
    };

    // Handle location change from ListingHeader
    const handleLocationChange = (location) => {
        setSelectedLocation(location);
    };

    // Modern Loading Skeleton with glassmorphism
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, index) => (
                <div key={index} className="group">
                    <div className="bg-white/70 backdrop-blur-sm rounded-2xl shadow-sm border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300 animate-pulse">
                        <div className="h-56 bg-gradient-to-br from-gray-100 to-gray-200"></div>
                        <div className="p-6">
                            <div className="h-5 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-3"></div>
                            <div className="h-4 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-2/3 mb-2"></div>
                            <div className="h-3 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg w-1/2"></div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
            {/* <Navbar /> */}

            <ListingHeader
                categoryName={categoryName}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                onLocationChange={handleLocationChange}
                selectedDistance={selectedDistance}
                setSelectedDistance={setSelectedDistance}
                sortBy={sortBy}
                setSortBy={setSortBy}
            />

            {/* Main Content */}
            <div className="container mx-auto px-4 py-10 z-1">
                {loading ? (
                    <LoadingSkeleton />
                ) : error ? (
                    <ErrorState error={error} />
                ) : filteredBusinesses.length > 0 ? (
                    <>
                        {/* Results Grid/List */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredBusinesses.map((business, index) => (
                                <div
                                    key={business._id}
                                    className="group transform transition-all duration-300"
                                    style={{ animationDelay: `${index * 100}ms` }}
                                >
                                    <div className="bg-white/80 rounded-2xl  border border-grey-200 overflow-hidden hover:border-blue-600 transition-all duration-300">
                                        <CardListing
                                            profile={{
                                                name: business.name,
                                                image: `https://res.cloudinary.com/delxsxtn6/image/upload/profile/${business._id}_profile.png`,
                                                location: `${business.locality}, ${business.city}`,
                                                rating: business.rating,
                                                distance: selectedLocation && business.location ?
                                                    calculateDistance(
                                                        selectedLocation.lat, selectedLocation.lng,
                                                        business.location.latitude, business.location.longitude
                                                    ).toFixed(1) + ' km' : null
                                            }}
                                            onSelect={() => handleSelect(business)}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Load More Button */}
                        {filteredBusinesses.length >= 9 && (
                            <div className="text-center mt-16">
                                <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 border-0 rounded-2xl text-gray-700 font-medium hover:shadow-lg transform hover:scale-105 transition-all duration-200">
                                    <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                    Load More Results
                                </button>
                            </div>
                        )}
                    </>
                ) : (
                    <EmptyState selectedLocation={selectedLocation} searchQuery={searchQuery} />
                )}
            </div>
        </div>
    );
}

export default Listings;