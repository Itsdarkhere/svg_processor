'use client'
import { Data } from '@/app/page'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ActionsProvider } from './ScreenshotMap/ActionsProvider3/ActionsProvider'
import SeatMap from './ScreenshotMap/SeatMap3/SeatMap'
import * as htmlToImage from 'html-to-image';

export default function Screenshot({ result, images, setImages, imagesTaken, setImagesTaken }: { result: Data, images: any, setImages: Dispatch<SetStateAction<any>>, imagesTaken: boolean, setImagesTaken: Dispatch<SetStateAction<boolean>>}) {
    const activeTab = "scaling" // inventory
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const captureImage = () => {
        htmlToImage.toPng(document.getElementById('mappp')!)
        .then(function (dataUrl: any) {
            setImages((prevImages: any) => [...prevImages, dataUrl]);
        });
    };

    useEffect(() => {
        if (!result?.sections || Object.keys(result.sections).length === 0) return;

        let maxIndex = Object.keys(result.sections).length - 1;
        let interval = setInterval(() => {
            setSelectedIndex((prevIndex) => {
                let newIndex = prevIndex < maxIndex ? prevIndex + 1 : prevIndex;
                if (newIndex === maxIndex) {
                    clearInterval(interval);
                    setTimeout(() => setImagesTaken(true), 500); // Set imagesTaken true after last screenshot
                }
                return newIndex;
            });
        }, 2200); // Increase interval to give more time for re-render

        return () => clearInterval(interval);
    }, [result, setImagesTaken]);

    useEffect(() => {
        if (selectedIndex > -1 && selectedIndex < Object.keys(result.sections).length) {
            setTimeout(captureImage, 500); // Delay to ensure UI update reflects in screenshot
        }
    }, [selectedIndex, result.sections]);
    
    return (
        <div className='max-w-5xl flex flex-col gap-8 justify-center items-center'>
            {/* {!imagesTaken && <progress className="progress progress-primary w-56"></progress>} */}
            <ActionsProvider>
                <SeatMap
                    data={result}
                    activeTab={activeTab}
                    selectedIndex={selectedIndex}
                />
            </ActionsProvider>
            <div className='flex flex-row flex-wrap gap-4 justify-center'>
                {images && images.map((image: any, index: number) => {
                    return (
                        <img key={index} height={200} width={300} src={image} alt={`Screenshot ${index + 1}`} />
                    )
                })}
            </div>
        </div>
    )
}