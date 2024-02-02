import { Seat } from "./Seat";

export default function Seats({ 
    data, 
    activeTab,
    activeMapAction,  
}) {

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
                            fill='transparent'
                        />
                    )}
                </g>
            ))}
        </g>
    )
}