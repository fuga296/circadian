import React, { createContext, useCallback, useEffect, useState } from 'react';
import { getUserInfo } from '../services/api';

export const userInfoContext = createContext();

export const UserInfoProvider = ({ children }) => {
    const [userInfo, setUserInfo] = useState({
        username: "",
        email: "",
    });

    const fetchUserInfo = useCallback(async () => {
        try {
            const response = await getUserInfo();
            if (response?.data) {
                setUserInfo({ ...response.data });
            } else {
                // setUserInfo({});
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
        <userInfoContext.Provider value={{ userInfo, setUserInfo }}>
            {children}
        </userInfoContext.Provider>
    );
};