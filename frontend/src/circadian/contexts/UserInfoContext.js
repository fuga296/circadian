import React, { createContext, useCallback, useEffect, useState } from 'react';
import { getUserInfo } from '../services/api';

export const UserInfoContext = createContext({
    userInfo: null,
    setUserInfo: () => {},
});

export const UserInfoProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
    });

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await getUserInfo();
            if (response?.data) {
                const { username, email } = response.data;
                setUserInfo({ username, email });
            } else {
                setUserInfo(prev => ({ ...prev }));
            }
        } catch (err) {
            console.error("Error fetching diary:", err);
            // handleUpdateDiaryState('error', "Failed to fetch diary. Please try again later.");
        } finally {
            // handleUpdateDiaryState('loading', false);
        }
    }, []);

    useEffect(() => {
        fetchUserInfo();
    }, [fetchUserInfo]);


    return (
        <UserInfoContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </UserInfoContext.Provider>
    );
};