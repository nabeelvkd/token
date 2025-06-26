import React, { useState } from 'react';
import { useEffect } from 'react';

export default function CategoryCard({ category, isSelected, onSelect }) {
    const [imageError, setImageError] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    
    const fallbackImageUrl = 'https://source.unsplash.com/500x400/?service,modern';
    
    const formattedCategory = category.name
        ? category.name
            .replace(/([A-Z])/g, ' $1')
            .trim()
            .replace(/^\w/, c => c.toUpperCase())
        : 'Unknown Category';

    const handleClick = () => {
        console.log('CategoryCard clicked:', category);
        if (onSelect && typeof onSelect === 'function') {
            onSelect(category);
        }
    };

    useEffect(()=>{
        console.log(isSelected)
    },[isSelected])

    return (
        <div
            onClick={handleClick}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
            className={`group relative w-full cursor-pointer overflow-hidden rounded-3xl backdrop-blur-xl transition-all duration-700 ease-out transform-gpu ${
                isSelected 
                ? 'scale-105 bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900' 
                : 'scale-100 bg-white/90 hover:scale-[1.02] hover:bg-white/95'
            }`}
            style={{
                backgroundImage: isSelected ? 'none' : 'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                border: isSelected ? '2px solid rgba(59, 130, 246, 0.3)' : '1px solid rgba(148, 163, 184, 0.2)',
                boxShadow: isSelected 
                    ? '0 25px 50px -12px rgba(30, 64, 175, 0.4), 0 0 0 1px rgba(59, 130, 246, 0.1)' 
                    : isHovered 
                        ? '0 20px 40px -12px rgba(0, 0, 0, 0.15), 0 8px 16px -4px rgba(0, 0, 0, 0.1)' 
                        : '0 4px 20px -2px rgba(0, 0, 0, 0.08)'
            }}
        >
            {/* Animated gradient overlay */}
            <div className={`absolute inset-0 opacity-0 transition-opacity duration-1000 ${
                isHovered && !isSelected ? 'opacity-100' : ''
            }`} style={{
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(147, 51, 234, 0.08) 100%)'
            }} />
            
            {/* Dynamic light effect */}
            <div className={`absolute inset-0 opacity-0 transition-all duration-1000 ${
                isSelected ? 'opacity-20' : isHovered ? 'opacity-10' : ''
            }`} style={{
                background: 'radial-gradient(circle at 50% 0%, rgba(59, 130, 246, 0.3) 0%, transparent 50%)'
            }} />
            
            {/* Hero Image Container */}
            <div className="relative w-full h-56 overflow-hidden rounded-t-3xl">
                <div className={`absolute inset-0 transition-transform duration-700 ${
                    isHovered ? 'scale-110' : 'scale-100'
                }`}>
                    <img
                        src={imageError || !category.iconUrl ? fallbackImageUrl : category.iconUrl}
                        alt={formattedCategory}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            console.log(`Failed to load image for category "${formattedCategory}": ${category.iconUrl}`);
                            setImageError(true);
                        }}
                        onLoad={() => console.log(`Successfully loaded image for category "${formattedCategory}"`)}
                    />
                </div>
                
                {/* Dynamic image overlay */}
                <div className={`absolute inset-0 transition-all duration-500 ${
                    isSelected 
                    ? 'bg-gradient-to-b from-blue-900/40 via-blue-800/30 to-blue-900/60' 
                    : 'bg-gradient-to-b from-black/20 via-transparent to-black/40 group-hover:from-blue-900/30 group-hover:to-blue-800/50'
                }`} />
                
                {/* Floating selection indicator */}
                
                
                {/* Subtle corner accent */}
                <div className={`absolute top-0 left-0 w-20 h-20 opacity-30 transition-opacity duration-500 ${
                    isSelected ? 'opacity-50' : ''
                }`} style={{
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, transparent 70%)'
                }} />
            </div>
            
            {/* Premium Content Section */}
            <div className={`relative p-8 transition-all duration-500 ${
                isSelected 
                ? 'bg-gradient-to-b from-blue-900/95 to-blue-800/95' 
                : 'bg-gradient-to-b from-white/95 to-white/90'
            }`}>
                {/* Glassmorphism effect */}
                <div className="absolute inset-0 backdrop-blur-sm" style={{
                    background: isSelected 
                        ? 'linear-gradient(135deg, rgba(30, 64, 175, 0.1) 0%, rgba(67, 56, 202, 0.05) 100%)' 
                        : 'linear-gradient(135deg, rgba(255, 255, 255, 0.8) 0%, rgba(255, 255, 255, 0.4) 100%)'
                }} />
                
                <div className="relative z-10">
                    {/* Category Title with enhanced typography */}
                    <h3 className={`text-2xl font-bold mb-3 tracking-tight transition-all duration-500 ${
                        isSelected 
                        ? 'text-white drop-shadow-sm' 
                        : 'text-slate-900 group-hover:text-blue-900'
                    }`} style={{
                        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
                        letterSpacing: '-0.025em'
                    }}>
                        {formattedCategory}
                    </h3>
                    
                    {/* Enhanced Description */}
                    <p className={`text-base leading-relaxed mb-6 transition-all duration-500 ${
                        isSelected 
                        ? 'text-blue-100/90' 
                        : 'text-slate-600 group-hover:text-blue-700'
                    }`}>
                        Find <span className="font-medium">{formattedCategory}</span> near you
                    </p>
                    
                    {/* Interactive CTA */}
                    <div className={`flex items-center justify-between transition-all duration-500 ${
                        isSelected ? 'text-white' : 'text-blue-800'
                    }`}>
                        <div className="flex items-center space-x-3">
                            <div className={`w-2 h-2 rounded-full transition-all duration-300 ${
                                isSelected 
                                ? 'bg-blue-200 scale-125' 
                                : 'bg-blue-600 group-hover:scale-125'
                            }`} />
                            <span className="font-semibold text-sm tracking-wide uppercase">
                                {isSelected ? 'Selected' : 'Explore'}
                            </span>
                        </div>
                        
                        {/* Animated arrow */}
                        <div className={`transform transition-all duration-300 ${
                            isSelected 
                            ? 'translate-x-1 rotate-90' 
                            : 'group-hover:translate-x-2'
                        }`}>
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5-5 5M6 12h12" />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>
            
            {/* Micro-interaction sparkle effect */}
            <div className={`absolute inset-0 opacity-0 pointer-events-none transition-opacity duration-1000 ${
                isHovered && !isSelected ? 'opacity-100' : ''
            }`}>
                <div className="absolute top-1/4 left-1/4 w-1 h-1 bg-blue-400 rounded-full animate-ping" style={{ animationDelay: '0s' }} />
                <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-blue-300 rounded-full animate-ping" style={{ animationDelay: '0.5s' }} />
                <div className="absolute top-1/2 right-1/4 w-1 h-1 bg-blue-500 rounded-full animate-ping" style={{ animationDelay: '1s' }} />
            </div>
        </div>
    );
}