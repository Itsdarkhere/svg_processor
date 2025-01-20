"use client";
import { Data, RowData, SeatData, SectionData } from "@/app/page";
import { Dispatch, SetStateAction, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ParsedData {
  sections: { [key: string]: SectionData };
  rows: { [key: string]: RowData };
  seats: { [key: string]: SeatData };
}

export default function Parser({
  setUploaded,
  setResult,
  setFileName,
}: {
  setUploaded: Dispatch<SetStateAction<boolean>>;
  setResult: Dispatch<SetStateAction<Data>>;
  setFileName: Dispatch<SetStateAction<string>>;
}) {
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      const svgString = e.target?.result as string;
      const parsedData = parseSVG(svgString);
      const processedData = processRowAreas(parsedData);

      setResult(processedData);
      setFileName(file.name.replace(".svg", ""));
      setUploaded(true);
    };
    reader.readAsText(file);
  };

  interface UUIDArrays {
    [key: string]: string[];
  }

  const generateUUIDs = () => {
    const uuidArrays: UUIDArrays = {};
    
    // Generate 10 arrays
    for (let i: number = 1; i <= 10; i++) {
        const uuidArray: string[] = Array.from(
            { length: 200 }, 
            (): string => uuidv4()
        );
        uuidArrays[`array${i}`] = uuidArray;
    }
    
    // Format and log in a way that's easy to copy
    const jsonString = JSON.stringify(uuidArrays, null, 2);
    console.log('Copy the following JSON:');
    console.log(jsonString);
    
    // Also log a JavaScript object literal format for direct copying
    console.log('\nOr copy as JavaScript object:');
    console.log(`const uuidArrays = ${jsonString};`);
  };

  return (
    <div className='max-w-5xl flex flex-col justify-center items-center'>
      <button
        onClick={generateUUIDs}
        className=' p-6 bg-white rounded-md text-black active:scale-95 outline-red-400'
      >
        GENERATE UUIDS
      </button>
      <input
        type='file'
        name='svgFile'
        id='svgFile'
        accept='.svg'
        onChange={handleFileUpload}
        className='file-input w-full max-w-xs'
      />
    </div>
  );
}

const parseSVG = (svgString: string): ParsedData => {
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgString, "image/svg+xml");

  const sections = getSections(svgDoc);
  console.log("parseSVG sections: ", sections)
  const { sectionData, rowData, seatData } = parseSections(sections);

  return {
    sections: sectionData,
    rows: rowData,
    seats: seatData,
  };
};

const getSections = (svgDoc: Document): Element[] => {
  return Array.from(svgDoc.querySelectorAll('g[class^="sec-"]')).filter(
    (el) => {
      const className = (el.className as unknown as SVGAnimatedString).baseVal;
      return /^sec-[^-]+$/.test(className);
    }
  );
};

const parseSections = (sections: Element[]) => {
  console.log("parseSections: ", sections);
  let uniqueRowNumber = 0;
  const sectionData: { [key: string]: SectionData } = {};
  const rowData: { [key: string]: RowData } = {};
  const seatData: { [key: string]: SeatData } = {};

  sections.forEach((section, sectionIndex) => {
    const sectionId = uuidv4();
    const sectionInfo = extractSectionInfo(section, sectionId);
    const { newRowData, newSeatData, sectionRows } = processSectionContent(
      section,
      sectionInfo,
      uniqueRowNumber
    );

    Object.assign(rowData, newRowData);
    Object.assign(seatData, newSeatData);

    sectionData[sectionId] = generateSectionMetadata(sectionInfo, sectionRows);

    if (!sectionInfo.hasRows) uniqueRowNumber++;
  });

  return { sectionData, rowData, seatData };
};

const extractSectionInfo = (section: Element, sectionId: string) => {
  const className = section.getAttribute("class") || "";
  const [sectionClass, zoomableClass] = className.split(" ");
  const [_, sectionNumber] = sectionClass.split("-");
  const isZoomable = zoomableClass === "YZ";

  const identifierGroup = section.querySelector('g[class^="identifier"]');
  const [sectionPath, identifierPath] = Array.from(
    identifierGroup?.querySelectorAll("path") || []
  );

  // Generate a section name (can be customized based on your needs)
  const sectionName = `Section ${sectionNumber}`;
  return {
    id: sectionId,
    sectionNumber,
    sectionName,
    isZoomable,
    fill: sectionPath?.getAttribute("fill"),
    stroke: sectionPath?.getAttribute("stroke"),
    strokeWidth: sectionPath?.getAttribute("stroke-width"),
    path: sectionPath?.getAttribute("d"),
    identifier: {
      path: identifierPath?.getAttribute("d"),
      fill: identifierPath?.getAttribute("fill"),
      opacity: identifierPath?.getAttribute("fill-opacity"),
    },
    hasRows:
      section.querySelectorAll(`g[class^="sec-${sectionNumber}-row-"]`).length >
      0,
  };
};

const generateSectionMetadata = (
  sectionInfo: any,
  rows: string[]
): SectionData => {
  return {
    sectionId: sectionInfo.id,
    sectionNumber: sectionInfo.sectionNumber,
    sectionName: sectionInfo.sectionName,
    path: sectionInfo.path,
    rows: rows,
    zoomable: sectionInfo.isZoomable,
    fill: sectionInfo.fill,
    stroke: sectionInfo.stroke,
    strokeWidth: sectionInfo.strokeWidth,
    identifier: {
      path: sectionInfo.identifier.path,
      fill: sectionInfo.identifier.fill,
      opacity: sectionInfo.identifier.opacity,
    },
    screenshot: null,
  };
};

