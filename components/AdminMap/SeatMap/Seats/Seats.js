import { Seat } from "./Seat";

export default function Seats({ 
    data, 
    setData,
    activeTab,
    shouldSelectSeat,
    activeMapAction,  
}) {

    const handleRowAction = (rowId, filter) => {
        if (activeMapAction !== 2) return;

        let updatedData = { ...data };
        applyFilterToRow(rowId, filter, updatedData.rows, updatedData.seats);

        setData(updatedData);
    };

    const selectSeat = (id) => {
        if (data.seats[id]) {
            setData((prev) => {
                let updatedSeats = { ...prev.seats };
                updatedSeats[id] = { ...updatedSeats[id], selected: !updatedSeats[id].selected };
                return { ...prev, seats: updatedSeats };
            });
        }
    };

    const applyFilterToRow = (rowId, filter, rows, seats) => {
        const targetRow = rows[rowId];
        if (!targetRow) return;

        let assignedTarget = targetRow.allAssigned;
        if (activeTab === 'inventory') {
            assignedTarget = targetRow.inventoryAllAssigned
        }

        targetRow.seats.forEach(seatId => {
            const seat = seats[seatId];
            if (seat && shouldSelectSeat(seat, assignedTarget)) {
                seat.filter = filter;
            }
        });
    };

    // If hostspot show hotspot fill, otherwise show selected color or based on active tab
    const getFillType = (seat) => {
        if (activeMapAction === 4 && activeTab === 'scaling') {
            return seat?.hotspotFill;
        }
        if (seat.selected) return 'blue';
        if (activeTab === 'scaling') {
            return "#e6e8ec";
        }
        // #3ea9f7
        return "white";
    }

    const handleRowSelect = (rowId) => {
        if (activeMapAction !== 2) return;

        let updatedData = { ...data };
        let selectedSeatIds = getSeatIdsForRow(rowId, updatedData.rows, updatedData.seats);

        setData(updatedData);
    }

    const getSeatIdsForRow = (rowId, rows, seats) => {
        const targetRow = rows[rowId];
        if (!targetRow) return []; // Return empty array if the row is not found

        let assignedTarget = targetRow.allAssigned;
        if (activeTab === 'inventory') {
            assignedTarget = targetRow.inventoryAllAssigned;
        }

        return targetRow.seats
            .filter(seatId => {
                if (!seats[seatId]) return false;
                if (shouldSelectSeat(seats[seatId], assignedTarget)) {
                    seats[seatId].selected = true;
                    return true;
                }
                return false;
            });
    };

    return (
        <g className='seats'>
            {data?.rows && Object.values(data.rows).map((row) => (
                <g key={row.rowId}>
                    {row.seats.map((seatId) => {
                        const seat = data.seats[seatId];
                        return (
                            <Seat
                                key={seat.seatId}
                                seat={seat}
                                selectSeat={selectSeat}
                                fill={getFillType(seat)}
                                activeMapAction={activeMapAction}
                            />
                        )
                    })}
                    {/* This is for selecting by row */}
                    {row?.path && (
                        <path
                            d={row.path}
                            style={{ pointerEvents: activeMapAction === 2 ? "all" : "none", }}
                            onClick={() => handleRowSelect(row.rowId)}
                            onMouseOver={() => handleRowAction(row.rowId, 'brightness(0.8)')}
                            onMouseOut={() => handleRowAction(row.rowId, undefined)}
                            fill='transparent'
                        />
                    )}
                </g>
            ))}
        </g>
    )
}