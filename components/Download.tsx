'use client'
import { Data } from "@/app/page";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { Dispatch, SetStateAction, useEffect, useState } from "react";

export default function Download({ result, setResult, images, filename, elementSSMapping }: { result: Data, setResult: Dispatch<SetStateAction<Data>>, images: any, filename: string, elementSSMapping: any[] }) {
    const [triggerDownload, setTriggerDownload] = useState(false);
    
    const includeImages = () => {
        console.log(elementSSMapping);
        let newResults = { ...result };
        Object.values(elementSSMapping).forEach((element: any) => {
            if (element.section) {
                console.log("uuid: ", element.screenshot);
                newResults.sections[element.id].screenshot = element.screenshot + '.png';
            } else {
                console.log("uuid: ", element.screenshot);
                newResults.rows[element.id].screenshot = element.screenshot + '.png';
            }
        })

        setResult(newResults);
        setTriggerDownload(true);
    }

    const downloadAll = async () => {
        const zip = new JSZip();
        const imgFolder = zip.folder("images")!;

        // Add all images to the zip in the 'images' folder
        await Promise.all(images.map((imageobj: any, index: number) => 
            fetch(imageobj.url)
                .then((response) => response.blob())
                .then((blob) => {
                    imgFolder.file(`${imageobj.id}.png`, blob);
                })
        ));

        // Add JSON file to the zip
        zip.file(`${filename}.json`, JSON.stringify(result));

        // Generate zip file and download
        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, `${filename}-assets.zip`);
        });
    };

    useEffect(() => {
        if (triggerDownload) {
            downloadAll();
            setTriggerDownload(false);
        }
    }, [triggerDownload])

    return (
        <div className="max-w-5xl flex flex-col gap-8 justify-center items-center">
            <button onClick={includeImages} className="btn btn-active btn-secondary">Download assets</button>
        </div>
    )
}