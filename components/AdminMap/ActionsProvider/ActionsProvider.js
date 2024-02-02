import React, { createContext, useContext, useRef, useState } from 'react';
import { DraggableSpot } from './DraggableSpot';
import { SellOrder } from './SellOrder';
import { ZoomLevel } from './ZoomLevel';
import { ToolBar } from './ToolBar';
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
export const ActionsProvider = ({ children, data, setData, activeTab }) => {
    const svgRef = useRef(null);
    const zoomRef = useRef(null);
    const cursorRef = useRef(null);
    const mapRef = useRef(null);
    const [dragging, setDragging] = useState(false);
    const [activeMapAction, setActiveMapAction] = useState(3);
    const [scale, setScale] = useState(1);

    const toolbarSelect = (action) => {
        if (activeMapAction === action) {
            setActiveMapAction(0);
            return;
        }

        // Dont like double ifs, refactor
        if (action === 4) {
            cursorRef.current.style.top = "50%"
            cursorRef.current.style.left = "50%"
            cursorRef.current.style.transform = "translate(-50%, -50%)"
        }

        setActiveMapAction(action);
    }

    return (
        <ActionsContext.Provider value={{ svgRef, setScale, zoomRef, activeMapAction }}>
            <div id="mapp" ref={mapRef} className={`${activeMapAction === 4 && 'cursor-pointer'} ${dragging && 'indicate-drag'}`}>
                {children}
                <div className='controls-container'>
                    {activeTab === 'scaling' && <SellOrder active={activeMapAction === 4} toolbarSelect={toolbarSelect} />}
                    <ZoomLevel zoomRef={zoomRef} scale={scale} />
                </div>
                <ToolBar activeMapAction={activeMapAction} toolbarSelect={toolbarSelect} />
                {activeTab === 'scaling' && 
                    <DraggableSpot 
                        data={data}
                        setData={setData}
                        svgRef={svgRef}
                        dragging={dragging} 
                        setDragging={setDragging} 
                        activeMapAction={activeMapAction} 
                        cursorRef={cursorRef} 
                        mapRef={mapRef} 
                    />
                }
            </div>
        </ActionsContext.Provider>
    );
};