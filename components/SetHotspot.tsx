'use client'
import { Data } from "@/app/page";
import { Dispatch, SetStateAction, useState } from "react";
import { ActionsProvider } from "./HotspotMap/ActionsProvider/ActionsProvider";
import SeatMap from "./HotspotMap/SeatMap/SeatMap";


export default function SetHotspot(
    { result, setResult, setHotspotSet }: 
    { result: Data, setResult: Dispatch<SetStateAction<Data>>, setHotspotSet: Dispatch<SetStateAction<boolean>>}) {
    const activeTab = "scaling" // inventory
    const [floorsize, setFloorsize] = useState<number | null>(null);

    const handleSubmit = (e: any) => {
        e.preventDefault();
        // Access the input field value correctly
        const floorSizeInput = e.target.elements.floorSizeInput.value;
        // Prevent floats by using parseInt
        setFloorsize(parseInt(floorSizeInput, 10));
    }

    return (
        <div className='max-w-5xl w-full flex flex-col justify-center text-center gap-6'>
            {floorsize ? 
                <div className="w-full flex flex-col justify-center text-center gap-6">
                    {/* <h3 className="text-xl uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">PLACE THE HOTSPOT ON THE STAGE</h3> */}
                    <ActionsProvider
                        data={result}
                        setData={setResult}
                        setHotspotSet={setHotspotSet}
                    >
                        <SeatMap
                            data={result}
                            setData={setResult}
                            activeTab={activeTab}
                            floorsize={floorsize}
                        />
                    </ActionsProvider>
                </div>
                :
                <form onSubmit={handleSubmit}>
                    <h3 className="text-xl uppercase text-zinc-400 text-center font-bold tracking-[0.3em]">How many floors are there?</h3>
                    <input 
                        className="mt-2 w-full max-w-md py-4 rounded-lg text-white px-2" 
                        placeholder="0" 
                        type="number" 
                        step="1" // Prevent floats by allowing only integer steps
                        name="floorSizeInput" // Name the input field for easy access
                    />
                    <button type="submit" className="btn btn-active btn-secondary">Submit</button>
                </form>
            }
        </div>
    )
}