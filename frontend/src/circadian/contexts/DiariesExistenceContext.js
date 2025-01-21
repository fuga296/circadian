import React, { createContext, useState } from 'react';

export const diariesExistenceContext = createContext();

export const DiariesExistenceProvider = ({ children }) => {
    const [diariesExistence, setDiariesExistence] = useState([]);
    return (
        <diariesExistenceContext.Provider value={{ diariesExistence, setDiariesExistence }}>
            {children}
        </diariesExistenceContext.Provider>
    );
};