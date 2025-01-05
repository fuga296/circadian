import React from 'react';
import LogoutComponent from '../components/Logout/LogoutComponent';
import ContentLayout from '../components/layouts/ContentLayout';

const Logout = () => {

    const handleLogout = () => {
    }

    return (
        <ContentLayout
            header={<></>}
            main={
                <LogoutComponent
                    handleLogout
                />
            }
        />
    );
};

export default Logout;