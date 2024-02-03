import React, { Fragment, useRef } from 'react'

export default function Seat({ seat, fill }) {

    const seatRef = useRef(null);

    return (
        <Fragment>
            <rect ref={seatRef} id={seat.seatId} className='seat' x={seat.cx} y={seat.cy}
                rx={20} ry={20}
                width={seat.w} height={seat.h} filter={seat?.filter}
                style={{ ...(fill && { fill: fill }) }}
            ></rect>
        </Fragment>
    )
}