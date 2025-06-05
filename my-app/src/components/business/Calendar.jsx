import React from "react";
import { useState, useMemo } from "react";
import {
    X,
    ChevronLeft,
    ChevronRight,
} from 'lucide-react'

function Calendar() {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [showDayDetails, setShowDayDetails] = useState(false);
    const [holidays, setHolidays] = useState(new Set([25, 31])); // Sample holidays
    const [workingDays, setWorkingDays] = useState(new Set([1, 2, 3, 4, 5])); // Mon-Fri (0=Sun, 1=Mon, etc.)


    const getDaysInMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
        return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const generateCalendarDays = useMemo(() => {
        const daysInMonth = getDaysInMonth(currentDate);
        const firstDay = getFirstDayOfMonth(currentDate);
        const days = [];

        // Empty cells for days before the first day of the month
        for (let i = 0; i < firstDay; i++) {
            days.push(null);
        }

        // Days of the month
        for (let day = 1; day <= daysInMonth; day++) {
            days.push(day);
        }

        return days;
    }, [currentDate]);

    const navigateMonth = (direction) => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + direction, 1));
    };

    const isToday = (day) => {
        const today = new Date();
        return day === today.getDate() &&
            currentDate.getMonth() === today.getMonth() &&
            currentDate.getFullYear() === today.getFullYear();
    };

    const isSelected = (day) => {
        return day === selectedDate.getDate() &&
            currentDate.getMonth() === selectedDate.getMonth() &&
            currentDate.getFullYear() === selectedDate.getFullYear();
    };

    const isHoliday = (day) => {
        return holidays.has(day);
    };

    const isWorkingDay = (day) => {
        const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        return workingDays.has(date.getDay());
    };

    const toggleHoliday = (day) => {
        const newHolidays = new Set(holidays);
        if (newHolidays.has(day)) {
            newHolidays.delete(day);
        } else {
            newHolidays.add(day);
        }
        setHolidays(newHolidays);
    };

    const handleDayClick = (day) => {
        if (!day) return;
        const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        setSelectedDate(clickedDate);
        setShowDayDetails(true);
    };

    const getAppointmentsForDate = (date) => {
        const dayOfMonth = date.getDate();
        const appointmentCounts = {
            5: 3, 12: 2, 18: 4, 23: 1, 28: 5
        };
        return appointmentCounts[dayOfMonth] || 0;
    };

    return (
        <div>
            <div className="bg-white rounded-lg shadow-sm border border-gray-200">
                {/* Calendar Header */}
                <div className="p-4 border-b border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                        <h3 className="text-base sm:text-lg font-semibold text-black">Calendar</h3>
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={() => navigateMonth(-1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronLeft className="w-4 h-4 text-gray-600" />
                            </button>
                            <span className="text-sm font-medium px-3 py-1 bg-gray-100 rounded-lg">
                                {currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}
                            </span>
                            <button
                                onClick={() => navigateMonth(1)}
                                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                            >
                                <ChevronRight className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>
                    </div>

                    {/* Calendar Grid Header */}
                    <div className="grid grid-cols-7 gap-1">
                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((day, index) => (
                            <div key={index} className="text-center text-xs font-semibold text-gray-500 py-2 bg-gray-50 rounded">
                                {day}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Calendar Body */}
                <div className="p-4">
                    <div className="grid grid-cols-7 gap-1">
                        {generateCalendarDays.map((day, index) => {
                            const appointmentCount = day ? getAppointmentsForDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) : 0;
                            return (
                                <button
                                    key={index}
                                    onClick={() => handleDayClick(day)}
                                    className={`
                        aspect-square flex flex-col items-center justify-center text-xs sm:text-sm relative p-1 rounded-lg transition-all
                        ${!day ? 'invisible' : ''}
                        ${isToday(day) ? 'bg-blue-800 text-white font-bold shadow-md' : ''}
                        ${isSelected(day) && !isToday(day) ? 'bg-blue-100 text-blue-800 border-2 border-blue-300' : ''}
                        ${isHoliday(day) && !isToday(day) ? 'bg-red-100 text-red-700 border border-red-300' : ''}
                        ${!isToday(day) && !isSelected(day) && !isHoliday(day) ? 'hover:bg-gray-100 border border-transparent hover:border-gray-300' : ''}
                        ${day && !isWorkingDay(day) && !isHoliday(day) && !isToday(day) ? 'text-gray-400 bg-gray-50' : ''}
                      `}
                                >
                                    <span className="leading-none">{day}</span>
                                    {appointmentCount > 0 && (
                                        <div className={`absolute -top-1 -right-1 min-w-[16px] h-4 text-[10px] rounded-full flex items-center justify-center font-bold ${isToday(day) ? 'bg-white text-blue-800' : 'bg-blue-800 text-white'
                                            }`}>
                                            {appointmentCount}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Calendar Footer */}
                <div className="p-4 border-t border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-semibold text-black">Legend</h4>
                        <button
                            onClick={() => setSelectedDate(new Date())}
                            className="text-xs text-blue-800 hover:text-blue-900 font-medium"
                        >
                            Today
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-800 rounded-full"></div>
                            <span className="text-gray-600">Today</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-red-100 border border-red-300 rounded-full"></div>
                            <span className="text-gray-600">Holiday</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-gray-200 rounded-full"></div>
                            <span className="text-gray-600">Weekend</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <div className="w-3 h-3 bg-blue-800 text-white rounded-full flex items-center justify-center text-[8px] font-bold">5</div>
                            <span className="text-gray-600">Appointments</span>
                        </div>
                    </div>
                </div>

                {/* Day Details Section */}
                {showDayDetails && (
                    <div className="border-t border-gray-200 bg-blue-50 p-4">
                        <div className="flex items-center justify-between mb-3">
                            <h4 className="text-sm font-semibold text-black">
                                {selectedDate.toLocaleDateString('en-US', {
                                    weekday: 'short',
                                    month: 'short',
                                    day: 'numeric'
                                })}
                            </h4>
                            <button
                                onClick={() => setShowDayDetails(false)}
                                className="p-1 hover:bg-blue-100 rounded-lg transition-colors"
                            >
                                <X className="w-4 h-4 text-gray-600" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <div className="grid grid-cols-2 gap-3 text-xs">
                                <div className="bg-white p-2 rounded-lg">
                                    <span className="text-gray-600">Appointments</span>
                                    <div className="font-bold text-blue-800">{getAppointmentsForDate(selectedDate)}</div>
                                </div>
                                <div className="bg-white p-2 rounded-lg">
                                    <span className="text-gray-600">Status</span>
                                    <div className="font-bold text-gray-700">
                                        {isHoliday(selectedDate.getDate()) ? 'Holiday' :
                                            isWorkingDay(selectedDate.getDate()) ? 'Working' : 'Weekend'}
                                    </div>
                                </div>
                            </div>

                            <div className="flex space-x-2">
                                <button
                                    onClick={() => {
                                        toggleHoliday(selectedDate.getDate());
                                        setShowDayDetails(false);
                                    }}
                                    className={`flex-1 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${isHoliday(selectedDate.getDate())
                                        ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                                        : 'bg-red-100 text-red-700 hover:bg-red-200'
                                        }`}
                                >
                                    {isHoliday(selectedDate.getDate()) ? 'Remove Holiday' : 'Mark Holiday'}
                                </button>
                                <button
                                    onClick={() => setShowDayDetails(false)}
                                    className="px-3 py-2 bg-blue-800 text-white rounded-lg text-xs font-medium hover:bg-blue-900 transition-colors"
                                >
                                    Book
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Calendar;