const parseRows = (rows: NodeListOf<Element>, sectionInfo: any) => {
  const rowData: { [key: string]: RowData } = {};
  const seatData: { [key: string]: SeatData } = {};

  rows.forEach((row, rowIndex) => {
    const rowId = uuidv4();
    const rowNumber = rowIndex + 1;

    // Get all seats for this row
    const seats = row.querySelectorAll(
      `rect[class^="sec-${sectionInfo.sectionNumber}-row-"]`
    );
    console.log("seats: ", seats);

    const seatIds: string[] = [];

    seats.forEach((seat, seatIndex) => {
      const seatId = uuidv4();
      const metrics = extractSeatMetrics(seat);

      seatData[seatId] = {
        seatId: seatId,
        sectionId: sectionInfo.id,
        rowId: rowId,
        sectionNumber: sectionInfo.sectionNumber,
        rowNumber: rowNumber.toString(),
        seatNumber: (seatIndex + 1).toString(),
        selected: false,
        ...metrics,
      };

      seatIds.push(seatId);
    });

    rowData[rowId] = {
      rowId: rowId,
      sectionId: sectionInfo.id,
      sectionNumber: sectionInfo.sectionNumber,
      rowNumber: rowNumber.toString(),
      seats: seatIds,
      path: undefined,
      screenshot: null,
    };
  });

  return { rowData, seatData };
};

const createVirtualRow = (
  seats: NodeListOf<Element>,
  uniqueRowNumber: number,
  sectionInfo: any
) => {
  const seatData: { [key: string]: SeatData } = {};
  const rowId = uuidv4();

  const seatIds = Array.from(seats).map((seat, index) => {
    const seatId = uuidv4();
    const metrics = extractSeatMetrics(seat);

    seatData[seatId] = {
      sectionId: sectionInfo.id,
      rowId: rowId,
      seatId: seatId,
      sectionNumber: sectionInfo.sectionNumber,
      rowNumber: uniqueRowNumber.toString(),
      seatNumber: (index + 1).toString(),
      selected: false,
      ...metrics,
    };

    return seatId;
  });

  const virtualRowData: RowData = {
    rowId: rowId,
    sectionId: sectionInfo.id,
    sectionNumber: sectionInfo.sectionNumber,
    rowNumber: uniqueRowNumber.toString(),
    seats: seatIds,
    path: undefined,
    screenshot: null,
  };

  return { virtualRowData, seatData };
};

// Rest of the utility functions remain the same
const extractSeatMetrics = (seat: Element) => ({
  cx: parseFloat(seat.getAttribute("x") || "0"),
  cy: parseFloat(seat.getAttribute("y") || "0"),
  w: parseFloat(seat.getAttribute("width") || "0"),
  h: parseFloat(seat.getAttribute("height") || "0"),
});

const processRowAreas = (data: ParsedData): ParsedData => {
  const updatedData = { ...data };

  Object.values(updatedData.rows).forEach((row) => {
    const seatMetrics = row.seats.map((seatId) => ({
      ...updatedData.seats[seatId],
      maxX: updatedData.seats[seatId].cx + updatedData.seats[seatId].w,
      maxY: updatedData.seats[seatId].cy + updatedData.seats[seatId].h,
    }));

    const bounds = calculateRowBounds(seatMetrics);
    row.path = generateRowPath(bounds);
  });

  return updatedData;
};

const calculateRowBounds = (seatMetrics: any[]) => {
  const maxWidth = Math.max(...seatMetrics.map((seat) => seat.w));
  const maxHeight = Math.max(...seatMetrics.map((seat) => seat.h));

  return {
    minX: Math.min(...seatMetrics.map((seat) => seat.cx)) - maxWidth / 2,
    minY: Math.min(...seatMetrics.map((seat) => seat.cy)) - maxHeight / 2,
    maxX: Math.max(...seatMetrics.map((seat) => seat.maxX)) + maxWidth / 2,
    maxY: Math.max(...seatMetrics.map((seat) => seat.maxY)) + maxHeight / 2,
  };
};

const generateRowPath = (bounds: any) => {
  return `M ${bounds.minX} ${bounds.minY} L ${bounds.maxX} ${bounds.minY} L ${bounds.maxX} ${bounds.maxY} L ${bounds.minX} ${bounds.maxY} Z`;
};

const processSectionContent = (
  section: Element,
  sectionInfo: any,
  uniqueRowNumber: number
) => {
  if (!sectionInfo.isZoomable) {
    return { newRowData: {}, newSeatData: {}, sectionRows: [] };
  }
  console.log("sectionInfo: ", sectionInfo);
  console.log("section: ", section);
  console.log("Full section content:", section.innerHTML);

  const rows = section.querySelectorAll(
    `g[class^="sec-${sectionInfo.sectionNumber}-row-"]`
  );

  console.log("rows: ", rows);
  if (rows.length > 0) {
    const { rowData, seatData } = parseRows(rows, sectionInfo);
    return {
      newRowData: rowData,
      newSeatData: seatData,
      sectionRows: Object.keys(rowData),
    };
  }

  const seats = section.querySelectorAll(
    `rect[class^="sec-${sectionInfo.sectionNumber}-seat-"]`
  );
  console.log("seats: ", seats);
  const { virtualRowData, seatData } = createVirtualRow(
    seats,
    uniqueRowNumber,
    sectionInfo
  );

  return {
    newRowData: { [virtualRowData.rowId]: virtualRowData },
    newSeatData: seatData,
    sectionRows: [virtualRowData.rowId],
  };
};
