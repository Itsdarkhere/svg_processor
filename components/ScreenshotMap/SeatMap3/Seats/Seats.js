import { Seat } from "./Seat";

export default function Seats({ 
    data, 
    activeTab,
}) {

    // If hostspot show hotspot fill, otherwise show selected color or based on active tab
    const getFillType = (seat) => {
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
                            />
                        )
                    })}
                    {/* This is for selecting by row */}
                    {row?.path && (
                        <path
                            d={row.path}
                            fill='transparent'
                        />
                    )}
                </g>
            ))}
        </g>
    )
}