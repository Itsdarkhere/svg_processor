import { Data } from '@/app/page'
import MapFilter from './FrontendMap/MapFilter'
import { Dispatch, SetStateAction } from 'react'
export default function InspectFrontendMap({ result, setResult }: { result: Data, setResult: Dispatch<SetStateAction<Data>>}) {

    return (
        <div className="max-w-5xl w-full h-full flex flex-col justify-center items-center">
            <MapFilter data={result} setData={setResult} />
        </div>
    )
}