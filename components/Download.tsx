import { Data } from "@/app/page";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

export default function Download({ result, images, filename }: { result: Data, images: any, filename: string }) {

    const downloadAll = async () => {
        const zip = new JSZip();
        const imgFolder = zip.folder("images")!;

        // Add all images to the zip in the 'images' folder
        await Promise.all(images.map((image: any, index: number) => 
            fetch(image)
                .then((response) => response.blob())
                .then((blob) => {
                    imgFolder.file(`image-${index + 1}.png`, blob);
                })
        ));

        // Add JSON file to the zip
        zip.file(`${filename}.json`, JSON.stringify(result));

        // Generate zip file and download
        zip.generateAsync({ type: "blob" }).then((content) => {
            saveAs(content, `${filename}-assets.zip`);
        });
    };

    return (
        <div className="max-w-5xl flex flex-col gap-8 justify-center items-center">
            <button onClick={downloadAll} className="btn btn-active btn-secondary">Download assets</button>
        </div>
    )
}