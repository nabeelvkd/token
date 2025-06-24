import axios from 'axios';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Clock } from 'lucide-react'

function Token({ services, selectedService, setSelectedService, tokenData, setTokenData }) {

    const [showForm, setShowForm] = useState(false);
    const [formData, setFormData] = useState({ name: '', mobile: '' });
    const [isAnimating, setIsAnimating] = useState(false);
    const location = useLocation();

    const pathParts = location.pathname.split('/');
    const businessId = pathParts[pathParts.length - 1];

    useEffect(() => {
        if (selectedService === "Select a Token" || !selectedService) return;

        const fetchTokenStatus = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/token/${selectedService}`);
                setTokenData(response.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchTokenStatus();
    }, [selectedService]);

    useEffect(() => {
        if (selectedService === "Select a Token" || !selectedService) return;

        const eventSource = new EventSource(`http://localhost:5000/tokenstream/${selectedService}`);

        eventSource.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log(data)
            setIsAnimating(true);
            setTokenData({
                current: data.currentToken,
                next: data.nextToken,
                status:data.status,
                waitTime: data.waitTime || tokenData.waitTime,
            });
            setTimeout(() => setIsAnimating(false), 1000);
        };

        eventSource.onerror = (err) => {
            console.error("EventSource failed:", err);
            eventSource.close();
        };

        return () => {
            eventSource.close(); // Clean up
        };
    });

    const handleBookToken = () => {
        setShowForm(true);
    };

    const handleFormSubmit = (e) => {
        e.preventDefault();

        axios.post("http://localhost:5000/booktoken", {
            tokenId: selectedService,
            businessId,
            ...formData
        }).then((response) => {
            setTokenData(prev => ({
                ...prev,
                next: prev.next + 1
            }));

        }).catch((error) => {
            console.error("Error booking token:", error.response?.data || error.message);
        });

        console.log('Booking Token:', { selectedService, businessId, ...formData });

        setShowForm(false);
        setFormData({ name: '', mobile: '' });
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div>
            <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-semibold text-gray-900 flex items-center">
                        <Clock className="w-6 h-6 mr-3 text-blue-600" />
                        Queue Status
                    </h2>
                    <span className={`text-white p-2 rounded-full animate-pulse ${tokenData.status ? 'bg-green-600' : 'bg-red-600'}`}>
                        
                    </span>
                </div>

                <select
                    className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-700 mb-8 focus:border-blue-800 focus:outline-none"
                    value={selectedService}
                    onChange={(e) => setSelectedService(e.target.value)}
                >
                    {services.map((token) => (
                        <option key={token.id} value={token.id}>
                            {token.services.join(', ')}
                        </option>
                    ))}
                </select>

                <div className="grid grid-cols-3 gap-6 mb-8">
                    <div className="text-center p-6 border-2 border-gray-300 rounded-xl">
                        <div className={`text-gray-900 text-4xl font-bold text-green-500 mb-2 ${isAnimating ? 'token-update' : ''}`}>
                            {tokenData.current}
                        </div>
                        <div className="text-gray-600 text-sm uppercase tracking-wide">Current Token</div>
                    </div>
                    <div className="text-center p-6 border-2 border-gray-300 rounded-xl">
                        <div className="text-gray-900 text-4xl font-bold text-blue-600 mb-2">
                            {tokenData.next}
                        </div>
                        <div className="text-gray-600 text-sm uppercase tracking-wide">Next Token</div>
                    </div>
                    <div className="text-center p-6 border-2 border-gray-300 rounded-xl">
                        <div className="text-gray-900 text-4xl font-bold mb-2 text-red-600">
                            {tokenData.waitTime}
                        </div>
                        <div className="text-gray-600 text-sm uppercase tracking-wide">Wait Time</div>
                    </div>
                </div>

                <button
                    className={`w-full text-white p-4 rounded-lg text-lg font-medium uppercase tracking-wide transition-colors ${tokenData.status ? 'bg-blue-800 hover:bg-blue-600' : 'bg-gray-400'}`}
                    onClick={handleBookToken}
                    disabled={!tokenData.status}
                >
                    Book Token
                </button>

            </div>

            {showForm && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
                        <h3 className="text-xl font-semibold text-gray-900 mb-4">Book Your Token</h3>
                        <form onSubmit={handleFormSubmit}>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter your name"
                                    required
                                />
                            </div>
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">Mobile Number</label>
                                <input
                                    type="tel"
                                    name="mobile"
                                    value={formData.mobile}
                                    onChange={handleInputChange}
                                    className="w-full p-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none"
                                    placeholder="Enter mobile number"
                                    pattern="[0-9]{10}"
                                    title="Please enter a 10-digit mobile number"
                                    required
                                />
                            </div>
                            <div className="flex justify-end gap-4">
                                <button
                                    type="button"
                                    onClick={() => setShowForm(false)}
                                    className="bg-gray-500 text-white p-2 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="bg-blue-500 text-white p-2 rounded-lg hover:bg-blue-600 transition-colors"
                                >
                                    Submit
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
            <style>
                {`
          @keyframes tokenUpdate {
            0% { transform: scale(1); opacity: 0.8; }
            50% { transform: scale(1.2); opacity: 1; }
            100% { transform: scale(1); opacity: 0.8; }
          }
          .token-update {
            animation: tokenUpdate 0.8s ease-in-out;
          }
        `}
            </style>
        </div>
    );
}

export default Token;