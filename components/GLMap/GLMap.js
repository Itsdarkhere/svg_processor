'use client'
import { Stage, Layer, Rect, Path } from 'react-konva';
import './glMap.scss'
export default function GLMap({
    data,
    background
}) {
    console.log(data);
    const desiredWidth = 608; // The width you want to fit your content into
    const desiredHeight = 708; // The height you want to fit your content into
    const originalWidth = 3000; // Original content width
    const originalHeight = 2250; // Original content height

    // Calculate scale factors
    const scaleX = desiredWidth / originalWidth;
    const scaleY = desiredHeight / originalHeight;

    // Optionally, you can center or position the content as needed
    // This example centers the content
    const offsetX = (originalWidth - desiredWidth / scaleX) / 2;
    const offsetY = (originalHeight - desiredHeight / scaleY) / 2;

    const clickSeat = (seat) => {
        console.log('clicked seat', seat);
    }

    return (
        <Stage 
            className='stage'
            width={desiredWidth} 
            height={desiredHeight}
            scaleX={scaleX}
            scaleY={scaleY}
            offsetX={-offsetX}
            offsetY={-offsetY}
        >
            <Layer>
                {data && Object.values(data.seats).map((seat, i) => (
                    <Rect
                        onClick={() => clickSeat(seat)}
                        cornerRadius={20}
                        key={i}
                        x={seat.cx}
                        y={seat.cy}
                        width={seat.w}
                        height={seat.h}
                        fill="red"
                    />
                ))}

                {data && Object.values(data.sections).map((section,i) => (
                    <Path
                        key={i}
                        data={section.path}
                        stroke={section.stroke}
                        strokeWidth={Math.floor(section.strokeWidth)}
                        fill={section.fill}
                        draggable
                    />
                ))}
            </Layer>
        </Stage>
    )
}