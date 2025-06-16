import React from 'react';
import { Scissors, Sparkles } from 'lucide-react';

export default function CategoryCard({ category, isSelected, onSelect }) {
    // Map categories to icons
    const categoryIcons = {
        haircutting: <Scissors className="w-6 h-6 text-indigo-600" />,
        keratin: <Sparkles className="w-6 h-6 text-indigo-600" />,
    };

    // Fallback icon if category is undefined or not in categoryIcons
    const defaultIcon = <Sparkles className="w-6 h-6 text-indigo-600" />;

    // Format category name for display (e.g., "haircutting" -> "Haircutting")
    const formattedCategory = category
        ? category.replace(/([A-Z])/g, ' $1').trim().replace(/^\w/, c => c.toUpperCase())
        : 'Unknown Category';

    return (
        <div
            onClick={() => onSelect(category)}
            className={`flex items-center p-4 rounded-xl border-2 cursor-pointer transition-all duration-300 ${
                isSelected
                    ? 'border-indigo-600 bg-indigo-50 shadow-md'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50/50'
            }`}
        >
            <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                    {category && categoryIcons[category.toLowerCase()] ? categoryIcons[category.toLowerCase()] : defaultIcon}
                </div>
                <div>
                    <h4 className="text-base font-semibold text-gray-800">
                        {formattedCategory}
                    </h4>
                </div>
            </div>
        </div>
    );
}