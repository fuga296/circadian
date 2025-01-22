import React, { createContext, useCallback, useEffect, useState } from 'react';
import { getDiaryBlocks } from '../services/api';
import { removeDuplicate } from '../utils/diary';

export const DiariesContext = createContext({
    diaries: null,
    setDiaries: () => {},
});

export const DiariesProvider = ({ children }) => {
    const [diaries, setDiaries] = useState([]);

    const fetchDiaries = useCallback(async () => {
        try {
            const response = await getDiaryBlocks(1);
            if (response?.data) {
                setDiaries(prev => removeDuplicate([ ...prev, ...response.data ], "date"));
            } else {
                // a
            }
        } catch (err) {
            console.error("Error fetching diary:", err);
            // handleUpdateDiaryState('error', "Failed to fetch diary. Please try again later.");
        } finally {
            // handleUpdateDiaryState('loading', false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        fetchDiaries();
    }, [fetchDiaries])

    return (
        <DiariesContext.Provider value={{ diaries, setDiaries }}>
            {children}
        </DiariesContext.Provider>
    );
};