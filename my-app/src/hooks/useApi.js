// Custom hook for API calls with loading and error states
import { useState, useCallback } from 'react';
import api from '../utils/api';
import { handleApiError } from '../utils/helpers';

export const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const execute = useCallback(async (apiCall) => {
        try {
            setLoading(true);
            setError(null);
            const response = await apiCall();
            return response.data;
        } catch (err) {
            const errorMessage = handleApiError(err);
            setError(errorMessage);
            throw new Error(errorMessage);
        } finally {
            setLoading(false);
        }
    }, []);

    return { execute, loading, error, setError };
};

// Specific API hooks
export const useBusinessApi = () => {
    const { execute, loading, error } = useApi();

    const login = useCallback((credentials) => 
        execute(() => api.post('/business/login', credentials)), [execute]);

    const getServices = useCallback(() => 
        execute(() => api.get('/business/services')), [execute]);

    const addService = useCallback((service) => 
        execute(() => api.post('/business/addService', { service })), [execute]);

    const getMembers = useCallback(() => 
        execute(() => api.get('/business/members')), [execute]);

    const addMember = useCallback((member) => 
        execute(() => api.post('/business/addmember', member)), [execute]);

    return {
        login,
        getServices,
        addService,
        getMembers,
        addMember,
        loading,
        error,
    };
};