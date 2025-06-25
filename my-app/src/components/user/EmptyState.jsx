import React from 'react'
import { ChevronLeft } from 'lucide-react';

const EmptyState = ({searchQuery,selectedLocation}) => (
    <div className="text-center py-20">
        <div className="max-w-md mx-auto">
            <div className="w-32 h-32 mx-auto mb-8 bg-gradient-to-br from-blue-50 to-indigo-100 rounded-full flex items-center justify-center shadow-lg">
                <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">No businesses found</h3>
            <p className="text-gray-600 mb-8 leading-relaxed">
                {searchQuery || selectedLocation ?
                    'Try adjusting your search criteria or location filters to discover more businesses.' :
                    'We couldn\'t find any businesses in this category at the moment. Check back soon!'
                }
            </p>
            <button
                onClick={() => navigate('/view')}
                className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transform hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
                <ChevronLeft className="w-5 h-5 mr-2" />
                Back to Home
            </button>
        </div>
    </div>
);

export default EmptyState
