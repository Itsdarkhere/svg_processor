import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { DraggableSpot } from './DraggableSpot';
import '../SeatMap/seatMap.scss'
import { ToolBar } from '@/components/AdminMap/ActionsProvider/ToolBar';

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
    const [activeMapAction, setActiveMapAction] = useState(1);
    const [scale, setScale] = useState(1);
    const [activeSpot, setActiveSpot] = useState("seats");
    const [selectingIndex, setSelectingIndex] = useState(0);
    const [settingIndex, setSettingIndex] = useState(0);
    const [settingStuff, setSettingStuff] = useState([true]);
    const [floors, setFloors] = useState(1);
    const [sectionsInFloor, setSectionsInFloor] = useState([]);
    const [hex, setHex] = useState([
       ' #c82264',
       ' #32f5bf',
       ' #f97b0a',
       ' #2fd7c9',
       ' #5478f1',
       ' #8bdde7',
       ' #976c4e',
        '#ce486e',
        '#d82d91',
        '#29873e',
    ])
    const [allDone, setAllDone] = useState(false);

    useEffect(() => {
        if (!cursorRef.current) return;
        cursorRef.current.style.top = "50%"
        cursorRef.current.style.left = "50%"
        cursorRef.current.style.transform = "translate(-50%, -50%)"
    }, [activeMapAction])

    const continueSelecting = () => {
        if (selectingIndex === floors - 1) {
            setAllDone(true);
            setActiveMapAction(4);
            return;
        }
        setSelectingIndex(selectingIndex + 1);
    }

    const continueSetting = () => {
        if (settingIndex === floors - 1) return;
        setSettingIndex(settingIndex + 1);
    }

    const allSectionsSelected = () => {
        const allSelectedSections = sectionsInFloor.flatMap(sectionArray => sectionArray);
        const allExistingSections = Object.keys(data.sections);
        return allSelectedSections.length === allExistingSections.length;
    };

    const isSelectContinueDisabled = (index) => {
        const selectingOtherFloor = selectingIndex !== index;
        const noSectionsInFloor = !sectionsInFloor[index];
        if (selectingIndex === floors - 1) {
            return selectingOtherFloor || noSectionsInFloor || !allSectionsSelected();
        }
        return selectingOtherFloor || noSectionsInFloor;
    }

    const hasSetHotspotForIndex = () => {
        settingStuff[settingIndex] = false;
        if (settingIndex === floors - 1) {
            setHotspotSet(true);
        }
    }

    const isContinueSettingDisabled = (index) => {
        if (settingIndex !== index || settingIndex === floors - 1) return true;
        if (index >= 0 && index < settingStuff.length) {
            return settingStuff[index];
        }
        return true;
    }

    return (
        <ActionsContext.Provider value={{ svgRef, setScale, zoomRef, activeMapAction, activeSpot, setFloors, selectingIndex, setSectionsInFloor, hex }}>
            {activeMapAction === 4 && <div className="flex flex-row items-center gap-3 justify-center w-full">
                <button onClick={() => setActiveSpot("seats")} className={`${activeSpot === 'seats' ? 'bg-indigo-700 text-white' : 'text-zinc-950 bg-white'} active:scale-95 rounded-lg px-5 py-2`}>Seats</button>
                <button onClick={() => setActiveSpot("rows")} className={`${activeSpot === 'rows' ? 'bg-indigo-700 text-white' : 'text-zinc-950 bg-white'} active:scale-95 rounded-lg px-5 py-2`}>Rows</button>
                <button onClick={() => setActiveSpot("sections")} className={`${activeSpot === 'sections' ? 'bg-indigo-700 text-white' : 'text-zinc-950 bg-white'} active:scale-95 rounded-lg px-5 py-2`}>Sections</button>
            </div>}
            {!allDone && Array.from({ length: floors }, (_, i) => i + 1).map((floor, index) => {
                return (
                    <div key={index} className={`${selectingIndex === index && 'ring-4 ring-indigo-600'} p-5 bg-white text-zinc-800 rounded-lg flex flex-row justify-between`}>
                        <div className='flex flex-col text-start max-w-lg'>
                            <h6 className=''>Select sections in floor {index}</h6>
                            <div>Selected: </div>
                            <div className='flex flex-row gap-2 flex-wrap mt-6'>
                                {sectionsInFloor[index] ? 
                                    sectionsInFloor[index].map((section, sectionIndex) => (
                                        <span className=' px-4 py-1 rounded-md text-white' style={{ backgroundColor: hex[index]}} key={sectionIndex}>{section}</span> // Assuming 'section' is a string or number
                                    )) : ' None'
                                }
                            </div>
                        </div>
                        <button onClick={continueSelecting} disabled={isSelectContinueDisabled(index)} className='px-5 py-2 disabled:bg-gray-300 bg-indigo-600 rounded-md text-white'>Ready?</button>
                    </div>
                )
            })}
            {allDone && Array.from({ length: floors }, (_, i) => i + 1).map((floor, index) => {
                return (
                    <div key={index} className={`${settingIndex === index && 'ring-4 ring-indigo-600'} p-5 bg-white text-zinc-800 rounded-lg flex flex-row items-center justify-between`}>
                        <h3 className="text-xl uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">PLACE HOTSPOT FOR FLOOR {index}</h3>
                        <button onClick={continueSetting} disabled={isContinueSettingDisabled(index)} className='px-5 py-2 disabled:bg-gray-300 bg-indigo-600 rounded-md text-white'>Continue?</button>
                    </div>
                )
            })}
            <div id="mapp" ref={mapRef} className={`cursor-pointer ${dragging && 'indicate-drag'}`}>
                {children}
                {activeMapAction === 4 &&  
                    <DraggableSpot 
                        data={data}
                        setData={setData}
                        svgRef={svgRef}
                        dragging={dragging} 
                        setDragging={setDragging} 
                        activeMapAction={activeMapAction} 
                        hasSetHotspotForIndex={hasSetHotspotForIndex}
                        cursorRef={cursorRef} 
                        mapRef={mapRef} 
                        targetSections={sectionsInFloor[settingIndex]}
                    />
                }
            </div>
        </ActionsContext.Provider>
    );
};