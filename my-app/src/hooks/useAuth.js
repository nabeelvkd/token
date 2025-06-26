// Custom hook for authentication logic
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const useAuth = (tokenKey, redirectPath = '/business/login') => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem(tokenKey);

        if (!token) {
            navigate(redirectPath);
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                localStorage.removeItem(tokenKey);
                navigate(redirectPath);
            }
        } catch (error) {
            localStorage.removeItem(tokenKey);
            navigate(redirectPath);
        }
    }, [tokenKey, redirectPath, navigate]);
};

export const useBusinessAuth = () => useAuth('businessToken');
export const useMemberAuth = () => useAuth('MemberToken');