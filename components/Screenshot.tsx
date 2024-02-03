'use client'
import { Data } from '@/app/page'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ActionsProvider } from './ScreenshotMap/ActionsProvider3/ActionsProvider'
import SeatMap from './ScreenshotMap/SeatMap3/SeatMap'
import * as htmlToImage from 'html-to-image';
import { toPng, toJpeg, toBlob, toPixelData, toSvg } from 'html-to-image';

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

        const maxIndex = Object.keys(result.sections).length -1;
        const interval = setInterval(() => {
            setSelectedIndex((prevIndex: number) => {
                if (prevIndex >= maxIndex) {
                    clearInterval(interval);
                    return prevIndex;
                } else {
                    return prevIndex + 1;
                }
            });
        }, 2000)

        return () => clearInterval(interval);
    }, [result])

    useEffect(() => {
        if (!result?.sections || Object.keys(result.sections).length === 0) return;
        const maxIndex = Object.keys(result.sections).length -1;

        if (selectedIndex > -1 && selectedIndex <= maxIndex) {
            setTimeout(() => {
                captureImage();
                if (selectedIndex === maxIndex) {
                    setImagesTaken(true);
                }
            }, 200);
        }
    }, [selectedIndex])
    
    return (
        <div className='max-w-5xl flex flex-col gap-8 justify-center items-center'>
            {!imagesTaken && <progress className="progress progress-primary w-56"></progress>}
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