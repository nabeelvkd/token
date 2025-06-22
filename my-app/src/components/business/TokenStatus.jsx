import React, { useState, useEffect } from 'react'
import { Hash, CheckCircle, Clock, Eye } from 'lucide-react'
import { jwtDecode } from 'jwt-decode'
import axios from 'axios';

function ManageToken() {
    const [tokens, setTokens] = useState([])
    const [showAllTokens, setShowAllTokens] = useState(false);
    const [selectedService, setSelectedService] = useState('Select a Token')
    const [tokenData, setTokenData] = useState({});
    const [allTokens, setAllTokens] = useState([]);

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
        axios.get(`http://localhost:5000/businessprofile/dummy/${businessId}`).then((response) => {
            setTokens(response.data.tokens)
        })
    }, [])
    useEffect(() => {
        if (selectedService === "Select a Token" || !selectedService) return;

        const fetchTokenStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/token/${selectedService}`);
                setTokenData(response.data)
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        const fetchTokenData = () => {
            const token = localStorage.getItem('businessToken');

            axios.get(`http://localhost:5000/business/fetchtokendata/${selectedService}`, {
                headers: {
                    Authorization: `Bearer ${jwtToken}`
                }
            })
                .then((response) => {
                    setAllTokens(response.data);
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
        };

        fetchTokenData();
        fetchTokenStatus();
    }, [selectedService]);

    const nextToken = async () => {
        try {
            await axios.put(
                `http://localhost:5000/business/nexttoken/${selectedService}`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${jwtToken}`
                    }
                }
            );
            setTokenData(prev => ({
                ...prev,
                current: prev.current + 1
            }));
        } catch (error) {
            console.error("Error incrementing token:", error);
        }
    };



    return (
        <div>
            <select
                className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-700 mb-8 focus:border-blue-500 focus:outline-none"
                value={selectedService}
                onChange={(e) => setSelectedService(e.target.value)}
            >
                <option>Select Token</option>
                {tokens.map((token) => (
                    <option key={token.id} value={token.id}>
                        {token.services.join(', ')}
                    </option>
                ))}
            </select>
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 border border-gray-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 space-y-2 sm:space-y-0">
                    <h3 className="text-base sm:text-lg font-semibold text-black flex items-center">
                        <Hash className="w-4 h-4 sm:w-5 sm:h-5 mr-2 text-blue-800" />
                        Token Management
                    </h3>
                    <div className="flex space-x-2">

                        <button onClick={nextToken} className="bg-blue-800 text-white px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-blue-900 transition-colors">
                            Next Token
                        </button>
                        <button className="bg-gray-700 text-white px-3 py-2 rounded-lg text-xs sm:text-sm hover:bg-gray-800 transition-colors">
                            + New
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                    <div className="text-center p-2 sm:p-3 bg-blue-50 rounded-lg border border-blue-200">
                        <div className="text-lg sm:text-2xl font-bold text-blue-800">{tokenData.current}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Current</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-lg sm:text-2xl font-bold text-red-700">{tokenData.next - tokenData.current - 1}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Waiting</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                        <div className='text-lg sm:text-2xl font-bold text-gray-700'>{tokenData.next - 1}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Total Today</div>
                    </div>
                    <div className="text-center p-2 sm:p-3 bg-white rounded-lg border border-gray-200">
                        <div className="text-lg sm:text-2xl font-bold text-gray-700">{tokenData.waitTime}</div>
                        <div className="text-xs sm:text-sm text-gray-600">Avg Wait</div>
                    </div>
                </div>

                <div className="space-y-2 sm:space-y-3">
                    {(showAllTokens ? allTokens : allTokens.slice(0, 2)).map((token) => (
                        <div key={token.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border-2 transition-all space-y-2 sm:space-y-0 ${token.queueNumber === tokenData.current
                            ? 'border-blue-800 bg-blue-50'
                            : 'border-gray-200 hover:border-gray-300'
                            }`}>
                            <div className="flex items-center space-x-3 sm:space-x-4">
                                <div className={`bg-blue-900 w-8 h-8 sm:w-12 sm:h-12 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base ${token.queueNumber === tokenData.current ? 'bg-blue-800' : 'bg-white0'
                                    }`}>
                                    {token.queueNumber}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h4 className="font-medium text-black text-sm sm:text-base truncate">{token.customerName}</h4>
                                    <p className="text-xs sm:text-sm text-gray-600 truncate">{token.customerPhone}</p>
                                </div>
                            </div>

                            <div className="flex items-center justify-between sm:justify-end space-x-3 sm:space-x-4">
                                {token.queueNumber === tokenData.current ? (
                                    <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-blue-800" />
                                ) : (
                                    <Clock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                                )}
                            </div>
                        </div>
                    ))}

                    {allTokens.length > 2 && (
                        <button
                            onClick={() => setShowAllTokens(!showAllTokens)}
                            className="w-full text-center py-2 text-blue-800 hover:bg-blue-50 rounded-lg transition-colors flex items-center justify-center text-sm"
                        >
                            <Eye className="w-4 h-4 mr-2" />
                            {showAllTokens ? 'Show Less' : `Show All (${allTokens.length})`}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ManageToken
