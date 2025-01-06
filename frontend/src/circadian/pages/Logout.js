import React from 'react';
import LogoutComponent from '../components/Logout/LogoutComponent';
import ContentLayout from '../components/layouts/ContentLayout';
import { logout } from '../services/auth';

const Logout = () => {

    const handleLogout = async () => {
        await logout();
        window.location.reload();
    };

    return (
        <ContentLayout
            header={<></>}
            main={
                <LogoutComponent
                    handleLogout={handleLogout}
                />
            }
        />
    );
};

export default Logout;