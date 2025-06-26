// Reusable button component
import React from 'react';
import LoadingSpinner from './LoadingSpinner';

const Button = ({
    children,
    variant = 'primary',
    size = 'md',
    loading = false,
    disabled = false,
    className = '',
    icon: Icon,
    iconPosition = 'left',
    ...props
}) => {
    const baseClasses = 'inline-flex items-center justify-center font-medium rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2';
    
    const variants = {
        primary: 'bg-blue-600 text-white hover:bg-blue-700 focus:ring-blue-500 disabled:bg-blue-300',
        secondary: 'bg-gray-200 text-gray-900 hover:bg-gray-300 focus:ring-gray-500 disabled:bg-gray-100',
        danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300',
        outline: 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 focus:ring-blue-500 disabled:border-blue-300 disabled:text-blue-300',
    };

    const sizes = {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-2 text-base',
        lg: 'px-6 py-3 text-lg',
    };

    const isDisabled = disabled || loading;

    return (
        <button
            className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className} ${isDisabled ? 'cursor-not-allowed' : ''}`}
            disabled={isDisabled}
            {...props}
        >
            {loading && <LoadingSpinner size="sm" className="mr-2" />}
            {Icon && iconPosition === 'left' && !loading && <Icon className="w-4 h-4 mr-2" />}
            {children}
            {Icon && iconPosition === 'right' && !loading && <Icon className="w-4 h-4 ml-2" />}
        </button>
    );
};

export default Button;