import { Data } from "@/app/page";
import { Dispatch, SetStateAction } from "react";
import { ActionsProvider } from "./HotspotMap/ActionsProvider/ActionsProvider";
import SeatMap from "./HotspotMap/SeatMap/SeatMap";


export default function SetHotspot(
    { result, setResult, setHotspotSet }: 
    { result: Data, setResult: Dispatch<SetStateAction<Data>>, setHotspotSet: Dispatch<SetStateAction<boolean>>}) {
    const activeTab = "scaling" // inventory

    return (
        <div className='max-w-5xl w-full flex flex-col justify-center text-center gap-6'>
            <h3 className="text-xl uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">PLACE THE HOTSPOT ON THE STAGE</h3>
            <ActionsProvider
                    data={result}
                    setData={setResult}
                    setHotspotSet={setHotspotSet}
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