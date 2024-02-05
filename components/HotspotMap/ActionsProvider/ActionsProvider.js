import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { DraggableSpot } from './DraggableSpot';
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
export const ActionsProvider = ({ children, data, setData, setHotspotSet }) => {
    const svgRef = useRef(null);
    const zoomRef = useRef(null);
    const cursorRef = useRef(null);
    const mapRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [activeMapAction, setActiveMapAction] = useState(4);
    const [scale, setScale] = useState(1);

    useEffect(() => {
        cursorRef.current.style.top = "50%"
        cursorRef.current.style.left = "50%"
        cursorRef.current.style.transform = "translate(-50%, -50%)"
    }, [])

    return (
        <ActionsContext.Provider value={{ svgRef, setScale, zoomRef, activeMapAction }}>
            <div id="mapp" ref={mapRef} className={`cursor-pointer ${dragging && 'indicate-drag'}`}>
                {children}
                <DraggableSpot 
                    data={data}
                    setData={setData}
                    svgRef={svgRef}
                    dragging={dragging} 
                    setDragging={setDragging} 
                    activeMapAction={activeMapAction} 
                    setHotspotSet={setHotspotSet}
                    cursorRef={cursorRef} 
                    mapRef={mapRef} 
                />
            </div>
        </ActionsContext.Provider>
    );
};