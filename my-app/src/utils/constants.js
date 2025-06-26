// Application constants
export const DAYS_OF_WEEK = [
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

export const DISTANCE_OPTIONS = [
    { value: 5, label: 'Within 5 km' },
    { value: 10, label: 'Within 10 km' },
    { value: 25, label: 'Within 25 km' },
    { value: 50, label: 'Within 50 km' },
];

export const SORT_OPTIONS = [
    { value: 'name', label: 'Sort by Name' },
    { value: 'distance', label: 'Sort by Distance' },
    { value: 'rating', label: 'Sort by Rating' },
];

export const TOKEN_STATUS = {
    WAITING: 'waiting',
    CALLED: 'called',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

export const APPOINTMENT_STATUS = {
    CONFIRMED: 'confirmed',
    PENDING: 'pending',
    COMPLETED: 'completed',
    CANCELLED: 'cancelled',
};

export const DEFAULT_COORDINATES = {
    latitude: 11.2535,
    longitude: 75.7819,
};

export const GEOAPIFY_API_KEY = 'e9b286ae30d24252abd8e78a4913452e';