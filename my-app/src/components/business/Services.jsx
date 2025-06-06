import React, { useState } from "react";

function ServicesInfo({ serviceType, setServiceType, services, setServices, reg }) {

    const [newService, setNewService] = useState({
        name: '',
        estimatedTime: '',
        fee: ''
    });

    const toggleServiceType = (type) => {
        setServiceType(prev => ({
            ...prev,
            [type]: !prev[type]
        }));
    };

    const handleAddService = () => {
        if (newService.name && newService.estimatedTime && newService.fee) {
            setServices([...services, newService]);
            setNewService({ name: '', estimatedTime: '', fee: '' });
        }
    };

    return (
        <div className={`${reg ? 'flex-1 p-8 md:p-12' : 'min-h-screen bg-white md:ml-64 md:mt-0 p-20'}`}>
            <div className="grid md:grid-cols-2 gap-8">
                {/* Left Block */}
                <div className="md:mt-7">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">Services Info</h1>
                    <p className="text-gray-500 mb-6">
                        Select service types and add services with estimated time and fee.
                    </p>

                    <div className="flex gap-4 mb-6">
                        <button
                            onClick={() => toggleServiceType('token')}
                            className={`px-4 py-2 rounded-lg border transition ${serviceType.token
                                    ? 'bg-blue-800 text-white'
                                    : 'bg-white text-gray-700 border-gray-300'
                                }`}
                        >
                            Token
                        </button>
                        <button
                            onClick={() => toggleServiceType('appointment')}
                            className={`px-4 py-2 rounded-lg border transition ${serviceType.appointment
                                    ? 'bg-blue-800 text-white'
                                    : 'bg-white text-gray-700 border-gray-300'
                                }`}
                        >
                            Appointment
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Service Name
                            </label>
                            <input
                                type="text"
                                placeholder="e.g. Teeth Cleaning"
                                value={newService.name}
                                onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Estimated Time (in minutes)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 30"
                                value={newService.estimatedTime}
                                onChange={(e) => setNewService({ ...newService, estimatedTime: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none"
                            />
                        </div>

                        <div>
                            <label className="block text-gray-700 font-medium mb-1">
                                Fee (in ₹ or $)
                            </label>
                            <input
                                type="number"
                                placeholder="e.g. 500"
                                value={newService.fee}
                                onChange={(e) => setNewService({ ...newService, fee: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-800 focus:border-transparent outline-none"
                            />
                        </div>

                        <button
                            onClick={handleAddService}
                            className="mt-4 bg-blue-800 text-white px-6 py-2 rounded-lg hover:bg-blue-900 transition"
                        >
                            Add Service
                        </button>
                    </div>
                </div>

                {/* Right Block */}
                <div>
                    <h2 className="text-xl font-semibold mb-4">Added Services</h2>
                    {services.length === 0 ? (
                        <p className="text-gray-500">No services added yet.</p>
                    ) : (
                        <ul className="space-y-4">
                            {services.map((service, index) => (
                                <li
                                    key={index}
                                    className="border rounded-lg p-4 shadow-sm flex justify-between items-center"
                                >
                                    <div>
                                        <h3 className="font-medium text-gray-800">{service.name}</h3>
                                        <p className="text-sm text-gray-500">
                                            Time: {service.estimatedTime} mins | Fee: ₹{service.fee}
                                        </p>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ServicesInfo;
