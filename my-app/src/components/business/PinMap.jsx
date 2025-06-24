import React, { useEffect, useRef, useState } from 'react';
import { MapPin, Navigation, Search, X } from 'lucide-react';

export default function MapView({ latitude = 11.2535, longitude = 75.7819, setFormData }) {
    const [position, setPosition] = useState({ lat: latitude, lng: longitude });
    const [locationName, setLocationName] = useState('Loading...');
    const [searchQuery, setSearchQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [isSearching, setIsSearching] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const mapRef = useRef(null);
    const mapInstance = useRef(null);
    const searchTimeoutRef = useRef(null);

    // Update formData whenever position changes
    useEffect(() => {
        if (setFormData) {
            setFormData((prev) => ({
                ...prev,
                location: `${position.lat},${position.lng}`
            }));
        }
    }, [position, setFormData]);

    // Load Leaflet CSS and JS
    useEffect(() => {
        // Add Leaflet CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.css';
        document.head.appendChild(link);

        // Load Leaflet JS
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/leaflet.js';
        script.onload = initializeMap;
        document.head.appendChild(script);

        return () => {
            // Cleanup
            document.head.removeChild(link);
            document.head.removeChild(script);
            if (mapInstance.current) {
                mapInstance.current.remove();
            }
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, []);

    // Auto search effect with debouncing
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        if (searchQuery.trim()) {
            searchTimeoutRef.current = setTimeout(() => {
                searchLocation(searchQuery);
            }, 500); // 500ms delay
        } else {
            setSearchResults([]);
            setShowResults(false);
        }

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    const initializeMap = () => {
        if (mapRef.current && window.L) {
            // Initialize the map
            mapInstance.current = window.L.map(mapRef.current).setView([position.lat, position.lng], 13);

            // Add tile layer
            window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
            }).addTo(mapInstance.current);

            // Listen for map movements
            mapInstance.current.on('moveend', () => {
                const center = mapInstance.current.getCenter();
                const coords = { lat: center.lat, lng: center.lng };
                setPosition(coords);
                fetchLocationName(coords);
            });

            // Initial location fetch
            fetchLocationName(position);
        }
    };

    // Search for locations
    const searchLocation = async (query) => {
        if (!query.trim()) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        setIsSearching(true);
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=8&addressdetails=1`
            );
            const data = await res.json();
            setSearchResults(data);
            setShowResults(true);
        } catch (err) {
            console.error('Search error:', err);
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Handle search button click
    const handleSearch = () => {
        if (searchQuery.trim()) {
            // Clear existing timeout and search immediately
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
            searchLocation(searchQuery);
        }
    };

    // Handle selecting a search result
    const handleSelectLocation = (result) => {
        const coords = {
            lat: parseFloat(result.lat),
            lng: parseFloat(result.lon)
        };

        setPosition(coords);
        setLocationName(result.display_name);
        setSearchQuery('');
        setShowResults(false);

        // Move map to selected location
        if (mapInstance.current) {
            mapInstance.current.setView([coords.lat, coords.lng], 13);
        }
    };

    // Handle keyboard events
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            handleSearch();
        } else if (e.key === 'Escape') {
            setSearchQuery('');
            setShowResults(false);
        }
    };

    const fetchLocationName = async ({ lat, lng }) => {
        try {
            const res = await fetch(
                `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
            );
            const data = await res.json();
            setLocationName(data.display_name || 'Unknown location');
        } catch (err) {
            console.error(err);
            setLocationName('Unable to get location name');
        }
    };

    // Handle get current location
    const handleGetCurrentLocation = () => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    const coords = {
                        lat: pos.coords.latitude,
                        lng: pos.coords.longitude,
                    };
                    setPosition(coords);
                    fetchLocationName(coords);

                    // Move map view to current location
                    if (mapInstance.current) {
                        mapInstance.current.setView([coords.lat, coords.lng], 13);
                    }
                },
                (error) => {
                    alert('Location access denied or unavailable.');
                    console.error(error);
                }
            );
        } else {
            alert('Geolocation not supported by this browser.');
        }
    };

    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden max-w-4xl mx-auto">
            {/* Header */}
            <div className="p-6 pb-2">
                <h3 className="text-xl font-light text-gray-900 mb-4 flex items-center">
                    <MapPin className="w-5 h-5 mr-2 text-blue-500" />
                    {locationName}
                </h3>

                {/* Search Box */}
                <div className="relative">
                    <div className="flex gap-2">
                        <div className="flex-1 relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search for a location..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            {searchQuery && (
                                <button
                                    onClick={() => {
                                        setSearchQuery('');
                                        setShowResults(false);
                                    }}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            )}
                        </div>
                        <button
                            onClick={handleSearch}
                            disabled={!searchQuery.trim() || isSearching}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
                        >
                            {isSearching ? 'Searching...' : 'Search'}
                        </button>
                    </div>

                    {/* Search Results */}
                    {showResults && (
                        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
                            {searchResults.length > 0 ? (
                                <>
                                    <div className="px-3 py-2 text-xs font-medium text-gray-500 bg-gray-50 border-b border-gray-100">
                                        Search Results ({searchResults.length})
                                    </div>
                                    {searchResults.map((result, index) => (
                                        <button
                                            key={index}
                                            onClick={() => handleSelectLocation(result)}
                                            className="w-full text-left p-3 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                                        >
                                            <div className="flex items-center">
                                                <MapPin className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                                                <div className="min-w-0">
                                                    <div className="font-medium text-gray-900 text-sm">
                                                        {result.display_name.split(',')[0]}
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1 truncate">
                                                        {result.display_name}
                                                    </div>
                                                </div>
                                            </div>
                                        </button>
                                    ))}
                                </>
                            ) : (
                                <div className="p-3 text-center text-gray-500">No results found</div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Map Container */}
            <div className="relative h-80 mx-6 rounded-lg overflow-hidden mb-6">
                <div
                    ref={mapRef}
                    className="h-full w-full rounded-lg"
                    style={{ minHeight: '320px' }}
                />

                {/* Fixed Center Pin */}
                <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-full z-[1000] pointer-events-none">
                    <MapPin className="w-8 h-8 text-red-600 drop-shadow-lg" />
                </div>
            </div>

            {/* Controls */}
            <div className="px-6 pb-6 space-y-3">
                <button
                    onClick={handleGetCurrentLocation}
                    className="w-full bg-green-600 text-white p-4 rounded-lg font-medium uppercase tracking-wide hover:bg-green-500 transition-colors flex items-center justify-center space-x-2"
                >
                    <Navigation className="w-4 h-4" />
                    <span>Get Current Location</span>
                </button>

                {/* Coordinates Display */}
                <div className="bg-gray-50 p-3 rounded-lg text-sm text-gray-600">
                    <div className="flex justify-between">
                        <span>Latitude: {position.lat.toFixed(6)}</span>
                        <span>Longitude: {position.lng.toFixed(6)}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}