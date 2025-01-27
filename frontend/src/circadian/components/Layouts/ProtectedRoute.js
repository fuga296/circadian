import { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { APP_NAME } from '../../config/app';

const ProtectedRoute = ({ element }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(null);

    useEffect(() => {
        const accessToken = localStorage.getItem('access_token');
        if (accessToken) {
            try {
                const decodedToken = jwtDecode(accessToken);
                const currentTime = Date.now() / 1000;
                if (decodedToken.exp > currentTime) {
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch {
                setIsAuthenticated(false);
            }
        } else {
            setIsAuthenticated(false);
        }
    }, []);

    if (isAuthenticated === null) {
        return null
    }

    return isAuthenticated ? element : <Navigate to={`/${APP_NAME}/auth/login`} />
};

export default ProtectedRoute;