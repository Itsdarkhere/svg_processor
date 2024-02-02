import { useCallback } from "react";
const d3 = require("d3-scale");

export default function DraggableSpot({ data, setData, svgRef, dragging, setDragging, activeMapAction, cursorRef, mapRef }) {

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
        const distances = computeDistances(newData, hotspot);
        assignColors(newData, distances);

        return newData;
    }

    const computeDistances = (data, hotspot) => {
        return Object.values(data.seats).map((seat) => {
            const distance = euclideanDistance(seat, hotspot);
            seat.distance = distance;

            return distance;
        })
    }

    const assignColors = (data, distances) => {
        const maxDistance = Math.max(...distances);
        const minDistance = Math.min(...distances);
        const colorScale = d3
            .scaleLinear()
            .domain(COLOR_SCALE_DOMAIN) // Input range
            .range(HOTSPOT_COLORS); // Output range

        Object.values(data.seats).forEach((seat) => {
            const normalizedDistance = (seat.distance - minDistance) / (maxDistance - minDistance);
            const seatColor = colorScale(normalizedDistance);

            seat.hotspotFill = seatColor;
            seat.sortOrder = normalizedDistance;
        })
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