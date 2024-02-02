'use client'
import { Data } from '@/app/page'
import { Dispatch, SetStateAction } from 'react'
import { ActionsProvider } from './AdminMap/ActionsProvider/ActionsProvider'
import SeatMap from './AdminMap/SeatMap/SeatMap'
export default function InspectAdminMap({ result, setResult }: { result: Data, setResult: Dispatch<SetStateAction<Data>>}) {
    const activeTab = "scaling" // inventory
    return (
        <div className='max-w-5xl w-full'>
            <ActionsProvider
                    data={result}
                    setData={setResult}
                    activeTab={activeTab}
                >
                <SeatMap
                    data={result}
                    setData={setResult}
                    activeTab={activeTab}
                />
            </ActionsProvider>
        </div>
    )
}