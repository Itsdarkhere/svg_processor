'use client'
import { ActionsProvider } from './ActionsProvider/ActionsProvider';
import { SeatMap } from './SeatMap'

export default function MapFilter({ 
    data, 
    setData, 
}) {
    return (
        <div className='w-full h-full'>
            <ActionsProvider>
                <SeatMap
                    data={data}
                    setData={setData}
                />
            </ActionsProvider>
        </div>
    )
}