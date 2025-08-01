'use client'
import { ActionsProvider } from './ActionsProvider2/ActionsProvider';
import { SeatMap } from './SeatMap2'

export default function MapFilter({ 
    data, 
    setData, 
    background
}) {
    return (
        <div className='w-full h-full'>
            <ActionsProvider>
                <SeatMap
                    data={data}
                    setData={setData}
                    background={background}
                />
            </ActionsProvider>
        </div>
    )
}