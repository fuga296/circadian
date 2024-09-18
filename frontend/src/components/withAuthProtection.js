import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const withAuthProtection = (Component) => {
    return (props) => {
        const { isAuthenticated } = useContext(AuthContext);

        if (!isAuthenticated) {
            return <Navigate to='/circadian/login' />;
        }

        return <Component {...props} />
    }
}

export default withAuthProtection