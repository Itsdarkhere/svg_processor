'use client'
import { Data } from '@/app/page'
import { Dispatch, SetStateAction } from 'react'
import { ActionsProvider } from './ScreenshotMap/ActionsProvider3/ActionsProvider'
import SeatMap from './ScreenshotMap/SeatMap3/SeatMap'
export default function Screenshot({ result, setResult }: { result: Data, setResult: Dispatch<SetStateAction<Data>>}) {
    const activeTab = "scaling" // inventory
    return (
        <div className='max-w-5xl flex justify-center items-center'>
            <ActionsProvider>
                <SeatMap
                    data={result}
                    activeTab={activeTab}
                />
            </ActionsProvider>
        </div>
    )
}