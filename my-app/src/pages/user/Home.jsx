import React, { useEffect, useState } from "react";
import Navbar from '../../components/user/HomeNavbar';
import CategoryCard from '../../components/user/Card';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function Home() {
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await axios.get("http://localhost:5000/admin/categories");
                setCategories(response.data.categories || []);
                setError(null);
            } catch (err) {
                console.error('Error fetching categories:', err);
                setError('Failed to load categories. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    function slugify(text) {
        return text
            ? text
                .toLowerCase()
                .trim()
                .replace(/&/g, 'and')
                .replace(/[\s_]+/g, '-')
                .replace(/[^\w\-]+/g, '')
                .replace(/\-\-+/g, '-')
                .replace(/^-+|-+$/g, '')
            : '';
    }

    const handleSelectCategory = (category) => {
        console.log('Selected category:', category);
        setSelectedCategory(category.name || '');
        const categorySlug = slugify(category.name);
        navigate(`/view/${categorySlug}`);
    };

    // Loading Skeleton
    const LoadingSkeleton = () => (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {[...Array(8)].map((_, index) => (
                <div
                    key={index}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden animate-pulse"
                    style={{ animationDelay: `${index * 100}ms` }}
                >
                    <div className="h-32 bg-gradient-to-r from-gray-100 to-gray-200"></div>
                    <div className="p-6">
                        <div className="h-6 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg mb-3"></div>
                    </div>
                </div>
            ))}
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
                <Navbar />
                <div className="container mx-auto px-6 py-12">
                    <div className="mb-12 text-center">
                        <h2 className="text-3xl font-bold text-gray-800 mb-3">Service Categories</h2>
                        <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto rounded-full"></div>
                    </div>
                    <LoadingSkeleton />
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
                <Navbar />
                <div className="container mx-auto px-6 py-12">
                    <div className="text-center max-w-lg mx-auto">
                        <div className="w-16 h-16 mx-auto mb-4 bg-red-100/80 backdrop-blur-sm rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h3 className="text-2xl font-semibold text-gray-800 mb-3">Something Went Wrong</h3>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-all duration-200 shadow-lg"
                        >
                            Try Again
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
          

            {/* Hero Section */}
            <div className="relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-800/90 to-indigo-800/90"></div>
                <div className="relative container mx-auto px-6 py-16">
                    <div className="text-center max-w-3xl mx-auto">
                        <h1 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Discover Local Services
                        </h1>
                        <p className="text-lg text-white mb-8 leading-relaxed">
                            Connect with trusted professionals in your area for all your needs.
                        </p>
                        <div className="inline-flex items-center space-x-2 text-white font-medium">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a2 2 0 00-2-2h-3m-8 4h-5v-2a2 2 0 012-2h3m-6-4V5a2 2 0 012-2h8a2 2 0 012 2v9m-7 4v1m0-8v1" />
                            </svg>
                            <span>Choose a category to get started</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Categories Section */}
            <div className="container mx-auto px-6 pb-16">
                <div className="mb-12 text-center">
                    <h2 className="text-3xl font-bold text-gray-800 mb-3 mt-10">Service Categories</h2>
                    <div className="w-24 h-1 bg-gradient-to-r from-blue-600 to-blue-800 mx-auto rounded-full"></div>
                </div>

                {categories.length === 0 ? (
                    <div className="text-center py-16 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20">
                        <div className="w-20 h-20 mx-auto mb-6 bg-gray-100/80 rounded-full flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No Categories Available</h3>
                        <p className="text-gray-500">Categories will appear here once they're added.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                        {categories.map((category, index) => (
                            <div
                                key={category.id || category._id}
                                className="group transform transition-all duration-300 hover:scale-105"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                <CategoryCard
                                    category={category}
                                    isSelected={selectedCategory === category.name}
                                    onSelect={handleSelectCategory}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}