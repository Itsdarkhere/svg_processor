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
    const zoomRef = useRef(null);
    const mapRef = useRef(null);
    const [activeMapAction, setActiveMapAction] = useState(3);
    const [scale, setScale] = useState(1);

    return (
        <ActionsContext.Provider value={{ svgRef, setScale, zoomRef, activeMapAction }}>
            <div id="mappp" ref={mapRef}>
                {children}
            </div>
        </ActionsContext.Provider>
    );
};