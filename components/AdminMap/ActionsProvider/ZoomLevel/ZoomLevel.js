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
        <div className='flex flex-row absolute right-10 bottom-10 justify-center items-center p-3 rounded-lg bg-white'>
            <button className=' text-black h-10 w-10 bg-white' onClick={() => zoomOut()}>-</button>
            <div className='text-black'>{scaleCalculation()}%</div>
            <button className=' text-black h-10 w-10 bg-white' onClick={() => zoomIn()}>+</button>
        </div>
    )
}