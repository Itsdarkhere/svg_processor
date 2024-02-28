import { useRef, useState } from "react";
import { useActions } from "../../ActionsProvider/ActionsProvider";

export default function Sections({ 
    data, 
    setData,
    shouldSelectSeat,
    activeMapAction, 
    activeTab, 
    activeSpot
}) {

    const { selectingIndex, setSectionsInFloor, hex } = useActions();

    const getSectionFill = (section) => {
        if (activeMapAction === 4 && activeTab === 'scaling') {
            return section?.hotspotFill;
        }
        if (section?.selected) {
            return section?.floorfill || 'blue';
        }
        if (activeTab === 'scaling') {
            return "#E6E8EC"; // 'rgba(177, 181, 195, 1)'
        }
        return section?.fill; // section?.inventoryFill || openOffer?.color
    }

    const handleSectionAction = (sectionId, filter) => {
        if (activeMapAction === 4) return;

        let updatedData = { ...data };
        applyFilterToSection(sectionId, filter, updatedData.rows, updatedData.seats);

        setData(updatedData);
    }

    const applyFilterToSection = (sectionId, filter, rows, seats) => {
        let allAssigned = true;
        const section = data.sections[sectionId];

        // Get targetRows and check if section is allAssigned
        const targetRows = section.rows.map((rowId) => {
            const row = rows[rowId];

            let assignedTarget = row?.allAssigned;
            if (activeTab === 'inventory') {
                assignedTarget = row.inventoryAllAssigned
            }

            if (!assignedTarget) allAssigned = false;

            return row;
        });

        // Apply allAssigned
        if (activeTab === 'inventory') {
            section.inventoryAllAssigned = allAssigned;
        } else {
            section.allAssigned = allAssigned;
        }

        targetRows.forEach(row => {
            row.seats.forEach(seatId => {
                const seat = seats[seatId];
                if (seat && shouldSelectSeat(seat, allAssigned)) {
                    seat.filter = filter;
                }
            });
        });

        // Apply filter to non-zoomable section
        if (targetRows.length === 0) {
            // console.log("No Rows");
            section.filter = filter;
        }
    };

    const [selectedSections, setSelectedSections] = useState([]);

    const handleSectionSelect = (section) => {
        if (activeMapAction === 4) return;

        let updatedData = { ...data };
        if (!selectedSections.includes(section.sectionId)) {
            let seatIds = [];
            // Handle GA and seated differently
            if (section?.zoomable) {
                // seated
                seatIds = getSeatIdsForZoomableSection(section, updatedData.rows, updatedData.seats);
            } else {
                // ga section
                getSeatIdsForNonZoomableSection(section, updatedData.sections);
            }

            setSectionsInFloor((prev) => {
                // Creating a copy of the array for immutability
                const updatedSections = [...prev];
            
                // Check if the section for the selectingIndex exists
                if (updatedSections[selectingIndex]) {
                    // Check if the sectionId is already in the array
                    if (!updatedSections[selectingIndex].includes(section.sectionId)) {
                        updatedSections[selectingIndex].push(section.sectionId);
                    }
                } else {
                    // Create a new array with the sectionId at the selectingIndex
                    updatedSections[selectingIndex] = [section.sectionId];
                }
                
                // Return the updated array
                return updatedSections;
            });

            setSelectedSections(prev => [...prev, section.sectionId]);
            setData(updatedData);
        }
    };

    const getSeatIdsForZoomableSection = (section, rows, seats) => {
        let assignedTarget = section.allAssigned;
        if (activeTab === 'inventory') {
            assignedTarget = section.inventoryAllAssigned;
        }

        return Object.values(rows)
            .filter(row => row.sectionId === section.sectionId)
            .flatMap(row => row.seats)
            .filter(seatId => {
                if (!seats[seatId]) return false;
                if (shouldSelectSeat(seats[seatId], assignedTarget)) {
                    seats[seatId].selected = true;
                    seats[seatId].floorfill = hex[selectingIndex];
                    return true;
                }
                return false;
            });
    };

    const getSeatIdsForNonZoomableSection = (section, sections) => {
        sections[section.sectionId].selected = !sections[section.sectionId].selected;
        sections[section.sectionId].floorfill = hex[selectingIndex];
    };

    return (
        <g className='polygons'>
            {data?.sections && Object.values(data.sections).map((section) => {
                return section?.zoomable ? (
                    <g key={section.sectionId}>
                        {/* Section, just used for the click to select all seats of a section */}
                        <path
                            d={section.path}
                            id={section.sectionId}
                            fill={getSectionFill(section)}
                            onClick={() => handleSectionSelect(section)}
                            onMouseOver={() => handleSectionAction(section.sectionId, 'brightness(0.8)')}
                            onMouseOut={() => handleSectionAction(section.sectionId, undefined)}
                            style={{
                                pointerEvents: activeMapAction === 1 ? "all" : "none",
                            }}
                            opacity={activeSpot === 'sections' ? 1 : 0}
                            className={`path`}
                        ></path>
                    </g>
                ) : (
                    <GASection
                        key={section?.sectionId}
                        section={section}
                        getSectionFill={getSectionFill}
                        handleSectionAction={handleSectionAction}
                        handleSectionSelect={handleSectionSelect}
                        activeMapAction={activeMapAction}
                        activeTab={activeTab}
                    />
                );
            })}
        </g>
    )
}

function GASection({ 
    getSectionFill, 
    section, 
    handleSectionAction, 
    handleSectionSelect, 
    activeMapAction, 
}) {

    const visualRef = useRef();

    return (
        <g>
            {/* Section */}
            <path
                fill={getSectionFill(section)}
                d={section.path}
                className={`path`}
                onClick={() => handleSectionSelect(section)}
                onMouseOver={() => handleSectionAction(section.sectionId, 'brightness(0.8)')}
                onMouseOut={() => handleSectionAction(section.sectionId, undefined)}
                style={{
                    pointerEvents: activeMapAction === 4 ? "none" : "all",
                }}
                filter={section?.filter}
                id={section.sectionId}
            ></path>
            {/* Visuals, probably text */}
            <path ref={visualRef} className="path_non_visual" d={section?.identifier?.path}></path>
        </g>
    )
}