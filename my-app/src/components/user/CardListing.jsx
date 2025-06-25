import React from 'react';
import { MapPin, Star } from 'lucide-react';

export default function ProfileCard({ profile, isSelected, onSelect }) {
    // Fallback values for missing data
    const {
        image = '/api/placeholder/80/80',
        name = 'Unknown Professional',
        subCategory = 'Service Provider',
        location = 'Location not specified',
        rating = null,
        reviewCount = 0
    } = profile || {};

    return (
        <div
            onClick={() => onSelect(profile)}
            className={`relative overflow-hidden rounded-2xl border-2 cursor-pointer transition-all duration-300 transform hover:scale-[1.02] ${
                isSelected
                    ? 'border-indigo-600 bg-gradient-to-br from-indigo-50 to-purple-50 shadow-lg'
                    : 'border-gray-200 bg-white hover:border-indigo-300 hover:shadow-md'
            }`}
        >
            {/* Selection indicator */}
            {isSelected && (
                <div className="absolute top-3 right-3 w-6 h-6 bg-indigo-600 rounded-full flex items-center justify-center">
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                </div>
            )}

            <div className="p-5">
                {/* Profile Image and Basic Info */}
                <div className="flex items-start space-x-4">
                    <div className="relative flex-shrink-0">
                        <img
                            src={image}
                            alt={name}
                            className="w-16 h-16 rounded-full object-cover border-3 border-white shadow-sm"
                        />
                        {/* Online status indicator - optional */}
                        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 border-2 border-white rounded-full"></div>
                    </div>
                    
                    <div className="flex-1 min-w-0">
                        <h3 className="text-xl font-bold text-gray-900 truncate">
                            {name}
                        </h3>
                        <p className="text-sm font-medium text-indigo-600 capitalize">
                            {subCategory}
                        </p>
                        
                        {/* Rating */}
                        {rating && (
                            <div className="flex items-center mt-1 space-x-1">
                                <Star className="w-4 h-4 text-yellow-500 fill-current" />
                                <span className="text-sm font-medium text-gray-700">
                                    {rating}
                                </span>
                                <span className="text-sm text-gray-500">
                                    ({reviewCount} reviews)
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Location */}
                <div className="flex items-center mt-4 space-x-2">
                    <MapPin className="w-4 h-4 text-gray-500 flex-shrink-0" />
                    <span className="text-sm text-gray-600 truncate">
                        {location}
                    </span>
                </div>

            </div>

            {/* Hover effect overlay */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-600/0 to-purple-600/0 hover:from-indigo-600/5 hover:to-purple-600/5 transition-all duration-300 pointer-events-none"></div>
        </div>
    );
}