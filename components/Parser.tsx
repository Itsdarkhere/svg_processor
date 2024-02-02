'use client'
import { Data, RowData, SeatData, SectionData } from "@/app/page";
import { Dispatch, SetStateAction, useState } from "react"

export default function Parser(
    { setUploaded, setResult, setFileName }: 
    { setUploaded: Dispatch<SetStateAction<boolean>>, setResult: Dispatch<SetStateAction<Data>>, setFileName: Dispatch<SetStateAction<string>>    
}) {    
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files ? event.target.files[0] : null;
        if (file) {
          const reader = new FileReader();
          reader.readAsText(file);
          reader.onload = (e: ProgressEvent<FileReader>) => {
            console.log("onload");
            const svgString = e.target?.result as string;
            const parsedData = parseSVG(svgString);
            setRowArea(parsedData);
    
            // Get the file name without the ".svg" extension
            const fileName = file.name;
            const svgNameWithoutExtension = fileName.slice(0, fileName.lastIndexOf('.svg'));
            setFileName(svgNameWithoutExtension);
            setUploaded(true);
          }
        }
    }
    
    const parseSVG = (svgString: string) => {
        const parser = new DOMParser();
        const svgDoc = parser.parseFromString(svgString, 'image/svg+xml');
        const sections = svgDoc.querySelectorAll('g[id^="Sec-"]');
    
        let uniqueRowNumber = 0;
        const sectionData: { [key: string]: SectionData } = {};
        const rowData: { [key: string]: RowData } = {};
        const seatData: { [key: string]: SeatData } = {};
    
        sections.forEach((section) => {
          let combinedData = undefined;
          const sectionInfo = parseSection(section);
          if (sectionInfo.isZoomable) {
            if (sectionInfo.rows.length > 0) {
              const rowsData = parseRows(sectionInfo, uniqueRowNumber);
              uniqueRowNumber += rowsData.newUniqueRowNumber;
              // Assign
              Object.assign(rowData, rowsData.rowData);
              Object.assign(seatData, rowsData.seatData);
            } else {
              uniqueRowNumber++;
              // If no rows are found, look for direct seats
              combinedData = parseSeatsWithVirtualRowData(uniqueRowNumber, sectionInfo.seats, sectionInfo);
              // Assign
              Object.assign(seatData, combinedData.seatData);
              rowData[combinedData.virtualRowData.rowId] = combinedData.virtualRowData;
            }
          }
    
          let sectionRowsArray = [];
    
          if (combinedData?.virtualRowData?.rowId) {
            sectionRowsArray.push(combinedData.virtualRowData.rowId);
          } else {
            sectionRowsArray = Object.keys(sectionInfo.rows);
          }
    
          sectionData[sectionInfo.sectionNumber!] = generateSectionData(sectionInfo, sectionRowsArray);
        });
      
        return { sections: sectionData, rows: rowData, seats: seatData };
    }
    
    const parseSection = (section: Element) => {
        const sectionNumber = section.getAttribute('id')?.split('-')[1];
        const zoomable = section.getAttribute('class');
    
        const sectionP = section.querySelector('path');
        const fill = sectionP?.getAttribute('fill');
        const stroke = sectionP?.getAttribute('stroke');
        const strokeWidth = sectionP?.getAttribute('stroke-width');
    
        // Check if section is zoomable, if yes then we need seats etc, otherwise we dont
        // In that case we add ticket directly to section
        let isZoomable = false;
        let sectionTicket = null;
        if (zoomable === 'YZ') {
          isZoomable = true;
        } else {
          // sectionTicket = createTicket(sectionNumber!, `Section ${sectionNumber}`);
        }
    
        const sectionPath = section.querySelector('path')?.getAttribute('d') || null;
        const rows = section.querySelectorAll(`g[id^="sec-${sectionNumber}-row-"]`);
        // If no rows find seats directly
        let seats = undefined;
        if (rows.length === 0) {
          seats = section.querySelectorAll(`rect[id^="sec-${sectionNumber}-seat-"]`);
        }
    
        // Identifier is like the text above a section
        const identifier = section.querySelector(`g[id^="identifier"]`);
        const identifierText = identifier?.querySelector('path');
        const identifierTextPath = identifierText?.getAttribute('d') || null;
        const identifierTextFill = identifierText?.getAttribute('fill') || null;
        const identifierTextOpacity = identifierText?.getAttribute('fill-opacity') || null;
    
        return {
          sectionNumber,
          zoomable,
          fill,
          stroke,
          strokeWidth,
          isZoomable,
          sectionPath,
          rows,
          seats,
          // ticket: sectionTicket,
          identifierTextPath,
          identifierTextFill,
          identifierTextOpacity,
        }
    }

    const parseSeat = (seat: Element) => {
        const cx = parseFloat(seat.getAttribute('x') || '0');
        const cy = parseFloat(seat.getAttribute('y') || '0');
        const w = parseFloat(seat.getAttribute('width') || '0');
        const h = parseFloat(seat.getAttribute('height') || '0');
    
        return {
          cx,
          cy,
          w,
          h,
        }
    }
    
    
    const parseRows = (sectionInfo: any, uniqueRowNumber: number) => {
        const sectionRows: string[] = [];
        const rowData: { [key: string]: RowData } = {};
        const seatData: { [key: string]: SeatData } = {};
      
        sectionInfo.rows.forEach((row: any) => {
          uniqueRowNumber++;
          const rowId = `${uniqueRowNumber}`;
          sectionRows.push(rowId);
          const seatsData = parseSeats(row, sectionInfo, uniqueRowNumber);
          // const ticket = createTicket(rowId, `Section ${sectionInfo.sectionNumber} Row ${rowId}`);
          rowData[rowId] = { rowId, sectionId: sectionInfo.sectionNumber!, seats: seatsData.seatIds, path: undefined };
          Object.assign(seatData, seatsData.seatData);
        });
      
        return { rowData, seatData, newUniqueRowNumber: uniqueRowNumber };
    };
    
    const parseSeatsWithVirtualRowData = (uniqueRowNumber: number,seats: any, sectionInfo: any) => {
        const seatData: { [key: string]: SeatData } = {};
        const rowId = uniqueRowNumber.toString();

        seats.forEach((seat: any) => {
            let id = seat.getAttribute('id');
            if (id) {
                id = id.replace(/(sec-\d+)-/, `$1-row-${rowId}-`);
                const seatInfo = parseSeat(seat);
                seatData[id] = { 
                    cx: seatInfo.cx, 
                    cy: seatInfo.cy, 
                    w: seatInfo.w, 
                    h: seatInfo.h, 
                    selected: false, 
                    seatId: id, 
                    sectionId: sectionInfo.sectionNumber!,
                    rowId: rowId  // Assigning the rowId
                };
            }
        });
    
        // const ticket = createTicket(rowId, `Section ${sectionInfo.sectionNumber} Row ${rowId}`);
        const virtualRowData = {
            rowId,
            sectionId: sectionInfo.sectionNumber!,
            seats: Object.keys(seatData),
            // ticket,
            path: undefined // No specific path for the virtual row
        };
    
        return { seatData, virtualRowData };
    };
    
    const parseSeats = (row: Element, sectionInfo: any, uniqueRowNumber: number) => {
      const rowNumber = row.getAttribute('id')?.split('-')[3];
      const seats = row.querySelectorAll(`rect[id^="sec-${sectionInfo.sectionNumber}-row-${rowNumber}-seat-"]`);
      
      const seatData: { [key: string]: SeatData } = {};
      const seatIds: string[] = [];
    
      seats.forEach((seat) => {
        const id = seat.getAttribute('id');
        if (id) {
          const seatInfo = parseSeat(seat);
          seatData[id] = { cx: seatInfo.cx, cy: seatInfo.cy, w: seatInfo.w, h: seatInfo.h, selected: false, seatId: id, sectionId: sectionInfo.sectionNumber!, rowId: uniqueRowNumber.toString()! };
          seatIds.push(id);
        }
      });
    
      return { seatData, seatIds };
    };
    
    const generateSectionData = (sectionInfo: any, rows: string[]) => {
      console.log("GENERATESECTIONDATA")
      return {
        sectionId: sectionInfo.sectionNumber,
        path: sectionInfo.sectionPath,
        rows: rows,
        zoomable: sectionInfo.isZoomable,
        // ticket: sectionInfo.ticket,
        fill: sectionInfo.fill,
        stroke: sectionInfo.stroke,
        strokeWidth: sectionInfo.strokeWidth,
        identifier: {
          path: sectionInfo.identifierTextPath,
          fill: sectionInfo.identifierTextFill,
          opacity: sectionInfo.identifierTextOpacity,
        }
      };
    };
    
    const setRowArea = (data: Data) => {
      let updatedData = { ...data };

      Object.values(updatedData.rows).forEach((row) => {
          let minX = Infinity;
          let minY = Infinity;
          let maxX = -Infinity;
          let maxY = -Infinity;

          row.seats.forEach((seatId: string) => {
              let seat = updatedData.seats[seatId];
              minX = Math.min(minX, seat.cx);
              minY = Math.min(minY, seat.cy);
              maxX = Math.max(maxX, seat.cx + seat.w);
              maxY = Math.max(maxY, seat.cy + seat.h);
          });

          const widthBuffer = Math.max(...row.seats.map(id => updatedData.seats[id].w));
          const heightBuffer = Math.max(...row.seats.map(id => updatedData.seats[id].h));

          minX -= widthBuffer / 2;
          maxX += widthBuffer / 2;
          minY -= heightBuffer / 2;
          maxY += heightBuffer / 2;

          let pathData = `M ${minX} ${minY} L ${maxX} ${minY} L ${maxX} ${maxY} L ${minX} ${maxY} Z`;

          // Store the path in the row
          row.path = pathData;
      });

      setResult(updatedData);
    };

    return (
        <div className=" max-w-5xl flex flex-col justify-center items-center">
            <input
                type="file"
                name="svgFile"
                id="svgFile"
                accept=".svg"
                onChange={handleChange}
                className="file-input w-full max-w-xs"
            />
            
            {/* {Object.keys(result.sections).length > 0 && <button className=" bg-blue-500 w-max rounded-lg px-5 py-3 text-white mt-6" onClick={downloadJSON}>Download result</button>}*/}
        </div>
    )
}