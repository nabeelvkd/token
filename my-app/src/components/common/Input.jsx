// Reusable input component
import React, { forwardRef } from 'react';

const Input = forwardRef(({
    label,
    error,
    helperText,
    icon: Icon,
    iconPosition = 'left',
    className = '',
    containerClassName = '',
    ...props
}, ref) => {
    const hasError = !!error;

    return (
        <div className={`space-y-1 ${containerClassName}`}>
            {label && (
                <label className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            
            <div className="relative">
                {Icon && iconPosition === 'left' && (
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
                
                <input
                    ref={ref}
                    className={`
                        block w-full rounded-lg border-gray-300 shadow-sm
                        focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                        ${Icon && iconPosition === 'left' ? 'pl-10' : ''}
                        ${Icon && iconPosition === 'right' ? 'pr-10' : ''}
                        ${hasError ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : ''}
                        ${className}
                    `}
                    {...props}
                />
                
                {Icon && iconPosition === 'right' && (
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <Icon className="h-5 w-5 text-gray-400" />
                    </div>
                )}
            </div>
            
            {error && (
                <p className="text-sm text-red-600">{error}</p>
            )}
            
            {helperText && !error && (
                <p className="text-sm text-gray-500">{helperText}</p>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export default Input;