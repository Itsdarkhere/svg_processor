'use client'
import React, { createContext, useContext, useRef, useState } from 'react';
import { ZoomLevel } from './ZoomLevel';
import '../SeatMap/seatMap.scss'

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
    const zoomRef = useRef(null);
    const [scale, setScale] = useState(1);

    return (
        <ActionsContext.Provider value={{ svgRef, setScale, zoomRef }}>
            <div id="map">
                {children}
                <div className='controls-container'>
                    <ZoomLevel zoomRef={zoomRef} scale={scale} />
                </div>
            </div>
        </ActionsContext.Provider>
    );
};