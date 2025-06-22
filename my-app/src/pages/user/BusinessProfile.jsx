import React, { useState, useEffect } from 'react';
import HomeNavbar from "../../components/user/HomeNavbar"
import { Star, Calendar, Clock, MapPin, User, MessageSquare, Plus } from 'lucide-react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import Token from '../../components/user/token';

export default function BusinessProfile() {
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedSlot, setSelectedSlot] = useState('');
    const [appointmentNotes, setAppointmentNotes] = useState('');
    const [services,setServices] = useState([])
    const [reviewForm, setReviewForm] = useState({
        rating: 0,
        comment: '',
        name: ''
    });
    const [business,setBusiness]=useState({
        name:'',
        address:''
    })
    const location = useLocation()

    useEffect(() => {
        let ignore = false;

        axios.get(`http://localhost:5000/businessprofile${location.pathname}`)
            .then((response) => {
                if (!ignore) {
                    setBusiness(response.data.business);
                    setServices(response.data.tokens);
                }
            });

        return () => { ignore = true; };
    }, []);

    const [reviews, setReviews] = useState([
        {
            id: 1,
            name: 'Sarah Johnson',
            rating: 5,
            comment: 'Excellent service! Tony did an amazing job with my haircut.',
            date: '2024-06-15'
        },
        {
            id: 2,
            name: 'Mike Chen',
            rating: 4,
            comment: 'Great experience, very professional staff.',
            date: '2024-06-10'
        }
    ]);

    const timeSlots = [
        { time: '9:00 AM', available: true },
        { time: '9:30 AM', available: false },
        { time: '10:00 AM', available: true },
        { time: '10:30 AM', available: true },
        { time: '11:00 AM', available: false },
        { time: '11:30 AM', available: true },
        { time: '12:00 PM', available: true },
        { time: '12:30 PM', available: false },
        { time: '1:00 PM', available: true },
        { time: '1:30 PM', available: true },
        { time: '2:00 PM', available: false },
        { time: '2:30 PM', available: true },
        { time: '3:00 PM', available: true },
        { time: '3:30 PM', available: true },
        { time: '4:00 PM', available: false },
        { time: '4:30 PM', available: true },
        { time: '5:00 PM', available: true },
        { time: '5:30 PM', available: false }
    ];

    const handleAppointmentBook = () => {
        if (!selectedDate || !selectedSlot) {
            alert('Please select both date and time slot');
            return;
        }
        alert(`Appointment booked for ${selectedDate} at ${selectedSlot}`);
        setSelectedDate('');
        setSelectedSlot('');
        setAppointmentNotes('');
    };

    const handleReviewSubmit = () => {
        if (reviewForm.rating === 0) {
            alert('Please select a rating');
            return;
        }
        if (!reviewForm.comment.trim()) {
            alert('Please write a review comment');
            return;
        }
        const newReview = {
            id: reviews.length + 1,
            name: reviewForm.name || 'Anonymous',
            rating: reviewForm.rating,
            comment: reviewForm.comment,
            date: new Date().toISOString().split('T')[0]
        };
        setReviews([newReview, ...reviews]);
        setReviewForm({ rating: 0, comment: '', name: '' });
        alert('Review submitted successfully!');
    };

    const renderStars = (rating, interactive = false, onStarClick = null) => {
        return (
            <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-4 h-4 mr-1 ${star <= rating
                            ? 'text-yellow-400 fill-yellow-400'
                            : 'text-gray-300'
                            } ${interactive ? 'cursor-pointer hover:text-yellow-400' : ''}`}
                        onClick={interactive ? () => onStarClick(star) : undefined}
                    />
                ))}
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-white font-sans">
            <HomeNavbar />
            
            <div className="max-w-6xl mx-auto p-6">

                {/* Header */}
                <div className="bg-white border border-gray-200 rounded-xl p-8 mb-8 shadow-sm">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-6">
                            <div className="w-16 h-16 bg-blue-500 rounded-xl flex items-center justify-center">
                                <User className="w-8 h-8 text-white" />
                            </div>
                            <div>
                                <h1 className="text-3xl font-light text-gray-900 mb-2">{business.name}</h1>
                                <p className="text-gray-600 mb-3">Premium Hair Salon & Styling</p>
                                <div className="flex items-center text-gray-500">
                                    <MapPin className="w-4 h-4 mr-2" />
                                    <span>{business.address}</span>
                                </div>
                            </div>
                        </div>
                        <div className="flex items-center space-x-2">
                            {renderStars(4)}
                            <span className="text-gray-600 font-medium">4.0</span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column */}
                    <div className="lg:col-span-2 space-y-8">

                        {/* Token Section */}
                        <Token services={services}/>

                        {/* Appointment Section */}
                        <div className="bg-white border border-gray-200 rounded-xl p-8 shadow-sm">
                            <h2 className="text-2xl font-light text-gray-900 mb-6 flex items-center">
                                <Calendar className="w-6 h-6 mr-3 text-blue-500" />
                                Book Appointment
                            </h2>

                            <div className="mb-8">
                                <label className="block text-gray-700 font-medium mb-4 uppercase tracking-wide text-sm">Select Date</label>
                                <input
                                    type="date"
                                    className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
                                    value={selectedDate}
                                    onChange={(e) => setSelectedDate(e.target.value)}
                                />
                            </div>

                            {selectedDate && (
                                <div className="mb-8">
                                    <label className="block text-gray-700 font-medium mb-4 uppercase tracking-wide text-sm">Available Slots</label>
                                    <div className="grid grid-cols-4 sm:grid-cols-6 gap-3 mb-6">
                                        {timeSlots.map((slot) => (
                                            <button
                                                key={slot.time}
                                                onClick={() => slot.available && setSelectedSlot(slot.time)}
                                                disabled={!slot.available}
                                                className={`p-3 text-sm font-medium rounded-lg transition-colors ${slot.available
                                                    ? selectedSlot === slot.time
                                                        ? 'bg-blue-500 text-white'
                                                        : 'border border-gray-300 text-gray-700 hover:border-gray-400'
                                                    : 'border border-gray-200 text-gray-400 cursor-not-allowed'
                                                    }`}
                                            >
                                                {slot.time}
                                            </button>
                                        ))}
                                    </div>
                                    <div className="flex items-center space-x-8 text-sm text-gray-600">
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 border border-gray-300 rounded mr-2"></div>
                                            <span>Available</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 border border-gray-200 bg-gray-100 rounded mr-2"></div>
                                            <span>Booked</span>
                                        </div>
                                        <div className="flex items-center">
                                            <div className="w-4 h-4 bg-blue-500 rounded mr-2"></div>
                                            <span>Selected</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {selectedSlot && (
                                <div className="mb-8">
                                    <label className="block text-gray-700 font-medium mb-4 uppercase tracking-wide text-sm">Notes</label>
                                    <textarea
                                        className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
                                        rows="3"
                                        placeholder="Special requests or preferences..."
                                        value={appointmentNotes}
                                        onChange={(e) => setAppointmentNotes(e.target.value)}
                                    ></textarea>
                                </div>
                            )}

                            <button
                                onClick={handleAppointmentBook}
                                disabled={!selectedDate || !selectedSlot}
                                className={`w-full p-4 rounded-lg text-lg font-medium uppercase tracking-wide transition-colors ${selectedDate && selectedSlot
                                    ? 'bg-blue-500 text-white hover:bg-blue-600'
                                    : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                                    }`}
                            >
                                {selectedDate && selectedSlot
                                    ? `Confirm Appointment`
                                    : 'Select Date & Time'
                                }
                            </button>
                        </div>
                    </div>

                    {/* Right Column */}
                    <div className="space-y-8">

                        {/* Add Review */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-xl font-light text-gray-900 mb-6 flex items-center">
                                <Plus className="w-5 h-5 mr-2 text-blue-500" />
                                Add Review
                            </h3>

                            <div className="space-y-4">
                                <input
                                    type="text"
                                    className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
                                    placeholder="Your name"
                                    value={reviewForm.name}
                                    onChange={(e) => setReviewForm({ ...reviewForm, name: e.target.value })}
                                />

                                <div>
                                    <label className="block text-gray-700 font-medium mb-3 uppercase tracking-wide text-sm">Rating</label>
                                    {renderStars(reviewForm.rating, true, (rating) => setReviewForm({ ...reviewForm, rating }))}
                                </div>

                                <textarea
                                    className="w-full p-4 border-2 border-gray-200 rounded-lg text-gray-700 focus:border-blue-500 focus:outline-none"
                                    rows="4"
                                    placeholder="Share your experience..."
                                    value={reviewForm.comment}
                                    onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                                ></textarea>

                                <button
                                    onClick={handleReviewSubmit}
                                    className="w-full bg-blue-500 text-white p-4 rounded-lg font-medium uppercase tracking-wide hover:bg-blue-600 transition-colors"
                                >
                                    Submit Review
                                </button>
                            </div>
                        </div>

                        {/* Reviews Display */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                            <h3 className="text-xl font-light text-gray-900 mb-6 flex items-center">
                                <MessageSquare className="w-5 h-5 mr-2 text-blue-500" />
                                Customer Reviews
                            </h3>

                            <div className="space-y-6 max-h-80 overflow-y-auto">
                                {reviews.map((review) => (
                                    <div key={review.id} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0">
                                        <div className="mb-3">
                                            <div className="font-medium text-gray-900 mb-1">{review.name}</div>
                                            <div className="flex items-center justify-between">
                                                {renderStars(review.rating)}
                                                <span className="text-xs text-gray-500 uppercase tracking-wide">{review.date}</span>
                                            </div>
                                        </div>
                                        <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}