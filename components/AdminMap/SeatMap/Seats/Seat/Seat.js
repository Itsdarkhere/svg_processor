import React from 'react'

export default function Seat({ selectSeat, seat, fill, activeMapAction }) {
    return (
        <rect id={seat.seatId} className='seat' x={seat.cx} y={seat.cy}
            rx={20} ry={20}
            width={seat.w} height={seat.h} filter={seat?.filter}
            onClick={() => selectSeat(seat.seatId)}
            style={{ ...(fill && { fill: fill }), ...([1, 2, 4].includes(activeMapAction) && { pointerEvents: 'none' }) }}
        ></rect>
    )
}