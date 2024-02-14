import React, { createContext, useContext, useRef, useState } from 'react';
import '../SeatMap3/seatMap.scss'

// Create the context
export const ActionsContext = createContext(undefined);

export const useActions = () => {
    const context = useContext(ActionsContext);
    if (!context) {
        throw new Error('Context must be used within a ActionsProvider');
    }
    return context;
}

// Create the provider component
export const ActionsProvider = ({ children }) => {
    const svgRef = useRef(null);
    const activeMapAction = 3;

    return (
        <ActionsContext.Provider value={{ svgRef, activeMapAction }}>
            <div id="mappp">
                {children}
            </div>
        </ActionsContext.Provider>
    );
};