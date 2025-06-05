import React from "react";
import { useState } from "react";

function BasicInfo({ formData,setFormData }) {

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };


    return (
        <div className="flex-1 p-8 md:p-12">
            <div className=" grid md:grid-cols-2">
                <div className="md:mt-7">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Basic info</h1>
                    <p className="text-gray-500 mb-8">
                        Please provide your name, phone number and create a password.
                    </p>
                </div>

                <div>
                    <div className="space-y-6">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Business Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Dent Care Clinic"
                                value={formData.name}
                                onChange={(e) => handleInputChange('name', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Phone Number
                            </label>
                            <input
                                type="tel"
                                placeholder="e.g. +1 234 567 890"
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">
                                Create Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={(e) => handleInputChange('password', e.target.value)}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default BasicInfo;
