"use client";
import { Data } from "@/app/page";
import JSZip from "jszip";
import { saveAs } from "file-saver";
import { Dispatch, SetStateAction, useEffect, useRef, useState } from "react";

export default function Download({
  result,
  setResult,
  images,
  filename,
  elementSSMapping,
}: {
  result: Data;
  setResult: Dispatch<SetStateAction<Data>>;
  images: any;
  filename: string;
  elementSSMapping: any[];
}) {
  const resultRef = useRef(null);
  const [triggerDownload, setTriggerDownload] = useState(false);

  const removeBS = () => {
    const propertiesToRemove = [
      "hotspotFill",
      "screenshot",
      "allAssigned",
      "selected",
      "floorfill",
      "selected",
      "distance"
    ];
    let newResults = JSON.parse(JSON.stringify(result)); // Deep clone to avoid mutations

    // Clean sections
    if (newResults.sections) {
      Object.values(newResults.sections).forEach((section: any) => {
        propertiesToRemove.forEach((prop) => {
          delete section[prop];
        });
      });
    }

    // Clean rows
    if (newResults.rows) {
      Object.values(newResults.rows).forEach((row: any) => {
        propertiesToRemove.forEach((prop) => {
          delete row[prop];
        });
      });
    }

    // Clean seats
    if (newResults.seats) {
      Object.values(newResults.seats).forEach((seat: any) => {
        // Remove common properties
        propertiesToRemove.forEach((prop) => {
          delete seat[prop];
        });
        // Remove sortOrder specifically from seats
        delete seat.sortOrder;
      });
    }

    setResult(newResults);
    resultRef.current = newResults;
    setTriggerDownload(true);
  };

  const downloadAll = async () => {
    const zip = new JSZip();
    const imgFolder = zip.folder("images")!;

    // Add all images to the zip in the 'images' folder
    await Promise.all(
      images.map((imageobj: any, index: number) =>
        fetch(imageobj.url)
          .then((response) => response.blob())
          .then((blob) => {
            imgFolder.file(`${imageobj.id}.png`, blob);
          })
      )
    );

    // Add JSON file to the zip
    zip.file(`${filename}.json`, JSON.stringify(resultRef.current));

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
  }, [triggerDownload]);

  return (
    <div className='max-w-5xl flex flex-col gap-8 justify-center items-center'>
      <button onClick={removeBS} className='btn btn-active btn-secondary'>
        Download assets
      </button>
    </div>
  );
}
