// Centralized API configuration
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

// Create axios instance with default config
const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add auth token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('businessToken') || localStorage.getItem('MemberToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('businessToken');
            localStorage.removeItem('MemberToken');
            window.location.href = '/business/login';
        }
        return Promise.reject(error);
    }
);

export default api;

// API endpoints
export const endpoints = {
    // Business endpoints
    business: {
        register: '/business/register',
        login: '/business/login',
        services: '/business/services',
        addService: '/business/addService',
        removeService: '/business/removeService',
        members: '/business/members',
        addMember: '/business/addmember',
        tokens: '/business/tokens',
        addToken: '/business/addtoken',
        uploadProfile: '/business/uploadprofile',
    },
    // Admin endpoints
    admin: {
        categories: '/admin/categories',
        addCategory: '/admin/addcategory',
        updateCategory: '/admin/updateacategory',
        toggleActive: '/admin/toggleactive',
        subCategories: '/admin/subcategories',
        addSubCategory: '/admin/addsubcategory',
    },
    // User endpoints
    user: {
        listing: (category) => `/listing/${category}`,
        businessProfile: (id) => `/businessprofile/${id}`,
        bookToken: '/booktoken',
        tokenStatus: (id) => `/token/${id}`,
        tokenStream: (id) => `/tokenstream/${id}`,
    },
};