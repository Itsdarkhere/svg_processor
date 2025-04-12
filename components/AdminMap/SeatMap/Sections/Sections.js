import { useRef } from "react";

export default function Sections({ 
    data, 
    setData,
    shouldSelectSeat,
    activeMapAction, 
    activeTab, 
}) {

    const getSectionFill = (section) => {
        if (activeMapAction === 4 && activeTab === 'scaling') {
            return 'rgb(255, 0, 23)';
        }
        if (section?.selected) {
            return 'blue';
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
            console.log("ROW: ", row);

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

    const handleSectionSelect = (section) => {
        if (activeMapAction === 4) return;

        let updatedData = { ...data };
        let seatIds = [];
        // Handle GA and seated differently
        if (section?.zoomable) {
            // seated
            seatIds = getSeatIdsForZoomableSection(section, updatedData.rows, updatedData.seats);
        } else {
            // ga section
            getSeatIdsForNonZoomableSection(section, updatedData.sections);
        }

        setData(updatedData);
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
                    return true;
                }
                return false;
            });
    };

    const getSeatIdsForNonZoomableSection = (section, sections) => {
        sections[section.sectionId].selected = !sections[section.sectionId].selected;
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
                            onClick={() => handleSectionSelect(section)}
                            onMouseOver={() => handleSectionAction(section.sectionId, 'brightness(0.8)')}
                            onMouseOut={() => handleSectionAction(section.sectionId, undefined)}
                            style={{
                                opacity: 0,
                                pointerEvents: activeMapAction === 1 ? "all" : "none",
                            }}
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