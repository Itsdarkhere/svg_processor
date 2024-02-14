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
        const sections = Array.from(svgDoc.querySelectorAll('g[class^="sec-"]')).filter((el) => {
          let as = el.className as unknown as SVGAnimatedString;
          return /\bsec-\d+\b(?!\-)/.test(as.baseVal);
        });
    
        let uniqueRowNumber = 0;
        const sectionData: { [key: string]: SectionData } = {};
        const rowData: { [key: string]: RowData } = {};
        const seatData: { [key: string]: SeatData } = {};
    
        sections.forEach((section) => {
          let combinedData = undefined;
          const sectionInfo = parseSection(section);
          if (sectionInfo.isZoomable) {
            if (sectionInfo.rows.length > 0) {
              const rowsData = parseRows(sectionInfo);
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
            sectionRowsArray = Object.values(sectionInfo.rows).map(element => element.getAttribute('class')!);
          }
    
          sectionData[sectionInfo.sectionNumber!] = generateSectionData(sectionInfo, sectionRowsArray);
        });
      
        return { sections: sectionData, rows: rowData, seats: seatData };
    }
    
    const parseSection = (section: Element) => {
        const sectionNumber = section.getAttribute('class')?.split(' ')[0].split('-')[1];
        const zoomable = section.getAttribute('class')?.split(' ')[1];
    
        const identifierGroup = section.querySelector(`g[class^="identifier"]`);
        const paths = identifierGroup?.querySelectorAll('path');
        let sectionP: SVGPathElement | null = null;
        let identifier: SVGPathElement | null = null;

        if (paths) {
          paths.forEach(path => {
            if (path.classList.contains('overlay')) {
              sectionP = path;
            } else {
              identifier = path;
            }
          });
        } else {
          console.error('No identifier paths found in section');
        }

        // Force non-null
        sectionP = sectionP!;
        identifier = identifier!;

        const fill = sectionP?.getAttribute('fill');
        const stroke = sectionP?.getAttribute('stroke');
        const strokeWidth = sectionP?.getAttribute('stroke-width');
        const sectionPath = sectionP?.getAttribute('d') || null;
        // Identifier is like the text above a section
        const identifierTextPath = identifier?.getAttribute('d') || null;
        const identifierTextFill = identifier?.getAttribute('fill') || null;
        const identifierTextOpacity = identifier?.getAttribute('fill-opacity') || null;
    
        // Check if section is zoomable, if yes then we need seats etc, otherwise we dont
        // In that case we add ticket directly to section
        let isZoomable = false;
        if (zoomable === 'YZ') {
          isZoomable = true;
        }
    
        const rows = section.querySelectorAll(`g[class^="sec-${sectionNumber}-row-"]`);
        // If no rows find seats directly
        let seats = undefined;
        if (rows.length === 0) {
          seats = section.querySelectorAll(`rect[class^="sec-${sectionNumber}-seat-"]`);
        }
    
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
    
    
    const parseRows = (sectionInfo: any) => {
        const rowData: { [key: string]: RowData } = {};
        const seatData: { [key: string]: SeatData } = {};
      
        sectionInfo.rows.forEach((row: any) => {
          const rowId = `${row.getAttribute('class')}`;
          const seatsData = parseSeats(row, sectionInfo, row.getAttribute('class'));
          rowData[rowId] = { rowId, sectionId: sectionInfo.sectionNumber!, seats: seatsData.seatIds, path: undefined };
          Object.assign(seatData, seatsData.seatData);
        });
      
        return { rowData, seatData };
    };
    
    const parseSeatsWithVirtualRowData = (uniqueRowNumber: number, seats: any, sectionInfo: any) => {
        const seatData: { [key: string]: SeatData } = {};
        const rowId = uniqueRowNumber.toString();

        seats.forEach((seat: any) => {
            let classname = seat.getAttribute('class');
            if (classname) {
                classname = classname.replace(/(sec-\d+)-/, `$1-row-${rowId}-`);
                const seatInfo = parseSeat(seat);
                seatData[classname] = { 
                    cx: seatInfo.cx, 
                    cy: seatInfo.cy, 
                    w: seatInfo.w, 
                    h: seatInfo.h, 
                    selected: false, 
                    seatId: classname, 
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
            path: undefined // No specific path for the virtual row
        };
    
        return { seatData, virtualRowData };
    };
    
    const parseSeats = (row: Element, sectionInfo: any, rowId: number) => {
      const rowNumber = row.getAttribute('class')?.split('-')[3];
      const seats = row.querySelectorAll(`rect[class^="sec-${sectionInfo.sectionNumber}-row-${rowNumber}-seat-"]`);
      
      const seatData: { [key: string]: SeatData } = {};
      const seatIds: string[] = [];
    
      seats.forEach((seat) => {
        const classname = seat.getAttribute('class');
        if (classname) {
          const seatInfo = parseSeat(seat);
          seatData[classname] = { cx: seatInfo.cx, cy: seatInfo.cy, w: seatInfo.w, h: seatInfo.h, selected: false, seatId: classname, sectionId: sectionInfo.sectionNumber!, rowId: rowId.toString() };
          seatIds.push(classname);
        }
      });
    
      return { seatData, seatIds };
    };
    
    const generateSectionData = (sectionInfo: any, rows: string[]) => {
      return {
        sectionId: sectionInfo.sectionNumber,
        path: sectionInfo.sectionPath,
        rows: rows,
        zoomable: sectionInfo.isZoomable,
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
        </div>
    )
}