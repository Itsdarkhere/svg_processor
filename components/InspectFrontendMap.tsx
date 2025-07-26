'use client'
import { Data } from '@/app/page'
import MapFilter from './FrontendMap/MapFilter'
import { useState } from 'react'
export default function InspectFrontendMap({ result, background }: { result: Data, background: any}) {
    const [data, setData] = useState(() => JSON.parse(JSON.stringify(result))); // Copy to avoid modifying the original data
    return (
        <div className="max-w-5xl w-full h-full flex flex-col justify-center items-center">
            <MapFilter data={data} setData={setData} background={background} />
        </div>
    )
}