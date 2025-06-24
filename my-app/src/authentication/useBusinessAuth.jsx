import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {jwtDecode} from 'jwt-decode';

const useBusinessAuth = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('businessToken');

        if (!token) {
            navigate('/business/login');
            return;
        }

        try {
            const decoded = jwtDecode(token);
            const currentTime = Date.now() / 1000;

            if (decoded.exp < currentTime) {
                localStorage.removeItem('businessToken');
                navigate('/business/login');
            }
        } catch (error) {
            localStorage.removeItem('businessToken');
            navigate('/business/login');
        }
    }, []);
};

export default useBusinessAuth;
