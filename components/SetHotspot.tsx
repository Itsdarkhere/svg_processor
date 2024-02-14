'use client'
import { Data } from "@/app/page";
import { Dispatch, SetStateAction, useState } from "react";
import { ActionsProvider } from "./HotspotMap/ActionsProvider/ActionsProvider";
import SeatMap from "./HotspotMap/SeatMap/SeatMap";


export default function SetHotspot(
    { result, setResult, setHotspotSet }: 
    { result: Data, setResult: Dispatch<SetStateAction<Data>>, setHotspotSet: Dispatch<SetStateAction<boolean>>}) {
    const activeTab = "scaling" // inventory
    const [activeSpot, setActiveSpot] = useState("seats");

    return (
        <div className='max-w-5xl w-full flex flex-col justify-center text-center gap-6'>
            <h3 className="text-xl uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">PLACE THE HOTSPOT ON THE STAGE</h3>
            <div className="flex flex-row items-center gap-3 justify-center w-full">
                <button onClick={() => setActiveSpot("seats")} className={`${activeSpot === 'seats' ? 'bg-indigo-700 text-white' : 'text-zinc-950 bg-white'} active:scale-95 rounded-lg px-5 py-2`}>Seats</button>
                <button onClick={() => setActiveSpot("rows")} className={`${activeSpot === 'rows' ? 'bg-indigo-700 text-white' : 'text-zinc-950 bg-white'} active:scale-95 rounded-lg px-5 py-2`}>Rows</button>
                <button onClick={() => setActiveSpot("sections")} className={`${activeSpot === 'sections' ? 'bg-indigo-700 text-white' : 'text-zinc-950 bg-white'} active:scale-95 rounded-lg px-5 py-2`}>Sections</button>
            </div>
            <ActionsProvider
                data={result}
                setData={setResult}
                setHotspotSet={setHotspotSet}
            >
                <SeatMap
                    data={result}
                    setData={setResult}
                    activeTab={activeTab}
                    activeSpot={activeSpot}
                />
            </ActionsProvider>
        </div>
    )
}