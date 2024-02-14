import { useCallback } from "react";
const d3 = require("d3-scale");


export default function DraggableSpot({ data, setData, svgRef, dragging, setDragging, setHotspotSet, activeMapAction, cursorRef, mapRef }) {

    const HOTSPOT_COLORS = [
        "rgba(227, 81, 81, 1)",
        "rgba(84, 227, 141, 0.58)",
        "rgba(85, 227, 227, 0.71)",
        "rgba(86, 151, 227, 0.84)",
        "rgba(110, 81, 227, 1)",
    ];

    const COLOR_SCALE_DOMAIN = [0.2, 0.4, 0.6, 0.8, 1];

    const moveSPOTonDrag = useCallback((e) => {
        if (cursorRef.current) {
            const targetRect = mapRef.current.getBoundingClientRect();
            if (e.pageX === 0) return;
            cursorRef.current.style.top = `${e.pageY - targetRect.top}px`;
            cursorRef.current.style.left = `${e.pageX - targetRect.left}px`;
        }
    }, [cursorRef, mapRef])

    const setHotSpot = (event) => {
        if (activeMapAction !== 4 || !data?.seats) return;

        const hotspot = getHotSpot(event);
        const updatedData = computeDistancesAndColors(data, hotspot);

        setData(updatedData);
        setHotspotSet(true);
    };

    const handleDragEnd = useCallback((e) => {
        setDragging(false);
        setHotSpot(e);
    }, [setHotSpot])

    const getHotSpot = (event) => {
        const svg = svgRef.current;
        const pt = svg.createSVGPoint();
        pt.x = event.clientX;
        pt.y = event.clientY;
        const globalPoint = pt.matrixTransform(svg.getScreenCTM().inverse());

        return ({ x: globalPoint.x, y: globalPoint.y })
    }

    const computeDistancesAndColors = (data, hotspot) => {
        const newData = { ...data };
        const seatDistances = computeSeatDistances(newData, hotspot);
        assignColors(newData, seatDistances);

        return newData;
    }

    const computeSeatDistances = (data, hotspot) => {
        let distances = [];
        Object.values(data.seats).map((seat) => {
            const distance = euclideanDistance(seat, hotspot);
            seat.distance = distance;
            distances.push(distance);
        })

        return distances;
    }

    const computeRowSortOrder = (row, newData) => {
        let hotspotFill = null;
        let maxSortOrder = 10;
        Object.values(row.seats).forEach((seat) => {
           let targetSeat = newData.seats[seat];
            if (targetSeat.sortOrder < maxSortOrder) {
                maxSortOrder = targetSeat.sortOrder;
                hotspotFill = targetSeat.hotspotFill;
            }
        });

        return { sortOrder: maxSortOrder, hotspotFill };
    } 

    const computeSectionSortOrder = (section, newData) => {
        let hotspotFill = null;
        let maxSortOrder = 10;
        Object.values(section.rows).forEach((row) => {
           let targetRow = newData.rows[row];
            if (targetRow.sortOrder < maxSortOrder) {
                maxSortOrder = targetRow.sortOrder;
                hotspotFill = targetRow.hotspotFill;
            }
        });

        return { sortOrder: maxSortOrder, hotspotFill };
    } 

    const assignColors = (newData, distances) => {
        const maxDistance = Math.max(...distances);
        const minDistance = Math.min(...distances);
        const colorScale = d3
            .scaleLinear()
            .domain(COLOR_SCALE_DOMAIN) // Input range
            .range(HOTSPOT_COLORS); // Output range

        Object.values(newData.seats).forEach((seat) => {
            const normalizedDistance = (seat.distance - minDistance) / (maxDistance - minDistance);
            const color = colorScale(normalizedDistance);
            seat.hotspotFill = color;
            seat.sortOrder = normalizedDistance;
        })

        // Then based on the sortOrder on seats
        // We apply a sortOrder on rows and sections
        // order of operations matters here
        // for all seats, rows & sections
        let maxSortOrderRows = 10;
        let hsf = null;
        Object.values(newData.rows).forEach((row) => {
            const { sortOrder, hotspotFill } = computeRowSortOrder(row, newData);
            row.sortOrder = sortOrder;
            row.hotspotFill = hotspotFill;
            if (sortOrder > maxSortOrderRows) {
                maxSortOrderRows = sortOrder;
                hsf = hotspotFill;
            }
        })

        console.log("Max Sort Order Rows: ", maxSortOrderRows, hsf);

        let maxSortOrderSections = -10;
        Object.values(newData.sections).forEach((section) => {
            const { sortOrder, hotspotFill } = computeSectionSortOrder(section, newData);
            section.sortOrder = sortOrder;
            section.hotspotFill = hotspotFill;
            if (sortOrder > maxSortOrderSections) {
                maxSortOrderSections = sortOrder;
                hsf = hotspotFill;
            }
        })

        console.log('Max sort order sections: ', maxSortOrderSections, hsf);

        console.log('newData: ', newData);
    }


    const euclideanDistance = (seat, hotspot) => {
        let xDiff = hotspot.x - seat.cx;
        let yDiff = hotspot.y - seat.cy;
        return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
    };

    return (
        <div className={`draggableContainer ${activeMapAction === 4 && 'active'}`} ref={cursorRef}>
            <div onDragStart={() => setDragging(true)} onDrag={moveSPOTonDrag} onDragEnd={handleDragEnd} className={`cursorIcon ${!dragging && 'pulseAnimation'}`}>
                <div className="dragHandle" draggable={true}></div>
            </div>
        </div>
    )
}