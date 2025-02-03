import React, { createContext, useCallback, useEffect, useState } from 'react';
import { getDiariesExistence } from '../services/api';

export const DiariesExistenceContext = createContext();

export const DiariesExistenceProvider = ({ children }) => {
    const [diariesExistence, setDiariesExistence] = useState([]);

    const fetchDiariesExistence = useCallback(async () => {
        try {
            const response = await getDiariesExistence();
            if (response?.data) {
                setDiariesExistence({ ...response.data });
            } else {
                // setDiariesExistence({});
            }
        } catch (err) {
            console.error("Error fetching diary:", err);
            // handleUpdateDiaryState('error', "Failed to fetch diary. Please try again later.");
        } finally {
            // handleUpdateDiaryState('loading', false);
        }
    }, []);

    useEffect(() => {
        fetchDiariesExistence();
    }, [fetchDiariesExistence]);

    return (
        <DiariesExistenceContext.Provider value={{ diariesExistence, setDiariesExistence }}>
            {children}
        </DiariesExistenceContext.Provider>
    );
};