'use client'
import { Data } from '@/app/page'
import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { ActionsProvider } from './ScreenshotMap/ActionsProvider3/ActionsProvider'
import SeatMap from './ScreenshotMap/SeatMap3/SeatMap'
import * as htmlToImage from 'html-to-image';

export default function Screenshot(
    { result, images, setImages, imagesTaken, setImagesTaken }: 
    { result: Data, images: any, setImages: Dispatch<SetStateAction<any>>, imagesTaken: boolean, setImagesTaken: Dispatch<SetStateAction<boolean>>}
    ) {
    const activeTab = "scaling" // inventory
    const [selectedIds, setSelectedIds] = useState({ section: "", row: "" });

    const captureImage = () => {
        htmlToImage.toPng(document.getElementById('mappp')!)
        .then(function (dataUrl: any) {
            setImages((prevImages: any) => [...prevImages, dataUrl]);
        });
    };

    useEffect(() => {
        if (!result?.sections || Object.keys(result.sections).length === 0) return;

        console.log('res sec: ', result.sections);
        let currentSectionIndex = 0;
        let currentRowIndex = 0;
        let maxSectionIndex = Object.keys(result.sections).length - 1;
        let interval = setInterval(() => {
            const currentSectionIndexIsMax = currentSectionIndex === maxSectionIndex;
            const newSectionTarget = Object.values(result.sections)[currentSectionIndex];
            const maxRowIndex = Object.keys(newSectionTarget.rows).length - 1;
            const currentRowIndexIsMax = currentRowIndex === maxRowIndex;
            const newTargetRow = newSectionTarget.rows[currentRowIndex];
    
            setSelectedIds({ section: newSectionTarget.sectionId!, row: newTargetRow });
    
            console.log('newRow: ', newTargetRow);
    
            if (currentSectionIndexIsMax && currentRowIndexIsMax) {
                clearInterval(interval);
                setTimeout(() => setImagesTaken(true), 500);
            } else if (currentRowIndexIsMax) {
                currentSectionIndex++;
                currentRowIndex = 0;
            } else {
                currentRowIndex++;
            }
        }, 2200);

        return () => clearInterval(interval);
    }, [result, setImagesTaken]);

    useEffect(() => {
        if (selectedIds.section !== "") {
            setTimeout(captureImage, 500); // Delay to ensure UI update reflects in screenshot
        }
    }, [selectedIds, result.sections]);
    
    return (
        <div className='max-w-5xl flex flex-col gap-8 justify-center items-center'>
            <ActionsProvider>
                <SeatMap
                    data={result}
                    activeTab={activeTab}
                    selectedIds={selectedIds}
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