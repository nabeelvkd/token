import React from 'react';
import { ExternalLink, MapPin, Navigation } from 'lucide-react';

export default function MapView({ latitude, longitude }) {
  // Validate latitude and longitude
  const isValidLat = typeof latitude === 'number' && latitude >= -90 && latitude <= 90;
  const isValidLon = typeof longitude === 'number' && longitude >= -180 && longitude <= 180;
  
  if (!isValidLat || !isValidLon) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div className="text-center">
          <MapPin className="mx-auto h-12 w-12 text-gray-400 mb-3" />
          <p className="text-gray-700 font-medium">Location not available</p>
          <p className="text-gray-500 text-sm mt-1">Invalid coordinates provided</p>
        </div>
      </div>
    );
  }

  // Function to redirect to Google Maps
  const handleGoogleMapsRedirect = () => {
    const url = `https://www.google.com/maps?q=${latitude},${longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  // Function to get directions
  const handleGetDirections = () => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${latitude},${longitude}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="p-6 pb-4">
        <h3 className="text-xl font-light text-gray-900 mb-2 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-blue-500" />
          Location
        </h3>
      </div>

      {/* Map Container */}
      <div className="relative bg-gray-100 mx-6 rounded-lg overflow-hidden mb-6">
        <div className="w-full h-64 bg-gray-200 flex items-center justify-center relative">
          <iframe
            src={`https://www.openstreetmap.org/export/embed.html?bbox=${longitude-0.01},${latitude-0.01},${longitude+0.01},${latitude+0.01}&layer=mapnik&marker=${latitude},${longitude}`}
            width="100%"
            height="100%"
            style={{ border: 0 }}
            title="Business Location"
            className="absolute inset-0 rounded-lg"
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="px-6 pb-6 space-y-3">
        
        <button
          onClick={handleGetDirections}
          className="w-full bg-blue-800 text-white p-4 rounded-lg font-medium uppercase tracking-wide hover:bg-blue-600 transition-colors flex items-center justify-center space-x-2"
        >
          <Navigation className="w-4 h-4" />
          <span>Get Directions</span>
        </button>
      </div>
    </div>
  );
}