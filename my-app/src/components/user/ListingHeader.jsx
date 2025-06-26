import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, Search, MapPin, X, Navigation, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function ListingHeader({
    categoryName,
    searchQuery,
    setSearchQuery,
    selectedLocation,
    setSelectedLocation,
    onLocationChange,
    selectedDistance,
    setSelectedDistance,
    sortBy,
    setSortBy
}) {
    const navigate = useNavigate();
    const [locationQuery, setLocationQuery] = useState('');
    const [locationSuggestions, setLocationSuggestions] = useState([]);
    const [showLocationSuggestions, setShowLocationSuggestions] = useState(false);
    const [isGettingLocation, setIsGettingLocation] = useState(false);
    const suggestionsRef = useRef(null);

    const GEOAPIFY_API_KEY = 'e9b286ae30d24252abd8e78a4913452e';

    // Initialize location query when selectedLocation changes
    useEffect(() => {
        if (selectedLocation) {
            setLocationQuery(selectedLocation.display_name || '');
        }
    }, [selectedLocation]);

    const fetchLocationSuggestions = async (query) => {
        if (query.length < 3) {
            setLocationSuggestions([]);
            return;
        }

        try {
            const response = await axios.get(`https://api.geoapify.com/v1/geocode/autocomplete`, {
                params: {
                    text: query,
                    apiKey: GEOAPIFY_API_KEY,
                    limit: 5,
                    filter: 'countrycode:in',
                    format: 'json'
                }
            });

            const suggestions = response.data.results.map(item => ({
                id: item.place_id,
                display_name: item.formatted,
                lat: item.lat,
                lng: item.lon,
                city: item.city,
                state: item.state,
                type: 'search'
            }));

            setLocationSuggestions(suggestions);
        } catch (error) {
            console.error('Error fetching location suggestions:', error);
            setLocationSuggestions([]);
        }
    };

    const getCurrentLocation = () => {
        setIsGettingLocation(true);

        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            setIsGettingLocation(false);
            return;
        }

        navigator.geolocation.getCurrentPosition(
            async (position) => {
                try {
                    const { latitude, longitude } = position.coords;

                    // Reverse geocode to get address
                    const response = await axios.get(`https://api.geoapify.com/v1/geocode/reverse`, {
                        params: {
                            lat: latitude,
                            lon: longitude,
                            apiKey: GEOAPIFY_API_KEY,
                            format: 'json'
                        }
                    });

                    if (response.data.results && response.data.results.length > 0) {
                        const result = response.data.results[0];
                        const currentLocationData = {
                            id: 'current_location',
                            display_name: result.formatted || `${result.city}, ${result.state}`,
                            lat: latitude,
                            lng: longitude,
                            city: result.city,
                            state: result.state,
                            type: 'current'
                        };

                        setSelectedLocation(currentLocationData);
                        setLocationQuery(currentLocationData.display_name);
                        setShowLocationSuggestions(false);

                        if (onLocationChange) {
                            onLocationChange(currentLocationData);
                        }
                    }
                } catch (error) {
                    console.error('Error getting address:', error);
                    alert('Could not get your address. Please try again.');
                } finally {
                    setIsGettingLocation(false);
                }
            },
            (error) => {
                console.error('Error getting location:', error);
                let message = 'Could not get your location. ';
                switch (error.code) {
                    case error.PERMISSION_DENIED:
                        message += 'Please allow location access and try again.';
                        break;
                    case error.POSITION_UNAVAILABLE:
                        message += 'Location information is unavailable.';
                        break;
                    case error.TIMEOUT:
                        message += 'Location request timed out.';
                        break;
                    default:
                        message += 'Please try again.';
                        break;
                }
                alert(message);
                setIsGettingLocation(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 300000 // 5 minutes
            }
        );
    };

    const handleLocationInputChange = (e) => {
        const value = e.target.value;
        setLocationQuery(value);
        setShowLocationSuggestions(true);

        if (value.trim()) {
            fetchLocationSuggestions(value);
        } else {
            setLocationSuggestions([]);
        }
    };

    const handleLocationSelect = (suggestion) => {
        setSelectedLocation(suggestion);
        setLocationQuery(suggestion.display_name);
        setShowLocationSuggestions(false);
        setLocationSuggestions([]);

        if (onLocationChange) {
            onLocationChange(suggestion);
        }
    };

    const clearLocation = () => {
        setSelectedLocation(null);
        setLocationQuery('');
        setLocationSuggestions([]);
        setShowLocationSuggestions(false);
        setSelectedDistance(null);

        if (onLocationChange) {
            onLocationChange(null);
        }
    };

    const handleLocationFocus = () => {
        if (locationQuery && locationSuggestions.length > 0) {
            setShowLocationSuggestions(true);
        }
    };

    const handleLocationBlur = () => {
        // Delay hiding suggestions to allow clicking on them
        setTimeout(() => {
            setShowLocationSuggestions(false);
        }, 300);
    };

    // Handle clicks outside suggestions to close dropdown
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
                setShowLocationSuggestions(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="bg-blue-800 backdrop-blur-md border-b border-white/20 shadow-sm z-100">
            <div className="container mx-auto px-4 py-8">
                <div className="max-w-5xl">
                    {/* Header with Back Button */}
                    <div className='flex items-center mb-6'>
                        <button
                            className='w-12 h-12 bg-white/80 backdrop-blur-sm p-3 rounded-2xl mr-6 hover:bg-white/90 hover:shadow-lg transform hover:scale-105 transition-all duration-200 border border-white/20 group'
                            onClick={() => navigate('/view')}
                        >
                            <ChevronLeft className="w-6 h-6 text-blue-800 group-hover:text-blue-600 transition-colors" />
                        </button>
                        <div>
                            <h1 className="text-4xl font-bold text-white">{categoryName}</h1>
                            <p className="text-white/80 mt-2">Discover the best businesses in your area</p>
                        </div>
                    </div>

                    {/* Search and Location Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {/* Search Bar */}
                        <div className="relative group">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                <Search className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                            </div>
                            <input
                                type="text"
                                className="block w-full pl-12 pr-4 py-4 border-0 rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:bg-white transition-all duration-200 text-lg"
                                placeholder="Search businesses, services..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>

                        {/* Location Input */}
                        <div className="relative">
                            <div className="flex rounded-2xl bg-white/90 backdrop-blur-sm shadow-lg overflow-hidden">
                                <div className="relative flex-1">
                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                        <MapPin className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="text"
                                        className="block w-full pl-12 pr-4 py-4 border-0 bg-transparent placeholder-gray-500 focus:outline-none text-lg"
                                        placeholder="Enter location..."
                                        value={locationQuery}
                                        onChange={handleLocationInputChange}
                                        onFocus={handleLocationFocus}
                                        onBlur={handleLocationBlur}
                                    />
                                    {selectedLocation && (
                                        <button
                                            onClick={clearLocation}
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-red-500 transition-colors"
                                        >
                                            <X className="h-4 w-4" />
                                        </button>
                                    )}
                                </div>

                                {/* Current Location Button */}
                                <button
                                    onClick={getCurrentLocation}
                                    disabled={isGettingLocation}
                                    className="px-4 bg-blue-800 hover:bg-blue-700 disabled:bg-blue-400 text-white transition-colors duration-200 flex items-center justify-center min-w-[60px]"
                                    title="Use current location"
                                >
                                    {isGettingLocation ? (
                                        <Loader className="h-5 w-5 animate-spin" />
                                    ) : (
                                        <Navigation className="h-5 w-5" />
                                    )}
                                </button>
                            </div>

                            {/* Location Suggestions */}
                            {showLocationSuggestions && locationSuggestions.length > 0 && (
                                <div
                                    ref={suggestionsRef}
                                    className="absolute z-50 top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-md border border-white/20 rounded-xl shadow-2xl max-h-64 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent"
                                >
                                    {locationSuggestions.map((suggestion) => (
                                        <button
                                            key={suggestion.id}
                                            className="w-full text-left px-4 py-3 hover:bg-blue-50 focus:bg-blue-50 focus:outline-none border-b border-gray-100/50 last:border-b-0 transition-colors duration-150"
                                            onClick={() => handleLocationSelect(suggestion)}
                                        >
                                            <div className="flex items-center">
                                                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                                                    <MapPin className="h-4 w-4 text-blue-600" />
                                                </div>
                                                <div>
                                                    <span className="text-sm font-medium text-gray-900 block">
                                                        {suggestion.city || suggestion.display_name.split(',')[0]}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {suggestion.state}
                                                    </span>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                            )}
                        </div>
                    </div>

                    {/* Filters Section */}
                    <div className="mt-4 flex flex-wrap gap-4 items-center">
                        {/* Distance Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white/90 backdrop-blur-sm rounded-xl py-3 px-4 pr-8 text-gray-700 text-sm shadow-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
                                value={selectedDistance || ''}
                                onChange={(e) => setSelectedDistance(e.target.value ? Number(e.target.value) : null)}
                                disabled={!selectedLocation}
                            >
                                <option value="">All Distances</option>
                                <option value="5">Within 5 km</option>
                                <option value="10">Within 10 km</option>
                                <option value="25">Within 25 km</option>
                                <option value="50">Within 50 km</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>

                        {/* Sort By Filter */}
                        <div className="relative">
                            <select
                                className="appearance-none bg-white/90 backdrop-blur-sm rounded-xl py-3 px-4 pr-8 text-gray-700 text-sm shadow-lg border border-white/20 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all duration-200"
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                            >
                                <option value="name">Sort by Name</option>
                                <option value="distance" disabled={!selectedLocation}>Sort by Distance</option>
                                <option value="rating">Sort by Rating</option>
                            </select>
                            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                <svg className="h-4 w-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Selected Location Display */}
                    {selectedLocation && (
                        <div className="mt-4 flex items-center justify-between bg-white/20 backdrop-blur-sm rounded-xl px-4 py-3">
                            <div className="flex items-center text-white">
                                <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                                    {selectedLocation.type === 'current' ? (
                                        <Navigation className="h-4 w-4 text-white" />
                                    ) : (
                                        <MapPin className="h-4 w-4 text-white" />
                                    )}
                                </div>
                                <div>
                                    <span className="text-sm font-medium">
                                        {selectedLocation.type === 'current' ? 'Current Location: ' : 'Selected Location: '}
                                    </span>
                                    <span className="text-sm opacity-90">
                                        {selectedLocation.display_name}
                                    </span>
                                </div>
                            </div>
                            <button
                                onClick={clearLocation}
                                className="text-white/70 hover:text-white transition-colors"
                            >
                                <X className="h-5 w-5" />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ListingHeader;