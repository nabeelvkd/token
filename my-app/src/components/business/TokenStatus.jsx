import React, { useState, useEffect, useRef } from "react";
import { Hash, CheckCircle, Clock } from "lucide-react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";

export default function ManageToken() {
    const [services, setServices] = useState([]);
    const [selectedService, setSelectedService] = useState("");
    const [tokenData, setTokenData] = useState({});
    const [allTokens, setAllTokens] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [newTokenForm, setNewTokenForm] = useState({ name: "", mobile: "" });
    const [formError, setFormError] = useState("");
    const tokenListRef = useRef(null);

    const jwtToken = localStorage.getItem("businessToken");

    let businessId = null;

    if (jwtToken) {
        try {
            const decoded = jwtDecode(jwtToken);
            businessId = decoded.id;
        } catch (error) {
            console.error("Invalid token:", error);
        }
    } else {
        console.warn("businessToken not found in localStorage.");
    }

    useEffect(() => {
        axios
            .get(`http://localhost:5000/businessprofile/${businessId}`)
            .then((response) => {
                const fetchedServices = response.data?.tokens || [];
                setServices(fetchedServices);
            })
            .catch((error) => console.error("Error fetching services:", error));
    }, []);

    useEffect(() => {
        if (!selectedService || selectedService === "") return;

        const fetchTokenStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/token/${selectedService}`);
                setTokenData(response.data);
            } catch (error) {
                console.error("Error fetching token status:", error);
            }
        };

        const fetchTokenData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:5000/business/fetchtokendata/${selectedService}`,
                    {
                        headers: {
                            Authorization: `Bearer ${jwtToken}`,
                        },
                    }
                );
                setAllTokens(response.data);
            } catch (error) {
                console.error("Error fetching token data:", error);
            }
        };

        fetchTokenStatus();
        fetchTokenData();
    }, [selectedService, jwtToken]);

    const nextToken = async () => {
        try {
            await axios.put(
                `http://localhost:5000/business/nexttoken/${selectedService}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            setTokenData((prev) => ({
                ...prev,
                current: prev.current + 1,
            }));
            // Auto-scroll to the current token
            setTimeout(() => {
                const currentTokenElement = tokenListRef.current?.querySelector(
                    `[data-queue-number="${tokenData.current + 1}"]`
                );
                if (currentTokenElement && tokenListRef.current) {
                    currentTokenElement.scrollIntoView({ behavior: "smooth", block: "center" });
                }
            }, 100);
        } catch (error) {
            console.error("Error incrementing token:", error);
        }
    };

    const toggleServiceStatus = async (serviceId) => {
        try {
            await axios.put(
                `http://localhost:5000/business/toggletoken/${serviceId}`, {},
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`,
                    },
                }
            );
            setTokenData(prev => ({
                ...prev,
                status: !prev.status
            }));

        } catch (error) {
            console.error("Error toggling service status:", error);
        }
    };

    const addToken = (e) => {
        e.preventDefault(); // Prevent form from reloading the page

        if (!newTokenForm.name.trim()) {
            setFormError("Name is required");
            return;
        }

        axios.post("http://localhost:5000/booktoken", {
            tokenId: selectedService,
            businessId,
            ...newTokenForm
        }).then((response) => {
            console.log(response.data);
            setShowModal(false);
            setNewTokenForm({ name: "", mobile: "" });
            setFormError("");
        }).catch((error) => {
            console.error(error);
            setFormError("Failed to add token");
        });
    };


    return (
        <>
            {/* New Token Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-full max-w-md">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Add New Token</h3>
                        <form onSubmit={addToken}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Name *
                                </label>
                                <input
                                    type="text"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    value={newTokenForm.name}
                                    onChange={(e) =>
                                        setNewTokenForm({ ...newTokenForm, name: e.target.value })
                                    }
                                    placeholder="Enter customer name"
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Phone (Optional)
                                </label>
                                <input
                                    type="tel"
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:border-blue-500 focus:outline-none"
                                    value={newTokenForm.mobile}
                                    onChange={(e) =>
                                        setNewTokenForm({ ...newTokenForm, mobile: e.target.value })
                                    }
                                    placeholder="Enter customer phone"
                                />
                            </div>
                            {formError && (
                                <p className="text-red-500 text-sm mb-4">{formError}</p>
                            )}
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowModal(false);
                                        setNewTokenForm({ name: "", mobile: "" });
                                        setFormError("");
                                    }}
                                    className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 rounded-lg bg-blue-800 text-white hover:bg-blue-900 transition-colors"
                                >
                                    Add Token
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            <div className="bg-white rounded-lg p-4 sm:p-6 border border-gray-200">
                <h3 className="text-base sm:text-lg font-semibold text-black flex items-center">
                    <Hash className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-800" />
                    Token Management
                </h3>

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4 mt-2">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                        <select
                            className="w-full sm:w-72 p-3 border border-gray-300 rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
                            value={selectedService}
                            onChange={(e) => setSelectedService(e.target.value)}
                        >
                            <option value="">Select Service</option>
                            {services.map((service) => (
                                <option key={service.id} value={service.id}>
                                    {service.services.join(", ")}
                                </option>
                            ))}
                        </select>
                        {selectedService && (
                            <button
                                onClick={() => toggleServiceStatus(selectedService)}
                                className={`px-4 py-2 rounded-lg text-sm transition-colors ${tokenData.status
                                    ? "bg-red-600 text-white hover:bg-red-700"
                                    : "bg-green-600 text-white hover:bg-green-700"

                                    }`}
                            >
                                {tokenData.status ? "Stop Booking" : "Start Booking"}
                            </button>
                        )}
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={tokenData.current === tokenData.next ? null : nextToken}
                            disabled={tokenData.current === tokenData.next}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${tokenData.current === tokenData.next
                                ? "bg-blue-300 text-white cursor-not-allowed"
                                : "bg-blue-800 text-white hover:bg-blue-900"
                                }`}
                        >
                            Next Token
                        </button>
                        <button
                            onClick={() => setShowModal(true)}
                            disabled={!selectedService || !tokenData.status}
                            className={`px-4 py-2 rounded-lg text-sm transition-colors ${!selectedService || !tokenData.status
                                ? "bg-gray-400 text-white cursor-not-allowed"
                                : "bg-gray-700 text-white hover:bg-gray-800"
                                }`}
                        >
                            + New
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-lg sm:text-2xl font-bold text-blue-800">
                            {tokenData.current || 0}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Current</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-lg sm:text-2xl font-bold text-red-700">
                            {(tokenData.next || 1) - (tokenData.current || 0) - 1}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Waiting</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-lg sm:text-2xl font-bold text-gray-700">
                            {(tokenData.next || 1) - 1}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Total Today</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-lg sm:text-2xl font-bold text-gray-700">
                            {tokenData.waitTime || "0m"}
                        </div>
                        <div className="text-xs sm:text-sm text-gray-600">Avg Wait</div>
                    </div>
                </div>

                <div
                    ref={tokenListRef}
                    className="space-y-2 sm:space-y-3 max-h-80 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
                >
                    {allTokens.map((token) => (
                        <div
                            key={token.id}
                            data-queue-number={token.queueNumber}
                            className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border-2 transition-all duration-300 ease-in-out space-y-2 sm:space-y-0 ${token.queueNumber === tokenData.current
                                ? "border-blue-800 bg-blue-50 scale-95"
                                : "border-gray-200 hover:border-gray-300"
                                }`}
                        >
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div
                                    className={`w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-semibold text-sm sm:text-base transition-colors duration-300 ${token.queueNumber === tokenData.current ? "bg-blue-800" : "bg-blue-900"
                                        }`}
                                >
                                    {token.queueNumber}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-semibold text-black sm:text-base text-sm truncate">
                                        {token.customerName}
                                    </h4>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">
                                        {token.customerPhone || "No phone"}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end space-x-1">
                                {token.queueNumber <= tokenData.current ? (
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-800" />
                                ) : (
                                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}