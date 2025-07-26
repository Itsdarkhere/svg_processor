'use client'
import { Data } from '@/app/page'
import { useState } from 'react'
import { ActionsProvider } from './AdminMap/ActionsProvider/ActionsProvider'
import SeatMap from './AdminMap/SeatMap/SeatMap'
export default function InspectAdminMap({ result, background }: { result: Data, background: any }) {
    const activeTab = "scaling" // inventory
    const [data, setData] = useState(() => JSON.parse(JSON.stringify(result))); // Copy to avoid modifying the original data
    return (
        <div className='max-w-5xl w-full'>
            <ActionsProvider
                    data={data}
                    setData={setData}
                    activeTab={activeTab}
                >
                <SeatMap
                    data={data}
                    setData={setData}
                    activeTab={activeTab}
                    background={background}
                />
            </ActionsProvider>
        </div>
    )
}