'use client'
import './zoomLevel.scss'
export default function ZoomLevel({ zoomRef, scale }) {
    const zoomIn = () => {
        zoomRef.current.zoomIn(0.5, 200, 'easeOut');
    }

    const zoomOut = () => {
        zoomRef.current.zoomOut(0.5, 200, 'easeOut');
    }

    const scaleCalculation = () => {
        return parseInt((scale - 1) * 11);
    }

    return (
        <div className='zoomContainer'>
            <button className='zoomButton' onClick={() => zoomOut()}>-</button>
            <div>{scaleCalculation()}%</div>
            <button className='zoomButton' onClick={() => zoomIn()}>+</button>
        </div>
    )
}