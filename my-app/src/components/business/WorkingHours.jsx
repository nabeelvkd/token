import React, { useState } from "react";

const daysOfWeek = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

function WorkingHours({setWorkingHours,workingHours}) {
    

    const [selectedDay, setSelectedDay] = useState("Monday");

    const toggleDayEnabled = (day) => {
        setWorkingHours((prev) => ({
            ...prev,
            [day]: {
                ...prev[day],
                enabled: !prev[day].enabled,
                intervals: !prev[day].enabled ? [{ start: "", end: "" }] : []
            }
        }));
    };

    const handleIntervalChange = (index, field, value) => {
        const updated = [...workingHours[selectedDay].intervals];
        updated[index][field] = value;
        setWorkingHours((prev) => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                intervals: updated
            }
        }));
    };

    const addInterval = () => {
        if (workingHours[selectedDay].intervals.length < 3) {
            setWorkingHours((prev) => ({
                ...prev,
                [selectedDay]: {
                    ...prev[selectedDay],
                    intervals: [...prev[selectedDay].intervals, { start: "", end: "" }]
                }
            }));
        }
    };

    const removeInterval = (index) => {
        const updated = workingHours[selectedDay].intervals.filter((_, i) => i !== index);
        setWorkingHours((prev) => ({
            ...prev,
            [selectedDay]: {
                ...prev[selectedDay],
                intervals: updated
            }
        }));
    };

    const applyToAllDays = () => {
        const sourceIntervals = workingHours[selectedDay].intervals;
        setWorkingHours((prev) => {
            const updated = {};
            for (const day of daysOfWeek) {
                if (prev[day].enabled) {
                    updated[day] = {
                        enabled: true,
                        intervals: JSON.parse(JSON.stringify(sourceIntervals))
                    };
                } else {
                    updated[day] = prev[day];
                }
            }
            return updated;
        });
    };

    return (
        <div className="flex-1 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Block */}
                <div className="md:mt-7">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Working Hours</h1>
                    <p className="text-gray-500 mb-6">Toggle each day and set time intervals (max 3).</p>

                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
                        {daysOfWeek.map((day) => {
                            const isEnabled = workingHours[day].enabled;
                            const isSelected = selectedDay === day;
                            return (
                                <button
                                    key={day}
                                    onClick={() => setSelectedDay(day)}
                                    className={`rounded-lg px-3 py-2 border text-sm transition-all
                    ${isEnabled ? 'border-blue-600 bg-blue-50 text-blue-800' : 'border-gray-300 bg-white text-gray-700'}
                    ${isSelected ? 'ring-2 ring-blue-800' : ''}
                  `}
                                >
                                    <div className="flex justify-between items-center">
                                        <span>{day}</span>
                                        <input
                                            type="checkbox"
                                            checked={isEnabled}
                                            onChange={(e) => {
                                                e.stopPropagation();
                                                toggleDayEnabled(day);
                                            }}
                                            className="ml-2 accent-blue-600"
                                        />
                                    </div>
                                </button>
                            );
                        })}
                    </div>

                    {workingHours[selectedDay].enabled && (
                        <div className="space-y-3">
                            {workingHours[selectedDay].intervals.map((interval, index) => (
                                <div key={index} className="flex items-center gap-4">
                                    <input
                                        type="time"
                                        value={interval.start}
                                        onChange={(e) =>
                                            handleIntervalChange(index, "start", e.target.value)
                                        }
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none"
                                    />
                                    <span className="text-gray-500">to</span>
                                    <input
                                        type="time"
                                        value={interval.end}
                                        onChange={(e) =>
                                            handleIntervalChange(index, "end", e.target.value)
                                        }
                                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 outline-none"
                                    />
                                    <button
                                        onClick={() => removeInterval(index)}
                                        className="text-red-500 text-sm hover:text-red-700"
                                    >
                                        Remove
                                    </button>
                                </div>
                            ))}

                            <div className="flex gap-4 mt-3">
                                {workingHours[selectedDay].intervals.length < 3 && (
                                    <button
                                        onClick={addInterval}
                                        className="bg-blue-800 text-white px-4 py-2 rounded-lg hover:bg-blue-900 transition"
                                    >
                                        Add Interval
                                    </button>
                                )}
                                <button
                                    onClick={applyToAllDays}
                                    className="bg-gray-100 border border-gray-300 px-4 py-2 rounded-lg text-sm hover:bg-gray-200 transition"
                                >
                                    Apply to All Days
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Block (Scrollable) */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">All Working Hours</h2>
                    <div className="max-h-[400px] overflow-y-auto pr-2 space-y-4">
                        {daysOfWeek.map((day) => {
                            const data = workingHours[day];
                            return (
                                <div key={day} className="border rounded-lg p-4 shadow-sm">
                                    <div className="flex justify-between items-center">
                                        <h3 className="font-medium text-gray-800">{day}</h3>
                                        <span className={`text-sm ${data.enabled ? "text-green-600" : "text-gray-400"}`}>
                                            {data.enabled ? "Enabled" : "Disabled"}
                                        </span>
                                    </div>
                                    {data.enabled && data.intervals.length > 0 && (
                                        <ul className="mt-2 text-sm text-gray-600 space-y-1">
                                            {data.intervals.map((int, idx) => (
                                                <li key={idx}>
                                                    {int.start} - {int.end}
                                                </li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default WorkingHours;
